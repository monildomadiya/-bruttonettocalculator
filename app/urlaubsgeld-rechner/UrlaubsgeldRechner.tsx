"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sun, Calculator, ArrowRight, Info, ChevronDown, Snowflake } from "lucide-react";
import { calculateNetto, estFormel2026, soliBerechnen, formatEUR, BBG_2026 } from "@/lib/taxCalculator";

type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;

const STEUERKLASSE_INFO: Record<Steuerklasse, string> = {
  1: "Klasse I — Ledig",
  2: "Klasse II — Alleinerziehend",
  3: "Klasse III — Verheiratet (höheres Einkommen)",
  4: "Klasse IV — Verheiratet (gleiches Einkommen)",
  5: "Klasse V — Verheiratet (geringeres Einkommen)",
  6: "Klasse VI — Zweiter Job",
};

/**
 * Jahreseinkommensteuer je Steuerklasse. Klasse III wird nach dem
 * Splittingverfahren gerechnet, Klasse V näherungsweise über einen Zuschlag
 * mit Deckelung — identisch zum Weihnachtsgeld-Rechner, damit beide Seiten
 * dieselben Zahlen ausweisen.
 */
function estJahrFuerSK(zvE: number, sk: Steuerklasse): number {
  if (sk === 3) return 2 * estFormel2026(Math.max(0, zvE) / 2);
  if (sk === 5) {
    const baseEst = estFormel2026(Math.max(0, zvE));
    return Math.min(baseEst * 1.45, Math.max(0, zvE) * 0.4);
  }
  return estFormel2026(Math.max(0, zvE));
}

const faqs = [
  {
    q: "Wie wird Urlaubsgeld versteuert?",
    a: "Urlaubsgeld ist steuerlich ein „sonstiger Bezug“. Es wird nicht wie laufender Lohn besteuert, sondern dem voraussichtlichen Jahresarbeitslohn hinzugerechnet. Die Lohnsteuer auf das Urlaubsgeld ist die Differenz zwischen der Jahreslohnsteuer mit und ohne Urlaubsgeld. Dadurch greift auf die Sonderzahlung Ihr Grenzsteuersatz — die Abzugsquote liegt spürbar über der des laufenden Gehalts.",
  },
  {
    q: "Wie viel Urlaubsgeld bleibt netto übrig?",
    a: "Je nach Steuerklasse und Höhe des laufenden Gehalts bleiben meist zwischen 50 % und 65 % netto übrig. Bei einem mittleren Einkommen in Steuerklasse I liegt die Gesamtbelastung aus Lohnsteuer, Soli, ggf. Kirchensteuer und Sozialabgaben häufig bei 40–48 %. Der Rechner oben ermittelt Ihren individuellen Betrag.",
  },
  {
    q: "Fallen auf Urlaubsgeld Sozialabgaben an?",
    a: "Ja. Urlaubsgeld ist als Einmalzahlung beitragspflichtig, allerdings nur soweit die Beitragsbemessungsgrenze im Jahr noch nicht ausgeschöpft ist. 2026 liegt sie bei 69.750 € für Kranken- und Pflegeversicherung und bei 101.400 € für Renten- und Arbeitslosenversicherung. Wer darüber verdient, zahlt auf den übersteigenden Teil des Urlaubsgeldes keine Beiträge mehr — netto bleibt dann deutlich mehr übrig.",
  },
  {
    q: "Besteht ein gesetzlicher Anspruch auf Urlaubsgeld?",
    a: "Nein. Urlaubsgeld ist eine freiwillige Leistung des Arbeitgebers. Ein Anspruch entsteht nur aus Arbeitsvertrag, Tarifvertrag, Betriebsvereinbarung oder betrieblicher Übung — also wenn es mehrfach vorbehaltlos gezahlt wurde. Nicht zu verwechseln mit dem Urlaubsentgelt: Das ist die reguläre Lohnfortzahlung während des Urlaubs und gesetzlich garantiert (§ 11 BUrlG).",
  },
  {
    q: "Was ist der Unterschied zwischen Urlaubsgeld und Urlaubsentgelt?",
    a: "Das Urlaubsentgelt ist Ihr normales Gehalt, das während des Urlaubs weitergezahlt wird — darauf haben Sie gesetzlichen Anspruch, und es wird wie laufender Lohn versteuert. Urlaubsgeld ist eine zusätzliche freiwillige Sonderzahlung obendrauf und wird als sonstiger Bezug versteuert.",
  },
  {
    q: "Wie werden Urlaubsgeld und Weihnachtsgeld zusammen berechnet?",
    a: "Beide sind sonstige Bezüge und werden im selben Kalenderjahr zusammengerechnet. Für die Sozialabgaben teilen sie sich denselben Spielraum bis zur Beitragsbemessungsgrenze: Ist dieser durch die erste Sonderzahlung aufgebraucht, fallen auf die zweite keine Beiträge mehr an. Steuerlich erhöhen beide gemeinsam das Jahreseinkommen und damit den Grenzsteuersatz. Aktivieren Sie oben „Urlaubs- und Weihnachtsgeld“, um beide zusammen zu berechnen.",
  },
  {
    q: "Wann wird Urlaubsgeld ausgezahlt?",
    a: "Meist mit der Mai-, Juni- oder Juli-Abrechnung, also vor der Haupturlaubszeit. Der genaue Termin ergibt sich aus dem Arbeits- oder Tarifvertrag. Die steuerliche Behandlung ändert sich durch den Auszahlungsmonat nicht — entscheidend ist das Kalenderjahr.",
  },
  {
    q: "Wie hoch ist Urlaubsgeld üblicherweise?",
    a: "Die Höhe ist frei vereinbar. Tarifverträge sehen häufig einen festen Betrag pro Urlaubstag, einen Prozentsatz des Monatsgehalts oder ein halbes Monatsgehalt vor. In der Praxis liegt Urlaubsgeld oft zwischen 500 € und einem vollen Monatsgehalt.",
  },
];

