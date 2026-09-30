"use client";

import { useMemo, useState } from "react";
import { PiggyBank, Info } from "lucide-react";
import { calculateRentenNetto, besteuerungsanteilProzent, RENTNER_SV_2026 } from "@/lib/renteNetto";
import type { Steuerjahr } from "@/lib/taxCalculator";

const eur = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
const pct = (n: number) => n.toLocaleString("de-DE", { maximumFractionDigits: 1 }) + " %";
const pct2 = (n: number) => n.toLocaleString("de-DE", { maximumFractionDigits: 2 }) + " %";

const BEGINN_JAHRE = Array.from({ length: 2027 - 2005 + 1 }, (_, i) => 2027 - i);

export default function RentenNettoRechner() {
  const [brutto, setBrutto] = useState(1800);
  const [bruttoStr, setBruttoStr] = useState("1800");
  const [jahr, setJahr] = useState<Steuerjahr>(2026);
  const [beginn, setBeginn] = useState(2026);
  const [kinderlos, setKinderlos] = useState(false);
  const [zbStr, setZbStr] = useState("2,9");
  const [kirche, setKirche] = useState(0);

  const zb = useMemo(() => {
    const v = parseFloat(zbStr.replace(",", "."));
    return Number.isFinite(v) && v >= 0 && v <= 6 ? v / 100 : RENTNER_SV_2026.zusatzbeitragDurchschnitt;
  }, [zbStr]);

  const input = { bruttoRenteMonat: brutto, rentenbeginn: Math.min(beginn, jahr), kinderlos, zusatzbeitrag: zb, kirchensteuer: kirche };
  const res = calculateRentenNetto({ ...input, jahr });
  const res2026 = calculateRentenNetto({ ...input, rentenbeginn: Math.min(beginn, 2026), jahr: 2026 });
  const res2027 = calculateRentenNetto({ ...input, rentenbeginn: Math.min(beginn, 2027), jahr: 2027 });
  const diff = res2027.nettoRenteMonat - res2026.nettoRenteMonat;

  const onBrutto = (v: string) => {
    setBruttoStr(v);
    const n = parseFloat(v.replace(",", "."));
    if (Number.isFinite(n) && n >= 0 && n <= 20000) setBrutto(n);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
      {/* Eingaben */}
      <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-5 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg sm:text-2xl font-extrabold text-[#16181D] flex items-center gap-2">
            <PiggyBank size={20} className="text-[#E60A1C]" aria-hidden="true" /> Ihre Rente
          </h2>
          <div className="flex items-center gap-1 bg-black/[0.04] border border-black/[0.10] rounded-2xl p-1 text-sm font-semibold" role="group" aria-label="Steuerjahr">
            {([2026, 2027] as const).map((j) => (
              <button
                key={j}
                type="button"
                aria-pressed={jahr === j}
                onClick={() => setJahr(j)}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${jahr === j ? "bg-[#E60A1C] text-white font-bold" : "text-black/60 hover:text-[#16181D]"}`}
              >
                {j}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="rente-brutto" className="text-sm font-bold text-[#16181D] block mb-2">
            Bruttorente pro Monat
          </label>
          <div className="relative">
            <input
              id="rente-brutto"
              type="number"
              inputMode="decimal"
              min={0}
              max={20000}
              step={10}
              value={bruttoStr}
              onChange={(e) => onBrutto(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="w-full font-mono text-xl font-bold rounded-2xl border border-black/[0.12] bg-[#F1F3F5] px-4 py-3.5 pr-14 text-[#16181D] focus:border-[#E60A1C] outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50 font-mono text-sm font-bold">EUR</span>
          </div>
          <input
            type="range"
            min={500}
            max={4000}
            step={10}
            value={Math.min(4000, Math.max(500, brutto))}
            onChange={(e) => onBrutto(e.target.value)}
            aria-label="Bruttorente einstellen"
            className="w-full mt-3 accent-[#E60A1C]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="rente-beginn" className="text-sm font-bold text-[#16181D] block mb-2">
              Rentenbeginn
            </label>
            <select
              id="rente-beginn"
              value={beginn}
              onChange={(e) => setBeginn(Number(e.target.value))}
              className="w-full rounded-xl border border-black/[0.12] bg-[#F1F3F5] px-3 py-3 font-semibold text-[#16181D] focus:border-[#E60A1C] outline-none"
            >
              {BEGINN_JAHRE.map((y) => (
                <option key={y} value={y}>
                  {y <= 2005 ? "2005 oder früher" : y} · {pct(besteuerungsanteilProzent(y))}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rente-zb" className="text-sm font-bold text-[#16181D] block mb-2">
              Zusatzbeitrag (%)
            </label>
            <input
              id="rente-zb"
              type="text"
              inputMode="decimal"
              value={zbStr}
              onChange={(e) => setZbStr(e.target.value)}
              className="w-full rounded-xl border border-black/[0.12] bg-[#F1F3F5] px-3 py-3 font-mono font-bold text-[#16181D] focus:border-[#E60A1C] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-black/75 cursor-pointer">
            <input type="checkbox" checked={kinderlos} onChange={(e) => setKinderlos(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
            Kinderlos (+0,6 % PV)
          </label>
          <select
            aria-label="Kirchensteuer"
            value={kirche}
            onChange={(e) => setKirche(Number(e.target.value))}
            className="rounded-xl border border-black/[0.12] bg-[#F1F3F5] px-3 py-2.5 text-sm font-semibold text-[#16181D] focus:border-[#E60A1C] outline-none"
          >
            <option value={0}>Ohne Kirche</option>
            <option value={0.09}>Kirche 9 %</option>
            <option value={0.08}>Kirche 8 % (BY/BW)</option>
          </select>
        </div>

        {beginn > jahr && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
            Rentenbeginn liegt nach dem Steuerjahr — gerechnet wird mit Rentenbeginn {jahr}.
          </p>
        )}
      </div>

      {/* Ergebnis */}
      <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-5 sm:p-8 shadow-sm flex flex-col gap-4" aria-live="polite">
        <div className="rounded-2xl bg-[#E60A1C]/[0.06] border border-[#E60A1C]/25 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-black/55 font-bold">Nettorente {jahr}</p>
          <p className="font-display text-4xl sm:text-5xl font-extrabold text-[#16181D] mt-1">{eur(res.nettoRenteMonat)}</p>
          <p className="text-sm text-black/60 mt-1">
            {pct(res.nettoQuote * 100)} der Bruttorente · Besteuerungsanteil {pct(res.besteuerungsanteilProzent)}
          </p>
        </div>

        <dl className="divide-y divide-black/[0.08] text-sm sm:text-base">
          {[
            ["Bruttorente", eur(res.bruttoRenteMonat)],
            [`Krankenversicherung (7,3 % + ${pct2((zb * 100) / 2)})`, "− " + eur(res.kvMonat)],
            [`Pflegeversicherung (${kinderlos ? "4,2" : "3,6"} %)`, "− " + eur(res.pvMonat)],
            ["Einkommensteuer, Soli, Kirchensteuer", "− " + eur(res.steuerMonat)],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-3 py-2.5">
              <dt className="text-black/70">{k}</dt>
              <dd className="font-mono font-bold text-[#16181D] whitespace-nowrap">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="rounded-2xl bg-black/[0.04] border border-black/[0.08] p-4 text-sm">
          <p className="font-bold text-[#16181D] mb-1">2026 → 2027 bei gleicher Rente</p>
          <p className="text-black/70">
            {eur(res2026.nettoRenteMonat)} → {eur(res2027.nettoRenteMonat)}{" "}
            <strong className={diff >= 0 ? "text-emerald-700" : "text-rose-600"}>
              ({diff >= 0 ? "+" : ""}
              {eur(diff)} im Monat)
            </strong>
          </p>
        </div>

        <p className="flex items-start gap-2 text-xs text-black/55 leading-relaxed">
          <Info size={14} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
          {res.steuerIstEntwurf
            ? "2027: Steuer nach dem Gesetzentwurf (BT-Drs. 21/8235), noch nicht beschlossen. Kranken- und Pflegeversicherung mit den Sätzen 2026 — der Zusatzbeitrag 2027 wird erst im Herbst festgelegt."
            : "2026: amtlicher Tarif, pflichtversichert in der KVdR, Einzelveranlagung ohne weitere Einkünfte."}
        </p>
      </div>
    </div>
  );
}
