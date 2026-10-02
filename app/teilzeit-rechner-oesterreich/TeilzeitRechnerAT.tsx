"use client";

import { useMemo, useState } from "react";
import { Calculator, Info } from "lucide-react";
import { berechneBruttoNettoAT, BUNDESLAENDER_AT, formatEURat as eur, type Bundesland } from "@/lib/oesterreich";

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-black/[0.14] text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#E60A1C]/30";

const basis = {
  gehaelter: 14 as const,
  kinderUnter18: 0,
  kinderAb18: 0,
  familienbonusVoll: true,
  avab: false,
  pendler: "keine" as const,
  pendlerKm: 0,
};

export default function TeilzeitRechnerAT() {
  const [vollzeit, setVollzeit] = useState(3200);
  const [vzStunden, setVzStunden] = useState(38.5);
  const [tzStunden, setTzStunden] = useState(25);
  const [bundesland, setBundesland] = useState<Bundesland>("wien");

  const { tzBrutto, vz, tz } = useMemo(() => {
    const anteil = vzStunden > 0 ? Math.min(1, tzStunden / vzStunden) : 0;
    const tzBrutto = Math.round(vollzeit * anteil * 100) / 100;
    return {
      tzBrutto,
      vz: berechneBruttoNettoAT({ ...basis, bundesland, bruttoMonat: vollzeit }),
      tz: berechneBruttoNettoAT({ ...basis, bundesland, bruttoMonat: tzBrutto }),
    };
  }, [vollzeit, vzStunden, tzStunden, bundesland]);

  const nettoAnteil = vz.laufend.netto > 0 ? tz.laufend.netto / vz.laufend.netto : 0;
  const stundenAnteil = vzStunden > 0 ? tzStunden / vzStunden : 0;
  // Ø Wochen pro Monat: 52/12.
  const stundeNetto = (netto: number, h: number) => (h > 0 ? netto / (h * (52 / 12)) : 0);

  return (
    <section id="rechner" className="max-w-6xl mx-auto px-3 sm:px-5 -mt-6 sm:-mt-10 pb-12 relative z-10 scroll-mt-24">
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[380px_minmax(0,1fr)] gap-5 items-start">
        <div className="bg-white border border-black/[0.08] rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
          <h2 className="font-display font-extrabold text-lg flex items-center gap-2">
            <Calculator size={18} className="text-[#E60A1C]" /> Ihre Angaben
          </h2>
          <label className="block">
            <span className="block text-sm font-bold mb-2">Vollzeitgehalt brutto / Monat</span>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={50}
                value={vollzeit}
                onChange={(e) => setVollzeit(Math.max(0, Number(e.target.value) || 0))}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-black/[0.14] text-lg font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-[#E60A1C]/30"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-bold">€</span>
            </div>
            <span className="block text-[11px] text-black/45 mt-1.5">Laut Kollektivvertrag oder Angebot, für die volle Normalarbeitszeit.</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-bold text-black/60 mb-1.5">Vollzeit (Std./Woche)</span>
              <select value={vzStunden} onChange={(e) => setVzStunden(Number(e.target.value))} className={inputCls}>
                {[36, 37, 38, 38.5, 39, 40].map((h) => (
                  <option key={h} value={h}>{h.toLocaleString("de-AT")}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-bold text-black/60 mb-1.5">Teilzeit (Std./Woche)</span>
              <input
                type="number"
                min={1}
                max={vzStunden}
                step={0.5}
                value={tzStunden}
                onChange={(e) => setTzStunden(Math.max(0, Math.min(vzStunden, Number(e.target.value) || 0)))}
                className={inputCls}
              />
            </label>
          </div>
          <input
            type="range"
            min={5}
            max={vzStunden}
            step={0.5}
            value={tzStunden}
            onChange={(e) => setTzStunden(Number(e.target.value))}
            className="w-full accent-[#E60A1C]"
            aria-label="Teilzeitstunden per Schieberegler"
          />
          <label className="block">
            <span className="block text-xs font-bold text-black/60 mb-1.5">Bundesland</span>
            <select value={bundesland} onChange={(e) => setBundesland(e.target.value as Bundesland)} className={inputCls}>
              {BUNDESLAENDER_AT.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="space-y-5" aria-live="polite">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-3xl p-6 text-white shadow-card" style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)" }}>
              <div className="text-xs font-mono uppercase tracking-wider opacity-90 font-bold">Netto Teilzeit / Monat</div>
              <div className="text-4xl font-display font-extrabold mt-2 tabular-nums">{eur(tz.laufend.netto)}</div>
              <div className="text-sm opacity-90 mt-1">
                von {eur(tzBrutto)} brutto · {tzStunden.toLocaleString("de-AT")} Std.{tz.geringfuegig ? " · geringfügig" : ""}
              </div>
            </div>
            <div className="bg-white border border-black/[0.08] rounded-3xl p-6 shadow-card">
              <div className="text-xs font-mono uppercase tracking-wider text-black/50 font-bold">Netto pro Jahr</div>
              <div className="text-4xl font-display font-extrabold mt-2 tabular-nums text-[#16181D]">{eur(tz.jahr.netto)}</div>
              <div className="text-sm text-black/55 mt-1">mit Urlaubs- und Weihnachtsgeld</div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] rounded-3xl p-5 sm:p-6 shadow-card">
            <h3 className="font-display font-extrabold text-base mb-4">Teilzeit und Vollzeit im Vergleich</h3>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-xs sm:text-sm tabular-nums">
                <thead>
                  <tr className="text-left text-xs text-black/50 border-b border-black/[0.08]">
                    <th className="py-2 px-1 font-semibold"></th>
                    <th className="py-2 px-1 font-semibold text-right">Teilzeit</th>
                    <th className="py-2 px-1 font-semibold text-right">Vollzeit</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Brutto / Monat", tzBrutto, vollzeit],
                    ["Sozialversicherung", tz.laufend.sv, vz.laufend.sv],
                    ["Lohnsteuer", tz.laufend.lohnsteuer, vz.laufend.lohnsteuer],
                    ["Netto / Monat", tz.laufend.netto, vz.laufend.netto],
                    ["Netto / Stunde", stundeNetto(tz.laufend.netto, tzStunden), stundeNetto(vz.laufend.netto, vzStunden)],
                  ].map(([label, a, b]) => (
                    <tr key={label as string} className="border-b border-black/[0.05] last:border-0">
                      <td className="py-2.5 px-1 font-semibold">{label}</td>
                      <td className="py-2.5 px-1 text-right">{eur(a as number)}</td>
                      <td className="py-2.5 px-1 text-right">{eur(b as number)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-black/70 mt-4 leading-relaxed">
              Mit {Math.round(stundenAnteil * 100)} % der Stunden bekommen Sie{" "}
              <strong className="text-[#16181D]">{Math.round(nettoAnteil * 100)} % des Vollzeit-Nettos</strong>
              {nettoAnteil > stundenAnteil + 0.005
                ? " — Teilzeit ist netto relativ günstiger, weil Lohnsteuer und Arbeitslosenversicherung bei kleinerem Gehalt überproportional sinken."
                : "."}
            </p>
          </div>

          <p className="text-[11px] text-black/45 flex items-start gap-1.5 px-1">
            <Info size={12} className="flex-shrink-0 mt-0.5" />
            Angestellte, Werte 2026, 14 Gehälter, ohne Kinder und Pendlerpauschale. Stundenlohn auf Basis von 52/12 Wochen pro
            Monat. Mehrstunden über die vereinbarte Teilzeit hinaus bekommen 25 % Zuschlag, wenn sie nicht ausgeglichen werden.
          </p>
        </div>
      </div>
    </section>
  );
}
