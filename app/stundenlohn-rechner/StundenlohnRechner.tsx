"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock3, Calculator, ArrowRight, Info, ChevronDown } from "lucide-react";
import { calculateNetto } from "@/lib/taxCalculator";

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

const faqs = [
  {
    q: "Wie rechne ich Stundenlohn in Monatsgehalt um?",
    a: "Monatsbrutto = Stundenlohn × Wochenstunden × 52 ÷ 12. Bei einer 40-Stunden-Woche entsprechen das rechnerisch rund 173,33 Stunden pro Monat.",
  },
  {
    q: "Wie hoch ist mein Netto-Stundenlohn?",
    a: "Der Netto-Stundenlohn ergibt sich, indem Sie Ihr monatliches Nettogehalt durch die monatlichen Arbeitsstunden teilen. Er liegt je nach Steuerklasse und Abzügen meist 25–35 % unter dem Brutto-Stundenlohn.",
  },
  {
    q: "Ändert sich mein Netto-Stundenlohn mit der Stundenzahl?",
    a: "Der Netto-Stundenlohn kann bei mehr Wochenstunden leicht sinken, da ein höheres Monatsgehalt in eine höhere Steuerprogression rutschen kann. Bei geringen Stundenzahlen bleibt er wegen des Grundfreibetrags oft nahezu konstant zum Brutto-Stundenlohn.",
  },
];

export default function StundenlohnRechner() {
  const [stundenlohn, setStundenlohn] = useState(18);
  const [wochenstunden, setWochenstunden] = useState(40);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);

  const result = useMemo(() => {
    const monatsStunden = (wochenstunden * 52) / 12;
    const bruttoMonat = stundenlohn * monatsStunden;
    const bruttoJahr = stundenlohn * wochenstunden * 52;

    const netto = calculateNetto({
      bruttoMonat,
      jahr: 2026,
      verheiratet: steuerklasse === 3 || steuerklasse === 5,
      kinderlosUeber23: false,
      kirche,
      steuerklasse,
    });

    const nettoStundenlohn = monatsStunden > 0 ? netto.nettoMonat / monatsStunden : 0;

    return { monatsStunden, bruttoMonat, bruttoJahr, nettoMonat: netto.nettoMonat, nettoStundenlohn };
  }, [stundenlohn, wochenstunden, steuerklasse, kirche]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Clock3 size={14} />
            Stundenlohn ↔ Monatsgehalt
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Stundenlohn-{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              Rechner
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Rechnen Sie Ihren Stundenlohn in Monatsgehalt um und sehen Sie sofort Ihren
            Netto-Stundenlohn nach Steuern und Sozialabgaben.
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
              Ihr Stundenlohn
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Brutto-Stundenlohn (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={stundenlohn}
                  onChange={(e) => setStundenlohn(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div>
                <label htmlFor="wochenstunden-slider" className="block text-sm font-semibold text-black/70 mb-2">
                  Arbeitsstunden pro Woche
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="wochenstunden-slider"
                    type="range"
                    min={1}
                    max={48}
                    value={wochenstunden}
                    onChange={(e) => setWochenstunden(Number(e.target.value))}
                    className="flex-1 accent-[#E60A1C] h-2 rounded-full"
                  />
                  <div className="bg-[#E60A1C]/15 border border-[#E60A1C]/40 rounded-xl px-4 py-2 text-[#E60A1C] font-bold text-lg w-20 text-center">
                    {wochenstunden}h
                  </div>
                </div>
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
              <Clock3 size={22} className="text-[#E60A1C]" />
              Ihr Gehalt
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Vereinfachte Berechnung — keine Steuerberatung
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Bruttogehalt / Monat</span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEuro(result.bruttoMonat)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Nettogehalt / Monat</span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEuro(result.nettoMonat)}</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Netto-Stundenlohn</span>
                <span className="text-2xl font-extrabold text-emerald-600">{formatEuro(result.nettoStundenlohn)}</span>
              </div>
            </div>

            <Link
              href="/"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(230,10,28,0.35)] hover:shadow-[0_0_30px_rgba(230,10,28,0.55)] text-sm"
            >
              Vollständigen Gehaltsrechner öffnen
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Explainer / SEO content */}
      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
            Netto-Stundenlohn berechnen: So funktioniert es
          </h2>
          <p>
            Ihr <strong className="text-[#16181D]">Brutto-Stundenlohn</strong> ist nur die halbe Wahrheit —
            entscheidend ist, was nach Lohnsteuer und Sozialabgaben netto pro Stunde übrig bleibt.
            Der Stundenlohn-Rechner rechnet dazu zuerst Ihren Stundenlohn in ein Monatsbrutto um und
            wendet anschließend die amtliche Berechnung nach § 32a EStG an.
          </p>
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-5">
            <p className="font-mono text-[#16181D] text-sm mb-2">Formel Monatsbrutto:</p>
            <p className="font-mono text-[#E60A1C] text-sm sm:text-base">
              Stundenlohn × Wochenstunden × 52 ÷ 12
            </p>
            <p className="mt-3 text-black/60 text-sm">
              Beispiel: 18 € × 40 Std. × 52 ÷ 12 = <strong className="text-[#16181D]">3.120 € Brutto/Monat</strong> —
              in Steuerklasse I bleiben davon rund 2.147 € netto, also etwa <strong className="text-[#16181D]">12,39 € netto pro Stunde</strong>.
            </p>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Was beeinflusst Ihren Netto-Stundenlohn?</h3>
          <ul className="space-y-2">
            <li className="flex gap-2"><span className="text-[#E60A1C] font-bold">›</span> <span><strong className="text-[#16181D]">Steuerklasse:</strong> In Klasse III bleibt deutlich mehr netto als in Klasse I oder VI.</span></li>
            <li className="flex gap-2"><span className="text-[#E60A1C] font-bold">›</span> <span><strong className="text-[#16181D]">Wochenstunden:</strong> Mehr Stunden erhöhen das Monatsbrutto und können in eine höhere Steuerprogression führen.</span></li>
            <li className="flex gap-2"><span className="text-[#E60A1C] font-bold">›</span> <span><strong className="text-[#16181D]">Kirchensteuer &amp; Zusatzbeitrag:</strong> Je nach Krankenkasse und Konfession sinkt der Netto-Stundenlohn um einige Cent.</span></li>
          </ul>
          <p>
            Als Faustregel liegt der Netto-Stundenlohn je nach Steuerklasse rund <strong className="text-[#16181D]">25–35 % unter</strong> dem
            Brutto-Stundenlohn. Wer den gesetzlichen Mindestlohn von 13,90 € (2026) bzw. 14,60 € (2027) verdient,
            kann so vorab sehen, wie viel davon tatsächlich auf dem Konto ankommt.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
          Häufige Fragen zum Stundenlohn
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
              Mindestlohn-Rechner, Minijob-Rechner, Firmenwagenrechner &amp; mehr —
              alle kostenlos und aktuell für 2026.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/mindestlohn" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Mindestlohn-Rechner
              </Link>
              <Link href="/minijob-rechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Minijob-Rechner
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
