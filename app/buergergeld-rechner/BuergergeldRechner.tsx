"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HandCoins, Home, Users, ArrowRight, Info, ChevronDown, Plus, Minus } from "lucide-react";

/* Regelbedarfsstufen 2026 (Nullrunde — Werte wie 2025, in €/Monat) */
const RBS = {
  single: 563,   // Stufe 1 — alleinstehend
  partner: 506,  // Stufe 2 — je Partner in Bedarfsgemeinschaft
  adult18plus: 451, // Stufe 3 — Erwachsene ohne eigenen Haushalt
  child14_17: 471, // Stufe 4
  child6_13: 390,  // Stufe 5
  child0_5: 357,   // Stufe 6
};

function eur(v: number): string {
  return v.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}
function eur2(v: number): string {
  return v.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
}

/* Erwerbstätigen-Freibetrag auf das Netto-Erwerbseinkommen (§ 11b SGB II, vereinfacht) */
function erwerbsFreibetrag(einkommen: number, mitKind: boolean): number {
  if (einkommen <= 0) return 0;
  let f = Math.min(einkommen, 100); // Grundfreibetrag 100 €
  if (einkommen > 100) f += (Math.min(einkommen, 520) - 100) * 0.2;
  if (einkommen > 520) f += (Math.min(einkommen, 1000) - 520) * 0.3;
  const obergrenze = mitKind ? 1500 : 1200;
  if (einkommen > 1000) f += (Math.min(einkommen, obergrenze) - 1000) * 0.1;
  return f;
}

function Stepper({ label, value, set, max = 8 }: { label: string; value: number; set: (n: number) => void; max?: number }) {
  return (
    <div className="flex items-center justify-between bg-[#F4F5F7] border border-black/[0.08] rounded-xl px-4 py-3">
      <span className="text-sm font-medium text-black/70">{label}</span>
      <div className="flex items-center gap-3">
        <button onClick={() => set(Math.max(0, value - 1))} className="w-8 h-8 rounded-lg bg-white border border-black/[0.12] flex items-center justify-center text-black/70 hover:border-[#E60A1C] hover:text-[#E60A1C] transition-colors"><Minus size={14} /></button>
        <span className="w-6 text-center font-bold text-[#16181D]">{value}</span>
        <button onClick={() => set(Math.min(max, value + 1))} className="w-8 h-8 rounded-lg bg-white border border-black/[0.12] flex items-center justify-center text-black/70 hover:border-[#E60A1C] hover:text-[#E60A1C] transition-colors"><Plus size={14} /></button>
      </div>
    </div>
  );
}

const faqs = [
  {
    q: "Wie hoch ist der Bürgergeld-Regelsatz 2026?",
    a: "Der Regelsatz für eine alleinstehende Person liegt 2026 bei 563 € im Monat (Nullrunde — wie 2025). Für Partner in einer Bedarfsgemeinschaft gelten je 506 €, für Kinder je nach Alter 357 € (0–5 Jahre), 390 € (6–13) bzw. 471 € (14–17). Hinzu kommen die tatsächlichen, angemessenen Kosten für Unterkunft und Heizung.",
  },
  {
    q: "Wird mein Einkommen auf das Bürgergeld angerechnet?",
    a: "Ja, Erwerbseinkommen wird angerechnet — allerdings gibt es Freibeträge: Die ersten 100 € bleiben komplett anrechnungsfrei, von 100–520 € bleiben 20 %, von 520–1.000 € 30 % und darüber (bis 1.200 € bzw. 1.500 € mit Kind) 10 % frei. Nur der Rest mindert Ihren Bürgergeld-Anspruch.",
  },
  {
    q: "Welche Wohnkosten übernimmt das Jobcenter?",
    a: "Das Jobcenter übernimmt die tatsächlichen Kosten der Unterkunft und Heizung (KdU), sofern sie angemessen sind. Die Angemessenheitsgrenzen legt jede Kommune individuell fest und hängen von Haushaltsgröße und Wohnort ab. Im ersten Jahr (Karenzzeit) werden die tatsächlichen Kosten meist voll anerkannt.",
  },
  {
    q: "Ist dieser Bürgergeld-Rechner verbindlich?",
    a: "Nein. Der Rechner liefert eine Orientierung auf Basis der Regelsätze 2026 und der Einkommensfreibeträge. Der tatsächliche Anspruch wird vom Jobcenter individuell festgestellt und kann durch Mehrbedarfe (z. B. Alleinerziehung, Schwangerschaft), Vermögen oder abweichende KdU-Grenzen abweichen.",
  },
];

