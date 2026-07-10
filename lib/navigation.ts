import {
  Calculator, ArrowRightLeft, LayoutList, Calendar, Scale,
  Car, PiggyBank, Umbrella, Wallet2, Baby, Banknote, Gift, Clock3,
} from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: typeof Calculator;
  description?: string;
}

export interface NavGroup {
  label: string;
  items: NavLink[];
}

/** Grouped calculator/tool links, shared between the desktop mega-menu and the mobile menu. */
export const calculatorGroups: NavGroup[] = [
  {
    label: "Gehalt & Steuer",
    items: [
      { href: "/", label: "Brutto Netto Rechner", icon: Calculator, description: "Der Hauptrechner für 2026/2027" },
      { href: "/rechner/brutto-zu-netto", label: "Brutto zu Netto", icon: ArrowRightLeft, description: "Direkt umrechnen" },
      { href: "/rechner/netto-zu-brutto", label: "Netto zu Brutto", icon: ArrowRightLeft, description: "Für Gehaltsverhandlungen" },
      { href: "/steuerklassen", label: "Steuerklassen", icon: LayoutList, description: "Alle 6 Klassen im Vergleich" },
      { href: "/brutto-netto-rechner-2027", label: "Vorschau 2027", icon: Calendar, description: "Reform-Eckwerte testen" },
    ],
  },
  {
    label: "Sozialleistungen",
    items: [
      { href: "/mindestlohn", label: "Mindestlohn Rechner", icon: Scale, description: "13,90 €/h ab 2026" },
      { href: "/minijob-rechner", label: "Minijob-Rechner", icon: Wallet2, description: "Verdienstgrenze 603 €" },
      { href: "/elterngeld-rechner", label: "Elterngeld-Rechner", icon: Baby, description: "Basiselterngeld & Plus" },
      { href: "/arbeitslosengeld-rechner", label: "Arbeitslosengeld-Rechner", icon: Umbrella, description: "ALG I Orientierung" },
      { href: "/pfaendungstabelle", label: "Pfändungstabelle", icon: Scale, description: "Freigrenzen 2026" },
    ],
  },
  {
    label: "Sonderfälle",
    items: [
      { href: "/firmenwagenrechner", label: "Firmenwagenrechner", icon: Car, description: "1%-Regelung" },
      { href: "/rentenrechner", label: "Rentenrechner", icon: PiggyBank, description: "Rentenbeitrag & Prognose" },
      { href: "/abfindungsrechner", label: "Abfindungsrechner", icon: Banknote, description: "Fünftelregelung" },
      { href: "/bonus-steuerrechner", label: "Bonus-Steuerrechner", icon: Gift, description: "Weihnachts- & Urlaubsgeld" },
      { href: "/stundenlohn-rechner", label: "Stundenlohn-Rechner", icon: Clock3, description: "Netto pro Stunde" },
    ],
  },
];

export const allCalculatorLinks: NavLink[] = calculatorGroups.flatMap((g) => g.items);
