import type { Metadata } from "next";
import WeihnachtsgeldRechner from "./WeihnachtsgeldRechner";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Weihnachtsgeld-Rechner 2026 — Brutto Netto berechnen (Sonderzahlung)",
  description:
    "Weihnachtsgeld-Rechner 2026: Berechnen Sie brutto zu netto, wie viel von Ihrem Weihnachtsgeld nach Steuern und Sozialabgaben übrig bleibt. Gilt auch für Urlaubsgeld, 13. Monatsgehalt & Einmalzahlungen. Kostenlos & sofort.",
  keywords: [
    "weihnachtsgeld rechner",
    "brutto netto rechner weihnachtsgeld",
    "brutto netto weihnachtsgeld rechner",
    "brutto netto rechner mit weihnachtsgeld",
    "weihnachtsgeld netto rechner",
    "weihnachtsgeld versteuern",
    "sonderzahlung brutto netto rechner",
    "einmalzahlung rechner",
    "brutto netto rechner mit einmalzahlung weihnachtsgeld",
    "urlaubs- und weihnachtsgeld rechner",
    "gehaltsrechner mit weihnachtsgeld",
    "brutto netto rechner bonuszahlung",
    "weihnachtsgeld 2026",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/weihnachtsgeld-rechner" },
  openGraph: {
    title: "Weihnachtsgeld-Rechner 2026 — Brutto Netto berechnen",
    description:
      "Wie viel bleibt vom Weihnachtsgeld netto? Berechnen Sie Steuern und Sozialabgaben auf Ihre Sonderzahlung — gilt auch für Urlaubsgeld & Boni.",
    url: "https://bruttonettocalculator.com/weihnachtsgeld-rechner",
    locale: "de_DE",
    type: "website",
    siteName: "BruttoNettoCalculator.com",
  },
};

const faqs = [
  {
    q: "Wie wird Weihnachtsgeld versteuert?",
    a: "Weihnachtsgeld zählt steuerlich als „sonstiger Bezug“. Es wird dem Jahresgehalt hinzugerechnet und nach der Jahreslohnsteuertabelle versteuert. Die Steuer entspricht der Differenz zwischen der Lohnsteuer auf Jahresgehalt inkl. Weihnachtsgeld und der Steuer auf das Jahresgehalt allein.",
  },
  {
    q: "Fallen auf Weihnachtsgeld Sozialabgaben an?",
    a: "Ja. Weihnachtsgeld ist als Einmalzahlung sozialversicherungspflichtig, solange die Beitragsbemessungsgrenze noch nicht erreicht ist. Über der Grenze fallen auf den übersteigenden Teil keine Beiträge mehr an.",
  },
  {
    q: "Wie viel Weihnachtsgeld bleibt netto übrig?",
    a: "Je nach Steuerklasse und Höhe des laufenden Gehalts bleiben von einer Weihnachtsgeld-Sonderzahlung meist zwischen 50 % und 65 % netto übrig — der Rest geht an Steuern und Sozialabgaben.",
  },
  {
    q: "Ist die Berechnung für Urlaubsgeld und Boni identisch?",
    a: "Ja. Urlaubsgeld, 13. Monatsgehalt, Bonuszahlungen und andere Einmalzahlungen werden steuerlich wie Weihnachtsgeld behandelt und lassen sich mit demselben Rechner berechnen.",
  },
  {
    q: "Warum ist die Abgabenlast auf Weihnachtsgeld oft höher als erwartet?",
    a: "Weil das Weihnachtsgeld zusätzlich zum regulären Gehalt versteuert wird und in einen höheren Bereich der Steuerprogression fällt. Der Grenzsteuersatz auf die Sonderzahlung liegt daher meist über dem Durchschnittssteuersatz des normalen Gehalts.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Weihnachtsgeld-Rechner", item: "https://bruttonettocalculator.com/weihnachtsgeld-rechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Weihnachtsgeld-Rechner 2026",
  url: "https://bruttonettocalculator.com/weihnachtsgeld-rechner",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
  },
  description:
    "Kostenloser Weihnachtsgeld-Rechner für Deutschland — berechnet brutto zu netto, wie viel von Weihnachtsgeld, Urlaubsgeld oder einer Sonderzahlung nach Steuern und Sozialabgaben übrig bleibt (2026).",
};

export default function WeihnachtsgeldRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <WeihnachtsgeldRechner />
      <AdUnit placement="content" />
    </>
  );
}
