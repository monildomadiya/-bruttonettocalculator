"use client";

import { useMemo, useState } from "react";
import { Users, Calculator, Info, Plus, Minus } from "lucide-react";
import { calculateNetto, formatEUR, type Steuerklasse } from "@/lib/taxCalculator";
import { berechneUnterhalt, DT_2026, SELBSTBEHALT } from "@/lib/unterhalt";

const feld =
  "w-full bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none";

export default function UnterhaltsRechner() {
  const [modus, setModus] = useState<"netto" | "brutto">("netto");
  const [netto, setNetto] = useState(2800);
  const [brutto, setBrutto] = useState(4200);
  const [sk, setSk] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);
  const [abzuege, setAbzuege] = useState(0);
  const [erwerbstaetig, setErwerbstaetig] = useState(true);
  const [bkb, setBkb] = useState(true);
  const [kinder, setKinder] = useState<number[]>([4, 9]);

  const nettoAusBrutto = useMemo(
    () =>
      calculateNetto({
        bruttoMonat: Math.max(0, brutto),
        jahr: 2026,
        steuerklasse: sk,
        verheiratet: sk === 3 || sk === 4 || sk === 5,
        kinderlosUeber23: false,
        kirche,
      }).nettoMonat,
    [brutto, sk, kirche],
  );
  const einkommen = Math.max(0, (modus === "netto" ? netto : nettoAusBrutto) - Math.max(0, abzuege));
  const r = useMemo(
    () => berechneUnterhalt({ einkommen, alter: kinder, erwerbstaetig, bedarfskontrolle: bkb }),
    [einkommen, kinder, erwerbstaetig, bkb],
  );

  const setAlter = (i: number, a: number) => setKinder((k) => k.map((x, j) => (j === i ? a : x)));

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <Users size={14} /> Düsseldorfer Tabelle · Stand 1.1.2026
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Unterhaltsrechner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">2026</span>
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Kindesunterhalt nach der <strong className="text-[#16181D]">Düsseldorfer Tabelle 2026</strong> — mit
            Zahlbetrag nach Kindergeld, Selbstbehalt und Mangelfall. Auf Wunsch direkt aus dem Bruttogehalt.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-2 pb-12 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Einkommen des Unterhaltspflichtigen
            </h2>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Einkommen angeben als">
                {(["netto", "brutto"] as const).map((m) => (
                  <button key={m} type="button" role="radio" aria-checked={modus === m} onClick={() => setModus(m)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-bold border transition-colors ${modus === m ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#FFFFFF] text-[#16181D] border-black/[0.10]"}`}>
                    {m === "netto" ? "Netto eingeben" : "Aus Brutto berechnen"}
                  </button>
                ))}
              </div>

              {modus === "netto" ? (
                <div>
                  <label htmlFor="uh-netto" className="block text-sm font-semibold text-black/70 mb-2">Nettoeinkommen pro Monat</label>
                  <input id="uh-netto" type="number" inputMode="decimal" min={0} value={netto} onChange={(e) => setNetto(Number(e.target.value))} className={feld + " font-bold text-lg"} />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="uh-brutto" className="block text-sm font-semibold text-black/70 mb-2">Bruttogehalt pro Monat</label>
                    <input id="uh-brutto" type="number" inputMode="decimal" min={0} value={brutto} onChange={(e) => setBrutto(Number(e.target.value))} className={feld + " font-bold text-lg"} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select aria-label="Steuerklasse" value={sk} onChange={(e) => setSk(Number(e.target.value) as Steuerklasse)} className={feld}>
                      {[1, 2, 3, 4, 5, 6].map((k) => <option key={k} value={k}>Steuerklasse {k}</option>)}
                    </select>
                    <label className="flex items-center gap-2 text-sm font-medium text-black/80">
                      <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="h-4 w-4 accent-[#E60A1C]" /> Kirchensteuer
                    </label>
                  </div>
                  <p className="text-xs text-black/60">Netto laut Brutto-Netto-Rechner 2026: <strong className="text-[#16181D]">{formatEUR(nettoAusBrutto)}</strong></p>
                </div>
              )}

              <div>
                <label htmlFor="uh-abzug" className="block text-sm font-semibold text-black/70 mb-2">Abzüge (konkrete berufsbedingte Kosten, Kreditraten …)</label>
                <input id="uh-abzug" type="number" inputMode="decimal" min={0} value={abzuege} onChange={(e) => setAbzuege(Number(e.target.value))} className={feld} />
              </div>

              <div>
                <p className="block text-sm font-semibold text-black/70 mb-2">Kinder (Alter in Jahren)</p>
                <div className="space-y-2">
                  {kinder.map((a, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-black/60 w-16">Kind {i + 1}</span>
                      <select aria-label={`Alter Kind ${i + 1}`} value={a} onChange={(e) => setAlter(i, Number(e.target.value))} className={feld + " !py-2"}>
                        {Array.from({ length: 18 }, (_, j) => <option key={j} value={j}>{j} {j === 1 ? "Jahr" : "Jahre"}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <button type="button" disabled={kinder.length >= 5} onClick={() => setKinder((k) => [...k, 0])}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#E60A1C] bg-[#E60A1C]/10 border border-[#E60A1C]/20 rounded-lg px-2.5 py-1.5 disabled:opacity-40">
                    <Plus size={13} /> Kind
                  </button>
                  <button type="button" disabled={kinder.length <= 1} onClick={() => setKinder((k) => k.slice(0, -1))}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-black/70 bg-black/[0.05] border border-black/[0.10] rounded-lg px-2.5 py-1.5 disabled:opacity-40">
                    <Minus size={13} /> Kind
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="flex items-center gap-3 text-sm font-medium text-black/80 cursor-pointer">
                  <input type="checkbox" checked={erwerbstaetig} onChange={(e) => setErwerbstaetig(e.target.checked)} className="h-4 w-4 accent-[#E60A1C]" />
                  Erwerbstätig (Selbstbehalt {formatEUR(SELBSTBEHALT.erwerbstaetig)}, sonst {formatEUR(SELBSTBEHALT.nichtErwerbstaetig)})
                </label>
                <label className="flex items-center gap-3 text-sm font-medium text-black/80 cursor-pointer">
                  <input type="checkbox" checked={bkb} onChange={(e) => setBkb(e.target.checked)} className="h-4 w-4 accent-[#E60A1C]" />
                  Bedarfskontrollbetrag berücksichtigen (Anm. A III)
                </label>
              </div>
            </div>
          </div>

          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Users size={22} className="text-[#E60A1C]" /> Kindesunterhalt pro Monat
            </h2>
            <div className="flex items-center gap-2 mb-5 text-xs text-amber-700 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Orientierung nach der Tabelle — keine Rechtsberatung
            </div>
            <div className="space-y-3" aria-live="polite">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 bg-[#FFFFFF] border border-black/[0.08] rounded-xl px-5 py-3">
                <span className="text-black/70 text-sm font-medium">Bereinigtes Netto · Einkommensgruppe</span>
                <span className="ml-auto font-mono font-bold text-[#16181D] text-right">{formatEUR(r.einkommen)} · {r.gruppe}{r.herabgestuft ? ` (statt ${r.gruppeNachEinkommen})` : ""}</span>
              </div>
              {r.kinder.map((k, i) => (
                <div key={i} className="bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-x-3">
                    <span className="text-sm font-semibold text-[#16181D]">Kind {i + 1} · {k.altersstufe}</span>
                    <span className="text-lg font-mono font-extrabold text-[#16181D] ml-auto">{formatEUR(k.zahlbetrag)}</span>
                  </div>
                  <p className="text-xs text-black/60 mt-0.5">
                    {r.mangelfall ? "Mangelfall: anteilig aus der Verteilungsmasse" : `Bedarf ${formatEUR(k.bedarf)} − ½ Kindergeld ${formatEUR(k.kindergeldAnteil)}`}
                  </p>
                </div>
              ))}
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Unterhalt gesamt</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-700 ml-auto">{formatEUR(r.summe)}</span>
              </div>
              <p className="text-xs text-black/60 px-1 leading-relaxed">
                Ihnen verbleiben {formatEUR(r.verbleibt)}.{" "}
                {r.mangelfall
                  ? `Das Einkommen reicht nicht für den Mindestunterhalt aller Kinder: Über dem Selbstbehalt von ${formatEUR(r.selbstbehalt)} stehen ${formatEUR(Math.max(0, r.einkommen - r.selbstbehalt))} zur Verfügung, verteilt im Verhältnis der Zahlbeträge (Anm. C).`
                  : r.herabgestuft
                  ? `Herabgestuft von Gruppe ${r.gruppeNachEinkommen} auf ${r.gruppe}, weil sonst der Bedarfskontrollbetrag von ${formatEUR(DT_2026[r.gruppeNachEinkommen - 1].bkb)} unterschritten würde.`
                  : r.gruppe === 1
                  ? `Ihr Selbstbehalt von ${formatEUR(r.selbstbehalt)} ist gewahrt.`
                  : `Der Bedarfskontrollbetrag der Gruppe ${r.gruppe} (${formatEUR(DT_2026[r.gruppe - 1].bkb)}) ist eingehalten.`}
                {r.ueberTabelle ? " Über 11.200 € endet die Tabelle — der Bedarf wird dann nach den Umständen des Einzelfalls bestimmt." : ""}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
