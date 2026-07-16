import type { Metadata } from "next";
import PendlerpauschaleRechner from "./PendlerpauschaleRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import AdUnit from "@/components/AdUnit";

const URL = "https://bruttonettocalculator.com/pendlerpauschale-rechner";

export const metadata: Metadata = {
  title: "Pendlerpauschale-Rechner 2026 — Entfernungspauschale",
  description:
    "Pendlerpauschale-Rechner 2026: Berechnen Sie Ihre Entfernungspauschale (0,30 € / ab 21 km 0,38 € pro km) und die mögliche Steuerersparnis. Kostenlos & sofort.",
  keywords: [
    "pendlerpauschale rechner",
    "entfernungspauschale rechner",
    "pendlerpauschale 2026",
    "pendlerpauschale berechnen",
    "fahrtkosten rechner",
    "km pauschale rechner",
    "entfernungspauschale berechnen",
    "pendlerpauschale steuer rechner",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Pendlerpauschale-Rechner 2026 — Entfernungspauschale",
    description: "Entfernungspauschale und Steuerersparnis berechnen — 0,30 €/km, ab 21 km 0,38 €.",
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const faqs = [
  { q: "Wie hoch ist die Pendlerpauschale 2026?", a: "Die Entfernungspauschale beträgt 0,30 € pro Entfernungskilometer für die ersten 20 km und 0,38 € ab dem 21. Kilometer — für die einfache Strecke und pro Arbeitstag." },
  { q: "Zählt die einfache Strecke oder Hin- und Rückfahrt?", a: "Nur die einfache Entfernung zwischen Wohnung und erster Tätigkeitsstätte. Auch mit dem eigenen Auto wird nur eine Strecke pro Arbeitstag angerechnet." },
  { q: "Wirkt sich die Pendlerpauschale immer steuermindernd aus?", a: "Nur der Teil der Werbungskosten über dem Arbeitnehmer-Pauschbetrag von 1.230 € senkt zusätzlich die Steuer. Die ersten 1.230 € werden automatisch berücksichtigt." },
  { q: "Welche Entfernung darf ich ansetzen?", a: "Grundsätzlich die kürzeste Straßenverbindung. Eine längere Strecke ist nur zulässig, wenn sie offensichtlich verkehrsgünstiger ist und regelmäßig genutzt wird." },
];

export default function Page() {
  return (
    <>
      <CalculatorSchema name="Pendlerpauschale-Rechner 2026" url={URL}
        breadcrumbLabel="Pendlerpauschale-Rechner"
        description="Kostenloser Pendlerpauschale-Rechner — Entfernungspauschale (0,30 € / ab 21 km 0,38 €) und Steuerersparnis berechnen (2026)."
        faqs={faqs} />
      <PendlerpauschaleRechner />
      <AdUnit placement="content" />
    </>
  );
}
