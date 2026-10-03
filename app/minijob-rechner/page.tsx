import type { Metadata } from "next";
import MinijobRechner from "./MinijobRechner";
import { MINIJOB_FAQS } from "./minijobData";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";
import { pageImageUrl } from "@/lib/pageImage";

const PAGE_TITLE = "Minijob-Rechner 2026/2027: Grenze 603 € und 633 € ab 2027";
const PAGE_DESCRIPTION =
  "Minijob-Rechner 2026/2027: Verdienstgrenze 603 €, ab 1.1.2027 633 €. Netto, Rentenversicherungs-Eigenanteil 3,6 % und Stunden mit Mindestlohn berechnen.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "Minijob Rechner",
    "Minijob Rechner 2026",
    "Minijob Rechner 2027",
    "Minijob Grenze 2026",
    "Minijob Grenze 2027",
    "Minijob 603 Euro",
    "Minijob 633 Euro",
    "Minijob 2027 Stunden",
    "Minijob 2027 Änderungen",
    "geringfügige Beschäftigung Rechner",
    "Minijob Rentenversicherung",
    "Minijob netto",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/minijob-rechner" },
  openGraph: {
    images: [pageImageUrl("/minijob-rechner")],
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "https://bruttonettocalculator.com/minijob-rechner",
    locale: "de_DE",
    type: "website",
  },
};

// Aus denselben Fragen wie im Rechner — Schema und sichtbare FAQ laufen nicht auseinander.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MINIJOB_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function MinijobRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MinijobRechner />
      <ToolContent config={TOOL_CONTENT["/minijob-rechner"]} />
    </>
  );
}
