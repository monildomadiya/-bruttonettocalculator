"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarX2, Calculator, Info } from "lucide-react";
import {
  fristEnde, gesetzlicheFrist, betriebszugehoerigkeit, spaetesterZugang, formatDatumLang, type Frist, type Termin,
} from "@/lib/kuendigungsfrist";

const feld =
  "w-full bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none";

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
};
const TERMINE: { key: Termin; label: string }[] = [
  { key: "15oderMonatsende", label: "zum 15. oder Monatsende" },
  { key: "monatsende", label: "zum Monatsende" },
  { key: "quartalsende", label: "zum Quartalsende" },
  { key: "keiner", label: "ohne festen Termin" },
];

export default function KuendigungsfristRechner() {
  const [arbeitgeber, setArbeitgeber] = useState(true);
  const [beginn, setBeginn] = useState("2019-04-01");
  // Zugangsdatum = heute, aber erst im Browser (statisch gebaute Seite).
  const [zugang, setZugang] = useState("");
  useEffect(() => setZugang(iso(new Date())), []);
  const [probezeit, setProbezeit] = useState(false);
  const [vertraglich, setVertraglich] = useState(false);
  const [laenge, setLaenge] = useState(3);
  const [einheit, setEinheit] = useState<"wochen" | "monate">("monate");
  const [termin, setTermin] = useState<Termin>("monatsende");

  const b = parse(beginn);
  const z = parse(zugang);

  const r = useMemo(() => {
    if (!b || !z || z < b) return null;
    const gesetz = gesetzlicheFrist({ arbeitgeberKuendigt: arbeitgeber, beginn: b, zugang: z, probezeit });
    const eigene: Frist = einheit === "wochen" ? { wochen: Math.max(1, laenge), termin } : { monate: Math.max(1, laenge), termin };
    const frist = vertraglich ? eigene : gesetz.frist;
    const ende = fristEnde(z, frist);
    // Bis wann die Kündigung zugehen darf, damit es bei genau diesem Termin bleibt
    // (ohne festen Termin verschiebt sich das Ende mit jedem Tag — dann entfällt der Hinweis).
    const spaetest = frist.termin === "keiner" ? null : spaetesterZugang(ende, frist);
    return {
      gesetz,
      frist,
      ende,
      zugehoerigkeit: betriebszugehoerigkeit(b, z),
      spaetest,
      text: vertraglich
        ? `${laenge} ${einheit === "wochen" ? (laenge === 1 ? "Woche" : "Wochen") : laenge === 1 ? "Monat" : "Monate"} ${TERMINE.find((t) => t.key === termin)!.label}`
        : gesetz.text,
    };
  }, [b?.getTime(), z?.getTime(), arbeitgeber, probezeit, vertraglich, laenge, einheit, termin]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <CalendarX2 size={14} /> § 622 BGB · Arbeitnehmer & Arbeitgeber
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Kündigungsfrist-
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">Rechner</span>
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Wann endet das Arbeitsverhältnis? Gesetzliche oder vertragliche Kündigungsfrist eingeben und den{" "}
            <strong className="text-[#16181D]">letzten Arbeitstag</strong> auf den Tag genau ablesen.
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
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Wer kündigt">
                {[true, false].map((ag) => (
                  <button key={String(ag)} type="button" role="radio" aria-checked={arbeitgeber === ag} onClick={() => setArbeitgeber(ag)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-bold border transition-colors ${arbeitgeber === ag ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "bg-[#FFFFFF] text-[#16181D] border-black/[0.10]"}`}>
                    {ag ? "Arbeitgeber kündigt" : "Ich kündige"}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="kf-beginn" className="block text-sm font-semibold text-black/70 mb-2">Beschäftigt seit</label>
                  <input id="kf-beginn" type="date" value={beginn} onChange={(e) => setBeginn(e.target.value)} className={feld} />
                </div>
                <div>
                  <label htmlFor="kf-zugang" className="block text-sm font-semibold text-black/70 mb-2">Kündigung geht zu am</label>
                  <input id="kf-zugang" type="date" value={zugang} onChange={(e) => setZugang(e.target.value)} className={feld} />
                </div>
              </div>
              <label className="flex items-center gap-3 text-sm font-medium text-black/80 cursor-pointer">
                <input type="checkbox" checked={probezeit} onChange={(e) => setProbezeit(e.target.checked)} className="h-4 w-4 accent-[#E60A1C]" />
                Probezeit vereinbart (gilt höchstens die ersten 6 Monate)
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-black/80 cursor-pointer">
                <input type="checkbox" checked={vertraglich} onChange={(e) => setVertraglich(e.target.checked)} className="h-4 w-4 accent-[#E60A1C]" />
                Andere Frist laut Arbeits- oder Tarifvertrag
              </label>
              {vertraglich && (
                <div className="grid grid-cols-3 gap-2">
                  <input aria-label="Länge" type="number" min={1} max={24} value={laenge} onChange={(e) => setLaenge(Number(e.target.value))} className={feld} />
                  <select aria-label="Einheit" value={einheit} onChange={(e) => setEinheit(e.target.value as "wochen" | "monate")} className={feld}>
                    <option value="wochen">Wochen</option>
                    <option value="monate">Monate</option>
                  </select>
                  <select aria-label="Termin" value={termin} onChange={(e) => setTermin(e.target.value as Termin)} className={feld + " text-sm"}>
                    {TERMINE.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9" aria-live="polite">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <CalendarX2 size={22} className="text-[#E60A1C]" /> Ergebnis
            </h2>
            <div className="flex items-center gap-2 mb-5 text-xs text-amber-700 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" /> Gesetzliche Fristen — keine Rechtsberatung
            </div>
            {r ? (
              <div className="space-y-2.5">
                <Zeile label="Betriebszugehörigkeit" wert={`${r.zugehoerigkeit.jahre} J. ${r.zugehoerigkeit.monate} Mon.`} />
                <Zeile label="Kündigungsfrist" wert={r.text} />
                <div className="bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                  <p className="text-black/80 text-sm font-semibold">Arbeitsverhältnis endet am</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-emerald-800 mt-1">{formatDatumLang(r.ende)}</p>
                </div>
                <p className="text-xs text-black/60 px-1 leading-relaxed">
                  {vertraglich ? "Vertragliche bzw. tarifliche Frist" : `Rechtsgrundlage: ${r.gesetz.paragraph}`}.
                  {r.spaetest ? ` Dieser Termin hält, wenn die Kündigung spätestens am ${r.spaetest.toLocaleDateString("de-DE")} zugeht — einen Tag später verschiebt sich das Ende auf den nächsten Termin.` : ""}{" "}
                  Der Tag des Zugangs zählt nicht mit; maßgeblich ist, wann die Kündigung in den Briefkasten bzw. in die
                  Hand kommt.
                  {!arbeitgeber && !vertraglich ? " Für Arbeitnehmer gilt unabhängig von der Dauer die Grundfrist — die verlängerten Fristen binden nur den Arbeitgeber, sofern der Vertrag nichts anderes regelt." : ""}
                </p>
              </div>
            ) : (
              <p className="text-sm text-black/60">Bitte Beschäftigungsbeginn und Zugang der Kündigung eingeben (Zugang nicht vor Beginn).</p>
            )}
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
      <span className="text-sm sm:text-base font-mono font-bold text-[#16181D] text-right ml-auto">{wert}</span>
    </div>
  );
}
