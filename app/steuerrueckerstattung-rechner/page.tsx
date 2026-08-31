import type { Metadata } from "next";
import SteuerrueckerstattungRechner from "./SteuerrueckerstattungRechner";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";

export const metadata: Metadata = {
  title: "Steuerrückerstattung-Rechner 2026 — was kommt zurück?",
  description:
    "Steuerrückerstattung-Rechner 2026: Wie viel Steuer bekomme ich zurück? Erstattung aus Werbungskosten & Sonderausgaben schätzen — im Schnitt rund 1.100 €.",
  keywords: [
    "steuerrückerstattung rechner",
    "steuererklärung rechner",
    "wie viel steuer bekomme ich zurück",
    "steuererstattung berechnen",
    "steuerrückzahlung rechner",
    "steuererklärung erstattung schätzen",
    "werbungskosten steuer zurück",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/steuerrueckerstattung-rechner" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Steuerrückerstattung-Rechner 2026 — was kommt zurück?",
    description:
      "Schätzen Sie Ihre Steuererstattung aus Werbungskosten & Sonderausgaben. Kostenloser Rechner für die Steuererklärung 2025/2026.",
    url: "https://bruttonettocalculator.com/steuerrueckerstattung-rechner",
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
      name: "Wie viel Steuern bekomme ich durchschnittlich zurück?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Laut Statistischem Bundesamt erhalten Arbeitnehmer, die eine Steuererklärung abgeben, im Durchschnitt rund 1.100 € zurück. Die tatsächliche Erstattung hängt von Einkommen, Steuerklasse und absetzbaren Kosten ab.",
      },
    },
    {
      "@type": "Question",
      name: "Wie entsteht eine Steuerrückerstattung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der Arbeitgeber behält die Lohnsteuer nur mit dem Arbeitnehmer-Pauschbetrag von 1.230 € ein. Weist man in der Steuererklärung höhere Werbungskosten oder Sonderausgaben nach, sinkt das zu versteuernde Einkommen und die zu viel gezahlte Steuer wird erstattet.",
      },
    },
    {
      "@type": "Question",
      name: "Bis wann muss ich die Steuererklärung 2025 abgeben?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bei Pflichtveranlagung ist die Frist für 2025 der 31. Juli 2026, mit Steuerberater bis Ende Februar 2027. Eine freiwillige Erklärung ist bis zu 4 Jahre rückwirkend möglich.",
      },
    },
    {
      "@type": "Question",
      name: "Was kann ich alles absetzen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Häufige Werbungskosten sind Pendlerpauschale, Arbeitsmittel, Homeoffice-Pauschale (6 €/Tag, max. 1.260 €), Fortbildungen und Bewerbungskosten. Sonderausgaben sind z. B. Spenden oder Riester-Beiträge. Handwerkerleistungen mindern die Steuer direkt zu 20 %.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Steuerrückerstattung-Rechner", item: "https://bruttonettocalculator.com/steuerrueckerstattung-rechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "Steuerrückerstattung-Rechner 2026 Deutschland",
  url: "https://bruttonettocalculator.com/steuerrueckerstattung-rechner",
  description:
    "Kostenloser Steuerrückerstattung-Rechner — mögliche Steuererstattung aus Werbungskosten und Sonderausgaben für die Steuererklärung 2025/2026 schätzen.",
};

export default function SteuerrueckerstattungRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SteuerrueckerstattungRechner />
      <ToolContent config={TOOL_CONTENT["/steuerrueckerstattung-rechner"]} />
    </>
  );
}
