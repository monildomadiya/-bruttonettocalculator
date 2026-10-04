"use client";

import { useEffect, useMemo, useState } from "react";
import { Baby, Calculator, Info } from "lucide-react";
import { calculateNetto, formatEUR, type Steuerklasse } from "@/lib/taxCalculator";
import {
  schutzfristen, mutterschaftsgeld, schutzfristFehlgeburt, plusTage, MUTTERSCHAFTSGELD_MAX_TAG, MUTTERSCHAFTSGELD_BAS_MAX,
} from "@/lib/mutterschutz";

const feld =
  "w-full bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none";

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
};
const datum = (d: Date) => d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });

type Besonderheit = "keine" | "frueh" | "mehrling" | "behinderung";

export default function MutterschutzRechner() {
  // Termin erst im Browser vorbelegen (heute + 20 Wochen) — sonst unterschiede
  // sich das statisch gebaute HTML vom Browser-Datum.
  const [et, setEt] = useState("");
  useEffect(() => setEt(iso(plusTage(new Date(), 140))), []);
  const [besonders, setBesonders] = useState<Besonderheit>("keine");
  const [modus, setModus] = useState<"netto" | "brutto">("brutto");
  const [netto, setNetto] = useState(2200);
  const [brutto, setBrutto] = useState(3500);
  const [sk, setSk] = useState<Steuerklasse>(4);
  const [gkv, setGkv] = useState(true);
  const [ssw, setSsw] = useState(14);

  const nettoAusBrutto = useMemo(
    () => calculateNetto({ bruttoMonat: Math.max(0, brutto), jahr: 2026, steuerklasse: sk, verheiratet: sk === 3 || sk === 4 || sk === 5, kinderlosUeber23: false, kirche: false }).nettoMonat,
    [brutto, sk],
  );
  const nettoMonat = modus === "netto" ? netto : nettoAusBrutto;
  const etDatum = parse(et);
  const fristen = etDatum ? schutzfristen(etDatum, besonders !== "keine") : null;
  const geld = fristen ? mutterschaftsgeld({ nettoMonat, fristen, gesetzlichVersichert: gkv }) : null;
  const fehl = schutzfristFehlgeburt(ssw);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <Baby size={14} /> Mutterschutzgesetz · § 24i SGB V
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Mutterschutz-
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Rechner</span>
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Wann beginnt und endet der Mutterschutz — und wie viel <strong className="text-[#16181D]">Mutterschaftsgeld</strong>{" "}
            zahlen Krankenkasse und Arbeitgeber?
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
                <label htmlFor="ms-et" className="block text-sm font-semibold text-black/70 mb-2">Voraussichtlicher Entbindungstermin</label>
                <input id="ms-et" type="date" value={et} onChange={(e) => setEt(e.target.value)} className={feld + " font-bold text-lg"} />
              </div>
              <div>
                <label htmlFor="ms-bes" className="block text-sm font-semibold text-black/70 mb-2">Besonderheit</label>
                <select id="ms-bes" value={besonders} onChange={(e) => setBesonders(e.target.value as Besonderheit)} className={feld}>
                  <option value="keine">keine — 8 Wochen nach der Geburt</option>
                  <option value="frueh">Frühgeburt — 12 Wochen</option>
                  <option value="mehrling">Mehrlinge — 12 Wochen</option>
                  <option value="behinderung">Behinderung des Kindes festgestellt — 12 Wochen auf Antrag</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Einkommen angeben als">
                {(["brutto", "netto"] as const).map((m) => (
                  <button key={m} type="button" role="radio" aria-checked={modus === m} onClick={() => setModus(m)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-bold border transition-colors ${modus === m ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#FFFFFF] text-[#16181D] border-black/[0.10]"}`}>
                    {m === "brutto" ? "Brutto eingeben" : "Netto eingeben"}
                  </button>
                ))}
              </div>
              {modus === "brutto" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="ms-brutto" className="block text-sm font-semibold text-black/70 mb-2">Brutto / Monat</label>
                    <input id="ms-brutto" type="number" inputMode="decimal" min={0} value={brutto} onChange={(e) => setBrutto(Number(e.target.value))} className={feld} />
                  </div>
                  <div>
                    <label htmlFor="ms-sk" className="block text-sm font-semibold text-black/70 mb-2">Steuerklasse</label>
                    <select id="ms-sk" value={sk} onChange={(e) => setSk(Number(e.target.value) as Steuerklasse)} className={feld}>
                      {[1, 2, 3, 4, 5, 6].map((k) => <option key={k} value={k}>Klasse {k}</option>)}
                    </select>
                  </div>
                  <p className="col-span-2 text-xs text-black/60">Netto laut Brutto-Netto-Rechner 2026: <strong className="text-[#16181D]">{formatEUR(nettoAusBrutto)}</strong></p>
                </div>
              ) : (
                <div>
                  <label htmlFor="ms-netto" className="block text-sm font-semibold text-black/70 mb-2">Ø Netto der letzten drei Monate</label>
                  <input id="ms-netto" type="number" inputMode="decimal" min={0} value={netto} onChange={(e) => setNetto(Number(e.target.value))} className={feld} />
                </div>
              )}

              <div>
                <label htmlFor="ms-kv" className="block text-sm font-semibold text-black/70 mb-2">Krankenversicherung</label>
                <select id="ms-kv" value={gkv ? "gkv" : "andere"} onChange={(e) => setGkv(e.target.value === "gkv")} className={feld}>
                  <option value="gkv">Gesetzlich versichert (eigenes Mitglied)</option>
                  <option value="andere">Privat oder familienversichert</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9" aria-live="polite">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5 flex items-center gap-2">
                <Baby size={22} className="text-[#E60A1C]" /> Ihre Schutzfristen
              </h2>
              {fristen && geld ? (
                <div className="space-y-2.5">
                  <Zeile label="Mutterschutz beginnt" wert={datum(fristen.beginn)} />
                  <Zeile label="Errechneter Termin" wert={datum(fristen.entbindung)} />
                  <Zeile label={`Mutterschutz endet (${fristen.tageNach / 7} Wochen nach)`} wert={datum(fristen.ende)} />
                  <Zeile label="Tage mit Mutterschaftsgeld" wert={`${fristen.tageGesamt} Tage`} />
                  <div className="h-2" />
                  <Zeile label={`Netto pro Kalendertag (${formatEUR(geld.netto3Monate)} ÷ ${geld.tageBemessung} Tage)`} wert={formatEUR(geld.nettoKalendertag)} />
                  <Zeile label={gkv ? `Krankenkasse (max. ${MUTTERSCHAFTSGELD_MAX_TAG} € / Tag)` : `Bundesamt für Soziale Sicherung (max. ${MUTTERSCHAFTSGELD_BAS_MAX} €)`} wert={formatEUR(geld.krankenkasse)} />
                  <Zeile label="Zuschuss vom Arbeitgeber" wert={formatEUR(geld.arbeitgeber)} />
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                    <span className="text-black/80 text-sm font-semibold">Mutterschaftsleistungen gesamt</span>
                    <span className="text-2xl font-mono font-extrabold text-emerald-700 ml-auto">{formatEUR(geld.gesamt)}</span>
                  </div>
                  <p className="flex gap-2 text-xs text-black/60 px-1 leading-relaxed">
                    <Info size={13} className="flex-shrink-0 mt-0.5" />
                    {gkv
                      ? "Krankenkasse und Arbeitgeber zahlen zusammen Ihr volles Netto weiter — steuer- und abgabenfrei, aber mit Progressionsvorbehalt."
                      : `Ohne eigene gesetzliche Mitgliedschaft gibt es höchstens ${MUTTERSCHAFTSGELD_BAS_MAX} € vom Bundesamt für Soziale Sicherung; der Arbeitgeberzuschuss bleibt gleich.`}{" "}
                    Wird das Kind früher geboren, verlängert sich die Frist danach um die verlorenen Tage.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-black/60">Bitte den voraussichtlichen Entbindungstermin eingeben.</p>
              )}
            </div>

            <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-7">
              <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-3">Mutterschutz nach einer Fehlgeburt</h3>
              <div className="flex items-center gap-3">
                <label htmlFor="ms-ssw" className="text-sm font-semibold text-black/70 whitespace-nowrap">Schwangerschaftswoche</label>
                <input id="ms-ssw" type="number" min={1} max={24} value={ssw} onChange={(e) => setSsw(Number(e.target.value))} className={feld + " !py-2 max-w-[110px]"} />
              </div>
              <p className="text-sm text-black/75 mt-3">
                {fehl
                  ? `Ab der ${ssw}. Woche: ${fehl} Wochen Schutzfrist — die Beschäftigung ist nur erlaubt, wenn Sie sich ausdrücklich dazu bereit erklären (§ 3 Abs. 5 MuSchG).`
                  : "Vor der 13. Schwangerschaftswoche gibt es keine Schutzfrist nach dem Mutterschutzgesetz; eine Krankschreibung ist möglich."}
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
