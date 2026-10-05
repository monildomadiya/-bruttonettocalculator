"use client";

import { useMemo, useState } from "react";
import { HeartPulse, Info } from "lucide-react";
import { calculateNetto, formatEUR, type Steuerjahr } from "@/lib/taxCalculator";
import { DURCHSCHNITT_ZUSATZBEITRAG_2026, ZUSATZBEITRAG_DURCHSCHNITT_2027 } from "@/data/krankenkassen";

/**
 * Krankenkassenbeitrag-Rechner 2026/2027.
 *
 * Rechnet mit derselben Engine wie der Hauptrechner (calculateNetto):
 *  - 2026: amtliche Rechengrößen 2026.
 *  - 2027: Lohnsteuer nach Regierungsentwurf EStRefG 2027 (BT-Drs. 21/8235),
 *    Beitragsbemessungsgrenze KV/PV 6.375 € aus dem BMAS-Referentenentwurf
 *    (sv2027: "entwurf"); Beitragssätze sonst wie 2026.
 * Steuerklasse I, ohne Kirchensteuer. Kinder wirken nur auf die Pflegeversicherung
 * (kein Kinderlosenzuschlag ab dem 1. Kind, Abschlag ab dem 2. Kind unter 25).
 */

/** Voreinstellung des Zusatzbeitrags je Jahr: der amtliche Durchschnitt (2027 vorläufig 2,9 %). */
function standardZusatzbeitrag(jahr: Steuerjahr): number {
  return jahr === 2027 ? ZUSATZBEITRAG_DURCHSCHNITT_2027 ?? DURCHSCHNITT_ZUSATZBEITRAG_2026 : DURCHSCHNITT_ZUSATZBEITRAG_2026;
}

const pct = (v: number) => v.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " %";

