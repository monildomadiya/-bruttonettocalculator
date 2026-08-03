import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, HeartPulse, ArrowRight, Info, Wallet2, ShieldCheck } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import {
  KRANKENKASSEN_2026,
  DURCHSCHNITT_ZUSATZBEITRAG_2026,
  ALLGEMEINER_BEITRAGSSATZ,
  GUENSTIGSTE_KASSE,
  TEUERSTE_KASSE,
  ZUSATZBEITRAG_STAND,
  ZUSATZBEITRAG_STAND_ISO,
  gesamtbeitragssatz,
} from "@/data/krankenkassen";
import KrankenkassenRechner from "@/components/KrankenkassenRechner";
import ReviewerByline from "@/components/ReviewerByline";

const CANONICAL = "https://bruttonettocalculator.com/brutto-netto-rechner-krankenkasse";

export const metadata: Metadata = {
  title: "Brutto-Netto-Rechner mit Krankenkasse: AOK, TK & Zusatzbeitrag 2026",
  description:
    "Brutto-Netto-Rechner, der den Zusatzbeitrag Ihrer Krankenkasse berücksichtigt — AOK, TK, Barmer, DAK & Co. Zusatzbeiträge 2026 im Vergleich (2,18 % bis 4,39 %) und wie viel Netto der Unterschied kostet.",
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
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Brutto-Netto-Rechner mit Krankenkasse — Zusatzbeitrag 2026",
    description:
      "AOK, TK, Barmer, DAK: Der Zusatzbeitrag Ihrer Kasse kostet bis zu 1.000 € Netto im Jahr. Jetzt mit der eigenen Kasse rechnen.",
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
  },
  twitter: {
    card: "summary",
    title: "Brutto-Netto-Rechner mit Krankenkasse: AOK, TK & Co.",
    description: "Zusatzbeiträge 2026 von 2,18 % bis 4,39 % — so viel Netto macht die Kassenwahl aus.",
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
          { "@type": "ListItem", position: 2, name: "Brutto-Netto-Rechner mit Krankenkasse", item: CANONICAL },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `${CANONICAL}#app`,
        name: "Brutto-Netto-Rechner mit Krankenkassen-Zusatzbeitrag",
        url: CANONICAL,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        inLanguage: "de-DE",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        featureList: [
          "Netto-Berechnung mit kassenindividuellem Zusatzbeitrag",
          "Vergleich von 19 Krankenkassen inkl. AOK-Regionalkassen",
          "Sparpotenzial bei Kassenwechsel in Euro",
        ],
      },
      {
        "@type": "Dataset",
        "@id": `${CANONICAL}#dataset`,
        name: "Krankenkassen-Zusatzbeiträge 2026",
        description:
          "Kassenindividuelle Zusatzbeiträge zur gesetzlichen Krankenversicherung im Jahr 2026 für AOK-Regionalkassen, TK, BARMER, DAK-Gesundheit, hkk, KNAPPSCHAFT und weitere Kassen.",
        temporalCoverage: "2026",
        dateModified: ZUSATZBEITRAG_STAND_ISO,
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
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 text-[#16181D] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Brutto-Netto-Rechner mit Krankenkasse</span>
      </div>

      {/* Hero */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <HeartPulse size={14} /> Zusatzbeiträge 2026 · Stand {ZUSATZBEITRAG_STAND}
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-[#16181D] mb-4 tracking-tight leading-tight">
          <span className="text-gradient-accent">Brutto-Netto-Rechner</span> mit Ihrer Krankenkasse
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-4xl leading-relaxed mb-6">
          Fast alle Brutto-Netto-Rechner rechnen mit dem amtlichen{" "}
          <strong className="text-[#16181D]">Durchschnitts-Zusatzbeitrag von {DURCHSCHNITT_ZUSATZBEITRAG_2026.toLocaleString("de-DE", { minimumFractionDigits: 1 })} %</strong> —
          und liegen damit systematisch neben Ihrer echten Gehaltsabrechnung. Denn Ihre Kasse erhebt ihren eigenen
          Satz: 2026 zwischen{" "}
          <strong className="text-[#16181D]">{GUENSTIGSTE_KASSE.zusatzbeitrag.toLocaleString("de-DE", { minimumFractionDigits: 2 })} %</strong> und{" "}
          <strong className="text-[#16181D]">{TEUERSTE_KASSE.zusatzbeitrag.toLocaleString("de-DE", { minimumFractionDigits: 2 })} %</strong>.
          Wählen Sie unten AOK, TK, Barmer, DAK oder Ihre eigene Kasse — und sehen Sie das Netto, das wirklich ankommt.
        </p>
        <ReviewerByline />
      </div>

      {/* Rechner */}
      <div id="rechner" className="mb-14 scroll-mt-24">
        <KrankenkassenRechner />
      </div>

      {/* Engine-computed spread highlight */}
      <div className="mb-14 bg-gradient-to-br from-[#E60A1C]/10 via-[#FFFFFF] to-[#FFFFFF] border border-[#E60A1C]/30 rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-3 py-1 rounded-full mb-4">
          <Wallet2 size={13} /> Mit unserem Rechenkern ermittelt
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
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
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
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
                    {k.name}
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

      {/* Erklärung */}
      <div className="mb-16 grid md:grid-cols-2 gap-5">
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
            <strong className="text-[#16181D]">5.812,50 € im Monat</strong> (69.750 € im Jahr, 2026).
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
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Häufige Fragen zum Zusatzbeitrag 2026
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
    </main>
  );
}
