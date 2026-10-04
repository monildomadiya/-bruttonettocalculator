"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Calculator, Info } from "lucide-react";
import {
  RENTE_MIN_JAHRGANG,
  rentenarten,
  formatAlter,
  formatAlterDativ,
  formatDatum,
  formatMonatJahr,
  ABSCHLAG_PRO_MONAT_PCT,
  ZUSCHLAG_PRO_MONAT_PCT,
} from "@/lib/renteneintritt";

const feld =
  "w-full bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none";

/** "1970-06-15" → lokales Datum (kein UTC-Versatz wie bei new Date(string)). */
function parseDatum(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function abstand(von: Date, bis: Date): string {
  let monate = (bis.getFullYear() - von.getFullYear()) * 12 + (bis.getMonth() - von.getMonth());
  if (bis.getDate() < von.getDate()) monate -= 1;
  if (monate <= 0) return "bereits erreicht";
  const j = Math.floor(monate / 12);
  const m = monate % 12;
  return `in ${j > 0 ? `${j} ${j === 1 ? "Jahr" : "Jahren"}` : ""}${j > 0 && m > 0 ? " und " : ""}${m > 0 ? `${m} ${m === 1 ? "Monat" : "Monaten"}` : ""}`;
}

export default function RenteneintrittRechner() {
  const [geburt, setGeburt] = useState("1970-06-15");
  // "Heute" erst nach dem Mounten setzen: Server und Browser könnten sonst
  // (Zeitzone, Mitternacht) unterschiedliche Countdown-Texte rendern.
  const [heute, setHeute] = useState<Date | null>(null);
  useEffect(() => setHeute(new Date()), []);

  const datum = parseDatum(geburt);
  const gueltig = !!datum && datum.getFullYear() >= RENTE_MIN_JAHRGANG && datum.getFullYear() <= 2015;
  const arten = useMemo(() => (gueltig && datum ? rentenarten(datum) : []), [gueltig, datum?.getTime()]); // eslint-disable-line react-hooks/exhaustive-deps
  const regel = arten.find((a) => a.key === "regel");

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <CalendarClock size={14} /> Nach SGB VI · alle Rentenarten
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Renteneintrittsalter-
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Rechner</span>
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Wann können Sie in Rente gehen — <strong className="text-[#16181D]">ohne Abschlag</strong> und
            frühestens? Geburtsdatum eingeben, Rentenbeginn auf den Monat genau ablesen.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-2 pb-12 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6">
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9 h-fit">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Ihr Geburtsdatum
            </h2>
            <label htmlFor="rente-geburt" className="block text-sm font-semibold text-black/70 mb-2">Geburtsdatum</label>
            <input id="rente-geburt" type="date" min={`${RENTE_MIN_JAHRGANG}-01-01`} max="2015-12-31" value={geburt}
              onChange={(e) => setGeburt(e.target.value)} className={feld + " font-bold text-lg"} />
            {!gueltig && (
              <p className="mt-3 text-sm text-[#E60A1C]">
                Bitte ein Geburtsdatum ab {RENTE_MIN_JAHRGANG} eingeben — ältere Jahrgänge haben die Regelaltersgrenze bereits erreicht.
              </p>
            )}
            {regel && (
              <div className="mt-6 bg-emerald-50 border border-emerald-500/25 rounded-2xl p-5" aria-live="polite">
                <p className="text-sm font-semibold text-black/70">Ihre Regelaltersgrenze</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1">{formatAlter(regel.alterAbschlagsfrei)}</p>
                <p className="text-sm text-black/75 mt-2">
                  Regelaltersrente ab <strong className="text-[#16181D]">{formatDatum(regel.beginnAbschlagsfrei)}</strong>
                  {heute ? ` — ${abstand(heute, regel.beginnAbschlagsfrei)}` : ""}.
                </p>
              </div>
            )}
          </div>

          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5 flex items-center gap-2">
              <CalendarClock size={22} className="text-[#E60A1C]" /> Ihre Rentenarten
            </h2>
            <div className="space-y-3">
              {arten.map((a) => (
                <div key={a.key} className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-4 sm:p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="font-bold text-[#16181D] text-base sm:text-lg">{a.name}</h3>
                    <span className="text-xs text-black/50">{a.voraussetzung} · {a.paragraph}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="bg-black/[0.04] rounded-xl px-4 py-3">
                      <p className="text-black/60 text-xs font-semibold uppercase tracking-wide">Ohne Abschlag</p>
                      <p className="font-bold text-[#16181D] mt-0.5">ab {formatMonatJahr(a.beginnAbschlagsfrei)}</p>
                      <p className="text-black/60 text-xs">mit {formatAlterDativ(a.alterAbschlagsfrei)}</p>
                    </div>
                    <div className="bg-black/[0.04] rounded-xl px-4 py-3">
                      <p className="text-black/60 text-xs font-semibold uppercase tracking-wide">Frühestens</p>
                      {a.beginnFruehestens && a.alterFruehestens ? (
                        <>
                          <p className="font-bold text-[#16181D] mt-0.5">ab {formatMonatJahr(a.beginnFruehestens)}</p>
                          <p className="text-black/60 text-xs">
                            mit {formatAlterDativ(a.alterFruehestens)} · Abschlag <strong className="text-[#E60A1C]">{a.abschlagPct.toLocaleString("de-DE")} %</strong> ({a.abschlagMonate} Monate)
                          </p>
                        </>
                      ) : (
                        <p className="font-semibold text-black/70 mt-0.5">kein vorzeitiger Bezug möglich</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <p className="flex gap-2 text-xs text-black/60 px-1 leading-relaxed">
                <Info size={13} className="flex-shrink-0 mt-0.5" />
                Abschlag {ABSCHLAG_PRO_MONAT_PCT.toLocaleString("de-DE")} % je Monat vor der abschlagsfreien Grenze, dauerhaft;
                wer nach der Regelaltersgrenze weiterarbeitet, bekommt {ZUSCHLAG_PRO_MONAT_PCT.toLocaleString("de-DE")} % Zuschlag je
                Monat (§ 77 SGB VI). Die Rente beginnt am Ersten des Monats nach Erreichen des Alters — wer am 1. geboren ist,
                schon im Geburtstagsmonat. Ob Sie die Wartezeit erfüllen, steht in Ihrer Renteninformation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
