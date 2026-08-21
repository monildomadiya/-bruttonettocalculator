import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Landmark, Info, ArrowRight } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import {
  TVOED_VKA_2026,
  belegteStufen,
  spanne,
  ENTGELTTABELLE_STAND,
  ENTGELTTABELLE_STAND_ISO,
  GUELTIG_AB,
  GUELTIG_BIS,
  TARIFERHOEHUNG_PROZENT,
} from "@/data/tvoed";
import ReviewerByline from "@/components/ReviewerByline";

/**
 * TVöD-Hub: komplette Entgelttabelle 2026 plus Netto.
 *
 * Zielt auf "tvöd tabelle 2026" und "tvöd entgelttabelle 2026" — beide standen
 * in den Rising Searches, und die Seite hatte dazu bisher nichts. Der
 * Unterschied zum Wettbewerb ist die Netto-Spalte: Bruttotabellen gibt es
 * überall, die Netto-Frage beantwortet dort niemand.
 */

const BASE = "https://bruttonettocalculator.com";
const CANONICAL = `${BASE}/tvoed-rechner`;

export const metadata: Metadata = {
  title: "TVöD Entgelttabelle 2026: alle Gruppen, Stufen & Netto",
  description:
    `TVöD-VKA Entgelttabelle ab ${GUELTIG_AB} (+${TARIFERHOEHUNG_PROZENT.toString().replace(".", ",")} %): alle Entgeltgruppen E 1 bis E 15Ü mit allen Stufen — und was davon netto bleibt.`,
  keywords: [
    "tvöd tabelle 2026",
    "tvöd entgelttabelle 2026",
    "tvöd rechner",
    "tvöd netto rechner",
    "tvöd gehalt 2026",
    "entgeltgruppe tvöd",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "TVöD Entgelttabelle 2026 — mit Netto je Entgeltgruppe",
    description:
      "Alle TVöD-VKA Entgeltgruppen und Stufen ab 1. Mai 2026, jeweils mit dem Netto in Steuerklasse I und III.",
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
    images: [`${BASE}/og-image.png`],
  },
  twitter: {
    card: "summary",
    title: "TVöD Entgelttabelle 2026 mit Netto",
    description: "Alle Gruppen und Stufen ab 1. Mai 2026 — brutto und netto.",
  },
};

