import type { Metadata } from "next";
import SteuerklassenwechselRechner from "./SteuerklassenwechselRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import AdUnit from "@/components/AdUnit";

const URL = "https://bruttonettocalculator.com/steuerklassenwechsel-rechner";

export const metadata: Metadata = {
  title: "Steuerklassenwechsel 2026 — 3/5 oder 4/4 Rechner",
  description:
    "Steuerklassenwechsel-Rechner 2026: Berechnen Sie für Ehepaare, ob die Kombination III/V, IV/IV oder IV/IV mit Faktor das meiste monatliche Netto bringt. Kostenlos & sofort.",
  keywords: [
    "steuerklassenwechsel rechner",
    "steuerklasse 3 oder 4",
    "steuerklasse 3 5 oder 4 4",
    "steuerklassen 3/5 oder 4/4 rechner",
    "ehegattensplitting rechner",
    "steuerklasse wechseln rechner",
    "steuerklasse 3 oder 5 rechner",
    "faktorverfahren rechner",
    "verheiratet steuerklasse rechner",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Steuerklassen 3/5 oder 4/4 Rechner 2026 — Steuerklassenwechsel",
    description: "Welche Steuerklassen-Kombination bringt Ehepaaren das meiste Netto? III/V, IV/IV oder Faktor im Vergleich.",
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const faqs = [
  { q: "Steuerklasse 3/5 oder 4/4 — was ist besser?", a: "Für das monatliche Netto lohnt sich III/V, wenn ein Partner deutlich mehr verdient. Aufs Jahr gerechnet ist die Steuerlast bei allen Kombinationen gleich — die Differenz wird bei der Steuererklärung ausgeglichen. IV/IV mit Faktor verteilt die Last am fairsten und vermeidet Nachzahlungen." },
  { q: "Führt Steuerklasse III/V zu einer Nachzahlung?", a: "Häufig ja. Weil in III/V unterm Strich zu wenig Lohnsteuer einbehalten wird, ist eine Steuererklärung Pflicht und es kann zu einer Nachzahlung kommen. Der Vorteil ist die höhere monatliche Liquidität." },
  { q: "Was ist das Faktorverfahren (IV/IV mit Faktor)?", a: "Das Finanzamt berechnet einen Faktor kleiner 1, der die voraussichtliche gemeinsame Jahressteuer genau auf beide Partner verteilt. Das monatliche Netto entspricht dann fast exakt dem, was nach dem Ehegattensplitting fällig ist." },
  { q: "Wie oft kann man die Steuerklasse wechseln?", a: "Seit 2020 ist ein Steuerklassenwechsel mehrmals im Jahr möglich. Der Antrag wird beim Finanzamt gestellt (auch über ELSTER) und gilt in der Regel ab dem Folgemonat." },
];

export default function Page() {
  return (
    <>
      <CalculatorSchema name="Steuerklassenwechsel-Rechner 2026 (3/5 oder 4/4)" url={URL}
        breadcrumbLabel="Steuerklassenwechsel-Rechner"
        description="Kostenloser Steuerklassenwechsel-Rechner für Ehepaare — III/V, IV/IV und IV/IV mit Faktor im Netto-Vergleich (2026)."
        faqs={faqs} />
      <SteuerklassenwechselRechner />
      <AdUnit placement="content" />
    </>
  );
}
