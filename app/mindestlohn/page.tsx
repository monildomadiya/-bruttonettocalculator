import type { Metadata } from "next";
import MindestlohnCalculator from "./MindestlohnCalculator";
import MindestlohnContent from "./MindestlohnContent";
import RelatedCalculators from "@/components/RelatedCalculators";
import { webPageSchema } from "@/lib/seo";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";
import SupportButton from "@/components/SupportButton";

const URL = "https://bruttonettocalculator.com/mindestlohn";

export const metadata: Metadata = {
  title: "Mindestlohn-Rechner 2026/2027",
  description:
    "Mindestlohn-Rechner: 13,90 € (2026) und 14,60 € (2027) pro Stunde. Monats- und Jahresgehalt aus Wochenstunden berechnen — inklusive Minijob und Arbeitgeberkosten.",
  keywords: [
    "mindestlohnrechner",
    "Mindestlohn Rechner 2026",
    "Mindestlohn 2027",
    "Mindestlohn brutto netto",
    "Mindestlohn berechnen",
    "gesetzlicher Mindestlohn 2026",
    "13,90 Euro Stunde",
    "Mindestlohn monatlich",
  ],
  alternates: { canonical: URL },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Mindestlohn-Rechner 2026/2027",
    description: "Mindestlohn 2026 (13,90 €) und 2027 (14,60 €): Monats- und Jahresgehalt berechnen.",
    url: URL,
    locale: "de_DE",
    type: "website",
  },
};

/* Mirrors the FAQs visibly rendered inside MindestlohnCalculator. */
const faqs = [
  { q: "Wie hoch ist der Mindestlohn 2026?", a: "Der gesetzliche Mindestlohn in Deutschland ist zum 1. Januar 2026 auf 13,90 € brutto pro Stunde gestiegen (zuvor 12,82 € in 2025)." },
  { q: "Wann kommt der neue Mindestlohn 2027?", a: "Die Bundesregierung hat die zweistufige Erhöhung der Mindestlohnkommission per Verordnung bereits beschlossen: Zum 1. Januar 2027 steigt der Mindestlohn auf 14,60 € brutto pro Stunde." },
  { q: "Wie viel Netto bleibt vom Mindestlohn 2026 übrig?", a: "Bei Vollzeit (40 Std./Woche, 13,90 €/h) ergibt sich ein Bruttogehalt von ca. 2.409 €/Monat. In Steuerklasse I bleiben nach Abzügen etwa 1.724 € netto, in Steuerklasse III ca. 1.883 €." },
  { q: "Gilt der Mindestlohn für alle Beschäftigten?", a: "Der gesetzliche Mindestlohn gilt grundsätzlich für alle Arbeitnehmer ab 18 Jahren. Ausnahmen gelten für Praktikanten (unter 3 Monate), Pflichtpraktika, Langzeitarbeitslose in den ersten 6 Monaten sowie Auszubildende." },
  { q: "Was ist der Unterschied zwischen Mindestlohn brutto und netto?", a: "Der Mindestlohn von 13,90 € ist ein Bruttobetrag. Vom Bruttogehalt werden Lohnsteuer (abhängig von Steuerklasse) sowie Sozialversicherungsbeiträge (ca. 20 %) abgezogen. Das Netto variiert je nach Steuerklasse und persönlichen Abzügen." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const pageSchema = webPageSchema({
  name: "Mindestlohn-Rechner 2026/2027",
  url: URL,
  description:
    "Mindestlohn-Rechner für 2026 (13,90 €) und 2027 (14,60 €): Monats- und Jahresgehalt aus Wochenstunden berechnen.",
  breadcrumbId: `${URL}#breadcrumb`,
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${URL}#breadcrumb`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Mindestlohn-Rechner", item: URL },
  ],
};

export default function MindestlohnPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <MindestlohnCalculator content={<MindestlohnContent />} />
      {/* Coffee section before the curated related block: that block keeps it
          apart from the end-of-content ad (see components/SupportStory.tsx). */}
      <SupportButton variant="story" lang="de" placement="page_inline" />
      <RelatedCalculators
        links={[
          { href: "/", label: "Brutto-Netto-Rechner", desc: "Vollständiges Nettogehalt 2026/2027" },
          { href: "/minijob-rechner", label: "Minijob-Rechner", desc: "Verdienstgrenze 603 €" },
          { href: "/stundenlohn-rechner", label: "Stundenlohnrechner", desc: "Stundenlohn & Monatslohn" },
          // War /blog/brutto-netto-rechner-2026-mindestlohn-2027 — ein Slug aus
          // der MySQL-Ära des Ratgebers, der heute nur noch per 301 weiterleitet.
          { href: "/blog/gehalt-2027-was-sich-aendert", label: "Ratgeber: Gehalt 2027", desc: "Was sich zum 1. Januar ändert" },
        ]}
      />
      <ToolContent config={TOOL_CONTENT["/mindestlohn"]} />
    </>
  );
}
