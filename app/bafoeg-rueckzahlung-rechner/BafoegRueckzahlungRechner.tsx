"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GraduationCap, Calculator, Info, ChevronDown, ArrowRight, CalendarClock } from "lucide-react";
import { formatEUR } from "@/lib/taxCalculator";

// BAföG-Rückzahlung (Darlehensanteil), Stand 2026
const MAX_SCHULD = 10010;  // Höchstbetrag der Rückzahlung: 77 Raten × 130 €
const MIN_RATE = 130;      // Mindest-Monatsrate (vierteljährlich 390 €)
const MAX_RATEN = 77;

const faqs = [
  { q: "Wie viel BAföG muss ich zurückzahlen?", a: "Studierende erhalten ihr BAföG zur Hälfte als Zuschuss und zur Hälfte als zinsloses Staatsdarlehen. Wer erstmals ab August 2019 gefördert wurde, zahlt maximal 77 Raten zu je 130 € zurück — also höchstens 10.010 €. Alles darüber wird erlassen." },
  { q: "Wann beginnt die Rückzahlung?", a: "Die Rückzahlung startet 5 Jahre nach dem Ende der Förderungshöchstdauer. Das Bundesverwaltungsamt (BVA) schickt Ihnen rechtzeitig einen Feststellungs- und Rückzahlungsbescheid. Gezahlt wird vierteljährlich (3 × 130 € = 390 € pro Quartal)." },
  { q: "Wie hoch ist die monatliche Rate?", a: "Die Regelrate beträgt 130 € pro Monat (390 € pro Quartal). Sie können freiwillig mehr zahlen, um schneller schuldenfrei zu sein. Bei geringem Einkommen können Sie eine Freistellung von der Rückzahlung beantragen." },
  { q: "Lohnt sich die vorzeitige Rückzahlung?", a: "Ja, bei einer Ablösung auf einen Schlag gewährt das BVA einen Nachlass. Bei der Höchstschuld von 10.010 € werden bei sofortiger Volltilgung 21,5 % erlassen — Sie zahlen dann nur 7.857,85 €. Der genaue Nachlass hängt vom Ablösebetrag ab und wird nach der amtlichen Tabelle (§ 18b BAföG) berechnet." },
];

export default function BafoegRueckzahlungRechner() {
  const [schuld, setSchuld] = useState(10010);
  const [rate, setRate] = useState(130);

  const r = useMemo(() => {
    const rueckzahl = Math.min(Math.max(0, schuld), MAX_SCHULD);
    const erlassen = Math.max(0, schuld - MAX_SCHULD);
    const effRate = Math.max(rate, 1);
    const raten = rueckzahl > 0 ? Math.ceil(rueckzahl / effRate) : 0;
    const dauerJahre = raten / 12;
    const vierteljaehrlich = effRate * 3;
    return { rueckzahl, erlassen, raten, dauerJahre, vierteljaehrlich, effRate };
  }, [schuld, rate]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <GraduationCap size={14} /> BAföG · Rückzahlung · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            BAföG-Rückzahlung{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">2026</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Wie viel BAföG-Darlehen zahlen Sie zurück und wie lange? Der Rechner ermittelt aus Ihrer
            <strong className="text-[#16181D]"> Darlehensschuld</strong> die <strong className="text-[#16181D]">Anzahl der Raten</strong>
            {" "}und die <strong className="text-[#16181D]">Rückzahlungsdauer</strong> — Höchstbetrag 10.010 €.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Ihre Darlehensschuld
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">BAföG-Darlehen (€)</label>
                <input type="number" value={schuld} onChange={(e) => setSchuld(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <p className="text-xs text-black/50 mt-1">Das ist der Darlehensanteil (i. d. R. die Hälfte des erhaltenen BAföG). Rückzahlung ist bei max. 10.010 € gedeckelt.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Monatliche Rate (€)</label>
                <input type="number" min={MIN_RATE} value={rate} onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <p className="text-xs text-black/50 mt-1">Regelrate: 130 € / Monat (390 € pro Quartal). Höhere Raten verkürzen die Laufzeit.</p>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <CalendarClock size={22} className="text-[#E60A1C]" /> Ihre Rückzahlung
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Orientierung — verbindlich ist der Bescheid des Bundesverwaltungsamts
            </div>
            <div className="bg-emerald-50 border border-emerald-500/25 rounded-2xl px-6 py-6 text-center mb-4">
              <div className="text-sm font-semibold text-black/60 mb-1">Tatsächlich zurückzuzahlen</div>
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-emerald-600">{formatEUR(r.rueckzahl)}</div>
              {r.erlassen > 0 && <div className="text-xs text-emerald-700 mt-2">{formatEUR(r.erlassen)} über dem Höchstbetrag werden erlassen</div>}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Anzahl Monatsraten</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{r.raten}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Vierteljährliche Rate</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.vierteljaehrlich)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Rückzahlungsdauer</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">
                  {r.dauerJahre > 0 ? `${r.dauerJahre.toFixed(1).replace(".", ",")} Jahre` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/[0.06] border border-[#E60A1C]/20 rounded-xl px-5 py-3.5">
                <span className="text-black/70 text-sm font-medium">Bei Sofortzahlung (10.010 €)</span>
                <span className="text-base font-mono font-extrabold text-[#E60A1C]">≈ {formatEUR(7857.85)}</span>
              </div>
            </div>
            <Link href="/gehaltsrechner" className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
              Netto nach dem Studium berechnen <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">BAföG-Rückzahlung 2026: Das müssen Sie wissen</h2>
          <p>
            Studierende bekommen BAföG zur Hälfte als <strong className="text-[#16181D]">Zuschuss</strong> und zur Hälfte als
            <strong className="text-[#16181D]"> zinsloses Darlehen</strong>. Zurückgezahlt wird nur der Darlehensanteil — und das
            gedeckelt: Wer erstmals ab August 2019 gefördert wurde, zahlt höchstens <strong className="text-[#16181D]">77 Raten
            zu 130 €</strong>, also maximal <strong className="text-[#16181D]">10.010 €</strong>. Ein darüber hinausgehender Betrag
            wird vollständig erlassen.
          </p>
          <p>
            Die Rückzahlung beginnt 5 Jahre nach dem Ende der Förderungshöchstdauer und läuft über bis zu 20 Jahre. Wer alles auf
            einmal ablöst, spart durch einen <strong className="text-[#16181D]">Nachlass</strong> (bei der Höchstschuld 21,5 %). Bei
            geringem Einkommen ist eine Freistellung möglich. Was nach dem Studium netto übrig bleibt, zeigt Ihnen der{" "}
            <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Gehaltsrechner</Link>; Ihren
            BAföG-Anspruch selbst berechnen Sie im{" "}
            <Link href="/bafoeg-rechner" className="text-[#E60A1C] font-semibold hover:underline">BAföG-Rechner</Link>.
          </p>
          <p>
            Dieser Rechner liefert eine Orientierung. Verbindlich ist der Feststellungs- und Rückzahlungsbescheid des
            Bundesverwaltungsamts (BVA).
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zur BAföG-Rückzahlung</h2>
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
