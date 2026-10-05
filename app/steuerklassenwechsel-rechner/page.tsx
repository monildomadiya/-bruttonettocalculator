import type { Metadata } from "next";
import Link from "next/link";
import SteuerklassenwechselRechner from "./SteuerklassenwechselRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import ToolContent from "@/components/ToolContent";
import AccordionFaq from "@/components/AccordionFaq";
import Section from "@/components/ui/Section";
import { TOOL_CONTENT } from "@/data/tool-content";
import { pageImageUrl } from "@/lib/pageImage";
import { vergleichePaar } from "@/lib/steuerklassenPaar";
import { formatEUR } from "@/lib/taxCalculator";

const URL = "https://bruttonettocalculator.com/steuerklassenwechsel-rechner";
const TITLE = "Steuerklassen-Rechner 2026: III/V, IV/IV oder Faktor?";
const DESCRIPTION =
  "Steuerklassen Rechner für Ehepaare: Netto bei III/V, IV/IV und IV mit Faktor vergleichen und die günstigste Kombination finden.";
const STAND = "5. Oktober 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "steuerklassen rechner",
    "steuerklasse rechner",
    "steuerklasse 3 und 5",
    "steuerklasse 4 mit faktor",
    "verheiratet steuerklasse",
    "beste steuerklasse",
    "steuerklassenwechsel rechner",
    "faktorverfahren rechner",
  ],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl("/steuerklassenwechsel-rechner")],
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    locale: "de_DE",
    type: "website",
    siteName: "BruttoNettoCalculator.com",
  },
};

// Beispiel für Antwort und FAQ — dieselbe Funktion wie der Rechner.
const bsp = vergleichePaar({ bruttoA: 4500, bruttoB: 2500, kirche: false, kinderlosUeber23: true });
const k = Object.fromEntries(bsp.kombinationen.map((x) => [x.key, x])) as Record<string, (typeof bsp.kombinationen)[number]>;

const faqs = [
  {
    q: "Steuerklasse 3/5 oder 4/4 — was ist besser?",
    a: `Für das monatliche Netto lohnt sich III/V, wenn ein Partner deutlich mehr verdient. Bei 4.500 € und 2.500 € brutto bringt III/V ${formatEUR(k["III/V"].nettoMonat - k["IV/IV"].nettoMonat)} mehr Netto im Monat als IV/IV, führt aber zu rund ${formatEUR(-k["III/V"].ausgleichJahr)} Nachzahlung im Jahr. Die Jahressteuer ist bei allen Kombinationen gleich.`,
  },
  {
    q: "Was ist das Faktorverfahren (IV/IV mit Faktor)?",
    a: "Das Finanzamt teilt die voraussichtliche Einkommensteuer des Paares nach dem Splittingverfahren (Y) durch die Summe der Lohnsteuer beider in Klasse IV (X). Der Faktor Y/X mit drei Nachkommastellen mindert die Lohnsteuer beider Partner (§ 39f EStG). So wird monatlich fast genau die Steuer einbehalten, die am Jahresende fällig ist. Der Faktor gilt bis zu zwei Jahre und muss beantragt werden.",
  },
  {
    q: "Führt Steuerklasse III/V zu einer Nachzahlung?",
    a: "Häufig ja, weil in III/V oft zu wenig Lohnsteuer einbehalten wird. Paare mit III/V oder Faktor müssen deshalb eine Steuererklärung abgeben. Bei gleich hohen Einkommen wird mit III/V dagegen zu viel einbehalten; dort ist IV/IV die richtige Wahl.",
  },
  {
    q: "Welche Steuerklasse bekommen wir nach der Heirat?",
    a: "Automatisch beide die Steuerklasse IV, auch wenn nur einer arbeitet. III/V oder IV/IV mit Faktor müssen Sie beim Finanzamt beantragen, zum Beispiel über ELSTER mit dem Antrag auf Steuerklassenwechsel bei Ehegatten.",
  },
  {
    q: "Wie wirkt sich die Steuerklasse auf Elterngeld und Arbeitslosengeld aus?",
    a: "Beide richten sich nach dem Netto und damit nach der Steuerklasse. In Klasse V fällt das Netto und damit die Leistung niedriger aus als in IV oder III. Ein Wechsel muss deshalb rechtzeitig vor dem Bemessungszeitraum erfolgen.",
  },
  {
    q: "Wie oft kann man die Steuerklasse wechseln?",
    a: "Seit 2020 mehrmals im Jahr. Der Antrag gilt ab dem Folgemonat. Zurück zu IV/IV kann auch ein Partner allein wechseln.",
  },
];

