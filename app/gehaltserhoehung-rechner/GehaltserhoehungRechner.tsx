"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TrendingUp, Calculator, ArrowRight, Info, ChevronDown } from "lucide-react";
import AdUnit from "@/components/AdUnit";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";

type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;
const SK: Record<Steuerklasse, string> = {
  1: "Klasse I — Ledig", 2: "Klasse II — Alleinerziehend", 3: "Klasse III — Verheiratet",
  4: "Klasse IV — Verheiratet", 5: "Klasse V — Verheiratet", 6: "Klasse VI — Zweiter Job",
};

const faqs = [
  { q: "Wie viel von der Gehaltserhöhung bleibt netto übrig?", a: "Das hängt vom Grenzsteuersatz ab: Auf jeden zusätzlichen Euro fallen Lohnsteuer und Sozialabgaben an. Bei mittleren Einkommen bleiben von einer Bruttoerhöhung oft nur etwa 50–60 % netto übrig, bei hohen Einkommen entsprechend weniger." },
  { q: "Warum bleibt so wenig von der Gehaltserhöhung übrig?", a: "Weil die Erhöhung „oben drauf\" kommt und mit dem persönlichen Grenzsteuersatz besteuert wird — nicht mit dem niedrigeren Durchschnittssteuersatz. Zusätzlich fallen Sozialabgaben an, solange die Beitragsbemessungsgrenzen nicht überschritten sind." },
  { q: "Lohnt sich eine Gehaltserhöhung trotzdem?", a: "Ja. Auch wenn netto weniger ankommt als brutto draufkommt, steigt Ihr Nettoeinkommen dauerhaft. Zudem erhöhen sich Ansprüche wie Renten- und Arbeitslosengeld, die sich am Bruttoentgelt orientieren." },
  { q: "Kann eine Gehaltserhöhung sich negativ auswirken?", a: "In seltenen Fällen an Schwellen (z. B. Überschreiten einer Beitragsbemessungsgrenze oder Wegfall einkommensabhängiger Leistungen). Für die reine Lohnsteuer gibt es aber keinen Nachteil — es bleibt immer netto mehr übrig als vorher." },
];

export default function GehaltserhoehungRechner() {
  const [brutto, setBrutto] = useState(3500);
  const [erhoehung, setErhoehung] = useState(300);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);

  const r = useMemo(() => {
    const base = { jahr: 2026 as const, verheiratet: steuerklasse === 3 || steuerklasse === 5, kinderlosUeber23: false, kirche, steuerklasse };
    const alt = calculateNetto({ ...base, bruttoMonat: brutto });
    const neu = calculateNetto({ ...base, bruttoMonat: brutto + erhoehung });
    const nettoPlus = neu.nettoMonat - alt.nettoMonat;
    const behalten = erhoehung > 0 ? (nettoPlus / erhoehung) * 100 : 0;
    return {
      nettoAlt: alt.nettoMonat, nettoNeu: neu.nettoMonat, nettoPlus,
      behalten, abgaben: erhoehung - nettoPlus, jahrPlus: nettoPlus * 12,
    };
  }, [brutto, erhoehung, steuerklasse, kirche]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <TrendingUp size={14} /> Gehaltserhöhung netto · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Gehaltserhöhung{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Netto-Rechner</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Wie viel von Ihrer <strong className="text-[#16181D]">Gehaltserhöhung</strong> kommt nach
            Steuern und Sozialabgaben tatsächlich netto an? Der Rechner zeigt Ihren Grenzsteuersatz.
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
                <label className="block text-sm font-semibold text-black/70 mb-2">Aktuelles Bruttogehalt / Monat</label>
                <input type="number" value={brutto} onChange={(e) => setBrutto(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Geplante Erhöhung (brutto / Monat)</label>
                <input type="number" value={erhoehung} onChange={(e) => setErhoehung(Number(e.target.value))}
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
              <TrendingUp size={22} className="text-[#E60A1C]" /> Das bleibt von der Erhöhung
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Vereinfachte Berechnung — keine Steuerberatung
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Netto vorher</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.nettoAlt)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Netto nachher</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.nettoNeu)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Steuern & Abgaben auf die Erhöhung</span>
                <span className="text-base font-mono font-extrabold text-rose-600">{formatEUR(r.abgaben)}</span>
              </div>
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Netto mehr / Monat</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-600">+{formatEUR(r.nettoPlus)}</span>
              </div>
              <p className="text-xs text-black/55 px-1">
                Von der Bruttoerhöhung bleiben <strong className="text-[#16181D]">{r.behalten.toFixed(0)} %</strong> netto übrig
                — das sind <strong className="text-[#16181D]">{formatEUR(r.jahrPlus)}</strong> mehr pro Jahr.
              </p>
            </div>
            <Link href="/" className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
              Vollständigen Brutto-Netto-Rechner öffnen <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Gehaltserhöhung netto: Der Grenzsteuersatz entscheidet</h2>
          <p>
            Eine <strong className="text-[#16181D]">Gehaltserhöhung</strong> wird immer mit dem persönlichen{" "}
            <strong className="text-[#16181D]">Grenzsteuersatz</strong> besteuert — dem Steuersatz auf den{" "}
            <em>letzten</em> verdienten Euro. Weil dieser höher ist als der Durchschnittssteuersatz, kommt von
            einer Bruttoerhöhung netto spürbar weniger an. Zusätzlich fallen Sozialabgaben an, solange die
            Beitragsbemessungsgrenzen nicht überschritten sind.
          </p>
          <p>
            Trotzdem lohnt sich jede Erhöhung: Ihr Nettoeinkommen steigt dauerhaft, und höhere Bruttobezüge
            erhöhen auch Ihre Ansprüche auf Renten- und Arbeitslosengeld. Nutzen Sie ergänzend den{" "}
            <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Gehaltsrechner</Link>{" "}
            oder den <Link href="/rechner/netto-zu-brutto" className="text-[#E60A1C] font-semibold hover:underline">Netto-zu-Brutto-Rechner</Link> für die Gehaltsverhandlung.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zur Gehaltserhöhung</h2>
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
