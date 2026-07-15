import type { Metadata } from "next";
import KurzarbeitergeldRechner from "./KurzarbeitergeldRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import AdUnit from "@/components/AdUnit";

const URL = "https://bruttonettocalculator.com/kurzarbeitergeld-rechner";

export const metadata: Metadata = {
  title: "Kurzarbeitergeld-Rechner 2026 — KUG-Höhe berechnen",
  description:
    "Kurzarbeitergeld-Rechner 2026: Berechnen Sie Ihr Kurzarbeitergeld (60 % / 67 % der Nettoentgeltdifferenz) und Ihr gesamtes Monatseinkommen bei Kurzarbeit. Kostenlos & sofort.",
  keywords: [
    "kurzarbeitergeld rechner",
    "kurzarbeit rechner",
    "kug rechner",
    "kurzarbeitergeld berechnen",
    "wie viel kurzarbeitergeld",
    "kurzarbeit netto rechner",
    "kurzarbeitergeld höhe",
    "nettoentgeltdifferenz rechner",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Kurzarbeitergeld-Rechner 2026 — KUG berechnen",
    description: "Kurzarbeitergeld (60 %/67 %) und Gesamteinkommen bei Kurzarbeit berechnen. Kostenlos für 2026.",
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const faqs = [
  { q: "Wie hoch ist das Kurzarbeitergeld?", a: "60 % der Nettoentgeltdifferenz, mit mindestens einem Kind im Haushalt 67 %. Die Nettoentgeltdifferenz ist der Unterschied zwischen dem Netto beim vollen (Soll-)Gehalt und beim reduzierten (Ist-)Gehalt." },
  { q: "Was ist die Nettoentgeltdifferenz?", a: "Die Differenz zwischen dem Netto ohne Arbeitsausfall (Soll) und dem Netto während der Kurzarbeit (Ist). Auf diese Differenz zahlt die Bundesagentur für Arbeit 60 bzw. 67 %." },
  { q: "Ist Kurzarbeitergeld steuerpflichtig?", a: "Es ist steuerfrei, unterliegt aber dem Progressionsvorbehalt. Es erhöht den Steuersatz auf Ihr übriges Einkommen — eine Steuererklärung ist Pflicht." },
  { q: "Bekomme ich während der Kurzarbeit noch Gehalt?", a: "Ja. Für die geleistete Arbeit zahlt der Arbeitgeber das reduzierte Ist-Gehalt; zusätzlich erhalten Sie das Kurzarbeitergeld als Ausgleich." },
];

export default function Page() {
  return (
    <>
      <CalculatorSchema name="Kurzarbeitergeld-Rechner 2026" url={URL}
        breadcrumbLabel="Kurzarbeitergeld-Rechner"
        description="Kostenloser Kurzarbeitergeld-Rechner — KUG (60 %/67 % der Nettoentgeltdifferenz) und Gesamteinkommen bei Kurzarbeit berechnen (2026)."
        faqs={faqs} />
      <KurzarbeitergeldRechner />
      <AdUnit placement="content" />
    </>
  );
}
