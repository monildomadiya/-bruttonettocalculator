"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Landmark, Calculator, ArrowRight, Info, ChevronDown } from "lucide-react";
import { formatEUR } from "@/lib/taxCalculator";
import {
  VERWANDTSCHAFT,
  ERBFALLKOSTENPAUSCHALE,
  berechneErbschaftsteuer,
} from "@/lib/erbschaftsteuer";

/**
 * Gemeinsamer Rechner für Erbschaft- und Schenkungsteuer. Beide Steuern teilen
 * Tarif und Steuerklassen; `modus` steuert die Unterschiede — den
 * Versorgungsfreibetrag (nur im Erbfall) und die Beschriftung.
 */
export type Modus = "erbschaft" | "schenkung";

export default function ErbschaftsteuerRechner({
  modus,
  faqs,
  content,
}: {
  modus: Modus;
  faqs: { q: string; a: string }[];
  content?: React.ReactNode;
}) {
  const istErbfall = modus === "erbschaft";

  const [vermoegen, setVermoegen] = useState(500000);
  const [verwandtKey, setVerwandtKey] = useState("kind");
  const [abzuege, setAbzuege] = useState(istErbfall ? ERBFALLKOSTENPAUSCHALE : 0);

  const result = useMemo(() => {
    const verwandtschaft =
      VERWANDTSCHAFT.find((v) => v.key === verwandtKey) ?? VERWANDTSCHAFT[1];
    return {
      ...berechneErbschaftsteuer({
        vermoegen,
        verwandtschaft,
        vonTodesWegen: istErbfall,
        abzuege,
      }),
      verwandtschaft,
    };
  }, [vermoegen, verwandtKey, abzuege, istErbfall]);

  const inputClass =
    "w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none";
  const labelClass = "block text-sm font-semibold text-black/70 mb-2";

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Landmark size={14} />
            {istErbfall ? "Erbschaftsteuer · ErbStG" : "Schenkungsteuer · ErbStG"}
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            {istErbfall ? "Erbschaftssteuer berechnen:" : "Schenkungssteuer berechnen:"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              Freibetrag, Steuersatz und was bleibt
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            {istErbfall
              ? "Wie viel Erbschaftssteuer fällt an? Der Rechner berücksichtigt Verwandtschaftsgrad, persönlichen Freibetrag, Versorgungsfreibetrag und den Härteausgleich."
              : "Wie viel Schenkungssteuer fällt an? Der Rechner berücksichtigt Verwandtschaftsgrad, persönlichen Freibetrag und den Härteausgleich — Freibeträge stehen alle zehn Jahre neu zu."}
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" />
              Ihre Angaben
            </h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="es-vermoegen" className={labelClass}>
                  {istErbfall ? "Wert des Nachlasses (€)" : "Wert der Schenkung (€)"}
                </label>
                <input
                  id="es-vermoegen"
                  type="number"
                  step="10000"
                  value={vermoegen}
                  onChange={(e) => setVermoegen(Number(e.target.value))}
                  className={inputClass}
                />
                <p className="text-xs text-black/50 mt-1.5">
                  Immobilien werden mit dem steuerlichen Verkehrswert angesetzt, nicht mit dem Kaufpreis.
                </p>
              </div>

              <div>
                <label htmlFor="es-verwandt" className={labelClass}>
                  {istErbfall ? "Verhältnis zum Erblasser" : "Verhältnis zum Schenker"}
                </label>
                <select
                  id="es-verwandt"
                  value={verwandtKey}
                  onChange={(e) => setVerwandtKey(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none"
                >
                  {VERWANDTSCHAFT.map((v) => (
                    <option key={v.key} value={v.key}>
                      {v.label}
                    </option>
                  ))}
                </select>
                {result.verwandtschaft.hinweis && (
                  <p className="text-xs text-amber-700/90 bg-amber-50 border border-amber-500/20 rounded-lg px-3 py-2 mt-2">
                    {result.verwandtschaft.hinweis}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="es-abzuege" className={labelClass}>
                  {istErbfall ? "Nachlassverbindlichkeiten & Kosten (€)" : "Übernommene Schulden (€)"}
                </label>
                <input
                  id="es-abzuege"
                  type="number"
                  step="1000"
                  value={abzuege}
                  onChange={(e) => setAbzuege(Number(e.target.value))}
                  className={inputClass}
                />
                <p className="text-xs text-black/50 mt-1.5">
                  {istErbfall
                    ? `Schulden des Erblassers, Bestattungs- und Nachlasskosten. Ohne Nachweis werden pauschal ${formatEUR(ERBFALLKOSTENPAUSCHALE)} anerkannt.`
                    : "Übernimmt der Beschenkte Schulden oder räumt ein Nießbrauchrecht ein, mindert das den steuerpflichtigen Wert."}
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Landmark size={22} className="text-[#E60A1C]" />
              {istErbfall ? "Ihre Erbschaftssteuer" : "Ihre Schenkungssteuer"}
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Vereinfachte Berechnung — keine Steuer- oder Rechtsberatung
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">
                  {istErbfall ? "Nachlasswert" : "Wert der Schenkung"}
                </span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEUR(result.vermoegen)}</span>
              </div>

              {result.abzuege > 0 && (
                <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                  <span className="text-black/70 text-sm font-medium">− Verbindlichkeiten &amp; Kosten</span>
                  <span className="text-lg font-extrabold text-[#16181D]">− {formatEUR(result.abzuege)}</span>
                </div>
              )}

              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">− Persönlicher Freibetrag</span>
                <span className="text-lg font-extrabold text-emerald-600">− {formatEUR(result.freibetrag)}</span>
              </div>

              {result.versorgungsfreibetrag > 0 && (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                  <span className="text-black/80 text-sm font-semibold">− Versorgungsfreibetrag</span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    − {formatEUR(result.versorgungsfreibetrag)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Steuerpflichtiger Erwerb</span>
                <span className="text-lg font-extrabold text-[#16181D]">
                  {formatEUR(result.steuerpflichtigerErwerb)}
                </span>
              </div>

              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-5">
                <div className="flex flex-col">
                  <span className="text-black/80 text-sm font-semibold">
                    {istErbfall ? "Erbschaftssteuer" : "Schenkungssteuer"}
                  </span>
                  <span className="text-xs text-black/55 mt-0.5">
                    Steuerklasse {result.verwandtschaft.steuerklasse}
                    {result.steuersatz > 0 && ` · ${(result.steuersatz * 100).toFixed(0)} %`}
                  </span>
                </div>
                <span className="text-3xl font-extrabold text-[#16181D]">{formatEUR(result.steuer)}</span>
              </div>

              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Das bleibt Ihnen</span>
                <span className="text-lg font-extrabold text-emerald-600">{formatEUR(result.netto)}</span>
              </div>

              {result.steuer === 0 && result.vermoegen > 0 && (
                <p className="text-xs text-emerald-800/90 bg-emerald-50 border border-emerald-500/20 rounded-xl px-4 py-3">
                  Der Freibetrag deckt den gesamten Erwerb ab — es fällt keine Steuer an.
                  {!istErbfall && " Nach zehn Jahren steht Ihnen der Freibetrag erneut in voller Höhe zu."}
                </p>
              )}

              {result.haerteausgleichAngewendet && (
                <p className="text-xs text-black/55 bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3">
                  Der Härteausgleich nach § 19 Abs. 3 ErbStG greift: Weil der Erwerb nur knapp über einer
                  Tarifstufe liegt, wird die Steuer gedeckelt.
                </p>
              )}
            </div>

            <Link
              href={istErbfall ? "/schenkungssteuer-rechner" : "/erbschaftssteuer-rechner"}
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              {istErbfall ? "Schenkung statt Erbe berechnen" : "Erbschaftssteuer berechnen"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {content}

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
          {istErbfall ? "Häufige Fragen zur Erbschaftssteuer" : "Häufige Fragen zur Schenkungssteuer"}
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 pt-1 text-black/65 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
