"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Gift, Calculator, ArrowRight, Info, ChevronDown } from "lucide-react";
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
    q: "Wie wird Weihnachtsgeld oder Urlaubsgeld versteuert?",
    a: "Weihnachtsgeld, Urlaubsgeld und andere Einmalzahlungen zählen steuerlich als „sonstige Bezüge”. Sie werden dem Jahresgehalt hinzugerechnet und nach der Jahreslohnsteuertabelle versteuert — die Steuerlast entspricht der Differenz zwischen der Steuer auf (Jahresgehalt + Bonus) und der Steuer auf das Jahresgehalt allein.",
  },
  {
    q: "Fallen auf Weihnachtsgeld auch Sozialabgaben an?",
    a: "Ja, anders als bei einer Abfindung sind Weihnachts- und Urlaubsgeld normal sozialversicherungspflichtig (Renten-, Kranken-, Pflege- und Arbeitslosenversicherung), sofern die jeweilige Beitragsbemessungsgrenze noch nicht erreicht ist.",
  },
  {
    q: "Warum wirkt sich ein Bonus manchmal stärker auf die Steuer aus als erwartet?",
    a: "Da der Bonus zusätzlich zum regulären Gehalt versteuert wird, greift er in einen höheren Bereich der Steuerprogression — der Grenzsteuersatz auf den Bonus liegt daher oft über dem Durchschnittssteuersatz des regulären Gehalts.",
  },
];

