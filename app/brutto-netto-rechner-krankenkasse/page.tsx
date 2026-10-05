import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, HeartPulse, ArrowRight, Info, Wallet2, ShieldCheck, ExternalLink } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import {
  KRANKENKASSEN_2026,
  DURCHSCHNITT_ZUSATZBEITRAG_2026,
  ALLGEMEINER_BEITRAGSSATZ,
  GUENSTIGSTE_KASSE,
  TEUERSTE_KASSE,
  ZUSATZBEITRAG_STAND,
  ZUSATZBEITRAG_DURCHSCHNITT_2027,
  gesamtbeitragssatz,
} from "@/data/krankenkassen";
import KrankenkassenbeitragRechner2027 from "./KrankenkassenbeitragRechner2027";
import Zusatzbeitrag2027Ausblick from "@/components/Zusatzbeitrag2027Ausblick";
import ReviewerByline from "@/components/ReviewerByline";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";
import { pageImageUrl } from "@/lib/pageImage";
import { pageStand } from "@/lib/pageDates";
import { SV_RECHENGROESSEN_2027_ENTWURF } from "@/lib/taxCalculator";

const CANONICAL = "https://bruttonettocalculator.com/brutto-netto-rechner-krankenkasse";
const STAND = pageStand("/brutto-netto-rechner-krankenkasse");

/*
 * Neu ausgerichtet (Okt. 2026): vorher „Brutto-Netto-Rechner Krankenkasse:
 * AOK, TK & Zusatzbeitrag“ mit Kassen-Markensuchen bei 0,7 % CTR. Jetzt der
 * Rechner-Intent „krankenkassenbeitrag rechner 2027“ / „zusatzbeitrag 2027
 * rechner“. Die Kassenliste 2027 bleibt auf /zusatzbeitrag-2027 — diese Seite
 * verlinkt dorthin, statt sie zu doppeln.
 */
const TITLE = "Krankenkassenbeitrag-Rechner 2027: Zusatzbeitrag & Netto";
const DESCRIPTION = `Krankenkassenbeitrag 2027 berechnen: Zusatzbeitrag Ihrer Kasse eingeben, Netto 2027 sehen – mit neuer Beitragsbemessungsgrenze (${SV_RECHENGROESSEN_2027_ENTWURF.kvPvBbgMonat.toLocaleString("de-DE")} €) und Vergleich zu 2026.`;

/** Partnerlink „Krankenkassen vergleichen“ — nur, wenn die Umgebungsvariable gesetzt ist. */
const CHECK24_AWIN_URL = process.env.CHECK24_AWIN_URL;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "brutto netto rechner aok",
    "aok brutto netto rechner",
    "brutto netto rechner krankenkasse",
    "tk zusatzbeitrag 2026",
    "zusatzbeitrag 2026",
    "krankenkassen zusatzbeitrag 2026",
    "krankenkassen vergleich 2026",
    "beitragssatz krankenkasse 2026",
    "brutto netto rechner tk",
    "krankenkasse wechseln sparen",
    "krankenkassenbeitrag rechner 2027",
    "zusatzbeitrag 2027 rechner",
    "krankenkassenbeitrag 2027",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    images: [pageImageUrl("/brutto-netto-rechner-krankenkasse")],
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/** Beispielgehälter für die Vergleichstabelle. */
const BEISPIEL_BRUTTO = [2500, 3500, 4500, 6000];

function nettoFuer(bruttoMonat: number, zusatzbeitragPct: number) {
  return calculateNetto({
    bruttoMonat,
    jahr: 2026,
    verheiratet: false,
    kinderlosUeber23: true,
    kirche: false,
    steuerklasse: 1,
    kvZusatzbeitrag: zusatzbeitragPct / 100,
  });
}

