"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Palmtree, Calculator, ArrowRight, Info, ChevronDown } from "lucide-react";

/**
 * Urlaubsanspruch nach dem Bundesurlaubsgesetz.
 *
 * § 3 BUrlG nennt 24 Werktage bei einer Sechs-Tage-Woche als Mindesturlaub.
 * "Werktage" sind Montag bis Samstag. Wer an weniger Tagen pro Woche arbeitet,
 * bekommt anteilig: 24 × eigene Arbeitstage ÷ 6. Bei der üblichen
 * Fünf-Tage-Woche sind das genau 20 Urlaubstage.
 */
const MINDESTURLAUB_WERKTAGE = 24;
const WERKTAGE_PRO_WOCHE = 6;
/** § 208 SGB IX — Zusatzurlaub für schwerbehinderte Menschen, bezogen auf 5 Tage/Woche. */
const ZUSATZURLAUB_SCHWERBEHINDERT = 5;

function formatTage(value: number): string {
  return value.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

const faqs = [
  {
    q: "Wie viele Urlaubstage stehen mir gesetzlich zu?",
    a: "Das Bundesurlaubsgesetz nennt 24 Werktage bei einer Sechs-Tage-Woche (§ 3 BUrlG). Weil Werktage Montag bis Samstag umfassen, entspricht das bei der üblichen Fünf-Tage-Woche 20 Urlaubstagen im Jahr. Das ist die gesetzliche Untergrenze — Arbeits- und Tarifverträge sehen häufig mehr vor, in der Praxis meist 25 bis 30 Tage.",
  },
  {
    q: "Wie berechne ich den Urlaubsanspruch bei Teilzeit?",
    a: "Entscheidend ist die Zahl der Arbeitstage pro Woche, nicht die Stundenzahl. Die Formel lautet: Urlaubstage × eigene Arbeitstage ÷ Arbeitstage einer Vollzeitkraft. Wer bei 30 Urlaubstagen und Fünf-Tage-Woche auf drei Tage reduziert, hat 18 Tage. Wer die gleiche Stundenzahl auf fünf Tage verteilt, behält dagegen die vollen 30 Tage — bei kürzeren Arbeitstagen.",
  },
  {
    q: "Wie viel Urlaub steht mir bei einer 4-Tage-Woche zu?",
    a: "Bei gesetzlichem Mindesturlaub sind es 16 Tage (24 × 4 ÷ 6). Bei einem vertraglichen Anspruch von 30 Tagen auf Basis einer Fünf-Tage-Woche sind es 24 Tage. Die Zahl der Urlaubstage sinkt, der Erholungswert bleibt gleich: Sie brauchen für eine freie Woche nur vier statt fünf Urlaubstage.",
  },
  {
    q: "Wie viel Urlaub bekomme ich, wenn ich unterjährig anfange?",
    a: "Für jeden vollen Monat des Arbeitsverhältnisses ein Zwölftel des Jahresanspruchs (§ 5 BUrlG). Bruchteile von mindestens einem halben Tag werden auf volle Tage aufgerundet. Den vollen Jahresanspruch erwerben Sie erstmals nach sechs Monaten Wartezeit — davor besteht nur der anteilige Teilurlaub.",
  },
  {
    q: "Was passiert mit dem Urlaub bei Kündigung?",
    a: "Scheiden Sie in der ersten Jahreshälfte aus, bekommen Sie ein Zwölftel pro vollem Beschäftigungsmonat. Scheiden Sie nach dem 30. Juni aus und haben die sechsmonatige Wartezeit erfüllt, steht Ihnen der volle Jahresurlaub zu — auch wenn Sie nur sieben Monate gearbeitet haben. Nicht genommener Urlaub muss abgegolten, also ausgezahlt werden.",
  },
  {
    q: "Bekommen Minijobber Urlaub?",
    a: "Ja, in vollem Umfang. Der Urlaubsanspruch hängt nicht vom Verdienst ab, sondern allein von den Arbeitstagen pro Woche. Ein Minijobber, der an zwei Tagen pro Woche arbeitet, hat gesetzlich acht Urlaubstage (24 × 2 ÷ 6). Während des Urlaubs wird das übliche Entgelt weitergezahlt.",
  },
  {
    q: "Wann verfällt mein Urlaub?",
    a: "Grundsätzlich am 31. Dezember des Urlaubsjahres. Eine Übertragung bis zum 31. März des Folgejahres ist nur bei dringenden betrieblichen oder persönlichen Gründen vorgesehen. Wichtig: Nach der Rechtsprechung des Bundesarbeitsgerichts verfällt Urlaub nur dann, wenn der Arbeitgeber rechtzeitig auf den Resturlaub und den drohenden Verfall hingewiesen hat.",
  },
  {
    q: "Wie viel Zusatzurlaub gibt es bei Schwerbehinderung?",
    a: "Fünf zusätzliche Arbeitstage pro Jahr bei einer Fünf-Tage-Woche (§ 208 SGB IX). Bei abweichender Verteilung wird anteilig umgerechnet — bei einer Vier-Tage-Woche also vier Tage. Voraussetzung ist ein Grad der Behinderung von mindestens 50.",
  },
];

export default function UrlaubsanspruchRechner({ content }: { content?: React.ReactNode }) {
  const [arbeitstage, setArbeitstage] = useState(5);
  const [vertraglich, setVertraglich] = useState(true);
  const [urlaubVollzeit, setUrlaubVollzeit] = useState(30);
  const [schwerbehindert, setSchwerbehindert] = useState(false);
  const [unterjaehrig, setUnterjaehrig] = useState(false);
  const [monate, setMonate] = useState(6);

  const result = useMemo(() => {
    const tage = Math.min(6, Math.max(1, arbeitstage));

    // Gesetzlich: 24 Werktage bei 6-Tage-Woche, anteilig auf die eigene Woche.
    const gesetzlich = (MINDESTURLAUB_WERKTAGE * tage) / WERKTAGE_PRO_WOCHE;

    // Vertraglich: der Anspruch ist auf eine 5-Tage-Woche bezogen und wird
    // ebenfalls nach Arbeitstagen umgerechnet.
    const vertraglichAnspruch = (Math.max(0, urlaubVollzeit) * tage) / 5;

    const basis = vertraglich ? Math.max(gesetzlich, vertraglichAnspruch) : gesetzlich;

    const zusatz = schwerbehindert ? (ZUSATZURLAUB_SCHWERBEHINDERT * tage) / 5 : 0;
    const jahresanspruch = basis + zusatz;

    // § 5 BUrlG: ein Zwölftel je vollem Monat, ab 0,5 Tagen wird aufgerundet.
    const anteiligRoh = unterjaehrig ? (jahresanspruch * Math.min(12, Math.max(0, monate))) / 12 : jahresanspruch;
    const anteilig = unterjaehrig ? Math.ceil(anteiligRoh - 0.5) : anteiligRoh;

    return {
      gesetzlich,
      vertraglichAnspruch,
      zusatz,
      jahresanspruch,
      anteiligRoh,
      ergebnis: unterjaehrig ? anteilig : jahresanspruch,
      wochenFrei: tage > 0 ? (unterjaehrig ? anteilig : jahresanspruch) / tage : 0,
    };
  }, [arbeitstage, vertraglich, urlaubVollzeit, schwerbehindert, unterjaehrig, monate]);

  const labelClass = "block text-sm font-semibold text-black/70 mb-2";

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Palmtree size={14} />
            Bundesurlaubsgesetz · § 3 BUrlG
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Urlaubsanspruch berechnen:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              Wie viele Urlaubstage stehen mir zu?
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Für Vollzeit, Teilzeit, Vier-Tage-Woche und Minijob — inklusive anteiligem Anspruch bei
            unterjährigem Ein- oder Austritt und Zusatzurlaub bei Schwerbehinderung.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#E60A1C]" />
              Ihre Arbeitszeit
            </h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="ua-arbeitstage" className={labelClass}>
                  Arbeitstage pro Woche
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="ua-arbeitstage"
                    type="range"
                    min={1}
                    max={6}
                    value={arbeitstage}
                    onChange={(e) => setArbeitstage(Number(e.target.value))}
                    className="flex-1 accent-[#E60A1C] h-2 rounded-full"
                  />
                  <div className="bg-[#E60A1C]/15 border border-[#E60A1C]/40 rounded-xl px-4 py-2 text-[#E60A1C] font-bold text-lg w-24 text-center">
                    {arbeitstage} {arbeitstage === 1 ? "Tag" : "Tage"}
                  </div>
                </div>
                <p className="text-xs text-black/50 mt-2">
                  Entscheidend sind die Arbeits<em>tage</em>, nicht die Stunden.
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-4 shadow-sm">
                <label className="flex items-center gap-2.5 text-sm font-semibold text-[#16181D] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vertraglich}
                    onChange={(e) => setVertraglich(e.target.checked)}
                    className="accent-[#E60A1C] w-4 h-4"
                  />
                  Mein Vertrag sieht mehr als das gesetzliche Minimum vor
                </label>
                {vertraglich && (
                  <div className="mt-4">
                    <label htmlFor="ua-vertrag" className={labelClass}>
                      Urlaubstage laut Vertrag (bei 5-Tage-Woche)
                    </label>
                    <input
                      id="ua-vertrag"
                      type="number"
                      step="1"
                      min={0}
                      value={urlaubVollzeit}
                      onChange={(e) => setUrlaubVollzeit(Number(e.target.value))}
                      className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                    />
                    <p className="text-xs text-black/55 mt-2">
                      Üblich sind 25 bis 30 Tage. Der Wert wird auf Ihre Arbeitstage umgerechnet.
                    </p>
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2.5 text-sm font-semibold text-black/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={schwerbehindert}
                  onChange={(e) => setSchwerbehindert(e.target.checked)}
                  className="accent-[#E60A1C] w-4 h-4"
                />
                Schwerbehinderung (GdB ab 50) — 5 Tage Zusatzurlaub
              </label>

              <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-4 shadow-sm">
                <label className="flex items-center gap-2.5 text-sm font-semibold text-[#16181D] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={unterjaehrig}
                    onChange={(e) => setUnterjaehrig(e.target.checked)}
                    className="accent-[#E60A1C] w-4 h-4"
                  />
                  Ein- oder Austritt mitten im Jahr
                </label>
                {unterjaehrig && (
                  <div className="mt-4">
                    <label htmlFor="ua-monate" className={labelClass}>
                      Volle Beschäftigungsmonate im Jahr
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        id="ua-monate"
                        type="range"
                        min={0}
                        max={12}
                        value={monate}
                        onChange={(e) => setMonate(Number(e.target.value))}
                        className="flex-1 accent-[#E60A1C] h-2 rounded-full"
                      />
                      <div className="bg-[#E60A1C]/15 border border-[#E60A1C]/40 rounded-xl px-3 py-2 text-[#E60A1C] font-bold w-24 text-center">
                        {monate} Mon.
                      </div>
                    </div>
                    <p className="text-xs text-black/55 mt-2">
                      Ein Zwölftel je vollem Monat (§ 5 BUrlG), ab einem halben Tag wird aufgerundet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Palmtree size={22} className="text-[#E60A1C]" />
              Ihr Urlaubsanspruch
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Orientierung — maßgeblich ist Ihr Arbeits- oder Tarifvertrag
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-5">
                <span className="text-black/80 text-sm font-semibold">
                  {unterjaehrig ? "Anteiliger Anspruch" : "Urlaubstage pro Jahr"}
                </span>
                <span className="text-3xl font-extrabold text-emerald-600">
                  {formatTage(result.ergebnis)}
                </span>
              </div>

              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Gesetzliches Minimum (§ 3 BUrlG)</span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatTage(result.gesetzlich)}</span>
              </div>

              {vertraglich && (
                <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                  <span className="text-black/70 text-sm font-medium">Vertraglich, umgerechnet</span>
                  <span className="text-lg font-extrabold text-[#16181D]">
                    {formatTage(result.vertraglichAnspruch)}
                  </span>
                </div>
              )}

              {result.zusatz > 0 && (
                <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                  <span className="text-black/70 text-sm font-medium">+ Zusatzurlaub Schwerbehinderung</span>
                  <span className="text-lg font-extrabold text-[#16181D]">+ {formatTage(result.zusatz)}</span>
                </div>
              )}

              {unterjaehrig && (
                <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                  <span className="text-black/70 text-sm font-medium">Voller Jahresanspruch</span>
                  <span className="text-lg font-extrabold text-[#16181D]">
                    {formatTage(result.jahresanspruch)}
                  </span>
                </div>
              )}

              <div className="bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4 text-center">
                <div className="text-xs text-black/55 mb-1">Das entspricht</div>
                <div className="text-lg font-extrabold text-[#16181D]">
                  {formatTage(result.wochenFrei)} freien Wochen
                </div>
              </div>

              {unterjaehrig && result.anteiligRoh !== result.ergebnis && (
                <p className="text-xs text-black/50 px-1">
                  Rechnerisch {formatTage(result.anteiligRoh)} Tage — nach § 5 Abs. 2 BUrlG werden Bruchteile
                  ab einem halben Tag auf volle Tage aufgerundet.
                </p>
              )}
            </div>

            <Link
              href="/teilzeitrechner"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              Teilzeit-Gehalt berechnen
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {content}

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
          Häufige Fragen zum Urlaubsanspruch
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-hidden">
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
