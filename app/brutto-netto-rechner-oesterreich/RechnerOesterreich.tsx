"use client";

import { useMemo, useState } from "react";
import { Calculator, Gift, Building2, Info, Percent } from "lucide-react";
import {
  berechneBruttoNettoAT,
  formatEURat as eur,
  BUNDESLAENDER_AT,
  type Bundesland,
  type PendlerArt,
} from "@/lib/oesterreich";

const pct = (v: number) =>
  (v * 100).toLocaleString("de-AT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " %";

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-black/[0.14] text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#E60A1C]/30";

export default function RechnerOesterreich() {
  const [brutto, setBrutto] = useState(3000);
  const [bundesland, setBundesland] = useState<Bundesland>("wien");
  const [gehaelter, setGehaelter] = useState<12 | 14>(14);
  const [kinderUnter18, setKinderUnter18] = useState(0);
  const [kinderAb18, setKinderAb18] = useState(0);
  const [fbVoll, setFbVoll] = useState(true);
  const [avab, setAvab] = useState(false);
  const [pendler, setPendler] = useState<PendlerArt>("keine");
  const [km, setKm] = useState(25);

  const r = useMemo(
    () =>
      berechneBruttoNettoAT({
        bruttoMonat: brutto,
        bundesland,
        gehaelter,
        kinderUnter18,
        kinderAb18,
        familienbonusVoll: fbVoll,
        avab,
        pendler,
        pendlerKm: km,
      }),
    [brutto, bundesland, gehaelter, kinderUnter18, kinderAb18, fbVoll, avab, pendler, km]
  );

  const hatKinder = kinderUnter18 + kinderAb18 > 0;
  const st = r.laufend.steuer;

  return (
    <section id="rechner" className="max-w-6xl mx-auto px-3 sm:px-5 -mt-6 sm:-mt-10 pb-12 relative z-10 scroll-mt-24">
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[380px_minmax(0,1fr)] gap-5 items-start">
        {/* ── Eingaben ── */}
        <div className="bg-white border border-black/[0.08] rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
          <h2 className="font-display font-extrabold text-lg flex items-center gap-2">
            <Calculator size={18} className="text-[#E60A1C]" /> Ihre Angaben
          </h2>

          <div>
            <label htmlFor="at-brutto" className="block text-sm font-bold mb-2">
              Bruttogehalt pro Monat
            </label>
            <div className="relative">
              <input
                id="at-brutto"
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
              max={10000}
              step={50}
              value={Math.min(Math.max(brutto, 500), 10000)}
              onChange={(e) => setBrutto(Number(e.target.value))}
              className="w-full mt-3 accent-[#E60A1C]"
              aria-label="Bruttogehalt per Schieberegler"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-bold text-black/60 mb-1.5">Bundesland</span>
              <select value={bundesland} onChange={(e) => setBundesland(e.target.value as Bundesland)} className={inputCls}>
                {BUNDESLAENDER_AT.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-bold text-black/60 mb-1.5">Gehälter pro Jahr</span>
              <select value={gehaelter} onChange={(e) => setGehaelter(Number(e.target.value) as 12 | 14)} className={inputCls}>
                <option value={14}>14 (mit 13. &amp; 14.)</option>
                <option value={12}>12</option>
              </select>
            </label>
          </div>

          <div className="border-t border-black/[0.08] pt-5 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-black/50 font-bold">Familie</div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-xs font-bold text-black/60 mb-1.5">Kinder unter 18</span>
                <select value={kinderUnter18} onChange={(e) => setKinderUnter18(Number(e.target.value))} className={inputCls}>
                  {[0, 1, 2, 3, 4, 5, 6].map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-xs font-bold text-black/60 mb-1.5">Kinder ab 18</span>
                <select value={kinderAb18} onChange={(e) => setKinderAb18(Number(e.target.value))} className={inputCls}>
                  {[0, 1, 2, 3, 4].map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </label>
            </div>
            {hatKinder && (
              <>
                <label className="block">
                  <span className="block text-xs font-bold text-black/60 mb-1.5">Familienbonus Plus</span>
                  <select value={fbVoll ? "voll" : "halb"} onChange={(e) => setFbVoll(e.target.value === "voll")} className={inputCls}>
                    <option value="voll">zur Gänze</option>
                    <option value="halb">je zur Hälfte mit dem anderen Elternteil</option>
                  </select>
                </label>
                <label className="flex items-start gap-2.5 text-sm cursor-pointer">
                  <input type="checkbox" checked={avab} onChange={(e) => setAvab(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#E60A1C]" />
                  <span className="font-semibold leading-snug">Alleinverdiener- bzw. Alleinerzieherabsetzbetrag</span>
                </label>
              </>
            )}
          </div>

          <div className="border-t border-black/[0.08] pt-5 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-black/50 font-bold">Arbeitsweg</div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-xs font-bold text-black/60 mb-1.5">Pendlerpauschale</span>
                <select value={pendler} onChange={(e) => setPendler(e.target.value as PendlerArt)} className={inputCls}>
                  <option value="keine">keine</option>
                  <option value="klein">kleines</option>
                  <option value="gross">großes</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-xs font-bold text-black/60 mb-1.5">Einfache Strecke (km)</span>
                <input
                  type="number"
                  min={0}
                  max={300}
                  value={km}
                  disabled={pendler === "keine"}
                  onChange={(e) => setKm(Math.max(0, Number(e.target.value) || 0))}
                  className={`${inputCls} disabled:opacity-40`}
                />
              </label>
            </div>
            {pendler !== "keine" && (
              <p className="text-[11px] text-black/45">
                Kleines Pendlerpauschale ab 20 km (öffentliches Verkehrsmittel zumutbar), großes ab 2 km. Dazu
                Pendlereuro: 6 € je Kilometer und Jahr.
              </p>
            )}
          </div>
        </div>

        {/* ── Ergebnis ── */}
        <div className="space-y-5" aria-live="polite">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-3xl p-6 text-white shadow-card" style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)" }}>
              <div className="text-xs font-mono uppercase tracking-wider opacity-90 font-bold">Netto pro Monat</div>
              <div className="text-4xl font-display font-extrabold mt-2 tabular-nums">{eur(r.laufend.netto)}</div>
              <div className="text-sm opacity-90 mt-1">
                von {eur(r.laufend.brutto)} brutto{r.geringfuegig ? " · geringfügig" : ""}
              </div>
            </div>
            <div className="bg-white border border-black/[0.08] rounded-3xl p-6 shadow-card">
              <div className="text-xs font-mono uppercase tracking-wider text-black/50 font-bold">Netto pro Jahr</div>
              <div className="text-4xl font-display font-extrabold mt-2 tabular-nums text-[#16181D]">{eur(r.jahr.netto)}</div>
              <div className="text-sm text-black/55 mt-1">
                {gehaelter === 14 ? `Ø ${eur(r.nettoMonatDurchschnitt)} auf 12 Monate verteilt` : "12 Gehälter"}
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] rounded-3xl p-5 sm:p-6 shadow-card">
            <h3 className="font-display font-extrabold text-base mb-4">Monatliche Abrechnung</h3>
            <dl className="text-sm tabular-nums divide-y divide-black/[0.06]">
              <div className="flex justify-between py-2 font-bold">
                <dt>Bruttogehalt</dt>
                <dd>{eur(r.laufend.brutto)}</dd>
              </div>
              {r.laufend.svTeile.map((t) => (
                <div key={t.label} className="flex justify-between py-2 text-black/70">
                  <dt>− {t.label}</dt>
                  <dd>{eur(t.betrag)}</dd>
                </div>
              ))}
              <div className="flex justify-between py-2 font-semibold">
                <dt>Sozialversicherung gesamt ({pct(r.laufend.svSatz)})</dt>
                <dd className="whitespace-nowrap pl-3">− {eur(r.laufend.sv)}</dd>
              </div>
              <div className="flex justify-between py-2 font-semibold">
                <dt>Lohnsteuer</dt>
                <dd className="whitespace-nowrap pl-3">− {eur(r.laufend.lohnsteuer)}</dd>
              </div>
              <div className="flex justify-between py-2.5 font-extrabold text-base text-[#E60A1C]">
                <dt>Nettogehalt</dt>
                <dd>{eur(r.laufend.netto)}</dd>
              </div>
            </dl>
          </div>

          {r.sonderzahlungen.length > 0 && (
            <div className="bg-white border border-black/[0.08] rounded-3xl p-5 sm:p-6 shadow-card">
              <h3 className="font-display font-extrabold text-base mb-4 flex items-center gap-2">
                <Gift size={17} className="text-[#E60A1C]" /> Urlaubs- und Weihnachtsgeld
              </h3>
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-xs sm:text-sm tabular-nums">
                  <thead>
                    <tr className="text-left text-xs text-black/50 border-b border-black/[0.08]">
                      <th className="py-2 px-1 font-semibold"></th>
                      <th className="py-2 px-1 font-semibold text-right hidden sm:table-cell">Brutto</th>
                      <th className="py-2 px-1 font-semibold text-right">SV</th>
                      <th className="py-2 px-1 font-semibold text-right">LSt</th>
                      <th className="py-2 px-1 font-semibold text-right">Netto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.sonderzahlungen.map((z) => (
                      <tr key={z.label} className="border-b border-black/[0.05] last:border-0">
                        <td className="py-2.5 px-1 font-semibold">
                          {z.label.split(" (")[0]}
                          <span className="hidden sm:inline"> ({z.label.split(" (")[1]}</span>
                        </td>
                        <td className="py-2.5 px-1 text-right hidden sm:table-cell">{eur(z.brutto)}</td>
                        <td className="py-2.5 px-1 text-right">{eur(z.sv)}</td>
                        <td className="py-2.5 px-1 text-right">{eur(z.lohnsteuer)}</td>
                        <td className="py-2.5 px-1 text-right font-bold">{eur(z.netto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-black/45 mt-3">
                Begünstigt besteuert: 620 € steuerfrei, darüber 6 % — solange das Jahressechstel 2.615 € nicht
                übersteigt, bleiben beide Sonderzahlungen ganz steuerfrei. Keine AK-Umlage und kein
                Wohnbauförderungsbeitrag.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-black/[0.08] rounded-3xl p-5 shadow-card">
              <h3 className="font-display font-extrabold text-sm mb-3 flex items-center gap-1.5">
                <Percent size={15} className="text-[#E60A1C]" /> Lohnsteuer im Detail (Jahr)
              </h3>
              <dl className="text-xs sm:text-sm tabular-nums space-y-1.5">
                <div className="flex justify-between"><dt className="text-black/60">Bemessungsgrundlage</dt><dd>{eur(st.bemessungJahr)}</dd></div>
                <div className="flex justify-between"><dt className="text-black/60">Tarifsteuer</dt><dd>{eur(st.tarifsteuerJahr)}</dd></div>
                {st.familienbonusJahr > 0 && (
                  <div className="flex justify-between"><dt className="text-black/60">− Familienbonus Plus</dt><dd>{eur(st.familienbonusJahr)}</dd></div>
                )}
                {st.avabJahr > 0 && (
                  <div className="flex justify-between"><dt className="text-black/60">− AVAB/AEAB</dt><dd>{eur(st.avabJahr)}</dd></div>
                )}
                <div className="flex justify-between"><dt className="text-black/60">− Verkehrsabsetzbetrag</dt><dd>{eur(st.vabJahr)}</dd></div>
                {st.pendlereuroJahr > 0 && (
                  <div className="flex justify-between"><dt className="text-black/60">− Pendlereuro</dt><dd>{eur(st.pendlereuroJahr)}</dd></div>
                )}
                <div className="flex justify-between font-bold border-t border-black/[0.08] pt-1.5">
                  <dt>Grenzsteuersatz</dt>
                  <dd>{(r.grenzsteuersatz * 100).toLocaleString("de-AT")} %</dd>
                </div>
              </dl>
            </div>
            <div className="bg-white border border-black/[0.08] rounded-3xl p-5 shadow-card">
              <h3 className="font-display font-extrabold text-sm mb-3 flex items-center gap-1.5">
                <Building2 size={15} className="text-[#E60A1C]" /> Kosten für den Arbeitgeber
              </h3>
              <dl className="text-xs sm:text-sm tabular-nums space-y-1.5">
                <div className="flex justify-between"><dt className="text-black/60">pro Monat</dt><dd className="font-bold">{eur(r.arbeitgeber.monat)}</dd></div>
                <div className="flex justify-between"><dt className="text-black/60">pro Jahr</dt><dd className="font-bold">{eur(r.arbeitgeber.jahr)}</dd></div>
                <div className="flex justify-between"><dt className="text-black/60">davon Lohnnebenkosten</dt><dd>{eur(r.arbeitgeber.lohnnebenkostenJahr)}</dd></div>
              </dl>
              <p className="text-[11px] text-black/45 mt-3">
                DG-Sozialversicherung, Mitarbeitervorsorge 1,53 %, DB 3,7 %, DZ des Bundeslandes, Kommunalsteuer 3 %.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-black/45 flex items-start gap-1.5 px-1">
            <Info size={12} className="flex-shrink-0 mt-0.5" />
            Angestellte, Werte 2026. Familienbonus Plus und AVAB wirken nur, wenn sie beim Arbeitgeber beantragt
            sind (Formular E 30); Kindermehrbetrag und SV-Rückerstattung gibt es erst über die
            Arbeitnehmerveranlagung.
          </p>
        </div>
      </div>
    </section>
  );
}