export default function Page() {
  return (
    <>
      <CalculatorSchema
        name="Steuerklassen-Rechner 2026 (III/V, IV/IV, Faktor)"
        url={URL}
        breadcrumbLabel="Steuerklassen-Rechner"
        description="Kostenloser Steuerklassen-Rechner für Ehepaare: III/V, V/III, IV/IV und IV/IV mit Faktor im Netto-Vergleich, mit Jahresausgleich (2026)."
        faqs={faqs}
      />
      <SteuerklassenwechselRechner />

      <div className="bg-[#F4F5F7]">
        <div className="max-w-6xl mx-auto px-5 pb-6">
          <Section id="antwort" variant="card" title="Welche Steuerklassen-Kombination ist die beste?" prose>
            <p>
              Für das <strong>monatliche Netto</strong> gewinnt bei ungleichen Gehältern meist III/V: Bei 4.500 € und 2.500 €
              brutto bleiben dem Paar {formatEUR(k["III/V"].nettoMonat)} im Monat, mit IV/IV {formatEUR(k["IV/IV"].nettoMonat)}{" "}
              und mit Faktor {formatEUR(k["IV/IV-Faktor"].nettoMonat)}. <strong>Aufs Jahr</strong> zahlt das Paar aber in jeder
              Kombination dieselbe Steuer ({formatEUR(bsp.splittingSteuerJahr)}); die Unterschiede gleicht die Steuererklärung aus.
              III/V bedeutet hier rund {formatEUR(-k["III/V"].ausgleichJahr)} Nachzahlung, IV/IV {formatEUR(k["IV/IV"].ausgleichJahr)}{" "}
              Erstattung, der Faktor trifft die Jahressteuer fast genau.
            </p>
            <p>
              Die Wahl wirkt sich außerdem auf Lohnersatzleistungen aus: Elterngeld, Arbeitslosengeld und Krankengeld werden aus
              dem Netto berechnet. Wer in Klasse V absehbar eine solche Leistung bezieht, verliert Geld. Wie Sie nach der Hochzeit
              vorgehen, erklärt der Beitrag{" "}
              <Link href="/blog/steuerklasse-nach-heirat" className="text-[#E60A1C] font-semibold hover:underline">Steuerklasse nach der Heirat</Link>;
              welche Klasse Ihnen grundsätzlich zusteht, zeigt der{" "}
              <Link href="/welche-steuerklasse-bin-ich" className="text-[#E60A1C] font-semibold hover:underline">Steuerklassen-Finder</Link>.
            </p>
          </Section>

          <Section id="so-rechnen-wir" variant="muted" title="So rechnen wir" prose>
            <p>
              Lohnsteuer 2026 je Partner in der gewählten Klasse (Klasse V nach dem Programmablaufplan 2026), Sozialabgaben mit
              dem Ø-Zusatzbeitrag. Faktor nach § 39f EStG: Splitting-Einkommensteuer des Paares geteilt durch die Summe der
              Lohnsteuer beider in Klasse IV, auf drei Nachkommastellen abgeschnitten. Jahresausgleich: einbehaltene Lohnsteuer,
              Soli und Kirchensteuer gegen die Steuer nach dem Splittingtarif. Vereinfacht: keine weiteren Einkünfte, Werbungskosten
              oder Freibeträge; der echte Faktor des Finanzamts kann davon leicht abweichen.
            </p>
            <p>
              <strong>Stand: {STAND}.</strong> Alle Angaben ohne Gewähr, keine Steuerberatung. Quellen:{" "}
              <a href="https://www.gesetze-im-internet.de/estg/__39f.html" target="_blank" rel="noopener noreferrer" className="text-[#E60A1C] hover:underline">§ 39f EStG</a>,{" "}
              <a href="https://www.gesetze-im-internet.de/estg/__32a.html" target="_blank" rel="noopener noreferrer" className="text-[#E60A1C] hover:underline">§ 32a EStG</a>,{" "}
              <a href="https://www.gesetze-im-internet.de/sgb_3/__153.html" target="_blank" rel="noopener noreferrer" className="text-[#E60A1C] hover:underline">§ 153 SGB III</a>.
            </p>
          </Section>

          <Section id="faq" variant="plain" title="Häufige Fragen zum Steuerklassenwechsel">
            <AccordionFaq faqs={faqs} />
          </Section>
        </div>
      </div>

      <ToolContent config={TOOL_CONTENT["/steuerklassenwechsel-rechner"]} />
    </>
  );
}
