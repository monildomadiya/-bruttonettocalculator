"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Clock, Calculator, ChevronDown, ArrowRight, Info } from "lucide-react";
import { type Steuerjahr, type Steuerklasse } from "@/lib/taxCalculator";
import { MINDESTLOHN_BRUTTO_ODER_NETTO } from "./bruttoOderNetto";
import { MINDESTLOHN } from "@/lib/config2027";
import { monatsBrutto, mindestlohnNetto } from "./mindestlohnWerte";
import { MINIJOB_GRENZE } from "@/lib/config2027";

const MINDESTLOHN_2026 = MINDESTLOHN[2026];
const MINDESTLOHN_2027 = MINDESTLOHN[2027];

const history = [
  { year: "2020", betrag: "9,35 €", change: "" },
  { year: "2021", betrag: "9,50 €", change: "+1,6 %" },
  { year: "2022 (Jul)", betrag: "10,45 €", change: "+10,0 %" },
  { year: "2023 (Jan)", betrag: "12,00 €", change: "+14,8 %" },
  { year: "2024 (Jan)", betrag: "12,41 €", change: "+3,4 %" },
  { year: "2025 (Jan)", betrag: "12,82 €", change: "+3,3 %" },
  { year: "2026 (Jan)", betrag: "13,90 €", change: "+8,4 %" },
  { year: "2027 (Jan)", betrag: "14,60 €", change: "+5,0 %" },
];

// Netto per Steuerklasse from the tax engine. These used to be flat
// multipliers (I ×0,74, III ×0,83, V ×0,62), which ignored the progression,
// the Midijob range for part-time hours and the 2027 tariff entirely.
const STEUERKLASSEN: { sk: Steuerklasse; label: string }[] = [
  { sk: 1, label: "Klasse I (ledig)" },
  { sk: 3, label: "Klasse III (verheiratet)" },
  { sk: 4, label: "Klasse IV (verheiratet gleich)" },
  { sk: 5, label: "Klasse V (verheiratet geringer)" },
];

// Bis zur Minijob-Grenze: nur RV-Eigenanteil 3,6 %; darüber die Engine (mindestlohnWerte.ts).
const nettoFor = (bruttoMonat: number, jahr: Steuerjahr, sk: Steuerklasse) => mindestlohnNetto(bruttoMonat, jahr, sk).netto;

const fmt0 = (n: number) => n.toLocaleString("de-DE", { maximumFractionDigits: 0 });
const VZ_BRUTTO_2026 = monatsBrutto(MINDESTLOHN_2026, 40);
// Antwortbox unter der H1: Vollzeit 2027, Steuerklasse I — aus der Engine.
const VZ_BRUTTO_2027 = monatsBrutto(MINDESTLOHN_2027, 40);
const VZ_NETTO_2027 = nettoFor(VZ_BRUTTO_2027, 2027, 1);

const faqs = [
  {
    q: "Wie hoch ist der Mindestlohn 2026?",
    a: `Der gesetzliche Mindestlohn in Deutschland ist zum 1. Januar 2026 auf ${formatEuro(MINDESTLOHN_2026)} brutto pro Stunde gestiegen (zuvor 12,82 € in 2025).`,
  },
  {
    q: "Wann kommt der neue Mindestlohn 2027?",
    a: `Die Bundesregierung hat die zweistufige Erhöhung der Mindestlohnkommission per Verordnung bereits beschlossen: Zum 1. Januar 2027 steigt der Mindestlohn auf ${formatEuro(MINDESTLOHN_2027)} brutto pro Stunde.`,
  },
  {
    q: "Wie viel Netto bleibt vom Mindestlohn 2026 übrig?",
    a: `Bei Vollzeit (40 Std./Woche, ${formatEuro(MINDESTLOHN_2026)}/h) ergibt sich ein Bruttogehalt von ca. ${fmt0(VZ_BRUTTO_2026)} €/Monat. In Steuerklasse I bleiben nach Abzügen etwa ${fmt0(nettoFor(VZ_BRUTTO_2026, 2026, 1))} € netto, in Steuerklasse III ca. ${fmt0(nettoFor(VZ_BRUTTO_2026, 2026, 3))} €.`,
  },
  {
    q: "Gilt der Mindestlohn für alle Beschäftigten?",
    a: "Der gesetzliche Mindestlohn gilt grundsätzlich für alle Arbeitnehmer ab 18 Jahren. Ausnahmen gelten für Praktikanten (unter 3 Monate), Pflichtpraktika, Langzeitarbeitslose in den ersten 6 Monaten sowie Auszubildende.",
  },
  {
    q: "Ist der Mindestlohn brutto oder netto?",
    a: MINDESTLOHN_BRUTTO_ODER_NETTO,
  },
];

