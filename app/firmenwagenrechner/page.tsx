import type { Metadata } from "next";
import FirmenwagenrechnerCalculator from "./FirmenwagenrechnerCalculator";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Firmenwagenrechner 2026 — 1%-Regelung berechnen",
  description:
    "Firmenwagenrechner 2026: Geldwerten Vorteil nach der 1%-Regelung berechnen — inkl. Elektrofahrzeug-Sätze (0,25%/0,5%) und 0,03%-Zuschlag für den Arbeitsweg. Kostenlos & sofort.",
  keywords: [
    "Firmenwagenrechner",
    "Firmenwagenrechner 2026",
    "1%-Regelung",
    "1 Prozent Regelung Firmenwagen",
    "geldwerter Vorteil Dienstwagen",
    "gehaltsrechner mit auto",
    "brutto netto rechner firmenwagen",
    "brutto netto rechner mit firmenwagen",
    "Dienstwagenrechner",
    "Firmenwagen versteuern",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/firmenwagenrechner" },
  openGraph: {
    title: "Firmenwagenrechner 2026 — 1%-Regelung berechnen",
    description:
      "Geldwerten Vorteil des Firmenwagens nach der 1%-Regelung berechnen — inkl. Elektro-Sätze und Arbeitsweg-Zuschlag.",
    url: "https://bruttonettocalculator.com/firmenwagenrechner",
    locale: "de_DE",
    type: "website",
  },
};

const jsonLd = {
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
  ],
};

export default function FirmenwagenrechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FirmenwagenrechnerCalculator />
      <AdUnit placement="content" />
    </>
  );
}
