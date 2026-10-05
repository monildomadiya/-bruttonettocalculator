import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, HeartPulse } from "lucide-react";
import {
  KRANKENKASSEN_2026,
  DURCHSCHNITT_ZUSATZBEITRAG_2026,
  ZUSATZBEITRAG_DURCHSCHNITT_2027,
  ALLGEMEINER_BEITRAGSSATZ,
  GUENSTIGSTE_KASSE,
  TEUERSTE_KASSE,
  ZUSATZBEITRAG_STAND,
  ZUSATZBEITRAG_STAND_ISO,
} from "@/data/krankenkassen";
import { BBG_2026, SV_RECHENGROESSEN_2027_ENTWURF, formatEUR } from "@/lib/taxCalculator";
import ZusatzbeitragVergleich from "./ZusatzbeitragVergleich";
import Zusatzbeitrag2027Ausblick from "@/components/Zusatzbeitrag2027Ausblick";
import AffiliateBox from "@/components/AffiliateBox";
import AccordionFaq from "@/components/AccordionFaq";
import ReviewerByline from "@/components/ReviewerByline";
import Section from "@/components/ui/Section";
import { pageImageUrl } from "@/lib/pageImage";
import { ORG_ID } from "@/lib/seo";

/*
 * /zusatzbeitrag-2027 — Listen-Intention ("alle Kassen im Vergleich").
 * Abgrenzung (SEO-Roadmap 2027, §14): Der Hub /brutto-netto-rechner-krankenkasse
 * bedient die Rechner-Intention, die /krankenkasse/<slug>-Seiten die Suche nach
 * einer einzelnen Kasse. Diese Seite besitzt "zusatzbeitrag 2027". Wenn im
 * Dezember die Sätze 2027 kommen, NICHT den Hub-Titel auf "Zusatzbeitrag 2027"
 * umstellen — sonst konkurrieren zwei eigene URLs um dasselbe Keyword.
 *
 * Datenpflege ausschließlich in data/krankenkassen.ts.
 */

const CANONICAL = "https://bruttonettocalculator.com/zusatzbeitrag-2027";
const TITLE = "Zusatzbeitrag 2027: Alle Krankenkassen im Vergleich";
const DESCRIPTION =
  "Zusatzbeitrag 2027 aller Krankenkassen: TK, AOK, Barmer, DAK, hkk & mehr im Vergleich – plus Rechner, was der neue Beitrag netto kostet.";

/** Stand der Seite (Text); der Datenstand der Sätze steht in ZUSATZBEITRAG_STAND. */
const SEITEN_STAND = "5. Oktober 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "zusatzbeitrag 2027",
    "krankenkasse zusatzbeitrag 2027",
    "durchschnittlicher zusatzbeitrag 2027",
    "tk zusatzbeitrag 2027",
    "aok zusatzbeitrag 2027",
    "barmer zusatzbeitrag 2027",
    "dak zusatzbeitrag 2027",
    "hkk zusatzbeitrag 2027",
    "bkk firmus zusatzbeitrag 2027",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    images: [pageImageUrl("/zusatzbeitrag-2027")],
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
  },
};

const pct = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + " %";
const bbgMonat2026 = BBG_2026.kvPvJahr / 12;
const bbgMonat2027 = SV_RECHENGROESSEN_2027_ENTWURF.kvPvBbgMonat;

// Antwort-Beispiel: Unterschied günstigste vs. teuerste Kasse beim AN-Anteil.
const BEISPIEL = 4000;
const spanneMonat = (BEISPIEL * (TEUERSTE_KASSE.zusatzbeitrag - GUENSTIGSTE_KASSE.zusatzbeitrag)) / 100 / 2;
const anzahl2027 = KRANKENKASSEN_2026.filter((k) => k.zusatzbeitrag2027 !== undefined).length;

