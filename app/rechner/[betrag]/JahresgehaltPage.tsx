import Link from "next/link";
import {
  Calculator as CalcIcon, ArrowRight, ArrowLeft,
  Sparkles, Building2, ChevronRight, BarChart3,
} from "lucide-react";
import { calculateNetto, formatEUR, Steuerklasse } from "@/lib/taxCalculator";
import { getCommonGrossSalaryAmounts, getCommonAnnualSalaryAmounts, getWagePercentileContext, WAGE_STATS_2026 } from "@/data/wage-stats";
import Calculator from "@/components/Calculator";
import ReviewerByline from "@/components/ReviewerByline";

/**
 * Programmatic annual-salary page ("70.000 € Jahresgehalt in Netto").
 * Rendered by app/rechner/[betrag]/page.tsx for slugs of the form
 * "<amount>-euro-jahresgehalt-brutto-netto". Targets the very common
 * "<amount> brutto in netto" queries where the amount is a yearly salary —
 * a surface the monthly pages (1.500–10.000 €) cannot serve.
 */

const SK_NAMES: Record<Steuerklasse, string> = {
  1: "Steuerklasse I (Ledig)",
  2: "Steuerklasse II (Alleinerziehend)",
  3: "Steuerklasse III (Verheiratet - Allein-/Hauptverdiener)",
  4: "Steuerklasse IV (Verheiratet - Gleicher Verdienst)",
  5: "Steuerklasse V (Verheiratet - Zweitverdiener)",
  6: "Steuerklasse VI (Zweitjob / Nebenberuf)",
};

