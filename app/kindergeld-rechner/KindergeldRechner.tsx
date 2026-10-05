"use client";

import { useState } from "react";
import { Baby, Calculator, Info } from "lucide-react";
import { formatEUR } from "@/lib/taxCalculator";
import { KG_JAHRE, KG_WERTE, kindergeldRechnen, type KgJahr, type Veranlagung } from "@/lib/kindergeld";

const feld =
  "w-full bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none";

const VERANLAGUNG: { wert: Veranlagung; label: string }[] = [
  { wert: "verheiratet", label: "Verheiratet — gemeinsame Steuererklärung" },
  { wert: "alleinerziehend", label: "Alleinerziehend — voller Freibetrag" },
  { wert: "getrennt", label: "Nicht verheiratet / getrennt — halber Freibetrag" },
];

export default function KindergeldRechner() {
  const [jahr, setJahr] = useState<KgJahr>(2027);
  const [veranlagung, setVeranlagung] = useState<Veranlagung>("verheiratet");
  const [brutto1, setBrutto1] = useState(4500);
  const [brutto2, setBrutto2] = useState(2500);
  const [kinder, setKinder] = useState(2);

  const r = kindergeldRechnen({
    jahr,
    veranlagung,
    brutto1: Math.max(0, brutto1) * 12,
    brutto2: Math.max(0, brutto2) * 12,
    kinder,
  });
  const kg = KG_WERTE[jahr].kindergeld;
  const plusGegen2026 = (kg - KG_WERTE[2026].kindergeld) * kinder;
  const freibetragZaehlt = r.mehrGesamt > 0;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <Baby size={14} /> § 66 EStG · Günstigerprüfung § 31 EStG
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Kindergeld 2027:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Rechner</span>
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            <strong className="text-[#16181D]">{KG_WERTE[2027].kindergeld} € pro Kind</strong> ab Januar 2027 laut
            Regierungsentwurf, {KG_WERTE[2028].kindergeld} € ab 2028 — und ob für Sie der{" "}
            <strong className="text-[#16181D]">Kinderfreibetrag</strong> mehr bringt.
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
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Jahr">
                {KG_JAHRE.map((j) => (
                  <button key={j} type="button" role="radio" aria-checked={jahr === j} onClick={() => setJahr(j)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-bold border transition-colors ${jahr === j ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#FFFFFF] text-[#16181D] border-black/[0.10]"}`}>
                    {j}
                  </button>
                ))}
              </div>
              <div>
                <label htmlFor="kg-kinder" className="block text-sm font-semibold text-black/70 mb-2">Anzahl Kinder mit Kindergeld</label>
                <select id="kg-kinder" value={kinder} onChange={(e) => setKinder(Number(e.target.value))} className={feld}>
                  {[1, 2, 3, 4, 5, 6].map((k) => <option key={k} value={k}>{k} {k === 1 ? "Kind" : "Kinder"}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="kg-ver" className="block text-sm font-semibold text-black/70 mb-2">Familienstand</label>
                <select id="kg-ver" value={veranlagung} onChange={(e) => setVeranlagung(e.target.value as Veranlagung)} className={feld}>
                  {VERANLAGUNG.map((v) => <option key={v.wert} value={v.wert}>{v.label}</option>)}
                </select>
              </div>
              <div className={veranlagung === "verheiratet" ? "grid grid-cols-2 gap-3" : ""}>
                <div>
                  <label htmlFor="kg-b1" className="block text-sm font-semibold text-black/70 mb-2">
                    {veranlagung === "verheiratet" ? "Brutto / Monat (Sie)" : "Ihr Brutto / Monat"}
                  </label>
                  <input id="kg-b1" type="number" inputMode="decimal" min={0} step={100} value={brutto1} onChange={(e) => setBrutto1(Number(e.target.value))} className={feld} />
                </div>
                {veranlagung === "verheiratet" && (
                  <div>
                    <label htmlFor="kg-b2" className="block text-sm font-semibold text-black/70 mb-2">Brutto / Monat (Partner)</label>
                    <input id="kg-b2" type="number" inputMode="decimal" min={0} step={100} value={brutto2} onChange={(e) => setBrutto2(Number(e.target.value))} className={feld} />
                  </div>
                )}
              </div>
              <p className="text-xs text-black/60 leading-relaxed">
                {veranlagung === "alleinerziehend"
                  ? "Mit Entlastungsbetrag für Alleinerziehende und den Freibeträgen des anderen Elternteils (Übertragung, wenn er keinen Unterhalt zahlt)."
                  : veranlagung === "getrennt"
                  ? "Jeder Elternteil bekommt den halben Freibetrag; verglichen wird mit dem halben Kindergeld — unabhängig davon, wer es ausgezahlt bekommt."
                  : "Bei Ehepaaren zählt das gemeinsame Einkommen (Splittingtarif)."}
              </p>
            </div>
          </div>

          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9" aria-live="polite">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5 flex items-center gap-2">
              <Baby size={22} className="text-[#E60A1C]" /> Ergebnis {jahr}
            </h2>
            <div className="space-y-2.5">
              <Zeile label={`Kindergeld pro Monat (${kinder} × ${kg} €)`} wert={formatEUR(kg * kinder)} />
              <Zeile label="Kindergeld im Jahr" wert={formatEUR(r.kindergeldAuszahlungJahr)} />
              {jahr !== 2026 && <Zeile label="Mehr als 2026 pro Monat" wert={`+${formatEUR(plusGegen2026)}`} />}
              <Zeile label="Freibeträge je Kind (Kinder- + Betreuungsfreibetrag)" wert={formatEUR(r.freibetragJeKind)} />
              <div className="h-2" />
              {r.kinder.map((k) => (
                <Zeile
                  key={k.nr}
                  label={`${k.nr}. Kind: Steuerersparnis durch Freibetrag`}
                  wert={`${formatEUR(k.ersparnis)} ${k.freibetragGuenstiger ? "✓" : `< ${formatEUR(k.kindergeldJahr)}`}`}
                />
              ))}
              <div className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 rounded-xl px-5 py-4 border ${freibetragZaehlt ? "bg-emerald-50 border-emerald-500/25" : "bg-black/[0.04] border-black/[0.08]"}`}>
                <span className="text-black/80 text-sm font-semibold">
                  {freibetragZaehlt ? "Zusätzlich über die Steuererklärung" : "Für Sie günstiger: das Kindergeld"}
                </span>
                <span className={`text-2xl font-mono font-extrabold ml-auto ${freibetragZaehlt ? "text-emerald-700" : "text-[#16181D]"}`}>
                  {freibetragZaehlt ? `+${formatEUR(r.mehrGesamt)}` : formatEUR(r.kindergeldAuszahlungJahr)}
                </span>
              </div>
              <p className="flex gap-2 text-xs text-black/60 px-1 leading-relaxed">
                <Info size={13} className="flex-shrink-0 mt-0.5" />
                {freibetragZaehlt
                  ? `Das Finanzamt zieht die Freibeträge ab und rechnet das Kindergeld gegen — Sie bekommen die Differenz mit dem Steuerbescheid. ${veranlagung === "getrennt" ? "Ihr Anteil an der Förderung (halbes Kindergeld plus Erstattung)" : "Staatliche Förderung insgesamt"}: ${formatEUR(r.foerderungGesamt)} im Jahr.`
                  : "Die Steuerersparnis durch die Freibeträge liegt unter dem Kindergeld — Sie behalten das Kindergeld, eine Nachzahlung gibt es dadurch nie."}{" "}
                {KG_WERTE[jahr].status === "entwurf" && "Werte ab 2027 laut Regierungsentwurf, noch nicht beschlossen."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Zeile({ label, wert }: { label: string; wert: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-2.5">
      <span className="text-black/70 text-sm font-medium">{label}</span>
      <span className="text-sm sm:text-base font-mono font-bold text-[#16181D] whitespace-nowrap ml-auto">{wert}</span>
    </div>
  );
}
