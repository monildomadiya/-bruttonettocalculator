"use client";

import { useMemo, useState } from "react";
import { Landmark } from "lucide-react";
import { einkommensteuerVergleich, eurDe, eurDeSigned } from "@/lib/vergleich2027";

/**
 * Einkommensteuer 2026 / 2027 / 2028 nebeneinander — aus den § 32a-Funktionen
 * der Engine (lib/vergleich2027.ts → einkommensteuerVergleich). Die Tabellen
 * auf der Seite rechnen mit derselben Funktion.
 */

const pct = (v: number) => v.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " %";

const KIST = [
  { wert: 0, label: "keine" },
  { wert: 0.08, label: "8 % (BY, BW)" },
  { wert: 0.09, label: "9 %" },
];

export default function EinkommensteuerRechner2027() {
  const [zveStr, setZveStr] = useState("45000");
  const [splitting, setSplitting] = useState(false);
  const [kist, setKist] = useState(0);

  const zve = useMemo(() => {
    const v = parseFloat(zveStr.replace(/\./g, "").replace(",", "."));
    return isNaN(v) || v < 0 ? 0 : Math.min(v, 10_000_000);
  }, [zveStr]);
  const werte = useMemo(() => einkommensteuerVergleich(zve, splitting, kist), [zve, splitting, kist]);

  const zeilen: { label: string; wert: (w: (typeof werte)[number]) => string; fett?: boolean }[] = [
    { label: "Einkommensteuer", wert: (w) => eurDe(w.est), fett: true },
    { label: "Solidaritätszuschlag", wert: (w) => eurDe(w.soli) },
    { label: "Kirchensteuer", wert: (w) => eurDe(w.kirchensteuer) },
    { label: "Steuer gesamt", wert: (w) => eurDe(w.summe), fett: true },
    { label: "Durchschnittssteuersatz", wert: (w) => pct(w.durchschnittssteuersatzPct) },
    { label: "Grenzsteuersatz", wert: (w) => pct(w.grenzsteuersatzPct) },
    { label: "Differenz zu 2026", wert: (w) => (w.jahr === 2026 ? "—" : eurDeSigned(w.differenzZu2026)) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">
      <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-5 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] flex items-center gap-2">
          <Landmark size={22} className="text-[#E60A1C]" /> Ihre Angaben
        </h2>
        <div>
          <label htmlFor="est27-zve" className="block text-sm font-semibold text-black/70 mb-2">
            Zu versteuerndes Einkommen (€ / Jahr)
          </label>
          <input
            id="est27-zve"
            inputMode="decimal"
            value={zveStr}
            onChange={(e) => setZveStr(e.target.value)}
            className="w-full rounded-xl border border-black/[0.15] px-4 py-3 text-lg font-mono font-bold text-[#16181D] focus:outline-none focus:border-[#E60A1C]"
          />
        </div>
        <div>
          <span className="block text-sm font-semibold text-black/70 mb-2">Veranlagung</span>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Veranlagung">
            {[
              { wert: false, label: "Einzel (Grundtarif)" },
              { wert: true, label: "Zusammen (Splitting)" },
            ].map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => setSplitting(o.wert)}
                aria-pressed={splitting === o.wert}
                className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${
                  splitting === o.wert ? "bg-[#E60A1C] border-[#E60A1C] text-white" : "bg-[#FFFFFF] border-black/[0.15] text-[#16181D] hover:border-[#E60A1C]/50"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="block text-sm font-semibold text-black/70 mb-2">Kirchensteuer</span>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Kirchensteuer">
            {KIST.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => setKist(o.wert)}
                aria-pressed={kist === o.wert}
                className={`rounded-xl border px-2 py-2.5 text-sm font-bold transition-colors ${
                  kist === o.wert ? "bg-[#E60A1C] border-[#E60A1C] text-white" : "bg-[#FFFFFF] border-black/[0.15] text-[#16181D] hover:border-[#E60A1C]/50"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-black/55 leading-relaxed">
          2027 und 2028 nach dem Regierungsentwurf des Einkommensteuerreformgesetzes 2027 (vorläufig). Soli mit
          Freigrenze nach geltendem Solidaritätszuschlaggesetz.
        </p>
      </div>

      <div className="bg-[#F4F5F7] border border-black/[0.10] rounded-3xl p-4 sm:p-6 shadow-sm overflow-x-auto" aria-live="polite">
        <table className="w-full text-left border-collapse text-sm sm:text-base min-w-[420px]">
          <caption className="text-left text-xs font-mono uppercase tracking-widest text-black/60 font-bold pb-3">
            Ihre Steuer 2026, 2027 und 2028 ({splitting ? "Splittingtarif" : "Grundtarif"})
          </caption>
          <thead>
            <tr className="border-b border-black/[0.10] text-xs text-black/60">
              <th scope="col" className="py-2 pr-2 font-semibold"><span className="sr-only">Wert</span></th>
              <th scope="col" className="py-2 px-2 text-right font-semibold">2026</th>
              <th scope="col" className="py-2 px-2 text-right font-semibold">2027 <span className="font-normal">(Entwurf)</span></th>
              <th scope="col" className="py-2 pl-2 text-right font-semibold">2028 <span className="font-normal">(Entwurf)</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.06] tabular-nums">
            {zeilen.map((z) => (
              <tr key={z.label}>
                <th scope="row" className={`py-2.5 pr-2 font-medium ${z.fett ? "text-[#16181D]" : "text-black/70"}`}>{z.label}</th>
                {werte.map((w) => (
                  <td
                    key={w.jahr}
                    className={`py-2.5 px-2 text-right font-mono whitespace-nowrap ${z.fett ? "font-bold text-[#16181D]" : "text-black/80"} ${
                      z.label === "Differenz zu 2026" && w.jahr !== 2026 ? (w.differenzZu2026 <= 0 ? "text-emerald-700" : "text-[#E60A1C]") : ""
                    }`}
                  >
                    {z.wert(w)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-black/55">
          Differenz = Steuer gesamt (ESt + Soli + Kirchensteuer) minus 2026; negativ heißt Entlastung.
        </p>
      </div>
    </div>
  );
}
