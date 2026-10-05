"use client";

import { useMemo, useState } from "react";
import { Banknote, Calculator, Info, Receipt, Undo2 } from "lucide-react";
import { formatEUR, type Steuerklasse } from "@/lib/taxCalculator";
import { berechneAbfindung, type SteuerTeil } from "@/lib/abfindung";
import { BUNDESLAENDER } from "@/data/bundeslaender";

/*
 * Rechenkern: lib/abfindung.ts. Seit 2025 behält der Arbeitgeber die Lohnsteuer
 * OHNE Fünftelregelung ein; die Ermäßigung kommt erst mit der Steuererklärung.
 * Der Rechner zeigt deshalb drei Werte: Einbehalt, Steuer nach Veranlagung und
 * die Differenz als voraussichtliche Erstattung. (Die frühere Fassung rechnete
 * die Fünftelregelung direkt in den Auszahlungsbetrag und schätzte Klasse V mit
 * ESt × 1,45.)
 */

const STEUERKLASSE_INFO: Record<Steuerklasse, string> = {
  1: "Klasse I — Ledig",
  2: "Klasse II — Alleinerziehend",
  3: "Klasse III — Verheiratet (höheres Einkommen)",
  4: "Klasse IV — Verheiratet (gleiches Einkommen)",
  5: "Klasse V — Verheiratet (geringeres Einkommen)",
  6: "Klasse VI — Zweiter Job",
};

const inputCls =
  "w-full bg-[#FFFFFF] border border-black/[0.12] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none";

function Zeilen({ t }: { t: SteuerTeil }) {
  return (
    <div className="divide-y divide-black/[0.06] text-sm">
      {[
        { l: "Lohn-/Einkommensteuer", v: t.lohnsteuer },
        { l: "Solidaritätszuschlag", v: t.soli },
        { l: "Kirchensteuer", v: t.kirchensteuer },
      ].map((z) => (
        <div key={z.l} className="flex flex-wrap items-center justify-between gap-x-3 py-1.5">
          <span className="text-black/65">{z.l}</span>
          <span className="ml-auto font-mono tabular-nums">{formatEUR(z.v)}</span>
        </div>
      ))}
    </div>
  );
}

