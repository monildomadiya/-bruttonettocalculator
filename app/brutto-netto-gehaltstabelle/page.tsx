import type { Metadata } from "next";
import Link from "next/link";
import { Calculator as CalcIcon, ChevronRight, ArrowRight, Table2 } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import { getCommonGrossSalaryAmounts } from "@/data/wage-stats";
import { SITE_URL, WEBSITE_ID } from "@/lib/seo";

export const revalidate = 0;

const CANONICAL = `${SITE_URL}/brutto-netto-gehaltstabelle`;

export const metadata: Metadata = {
  title: "Brutto-Netto-Tabelle 2026: Gehälter im Vergleich",
  description:
    "Brutto-Netto-Gehaltstabelle 2026: Nettogehalt für jeden Bruttobetrag von 1.500 € bis 10.000 € in Steuerklasse I — direkt zur Detailseite jedes Betrags.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Brutto-Netto-Tabelle 2026: Gehälter im Vergleich",
    description:
      "Nettogehalt für jeden Bruttobetrag von 1.500 € bis 10.000 € (Steuerklasse I, 2026) — mit Detailseite je Betrag.",
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

interface RangeGroup {
  label: string;
  from: number;
  to: number;
}

const GROUPS: RangeGroup[] = [
  { label: "1.500 – 2.900 €", from: 1500, to: 2900 },
  { label: "3.000 – 4.900 €", from: 3000, to: 4900 },
  { label: "5.000 – 6.900 €", from: 5000, to: 6900 },
  { label: "7.000 – 8.900 €", from: 7000, to: 8900 },
  { label: "9.000 – 10.000 €", from: 9000, to: 10000 },
];

function nettoSK1(brutto: number): number {
  return calculateNetto({
    bruttoMonat: brutto,
    jahr: 2026,
    verheiratet: false,
    kinderlosUeber23: true,
    kirche: false,
    steuerklasse: 1,
  }).nettoMonat;
}

export default function SalaryHubPage() {
  const amounts = getCommonGrossSalaryAmounts();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${CANONICAL}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Brutto-Netto-Gehaltstabelle", item: CANONICAL },
    ],
  };
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${CANONICAL}#webpage`,
    name: "Brutto-Netto-Gehaltstabelle 2026",
    url: CANONICAL,
    inLanguage: "de-DE",
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: { "@id": `${CANONICAL}#breadcrumb` },
  };

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-24 text-[#16181D] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Brutto-Netto-Gehaltstabelle</span>
      </nav>

      {/* Hero */}
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <Table2 size={14} /> Gehaltstabelle 2026
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
          Brutto-Netto-Gehaltstabelle <span className="text-gradient-accent">2026</span>
        </h1>
        <p className="text-lg sm:text-xl text-black/80 max-w-3xl leading-relaxed">
          Wie viel Netto bleibt von Ihrem Bruttogehalt? Diese Übersicht listet jeden Bruttobetrag von
          1.500 € bis 10.000 € mit dem monatlichen Nettogehalt in <strong>Steuerklasse I</strong> (ledig,
          ohne Kirchensteuer, Steuerjahr 2026). Klicken Sie auf einen Betrag für die vollständige Auswertung
          aller sechs Steuerklassen, Stundenlohn und Abzüge.
        </p>
      </header>

      {/* CTA to main calculator */}
      <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 shadow-lg">
        <div className="flex-1">
          <div className="font-bold text-[#16181D] text-lg mb-1">Individuelles Ergebnis gewünscht?</div>
          <p className="text-sm text-black/65">Bundesland, Kirchensteuer, Kinderfreibeträge und Steuerjahr frei anpassen.</p>
        </div>
        <Link
          href="/#rechner"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white text-sm whitespace-nowrap"
          style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)", boxShadow: "0 2px 8px rgba(230,10,28,0.18)" }}
        >
          <CalcIcon size={16} /> Zum Brutto-Netto-Rechner
        </Link>
      </div>

      {/* Range groups */}
      <div className="space-y-12">
        {GROUPS.map((group) => {
          const groupAmounts = amounts.filter((a) => a >= group.from && a <= group.to);
          return (
            <section key={group.label} aria-labelledby={`group-${group.from}`}>
              <h2
                id={`group-${group.from}`}
                className="font-display text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5 flex items-center gap-2"
              >
                <span className="w-1.5 h-6 rounded-full bg-[#E60A1C] inline-block" />
                Bruttogehalt {group.label}
              </h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {groupAmounts.map((amount) => (
                  <li key={amount}>
                    <Link
                      href={`/rechner/${amount}-euro-brutto-netto`}
                      className="group flex items-center justify-between gap-2 bg-[#FFFFFF] hover:bg-[#F1F3F5] border border-black/[0.10] hover:border-[#E60A1C]/50 rounded-2xl px-4 py-3.5 shadow-sm transition-all"
                    >
                      <span className="min-w-0">
                        <span className="block font-bold text-sm text-[#16181D] truncate">
                          {new Intl.NumberFormat("de-DE").format(amount)} Euro brutto in netto
                        </span>
                        <span className="block text-xs text-black/55 font-mono">
                          ≈ {formatEUR(nettoSK1(amount))} netto
                        </span>
                      </span>
                      <ArrowRight size={14} className="text-[#E60A1C] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {/* Footnote */}
      <p className="text-xs text-black/50 mt-12 leading-relaxed max-w-3xl">
        Nettowerte auf Basis der gesetzlichen Steuer- und Sozialversicherungswerte für 2026 (§ 32a EStG),
        vereinfacht für Steuerklasse I ohne Kirchensteuer. Es handelt sich um unverbindliche Näherungswerte und
        keine Steuerberatung. Für ein individuelles Ergebnis nutzen Sie den{" "}
        <Link href="/#rechner" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner</Link>.
      </p>
    </main>
  );
}
