"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Landmark, Calculator, Info, ChevronDown, ArrowRight, Gift } from "lucide-react";
import { formatEUR } from "@/lib/taxCalculator";

// Riester-Förderung 2026 (§§ 79 ff. EStG) — Werte unverändert gegenüber Vorjahren
const GRUNDZULAGE = 175;        // €/Jahr
const KINDERZULAGE_AB_2008 = 300; // €/Jahr je Kind (geb. ab 2008)
const KINDERZULAGE_VOR_2008 = 185; // €/Jahr je Kind (geb. vor 2008)
const MIN_EIGENBEITRAG_PCT = 0.04; // 4 % des Vorjahres-Bruttos
const MAX_GEFOERDERT = 2100;    // Höchstbetrag inkl. Zulagen (€/Jahr)
const SOCKELBETRAG = 60;        // Mindest-Eigenbeitrag (€/Jahr)
const BERUFSEINSTEIGER_BONUS = 200; // einmalig, unter 25

const faqs = [
  { q: "Wie hoch ist die Riester-Zulage 2026?", a: "Die Grundzulage beträgt 175 € pro Jahr. Pro Kind kommen 300 € (geboren ab 2008) bzw. 185 € (geboren vor 2008) hinzu. Wer bei Vertragsabschluss unter 25 ist, erhält zusätzlich einen einmaligen Berufseinsteiger-Bonus von 200 €." },
  { q: "Wie viel muss ich selbst einzahlen?", a: "Für die volle Förderung müssen Sie insgesamt 4 % Ihres rentenversicherungspflichtigen Vorjahres-Bruttoeinkommens in den Vertrag einzahlen (maximal 2.100 € pro Jahr, inklusive Zulagen). Ihr Mindest-Eigenbeitrag ist dieser Gesamtbetrag abzüglich der Zulagen — mindestens jedoch der Sockelbetrag von 60 € pro Jahr." },
  { q: "Was passiert, wenn ich weniger einzahle?", a: "Zahlen Sie weniger als den Mindest-Eigenbeitrag, werden die staatlichen Zulagen anteilig gekürzt. Deshalb lohnt es sich, mindestens den vom Rechner ermittelten Eigenbeitrag einzuzahlen, um die volle Förderung mitzunehmen." },
  { q: "Lohnt sich Riester steuerlich?", a: "Zusätzlich zu den Zulagen können Sie Ihre Beiträge bis 2.100 € pro Jahr als Sonderausgaben absetzen. Das Finanzamt prüft automatisch (Günstigerprüfung), ob Zulagen oder Steuervorteil höher sind. Besonders für Familien mit Kindern und Gutverdiener ist die Förderquote oft attraktiv." },
];