function formatEuro(value: number): string {
  return value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

export default function MindestlohnCalculator({
  content,
  stand,
}: {
  content?: React.ReactNode;
  /** Seitendatum aus lib/pageDates.ts — das einzige „Aktualisiert am“ der Seite. */
  stand?: { iso: string; display: string };
}) {
  const [stunden, setStunden] = useState(40);
  // 2027 vorausgewählt (Suchen nach „mindestlohn 2027 rechner“); 2026 bleibt wählbar.
  const [jahr, setJahr] = useState<Steuerjahr>(2027);
  const stundenlohn = jahr === 2027 ? MINDESTLOHN_2027 : MINDESTLOHN_2026;
  // Derived, not state: the old useEffect left both at 0 in the server HTML.
  // Monatsbrutto = Stundenlohn × Wochenstunden × 13 ÷ 3 (= × 52 ÷ 12).
  const bruttoMonat = monatsBrutto(stundenlohn, stunden);
  const bruttoJahr = stundenlohn * stunden * 52;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-6 pb-4 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-6">
            <TrendingUp size={14} />
            {formatEuro(MINDESTLOHN_2027)} (2027) · {formatEuro(MINDESTLOHN_2026)} (2026)
          </div>
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-3 sm:mb-6 leading-tight">
            Mindestlohn 2027:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              Wie viel bleibt von {formatEuro(MINDESTLOHN_2027)} netto?
            </span>
          </h1>
          {/* Antwort direkt unter der H1 — berechnet, nicht getippt. */}
          <p className="mx-auto max-w-3xl rounded-2xl border border-[#E60A1C]/30 bg-[#FFFFFF] px-4 py-3 text-base sm:text-lg text-[#16181D] font-semibold shadow-sm mb-4">
            Vollzeit (40 Std./Woche): {formatEuro(VZ_BRUTTO_2027)} brutto ≈ {formatEuro(VZ_NETTO_2027)} netto im Monat (Steuerklasse 1, 2027).
          </p>
          <p className="text-base sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie Ihr monatliches Brutto- &amp; Nettogehalt beim gesetzlichen Mindestlohn von{" "}
            <strong className="text-[#16181D]">{formatEuro(MINDESTLOHN_2027)}&nbsp;/&nbsp;Stunde</strong> (ab 2027) bzw.{" "}
            <strong className="text-[#16181D]">{formatEuro(MINDESTLOHN_2026)}&nbsp;/&nbsp;Stunde</strong> (2026). Alle
            Steuerklassen, Vollzeit &amp; Teilzeit.
          </p>
          {stand && (
            <p className="mt-3 text-xs sm:text-sm text-black/60 font-medium">
              Aktualisiert am <time dateTime={stand.iso}>{stand.display}</time> · Netto 2027 vorläufig (Steuerreform-Entwurf)
            </p>
          )}
        </div>
      </section>

      {/* Interactive Calculator */}
      <section className="max-w-6xl mx-auto px-5 pt-2 pb-12 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input card */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" />
              Mindestlohn berechnen
            </h2>

            {/* Stunden slider */}
            <div className="mb-6">
              <label htmlFor="stunden-slider" className="block text-sm font-semibold text-black/70 mb-2">
                Arbeitsstunden pro Woche
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="stunden-slider"
                  type="range"
                  min={1}
                  max={48}
                  value={stunden}
                  onChange={(e) => setStunden(Number(e.target.value))}
                  className="flex-1 accent-[#E60A1C] h-2 rounded-full"
                  aria-label="Arbeitsstunden pro Woche"
                />
                <div className="bg-[#E60A1C]/15 border border-[#E60A1C]/40 rounded-xl px-4 py-2 text-[#E60A1C] font-bold text-lg w-20 text-center">
                  {stunden}h
                </div>
              </div>
              <div className="flex justify-between text-xs text-black/40 mt-1">
                <span>Teilzeit</span>
                <span>Vollzeit 40h</span>
                <span>Überstunden</span>
              </div>
            </div>

            {/* Jahr + Mindestlohn display */}
            <div className="grid grid-cols-2 gap-2 mb-4" role="group" aria-label="Jahr wählen">
              {([2026, 2027] as Steuerjahr[]).map((j) => (
                <button
                  key={j}
                  type="button"
                  onClick={() => setJahr(j)}
                  aria-pressed={jahr === j}
                  className={`rounded-xl py-2.5 text-sm font-bold border transition-colors ${
                    jahr === j ? "bg-[#E60A1C] border-[#E60A1C] text-white" : "bg-white border-black/[0.10] text-black/70 hover:border-[#E60A1C]/50"
                  }`}
                >
                  {j}
                </button>
              ))}
            </div>
            <div className="bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-black/70 text-sm font-medium">Mindestlohn {jahr}</span>
                <span className="text-2xl font-extrabold text-[#16181D]">{stundenlohn.toFixed(2).replace(".", ",")} €&nbsp;/&nbsp;h</span>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Bruttogehalt / Monat</span>
                <span className="text-xl font-extrabold text-[#16181D]">{formatEuro(bruttoMonat)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Bruttogehalt / Jahr</span>
                <span className="text-xl font-extrabold text-[#16181D]">{formatEuro(bruttoJahr)}</span>
              </div>
            </div>
          </div>

          {/* Net estimates */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Clock size={22} className="text-[#E60A1C]" />
              Nettogehalt {jahr}
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              {bruttoMonat <= MINIJOB_GRENZE[jahr]
                ? `Minijob (bis ${MINIJOB_GRENZE[jahr]} €): keine Lohnsteuer, nur 3,6 % Rentenbeitrag (ohne Befreiung)`
                : jahr === 2027
                ? "2027: Steuertarif laut Gesetzentwurf, Sozialabgaben mit Werten 2026 — ohne Kirchensteuer, kinderlos"
                : "Ohne Kirchensteuer, kinderlos ab 23, Ø-Zusatzbeitrag der Krankenkasse"}
            </div>

            <div className="space-y-3" aria-live="polite">
              {STEUERKLASSEN.map(({ sk, label }) => {
                const netto = nettoFor(bruttoMonat, jahr, sk);
                return (
                  <div
                    key={sk}
                    className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4 hover:bg-black/[0.08] transition-colors"
                  >
                    <div>
                      <div className="text-[#16181D] font-semibold text-sm">{label}</div>
                      <div className="text-black/40 text-xs mt-0.5">{bruttoMonat > 0 ? Math.round((netto / bruttoMonat) * 100) : 0} % von Brutto</div>
                    </div>
                    <span className="text-lg font-extrabold text-emerald-600">
                      {formatEuro(netto)}
                    </span>
                  </div>
                );
              })}
            </div>

            <Link
              href="/"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              Exakt berechnen im Brutto-Netto-Rechner
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Mindestlohn 2027 preview */}
      <section className="max-w-6xl mx-auto px-5 py-4">
        <div className="bg-gradient-to-br from-black/5 to-black/[0.02] border border-black/[0.10] rounded-3xl p-7 sm:p-9">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex-1">
              <div className="text-xs font-mono uppercase tracking-widest text-[#E60A1C] mb-2">
                BESCHLOSSEN
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2">
                Mindestlohn 2027 — Was kommt?
              </h2>
              <p className="text-black/60 text-sm sm:text-base leading-relaxed">
                Die Bundesregierung hat die zweistufige Erhöhung der Mindestlohnkommission per Verordnung bereits beschlossen: Zum 1. Januar 2027 steigt der Mindestlohn auf{" "}
                <strong className="text-[#16181D]">
                  {MINDESTLOHN_2027.toFixed(2).replace(".", ",")} €&nbsp;/&nbsp;h
                </strong>
                .
              </p>
            </div>
            <div className="bg-black/[0.04] border border-black/[0.08] rounded-2xl p-5 text-center min-w-[140px]">
              <div className="text-3xl font-extrabold text-[#16181D] mb-1">
                {MINDESTLOHN_2027.toFixed(2).replace(".", ",")} €
              </div>
              <div className="text-xs text-black/50">ab 2027 / Stunde</div>
            </div>
          </div>
        </div>
      </section>

      {/* Server-rendered SEO content (Minijob, Arbeitgeberkosten, BMAS-Quelle) */}
      {content}

      {/* History */}
      <section className="max-w-6xl mx-auto px-5 py-10">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-6">
          Mindestlohn-Historie 2020–2027
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-black/[0.08]">
          <table className="w-full text-sm sm:text-base">
            <thead>
              <tr className="bg-[#E60A1C]/15 border-b border-black/[0.08]">
                <th className="px-5 py-4 text-left font-bold text-[#16181D]">Jahr</th>
                <th className="px-5 py-4 text-right font-bold text-[#16181D]">Mindestlohn / Stunde</th>
                <th className="px-5 py-4 text-right font-bold text-[#16181D]">Veränderung</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-black/[0.05] hover:bg-black/[0.04] transition-colors ${
                    i % 2 === 0 ? "bg-[#F4F5F7]" : "bg-[#F4F5F7]"
                  }`}
                >
                  <td className="px-5 py-3.5 font-semibold text-black/80">{row.year}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-[#16181D]">{row.betrag}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-emerald-600">
                    {row.change || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section data-section="" className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">
          Häufige Fragen zum Mindestlohn
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="px-6 pb-5 pt-1 text-black/65 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#E60A1C]/20 via-[#E60A1C]/10 to-transparent border border-[#E60A1C]/30 rounded-3xl p-8 sm:p-12 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#E60A1C]/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-3">
              Genaues Nettogehalt berechnen
            </h2>
            <p className="text-black/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">
              Unser Brutto-Netto-Rechner berücksichtigt alle Faktoren: Steuerklasse, Kirchensteuer,
              Kinderfreibeträge, BKK-Zusatzbeitrag und mehr — für präzise Ergebnisse 2026.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-8 py-3.5 rounded-xl transition-all text-sm sm:text-base"
            >
              <Calculator size={18} />
              Jetzt Netto berechnen
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
