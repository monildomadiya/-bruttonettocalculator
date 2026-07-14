"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Landmark, Percent, ArrowRight, Info, ChevronDown, Users, User } from "lucide-react";
import AdUnit from "@/components/AdUnit";
import { estFormel2026, soliBerechnen } from "@/lib/taxCalculator";

function eur(v: number): string {
  return v.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
}
function pct(v: number): string {
  return v.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " %";
}

const faqs = [
  {
    q: "Wie wird die Einkommensteuer 2026 berechnet?",
    a: "Die Einkommensteuer wird auf das zu versteuernde Einkommen (zvE) nach dem Tarif § 32a EStG angewendet. Bis zum Grundfreibetrag von 12.348 € (2026) fällt keine Steuer an. Danach steigt der Steuersatz progressiv von 14 % bis zum Spitzensteuersatz von 42 % (ab 69.879 € zvE) bzw. 45 % Reichensteuer (ab 277.826 €).",
  },
  {
    q: "Was ist der Unterschied zwischen Grund- und Splittingtarif?",
    a: "Der Grundtarif gilt für Einzelveranlagung (Ledige). Beim Splittingtarif für zusammen veranlagte Ehepaare wird das gemeinsame zvE halbiert, die Steuer darauf berechnet und anschließend verdoppelt. Das senkt die Steuerlast, wenn die Partner unterschiedlich viel verdienen.",
  },
  {
    q: "Was ist der Grenzsteuersatz?",
    a: "Der Grenzsteuersatz gibt an, mit wie viel Prozent der jeweils nächste verdiente Euro besteuert wird. Der Durchschnittssteuersatz ist dagegen die tatsächliche Steuerlast im Verhältnis zum gesamten zu versteuernden Einkommen — er liegt immer unter dem Grenzsteuersatz.",
  },
  {
    q: "Muss ich Solidaritätszuschlag zahlen?",
    a: "Seit 2021 zahlen rund 90 % der Steuerpflichtigen keinen Soli mehr. Er fällt 2026 erst ab einer Einkommensteuer von 19.950 € (Einzelveranlagung) bzw. 39.900 € (Splitting) an und steigt in einer Milderungszone gleitend auf 5,5 % an.",
  },
];