export default function AbfindungsRechner() {
  const [abfindung, setAbfindung] = useState(30000);
  const [jahresbrutto, setJahresbrutto] = useState(54000);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);
  const [landSlug, setLandSlug] = useState("nordrhein-westfalen");
  const land = BUNDESLAENDER.find((b) => b.slug === landSlug) ?? BUNDESLAENDER[0];

  const r = useMemo(
    () =>
      berechneAbfindung({
        abfindung,
        jahresbrutto,
        steuerklasse,
        kirche,
        kirchensteuerSatz: land.kirchensteuerSatz,
      }),
    [abfindung, jahresbrutto, steuerklasse, kirche, land],
  );

  return (
    <div className="bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <Banknote size={14} />
            Abfindung · Fünftelregelung · Rechtsstand 2026
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Abfindungsrechner 2026:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Abfindung brutto netto</span>
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Was der Arbeitgeber bei Auszahlung einbehält, was nach der Fünftelregelung in der Steuererklärung übrig bleibt und
            wie viel Sie zurückbekommen.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-2 pb-12 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-5 sm:p-9 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" />
              Ihre Angaben
            </h2>
            <div className="space-y-5">
              <div>
                <label htmlFor="ab-betrag" className="block text-sm font-semibold text-black/70 mb-2">Abfindung brutto</label>
                <input id="ab-betrag" type="number" min={0} inputMode="decimal" value={abfindung} onChange={(e) => setAbfindung(Number(e.target.value))} className={`${inputCls} text-lg font-bold`} />
              </div>
              <div>
                <label htmlFor="ab-jahr" className="block text-sm font-semibold text-black/70 mb-2">
                  Jahresbrutto ohne Abfindung (im Auszahlungsjahr)
                </label>
                <input id="ab-jahr" type="number" min={0} inputMode="decimal" value={jahresbrutto} onChange={(e) => setJahresbrutto(Number(e.target.value))} className={`${inputCls} text-lg font-bold`} />
                <p className="text-xs text-black/50 mt-1.5">Endet der Job im Lauf des Jahres, nur den bis dahin gezahlten Lohn eintragen.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ab-sk" className="block text-sm font-semibold text-black/70 mb-2">Steuerklasse</label>
                  <select id="ab-sk" value={steuerklasse} onChange={(e) => setSteuerklasse(Number(e.target.value) as Steuerklasse)} className={inputCls}>
                    {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => (
                      <option key={sk} value={sk}>{STEUERKLASSE_INFO[sk]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="ab-land" className="block text-sm font-semibold text-black/70 mb-2">Bundesland</label>
                  <select id="ab-land" value={landSlug} onChange={(e) => setLandSlug(e.target.value)} className={inputCls}>
                    {BUNDESLAENDER.map((b) => (
                      <option key={b.slug} value={b.slug}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                Kirchensteuer ({Math.round(land.kirchensteuerSatz * 100)} %)
              </label>
              <p className="text-xs text-black/55 bg-[#F4F5F7] border border-black/[0.08] rounded-xl px-3 py-2.5">
                Sozialabgaben fallen auf eine Abfindung für den Verlust des Arbeitsplatzes nicht an.
              </p>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-5 sm:p-9 shadow-sm space-y-4" aria-live="polite">
            <div className="rounded-2xl border border-black/[0.10] p-4">
              <p className="text-sm font-bold text-[#16181D] flex items-center gap-2 mb-1">
                <Receipt size={16} className="text-[#E60A1C]" /> 1. Bei Auszahlung (Lohnsteuerabzug)
              </p>
              <p className="text-xs text-black/55 mb-2">Ohne Fünftelregelung, wie für jeden sonstigen Bezug.</p>
              <Zeilen t={r.auszahlung} />
              <div className="flex flex-wrap items-center justify-between gap-x-3 pt-2 mt-1 border-t border-black/10 font-bold">
                <span>Netto auf dem Konto</span>
                <span className="ml-auto font-mono text-lg">{formatEUR(r.nettoBeiAuszahlung)}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-black/[0.10] p-4">
              <p className="text-sm font-bold text-[#16181D] flex items-center gap-2 mb-1">
                <Calculator size={16} className="text-[#E60A1C]" /> 2. Nach der Steuererklärung
              </p>
              <p className="text-xs text-black/55 mb-2">
                {r.fuenftelGuenstiger
                  ? `Mit Fünftelregelung (§ 34 EStG), ${formatEUR(r.fuenftelVorteil)} günstiger als die normale Besteuerung.`
                  : "Die Fünftelregelung bringt hier keinen Vorteil; das Finanzamt rechnet normal."}
              </p>
              <Zeilen t={r.veranlagung} />
              <div className="flex flex-wrap items-center justify-between gap-x-3 pt-2 mt-1 border-t border-black/10 font-bold">
                <span>Abfindung netto endgültig</span>
                <span className="ml-auto font-mono text-lg">{formatEUR(r.nettoNachErklaerung)}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50 border border-emerald-500/25 p-4">
              <p className="text-sm font-bold text-[#16181D] flex items-center gap-2">
                <Undo2 size={16} className="text-emerald-700" /> 3. Voraussichtliche Erstattung
              </p>
              <p className="text-3xl font-mono font-extrabold text-emerald-700 mt-1">{formatEUR(Math.max(0, r.erstattung))}</p>
              <p className="text-xs text-black/60 mt-1">vom Finanzamt, nach Abgabe der Einkommensteuererklärung für das Auszahlungsjahr.</p>
            </div>

            {r.unsicher && (
              <p className="flex gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-500/25 rounded-xl px-3 py-2">
                <Info size={14} className="flex-shrink-0 mt-0.5" />
                Klasse IV, V oder VI: Die endgültige Steuer hängt an der Zusammenveranlagung mit dem Partner bzw. an Ihren
                übrigen Einkünften. Schritt 2 und 3 rechnen vereinfacht mit dem Grundtarif und nur diesem Lohn.
              </p>
            )}
            <p className="text-xs text-black/50">Steuerjahr 2026. Alle Angaben ohne Gewähr, keine Steuerberatung.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
