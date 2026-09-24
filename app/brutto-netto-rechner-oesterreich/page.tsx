import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MapPin, ArrowRight } from "lucide-react";
import RechnerOesterreich from "./RechnerOesterreich";
import { siteConfig } from "@/lib/authors";
import { AT_2026, berechneBruttoNettoAT, formatEURat as eur } from "@/lib/oesterreich";

/**
 * Brutto-Netto-Rechner Österreich 2026.
 *
 * Eigenständige Seite für den österreichischen Markt (Angestellte, 14
 * Gehälter). Rechenlogik und Quellen: lib/oesterreich.ts, Prüfpunkte:
 * scripts/oesterreich.test.mts. Kein hreflang zur deutschen Startseite: Die
 * Seiten sind keine Übersetzungen voneinander, sondern rechnen verschiedenes
 * Recht — ein hreflang-Paar würde Google Gleichwertigkeit signalisieren.
 */

const BASE = "https://bruttonettocalculator.com";
const CANONICAL = `${BASE}/brutto-netto-rechner-oesterreich`;

const TITLE = "Brutto Netto Rechner Österreich 2026 — mit 13. & 14. Gehalt";
const DESCRIPTION =
  "Brutto Netto Rechner Österreich 2026: Nettogehalt, Urlaubs- und Weihnachtsgeld, Familienbonus Plus, Pendlerpauschale und Arbeitgeberkosten berechnen.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "brutto netto rechner österreich",
    "brutto netto rechner österreich 2026",
    "gehaltsrechner österreich",
    "lohnrechner österreich",
    "nettogehalt österreich berechnen",
    "13. und 14. gehalt netto",
    "lohnsteuer österreich 2026",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "website",
    locale: "de_AT",
    siteName: "BruttoNettoCalculator.com",
    images: [`${BASE}/og-image.png`],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const STANDARD = {
  bundesland: "niederoesterreich" as const,
  gehaelter: 14 as const,
  kinderUnter18: 0,
  kinderAb18: 0,
  familienbonusVoll: true,
  avab: false,
  pendler: "keine" as const,
  pendlerKm: 0,
};

const TABELLE = [1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000].map((brutto) => {
  const r = berechneBruttoNettoAT({ ...STANDARD, bruttoMonat: brutto });
  return { brutto, netto: r.laufend.netto, sv: r.laufend.sv, lst: r.laufend.lohnsteuer, jahr: r.jahr.netto };
});
const REF = TABELLE.find((t) => t.brutto === 3000)!;

const eur0 = (v: number) => v.toLocaleString("de-AT") + " €";

