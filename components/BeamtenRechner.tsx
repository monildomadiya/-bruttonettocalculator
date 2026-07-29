"use client";

import { useMemo, useState } from "react";
import { Landmark, ShieldCheck, TrendingUp, Info } from "lucide-react";
import { calculateBeamtenNetto, calculateNetto, formatEUR, Steuerklasse } from "@/lib/taxCalculator";

/**
 * Interactive Brutto-Netto-Rechner für Beamte (2026).
 *
 * Beamte zahlen keine Sozialversicherungsbeiträge — nur Lohnsteuer (mit
 * Mindestvorsorgepauschale nach § 39b EStG), ggf. Soli und Kirchensteuer,
 * plus die private Krankenversicherung als Eigenleistung. Der eingebaute
 * Vergleich mit einem regulären Angestellten (gleiches Brutto) ist das
 * Alleinstellungsmerkmal dieses Rechners.
 */
export default function BeamtenRechner() {
  const [bruttoStr, setBruttoStr] = useState<string>("4500");
  const [sk, setSk] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState<boolean>(false);
  const [pkvStr, setPkvStr] = useState<string>("320");

  const brutto = Math.min(50000, Math.max(0, parseInt(bruttoStr.replace(/[^\d]/g, ""), 10) || 0));
  const pkv = Math.min(3000, Math.max(0, parseInt(pkvStr.replace(/[^\d]/g, ""), 10) || 0));

  const beamter = useMemo(() => {
    if (brutto < 500) return null;
    return calculateBeamtenNetto({ bruttoMonat: brutto, steuerklasse: sk, kirche, pkvMonat: pkv });
  }, [brutto, sk, kirche, pkv]);

  // Vergleich: gleiches Brutto als sozialversicherungspflichtiger Angestellter
  const angestellter = useMemo(() => {
    if (brutto < 500) return null;
    return calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      verheiratet: sk === 3 || sk === 4 || sk === 5,
      kinderlosUeber23: true,
      kirche,
      steuerklasse: sk,
    });
  }, [brutto, sk, kirche]);

  const vorteil = beamter && angestellter ? beamter.nettoMonat - angestellter.nettoMonat : 0;

  return (
    <div className="bg-gradient-to-br from-[#F1F3F5] via-[#FFFFFF] to-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#E60A1C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 text-[#E60A1C] font-bold text-sm sm:text-base mb-6 relative">
        <Landmark size={18} />
        <span>Beamten-Rechner 2026</span>
      </div>

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6 relative">
        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-black/50 block mb-1.5">Dienstbezüge (Brutto) / Monat</span>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={bruttoStr}
              onChange={(e) => setBruttoStr(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-black/[0.10] focus:border-[#E60A1C]/60 rounded-xl px-4 py-3 font-mono font-bold text-lg text-[#16181D] outline-none transition-colors"
              aria-label="Dienstbezüge brutto pro Monat in Euro"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-mono font-bold">€</span>
          </div>
        </label>
        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-black/50 block mb-1.5">PKV-Beitrag (Eigenanteil) / Monat</span>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={pkvStr}
              onChange={(e) => setPkvStr(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-black/[0.10] focus:border-[#E60A1C]/60 rounded-xl px-4 py-3 font-mono font-bold text-lg text-[#16181D] outline-none transition-colors"
              aria-label="Private Krankenversicherung Eigenanteil pro Monat in Euro"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-mono font-bold">€</span>
          </div>
        </label>
        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-black/50 block mb-1.5">Steuerklasse</span>
          <select
            value={sk}
            onChange={(e) => setSk(parseInt(e.target.value, 10) as Steuerklasse)}
            className="w-full bg-[#FFFFFF] border border-black/[0.10] focus:border-[#E60A1C]/60 rounded-xl px-4 py-3 font-mono font-bold text-base text-[#16181D] outline-none transition-colors"
            aria-label="Steuerklasse wählen"
          >
            <option value={1}>I — Ledig</option>
            <option value={2}>II — Alleinerziehend</option>
            <option value={3}>III — Verheiratet (Hauptverdiener)</option>
            <option value={4}>IV — Verheiratet (gleich)</option>
            <option value={5}>V — Verheiratet (Zweitverdiener)</option>
            <option value={6}>VI — Zweitjob</option>
          </select>
        </label>
        <label className="flex items-center gap-3 bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-4 py-3 cursor-pointer self-end">
          <input
            type="checkbox"
            checked={kirche}
            onChange={(e) => setKirche(e.target.checked)}
            className="w-4 h-4 accent-[#E60A1C]"
          />
          <span className="text-sm font-semibold text-[#16181D]">Kirchensteuer (9 %)</span>
        </label>
      </div>

      {/* Results */}
      {beamter && angestellter && (
        <div className="relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
            {[
              { label: "Netto / Monat (nach PKV)", value: formatEUR(beamter.nettoMonat), accent: true },
              { label: "Netto / Monat (vor PKV)", value: formatEUR(beamter.nettoVorPkvMonat) },
              { label: "Lohnsteuer + Soli / Mon.", value: formatEUR(beamter.steuer.summeMonat) },
              { label: "Sozialabgaben", value: "0,00 €" },
            ].map((k) => (
              <div key={k.label} className={`rounded-2xl border p-4 sm:p-5 ${k.accent ? "bg-[#E60A1C]/10 border-[#E60A1C]/40" : "bg-[#FFFFFF] border-black/[0.08]"}`}>
                <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1.5">{k.label}</div>
                <div className={`font-mono font-extrabold text-lg sm:text-xl ${k.accent ? "text-[#E60A1C]" : "text-[#16181D]"}`}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* The USP: direct comparison with a regular employee */}
          <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-[#16181D] mb-4">
              <TrendingUp size={16} className="text-[#E60A1C]" /> Vergleich: Beamter vs. Angestellter bei {formatEUR(brutto)} brutto
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="bg-[#F1F3F5] border border-black/[0.08] rounded-xl p-4">
                <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1 flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-[#E60A1C]" /> Beamter (nach PKV)
                </div>
                <div className="font-mono font-extrabold text-xl text-[#16181D]">{formatEUR(beamter.nettoMonat)}</div>
              </div>
              <div className="bg-[#F1F3F5] border border-black/[0.08] rounded-xl p-4">
                <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1">Angestellter (GKV)</div>
                <div className="font-mono font-extrabold text-xl text-[#16181D]">{formatEUR(angestellter.nettoMonat)}</div>
              </div>
              <div className={`rounded-xl p-4 border ${vorteil >= 0 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-rose-500/10 border-rose-500/30"}`}>
                <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1">Netto-Differenz</div>
                <div className={`font-mono font-extrabold text-xl ${vorteil >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {vorteil >= 0 ? "+" : ""}{formatEUR(vorteil)}
                </div>
              </div>
            </div>
            <p className="text-xs text-black/55 mt-4 leading-relaxed">
              Der Angestellten-Wert nutzt denselben Rechenkern wie unser Hauptrechner (GKV mit 2,9 % Zusatzbeitrag,
              kinderlos ab 23). Beim Beamten sind {formatEUR(pkv)} PKV-Eigenanteil bereits abgezogen.
            </p>
          </div>

          <div className="flex items-start gap-2 mt-5 text-xs text-black/50 leading-relaxed">
            <Info size={14} className="shrink-0 mt-0.5" />
            <span>
              Vereinfachte Orientierung nach § 39b EStG (Mindestvorsorgepauschale 12 %, max. 1.900 € bzw. 3.000 € in
              Steuerklasse III). Besoldung, Familienzuschlag und Beihilfesatz sind länderabhängig — keine Gewähr, keine
              Steuerberatung.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
