import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Gavel, ArrowRight } from "lucide-react";
import SozialabgabenRechner2027 from "./SozialabgabenRechner2027";
import ReviewerByline from "@/components/ReviewerByline";
import { formatEUR, SV_RECHENGROESSEN_2027_ENTWURF as E } from "@/lib/taxCalculator";
import { SV_2026, sv2027, berechneSv, RV_SATZ_2027_ERWARTET } from "@/lib/sozialabgaben2027";
import { siteConfig } from "@/lib/authors";

/**
 * Sozialabgaben-Rechner 2027 — "Wie viel mehr zahle ich 2027?"
 *
 * Ergänzt /beitragsbemessungsgrenze-2027 (Referenzseite zu den Grenzwerten)
 * um die interaktive Frage, die Suchende eigentlich stellen: Was kostet mich
 * das bei MEINEM Gehalt? Jede 2027-Annahme ist auf der Seite benannt und im
 * Rechner verstellbar — beschlossen ist bislang keiner der 2027-Werte.
 */

const BASE = "https://bruttonettocalculator.com";
const CANONICAL = `${BASE}/sozialabgaben-rechner-2027`;

const TITLE = "Sozialabgaben-Rechner 2027: Wie viel mehr zahlen Sie?";
const DESCRIPTION =
  "Sozialabgaben 2027 berechnen: höhere Beitragsbemessungsgrenzen, Rentenbeitrag 18,8 % und Zusatzbeitrag — Ihre Mehrbelastung 2026 vs. 2027 je Monat.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "sozialabgaben 2027",
    "sozialabgaben rechner 2027",
    "sozialversicherungsbeiträge 2027",
    "rentenbeitrag 2027",
    "zusatzbeitrag 2027",
    "beitragsbemessungsgrenze 2027 rechner",
    "mehrbelastung 2027",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
    images: [`${BASE}/og-image.png`],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/* Beispielrechnung mit den Standardannahmen des Rechners. */
const ZB_BEISPIEL = 0.033;
const WERTE_2027 = sv2027({ rvSatz: RV_SATZ_2027_ERWARTET, kvZusatzbeitrag: ZB_BEISPIEL });
const BEISPIELE = [3000, 4500, 5812.5, 6500, 8000, 8850, 10000].map((monat) => {
  const person = { bruttoJahr: monat * 12, kinder: 0, ueber23: true, sachsen: false };
  const a = berechneSv(SV_2026, person).an.summe / 12;
  const b = berechneSv(WERTE_2027, person).an.summe / 12;
  return { monat, a, b, diff: b - a };
});
const HOECHST = BEISPIELE[BEISPIELE.length - 1];
const DURCHSCHNITT = BEISPIELE[1];

const eur0 = (v: number) => v.toLocaleString("de-DE", { maximumFractionDigits: 2 }) + " €";

