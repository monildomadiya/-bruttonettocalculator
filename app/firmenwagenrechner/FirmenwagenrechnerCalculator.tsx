"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Car, Calculator, ArrowRight, Info, ChevronDown, Gauge } from "lucide-react";
import { calculateNetto } from "@/lib/taxCalculator";

type Fahrzeugtyp = "verbrenner" | "hybrid" | "elektro";
type Anschaffung = "ab2025-07" | "2024" | "2020";
type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;

/*
 * § 6 Abs. 1 Nr. 4 Satz 2 EStG: Bemessungsgrundlage ist der Bruttolistenpreis,
 * bei Elektrofahrzeugen nur ein Viertel (bis zur Preisgrenze), sonst und bei
 * Plug-in-Hybriden, die die Voraussetzungen erfüllen, die Hälfte. Preisgrenze für
 * das Viertel nach Anschaffungsdatum: 60.000 € (2020–2023), 70.000 €
 * (1.1.2024–30.6.2025), 100.000 € (ab 1.7.2025, Investitionssofortprogramm,
 * BGBl. 2025 I Nr. 161). Die geminderte Grundlage wird auf volle 100 € abgerundet.
 */
const FAHRZEUG: Record<Fahrzeugtyp, string> = {
  verbrenner: "Verbrenner / Hybrid ohne Voraussetzungen (1 %)",
  hybrid: "Plug-in-Hybrid (≤ 50 g CO₂/km oder ≥ 80 km elektrisch, 0,5 %)",
  elektro: "Reines Elektroauto (0,25 % bzw. 0,5 %)",
};
const PREISGRENZE_E: Record<Anschaffung, { grenze: number; label: string }> = {
  "ab2025-07": { grenze: 100000, label: "ab 1. Juli 2025" },
  "2024": { grenze: 70000, label: "1. Januar 2024 bis 30. Juni 2025" },
  "2020": { grenze: 60000, label: "2020 bis 2023" },
};

function bemessung(listenpreis: number, typ: Fahrzeugtyp, anschaffung: Anschaffung) {
  let faktor = 1;
  if (typ === "hybrid") faktor = 0.5;
  if (typ === "elektro") faktor = listenpreis <= PREISGRENZE_E[anschaffung].grenze ? 0.25 : 0.5;
  return { faktor, basis: Math.floor((Math.max(0, listenpreis) * faktor) / 100) * 100 };
}

const STEUERKLASSE_INFO: Record<Steuerklasse, string> = {
  1: "Klasse I — Ledig",
  2: "Klasse II — Alleinerziehend",
  3: "Klasse III — Verheiratet (höheres Einkommen)",
  4: "Klasse IV — Verheiratet (gleiches Einkommen)",
  5: "Klasse V — Verheiratet (geringeres Einkommen)",
  6: "Klasse VI — Zweiter Job",
};

