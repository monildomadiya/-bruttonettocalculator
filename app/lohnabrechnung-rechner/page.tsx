import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ListChecks, Table2, HelpCircle } from "lucide-react";
import LohnabrechnungRechner from "./LohnabrechnungRechner";
import { LOHNABRECHNUNG_FAQS, POSITIONEN } from "./lohnabrechnungData";
import Section from "@/components/ui/Section";
import TableOfContents from "@/components/TableOfContents";
import ReviewerByline from "@/components/ReviewerByline";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import { pageImageUrl } from "@/lib/pageImage";

const BASE = "https://bruttonettocalculator.com";
const CANONICAL = `${BASE}/lohnabrechnung-rechner`;
const PAGE_TITLE = "Lohnabrechnung-Rechner 2026/2027: Abzüge Zeile für Zeile";
const PAGE_DESCRIPTION =
  "Lohnabrechnung berechnen: Lohnsteuer, Soli, Kirchensteuer, Kranken-, Pflege-, Renten- und Arbeitslosenversicherung Zeile für Zeile — und jede Position erklärt.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "lohnabrechnung rechner",
    "lohnabrechnung berechnen",
    "lohnabrechnung 2026 rechner",
    "lohnabrechnung berechnen online",
    "gehaltsabrechnung rechner",
    "lohnabrechnung verstehen",
    "lohnabrechnung erklärt",
    "steuerbrutto sv-brutto",
    "beitragsgruppenschlüssel 1111",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
    images: [pageImageUrl("/lohnabrechnung-rechner")],
  },
};

// Beispiel 3.800 € (Steuerklasse I, kinderlos, ohne Kirche) — direkt aus der Engine, zitierfähig.
const bsp = calculateNetto({ bruttoMonat: 3800, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 });
const BEISPIEL: [string, number][] = [
  ["Gesamtbrutto", 3800],
  ["Lohnsteuer", bsp.steuer.einkommensteuerJahr / 12],
  ["Solidaritätszuschlag", bsp.steuer.soliJahr / 12],
  ["Krankenversicherung", bsp.sv.kranken / 12],
  ["Pflegeversicherung", bsp.sv.pflege / 12],
  ["Rentenversicherung", bsp.sv.rente / 12],
  ["Arbeitslosenversicherung", bsp.sv.arbeitslosen / 12],
  ["Nettoentgelt", bsp.nettoMonat],
];

export default function LohnabrechnungPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: LOHNABRECHNUNG_FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: PAGE_TITLE,
    url: CANONICAL,
    inLanguage: "de-DE",
    isPartOf: { "@id": `${BASE}/#website` },
    description: PAGE_DESCRIPTION,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: BASE },
      { "@type": "ListItem", position: 2, name: "Lohnabrechnung-Rechner", item: CANONICAL },
    ],
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-5 pt-6 sm:pt-20 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="mb-4 sm:mb-8">
        <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-4">
          <FileText size={14} aria-hidden="true" /> Lohnabrechnung · 2026 und 2027
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#16181D] mb-3 sm:mb-4 tracking-tight">
          Lohnabrechnung-<span className="text-gradient-accent">Rechner</span>
        </h1>
        <p className="text-base sm:text-xl text-black/80 max-w-4xl leading-relaxed">
          Bruttogehalt eingeben und jeden Abzug so sehen, wie er auf der Lohnabrechnung steht — Lohnsteuer, Soli,
          Kirchensteuer und die vier Sozialversicherungsbeiträge, bis zum Auszahlungsbetrag.
        </p>
      </div>

      <TableOfContents
        className="mb-4 sm:mb-8"
        items={[
          { id: "positionen", label: "Positionen erklärt" },
          { id: "beispiel", label: "Beispiel 3.800 €" },
          { id: "faq", label: "Häufige Fragen" },
        ]}
      />

      <div className="mb-10 sm:mb-14">
        <LohnabrechnungRechner />
        <div className="flex justify-center mt-4">
          <ReviewerByline />
        </div>
      </div>

      <Section
        id="positionen"
        eyebrow="Lohnabrechnung lesen"
        eyebrowIcon={ListChecks}
        title="Die Positionen einer Lohnabrechnung erklärt"
        intro="Jede Abrechnung ist anders gestaltet, die Bausteine sind aber immer dieselben — in dieser Reihenfolge."
      >
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {POSITIONEN.map(([k, v]) => (
            <div key={k} className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-4">
              <dt className="font-bold text-[#16181D]">{k}</dt>
              <dd className="text-sm text-black/70 leading-relaxed mt-1">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        id="beispiel"
        variant="muted"
        eyebrow="Beispiel"
        eyebrowIcon={Table2}
        title="Lohnabrechnung bei 3.800 € brutto"
        intro="Steuerklasse I, kinderlos, ohne Kirchensteuer, durchschnittlicher Zusatzbeitrag, Werte 2026 pro Monat."
      >
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-base">
            <tbody className="divide-y divide-black/10">
              {BEISPIEL.map(([k, v]) => (
                <tr key={k} className={k === "Gesamtbrutto" || k === "Nettoentgelt" ? "font-bold text-[#16181D]" : ""}>
                  <th scope="row" className="py-3 px-2 sm:px-4 font-normal text-left">{k}</th>
                  <td className="py-3 px-2 sm:px-4 text-right font-mono whitespace-nowrap">
                    {k === "Gesamtbrutto" || k === "Nettoentgelt" ? "" : "− "}
                    {formatEUR(v)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3">
          Wer das Netto direkt für ein anderes Gehalt sucht, nutzt den{" "}
          <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner</Link>; was der
          Arbeitsplatz den Arbeitgeber insgesamt kostet, zeigt der{" "}
          <Link href="/arbeitgeber-brutto-netto-rechner" className="text-[#E60A1C] font-semibold hover:underline">
            Arbeitgeber-Rechner
          </Link>
          .
        </p>
      </Section>

      <Section id="faq" variant="muted" eyebrow="FAQ" eyebrowIcon={HelpCircle} title="Häufige Fragen zur Lohnabrechnung">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-sm sm:text-base">
          {LOHNABRECHNUNG_FAQS.map((f) => (
            <div key={f.q}>
              <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-2">{f.q}</h3>
              <p className="text-black/70 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </Section>
    </section>
  );
}