export default function BuergergeldRechner() {
  const [paar, setPaar] = useState(false);
  const [kinder0_5, setK05] = useState(0);
  const [kinder6_13, setK613] = useState(0);
  const [kinder14_17, setK1417] = useState(0);
  const [erwachsene18, setE18] = useState(0);
  const [kdu, setKdu] = useState(650);
  const [einkommen, setEinkommen] = useState(0);

  const r = useMemo(() => {
    const regelPartner = paar ? RBS.partner * 2 : RBS.single;
    const regelKinder = kinder0_5 * RBS.child0_5 + kinder6_13 * RBS.child6_13 + kinder14_17 * RBS.child14_17;
    const regelErwachsene = erwachsene18 * RBS.adult18plus;
    const regelbedarf = regelPartner + regelKinder + regelErwachsene;
    const gesamtbedarf = regelbedarf + kdu;

    const mitKind = kinder0_5 + kinder6_13 + kinder14_17 > 0;
    const freibetrag = erwerbsFreibetrag(einkommen, mitKind);
    const anrechenbar = Math.max(0, einkommen - freibetrag);

    const anspruch = Math.max(0, gesamtbedarf - anrechenbar);
    return { regelbedarf, gesamtbedarf, freibetrag, anrechenbar, anspruch, personen: (paar ? 2 : 1) + erwachsene18 + kinder0_5 + kinder6_13 + kinder14_17 };
  }, [paar, kinder0_5, kinder6_13, kinder14_17, erwachsene18, kdu, einkommen]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <HandCoins size={14} /> Regelsatz 563 € · SGB II · 2026
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Bürgergeld-Rechner</span> 2026
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie Ihren voraussichtlichen <strong className="text-[#16181D]">Bürgergeld-Anspruch 2026</strong> —
            aus dem Regelbedarf Ihrer Bedarfsgemeinschaft, den Kosten für Unterkunft & Heizung und dem angerechneten
            Erwerbseinkommen inklusive Freibeträgen.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-7 sm:p-9 shadow-lg space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#16181D] mb-4 flex items-center gap-2"><Users size={20} className="text-[#E60A1C]" /> Bedarfsgemeinschaft</h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button onClick={() => setPaar(false)} className={`px-4 py-3 rounded-xl font-semibold text-sm border transition-all ${!paar ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}>Alleinstehend</button>
                <button onClick={() => setPaar(true)} className={`px-4 py-3 rounded-xl font-semibold text-sm border transition-all ${paar ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}>Paar</button>
              </div>
              <div className="space-y-2">
                <Stepper label="Kinder 0–5 Jahre" value={kinder0_5} set={setK05} />
                <Stepper label="Kinder 6–13 Jahre" value={kinder6_13} set={setK613} />
                <Stepper label="Kinder 14–17 Jahre" value={kinder14_17} set={setK1417} />
                <Stepper label="Weitere Erwachsene (18+)" value={erwachsene18} set={setE18} />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#16181D] mb-4 flex items-center gap-2"><Home size={20} className="text-[#E60A1C]" /> Wohnen & Einkommen</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black/70 mb-2">Kosten Unterkunft + Heizung (Warmmiete) / Monat</label>
                  <div className="relative">
                    <input type="number" value={kdu} onChange={(e) => setKdu(Math.max(0, Number(e.target.value)))} className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 pr-10 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-bold">€</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black/70 mb-2">Netto-Erwerbseinkommen / Monat</label>
                  <div className="relative">
                    <input type="number" value={einkommen} onChange={(e) => setEinkommen(Math.max(0, Number(e.target.value)))} className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 pr-10 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-bold">€</span>
                  </div>
                  {einkommen > 0 && (
                    <p className="text-xs text-emerald-600 mt-2">Davon anrechnungsfrei (Freibetrag): {eur2(r.freibetrag)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-7 sm:p-9 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2"><HandCoins size={22} className="text-[#E60A1C]" /> Ihr Bürgergeld 2026</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Regelbedarf ({r.personen} {r.personen === 1 ? "Person" : "Personen"})</span>
                <span className="text-lg font-extrabold text-[#16181D] font-mono">{eur2(r.regelbedarf)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">+ Unterkunft & Heizung</span>
                <span className="text-lg font-extrabold text-[#16181D] font-mono">{eur2(kdu)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">− Anrechenbares Einkommen</span>
                <span className="text-lg font-extrabold text-rose-600 font-mono">{eur2(r.anrechenbar)}</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-5">
                <span className="text-black/80 text-sm font-semibold">Voraussichtlicher Anspruch / Monat</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#E60A1C] font-mono">{eur2(r.anspruch)}</span>
              </div>
            </div>
            {r.anspruch <= 0 && (einkommen > 0) && (
              <p className="text-xs text-amber-600 mt-4 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2.5">
                Ihr Einkommen deckt den Gesamtbedarf — voraussichtlich besteht kein Bürgergeld-Anspruch. Prüfen Sie
                ggf. Wohngeld oder den Kinderzuschlag als Alternative.
              </p>
            )}
            <div className="flex items-center gap-2 mt-4 text-xs text-black/50 bg-[#F4F5F7] border border-black/[0.08] rounded-xl px-3 py-2.5">
              <Info size={13} className="flex-shrink-0 text-[#E60A1C]" /> Orientierungswert. Mehrbedarfe & Vermögen nicht berücksichtigt.
            </div>
          </div>
        </div>
      </section>

      {/* SEO content */}
      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Bürgergeld 2026: Regelsätze & Anspruch</h2>
          <p>
            Das <strong className="text-[#16181D]">Bürgergeld</strong> (Grundsicherung nach dem SGB II) sichert den
            Lebensunterhalt, wenn das Einkommen nicht ausreicht. Es besteht aus dem <strong className="text-[#16181D]">Regelbedarf</strong>{" "}
            und den <strong className="text-[#16181D]">Kosten der Unterkunft und Heizung (KdU)</strong>. Für 2026 gilt eine
            Nullrunde — die Regelsätze bleiben auf dem Niveau von 2025.
          </p>
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-2xl p-5 overflow-x-auto">
            <table className="w-full text-sm min-w-[420px]">
              <tbody className="divide-y divide-black/10">
                {[
                  ["Alleinstehende (Regelbedarfsstufe 1)", RBS.single],
                  ["Paare, je Partner (Stufe 2)", RBS.partner],
                  ["Erwachsene ohne eigenen Haushalt (Stufe 3)", RBS.adult18plus],
                  ["Jugendliche 14–17 Jahre (Stufe 4)", RBS.child14_17],
                  ["Kinder 6–13 Jahre (Stufe 5)", RBS.child6_13],
                  ["Kinder 0–5 Jahre (Stufe 6)", RBS.child0_5],
                ].map(([label, val]) => (
                  <tr key={label as string}>
                    <td className="py-2.5 text-black/70">{label}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-[#16181D]">{eur(val as number)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Wer arbeitet, darf einen Teil des Einkommens behalten: Die <strong className="text-[#16181D]">Erwerbstätigenfreibeträge</strong>{" "}
            sorgen dafür, dass sich Arbeit lohnt. Wenn Sie prüfen möchten, wie viel Ihnen netto vom Job bleibt, nutzen Sie
            unseren <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Gehaltsrechner</Link>.
            Für ehemals Beschäftigte kann auch der <Link href="/arbeitslosengeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Arbeitslosengeld-Rechner (ALG I)</Link> relevant sein.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zum Bürgergeld</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#FFFFFF] border border-black/[0.08] rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 pt-1 text-black/65 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#E60A1C]/20 via-[#E60A1C]/10 to-transparent border border-[#E60A1C]/30 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">Weitere Sozialleistungs-Rechner</h2>
          <p className="text-black/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">Arbeitslosengeld, Elterngeld, Minijob & mehr — kostenlos für 2026.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/arbeitslosengeld-rechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.08] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">Arbeitslosengeld-Rechner</Link>
            <Link href="/elterngeld-rechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.08] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">Elterngeld-Rechner</Link>
            <Link href="/" className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"><HandCoins size={16} /> Brutto-Netto-Rechner <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