export default function UrlaubsgeldRechner({ content }: { content?: React.ReactNode }) {
  const [brutto, setBrutto] = useState(3500);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);
  const [urlaubsgeld, setUrlaubsgeld] = useState(1500);
  const [mitWeihnachtsgeld, setMitWeihnachtsgeld] = useState(false);
  const [weihnachtsgeld, setWeihnachtsgeld] = useState(3500);

  const result = useMemo(() => {
    const zweiteZahlung = mitWeihnachtsgeld ? Math.max(0, weihnachtsgeld) : 0;
    const einmalzahlungGesamt = Math.max(0, urlaubsgeld) + zweiteZahlung;

    const regulaer = calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      verheiratet: steuerklasse === 3 || steuerklasse === 5,
      kinderlosUeber23: false,
      kirche,
      steuerklasse,
    });

    // Sozialabgaben auf die Einmalzahlung: nur bis zur jeweiligen BBG, gemessen
    // am bereits durch das laufende Gehalt verbrauchten Jahresentgelt.
    const bruttoJahrRegulaer = brutto * 12;
    const restKvPv = Math.max(0, BBG_2026.kvPvJahr - bruttoJahrRegulaer);
    const restRvAlv = Math.max(0, BBG_2026.rvAlvJahr - bruttoJahrRegulaer);

    const svFuer = (betrag: number, bereitsVerbraucht: number) => {
      const kvPvBasis = Math.max(0, Math.min(betrag, restKvPv - bereitsVerbraucht));
      const rvAlvBasis = Math.max(0, Math.min(betrag, restRvAlv - bereitsVerbraucht));
      return (
        kvPvBasis * (BBG_2026.anSatzKv + BBG_2026.anSatzPv) +
        rvAlvBasis * (BBG_2026.anSatzRv + BBG_2026.anSatzAlv)
      );
    };

    // Urlaubsgeld zuerst, Weihnachtsgeld danach — die zweite Zahlung trifft auf
    // den bereits reduzierten BBG-Spielraum.
    const svUrlaubsgeld = svFuer(Math.max(0, urlaubsgeld), 0);
    const svWeihnachtsgeld = zweiteZahlung > 0 ? svFuer(zweiteZahlung, Math.max(0, urlaubsgeld)) : 0;
    const svGesamt = svUrlaubsgeld + svWeihnachtsgeld;

    // Steuer nach der Jahresmethode: Differenz der Jahressteuer mit/ohne Bezug.
    const zvEOhne = regulaer.steuer.zvE;
    const zvEMit = zvEOhne + Math.max(0, einmalzahlungGesamt - svGesamt);

    const estOhne = estJahrFuerSK(zvEOhne, steuerklasse);
    const estMit = estJahrFuerSK(zvEMit, steuerklasse);

    const verheiratet = steuerklasse === 3;
    const soliOhne = soliBerechnen(estOhne, verheiratet);
    const soliMit = soliBerechnen(estMit, verheiratet);

    const ksSatz = 0.09;
    const ksOhne = kirche ? estOhne * ksSatz : 0;
    const ksMit = kirche ? estMit * ksSatz : 0;

    const steuerGesamt = estMit + soliMit + ksMit - (estOhne + soliOhne + ksOhne);

    const netto = einmalzahlungGesamt - steuerGesamt - svGesamt;
    const effektiverSatz =
      einmalzahlungGesamt > 0 ? ((einmalzahlungGesamt - netto) / einmalzahlungGesamt) * 100 : 0;
    const nettoQuote = einmalzahlungGesamt > 0 ? (netto / einmalzahlungGesamt) * 100 : 0;

    // Anteiliges Netto je Sonderzahlung, proportional zur Bruttohöhe.
    const anteilUrlaubsgeld =
      einmalzahlungGesamt > 0 ? (Math.max(0, urlaubsgeld) / einmalzahlungGesamt) * netto : 0;

    return {
      brutto: einmalzahlungGesamt,
      netto,
      steuerGesamt,
      svGesamt,
      effektiverSatz,
      nettoQuote,
      anteilUrlaubsgeld,
      nettoRegulaer: regulaer.nettoMonat,
    };
  }, [brutto, steuerklasse, kirche, urlaubsgeld, mitWeihnachtsgeld, weihnachtsgeld]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Sun size={14} />
            Urlaubsgeld netto 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Urlaubsgeld-Rechner:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              Was bleibt netto übrig?
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie, wie viel von Ihrem Urlaubsgeld nach Lohnsteuer, Soli und Sozialabgaben
            tatsächlich auf dem Konto landet — auf Wunsch{" "}
            <strong className="text-[#16181D]">zusammen mit dem Weihnachtsgeld</strong>, weil sich
            beide Sonderzahlungen die Beitragsbemessungsgrenze teilen.
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
              Ihre Angaben
            </h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="ug-brutto" className="block text-sm font-semibold text-black/70 mb-2">
                  Monatliches Bruttogehalt (€)
                </label>
                <input
                  id="ug-brutto"
                  type="number"
                  step="50"
                  value={brutto}
                  onChange={(e) => setBrutto(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div>
                <label htmlFor="ug-urlaubsgeld" className="block text-sm font-semibold text-black/70 mb-2">
                  Urlaubsgeld brutto (€)
                </label>
                <input
                  id="ug-urlaubsgeld"
                  type="number"
                  step="50"
                  value={urlaubsgeld}
                  onChange={(e) => setUrlaubsgeld(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              {/* Kombi-Modus: eigener Sucheintent "Urlaubs- und Weihnachtsgeld" */}
              <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-4 shadow-sm">
                <label className="flex items-center gap-2.5 text-sm font-semibold text-[#16181D] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mitWeihnachtsgeld}
                    onChange={(e) => setMitWeihnachtsgeld(e.target.checked)}
                    className="accent-[#E60A1C] w-4 h-4"
                  />
                  <Snowflake size={15} className="text-[#E60A1C]" />
                  Weihnachtsgeld im selben Jahr mitrechnen
                </label>
                {mitWeihnachtsgeld && (
                  <div className="mt-4">
                    <label htmlFor="ug-weihnachtsgeld" className="block text-sm font-semibold text-black/70 mb-2">
                      Weihnachtsgeld brutto (€)
                    </label>
                    <input
                      id="ug-weihnachtsgeld"
                      type="number"
                      step="50"
                      value={weihnachtsgeld}
                      onChange={(e) => setWeihnachtsgeld(Number(e.target.value))}
                      className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                    />
                    <p className="text-xs text-black/55 mt-2">
                      Beide Sonderzahlungen teilen sich den verbleibenden Spielraum bis zur
                      Beitragsbemessungsgrenze.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ug-steuerklasse" className="block text-sm font-semibold text-black/70 mb-2">
                    Steuerklasse
                  </label>
                  <select
                    id="ug-steuerklasse"
                    value={steuerklasse}
                    onChange={(e) => setSteuerklasse(Number(e.target.value) as Steuerklasse)}
                    className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none"
                  >
                    {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => (
                      <option key={sk} value={sk}>
                        {STEUERKLASSE_INFO[sk]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={kirche}
                      onChange={(e) => setKirche(e.target.checked)}
                      className="accent-[#E60A1C] w-4 h-4"
                    />
                    Kirchensteuer
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Sun size={22} className="text-[#E60A1C]" />
              {mitWeihnachtsgeld ? "Ihre Sonderzahlungen netto" : "Ihr Urlaubsgeld netto"}
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Vereinfachte Berechnung — keine Steuerberatung
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">
                  {mitWeihnachtsgeld ? "Sonderzahlungen brutto" : "Urlaubsgeld brutto"}
                </span>
                <span className="text-lg font-extrabold text-[#16181D]">{formatEUR(result.brutto)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">− Lohnsteuer, Soli{kirche ? ", Kirchensteuer" : ""}</span>
                <span className="text-lg font-extrabold text-[#16181D]">− {formatEUR(result.steuerGesamt)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">− Sozialabgaben</span>
                <span className="text-lg font-extrabold text-[#16181D]">− {formatEUR(result.svGesamt)}</span>
              </div>
              <div className="flex items-center justify-between bg-[#E60A1C]/10 border border-[#E60A1C]/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">
                  {mitWeihnachtsgeld ? "Gesamt netto" : "Urlaubsgeld netto"}
                </span>
                <span className="text-2xl font-extrabold text-emerald-600">{formatEUR(result.netto)}</span>
              </div>

              {mitWeihnachtsgeld && (
                <div className="flex items-center justify-between bg-black/[0.03] border border-black/[0.08] rounded-xl px-5 py-3">
                  <span className="text-black/60 text-xs font-medium">davon Urlaubsgeld (anteilig)</span>
                  <span className="text-sm font-bold text-black/70">{formatEUR(result.anteilUrlaubsgeld)}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-black/[0.04] border border-black/[0.08] rounded-xl px-4 py-3 text-center">
                  <div className="text-xs text-black/55 mb-1">Abzugsquote</div>
                  <div className="text-lg font-extrabold text-[#16181D]">
                    {result.effektiverSatz.toFixed(1).replace(".", ",")} %
                  </div>
                </div>
                <div className="bg-black/[0.04] border border-black/[0.08] rounded-xl px-4 py-3 text-center">
                  <div className="text-xs text-black/55 mb-1">Davon bleiben</div>
                  <div className="text-lg font-extrabold text-emerald-600">
                    {result.nettoQuote.toFixed(1).replace(".", ",")} %
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              Vollständigen Brutto-Netto-Rechner öffnen
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Server-rendered SEO content */}
      {content}

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
          Häufige Fragen zum Urlaubsgeld
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

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#E60A1C]/20 via-[#E60A1C]/10 to-transparent border border-[#E60A1C]/30 rounded-3xl p-8 sm:p-12 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#E60A1C]/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
              Weitere Sonderzahlungen berechnen
            </h2>
            <p className="text-black/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">
              Weihnachtsgeld, Bonus und Abfindung werden steuerlich ähnlich behandelt —
              alle Rechner kostenlos und aktuell für 2026.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/weihnachtsgeld-rechner"
                className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm"
              >
                Weihnachtsgeld-Rechner
              </Link>
              <Link
                href="/abfindungsrechner"
                className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm"
              >
                Abfindungsrechner
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
              >
                <Calculator size={16} />
                Brutto-Netto-Rechner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
