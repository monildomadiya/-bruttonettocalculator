import type { Metadata } from "next";
import BafoegRechner from "./BafoegRechner";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";
import { pageImageUrl } from "@/lib/pageImage";
import { BAFOEG, BAFOEG_FAQS, BAFOEG_HOECHSTSATZ } from "@/lib/bafoeg";

export const metadata: Metadata = {
  title: "BAföG-Rechner 2026: Anspruch berechnen, Reform 2027",
  description: `BAföG-Rechner 2026: Anspruch aus Wohnsituation, Elterneinkommen und Nebenjob schätzen. Höchstsatz ${BAFOEG_HOECHSTSATZ} €, Hinzuverdienst bis ${BAFOEG.hinzuverdienst} €, geplante Erhöhung 2027.`,
  keywords: [
    "bafög rechner",
    "bafög rechner 2026",
    "bafög berechnen",
    "bafög höhe",
    "bafög anspruch",
    "bafög höchstsatz 2026",
    "wie viel bafög bekomme ich",
    "bafög studierende",
    "bafög 2027",
    "bafög erhöhung 2027",
    "bafög hinzuverdienst 2026",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/bafoeg-rechner" },
  openGraph: {
    images: [pageImageUrl("/bafoeg-rechner")],
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
  mainEntity: BAFOEG_FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
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
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "BAföG-Rechner 2026",
  url: "https://bruttonettocalculator.com/bafoeg-rechner",
  description: "Kostenloser BAföG-Rechner 2026 — Anspruch aus Bedarfssatz, eigenem Einkommen und Elterneinkommen schätzen.",
};

export default function BafoegRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BafoegRechner />
      <ToolContent config={TOOL_CONTENT["/bafoeg-rechner"]} />
    </>
  );
}