const FAQS = [
  {
    q: "Wie viel netto bleibt von 3.000 € brutto in Österreich?",
    a:
      "Als Angestellte oder Angestellter ohne Absetzbeträge bleiben 2026 von 3.000 € brutto " +
      eur(REF.netto) +
      " netto im Monat: " +
      eur(REF.sv) +
      " gehen an die Sozialversicherung, " +
      eur(REF.lst) +
      " sind Lohnsteuer. Mit Urlaubs- und Weihnachtsgeld ergibt das " +
      eur(REF.jahr) +
      " netto im Jahr. In Wien ist das Netto wegen des höheren Wohnbauförderungsbeitrags etwas geringer.",
  },
  {
    q: "Wie hoch ist die Sozialversicherung 2026 in Österreich?",
    a:
      "Angestellte zahlen 18,07 % vom laufenden Bruttogehalt: 3,87 % Kranken-, 10,25 % Pensions- und 2,95 % Arbeitslosenversicherung, 0,5 % Arbeiterkammerumlage und 0,5 % Wohnbauförderung. In Wien sind es seit 1.1.2026 18,32 %, weil der Wohnbauförderungsbeitrag dort gestiegen ist. Beiträge fallen höchstens bis zur Höchstbeitragsgrundlage von " +
      eur0(AT_2026.sv.hoechstbeitragsgrundlageMonat) +
      " im Monat an; bei niedrigem Einkommen bis " +
      eur0(2630) +
      " sinkt der Arbeitslosenversicherungsbeitrag.",
  },
  {
    q: "Wie werden das 13. und 14. Gehalt versteuert?",
    a:
      "Urlaubs- und Weihnachtsgeld sind begünstigt: Nach Abzug der Sozialversicherung bleiben 620 € im Jahr steuerfrei, der Rest wird mit festen 6 % besteuert statt nach dem Tarif. Liegt das Jahressechstel unter 2.615 €, sind beide Sonderzahlungen ganz steuerfrei. AK-Umlage und Wohnbauförderung fallen auf Sonderzahlungen nicht an.",
  },
  {
    q: "Welche Steuerstufen gelten 2026 in Österreich?",
    a:
      "Bis 13.539 € Jahreseinkommen sind 0 % fällig, darüber 20 % bis 21.992 €, 30 % bis 36.458 €, 40 % bis 70.365 €, 48 % bis 104.859 €, 50 % bis 1 Million € und 55 % darüber. Die Grenzen wurden 2026 um zwei Drittel der Inflation, also 1,733 %, angehoben.",
  },
  {
    q: "Wie wirkt der Familienbonus Plus auf mein Netto?",
    a:
      "Der Familienbonus Plus senkt die Lohnsteuer direkt: um bis zu 2.000,16 € im Jahr (166,68 € im Monat) pro Kind unter 18 und um bis zu 700,08 € pro Kind ab 18, solange Familienbeihilfe bezogen wird. Er kann einem Elternteil ganz oder beiden je zur Hälfte zustehen und wirkt nur bis zur Höhe der Lohnsteuer. Über die Lohnverrechnung gilt er, wenn Sie beim Arbeitgeber das Formular E 30 abgeben.",
  },
  {
    q: "Was kostet ein Angestellter den Arbeitgeber in Österreich?",
    a:
      "Zum Bruttogehalt kommen rund 29 bis 30 % Lohnnebenkosten: 20,98 % Dienstgeberanteil zur Sozialversicherung (in Wien 21,23 %), 1,53 % Mitarbeitervorsorge, 3,7 % Dienstgeberbeitrag, der Zuschlag zum Dienstgeberbeitrag von 0,31 bis 0,40 % je nach Bundesland und 3 % Kommunalsteuer. Der Rechner zeigt die Summe für Ihr Bundesland.",
  },
];

export default function BruttoNettoRechnerOesterreichPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Brutto-Netto-Rechner Österreich", item: CANONICAL },
    ],
  };
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": CANONICAL,
    url: CANONICAL,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "de-AT",
    dateModified: siteConfig.lastUpdatedISO,
    isPartOf: { "@id": `${BASE}/#website` },
    publisher: { "@id": `${BASE}/#organization` },
    about: { "@type": "Country", name: "Österreich" },
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="tool-hero relative border-b border-black/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 pt-8 sm:pt-10 pb-14 sm:pb-20">
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-black/50 mb-6 flex-wrap" aria-label="Brotkrumen">
            <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
            <ChevronRight size={14} className="flex-shrink-0" />
            <span className="text-[#16181D] font-medium">Brutto-Netto-Rechner Österreich</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E60A1C]/10 border border-[#E60A1C]/25 text-[#E60A1C] text-xs font-bold mb-4">
            <MapPin size={14} />
            Österreich · Werte 2026
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight mb-4 max-w-4xl">
            Brutto Netto Rechner <span className="text-gradient-accent">Österreich 2026</span>
          </h1>
          <p className="text-base sm:text-lg text-black/75 max-w-3xl leading-relaxed">
            Nettogehalt für Angestellte in Österreich — mit Sozialversicherung, Lohnsteuer nach dem Tarif 2026,
            Urlaubs- und Weihnachtsgeld, Familienbonus Plus, Pendlerpauschale und den Kosten für Ihren
            Arbeitgeber. Alle neun Bundesländer, inklusive höherer Wohnbauförderung in Wien.
          </p>
        </div>
      </section>

      <RechnerOesterreich />

      <div className="max-w-5xl mx-auto px-4 sm:px-5 pb-16 space-y-12">
        <section>
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-3">Brutto-Netto-Tabelle Österreich 2026</h2>
          <p className="text-sm sm:text-base text-black/75 leading-relaxed mb-4">
            Angestellte, 14 Gehälter, ohne Kinder und Pendlerpauschale, Bundesland außerhalb Wiens.
          </p>
          <div className="overflow-x-auto bg-white border border-black/[0.08] rounded-2xl">
            <table className="w-full text-sm min-w-[560px] tabular-nums">
              <thead>
                <tr className="text-left bg-black/[0.03] border-b border-black/[0.08]">
                  <th className="px-4 py-3 font-bold">Brutto / Monat</th>
                  <th className="px-4 py-3 font-bold text-right">Sozialversicherung</th>
                  <th className="px-4 py-3 font-bold text-right">Lohnsteuer</th>
                  <th className="px-4 py-3 font-bold text-right">Netto / Monat</th>
                  <th className="px-4 py-3 font-bold text-right">Netto / Jahr</th>
                </tr>
              </thead>
              <tbody>
                {TABELLE.map((t) => (
                  <tr key={t.brutto} className="border-b border-black/[0.05] last:border-0">
                    <td className="px-4 py-3 font-semibold">{eur(t.brutto)}</td>
                    <td className="px-4 py-3 text-right">{eur(t.sv)}</td>
                    <td className="px-4 py-3 text-right">{eur(t.lst)}</td>
                    <td className="px-4 py-3 text-right font-bold">{eur(t.netto)}</td>
                    <td className="px-4 py-3 text-right">{eur(t.jahr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-3">So wird das Nettogehalt in Österreich berechnet</h2>
          <ol className="space-y-3 text-sm sm:text-base text-black/75 leading-relaxed list-decimal pl-5">
            <li>
              <strong className="text-[#16181D]">Sozialversicherung abziehen:</strong> 18,07 % vom Bruttogehalt
              (Wien 18,32 %), höchstens von {eur0(AT_2026.sv.hoechstbeitragsgrundlageMonat)} im Monat. Bis{" "}
              {eur0(2225)} brutto entfällt der Arbeitslosenversicherungsbeitrag, bis {eur0(2630)} ist er ermäßigt.
              Unter der Geringfügigkeitsgrenze von {eur(AT_2026.sv.geringfuegigkeitsgrenze)} fallen keine
              Dienstnehmerbeiträge an.
            </li>
            <li>
              <strong className="text-[#16181D]">Lohnsteuer ermitteln:</strong> Das Monatsgehalt nach
              Sozialversicherung wird auf ein Jahr hochgerechnet, die Werbungskostenpauschale von 132 € und ein
              allfälliges Pendlerpauschale werden abgezogen, dann gilt der Tarif mit Stufen von 0 bis 55 %.
            </li>
            <li>
              <strong className="text-[#16181D]">Absetzbeträge abziehen:</strong> Der Verkehrsabsetzbetrag von{" "}
              {eur0(AT_2026.verkehrsabsetzbetrag)} steht allen Arbeitnehmern zu. Familienbonus Plus,
              Alleinverdiener- oder Alleinerzieherabsetzbetrag und Pendlereuro senken die Steuer zusätzlich.
            </li>
            <li>
              <strong className="text-[#16181D]">Sonderzahlungen gesondert:</strong> Urlaubs- und
              Weihnachtsgeld werden mit 6 % statt nach dem Tarif besteuert; 620 € im Jahr bleiben steuerfrei.
            </li>
          </ol>
        </section>

        <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6">
          <h2 className="text-xl font-extrabold text-[#16181D] mb-2">Sie arbeiten in Deutschland?</h2>
          <p className="text-sm sm:text-base text-black/75 leading-relaxed mb-4">
            Steuerklassen, Solidaritätszuschlag und deutsche Sozialabgaben rechnet unser deutscher Rechner.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E60A1C] hover:underline">
              Brutto-Netto-Rechner Deutschland <ArrowRight size={15} />
            </Link>
            <Link href="/sozialabgaben-rechner-2027" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E60A1C] hover:underline">
              Sozialabgaben 2027 in Deutschland <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-5">Häufige Fragen</h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group bg-white border border-black/[0.08] rounded-2xl p-5">
                <summary className="font-bold text-[#16181D] cursor-pointer list-none flex items-start justify-between gap-3">
                  {f.q}
                  <ChevronRight size={18} className="flex-shrink-0 mt-0.5 text-black/40 transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-sm sm:text-base text-black/75 leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="text-xs text-black/45 leading-relaxed">
          Quellen: Einkommensteuergesetz 1988 (§§ 33, 67) in der Fassung für 2026, BMF-Übersicht der
          Steuerabsetzbeträge, ÖGK „Sozialversicherungswerte 2026“ und „Erhöhung des
          Wohnbauförderungsbeitrages in Wien“, WKO-Werte zur Lohnverrechnung 2026. Angaben ohne Gewähr; die
          Arbeitnehmerveranlagung kann zu einer Gutschrift oder Nachzahlung führen.
        </p>
      </div>
    </div>
  );
}
