import type { Metadata } from "next";
import JahresgehaltRechner from "./JahresgehaltRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import AdUnit from "@/components/AdUnit";

const URL = "https://bruttonettocalculator.com/jahresgehalt-rechner";

export const metadata: Metadata = {
  title: "Jahresgehalt-Rechner 2026 — Brutto- & Nettojahresgehalt berechnen",
  description:
    "Jahresgehalt-Rechner 2026: Berechnen Sie Ihr Brutto- und Nettojahresgehalt aus dem Monatsgehalt — inklusive 13. und 14. Monatsgehalt. Kostenlos & sofort.",
  keywords: [
    "jahresgehalt rechner",
    "jahresgehalt berechnen",
    "bruttojahresgehalt berechnen",
    "nettojahresgehalt rechner",
    "jahresbruttogehalt rechner",
    "brutto jahresgehalt rechner",
    "jahresgehalt netto",
    "13 monatsgehalt rechner",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Jahresgehalt-Rechner 2026 — Brutto & Netto",
    description: "Brutto- und Nettojahresgehalt aus dem Monatsgehalt berechnen — inkl. 13./14. Gehalt.",
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const faqs = [
  { q: "Wie berechnet man das Jahresgehalt aus dem Monatsgehalt?", a: "Das Bruttojahresgehalt ergibt sich aus dem Monatsbrutto multipliziert mit der Anzahl der Gehälter pro Jahr. Bei 12 Gehältern 12 × Monatsbrutto; mit Weihnachts- und Urlaubsgeld 13 oder 14 Gehälter." },
  { q: "Was ist der Unterschied zwischen Brutto- und Nettojahresgehalt?", a: "Das Bruttojahresgehalt ist die Summe aller Bruttobezüge vor Abzügen. Das Nettojahresgehalt ist der Betrag nach Lohnsteuer, Soli, ggf. Kirchensteuer und Sozialabgaben." },
  { q: "Zählen Weihnachtsgeld und Urlaubsgeld zum Jahresgehalt?", a: "Ja. Weihnachts-, Urlaubsgeld und ein 13./14. Monatsgehalt sind Teil des Bruttojahresgehalts und voll steuer- und sozialversicherungspflichtig." },
  { q: "Wie viel Netto bleibt vom Jahresgehalt?", a: "Je nach Höhe und Steuerklasse bleiben vom Bruttojahresgehalt meist zwischen 55 % und 70 % netto übrig." },
];

export default function Page() {
  return (
    <>
      <CalculatorSchema name="Jahresgehalt-Rechner 2026" url={URL}
        breadcrumbLabel="Jahresgehalt-Rechner"
        description="Kostenloser Jahresgehalt-Rechner — Brutto- und Nettojahresgehalt aus dem Monatsgehalt berechnen, inkl. 13./14. Gehalt (2026)."
        faqs={faqs} />
      <JahresgehaltRechner />
      <AdUnit placement="content" />
    </>
  );
}
