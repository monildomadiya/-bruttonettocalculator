import type { Metadata } from "next";
import Link from "next/link";
import { PiggyBank, Table2, Percent, CalendarClock, HelpCircle } from "lucide-react";
import RentenNettoRechner from "./RentenNettoRechner";
import Section from "@/components/ui/Section";
import TableOfContents from "@/components/TableOfContents";
import ReviewerByline from "@/components/ReviewerByline";
import {
  calculateRentenNetto,
  besteuerungsanteilProzent,
  steuerpflichtAbRente,
  AKTUELLER_RENTENWERT_2026,
} from "@/lib/renteNetto";
import { GRUNDFREIBETRAG, formatEUR } from "@/lib/taxCalculator";

const BASE = "https://bruttonettocalculator.com";
const CANONICAL = `${BASE}/rente-brutto-netto-rechner`;
const eur0 = (n: number) => n.toLocaleString("de-DE", { maximumFractionDigits: 0 });

const PAGE_TITLE = "Rente Brutto Netto Rechner 2026/2027 – Nettorente";
const PAGE_DESCRIPTION =
  "Nettorente 2026 und 2027 berechnen: Kranken- und Pflegeversicherung der Rentner, Besteuerungsanteil (2027: 84,5 %) und Steuer nach dem Gesetzentwurf.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "rente brutto netto rechner",
    "rente brutto netto 2027",
    "brutto netto rente 2027",
    "rente brutto netto rechner 2027",
    "brutto netto rentenrechner 2027",
    "nettorente berechnen",
    "wie viel rente netto",
    "rente netto 2026",
    "besteuerungsanteil rente 2027",
    "ab wann zahlen rentner steuern 2027",
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

const STUFEN = [1200, 1500, 1800, 2000, 2500, 3000];
const netto = (b: number, jahr: 2026 | 2027, beginn: number) =>
  calculateRentenNetto({ bruttoRenteMonat: b, rentenbeginn: beginn, jahr, kinderlos: false });

