"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HeartPulse, Calculator, Info, ChevronDown, ArrowRight } from "lucide-react";
import AdUnit from "@/components/AdUnit";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";

type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;
const SK: Record<Steuerklasse, string> = {
  1: "Klasse I — Ledig", 2: "Klasse II — Alleinerziehend", 3: "Klasse III — Verheiratet",
  4: "Klasse IV — Verheiratet", 5: "Klasse V — Verheiratet", 6: "Klasse VI — Zweiter Job",
};

const faqs = [
  { q: "Wie hoch ist das Krankengeld?", a: "Das Krankengeld beträgt 70 % des Bruttoarbeitsentgelts, höchstens jedoch 90 % des Nettoarbeitsentgelts. Von diesem Betrag gehen noch die Arbeitnehmeranteile zur Renten-, Arbeitslosen- und Pflegeversicherung ab (rund 12,5 %)." },
  { q: "Ab wann zahlt die Krankenkasse Krankengeld?", a: "In den ersten sechs Wochen (42 Tage) einer Arbeitsunfähigkeit zahlt der Arbeitgeber die Entgeltfortzahlung (100 % des Nettolohns). Erst danach übernimmt die Krankenkasse das Krankengeld." },
  { q: "Wie lange wird Krankengeld gezahlt?", a: "Bei derselben Erkrankung wird Krankengeld für maximal 78 Wochen innerhalb von drei Jahren gezahlt — abzüglich der sechs Wochen Entgeltfortzahlung also längstens 72 Wochen." },
  { q: "Muss man Krankengeld versteuern?", a: "Krankengeld ist steuerfrei, unterliegt aber dem Progressionsvorbehalt: Es erhöht den Steuersatz auf Ihr übriges Einkommen und kann so bei der Steuererklärung zu einer Nachzahlung führen." },
];

export default function KrankengeldRechner() {
  const [brutto, setBrutto] = useState(3500);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);
  const [kinderlos, setKinderlos] = useState(true);

  const r = useMemo(() => {
    const netto = calculateNetto({ bruttoMonat: brutto, jahr: 2026, verheiratet: steuerklasse === 3 || steuerklasse === 5, kinderlosUeber23: kinderlos, kirche, steuerklasse }).nettoMonat;
    const bruttoTag = brutto / 30;
    const nettoTag = netto / 30;
    const kgBruttoTag = Math.min(bruttoTag * 0.70, nettoTag * 0.90);
    const svSatz = 0.093 + 0.013 + (kinderlos ? 0.025 : 0.019); // RV + ALV + PV(AN)
    const kgNettoTag = kgBruttoTag * (1 - svSatz);
    return {
      netto,
      kgBruttoMonat: kgBruttoTag * 30,
      kgNettoMonat: kgNettoTag * 30,
      kgNettoTag,
      quote: netto > 0 ? (kgNettoTag * 30 / netto) * 100 : 0,
    };
  }, [brutto, steuerklasse, kirche, kinderlos]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <HeartPulse size={14} /> Krankengeld · Höhe berechnen · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Krankengeld{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Rechner</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie die Höhe Ihres <strong className="text-[#16181D]">Krankengeldes</strong> —
            70 % vom Brutto, maximal 90 % vom Netto, nach Abzug der Sozialabgaben.
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-black/70 mb-2">Steuerklasse</label>
                  <select value={steuerklasse} onChange={(e) => setSteuerklasse(Number(e.target.value) as Steuerklasse)}
                    className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none">
                    {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => <option key={sk} value={sk}>{SK[sk]}</option>)}
                  </select>
                </div>
                <div className="flex flex-col justify-end gap-2 pb-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                    <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" /> Kirchensteuer
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                    <input type="checkbox" checked={kinderlos} onChange={(e) => setKinderlos(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" /> Kinderlos (ab 23)
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <HeartPulse size={22} className="text-[#E60A1C]" /> Ihr Krankengeld
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Vereinfachte Berechnung — keine Rechtsberatung
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Reguläres Netto / Monat</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.netto)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Krankengeld brutto / Monat</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.kgBruttoMonat)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Krankengeld / Tag (netto)</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.kgNettoTag)}</span>
              </div>
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Krankengeld netto / Monat</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-600">{formatEUR(r.kgNettoMonat)}</span>
              </div>
              <p className="text-xs text-black/55 px-1">
                Das sind rund <strong className="text-[#16181D]">{r.quote.toFixed(0)} %</strong> Ihres regulären Nettogehalts.
                Krankengeld gibt es ab der 7. Woche (nach der Entgeltfortzahlung).
              </p>
            </div>
            <Link href="/" className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
              Nettogehalt berechnen <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Krankengeld: Höhe, Dauer und Abzüge</h2>
          <p>
            Das <strong className="text-[#16181D]">Krankengeld</strong> der gesetzlichen Krankenkasse springt
            ein, wenn nach <strong className="text-[#16181D]">sechs Wochen</strong> Arbeitsunfähigkeit die
            Entgeltfortzahlung des Arbeitgebers endet. Es beträgt <strong className="text-[#16181D]">70 % des
            Bruttoentgelts</strong>, höchstens aber <strong className="text-[#16181D]">90 % des Nettoentgelts</strong>.
          </p>
          <p>
            Vom Krankengeld gehen noch die Arbeitnehmeranteile zur Renten-, Arbeitslosen- und
            Pflegeversicherung ab (rund 12,5 %) — die Krankenversicherung selbst zahlt keinen Beitrag darauf.
            Krankengeld ist steuerfrei, unterliegt aber dem <strong className="text-[#16181D]">Progressionsvorbehalt</strong>.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zum Krankengeld</h2>
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
