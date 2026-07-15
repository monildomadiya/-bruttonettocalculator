"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GraduationCap, Calculator, Info, ChevronDown, ArrowRight } from "lucide-react";
import AdUnit from "@/components/AdUnit";
import { estFormel2026, formatEUR } from "@/lib/taxCalculator";

const faqs = [
  { q: "Welche Abgaben zahlt ein Werkstudent?", a: "Dank des Werkstudentenprivilegs zahlen Werkstudierende nur den Beitrag zur Rentenversicherung (9,3 % Arbeitnehmeranteil). Kranken-, Pflege- und Arbeitslosenversicherung entfallen, solange während der Vorlesungszeit nicht mehr als 20 Stunden pro Woche gearbeitet wird." },
  { q: "Muss ein Werkstudent Lohnsteuer zahlen?", a: "Nur wenn das zu versteuernde Jahreseinkommen über dem Grundfreibetrag (2026: 12.348 €) liegt. Viele Werkstudierende bleiben darunter und zahlen daher keine Lohnsteuer — bereits einbehaltene Lohnsteuer wird über die Steuererklärung erstattet." },
  { q: "Was ist die 20-Stunden-Regel?", a: "Werkstudierende dürfen während der Vorlesungszeit höchstens 20 Stunden pro Woche arbeiten, um das Werkstudentenprivileg zu behalten. In den Semesterferien ist mehr möglich. Wird die Grenze dauerhaft überschritten, entfällt die Beitragsbefreiung." },
  { q: "Bleibt ein Werkstudent familienversichert?", a: "In der Regel ja, sofern das regelmäßige Einkommen die Grenze für die Familienversicherung nicht übersteigt. Als Werkstudent ist man häufig aber ohnehin eigenständig studentisch versichert — das hängt vom Einzelfall ab." },
];

export default function WerkstudentRechner() {
  const [brutto, setBrutto] = useState(900);

  const r = useMemo(() => {
    const rvMonat = brutto * 0.093;
    const bruttoJahr = brutto * 12;
    const zvE = Math.max(0, bruttoJahr - rvMonat * 12 - 1230 - 36);
    const estJahr = estFormel2026(zvE);
    const lohnsteuerMonat = estJahr / 12;
    const netto = brutto - rvMonat - lohnsteuerMonat;
    return { rvMonat, lohnsteuerMonat, netto, quote: brutto > 0 ? (netto / brutto) * 100 : 0, ueberGrundfreibetrag: zvE > 0 };
  }, [brutto]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <GraduationCap size={14} /> Werkstudent · Brutto Netto · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Werkstudent{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Brutto-Netto-Rechner</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Als <strong className="text-[#16181D]">Werkstudent</strong> zahlen Sie nur den Rentenbeitrag —
            dank <strong className="text-[#16181D]">Werkstudentenprivileg</strong> keine Kranken-, Pflege- oder
            Arbeitslosenversicherung. So viel bleibt netto.
          </p>
        </div>
      </section>

      <AdUnit placement="content" className="!mt-0 !mb-8" />

      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Ihr Verdienst
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Bruttolohn / Monat</label>
                <input type="number" value={brutto} onChange={(e) => setBrutto(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {[600, 900, 1200, 1500].map((v) => (
                    <button key={v} type="button" onClick={() => setBrutto(v)}
                      className="text-xs font-semibold text-[#E60A1C] bg-[#E60A1C]/10 border border-[#E60A1C]/20 rounded-lg px-2.5 py-1 hover:bg-[#E60A1C]/15 transition-colors">{v} €</button>
                  ))}
                </div>
              </div>
              <div className="text-xs text-black/60 bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-4 leading-relaxed">
                Annahme: Steuerklasse I, Werkstudentenprivileg (max. 20 h/Woche in der Vorlesungszeit). Es fällt nur der
                Rentenversicherungsbeitrag von <strong className="text-[#16181D]">9,3 %</strong> an; Lohnsteuer erst über dem
                Grundfreibetrag (12.348 € / Jahr).
              </div>
            </div>
          </div>

          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <GraduationCap size={22} className="text-[#E60A1C]" /> Netto als Werkstudent
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Vereinfachte Berechnung — keine Steuerberatung
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Rentenversicherung (9,3 %)</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">−{formatEUR(r.rvMonat)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Lohnsteuer (SK I)</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">−{formatEUR(r.lohnsteuerMonat)}</span>
              </div>
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Netto / Monat</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-600">{formatEUR(r.netto)}</span>
              </div>
              <p className="text-xs text-black/55 px-1">
                {r.ueberGrundfreibetrag
                  ? "Ihr Verdienst liegt über dem Grundfreibetrag — es fällt Lohnsteuer an, die Sie ggf. über die Steuererklärung teils zurückholen."
                  : "Ihr Verdienst liegt unter dem Grundfreibetrag — bereits einbehaltene Lohnsteuer bekommen Sie über die Steuererklärung erstattet."}
                {" "}Netto-Quote: <strong className="text-[#16181D]">{r.quote.toFixed(0)} %</strong>.
              </p>
            </div>
            <Link href="/minijob-rechner" className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
              Minijob-Rechner ansehen <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Werkstudent: Was bleibt netto vom Brutto?</h2>
          <p>
            Das <strong className="text-[#16181D]">Werkstudentenprivileg</strong> macht die Beschäftigung
            besonders attraktiv: Werkstudierende sind von Kranken-, Pflege- und Arbeitslosenversicherung
            befreit und zahlen nur den Arbeitnehmeranteil zur <strong className="text-[#16181D]">Rentenversicherung
            (9,3 %)</strong>. Voraussetzung ist die <strong className="text-[#16181D]">20-Stunden-Regel</strong>:
            Während der Vorlesungszeit dürfen höchstens 20 Wochenstunden gearbeitet werden.
          </p>
          <p>
            <strong className="text-[#16181D]">Lohnsteuer</strong> fällt erst an, wenn das zu versteuernde
            Jahreseinkommen über dem Grundfreibetrag von 12.348 € (2026) liegt. Liegen Sie darunter, holen Sie
            einbehaltene Lohnsteuer über die Steuererklärung zurück. Verdienen Sie unter 603 € im Monat, kann
            auch ein <Link href="/minijob-rechner" className="text-[#E60A1C] font-semibold hover:underline">Minijob</Link> die
            günstigere Variante sein.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen für Werkstudenten</h2>
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
