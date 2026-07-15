"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TrendingDown, Calculator, Info, ChevronDown, ArrowRight } from "lucide-react";
import AdUnit from "@/components/AdUnit";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";

type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;
const SK: Record<Steuerklasse, string> = {
  1: "Klasse I — Ledig", 2: "Klasse II — Alleinerziehend", 3: "Klasse III — Verheiratet",
  4: "Klasse IV — Verheiratet", 5: "Klasse V — Verheiratet", 6: "Klasse VI — Zweiter Job",
};

const faqs = [
  { q: "Wie hoch ist das Kurzarbeitergeld?", a: "Das Kurzarbeitergeld beträgt 60 % der Nettoentgeltdifferenz, mit mindestens einem Kind im Haushalt 67 %. Die Nettoentgeltdifferenz ist der Unterschied zwischen dem pauschalierten Netto beim vollen (Soll-)Gehalt und beim reduzierten (Ist-)Gehalt." },
  { q: "Was ist die Nettoentgeltdifferenz?", a: "Sie ist die Differenz zwischen dem Netto, das Sie ohne Arbeitsausfall verdient hätten (Soll-Entgelt), und dem Netto, das Sie während der Kurzarbeit tatsächlich erhalten (Ist-Entgelt). Auf diese Differenz zahlt die Bundesagentur für Arbeit 60 bzw. 67 %." },
  { q: "Ist Kurzarbeitergeld steuerpflichtig?", a: "Kurzarbeitergeld ist steuerfrei, unterliegt aber dem Progressionsvorbehalt. Es erhöht den Steuersatz auf Ihr übriges Einkommen, weshalb bei Kurzarbeit eine Steuererklärung Pflicht ist und es zu einer Nachzahlung kommen kann." },
  { q: "Bekomme ich während der Kurzarbeit noch Gehalt?", a: "Ja. Für die tatsächlich geleistete Arbeit zahlt der Arbeitgeber das reduzierte Ist-Gehalt. Zusätzlich erhalten Sie das Kurzarbeitergeld als Ausgleich für einen Teil des ausgefallenen Netto-Verdiensts." },
];

export default function KurzarbeitergeldRechner() {
  const [sollBrutto, setSollBrutto] = useState(3500);
  const [ausfall, setAusfall] = useState(50);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);
  const [mitKind, setMitKind] = useState(false);

  const r = useMemo(() => {
    const istBrutto = sollBrutto * (1 - ausfall / 100);
    const base = { jahr: 2026 as const, verheiratet: steuerklasse === 3 || steuerklasse === 5, kinderlosUeber23: true, kirche, steuerklasse };
    const netSoll = calculateNetto({ ...base, bruttoMonat: sollBrutto }).nettoMonat;
    const netIst = calculateNetto({ ...base, bruttoMonat: istBrutto }).nettoMonat;
    const diff = Math.max(0, netSoll - netIst);
    const satz = mitKind ? 0.67 : 0.60;
    const kug = diff * satz;
    const gesamt = netIst + kug;
    return { istBrutto, netSoll, netIst, kug, gesamt, satz, verlust: netSoll - gesamt };
  }, [sollBrutto, ausfall, steuerklasse, kirche, mitKind]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <TrendingDown size={14} /> Kurzarbeitergeld · KUG · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Kurzarbeitergeld{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Rechner</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie Ihr <strong className="text-[#16181D]">Kurzarbeitergeld</strong> und Ihr
            gesamtes Monatseinkommen bei Kurzarbeit — 60 % bzw. 67 % der Nettoentgeltdifferenz.
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
                <label className="block text-sm font-semibold text-black/70 mb-2">Volles Bruttogehalt (Soll) / Monat</label>
                <input type="number" value={sollBrutto} onChange={(e) => setSollBrutto(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Arbeitsausfall: {ausfall} %</label>
                <input type="range" min={10} max={100} step={10} value={ausfall} onChange={(e) => setAusfall(Number(e.target.value))}
                  className="w-full accent-[#E60A1C]" />
                <p className="text-xs text-black/50 mt-1">Reduziertes Ist-Gehalt: {formatEUR(r.istBrutto)}</p>
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
                    <input type="checkbox" checked={mitKind} onChange={(e) => setMitKind(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" /> Kind im Haushalt (67 %)
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                    <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" /> Kirchensteuer
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <TrendingDown size={22} className="text-[#E60A1C]" /> Ihr Einkommen bei Kurzarbeit
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Vereinfachte Berechnung — keine Rechtsberatung
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Netto ohne Kurzarbeit (Soll)</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.netSoll)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Ist-Netto (reduziert)</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.netIst)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Kurzarbeitergeld ({(r.satz * 100).toFixed(0)} %)</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">+{formatEUR(r.kug)}</span>
              </div>
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Gesamt / Monat</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-600">{formatEUR(r.gesamt)}</span>
              </div>
              <p className="text-xs text-black/55 px-1">
                Netto-Verlust gegenüber dem vollen Gehalt: <strong className="text-[#16181D]">{formatEUR(r.verlust)}</strong> / Monat.
              </p>
            </div>
            <Link href="/arbeitslosengeld-rechner" className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
              Arbeitslosengeld-Rechner <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Kurzarbeitergeld: So wird es berechnet</h2>
          <p>
            Bei <strong className="text-[#16181D]">Kurzarbeit</strong> reduziert der Arbeitgeber die Arbeitszeit
            und zahlt nur das entsprechend geringere <strong className="text-[#16181D]">Ist-Gehalt</strong>. Als
            Ausgleich zahlt die Bundesagentur für Arbeit das <strong className="text-[#16181D]">Kurzarbeitergeld
            (KUG)</strong>: <strong className="text-[#16181D]">60 %</strong> der Nettoentgeltdifferenz, mit
            mindestens einem Kind <strong className="text-[#16181D]">67 %</strong>.
          </p>
          <p>
            Die <strong className="text-[#16181D]">Nettoentgeltdifferenz</strong> ist der Unterschied zwischen dem
            Netto beim vollen Gehalt und dem Netto beim reduzierten Gehalt. KUG ist steuerfrei, unterliegt aber
            dem <strong className="text-[#16181D]">Progressionsvorbehalt</strong> — eine Steuererklärung ist Pflicht.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zum Kurzarbeitergeld</h2>
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
