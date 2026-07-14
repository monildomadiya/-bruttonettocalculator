"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Clock, Calculator, ChevronDown, ArrowRight, Info } from "lucide-react";
import AdUnit from "@/components/AdUnit";

const MINDESTLOHN_2026 = 13.90;
const MINDESTLOHN_2027_EXPECTED = 14.60;

const history = [
  { year: "2020", betrag: "9,35 €", change: "" },
  { year: "2021", betrag: "9,50 €", change: "+1,6 %" },
  { year: "2022 (Jul)", betrag: "10,45 €", change: "+10,0 %" },
  { year: "2023 (Jan)", betrag: "12,00 €", change: "+14,8 %" },
  { year: "2024 (Jan)", betrag: "12,41 €", change: "+3,4 %" },
  { year: "2025 (Jan)", betrag: "12,82 €", change: "+3,3 %" },
  { year: "2026 (Jan)", betrag: "13,90 €", change: "+8,4 %" },
  { year: "2027 (Jan)", betrag: "14,60 €", change: "+5,0 %" },
];

// Approximate net multipliers per Steuerklasse for estimation
const netMultipliers = [
  { klasse: "I", label: "Klasse I (ledig)", factor: 0.74 },
  { klasse: "III", label: "Klasse III (verheiratet)", factor: 0.83 },
  { klasse: "IV", label: "Klasse IV (verheiratet gleich)", factor: 0.74 },
  { klasse: "V", label: "Klasse V (verheiratet geringer)", factor: 0.62 },
];

const faqs = [
  {
    q: "Wie hoch ist der Mindestlohn 2026?",
    a: "Der gesetzliche Mindestlohn in Deutschland ist zum 1. Januar 2026 auf 13,90 € brutto pro Stunde gestiegen (zuvor 12,82 € in 2025).",
  },
  {
    q: "Wann kommt der neue Mindestlohn 2027?",
    a: "Die Bundesregierung hat die zweistufige Erhöhung der Mindestlohnkommission per Verordnung bereits beschlossen: Zum 1. Januar 2027 steigt der Mindestlohn auf 14,60 € brutto pro Stunde.",
  },
  {
    q: "Wie viel Netto bleibt vom Mindestlohn 2026 übrig?",
    a: "Bei Vollzeit (40 Std./Woche, 13,90 €/h) ergibt sich ein Bruttogehalt von ca. 2.409 €/Monat. In Steuerklasse I bleiben nach Abzügen etwa 1.724 € netto, in Steuerklasse III ca. 1.883 €.",
  },
  {
    q: "Gilt der Mindestlohn für alle Beschäftigten?",
    a: "Der gesetzliche Mindestlohn gilt grundsätzlich für alle Arbeitnehmer ab 18 Jahren. Ausnahmen gelten für Praktikanten (unter 3 Monate), Pflichtpraktika, Langzeitarbeitslose in den ersten 6 Monaten sowie Auszubildende.",
  },
  {
    q: "Was ist der Unterschied zwischen Mindestlohn brutto und netto?",
    a: "Der Mindestlohn von 13,90 € ist ein Bruttobetrag. Vom Bruttogehalt werden Lohnsteuer (abhängig von Steuerklasse) sowie Sozialversicherungsbeiträge (ca. 20 %) abgezogen. Das Netto variiert je nach Steuerklasse und persönlichen Abzügen.",
  },
];