function formatEuro(value: number): string {
  return value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

const faqs = [
  {
    q: "Wie funktioniert die 1%-Regelung beim Firmenwagen?",
    a: "Bei der 1%-Regelung wird monatlich 1 % des Bruttolistenpreises (inkl. Sonderausstattung und MwSt.) des Firmenwagens als geldwerter Vorteil zu Ihrem Bruttogehalt hinzugerechnet. Nutzen Sie den Wagen auch für den Arbeitsweg, kommt ein Zuschlag von 0,03 % des Listenpreises je Entfernungskilometer hinzu.",
  },
  {
    q: "Wie hoch ist die 1%-Regelung bei Elektroautos?",
    a: "Für reine Elektroautos, die ab dem 1. Juli 2025 angeschafft wurden, gilt bis 100.000 € Bruttolistenpreis ein Satz von 0,25 % im Monat (für Anschaffungen 2024 bis Juni 2025: bis 70.000 €). Teurere E-Autos und Plug-in-Hybride mit höchstens 50 g CO₂/km oder mindestens 80 km elektrischer Reichweite werden mit 0,5 % versteuert. Der Zuschlag für den Arbeitsweg sinkt entsprechend auf 0,0075 % bzw. 0,015 % je Kilometer.",
  },
  {
    q: "Lohnt sich die Fahrtenbuch-Methode statt der 1%-Regelung?",
    a: "Bei einem Fahrtenbuch werden die tatsächlichen Kosten des Fahrzeugs anteilig nach privater und dienstlicher Nutzung versteuert. Das lohnt sich meist bei geringer Privatnutzung oder einem hohen Anschaffungspreis mit niedrigen laufenden Kosten. Bei überwiegender Privatnutzung ist die 1%-Regelung in der Regel günstiger, da kein Fahrtenbuch geführt werden muss.",
  },
  {
    q: "Erhöht der Firmenwagen mein zu versteuerndes Einkommen?",
    a: "Ja. Der geldwerte Vorteil aus der Firmenwagen-Nutzung wird wie zusätzliches Bruttogehalt behandelt und unterliegt sowohl der Lohnsteuer als auch — je nach Fall — den Sozialversicherungsbeiträgen.",
  },
];

export default function FirmenwagenrechnerCalculator({ content }: { content?: React.ReactNode }) {
  const [brutto, setBrutto] = useState(4000);
  const [listenpreis, setListenpreis] = useState(45000);
  const [entfernung, setEntfernung] = useState(15);
  const [fahrzeugtyp, setFahrzeugtyp] = useState<Fahrzeugtyp>("verbrenner");
  const [anschaffung, setAnschaffung] = useState<Anschaffung>("ab2025-07");
  const [zuzahlung, setZuzahlung] = useState(0);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);

  const result = useMemo(() => {
    const { faktor, basis } = bemessung(listenpreis, fahrzeugtyp, anschaffung);
    const geldwerterVorteilPrivat = basis * 0.01;
    const geldwerterVorteilPendler = basis * 0.0003 * Math.max(0, entfernung);
    // Zuzahlungen des Arbeitnehmers mindern den geldwerten Vorteil, höchstens auf 0 (R 8.1 Abs. 9 Nr. 4 LStR).
    const geldwerterVorteilGesamt = Math.max(0, geldwerterVorteilPrivat + geldwerterVorteilPendler - Math.max(0, zuzahlung));
    const satzPrivatPct = faktor * 1;

    const ohneAuto = calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      verheiratet: steuerklasse === 3 || steuerklasse === 4 || steuerklasse === 5,
      kinderlosUeber23: false,
      kirche,
      steuerklasse,
    });

    const mitAuto = calculateNetto({
      bruttoMonat: brutto + geldwerterVorteilGesamt,
      jahr: 2026,
      verheiratet: steuerklasse === 3 || steuerklasse === 4 || steuerklasse === 5,
      kinderlosUeber23: false,
      kirche,
      steuerklasse,
    });

    return {
      satzPrivatPct,
      basis,
      geldwerterVorteilPrivat,
      geldwerterVorteilPendler,
      geldwerterVorteilGesamt,
      nettoOhneAuto: ohneAuto.nettoMonat,
      nettoMitAuto: mitAuto.nettoMonat,
    };
  }, [brutto, listenpreis, entfernung, fahrzeugtyp, anschaffung, zuzahlung, steuerklasse, kirche]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <Car size={14} />
            1%-Regelung · Aktuell 2026
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Brutto Netto Rechner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              mit Firmenwagen
            </span>
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Unser Firmenwagenrechner 2026 berechnet den geldwerten Vorteil Ihres Dienstwagens nach der 1%-Regelung und
            zeigt sofort Ihr Nettogehalt mit und ohne Firmenwagen.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="max-w-6xl mx-auto px-5 pt-2 pb-12 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" />
              Ihre Angaben
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Bruttogehalt (ohne Auto) / Monat</label>
                <input
                  type="number"
                  value={brutto}
                  onChange={(e) => setBrutto(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Bruttolistenpreis des Fahrzeugs</label>
                <input
                  type="number"
                  value={listenpreis}
                  onChange={(e) => setListenpreis(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Fahrzeugtyp</label>
                <select
                  value={fahrzeugtyp}
                  onChange={(e) => setFahrzeugtyp(e.target.value as Fahrzeugtyp)}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none"
                >
                  {(Object.keys(FAHRZEUG) as Fahrzeugtyp[]).map((k) => (
                    <option key={k} value={k}>{FAHRZEUG[k]}</option>
                  ))}
                </select>
              </div>

              {fahrzeugtyp === "elektro" && (
                <div>
                  <label className="block text-sm font-semibold text-black/70 mb-2">Anschaffung des E-Autos</label>
                  <select
                    value={anschaffung}
                    onChange={(e) => setAnschaffung(e.target.value as Anschaffung)}
                    className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none"
                  >
                    {(Object.keys(PREISGRENZE_E) as Anschaffung[]).map((k) => (
                      <option key={k} value={k}>
                        {PREISGRENZE_E[k].label} (0,25 % bis {PREISGRENZE_E[k].grenze.toLocaleString("de-DE")} €)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Ihre Zuzahlung pro Monat (optional)</label>
                <input
                  type="number"
                  min={0}
                  value={zuzahlung}
                  onChange={(e) => setZuzahlung(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">
                  Entfernung Wohnung–Arbeitsstätte (einfache Strecke, km)
                </label>
                <input
                  type="number"
                  value={entfernung}
                  onChange={(e) => setEntfernung(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-black/70 mb-2">Steuerklasse</label>
                  <select
                    value={steuerklasse}
                    onChange={(e) => setSteuerklasse(Number(e.target.value) as Steuerklasse)}
                    className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none"
                  >
                    {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => (
                      <option key={sk} value={sk}>{STEUERKLASSE_INFO[sk]}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                    <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                    Kirchensteuer
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Gauge size={22} className="text-[#E60A1C]" />
              Geldwerter Vorteil &amp; Netto
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Vereinfachte Berechnung — keine Steuerberatung
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">
                  Privatnutzung ({result.satzPrivatPct.toLocaleString("de-DE")} % von {formatEuro(listenpreis)})
                </span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEuro(result.geldwerterVorteilPrivat)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Zuschlag Arbeitsweg ({entfernung} km × 0,03 % der Bemessungsgrundlage)</span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEuro(result.geldwerterVorteilPendler)}</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">
                  Geldwerter Vorteil gesamt / Monat{zuzahlung > 0 ? " (nach Zuzahlung)" : ""}
                </span>
                <span className="text-xl font-extrabold text-[#16181D]">{formatEuro(result.geldwerterVorteilGesamt)}</span>
              </div>

              <div className="h-px bg-black/[0.05] my-2" />

              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Netto ohne Firmenwagen</span>
                <span className="text-lg font-extrabold text-black/80">{formatEuro(result.nettoOhneAuto)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Netto mit Firmenwagen</span>
                <span className="text-lg font-extrabold text-emerald-600">{formatEuro(result.nettoMitAuto)}</span>
              </div>
            </div>

            <Link
              href="/rechner/brutto-zu-netto"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              Vollständigen Brutto-Netto-Rechner öffnen
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Server-rendered SEO content (worked example, Listenpreis vs Kaufpreis, employer view) */}
      {content}

      {/* Explainer / SEO content */}
      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">
            Firmenwagen versteuern: 1%-Regelung &amp; geldwerter Vorteil
          </h2>
          <p>
            Dürfen Sie Ihren <strong className="text-[#16181D]">Firmenwagen</strong> auch privat nutzen, ist das
            ein <strong className="text-[#16181D]">geldwerter Vorteil</strong>, der wie zusätzliches Gehalt
            versteuert wird. Bei der <strong className="text-[#16181D]">1%-Regelung</strong> wird monatlich{" "}
            <strong className="text-[#16181D]">1 % des Bruttolistenpreises</strong> (inkl. Sonderausstattung und
            MwSt.) zu Ihrem Bruttogehalt addiert — darauf fallen dann Lohnsteuer und Sozialabgaben an.
          </p>
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-5">
            <p className="text-black/60 text-sm mb-2">
              <strong className="text-[#16181D]">Arbeitsweg-Zuschlag:</strong> Nutzen Sie den Wagen für den Weg
              zur Arbeit, kommen zusätzlich <strong className="text-[#16181D]">0,03 % des Listenpreises je
              Entfernungskilometer</strong> pro Monat hinzu.
            </p>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Elektroauto: der große Steuervorteil</h3>
          <p>
            Für vollelektrische Firmenwagen gilt eine stark reduzierte Versteuerung: nur{" "}
            <strong className="text-[#16181D]">0,25 %</strong> des Listenpreises bei E-Autos bis 100.000 € (Anschaffung ab
            1. Juli 2025; davor 70.000 €), und <strong className="text-[#16181D]">0,5 %</strong> bei teureren E-Autos oder
            Plug-in-Hybriden mit höchstens 50 g CO₂/km oder mindestens 80 km elektrischer Reichweite — statt der vollen 1 %. Ein E-Firmenwagen kann Ihr Nettogehalt daher deutlich weniger belasten als ein
            Verbrenner.
          </p>
          <p>
            <strong className="text-[#16181D]">Alternative Fahrtenbuch:</strong> Bei geringer Privatnutzung oder
            hohem Anschaffungspreis kann die Fahrtenbuch-Methode günstiger sein, da nur die tatsächliche
            private Nutzung versteuert wird. Der Rechner zeigt Ihnen die Belastung nach der 1%-Regelung, damit
            Sie beide Varianten vergleichen können. Alle Sätze, Rechenbeispiele und die Voraussetzungen für das Fahrtenbuch
            erklärt der Ratgeber{" "}
            <Link href="/blog/geldwerter-vorteil-firmenwagen" className="text-[#E60A1C] font-semibold hover:underline">
              Geldwerter Vorteil beim Firmenwagen
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section data-section="" className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">
          Häufige Fragen zum Firmenwagenrechner
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 pt-1 text-black/65 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#E60A1C]/20 via-[#E60A1C]/10 to-transparent border border-[#E60A1C]/30 rounded-3xl p-8 sm:p-12 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#E60A1C]/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-3">
              Weitere Gehaltsrechner entdecken
            </h2>
            <p className="text-black/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">
              Rentenrechner, Arbeitslosengeld-Rechner, Mindestlohn 2026 &amp; Pfändungstabelle —
              alle kostenlos und aktuell für 2026.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/rentenrechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Rentenrechner
              </Link>
              <Link href="/arbeitslosengeld-rechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Arbeitslosengeld-Rechner
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
                <Calculator size={16} />
                Brutto-Netto-Rechner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
