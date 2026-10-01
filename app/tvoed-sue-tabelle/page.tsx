import type { Metadata } from "next";
import Link from "next/link";
import { Baby, Table2, Wallet2, CalendarClock, HelpCircle } from "lucide-react";
import Section from "@/components/ui/Section";
import TableOfContents from "@/components/TableOfContents";
import ReviewerByline from "@/components/ReviewerByline";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import { TVOED_SUE_2026, SUE_STAND, SUE_STAND_ISO, SUE_GUELTIG_AB } from "@/data/tvoedSue";
import { GUELTIG_BIS, URLAUBSTAGE_AB_2027, JAHRESSONDERZAHLUNG_VKA_PROZENT } from "@/data/tvoed";

/**
 * TVöD SuE (S-Tabelle) mit Netto. Schließt die größte offene Lücke im
 * TVöD-Cluster: "tvöd sue tabelle 2026" war Breakout (08/2026), "tvöd sue" und
 * "gehaltserhöhung tvöd sue 2027" stiegen erneut (09/2026). Wie beim VKA-Hub
 * ist die Netto-Spalte das Alleinstellungsmerkmal.
 */

const BASE = "https://bruttonettocalculator.com";
const CANONICAL = `${BASE}/tvoed-sue-tabelle`;
const PAGE_TITLE = "TVöD SuE Tabelle 2026: S 2 bis S 18 mit Netto";
const PAGE_DESCRIPTION =
  "TVöD SuE Entgelttabelle ab 1. Mai 2026: alle S-Gruppen von S 2 bis S 18 in sechs Stufen — und was davon netto bleibt. Mit Erzieher-Beispiel S 8a.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "tvöd sue tabelle 2026",
    "tvöd sue entgelttabelle 2026",
    "tvöd sue",
    "tvöd sue 2027",
    "gehaltserhöhung tvöd sue 2027",
    "s 8a gehalt",
    "erzieher gehalt tvöd",
    "sozial- und erziehungsdienst tabelle",
    "tvöd sue netto",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
    images: [`${BASE}/og-image.png`],
  },
};

const netto = (brutto: number) =>
  calculateNetto({ bruttoMonat: brutto, jahr: 2026, verheiratet: false, kinderlosUeber23: false, kirche: false, steuerklasse: 1 }).nettoMonat;