export default function RenteBruttoNettoPage() {
  const zeilen = STUFEN.map((b) => {
    const a = netto(b, 2026, 2026);
    const c = netto(b, 2027, 2026);
    const neu = netto(b, 2027, 2027);
    return { b, a, c, neu, diff: c.nettoRenteMonat - a.nettoRenteMonat };
  });
  const ab2026 = steuerpflichtAbRente(2026, 2026);
  const ab2027Bestand = steuerpflichtAbRente(2026, 2027);
  const ab2027Neu = steuerpflichtAbRente(2027, 2027);
  const bei2000 = zeilen.find((z) => z.b === 2000)!;

  const faqs = [
    {
      q: "Wie viel Rente bleibt 2027 netto?",
      a: `Bei ${formatEUR(2000)} Bruttorente (Rentenbeginn 2026, mit Kindern, ohne Kirchensteuer) bleiben 2026 ${formatEUR(bei2000.a.nettoRenteMonat)} netto. 2027 sind es nach dem Gesetzentwurf zur Steuerreform ${formatEUR(bei2000.c.nettoRenteMonat)} — ${formatEUR(bei2000.diff)} mehr im Monat, weil der Grundfreibetrag auf ${eur0(GRUNDFREIBETRAG.entwurf2027)} € steigt. Kranken- und Pflegeversicherung sind darin mit den Sätzen 2026 gerechnet; der Zusatzbeitrag 2027 steht noch nicht fest.`,
    },
    {
      q: "Wie hoch ist der Besteuerungsanteil der Rente 2027?",
      a: "Wer 2027 in Rente geht, versteuert 84,5 % der Rente, 15,5 % bleiben steuerfrei. Seit dem Wachstumschancengesetz steigt der Anteil je Rentenjahrgang nur noch um 0,5 Prozentpunkte (2026: 84 %, 2028: 85 %); 100 % werden erst für den Rentenbeginn 2058 erreicht. Der steuerfreie Teil wird im zweiten Rentenjahr als fester Euro-Betrag eingefroren.",
    },
    {
      q: "Ab welcher Rente zahlen Rentner 2027 Steuern?",
      a: `Nach dem Gesetzentwurf ab etwa ${formatEUR(ab2027Neu)} Bruttorente im Monat für Neurentner 2027 und ab etwa ${formatEUR(ab2027Bestand)} für Rentenbeginn 2026 — 2026 liegt die Grenze bei rund ${formatEUR(ab2026)}. Das gilt ohne weitere Einkünfte; Betriebsrenten, Mieten oder ein Minijob des Partners bei Zusammenveranlagung verschieben die Grenze.`,
    },
    {
      q: "Welche Abzüge gibt es von der Rente?",
      a: "Pflichtversicherte Rentner zahlen die Hälfte des allgemeinen Krankenversicherungsbeitrags (7,3 %) plus die Hälfte des Zusatzbeitrags ihrer Kasse, dazu den vollen Pflegeversicherungsbeitrag von 3,6 % (kinderlos 4,2 %). Renten- und Arbeitslosenversicherung entfallen. Ab einer bestimmten Rentenhöhe kommt Einkommensteuer hinzu — Rentner zahlen sie über die Steuererklärung, nicht als Lohnsteuer.",
    },
    {
      q: "Wann steigt die Rente 2027?",
      a: `Die Renten werden jeweils zum 1. Juli angepasst. Zum 1. Juli 2026 stieg der aktuelle Rentenwert um 4,24 % auf ${AKTUELLER_RENTENWERT_2026.toLocaleString("de-DE")} €. Die Erhöhung zum 1. Juli 2027 wird erst im Frühjahr 2027 festgelegt, wenn die Lohnentwicklung 2026 vorliegt — jede Zahl dafür ist bis dahin eine Prognose.`,
    },
    {
      q: "Gilt der Rechner auch für Beamtenpensionen?",
      a: "Nein. Pensionen werden wie Arbeitslohn voll versteuert (mit Versorgungsfreibetrag statt Besteuerungsanteil), und Beamte sind meist privat krankenversichert. Für das Netto im aktiven Dienst gibt es den Brutto-Netto-Rechner für Beamte.",
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
    isPartOf: { "@id": `${BASE}/#website` },
    description: PAGE_DESCRIPTION,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: BASE },
      { "@type": "ListItem", position: 2, name: "Rente Brutto Netto Rechner", item: CANONICAL },
    ],
  };

  const anteilJahre = [2005, 2010, 2015, 2020, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2030, 2040, 2058];

  return (
    <section className="w-full max-w-6xl mx-auto px-5 pt-6 sm:pt-20 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="mb-4 sm:mb-8">
        <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-4">
          <PiggyBank size={14} aria-hidden="true" /> Nettorente · 2026 und 2027
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#16181D] mb-3 sm:mb-4 tracking-tight">
          Rente Brutto Netto Rechner <span className="text-gradient-accent">2026/2027</span>
        </h1>
        <p className="text-base sm:text-xl text-black/80 max-w-4xl leading-relaxed">
          Was von der Bruttorente übrig bleibt: Kranken- und Pflegeversicherung der Rentner, Besteuerungsanteil
          nach Rentenbeginn und Steuer — für 2027 nach dem Gesetzentwurf zur Steuerreform.
        </p>
      </div>

      <TableOfContents
        className="mb-4 sm:mb-8"
        items={[
          { id: "tabelle", label: "Nettorente-Tabelle" },
          { id: "steuergrenze", label: "Ab wann Steuern?" },
          { id: "besteuerungsanteil", label: "Besteuerungsanteil" },
          { id: "2027", label: "Was 2027 feststeht" },
          { id: "faq", label: "Häufige Fragen" },
        ]}
      />

      <div className="mb-10 sm:mb-14">
        <RentenNettoRechner />
        <div className="flex justify-center mt-4">
          <ReviewerByline />
        </div>
      </div>

      <Section
        id="tabelle"
        eyebrow="Tabelle"
        eyebrowIcon={Table2}
        title="Nettorente 2026 und 2027 im Vergleich"
        intro="Pflichtversichert in der KVdR, mit Kindern, ohne Kirchensteuer und ohne weitere Einkünfte. Alle Werte rechnet die Engine dieser Seite."
      >
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px] text-sm sm:text-base">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3 px-3 sm:px-4">Bruttorente</th>
                <th className="py-3 px-3 sm:px-4 text-right">KV + PV</th>
                <th className="py-3 px-3 sm:px-4 text-right">Netto 2026</th>
                <th className="py-3 px-3 sm:px-4 text-right">Netto 2027*</th>
                <th className="py-3 px-3 sm:px-4 text-right">Differenz</th>
                <th className="py-3 px-3 sm:px-4 text-right">Neurentner 2027*</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {zeilen.map((z) => (
                <tr key={z.b}>
                  <td className="py-3 px-3 sm:px-4 font-bold text-[#16181D] font-mono">{formatEUR(z.b)}</td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono text-black/70">{formatEUR(z.a.kvMonat + z.a.pvMonat)}</td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono">{formatEUR(z.a.nettoRenteMonat)}</td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono font-bold text-[#16181D]">{formatEUR(z.c.nettoRenteMonat)}</td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono text-emerald-700">
                    {z.diff > 0 ? "+" : ""}
                    {formatEUR(z.diff)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono text-black/70">{formatEUR(z.neu.nettoRenteMonat)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3 leading-relaxed">
          Netto 2026 und 2027: Rentenbeginn 2026 (Besteuerungsanteil 84 %). Neurentner 2027: Rentenbeginn 2027
          (84,5 %). * 2027 mit dem Steuertarif des Gesetzentwurfs (BT-Drs. 21/8235) und den Kranken- und
          Pflegeversicherungssätzen 2026 — der Zusatzbeitrag 2027 wird erst im Herbst festgelegt.
        </p>
      </Section>

      <Section
        id="steuergrenze"
        variant="muted"
        eyebrow="Steuerpflicht"
        eyebrowIcon={Percent}
        title="Ab welcher Rente zahlen Rentner Steuern?"
        prose
      >
        <p>
          Steuer fällt erst an, wenn das zu versteuernde Einkommen über dem Grundfreibetrag liegt. Der steigt
          nach dem Gesetzentwurf 2027 von {eur0(GRUNDFREIBETRAG.amtlich2026)} € auf{" "}
          {eur0(GRUNDFREIBETRAG.entwurf2027)} € — gleichzeitig steigt aber der Besteuerungsanteil für jeden neuen
          Rentenjahrgang. Ohne weitere Einkünfte ergibt das diese Grenzen:
        </p>
        <ul className="space-y-2">
          <li>
            <strong className="text-[#16181D]">2026, Rentenbeginn 2026:</strong> ab rund {formatEUR(ab2026)} Bruttorente im Monat
          </li>
          <li>
            <strong className="text-[#16181D]">2027, Rentenbeginn 2026:</strong> ab rund {formatEUR(ab2027Bestand)}
          </li>
          <li>
            <strong className="text-[#16181D]">2027, Neurentner 2027:</strong> ab rund {formatEUR(ab2027Neu)}
          </li>
        </ul>
        <p>
          Wer darunter liegt, muss in der Regel keine Steuererklärung abgeben. Kommen Betriebsrenten, Mieten oder
          Kapitalerträge hinzu, verschiebt sich die Grenze nach unten. Wie sich das Arbeitseinkommen vor dem
          Ruhestand in Rentenpunkte umrechnet, zeigt der{" "}
          <Link href="/rentenpunkte-rechner" className="text-[#E60A1C] font-semibold hover:underline">
            Rentenpunkte-Rechner
          </Link>
          .
        </p>
      </Section>

      <Section
        id="besteuerungsanteil"
        eyebrow="Besteuerungsanteil"
        eyebrowIcon={Percent}
        title="Besteuerungsanteil nach Rentenbeginn"
        intro="Der Anteil hängt am Jahr des Rentenbeginns und gilt dann lebenslang. Seit dem Wachstumschancengesetz steigt er je Jahrgang nur noch um 0,5 Prozentpunkte."
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {anteilJahre.map((y) => (
            <div
              key={y}
              className={`rounded-xl border px-3 py-2.5 text-center ${
                y === 2027 ? "border-[#E60A1C]/40 bg-[#E60A1C]/[0.06]" : "border-black/[0.10] bg-[#FFFFFF]"
              }`}
            >
              <div className="text-xs font-mono text-black/55">{y === 2005 ? "bis 2005" : y}</div>
              <div className="font-mono font-bold text-[#16181D]">
                {besteuerungsanteilProzent(y).toLocaleString("de-DE")} %
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="2027"
        variant="muted"
        eyebrow="Stand"
        eyebrowIcon={CalendarClock}
        title="Rente 2027: Was feststeht und was noch offen ist"
        prose
      >
        <ul className="space-y-3">
          <li>
            <strong className="text-[#16181D]">Fest:</strong> Besteuerungsanteil 84,5 % für den Rentenbeginn 2027
            (geltendes Recht). Aktueller Rentenwert {AKTUELLER_RENTENWERT_2026.toLocaleString("de-DE")} € bis zum
            30. Juni 2027.
          </li>
          <li>
            <strong className="text-[#16181D]">Im Gesetzgebungsverfahren:</strong> Grundfreibetrag{" "}
            {eur0(GRUNDFREIBETRAG.entwurf2027)} € ab 2027 nach dem Gesetzentwurf zur Steuerreform — Stand und
            Termine auf der Seite{" "}
            <Link href="/brutto-netto-rechner-2027" className="text-[#E60A1C] font-semibold hover:underline">
              Brutto Netto Rechner 2027
            </Link>
            .
          </li>
          <li>
            <strong className="text-[#16181D]">Offen:</strong> die Rentenerhöhung zum 1. Juli 2027 (Festlegung im
            Frühjahr 2027) und der durchschnittliche Zusatzbeitrag der Krankenkassen 2027 (Bekanntgabe im Herbst
            2026). Beides fließt in diesen Rechner ein, sobald es amtlich ist.
          </li>
        </ul>
        <p>
          Hinterbliebene: Wie Einkommen auf die Witwenrente angerechnet wird, rechnet der{" "}
          <Link href="/witwenrente-rechner" className="text-[#E60A1C] font-semibold hover:underline">
            Witwenrente-Rechner
          </Link>
          . Mehr zu den einzelnen Abzügen steht im Ratgeber{" "}
          <Link href="/blog/rente-netto-berechnen" className="text-[#E60A1C] font-semibold hover:underline">
            Wie viel Rente netto bleibt
          </Link>
          .
        </p>
      </Section>

      <Section id="faq" variant="muted" eyebrow="FAQ" eyebrowIcon={HelpCircle} title="Häufige Fragen zur Nettorente">
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
