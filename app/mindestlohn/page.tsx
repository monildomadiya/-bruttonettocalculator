import type { Metadata } from "next";
import MindestlohnCalculator from "./MindestlohnCalculator";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Mindestlohn Rechner 2026/2027 — Brutto Netto Berechnen",
  description:
    "Mindestlohn Rechner 2026: Aktuell 13,90 € pro Stunde. Berechnen Sie Ihr monatliches Brutto- und Nettogehalt beim Mindestlohn 2026/2027. Alle Steuerklassen — kostenlos.",
  keywords: [
    "Mindestlohn 2026",
    "Mindestlohn Rechner 2026",
    "Mindestlohn 2027",
    "Mindestlohn brutto netto",
    "Mindestlohn berechnen",
    "gesetzlicher Mindestlohn 2026",
    "13,90 Euro Stunde",
    "Mindestlohn monatlich",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/mindestlohn" },
  openGraph: {
    title: "Mindestlohn Rechner 2026/2027 — Brutto Netto Berechnen",
    description:
      "Mindestlohn 2026: 13,90 €/h. Berechnen Sie Ihr monatliches Netto für alle Steuerklassen.",
    url: "https://bruttonettocalculator.com/mindestlohn",
    locale: "de_DE",
    type: "website",
  },
};

export default function MindestlohnPage() {
  return (
    <>
      <MindestlohnCalculator />
      <AdUnit placement="content" />
    </>
  );
}