export default function KrankenkassenbeitragRechner2027() {
  const [bruttoStr, setBruttoStr] = useState("4000");
  const [jahr, setJahr] = useState<Steuerjahr>(2027);
  const [zbStr, setZbStr] = useState(String(standardZusatzbeitrag(2027)).replace(".", ","));
  const [zbGeaendert, setZbGeaendert] = useState(false);
  const [kinder, setKinder] = useState(0);

  const brutto = useMemo(() => {
    const v = parseFloat(bruttoStr.replace(/\./g, "").replace(",", "."));
    return isNaN(v) || v < 0 ? 0 : Math.min(v, 100000);
  }, [bruttoStr]);
  const zb = useMemo(() => {
    const v = parseFloat(zbStr.replace(",", "."));
    return isNaN(v) || v < 0 ? 0 : Math.min(v, 10);
  }, [zbStr]);

  const waehleJahr = (j: Steuerjahr) => {
    setJahr(j);
    // Solange der Nutzer keinen eigenen Satz eingetragen hat, folgt die
    // Voreinstellung dem Durchschnitt des gewählten Jahres.
    if (!zbGeaendert) setZbStr(String(standardZusatzbeitrag(j)).replace(".", ","));
  };

  const r = useMemo(() => {
    const rechne = (j: Steuerjahr, zusatzPct: number) =>
      calculateNetto({
        bruttoMonat: brutto,
        jahr: j,
        szenario: "entwurf2027",
        sv2027: "entwurf",
        steuerklasse: 1,
        verheiratet: false,
        kinderlosUeber23: kinder === 0,
        pvKinderUnter25: kinder,
        kirche: false,
        kvZusatzbeitrag: zusatzPct / 100,
      });
    const gewaehlt = rechne(jahr, zb);
    const r2026 = rechne(2026, zb);
    const r2027 = rechne(2027, zb);
    const plus01 = rechne(jahr, zb + 0.1);
    return {
      kvMonat: gewaehlt.sv.kranken / 12,
      pvMonat: gewaehlt.sv.pflege / 12,
      nettoMonat: gewaehlt.nettoMonat,
      diffNetto: r2027.nettoMonat - r2026.nettoMonat,
      diffKvPv: (r2027.sv.kranken + r2027.sv.pflege - r2026.sv.kranken - r2026.sv.pflege) / 12,
      jeZehntel: gewaehlt.nettoJahr - plus01.nettoJahr,
    };
  }, [brutto, jahr, zb, kinder]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Eingaben */}
      <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-5 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] flex items-center gap-2">
          <HeartPulse size={22} className="text-[#E60A1C]" /> Ihre Angaben
        </h2>

        <div>
          <label htmlFor="kkb-brutto" className="block text-sm font-semibold text-black/70 mb-2">Monatsbrutto (€)</label>
          <input
            id="kkb-brutto"
            inputMode="decimal"
            value={bruttoStr}
            onChange={(e) => setBruttoStr(e.target.value)}
            className="w-full rounded-xl border border-black/[0.15] px-4 py-3 text-lg font-mono font-bold text-[#16181D] focus:outline-none focus:border-[#E60A1C]"
          />
        </div>

        <div>
          <span className="block text-sm font-semibold text-black/70 mb-2">Jahr</span>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Jahr">
            {([2026, 2027] as Steuerjahr[]).map((j) => (
              <button
                key={j}
                type="button"
                onClick={() => waehleJahr(j)}
                aria-pressed={jahr === j}
                className={`rounded-xl border px-4 py-2.5 font-bold transition-colors ${
                  jahr === j ? "bg-[#E60A1C] border-[#E60A1C] text-white" : "bg-[#FFFFFF] border-black/[0.15] text-[#16181D] hover:border-[#E60A1C]/50"
                }`}
              >
                {j}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="kkb-zb" className="block text-sm font-semibold text-black/70 mb-2">
            Zusatzbeitrag Ihrer Kasse (%)
          </label>
          <input
            id="kkb-zb"
            inputMode="decimal"
            value={zbStr}
            onChange={(e) => {
              setZbStr(e.target.value);
              setZbGeaendert(true);
            }}
            className="w-full rounded-xl border border-black/[0.15] px-4 py-3 text-lg font-mono font-bold text-[#16181D] focus:outline-none focus:border-[#E60A1C]"
          />
          <p className="text-xs text-black/55 mt-1.5">
            Voreingestellt: durchschnittlicher Zusatzbeitrag {jahr} ({pct(standardZusatzbeitrag(jahr))}
            {jahr === 2027 && ZUSATZBEITRAG_DURCHSCHNITT_2027 === null ? ", vorläufig" : ""}).
          </p>
        </div>

        <div>
          <label htmlFor="kkb-kinder" className="block text-sm font-semibold text-black/70 mb-2">Kinder</label>
          <select
            id="kkb-kinder"
            value={kinder}
            onChange={(e) => setKinder(Number(e.target.value))}
            className="w-full rounded-xl border border-black/[0.15] px-4 py-3 font-semibold text-[#16181D] bg-[#FFFFFF] focus:outline-none focus:border-[#E60A1C]"
          >
            <option value={0}>keine Kinder (Kinderlosenzuschlag ab 23)</option>
            <option value={1}>1 Kind</option>
            <option value={2}>2 Kinder unter 25</option>
            <option value={3}>3 Kinder unter 25</option>
            <option value={4}>4 Kinder unter 25</option>
            <option value={5}>5 oder mehr Kinder unter 25</option>
          </select>
          <p className="text-xs text-black/55 mt-1.5">Wirkt auf die Pflegeversicherung (§ 55 Abs. 3 SGB XI).</p>
        </div>

        {ZUSATZBEITRAG_DURCHSCHNITT_2027 === null && (
          <p className="flex gap-2 text-xs sm:text-sm text-amber-900 bg-amber-50 border border-amber-500/30 rounded-xl p-3 leading-relaxed">
            <Info size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Der durchschnittliche Zusatzbeitrag 2027 wird bis 1. November 2026 vom BMG bekanntgegeben – bis dahin
              rechnen wir vorläufig mit 2,9 %.
            </span>
          </p>
        )}
      </div>

      {/* Ergebnis */}
      <div className="bg-[#F4F5F7] border border-black/[0.10] rounded-3xl p-5 sm:p-8 shadow-sm" aria-live="polite">
        <p className="text-xs font-mono uppercase tracking-widest text-black/60 font-bold mb-4">
          Ergebnis {jahr}{jahr === 2027 ? " (vorläufig)" : ""} · Steuerklasse I, ohne Kirchensteuer
        </p>
        <dl className="space-y-3">
          <div className="flex justify-between gap-3 bg-[#FFFFFF] rounded-xl px-4 py-3 border border-black/[0.08]">
            <dt className="text-black/75">Ihr Krankenkassenbeitrag (KV) / Monat</dt>
            <dd className="font-mono font-bold text-[#16181D]">{formatEUR(r.kvMonat)}</dd>
          </div>
          <div className="flex justify-between gap-3 bg-[#FFFFFF] rounded-xl px-4 py-3 border border-black/[0.08]">
            <dt className="text-black/75">Ihr Pflegebeitrag (PV) / Monat</dt>
            <dd className="font-mono font-bold text-[#16181D]">{formatEUR(r.pvMonat)}</dd>
          </div>
          <div className="flex justify-between gap-3 bg-[#FFFFFF] rounded-xl px-4 py-3 border border-black/[0.08]">
            <dt className="text-black/75">KV + PV zusammen / Monat</dt>
            <dd className="font-mono font-bold text-[#16181D]">{formatEUR(r.kvMonat + r.pvMonat)}</dd>
          </div>
          <div className="flex justify-between gap-3 bg-[#16181D] text-white rounded-xl px-4 py-3.5">
            <dt className="font-semibold">Netto / Monat</dt>
            <dd className="font-mono font-extrabold text-lg">{formatEUR(r.nettoMonat)}</dd>
          </div>
          <div className="flex justify-between gap-3 bg-[#FFFFFF] rounded-xl px-4 py-3 border border-black/[0.08]">
            <dt className="text-black/75">Unterschied 2026 → 2027 (Netto / Monat)</dt>
            <dd className={`font-mono font-bold ${r.diffNetto >= 0 ? "text-emerald-700" : "text-[#E60A1C]"}`}>
              {r.diffNetto >= 0.005 ? "+" : r.diffNetto <= -0.005 ? "−" : "±"}
              {formatEUR(Math.abs(r.diffNetto))}
            </dd>
          </div>
          <div className="flex justify-between gap-3 px-4 text-xs text-black/60">
            <dt>davon KV + PV-Beitrag 2027 mehr</dt>
            <dd className="font-mono">{formatEUR(Math.max(0, r.diffKvPv))}</dd>
          </div>
        </dl>
        <p className="mt-5 rounded-xl border border-[#E60A1C]/30 bg-[#E60A1C]/10 px-4 py-3 text-sm sm:text-base text-[#16181D] font-semibold">
          Jede 0,1 % Zusatzbeitrag kostet Sie {formatEUR(r.jeZehntel)} im Jahr
        </p>
        <p className="mt-3 text-xs text-black/55 leading-relaxed">
          Netto nach Steuern: Ein höherer Beitrag senkt zugleich die Lohnsteuer, deshalb ist der Netto-Effekt etwas
          kleiner als der reine Beitrag. 2027 nach Regierungsentwurf zur Steuerreform und mit der
          Beitragsbemessungsgrenze 6.375 € aus dem BMAS-Entwurf (vorläufig); Vergleich 2026 → 2027 mit demselben
          Zusatzbeitrag.
        </p>
      </div>
    </div>
  );
}
