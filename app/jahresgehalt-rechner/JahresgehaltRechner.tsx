"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarRange, Calculator, ArrowRight, Info, ChevronDown } from "lucide-react";
import AdUnit from "@/components/AdUnit";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";

type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;
const SK: Record<Steuerklasse, string> = {
  1: "Klasse I — Ledig", 2: "Klasse II — Alleinerziehend", 3: "Klasse III — Verheiratet",
  4: "Klasse IV — Verheiratet", 5: "Klasse V — Verheiratet", 6: "Klasse VI — Zweiter Job",
};

const faqs = [
  { q: "Wie berechnet man das Jahresgehalt aus dem Monatsgehalt?", a: "Das Bruttojahresgehalt ergibt sich aus dem Monatsbrutto multipliziert mit der Anzahl der Gehälter pro Jahr. Bei 12 Monatsgehältern sind das 12 × Monatsbrutto; mit Weihnachts- und Urlaubsgeld können es 13 oder 14 Gehälter sein." },
  { q: "Was ist der Unterschied zwischen Brutto- und Nettojahresgehalt?", a: "Das Bruttojahresgehalt ist die Summe aller Bruttobezüge vor Abzügen. Das Nettojahresgehalt ist der Betrag, der nach Lohnsteuer, Soli, ggf. Kirchensteuer und Sozialabgaben tatsächlich ausgezahlt wird." },
  { q: "Zählen Weihnachtsgeld und Urlaubsgeld zum Jahresgehalt?", a: "Ja. Weihnachts-, Urlaubsgeld und ein 13./14. Monatsgehalt sind Teil des Bruttojahresgehalts und voll steuer- und sozialversicherungspflichtig." },
  { q: "Wie viel Netto bleibt vom Jahresgehalt?", a: "Je nach Höhe und Steuerklasse bleiben vom Bruttojahresgehalt meist zwischen 55 % und 70 % netto übrig. Nutzen Sie den Rechner für Ihren individuellen Wert." },
];

export default function JahresgehaltRechner() {
  const [brutto, setBrutto] = useState(3500);
  const [anzahl, setAnzahl] = useState(12);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);

  const r = useMemo(() => {
    const bruttoJahr = brutto * anzahl;
    const monatsEquiv = bruttoJahr / 12;
    const res = calculateNetto({ bruttoMonat: monatsEquiv, jahr: 2026, verheiratet: steuerklasse === 3 || steuerklasse === 5, kinderlosUeber23: false, kirche, steuerklasse });
    return {
      bruttoJahr,
      nettoJahr: res.nettoJahr,
      nettoMonatSchnitt: res.nettoJahr / 12,
      quote: bruttoJahr > 0 ? (res.nettoJahr / bruttoJahr) * 100 : 0,
    };
  }, [brutto, anzahl, steuerklasse, kirche]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <CalendarRange size={14} /> Jahresgehalt · Brutto & Netto · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Jahresgehalt{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Rechner</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie Ihr <strong className="text-[#16181D]">Bruttojahresgehalt</strong> und
            das <strong className="text-[#16181D]">Nettojahresgehalt</strong> — inklusive 13. und
            14. Monatsgehalt.
          </p>
        </div>
      </section>

      <AdUnit placement="content" className="!mt-0 !mb-8" />

      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Ihre Angaben
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Bruttogehalt / Monat</label>
                <input type="number" value={brutto} onChange={(e) => setBrutto(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Gehälter pro Jahr</label>
                <div className="flex gap-2">
                  {[12, 13, 14].map((n) => (
                    <button key={n} type="button" onClick={() => setAnzahl(n)}
                      className={`flex-1 rounded-xl px-4 py-3 font-bold text-sm border transition-all ${anzahl === n ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-[#16181D] border-black/[0.10] hover:border-[#E60A1C]/40"}`}>
                      {n} Gehälter
                    </button>
                  ))}
                </div>
                <p className="text-xs text-black/50 mt-2">13/14 = inkl. Weihnachts- &amp; Urlaubsgeld</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-black/70 mb-2">Steuerklasse</label>
                  <select value={steuerklasse} onChange={(e) => setSteuerklasse(Number(e.target.value) as Steuerklasse)}
                    className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none">
                    {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => <option key={sk} value={sk}>{SK[sk]}</option>)}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                    <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" /> Kirchensteuer
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <CalendarRange size={22} className="text-[#E60A1C]" /> Ihr Jahresgehalt
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Vereinfachte Berechnung — keine Steuerberatung
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Bruttojahresgehalt</span>
                <span className="text-lg font-mono font-extrabold text-[#16181D]">{formatEUR(r.bruttoJahr)}</span>
              </div>
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Nettojahresgehalt</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-600">{formatEUR(r.nettoJahr)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Netto pro Monat (Ø)</span>
                <span className="text-lg font-mono font-extrabold text-[#16181D]">{formatEUR(r.nettoMonatSchnitt)}</span>
              </div>
              <p className="text-xs text-black/55 px-1">
                Netto-Quote: <strong className="text-[#16181D]">{r.quote.toFixed(1).replace(".", ",")} %</strong> Ihres Bruttojahresgehalts.
              </p>
            </div>
            <Link href="/gehaltsrechner" className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
              Zum Gehaltsrechner <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Bruttojahresgehalt in Netto umrechnen</h2>
          <p>
            Das <strong className="text-[#16181D]">Bruttojahresgehalt</strong> ist die Summe aller
            Bruttobezüge eines Jahres — Monatsgehälter plus Sonderzahlungen wie{" "}
            <strong className="text-[#16181D]">Weihnachtsgeld</strong> oder ein{" "}
            <strong className="text-[#16181D]">13. Monatsgehalt</strong>. Vom Brutto werden Lohnsteuer,
            Solidaritätszuschlag, ggf. Kirchensteuer und die Sozialabgaben abgezogen — übrig bleibt das{" "}
            <strong className="text-[#16181D]">Nettojahresgehalt</strong>.
          </p>
          <p>
            Für Sonderzahlungen wie Weihnachtsgeld nutzen Sie zusätzlich unseren{" "}
            <Link href="/weihnachtsgeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Weihnachtsgeld-Rechner</Link>,
            für die monatliche Sicht den{" "}
            <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Gehaltsrechner</Link>.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zum Jahresgehalt</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 pt-1 text-black/65 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
