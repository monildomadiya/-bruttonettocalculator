"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Banknote, Calculator, ArrowRight, Info, ChevronDown } from "lucide-react";
import { calculateNetto, estFormel2026, soliBerechnen } from "@/lib/taxCalculator";

type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;

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

function estJahrFuerSK(zvE: number, sk: Steuerklasse): number {
  if (sk === 3) return 2 * estFormel2026(Math.max(0, zvE) / 2);
  if (sk === 5) {
    const baseEst = estFormel2026(Math.max(0, zvE));
    return Math.min(baseEst * 1.45, Math.max(0, zvE) * 0.40);
  }
  return estFormel2026(Math.max(0, zvE));
}

const faqs = [
  {
    q: "Wie wird eine Abfindung versteuert?",
    a: "Abfindungen werden nach der sogenannten Fünftelregelung (§ 34 Abs. 1 EStG) versteuert. Dabei wird ein Fünftel der Abfindung fiktiv zum regulären zu versteuernden Einkommen hinzugerechnet, um die Steuerprogression abzumildern. Die Differenz der Einkommensteuer wird anschließend mit 5 multipliziert.",
  },
  {
    q: "Muss ich auf die Abfindung Sozialversicherungsbeiträge zahlen?",
    a: "Nein. Abfindungen sind grundsätzlich sozialversicherungsfrei — es fallen weder Renten-, Kranken-, Pflege- noch Arbeitslosenversicherungsbeiträge an. Es wird ausschließlich Lohn-/Einkommensteuer (zzgl. Soli und ggf. Kirchensteuer) fällig.",
  },
  {
    q: "Lohnt sich die Fünftelregelung immer?",
    a: "Die Fünftelregelung wird vom Finanzamt automatisch angewendet, wenn sie günstiger ist als die reguläre Versteuerung. Sie wirkt sich am stärksten aus, wenn die Abfindung im Verhältnis zum sonstigen Jahreseinkommen hoch ist. Bei bereits sehr hohem Einkommen (Spitzensteuersatz-Bereich) ist der Effekt gering.",
  },
  {
    q: "Kann ich die Steuerlast auf die Abfindung weiter senken?",
    a: "Ja, häufig lohnt sich der Bezug der Abfindung in einem Jahr mit niedrigerem sonstigem Einkommen (z. B. bei Arbeitslosigkeit über den Jahreswechsel) oder die Einzahlung eines Teils in die Basis-/Rürup-Rente als Sonderausgabe.",
  },
];

