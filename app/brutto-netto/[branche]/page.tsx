import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, ChevronRight, Info, ScrollText, Sparkles, ArrowRight } from "lucide-react";
import { calculateNetto, formatEUR, Steuerklasse } from "@/lib/taxCalculator";
import {
  BRANCHEN,
  getBrancheBySlug,
  Branche,
  GESAMTWIRTSCHAFT_DURCHSCHNITT_2025,
  DESTATIS_BRANCHEN_QUELLE,
} from "@/data/branchen";
import Calculator from "@/components/Calculator";
import ReviewerByline from "@/components/ReviewerByline";
import AccordionFaq from "@/components/AccordionFaq";
import { siteConfig } from "@/lib/authors";

export const revalidate = 0;

interface PageProps {
  params: { branche: string };
}

export async function generateStaticParams() {
  return BRANCHEN.map((b) => ({ branche: b.slug }));
}

const BASE = "https://bruttonettocalculator.com";
const eur0 = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

function nettoFor(brutto: number, sk: Steuerklasse) {
  return calculateNetto({
    bruttoMonat: brutto,
    jahr: 2026,
    verheiratet: sk === 3,
    kinderlosUeber23: true,
    kirche: false,
    steuerklasse: sk,
  }).nettoMonat;
}

/**
 * Gehaltsstufen rund um den Branchendurchschnitt statt einer festen Leiter.
 * Eine Tabelle, die in der Gastronomie bei 6.000 € beginnt, beantwortet für
 * niemanden dort eine echte Frage — die Stufen werden deshalb aus dem
 * Branchenwert abgeleitet und auf 100 € gerundet.
 */
function gehaltsstufen(durchschnittMonat: number): number[] {
  const faktoren = [0.6, 0.8, 1, 1.2, 1.5, 2];
  const roh = faktoren.map((f) => Math.round((durchschnittMonat * f) / 100) * 100);
  return Array.from(new Set(roh)).sort((a, b) => a - b);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const br = getBrancheBySlug(params.branche);
  if (!br) return { title: "Branche nicht gefunden" };

  const durchschnittMonat = br.durchschnittJahr / 12;
  const netto = nettoFor(durchschnittMonat, 1);
  const canonical = `${BASE}/brutto-netto/${br.slug}`;
  const nameLower = br.name.toLowerCase();

  const title = `Brutto Netto ${br.name} 2026 – Gehalt & Nettolohn`;
  const description = `Was bleibt ${br.praep} netto? Durchschnittsgehalt ${eur0(br.durchschnittJahr)} brutto im Jahr — das sind rund ${eur0(netto)} netto im Monat (Steuerklasse I). Mit ${br.besonderheit.titel.split("(")[0].trim()}.`;

  return {
    title,
    description,
    keywords: [
      `brutto netto ${nameLower}`,
      `gehalt ${nameLower}`,
      `nettogehalt ${nameLower}`,
      `${nameLower} gehalt netto`,
      `durchschnittsgehalt ${nameLower}`,
      `was verdient man ${br.praep}`,
      `${nameLower} brutto netto rechner`,
      `gehaltsrechner ${nameLower}`,
      ...br.berufe.slice(0, 4).map((b) => `${b.toLowerCase()} gehalt netto`),
    ],
    alternates: { canonical },
    openGraph: {
      images: [`${BASE}/og-image.png`],
      title,
      description,
      url: canonical,
      type: "website",
      locale: "de_DE",
      siteName: "BruttoNettoCalculator.com",
    },
  };
}

