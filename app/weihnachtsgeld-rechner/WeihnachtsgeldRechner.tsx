"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Gift, Calculator, ArrowRight, Info, ChevronDown, Snowflake, TrendingUp } from "lucide-react";
import { calculateNetto, formatEUR, type Steuerklasse } from "@/lib/taxCalculator";
import { nettoEinmalzahlung } from "@/lib/einmalzahlung";
import { BUNDESLAENDER } from "@/data/bundeslaender";

/*
 * Rechenkern: lib/einmalzahlung.ts — dieselbe Funktion wie im
 * Jahressonderzahlung- und TV-L-Rechner. Lohnsteuer nach § 39b Abs. 3 EStG
 * (Jahreslohnsteuer mit minus ohne Weihnachtsgeld), Sozialabgaben nach der
 * anteiligen Jahres-BBG bis zum Auszahlungsmonat (§ 23a Abs. 3 SGB IV).
 * Die frühere Eigenrechnung hier nahm die volle Jahres-BBG, schätzte Klasse V
 * mit ESt × 1,45 und ignorierte den PV-Kinderlosenzuschlag.
 */

const STEUERKLASSE_INFO: Record<Steuerklasse, string> = {
  1: "Klasse I — Ledig",
  2: "Klasse II — Alleinerziehend",
  3: "Klasse III — Verheiratet (höheres Einkommen)",
  4: "Klasse IV — Verheiratet (gleiches Einkommen)",
  5: "Klasse V — Verheiratet (geringeres Einkommen)",
  6: "Klasse VI — Zweiter Job",
};

const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const KFB_ZAEHLER = [0, 0.5, 1, 1.5, 2, 2.5, 3];

const pct = (n: number) => n.toLocaleString("de-DE", { maximumFractionDigits: 1 }) + " %";
const inputCls =
  "w-full bg-[#FFFFFF] border border-black/[0.12] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none";

export interface WeihnachtsgeldFaq {
  q: string;
  a: string;
}

