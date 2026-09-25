"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, Info, TrendingUp, Building2, ArrowRight, Gavel } from "lucide-react";
import { formatEUR } from "@/lib/taxCalculator";
import {
  SV_2026,
  sv2027,
  berechneSv,
  RV_SATZ_2027_ERWARTET,
  ZUSATZBEITRAG_2027_PROGNOSE,
  MIDIJOB_OBERGRENZE_MONAT,
  type Beitraege,
} from "@/lib/sozialabgaben2027";

const pct = (v: number, digits = 2) =>
  (v * 100).toLocaleString("de-DE", { minimumFractionDigits: digits, maximumFractionDigits: digits }) + " %";

const ZB_OPTIONEN = [
  { wert: SV_2026.kvZusatzbeitrag, label: "unverändert 2,9 %" },
  { wert: ZUSATZBEITRAG_2027_PROGNOSE.von, label: "3,1 % (untere Prognose)" },
  { wert: 0.033, label: "3,3 %" },
  { wert: 0.035, label: "3,5 %" },
  { wert: ZUSATZBEITRAG_2027_PROGNOSE.bis, label: "3,7 % (obere Prognose)" },
];

// `kurz` fürs Handy: mit den vollen Namen passt die Tabelle erst ab ~440 px.
const ZWEIGE: { key: keyof Omit<Beitraege, "summe">; label: string; kurz: string }[] = [
  { key: "kv", label: "Krankenversicherung", kurz: "Kranken" },
  { key: "pv", label: "Pflegeversicherung", kurz: "Pflege" },
  { key: "rv", label: "Rentenversicherung", kurz: "Rente" },
  { key: "alv", label: "Arbeitslosenversicherung", kurz: "Arbeitslosen" },
];

