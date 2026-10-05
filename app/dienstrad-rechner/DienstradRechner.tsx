"use client";

import { useState } from "react";
import { Bike, Calculator, Info } from "lucide-react";
import { formatEUR, type Steuerklasse } from "@/lib/taxCalculator";
import { dienstradRechnen, type RadTyp } from "@/lib/dienstrad";

const feld =
  "w-full bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none";

export default function DienstradRechner() {
  const [brutto, setBrutto] = useState(3500);
  const [sk, setSk] = useState<Steuerklasse>(1);
  const [kinderlos, setKinderlos] = useState(true);
  const [kirche, setKirche] = useState(false);
  const [uvp, setUvp] = useState(3600);
  const [rate, setRate] = useState(105);
  const [zuschuss, setZuschuss] = useState(0);
  const [typ, setTyp] = useState<RadTyp>("fahrrad");
  const [km, setKm] = useState(10);
  const [laufzeit, setLaufzeit] = useState(36);
  const [uebernahmePct, setUebernahmePct] = useState(15);
  const [rabatt, setRabatt] = useState(0);

  const r = dienstradRechnen({
    bruttoMonat: Math.max(0, brutto), steuerklasse: sk, kinderlosUeber23: kinderlos, kirche,
    uvp: Math.max(0, uvp), rate: Math.max(0, rate), zuschuss: Math.max(0, zuschuss), typ, kmArbeitsweg: km,
    laufzeitMonate: laufzeit, uebernahme: (Math.max(0, uvp) * Math.max(0, uebernahmePct)) / 100, kaufRabattPct: rabatt,
  });
  const lohntSich = r.vorteilGesamt > 0;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <Bike size={14} /> 0,25-%-Regel · Gehaltsumwandlung
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Dienstrad-Rechner:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Jobrad netto</span>
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Was Sie ein Dienstrad über Gehaltsumwandlung <strong className="text-[#16181D]">wirklich kostet</strong> —
            nach Steuern, Sozialabgaben und geldwertem Vorteil — und ob es günstiger ist als der Kauf.
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="dr-brutto" className="block text-sm font-semibold text-black/70 mb-2">Brutto / Monat</label>
                  <input id="dr-brutto" type="number" inputMode="decimal" min={0} step={100} value={brutto} onChange={(e) => setBrutto(Number(e.target.value))} className={feld} />
                </div>
                <div>
                  <label htmlFor="dr-sk" className="block text-sm font-semibold text-black/70 mb-2">Steuerklasse</label>
                  <select id="dr-sk" value={sk} onChange={(e) => setSk(Number(e.target.value) as Steuerklasse)} className={feld}>
                    {[1, 2, 3, 4, 5, 6].map((k) => <option key={k} value={k}>Klasse {k}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-black/75">
                <label className="flex items-center gap-2"><input type="checkbox" checked={kinderlos} onChange={(e) => setKinderlos(e.target.checked)} /> kinderlos, über 23</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} /> Kirchensteuer</label>
              </div>

              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Art des Rads">
                {([["fahrrad", "Fahrrad / E-Bike bis 25 km/h"], ["spedelec", "S-Pedelec (bis 45 km/h)"]] as const).map(([w, l]) => (
                  <button key={w} type="button" role="radio" aria-checked={typ === w} onClick={() => setTyp(w)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-bold border transition-colors ${typ === w ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#FFFFFF] text-[#16181D] border-black/[0.10]"}`}>
                    {l}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="dr-uvp" className="block text-sm font-semibold text-black/70 mb-2">UVP des Rads</label>
                  <input id="dr-uvp" type="number" inputMode="decimal" min={0} step={100} value={uvp} onChange={(e) => setUvp(Number(e.target.value))} className={feld} />
                </div>
                <div>
                  <label htmlFor="dr-rate" className="block text-sm font-semibold text-black/70 mb-2">Leasingrate / Monat</label>
                  <input id="dr-rate" type="number" inputMode="decimal" min={0} step={1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className={feld} />
                </div>
                <div>
                  <label htmlFor="dr-zuschuss" className="block text-sm font-semibold text-black/70 mb-2">Zuschuss Arbeitgeber</label>
                  <input id="dr-zuschuss" type="number" inputMode="decimal" min={0} step={1} value={zuschuss} onChange={(e) => setZuschuss(Number(e.target.value))} className={feld} />
                </div>
                <div>
                  <label htmlFor="dr-laufzeit" className="block text-sm font-semibold text-black/70 mb-2">Laufzeit (Monate)</label>
                  <input id="dr-laufzeit" type="number" inputMode="numeric" min={12} max={60} value={laufzeit} onChange={(e) => setLaufzeit(Number(e.target.value))} className={feld} />
                </div>
                {typ === "spedelec" && (
                  <div className="col-span-2">
                    <label htmlFor="dr-km" className="block text-sm font-semibold text-black/70 mb-2">Entfernung zur Arbeit (km, einfach)</label>
                    <input id="dr-km" type="number" inputMode="numeric" min={0} value={km} onChange={(e) => setKm(Number(e.target.value))} className={feld} />
                  </div>
                )}
                <div>
                  <label htmlFor="dr-ueb" className="block text-sm font-semibold text-black/70 mb-2">Übernahme am Ende (% UVP)</label>
                  <input id="dr-ueb" type="number" inputMode="decimal" min={0} max={100} value={uebernahmePct} onChange={(e) => setUebernahmePct(Number(e.target.value))} className={feld} />
                </div>
                <div>
                  <label htmlFor="dr-rabatt" className="block text-sm font-semibold text-black/70 mb-2">Rabatt beim Kauf (%)</label>
                  <input id="dr-rabatt" type="number" inputMode="decimal" min={0} max={50} value={rabatt} onChange={(e) => setRabatt(Number(e.target.value))} className={feld} />
                </div>
              </div>
              <p className="text-xs text-black/60 leading-relaxed">
                Rate, Übernahmepreis und Laufzeit stehen in Ihrem Leasingangebot; die vorbelegten Werte sind nur ein Beispiel.
                Ist eine Versicherung in der Rate enthalten, fehlt sie beim Kaufvergleich.
              </p>
            </div>
          </div>

          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9 h-fit" aria-live="polite">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5 flex items-center gap-2">
              <Bike size={22} className="text-[#E60A1C]" /> Ihr Ergebnis
            </h2>
            <div className="space-y-2.5">
              <Zeile label="Gehaltsumwandlung / Monat" wert={formatEUR(r.umwandlung)} />
              <Zeile label={r.steuerfrei ? "Geldwerter Vorteil (steuerfrei, § 3 Nr. 37 EStG)" : "Geldwerter Vorteil / Monat"} wert={formatEUR(r.vorteil)} />
              <Zeile label="Netto ohne Dienstrad" wert={formatEUR(r.nettoOhne)} />
              <Zeile label="Netto mit Dienstrad" wert={formatEUR(r.nettoMit)} />
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Ihre echten Kosten / Monat</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-700 ml-auto">{formatEUR(r.belastung)}</span>
              </div>
              {rate > 0 && <Zeile label="Ersparnis gegenüber der Rate" wert={`${r.ersparnisPct.toLocaleString("de-DE", { maximumFractionDigits: 0 })} %`} />}
              <div className="h-2" />
              <Zeile label={`Leasing gesamt (${laufzeit} Monate + Übernahme)`} wert={formatEUR(r.kostenLeasing)} />
              <Zeile label="Kauf zum UVP abzüglich Rabatt" wert={formatEUR(r.kostenKauf)} />
              <div className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 rounded-xl px-5 py-4 border ${lohntSich ? "bg-emerald-50 border-emerald-500/25" : "bg-[#E60A1C]/[0.06] border-[#E60A1C]/25"}`}>
                <span className="text-black/80 text-sm font-semibold">{lohntSich ? "Leasing günstiger um" : "Kauf günstiger um"}</span>
                <span className={`text-xl font-mono font-extrabold ml-auto ${lohntSich ? "text-emerald-700" : "text-[#E60A1C]"}`}>{formatEUR(Math.abs(r.vorteilGesamt))}</span>
              </div>
              {r.renteWeniger > 0.005 && <Zeile label="Spätere Rente (Wert 2026) niedriger um" wert={`${formatEUR(r.renteWeniger)} / Monat`} />}
              <p className="flex gap-2 text-xs text-black/60 px-1 leading-relaxed">
                <Info size={13} className="flex-shrink-0 mt-0.5" />
                {r.steuerfrei
                  ? "Zahlt der Arbeitgeber die Rate zusätzlich zum Lohn, ist das Rad steuer- und beitragsfrei."
                  : typ === "spedelec"
                  ? "S-Pedelecs gelten als Kraftfahrzeug: 1 % des geviertelten Listenpreises plus 0,03 % je Entfernungskilometer."
                  : "Geldwerter Vorteil: 1 % eines auf volle 100 € abgerundeten Viertels der UVP — der Arbeitsweg ist damit abgegolten."}{" "}
                Weniger Brutto senkt auch Arbeitslosen-, Kranken- und Elterngeld etwas.
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
