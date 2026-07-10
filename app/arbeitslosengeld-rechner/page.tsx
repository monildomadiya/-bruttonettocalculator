import type { Metadata } from "next";
import ArbeitslosengeldRechner from "./ArbeitslosengeldRechner";

export const metadata: Metadata = {
  title: "Arbeitslosengeld Rechner 2026 (ALG I) — 60%/67% berechnen",
  description:
    "Arbeitslosengeld Rechner 2026: Schätzen Sie Ihr ALG I — 60 % (bzw. 67 % mit Kind) Ihres Nettoentgelts. Kostenlos, sofort & basierend auf Ihrem Bruttogehalt.",
  keywords: [
    "Arbeitslosengeld Rechner",
    "Arbeitslosengeld Rechner 2026",
    "ALG 1 Rechner",
    "Arbeitslosengeld 1 berechnen",
    "arbeitslosengeld rechner",
    "Nettoentgelt Arbeitslosengeld",
    "wie viel arbeitslosengeld bekomme ich",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/arbeitslosengeld-rechner" },
  openGraph: {
    title: "Arbeitslosengeld Rechner 2026 (ALG I)",
    description: "Schätzen Sie Ihr Arbeitslosengeld I — 60 % bzw. 67 % Ihres Nettoentgelts, sofort berechnet.",
    url: "https://bruttonettocalculator.com/arbeitslosengeld-rechner",
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
      name: "Wie viel Arbeitslosengeld (ALG I) bekomme ich?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Das Arbeitslosengeld I beträgt 60 % Ihres pauschalierten Nettoentgelts der letzten 12 Monate, bzw. 67 % mit mindestens einem Kind.",
      },
    },
    {
      "@type": "Question",
      name: "Wie lange bekomme ich Arbeitslosengeld?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Bezugsdauer liegt je nach Alter und Beschäftigungsdauer zwischen 6 und 24 Monaten.",
      },
    },
  ],
};

export default function ArbeitslosengeldRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArbeitslosengeldRechner />
    </>
  );
}
