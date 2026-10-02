"use client";

import { useMemo, useState } from "react";
import { Calculator, Gift, Info, Percent } from "lucide-react";
import { berechnePensionAT, formatEURat as eur, type JahrAT } from "@/lib/oesterreich";

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-black/[0.14] text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#E60A1C]/30";

export default function PensionRechnerAT() {
  const [brutto, setBrutto] = useState(2000);
  const [jahr, setJahr] = useState<JahrAT>(2026);
  const [erhoeht, setErhoeht] = useState(false);
  const [avabKinder, setAvabKinder] = useState(0);

  const r = useMemo(
    () => berechnePensionAT({ bruttoPension: brutto, jahr, erhoehterPab: erhoeht, avabKinder }),
    [brutto, jahr, erhoeht, avabKinder]
  );

  return (
    <section id="rechner" className="max-w-6xl mx-auto px-3 sm:px-5 -mt-6 sm:-mt-10 pb-12 relative z-10 scroll-mt-24">
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[380px_minmax(0,1fr)] gap-5 items-start">
        <div className="bg-white border border-black/[0.08] rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
          <h2 className="font-display font-extrabold text-lg flex items-center gap-2">
            <Calculator size={18} className="text-[#E60A1C]" /> Ihre Pension
          </h2>

          <div>
            <label htmlFor="at-pension" className="block text-sm font-bold mb-2">
              Bruttopension pro Monat
            </label>
            <div className="relative">
              <input
                id="at-pension"
                type="number"
                inputMode="decimal"
                min={0}
                step={50}
                value={brutto}
                onChange={(e) => setBrutto(Math.max(0, Number(e.target.value) || 0))}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-black/[0.14] text-lg font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-[#E60A1C]/30"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-bold">€</span>
            </div>
            <input
              type="range"
              min={500}
              max={7000}
              step={50}
              value={Math.min(Math.max(brutto, 500), 7000)}
              onChange={(e) => setBrutto(Number(e.target.value))}
              className="w-full mt-3 accent-[#E60A1C]"
              aria-label="Bruttopension per Schieberegler"
            />
          </div>

          <label className="block">
            <span className="block text-xs font-bold text-black/60 mb-1.5">Jahr</span>
            <select value={jahr} onChange={(e) => setJahr(Number(e.target.value) as JahrAT)} className={inputCls}>
              <option value={2026}>2026</option>
              <option value={2027}>2027 (neue Steuerstufen)</option>
            </select>
          </label>

          <div className="border-t border-black/[0.08] pt-5 space-y-3">
            <label className="flex items-start gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={erhoeht}
                disabled={avabKinder > 0}
                onChange={(e) => setErhoeht(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#E60A1C]"
              />
              <span className="leading-snug">
                <span className="font-semibold">Erhöhter Pensionistenabsetzbetrag</span>
                <span className="block text-[11px] text-black/50">
                  Verheiratet oder in Partnerschaft, Partner/in mit nur geringen Einkünften.
                </span>
              </span>
            </label>
            <label className="block">
              <span className="block text-xs font-bold text-black/60 mb-1.5">Alleinverdiener-/Alleinerzieherabsetzbetrag</span>
              <select value={avabKinder} onChange={(e) => setAvabKinder(Number(e.target.value))} className={inputCls}>
                <option value={0}>nein</option>
                <option value={1}>ja, 1 Kind</option>
                <option value={2}>ja, 2 Kinder</option>
                <option value={3}>ja, 3 Kinder</option>
              </select>
            </label>
          </div>
        </div>

        <div className="space-y-5" aria-live="polite">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-3xl p-6 text-white shadow-card" style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)" }}>
              <div className="text-xs font-mono uppercase tracking-wider opacity-90 font-bold">Nettopension pro Monat</div>
              <div className="text-4xl font-display font-extrabold mt-2 tabular-nums">{eur(r.laufend.netto)}</div>
              <div className="text-sm opacity-90 mt-1">von {eur(r.laufend.brutto)} brutto</div>
            </div>
            <div className="bg-white border border-black/[0.08] rounded-3xl p-6 shadow-card">
              <div className="text-xs font-mono uppercase tracking-wider text-black/50 font-bold">Netto pro Jahr</div>
              <div className="text-4xl font-display font-extrabold mt-2 tabular-nums text-[#16181D]">{eur(r.jahr.netto)}</div>
              <div className="text-sm text-black/55 mt-1">14 Auszahlungen · Ø {eur(r.nettoMonatDurchschnitt)} auf 12 Monate</div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] rounded-3xl p-5 sm:p-6 shadow-card">
            <h3 className="font-display font-extrabold text-base mb-4">Monatliche Abrechnung</h3>
            <dl className="text-sm tabular-nums divide-y divide-black/[0.06]">
              <div className="flex justify-between py-2 font-bold">
                <dt>Bruttopension</dt>
                <dd>{eur(r.laufend.brutto)}</dd>
              </div>
              <div className="flex justify-between py-2 font-semibold">
                <dt>Krankenversicherung (6 %)</dt>
                <dd className="whitespace-nowrap pl-3">− {eur(r.laufend.kv)}</dd>
              </div>
              <div className="flex justify-between py-2 font-semibold">
                <dt>Lohnsteuer</dt>
                <dd className="whitespace-nowrap pl-3">− {eur(r.laufend.lohnsteuer)}</dd>
              </div>
              <div className="flex justify-between py-2.5 font-extrabold text-base text-[#E60A1C]">
                <dt>Nettopension</dt>
                <dd>{eur(r.laufend.netto)}</dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-black/[0.08] rounded-3xl p-5 shadow-card">
              <h3 className="font-display font-extrabold text-sm mb-3 flex items-center gap-1.5">
                <Gift size={15} className="text-[#E60A1C]" /> 13. und 14. Pension
              </h3>
              <dl className="text-xs sm:text-sm tabular-nums space-y-1.5">
                {r.sonderzahlungen.map((z) => (
                  <div key={z.label} className="flex justify-between gap-3">
                    <dt className="text-black/60">{z.label}</dt>
                    <dd className="font-bold whitespace-nowrap">{eur(z.netto)}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-[11px] text-black/45 mt-3">
                Nach 6 % KV: 620 € im Jahr steuerfrei, darüber 6 % Lohnsteuer.
              </p>
            </div>
            <div className="bg-white border border-black/[0.08] rounded-3xl p-5 shadow-card">
              <h3 className="font-display font-extrabold text-sm mb-3 flex items-center gap-1.5">
                <Percent size={15} className="text-[#E60A1C]" /> Lohnsteuer im Detail (Jahr)
              </h3>
              <dl className="text-xs sm:text-sm tabular-nums space-y-1.5">
                <div className="flex justify-between"><dt className="text-black/60">Bemessungsgrundlage</dt><dd>{eur(r.laufend.bemessungJahr)}</dd></div>
                <div className="flex justify-between"><dt className="text-black/60">Tarifsteuer</dt><dd>{eur(r.laufend.tarifsteuerJahr)}</dd></div>
                {r.laufend.avabJahr > 0 && (
                  <div className="flex justify-between"><dt className="text-black/60">− AVAB/AEAB</dt><dd>{eur(r.laufend.avabJahr)}</dd></div>
                )}
                <div className="flex justify-between"><dt className="text-black/60">− Pensionistenabsetzbetrag</dt><dd>{eur(r.laufend.pabJahr)}</dd></div>
                <div className="flex justify-between font-bold border-t border-black/[0.08] pt-1.5">
                  <dt>Grenzsteuersatz</dt>
                  <dd>{(r.grenzsteuersatz * 100).toLocaleString("de-AT")} %</dd>
                </div>
              </dl>
            </div>
          </div>

          <p className="text-[11px] text-black/45 flex items-start gap-1.5 px-1">
            <Info size={12} className="flex-shrink-0 mt-0.5" />
            Eine ASVG-Pension, Wohnsitz in Österreich, Werte {jahr}. Bei mehreren Pensionen oder Pension plus Erwerbseinkommen
            rechnet das Finanzamt in der Arbeitnehmerveranlagung neu — dann kann es zu einer Nachzahlung kommen. Die
            SV-Rückerstattung für kleine Pensionen gibt es ebenfalls erst dort.
          </p>
        </div>
      </div>
    </section>
  );
}