export default function WeihnachtsgeldRechner({
  content,
  faqs,
  stand,
}: {
  content?: React.ReactNode;
  faqs: WeihnachtsgeldFaq[];
  /** Seitendatum aus lib/pageDates.ts — das einzige „Aktualisiert am“ der Seite. */
  stand?: { iso: string; display: string };
}) {
  const [brutto, setBrutto] = useState(3500);
  const [wgModus, setWgModus] = useState<"euro" | "prozent">("euro");
  const [wgEuro, setWgEuro] = useState(1500);
  const [wgProzent, setWgProzent] = useState(50);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [landSlug, setLandSlug] = useState("nordrhein-westfalen");
  const [kirche, setKirche] = useState(false);
  const [kfb, setKfb] = useState(0);
  const [kinderlos, setKinderlos] = useState(true);
  const [zusatz, setZusatz] = useState(2.9);
  const [abMonat, setAbMonat] = useState(1);
  const [auszahlung, setAuszahlung] = useState(11);
  const [vorher, setVorher] = useState(0);

  const land = BUNDESLAENDER.find((b) => b.slug === landSlug) ?? BUNDESLAENDER[0];
  const weihnachtsgeld = Math.max(0, wgModus === "euro" ? wgEuro : (brutto * wgProzent) / 100);
  const kfbWirksam = steuerklasse <= 4 ? kfb : 0;

  const r = useMemo(() => {
    const b = Math.max(0, brutto || 0);
    const e = nettoEinmalzahlung({
      bruttoMonat: b,
      einmal: weihnachtsgeld,
      steuerklasse,
      kirche,
      kinderlosUeber23: kinderlos,
      auszahlungsMonat: Math.max(auszahlung, abMonat),
      beschaeftigtAbMonat: abMonat,
      bisherigeEinmalzahlungen: vorher,
      kinderfreibetraege: kfbWirksam,
      kirchensteuerSatz: land.kirchensteuerSatz,
      sachsen: land.sachsen,
      kvZusatzbeitrag: zusatz / 100,
    });
    const monat = calculateNetto({
      bruttoMonat: b,
      jahr: 2026,
      steuerklasse,
      verheiratet: steuerklasse === 3 || steuerklasse === 4 || steuerklasse === 5,
      kinderlosUeber23: kinderlos,
      kirche,
      kirchensteuerSatz: land.kirchensteuerSatz,
      sachsen: land.sachsen,
      kvZusatzbeitrag: zusatz / 100,
    });
    const abzugMonatPct = b > 0 ? ((b - monat.nettoMonat) / b) * 100 : 0;
    return { e, monat, abzugMonatPct };
  }, [brutto, weihnachtsgeld, steuerklasse, kirche, kinderlos, auszahlung, abMonat, vorher, kfbWirksam, land, zusatz]);

  const { e, monat, abzugMonatPct } = r;
  const zeilen = [
    { label: "Lohnsteuer", val: e.lohnsteuer },
    { label: "Solidaritätszuschlag", val: e.soli },
    { label: `Kirchensteuer (${Math.round(land.kirchensteuerSatz * 100)} %)`, val: e.kirchensteuer, aus: !kirche },
    { label: "Krankenversicherung", val: e.svKranken },
    { label: "Pflegeversicherung", val: e.svPflege },
    { label: "Rentenversicherung", val: e.svRente },
    { label: "Arbeitslosenversicherung", val: e.svArbeitslosen },
  ].filter((z) => !z.aus);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <Snowflake size={14} />
            Weihnachtsgeld · Urlaubsgeld · Einmalzahlung · 2026
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Weihnachtsgeld-Rechner 2026:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              So viel Weihnachtsgeld bleibt netto
            </span>
          </h1>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie Ihr <strong className="text-[#16181D]">Weihnachtsgeld 2026</strong> brutto zu netto: mit
            Lohnsteuer, Soli, Kirchensteuer und Sozialabgaben, für alle Steuerklassen. Die Berechnung gilt genauso
            für Urlaubsgeld, das 13. Monatsgehalt und Boni.
          </p>
          {stand && (
            <p className="mt-3 text-xs sm:text-sm text-black/60 font-medium">
              Aktualisiert am <time dateTime={stand.iso}>{stand.display}</time> · Steuerjahr 2026
            </p>
          )}
        </div>
      </section>

      {/* Calculator */}
      <section className="max-w-6xl mx-auto px-5 pt-2 pb-12 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-5 sm:p-9 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" />
              Ihre Angaben
            </h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="wg-brutto" className="block text-sm font-semibold text-black/70 mb-2">
                  Monatsbrutto (laufendes Gehalt)
                </label>
                <input
                  id="wg-brutto"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={brutto}
                  onChange={(ev) => setBrutto(Number(ev.target.value))}
                  className={`${inputCls} text-lg font-bold`}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label htmlFor="wg-betrag" className="text-sm font-semibold text-black/70">
                    Weihnachtsgeld brutto
                  </label>
                  <div className="flex gap-1 bg-black/[0.04] border border-black/[0.10] rounded-lg p-0.5 text-xs font-bold">
                    {(["euro", "prozent"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        aria-pressed={wgModus === m}
                        onClick={() => setWgModus(m)}
                        className={`px-2.5 py-1 rounded-md ${wgModus === m ? "bg-[#E60A1C] text-white" : "text-black/60"}`}
                      >
                        {m === "euro" ? "in €" : "in % vom Gehalt"}
                      </button>
                    ))}
                  </div>
                </div>
                {wgModus === "euro" ? (
                  <input
                    id="wg-betrag"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={wgEuro}
                    onChange={(ev) => setWgEuro(Number(ev.target.value))}
                    className={`${inputCls} text-lg font-bold`}
                  />
                ) : (
                  <input
                    id="wg-betrag"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={200}
                    value={wgProzent}
                    onChange={(ev) => setWgProzent(Number(ev.target.value))}
                    className={`${inputCls} text-lg font-bold`}
                  />
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <button type="button" onClick={() => { setWgModus("prozent"); setWgProzent(50); }} className="text-xs font-semibold text-[#E60A1C] bg-[#E60A1C]/10 border border-[#E60A1C]/20 rounded-lg px-2.5 py-1 hover:bg-[#E60A1C]/15 transition-colors">½ Monatsgehalt</button>
                  <button type="button" onClick={() => { setWgModus("prozent"); setWgProzent(100); }} className="text-xs font-semibold text-[#E60A1C] bg-[#E60A1C]/10 border border-[#E60A1C]/20 rounded-lg px-2.5 py-1 hover:bg-[#E60A1C]/15 transition-colors">Volles Monatsgehalt (13.)</button>
                </div>
                {wgModus === "prozent" && (
                  <p className="text-xs text-black/55 mt-2">= {formatEUR(weihnachtsgeld)} brutto</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="wg-sk" className="block text-sm font-semibold text-black/70 mb-2">Steuerklasse</label>
                  <select
                    id="wg-sk"
                    value={steuerklasse}
                    onChange={(ev) => setSteuerklasse(Number(ev.target.value) as Steuerklasse)}
                    className={inputCls}
                  >
                    {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => (
                      <option key={sk} value={sk}>{STEUERKLASSE_INFO[sk]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="wg-land" className="block text-sm font-semibold text-black/70 mb-2">Bundesland</label>
                  <select id="wg-land" value={landSlug} onChange={(ev) => setLandSlug(ev.target.value)} className={inputCls}>
                    {BUNDESLAENDER.map((b) => (
                      <option key={b.slug} value={b.slug}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                  <input type="checkbox" checked={kirche} onChange={(ev) => setKirche(ev.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                  Kirchensteuer ({Math.round(land.kirchensteuerSatz * 100)} %)
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                  <input type="checkbox" checked={kinderlos} onChange={(ev) => setKinderlos(ev.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                  Kinderlos und mindestens 23
                </label>
              </div>

              <details className="group rounded-2xl border border-black/[0.10] bg-[#F4F5F7]">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none text-sm font-bold text-[#16181D]">
                  Weitere Angaben (Kinderfreibeträge, Kasse, Eintritt, frühere Zahlungen)
                  <ChevronDown size={16} className="text-[#E60A1C] transition-transform group-open:rotate-180 flex-shrink-0" />
                </summary>
                <div className="px-4 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="wg-kfb" className="block text-xs font-semibold text-black/70 mb-1.5">Kinderfreibeträge (Zähler)</label>
                    <select
                      id="wg-kfb"
                      value={kfb}
                      disabled={steuerklasse > 4}
                      onChange={(ev) => setKfb(Number(ev.target.value))}
                      className={`${inputCls} disabled:opacity-50`}
                    >
                      {KFB_ZAEHLER.map((z) => (
                        <option key={z} value={z}>{z.toLocaleString("de-DE")}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="wg-zusatz" className="block text-xs font-semibold text-black/70 mb-1.5">Zusatzbeitrag Ihrer Kasse (%)</label>
                    <input
                      id="wg-zusatz"
                      type="number"
                      step={0.1}
                      min={0}
                      max={6}
                      value={zusatz}
                      onChange={(ev) => setZusatz(Number(ev.target.value))}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="wg-ab" className="block text-xs font-semibold text-black/70 mb-1.5">Beschäftigt seit</label>
                    <select id="wg-ab" value={abMonat} onChange={(ev) => setAbMonat(Number(ev.target.value))} className={inputCls}>
                      {MONATE.map((m, i) => (
                        <option key={m} value={i + 1}>{i === 0 ? "Januar (ganzes Jahr)" : `${m} 2026`}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="wg-monat" className="block text-xs font-semibold text-black/70 mb-1.5">Auszahlung im</label>
                    <select id="wg-monat" value={auszahlung} onChange={(ev) => setAuszahlung(Number(ev.target.value))} className={inputCls}>
                      <option value={11}>November</option>
                      <option value={12}>Dezember</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="wg-vorher" className="block text-xs font-semibold text-black/70 mb-1.5">
                      2026 schon erhaltene Einmalzahlungen, z. B. Urlaubsgeld (brutto, €)
                    </label>
                    <input
                      id="wg-vorher"
                      type="number"
                      min={0}
                      value={vorher}
                      onChange={(ev) => setVorher(Number(ev.target.value))}
                      className={inputCls}
                    />
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-5 sm:p-9 shadow-sm" aria-live="polite">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-4 flex items-center gap-2">
              <Gift size={22} className="text-[#E60A1C]" />
              Weihnachtsgeld netto
            </h2>

            <div className="bg-emerald-50 border border-emerald-500/25 rounded-2xl px-5 py-5 mb-4">
              <p className="text-sm font-semibold text-black/70">Von {formatEUR(e.einmal)} brutto bleiben</p>
              <p className="text-3xl sm:text-4xl font-mono font-extrabold text-emerald-700 mt-1">{formatEUR(e.netto)}</p>
              <p className="text-xs text-black/60 mt-1">
                netto ({pct(e.nettoQuotePct)}) · Abzüge {formatEUR(e.steuerSumme + e.svSumme)}
              </p>
            </div>

            <div className="divide-y divide-black/[0.06] text-sm">
              {zeilen.map((z) => (
                <div key={z.label} className="flex flex-wrap items-center justify-between gap-x-3 py-2">
                  <span className="text-black/70">{z.label}</span>
                  <span className="ml-auto font-mono font-semibold tabular-nums">−{formatEUR(z.val)}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-[#F4F5F7] border border-black/[0.08] p-4 text-sm text-black/75 leading-relaxed">
              <p className="font-bold text-[#16181D] flex items-center gap-1.5 mb-1.5">
                <TrendingUp size={15} className="text-[#E60A1C]" /> Warum bleibt so wenig übrig?
              </p>
              <p>
                Auf Ihr laufendes Gehalt gehen {pct(abzugMonatPct)} an Steuern und Abgaben, auf das Weihnachtsgeld{" "}
                {pct(e.abzugsQuotePct)}. Das Weihnachtsgeld kommt <em>oben</em> auf Ihr Jahreseinkommen und wird
                deshalb mit Ihrem Grenzsteuersatz belastet, nicht mit dem Durchschnittssatz.
                {e.svSumme < 0.005 && e.einmal > 0 && " Sozialabgaben fallen keine an, weil Ihr Entgelt die anteilige Beitragsbemessungsgrenze schon ausschöpft."}
              </p>
              <p className="mt-2">
                Zum Vergleich: Ihr normales Monatsnetto beträgt {formatEUR(monat.nettoMonat)}. Das Weihnachtsgeld netto
                entspricht {monat.nettoMonat > 0 ? pct((e.netto / monat.nettoMonat) * 100) : "–"} davon.
              </p>
            </div>

            {e.naeherung && (
              <p className="mt-3 flex gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-500/25 rounded-xl px-3 py-2">
                <Info size={14} className="flex-shrink-0 mt-0.5" />
                Midijob (603,01–2.000 €): Für Einmalzahlungen im Übergangsbereich gelten Sonderregeln. Die
                Sozialabgaben sind hier nur eine Näherung.
              </p>
            )}
            {brutto > 0 && brutto <= 603 && (
              <p className="mt-3 flex gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-500/25 rounded-xl px-3 py-2">
                <Info size={14} className="flex-shrink-0 mt-0.5" />
                Minijob? Dann gilt diese Rechnung nicht: Minijobber zahlen in der Regel keine Lohnsteuer und keine
                Sozialabgaben. Vertraglich zugesichertes Weihnachtsgeld zählt aber zur Jahresgrenze von 7.236 €.
              </p>
            )}

            <p className="mt-4 text-xs text-black/50">
              Steuerjahr 2026. Alle Angaben ohne Gewähr, keine Steuerberatung.
            </p>

            <Link
              href="/"
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              Reguläres Nettogehalt berechnen
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Server-rendered SEO content (Antwort, Tabellen, Abschnitte, Quellen) */}
      {content}

      {/* FAQ — dieselben Einträge wie im FAQPage-Schema (page.tsx) */}
      <section data-section="" className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">
          Häufige Fragen zum Weihnachtsgeld
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details key={faq.q} className="group bg-[#FFFFFF] border border-black/[0.08] rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 pt-1 text-black/65 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