export default function JahresgehaltPage({ amount }: { amount: number }) {
  const monat = amount / 12;
  const monatRounded = Math.round(monat);

  const nfEUR0 = (n: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  const nf = (n: number) => new Intl.NumberFormat("de-DE").format(n);
  const formattedJahr = nfEUR0(amount);

  // All 6 Steuerklassen for 2026 (engine works on monthly gross)
  const resultsAllSK = ([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => {
    const res = calculateNetto({
      bruttoMonat: monat,
      jahr: 2026,
      verheiratet: sk === 3 || sk === 4 || sk === 5,
      kinderlosUeber23: true,
      kirche: false,
      steuerklasse: sk,
    });
    return { sk, res };
  });
  const sk1Res = resultsAllSK[0].res;
  const sk3Res = resultsAllSK.find((r) => r.sk === 3)!.res;

  const nettoQuote = (sk1Res.nettoJahr / amount) * 100;
  const STUNDEN_PRO_JAHR = 173.33 * 12; // 40h-Woche
  const bruttoStunde = amount / STUNDEN_PRO_JAHR;
  const nettoStunde = sk1Res.nettoJahr / STUNDEN_PRO_JAHR;

  // German wage context (based on the monthly equivalent)
  const context = getWagePercentileContext(monat);
  const medianJahr = WAGE_STATS_2026.medianGrossMonthly * 12;
  const diffMedian = amount - medianJahr;
  const medianText = diffMedian >= 0
    ? `${nfEUR0(Math.abs(diffMedian))} über dem deutschen Median-Jahresgehalt`
    : `${nfEUR0(Math.abs(diffMedian))} unter dem deutschen Median-Jahresgehalt`;

  // Sibling monthly page (only when the rounded monthly amount really exists)
  const monthlyWhitelist = getCommonGrossSalaryAmounts();
  const monthly100 = Math.round(monat / 100) * 100;
  const monthlyPage = monthlyWhitelist.includes(monthly100) ? monthly100 : null;

  // Neighboring annual pages for internal linking
  const annualWhitelist = getCommonAnnualSalaryAmounts();
  const idx = annualWhitelist.indexOf(amount);
  const prevAmount = idx > 0 ? annualWhitelist[idx - 1] : null;
  const nextAmount = idx >= 0 && idx < annualWhitelist.length - 1 ? annualWhitelist[idx + 1] : null;
  const relatedAmounts = Array.from(
    new Set([amount - 10000, amount - 5000, amount + 5000, amount + 10000])
  )
    .filter((a) => a !== amount && annualWhitelist.includes(a))
    .sort((a, b) => a - b);

  const salaryFaqs = [
    {
      q: `Wie viel netto bleibt von ${nf(amount)} € Jahresgehalt?`,
      a: `Von ${nf(amount)} € brutto im Jahr bleiben in Steuerklasse I (ledig, ohne Kirchensteuer) 2026 rund ${formatEUR(sk1Res.nettoJahr)} netto im Jahr — das sind etwa ${formatEUR(sk1Res.nettoMonat)} netto im Monat. Die Netto-Quote liegt bei ${nettoQuote.toFixed(1).replace(".", ",")} %.`,
    },
    {
      q: `Wie viel ist ${nf(amount)} € im Jahr pro Monat?`,
      a: `${nf(amount)} € Jahresgehalt entsprechen ${formatEUR(monat)} brutto im Monat (ohne Sonderzahlungen wie Weihnachts- oder Urlaubsgeld). Netto bleiben davon in Steuerklasse I rund ${formatEUR(sk1Res.nettoMonat)} monatlich.`,
    },
    {
      q: `Wie viel netto sind ${nf(amount)} € Jahresgehalt in Steuerklasse 3?`,
      a: `In Steuerklasse III bleiben von ${nf(amount)} € Jahresbrutto rund ${formatEUR(sk3Res.nettoJahr)} netto im Jahr (${formatEUR(sk3Res.nettoMonat)} im Monat) — etwa ${formatEUR(sk3Res.nettoJahr - sk1Res.nettoJahr)} mehr als in Steuerklasse I. Sie lohnt sich für Verheiratete mit deutlich höherem Einkommen als der Partner.`,
    },
    {
      q: `Ist ${nf(amount)} € ein gutes Jahresgehalt?`,
      a: `${nf(amount)} € brutto im Jahr liegen ${diffMedian >= 0 ? "über" : "unter"} dem deutschen Median-Jahresgehalt von rund ${nfEUR0(medianJahr)} (Vollzeit, Destatis). ${context.summary}`,
    },
    {
      q: `Wie hoch sind die Abzüge bei ${nf(amount)} € im Jahr?`,
      a: `Bei ${nf(amount)} € Jahresbrutto gehen in Steuerklasse I 2026 rund ${formatEUR(sk1Res.steuer.summeJahr)} Steuern und ${formatEUR(sk1Res.sv.summeJahr)} Sozialabgaben ab — insgesamt ${(100 - nettoQuote).toFixed(1).replace(".", ",")} % des Bruttos.`,
    },
  ];

  const canonicalUrl = `https://bruttonettocalculator.com/rechner/${amount}-euro-jahresgehalt-brutto-netto`;
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://bruttonettocalculator.com" },
          { "@type": "ListItem", "position": 2, "name": "Rechner", "item": "https://bruttonettocalculator.com/#rechner" },
          { "@type": "ListItem", "position": 3, "name": `${formattedJahr} Jahresgehalt in Netto`, "item": canonicalUrl },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": `${formattedJahr} Jahresgehalt in Netto 2026`,
        "description": `${formattedJahr} brutto im Jahr ergeben in Steuerklasse I ca. ${formatEUR(sk1Res.nettoJahr)} netto im Jahr (${formatEUR(sk1Res.nettoMonat)} im Monat, 2026).`,
        "isPartOf": { "@id": "https://bruttonettocalculator.com/#website" },
        "breadcrumb": { "@id": `${canonicalUrl}#breadcrumb` },
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": salaryFaqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      },
    ],
  };

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 text-[#16181D] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      {/* Breadcrumb Nav */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <Link href="/#rechner" className="hover:text-[#16181D] transition-colors">Rechner</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">{formattedJahr} Jahresgehalt in Netto</span>
      </div>

      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <CalcIcon size={14} /> Jahresgehalt · Berechnung nach § 32a EStG
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-[#16181D] mb-4 tracking-tight leading-tight">
          <span className="text-gradient-accent">{formattedJahr} Brutto</span> im Jahr in Netto 2026
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-4xl leading-relaxed mb-6">
          {formattedJahr} Jahresgehalt entsprechen <strong className="text-[#16181D]">{formatEUR(monat)} brutto im Monat</strong>.
          In Steuerklasse 1 (ledig, ohne Kirchensteuer) bleiben davon 2026 rund{" "}
          <strong className="text-[#E60A1C] font-extrabold bg-[#E60A1C]/10 px-2 py-0.5 rounded border border-[#E60A1C]/40">{formatEUR(sk1Res.nettoJahr)}</strong>{" "}
          netto im Jahr — also {formatEUR(sk1Res.nettoMonat)} im Monat. Unten finden Sie alle 6 Steuerklassen und die detaillierten Abzüge.
        </p>
        <ReviewerByline />
      </div>

      {/* Key figures */}
      <div className="mb-14">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          {formattedJahr} Jahresgehalt in Zahlen
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6">
          Kennzahlen für ein Jahresbrutto von {formattedJahr} (Steuerklasse I, 2026, 40-Stunden-Woche).
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Netto / Jahr", value: formatEUR(sk1Res.nettoJahr), accent: true },
            { label: "Netto / Monat", value: formatEUR(sk1Res.nettoMonat), accent: true },
            { label: "Brutto / Monat", value: formatEUR(monat) },
            { label: "Netto-Quote", value: `${nettoQuote.toFixed(1).replace(".", ",")} %` },
            { label: "Steuern / Jahr", value: formatEUR(sk1Res.steuer.summeJahr) },
            { label: "Sozialabgaben / Jahr", value: formatEUR(sk1Res.sv.summeJahr) },
            { label: "Brutto / Stunde", value: formatEUR(bruttoStunde) },
            { label: "Netto / Stunde", value: formatEUR(nettoStunde) },
          ].map((k) => (
            <div key={k.label} className={`rounded-2xl border p-4 sm:p-5 ${k.accent ? "bg-[#E60A1C]/10 border-[#E60A1C]/40" : "bg-[#FFFFFF] border-black/[0.08]"}`}>
              <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1.5">{k.label}</div>
              <div className={`font-mono font-extrabold text-lg sm:text-xl ${k.accent ? "text-[#E60A1C]" : "text-[#16181D]"}`}>{k.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly sibling callout */}
      {monthlyPage && (
        <div className="mb-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F1F3F5] border border-black/[0.10] rounded-3xl p-6 sm:p-8">
          <div>
            <div className="text-sm font-bold text-[#16181D] mb-1">Lieber monatlich rechnen?</div>
            <p className="text-sm text-black/70">
              {formattedJahr} im Jahr entsprechen etwa {nf(monthlyPage)} € im Monat — dort finden Sie die monatliche Detail-Auswertung.
            </p>
          </div>
          <Link
            href={`/rechner/${monthlyPage}-euro-brutto-netto`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-[#E60A1C] hover:bg-[#c50918] text-white px-4 py-2.5 rounded-xl transition-colors shrink-0"
          >
            {nf(monthlyPage)} € brutto im Monat <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Wage context */}
      <div className="mb-14 bg-gradient-to-br from-[#F1F3F5] via-[#FFFFFF] to-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#E60A1C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-black/[0.08] pb-4">
          <div className="flex items-center gap-2 text-[#E60A1C] font-bold text-sm sm:text-base">
            <BarChart3 size={20} />
            <span>Ist {formattedJahr} ein gutes Gehalt?</span>
          </div>
          <span className="bg-black/[0.05] border border-black/[0.10] px-3 py-1 rounded-full text-xs font-mono font-semibold text-black/90">
            {context.badgeText}
          </span>
        </div>
        <p className="text-base sm:text-lg text-black/85 leading-relaxed mb-4">
          Ein Jahresgehalt von <strong className="text-[#16181D]">{formattedJahr}</strong> liegt{" "}
          <strong className="text-[#16181D]">{medianText}</strong> von rund {nfEUR0(medianJahr)} (Vollzeit).{" "}
          {context.summary}
        </p>
        <div className="mt-4 text-xs text-black/50 flex items-center gap-1.5 font-mono">
          <Building2 size={13} className="text-[#E60A1C]" /> Quelle: {WAGE_STATS_2026.source}
        </div>
      </div>

      {/* All 6 Steuerklassen — annual + monthly netto */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-1">
          {formattedJahr} Jahresgehalt: Alle 6 Steuerklassen
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6">
          Jahres- und Monatsnetto für das Steuerjahr 2026 (ohne Kirchensteuer, kinderlos ab 23 Jahren).
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Steuerklasse</th>
                <th className="py-4 px-5 text-right">Steuern / Jahr</th>
                <th className="py-4 px-5 text-right">Sozialabgaben / Jahr</th>
                <th className="py-4 px-5 text-right text-[#16181D] font-bold">Netto / Jahr</th>
                <th className="py-4 px-5 text-right">Netto / Monat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {resultsAllSK.map(({ sk, res }) => (
                <tr key={sk} className={`hover:bg-black/[0.04] transition-colors ${sk === 1 ? "bg-[#E60A1C]/5 font-semibold" : ""}`}>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${sk === 1 ? "bg-[#E60A1C] text-white" : "bg-black/[0.05] text-black/80"}`}>
                        {sk}
                      </span>
                      <span className="text-[#16181D]">{SK_NAMES[sk]}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right text-rose-600 font-mono">-{formatEUR(res.steuer.summeJahr)}</td>
                  <td className="py-4 px-5 text-right text-amber-600 font-mono">-{formatEUR(res.sv.summeJahr)}</td>
                  <td className="py-4 px-5 text-right text-[#16181D] font-bold font-mono text-base bg-black/[0.04]">{formatEUR(res.nettoJahr)}</td>
                  <td className="py-4 px-5 text-right text-black/80 font-mono">{formatEUR(res.nettoMonat)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Calculator (prefilled with monthly equivalent) */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
            Interaktiver Gehaltsrechner für {formattedJahr} im Jahr
          </h2>
          <p className="text-black/70 text-sm sm:text-base">
            Vorausgefüllt mit {formatEUR(monatRounded)} im Monat — passen Sie Kirchensteuer, Bundesland und Steuerklasse an:
          </p>
        </div>
        <Calculator initialBrutto={monatRounded} initialJahr={2026} initialSk={1} deepLink={false} />
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Häufige Fragen zu {formattedJahr} Jahresgehalt
        </h2>
        <div className="space-y-3">
          {salaryFaqs.map((faq, i) => (
            <details key={i} className="group bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between px-5 sm:px-6 py-4 cursor-pointer list-none hover:bg-black/[0.03] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronRight size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-5 sm:px-6 pb-5 pt-1 text-black/70 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Internal linking */}
      <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-8 shadow-xl">
        <h3 className="font-display font-bold text-xl text-[#16181D] mb-6 flex items-center gap-2">
          <Sparkles className="text-[#E60A1C]" size={20} /> Weitere Jahresgehälter im Vergleich
        </h3>
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#F1F3F5] border border-black/[0.08] rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-xs font-mono text-black/40 uppercase block mb-1">Nächstkleineres Jahresgehalt</span>
            {prevAmount ? (
              <Link href={`/rechner/${prevAmount}-euro-jahresgehalt-brutto-netto`} className="font-bold text-[#16181D] hover:text-[#E60A1C] text-lg inline-flex items-center gap-2 transition-colors">
                <ArrowLeft size={16} className="text-[#E60A1C]" /> {nf(prevAmount)} € Jahresgehalt in Netto
              </Link>
            ) : (
              <Link href="/jahresgehalt-rechner" className="font-bold text-[#16181D] hover:text-[#E60A1C] text-lg inline-flex items-center gap-2 transition-colors">
                <ArrowLeft size={16} className="text-[#E60A1C]" /> Zum Jahresgehalt-Rechner
              </Link>
            )}
          </div>
          <div className="bg-[#F1F3F5] border border-black/[0.08] rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-xs font-mono text-black/40 uppercase block mb-1">Nächstgrößeres Jahresgehalt</span>
            {nextAmount ? (
              <Link href={`/rechner/${nextAmount}-euro-jahresgehalt-brutto-netto`} className="font-bold text-[#16181D] hover:text-[#E60A1C] text-lg inline-flex items-center gap-2 transition-colors">
                {nf(nextAmount)} € Jahresgehalt in Netto <ArrowRight size={16} className="text-[#E60A1C]" />
              </Link>
            ) : (
              <Link href="/brutto-netto-gehaltstabelle" className="font-bold text-[#16181D] hover:text-[#E60A1C] text-lg inline-flex items-center gap-2 transition-colors">
                Zur Gehaltstabelle <ArrowRight size={16} className="text-[#E60A1C]" />
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {relatedAmounts.map((a) => (
            <Link
              key={a}
              href={`/rechner/${a}-euro-jahresgehalt-brutto-netto`}
              className="text-xs font-semibold bg-[#F1F3F5] hover:bg-[#FFFFFF] border border-black/[0.08] hover:border-[#E60A1C]/50 text-[#16181D] px-3.5 py-2 rounded-xl transition-all"
            >
              {nf(a)} € Jahresgehalt netto
            </Link>
          ))}
          <Link
            href="/jahresgehalt-rechner"
            className="text-xs font-semibold bg-[#F1F3F5] hover:bg-[#FFFFFF] border border-black/[0.08] hover:border-[#E60A1C]/50 text-[#16181D] px-3.5 py-2 rounded-xl transition-all"
          >
            Jahresgehalt-Rechner <ArrowRight size={12} className="inline" />
          </Link>
        </div>
      </div>
    </main>
  );
}
