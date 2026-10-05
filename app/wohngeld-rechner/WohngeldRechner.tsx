"use client";

import { useEffect, useMemo, useState } from "react";
import { Calculator, Home, Info, MapPin, Plus, Trash2 } from "lucide-react";
import { formatEUR } from "@/lib/taxCalculator";
import { wohngeldRechnen, type EinkommensArt, type Einkommensquelle, type WgRecht } from "@/lib/wohngeld";

const feld =
  "w-full bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none";
const ROEMISCH = ["", "I", "II", "III", "IV", "V", "VI", "VII"];
const ART_LABEL: Record<EinkommensArt, string> = {
  arbeitnehmer: "Lohn / Gehalt",
  minijob: "Minijob",
  rente: "Rente",
  ohneAbzug: "ALG I, Unterhalt, Unterhaltsvorschuss",
};

/** [Name, Land, g|k|i, Stufe seit 2023 | null, Stufe ab 2027 laut Entwurf] */
type Ort = [string, string, string, number | null, number];
const norm = (s: string) => s.toLowerCase().replace(/ß/g, "ss").normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function WohngeldRechner() {
  const [personen, setPersonen] = useState(1);
  const [miete, setMiete] = useState(450);
  const [stufe26, setStufe26] = useState(3);
  const [stufe27, setStufe27] = useState(3);
  const [ortName, setOrtName] = useState<string | null>(null);
  const [suche, setSuche] = useState("");
  const [orte, setOrte] = useState<Ort[] | null>(null);
  const [quellen, setQuellen] = useState<Einkommensquelle[]>([{ art: "rente", bruttoMonat: 1300, steuern: false }]);
  const [alleinerziehend, setAlleinerziehend] = useState(false);
  const [schwerbehindert, setSchwerbehindert] = useState(0);

  // Die Gemeindeliste (≈ 65 kB) erst laden, wenn jemand sucht.
  useEffect(() => {
    if (suche.length < 2 || orte) return;
    import("@/data/mietenstufen.json").then((m) => setOrte(m.default as Ort[]));
  }, [suche, orte]);

  const treffer = useMemo(() => {
    if (!orte || suche.trim().length < 2) return [];
    const q = norm(suche.trim());
    const start = orte.filter((o) => norm(o[0]).startsWith(q));
    const rest = orte.filter((o) => !norm(o[0]).startsWith(q) && norm(o[0]).includes(q));
    return [...start, ...rest].slice(0, 8);
  }, [orte, suche]);

  const waehleOrt = (o: Ort) => {
    setStufe27(o[4]);
    setStufe26(o[3] ?? o[4]);
    setOrtName(`${o[2] === "k" ? "Kreis " : ""}${o[0]} (${o[1]})${o[3] === null ? " — 2026 nicht gesondert gelistet, es gilt die Stufe des Kreises" : ""}`);
    setSuche("");
  };

  const einkommen = { quellen, alleinerziehend, schwerbehindert };
  const r26 = wohngeldRechnen({ recht: "2026", personen, mietenstufe: stufe26, bruttokaltmiete: miete, einkommen });
  const r27 = wohngeldRechnen({ recht: "2027", personen, mietenstufe: stufe27, bruttokaltmiete: miete, einkommen });
  const diff = r27.wohngeld - r26.wohngeld;

  const setQuelle = (i: number, patch: Partial<Einkommensquelle>) =>
    setQuellen((qs) => qs.map((q, k) => (k === i ? { ...q, ...patch } : q)));

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <Home size={14} /> § 19 WoGG · 2026 und Entwurf 2027
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Wohngeld-Rechner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">2027</span>
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Wie viel Wohngeld Sie heute bekommen — und wie viel nach der geplanten Reform ab 1. Januar 2027:{" "}
            <strong className="text-[#16181D]">keine Erhöhung, halbierte Heizkostenkomponente, neue Mietenstufen</strong>.
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
              <div className="relative">
                <label htmlFor="wg-ort" className="block text-sm font-semibold text-black/70 mb-2">Wohnort (für die Mietenstufe)</label>
                <input id="wg-ort" type="text" autoComplete="off" placeholder="z. B. Leipzig oder Kreis Rostock" value={suche} onChange={(e) => setSuche(e.target.value)} className={feld} />
                {treffer.length > 0 && (
                  <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-black/[0.12] rounded-xl shadow-xl overflow-hidden" role="listbox">
                    {treffer.map((o) => (
                      <li key={`${o[0]}-${o[1]}-${o[2]}`}>
                        <button type="button" onClick={() => waehleOrt(o)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-black/[0.05] flex flex-wrap justify-between gap-x-3">
                          <span>{o[2] === "k" ? "Kreis " : ""}{o[0]} <span className="text-black/50">({o[1]})</span></span>
                          <span className="font-mono text-black/60 ml-auto">{o[3] ? ROEMISCH[o[3]] : "–"} → {ROEMISCH[o[4]]}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {ortName && (
                  <p className="mt-2 text-xs text-black/60 flex gap-1.5"><MapPin size={13} className="flex-shrink-0 mt-0.5" />{ortName}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="wg-s26" className="block text-sm font-semibold text-black/70 mb-2">Mietenstufe 2026</label>
                  <select id="wg-s26" value={stufe26} onChange={(e) => { setStufe26(Number(e.target.value)); setOrtName(null); }} className={feld}>
                    {[1, 2, 3, 4, 5, 6, 7].map((s) => <option key={s} value={s}>Stufe {ROEMISCH[s]}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="wg-s27" className="block text-sm font-semibold text-black/70 mb-2">Mietenstufe 2027</label>
                  <select id="wg-s27" value={stufe27} onChange={(e) => { setStufe27(Number(e.target.value)); setOrtName(null); }} className={feld}>
                    {[1, 2, 3, 4, 5, 6, 7].map((s) => <option key={s} value={s}>Stufe {ROEMISCH[s]}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="wg-pers" className="block text-sm font-semibold text-black/70 mb-2">Personen im Haushalt</label>
                  <select id="wg-pers" value={personen} onChange={(e) => setPersonen(Number(e.target.value))} className={feld}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="wg-miete" className="block text-sm font-semibold text-black/70 mb-2">Bruttokaltmiete / Monat</label>
                  <input id="wg-miete" type="number" inputMode="decimal" min={0} step={10} value={miete} onChange={(e) => setMiete(Number(e.target.value))} className={feld} />
                </div>
              </div>
              <p className="text-xs text-black/60 -mt-2">Kaltmiete plus kalte Nebenkosten (Wasser, Müll, Grundsteuer …), ohne Heizung und Warmwasser.</p>

              <fieldset className="space-y-3">
                <legend className="block text-sm font-semibold text-black/70 mb-2">Einkommen im Haushalt (brutto pro Monat, ohne Kindergeld)</legend>
                {quellen.map((q, i) => (
                  <div key={i} className="bg-white border border-black/[0.08] rounded-2xl p-3 space-y-2">
                    <div className="flex gap-2">
                      <select aria-label={`Art Einkommen ${i + 1}`} value={q.art} onChange={(e) => setQuelle(i, { art: e.target.value as EinkommensArt })} className={feld + " !py-2"}>
                        {(Object.keys(ART_LABEL) as EinkommensArt[]).map((a) => <option key={a} value={a}>{ART_LABEL[a]}</option>)}
                      </select>
                      <input aria-label={`Betrag Einkommen ${i + 1}`} type="number" inputMode="decimal" min={0} step={50} value={q.bruttoMonat} onChange={(e) => setQuelle(i, { bruttoMonat: Number(e.target.value) })} className={feld + " !py-2 max-w-[130px]"} />
                      {quellen.length > 1 && (
                        <button type="button" aria-label="Einkommen entfernen" onClick={() => setQuellen((qs) => qs.filter((_, k) => k !== i))} className="px-2 text-black/50 hover:text-[#E60A1C]"><Trash2 size={16} /></button>
                      )}
                    </div>
                    {(q.art === "arbeitnehmer" || q.art === "rente") && (
                      <label className="flex items-center gap-2 text-xs text-black/70">
                        <input type="checkbox" checked={q.steuern} onChange={(e) => setQuelle(i, { steuern: e.target.checked })} />
                        Es fallen Steuern vom Einkommen an (Lohnsteuer bzw. Einkommensteuer)
                      </label>
                    )}
                  </div>
                ))}
                {quellen.length < 5 && (
                  <button type="button" onClick={() => setQuellen((qs) => [...qs, { art: "arbeitnehmer", bruttoMonat: 1500, steuern: true }])} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E60A1C] hover:underline">
                    <Plus size={15} /> weiteres Einkommen
                  </button>
                )}
              </fieldset>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm text-black/75">
                  <input type="checkbox" checked={alleinerziehend} onChange={(e) => setAlleinerziehend(e.target.checked)} />
                  Alleinerziehend mit Kind unter 18
                </label>
                <label className="flex items-center gap-2 text-sm text-black/75">
                  <select aria-label="Personen mit GdB 100" value={schwerbehindert} onChange={(e) => setSchwerbehindert(Number(e.target.value))} className="border border-black/[0.12] rounded-lg px-2 py-1">
                    {[0, 1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  Person(en) mit GdB 100
                </label>
              </div>
            </div>
          </div>

          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9 h-fit" aria-live="polite">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5 flex items-center gap-2">
              <Home size={22} className="text-[#E60A1C]" /> Ihr Wohngeld
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Kachel titel="2026 (geltendes Recht)" wert={r26.wohngeld} />
              <Kachel titel="ab 2027 (Entwurf)" wert={r27.wohngeld} hervor />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 rounded-xl px-5 py-3 mb-4 border bg-white border-black/[0.08]">
              <span className="text-black/75 text-sm font-semibold">Veränderung 2027</span>
              <span className={`text-xl font-mono font-extrabold ml-auto ${diff < 0 ? "text-[#E60A1C]" : diff > 0 ? "text-emerald-700" : "text-[#16181D]"}`}>
                {diff > 0 ? "+" : ""}{formatEUR(diff)} / Monat
              </span>
            </div>
            <div className="space-y-2.5">
              <Zeile label="Gesamteinkommen (nach Abzügen) / Monat" wert={`${formatEUR(r26.einkommen)} | ${formatEUR(r27.einkommen)}`} />
              <Zeile label="Höchstbetrag + Klimakomponente" wert={`${formatEUR(r26.obergrenze)} | ${formatEUR(r27.obergrenze)}`} />
              <Zeile label="Heizkostenentlastung" wert={`${formatEUR(r26.heizkosten)} | ${formatEUR(r27.heizkosten)}`} />
              <Zeile label="Berücksichtigte Miete" wert={`${formatEUR(r26.mieteBeruecksichtigt)} | ${formatEUR(r27.mieteBeruecksichtigt)}`} />
            </div>
            <p className="flex gap-2 text-xs text-black/60 px-1 mt-4 leading-relaxed">
              <Info size={13} className="flex-shrink-0 mt-0.5" />
              Werte jeweils 2026 | 2027. {r26.unterMindestbetrag || r27.unterMindestbetrag ? "Unter dem Mindestbetrag (2026: 10 €, 2027: 15 €) wird kein Wohngeld gezahlt. " : ""}
              2027 nach dem Regierungsentwurf (BR-Drs. 474/26), noch nicht beschlossen. Vermögen über 60.000 € (plus 30.000 € je weitere Person)
              schließt Wohngeld in der Regel aus. Verbindlich entscheidet nur die Wohngeldbehörde.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Kachel({ titel, wert, hervor }: { titel: string; wert: number; hervor?: boolean }) {
  return (
    <div className={`rounded-2xl px-4 py-4 border ${hervor ? "bg-emerald-50 border-emerald-500/25" : "bg-white border-black/[0.08]"}`}>
      <div className="text-xs font-semibold text-black/60 mb-1">{titel}</div>
      <div className={`text-2xl sm:text-3xl font-mono font-extrabold ${hervor ? "text-emerald-700" : "text-[#16181D]"}`}>{formatEUR(wert)}</div>
      <div className="text-xs text-black/50">pro Monat</div>
    </div>
  );
}

function Zeile({ label, wert }: { label: string; wert: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-2.5">
      <span className="text-black/70 text-sm font-medium">{label}</span>
      <span className="text-sm font-mono font-bold text-[#16181D] whitespace-nowrap ml-auto">{wert}</span>
    </div>
  );
}