const faqs = [
  {
    q: "Wie hoch ist der durchschnittliche Zusatzbeitrag 2027?",
    a:
      ZUSATZBEITRAG_DURCHSCHNITT_2027 !== null
        ? `Das Bundesgesundheitsministerium hat den durchschnittlichen Zusatzbeitrag 2027 auf ${pct(ZUSATZBEITRAG_DURCHSCHNITT_2027)} festgelegt (2026: ${pct(DURCHSCHNITT_ZUSATZBEITRAG_2026)}). Er ist ein Rechenwert; Ihre Kasse erhebt ihren eigenen Satz.`
        : `Er steht noch nicht fest. Das Bundesgesundheitsministerium gibt ihn bis zum 1. November 2026 bekannt, nachdem der GKV-Schätzerkreis Mitte Oktober die Finanzen der Kassen für 2027 prognostiziert hat (§ 242a SGB V). 2026 lag er bei ${pct(DURCHSCHNITT_ZUSATZBEITRAG_2026)}.`,
  },
  {
    q: "Wann veröffentlichen die Krankenkassen ihren Zusatzbeitrag 2027?",
    a: "Die meisten Kassen beschließen ihren Satz für das neue Jahr im Dezember, nach der Bekanntgabe des Durchschnittswerts. Wir tragen jeden Satz in die Tabelle ein, sobald die Kasse ihn veröffentlicht hat. Schätzungen zeigen wir nicht.",
  },
  {
    q: "Was kostet mich der Zusatzbeitrag?",
    a: `Sie zahlen die Hälfte des Zusatzbeitrags Ihrer Kasse auf Ihr Bruttogehalt bis zur Beitragsbemessungsgrenze (2026: ${formatEUR(bbgMonat2026)} im Monat). Bei ${formatEUR(BEISPIEL)} brutto und ${pct(DURCHSCHNITT_ZUSATZBEITRAG_2026)} sind das ${formatEUR((BEISPIEL * DURCHSCHNITT_ZUSATZBEITRAG_2026) / 100 / 2)} im Monat. Jeder Zehntelprozentpunkt mehr kostet Sie bei diesem Gehalt 2 € im Monat.`,
  },
  {
    q: "Kann ich kündigen, wenn meine Kasse den Zusatzbeitrag erhöht?",
    a: "Ja. Erhöht die Kasse ihren Zusatzbeitrag, haben Sie ein Sonderkündigungsrecht bis zum Ende des Monats, in dem die Erhöhung wirksam wird (§ 175 Abs. 4 SGB V). Bei einer Erhöhung zum 1. Januar 2027 also bis zum 31. Januar 2027. Die Kasse muss Sie vorher schriftlich informieren. Die Kündigung wird zum Ende des übernächsten Monats wirksam, bis dahin zahlen Sie den höheren Satz.",
  },
  {
    q: "Welche Krankenkasse ist 2027 am günstigsten?",
    a:
      anzahl2027 > 0
        ? "Die günstigste Kasse 2027 ist in der Tabelle markiert. Beachten Sie, dass einige Kassen nur in bestimmten Regionen wählbar sind."
        : `Das steht erst fest, wenn die Kassen ihre Sätze im Dezember veröffentlichen. 2026 war in unserer Auswahl die ${GUENSTIGSTE_KASSE.name} mit ${pct(GUENSTIGSTE_KASSE.zusatzbeitrag)} am günstigsten, die ${TEUERSTE_KASSE.name} mit ${pct(TEUERSTE_KASSE.zusatzbeitrag)} am teuersten.`,
  },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "de-DE",
      dateModified: ZUSATZBEITRAG_STAND_ISO,
      isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
    },
    {
      "@type": "Dataset",
      "@id": `${CANONICAL}#dataset`,
      name: "Zusatzbeiträge der Krankenkassen 2026 und 2027",
      description:
        "Kassenindividuelle Zusatzbeiträge zur gesetzlichen Krankenversicherung 2026 und, sobald veröffentlicht, 2027 für AOK-Regionalkassen, TK, BARMER, DAK-Gesundheit, hkk, KNAPPSCHAFT und weitere Kassen.",
      temporalCoverage: "2026/2027",
      dateModified: ZUSATZBEITRAG_STAND_ISO,
      isAccessibleForFree: true,
      creator: { "@id": ORG_ID },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
        { "@type": "ListItem", position: 2, name: "Zusatzbeitrag 2027", item: CANONICAL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

const QUELLEN = [
  { label: "§ 242 SGB V — Kassenindividueller Zusatzbeitrag", url: "https://www.gesetze-im-internet.de/sgb_5/__242.html" },
  { label: "§ 242a SGB V — Durchschnittlicher Zusatzbeitragssatz", url: "https://www.gesetze-im-internet.de/sgb_5/__242a.html" },
  { label: "§ 175 SGB V — Kassenwahl und Sonderkündigungsrecht", url: "https://www.gesetze-im-internet.de/sgb_5/__175.html" },
  { label: "GKV-Spitzenverband — Krankenkassenliste", url: "https://www.gkv-spitzenverband.de/service/krankenkassenliste/krankenkassen.jsp" },
  { label: "BMAS — Referentenentwurf Sozialversicherungsrechengrößen 2027", url: SV_RECHENGROESSEN_2027_ENTWURF.quelle },
];

export default function Zusatzbeitrag2027Page() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-16 pb-24 text-[#16181D] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <nav className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-4 sm:mb-8 font-medium" aria-label="Brotkrumen">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Zusatzbeitrag 2027</span>
      </nav>

      <header className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-4">
          <HeartPulse size={14} /> Datenstand {ZUSATZBEITRAG_STAND}
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
          Zusatzbeitrag 2027: Alle Krankenkassen im Vergleich
        </h1>
        <p className="text-base sm:text-lg text-black/80 max-w-4xl leading-relaxed mb-4">
          {ZUSATZBEITRAG_DURCHSCHNITT_2027 !== null ? (
            <>
              Der durchschnittliche Zusatzbeitrag 2027 beträgt <strong>{pct(ZUSATZBEITRAG_DURCHSCHNITT_2027)}</strong> (2026:{" "}
              {pct(DURCHSCHNITT_ZUSATZBEITRAG_2026)}).
            </>
          ) : (
            <>
              Der durchschnittliche Zusatzbeitrag 2027 wird bis zum <strong>1. November 2026</strong> festgelegt, die Kassen
              beschließen ihre Sätze meist im Dezember.
            </>
          )}{" "}
          {anzahl2027 > 0
            ? `${anzahl2027} von ${KRANKENKASSEN_2026.length} Kassen dieser Auswahl haben ihren Satz für 2027 schon veröffentlicht.`
            : "Bis dahin gelten die Sätze 2026:"}{" "}
          Die günstigste Kasse unserer Auswahl ist die {GUENSTIGSTE_KASSE.name} mit {pct(GUENSTIGSTE_KASSE.zusatzbeitrag)}, die
          teuerste die {TEUERSTE_KASSE.name} mit {pct(TEUERSTE_KASSE.zusatzbeitrag)}. Bei {formatEUR(BEISPIEL)} brutto zahlen Sie bei
          der teuersten Kasse <strong>{formatEUR(spanneMonat)} im Monat</strong> mehr als bei der günstigsten, für dieselben
          gesetzlichen Leistungen.
        </p>
        <ReviewerByline updatedDisplay={SEITEN_STAND} />
      </header>

      <ZusatzbeitragVergleich kassen={KRANKENKASSEN_2026} bbgMonat2026={bbgMonat2026} bbgMonat2027={bbgMonat2027} />

      <div className="mt-12">
        <Zusatzbeitrag2027Ausblick aufVergleichsseite />
      </div>

      <Section
        id="sonderkuendigung"
        title="Sonderkündigungsrecht bei Erhöhung"
        variant="card"
        prose
      >
        <p>
          Erhöht Ihre Kasse den Zusatzbeitrag, dürfen Sie außerordentlich kündigen, auch wenn Sie noch keine zwölf Monate Mitglied
          sind (§ 175 Abs. 4 SGB V). Die Frist läuft bis zum Ende des Monats, in dem die Erhöhung wirksam wird. Bei einer Erhöhung
          zum 1. Januar 2027 also bis zum <strong>31. Januar 2027</strong>. Die Kasse muss Sie spätestens einen Monat vorher
          schriftlich informieren und dabei auf das Sonderkündigungsrecht, den durchschnittlichen Zusatzbeitrag und die Übersicht
          des GKV-Spitzenverbands hinweisen.
        </p>
        <p>
          Praktisch kündigen Sie nicht selbst: Sie wählen die neue Kasse, und diese meldet den Wechsel der alten Kasse. Die
          Mitgliedschaft endet zum Ablauf des übernächsten Monats. Ohne Beitragserhöhung können Sie nach zwölf Monaten
          Mitgliedschaft mit derselben Frist wechseln. Für Ihren Arbeitgeber ändert sich nur die Kasse, an die er die Beiträge
          abführt.
        </p>
      </Section>

      <Section id="erklaerung" title="Was ist der Zusatzbeitrag?" variant="plain" prose>
        <p>
          Alle gesetzlichen Krankenkassen erheben denselben allgemeinen Beitragssatz von{" "}
          {ALLGEMEINER_BEITRAGSSATZ.toLocaleString("de-DE", { minimumFractionDigits: 1 })} % (§ 241 SGB V). Reicht das Geld nicht,
          verlangt jede Kasse zusätzlich einen eigenen Zusatzbeitrag (§ 242 SGB V). Beide Sätze teilen sich Arbeitnehmer und
          Arbeitgeber je zur Hälfte, Rentner und Rentenversicherung ebenso. Der durchschnittliche Zusatzbeitrag nach § 242a SGB V
          ist nur ein Rechenwert, etwa für Minijob-Pauschalen und Midijobs. Ihre Gehaltsabrechnung richtet sich nach dem Satz
          Ihrer Kasse.
        </p>
        <p>
          Beiträge fallen nur bis zur Beitragsbemessungsgrenze an: 2026 {formatEUR(bbgMonat2026)} im Monat, 2027 nach dem
          Entwurf des BMAS {formatEUR(bbgMonat2027)}. Wer darüber verdient, zahlt 2027 also auch bei gleichem Satz mehr. Mehr dazu
          auf der Seite{" "}
          <Link href="/beitragsbemessungsgrenze-2027" className="text-[#E60A1C] font-semibold hover:underline">Beitragsbemessungsgrenze 2027</Link>.
          Was der Zusatzbeitrag Ihrer Kasse für Ihr Netto bedeutet, rechnet der{" "}
          <Link href="/brutto-netto-rechner-krankenkasse" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner mit Krankenkasse</Link>;
          im{" "}
          <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner 2026/2027</Link>{" "}
          stellen Sie den Satz unter „Krankenkasse“ ein.
        </p>
      </Section>

      <AffiliateBox slot="krankenkassenVergleich" />

      <Section id="faq" title="Häufige Fragen zum Zusatzbeitrag 2027" variant="plain">
        <AccordionFaq faqs={faqs} />
      </Section>

      <Section id="quellen" title="Quellen" variant="muted">
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {QUELLEN.map((q) => (
            <li key={q.url}>
              <a href={q.url} target="_blank" rel="noopener noreferrer" className="text-[#E60A1C] hover:underline">{q.label}</a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-black/60 mt-4">
          Kassensätze: öffentliche Satzungsangaben der Kassen, Auswahl von {KRANKENKASSEN_2026.length} Kassen (rund 95 gesetzliche
          Kassen insgesamt), Datenstand {ZUSATZBEITRAG_STAND}. Stand der Seite: {SEITEN_STAND}. Alle Angaben ohne Gewähr, keine
          Beratung.
        </p>
      </Section>
    </div>
  );
}
