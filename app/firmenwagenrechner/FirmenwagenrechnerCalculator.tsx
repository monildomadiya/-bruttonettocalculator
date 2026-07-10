"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Car, Calculator, ArrowRight, Info, ChevronDown, Gauge } from "lucide-react";
import { calculateNetto } from "@/lib/taxCalculator";

type Fahrzeugtyp = "verbrenner" | "elektroKlein" | "elektroGross";
type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;

const SATZ: Record<Fahrzeugtyp, { privat: number; pendler: number; label: string }> = {
  verbrenner:   { privat: 0.01,   pendler: 0.0003,   label: "Verbrenner / Hybrid" },
  elektroKlein: { privat: 0.0025, pendler: 0.000075, label: "Elektro ≤ 70.000 € Listenpreis" },
  elektroGross: { privat: 0.005,  pendler: 0.00015,  label: "Elektro/Hybrid > 70.000 € Listenpreis" },
};

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
    a: "Für vollelektrische Fahrzeuge mit einem Bruttolistenpreis bis 70.000 € gilt eine reduzierte Versteuerung von nur 0,25 % monatlich. Liegt der Listenpreis darüber (oder handelt es sich um bestimmte Hybridfahrzeuge), sind es 0,5 % statt der vollen 1 %.",
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

export default function FirmenwagenrechnerCalculator() {
  const [brutto, setBrutto] = useState(4000);
  const [listenpreis, setListenpreis] = useState(45000);
  const [entfernung, setEntfernung] = useState(15);
  const [fahrzeugtyp, setFahrzeugtyp] = useState<Fahrzeugtyp>("verbrenner");
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);

  const result = useMemo(() => {
    const satz = SATZ[fahrzeugtyp];
    const geldwerterVorteilPrivat = listenpreis * satz.privat;
    const geldwerterVorteilPendler = listenpreis * satz.pendler * entfernung;
    const geldwerterVorteilGesamt = geldwerterVorteilPrivat + geldwerterVorteilPendler;

    const ohneAuto = calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      verheiratet: steuerklasse === 3 || steuerklasse === 5,
      kinderlosUeber23: false,
      kirche,
      steuerklasse,
    });

    const mitAuto = calculateNetto({
      bruttoMonat: brutto + geldwerterVorteilGesamt,
      jahr: 2026,
      verheiratet: steuerklasse === 3 || steuerklasse === 5,
      kinderlosUeber23: false,
      kirche,
      steuerklasse,
    });

    return {
      geldwerterVorteilPrivat,
      geldwerterVorteilPendler,
      geldwerterVorteilGesamt,
      nettoOhneAuto: ohneAuto.nettoMonat,
      nettoMitAuto: mitAuto.nettoMonat,
    };
  }, [brutto, listenpreis, entfernung, fahrzeugtyp, steuerklasse, kirche]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Car size={14} />
            1%-Regelung · Aktuell 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Firmenwagenrechner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              (1%-Regelung)
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie den geldwerten Vorteil Ihres Dienstwagens und sehen Sie sofort, wie viel
            von Ihrem Nettogehalt durch die Firmenwagen-Versteuerung übrig bleibt.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" />
              Ihre Angaben
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Bruttogehalt (ohne Auto) / Monat</label>
                <input
                  type="number"
                  value={brutto}
                  onChange={(e) => setBrutto(Number(e.target.value))}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-white font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Bruttolistenpreis des Fahrzeugs</label>
                <input
                  type="number"
                  value={listenpreis}
                  onChange={(e) => setListenpreis(Number(e.target.value))}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-white font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Fahrzeugtyp</label>
                <select
                  value={fahrzeugtyp}
                  onChange={(e) => setFahrzeugtyp(e.target.value as Fahrzeugtyp)}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-white font-semibold focus:border-[#E60A1C] outline-none"
                >
                  {(Object.keys(SATZ) as Fahrzeugtyp[]).map((k) => (
                    <option key={k} value={k}>{SATZ[k].label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">
                  Entfernung Wohnung–Arbeitsstätte (einfache Strecke, km)
                </label>
                <input
                  type="number"
                  value={entfernung}
                  onChange={(e) => setEntfernung(Number(e.target.value))}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-white font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2">Steuerklasse</label>
                  <select
                    value={steuerklasse}
                    onChange={(e) => setSteuerklasse(Number(e.target.value) as Steuerklasse)}
                    className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-white font-semibold focus:border-[#E60A1C] outline-none"
                  >
                    {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => (
                      <option key={sk} value={sk}>{STEUERKLASSE_INFO[sk]}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-white/70 cursor-pointer">
                    <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                    Kirchensteuer
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 flex items-center gap-2">
              <Gauge size={22} className="text-[#E60A1C]" />
              Geldwerter Vorteil &amp; Netto
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-400/80 bg-amber-950/20 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Vereinfachte Berechnung — keine Steuerberatung
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                <span className="text-white/70 text-sm font-medium">Geldwerter Vorteil (privat)</span>
                <span className="text-lg font-extrabold text-white">{formatEuro(result.geldwerterVorteilPrivat)}</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                <span className="text-white/70 text-sm font-medium">Zuschlag Arbeitsweg (0,03 %-Regel)</span>
                <span className="text-lg font-extrabold text-white">{formatEuro(result.geldwerterVorteilPendler)}</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-4">
                <span className="text-white/80 text-sm font-semibold">Geldwerter Vorteil gesamt / Monat</span>
                <span className="text-xl font-extrabold text-white">{formatEuro(result.geldwerterVorteilGesamt)}</span>
              </div>

              <div className="h-px bg-white/10 my-2" />

              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                <span className="text-white/70 text-sm font-medium">Netto ohne Firmenwagen</span>
                <span className="text-lg font-extrabold text-white/80">{formatEuro(result.nettoOhneAuto)}</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                <span className="text-white/70 text-sm font-medium">Netto mit Firmenwagen</span>
                <span className="text-lg font-extrabold text-emerald-400">{formatEuro(result.nettoMitAuto)}</span>
              </div>
            </div>

            <Link
              href="/rechner/brutto-zu-netto"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(230,10,28,0.35)] hover:shadow-[0_0_30px_rgba(230,10,28,0.55)] text-sm"
            >
              Vollständigen Brutto-Netto-Rechner öffnen
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8">
          Häufige Fragen zum Firmenwagenrechner
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-white/5 transition-colors">
                <span className="font-semibold text-white text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 pt-1 text-white/65 text-sm sm:text-base leading-relaxed border-t border-white/5">
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Weitere Gehaltsrechner entdecken
            </h2>
            <p className="text-white/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">
              Rentenrechner, Arbeitslosengeld-Rechner, Mindestlohn 2026 &amp; Pfändungstabelle —
              alle kostenlos und aktuell für 2026.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/rentenrechner" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Rentenrechner
              </Link>
              <Link href="/arbeitslosengeld-rechner" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Arbeitslosengeld-Rechner
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_25px_rgba(230,10,28,0.4)] text-sm">
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
