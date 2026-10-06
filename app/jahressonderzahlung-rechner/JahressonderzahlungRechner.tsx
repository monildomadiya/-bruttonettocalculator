"use client";

import { useMemo, useState } from "react";
import { Gift, Calculator, Info } from "lucide-react";
import { formatEUR, type Steuerklasse } from "@/lib/taxCalculator";
import { nettoEinmalzahlung } from "@/lib/einmalzahlung";
import { JSZ_TARIFE, JSZ_ENTGELTGRUPPEN, egLabel, jszProzent, type JszTarif } from "@/data/jahressonderzahlung";
import { TVOED_VKA_2026 } from "@/data/tvoed";

type TarifWahl = JszTarif["key"] | "eigen";

/** E 9a/9b/9c → Entgeltgruppe 9 für die Staffel; "E 15Ü" → 15. */
const egAusLabel = (label: string) => parseInt(label.replace(/\D+/g, ""), 10);

const feld =
  "w-full bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none";

export default function JahressonderzahlungRechner() {
  const [tarif, setTarif] = useState<TarifWahl>("vka");
  const [eg, setEg] = useState(9);
  const [eigenProzent, setEigenProzent] = useState(80);
  const [brutto, setBrutto] = useState(4097.67);
  const [tabGruppe, setTabGruppe] = useState("e9a");
  const [tabStufe, setTabStufe] = useState(3);
  const [teilzeit, setTeilzeit] = useState(100);
  const [monateOhne, setMonateOhne] = useState(0);
  const [sk, setSk] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);
  const [kinderlos23, setKinderlos23] = useState(false);

  const istVka = tarif === "vka" || tarif === "vka-kb";

  const ausTabelle = (slug: string, stufe: number, tz: number) => {
    const g = TVOED_VKA_2026.find((x) => x.slug === slug);
    if (!g) return;
    const wert = g.stufen[stufe - 1] ?? g.stufen.filter((v): v is number => v != null).at(-1) ?? 0;
    setBrutto(Math.round(wert * (tz / 100) * 100) / 100);
    setEg(egAusLabel(g.label));
  };

  const prozent = tarif === "eigen" ? Math.max(0, eigenProzent) : jszProzent(tarif, eg);
  const anteil = (12 - Math.min(11, Math.max(0, monateOhne))) / 12;
  const jszBrutto = Math.max(0, brutto) * (prozent / 100) * anteil;

  const r = useMemo(
    () =>
      nettoEinmalzahlung({
        bruttoMonat: Math.max(0, brutto),
        einmal: jszBrutto,
        steuerklasse: sk,
        kirche,
        kinderlosUeber23: kinderlos23,
        auszahlungsMonat: 11,
      }),
    [brutto, jszBrutto, sk, kirche, kinderlos23],
  );

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <Gift size={14} /> TVöD · TV-L · November 2026
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Jahressonderzahlung-
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Rechner 2026</span>
            <span className="block text-xl sm:text-3xl lg:text-4xl font-bold text-black/75 mt-2">Weihnachtsgeld im öffentlichen Dienst</span>
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Wie viel <strong className="text-[#16181D]">Weihnachtsgeld</strong> bekommen Sie im öffentlichen Dienst — brutto
            und netto? Die <strong className="text-[#16181D]">Jahressonderzahlung</strong> im November mit den Sätzen 2026
            für TVöD Bund, TVöD VKA und TV-L.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-2 pb-12 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Ihre Angaben
            </h2>
            <div className="space-y-5">
              <div>
                <label htmlFor="jsz-tarif" className="block text-sm font-semibold text-black/70 mb-2">Tarifvertrag</label>
                <select id="jsz-tarif" value={tarif} onChange={(e) => setTarif(e.target.value as TarifWahl)} className={feld}>
                  {JSZ_TARIFE.map((t) => (
                    <option key={t.key} value={t.key}>{t.name}</option>
                  ))}
                  <option value="eigen">Anderer Tarif / eigener Prozentsatz (z. B. AVR)</option>
                </select>
              </div>

              {tarif === "eigen" ? (
                <div>
                  <label htmlFor="jsz-eigen" className="block text-sm font-semibold text-black/70 mb-2">Prozentsatz des Monatsentgelts</label>
                  <input id="jsz-eigen" type="number" inputMode="decimal" min={0} max={200} step={0.01} value={eigenProzent}
                    onChange={(e) => setEigenProzent(Number(e.target.value))} className={feld} />
                </div>
              ) : (
                <div>
                  <label htmlFor="jsz-eg" className="block text-sm font-semibold text-black/70 mb-2">Entgeltgruppe (Stand 1. September)</label>
                  <select id="jsz-eg" value={eg} onChange={(e) => setEg(Number(e.target.value))} className={feld}>
                    {JSZ_ENTGELTGRUPPEN.map((g) => (
                      <option key={g} value={g}>{egLabel(g)} — {jszProzent(tarif, g).toLocaleString("de-DE")} %</option>
                    ))}
                  </select>
                </div>
              )}

              {istVka && (
                <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-4">
                  <p className="text-xs font-semibold text-black/60 mb-2">Gehalt aus der TVöD-VKA-Tabelle ab 1.5.2026 übernehmen:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <select aria-label="Gruppe" value={tabGruppe} onChange={(e) => { setTabGruppe(e.target.value); ausTabelle(e.target.value, tabStufe, teilzeit); }} className={feld + " !py-2 text-sm"}>
                      {TVOED_VKA_2026.map((g) => <option key={g.slug} value={g.slug}>{g.label}</option>)}
                    </select>
                    <select aria-label="Stufe" value={tabStufe} onChange={(e) => { const s = Number(e.target.value); setTabStufe(s); ausTabelle(tabGruppe, s, teilzeit); }} className={feld + " !py-2 text-sm"}>
                      {[1, 2, 3, 4, 5, 6].map((s) => <option key={s} value={s}>Stufe {s}</option>)}
                    </select>
                    <select aria-label="Arbeitszeit" value={teilzeit} onChange={(e) => { const t = Number(e.target.value); setTeilzeit(t); ausTabelle(tabGruppe, tabStufe, t); }} className={feld + " !py-2 text-sm"}>
                      {[100, 90, 80, 75, 70, 60, 50, 40, 30].map((t) => <option key={t} value={t}>{t} %</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="jsz-brutto" className="block text-sm font-semibold text-black/70 mb-2">
                  Ø Monatsbrutto Juli bis September (ohne Überstunden)
                </label>
                <input id="jsz-brutto" type="number" inputMode="decimal" min={0} step={0.01} value={brutto}
                  onChange={(e) => setBrutto(Number(e.target.value))} className={feld + " font-bold text-lg"} />
              </div>

              <div>
                <label htmlFor="jsz-ohne" className="block text-sm font-semibold text-black/70 mb-2">Monate 2026 ohne Entgelt (je 1/12 weniger)</label>
                <select id="jsz-ohne" value={monateOhne} onChange={(e) => setMonateOhne(Number(e.target.value))} className={feld}>
                  {Array.from({ length: 12 }, (_, i) => <option key={i} value={i}>{i === 0 ? "keine — ganzes Jahr beschäftigt" : `${i} ${i === 1 ? "Monat" : "Monate"}`}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="jsz-sk" className="block text-sm font-semibold text-black/70 mb-2">Steuerklasse</label>
                <select id="jsz-sk" value={sk} onChange={(e) => setSk(Number(e.target.value) as Steuerklasse)} className={feld}>
                  <option value={1}>I — ledig</option>
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
                  Kirchensteuerpflichtig (9 %)
                </label>
                <label className="flex items-center gap-3 text-sm font-medium text-black/80 cursor-pointer">
                  <input type="checkbox" checked={kinderlos23} onChange={(e) => setKinderlos23(e.target.checked)} className="h-4 w-4 accent-[#E60A1C]" />
                  23 Jahre oder älter und kinderlos (+0,6 % Pflegeversicherung)
                </label>
              </div>
            </div>
          </div>

          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Gift size={22} className="text-[#E60A1C]" /> Ihre Jahressonderzahlung
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-700 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Auszahlung mit dem Novembergehalt 2026 — keine Steuerberatung
            </div>
            <div className="space-y-3" aria-live="polite">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 bg-[#FFFFFF] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/75 text-sm font-semibold">
                  Brutto ({prozent.toLocaleString("de-DE")} %{anteil < 1 ? `, ${12 - monateOhne}/12` : ""})
                </span>
                <span className="text-xl font-mono font-extrabold text-[#16181D] ml-auto">{formatEUR(jszBrutto)}</span>
              </div>
              {[
                { label: "Krankenversicherung", v: r.svKranken },
                { label: "Pflegeversicherung", v: r.svPflege },
                { label: "Rentenversicherung", v: r.svRente },
                { label: "Arbeitslosenversicherung", v: r.svArbeitslosen },
                { label: `Lohnsteuer (Klasse ${sk})`, v: r.lohnsteuer },
                { label: "Solidaritätszuschlag", v: r.soli },
                ...(kirche ? [{ label: "Kirchensteuer", v: r.kirchensteuer }] : []),
              ].map((row) => (
                <div key={row.label} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-2.5">
                  <span className="text-black/70 text-sm font-medium">{row.label}</span>
                  <span className="text-sm sm:text-base font-mono font-bold text-[#16181D] ml-auto">−{formatEUR(row.v)}</span>
                </div>
              ))}
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Netto im November extra</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-700 ml-auto">{formatEUR(r.netto)}</span>
              </div>
              <p className="text-xs text-black/60 px-1 leading-relaxed">
                Von der Sonderzahlung bleiben {r.nettoQuotePct.toLocaleString("de-DE", { maximumFractionDigits: 1 })} % netto.
                Sie wird als sonstiger Bezug versteuert: Lohnsteuer auf das Jahresgehalt mit Sonderzahlung minus
                Lohnsteuer ohne. Sozialabgaben fallen nur bis zur anteiligen Beitragsbemessungsgrenze bis November an
                {r.svBasisKvPv < r.einmal ? " — bei Ihnen ist die Grenze der Kranken- und Pflegeversicherung schon teilweise erreicht" : ""}.
                {r.naeherung ? " Im Midijob-Übergangsbereich (bis 2.000 €) ist das Ergebnis eine Näherung." : ""}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
