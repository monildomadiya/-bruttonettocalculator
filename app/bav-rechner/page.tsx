import type { Metadata } from "next";
import BavRechner from "./BavRechner";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";

export const metadata: Metadata = {
  title: "bAV-Rechner 2026 — Entgeltumwandlung & Netto-Aufwand",
  description:
    "bAV-Rechner 2026: Was kostet die betriebliche Altersvorsorge netto? Entgeltumwandlung mit Steuer- und Sozialabgaben-Ersparnis plus 15 % AG-Zuschuss.",
  keywords: [
    "bav rechner",
    "entgeltumwandlung rechner",
    "betriebliche altersvorsorge rechner",
    "bav netto berechnen",
    "entgeltumwandlung netto",
    "bav 2026",
    "gehaltsumwandlung rechner",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/bav-rechner" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "bAV-Rechner 2026 — Entgeltumwandlung & Netto-Aufwand",
    description:
      "Wie viel Netto kostet Ihre betriebliche Altersvorsorge? Entgeltumwandlung mit Steuer-/Abgabenersparnis und Arbeitgeberzuschuss berechnen.",
    url: "https://bruttonettocalculator.com/bav-rechner",
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
      name: "Was ist eine Entgeltumwandlung (bAV)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bei der Entgeltumwandlung wandeln Sie einen Teil Ihres Bruttogehalts in einen Beitrag zur betrieblichen Altersvorsorge um. Da dieser Teil steuer- und sozialabgabenfrei ist, sinkt Ihr Nettogehalt weniger als der eingezahlte Betrag.",
      },
    },
    {
      "@type": "Question",
      name: "Wie viel darf ich steuer- und abgabenfrei einzahlen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2026 sind Beiträge bis 8 % der Beitragsbemessungsgrenze RV (101.400 €) steuerfrei — 676 €/Monat — und bis 4 % (338 €/Monat) sozialabgabenfrei.",
      },
    },
    {
      "@type": "Question",
      name: "Muss mein Arbeitgeber etwas dazugeben?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. Für Entgeltumwandlungen seit 2022 muss der Arbeitgeber 15 % Zuschuss zahlen, soweit er selbst Sozialabgaben spart.",
      },
    },
    {
      "@type": "Question",
      name: "Hat die bAV auch Nachteile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Da das sozialversicherungspflichtige Brutto sinkt, fallen gesetzliche Rente und ggf. Lohnersatzleistungen minimal geringer aus; die bAV-Rente ist in der Auszahlungsphase steuer- und krankenversicherungspflichtig.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "bAV-Rechner", item: "https://bruttonettocalculator.com/bav-rechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "bAV-Rechner 2026 Deutschland",
  url: "https://bruttonettocalculator.com/bav-rechner",
  description:
    "Kostenloser bAV-Rechner — Netto-Aufwand einer Entgeltumwandlung zur betrieblichen Altersvorsorge inkl. Steuer-/Abgabenersparnis und Arbeitgeberzuschuss berechnen (2026).",
};

export default function BavRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BavRechner />
      <ToolContent config={TOOL_CONTENT["/bav-rechner"]} />
    </>
  );
}
