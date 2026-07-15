"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Users, Calculator, ArrowRight, Info, ChevronDown, CheckCircle2 } from "lucide-react";
import AdUnit from "@/components/AdUnit";
import { calculateNetto, estFormel2026, soliBerechnen, formatEUR } from "@/lib/taxCalculator";

const faqs = [
  {
    q: "Steuerklasse 3/5 oder 4/4 — was ist besser?",
    a: "Für das monatliche Netto lohnt sich die Kombination III/V, wenn ein Partner deutlich mehr verdient: Der Hauptverdiener zahlt in Klasse III wenig Lohnsteuer, der Partner in Klasse V mehr. Aufs Jahr gerechnet ist die Steuerlast bei allen Kombinationen gleich — die Differenz wird spätestens bei der Steuererklärung ausgeglichen. IV/IV mit Faktor verteilt die Last am fairsten und vermeidet Nachzahlungen.",
  },
  {
    q: "Führt Steuerklasse III/V zu einer Nachzahlung?",
    a: "Häufig ja. Weil in III/V unterm Strich zu wenig Lohnsteuer einbehalten wird, ist bei III/V-Paaren eine Steuererklärung Pflicht und es kann zu einer Nachzahlung kommen. Der Vorteil ist rein die höhere monatliche Liquidität.",
  },
  {
    q: "Was ist das Faktorverfahren (IV/IV mit Faktor)?",
    a: "Beim Faktorverfahren berechnet das Finanzamt einen Faktor kleiner 1, der die voraussichtliche gemeinsame Jahressteuer möglichst genau auf beide Partner verteilt. Das monatliche Netto entspricht dann fast exakt dem, was nach dem Ehegattensplitting tatsächlich fällig ist — Nachzahlungen werden weitgehend vermieden.",
  },
  {
    q: "Wie oft kann man die Steuerklasse wechseln?",
    a: "Seit 2020 ist ein Steuerklassenwechsel mehrmals im Jahr möglich. Der Antrag wird beim Finanzamt gestellt (auch online über ELSTER) und gilt in der Regel ab dem Folgemonat.",
  },
];

