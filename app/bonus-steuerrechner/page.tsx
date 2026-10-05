import type { Metadata } from "next";
import BonusSteuerrechner from "./BonusSteuerrechner";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";
import { pageImageUrl } from "@/lib/pageImage";
import { pageStand } from "@/lib/pageDates";
import { BONUS_FAQS } from "./faqs";

export const metadata: Metadata = {
  title: "Bonus-Steuerrechner 2026 — Bonus & Urlaubsgeld versteuern",
  // Bewusst ohne „Weihnachtsgeld“ in Titel, H1, Beschreibung und H2: Die Seite
  // konkurrierte mit /weihnachtsgeld-rechner um „weihnachtsgeld rechner“ (Pos. 85).
  description:
    "Bonus-Steuerrechner 2026: Wie viel von Bonus, Prämie, Urlaubsgeld oder 13. Gehalt nach Steuern und Sozialabgaben netto übrig bleibt. Kostenlos & sofort.",
  keywords: [
    "Bonus Steuerrechner",
    "Bonus versteuern",
    "Prämie versteuern",
    "Urlaubsgeld versteuern",
    "Sonderzahlung versteuern",
    "13. Monatsgehalt Steuer",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/bonus-steuerrechner" },
  openGraph: {
    images: [pageImageUrl("/bonus-steuerrechner")],
    title: "Bonus-Steuerrechner 2026 — Bonus & Urlaubsgeld versteuern",
    description: "Berechnen Sie, wie viel von Ihrem Bonus, Urlaubsgeld oder 13. Gehalt netto übrig bleibt.",
    url: "https://bruttonettocalculator.com/bonus-steuerrechner",
    locale: "de_DE",
    type: "website",
  },
};

const URL = "https://bruttonettocalculator.com/bonus-steuerrechner";
const STAND = pageStand("/bonus-steuerrechner");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: BONUS_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "Bonus-Steuerrechner 2026",
  url: URL,
  dateModified: STAND.iso,
};

export default function BonusSteuerrechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BonusSteuerrechner stand={STAND} />
      <ToolContent config={TOOL_CONTENT["/bonus-steuerrechner"]} stand={null} />
    </>
  );
}
