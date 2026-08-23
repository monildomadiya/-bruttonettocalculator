import type { Metadata } from "next";
import MieteinnahmenRechner from "./MieteinnahmenRechner";
import MieteinnahmenContent from "./MieteinnahmenContent";
import RelatedCalculators from "@/components/RelatedCalculators";

export const metadata: Metadata = {
  title: "Mieteinnahmen versteuern 2026: Steuer auf Mieteinnahmen berechnen",
  description:
    "Wie viel Steuer fällt auf Mieteinnahmen an? Rechner für Überschuss, AfA und Werbungskosten nach § 21 EStG — inklusive Verlustverrechnung mit dem Gehalt.",
  keywords: [
    "Mieteinnahmen versteuern",
    "Steuer auf Mieteinnahmen",
    "Steuer bei Mieteinnahmen",
    "Mieteinnahmen Steuer",
    "Mieteinnahmen Rechner",
    "Vermietung und Verpachtung Steuer",
    "Werbungskosten Vermietung",
    "AfA Immobilie",
    "Anlage V",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/mieteinnahmen-versteuern" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Mieteinnahmen versteuern — Steuer auf Mieteinnahmen berechnen",
    description:
      "Berechnen Sie den steuerpflichtigen Überschuss aus Vermietung und die Steuer darauf — mit AfA, Zinsen und Werbungskosten.",
    url: "https://bruttonettocalculator.com/mieteinnahmen-versteuern",
    locale: "de_DE",
    type: "website",
  },
};

/** Muss inhaltlich mit den FAQ-Fragen in MieteinnahmenRechner.tsx übereinstimmen. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wie werden Mieteinnahmen versteuert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mieteinnahmen zählen zu den Einkünften aus Vermietung und Verpachtung (§ 21 EStG). Versteuert wird nicht die Miete selbst, sondern der Überschuss: Mieteinnahmen minus Werbungskosten. Dieser Überschuss wird dem übrigen Einkommen hinzugerechnet und mit dem persönlichen Steuersatz belastet.",
      },
    },
    {
      "@type": "Question",
      name: "Ab welcher Höhe muss ich Mieteinnahmen versteuern?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Es gibt keinen eigenen Freibetrag für Mieteinnahmen. Steuer fällt an, sobald das gesamte zu versteuernde Einkommen über dem Grundfreibetrag liegt (2026: 12.348 € für Alleinstehende). Anzugeben sind die Einkünfte in der Anlage V grundsätzlich immer.",
      },
    },
    {
      "@type": "Question",
      name: "Welche Kosten kann ich von den Mieteinnahmen absetzen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absetzbar sind alle Werbungskosten, die durch die Vermietung veranlasst sind: Gebäudeabschreibung (AfA), Schuldzinsen, Grundsteuer, Verwaltungskosten, nicht umlagefähiges Hausgeld, Instandhaltung und Reparaturen, Versicherungen sowie Fahrt-, Makler- und Inseratskosten.",
      },
    },
    {
      "@type": "Question",
      name: "Kann ich die Kredittilgung von der Steuer absetzen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nein. Absetzbar sind ausschließlich die Zinsen, nicht der Tilgungsanteil. Die Tilgung ist steuerlich reine Vermögensumschichtung und daher kein Werbungskostenabzug.",
      },
    },
    {
      "@type": "Question",
      name: "Wie hoch ist die Abschreibung (AfA) auf eine vermietete Immobilie?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Für Wohngebäude im Privatvermögen gilt: 3 % jährlich bei Fertigstellung ab 2023, 2 % bei Fertigstellung zwischen 1925 und 2022 und 2,5 % bei Fertigstellung vor 1925 (§ 7 Abs. 4 EStG). Abgeschrieben wird nur der Gebäudeanteil des Kaufpreises, nicht der Grund und Boden.",
      },
    },
    {
      "@type": "Question",
      name: "Was passiert, wenn ich Verluste aus Vermietung mache?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Übersteigen die Werbungskosten die Mieteinnahmen, entsteht ein Verlust aus Vermietung und Verpachtung. Dieser wird mit den übrigen Einkünften — etwa dem Arbeitslohn — verrechnet und senkt die Steuerlast. Voraussetzung ist die Absicht, langfristig einen Überschuss zu erzielen.",
      },
    },
    {
      "@type": "Question",
      name: "Was gilt bei vergünstigter Vermietung an Angehörige?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Beträgt die Miete mindestens 66 % der ortsüblichen Marktmiete, bleiben die Werbungskosten voll abziehbar. Liegt sie unter 50 %, wird die Vermietung in einen entgeltlichen und einen unentgeltlichen Teil aufgeteilt. Zwischen 50 % und 66 % verlangt das Finanzamt eine Totalüberschussprognose (§ 21 Abs. 2 EStG).",
      },
    },
  ],
};

export default function MieteinnahmenVersteuernPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MieteinnahmenRechner content={<MieteinnahmenContent />} />
      <RelatedCalculators
        links={[
          { href: "/einkommensteuer-rechner", label: "Einkommensteuer-Rechner", desc: "Persönlicher Steuersatz" },
          { href: "/immobilienkredit-rechner", label: "Immobilienkredit-Rechner", desc: "Finanzierung planen" },
          { href: "/steuerrueckerstattung-rechner", label: "Steuerrückerstattung", desc: "Erstattung schätzen" },
          { href: "/", label: "Brutto-Netto-Rechner", desc: "Vollständiges Nettogehalt 2026" },
        ]}
      />
    </>
  );
}
