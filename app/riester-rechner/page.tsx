import type { Metadata } from "next";
import RiesterRechner from "./RiesterRechner";

export const metadata: Metadata = {
  title: "Riester-Rechner 2026 — Zulagen & Eigenbeitrag berechnen",
  description:
    "Riester-Rechner 2026: staatliche Zulagen (Grundzulage 175 €, Kinderzulage bis 300 €) und den nötigen Mindest-Eigenbeitrag für die volle Förderung berechnen. Kostenlos & ohne Anmeldung.",
  keywords: [
    "riester rechner",
    "riester rente rechner",
    "riester zulage berechnen",
    "riester eigenbeitrag",
    "riester förderung 2026",
    "grundzulage kinderzulage",
    "riester mindesteigenbeitrag",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/riester-rechner" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Riester-Rechner 2026 — Zulagen & Eigenbeitrag berechnen",
    description:
      "Staatliche Riester-Zulagen und den Mindest-Eigenbeitrag für die volle Förderung berechnen (Grundzulage 175 €, Kinderzulage bis 300 €).",
    url: "https://bruttonettocalculator.com/riester-rechner",
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
      name: "Wie hoch ist die Riester-Zulage 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Grundzulage beträgt 175 € pro Jahr. Pro Kind kommen 300 € (geboren ab 2008) bzw. 185 € (geboren vor 2008) hinzu. Wer bei Vertragsabschluss unter 25 ist, erhält zusätzlich einen einmaligen Berufseinsteiger-Bonus von 200 €.",
      },
    },
    {
      "@type": "Question",
      name: "Wie viel muss ich für die volle Riester-Förderung selbst einzahlen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Für die volle Förderung müssen Sie insgesamt 4 % Ihres rentenversicherungspflichtigen Vorjahres-Bruttoeinkommens einzahlen (maximal 2.100 € pro Jahr, inklusive Zulagen). Ihr Mindest-Eigenbeitrag ist dieser Gesamtbetrag abzüglich der Zulagen — mindestens jedoch der Sockelbetrag von 60 € pro Jahr.",
      },
    },
    {
      "@type": "Question",
      name: "Was passiert, wenn ich weniger als den Mindest-Eigenbeitrag einzahle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Zahlen Sie weniger als den Mindest-Eigenbeitrag, werden die staatlichen Zulagen anteilig gekürzt. Deshalb lohnt es sich, mindestens den ermittelten Eigenbeitrag einzuzahlen, um die volle Förderung mitzunehmen.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Riester-Rechner", item: "https://bruttonettocalculator.com/riester-rechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "Riester-Rechner 2026 Deutschland",
  url: "https://bruttonettocalculator.com/riester-rechner",
  description:
    "Kostenloser Riester-Rechner — staatliche Zulagen und den Mindest-Eigenbeitrag für die volle Riester-Förderung 2026 berechnen.",
};

export default function RiesterRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <RiesterRechner />
    </>
  );
}
