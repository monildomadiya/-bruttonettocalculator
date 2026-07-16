import type { Metadata } from "next";
import FirmenwagenrechnerCalculator from "./FirmenwagenrechnerCalculator";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Firmenwagenrechner 2026 — Geldwerter Vorteil & 1%-Regelung",
  description:
    "Firmenwagenrechner & Dienstwagenrechner 2026: Geldwerten Vorteil nach der 1%-Regelung berechnen und direkt aufs Brutto-Netto-Gehalt anrechnen — inkl. Elektro-Sätze (0,25%/0,5%) und 0,03%-Zuschlag für den Arbeitsweg. Auch für 2025. Kostenlos & sofort.",
  keywords: [
    "Firmenwagenrechner",
    "Firmenwagenrechner 2026",
    "Dienstwagenrechner",
    "Dienstwagenrechner 2026",
    "dienstwagen versteuern",
    "dienstwagen 1 prozent regelung",
    "1%-Regelung",
    "1 Prozent Regelung Firmenwagen",
    "geldwerter Vorteil",
    "geldwerter Vorteil Dienstwagen",
    "brutto netto rechner geldwerter vorteil",
    "gehaltsrechner geldwerter vorteil",
    "gehaltsrechner mit auto",
    "gehaltsrechner mit firmenwagen",
    "gehaltsrechner 2026 mit firmenwagen",
    "brutto netto rechner firmenwagen",
    "brutto netto rechner mit firmenwagen",
    "brutto netto rechner 2026 mit firmenwagen",
    "brutto netto rechner 2025 mit firmenwagen",
    "brutto netto rechner mit firmenwagen 2025",
    "Firmenwagen versteuern",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/firmenwagenrechner" },
  openGraph: {
    title: "Firmenwagenrechner 2026 — Geldwerter Vorteil & 1%-Regelung",
    description:
      "Geldwerten Vorteil des Firmenwagens nach der 1%-Regelung berechnen und aufs Nettogehalt anrechnen — inkl. Elektro-Sätze und Arbeitsweg-Zuschlag.",
    url: "https://bruttonettocalculator.com/firmenwagenrechner",
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
      name: "Wie funktioniert die 1%-Regelung beim Firmenwagen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bei der 1%-Regelung wird monatlich 1 % des Bruttolistenpreises des Firmenwagens als geldwerter Vorteil zum Bruttogehalt hinzugerechnet. Für den Arbeitsweg kommt ein Zuschlag von 0,03 % des Listenpreises je Entfernungskilometer hinzu.",
      },
    },
    {
      "@type": "Question",
      name: "Wie hoch ist die 1%-Regelung bei Elektroautos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Für vollelektrische Fahrzeuge mit einem Bruttolistenpreis bis 70.000 € gilt eine reduzierte Versteuerung von 0,25 % monatlich, darüber bzw. bei bestimmten Hybridfahrzeugen 0,5 % statt der vollen 1 %.",
      },
    },
    {
      "@type": "Question",
      name: "Was ist der geldwerte Vorteil beim Firmenwagen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der geldwerte Vorteil ist der steuerpflichtige Wert der privaten Nutzung des Firmenwagens. Er wird dem Bruttogehalt hinzugerechnet und erhöht so die Bemessungsgrundlage für Lohnsteuer und Sozialabgaben — das Nettogehalt sinkt entsprechend.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Firmenwagenrechner", item: "https://bruttonettocalculator.com/firmenwagenrechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Firmenwagenrechner 2026 — Geldwerter Vorteil & 1%-Regelung",
  url: "https://bruttonettocalculator.com/firmenwagenrechner",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
  },
  description:
    "Kostenloser Firmenwagenrechner für Deutschland — geldwerten Vorteil nach der 1%-Regelung berechnen und aufs Brutto-Netto-Gehalt anrechnen (2025/2026), inkl. Elektro-Sätze.",
};

export default function FirmenwagenrechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <FirmenwagenrechnerCalculator />
      <AdUnit placement="content" />
    </>
  );
}