const FAQS = [
  {
    q: "Steigen die Sozialabgaben 2027?",
    a:
      "Ja, für die meisten Beschäftigten. Drei Dinge wirken zusammen: Die Beitragsbemessungsgrenzen steigen nach dem Referentenentwurf des BMAS auf " +
      eur0(E.kvPvBbgJahr) +
      " (Kranken- und Pflegeversicherung) und " +
      eur0(E.rvAlvBbgJahr) +
      " (Renten- und Arbeitslosenversicherung) im Jahr, der Rentenbeitrag soll von 18,6 auf 18,8 % steigen, und für den durchschnittlichen Zusatzbeitrag der Krankenkassen erwarten Prognosen 3,1 bis 3,7 % statt 2,9 %.",
  },
  {
    q: "Wie viel mehr Sozialabgaben zahle ich 2027?",
    a:
      "Das hängt vom Gehalt ab. Mit Rentenbeitrag 18,8 % und einem Zusatzbeitrag von 3,3 % zahlt ein kinderloser Arbeitnehmer mit " +
      formatEUR(DURCHSCHNITT.monat) +
      " brutto rund " +
      formatEUR(DURCHSCHNITT.diff) +
      " mehr im Monat, bei " +
      formatEUR(HOECHST.monat) +
      " sind es etwa " +
      formatEUR(HOECHST.diff) +
      ". Der Rechner oben zeigt den Wert für Ihr Gehalt und Ihre Annahmen.",
  },
  {
    q: "Betrifft mich die höhere Beitragsbemessungsgrenze 2027?",
    a:
      "Nur, wenn Ihr Bruttogehalt über der Grenze von 2026 liegt — also über " +
      formatEUR(SV_2026.kvPvBbgJahr / 12) +
      " im Monat für Kranken- und Pflegeversicherung bzw. über " +
      formatEUR(SV_2026.rvAlvBbgJahr / 12) +
      " für Renten- und Arbeitslosenversicherung. Wer darunter verdient, spürt nur die höheren Beitragssätze.",
  },
  {
    q: "Steigt der Rentenbeitrag 2027 auf 18,8 %?",
    a:
      "Das ist der erwartete Wert: Nach dem Rentenversicherungsbericht und dem Rentenpaket soll der Beitragssatz zum 1. Januar 2027 von 18,6 auf 18,8 % steigen. Verbindlich festgelegt wird er mit der Beitragssatzverordnung im Herbst 2026. Im Rechner lässt sich die Erhöhung abschalten.",
  },
  {
    q: "Wie hoch wird der Zusatzbeitrag der Krankenkassen 2027?",
    a:
      "Den durchschnittlichen Zusatzbeitrag legt das Bundesgesundheitsministerium nach der Prognose des GKV-Schätzerkreises fest, die Mitte Oktober 2026 erwartet wird. Fachprognosen liegen zwischen 3,1 und 3,7 %. Der Beitrag Ihrer eigenen Kasse kann davon abweichen; im Rechner wählen Sie das Szenario selbst.",
  },
  {
    q: "Zahlt der Arbeitgeber 2027 auch mehr?",
    a:
      "Ja. Kranken-, Renten- und Arbeitslosenversicherung werden je zur Hälfte getragen, deshalb steigt der Arbeitgeberanteil im gleichen Maß. Nur Kinderlosenzuschlag und Kinderabschläge in der Pflegeversicherung betreffen allein den Arbeitnehmer.",
  },
];