export default function RiesterRechner() {
  const [vorjahresBrutto, setVorjahresBrutto] = useState(40000);
  const [kinderAb2008, setKinderAb2008] = useState(1);
  const [kinderVor2008, setKinderVor2008] = useState(0);
  const [unter25, setUnter25] = useState(false);

  const r = useMemo(() => {
    const kinderzulage = kinderAb2008 * KINDERZULAGE_AB_2008 + kinderVor2008 * KINDERZULAGE_VOR_2008;
    const zulagen = GRUNDZULAGE + kinderzulage; // wiederkehrend pro Jahr
    const bonus = unter25 ? BERUFSEINSTEIGER_BONUS : 0;

    const gesamtbeitrag = Math.min(MIN_EIGENBEITRAG_PCT * Math.max(0, vorjahresBrutto), MAX_GEFOERDERT);
    const mindesteigenbeitrag = Math.max(gesamtbeitrag - zulagen, SOCKELBETRAG);
    const gesamtSparleistung = mindesteigenbeitrag + zulagen;
    const foerderquote = gesamtSparleistung > 0 ? (zulagen / gesamtSparleistung) * 100 : 0;

    return {
      grundzulage: GRUNDZULAGE, kinderzulage, zulagen, bonus,
      mindesteigenbeitrag, eigenbeitragMonat: mindesteigenbeitrag / 12,
      gesamtSparleistung, foerderquote,
    };
  }, [vorjahresBrutto, kinderAb2008, kinderVor2008, unter25]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Landmark size={14} /> Riester-Rente · Zulagen · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Riester-Rechner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">2026</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie Ihre staatlichen <strong className="text-[#16181D]">Riester-Zulagen</strong> und den
            <strong className="text-[#16181D]"> Mindest-Eigenbeitrag</strong> für die volle Förderung —
            Grundzulage 175 €, Kinderzulage bis 300 € je Kind.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Ihre Angaben
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Bruttoeinkommen Vorjahr (€)</label>
                <input type="number" value={vorjahresBrutto} onChange={(e) => setVorjahresBrutto(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <p className="text-xs text-black/50 mt-1">Maßgeblich für die 4 %-Regel ist das rentenversicherungspflichtige Brutto des Vorjahres.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black/70 mb-2">Kinder (ab 2008)</label>
                  <input type="number" min={0} value={kinderAb2008} onChange={(e) => setKinderAb2008(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black/70 mb-2">Kinder (vor 2008)</label>
                  <input type="number" min={0} value={kinderVor2008} onChange={(e) => setKinderVor2008(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3">
                <input type="checkbox" checked={unter25} onChange={(e) => setUnter25(e.target.checked)} className="w-5 h-5 accent-[#E60A1C]" />
                <span className="text-sm font-semibold text-black/70">Unter 25 bei Vertragsabschluss (Berufseinsteiger-Bonus 200 €)</span>
              </label>
            </div>
          </div>

          {/* Result */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Gift size={22} className="text-[#E60A1C]" /> Ihre Riester-Förderung
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Orientierung — maßgeblich ist Ihr Vertrag & die Zulagenstelle (ZfA)
            </div>
            <div className="bg-emerald-50 border border-emerald-500/25 rounded-2xl px-6 py-6 text-center mb-4">
              <div className="text-sm font-semibold text-black/60 mb-1">Staatliche Zulagen pro Jahr</div>
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-emerald-600">{formatEUR(r.zulagen)}</div>
              <div className="text-xs text-black/50 mt-2">
                Grundzulage {formatEUR(r.grundzulage)} + Kinderzulage {formatEUR(r.kinderzulage)}
                {r.bonus > 0 && <> · einmalig {formatEUR(r.bonus)} Bonus</>}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Mindest-Eigenbeitrag / Jahr</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.mindesteigenbeitrag)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Eigenbeitrag / Monat</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.eigenbeitragMonat)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Gesamt in den Vertrag / Jahr</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.gesamtSparleistung)}</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/[0.06] border border-[#E60A1C]/20 rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Förderquote (Staat)</span>
                <span className="text-base font-mono font-extrabold text-[#E60A1C]">{r.foerderquote.toFixed(0)} %</span>
              </div>
            </div>
            <Link href="/rentenpunkte-rechner" className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
              Gesetzliche Rente berechnen <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Riester-Rente 2026: Zulagen & Eigenbeitrag</h2>
          <p>
            Die <strong className="text-[#16181D]">Riester-Rente</strong> wird durch direkte Zulagen und Steuervorteile gefördert.
            Die <strong className="text-[#16181D]">Grundzulage</strong> beträgt 175 € pro Jahr, die
            <strong className="text-[#16181D]"> Kinderzulage</strong> 300 € je Kind (geboren ab 2008) bzw. 185 € (vor 2008).
            Um die volle Förderung zu erhalten, müssen Sie insgesamt 4 % Ihres Vorjahres-Bruttos einzahlen (maximal 2.100 € pro Jahr,
            inklusive Zulagen).
          </p>
          <p>
            Ihr <strong className="text-[#16181D]">Mindest-Eigenbeitrag</strong> ist dieser Gesamtbetrag abzüglich der Zulagen —
            mindestens aber der Sockelbetrag von 60 € pro Jahr. Wer weniger einzahlt, dem werden die Zulagen anteilig gekürzt.
            Familien mit mehreren Kindern erreichen oft eine besonders hohe Förderquote. Wie viel netto Ihnen für die Altersvorsorge
            bleibt, sehen Sie im{" "}
            <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Gehaltsrechner</Link>; eine
            Alternative über den Arbeitgeber ist die{" "}
            <Link href="/bav-rechner" className="text-[#E60A1C] font-semibold hover:underline">betriebliche Altersvorsorge (bAV)</Link>.
          </p>
          <p>
            Dieser Rechner liefert eine unverbindliche Orientierung. Maßgeblich sind Ihr Vertrag und die Festsetzung durch die
            Zentrale Zulagenstelle für Altersvermögen (ZfA).
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zur Riester-Förderung</h2>
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
