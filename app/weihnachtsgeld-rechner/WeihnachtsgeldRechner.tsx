"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Gift, Calculator, ArrowRight, Info, ChevronDown, Snowflake } from "lucide-react";
import AdUnit from "@/components/AdUnit";
import { calculateNetto, estFormel2026, soliBerechnen, formatEUR } from "@/lib/taxCalculator";

type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;

const STEUERKLASSE_INFO: Record<Steuerklasse, string> = {
  1: "Klasse I — Ledig",
  2: "Klasse II — Alleinerziehend",
  3: "Klasse III — Verheiratet (höheres Einkommen)",
  4: "Klasse IV — Verheiratet (gleiches Einkommen)",
  5: "Klasse V — Verheiratet (geringeres Einkommen)",
  6: "Klasse VI — Zweiter Job",
};

function estJahrFuerSK(zvE: number, sk: Steuerklasse): number {
  if (sk === 3) return 2 * estFormel2026(Math.max(0, zvE) / 2);
  if (sk === 5) {
    const baseEst = estFormel2026(Math.max(0, zvE));
    return Math.min(baseEst * 1.45, Math.max(0, zvE) * 0.40);
  }
  return estFormel2026(Math.max(0, zvE));
}

const faqs = [
  {
    q: "Wie wird Weihnachtsgeld versteuert?",
    a: "Weihnachtsgeld zählt steuerlich als „sonstiger Bezug“. Es wird dem Jahresgehalt hinzugerechnet und nach der Jahreslohnsteuertabelle versteuert. Die Steuer auf das Weihnachtsgeld entspricht der Differenz zwischen der Lohnsteuer auf (Jahresgehalt + Weihnachtsgeld) und der Steuer auf das Jahresgehalt allein.",
  },
  {
    q: "Fallen auf Weihnachtsgeld Sozialabgaben an?",
    a: "Ja. Weihnachtsgeld ist als Einmalzahlung sozialversicherungspflichtig, solange die Beitragsbemessungsgrenze noch nicht erreicht ist. Liegt das Jahresgehalt inkl. Weihnachtsgeld über der Grenze, fallen auf den übersteigenden Teil keine Beiträge mehr an.",
  },
  {
    q: "Wie viel Weihnachtsgeld bleibt netto übrig?",
    a: "Je nach Steuerklasse und Höhe des laufenden Gehalts bleiben von einer Weihnachtsgeld-Sonderzahlung meist zwischen 50 % und 65 % netto übrig — der Rest geht an Steuern und Sozialabgaben. Der Rechner ermittelt Ihren individuellen Netto-Betrag.",
  },
  {
    q: "Ist die Berechnung für Urlaubsgeld und Boni identisch?",
    a: "Ja. Urlaubsgeld, 13. Monatsgehalt, Bonuszahlungen und andere Einmalzahlungen werden steuerlich wie Weihnachtsgeld behandelt. Sie können den Rechner also auch für Ihr Urlaubsgeld oder Ihren Jahresbonus nutzen.",
  },
  {
    q: "Warum ist die Abgabenlast auf Weihnachtsgeld oft höher als erwartet?",
    a: "Weil das Weihnachtsgeld zusätzlich zum regulären Gehalt versteuert wird und dadurch in einen höheren Bereich der Steuerprogression fällt. Der Grenzsteuersatz auf die Sonderzahlung liegt daher meist über dem Durchschnittssteuersatz des normalen Gehalts.",
  },
  {
    q: "Bekomme ich zu viel gezahlte Steuer auf das Weihnachtsgeld zurück?",
    a: "Möglicherweise. Der Arbeitgeber behält die Lohnsteuer nach der Jahresmethode ein. Fällt Ihre tatsächliche Jahressteuer niedriger aus – etwa wegen Werbungskosten, Sonderausgaben oder eines Steuerklassenwechsels – erstattet das Finanzamt die Differenz über die Einkommensteuererklärung. Eine Garantie auf Erstattung gibt es aber nicht.",
  },
  {
    q: "Wie hoch ist Weihnachtsgeld in Deutschland üblicherweise?",
    a: "Die Höhe ist gesetzlich nicht vorgeschrieben und ergibt sich aus Arbeits- oder Tarifvertrag. Verbreitet sind ein halbes oder ein volles Monatsgehalt (13. Gehalt); teils werden feste Beträge oder ein Prozentsatz des Bruttolohns gezahlt. Ob überhaupt Weihnachtsgeld gezahlt wird, hängt vom Arbeitgeber ab.",
  },
];

