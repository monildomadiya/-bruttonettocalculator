"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Car, Calculator, Info, ChevronDown, ArrowRight } from "lucide-react";
import AdUnit from "@/components/AdUnit";
import { formatEUR } from "@/lib/taxCalculator";

const WK_PAUSCHALE = 1230; // Arbeitnehmer-Pauschbetrag 2026

const faqs = [
  { q: "Wie hoch ist die Pendlerpauschale 2026?", a: "Die Entfernungspauschale beträgt 0,30 € pro Entfernungskilometer für die ersten 20 km und 0,38 € ab dem 21. Kilometer — jeweils für die einfache Strecke (nicht Hin- und Rückweg) und pro Arbeitstag." },
  { q: "Zählt die einfache Strecke oder Hin- und Rückfahrt?", a: "Es zählt nur die einfache Entfernung zwischen Wohnung und erster Tätigkeitsstätte. Auch wer mit dem eigenen Auto fährt, rechnet nur eine Strecke pro Arbeitstag an." },
  { q: "Wirkt sich die Pendlerpauschale immer steuermindernd aus?", a: "Nur der Teil Ihrer Werbungskosten, der über dem Arbeitnehmer-Pauschbetrag von 1.230 € liegt, senkt zusätzlich die Steuer. Die ersten 1.230 € werden automatisch berücksichtigt, auch ohne Nachweis." },
  { q: "Welche Entfernung darf ich ansetzen?", a: "Grundsätzlich die kürzeste Straßenverbindung. Eine längere Strecke ist nur zulässig, wenn sie offensichtlich verkehrsgünstiger ist und regelmäßig genutzt wird." },
];

export default function PendlerpauschaleRechner() {
  const [km, setKm] = useState(25);
  const [tage, setTage] = useState(220);
  const [satz, setSatz] = useState(30);

  const r = useMemo(() => {
    const proTag = Math.min(km, 20) * 0.30 + Math.max(0, km - 20) * 0.38;
    const pauschale = proTag * tage;
    const ueberPauschbetrag = Math.max(0, pauschale - WK_PAUSCHALE);
    const ersparnisJahr = ueberPauschbetrag * (satz / 100);
    return { proTag, pauschale, ueberPauschbetrag, ersparnisJahr, ersparnisMonat: ersparnisJahr / 12 };
  }, [km, tage, satz]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Car size={14} /> Pendlerpauschale · Entfernungspauschale · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Pendlerpauschale{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Rechner</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie Ihre <strong className="text-[#16181D]">Entfernungspauschale</strong> und die
            mögliche <strong className="text-[#16181D]">Steuerersparnis</strong> — 0,30 € pro km, ab dem
            21. Kilometer 0,38 €.
          </p>
        </div>
      </section>

      <AdUnit placement="content" className="!mt-0 !mb-8" />

      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Ihr Arbeitsweg
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Entfernung (einfache Strecke, km)</label>
                <input type="number" value={km} onChange={(e) => setKm(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Arbeitstage pro Jahr</label>
                <input type="number" value={tage} onChange={(e) => setTage(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none" />
                <p className="text-xs text-black/50 mt-1">Üblich: ca. 220–230 Tage bei einer 5-Tage-Woche</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Ihr Grenzsteuersatz</label>
                <select value={satz} onChange={(e) => setSatz(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none">
                  <option value={14}>ca. 14 % (geringes Einkommen)</option>
                  <option value={20}>ca. 20 %</option>
                  <option value={30}>ca. 30 % (mittleres Einkommen)</option>
                  <option value={42}>42 % (Spitzensteuersatz)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Car size={22} className="text-[#E60A1C]" /> Ihre Entfernungspauschale
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Vereinfachte Berechnung — keine Steuerberatung
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Pauschale pro Arbeitstag</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.proTag)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Entfernungspauschale / Jahr</span>
                <span className="text-lg font-mono font-extrabold text-[#16181D]">{formatEUR(r.pauschale)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Davon über der 1.230-€-Pauschale</span>
                <span className="text-base font-mono font-extrabold text-[#16181D]">{formatEUR(r.ueberPauschbetrag)}</span>
              </div>
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Mögliche Steuerersparnis / Jahr</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-600">{formatEUR(r.ersparnisJahr)}</span>
              </div>
              <p className="text-xs text-black/55 px-1">
                Das entspricht rund <strong className="text-[#16181D]">{formatEUR(r.ersparnisMonat)}</strong> pro Monat.
                Die ersten 1.230 € Werbungskosten werden automatisch anerkannt — steuerwirksam ist nur der darüber liegende Teil.
              </p>
            </div>
            <Link href="/gehaltsrechner" className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
              Zum Gehaltsrechner <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Pendlerpauschale 2026: So funktioniert die Entfernungspauschale</h2>
          <p>
            Die <strong className="text-[#16181D]">Pendlerpauschale</strong> (offiziell Entfernungspauschale)
            senkt als <strong className="text-[#16181D]">Werbungskosten</strong> Ihr zu versteuerndes Einkommen.
            Sie beträgt <strong className="text-[#16181D]">0,30 € je Entfernungskilometer</strong> für die ersten
            20 km und <strong className="text-[#16181D]">0,38 € ab dem 21. Kilometer</strong> — pro Arbeitstag und
            nur für die einfache Strecke.
          </p>
          <p>
            Wichtig: Der <strong className="text-[#16181D]">Arbeitnehmer-Pauschbetrag von 1.230 €</strong> wird
            ohnehin automatisch anerkannt. Ihre tatsächliche Steuerersparnis entsteht erst, wenn Pendlerpauschale
            (plus weitere Werbungskosten) diese Grenze übersteigt. Die Ersparnis hängt dann von Ihrem persönlichen{" "}
            <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Grenzsteuersatz</Link> ab.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">Häufige Fragen zur Pendlerpauschale</h2>
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