function formatEuro(value: number): string {
  return value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

export default function MindestlohnCalculator() {
  const [stunden, setStunden] = useState(40);
  const [bruttoMonat, setBruttoMonat] = useState(0);
  const [bruttoJahr, setBruttoJahr] = useState(0);

  useEffect(() => {
    const monatsStunden = (stunden * 52) / 12;
    const monat = MINDESTLOHN_2026 * monatsStunden;
    const jahr = MINDESTLOHN_2026 * stunden * 52;
    setBruttoMonat(monat);
    setBruttoJahr(jahr);
  }, [stunden]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <TrendingUp size={14} />
            Trending +50% · Aktuell 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Mindestlohn Rechner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              2026/2027
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie Ihr monatliches Brutto- &amp; Nettogehalt beim gesetzlichen Mindestlohn
            von <strong className="text-[#16181D]">13,90&nbsp;€&nbsp;/&nbsp;Stunde</strong>. Alle
            Steuerklassen, Vollzeit &amp; Teilzeit.
          </p>
        </div>
      </section>

      {/* Ad — right below the hero */}
      <AdUnit placement="content" className="!mt-0 !mb-8" />

      {/* Interactive Calculator */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input card */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" />
              Mindestlohn berechnen
            </h2>

            {/* Stunden slider */}
            <div className="mb-6">
              <label htmlFor="stunden-slider" className="block text-sm font-semibold text-black/70 mb-2">
                Arbeitsstunden pro Woche
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="stunden-slider"
                  type="range"
                  min={1}
                  max={48}
                  value={stunden}
                  onChange={(e) => setStunden(Number(e.target.value))}
                  className="flex-1 accent-[#E60A1C] h-2 rounded-full"
                  aria-label="Arbeitsstunden pro Woche"
                />
                <div className="bg-[#E60A1C]/15 border border-[#E60A1C]/40 rounded-xl px-4 py-2 text-[#E60A1C] font-bold text-lg w-20 text-center">
                  {stunden}h
                </div>
              </div>
              <div className="flex justify-between text-xs text-black/40 mt-1">
                <span>Teilzeit</span>
                <span>Vollzeit 40h</span>
                <span>Überstunden</span>
              </div>
            </div>

            {/* Mindestlohn display */}
            <div className="bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-black/70 text-sm font-medium">Mindestlohn 2026</span>
                <span className="text-2xl font-extrabold text-[#16181D]">13,90 €&nbsp;/&nbsp;h</span>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Bruttogehalt / Monat</span>
                <span className="text-xl font-extrabold text-[#16181D]">{formatEuro(bruttoMonat)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Bruttogehalt / Jahr</span>
                <span className="text-xl font-extrabold text-[#16181D]">{formatEuro(bruttoJahr)}</span>
              </div>
            </div>
          </div>

          {/* Net estimates */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Clock size={22} className="text-[#E60A1C]" />
              Geschätztes Nettogehalt
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Schätzung — Für exakte Werte den Rechner nutzen
            </div>

            <div className="space-y-3">
              {netMultipliers.map((nm) => {
                const netto = bruttoMonat * nm.factor;
                return (
                  <div
                    key={nm.klasse}
                    className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4 hover:bg-black/[0.08] transition-colors"
                  >
                    <div>
                      <div className="text-[#16181D] font-semibold text-sm">{nm.label}</div>
                      <div className="text-black/40 text-xs mt-0.5">ca. {Math.round(nm.factor * 100)} % von Brutto</div>
                    </div>
                    <span className="text-lg font-extrabold text-emerald-600">
                      {formatEuro(netto)}
                    </span>
                  </div>
                );
              })}
            </div>

            <Link
              href="/"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              Exakt berechnen im Brutto-Netto-Rechner
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Mindestlohn 2027 preview */}
      <section className="max-w-6xl mx-auto px-5 py-4">
        <div className="bg-gradient-to-br from-black/5 to-black/[0.02] border border-black/[0.10] rounded-3xl p-7 sm:p-9">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex-1">
              <div className="text-xs font-mono uppercase tracking-widest text-[#E60A1C] mb-2">
                BESCHLOSSEN
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2">
                Mindestlohn 2027 — Was kommt?
              </h2>
              <p className="text-black/60 text-sm sm:text-base leading-relaxed">
                Die Bundesregierung hat die zweistufige Erhöhung der Mindestlohnkommission per Verordnung bereits beschlossen: Zum 1. Januar 2027 steigt der Mindestlohn auf{" "}
                <strong className="text-[#16181D]">
                  {MINDESTLOHN_2027_EXPECTED.toFixed(2).replace(".", ",")} €&nbsp;/&nbsp;h
                </strong>
                .
              </p>
            </div>
            <div className="bg-black/[0.04] border border-black/[0.08] rounded-2xl p-5 text-center min-w-[140px]">
              <div className="text-3xl font-extrabold text-[#16181D] mb-1">
                {MINDESTLOHN_2027_EXPECTED.toFixed(2).replace(".", ",")} €
              </div>
              <div className="text-xs text-black/50">ab 2027 / Stunde</div>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="max-w-6xl mx-auto px-5 py-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Mindestlohn-Historie 2020–2027
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-black/[0.08]">
          <table className="w-full text-sm sm:text-base">
            <thead>
              <tr className="bg-[#E60A1C]/15 border-b border-black/[0.08]">
                <th className="px-5 py-4 text-left font-bold text-[#16181D]">Jahr</th>
                <th className="px-5 py-4 text-right font-bold text-[#16181D]">Mindestlohn / Stunde</th>
                <th className="px-5 py-4 text-right font-bold text-[#16181D]">Veränderung</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-black/[0.05] hover:bg-black/[0.04] transition-colors ${
                    i % 2 === 0 ? "bg-[#F4F5F7]" : "bg-[#F4F5F7]"
                  }`}
                >
                  <td className="px-5 py-3.5 font-semibold text-black/80">{row.year}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-[#16181D]">{row.betrag}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-emerald-600">
                    {row.change || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
          Häufige Fragen zum Mindestlohn
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="px-6 pb-5 pt-1 text-black/65 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#E60A1C]/20 via-[#E60A1C]/10 to-transparent border border-[#E60A1C]/30 rounded-3xl p-8 sm:p-12 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#E60A1C]/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
              Genaues Nettogehalt berechnen
            </h2>
            <p className="text-black/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">
              Unser Brutto-Netto-Rechner berücksichtigt alle Faktoren: Steuerklasse, Kirchensteuer,
              Kinderfreibeträge, BKK-Zusatzbeitrag und mehr — für präzise Ergebnisse 2026.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-8 py-3.5 rounded-xl transition-all text-sm sm:text-base"
            >
              <Calculator size={18} />
              Jetzt Netto berechnen
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