function Card({ title, value, sub, best }: { title: string; value: string; sub?: string; best?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${best ? "bg-emerald-50 border-emerald-500/30" : "bg-[#FFFFFF] border-black/[0.10]"}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-mono uppercase tracking-wider text-black/50">{title}</span>
        {best && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600"><CheckCircle2 size={12} /> Meiste Liquidität</span>}
      </div>
      <div className={`font-mono font-extrabold text-2xl ${best ? "text-emerald-600" : "text-[#16181D]"}`}>{value}</div>
      {sub && <div className="text-xs text-black/55 mt-1">{sub}</div>}
    </div>
  );
}

export default function SteuerklassenwechselRechner() {
  const [bruttoA, setBruttoA] = useState(4500);
  const [bruttoB, setBruttoB] = useState(2500);
  const [kirche, setKirche] = useState(false);

  const r = useMemo(() => {
    // Höher-/Geringverdiener bestimmen
    const hoch = Math.max(bruttoA, bruttoB);
    const gering = Math.min(bruttoA, bruttoB);

    const opt = (brutto: number, sk: 3 | 4 | 5) =>
      calculateNetto({ bruttoMonat: brutto, jahr: 2026, verheiratet: sk === 3 || sk === 5, kinderlosUeber23: false, kirche, steuerklasse: sk });

    // IV/IV: jeder im Grundtarif
    const a4 = opt(hoch, 4), b4 = opt(gering, 4);
    const nettoIVIV = a4.nettoMonat + b4.nettoMonat;

    // III/V: Hauptverdiener III, Partner V
    const a3 = opt(hoch, 3), b5 = opt(gering, 5);
    const nettoIIIV = a3.nettoMonat + b5.nettoMonat;

    // IV/IV mit Faktor ≈ tatsächliche Jahressteuer nach Splitting / 12
    const zvE = a4.steuer.zvE + b4.steuer.zvE;
    const estSplitJahr = 2 * estFormel2026(zvE / 2);
    const soliJahr = soliBerechnen(estSplitJahr, true);
    const kircheJahr = kirche ? estSplitJahr * 0.09 : 0;
    const jahresSteuer = estSplitJahr + soliJahr + kircheJahr;
    const svMonat = a4.sv.summeMonat + b4.sv.summeMonat;
    const nettoFaktor = (hoch + gering) - svMonat - jahresSteuer / 12;

    const best = Math.max(nettoIVIV, nettoIIIV, nettoFaktor);
    return { nettoIVIV, nettoIIIV, nettoFaktor, best, diffMonat: nettoIIIV - nettoIVIV };
  }, [bruttoA, bruttoB, kirche]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Users size={14} /> Steuerklassenwechsel · Ehepaare · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Steuerklassen{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">3/5 oder 4/4</span>
            {" "}Rechner
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie für Ihr Ehepaar, welche Steuerklassen-Kombination das meiste monatliche
            Netto bringt — <strong className="text-[#16181D]">III/V</strong>,{" "}
            <strong className="text-[#16181D]">IV/IV</strong> oder{" "}
            <strong className="text-[#16181D]">IV/IV mit Faktor</strong>.
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
                <label className="block text-sm font-semibold text-black/70 mb-2">Bruttogehalt Partner A / Monat</label>
                <input type="number" value={bruttoA} onChange={(e) => setBruttoA(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Bruttogehalt Partner B / Monat</label>
                <input type="number" value={bruttoB} onChange={(e) => setBruttoB(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                Kirchensteuer berücksichtigen
              </label>
            </div>
          </div>

          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Users size={22} className="text-[#E60A1C]" /> Gemeinsames Netto / Monat
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Vereinfachte Berechnung — keine Steuerberatung
            </div>
            <div className="space-y-3">
              <Card title="Steuerklasse III / V" value={formatEUR(r.nettoIIIV)} best={r.nettoIIIV === r.best} sub="Hauptverdiener III, Partner V" />
              <Card title="Steuerklasse IV / IV" value={formatEUR(r.nettoIVIV)} best={r.nettoIVIV === r.best} sub="Beide im Grundtarif" />
              <Card title="IV / IV mit Faktor" value={formatEUR(r.nettoFaktor)} best={r.nettoFaktor === r.best} sub="Entspricht der echten Jahressteuer" />
            </div>
            <p className="text-xs text-black/55 mt-4 px-1">
              III/V bringt hier{" "}
              <strong className="text-[#16181D]">{formatEUR(Math.abs(r.diffMonat))} {r.diffMonat >= 0 ? "mehr" : "weniger"}</strong>{" "}
              monatliche Liquidität als IV/IV — die Jahressteuer ist jedoch identisch und wird bei der Steuererklärung ausgeglichen.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Steuerklassenwechsel: III/V, IV/IV oder Faktor?</h2>
          <p>
            Verheiratete und eingetragene Lebenspartner können zwischen den Kombinationen{" "}
            <strong className="text-[#16181D]">III/V</strong>, <strong className="text-[#16181D]">IV/IV</strong> und{" "}
            <strong className="text-[#16181D]">IV/IV mit Faktor</strong> wählen. Wichtig: Die{" "}
            <strong className="text-[#16181D]">gesamte Jahressteuer ist in allen Fällen gleich</strong> — sie wird
            durch das Ehegattensplitting bestimmt. Die Steuerklasse regelt nur, wie viel Lohnsteuer{" "}
            <em>monatlich</em> einbehalten wird.
          </p>
          <p>
            <strong className="text-[#16181D]">III/V</strong> lohnt sich für die monatliche Liquidität, wenn die
            Einkommen stark auseinanderliegen — führt aber oft zu einer Nachzahlung.{" "}
            <strong className="text-[#16181D]">IV/IV</strong> ist neutral, kann bei ungleichen Einkommen aber zu
            viel einbehalten. <strong className="text-[#16181D]">IV/IV mit Faktor</strong> trifft die echte
            Jahressteuer am genauesten. Prüfen Sie Ihr individuelles Nettogehalt zusätzlich mit dem{" "}
            <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Gehaltsrechner</Link>.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zum Steuerklassenwechsel</h2>
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

      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#E60A1C]/20 via-[#E60A1C]/10 to-transparent border border-[#E60A1C]/30 rounded-3xl p-8 sm:p-12 text-center">
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">Weitere Rechner</h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/steuerklassen" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">Steuerklassen erklärt</Link>
              <Link href="/gehaltsrechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">Gehaltsrechner</Link>
              <Link href="/" className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"><Calculator size={16} /> Brutto-Netto-Rechner</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
