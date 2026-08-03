"use client";

import { useMemo, useState } from "react";
import { HeartPulse, Info, TrendingDown, TrendingUp } from "lucide-react";
import { calculateNetto, formatEUR, type Steuerklasse } from "@/lib/taxCalculator";
import {
  KRANKENKASSEN_2026,
  DURCHSCHNITT_ZUSATZBEITRAG_2026,
  ALLGEMEINER_BEITRAGSSATZ,
  GUENSTIGSTE_KASSE,
  arbeitnehmeranteilProzent,
  gesamtbeitragssatz,
} from "@/data/krankenkassen";

/**
 * Krankenkassen-Rechner: zeigt, wie viel Netto der kassenindividuelle
 * Zusatzbeitrag kostet. Rechnet mit derselben Engine wie der Hauptrechner
 * (calculateNetto), nur mit dem Zusatzbeitrag der gewählten Kasse statt des
 * amtlichen Durchschnittswerts von 2,9 %.
 */
export default function KrankenkassenRechner() {
  const [bruttoStr, setBruttoStr] = useState("4000");
  const [kasseSlug, setKasseSlug] = useState("tk");
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kinderlos, setKinderlos] = useState(true);

  const brutto = useMemo(() => {
    const parsed = parseFloat(bruttoStr.replace(/\./g, "").replace(",", "."));
    if (isNaN(parsed) || parsed < 0) return 0;
    return Math.min(parsed, 100000);
  }, [bruttoStr]);

  const kasse = useMemo(
    () => KRANKENKASSEN_2026.find((k) => k.slug === kasseSlug) ?? KRANKENKASSEN_2026[0],
    [kasseSlug]
  );

  const ergebnis = useMemo(() => {
    const base = {
      bruttoMonat: brutto,
      jahr: 2026 as const,
      verheiratet: steuerklasse === 3,
      kinderlosUeber23: kinderlos,
      kirche: false,
      steuerklasse,
    };
    const meine = calculateNetto({ ...base, kvZusatzbeitrag: kasse.zusatzbeitrag / 100 });
    const durchschnitt = calculateNetto({
      ...base,
      kvZusatzbeitrag: DURCHSCHNITT_ZUSATZBEITRAG_2026 / 100,
    });
    const guenstigste = calculateNetto({
      ...base,
      kvZusatzbeitrag: GUENSTIGSTE_KASSE.zusatzbeitrag / 100,
    });
    return {
      meine,
      diffZuDurchschnittMonat: meine.nettoMonat - durchschnitt.nettoMonat,
      sparpotenzialMonat: guenstigste.nettoMonat - meine.nettoMonat,
      sparpotenzialJahr: guenstigste.nettoJahr - meine.nettoJahr,
    };
  }, [brutto, kasse, steuerklasse, kinderlos]);

  const anAnteilPct = arbeitnehmeranteilProzent(kasse.zusatzbeitrag);
  const gesamtPct = gesamtbeitragssatz(kasse.zusatzbeitrag);
  const teurerAlsDurchschnitt = kasse.zusatzbeitrag > DURCHSCHNITT_ZUSATZBEITRAG_2026;

  return (
    <div className="bg-gradient-to-br from-[#F1F3F5] via-[#FFFFFF] to-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#E60A1C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 text-[#E60A1C] font-bold text-sm sm:text-base mb-6 relative">
        <HeartPulse size={18} />
        <span>Netto mit dem Zusatzbeitrag Ihrer Krankenkasse</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-5 relative">
        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-black/50 block mb-1.5">
            Bruttogehalt pro Monat
          </span>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={bruttoStr}
              onChange={(e) => setBruttoStr(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-black/[0.10] focus:border-[#E60A1C]/60 rounded-xl px-4 py-3 font-mono font-bold text-lg text-[#16181D] outline-none transition-colors"
              aria-label="Bruttogehalt pro Monat in Euro"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-mono font-bold">€</span>
          </div>
        </label>

        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-black/50 block mb-1.5">
            Ihre Krankenkasse
          </span>
          <select
            value={kasseSlug}
            onChange={(e) => setKasseSlug(e.target.value)}
            className="w-full bg-[#FFFFFF] border border-black/[0.10] focus:border-[#E60A1C]/60 rounded-xl px-4 py-3 font-bold text-base text-[#16181D] outline-none transition-colors"
            aria-label="Krankenkasse auswählen"
          >
            {KRANKENKASSEN_2026.map((k) => (
              <option key={k.slug} value={k.slug}>
                {k.name} — {k.zusatzbeitrag.toLocaleString("de-DE", { minimumFractionDigits: 2 })} %
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6 relative">
        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-black/50 block mb-1.5">Steuerklasse</span>
          <select
            value={steuerklasse}
            onChange={(e) => setSteuerklasse(Number(e.target.value) as Steuerklasse)}
            className="w-full bg-[#FFFFFF] border border-black/[0.10] focus:border-[#E60A1C]/60 rounded-xl px-4 py-3 font-bold text-base text-[#16181D] outline-none transition-colors"
            aria-label="Steuerklasse auswählen"
          >
            {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => (
              <option key={sk} value={sk}>
                Steuerklasse {sk}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-3 bg-[#FFFFFF] border border-black/[0.10] rounded-xl px-4 py-3 cursor-pointer self-end">
          <input
            type="checkbox"
            checked={kinderlos}
            onChange={(e) => setKinderlos(e.target.checked)}
            className="w-4 h-4 accent-[#E60A1C]"
          />
          <span className="text-sm text-[#16181D] font-medium leading-tight">
            Kinderlos &amp; über 23 <span className="text-black/50">(+0,6 % Pflege)</span>
          </span>
        </label>
      </div>

      {/* Ergebnis */}
      <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 relative">
        <div className="rounded-2xl border bg-[#E60A1C]/10 border-[#E60A1C]/40 p-4 sm:p-5">
          <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1.5">Ihr Netto / Monat</div>
          <div className="font-mono font-extrabold text-xl sm:text-2xl text-[#E60A1C] break-all">
            {formatEUR(ergebnis.meine.nettoMonat)}
          </div>
          <div className="text-xs text-black/55 mt-1">bei {kasse.name}</div>
        </div>
        <div className="rounded-2xl border bg-[#FFFFFF] border-black/[0.08] p-4 sm:p-5">
          <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1.5">KV-Beitrag gesamt</div>
          <div className="font-mono font-extrabold text-xl sm:text-2xl text-[#16181D]">
            {gesamtPct.toLocaleString("de-DE", { minimumFractionDigits: 2 })} %
          </div>
          <div className="text-xs text-black/55 mt-1">
            davon Sie: {anAnteilPct.toLocaleString("de-DE", { minimumFractionDigits: 3 })} %
          </div>
        </div>
        <div className="rounded-2xl border bg-[#FFFFFF] border-black/[0.08] p-4 sm:p-5">
          <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1.5">
            vs. Durchschnitt (2,9 %)
          </div>
          <div
            className={`font-mono font-extrabold text-xl sm:text-2xl flex items-center gap-1.5 ${
              teurerAlsDurchschnitt ? "text-[#E60A1C]" : "text-emerald-600"
            }`}
          >
            {teurerAlsDurchschnitt ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
            {ergebnis.diffZuDurchschnittMonat >= 0 ? "+" : "−"}
            {formatEUR(Math.abs(ergebnis.diffZuDurchschnittMonat)).replace("-", "")}
          </div>
          <div className="text-xs text-black/55 mt-1">Netto pro Monat</div>
        </div>
      </div>

      {/* Sparpotenzial */}
      {kasse.slug !== GUENSTIGSTE_KASSE.slug && ergebnis.sparpotenzialMonat > 0.5 && (
        <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-4 sm:p-5 relative">
          <div className="text-sm text-[#16181D] leading-relaxed">
            <strong>Wechsel-Potenzial:</strong> Bei einem Wechsel zur derzeit günstigsten Kasse{" "}
            <strong>{GUENSTIGSTE_KASSE.name}</strong> (
            {GUENSTIGSTE_KASSE.zusatzbeitrag.toLocaleString("de-DE", { minimumFractionDigits: 2 })} %) blieben Ihnen bei{" "}
            {formatEUR(brutto)} Brutto rund{" "}
            <strong className="text-emerald-700 font-mono">
              {formatEUR(ergebnis.sparpotenzialMonat)} mehr netto pro Monat
            </strong>{" "}
            — das sind{" "}
            <strong className="text-emerald-700 font-mono">{formatEUR(ergebnis.sparpotenzialJahr)} im Jahr</strong>.
            Die Leistungen der gesetzlichen Kassen sind zu rund 95 % gesetzlich vorgeschrieben und damit identisch.
          </div>
        </div>
      )}

      <div className="flex items-start gap-2 mt-5 text-xs text-black/50 leading-relaxed relative">
        <Info size={14} className="shrink-0 mt-0.5" />
        <span>
          Rechenweg: allgemeiner Beitragssatz {ALLGEMEINER_BEITRAGSSATZ.toLocaleString("de-DE", { minimumFractionDigits: 1 })} %
          (§ 241 SGB V) + Zusatzbeitrag {kasse.zusatzbeitrag.toLocaleString("de-DE", { minimumFractionDigits: 2 })} % Ihrer
          Kasse = {gesamtPct.toLocaleString("de-DE", { minimumFractionDigits: 2 })} %, davon tragen Arbeitnehmer und
          Arbeitgeber je die Hälfte (§ 249 SGB V). Beitragsbemessungsgrenze KV/PV 2026: 5.812,50 € pro Monat — darüber
          steigt der Beitrag nicht weiter. Vereinfachte Berechnung ohne Kinderfreibeträge und individuelle Freibeträge.
        </span>
      </div>
    </div>
  );
}
