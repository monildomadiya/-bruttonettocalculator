import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, ArrowRight, Info } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import {
  branchenNachVerdienst,
  GESAMTWIRTSCHAFT_DURCHSCHNITT_2025,
  DESTATIS_BRANCHEN_QUELLE,
} from "@/data/branchen";
import { DESTATIS_JAHR_2025 } from "@/data/wage-stats";
import ReviewerByline from "@/components/ReviewerByline";
import AccordionFaq from "@/components/AccordionFaq";
import { siteConfig } from "@/lib/authors";

export const revalidate = 0;

const BASE = "https://bruttonettocalculator.com";
const URL = `${BASE}/brutto-netto`;

const eur0 = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const nettoMonat = (bruttoJahr: number) =>
  calculateNetto({
    bruttoMonat: bruttoJahr / 12,
    jahr: 2026,
    verheiratet: false,
    kinderlosUeber23: true,
    kirche: false,
    steuerklasse: 1,
  }).nettoMonat;

export const metadata: Metadata = {
  title: "Gehalt nach Branche 2026 – Brutto Netto im Vergleich",
  description:
    "Durchschnittsgehalt nach Branche: Pflege, Gastronomie, Handwerk, IT, Logistik, Handel, Industrie und öffentlicher Dienst im Brutto-Netto-Vergleich. Amtliche Destatis-Zahlen 2025, Netto engine-berechnet für 2026.",
  keywords: [
    "gehalt nach branche",
    "durchschnittsgehalt branche",
    "brutto netto vergleich branchen",
    "welche branche verdient am meisten",
    "gehaltsvergleich branchen deutschland",
    "durchschnittsverdienst wirtschaftszweig",
    "brutto netto pflege",
    "brutto netto gastronomie",
    "brutto netto handwerk",
    "brutto netto it",
  ],
  alternates: { canonical: URL },
  openGraph: {
    images: [`${BASE}/og-image.png`],
    title: "Gehalt nach Branche 2026 – Brutto Netto im Vergleich",
    description:
      "Durchschnittsgehälter nach Wirtschaftszweig (Destatis 2025) mit engine-berechnetem Nettogehalt 2026.",
    url: URL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
  },
};

