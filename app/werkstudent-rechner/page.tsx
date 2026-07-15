import type { Metadata } from "next";
import WerkstudentRechner from "./WerkstudentRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import AdUnit from "@/components/AdUnit";

const URL = "https://bruttonettocalculator.com/werkstudent-rechner";

export const metadata: Metadata = {
  title: "Werkstudent Brutto-Netto-Rechner 2026 — Netto berechnen",
  description:
    "Werkstudent-Rechner 2026: Berechnen Sie Ihr Nettogehalt als Werkstudent. Dank Werkstudentenprivileg nur 9,3 % Rentenbeitrag, keine KV/PV/ALV. Kostenlos & sofort.",
  keywords: [
    "werkstudent brutto netto",
    "werkstudent netto rechner",
    "werkstudent gehalt rechner",
    "werkstudent brutto netto rechner",
    "werkstudentenprivileg rechner",
    "werkstudent netto berechnen",
    "wie viel netto werkstudent",
    "student gehalt netto rechner",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Werkstudent Brutto-Netto-Rechner 2026",
    description: "Nettogehalt als Werkstudent berechnen — nur 9,3 % Rentenbeitrag dank Werkstudentenprivileg.",
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const faqs = [
  { q: "Welche Abgaben zahlt ein Werkstudent?", a: "Dank Werkstudentenprivileg nur den Rentenversicherungsbeitrag (9,3 % Arbeitnehmeranteil). Kranken-, Pflege- und Arbeitslosenversicherung entfallen, solange in der Vorlesungszeit höchstens 20 Stunden pro Woche gearbeitet wird." },
  { q: "Muss ein Werkstudent Lohnsteuer zahlen?", a: "Nur wenn das zu versteuernde Jahreseinkommen über dem Grundfreibetrag (2026: 12.348 €) liegt. Bereits einbehaltene Lohnsteuer wird sonst über die Steuererklärung erstattet." },
  { q: "Was ist die 20-Stunden-Regel?", a: "Während der Vorlesungszeit dürfen Werkstudierende höchstens 20 Stunden pro Woche arbeiten, um das Werkstudentenprivileg zu behalten. In den Semesterferien ist mehr möglich." },
  { q: "Bleibt ein Werkstudent familienversichert?", a: "In der Regel ja, sofern das regelmäßige Einkommen die Grenze für die Familienversicherung nicht übersteigt. Das hängt vom Einzelfall ab." },
];

export default function Page() {
  return (
    <>
      <CalculatorSchema name="Werkstudent Brutto-Netto-Rechner 2026" url={URL}
        breadcrumbLabel="Werkstudent-Rechner"
        description="Kostenloser Werkstudent-Rechner — Nettogehalt mit Werkstudentenprivileg (nur 9,3 % Rentenbeitrag) berechnen (2026)."
        faqs={faqs} />
      <WerkstudentRechner />
      <AdUnit placement="content" />
    </>
  );
}
