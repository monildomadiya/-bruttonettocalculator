"use client";

import { useMemo, useState } from "react";
import { GraduationCap, Calculator, Info } from "lucide-react";
import { calculateNetto, formatEUR, AZUBI_GERINGVERDIENERGRENZE, type Steuerklasse } from "@/lib/taxCalculator";

/** Mindestausbildungsvergütung bei Ausbildungsbeginn 2026 (§ 17 BBiG, BIBB). */
const MINDEST_2026 = [
  { jahr: 1, betrag: 724 },
  { jahr: 2, betrag: 854 },
  { jahr: 3, betrag: 977 },
  { jahr: 4, betrag: 1014 },
];

export default function AzubiRechner() {
  const [brutto, setBrutto] = useState(1000);
  const [sk, setSk] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);
  const [kinderlos23, setKinderlos23] = useState(false);

  const r = useMemo(
    () =>
      calculateNetto({
        bruttoMonat: Math.max(0, brutto || 0),
        jahr: 2026,
        steuerklasse: sk,
        verheiratet: sk === 3 || sk === 4 || sk === 5,
        kinderlosUeber23: kinderlos23,
        kirche,
        auszubildend: true,
      }),
    [brutto, sk, kirche, kinderlos23],
  );
  const geringverdiener = brutto > 0 && brutto <= AZUBI_GERINGVERDIENERGRENZE;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <GraduationCap size={14} /> Ausbildung · Brutto Netto · 2026
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Ausbildung{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Brutto Netto Rechner</span>
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Was bleibt von der <strong className="text-[#16181D]">Ausbildungsvergütung</strong> netto? Mit den
            Azubi-Regeln: <strong className="text-[#16181D]">kein Midijob-Rabatt</strong> und die
            325-€-Geringverdienergrenze.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-2 pb-12 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Ihre Ausbildungsvergütung
            </h2>
            <div className="space-y-5">
              <div>
                <label htmlFor="azubi-brutto" className="block text-sm font-semibold text-black/70 mb-2">Brutto / Monat</label>
                <input
                  id="azubi-brutto"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={brutto}
                  onChange={(e) => setBrutto(Number(e.target.value))}
                  className="w-full bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
                <p className="mt-3 mb-2 text-xs font-semibold text-black/60">Mindestvergütung bei Ausbildungsbeginn 2026:</p>
                <div className="flex flex-wrap gap-2">
                  {MINDEST_2026.map((m) => (
                    <button
                      key={m.jahr}
                      type="button"
                      onClick={() => setBrutto(m.betrag)}
                      aria-pressed={brutto === m.betrag}
                      className="text-xs font-semibold text-[#E60A1C] bg-[#E60A1C]/10 border border-[#E60A1C]/20 rounded-lg px-2.5 py-1 hover:bg-[#E60A1C]/15 transition-colors"
                    >
                      {m.jahr}. Jahr: {m.betrag} €
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="azubi-sk" className="block text-sm font-semibold text-black/70 mb-2">Steuerklasse</label>
                <select
                  id="azubi-sk"
                  value={sk}
                  onChange={(e) => setSk(Number(e.target.value) as Steuerklasse)}
                  className="w-full bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none"
                >
                  <option value={1}>I — ledig (Regelfall)</option>
                  <option value={2}>II — alleinerziehend</option>
                  <option value={3}>III — verheiratet, Hauptverdiener</option>
                  <option value={4}>IV — verheiratet</option>
                  <option value={5}>V — verheiratet, Zweitverdiener</option>
                  <option value={6}>VI — Zweitjob</option>
                </select>
              </div>

              <div className="space-y-2.5">
                <label className="flex items-center gap-3 text-sm font-medium text-black/80 cursor-pointer">
                  <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="h-4 w-4 accent-[#E60A1C]" />
                  Kirchensteuerpflichtig
                </label>
                <label className="flex items-center gap-3 text-sm font-medium text-black/80 cursor-pointer">
                  <input type="checkbox" checked={kinderlos23} onChange={(e) => setKinderlos23(e.target.checked)} className="h-4 w-4 accent-[#E60A1C]" />
                  23 Jahre oder älter und kinderlos (+0,6 % Pflegeversicherung)
                </label>
              </div>
            </div>
          </div>

          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <GraduationCap size={22} className="text-[#E60A1C]" /> Netto in der Ausbildung
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Steuerjahr 2026, Ø-Zusatzbeitrag 2,9 % — keine Steuerberatung
            </div>
            <div className="space-y-3" aria-live="polite">
              {[
                { label: "Rentenversicherung", v: r.sv.rente / 12 },
                { label: "Arbeitslosenversicherung", v: r.sv.arbeitslosen / 12 },
                { label: "Krankenversicherung", v: r.sv.kranken / 12 },
                { label: "Pflegeversicherung", v: r.sv.pflege / 12 },
                { label: `Lohnsteuer & Soli (SK ${sk})${kirche ? " + Kirche" : ""}`, v: r.steuer.summeMonat },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3">
                  <span className="text-black/70 text-sm font-medium">{row.label}</span>
                  <span className="text-base font-mono font-extrabold text-[#16181D]">−{formatEUR(row.v)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Netto / Monat</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-600">{formatEUR(r.nettoMonat)}</span>
              </div>
              <p className="text-xs text-black/60 px-1 leading-relaxed">
                {geringverdiener
                  ? `Bis ${AZUBI_GERINGVERDIENERGRENZE} € im Monat zahlt Ihr Ausbildungsbetrieb alle Sozialabgaben allein — brutto ist hier netto, solange keine Lohnsteuer anfällt.`
                  : `Über ${AZUBI_GERINGVERDIENERGRENZE} € zahlen Azubis die vollen Arbeitnehmerbeiträge von Anfang an — den Midijob-Übergangsbereich gibt es für Auszubildende nicht.`}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