const zahl = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TvoedSuePage() {
  // Absteigend wie in den amtlichen Tabellen (S 18 oben).
  const gruppen = [...TVOED_SUE_2026].reverse();
  const s8a = TVOED_SUE_2026.find((g) => g.slug === "s8a")!;

  const faqs = [
    {
      q: "Wie viel verdient eine Erzieherin im TVöD SuE 2026?",
      a: `Erzieherinnen und Erzieher sind in der Regel in S 8a eingruppiert. Seit dem ${SUE_GUELTIG_AB} sind das ${formatEUR(s8a.stufen[0])} brutto in Stufe 1 bis ${formatEUR(s8a.stufen[5])} in Stufe 6. Netto bleiben in Steuerklasse I davon rund ${formatEUR(netto(s8a.stufen[0]))} bis ${formatEUR(netto(s8a.stufen[5]))}.`,
    },
    {
      q: "Was ist der TVöD SuE?",
      a: "SuE steht für Sozial- und Erziehungsdienst. Für Beschäftigte in Kitas, in der Sozialarbeit, Jugend- und Behindertenhilfe bei Kommunen gilt innerhalb des TVöD eine eigene Entgelttabelle mit den Gruppen S 2 bis S 18 (Anlage C). Die Beträge weichen von der allgemeinen E-Tabelle ab.",
    },
    {
      q: "Wie stark ist der TVöD SuE 2026 gestiegen?",
      a: `Um 2,8 % zum ${SUE_GUELTIG_AB} — die zweite Stufe der Tarifeinigung vom April 2025, die auch für die allgemeine TVöD-Tabelle gilt. In S 8a Stufe 3 sind das zum Beispiel 108,32 € mehr im Monat.`,
    },
    {
      q: "Gibt es 2027 eine Gehaltserhöhung im TVöD SuE?",
      a: `Noch nicht vereinbart. Die Tabelle gilt mindestens bis zum ${GUELTIG_BIS} und danach weiter, bis ein neuer Abschluss steht; die Tarifrunde beginnt am 9. April 2027. Fest steht für 2027: ${URLAUBSTAGE_AB_2027} Urlaubstage und eine Jahressonderzahlung von ${JAHRESSONDERZAHLUNG_VKA_PROZENT} % bei den Kommunen.`,
    },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: PAGE_TITLE,
    url: CANONICAL,
    inLanguage: "de-DE",
    dateModified: SUE_STAND_ISO,
    isPartOf: { "@id": `${BASE}/#website` },
    description: PAGE_DESCRIPTION,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: BASE },
      { "@type": "ListItem", position: 2, name: "TVöD-Rechner", item: `${BASE}/tvoed-rechner` },
      { "@type": "ListItem", position: 3, name: "TVöD SuE Tabelle", item: CANONICAL },
    ],
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-5 pt-6 sm:pt-20 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="mb-4 sm:mb-8">
        <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-4">
          <Baby size={14} aria-hidden="true" /> Sozial- und Erziehungsdienst · ab {SUE_GUELTIG_AB}
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#16181D] mb-3 sm:mb-4 tracking-tight">
          TVöD SuE Tabelle <span className="text-gradient-accent">2026</span> — mit Netto
        </h1>
        <p className="text-base sm:text-xl text-black/80 max-w-4xl leading-relaxed">
          Alle 16 S-Gruppen von S 2 bis S 18 in sechs Stufen, gültig seit dem {SUE_GUELTIG_AB} (+2,8 %). Daneben steht,
          was in Steuerklasse I tatsächlich netto übrig bleibt.
        </p>
        <div className="mt-4">
          <ReviewerByline />
        </div>
      </div>

      <TableOfContents
        className="mb-6 sm:mb-10"
        items={[
          { id: "tabelle", label: "Brutto-Tabelle" },
          { id: "netto", label: "Netto je Gruppe" },
          { id: "erzieher", label: "Erzieher (S 8a)" },
          { id: "2027", label: "SuE 2027" },
          { id: "faq", label: "Häufige Fragen" },
        ]}
      />

      <Section
        id="tabelle"
        eyebrow="Entgelttabelle"
        eyebrowIcon={Table2}
        title="TVöD SuE Entgelttabelle 2026 (brutto)"
        intro={`Monatliches Tabellenentgelt in Euro, Vollzeit, ohne Zulagen und Jahressonderzahlung. Stand ${SUE_STAND}.`}
      >
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[640px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3 px-3">Gruppe</th>
                {[1, 2, 3, 4, 5, 6].map((s) => (
                  <th key={s} className="py-3 px-3 text-right">Stufe {s}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {gruppen.map((g) => (
                <tr key={g.slug} className={g.slug === "s8a" ? "bg-[#E60A1C]/[0.04]" : ""}>
                  <th scope="row" className="py-2.5 px-3 font-bold text-[#16181D] text-left whitespace-nowrap">{g.label}</th>
                  {g.stufen.map((v, i) => (
                    <td key={i} className="py-2.5 px-3 text-right font-mono whitespace-nowrap">{zahl(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3">
          TVöD-VKA, Anlage C (Sozial- und Erziehungsdienst). Werte in drei unabhängigen Übersichten abgeglichen. Die allgemeine
          E-Tabelle steht im{" "}
          <Link href="/tvoed-rechner" className="text-[#E60A1C] font-semibold hover:underline">TVöD-Rechner</Link>.
        </p>
      </Section>

      <Section
        id="netto"
        variant="muted"
        eyebrow="Netto"
        eyebrowIcon={Wallet2}
        title="Was netto bleibt: Stufe 1 bis Stufe 6"
        intro="Netto pro Monat in Steuerklasse I, mit Kindern, ohne Kirchensteuer, Werte 2026."
      >
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-base">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-normal sm:tracking-wider text-black/70">
                <th className="py-3 px-2 sm:px-4">Gruppe</th>
                <th className="py-3 px-2 sm:px-4 text-right">Netto Stufe 1</th>
                <th className="py-3 px-2 sm:px-4 text-right">Netto Stufe 6</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {gruppen.map((g) => (
                <tr key={g.slug}>
                  <th scope="row" className="py-2.5 px-2 sm:px-4 text-left font-bold text-[#16181D]">
                    {g.label}
                    {g.typisch && <span className="block text-xs font-normal text-black/55">{g.typisch}</span>}
                  </th>
                  <td className="py-2.5 px-2 sm:px-4 text-right font-mono whitespace-nowrap">{zahl(netto(g.stufen[0]))}</td>
                  <td className="py-2.5 px-2 sm:px-4 text-right font-mono whitespace-nowrap">{zahl(netto(g.stufen[5]))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3">
          Beträge in Euro. Eigene Steuerklasse oder Krankenkasse:{" "}
          <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner</Link>.
          „Typisch“ ist eine grobe Orientierung, keine verbindliche Eingruppierung.
        </p>
      </Section>

      <Section
        id="erzieher"
        eyebrow="Beispiel"
        eyebrowIcon={Baby}
        title="Erzieher-Gehalt im TVöD SuE: S 8a in allen Stufen"
      >
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-base">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-normal sm:tracking-wider text-black/70">
                <th className="py-3 px-2 sm:px-4">Stufe</th>
                <th className="py-3 px-2 sm:px-4 text-right">Brutto</th>
                <th className="py-3 px-2 sm:px-4 text-right">Netto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {s8a.stufen.map((v, i) => (
                <tr key={i}>
                  <th scope="row" className="py-2.5 px-2 sm:px-4 text-left font-bold text-[#16181D]">Stufe {i + 1}</th>
                  <td className="py-2.5 px-2 sm:px-4 text-right font-mono whitespace-nowrap">{formatEUR(v)}</td>
                  <td className="py-2.5 px-2 sm:px-4 text-right font-mono font-bold text-[#16181D] whitespace-nowrap">{formatEUR(netto(v))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="2027"
        variant="muted"
        eyebrow="Ausblick 2027"
        eyebrowIcon={CalendarClock}
        title="TVöD SuE 2027: Was feststeht"
        prose
      >
        <p>
          <strong className="text-[#16181D]">Eine Erhöhung für 2027 ist noch nicht vereinbart.</strong> Die S-Tabelle gilt
          mindestens bis zum {GUELTIG_BIS} und danach weiter, bis die Tarifrunde ein Ergebnis bringt; sie beginnt am 9. April
          2027 in Potsdam. Fest steht für 2027: {URLAUBSTAGE_AB_2027} Urlaubstage bei einer 5-Tage-Woche und eine
          Jahressonderzahlung von {JAHRESSONDERZAHLUNG_VKA_PROZENT} % bei den Kommunen. Alle Termine und ein Rechenbeispiel
          zu möglichen Erhöhungen stehen im{" "}
          <Link href="/tvoed-rechner#tvoed-2027" className="text-[#E60A1C] font-semibold hover:underline">
            TVöD-Ausblick 2027
          </Link>
          .
        </p>
      </Section>

      <Section id="faq" variant="muted" eyebrow="FAQ" eyebrowIcon={HelpCircle} title="Häufige Fragen zum TVöD SuE">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-sm sm:text-base">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-2">{f.q}</h3>
              <p className="text-black/70 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </Section>
    </section>
  );
}
