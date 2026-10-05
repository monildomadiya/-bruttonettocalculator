"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Users, Calculator, Info, CheckCircle2, Scale } from "lucide-react";
import { formatEUR } from "@/lib/taxCalculator";
import { vergleichePaar, arbeitslosengeldMonat } from "@/lib/steuerklassenPaar";

/*
 * Rechenkern: lib/steuerklassenPaar.ts — Faktor nach § 39f EStG (Y/X, drei
 * Nachkommastellen abgeschnitten), Jahresausgleich gegen die Splitting-Steuer
 * und Arbeitslosengeld I nach § 153 SGB III als Lohnersatz-Beispiel.
 * (Die frühere Fassung setzte "IV/IV mit Faktor" mit Splittingsteuer ÷ 12 gleich.)
 */

const inputCls =
  "w-full bg-[#FFFFFF] border border-black/[0.12] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none";

export default function SteuerklassenwechselRechner() {
  const [bruttoA, setBruttoA] = useState(4500);
  const [bruttoB, setBruttoB] = useState(2500);
  const [kirche, setKirche] = useState(false);
  const [kinderlos, setKinderlos] = useState(true);

  const r = useMemo(
    () => vergleichePaar({ bruttoA, bruttoB, kirche, kinderlosUeber23: kinderlos }),
    [bruttoA, bruttoB, kirche, kinderlos],
  );
  const best = Math.max(...r.kombinationen.map((k) => k.nettoMonat));
  const gering = bruttoA <= bruttoB ? { name: "A", brutto: bruttoA } : { name: "B", brutto: bruttoB };
  const alg = ([3, 4, 5] as const).map((sk) => ({ sk, wert: arbeitslosengeldMonat(gering.brutto, sk) }));

  return (
    <div className="bg-[#F4F5F7] text-[#16181D]">
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <Users size={14} /> Steuerklassenwechsel · Ehepaare · 2026
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Steuerklassen-Rechner:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">III/V, IV/IV oder Faktor?</span>
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Vergleichen Sie das monatliche Netto Ihres Paares in allen Kombinationen, inklusive Faktorverfahren nach § 39f EStG,
            und sehen Sie, was mit der Steuererklärung nachgezahlt oder erstattet wird.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-2 pb-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6">
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-5 sm:p-9 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" /> Ihre Angaben
            </h2>
            <div className="space-y-5">
              <div>
                <label htmlFor="sk-a" className="block text-sm font-semibold text-black/70 mb-2">Bruttogehalt Partner A / Monat</label>
                <input id="sk-a" type="number" min={0} inputMode="decimal" value={bruttoA} onChange={(e) => setBruttoA(Number(e.target.value))} className={inputCls} />
              </div>
              <div>
                <label htmlFor="sk-b" className="block text-sm font-semibold text-black/70 mb-2">Bruttogehalt Partner B / Monat</label>
                <input id="sk-b" type="number" min={0} inputMode="decimal" value={bruttoB} onChange={(e) => setBruttoB(Number(e.target.value))} className={inputCls} />
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                Kirchensteuer (9 %)
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                <input type="checkbox" checked={kinderlos} onChange={(e) => setKinderlos(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                Kinderlos (Pflegeversicherung)
              </label>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-5 sm:p-8 shadow-sm" aria-live="polite">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-4 flex items-center gap-2">
              <Users size={22} className="text-[#E60A1C]" /> Netto pro Monat
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm min-w-[460px]">
                <thead>
                  <tr className="border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/60">
                    <th className="py-2 pr-3">Kombination</th>
                    <th className="py-2 px-2 text-right">Netto A</th>
                    <th className="py-2 px-2 text-right">Netto B</th>
                    <th className="py-2 pl-2 text-right">Zusammen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.06]">
                  {r.kombinationen.map((k) => {
                    const top = Math.abs(k.nettoMonat - best) < 0.005;
                    return (
                      <tr key={k.key} className={top ? "bg-emerald-50" : undefined}>
                        <td className="py-2.5 pr-3">
                          <span className="font-bold text-[#16181D]">{k.key === "IV/IV-Faktor" ? "IV/IV + Faktor" : k.key}</span>
                          <span className="block text-xs text-black/50">{k.label}</span>
                          {top && <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700"><CheckCircle2 size={11} /> meiste Liquidität</span>}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono">{formatEUR(k.a.nettoMonat)}</td>
                        <td className="py-2.5 px-2 text-right font-mono">{formatEUR(k.b.nettoMonat)}</td>
                        <td className="py-2.5 pl-2 text-right font-mono font-bold">{formatEUR(k.nettoMonat)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <h3 className="text-base font-extrabold text-[#16181D] mt-6 mb-2 flex items-center gap-2">
              <Scale size={17} className="text-[#E60A1C]" /> Aufs Jahr: Steuererklärung
            </h3>
            <p className="text-xs text-black/60 mb-2">
              Die Jahressteuer des Paares ist immer gleich: {formatEUR(r.splittingSteuerJahr)} nach dem Splittingverfahren. Die
              Steuerklassen bestimmen nur, wie viel davon monatlich einbehalten wird.
            </p>
            <div className="divide-y divide-black/[0.06] text-sm">
              {r.kombinationen.map((k) => (
                <div key={k.key} className="flex flex-wrap items-center justify-between gap-x-3 py-1.5">
                  <span className="text-black/70">{k.key === "IV/IV-Faktor" ? "IV/IV + Faktor" : k.key}</span>
                  <span className={`ml-auto font-mono font-semibold ${k.ausgleichJahr >= 0.5 ? "text-emerald-700" : k.ausgleichJahr <= -0.5 ? "text-[#E60A1C]" : "text-black/60"}`}>
                    {Math.abs(k.ausgleichJahr) < 0.5 ? "± 0 €" : k.ausgleichJahr > 0 ? `${formatEUR(k.ausgleichJahr)} Erstattung` : `${formatEUR(-k.ausgleichJahr)} Nachzahlung`}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-black/50 flex gap-1.5">
              <Info size={13} className="flex-shrink-0 mt-0.5" />
              Steuerjahr 2026, vereinfachtes zu versteuerndes Einkommen, keine weiteren Einkünfte oder Abzüge. Alle Angaben ohne
              Gewähr, keine Steuerberatung.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-5 sm:p-8 shadow-sm">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">Achtung bei Lohnersatzleistungen</h2>
          <p className="text-sm text-black/70 leading-relaxed mb-4">
            Arbeitslosengeld, Elterngeld, Krankengeld und Mutterschaftsgeld richten sich nach dem Netto und damit nach der
            Steuerklasse. Beispiel Arbeitslosengeld I für Partner {gering.name} ({formatEUR(gering.brutto)} brutto, ohne Kind):
          </p>
          <div className="grid grid-cols-3 gap-3">
            {alg.map((x) => (
              <div key={x.sk} className="rounded-2xl bg-[#F4F5F7] border border-black/[0.08] p-3 sm:p-4 text-center">
                <p className="text-xs font-semibold text-black/60">Klasse {["", "I", "II", "III", "IV", "V"][x.sk]}</p>
                <p className="font-mono font-extrabold text-base sm:text-lg text-[#16181D] mt-1">{formatEUR(x.wert)}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-black/55 mt-3 leading-relaxed">
            Pauschaliertes Leistungsentgelt nach § 153 SGB III, davon 60 %. Wer absehbar Elterngeld, Arbeitslosengeld oder
            Krankengeld bezieht, kann rechtzeitig vorher die Steuerklasse wechseln. Beim Elterngeld zählt grundsätzlich die
            Steuerklasse im letzten Monat des Bemessungszeitraums, es sei denn, eine andere galt in den meisten Monaten (§ 2c Abs. 3 BEEG). Mehr
            im{" "}
            <Link href="/arbeitslosengeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Arbeitslosengeld-Rechner</Link>{" "}
            und im{" "}
            <Link href="/elterngeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Elterngeld-Rechner</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
