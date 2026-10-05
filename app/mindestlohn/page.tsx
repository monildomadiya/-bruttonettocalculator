import type { Metadata } from "next";
import MindestlohnCalculator from "./MindestlohnCalculator";
import { MINDESTLOHN_BRUTTO_ODER_NETTO } from "./bruttoOderNetto";
import MindestlohnContent from "./MindestlohnContent";
import RelatedCalculators from "@/components/RelatedCalculators";
import { webPageSchema } from "@/lib/seo";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";
import SupportButton from "@/components/SupportButton";
import { calculateNetto } from "@/lib/taxCalculator";
import { pageImageUrl } from "@/lib/pageImage";
import { pageStand } from "@/lib/pageDates";
import { MINDESTLOHN } from "@/lib/config2027";
import { monatsBrutto } from "./mindestlohnWerte";

const netto = (b: number, jahr: 2026 | 2027, sk: 1 | 3) =>
  calculateNetto({ bruttoMonat: b, jahr, steuerklasse: sk, verheiratet: sk === 3, kinderlosUeber23: true, kirche: false }).nettoMonat;
const eur0 = (n: number) => n.toLocaleString("de-DE", { maximumFractionDigits: 0 });
const eur2 = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const VZ26 = monatsBrutto(MINDESTLOHN[2026], 40);

const URL = "https://bruttonettocalculator.com/mindestlohn";
const STAND = pageStand("/mindestlohn");

// Ziel: „mindestlohn 2027 netto“ (Pos. 3,7), „mindestlohn 2027 rechner“ (9,2),
// „mindestlohnrechner 2027“ (7,8). 2027 zuerst; die URL bleibt /mindestlohn.
const TITLE = `Mindestlohn 2027: ${eur2(MINDESTLOHN[2027])} € – Netto-Rechner & Tabelle`;
const DESCRIPTION = `Mindestlohn 2027: ${eur2(MINDESTLOHN[2027])} € ab 1. Januar. Netto im Monat bei 20 bis 40 Wochenstunden, alle Steuerklassen – mit Rechner und Vergleich zu 2026 (${eur2(MINDESTLOHN[2026])} €).`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "mindestlohnrechner",
    "Mindestlohn Rechner 2026",
    "Mindestlohn 2027",
    "Mindestlohn 2027 Rechner",
    "Mindestlohn 2027 netto",
    "Mindestlohn brutto netto",
    "Mindestlohn berechnen",
    "gesetzlicher Mindestlohn 2026",
    "13,90 Euro Stunde",
    "Mindestlohn monatlich",
  ],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl("/mindestlohn")],
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    locale: "de_DE",
    type: "website",
  },
};

/* Mirrors the FAQs visibly rendered inside MindestlohnCalculator. */
const faqs = [
  { q: "Wie hoch ist der Mindestlohn 2026?", a: `Der gesetzliche Mindestlohn in Deutschland ist zum 1. Januar 2026 auf ${eur2(MINDESTLOHN[2026])} € brutto pro Stunde gestiegen (zuvor 12,82 € in 2025).` },
  { q: "Wann kommt der neue Mindestlohn 2027?", a: `Die Bundesregierung hat die zweistufige Erhöhung der Mindestlohnkommission per Verordnung bereits beschlossen: Zum 1. Januar 2027 steigt der Mindestlohn auf ${eur2(MINDESTLOHN[2027])} € brutto pro Stunde.` },
  { q: "Wie viel Netto bleibt vom Mindestlohn 2026 übrig?", a: `Bei Vollzeit (40 Std./Woche, ${eur2(MINDESTLOHN[2026])} €/h) ergibt sich ein Bruttogehalt von ca. ${eur0(VZ26)} €/Monat. In Steuerklasse I bleiben nach Abzügen etwa ${eur0(netto(VZ26, 2026, 1))} € netto, in Steuerklasse III ca. ${eur0(netto(VZ26, 2026, 3))} €.` },
  { q: "Gilt der Mindestlohn für alle Beschäftigten?", a: "Der gesetzliche Mindestlohn gilt grundsätzlich für alle Arbeitnehmer ab 18 Jahren. Ausnahmen gelten für Praktikanten (unter 3 Monate), Pflichtpraktika, Langzeitarbeitslose in den ersten 6 Monaten sowie Auszubildende." },
  { q: "Ist der Mindestlohn brutto oder netto?", a: MINDESTLOHN_BRUTTO_ODER_NETTO },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const pageSchema = webPageSchema({
  name: TITLE,
  url: URL,
  description: DESCRIPTION,
  breadcrumbId: `${URL}#breadcrumb`,
  dateModified: STAND.iso,
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
      <MindestlohnCalculator content={<MindestlohnContent />} stand={STAND} />
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
      <ToolContent config={TOOL_CONTENT["/mindestlohn"]} stand={null} />
    </>
  );
}
