"use client";

import { useMemo, useState } from "react";
import { Receipt, ArrowRightLeft, Info } from "lucide-react";
import { formatEUR } from "@/lib/taxCalculator";

/**
 * Mehrwertsteuer-Rechner (MwSt/USt) — Netto ↔ Brutto in beide Richtungen,
 * Regelsatz 19 % und ermäßigter Satz 7 % (§ 12 UStG).
 */
type Richtung = "netto-zu-brutto" | "brutto-zu-netto";

export default function MwstRechner() {
  const [betragStr, setBetragStr] = useState<string>("100");
  const [satz, setSatz] = useState<19 | 7>(19);
  const [richtung, setRichtung] = useState<Richtung>("netto-zu-brutto");

  const betrag = useMemo(() => {
    const parsed = parseFloat(betragStr.replace(/\./g, "").replace(",", "."));
    if (isNaN(parsed) || parsed < 0) return 0;
    return Math.min(parsed, 100000000);
  }, [betragStr]);

  const { netto, mwst, brutto } = useMemo(() => {
    const faktor = 1 + satz / 100;
    if (richtung === "netto-zu-brutto") {
      const n = betrag;
      const b = n * faktor;
      return { netto: n, mwst: b - n, brutto: b };
    }
    const b = betrag;
    const n = b / faktor;
    return { netto: n, mwst: b - n, brutto: b };
  }, [betrag, satz, richtung]);

  return (
    <div className="bg-gradient-to-br from-[#F1F3F5] via-[#FFFFFF] to-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#E60A1C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 text-[#E60A1C] font-bold text-sm sm:text-base mb-6 relative">
        <Receipt size={18} />
        <span>MwSt-Rechner (19 % / 7 %)</span>
      </div>

      {/* Direction toggle */}
      <div className="grid grid-cols-2 gap-2 mb-5 relative">
        {([
          { key: "netto-zu-brutto", label: "Netto → Brutto", sub: "MwSt aufschlagen" },
          { key: "brutto-zu-netto", label: "Brutto → Netto", sub: "MwSt herausrechnen" },
        ] as { key: Richtung; label: string; sub: string }[]).map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => setRichtung(o.key)}
            className={`rounded-xl border px-4 py-3 text-left transition-all ${
              richtung === o.key
                ? "bg-[#E60A1C] border-[#E60A1C] text-white shadow-lg"
                : "bg-[#FFFFFF] border-black/[0.10] text-[#16181D] hover:border-[#E60A1C]/50"
            }`}
          >
            <span className="font-bold text-sm sm:text-base flex items-center gap-1.5">
              <ArrowRightLeft size={14} /> {o.label}
            </span>
            <span className={`block text-xs mt-0.5 ${richtung === o.key ? "text-white/80" : "text-black/55"}`}>{o.sub}</span>
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6 relative">
        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-black/50 block mb-1.5">
            {richtung === "netto-zu-brutto" ? "Nettobetrag" : "Bruttobetrag"}
          </span>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={betragStr}
              onChange={(e) => setBetragStr(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-black/[0.10] focus:border-[#E60A1C]/60 rounded-xl px-4 py-3 font-mono font-bold text-lg text-[#16181D] outline-none transition-colors"
              aria-label={richtung === "netto-zu-brutto" ? "Nettobetrag in Euro" : "Bruttobetrag in Euro"}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-mono font-bold">€</span>
          </div>
        </label>
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-black/50 block mb-1.5">Steuersatz</span>
          <div className="grid grid-cols-2 gap-2">
            {([19, 7] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSatz(s)}
                className={`rounded-xl border px-4 py-3 font-mono font-extrabold text-lg transition-all ${
                  satz === s
                    ? "bg-[#E60A1C] border-[#E60A1C] text-white shadow-lg"
                    : "bg-[#FFFFFF] border-black/[0.10] text-[#16181D] hover:border-[#E60A1C]/50"
                }`}
              >
                {s} %
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 relative">
        {[
          { label: "Netto", value: formatEUR(netto), accent: richtung === "brutto-zu-netto" },
          { label: `MwSt (${satz} %)`, value: formatEUR(mwst), accent: false },
          { label: "Brutto", value: formatEUR(brutto), accent: richtung === "netto-zu-brutto" },
        ].map((k) => (
          <div key={k.label} className={`rounded-2xl border p-4 sm:p-5 ${k.accent ? "bg-[#E60A1C]/10 border-[#E60A1C]/40" : "bg-[#FFFFFF] border-black/[0.08]"}`}>
            <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1.5">{k.label}</div>
            <div className={`font-mono font-extrabold text-base sm:text-xl break-all ${k.accent ? "text-[#E60A1C]" : "text-[#16181D]"}`}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 mt-5 text-xs text-black/50 leading-relaxed relative">
        <Info size={14} className="shrink-0 mt-0.5" />
        <span>
          Formeln: Brutto = Netto × {satz === 19 ? "1,19" : "1,07"} · Netto = Brutto ÷ {satz === 19 ? "1,19" : "1,07"} ·
          Die MwSt-Sätze gelten nach § 12 UStG (Regelsatz 19 %, ermäßigt 7 %).
        </span>
      </div>
    </div>
  );
}
