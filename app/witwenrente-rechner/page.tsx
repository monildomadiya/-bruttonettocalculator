import type { Metadata } from "next";
import WitwenrenteRechner from "./WitwenrenteRechner";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Witwenrente-Rechner 2026 — Höhe berechnen (55 % / 25 %)",
  description:
    "Witwenrente-Rechner 2026: Berechnen Sie die Höhe Ihrer großen (55 %) oder kleinen (25 %) Witwenrente inkl. Sterbevierteljahr und Einkommensanrechnung mit Freibetrag. Kostenlos & aktuell.",
  keywords: [
    "witwenrente berechnen",
    "witwenrente rechner",
    "witwenrente wie hoch",
    "wie hoch ist die witwenrente",
    "große witwenrente",
    "kleine witwenrente",
    "witwenrente 2026",
    "hinterbliebenenrente berechnen",
    "witwerrente rechner",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/witwenrente-rechner" },
  openGraph: {
    title: "Witwenrente-Rechner 2026 — Höhe berechnen (55 % / 25 %)",
    description:
      "Große (55 %) oder kleine (25 %) Witwenrente berechnen — inkl. Sterbevierteljahr und Einkommensanrechnung mit Freibetrag. Kostenlos für 2026.",
    url: "https://bruttonettocalculator.com/witwenrente-rechner",
    locale: "de_DE",
    type: "website",
    siteName: "BruttoNettoCalculator.com",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wie hoch ist die Witwenrente 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die große Witwenrente beträgt 55 % der Rente des verstorbenen Partners, die kleine Witwenrente 25 % (längstens 24 Monate). In den ersten drei Monaten (Sterbevierteljahr) wird die volle Rente (100 %) weitergezahlt.",
      },
    },
    {
      "@type": "Question",
      name: "Wird Einkommen auf die Witwenrente angerechnet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Eigenes Nettoeinkommen wird angerechnet, soweit es den Freibetrag von rund 1.076,86 € im Monat übersteigt (pro Kind ca. 228,42 € mehr). Vom übersteigenden Betrag werden 40 % angerechnet. Im Sterbevierteljahr erfolgt keine Anrechnung.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Witwenrente-Rechner", item: "https://bruttonettocalculator.com/witwenrente-rechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Witwenrente-Rechner 2026",
  url: "https://bruttonettocalculator.com/witwenrente-rechner",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
  },
  description: "Kostenloser Witwenrente-Rechner 2026 — große und kleine Witwenrente inkl. Sterbevierteljahr und Einkommensanrechnung.",
};

export default function WitwenrenteRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <WitwenrenteRechner />
      <AdUnit placement="content" />
    </>
  );
}