export default function WeihnachtsgeldRechner({ content }: { content?: React.ReactNode }) {
  const [brutto, setBrutto] = useState(3500);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(1);
  const [kirche, setKirche] = useState(false);
  const [weihnachtsgeld, setWeihnachtsgeld] = useState(3500);

  const result = useMemo(() => {
    const regulaer = calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      verheiratet: steuerklasse === 3 || steuerklasse === 5,
      kinderlosUeber23: false,
      kirche,
      steuerklasse,
    });

    // Sozialversicherung auf die Einmalzahlung (AN-Anteil, bis zur BBG)
    const kvPvBbgJahr = 69750;
    const rvAlvBbgJahr = 101400;
    const bruttoJahrRegulaer = brutto * 12;

    const restKvPv = Math.max(0, kvPvBbgJahr - bruttoJahrRegulaer);
    const restRvAlv = Math.max(0, rvAlvBbgJahr - bruttoJahrRegulaer);
    // AN-Sätze: KV ≈ 8,75 %, PV 1,9 %, RV 9,3 %, ALV 1,3 %
    const svKvPv = Math.min(weihnachtsgeld, restKvPv) * (0.0875 + 0.019);
    const svRvAlv = Math.min(weihnachtsgeld, restRvAlv) * (0.093 + 0.013);
    const svAufWeihnachtsgeld = svKvPv + svRvAlv;

    const zvEOhne = regulaer.steuer.zvE;
    const zvEMit = zvEOhne + Math.max(0, weihnachtsgeld - svAufWeihnachtsgeld);

    const estOhne = estJahrFuerSK(zvEOhne, steuerklasse);
    const estMit = estJahrFuerSK(zvEMit, steuerklasse);

    const verheiratet = steuerklasse === 3;
    const soliOhne = soliBerechnen(estOhne, verheiratet);
    const soliMit = soliBerechnen(estMit, verheiratet);

    const ksSatz = 0.09;
    const ksOhne = kirche ? estOhne * ksSatz : 0;
    const ksMit = kirche ? estMit * ksSatz : 0;

    const steuerlastOhne = estOhne + soliOhne + ksOhne;
    const steuerlastMit = estMit + soliMit + ksMit;
    const steuerAufWeihnachtsgeld = steuerlastMit - steuerlastOhne;

    const netto = weihnachtsgeld - steuerAufWeihnachtsgeld - svAufWeihnachtsgeld;
    const effektiverSatz = weihnachtsgeld > 0 ? ((weihnachtsgeld - netto) / weihnachtsgeld) * 100 : 0;
    const nettoQuote = weihnachtsgeld > 0 ? (netto / weihnachtsgeld) * 100 : 0;

    return { netto, steuerAufWeihnachtsgeld, svAufWeihnachtsgeld, effektiverSatz, nettoQuote };
  }, [brutto, steuerklasse, kirche, weihnachtsgeld]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Snowflake size={14} />
            Weihnachtsgeld · Urlaubsgeld · Einmalzahlung · 2026
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Weihnachtsgeld-Rechner 2026:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              So viel bleibt netto
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Berechnen Sie Ihr <strong className="text-[#16181D]">Weihnachtsgeld 2026</strong> brutto zu netto —
            wie viel nach Steuern und Sozialabgaben übrig bleibt. Die Berechnung gilt auch für Urlaubsgeld,
            13. Monatsgehalt und andere Sonderzahlungen.
          </p>
        </div>
      </section>

      {/* Ad — right below the hero */}
      <AdUnit placement="content" className="!mt-0 !mb-8" />

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
                <label className="block text-sm font-semibold text-black/70 mb-2">Reguläres Bruttogehalt / Monat</label>
                <input
                  type="number"
                  value={brutto}
                  onChange={(e) => setBrutto(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black/70 mb-2">Weihnachtsgeld / Urlaubsgeld (brutto)</label>
                <input
                  type="number"
                  value={weihnachtsgeld}
                  onChange={(e) => setWeihnachtsgeld(Number(e.target.value))}
                  className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-bold text-lg focus:border-[#E60A1C] outline-none"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  <button type="button" onClick={() => setWeihnachtsgeld(Math.round(brutto * 0.5))} className="text-xs font-semibold text-[#E60A1C] bg-[#E60A1C]/10 border border-[#E60A1C]/20 rounded-lg px-2.5 py-1 hover:bg-[#E60A1C]/15 transition-colors">½ Monatsgehalt</button>
                  <button type="button" onClick={() => setWeihnachtsgeld(brutto)} className="text-xs font-semibold text-[#E60A1C] bg-[#E60A1C]/10 border border-[#E60A1C]/20 rounded-lg px-2.5 py-1 hover:bg-[#E60A1C]/15 transition-colors">Volles Monatsgehalt (13.)</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-black/70 mb-2">Steuerklasse</label>
                  <select
                    value={steuerklasse}
                    onChange={(e) => setSteuerklasse(Number(e.target.value) as Steuerklasse)}
                    className="w-full bg-[#F4F5F7] border border-black/[0.10] rounded-xl px-4 py-3 text-[#16181D] font-semibold focus:border-[#E60A1C] outline-none"
                  >
                    {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => (
                      <option key={sk} value={sk}>{STEUERKLASSE_INFO[sk]}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-black/70 cursor-pointer">
                    <input type="checkbox" checked={kirche} onChange={(e) => setKirche(e.target.checked)} className="accent-[#E60A1C] w-4 h-4" />
                    Kirchensteuer
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-7 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-2 flex items-center gap-2">
              <Gift size={22} className="text-[#E60A1C]" />
              Netto-Weihnachtsgeld
            </h2>
            <div className="flex items-center gap-2 mb-6 text-xs text-amber-600/80 bg-amber-50 border border-amber-500/20 rounded-xl px-3 py-2">
              <Info size={13} className="flex-shrink-0" />
              Vereinfachte Berechnung — keine Steuerberatung
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Steuer auf Weihnachtsgeld</span>
                <span className="text-lg font-mono font-extrabold text-[#16181D]">{formatEUR(result.steuerAufWeihnachtsgeld)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Sozialabgaben auf Weihnachtsgeld</span>
                <span className="text-lg font-mono font-extrabold text-[#16181D]">{formatEUR(result.svAufWeihnachtsgeld)}</span>
              </div>
              <div className="flex items-center justify-between bg-black/[0.04] border border-black/[0.08] rounded-xl px-5 py-4">
                <span className="text-black/70 text-sm font-medium">Effektive Abgabenlast</span>
                <span className="text-lg font-mono font-extrabold text-[#16181D]">{result.effektiverSatz.toFixed(1).replace(".", ",")} %</span>
              </div>
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/25 rounded-xl px-5 py-4">
                <span className="text-black/80 text-sm font-semibold">Netto-Weihnachtsgeld</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-600">{formatEUR(result.netto)}</span>
              </div>
              <p className="text-xs text-black/55 px-1">
                Von Ihrem Weihnachtsgeld bleiben rund{" "}
                <strong className="text-[#16181D]">{result.nettoQuote.toFixed(0)} %</strong> netto übrig.
              </p>
            </div>

            <Link
              href="/"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              Reguläres Nettogehalt berechnen
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Server-rendered SEO content (Kurzantwort, engine-based examples, deep sections) */}
      {content}

      {/* Explainer / SEO content */}
      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
            Weihnachtsgeld brutto in netto: So viel bleibt übrig
          </h2>
          <p>
            <strong className="text-[#16181D]">Weihnachtsgeld</strong> ist eine der beliebtesten Sonderzahlungen —
            steuerlich aber kein „geschenkter“ Bonus. Als <strong className="text-[#16181D]">Einmalzahlung</strong>{" "}
            (steuerlich „sonstiger Bezug“) wird es dem Jahreseinkommen hinzugerechnet und nach der
            Jahreslohnsteuertabelle versteuert. Weil dadurch oft ein höherer Grenzsteuersatz greift, fällt die
            Abgabenlast spürbar höher aus als beim normalen Monatsgehalt. Dieser{" "}
            <strong className="text-[#16181D]">Weihnachtsgeld-Rechner</strong> zeigt Ihnen den exakten Netto-Betrag.
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Fallen auf Weihnachtsgeld Sozialabgaben an?</h3>
          <p>
            Ja — anders als bei einer Abfindung ist Weihnachtsgeld grundsätzlich{" "}
            <strong className="text-[#16181D]">sozialversicherungspflichtig</strong>, solange die jeweilige{" "}
            <strong className="text-[#16181D]">Beitragsbemessungsgrenze</strong> noch nicht erreicht ist. Liegt Ihr
            Jahreseinkommen inklusive Weihnachtsgeld bereits über der Grenze (2026: 101.400 € in der
            Renten-/Arbeitslosenversicherung, 69.750 € in KV/PV), fallen auf den darüber liegenden Teil keine
            Beiträge mehr an — netto bleibt dann relativ mehr übrig.
          </p>
          <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-5">
            <p className="font-mono text-[#16181D] text-sm mb-2">So rechnet der Weihnachtsgeld-Rechner:</p>
            <p className="text-black/60 text-sm">
              Er vergleicht Ihre Jahreslohnsteuer <strong className="text-[#16181D]">mit</strong> und{" "}
              <strong className="text-[#16181D]">ohne</strong> Weihnachtsgeld. Die Differenz ist die auf die
              Sonderzahlung entfallende Steuer — so sehen Sie exakt, wie viel von einem halben oder einem vollen
              Monatsgehalt Weihnachtsgeld netto auf dem Konto ankommt.
            </p>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Gilt der Rechner auch für Urlaubsgeld und Boni?</h3>
          <p>
            Ja. <strong className="text-[#16181D]">Urlaubsgeld</strong>, das{" "}
            <strong className="text-[#16181D]">13. Monatsgehalt</strong>, Bonuszahlungen und andere{" "}
            <strong className="text-[#16181D]">Einmalzahlungen</strong> werden steuerlich identisch behandelt.
            Für einen kombinierten Überblick mit Urlaubs- und Weihnachtsgeld eignet sich auch unser{" "}
            <Link href="/bonus-steuerrechner" className="text-[#E60A1C] font-semibold hover:underline">Bonus-Steuerrechner</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8">
          Häufige Fragen zum Weihnachtsgeld
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
              Weitere Gehaltsrechner entdecken
            </h2>
            <p className="text-black/65 mb-7 max-w-xl mx-auto text-sm sm:text-base">
              Bonus-Steuerrechner, Abfindungsrechner, Firmenwagenrechner &amp; mehr —
              alle kostenlos und aktuell für 2026.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/bonus-steuerrechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Bonus-Steuerrechner
              </Link>
              <Link href="/abfindungsrechner" className="inline-flex items-center gap-2 bg-black/[0.05] hover:bg-black/[0.06] border border-black/[0.10] text-[#16181D] font-bold px-6 py-3 rounded-xl transition-all text-sm">
                Abfindungsrechner
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 bg-[#E60A1C] hover:bg-[#FF2436] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
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
