"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Info } from "lucide-react";
import {
  calculateNetto,
  calculateArbeitgeberkosten,
  isMidijob,
  midijobArbeitnehmerBemessungMonat,
  uebergangsbereich,
  formatEUR,
  type Steuerjahr,
  type Steuerklasse,
} from "@/lib/taxCalculator";

/**
 * Lohnabrechnung als Beispielrechnung, Zeile für Zeile.
 *
 * Bewusst KEIN druckbares Dokument: keine Namens-, Arbeitgeber- oder
 * Personalnummernfelder, kein Druck-/PDF-Knopf, sichtbar als "Muster"
 * gekennzeichnet — ein Rechner darf keine echt wirkenden Gehaltsnachweise
 * erzeugen (Missbrauch bei Wohnungs- oder Kreditanträgen).
 */

const pct = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " %";

export default function LohnabrechnungRechner() {
  const [bruttoStr, setBruttoStr] = useState("3800");
  const [brutto, setBrutto] = useState(3800);
  const [jahr, setJahr] = useState<Steuerjahr>(2026);
  const [sk, setSk] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(0);
  const [kinderlos, setKinderlos] = useState(true);
  const [zbStr, setZbStr] = useState("2,9");

  const zb = useMemo(() => {
    const v = parseFloat(zbStr.replace(",", "."));
    return Number.isFinite(v) && v >= 0 && v <= 6 ? v / 100 : 0.029;
  }, [zbStr]);

  const minijobGrenze = uebergangsbereich(jahr).untergrenze;
  const istMinijob = brutto > 0 && brutto <= minijobGrenze;
  const istMidijob = isMidijob(brutto, jahr);

  const r = calculateNetto({
    bruttoMonat: brutto,
    jahr,
    verheiratet: sk === 3 || sk === 5,
    kinderlosUeber23: kinderlos,
    kirche: kirche > 0,
    kirchensteuerSatz: kirche > 0 ? kirche : undefined,
    steuerklasse: sk,
    kvZusatzbeitrag: zb,
  });
  const ag = calculateArbeitgeberkosten(brutto, true, zb);
  const svBrutto = istMidijob ? Math.max(0, midijobArbeitnehmerBemessungMonat(brutto, jahr)) : brutto;

  const m = (jahresWert: number) => jahresWert / 12;
  const abzuegeSteuer = [
    ["Lohnsteuer", m(r.steuer.einkommensteuerJahr)],
    ["Solidaritätszuschlag", m(r.steuer.soliJahr)],
    ["Kirchensteuer", m(r.steuer.kirchensteuerJahr)],
  ] as const;
  const abzuegeSv = [
    [`Krankenversicherung (${pct(r.sv.krankenSatzAnPct)})`, m(r.sv.kranken)],
    [`Pflegeversicherung (${pct(r.sv.pflegeSatzAnPct)})`, m(r.sv.pflege)],
    ["Rentenversicherung (9,30 %)", m(r.sv.rente)],
    ["Arbeitslosenversicherung (1,30 %)", m(r.sv.arbeitslosen)],
  ] as const;

  const onBrutto = (v: string) => {
    setBruttoStr(v);
    const n = parseFloat(v.replace(",", "."));
    if (Number.isFinite(n) && n >= 0 && n <= 100000) setBrutto(n);
  };

  const Zeile = ({ label, wert, minus = false, strong = false }: { label: string; wert: number; minus?: boolean; strong?: boolean }) => (
    <div className={`flex items-baseline justify-between gap-3 py-2 ${strong ? "font-bold text-[#16181D]" : "text-black/75"}`}>
      <span>{label}</span>
      <span className="font-mono whitespace-nowrap">
        {minus && wert > 0 ? "− " : ""}
        {formatEUR(wert)}
      </span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5 sm:gap-6">
      {/* Eingaben */}
      <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-5 sm:p-8 shadow-sm space-y-5 self-start">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg sm:text-2xl font-extrabold text-[#16181D]">Ihre Angaben</h2>
          <div className="flex items-center gap-1 bg-black/[0.04] border border-black/[0.10] rounded-2xl p-1 text-sm font-semibold" role="group" aria-label="Abrechnungsjahr">
            {([2026, 2027] as const).map((j) => (
              <button
                key={j}
                type="button"
                aria-pressed={jahr === j}
                onClick={() => setJahr(j)}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${jahr === j ? "bg-[#E60A1C] text-white font-bold" : "text-black/60 hover:text-[#16181D]"}`}
              >
                {j}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="la-brutto" className="text-sm font-bold text-[#16181D] block mb-2">
            Bruttogehalt pro Monat
          </label>
          <div className="relative">
            <input
              id="la-brutto"
              type="number"
              inputMode="decimal"
              min={0}
              step={50}
              value={bruttoStr}
              onChange={(e) => onBrutto(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="w-full font-mono text-xl font-bold rounded-2xl border border-black/[0.12] bg-[#F1F3F5] px-4 py-3.5 pr-14 text-[#16181D] focus:border-[#E60A1C] outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50 font-mono text-sm font-bold">EUR</span>
          </div>
        </div>

        <div>
          <span className="text-sm font-bold text-[#16181D] block mb-2">Steuerklasse</span>
          <div className="grid grid-cols-6 gap-1.5" role="group" aria-label="Steuerklasse">
            {([1, 2, 3, 4, 5, 6] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={sk === k}
                onClick={() => setSk(k)}
                className={`rounded-xl border py-2 font-bold transition-all ${sk === k ? "bg-[#E60A1C] text-white border-[#E60A1C]" : "border-black/[0.12] text-[#16181D] hover:border-[#E60A1C]/50"}`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="la-zb" className="text-sm font-bold text-[#16181D] block mb-2">
              Zusatzbeitrag (%)
            </label>
            <input
              id="la-zb"
              type="text"
              inputMode="decimal"
              value={zbStr}
              onChange={(e) => setZbStr(e.target.value)}
              className="w-full rounded-xl border border-black/[0.12] bg-[#F1F3F5] px-3 py-3 font-mono font-bold text-[#16181D] focus:border-[#E60A1C] outline-none"
            />
          </div>
          <div>
            <label htmlFor="la-kirche" className="text-sm font-bold text-[#16181D] block mb-2">
              Kirchensteuer
            </label>
            <select
              id="la-kirche"
              value={kirche}
              onChange={(e) => setKirche(Number(e.target.value))}
              className="w-full rounded-xl border border-black/[0.12] bg-[#F1F3F5] px-3 py-3 font-semibold text-[#16181D] focus:border-[#E60A1C] outline-none"
            >
              <option value={0}>Keine</option>
              <option value={0.09}>9 %</option>
              <option value={0.08}>8 % (BY/BW)</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold text-black/75 cursor-pointer">
          <input type="checkbox" checked={kinderlos} onChange={(e) => setKinderlos(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
          Kinderlos und mindestens 23 Jahre alt
        </label>
      </div>

      {/* Muster-Abrechnung */}
      <div
        className="relative bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-5 sm:p-8 shadow-sm overflow-hidden"
        aria-live="polite"
        aria-label="Beispielrechnung im Aufbau einer Lohnabrechnung"
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="flex items-center gap-2 font-display text-lg sm:text-xl font-extrabold text-[#16181D]">
            <FileText size={20} className="text-[#E60A1C]" aria-hidden="true" /> Beispielrechnung {jahr}
          </p>
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#E60A1C] border border-[#E60A1C]/40 rounded-full px-2.5 py-1">
            Muster
          </span>
        </div>

        {istMinijob ? (
          <p className="text-sm text-black/75 bg-amber-50 border border-amber-500/20 rounded-xl p-4">
            Bis {formatEUR(minijobGrenze)} im Monat ist das ein Minijob: keine Lohnsteuer für Sie (Pauschalsteuer des
            Arbeitgebers), nur der Rentenversicherungs-Eigenanteil von 3,6 %. Rechnen Sie das im{" "}
            <Link href="/minijob-rechner" className="text-[#E60A1C] font-semibold hover:underline">Minijob-Rechner</Link>.
          </p>
        ) : (
          <div className="divide-y divide-black/[0.08] text-sm sm:text-base">
            <div className="pb-2">
              <p className="text-xs font-mono uppercase tracking-wider text-black/50 pt-1">Bezüge</p>
              <Zeile label="Gehalt" wert={brutto} />
              <Zeile label="Gesamtbrutto" wert={brutto} strong />
            </div>
            <div className="py-2">
              <p className="text-xs font-mono uppercase tracking-wider text-black/50 pt-1">Bemessungsgrundlagen</p>
              <Zeile label="Steuerbrutto" wert={brutto} />
              <Zeile label={istMidijob ? "SV-Brutto (Übergangsbereich)" : "SV-Brutto"} wert={svBrutto} />
            </div>
            <div className="py-2">
              <p className="text-xs font-mono uppercase tracking-wider text-black/50 pt-1">Steuerrechtliche Abzüge</p>
              {abzuegeSteuer.map(([l, w]) => (
                <Zeile key={l} label={l} wert={w} minus />
              ))}
            </div>
            <div className="py-2">
              <p className="text-xs font-mono uppercase tracking-wider text-black/50 pt-1">Sozialversicherung (Arbeitnehmer)</p>
              {abzuegeSv.map(([l, w]) => (
                <Zeile key={l} label={l} wert={w} minus />
              ))}
            </div>
            <div className="pt-2">
              <Zeile label="Gesetzliche Abzüge gesamt" wert={r.steuer.summeMonat + r.sv.summeMonat} minus />
              <div className="flex items-baseline justify-between gap-3 py-3 mt-1 rounded-xl bg-[#E60A1C]/[0.06] px-3">
                <span className="font-bold text-[#16181D]">Nettoentgelt = Auszahlung</span>
                <span className="font-display text-2xl font-extrabold text-[#16181D] whitespace-nowrap">{formatEUR(r.nettoMonat)}</span>
              </div>
            </div>

            {!istMidijob && (
              <details className="pt-3 group">
                <summary className="cursor-pointer text-sm font-semibold text-[#E60A1C]">Arbeitgeberseite anzeigen</summary>
                <div className="mt-2 text-sm">
                  <Zeile label="KV, PV, RV, ALV (Arbeitgeberanteil)" wert={ag.ag.summeMonat} />
                  <Zeile label="Umlagen U1/U2/Insolvenzgeld (geschätzt)" wert={ag.umlagenMonat} />
                  <Zeile label="Gesamtkosten des Arbeitgebers" wert={ag.gesamtkostenMonat} strong />
                </div>
              </details>
            )}
            {istMidijob && (
              <p className="pt-3 text-xs text-black/60">
                Midijob: Ihre Beiträge werden aus dem reduzierten SV-Brutto berechnet, der Arbeitgeber trägt den Rest. Details
                im <Link href="/midijob-rechner" className="text-[#E60A1C] font-semibold hover:underline">Midijob-Rechner</Link>.
              </p>
            )}
          </div>
        )}

        <p className="flex items-start gap-2 text-xs text-black/55 leading-relaxed mt-4">
          <Info size={14} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
          Beispielrechnung im Aufbau einer Lohnabrechnung — keine echte Abrechnung und kein Gehaltsnachweis. Lohnsteuer
          vereinfacht nach § 32a EStG{jahr === 2027 ? ", 2027 nach dem Gesetzentwurf (BT-Drs. 21/8235), Sozialabgaben mit den Werten 2026" : ""}.
        </p>
      </div>
    </div>
  );
}