export default function SozialabgabenRechner2027Page() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Sozialabgaben-Rechner 2027", item: CANONICAL },
    ],
  };
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": CANONICAL,
    url: CANONICAL,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "de-DE",
    dateModified: siteConfig.lastUpdatedISO,
    isPartOf: { "@id": `${BASE}/#website` },
    publisher: { "@id": `${BASE}/#organization` },
    citation: {
      "@type": "Legislation",
      name: "Referentenentwurf einer Sozialversicherungsrechengrößen-Verordnung 2027",
      legislationJurisdiction: "Deutschland",
      legislationDate: E.stand,
      url: E.quelle,
    },
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
            <span className="text-[#16181D] font-medium">Sozialabgaben-Rechner 2027</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E60A1C]/10 border border-[#E60A1C]/25 text-[#E60A1C] text-xs font-bold mb-4">
            <Gavel size={14} />
            Grenzen 2027 laut BMAS-Entwurf vom 21.09.2026
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight mb-4 max-w-4xl">
            Sozialabgaben-Rechner 2027: <span className="text-gradient-accent">Wie viel mehr zahlen Sie?</span>
          </h1>
          <p className="text-base sm:text-lg text-black/75 max-w-3xl leading-relaxed">
            Höhere Beitragsbemessungsgrenzen, ein Rentenbeitrag von voraussichtlich 18,8 % und steigende
            Zusatzbeiträge: Geben Sie Ihr Bruttogehalt ein und sehen Sie Ihre Beiträge 2026 und 2027
            nebeneinander — für jeden Versicherungszweig, für Sie und Ihren Arbeitgeber.
          </p>
          <div className="mt-5">
            <ReviewerByline />
          </div>
        </div>
      </section>

      <SozialabgabenRechner2027 />

      <div className="max-w-5xl mx-auto px-4 sm:px-5 pb-16 space-y-12">
        <section>
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-3">Was sich 2027 bei den Sozialabgaben ändert</h2>
          <div className="overflow-x-auto bg-white border border-black/[0.08] rounded-2xl">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left bg-black/[0.03] border-b border-black/[0.08]">
                  <th className="px-4 py-3 font-bold">Wert</th>
                  <th className="px-4 py-3 font-bold text-right">2026</th>
                  <th className="px-4 py-3 font-bold text-right">2027</th>
                  <th className="px-4 py-3 font-bold">Stand</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                <tr className="border-b border-black/[0.05]">
                  <td className="px-4 py-3">BBG Kranken- und Pflegeversicherung</td>
                  <td className="px-4 py-3 text-right">{eur0(SV_2026.kvPvBbgJahr)}</td>
                  <td className="px-4 py-3 text-right font-bold">{eur0(E.kvPvBbgJahr)}</td>
                  <td className="px-4 py-3 text-black/60">Referentenentwurf</td>
                </tr>
                <tr className="border-b border-black/[0.05]">
                  <td className="px-4 py-3">BBG Renten- und Arbeitslosenversicherung</td>
                  <td className="px-4 py-3 text-right">{eur0(SV_2026.rvAlvBbgJahr)}</td>
                  <td className="px-4 py-3 text-right font-bold">{eur0(E.rvAlvBbgJahr)}</td>
                  <td className="px-4 py-3 text-black/60">Referentenentwurf</td>
                </tr>
                <tr className="border-b border-black/[0.05]">
                  <td className="px-4 py-3">Versicherungspflichtgrenze</td>
                  <td className="px-4 py-3 text-right">77.400 €</td>
                  <td className="px-4 py-3 text-right font-bold">{eur0(E.versicherungspflichtgrenzeJahr)}</td>
                  <td className="px-4 py-3 text-black/60">Referentenentwurf</td>
                </tr>
                <tr className="border-b border-black/[0.05]">
                  <td className="px-4 py-3">Rentenversicherung</td>
                  <td className="px-4 py-3 text-right">18,6 %</td>
                  <td className="px-4 py-3 text-right font-bold">18,8 %</td>
                  <td className="px-4 py-3 text-black/60">erwartet, Verordnung Herbst 2026</td>
                </tr>
                <tr className="border-b border-black/[0.05]">
                  <td className="px-4 py-3">Ø Zusatzbeitrag Krankenversicherung</td>
                  <td className="px-4 py-3 text-right">2,9 %</td>
                  <td className="px-4 py-3 text-right font-bold">3,1–3,7 %</td>
                  <td className="px-4 py-3 text-black/60">Prognose, Festsetzung Okt./Nov. 2026</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Pflege- und Arbeitslosenversicherung</td>
                  <td className="px-4 py-3 text-right">3,6 % / 2,6 %</td>
                  <td className="px-4 py-3 text-right font-bold">3,6 % / 2,6 %</td>
                  <td className="px-4 py-3 text-black/60">keine Änderung beschlossen</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-black/60 mt-3">
            Details zu allen Grenzwerten auf der Seite{" "}
            <Link href="/beitragsbemessungsgrenze-2027" className="text-[#E60A1C] font-semibold hover:underline">
              Beitragsbemessungsgrenze 2027
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-3">Mehrbelastung nach Gehalt</h2>
          <p className="text-sm sm:text-base text-black/75 leading-relaxed mb-4">
            Arbeitnehmeranteil pro Monat, kinderlos ab 23, mit Rentenbeitrag 18,8 % und einem
            durchschnittlichen Zusatzbeitrag von 3,3 % (Mitte des Prognosekorridors). Bis zur alten Grenze
            steigen die Abgaben nur über die Sätze; darüber kommt der Effekt der höheren Grenzen hinzu —
            bis {formatEUR(E.rvAlvBbgMonat)} Brutto, ab dann ist der Höchstbeitrag erreicht.
          </p>
          <div className="overflow-x-auto bg-white border border-black/[0.08] rounded-2xl">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="text-left bg-black/[0.03] border-b border-black/[0.08]">
                  <th className="px-4 py-3 font-bold">Brutto / Monat</th>
                  <th className="px-4 py-3 font-bold text-right">Abgaben 2026</th>
                  <th className="px-4 py-3 font-bold text-right">Abgaben 2027</th>
                  <th className="px-4 py-3 font-bold text-right">Mehr pro Monat</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {BEISPIELE.map((b) => (
                  <tr key={b.monat} className="border-b border-black/[0.05] last:border-0">
                    <td className="px-4 py-3 font-semibold">{formatEUR(b.monat)}</td>
                    <td className="px-4 py-3 text-right">{formatEUR(b.a)}</td>
                    <td className="px-4 py-3 text-right">{formatEUR(b.b)}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#E60A1C]">+{formatEUR(b.diff)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-3">So rechnet der Rechner</h2>
          <div className="space-y-3 text-sm sm:text-base text-black/75 leading-relaxed">
            <p>
              Jeder Beitrag ergibt sich aus Bruttogehalt × Beitragssatz — aber nur bis zur jeweiligen
              Beitragsbemessungsgrenze. Kranken-, Renten- und Arbeitslosenversicherung teilen sich
              Arbeitnehmer und Arbeitgeber je zur Hälfte, den Zusatzbeitrag der Krankenkasse eingeschlossen.
            </p>
            <p>
              In der Pflegeversicherung zahlen Kinderlose ab 23 Jahren 0,6 Prozentpunkte zusätzlich; Eltern
              mit mehreren Kindern unter 25 bekommen ab dem zweiten bis zum fünften Kind je 0,25 Prozentpunkte
              Abschlag. In Sachsen trägt der Arbeitnehmer einen halben Prozentpunkt mehr, weil dort der
              Buß- und Bettag Feiertag geblieben ist.
            </p>
            <p>
              Die Mehrbelastung teilt der Rechner in zwei Teile: den Effekt der höheren Grenzen (neue Grenzen
              mit alten Sätzen) und den Effekt der höheren Sätze. So sehen Sie, ob Sie die Reform der Grenzen
              überhaupt betrifft. Für Gehälter bis {formatEUR(2000)} im Monat gilt der Übergangsbereich — dafür
              gibt es den{" "}
              <Link href="/midijob-rechner" className="text-[#E60A1C] font-semibold hover:underline">
                Midijob-Rechner
              </Link>
              .
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-4">Passende Rechner</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: "/brutto-netto-rechner-2027", label: "Brutto-Netto-Rechner 2027", text: "Netto 2027 mit Steuerreform" },
              { href: "/beitragsbemessungsgrenze-2027", label: "Beitragsbemessungsgrenze 2027", text: "Alle Grenzwerte im Detail" },
              { href: "/brutto-netto-rechner-krankenkasse", label: "Rechner mit Krankenkasse", text: "Zusatzbeitrag Ihrer Kasse" },
              { href: "/arbeitgeber-brutto-netto-rechner", label: "Arbeitgeber-Rechner", text: "Gesamtkosten einer Stelle" },
              { href: "/private-krankenversicherung-vs-gesetzlich", label: "PKV oder GKV?", text: "Lohnt sich der Wechsel?" },
              { href: "/", label: "Brutto-Netto-Rechner 2026", text: "Nettogehalt heute" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group flex items-center justify-between gap-2 bg-white hover:bg-[#F1F3F5] border border-black/[0.10] hover:border-[#E60A1C]/50 rounded-2xl px-4 py-3.5 transition-all"
              >
                <span>
                  <span className="block text-sm font-bold text-[#16181D]">{l.label}</span>
                  <span className="block text-xs text-black/50">{l.text}</span>
                </span>
                <ArrowRight size={16} className="text-[#E60A1C] flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
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
      </div>
    </div>
  );
}
