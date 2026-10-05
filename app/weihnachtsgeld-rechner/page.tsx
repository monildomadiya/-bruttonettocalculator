import type { Metadata } from "next";
import WeihnachtsgeldRechner, { type WeihnachtsgeldFaq } from "./WeihnachtsgeldRechner";
import WeihnachtsgeldContent, { BEISPIEL_BRUTTO, BEISPIEL_WG, wgNetto } from "./WeihnachtsgeldContent";
import RelatedCalculators from "@/components/RelatedCalculators";
import SupportButton from "@/components/SupportButton";
import { pageImageUrl } from "@/lib/pageImage";
import { formatEUR } from "@/lib/taxCalculator";
import { pageStand } from "@/lib/pageDates";

const TITLE = "Weihnachtsgeld-Rechner 2026: Wie viel bleibt netto?";
const DESCRIPTION =
  "Weihnachtsgeld 2026 netto berechnen: Steuern und Sozialabgaben auf die Sonderzahlung für alle Steuerklassen – mit Rechner und Netto-Tabelle.";
const STAND = pageStand("/weihnachtsgeld-rechner");
const URL = "https://bruttonettocalculator.com/weihnachtsgeld-rechner";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "weihnachtsgeld rechner",
    "weihnachtsgeld netto rechner",
    "brutto netto rechner weihnachtsgeld",
    "weihnachtsgeld berechnen",
    "weihnachtsgeld steuerfrei",
    "minijob weihnachtsgeld",
    "weihnachtsgeld rechner tvöd",
    "weihnachtsgeld versteuern",
    "weihnachtsgeld 2026",
  ],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl("/weihnachtsgeld-rechner")],
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    locale: "de_DE",
    type: "website",
    siteName: "BruttoNettoCalculator.com",
  },
};

// FAQ-Antworten mit Zahlen aus derselben Engine wie der Rechner.
const b1500 = wgNetto(BEISPIEL_WG, 1);
const b1500k3 = wgNetto(BEISPIEL_WG, 3);
const hoch = wgNetto(BEISPIEL_WG, 1, 7000);

const faqs: WeihnachtsgeldFaq[] = [
  {
    q: "Wie viel Weihnachtsgeld bleibt netto?",
    a: `Meist gut die Hälfte. Bei ${formatEUR(BEISPIEL_BRUTTO)} Monatsbrutto bleiben von ${formatEUR(BEISPIEL_WG)} Weihnachtsgeld in Steuerklasse I rund ${formatEUR(b1500.netto)} netto (${Math.round(b1500.nettoQuotePct)} %), in Steuerklasse III rund ${formatEUR(b1500k3.netto)} (kinderlos, ohne Kirchensteuer, 2026). Wie viel es bei Ihnen ist, hängt vor allem vom laufenden Gehalt und der Steuerklasse ab.`,
  },
  {
    q: "Warum wird Weihnachtsgeld so hoch versteuert?",
    a: "Weihnachtsgeld ist ein sonstiger Bezug. Die Lohnsteuer darauf ist die Differenz zwischen der Jahreslohnsteuer mit und ohne Weihnachtsgeld. Weil es oben auf das Jahreseinkommen kommt, greift Ihr Grenzsteuersatz und nicht der niedrigere Durchschnittssteuersatz Ihres Gehalts. Dazu kommen Sozialabgaben, solange die anteilige Beitragsbemessungsgrenze nicht erreicht ist.",
  },
  {
    q: "Ist Weihnachtsgeld steuerfrei?",
    a: "Nein. Weihnachtsgeld in Geld ist voll lohnsteuerpflichtig und in der Regel auch sozialversicherungspflichtig. Steuerfrei sein können nur Sachgeschenke bis zur Sachbezugsfreigrenze von 50 € im Monat und die Weihnachtsfeier bis 110 € je Beschäftigten.",
  },
  {
    q: "Zählt Weihnachtsgeld beim Minijob mit?",
    a: "Ja, wenn es vertraglich zugesichert ist oder regelmäßig gezahlt wird. Dann zählt es zur Jahresverdienstgrenze von 7.236 € (2026). Wer jeden Monat 603 € verdient und zusätzlich Weihnachtsgeld bekommt, liegt über der Grenze. Dann ist die Beschäftigung von Beginn an ein Midijob. Ein freiwilliges, nicht vorhersehbares Weihnachtsgeld zählt bei der Prüfung nicht mit.",
  },
  {
    q: "Wann wird Weihnachtsgeld ausgezahlt?",
    a: "Einen gesetzlichen Termin gibt es nicht. Meist kommt das Weihnachtsgeld mit dem November- oder Dezembergehalt, je nach Arbeitsvertrag, Tarifvertrag oder Betriebsvereinbarung. Im TVöD wird die Jahressonderzahlung mit dem Novemberentgelt gezahlt.",
  },
  {
    q: "Fallen auf Weihnachtsgeld Sozialabgaben an?",
    a: `Ja, soweit Ihr Entgelt im Jahr bis zum Auszahlungsmonat die anteilige Beitragsbemessungsgrenze noch nicht erreicht hat. Bei 7.000 € Monatsbrutto ist die Grenze für Kranken- und Pflegeversicherung im November schon ausgeschöpft: Auf ${formatEUR(BEISPIEL_WG)} Weihnachtsgeld fallen dann nur noch ${formatEUR(hoch.svSumme)} Renten- und Arbeitslosenbeiträge an.`,
  },
  {
    q: "Was ist die Märzklausel?",
    a: "Wird eine Einmalzahlung von Januar bis März ausgezahlt und übersteigt sie die anteilige Beitragsbemessungsgrenze des neuen Jahres, wird sie für die Sozialversicherung dem Vorjahr zugeordnet (§ 23a Abs. 4 SGB IV). Für Weihnachtsgeld im November oder Dezember spielt sie keine Rolle; sie betrifft vor allem Boni, die im Frühjahr gezahlt werden.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Weihnachtsgeld-Rechner", item: URL },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "Weihnachtsgeld-Rechner 2026",
  url: URL,
  description: DESCRIPTION,
  dateModified: STAND.iso,
};

export default function WeihnachtsgeldRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <WeihnachtsgeldRechner faqs={faqs} content={<WeihnachtsgeldContent />} stand={STAND} />
      {/* Coffee section before the curated related block: that block keeps it
          apart from the end-of-content ad (see components/SupportStory.tsx). */}
      <SupportButton variant="story" lang="de" placement="page_inline" />
      <RelatedCalculators
        links={[
          { href: "/", label: "Brutto-Netto-Rechner", desc: "Reguläres Nettogehalt 2026/2027 berechnen" },
          { href: "/jahressonderzahlung-rechner", label: "Jahressonderzahlung-Rechner", desc: "Weihnachtsgeld im TVöD und TV-L" },
          { href: "/bonus-steuerrechner", label: "Bonus-Steuerrechner", desc: "Urlaubsgeld, Bonus & Einmalzahlungen" },
          { href: "/minijob-rechner", label: "Minijob-Rechner", desc: "Verdienstgrenze 603 € / 633 € prüfen" },
        ]}
      />
    </>
  );
}