export default function BranchePage({ params }: PageProps) {
  const br = getBrancheBySlug(params.branche);
  if (!br) notFound();

  const canonical = `${BASE}/brutto-netto/${br.slug}`;
  const durchschnittMonat = br.durchschnittJahr / 12;
  const stufen = gehaltsstufen(durchschnittMonat);
  const rows = stufen.map((brutto) => ({
    brutto,
    sk1: nettoFor(brutto, 1),
    sk3: nettoFor(brutto, 3),
  }));

  const vsGesamt = br.durchschnittJahr - GESAMTWIRTSCHAFT_DURCHSCHNITT_2025;
  const vsGesamtPct = (vsGesamt / GESAMTWIRTSCHAFT_DURCHSCHNITT_2025) * 100;
  const nettoDurchschnitt = nettoFor(durchschnittMonat, 1);
  const andere = BRANCHEN.filter((b) => b.slug !== br.slug);

  const faqs = [
    {
      q: `Was verdient man ${br.praep} durchschnittlich?`,
      a: `Der durchschnittliche Bruttojahresverdienst von Vollzeitbeschäftigten im Wirtschaftszweig „${br.wzName}" lag 2025 bei ${eur0(br.durchschnittJahr)} einschließlich Sonderzahlungen (Statistisches Bundesamt). Das entspricht rund ${eur0(durchschnittMonat)} brutto im Monat. Wichtig: Das ist der Durchschnitt, nicht der Median — einzelne hohe Gehälter ziehen ihn nach oben, die Hälfte der Beschäftigten verdient weniger.`,
    },
    {
      q: `Wie viel netto bleiben von ${eur0(durchschnittMonat)} brutto?`,
      a: `In Steuerklasse I ohne Kirchensteuer bleiben von ${eur0(durchschnittMonat)} brutto rund ${eur0(nettoDurchschnitt)} netto im Monat (Stand 2026, gesetzlich versichert, kinderlos). In Steuerklasse III sind es etwa ${eur0(nettoFor(durchschnittMonat, 3))}. Der genaue Betrag hängt von Steuerklasse, Kirchensteuer, Kinderfreibeträgen und dem Zusatzbeitrag Ihrer Krankenkasse ab.`,
    },
    {
      q: br.besonderheit.titel,
      a: br.besonderheit.text,
    },
    {
      q: `Ist der angegebene Verdienst ${br.praep} ein Median oder ein Durchschnitt?`,
      a: `Es ist der Durchschnitt (arithmetisches Mittel) der Vollzeitbeschäftigten. Der Median liegt regelmäßig darunter: In der Gesamtwirtschaft standen 2025 einem Durchschnitt von ${eur0(GESAMTWIRTSCHAFT_DURCHSCHNITT_2025)} ein Median von 54.066 € gegenüber. Wer wissen will, wo das eigene Gehalt in der Verteilung steht, nutzt dafür besser die Gehaltstabelle statt des Branchendurchschnitts.`,
    },
    {
      q: `Gilt der Wert auch für Teilzeit ${br.praep}?`,
      a: `Nein. Alle Angaben beziehen sich auf Vollzeitbeschäftigte. Bei Teilzeit sinkt das Brutto anteilig, das Netto aber nicht proportional — durch den progressiven Steuertarif und den Grundfreibetrag bleibt bei Teilzeit relativ mehr vom Brutto übrig. Rechnen Sie Ihren Fall mit dem Teilzeitrechner durch.`,
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
      { "@type": "ListItem", position: 2, name: "Gehalt nach Branche", item: `${BASE}/brutto-netto` },
      { "@type": "ListItem", position: 3, name: br.name, item: canonical },
    ],
  };

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    isPartOf: { "@id": `${BASE}/#website` },
    name: `Brutto Netto ${br.name} 2026`,
    url: canonical,
    inLanguage: "de-DE",
    dateModified: siteConfig.lastUpdatedISO,
    about: { "@type": "Thing", name: `Verdienste im Wirtschaftszweig ${br.wzName}` },
    spatialCoverage: { "@type": "Country", name: "Deutschland" },
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

      {/* ── Hero ── */}
      <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E60A1C]/[8%] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 py-20 sm:py-28 text-center">
          <nav aria-label="Brotkrumen" className="flex items-center justify-center gap-1.5 text-sm text-black/50 mb-6">
            <Link href="/" className="hover:text-[#E60A1C]">Start</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href="/brutto-netto" className="hover:text-[#E60A1C]">Branchen</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-black/70">{br.name}</span>
          </nav>

          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
            <Briefcase size={14} />
            Destatis 2025 · Vollzeit
          </div>

          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
            Brutto Netto{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
              {br.name}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Vollzeitbeschäftigte {br.praep} verdienten 2025 im Schnitt{" "}
            <strong className="text-[#16181D]">{eur0(br.durchschnittJahr)}</strong> brutto im Jahr — rund{" "}
            <strong className="text-[#16181D]">{eur0(durchschnittMonat)}</strong> im Monat. In Steuerklasse I
            bleiben davon etwa <strong className="text-[#16181D]">{eur0(nettoDurchschnitt)}</strong> netto.
          </p>
        </div>
      </section>

      {/* ── Kennzahlen ── */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid sm:grid-cols-3 gap-5">
          <div className="bg-white border border-black/[0.10] rounded-3xl p-7">
            <div className="text-sm text-black/55 mb-2">Ø Brutto pro Jahr</div>
            <div className="text-3xl font-extrabold text-[#16181D]">{eur0(br.durchschnittJahr)}</div>
            <div className="text-xs text-black/50 mt-2">Vollzeit, inkl. Sonderzahlungen</div>
          </div>
          <div className="bg-white border border-black/[0.10] rounded-3xl p-7">
            <div className="text-sm text-black/55 mb-2">Ø Netto pro Monat</div>
            <div className="text-3xl font-extrabold text-[#E60A1C]">{eur0(nettoDurchschnitt)}</div>
            <div className="text-xs text-black/50 mt-2">Steuerklasse I, ohne Kirchensteuer</div>
          </div>
          <div className="bg-white border border-black/[0.10] rounded-3xl p-7">
            <div className="text-sm text-black/55 mb-2">Gegenüber Gesamtwirtschaft</div>
            <div className={`text-3xl font-extrabold ${vsGesamt >= 0 ? "text-emerald-700" : "text-[#16181D]"}`}>
              {vsGesamt >= 0 ? "+" : "−"}
              {Math.abs(vsGesamtPct).toFixed(0)} %
            </div>
            <div className="text-xs text-black/50 mt-2">
              Ø alle Branchen: {eur0(GESAMTWIRTSCHAFT_DURCHSCHNITT_2025)}
            </div>
          </div>
        </div>

        {br.abgrenzung && (
          <div className="mt-5 bg-white border border-black/[0.10] rounded-3xl p-6 flex items-start gap-4">
            <Info size={20} className="text-[#E60A1C] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm sm:text-base text-black/75 leading-relaxed">
              <strong className="text-[#16181D]">Wozu die Zahl genau gehört:</strong> Das Statistische
              Bundesamt weist den Wert für den Wirtschaftszweig „{br.wzName}" aus. {br.abgrenzung}
            </p>
          </div>
        )}
      </section>

      {/* ── Der branchenspezifische Steuerteil: der eigentliche Mehrwert ── */}
      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-white border border-black/[0.10] rounded-3xl p-8 sm:p-10 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <ScrollText size={22} className="text-[#E60A1C]" aria-hidden="true" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
              {br.besonderheit.titel}
            </h2>
          </div>
          <p className="text-base text-black/75 leading-relaxed mb-6">{br.kontext}</p>
          <p className="text-base text-black/80 leading-relaxed border-l-4 border-[#E60A1C]/40 pl-5">
            {br.besonderheit.text}
          </p>
        </div>
      </section>

      {/* ── Engine-berechnete Tabelle ── */}
      <section className="max-w-6xl mx-auto px-5 py-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
          Brutto-Netto-Tabelle für typische Gehälter {br.praep}
        </h2>
        <p className="text-sm sm:text-base text-black/70 leading-relaxed mb-6">
          Die Stufen orientieren sich am Branchendurchschnitt. Berechnet mit derselben Engine wie der
          Hauptrechner — Stand {siteConfig.lastUpdatedDisplay}, gesetzlich versichert, kinderlos, ohne
          Kirchensteuer.
        </p>
        <div className="bg-white border border-black/[0.10] rounded-3xl p-5 sm:p-7 overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[420px]">
            <caption className="sr-only">
              Monatliches Nettogehalt nach Bruttogehalt und Steuerklasse, {br.name}, 2026
            </caption>
            <thead>
              <tr className="text-left text-black/55">
                <th scope="col" className="py-2.5 pr-4 font-semibold">Brutto / Monat</th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">Netto Steuerklasse I</th>
                <th scope="col" className="py-2.5 font-semibold">Netto Steuerklasse III</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const istDurchschnitt = Math.abs(r.brutto - durchschnittMonat) < 150;
                return (
                  <tr
                    key={r.brutto}
                    className={`border-t border-black/[0.07] ${istDurchschnitt ? "bg-[#E60A1C]/[0.04]" : ""}`}
                  >
                    <th scope="row" className="py-3 pr-4 font-bold text-[#16181D] text-left whitespace-nowrap">
                      {eur0(r.brutto)}
                      {istDurchschnitt && (
                        <span className="ml-2 text-[11px] font-mono uppercase tracking-wider text-[#E60A1C]">
                          ≈ Ø Branche
                        </span>
                      )}
                    </th>
                    <td className="py-3 pr-4 font-semibold text-black/80">{formatEUR(r.sk1)}</td>
                    <td className="py-3 font-semibold text-black/80">{formatEUR(r.sk3)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 leading-relaxed mt-4">
          Quelle der Gehaltsangaben: {DESTATIS_BRANCHEN_QUELLE.herausgeber},{" "}
          <a
            href={DESTATIS_BRANCHEN_QUELLE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E60A1C] hover:underline"
          >
            {DESTATIS_BRANCHEN_QUELLE.titel}
          </a>{" "}
          (Stand {DESTATIS_BRANCHEN_QUELLE.stand}). {DESTATIS_BRANCHEN_QUELLE.hinweis}
        </p>
        <div className="mt-6">
          <ReviewerByline />
        </div>
      </section>

      {/* ── Typische Berufe ── */}
      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-white border border-black/[0.10] rounded-3xl p-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-4">
            Typische Berufe {br.praep}
          </h2>
          <ul className="flex flex-wrap gap-2.5">
            {br.berufe.map((beruf) => (
              <li
                key={beruf}
                className="text-sm font-semibold text-black/70 bg-[#F4F5F7] border border-black/[0.08] px-4 py-2 rounded-full"
              >
                {beruf}
              </li>
            ))}
          </ul>
          <p className="text-sm text-black/60 leading-relaxed mt-5">
            Die Verdienste einzelner Berufe streuen innerhalb der Branche erheblich. Der Branchenwert
            oben ist ein Durchschnitt über alle Tätigkeiten und Qualifikationsstufen — für das eigene
            Gehalt rechnen Sie am besten direkt mit dem Rechner.
          </p>
        </div>
      </section>

      {/* ── Rechner ── */}
      <section className="max-w-6xl mx-auto px-5 py-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Ihr eigenes Nettogehalt berechnen
        </h2>
        <Calculator />
      </section>

      {/* ── Passende Rechner ── */}
      <section className="max-w-6xl mx-auto px-5 py-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5">
          Rechner, die {br.praep} besonders relevant sind
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {br.verwandteRechner.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group bg-white border border-black/[0.10] rounded-2xl p-5 hover:border-[#E60A1C]/40 transition-colors"
            >
              <div className="font-bold text-[#16181D] mb-1">{r.label}</div>
              <div className="text-sm text-[#E60A1C] font-semibold inline-flex items-center gap-1">
                Öffnen <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Cluster-Verlinkung ── */}
      <section className="max-w-6xl mx-auto px-5 py-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mb-5">
          Gehalt in anderen Branchen
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {andere.map((b) => (
            <Link
              key={b.slug}
              href={`/brutto-netto/${b.slug}`}
              className="group bg-white border border-black/[0.10] rounded-2xl p-5 hover:border-[#E60A1C]/40 transition-colors flex items-baseline justify-between gap-3"
            >
              <span className="font-bold text-[#16181D] group-hover:text-[#E60A1C] transition-colors">
                {b.name}
              </span>
              <span className="text-sm font-semibold text-black/55 whitespace-nowrap">
                {eur0(b.durchschnittJahr)}
              </span>
            </Link>
          ))}
        </div>
        <Link
          href="/brutto-netto"
          className="inline-flex items-center gap-2 mt-6 text-[#E60A1C] font-bold hover:underline"
        >
          <Sparkles size={16} /> Alle Branchen im Vergleich
        </Link>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-6xl mx-auto px-5 py-10 pb-20">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Häufige Fragen zum Gehalt {br.praep}
        </h2>
        <AccordionFaq faqs={faqs} />
      </section>
    </div>
  );
}
