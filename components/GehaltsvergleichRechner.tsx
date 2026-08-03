"use client";

import { useMemo, useState } from "react";
import { BarChart3, Info } from "lucide-react";
import { calculateNetto, formatEUR, type Steuerklasse } from "@/lib/taxCalculator";
import { DESTATIS_JAHR_2025, getSalaryPercentile } from "@/data/wage-stats";

/**
 * "Wo stehe ich?" — ordnet das eigene Gehalt in die amtliche Destatis-
 * Verdienstverteilung 2025 ein und rechnet zusätzlich das Netto aus.
 */
type Basis = "monat" | "jahr";

export default function GehaltsvergleichRechner() {
  const [betragStr, setBetragStr] = useState("4000");
  const [basis, setBasis] = useState<Basis>("monat");
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);

  const bruttoMonat = useMemo(() => {
    const parsed = parseFloat(betragStr.replace(/\./g, "").replace(",", "."));
    if (isNaN(parsed) || parsed < 0) return 0;
    const monat = basis === "monat" ? parsed : parsed / 12;
    return Math.min(monat, 100000);
  }, [betragStr, basis]);

  /**
   * Die Destatis-Jahreswerte enthalten Sonderzahlungen (Urlaubs-/Weihnachtsgeld),
   * das eingegebene Monatsbrutto in aller Regel nicht. Für den Vergleich wird
   * daher mit 12 Monatsgehältern gerechnet und offen ausgewiesen, dass ein 13.
   * Gehalt den Rang zusätzlich hebt.
   */
  const bruttoJahr = bruttoMonat * 12;
  const rang = useMemo(() => getSalaryPercentile(bruttoJahr), [bruttoJahr]);

  const netto = useMemo(
    () =>
      calculateNetto({
        bruttoMonat,
        jahr: 2026,
        verheiratet: steuerklasse === 3,
        kinderlosUeber23: true,
        kirche: false,
        steuerklasse,
      }),
    [bruttoMonat, steuerklasse]
  );

  const d = DESTATIS_JAHR_2025;
  const vsMedian = bruttoJahr - d.medianJahr;
  const vsDurchschnitt = bruttoJahr - d.durchschnittJahr;

  return (
    <div className="bg-gradient-to-br from-[#F1F3F5] via-[#FFFFFF] to-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#E60A1C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 text-[#E60A1C] font-bold text-sm sm:text-base mb-6 relative">
        <BarChart3 size={18} />
        <span>Wo steht Ihr Gehalt im deutschen Vergleich?</span>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6 relative">
        <label className="block sm:col-span-1">
          <span className="text-xs font-mono uppercase tracking-wider text-black/50 block mb-1.5">Ihr Bruttogehalt</span>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={betragStr}
              onChange={(e) => setBetragStr(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-black/[0.10] focus:border-[#E60A1C]/60 rounded-xl px-4 py-3 font-mono font-bold text-lg text-[#16181D] outline-none transition-colors"
              aria-label="Bruttogehalt in Euro"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-mono font-bold">€</span>
          </div>
        </label>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-black/50 block mb-1.5">Zeitraum</span>
          <div className="grid grid-cols-2 gap-2">
            {([
              { key: "monat", label: "pro Monat" },
              { key: "jahr", label: "pro Jahr" },
            ] as { key: Basis; label: string }[]).map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => setBasis(o.key)}
                className={`rounded-xl border px-3 py-3 font-bold text-sm transition-all ${
                  basis === o.key
                    ? "bg-[#E60A1C] border-[#E60A1C] text-white shadow-lg"
                    : "bg-[#FFFFFF] border-black/[0.10] text-[#16181D] hover:border-[#E60A1C]/50"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-black/50 block mb-1.5">Steuerklasse</span>
          <select
            value={steuerklasse}
            onChange={(e) => setSteuerklasse(Number(e.target.value) as Steuerklasse)}
            className="w-full bg-[#FFFFFF] border border-black/[0.10] focus:border-[#E60A1C]/60 rounded-xl px-4 py-3 font-bold text-base text-[#16181D] outline-none transition-colors"
            aria-label="Steuerklasse auswählen"
          >
            {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => (
              <option key={sk} value={sk}>
                Steuerklasse {sk}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Perzentil-Balken */}
      <div className="mb-6 relative">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-2">
          <span className="text-sm font-bold text-[#16181D]">{rang.label}</span>
          <span className="text-right">
            <span className="font-mono font-extrabold text-2xl sm:text-3xl text-[#E60A1C] block leading-none">
              Besser als {rang.besserAls} %
            </span>
            {/* "Top X %" nur oberhalb des Medians — darunter würde die Formulierung
                den Rang beschönigen statt ihn einzuordnen. */}
            {rang.percentile >= 50 && (
              <span className="text-xs font-mono text-black/50 block mt-1">
                die obersten {Math.max(0.1, 100 - rang.percentile).toLocaleString("de-DE", { maximumFractionDigits: 1 })} % aller Vollzeitgehälter
              </span>
            )}
          </span>
        </div>
        <div className="h-4 w-full rounded-full bg-black/[0.07] overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#E60A1C]/70 to-[#E60A1C] rounded-full transition-all duration-500"
            style={{ width: `${Math.max(1.5, rang.percentile)}%` }}
          />
        </div>
        <p className="text-sm text-black/70 mt-2.5 leading-relaxed">
          Mit <strong className="text-[#16181D]">{formatEUR(bruttoJahr)}</strong> Bruttojahresgehalt verdienen Sie mehr
          als rund <strong className="text-[#E60A1C]">{rang.besserAls} %</strong> aller Vollzeitbeschäftigten in
          Deutschland.
        </p>
      </div>

      {/* Kennzahlen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative">
        <div className="rounded-2xl border bg-[#E60A1C]/10 border-[#E60A1C]/40 p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1.5">Ihr Netto / Monat</div>
          <div className="font-mono font-extrabold text-lg sm:text-xl text-[#E60A1C] break-all">
            {formatEUR(netto.nettoMonat)}
          </div>
        </div>
        <div className="rounded-2xl border bg-[#FFFFFF] border-black/[0.08] p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1.5">vs. Median</div>
          <div
            className={`font-mono font-extrabold text-lg sm:text-xl break-all ${
              vsMedian >= 0 ? "text-emerald-600" : "text-[#E60A1C]"
            }`}
          >
            {vsMedian >= 0 ? "+" : "−"}
            {formatEUR(Math.abs(vsMedian))}
          </div>
          <div className="text-xs text-black/50 mt-1">pro Jahr</div>
        </div>
        <div className="rounded-2xl border bg-[#FFFFFF] border-black/[0.08] p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1.5">vs. Durchschnitt</div>
          <div
            className={`font-mono font-extrabold text-lg sm:text-xl break-all ${
              vsDurchschnitt >= 0 ? "text-emerald-600" : "text-[#E60A1C]"
            }`}
          >
            {vsDurchschnitt >= 0 ? "+" : "−"}
            {formatEUR(Math.abs(vsDurchschnitt))}
          </div>
          <div className="text-xs text-black/50 mt-1">pro Jahr</div>
        </div>
        <div className="rounded-2xl border bg-[#FFFFFF] border-black/[0.08] p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1.5">Ihr Stundenlohn</div>
          <div className="font-mono font-extrabold text-lg sm:text-xl text-[#16181D] break-all">
            {formatEUR(bruttoMonat / ((d.wochenstunden * 52) / 12))}
          </div>
          <div className="text-xs text-black/50 mt-1">bei {d.wochenstunden.toLocaleString("de-DE")} Std./Woche</div>
        </div>
      </div>

      <div className="flex items-start gap-2 mt-5 text-xs text-black/50 leading-relaxed relative">
        <Info size={14} className="shrink-0 mt-0.5" />
        <span>
          Vergleichsbasis: Bruttojahresverdienste vollzeitbeschäftigter Arbeitnehmer 2025 inklusive Sonderzahlungen
          ({d.quelle}). Der Perzentilrang wird zwischen den amtlich veröffentlichten Stützstellen (10 %, 50 %, 90 %,
          99 %) linear interpoliert und ist damit eine Näherung. Ein Monatsbrutto wird mit 12 hochgerechnet — mit
          Weihnachts- oder Urlaubsgeld liegt Ihr Rang entsprechend höher. Das Netto ist mit den Rechengrößen 2026
          berechnet (kinderlos, ohne Kirchensteuer).
        </span>
      </div>
    </div>
  );
}
