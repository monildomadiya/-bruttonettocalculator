import type { Metadata } from "next";
import GehaltserhoehungRechner from "./GehaltserhoehungRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import AdUnit from "@/components/AdUnit";

const URL = "https://bruttonettocalculator.com/gehaltserhoehung-rechner";

export const metadata: Metadata = {
  title: "Gehaltserhöhung Netto-Rechner 2026 — Was bleibt von der Erhöhung?",
  description:
    "Gehaltserhöhung-Rechner 2026: Berechnen Sie, wie viel von Ihrer Gehaltserhöhung nach Steuern und Sozialabgaben netto übrig bleibt. Grenzsteuersatz sofort sichtbar. Kostenlos.",
  keywords: [
    "gehaltserhöhung netto rechner",
    "gehaltserhöhung rechner",
    "was bleibt von der gehaltserhöhung",
    "gehaltserhöhung netto berechnen",
    "gehaltserhöhung brutto netto",
    "lohnerhöhung netto rechner",
    "grenzsteuersatz rechner",
    "wie viel netto von gehaltserhöhung",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Gehaltserhöhung Netto-Rechner 2026 — Was bleibt übrig?",
    description: "Wie viel Ihrer Gehaltserhöhung netto ankommt — inkl. Grenzsteuersatz. Kostenloser Rechner für 2026.",
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const faqs = [
  { q: "Wie viel von der Gehaltserhöhung bleibt netto übrig?", a: "Das hängt vom Grenzsteuersatz ab. Bei mittleren Einkommen bleiben von einer Bruttoerhöhung oft nur etwa 50–60 % netto übrig, bei hohen Einkommen entsprechend weniger." },
  { q: "Warum bleibt so wenig von der Gehaltserhöhung übrig?", a: "Weil die Erhöhung obendrauf kommt und mit dem persönlichen Grenzsteuersatz besteuert wird — nicht mit dem niedrigeren Durchschnittssteuersatz. Zusätzlich fallen Sozialabgaben an." },
  { q: "Lohnt sich eine Gehaltserhöhung trotzdem?", a: "Ja. Ihr Nettoeinkommen steigt dauerhaft, und höhere Bruttobezüge erhöhen auch Ansprüche wie Renten- und Arbeitslosengeld." },
  { q: "Kann eine Gehaltserhöhung sich negativ auswirken?", a: "Für die reine Lohnsteuer nicht — es bleibt immer netto mehr übrig als vorher. Nur an einzelnen Schwellen (z. B. einkommensabhängige Leistungen) kann es Effekte geben." },
];

export default function Page() {
  return (
    <>
      <CalculatorSchema name="Gehaltserhöhung Netto-Rechner 2026" url={URL}
        breadcrumbLabel="Gehaltserhöhung-Rechner"
        description="Kostenloser Rechner, der zeigt, wie viel einer Gehaltserhöhung nach Steuern und Sozialabgaben netto übrig bleibt (2026)."
        faqs={faqs} />
      <GehaltserhoehungRechner />
      <AdUnit placement="content" />
    </>
  );
}
