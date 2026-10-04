"use client";

import { useMemo, useState } from "react";
import { Landmark, Calculator, Info } from "lucide-react";
import { calculateNetto, formatEUR, type Steuerklasse } from "@/lib/taxCalculator";
import { nettoEinmalzahlung } from "@/lib/einmalzahlung";
import { jszProzent } from "@/data/jahressonderzahlung";
import { TVL_2026, TVL_GUELTIG_AB, TVL_NAECHSTE_STUFEN } from "@/data/tvl";

const feld =
  "w-full bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none";

export default function TvlRechner() {
  const [slug, setSlug] = useState("e9b");
  const [stufe, setStufe] = useState(3);
  const [teilzeit, setTeilzeit] = useState(100);
  const [sk, setSk] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);
  const [kinderlos23, setKinderlos23] = useState(false);

  const gruppe = TVL_2026.find((g) => g.slug === slug)!;
  const belegt = gruppe.stufen.map((v, i) => (v == null ? null : i + 1)).filter((v): v is number => v != null);
  const st = belegt.includes(stufe) ? stufe : belegt[0];
  const tabelle = gruppe.stufen[st - 1] ?? 0;
  const brutto = Math.round(tabelle * (Math.min(100, Math.max(1, teilzeit)) / 100) * 100) / 100;
  const prozent = jszProzent("tvl", gruppe.eg);
  const jsz = brutto * (prozent / 100);

  const r = useMemo(() => {
    const laufend = calculateNetto({
      bruttoMonat: brutto, jahr: 2026, steuerklasse: sk, verheiratet: sk === 3 || sk === 4 || sk === 5, kinderlosUeber23: kinderlos23, kirche,
    });
    const sonder = nettoEinmalzahlung({ bruttoMonat: brutto, einmal: jsz, steuerklasse: sk, kirche, kinderlosUeber23: kinderlos23, auszahlungsMonat: 11 });
    return { laufend, sonder };
  }, [brutto, jsz, sk, kirche, kinderlos23]);

  const plus2027 = Math.round(brutto * (1 + TVL_NAECHSTE_STUFEN[0].prozent / 100) * 100) / 100;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <Landmark size={14} /> Tabelle ab {TVL_GUELTIG_AB}
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            TV-L-Rechner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">2026</span>
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Brutto und <strong className="text-[#16181D]">Netto im öffentlichen Dienst der Länder</strong> — nach
            Entgeltgruppe und Stufe, mit Jahressonderzahlung und der Erhöhung 2027.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-2 pb-12 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Eingruppierung
            </h2>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="tvl-eg" className="block text-sm font-semibold text-black/70 mb-2">Entgeltgruppe</label>
                  <select id="tvl-eg" value={slug} onChange={(e) => setSlug(e.target.value)} className={feld}>
                    {TVL_2026.map((g) => <option key={g.slug} value={g.slug}>{g.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="tvl-stufe" className="block text-sm font-semibold text-black/70 mb-2">Stufe</label>
                  <select id="tvl-stufe" value={st} onChange={(e) => setStufe(Number(e.target.value))} className={feld}>
                    {belegt.map((s) => <option key={s} value={s}>Stufe {s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="tvl-tz" className="block text-sm font-semibold text-black/70 mb-2">Arbeitszeit (Vollzeit = 100 %)</label>
                <input id="tvl-tz" type="number" min={1} max={100} value={teilzeit} onChange={(e) => setTeilzeit(Number(e.target.value))} className={feld} />
              </div>
              <div>
                <label htmlFor="tvl-sk" className="block text-sm font-semibold text-black/70 mb-2">Steuerklasse</label>
                <select id="tvl-sk" value={sk} onChange={(e) => setSk(Number(e.target.value) as Steuerklasse)} className={feld}>
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
              <Landmark size={22} className="text-[#E60A1C]" /> {gruppe.label} Stufe {st}
            </h2>
            <div className="flex items-center gap-2 mb-5 text-xs text-amber-700 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Steuerjahr 2026, Ø-Zusatzbeitrag 2,9 % — keine Steuerberatung
            </div>
            <div className="space-y-2.5" aria-live="polite">
              <Zeile label={`Tabellenentgelt${teilzeit < 100 ? ` × ${teilzeit} %` : ""}`} wert={formatEUR(brutto)} fett />
              <Zeile label="Sozialabgaben" wert={`−${formatEUR(r.laufend.sv.summeMonat)}`} />
              <Zeile label={`Lohnsteuer, Soli${kirche ? ", Kirche" : ""}`} wert={`−${formatEUR(r.laufend.steuer.summeMonat)}`} />
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Netto / Monat</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-700 ml-auto">{formatEUR(r.laufend.nettoMonat)}</span>
              </div>
              <Zeile label={`Jahressonderzahlung (${prozent.toLocaleString("de-DE")} %) brutto / netto`} wert={`${formatEUR(jsz)} / ${formatEUR(r.sonder.netto)}`} />
              <Zeile label="Jahresbrutto inkl. Sonderzahlung" wert={formatEUR(brutto * 12 + jsz)} />
              <Zeile label={`Ab ${TVL_NAECHSTE_STUFEN[0].ab} (+${TVL_NAECHSTE_STUFEN[0].prozent.toLocaleString("de-DE")} %, rechnerisch)`} wert={formatEUR(plus2027)} />
              <p className="text-xs text-black/60 px-1 leading-relaxed">
                Die Jahressonderzahlung kommt mit dem Novembergehalt; Bemessungsgrundlage ist der Durchschnitt Juli bis
                September. Zulagen, Zuschläge und Überstunden sind nicht enthalten.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Zeile({ label, wert, fett }: { label: string; wert: string; fett?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-2.5">
      <span className="text-black/70 text-sm font-medium">{label}</span>
      <span className={`ml-auto font-mono text-[#16181D] whitespace-nowrap ${fett ? "text-lg font-extrabold" : "text-sm sm:text-base font-bold"}`}>{wert}</span>
    </div>
  );
}
