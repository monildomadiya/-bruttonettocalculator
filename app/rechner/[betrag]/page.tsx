import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calculator as CalcIcon, ArrowRight, ArrowLeft, CheckCircle2,
  TrendingUp, ShieldCheck, HelpCircle, Calendar, Sparkles, Building2,
  ChevronRight, BarChart3,
} from "lucide-react";
import { calculateNetto, formatEUR, Steuerjahr, Steuerklasse } from "@/lib/taxCalculator";
import { getCommonGrossSalaryAmounts, getWagePercentileContext, WAGE_STATS_2026 } from "@/data/wage-stats";
import Calculator from "@/components/Calculator";
import ReviewerByline from "@/components/ReviewerByline";
import AdUnit from "@/components/AdUnit";

export const revalidate = 0; // Always generate fresh or static

interface PageProps {
  params: { betrag: string };
}

// 1. Generate static params for common amounts
export async function generateStaticParams() {
  const amounts = getCommonGrossSalaryAmounts();
  return amounts.map((amount) => ({
    betrag: `${amount}-euro-brutto-netto`,
  }));
}

// Helper to parse amount from slug param.
// Accepts only the canonical slug form "<amount>-euro-brutto-netto"
// (e.g. "3000-euro-brutto-netto") to avoid duplicate-content variants.
function parseAmount(betragStr: string): number | null {
  const match = /^(\d+)-euro-brutto-netto$/.exec(betragStr);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  if (isNaN(num) || num < 500 || num > 100000) return null;
  return num;
}