export default function BonusSteuerrechner() {
  const [brutto, setBrutto] = useState(4000);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);
  const [bonus, setBonus] = useState(2000);

  const result = useMemo(() => {
    const regulaer = calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      verheiratet: steuerklasse === 3 || steuerklasse === 5,
      kinderlosUeber23: false,
      kirche,
      steuerklasse,
    });

    // Sozialversicherung auf den Bonus (gleicher Satz wie regulärer AN-Anteil, bis zur BBG)
    const kvPvBbgJahr = 69750;
    const rvAlvBbgJahr = 101400;
    const bruttoJahrRegulaer = brutto * 12;
    const svSatzGesamt = 0.20; // Näherung: kombinierter AN-Satz aller Zweige

    const restKvPv = Math.max(0, kvPvBbgJahr - bruttoJahrRegulaer);
    const restRvAlv = Math.max(0, rvAlvBbgJahr - bruttoJahrRegulaer);
    const svPflichtigerBonusAnteil = Math.min(bonus, Math.max(restKvPv, restRvAlv));
    const svAufBonus = svPflichtigerBonusAnteil * svSatzGesamt * 0.5; // grobe Näherung AN-Anteil

    const zvEOhne = regulaer.steuer.zvE;
    const zvEMitBonus = zvEOhne + Math.max(0, bonus - svAufBonus);

    const estOhne = estJahrFuerSK(zvEOhne, steuerklasse);
    const estMitBonus = estJahrFuerSK(zvEMitBonus, steuerklasse);

    const verheiratet = steuerklasse === 3;
    const soliOhne = soliBerechnen(estOhne, verheiratet);
    const soliMitBonus = soliBerechnen(estMitBonus, verheiratet);

    const ksSatz = 0.09;
    const ksOhne = kirche ? estOhne * ksSatz : 0;
    const ksMitBonus = kirche ? estMitBonus * ksSatz : 0;

    const steuerlastOhne = estOhne + soliOhne + ksOhne;
    const steuerlastMitBonus = estMitBonus + soliMitBonus + ksMitBonus;
    const steuerAufBonus = steuerlastMitBonus - steuerlastOhne;

    const nettoBonus = bonus - steuerAufBonus - svAufBonus;
    const effektiverSatz = bonus > 0 ? ((bonus - nettoBonus) / bonus) * 100 : 0;

    return { nettoBonus, steuerAufBonus, svAufBonus, effektiverSatz };
  }, [brutto, steuerklasse, kirche, bonus]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Gift size={14} />
            Weihnachtsgeld · Urlaubsgeld · Bonus
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Bonus-{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              Steuerrechner
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie, wie viel von Ihrem Weihnachtsgeld, Urlaubsgeld oder Bonus nach Steuern
            und Sozialabgaben tatsächlich übrig bleibt.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" />
              Ihre Angaben
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Reguläres Bruttogehalt / Monat</label>
                <input
                  type="number"
                  value={brutto}
                  onChange={(e) => setBrutto(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Weihnachtsgeld / Urlaubsgeld / Bonus (brutto)</label>
                <input
                  type="number"
                  value={bonus}
                  onChange={(e) => setBonus(Number(e.target.value))}
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
              <Gift size={22} className="text-[#E60A1C]" />
              Netto-Bonus
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Vereinfachte Berechnung — keine Steuerberatung
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Steuer auf Bonus</span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEuro(result.steuerAufBonus)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Sozialabgaben auf Bonus</span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEuro(result.svAufBonus)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Effektive Abgabenlast</span>
                <span className="text-lg font-extrabold text-[#16181D]">{result.effektiverSatz.toFixed(1)} %</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Netto-Bonus (was übrig bleibt)</span>
                <span className="text-2xl font-extrabold text-emerald-600">{formatEuro(result.nettoBonus)}</span>
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
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
            Weihnachtsgeld &amp; Bonus versteuern: Warum netto so wenig übrig bleibt
          </h2>
          <p>
            Einmalzahlungen wie <strong className="text-[#16181D]">Weihnachtsgeld</strong>,{" "}
            <strong className="text-[#16181D]">Urlaubsgeld</strong>, Boni oder das{" "}
            <strong className="text-[#16181D]">13. Monatsgehalt</strong> gelten steuerlich als „sonstige Bezüge".
            Sie werden nicht dem laufenden Monat, sondern dem gesamten Jahreseinkommen hinzugerechnet und
            nach der Jahreslohnsteuertabelle versteuert. Weil dadurch oft ein höherer Grenzsteuersatz greift,
            fühlt sich die Abzugslast beim Bonus spürbar höher an als beim normalen Gehalt.
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Fallen auf den Bonus auch Sozialabgaben an?</h3>
          <p>
            Ja — Weihnachts- und Urlaubsgeld sind grundsätzlich sozialversicherungspflichtig, solange die
            jeweilige <strong className="text-[#16181D]">Beitragsbemessungsgrenze</strong> noch nicht erreicht ist.
            Liegt Ihr Jahreseinkommen inklusive Sonderzahlung bereits über der Grenze (2026: 96.600 € in der
            Renten-/Arbeitslosenversicherung), fallen auf den darüber liegenden Teil keine Renten- und
            Arbeitslosenbeiträge mehr an — netto bleibt dann relativ mehr übrig.
          </p>
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-5">
            <p className="font-mono text-[#16181D] text-sm mb-2">So rechnet der Bonus-Steuerrechner:</p>
            <p className="text-black/60 text-sm">
              Er vergleicht Ihre Jahreslohnsteuer <strong className="text-[#16181D]">mit</strong> und{" "}
              <strong className="text-[#16181D]">ohne</strong> Sonderzahlung. Die Differenz ist die auf den
              Bonus entfallende Steuer — so sehen Sie exakt, wie viel von 500 €, 1.000 € oder einem vollen
              Monatsgehalt Weihnachtsgeld netto ankommt.
            </p>
          </div>
          <p>
            Tipp: Wird der Bonus in einem Monat mit ohnehin hohem Gehalt ausgezahlt, kann die Steuerlast
            höher ausfallen. Eine vorausschauende Planung mit dem Rechner hilft, keine böse Überraschung
            auf der Gehaltsabrechnung zu erleben.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
          Häufige Fragen zu Weihnachtsgeld &amp; Bonus
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
              Weitere Gehaltsrechner entdecken
            </h2>
            <p className="text-black/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">
              Abfindungsrechner, Firmenwagenrechner, Rentenrechner &amp; mehr —
              alle kostenlos und aktuell für 2026.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/abfindungsrechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Abfindungsrechner
              </Link>
              <Link href="/firmenwagenrechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Firmenwagenrechner
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