export default function EinkommensteuerRechner() {
  const [zve, setZve] = useState(45000);
  const [zusammen, setZusammen] = useState(false);
  const [kirche, setKirche] = useState(false);
  const [ksSatz, setKsSatz] = useState(0.09);

  const r = useMemo(() => {
    const est = zusammen ? 2 * estFormel2026(zve / 2) : estFormel2026(zve);
    const soli = soliBerechnen(est, zusammen);
    const ks = kirche ? est * ksSatz : 0;
    const gesamt = est + soli + ks;
    const netto = zve - gesamt;
    const durchschnitt = zve > 0 ? (est / zve) * 100 : 0;
    // Marginal rate via finite difference (robust across tarif zones)
    const base = zusammen ? 2 * estFormel2026(zve / 2) : estFormel2026(zve);
    const nextE = zusammen ? 2 * estFormel2026((zve + 2) / 2) : estFormel2026(zve + 2);
    const grenz = Math.max(0, (nextE - base) / 2) * 100;
    return { est, soli, ks, gesamt, netto, durchschnitt, grenz };
  }, [zve, zusammen, kirche, ksSatz]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Landmark size={14} /> § 32a EStG · Steuerjahr 2026
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Einkommensteuer-Rechner</span> 2026
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie Ihre <strong className="text-[#16181D]">Einkommensteuer</strong> für 2026 aus dem zu
            versteuernden Einkommen — mit Grund- oder Splittingtarif, Solidaritätszuschlag, Kirchensteuer sowie
            Grenz- und Durchschnittssteuersatz. Der kostenlose <strong className="text-[#16181D]">Steuerrechner</strong>{" "}
            nach § 32a EStG.
          </p>
        </div>
      </section>

      {/* Ad — right below the hero */}
      <AdUnit placement="content" className="!mt-0 !mb-8" />

      {/* Calculator */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-7 sm:p-9 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Landmark size={22} className="text-[#E60A1C]" /> Ihre Angaben
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Zu versteuerndes Einkommen (pro Jahr)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={zve}
                    onChange={(e) => setZve(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 pr-12 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-bold">€</span>
                </div>
                <input
                  type="range" min={0} max={150000} step={500} value={Math.min(zve, 150000)}
                  onChange={(e) => setZve(Number(e.target.value))}
                  className="w-full mt-3 accent-[#E60A1C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Veranlagung</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setZusammen(false)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm border transition-all ${!zusammen ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}
                  >
                    <User size={16} /> Einzel (Grundtarif)
                  </button>
                  <button
                    onClick={() => setZusammen(true)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm border transition-all ${zusammen ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}
                  >
                    <Users size={16} /> Zusammen (Splitting)
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                  <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                  Kirchensteuerpflichtig
                </label>
                {kirche && (
                  <div className="flex gap-2 pl-6">
                    <button onClick={() => setKsSatz(0.09)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${ksSatz === 0.09 ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}>9 % (Standard)</button>
                    <button onClick={() => setKsSatz(0.08)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${ksSatz === 0.08 ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#F4F5F7] text-black/70 border-black/[0.10]"}`}>8 % (BW/BY)</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-7 sm:p-9 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Percent size={22} className="text-[#E60A1C]" /> Ihre Steuerlast 2026
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Einkommensteuer</span>
                <span className="text-lg font-extrabold text-[#16181D] font-mono">{eur(r.est)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Solidaritätszuschlag</span>
                <span className="text-lg font-extrabold text-[#16181D] font-mono">{eur(r.soli)}</span>
              </div>
              {kirche && (
                <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                  <span className="text-black/70 text-sm font-medium">Kirchensteuer</span>
                  <span className="text-lg font-extrabold text-[#16181D] font-mono">{eur(r.ks)}</span>
                </div>
              )}
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Steuer gesamt / Jahr</span>
                <span className="text-2xl font-extrabold text-[#E60A1C] font-mono">{eur(r.gesamt)}</span>
              </div>
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Netto (nach Steuern)</span>
                <span className="text-xl font-extrabold text-emerald-600 font-mono">{eur(r.netto)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-xl px-4 py-3 text-center">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-black/50 mb-1">Grenzsteuersatz</div>
                  <div className="text-lg font-extrabold text-[#16181D] font-mono">{pct(r.grenz)}</div>
                </div>
                <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-xl px-4 py-3 text-center">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-black/50 mb-1">Ø-Steuersatz</div>
                  <div className="text-lg font-extrabold text-[#16181D] font-mono">{pct(r.durchschnitt)}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-5 text-xs text-black/50 bg-[#F4F5F7] border border-black/[0.08] rounded-xl px-3 py-2.5">
              <Info size={13} className="flex-shrink-0 text-[#E60A1C]" />
              Berechnung auf Basis des zu versteuernden Einkommens (nach Abzug von Freibeträgen & Werbungskosten).
            </div>
          </div>
        </div>
      </section>

      {/* SEO content */}
      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Einkommensteuer 2026: Tarif & Berechnung</h2>
          <p>
            Die <strong className="text-[#16181D]">Einkommensteuer</strong> ist die wichtigste Steuer in Deutschland. Sie
            wird auf das <strong className="text-[#16181D]">zu versteuernde Einkommen (zvE)</strong> erhoben — also auf das
            Einkommen nach Abzug von Werbungskosten, Sonderausgaben und Freibeträgen. Unser{" "}
            <strong className="text-[#16181D]">Einkommensteuer-Rechner</strong> nutzt die amtliche Tarifformel nach § 32a
            EStG in der Fassung ab 2026.
          </p>
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-2xl p-5">
            <h3 className="text-base font-bold text-[#16181D] mb-2">Die Tarifzonen 2026 im Überblick</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong className="text-[#16181D]">bis 12.348 €</strong> — Grundfreibetrag, 0 % Steuer</li>
              <li><strong className="text-[#16181D]">12.349 – 17.799 €</strong> — Progressionszone 1 (14 % → 24 %)</li>
              <li><strong className="text-[#16181D]">17.800 – 69.878 €</strong> — Progressionszone 2 (24 % → 42 %)</li>
              <li><strong className="text-[#16181D]">69.879 – 277.825 €</strong> — Spitzensteuersatz 42 %</li>
              <li><strong className="text-[#16181D]">ab 277.826 €</strong> — Reichensteuer 45 %</li>
            </ul>
          </div>
          <p>
            Wenn Sie nicht das zu versteuernde Einkommen, sondern Ihr monatliches Bruttogehalt kennen, nutzen Sie besser
            den <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner</Link> oder
            den <Link href="/lohnsteuerrechner" className="text-[#E60A1C] font-semibold hover:underline">Lohnsteuerrechner</Link> —
            diese berücksichtigen zusätzlich die Sozialabgaben und die Steuerklasse.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zur Einkommensteuer</h2>
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

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#E60A1C]/20 via-[#E60A1C]/10 to-transparent border border-[#E60A1C]/30 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">Mehr Steuer- & Gehaltsrechner</h2>
          <p className="text-black/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">Gehaltsrechner, Lohnsteuerrechner, Steuerklassen-Vergleich & mehr — kostenlos für 2026.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/gehaltsrechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.08] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">Gehaltsrechner</Link>
            <Link href="/lohnsteuerrechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.08] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">Lohnsteuerrechner</Link>
            <Link href="/" className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"><Landmark size={16} /> Brutto-Netto-Rechner <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
