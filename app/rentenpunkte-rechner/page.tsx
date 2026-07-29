import type { Metadata } from "next";
import RentenpunkteRechner from "./RentenpunkteRechner";

export const metadata: Metadata = {
  title: "Rentenpunkte-Rechner 2026 — Entgeltpunkte & Rente berechnen",
  description:
    "Rentenpunkte-Rechner 2026: Entgeltpunkte aus Ihrem Bruttogehalt und die spätere Monatsrente berechnen — mit aktuellem Rentenwert 42,52 € (ab Juli 2026) und Durchschnittsentgelt 51.944 €. Kostenlos & ohne Anmeldung.",
  keywords: [
    "rentenpunkte rechner",
    "entgeltpunkte berechnen",
    "rentenpunkte 2026",
    "wie viel ist ein rentenpunkt wert",
    "rentenwert 2026",
    "entgeltpunkte rente",
    "rentenpunkte berechnen",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/rentenpunkte-rechner" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Rentenpunkte-Rechner 2026 — Entgeltpunkte & Rente berechnen",
    description:
      "Entgeltpunkte aus dem Bruttogehalt und die spätere Monatsrente berechnen — mit Rentenwert 42,52 € (Juli 2026). Kostenlos.",
    url: "https://bruttonettocalculator.com/rentenpunkte-rechner",
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
      name: "Wie viel ist ein Rentenpunkt 2026 wert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ein Entgeltpunkt (Rentenpunkt) ist ab dem 1. Juli 2026 42,52 € monatliche Bruttorente wert. Zum 1. Juli 2026 sind die Renten um 4,24 % gestiegen (vorher 40,79 €). Der Wert gilt bundeseinheitlich in West und Ost.",
      },
    },
    {
      "@type": "Question",
      name: "Wie bekomme ich einen Entgeltpunkt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sie erhalten für ein Kalenderjahr genau einen Entgeltpunkt, wenn Ihr rentenversicherungspflichtiges Bruttoeinkommen dem Durchschnittsentgelt aller Versicherten entspricht. 2026 liegt dieses Durchschnittsentgelt vorläufig bei 51.944 € brutto im Jahr. Verdienen Sie mehr, gibt es anteilig mehr Punkte — maximal rund 1,95 pro Jahr.",
      },
    },
    {
      "@type": "Question",
      name: "Wie berechne ich meine spätere Rente aus Rentenpunkten?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ihre monatliche Bruttorente = Summe Ihrer Entgeltpunkte × aktueller Rentenwert (42,52 €) × Zugangsfaktor × Rentenartfaktor. Für die reguläre Altersrente sind Zugangs- und Rentenartfaktor 1,0. Von der Bruttorente gehen später noch Beiträge zur Kranken- und Pflegeversicherung sowie ggf. Steuern ab.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Rentenpunkte-Rechner", item: "https://bruttonettocalculator.com/rentenpunkte-rechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "Rentenpunkte-Rechner 2026 Deutschland",
  url: "https://bruttonettocalculator.com/rentenpunkte-rechner",
  description:
    "Kostenloser Rentenpunkte-Rechner — Entgeltpunkte aus dem Bruttogehalt und die spätere Monatsrente mit dem aktuellen Rentenwert (42,52 € ab Juli 2026) berechnen.",
};

export default function RentenpunkteRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <RentenpunkteRechner />
    </>
  );
}