// 3. Unique Metadata per long-tail page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const amount = parseAmount(params.betrag);
  if (!amount) {
    return { title: "Gehalt nicht gefunden" };
  }

  const res2026 = calculateNetto({ bruttoMonat: amount, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 });
  const netSK1 = res2026.nettoMonat;
  const formattedBrutto = new Intl.NumberFormat("de-DE").format(amount);
  const formattedNetto = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(netSK1);

  const title = `${formattedBrutto} Euro brutto in netto 2026`;
  const description = `${formattedBrutto} € brutto sind in Steuerklasse I ca. ${formattedNetto} netto im Monat (2026). Alle 6 Steuerklassen, Abzüge, Jahreswerte und Lohnvergleich im Detail.`;
  const canonicalUrl = `https://bruttonettocalculator.com/rechner/${amount}-euro-brutto-netto`;

  return {
    title,
    description,
    keywords: `${amount} euro brutto netto, ${amount} brutto wieviel netto, ${amount} brutto steuerklasse 1, gehaltsrechner ${amount} euro, brutto netto rechner 2026`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      locale: "de_DE",
      siteName: "BruttoNettoCalculator.com",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

const SK_NAMES: Record<Steuerklasse, string> = {
  1: "Steuerklasse I (Ledig)",
  2: "Steuerklasse II (Alleinerziehend)",
  3: "Steuerklasse III (Verheiratet - Allein-/Hauptverdiener)",
  4: "Steuerklasse IV (Verheiratet - Gleicher Verdienst)",
  5: "Steuerklasse V (Verheiratet - Zweitverdiener)",
  6: "Steuerklasse VI (Zweitjob / Nebenberuf)",
};

export default function LongTailSalaryPage({ params }: PageProps) {
  const amount = parseAmount(params.betrag);
  if (!amount) {
    notFound();
  }

  const formattedBrutto = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);
  
  // Calculate across all 6 Steuerklassen for 2026
  const resultsAllSK = ([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => {
    const res = calculateNetto({
      bruttoMonat: amount,
      jahr: 2026,
      verheiratet: sk === 3 || sk === 4 || sk === 5,
      kinderlosUeber23: true,
      kirche: false,
      steuerklasse: sk,
    });
    return { sk, res };
  });

  const sk1Res = resultsAllSK[0].res;

  // Comparison between tax years 2026 vs 2027
  const comparisonYears = ([2026, 2027] as Steuerjahr[]).map((yr) => {
    const resSK1 = calculateNetto({ bruttoMonat: amount, jahr: yr, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 });
    const resSK3 = calculateNetto({ bruttoMonat: amount, jahr: yr, verheiratet: true, kinderlosUeber23: true, kirche: false, steuerklasse: 3 });
    const resSK5 = calculateNetto({ bruttoMonat: amount, jahr: yr, verheiratet: true, kinderlosUeber23: true, kirche: false, steuerklasse: 5 });
    return { yr, resSK1, resSK3, resSK5 };
  });

  // Unique German context from wage-stats
  const context = getWagePercentileContext(amount);

  // Amount-derived figures — make every page numerically unique (reduces templating
  // between neighbouring salary pages and adds genuinely useful data).
  const STUNDEN_PRO_MONAT = 173.33; // 40h-Woche
  const bruttoStunde = amount / STUNDEN_PRO_MONAT;
  const nettoStunde = sk1Res.nettoMonat / STUNDEN_PRO_MONAT;
  const nettoQuote = (sk1Res.nettoMonat / amount) * 100;
  const abzugQuote = 100 - nettoQuote;
  const diffMedian = amount - WAGE_STATS_2026.medianGrossMonthly;
  const diffSchnitt = amount - WAGE_STATS_2026.averageGrossMonthly;
  const eur0 = (n: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.abs(n));
  const medianText = diffMedian >= 0
    ? `${eur0(diffMedian)} über dem deutschen Medianlohn`
    : `${eur0(diffMedian)} unter dem deutschen Medianlohn`;
  const schnittText = diffSchnitt >= 0
    ? `${eur0(diffSchnitt)} über dem Durchschnittsgehalt`
    : `${eur0(diffSchnitt)} unter dem Durchschnittsgehalt`;

  // Neighboring amounts for internal linking
  const prevAmount = amount > 1500 ? amount - 100 : null;
  const nextAmount = amount < 15000 ? amount + 100 : null;

  // Relevant blog post recommendation (published article — verified slug).
  const blogLink = amount >= 5800
    ? { slug: "brutto-netto-rechner-2026-mindestlohn-2027", title: "Beitragsbemessungsgrenzen, Steuerklassen & Netto-Beispiele 2026/2027" }
    : { slug: "brutto-netto-rechner-2026-mindestlohn-2027", title: "Mindestlohn 2027, Steuerklassen & konkrete Brutto-Netto-Beispiele" };

  // Related salary pages for internal linking — nearby amounts (±100 / ±500 /
  // ±1000) within the generated 1.500–10.000 € range, excluding the current one.
  // Only amounts that are multiples of 100 have a real page, so the filter keeps
  // us from linking to non-existent routes.
  const relatedAmounts = Array.from(
    new Set([
      amount - 500, amount - 100, amount + 100, amount + 500,
      amount - 1000, amount + 1000,
    ])
  )
    .filter((a) => a >= 1500 && a <= 10000 && a !== amount && a % 100 === 0)
    .sort((a, b) => a - b)
    .slice(0, 6);

  // Amount-specific FAQs (visible + FAQPage schema below).
  const nf = (n: number) => new Intl.NumberFormat("de-DE").format(n);
  const sk3Res = resultsAllSK.find((r) => r.sk === 3)!.res;
  const salaryFaqs = [
    {
      q: `Wie viel sind ${nf(amount)} Euro brutto in netto?`,
      a: `In Steuerklasse I (ledig, ohne Kirchensteuer) bleiben von ${nf(amount)} € brutto rund ${formatEUR(sk1Res.nettoMonat)} netto im Monat, also etwa ${formatEUR(sk1Res.nettoJahr)} im Jahr (2026). Der genaue Betrag hängt von Steuerklasse, Bundesland, Kirchensteuer und Freibeträgen ab.`,
    },
    {
      q: `Wie viel netto sind ${nf(amount)} € brutto in Steuerklasse 3?`,
      a: `In Steuerklasse III bleiben von ${nf(amount)} € brutto rund ${formatEUR(sk3Res.nettoMonat)} netto im Monat – etwa ${formatEUR(sk3Res.nettoMonat - sk1Res.nettoMonat)} mehr als in Steuerklasse I. Steuerklasse III lohnt sich für Verheiratete mit deutlich höherem Einkommen als der Partner.`,
    },
    {
      q: `Wie hoch sind die Abzüge bei ${nf(amount)} € brutto?`,
      a: `Von ${nf(amount)} € brutto gehen in Steuerklasse I rund ${formatEUR(sk1Res.steuer.summeMonat)} Steuern und ${formatEUR(sk1Res.sv.summeMonat)} Sozialabgaben ab. Die Netto-Quote liegt bei etwa ${nettoQuote.toFixed(1).replace(".", ",")} %.`,
    },
    {
      q: `Was sind ${nf(amount)} € brutto im Jahr?`,
      a: `${nf(amount)} € brutto im Monat entsprechen ${formatEUR(amount * 12)} brutto im Jahr. Nach Steuern und Sozialabgaben bleiben davon in Steuerklasse I rund ${formatEUR(sk1Res.nettoJahr)} netto im Jahr (2026, unverbindlich).`,
    },
  ];

  // Structured Data — BreadcrumbList + WebPage (isPartOf)
  const canonicalUrl = `https://bruttonettocalculator.com/rechner/${amount}-euro-brutto-netto`;
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://bruttonettocalculator.com" },
          { "@type": "ListItem", "position": 2, "name": "Rechner", "item": "https://bruttonettocalculator.com/#rechner" },
          { "@type": "ListItem", "position": 3, "name": `${formattedBrutto} Brutto Netto`, "item": canonicalUrl },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": `${formattedBrutto} Euro brutto in netto 2026`,
        "description": `${formattedBrutto} € brutto ergeben in Steuerklasse I ca. ${formatEUR(sk1Res.nettoMonat)} netto im Monat (2026).`,
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
        <span className="text-black/80">{formattedBrutto} Brutto in Netto</span>
      </div>

      {/* Hero Section */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <CalcIcon size={14} /> Berechnung nach § 32a EStG
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-[#16181D] mb-4 tracking-tight leading-tight">
          <span className="text-gradient-accent">{formattedBrutto} Euro</span> brutto in netto: Berechnung 2026
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-4xl leading-relaxed mb-6">
          Wieviel bleibt von {formattedBrutto} Brutto monatlich übrig? In Steuerklasse 1 (ledig, ohne Kirchensteuer)
          beträgt Ihr Nettogehalt im Jahr 2026 rund <strong className="text-[#E60A1C] font-extrabold bg-[#E60A1C]/10 px-2 py-0.5 rounded border border-[#E60A1C]/40">{formatEUR(sk1Res.nettoMonat)}</strong> im Monat
          ({formatEUR(sk1Res.nettoJahr)} im Jahr). Hier finden Sie alle 6 Steuerklassen im Vergleich und die detaillierten Abzüge.
        </p>
        <ReviewerByline />
      </div>

      {/* Ad — right below the hero */}
      <AdUnit placement="content" className="!my-0 !mb-12 !px-0" />

      {/* Unique Destatis Percentile & Wage Context Block */}
      <div className="mb-14 bg-gradient-to-br from-[#F1F3F5] via-[#FFFFFF] to-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#E60A1C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-black/[0.08] pb-4">
          <div className="flex items-center gap-2 text-[#E60A1C] font-bold text-sm sm:text-base">
            <BarChart3 size={20} />
            <span>Destatis Einordnung & Lohngefüge</span>
          </div>
          <span className="bg-black/[0.05] border border-black/[0.10] px-3 py-1 rounded-full text-xs font-mono font-semibold text-black/90">
            {context.badgeText}
          </span>
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[#16181D] mb-3">
          {context.headline}
        </h2>
        <p className="text-base sm:text-lg text-black/85 leading-relaxed mb-4">
          {context.summary}
        </p>
        <p className="text-sm sm:text-base text-black/70 leading-relaxed bg-black/[0.04] p-4 sm:p-5 rounded-2xl border border-black/[0.05]">
          {context.detail}
        </p>
        <div className="mt-4 text-xs text-black/50 flex items-center gap-1.5 font-mono">
          <Building2 size={13} className="text-[#E60A1C]" /> Quelle: {WAGE_STATS_2026.source}
        </div>
      </div>

      {/* Amount-specific figures — unique per page */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          {formattedBrutto} Brutto in Zahlen
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6">
          Konkrete Kennzahlen für ein Bruttogehalt von {formattedBrutto} im Monat (Steuerklasse I, 2026).
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Netto / Monat", value: formatEUR(sk1Res.nettoMonat), accent: true },
            { label: "Netto / Jahr", value: formatEUR(sk1Res.nettoJahr) },
            { label: "Netto-Quote", value: `${nettoQuote.toFixed(1).replace(".", ",")} %` },
            { label: "Abzüge gesamt", value: `${abzugQuote.toFixed(1).replace(".", ",")} %` },
            { label: "Brutto / Stunde", value: formatEUR(bruttoStunde) },
            { label: "Netto / Stunde", value: formatEUR(nettoStunde) },
            { label: "Brutto / Jahr", value: formatEUR(amount * 12) },
            { label: "Netto / Tag", value: formatEUR(sk1Res.nettoMonat / 21.7) },
          ].map((k) => (
            <div key={k.label} className={`rounded-2xl border p-4 sm:p-5 ${k.accent ? "bg-[#E60A1C]/10 border-[#E60A1C]/40" : "bg-[#FFFFFF] border-black/[0.08]"}`}>
              <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-1.5">{k.label}</div>
              <div className={`font-mono font-extrabold text-lg sm:text-xl ${k.accent ? "text-[#E60A1C]" : "text-[#16181D]"}`}>{k.value}</div>
            </div>
          ))}
        </div>
        <p className="text-sm sm:text-base text-black/75 leading-relaxed mt-6 bg-black/[0.04] border border-black/[0.08] rounded-2xl p-4 sm:p-5">
          Ein Bruttogehalt von <strong className="text-[#16181D]">{formattedBrutto}</strong> im Monat liegt{" "}
          <strong className="text-[#16181D]">{medianText}</strong> ({formatEUR(WAGE_STATS_2026.medianGrossMonthly)}) und{" "}
          <strong className="text-[#16181D]">{schnittText}</strong> ({formatEUR(WAGE_STATS_2026.averageGrossMonthly)}) in Deutschland.
          Bei einer 40-Stunden-Woche entspricht das einem Brutto-Stundenlohn von rund{" "}
          <strong className="text-[#16181D]">{formatEUR(bruttoStunde)}</strong> — nach Steuern und Sozialabgaben bleiben davon in
          Steuerklasse I etwa <strong className="text-[#16181D]">{formatEUR(nettoStunde)}</strong> netto pro Stunde.
        </p>
      </div>

      {/* Table 1: All 6 Steuerklassen Comparison */}
      <div className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D]">
              {formattedBrutto}: Alle 6 Steuerklassen im Vergleich
            </h2>
            <p className="text-sm sm:text-base text-black/70 mt-1">
              Monatliche Netto-Auswertung für das Steuerjahr 2026 (ohne Kirchensteuer, kinderlos ab 23 Jahren).
            </p>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Steuerklasse</th>
                <th className="py-4 px-5 text-right">Brutto / Mon.</th>
                <th className="py-4 px-5 text-right">Lohnsteuer</th>
                <th className="py-4 px-5 text-right">Sozialabgaben</th>
                <th className="py-4 px-5 text-right text-[#16181D] font-bold">Netto / Mon.</th>
                <th className="py-4 px-5 text-right">Differenz zu SK I</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {resultsAllSK.map(({ sk, res }) => {
                const diff = res.nettoMonat - sk1Res.nettoMonat;
                const isSK1 = sk === 1;
                return (
                  <tr key={sk} className={`hover:bg-black/[0.04] transition-colors ${isSK1 ? "bg-[#E60A1C]/5 font-semibold" : ""}`}>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${isSK1 ? "bg-[#E60A1C] text-white" : "bg-black/[0.05] text-black/80"}`}>
                          {sk}
                        </span>
                        <span className="text-[#16181D]">{SK_NAMES[sk]}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right text-black/80 font-mono">{formatEUR(res.bruttoMonat)}</td>
                    <td className="py-4 px-5 text-right text-rose-600 font-mono">-{formatEUR(res.steuer.summeMonat)}</td>
                    <td className="py-4 px-5 text-right text-amber-600 font-mono">-{formatEUR(res.sv.summeMonat)}</td>
                    <td className="py-4 px-5 text-right text-[#16181D] font-bold font-mono text-base bg-black/[0.04]">{formatEUR(res.nettoMonat)}</td>
                    <td className="py-4 px-5 text-right font-mono text-sm">
                      {isSK1 ? (
                        <span className="text-black/40">Basis</span>
                      ) : diff > 0 ? (
                        <span className="text-emerald-600 font-bold">+{formatEUR(diff)}</span>
                      ) : diff < 0 ? (
                        <span className="text-rose-600 font-bold">{formatEUR(diff)}</span>
                      ) : (
                        <span className="text-black/40">±0,00 €</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ad: in-content after the main comparison table (high viewability / high CPM) */}
      <AdUnit placement="content" className="!my-0 !mb-16 !px-0" />

      {/* Table 2: 2-Year Tax Comparison (2026 vs 2027) */}
      <div className="mb-16">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-[#E60A1C]/10 border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-2">
            <Calendar size={13} /> Jahresvergleich
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D]">
            Vergleich Steuerjahr 2026 vs. 2027 (Vorschau)
          </h2>
          <p className="text-sm sm:text-base text-black/70 mt-1">
            Wie sich das Nettogehalt von {formattedBrutto} im Zuge der geplanten Steuerentlastungen entwickelt.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {comparisonYears.map(({ yr, resSK1, resSK3, resSK5 }) => (
            <div key={yr} className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between border-b border-black/[0.08] pb-4 mb-5">
                <span className="font-display font-black text-2xl text-[#16181D]">Steuerjahr {yr}</span>
                <span className="text-xs font-mono uppercase bg-black/[0.05] px-3 py-1 rounded-full text-black/80 font-bold">
                  § 32a EStG
                </span>
              </div>
              <div className="space-y-4 text-sm sm:text-base">
                <div className="flex justify-between items-center p-3 rounded-xl bg-black/[0.04]">
                  <span className="text-black/80">Steuerklasse I (Ledig):</span>
                  <span className="font-mono font-bold text-[#16181D] text-lg">{formatEUR(resSK1.nettoMonat)} <span className="text-xs font-normal text-black/50">/ Mon.</span></span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-black/[0.04]">
                  <span className="text-black/80">Steuerklasse III (Verheiratet):</span>
                  <span className="font-mono font-bold text-emerald-600 text-lg">{formatEUR(resSK3.nettoMonat)} <span className="text-xs font-normal text-black/50">/ Mon.</span></span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-black/[0.04]">
                  <span className="text-black/80">Steuerklasse V (Zweitverdiener):</span>
                  <span className="font-mono font-bold text-rose-600 text-lg">{formatEUR(resSK5.nettoMonat)} <span className="text-xs font-normal text-black/50">/ Mon.</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Calculator Pre-filled */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
            Interaktiver Gehaltsrechner für {formattedBrutto}
          </h2>
          <p className="text-black/70 text-sm sm:text-base">
            Passen Sie Kirchensteuer, Bundesland, Kinderfreibeträge und Steuerjahr hier direkt interaktiv an:
          </p>
        </div>
        <Calculator initialBrutto={amount} initialJahr={2026} initialSk={1} deepLink={false} />
      </div>

      {/* FAQ — amount-specific (visible + FAQPage schema) */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Häufige Fragen zu {formattedBrutto} brutto
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

      {/* Ad: after the interactive calculator (deep-scroll, high engagement) */}
      <AdUnit placement="content" className="!my-0 !mb-16 !px-0" />

      {/* Internal Linking Footer Block */}
      <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-8 shadow-xl">
        <h3 className="font-display font-bold text-xl text-[#16181D] mb-6 flex items-center gap-2">
          <Sparkles className="text-[#E60A1C]" size={20} /> Weiterführende Gehaltsrechner & Ratgeber
        </h3>
        
        <div className="grid sm:grid-cols-3 gap-6">
          {/* Neighboring 1 */}
          <div className="bg-[#F1F3F5] border border-black/[0.08] rounded-2xl p-5 hover:border-[#E60A1C]/50 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-black/40 uppercase block mb-1">Nächstkleinerer Betrag</span>
              <h4 className="font-bold text-[#16181D] text-lg mb-2">
                {prevAmount ? `${new Intl.NumberFormat("de-DE").format(prevAmount)} € Brutto Netto` : "Startseite Gehaltsrechner"}
              </h4>
            </div>
            {prevAmount ? (
              <Link
                href={`/rechner/${prevAmount}-euro-brutto-netto`}
                className="text-xs font-bold text-[#E60A1C] hover:underline inline-flex items-center gap-1 mt-4"
              >
                <ArrowLeft size={14} /> Zu {prevAmount} € wechseln
              </Link>
            ) : (
              <Link href="/" className="text-xs font-bold text-[#E60A1C] hover:underline inline-flex items-center gap-1 mt-4">
                <ArrowLeft size={14} /> Zur Startseite
              </Link>
            )}
          </div>

          {/* Pre-filled Main Calculator Link */}
          <div className="bg-[#F1F3F5] border border-black/[0.08] rounded-2xl p-5 hover:border-[#E60A1C]/50 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#E60A1C] uppercase block mb-1">Hauptrechner</span>
              <h4 className="font-bold text-[#16181D] text-lg mb-2">
                Erweiterte Parameter anpassen
              </h4>
            </div>
            <Link
              href={`/?brutto=${amount}&jahr=2026&sk=1#rechner`}
              className="text-xs font-bold text-[#16181D] hover:underline inline-flex items-center gap-1 mt-4 bg-black/[0.05] px-3 py-2 rounded-xl border border-black/[0.08]"
            >
              Hauptrechner öffnen &rarr;
            </Link>
          </div>

          {/* Neighboring 2 */}
          <div className="bg-[#F1F3F5] border border-black/[0.08] rounded-2xl p-5 hover:border-[#E60A1C]/50 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-black/40 uppercase block mb-1">Nächstgrößerer Betrag</span>
              <h4 className="font-bold text-[#16181D] text-lg mb-2">
                {nextAmount ? `${new Intl.NumberFormat("de-DE").format(nextAmount)} € Brutto Netto` : "Lexikon & FAQ"}
              </h4>
            </div>
            {nextAmount ? (
              <Link
                href={`/rechner/${nextAmount}-euro-brutto-netto`}
                className="text-xs font-bold text-[#E60A1C] hover:underline inline-flex items-center gap-1 mt-4"
              >
                Zu {nextAmount} € wechseln <ArrowRight size={14} />
              </Link>
            ) : (
              <Link href="/lexikon" className="text-xs font-bold text-[#E60A1C] hover:underline inline-flex items-center gap-1 mt-4">
                Zum Lexikon <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* Blog link */}
        <div className="mt-6 pt-6 border-t border-black/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E60A1C]/15 border border-[#E60A1C]/30 flex items-center justify-center text-[#E60A1C] font-bold shrink-0">
              <HelpCircle size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#16181D]">Empfohlener Ratgeber-Artikel</div>
              <div className="text-xs text-black/60">{blogLink.title}</div>
            </div>
          </div>
          <Link
            href={`/blog/${blogLink.slug}`}
            className="text-xs font-mono uppercase tracking-wider bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] px-4 py-2.5 rounded-xl transition-colors shrink-0"
          >
            Artikel lesen &rarr;
          </Link>
        </div>

        {/* Related salary pages + salary-hub link */}
        <div className="mt-6 pt-6 border-t border-black/[0.08]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h4 className="font-bold text-sm text-[#16181D] flex items-center gap-2">
              <BarChart3 size={16} className="text-[#E60A1C]" /> Ähnliche Gehälter im Vergleich
            </h4>
            <Link
              href="/brutto-netto-gehaltstabelle"
              className="text-xs font-bold text-[#E60A1C] hover:underline inline-flex items-center gap-1"
            >
              Alle Beträge in der Brutto-Netto-Gehaltstabelle <ArrowRight size={13} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedAmounts.map((a) => (
              <Link
                key={a}
                href={`/rechner/${a}-euro-brutto-netto`}
                className="text-xs font-semibold bg-[#F1F3F5] hover:bg-[#FFFFFF] border border-black/[0.08] hover:border-[#E60A1C]/50 text-[#16181D] px-3.5 py-2 rounded-xl transition-all"
              >
                {new Intl.NumberFormat("de-DE").format(a)} Euro brutto in netto
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