export default function KrankenkassePage() {
  // Alle Zahlen unten kommen aus derselben Engine wie der Hauptrechner —
  // keine handgepflegten Netto-Werte.
  const referenzBrutto = 4000;
  const nettoGuenstigste = nettoFuer(referenzBrutto, GUENSTIGSTE_KASSE.zusatzbeitrag);
  const nettoTeuerste = nettoFuer(referenzBrutto, TEUERSTE_KASSE.zusatzbeitrag);
  const spreadMonat = nettoGuenstigste.nettoMonat - nettoTeuerste.nettoMonat;
  const spreadJahr = nettoGuenstigste.nettoJahr - nettoTeuerste.nettoJahr;

  const kassenTabelle = KRANKENKASSEN_2026.map((k) => ({
    ...k,
    netto: BEISPIEL_BRUTTO.map((b) => nettoFuer(b, k.zusatzbeitrag).nettoMonat),
  }));

  const faqs = [
    {
      q: "Wie hoch ist der Krankenkassenbeitrag 2027?",
      a: `Der allgemeine Beitragssatz bleibt bei ${ALLGEMEINER_BEITRAGSSATZ.toLocaleString("de-DE", { minimumFractionDigits: 1 })} %, dazu kommt der Zusatzbeitrag Ihrer Kasse; beides teilen Sie sich mit dem Arbeitgeber. ${ZUSATZBEITRAG_DURCHSCHNITT_2027 === null ? "Den durchschnittlichen Zusatzbeitrag 2027 gibt das Bundesgesundheitsministerium bis zum 1. November 2026 bekannt; bis dahin rechnet der Rechner vorläufig mit 2,9 %." : `Der durchschnittliche Zusatzbeitrag 2027 beträgt ${ZUSATZBEITRAG_DURCHSCHNITT_2027.toLocaleString("de-DE", { minimumFractionDigits: 1 })} %.`} Neu ist die höhere Beitragsbemessungsgrenze: Nach dem Referentenentwurf des BMAS zahlen Sie 2027 Beiträge bis ${SV_RECHENGROESSEN_2027_ENTWURF.kvPvBbgMonat.toLocaleString("de-DE")} € brutto im Monat statt bis 5.812,50 €.`,
    },
    {
      q: "Wer zahlt 2027 mehr Krankenkassenbeitrag?",
      a: `Zwei Gruppen: Alle, deren Kasse den Zusatzbeitrag erhöht, und alle mit mehr als 5.812,50 € brutto im Monat, weil die Beitragsbemessungsgrenze auf ${SV_RECHENGROESSEN_2027_ENTWURF.kvPvBbgMonat.toLocaleString("de-DE")} € steigen soll. Wer mehr als ${SV_RECHENGROESSEN_2027_ENTWURF.kvPvBbgMonat.toLocaleString("de-DE")} € verdient, zahlt den Höchstbeitrag auf diese neue Grenze. Den Betrag für Ihr Gehalt zeigt der Rechner oben.`,
    },
    {
      q: "Warum zeigt ein normaler Brutto-Netto-Rechner ein anderes Netto als meine Gehaltsabrechnung?",
      a: `Die häufigste Ursache ist der Zusatzbeitrag zur Krankenversicherung. Die meisten Rechner setzen den amtlichen Durchschnittswert von ${DURCHSCHNITT_ZUSATZBEITRAG_2026.toLocaleString("de-DE", { minimumFractionDigits: 1 })} % an (§ 242a SGB V). Ihre Kasse erhebt aber ihren eigenen Satz — 2026 zwischen ${GUENSTIGSTE_KASSE.zusatzbeitrag.toLocaleString("de-DE", { minimumFractionDigits: 2 })} % und ${TEUERSTE_KASSE.zusatzbeitrag.toLocaleString("de-DE", { minimumFractionDigits: 2 })} %. Dieser Rechner rechnet mit dem Satz Ihrer Kasse und trifft die Abrechnung damit deutlich genauer.`,
    },
    {
      q: "Wie hoch ist der Zusatzbeitrag der AOK 2026?",
      a: "Die AOK ist keine einzelne Kasse, sondern ein Verbund rechtlich eigenständiger Regionalkassen mit unterschiedlichen Zusatzbeiträgen. 2026 reicht die Spanne von 2,47 % (AOK Rheinland-Pfalz/Saarland) über 2,69 % (AOK Bayern) und 2,98–2,99 % (AOK Hessen, Niedersachsen, Baden-Württemberg, NordWest) bis 3,50 % (AOK Nordost). Entscheidend ist die AOK Ihres Bundeslandes — wählen Sie sie im Rechner oben aus.",
    },
    {
      q: "Wie hoch ist der Zusatzbeitrag der TK 2026?",
      a: "Die Techniker Krankenkasse (TK) erhebt 2026 einen Zusatzbeitrag von 2,69 %. Zusammen mit dem allgemeinen Beitragssatz von 14,6 % ergibt das einen Gesamtbeitragssatz von 17,29 %, von dem Arbeitnehmer und Arbeitgeber je die Hälfte tragen — für Arbeitnehmer also 8,645 % des Bruttoentgelts bis zur Beitragsbemessungsgrenze.",
    },
    {
      q: "Wie viel Netto kostet ein hoher Zusatzbeitrag?",
      a: `Bei ${formatEUR(referenzBrutto)} Brutto im Monat (Steuerklasse I, kinderlos) liegt der Unterschied zwischen der günstigsten Kasse (${GUENSTIGSTE_KASSE.name}, ${GUENSTIGSTE_KASSE.zusatzbeitrag.toLocaleString("de-DE", { minimumFractionDigits: 2 })} %) und der teuersten (${TEUERSTE_KASSE.name}, ${TEUERSTE_KASSE.zusatzbeitrag.toLocaleString("de-DE", { minimumFractionDigits: 2 })} %) bei rund ${formatEUR(spreadMonat)} netto pro Monat, also etwa ${formatEUR(spreadJahr)} im Jahr. Weil ein Teil des höheren Beitrags die Steuerlast senkt, ist der Netto-Unterschied kleiner als der reine Beitragsunterschied.`,
    },
    {
      q: "Trage ich den Zusatzbeitrag allein?",
      a: "Nein. Seit 2019 gilt wieder die volle Parität (§ 249 SGB V): Arbeitnehmer und Arbeitgeber tragen sowohl den allgemeinen Beitragssatz von 14,6 % als auch den kassenindividuellen Zusatzbeitrag je zur Hälfte. Ein um 1 Prozentpunkt höherer Zusatzbeitrag kostet Sie also 0,5 Prozentpunkte Ihres Bruttoentgelts.",
    },
    {
      q: "Ab welchem Gehalt spielt der Zusatzbeitrag keine Rolle mehr?",
      a: "Ab der Beitragsbemessungsgrenze für Kranken- und Pflegeversicherung: 5.812,50 € brutto im Monat bzw. 69.750 € im Jahr (2026). Oberhalb dieser Grenze steigt der Krankenkassenbeitrag nicht weiter — der absolute Euro-Unterschied zwischen den Kassen bleibt dann konstant, egal wie hoch das Gehalt ist.",
    },
    {
      q: "Kann ich die Krankenkasse wechseln, wenn meine Kasse den Zusatzbeitrag erhöht?",
      a: "Ja. Die reguläre Bindungsfrist beträgt 12 Monate, die Kündigungsfrist zwei Monate zum Monatsende. Erhöht Ihre Kasse den Zusatzbeitrag, entsteht ein Sonderkündigungsrecht — Sie können dann unabhängig von der Bindungsfrist zum Ende des Monats kündigen, in dem die Erhöhung erstmals erhoben wird. Der Leistungskatalog der gesetzlichen Kassen ist zu rund 95 % gesetzlich vorgeschrieben und damit weitgehend identisch.",
    },
    {
      q: "Gilt der Zusatzbeitrag auch für Rentner, Studenten und Minijobber?",
      a: "Für Rentner ja — der Zusatzbeitrag wird auf die gesetzliche Rente erhoben und paritätisch mit der Rentenversicherung geteilt. Für gesetzlich versicherte Studierende gilt ebenfalls der kassenindividuelle Zusatzbeitrag auf den Studentenbeitrag. Bei Minijobs bis 603 € zahlt der Arbeitgeber pauschal 13 % Krankenversicherung — der Zusatzbeitrag Ihrer Kasse spielt dort keine Rolle.",
    },
  ];

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
          { "@type": "ListItem", position: 2, name: "Krankenkassenbeitrag-Rechner 2027", item: CANONICAL },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `${CANONICAL}#app`,
        name: "Krankenkassenbeitrag-Rechner 2027",
        url: CANONICAL,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        inLanguage: "de-DE",
        isAccessibleForFree: true,
        dateModified: STAND.iso,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        featureList: [
          "Krankenkassen- und Pflegebeitrag 2026 und 2027 mit eigenem Zusatzbeitrag",
          "Netto 2027 mit der Beitragsbemessungsgrenze aus dem BMAS-Entwurf",
          "Kosten je 0,1 % Zusatzbeitrag in Euro pro Jahr",
        ],
      },
      {
        "@type": "Dataset",
        "@id": `${CANONICAL}#dataset`,
        name: "Krankenkassen-Zusatzbeiträge 2026",
        description:
          "Kassenindividuelle Zusatzbeiträge zur gesetzlichen Krankenversicherung im Jahr 2026 für AOK-Regionalkassen, TK, BARMER, DAK-Gesundheit, hkk, KNAPPSCHAFT und weitere Kassen.",
        temporalCoverage: "2026",
        isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
      },
      {
        "@type": "FAQPage",
        "@id": `${CANONICAL}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-20 pb-24 text-[#16181D] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-4 sm:mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Krankenkassenbeitrag-Rechner 2027</span>
      </div>

      {/* Hero */}
      <div className="mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-4">
          <HeartPulse size={14} /> Kranken- und Pflegebeitrag 2026 &amp; 2027
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-[#16181D] mb-3 sm:mb-4 tracking-tight leading-tight">
          <span className="text-gradient-accent">Krankenkassenbeitrag-Rechner 2027:</span> Was kostet Sie der Zusatzbeitrag?
        </h1>
        <p className="text-base sm:text-xl text-black/80 w-full max-w-4xl leading-relaxed mb-2 sm:mb-4">
          Geben Sie Ihr Bruttogehalt und den Zusatzbeitrag Ihrer Kasse ein: Der Rechner zeigt Ihren Kranken- und
          Pflegebeitrag, Ihr Netto 2027 und den Unterschied zu 2026 — mit der höheren Beitragsbemessungsgrenze von{" "}
          <strong className="text-[#16181D]">{SV_RECHENGROESSEN_2027_ENTWURF.kvPvBbgMonat.toLocaleString("de-DE")} € im Monat</strong>{" "}
          aus dem BMAS-Entwurf.
        </p>
        <p className="text-xs sm:text-sm text-black/60 font-medium mb-3">
          Aktualisiert am <time dateTime={STAND.iso}>{STAND.display}</time> · 2027 vorläufig (Regierungsentwurf
          Steuerreform, BMAS-Entwurf der Rechengrößen)
        </p>
        <ReviewerByline updatedDisplay={null} />
      </div>

      {/* Rechner */}
      <div id="rechner" className="mb-14 scroll-mt-24">
        <KrankenkassenbeitragRechner2027 />
      </div>

      {/* Neutral: gleiche Regeln für alle gesetzlichen Kassen */}
      <div className="mb-10 bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 sm:p-6 text-sm sm:text-base text-black/75 leading-relaxed">
        <h2 className="font-display text-xl font-extrabold text-[#16181D] mb-2">Gleiche Regeln für alle gesetzlichen Kassen</h2>
        <p>
          Alle gesetzlichen Krankenkassen — ob TK, AOK, BKK, Barmer, DAK oder IKK — rechnen nach denselben gesetzlichen
          Vorgaben: gleicher allgemeiner Beitragssatz von {ALLGEMEINER_BEITRAGSSATZ.toLocaleString("de-DE", { minimumFractionDigits: 1 })} %
          (§ 241 SGB V), gleiche Beitragsbemessungsgrenze, gleiche Aufteilung zwischen Ihnen und Ihrem Arbeitgeber
          (§ 249 SGB V). Unterscheiden darf sich nur der Zusatzbeitrag. Deshalb genügt für die Rechnung oben der
          Prozentsatz Ihrer Kasse. Die Zusatzbeiträge 2027 aller großen Kassen sammeln wir unter{" "}
          <Link href="/zusatzbeitrag-2027" className="text-[#E60A1C] font-semibold hover:underline">Zusatzbeitrag 2027 aller Kassen</Link>.
        </p>
      </div>

      {/* Partnerlink — erscheint nur mit gesetzter Umgebungsvariable CHECK24_AWIN_URL */}
      {CHECK24_AWIN_URL && (
        <aside className="mb-12 rounded-2xl border border-black/[0.10] bg-[#FFFFFF] p-5 sm:p-6 shadow-sm" aria-label="Anzeige">
          <p className="text-[11px] font-mono uppercase tracking-widest text-black/50 font-bold mb-2">Anzeige</p>
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">Krankenkassen vergleichen</h2>
          <p className="text-sm sm:text-base text-black/75 leading-relaxed mb-4">
            Zusatzbeiträge und Zusatzleistungen der gesetzlichen Kassen im Vergleich — beim Partnerportal.
          </p>
          <a
            href={CHECK24_AWIN_URL}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="inline-flex items-center gap-2 bg-[#16181D] hover:bg-black text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors"
          >
            Krankenkassen vergleichen <ExternalLink size={15} aria-hidden="true" />
          </a>
        </aside>
      )}

      {/* Engine-computed spread highlight */}
      <div className="mb-14 bg-gradient-to-br from-[#E60A1C]/10 via-[#FFFFFF] to-[#FFFFFF] border border-[#E60A1C]/30 rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-3 py-1 rounded-full mb-4">
          <Wallet2 size={13} /> Mit unserem Rechenkern ermittelt
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-3">
          Die Kassenwahl ist {formatEUR(spreadJahr)} netto im Jahr wert
        </h2>
        <p className="text-base sm:text-lg text-black/80 leading-relaxed mb-6 max-w-4xl">
          Bei <strong className="text-[#16181D]">{formatEUR(referenzBrutto)}</strong> Brutto im Monat
          (Steuerklasse I, kinderlos, ohne Kirchensteuer) bleiben bei{" "}
          <strong className="text-[#16181D]">{GUENSTIGSTE_KASSE.name}</strong>{" "}
          <strong className="text-[#E60A1C] font-extrabold">{formatEUR(nettoGuenstigste.nettoMonat)}</strong> netto übrig,
          bei <strong className="text-[#16181D]">{TEUERSTE_KASSE.name}</strong> nur{" "}
          <strong className="text-[#16181D] font-extrabold">{formatEUR(nettoTeuerste.nettoMonat)}</strong>. Das sind{" "}
          <strong className="text-[#E60A1C] font-extrabold">{formatEUR(spreadMonat)} pro Monat</strong> Unterschied —
          für dieselben gesetzlich vorgeschriebenen Leistungen.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="#rechner"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-[#E60A1C] hover:bg-[#c50918] text-white px-4 py-2.5 rounded-xl transition-colors"
          >
            Mit eigener Kasse rechnen <ArrowRight size={14} />
          </Link>
          <Link
            href="/private-krankenversicherung-vs-gesetzlich"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
          >
            PKV vs. GKV vergleichen <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Vergleichstabelle */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Zusatzbeitrag 2026: Krankenkassen im Vergleich
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-3xl">
          Alle gesetzlichen Kassen erheben denselben allgemeinen Beitragssatz von{" "}
          {ALLGEMEINER_BEITRAGSSATZ.toLocaleString("de-DE", { minimumFractionDigits: 1 })} % (§ 241 SGB V). Der
          Unterschied entsteht ausschließlich über den Zusatzbeitrag. Die Netto-Spalten sind mit unserem Rechenkern
          für Steuerklasse I (kinderlos, ohne Kirchensteuer) berechnet.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-black/[0.10] shadow-sm">
          <table className="w-full text-sm bg-[#FFFFFF] min-w-[720px]">
            <caption className="sr-only">
              Zusatzbeiträge der gesetzlichen Krankenkassen 2026 und das resultierende Nettogehalt
            </caption>
            <thead>
              <tr className="bg-[#F1F3F5] text-left">
                <th scope="col" className="px-4 py-3 font-bold text-[#16181D]">Krankenkasse</th>
                <th scope="col" className="px-4 py-3 font-bold text-[#16181D] text-right">Zusatzbeitrag</th>
                <th scope="col" className="px-4 py-3 font-bold text-[#16181D] text-right">Gesamt</th>
                {BEISPIEL_BRUTTO.map((b) => (
                  <th key={b} scope="col" className="px-4 py-3 font-bold text-[#16181D] text-right whitespace-nowrap">
                    Netto bei {new Intl.NumberFormat("de-DE").format(b)} €
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kassenTabelle.map((k) => (
                <tr key={k.slug} className="border-t border-black/[0.06]">
                  <th scope="row" className="px-4 py-3 font-semibold text-[#16181D] text-left">
                    <Link href={`/krankenkasse/${k.slug}`} className="hover:text-[#E60A1C] hover:underline transition-colors">
                      {k.name}
                    </Link>
                    {!k.bundesweit && k.region && (
                      <span className="block text-xs font-normal text-black/50">nur {k.region}</span>
                    )}
                  </th>
                  <td className="px-4 py-3 text-right font-mono font-bold text-[#E60A1C] whitespace-nowrap">
                    {k.zusatzbeitrag.toLocaleString("de-DE", { minimumFractionDigits: 2 })} %
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-black/70 whitespace-nowrap">
                    {gesamtbeitragssatz(k.zusatzbeitrag).toLocaleString("de-DE", { minimumFractionDigits: 2 })} %
                  </td>
                  {k.netto.map((n, i) => (
                    <td key={i} className="px-4 py-3 text-right font-mono text-[#16181D] whitespace-nowrap">
                      {formatEUR(n)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-start gap-2 mt-4 text-xs text-black/50 leading-relaxed">
          <Info size={14} className="shrink-0 mt-0.5" />
          <span>
            Datenstand: {ZUSATZBEITRAG_STAND}, nach öffentlichen Satzungsangaben der Kassen. Auswahl der größten Kassen
            sowie der günstigsten und teuersten Kasse — es gibt rund 95 gesetzliche Krankenkassen. Zusatzbeiträge können
            unterjährig geändert werden; maßgeblich ist immer die Satzung Ihrer Kasse. Angaben ohne Gewähr.
          </span>
        </div>
      </div>

      {/* Zusatzbeitrag 2027 — füllt sich aus data/krankenkassen.ts */}
      <Zusatzbeitrag2027Ausblick />

      {/* Erklärung */}
      <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={18} className="text-[#E60A1C]" />
            <h2 className="font-display text-xl font-extrabold text-[#16181D]">So wird Ihr KV-Beitrag berechnet</h2>
          </div>
          <p className="text-sm text-black/70 leading-relaxed mb-3">
            Der Beitrag zur gesetzlichen Krankenversicherung besteht aus zwei Teilen:
          </p>
          <ol className="text-sm text-black/70 leading-relaxed space-y-2 list-decimal pl-5">
            <li>
              <strong className="text-[#16181D]">Allgemeiner Beitragssatz: {ALLGEMEINER_BEITRAGSSATZ.toLocaleString("de-DE", { minimumFractionDigits: 1 })} %</strong> —
              gesetzlich festgelegt (§ 241 SGB V), für jede Kasse identisch.
            </li>
            <li>
              <strong className="text-[#16181D]">Kassenindividueller Zusatzbeitrag</strong> — von jeder Kasse selbst
              festgelegt (§ 242 SGB V). Hier entsteht der gesamte Preisunterschied.
            </li>
          </ol>
          <p className="text-sm text-black/70 leading-relaxed mt-3">
            Beide Teile werden paritätisch geteilt (§ 249 SGB V): Sie zahlen die Hälfte, Ihr Arbeitgeber die andere.
            Bemessungsgrundlage ist Ihr Bruttoentgelt bis zur Beitragsbemessungsgrenze von{" "}
            <strong className="text-[#16181D]">5.812,50 € im Monat</strong> (69.750 € im Jahr, 2026); 2027 nach dem
            BMAS-Entwurf {SV_RECHENGROESSEN_2027_ENTWURF.kvPvBbgMonat.toLocaleString("de-DE")} € im Monat.
          </p>
        </div>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <HeartPulse size={18} className="text-[#E60A1C]" />
            <h2 className="font-display text-xl font-extrabold text-[#16181D]">Lohnt sich ein Kassenwechsel?</h2>
          </div>
          <p className="text-sm text-black/70 leading-relaxed mb-3">
            Rund 95 % der Leistungen sind gesetzlich vorgeschrieben und bei allen Kassen gleich — Arztbesuche,
            Krankenhaus, Medikamente, Vorsorge. Unterschiede gibt es nur bei Zusatzleistungen wie Bonusprogrammen,
            Osteopathie-Zuschüssen, professioneller Zahnreinigung oder Homöopathie.
          </p>
          <p className="text-sm text-black/70 leading-relaxed mb-3">
            <strong className="text-[#16181D]">Bindungsfrist:</strong> 12 Monate, danach zwei Monate Kündigungsfrist
            zum Monatsende. <strong className="text-[#16181D]">Sonderkündigungsrecht:</strong> Erhöht Ihre Kasse den
            Zusatzbeitrag, können Sie sofort kündigen — unabhängig von der Bindungsfrist.
          </p>
          <p className="text-sm text-black/70 leading-relaxed">
            Der Wechsel selbst ist unbürokratisch: Sie melden sich bei der neuen Kasse an, die kündigt für Sie.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-4">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-6">
          Häufige Fragen zu Krankenkassenbeitrag und Zusatzbeitrag
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between px-5 sm:px-6 py-4 cursor-pointer list-none hover:bg-black/[0.03] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronRight size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-5 sm:px-6 pb-5 pt-1 text-black/70 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
      <ToolContent config={TOOL_CONTENT["/brutto-netto-rechner-krankenkasse"]} stand={null} />
    </div>
  );
}