export default function AbfindungsRechner() {
  const [brutto, setBrutto] = useState(4500);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);
  const [abfindung, setAbfindung] = useState(30000);

  const result = useMemo(() => {
    const regulaer = calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      verheiratet: steuerklasse === 3 || steuerklasse === 5,
      kinderlosUeber23: false,
      kirche,
      steuerklasse,
    });

    const zvEOhne = regulaer.steuer.zvE;
    const zvEMitFuenftel = zvEOhne + abfindung / 5;

    const estOhne = estJahrFuerSK(zvEOhne, steuerklasse);
    const estMitFuenftel = estJahrFuerSK(zvEMitFuenftel, steuerklasse);
    const estAufAbfindung = 5 * (estMitFuenftel - estOhne);
    const estGesamt = estOhne + estAufAbfindung;

    const verheiratet = steuerklasse === 3;
    const soliOhne = soliBerechnen(estOhne, verheiratet);
    const soliGesamt = soliBerechnen(estGesamt, verheiratet);

    const ksSatz = 0.09;
    const ksOhne = kirche ? estOhne * ksSatz : 0;
    const ksGesamt = kirche ? estGesamt * ksSatz : 0;

    const steuerlastOhne = estOhne + soliOhne + ksOhne;
    const steuerlastGesamt = estGesamt + soliGesamt + ksGesamt;
    const steuerAufAbfindungGesamt = steuerlastGesamt - steuerlastOhne;

    const nettoAbfindung = abfindung - steuerAufAbfindungGesamt;
    const effektiverSteuersatz = abfindung > 0 ? (steuerAufAbfindungGesamt / abfindung) * 100 : 0;

    return { nettoAbfindung, steuerAufAbfindungGesamt, effektiverSteuersatz };
  }, [brutto, steuerklasse, kirche, abfindung]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Banknote size={14} />
            Fünftelregelung · § 34 EStG
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Abfindungsrechner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              2026
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie die Steuerlast Ihrer Abfindung nach der Fünftelregelung (§ 34 EStG) —
            sozialversicherungsfrei, nur Lohnsteuer, Soli und ggf. Kirchensteuer.
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
                <label className="block text-sm font-semibold text-white/70 mb-2">Reguläres Bruttogehalt / Monat</label>
                <input
                  type="number"
                  value={brutto}
                  onChange={(e) => setBrutto(Number(e.target.value))}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-white font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Höhe der Abfindung (einmalig)</label>
                <input
                  type="number"
                  value={abfindung}
                  onChange={(e) => setAbfindung(Number(e.target.value))}
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
              <Banknote size={22} className="text-[#E60A1C]" />
              Netto-Abfindung
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-400/80 bg-amber-950/20 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Vereinfachte Berechnung — keine Steuerberatung
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                <span className="text-white/70 text-sm font-medium">Steuerlast auf Abfindung (Fünftelregelung)</span>
                <span className="text-lg font-extrabold text-white">{formatEuro(result.steuerAufAbfindungGesamt)}</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                <span className="text-white/70 text-sm font-medium">Effektiver Steuersatz auf Abfindung</span>
                <span className="text-lg font-extrabold text-white">{result.effektiverSteuersatz.toFixed(1)} %</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-4">
                <span className="text-white/80 text-sm font-semibold">Netto-Abfindung (nach Steuer)</span>
                <span className="text-2xl font-extrabold text-emerald-400">{formatEuro(result.nettoAbfindung)}</span>
              </div>
            </div>

            <Link
              href="/"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(230,10,28,0.35)] hover:shadow-[0_0_30px_rgba(230,10,28,0.55)] text-sm"
            >
              Reguläres Nettogehalt berechnen
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Explainer / SEO content */}
      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 sm:p-10 text-white/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Abfindung versteuern: So funktioniert die Fünftelregelung
          </h2>
          <p>
            Eine <strong className="text-white">Abfindung</strong> bei Kündigung oder Aufhebungsvertrag ist
            voll steuerpflichtig, wird aber steuerlich begünstigt: Über die{" "}
            <strong className="text-white">Fünftelregelung (§ 34 EStG)</strong> soll die Steuerprogression
            abgemildert werden, die sonst durch die geballte Einmalzahlung entstehen würde.
          </p>
          <div className="bg-[#101010] border border-white/10 rounded-2xl p-5">
            <p className="font-mono text-white text-sm mb-2">So rechnet die Fünftelregelung:</p>
            <p className="text-white/60 text-sm">
              Nur <strong className="text-white">ein Fünftel</strong> der Abfindung wird fiktiv zum
              Jahreseinkommen addiert und die Steuer­mehrbelastung berechnet. Diese Differenz wird{" "}
              <strong className="text-white">× 5</strong> genommen — so verteilt sich der Progressionseffekt
              rechnerisch auf fünf Jahre.
            </p>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">Der große Vorteil: keine Sozialabgaben</h3>
          <p>
            Anders als beim Gehalt sind Abfindungen <strong className="text-white">sozialversicherungsfrei</strong> —
            es fallen weder Renten-, Kranken-, Pflege- noch Arbeitslosenversicherungsbeiträge an. Fällig wird
            ausschließlich Lohn-/Einkommensteuer zzgl. Soli und ggf. Kirchensteuer.
          </p>
          <p>
            Die Fünftelregelung wirkt am stärksten, wenn die Abfindung im Verhältnis zum sonstigen
            Jahreseinkommen hoch ist. <strong className="text-white">Steuertipp:</strong> Der Bezug in einem
            Jahr mit niedrigerem Einkommen (etwa bei Arbeitslosigkeit über den Jahreswechsel) oder die
            Einzahlung eines Teils in eine Basis-/Rürup-Rente kann die Steuerlast weiter senken.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8">
          Häufige Fragen zur Abfindung
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
              Bonus-Steuerrechner, Arbeitslosengeld-Rechner, Firmenwagenrechner &amp; mehr —
              alle kostenlos und aktuell für 2026.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/bonus-steuerrechner" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Bonus-Steuerrechner
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
