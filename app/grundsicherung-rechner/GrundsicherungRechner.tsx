"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HandCoins, Calculator, Info, ChevronDown, ArrowRight, Home } from "lucide-react";
import { formatEUR } from "@/lib/taxCalculator";

// Regelbedarfe 2026 (SGB XII) — Nullrunde, unverändert gegenüber 2025
const REGELBEDARF_STUFE_1 = 563; // Alleinstehende (€/Monat)
const REGELBEDARF_STUFE_2 = 506; // je Partner in Bedarfsgemeinschaft (€/Monat)

const faqs = [
  { q: "Wie hoch ist die Grundsicherung 2026?", a: "Der Regelbedarf für Alleinstehende (Regelbedarfsstufe 1) liegt 2026 bei 563 € im Monat — unverändert gegenüber 2025, weil es eine gesetzliche Nullrunde gibt. Für Paare gelten je Partner 506 € (Stufe 2). Hinzu kommen die angemessenen Kosten für Unterkunft und Heizung." },
  { q: "Was zählt zum Bedarf?", a: "Der Gesamtbedarf setzt sich zusammen aus dem Regelbedarf (pauschal für Ernährung, Kleidung, Strom etc.) plus den tatsächlichen, angemessenen Kosten der Unterkunft und Heizung (Warmmiete). Bei besonderen Lebenslagen können Mehrbedarfe hinzukommen." },
  { q: "Wie wird mein Einkommen angerechnet?", a: "Eigenes Einkommen — etwa eine gesetzliche Rente — wird grundsätzlich auf den Bedarf angerechnet und mindert den Anspruch. Für bestimmte Einkünfte (z. B. aus zusätzlicher Altersvorsorge oder Erwerbstätigkeit) gibt es Freibeträge. Dieser Rechner rechnet vereinfacht das volle angegebene Nettoeinkommen an." },
  { q: "Wer hat Anspruch auf Grundsicherung im Alter?", a: "Anspruch haben Personen ab der Regelaltersgrenze sowie dauerhaft voll Erwerbsgeminderte ab 18 Jahren, deren Einkommen und Vermögen nicht zur Deckung des Lebensunterhalts ausreichen. Erwerbsfähige Personen erhalten stattdessen Bürgergeld." },
];

export default function GrundsicherungRechner() {
  const [paar, setPaar] = useState(false);
  const [warmmiete, setWarmmiete] = useState(600);
  const [einkommen, setEinkommen] = useState(900);

  const r = useMemo(() => {
    const regelbedarf = paar ? REGELBEDARF_STUFE_2 * 2 : REGELBEDARF_STUFE_1;
    const bedarf = regelbedarf + Math.max(0, warmmiete);
    const anspruch = Math.max(0, bedarf - Math.max(0, einkommen));
    return { regelbedarf, bedarf, anspruch };
  }, [paar, warmmiete, einkommen]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <HandCoins size={14} /> Grundsicherung · SGB XII · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Grundsicherung-Rechner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">2026</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie Ihren möglichen Anspruch auf <strong className="text-[#16181D]">Grundsicherung im Alter</strong>
            {" "}oder bei Erwerbsminderung — aus <strong className="text-[#16181D]">Regelbedarf</strong>,
            <strong className="text-[#16181D]"> Unterkunftskosten</strong> und Ihrem anrechenbaren Einkommen.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Ihre Situation
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Haushalt</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setPaar(false)} className={`rounded-xl px-4 py-3 text-sm font-bold border transition-all ${!paar ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}>Alleinstehend</button>
                  <button onClick={() => setPaar(true)} className={`rounded-xl px-4 py-3 text-sm font-bold border transition-all ${paar ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}>Paar</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Warmmiete / Monat (€)</label>
                <input type="number" value={warmmiete} onChange={(e) => setWarmmiete(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <p className="text-xs text-black/50 mt-1">Angemessene Kosten für Unterkunft und Heizung (Kaltmiete + Nebenkosten + Heizung).</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Anrechenbares Einkommen / Monat (€)</label>
                <input type="number" value={einkommen} onChange={(e) => setEinkommen(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <p className="text-xs text-black/50 mt-1">Z. B. gesetzliche Nettorente. Rente unklar? <Link href="/rentenpunkte-rechner" className="text-[#E60A1C] font-semibold hover:underline">Zum Rentenpunkte-Rechner</Link></p>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Home size={22} className="text-[#E60A1C]" /> Ihr möglicher Anspruch
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Vereinfachte Orientierung — maßgeblich ist das Sozialamt
            </div>
            <div className="bg-emerald-50 border border-emerald-500/25 rounded-2xl px-6 py-6 text-center mb-4">
              <div className="text-sm font-semibold text-black/60 mb-1">Möglicher Grundsicherungsanspruch / Monat</div>
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-emerald-600">{formatEUR(r.anspruch)}</div>
              {r.anspruch === 0 && <div className="text-xs text-black/50 mt-2">Ihr Einkommen deckt den Bedarf — kein Anspruch.</div>}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Regelbedarf</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.regelbedarf)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">+ Unterkunft & Heizung</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(warmmiete)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">= Gesamtbedarf</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.bedarf)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">− Anrechenbares Einkommen</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">−{formatEUR(einkommen)}</span>
              </div>
            </div>
            <Link href="/buergergeld-rechner" className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
              Erwerbsfähig? Zum Bürgergeld-Rechner <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Grundsicherung 2026: Anspruch & Höhe</h2>
          <p>
            Die <strong className="text-[#16181D]">Grundsicherung im Alter und bei Erwerbsminderung</strong> (SGB XII) sichert
            den Lebensunterhalt, wenn Einkommen und Vermögen nicht ausreichen. Sie setzt sich zusammen aus dem
            <strong className="text-[#16181D]"> Regelbedarf</strong> (2026: 563 € für Alleinstehende, je 506 € für Partner) und
            den <strong className="text-[#16181D]">angemessenen Kosten für Unterkunft und Heizung</strong>. Wegen der gesetzlichen
            Nullrunde bleiben die Regelbedarfe 2026 auf dem Niveau von 2025.
          </p>
          <p>
            Vom errechneten Gesamtbedarf wird Ihr anrechenbares Einkommen — vor allem die gesetzliche Rente — abgezogen. Die
            Differenz ist Ihr möglicher Anspruch. Wie hoch Ihre gesetzliche Rente ausfällt, können Sie vorab mit dem{" "}
            <Link href="/rentenpunkte-rechner" className="text-[#E60A1C] font-semibold hover:underline">Rentenpunkte-Rechner</Link>{" "}
            abschätzen. Erwerbsfähige Personen erhalten statt Grundsicherung das{" "}
            <Link href="/buergergeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Bürgergeld</Link>.
          </p>
          <p>
            Dieser Rechner ist eine vereinfachte Orientierung ohne Mehrbedarfe und Einkommensfreibeträge. Verbindlich entscheidet
            der zuständige Sozialhilfeträger (Sozialamt).
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zur Grundsicherung</h2>
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
