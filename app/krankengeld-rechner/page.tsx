import type { Metadata } from "next";
import KrankengeldRechner from "./KrankengeldRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import AdUnit from "@/components/AdUnit";

const URL = "https://bruttonettocalculator.com/krankengeld-rechner";

export const metadata: Metadata = {
  title: "Krankengeld-Rechner 2026 — Höhe des Krankengeldes berechnen",
  description:
    "Krankengeld-Rechner 2026: Berechnen Sie die Höhe Ihres Krankengeldes — 70 % vom Brutto, max. 90 % vom Netto, nach Abzug der Sozialabgaben. Kostenlos & sofort.",
  keywords: [
    "krankengeld rechner",
    "krankengeld höhe berechnen",
    "krankengeld netto rechner",
    "wie viel krankengeld",
    "krankengeld berechnen",
    "höhe krankengeld",
    "krankengeld 70 prozent rechner",
    "krankengeld brutto netto",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Krankengeld-Rechner 2026 — Höhe berechnen",
    description: "Wie hoch ist Ihr Krankengeld? 70 % vom Brutto, max. 90 % vom Netto — jetzt berechnen.",
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const faqs = [
  { q: "Wie hoch ist das Krankengeld?", a: "Das Krankengeld beträgt 70 % des Bruttoarbeitsentgelts, höchstens 90 % des Nettoarbeitsentgelts. Davon gehen noch die Arbeitnehmeranteile zur Renten-, Arbeitslosen- und Pflegeversicherung ab (rund 12,5 %)." },
  { q: "Ab wann zahlt die Krankenkasse Krankengeld?", a: "In den ersten sechs Wochen zahlt der Arbeitgeber die Entgeltfortzahlung (100 % des Nettolohns). Erst danach übernimmt die Krankenkasse das Krankengeld." },
  { q: "Wie lange wird Krankengeld gezahlt?", a: "Bei derselben Erkrankung maximal 78 Wochen innerhalb von drei Jahren — abzüglich der sechs Wochen Entgeltfortzahlung also längstens 72 Wochen." },
  { q: "Muss man Krankengeld versteuern?", a: "Krankengeld ist steuerfrei, unterliegt aber dem Progressionsvorbehalt: Es erhöht den Steuersatz auf Ihr übriges Einkommen und kann bei der Steuererklärung zu einer Nachzahlung führen." },
];

export default function Page() {
  return (
    <>
      <CalculatorSchema name="Krankengeld-Rechner 2026" url={URL}
        breadcrumbLabel="Krankengeld-Rechner"
        description="Kostenloser Krankengeld-Rechner — Höhe des Krankengeldes (70 % brutto, max. 90 % netto) nach Sozialabgaben berechnen (2026)."
        faqs={faqs} />
      <KrankengeldRechner />
      <AdUnit placement="content" />
    </>
  );
}
