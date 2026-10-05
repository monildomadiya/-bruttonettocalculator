"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Calculator, Info, Sparkles } from "lucide-react";
import {
  LAENDER, WT, arbeitstage, brueckentage, feiertage, fmt, istWochenende, planen, wochentag, type Land,
} from "@/lib/feiertage";

const feld =
  "w-full bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none";
const JAHRE = [2026, 2027];

const tipp = (t: number) => {
  switch (wochentag(t)) {
    case 2: return "Brückentag: Montag davor";
    case 4: return "Brückentag: Freitag danach";
    case 3: return "2 Urlaubstage für 5 freie Tage";
    case 1: case 5: return "langes Wochenende, ohne Urlaub";
    default: return "fällt aufs Wochenende";
  }
};

export default function BrueckentageRechner() {
  const [jahr, setJahr] = useState(2027);
  const [land, setLand] = useState<Land>("NW");
  const [regional, setRegional] = useState(false);
  const [budget, setBudget] = useState(10);

  const ft = useMemo(() => feiertage(jahr, land, true), [jahr, land]);
  const optionen = useMemo(() => brueckentage(jahr, land, regional), [jahr, land, regional]);
  const plan = useMemo(() => planen(jahr, land, Math.max(1, Math.min(40, budget)), regional), [jahr, land, budget, regional]);
  const at = arbeitstage(jahr, land, regional);
  const hatRegional = ft.some((f) => f.regional);
  const landName = LAENDER.find((l) => l.code === land)?.name;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <CalendarDays size={14} /> Feiertage · Brückentage · Urlaubsplaner
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Brückentage{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">2027</span> berechnen
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Die besten Brückentage für Ihr Bundesland — und welche Urlaubstage aus Ihrem Kontingent{" "}
            <strong className="text-[#16181D]">die meisten freien Tage am Stück</strong> bringen.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-2 pb-12 sm:py-12">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9 mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
            <Calculator size={22} className="text-[#E60A1C]" /> Ihre Angaben
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="block text-sm font-semibold text-black/70 mb-2">Jahr</span>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Jahr">
                {JAHRE.map((j) => (
                  <button key={j} type="button" role="radio" aria-checked={jahr === j} onClick={() => setJahr(j)}
                    className={`rounded-xl px-3 py-3 text-sm font-bold border transition-colors ${jahr === j ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#FFFFFF] text-[#16181D] border-black/[0.10]"}`}>
                    {j}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="bt-land" className="block text-sm font-semibold text-black/70 mb-2">Bundesland</label>
              <select id="bt-land" value={land} onChange={(e) => setLand(e.target.value as Land)} className={feld}>
                {LAENDER.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="bt-budget" className="block text-sm font-semibold text-black/70 mb-2">Urlaubstage für den Planer</label>
              <input id="bt-budget" type="number" inputMode="numeric" min={1} max={40} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className={feld} />
            </div>
          </div>
          {hatRegional && (
            <label className="mt-4 flex items-center gap-2 text-sm text-black/75">
              <input type="checkbox" checked={regional} onChange={(e) => setRegional(e.target.checked)} />
              Regionale Feiertage einbeziehen ({ft.filter((f) => f.regional).map((f) => `${f.name}: ${f.regional}`).join("; ")})
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9" aria-live="polite">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <CalendarDays size={22} className="text-[#E60A1C]" /> Feiertage {jahr} in {landName}
            </h2>
            <p className="text-sm text-black/65 mb-4">{at} Arbeitstage bei einer Fünf-Tage-Woche.</p>
            <ul className="space-y-2">
              {ft.filter((f) => regional || !f.regional).map((f) => (
                <li key={f.t + f.name} className={`flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-xl px-4 py-2.5 border ${istWochenende(f.t) ? "bg-black/[0.02] border-black/[0.06] text-black/45" : "bg-white border-black/[0.08]"}`}>
                  <span className="font-mono text-sm w-[92px]">{WT[wochentag(f.t)]} {fmt(f.t, false)}</span>
                  <span className="text-sm font-semibold">{f.name}</span>
                  <span className="text-xs ml-auto text-black/55">{tipp(f.t)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-4 flex items-center gap-2">
                <Sparkles size={22} className="text-[#E60A1C]" /> Beste Brückentage
              </h2>
              {optionen.length === 0 && <p className="text-sm text-black/60">Keine lohnenden Brückentage — die Feiertage fallen aufs Wochenende oder auf Montag/Freitag.</p>}
              <ul className="space-y-2">
                {optionen.map((o) => (
                  <li key={`${o.von}-${o.bis}`} className="bg-white border border-black/[0.08] rounded-xl px-4 py-3">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="font-bold text-[#16181D]">{o.urlaub.length} {o.urlaub.length === 1 ? "Urlaubstag" : "Urlaubstage"} → {o.freieTage} Tage frei</span>
                      <span className="text-xs text-black/55 ml-auto">{o.feiertage.join(" & ")}</span>
                    </div>
                    <div className="text-xs text-black/65 mt-1">
                      {fmt(o.von)} – {fmt(o.bis)} · Urlaub: {o.urlaub.map((t) => `${WT[wochentag(t)]} ${fmt(t, false)}`).join(", ")}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2">Ihr Urlaubsplan</h2>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4 mb-3">
                <span className="text-black/80 text-sm font-semibold">{plan.urlaub} Urlaubstage → freie Tage am Stück</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-700 ml-auto">{plan.frei}</span>
              </div>
              <ul className="space-y-1.5 text-sm">
                {plan.bloecke.map((b) => (
                  <li key={`${b.von}-${b.bis}`} className="flex flex-wrap gap-x-3 bg-white border border-black/[0.08] rounded-lg px-3 py-2">
                    <span className="font-mono">{fmt(b.von, false)}–{fmt(b.bis)}</span>
                    <span className="text-black/60">{b.urlaub.length} Urlaub → {b.freieTage} frei</span>
                    <span className="text-black/50 ml-auto text-xs">{b.feiertage.length ? b.feiertage.join(" & ") : "Urlaubswoche"}</span>
                  </li>
                ))}
              </ul>
              <p className="flex gap-2 text-xs text-black/60 mt-3 leading-relaxed">
                <Info size={13} className="flex-shrink-0 mt-0.5" />
                Verteilt Ihre Urlaubstage so, dass möglichst viele freie Tage in zusammenhängenden Auszeiten entstehen — Brückentage
                rund um Feiertage und ganze Urlaubswochen. Schulferien und betriebliche Vorgaben sind nicht berücksichtigt.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
