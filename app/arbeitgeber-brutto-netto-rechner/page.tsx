import type { Metadata } from "next";
import ArbeitgeberRechner from "./ArbeitgeberRechner";
import ArbeitgeberContent from "./ArbeitgeberContent";
import RelatedCalculators from "@/components/RelatedCalculators";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Arbeitgeberrechner 2026: Lohnkosten berechnen",
  description:
    "Berechnen Sie die tatsächlichen Arbeitgeberkosten 2026 inklusive Bruttogehalt, Sozialabgaben, Umlagen und Arbeitgeberanteilen.",
  keywords: [
    "arbeitgeber brutto netto rechner",
    "brutto netto arbeitgeber rechner",
    "brutto netto arbeitgeber",
    "netto brutto arbeitgeber",
    "arbeitgeberrechner",
    "arbeitgeberbrutto rechner",
    "arbeitgeberanteil rechner",
    "brutto netto arbeitgeberanteil rechner",
    "netto brutto rechner arbeitgeberanteil",
    "gehaltsrechner arbeitgeber",
    "brutto netto gehaltsrechner arbeitgeber",
    "arbeitgeberkosten rechner",
    "arbeitgeber brutto netto rechner 2026",
    "personalkosten rechner",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/arbeitgeber-brutto-netto-rechner" },
  openGraph: {
    title: "Arbeitgeber Brutto-Netto-Rechner 2026 — Arbeitgeberkosten berechnen",
    description:
      "Arbeitgeberanteil, Arbeitgeberbrutto und Personalkosten berechnen — plus Nettogehalt des Arbeitnehmers. Kostenloser Rechner für 2026.",
    url: "https://bruttonettocalculator.com/arbeitgeber-brutto-netto-rechner",
    locale: "de_DE",
    type: "website",
    siteName: "BruttoNettoCalculator.com",
  },
};

const faqs = [
  {
    q: "Was ist der Arbeitgeberanteil und wie hoch ist er?",
    a: "Der Arbeitgeberanteil ist der Teil der Sozialversicherungsbeiträge, den der Arbeitgeber zusätzlich zum Bruttogehalt trägt: rund 9,3 % Rentenversicherung, 1,3 % Arbeitslosenversicherung, ca. 8,75 % Krankenversicherung und 1,7 % Pflegeversicherung — in Summe etwa 21 % des Bruttogehalts, zzgl. Umlagen U1/U2/U3.",
  },
  {
    q: "Was bedeutet Arbeitgeberbrutto?",
    a: "Das Arbeitgeberbrutto ist die Summe aus dem Bruttogehalt des Arbeitnehmers und dem Arbeitgeberanteil zur Sozialversicherung. Es zeigt die tatsächlichen Kosten eines Mitarbeiters für den Betrieb.",
  },
  {
    q: "Warum kostet ein Mitarbeiter mehr als sein Bruttogehalt?",
    a: "Weil der Arbeitgeber auf das Bruttogehalt seinen paritätischen Anteil zur Renten-, Kranken-, Pflege- und Arbeitslosenversicherung zahlt sowie die Umlagen U1, U2 und U3. Aus 4.000 € Brutto werden so schnell rund 4.900 € Gesamtkosten.",
  },
  {
    q: "Fällt der Arbeitgeberanteil bei jedem Gehalt gleich hoch aus?",
    a: "Nein. Bis zur Beitragsbemessungsgrenze steigt der Arbeitgeberanteil mit dem Gehalt. Oberhalb der Grenzen (2026: 69.750 € in KV/PV, 101.400 € in RV/ALV) bleibt der Beitrag konstant.",
  },
  {
    q: "Sind die Umlagen U1, U2 und U3 im Ergebnis enthalten?",
    a: "Der Rechner weist die Umlagen als geschätzte Zusatzkosten (ca. 1,9 %) separat aus, da sie je nach Krankenkasse und Betrieb schwanken. Das reine Arbeitgeberbrutto wird getrennt angezeigt.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Arbeitgeber Brutto-Netto-Rechner", item: "https://bruttonettocalculator.com/arbeitgeber-brutto-netto-rechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "Arbeitgeber Brutto-Netto-Rechner 2026",
  url: "https://bruttonettocalculator.com/arbeitgeber-brutto-netto-rechner",
  description:
    "Kostenloser Arbeitgeber-Brutto-Netto-Rechner für Deutschland — Arbeitgeberanteil, Arbeitgeberbrutto und Personalkosten sowie das Nettogehalt des Arbeitnehmers berechnen (2026).",
};

export default function ArbeitgeberRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ArbeitgeberRechner content={<ArbeitgeberContent />} />
      <RelatedCalculators
        links={[
          { href: "/", label: "Brutto-Netto-Rechner", desc: "Nettogehalt des Arbeitnehmers 2026" },
          { href: "/rechner/brutto-zu-netto", label: "Brutto zu Netto", desc: "Direkt vom Brutto zum Netto" },
          { href: "/rechner/netto-zu-brutto", label: "Netto zu Brutto", desc: "Für Gehaltsverhandlungen" },
          { href: "/stundenlohn-rechner", label: "Stundenlohnrechner", desc: "Stundenlohn aus dem Monatsgehalt" },
        ]}
      />
      <AdUnit placement="content" />
    </>
  );
}