export default function SozialabgabenRechner2027() {
  const [betrag, setBetrag] = useState(5500);
  const [periode, setPeriode] = useState<"monat" | "jahr">("monat");
  const [kinder, setKinder] = useState(0);
  const [ueber23, setUeber23] = useState(true);
  const [sachsen, setSachsen] = useState(false);
  const [rvErhoehung, setRvErhoehung] = useState(true);
  const [zb2027, setZb2027] = useState<number>(ZB_OPTIONEN[2].wert);

  const bruttoJahr = Math.max(0, periode === "monat" ? betrag * 12 : betrag);
  const bruttoMonat = bruttoJahr / 12;
  const imUebergangsbereich = bruttoMonat <= MIDIJOB_OBERGRENZE_MONAT;

  const r = useMemo(() => {
    const person = { bruttoJahr, kinder, ueber23, sachsen };
    const a = berechneSv(SV_2026, person);
    const werte27 = sv2027({
      rvSatz: rvErhoehung ? RV_SATZ_2027_ERWARTET : SV_2026.rvSatz,
      kvZusatzbeitrag: zb2027,
    });
    const b = berechneSv(werte27, person);

    // Aufteilung der Mehrbelastung in "höhere Grenze" und "höhere Sätze":
    // Grenzeffekt = neue Grenzen mit alten Sätzen, der Rest kommt aus den Sätzen.
    const nurGrenzen = berechneSv(
      { ...SV_2026, kvPvBbgJahr: werte27.kvPvBbgJahr, rvAlvBbgJahr: werte27.rvAlvBbgJahr },
      person
    );
    const grenzEffekt = nurGrenzen.an.summe - a.an.summe;
    const satzEffekt = b.an.summe - nurGrenzen.an.summe;

    return { a, b, werte27, grenzEffekt, satzEffekt };
  }, [bruttoJahr, kinder, ueber23, sachsen, rvErhoehung, zb2027]);

  const diffAn = r.b.an.summe - r.a.an.summe;
  const diffAg = r.b.ag.summe - r.a.ag.summe;
  const ueberKvGrenze = bruttoJahr > SV_2026.kvPvBbgJahr;
  const ueberRvGrenze = bruttoJahr > SV_2026.rvAlvBbgJahr;

  return (
    <section id="rechner" className="max-w-6xl mx-auto px-3 sm:px-5 -mt-6 sm:-mt-10 pb-12 relative z-10 scroll-mt-24">
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[380px_minmax(0,1fr)] gap-5 items-start">
        {/* ── Eingaben ── */}
        <div className="bg-white border border-black/[0.08] rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
          <h2 className="font-display font-extrabold text-lg flex items-center gap-2">
            <Calculator size={18} className="text-[#E60A1C]" /> Ihre Angaben
          </h2>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="sv27-brutto" className="text-sm font-bold">
                Bruttogehalt
              </label>
              <div className="inline-flex rounded-full bg-black/[0.05] p-0.5 text-xs font-bold" role="group" aria-label="Zeitraum">
                {(["monat", "jahr"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={periode === p}
                    onClick={() => {
                      if (p === periode) return;
                      setBetrag((v) => Math.round(p === "jahr" ? v * 12 : v / 12));
                      setPeriode(p);
                    }}
                    className={`px-3 py-1 rounded-full transition-colors ${periode === p ? "bg-[#E60A1C] text-white" : "text-black/60"}`}
                  >
                    {p === "monat" ? "/Monat" : "/Jahr"}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <input
                id="sv27-brutto"
                type="number"
                inputMode="decimal"
                min={0}
                step={periode === "monat" ? 100 : 1000}
                value={betrag}
                onChange={(e) => setBetrag(Math.max(0, Number(e.target.value) || 0))}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-black/[0.14] text-lg font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-[#E60A1C]/30"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 font-bold">€</span>
            </div>
            <input
              type="range"
              min={periode === "monat" ? 2000 : 24000}
              max={periode === "monat" ? 12000 : 144000}
              step={periode === "monat" ? 50 : 600}
              value={Math.min(betrag, periode === "monat" ? 12000 : 144000)}
              onChange={(e) => setBetrag(Number(e.target.value))}
              className="w-full mt-3 accent-[#E60A1C]"
              aria-label="Bruttogehalt per Schieberegler"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-bold text-black/60 mb-1.5">Kinder unter 25</span>
              <select
                value={kinder}
                onChange={(e) => setKinder(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-black/[0.14] text-sm font-semibold bg-white"
              >
                {[0, 1, 2, 3, 4, 5].map((k) => (
                  <option key={k} value={k}>
                    {k === 0 ? "keine" : k === 5 ? "5 oder mehr" : k}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-bold text-black/60 mb-1.5">Alter</span>
              <select
                value={ueber23 ? "1" : "0"}
                onChange={(e) => setUeber23(e.target.value === "1")}
                className="w-full px-3 py-2.5 rounded-xl border border-black/[0.14] text-sm font-semibold bg-white"
              >
                <option value="1">23 oder älter</option>
                <option value="0">unter 23</option>
              </select>
            </label>
          </div>

          <label className="flex items-center gap-2.5 text-sm font-semibold cursor-pointer">
            <input type="checkbox" checked={sachsen} onChange={(e) => setSachsen(e.target.checked)} className="w-4 h-4 accent-[#E60A1C]" />
            Arbeitsort in Sachsen
          </label>

          <div className="border-t border-black/[0.08] pt-5 space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-black/50 font-bold">Annahmen für 2027</div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={rvErhoehung}
                onChange={(e) => setRvErhoehung(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#E60A1C]"
              />
              <span className="text-sm leading-snug">
                <span className="font-semibold">Rentenbeitrag steigt auf 18,8 %</span>
                <span className="block text-[11px] text-black/45 mt-0.5">
                  Erwartet laut Rentenpaket; verbindlich erst mit der Beitragssatzverordnung im Herbst 2026.
                </span>
              </span>
            </label>

            <label className="block">
              <span className="block text-sm font-semibold mb-1.5">Durchschnittlicher Zusatzbeitrag 2027</span>
              <select
                value={zb2027}
                onChange={(e) => setZb2027(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-black/[0.14] text-sm font-semibold bg-white"
              >
                {ZB_OPTIONEN.map((o) => (
                  <option key={o.wert} value={o.wert}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="block text-[11px] text-black/45 mt-1">
                Festsetzung nach dem GKV-Schätzerkreis Mitte Oktober 2026. Prognosen: 3,1–3,7 %.
              </span>
            </label>
          </div>
        </div>

        {/* ── Ergebnis ── */}
        <div className="space-y-5" aria-live="polite">
          {imUebergangsbereich ? (
            <div className="bg-white border border-black/[0.08] rounded-3xl p-6 shadow-card">
              <p className="text-sm leading-relaxed text-black/75">
                Bis {formatEUR(MIDIJOB_OBERGRENZE_MONAT)} im Monat gilt der Übergangsbereich: Ihre Beiträge werden
                von einer reduzierten Bemessungsgrundlage berechnet. Dafür gibt es einen eigenen Rechner —
                die höheren Beitragsbemessungsgrenzen 2027 betreffen Sie ohnehin nicht.
              </p>
              <Link
                href="/midijob-rechner"
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-[#E60A1C] hover:underline"
              >
                Zum Midijob-Rechner <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-3xl p-6 text-white shadow-card" style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)" }}>
                  <div className="text-xs font-mono uppercase tracking-wider opacity-90 font-bold flex items-center gap-1.5">
                    <TrendingUp size={14} /> Mehrbelastung 2027 · Sie
                  </div>
                  <div className="text-4xl font-display font-extrabold mt-2 tabular-nums">
                    {diffAn >= 0 ? "+" : "−"}
                    {formatEUR(Math.abs(diffAn) / 12)}
                  </div>
                  <div className="text-sm opacity-90 mt-1">
                    im Monat · {diffAn >= 0 ? "+" : "−"}
                    {formatEUR(Math.abs(diffAn))} im Jahr
                  </div>
                </div>
                <div className="bg-white border border-black/[0.08] rounded-3xl p-6 shadow-card">
                  <div className="text-xs font-mono uppercase tracking-wider text-black/50 font-bold flex items-center gap-1.5">
                    <Building2 size={14} /> Mehrkosten Arbeitgeber
                  </div>
                  <div className="text-4xl font-display font-extrabold mt-2 tabular-nums text-[#16181D]">
                    {diffAg >= 0 ? "+" : "−"}
                    {formatEUR(Math.abs(diffAg) / 12)}
                  </div>
                  <div className="text-sm text-black/55 mt-1">
                    im Monat · {formatEUR(diffAg)} im Jahr
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black/[0.08] rounded-3xl p-5 sm:p-6 shadow-card">
                <h3 className="font-display font-extrabold text-base mb-4">Ihre Beiträge im Vergleich (Arbeitnehmeranteil, pro Monat)</h3>
                <div className="overflow-x-auto -mx-1">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="text-left text-xs text-black/50 border-b border-black/[0.08]">
                        <th className="py-2 px-1 font-semibold">Zweig</th>
                        <th className="py-2 px-1 font-semibold text-right">2026</th>
                        <th className="py-2 px-1 font-semibold text-right">2027</th>
                        <th className="py-2 px-1 font-semibold text-right">Differenz</th>
                      </tr>
                    </thead>
                    <tbody className="tabular-nums">
                      {ZWEIGE.map((z) => {
                        const d = (r.b.an[z.key] - r.a.an[z.key]) / 12;
                        return (
                          <tr key={z.key} className="border-b border-black/[0.05]">
                            <td className="py-2.5 px-1 font-semibold">
                              <span className="sm:hidden">{z.kurz}</span>
                              <span className="hidden sm:inline">{z.label}</span>
                            </td>
                            <td className="py-2.5 px-1 text-right">{formatEUR(r.a.an[z.key] / 12)}</td>
                            <td className="py-2.5 px-1 text-right">{formatEUR(r.b.an[z.key] / 12)}</td>
                            <td className={`py-2.5 px-1 text-right font-bold ${d > 0.004 ? "text-[#E60A1C]" : "text-black/40"}`}>
                              {d > 0.004 ? "+" : ""}
                              {formatEUR(d)}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="font-extrabold">
                        <td className="py-3 px-1">Summe</td>
                        <td className="py-3 px-1 text-right">{formatEUR(r.a.an.summe / 12)}</td>
                        <td className="py-3 px-1 text-right">{formatEUR(r.b.an.summe / 12)}</td>
                        <td className="py-3 px-1 text-right text-[#E60A1C]">
                          {diffAn > 0 ? "+" : ""}
                          {formatEUR(diffAn / 12)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  <div className="bg-black/[0.03] rounded-2xl p-4">
                    <div className="text-xs text-black/50 mb-1">davon durch höhere Beitragsbemessungsgrenzen</div>
                    <div className="text-lg font-extrabold tabular-nums">{formatEUR(r.grenzEffekt / 12)} / Monat</div>
                  </div>
                  <div className="bg-black/[0.03] rounded-2xl p-4">
                    <div className="text-xs text-black/50 mb-1">davon durch höhere Beitragssätze</div>
                    <div className="text-lg font-extrabold tabular-nums">{formatEUR(r.satzEffekt / 12)} / Monat</div>
                  </div>
                </div>

                <p className="text-sm text-black/70 leading-relaxed mt-5">
                  {ueberRvGrenze
                    ? "Sie verdienen über beiden Beitragsbemessungsgrenzen 2026 — die höheren Grenzen 2027 treffen Sie deshalb voll."
                    : ueberKvGrenze
                    ? "Sie liegen über der Grenze für Kranken- und Pflegeversicherung 2026: Deren Anhebung auf " +
                      formatEUR(r.werte27.kvPvBbgJahr / 12) +
                      " im Monat macht einen Teil Ihrer Mehrbelastung aus."
                    : "Sie liegen unter beiden Beitragsbemessungsgrenzen. Die höheren Grenzen ändern für Sie nichts — Mehrkosten entstehen nur, wenn die Beitragssätze steigen."}
                </p>
              </div>

              <div className="bg-white border border-black/[0.08] rounded-3xl p-5 shadow-card">
                <h3 className="font-display font-extrabold text-sm mb-3 flex items-center gap-1.5">
                  <Gavel size={15} className="text-[#E60A1C]" /> Verwendete Werte
                </h3>
                <dl className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-3 sm:gap-x-4 gap-y-1.5 text-xs sm:text-sm tabular-nums">
                  <dt className="text-black/50"></dt>
                  <dd className="text-black/50 font-semibold text-right">2026</dd>
                  <dd className="text-black/50 font-semibold text-right">2027</dd>
                  <dt>BBG Kranken-/Pflegeversicherung (Monat)</dt>
                  <dd className="text-right">{formatEUR(SV_2026.kvPvBbgJahr / 12)}</dd>
                  <dd className="text-right font-bold">{formatEUR(r.werte27.kvPvBbgJahr / 12)}</dd>
                  <dt>BBG Renten-/Arbeitslosenversicherung (Monat)</dt>
                  <dd className="text-right">{formatEUR(SV_2026.rvAlvBbgJahr / 12)}</dd>
                  <dd className="text-right font-bold">{formatEUR(r.werte27.rvAlvBbgJahr / 12)}</dd>
                  <dt>Krankenversicherung inkl. Zusatzbeitrag</dt>
                  <dd className="text-right">{pct(SV_2026.kvSatz + SV_2026.kvZusatzbeitrag, 1)}</dd>
                  <dd className="text-right font-bold">{pct(r.werte27.kvSatz + r.werte27.kvZusatzbeitrag, 1)}</dd>
                  <dt>Rentenversicherung</dt>
                  <dd className="text-right">{pct(SV_2026.rvSatz, 1)}</dd>
                  <dd className="text-right font-bold">{pct(r.werte27.rvSatz, 1)}</dd>
                  <dt>Pflegeversicherung (Ihr Anteil)</dt>
                  <dd className="text-right">{pct(r.a.pvSatzAn)}</dd>
                  <dd className="text-right font-bold">{pct(r.b.pvSatzAn)}</dd>
                  <dt>Arbeitslosenversicherung</dt>
                  <dd className="text-right">{pct(SV_2026.alvSatz, 1)}</dd>
                  <dd className="text-right font-bold">{pct(r.werte27.alvSatz, 1)}</dd>
                </dl>
                <p className="text-[11px] text-black/45 mt-3 flex items-start gap-1.5">
                  <Info size={12} className="flex-shrink-0 mt-0.5" />
                  Grenzen 2027: Referentenentwurf des BMAS vom 21.09.2026, noch nicht beschlossen. Sätze gesamt
                  (AN + AG), Pflegeversicherung als Ihr Arbeitnehmeranteil. Gesetzlich Versicherte ohne
                  knappschaftliche Rentenversicherung.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
