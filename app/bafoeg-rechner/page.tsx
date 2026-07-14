import type { Metadata } from "next";
import BafoegRechner from "./BafoegRechner";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "BAföG-Rechner 2026 — Anspruch & Höhe berechnen (Studierende)",
  description:
    "BAföG-Rechner 2026: Berechnen Sie Ihren voraussichtlichen BAföG-Anspruch aus Bedarfssatz, Wohnsituation, eigenem Einkommen und dem Einkommen der Eltern. Kostenlose Schätzung mit aktuellen Bedarfssätzen.",
  keywords: [
    "bafög rechner",
    "bafög rechner 2026",
    "bafög berechnen",
    "bafög höhe",
    "bafög anspruch",
    "bafög höchstsatz 2026",
    "wie viel bafög bekomme ich",
    "bafög studierende",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/bafoeg-rechner" },
  openGraph: {
    title: "BAföG-Rechner 2026 — Anspruch & Höhe berechnen",
    description:
      "BAföG-Anspruch 2026 schätzen: Bedarfssatz, Wohnsituation, eigenes Einkommen und Elterneinkommen. Kostenlos & mit aktuellen Bedarfssätzen.",
    url: "https://bruttonettocalculator.com/bafoeg-rechner",
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
      name: "Wie hoch ist der BAföG-Höchstsatz 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der BAföG-Höchstsatz liegt bei rund 992 € im Monat: 475 € Grundbedarf, 380 € Wohnzuschlag (eigene Wohnung) und 140 € Kranken-/Pflegeversicherungszuschlag. Wer bei den Eltern wohnt, erhält nur 59 € Wohnzuschlag.",
      },
    },
    {
      "@type": "Question",
      name: "Wird das Einkommen der Eltern beim BAföG angerechnet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. Vom Nettoeinkommen der Eltern wird ein Freibetrag abgezogen (bei verheirateten Eltern rund 2.540 €/Monat, je weiterem Kind +770 €). Der übersteigende Betrag mindert den BAföG-Anspruch anteilig.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "BAföG-Rechner", item: "https://bruttonettocalculator.com/bafoeg-rechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BAföG-Rechner 2026",
  url: "https://bruttonettocalculator.com/bafoeg-rechner",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  description: "Kostenloser BAföG-Rechner 2026 — Anspruch aus Bedarfssatz, eigenem Einkommen und Elterneinkommen schätzen.",
};

export default function BafoegRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BafoegRechner />
      <AdUnit placement="content" />
    </>
  );
}