export default function TvoedHubPage() {
  const { min, max } = spanne();

  const zeilen = TVOED_VKA_2026.map((g) => {
    const st = belegteStufen(g);
    const bruttoMin = st[0][1];
    const bruttoMax = st[st.length - 1][1];
    return {
      ...g,
      bruttoMin,
      bruttoMax,
      nettoMin: calculateNetto({
        bruttoMonat: bruttoMin, jahr: 2026, verheiratet: false,
        kinderlosUeber23: false, kirche: false, steuerklasse: 1,
      }).nettoMonat,
      nettoMax: calculateNetto({
        bruttoMonat: bruttoMax, jahr: 2026, verheiratet: false,
        kinderlosUeber23: false, kirche: false, steuerklasse: 1,
      }).nettoMonat,
    };
  });

  const faqs = [
    {
      q: "Wie hoch ist die TVöD-Erhöhung 2026?",
      a: `Zum ${GUELTIG_AB} steigen die Tabellenentgelte um ${TARIFERHOEHUNG_PROZENT.toString().replace(".", ",")} %. Das ist die zweite Stufe eines zweistufigen Tarifabschlusses — zum 1. April 2025 hatte bereits eine Erhöhung um 3,0 % (mindestens 110 €) gewirkt. Die neue Tabelle gilt bis zum ${GUELTIG_BIS}.`,
    },
    {
      q: "Was verdient man im TVöD 2026?",
      a: `Die Spanne der TVöD-VKA-Tabelle reicht von ${formatEUR(min)} in der untersten Gruppe und Stufe bis ${formatEUR(max)} in der höchsten. Innerhalb einer Entgeltgruppe steigt das Entgelt mit den Stufen, die sich nach der Zeit ununterbrochener Tätigkeit richten.`,
    },
    {
      q: "Was bleibt vom TVöD-Gehalt netto?",
      a: "Je nach Steuerklasse bleiben grob 60 bis 70 % des Bruttos. In den Tabellen auf dieser Seite steht das Netto für jede Gruppe direkt neben dem Brutto — gerechnet nach § 32a EStG mit allen Sozialabgaben, ohne Kirchensteuer und mit dem durchschnittlichen Krankenkassen-Zusatzbeitrag.",
    },
    {
      q: "Gilt diese Tabelle für alle im öffentlichen Dienst?",
      a: "Nein. Dies ist der TVöD-VKA für Beschäftigte bei Kommunen und kommunalen Arbeitgebern. Für den Bund gilt der TVöD Bund, für die Länder der TV-L, und der Sozial- und Erziehungsdienst (S-Gruppen) sowie die Pflege (P-Gruppen) haben eigene Tabellen mit abweichenden Beträgen.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "TVöD-Rechner", item: CANONICAL },
    ],
  };
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": CANONICAL,
    url: CANONICAL,
    name: "TVöD Entgelttabelle 2026",
    inLanguage: "de-DE",
    dateModified: ENTGELTTABELLE_STAND_ISO,
    isPartOf: { "@id": `${BASE}/#website` },
    publisher: { "@id": `${BASE}/#organization` },
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-5 pt-8 pb-16">
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-black/50 mb-6">
          <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
          <ChevronRight size={14} />
          <span className="text-[#16181D] font-medium">TVöD-Rechner</span>
        </nav>

        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E60A1C]/10 border border-[#E60A1C]/25 text-[#E60A1C] text-xs font-bold mb-4">
            <Landmark size={14} />
            TVöD-VKA · +{TARIFERHOEHUNG_PROZENT.toString().replace(".", ",")} % ab {GUELTIG_AB}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#16181D] leading-tight mb-3">
            TVöD Entgelttabelle 2026 — mit Netto je Entgeltgruppe
          </h1>
          <p className="text-base sm:text-lg text-black/70 leading-relaxed max-w-3xl">
            Alle Entgeltgruppen von E 1 bis E 15Ü, gültig vom {GUELTIG_AB} bis {GUELTIG_BIS}. Bruttotabellen gibt es
            viele — hier steht daneben, was tatsächlich netto übrig bleibt.
          </p>
          <div className="mt-4">
            <ReviewerByline />
          </div>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-2">Alle Entgeltgruppen im Überblick</h2>
          <p className="text-sm text-black/60 mb-5 max-w-3xl">
            Von der niedrigsten bis zur höchsten Stufe der jeweiligen Gruppe. Netto in Steuerklasse I, ohne
            Kirchensteuer, mit Kindern. Für alle Stufen einer Gruppe auf den Namen klicken.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-black/[0.08] bg-white shadow-sm">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-black/[0.03] text-left">
                  <th className="px-4 py-3 font-bold text-[#16181D]">Entgeltgruppe</th>
                  <th className="px-4 py-3 font-bold text-[#16181D] text-right">Brutto von</th>
                  <th className="px-4 py-3 font-bold text-[#16181D] text-right">Brutto bis</th>
                  <th className="px-4 py-3 font-bold text-[#16181D] text-right">Netto von</th>
                  <th className="px-4 py-3 font-bold text-[#16181D] text-right">Netto bis</th>
                </tr>
              </thead>
              <tbody>
                {zeilen.map((z) => (
                  <tr key={z.slug} className="border-t border-black/[0.06] hover:bg-black/[0.02] transition-colors">
                    <th scope="row" className="px-4 py-3 text-left font-semibold">
                      <Link href={`/tvoed/${z.slug}`} className="text-[#16181D] hover:text-[#E60A1C] hover:underline transition-colors">
                        TVöD {z.label}
                      </Link>
                    </th>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-[#16181D]">{formatEUR(z.bruttoMin)}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-[#16181D]">{formatEUR(z.bruttoMax)}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-black/70">{formatEUR(z.nettoMin)}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-emerald-600 font-semibold">{formatEUR(z.nettoMax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-2 text-xs text-black/45 mt-3">
            <Info size={13} className="flex-shrink-0 mt-0.5" />
            <span>
              Tabellenentgelte TVöD-VKA, Vollzeit, ohne Zulagen und Jahressonderzahlung. Stand {ENTGELTTABELLE_STAND},
              gegen zwei unabhängige Quellen geprüft. Keine verbindliche Eingruppierung — maßgeblich ist Ihr Arbeitsvertrag.
            </span>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-4">Eigenes Gehalt durchrechnen</h2>
          <p className="text-sm text-black/70 mb-5 max-w-3xl">
            Ihr Tabellenentgelt weicht ab, weil Zulagen, Teilzeit oder eine andere Steuerklasse dazukommen? Tragen Sie
            den Betrag direkt in den Hauptrechner ein.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="inline-flex items-center gap-2 bg-[#E60A1C] text-white font-bold text-sm px-5 py-3 rounded-2xl hover:bg-[#c4081a] transition-colors">
              Zum Brutto-Netto-Rechner
              <ArrowRight size={16} />
            </Link>
            <Link href="/teilzeitrechner" className="inline-flex items-center gap-2 bg-white border border-black/[0.10] text-[#16181D] font-bold text-sm px-5 py-3 rounded-2xl hover:border-[#E60A1C]/40 transition-colors">
              Teilzeit berechnen
            </Link>
            <Link href="/brutto-netto-rechner-krankenkasse" className="inline-flex items-center gap-2 bg-white border border-black/[0.10] text-[#16181D] font-bold text-sm px-5 py-3 rounded-2xl hover:border-[#E60A1C]/40 transition-colors">
              Mit eigener Krankenkasse
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-5">Häufige Fragen zum TVöD 2026</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group bg-white border border-black/[0.08] rounded-2xl overflow-hidden">
                <summary className="cursor-pointer list-none px-4 sm:px-5 py-4 font-bold text-[#16181D] text-sm sm:text-base flex items-center justify-between gap-3 hover:bg-black/[0.02]">
                  {f.q}
                  <ChevronRight size={18} className="flex-shrink-0 text-black/35 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-4 sm:px-5 pb-4 text-sm text-black/70 leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