export default function BranchenHubPage() {
  const branchen = branchenNachVerdienst();
  const maxWert = Math.max(...branchen.map((b) => b.durchschnittJahr), GESAMTWIRTSCHAFT_DURCHSCHNITT_2025);
  const spanne = branchen[0].durchschnittJahr - branchen[branchen.length - 1].durchschnittJahr;

  const faqs = [
    {
      q: "Welche Branche verdient in Deutschland am meisten?",
      a: `Von den hier verglichenen Branchen liegt ${branchen[0].name} mit ${eur0(branchen[0].durchschnittJahr)} durchschnittlichem Bruttojahresverdienst vorn, am unteren Ende steht ${branchen[branchen.length - 1].name} mit ${eur0(branchen[branchen.length - 1].durchschnittJahr)}. Über alle Wirtschaftszweige hinweg führen die Finanz- und Versicherungsdienstleistungen (91.678 €) sowie die Energieversorgung (84.487 €).`,
    },
    {
      q: "Sind das Durchschnitts- oder Medianwerte?",
      a: `Alle Werte auf dieser Seite sind Durchschnitte (arithmetisches Mittel) für Vollzeitbeschäftigte, einschließlich Sonderzahlungen. Der Median liegt deutlich niedriger: In der Gesamtwirtschaft standen 2025 einem Durchschnitt von ${eur0(GESAMTWIRTSCHAFT_DURCHSCHNITT_2025)} ein Median von ${eur0(DESTATIS_JAHR_2025.medianJahr)} gegenüber. Der Grund ist die schiefe Verteilung — wenige sehr hohe Gehälter heben den Durchschnitt, während der Median die tatsächliche Mitte markiert.`,
    },
    {
      q: "Warum ist der Netto-Unterschied kleiner als der Brutto-Unterschied?",
      a: `Weil der Einkommensteuertarif progressiv ist: Mit steigendem Brutto steigt der Steuersatz, sodass von jedem zusätzlichen Euro anteilig weniger übrig bleibt. Zwischen der bestbezahlten und der schlechtestbezahlten Branche in dieser Tabelle liegen brutto rund ${eur0(spanne)} im Jahr — netto fällt der Abstand spürbar geringer aus.`,
    },
    {
      q: "Gelten die Werte auch für Teilzeit und Minijob?",
      a: "Nein, alle Angaben beziehen sich auf Vollzeitbeschäftigte. Gerade in der Gastronomie und im Einzelhandel arbeitet ein großer Teil der Beschäftigten in Teilzeit oder im Minijob — der Branchendurchschnitt liegt dort also deutlich über dem, was viele tatsächlich verdienen.",
    },
    {
      q: "Wie aktuell sind die Zahlen?",
      a: `Die Verdienstangaben stammen aus der Verdiensterhebung des Statistischen Bundesamtes für das Berichtsjahr 2025 (Stand ${DESTATIS_BRANCHEN_QUELLE.stand}). Amtliche Verdienstdaten erscheinen mit etwa einem Jahr Verzug, aktuellere Werte liegen noch nicht vor. Die Nettobeträge sind dagegen mit den Steuer- und Sozialversicherungsparametern 2026 berechnet.`,
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
      { "@type": "ListItem", position: 1, name: "Startseite", item: BASE },
      { "@type": "ListItem", position: 2, name: "Gehalt nach Branche", item: URL },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Durchschnittsgehalt nach Branche in Deutschland",
    itemListElement: branchen.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Brutto Netto ${b.name}`,
      url: `${BASE}/brutto-netto/${b.slug}`,
    })),
  };

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    isPartOf: { "@id": `${BASE}/#website` },
    name: "Gehalt nach Branche 2026 – Brutto Netto im Vergleich",
    url: URL,
    inLanguage: "de-DE",
    dateModified: siteConfig.lastUpdatedISO,
    citation: {
      "@type": "Dataset",
      name: DESTATIS_BRANCHEN_QUELLE.titel,
      creator: { "@type": "Organization", name: DESTATIS_BRANCHEN_QUELLE.herausgeber },
      url: DESTATIS_BRANCHEN_QUELLE.url,
    },
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Briefcase size={14} />
            {branchen.length} Branchen · Destatis 2025
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Gehalt nach{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              Branche
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Was verdient man in Pflege, Gastronomie, Handwerk oder IT — und was bleibt davon netto
            übrig? Amtliche Durchschnittsverdienste 2025, kombiniert mit dem Nettogehalt nach dem
            Steuerrecht 2026. Jede Branche hat dabei ihre eigenen Steuerregeln.
          </p>
        </div>
      </section>

      {/* ── Vergleich: CSS-Balken statt SVG, damit die Darstellung auf dem
             Handy umbricht statt seitlich zu scrollen ── */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
          Durchschnittliches Bruttojahresgehalt im Vergleich
        </h2>
        <p className="text-sm sm:text-base text-black/70 leading-relaxed mb-7">
          Vollzeitbeschäftigte, einschließlich Sonderzahlungen. Die gestrichelte Marke zeigt den
          Durchschnitt über alle Wirtschaftszweige ({eur0(GESAMTWIRTSCHAFT_DURCHSCHNITT_2025)}).
        </p>

        <div className="bg-white border border-black/[0.10] rounded-3xl p-6 sm:p-8">
          <ul className="space-y-5">
            {branchen.map((b) => {
              const pct = (b.durchschnittJahr / maxWert) * 100;
              const ueberSchnitt = b.durchschnittJahr >= GESAMTWIRTSCHAFT_DURCHSCHNITT_2025;
              return (
                <li key={b.slug}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
                    <Link
                      href={`/brutto-netto/${b.slug}`}
                      className="font-bold text-[#16181D] hover:text-[#E60A1C] transition-colors"
                    >
                      {b.name}
                    </Link>
                    <span className="text-sm text-black/60">
                      <strong className="text-[#16181D]">{eur0(b.durchschnittJahr)}</strong> brutto/Jahr ·{" "}
                      {eur0(nettoMonat(b.durchschnittJahr))} netto/Monat
                    </span>
                  </div>
                  <div className="relative h-3 bg-[#F4F5F7] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${ueberSchnitt ? "bg-[#E60A1C]" : "bg-[#E60A1C]/45"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 pt-5 border-t border-black/[0.08] text-sm text-black/60">
            Ø alle Wirtschaftszweige:{" "}
            <strong className="text-[#16181D]">{eur0(GESAMTWIRTSCHAFT_DURCHSCHNITT_2025)}</strong> brutto
            im Jahr — Median: <strong className="text-[#16181D]">{eur0(DESTATIS_JAHR_2025.medianJahr)}</strong>.
          </div>
        </div>
      </section>

      {/* ── Tabelle ── */}
      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-white border border-black/[0.10] rounded-3xl p-5 sm:p-7 overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[520px]">
            <caption className="text-left text-base font-bold text-[#16181D] mb-4">
              Brutto und Netto nach Branche im Überblick
            </caption>
            <thead>
              <tr className="text-left text-black/55">
                <th scope="col" className="py-2.5 pr-4 font-semibold">Branche</th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">Ø Brutto / Jahr</th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">Ø Brutto / Monat</th>
                <th scope="col" className="py-2.5 font-semibold">Netto / Monat (SK&nbsp;I)</th>
              </tr>
            </thead>
            <tbody>
              {branchen.map((b) => (
                <tr key={b.slug} className="border-t border-black/[0.07]">
                  <th scope="row" className="py-3 pr-4 text-left">
                    <Link
                      href={`/brutto-netto/${b.slug}`}
                      className="font-bold text-[#16181D] hover:text-[#E60A1C] transition-colors"
                    >
                      {b.name}
                    </Link>
                    <span className="block text-xs text-black/45 font-normal mt-0.5">{b.wzName}</span>
                  </th>
                  <td className="py-3 pr-4 font-semibold text-black/80 whitespace-nowrap">
                    {eur0(b.durchschnittJahr)}
                  </td>
                  <td className="py-3 pr-4 text-black/70 whitespace-nowrap">
                    {eur0(b.durchschnittJahr / 12)}
                  </td>
                  <td className="py-3 font-bold text-[#E60A1C] whitespace-nowrap">
                    {formatEUR(nettoMonat(b.durchschnittJahr))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 bg-white border border-black/[0.10] rounded-3xl p-6 flex items-start gap-4">
          <Info size={20} className="text-[#E60A1C] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm sm:text-base text-black/75 leading-relaxed">
            <strong className="text-[#16181D]">Durchschnitt, nicht Median.</strong> Diese Werte sind
            arithmetische Mittel — wenige sehr hohe Gehälter ziehen sie nach oben. Der Median der
            Gesamtwirtschaft lag 2025 bei {eur0(DESTATIS_JAHR_2025.medianJahr)}, also{" "}
            {eur0(GESAMTWIRTSCHAFT_DURCHSCHNITT_2025 - DESTATIS_JAHR_2025.medianJahr)} unter dem
            Durchschnitt. Wo Ihr eigenes Gehalt in der Verteilung steht, zeigt die{" "}
            <Link href="/brutto-netto-gehaltstabelle" className="text-[#E60A1C] font-semibold hover:underline">
              Brutto-Netto-Gehaltstabelle
            </Link>
            .
          </p>
        </div>

        <p className="text-xs text-black/50 leading-relaxed mt-4">
          Quelle: {DESTATIS_BRANCHEN_QUELLE.herausgeber},{" "}
          <a
            href={DESTATIS_BRANCHEN_QUELLE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E60A1C] hover:underline"
          >
            {DESTATIS_BRANCHEN_QUELLE.titel}
          </a>{" "}
          (Stand {DESTATIS_BRANCHEN_QUELLE.stand}). Nettobeträge berechnet nach dem Steuer- und
          Sozialversicherungsrecht 2026, Steuerklasse I, kinderlos, ohne Kirchensteuer.
        </p>
        <div className="mt-6">
          <ReviewerByline />
        </div>
      </section>

      {/* ── Branchen-Karten mit dem jeweiligen Steuerthema ── */}
      <section className="max-w-6xl mx-auto px-5 py-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
          Jede Branche hat ihre eigene Steuerregel
        </h2>
        <p className="text-sm sm:text-base text-black/70 leading-relaxed mb-7">
          Der Unterschied beim Netto entsteht nicht nur durch die Höhe des Gehalts. Steuerfreie
          Zuschläge, Pauschalen und Freibeträge wirken je nach Branche völlig verschieden.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          {branchen.map((b) => (
            <Link
              key={b.slug}
              href={`/brutto-netto/${b.slug}`}
              className="group bg-white border border-black/[0.10] rounded-3xl p-7 hover:border-[#E60A1C]/40 transition-colors"
            >
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <h3 className="text-lg font-extrabold text-[#16181D] group-hover:text-[#E60A1C] transition-colors">
                  {b.name}
                </h3>
                <span className="text-sm font-semibold text-black/55 whitespace-nowrap">
                  {eur0(b.durchschnittJahr)}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#E60A1C] mb-2">{b.besonderheit.titel}</p>
              <p className="text-sm text-black/65 leading-relaxed line-clamp-3">{b.kontext}</p>
              <span className="text-sm text-[#E60A1C] font-semibold inline-flex items-center gap-1 mt-4">
                Zur Branche <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-10 pb-20">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">Häufige Fragen</h2>
        <AccordionFaq faqs={faqs} />
      </section>
    </div>
  );
}
