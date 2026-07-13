import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import AccordionFaq from "@/components/AccordionFaq";

export const metadata: Metadata = {
  title: "Häufige Fragen (FAQ) — Brutto Netto Rechner 2026",
  description: "Alle wichtigen Antworten rund um Brutto, Netto, Lohnsteuer, Steuerklassen und Abgaben in Deutschland.",
  alternates: { canonical: "https://bruttonettocalculator.com/faq" },
  openGraph: {
    title: "Häufige Fragen (FAQ) | Brutto Netto Rechner 2026",
    description: "Alle wichtigen Antworten rund um Brutto, Netto, Lohnsteuer, Steuerklassen und Abgaben in Deutschland.",
    url: "https://bruttonettocalculator.com/faq",
    locale: "de_DE",
    type: "website",
    images: [{ url: "https://bruttonettocalculator.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Brutto Netto Rechner 2026",
    description: "Antworten zu Brutto, Netto, Steuerklassen & Abgaben in Deutschland.",
    images: ["https://bruttonettocalculator.com/og-image.png"],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wie berechnet man Netto aus Brutto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vom Bruttogehalt werden Sozialabgaben (Renten-, Kranken-, Pflege-, Arbeitslosenversicherung) sowie Lohnsteuer, Solidaritätszuschlag und ggf. Kirchensteuer abgezogen. Der Rest ist das Nettogehalt.",
      },
    },
    {
      "@type": "Question",
      name: "Was ist der Unterschied zwischen Brutto und Netto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Brutto ist das vereinbarte Gehalt vor Abzügen, Netto ist der Betrag, der tatsächlich auf dem Konto ankommt.",
      },
    },
    {
      "@type": "Question",
      name: "Wie hoch ist der Grundfreibetrag 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der Grundfreibetrag liegt 2026 bei 12.348 € für Alleinstehende und 24.696 € für gemeinsam veranlagte Ehepaare. Bis zu diesem Betrag fällt keine Einkommensteuer an.",
      },
    },
    {
      "@type": "Question",
      name: "Welche Abzüge hat man vom Brutto zum Netto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Hauptabzüge sind: Lohnsteuer (Einkommensteuer), Solidaritätszuschlag, ggf. Kirchensteuer sowie die Arbeitnehmeranteile zur Renten- (9,3 %), Kranken- (ca. 8,75 %), Pflege- (1,9 % oder 2,5 %) und Arbeitslosenversicherung (1,3 %).",
      },
    },
    {
      "@type": "Question",
      name: "Was ist der Unterschied zwischen den Steuerklassen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Deutschland hat 6 Steuerklassen: I (ledig), II (Alleinerziehende), III (Verheiratete, höheres Einkommen), IV (Verheiratete, gleiches Einkommen), V (Verheiratete, geringeres Einkommen), VI (Zweiter Job). Steuerklasse III zahlt am wenigsten, VI am meisten Lohnsteuer.",
      },
    },
  ],
};

const faqs = [
  {
    q: "Wie berechnet man Netto aus Brutto?",
    a: "Vom Bruttogehalt werden Sozialabgaben (Renten-, Kranken-, Pflege-, Arbeitslosenversicherung) sowie Lohnsteuer, Solidaritätszuschlag und ggf. Kirchensteuer abgezogen. Der Rest ist das Nettogehalt.",
  },
  {
    q: "Was ist der Unterschied zwischen Brutto und Netto?",
    a: "Brutto ist das vereinbarte Gehalt vor Abzügen, Netto ist der Betrag, der tatsächlich auf dem Konto ankommt.",
  },
  {
    q: "Ändert sich mein Nettogehalt jedes Jahr?",
    a: "Ja — Steuerformeln, Freibeträge und Sozialversicherungs-Beitragsbemessungsgrenzen werden jährlich angepasst, auch bei gleichbleibendem Brutto.",
  },
  {
    q: "Wie hoch ist der Grundfreibetrag 2026?",
    a: "Der Grundfreibetrag liegt 2026 bei 12.348 € für Alleinstehende und 24.696 € für gemeinsam veranlagte Ehepaare. Bis zu diesem Betrag fällt keine Einkommensteuer an.",
  },
  {
    q: "Welche Abzüge hat man vom Brutto zum Netto?",
    a: "Die Hauptabzüge sind: Lohnsteuer (Einkommensteuer), Solidaritätszuschlag, ggf. Kirchensteuer sowie die Arbeitnehmeranteile zur Renten- (9,3 %), Kranken- (ca. 8,75 %), Pflege- (1,9 % oder 2,5 %) und Arbeitslosenversicherung (1,3 %).",
  },
  {
    q: "Was ist der Unterschied zwischen den Steuerklassen?",
    a: "Deutschland hat 6 Steuerklassen: I (ledig), II (Alleinerziehende), III (Verheiratete, höheres Einkommen), IV (Verheiratete, gleiches Einkommen), V (Verheiratete, geringeres Einkommen), VI (Zweiter Job). Steuerklasse III zahlt am wenigsten, VI am meisten Lohnsteuer.",
  },
  {
    q: "Wie werden KI und moderne Web-Technologien eingesetzt?",
    a: (
      <span>
        Für die präzise Umsetzung und stetige Optimierung unserer Rechner und Web-Workflows setzen wir auf innovative KI-Technologien. Erstklassige Ressourcen und professionelles Prompt Engineering entdecken Sie bei unserem Kooperationspartner <a href="https://promptking.in" target="_blank" rel="noopener" className="text-[#E60A1C] font-semibold hover:underline">PromptKing</a>, dem führenden Portal für KI-Prompts und Workflow-Optimierung.
      </span>
    ),
  },
];

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="w-full max-w-6xl mx-auto px-5 py-24 min-h-[70vh]">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
            <HelpCircle size={14} /> Wissensdatenbank
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#16181D] mb-4 tracking-tight">
            Häufige Fragen <span className="text-gradient-accent">(FAQ)</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/80 max-w-3xl mx-auto leading-relaxed">
            Hier finden Sie verständliche Antworten auf alle Fragen bezüglich Ihrer Gehaltsabrechnung, Abzüge und Steuerklassen.
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto">
          <AccordionFaq faqs={faqs} />
        </div>
      </section>
    </>
  );
}
