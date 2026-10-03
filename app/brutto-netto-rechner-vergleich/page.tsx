import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Scale, ArrowRight, Check, X, Minus, Info, ExternalLink } from "lucide-react";
import ReviewerByline from "@/components/ReviewerByline";
import BruttoNettoBreakdownChart from "@/components/BruttoNettoBreakdownChart";
import { webPageSchema, ORG_ID } from "@/lib/seo";
import { pageImageUrl } from "@/lib/pageImage";

const CANONICAL = "https://bruttonettocalculator.com/brutto-netto-rechner-vergleich";
const GEHALT_URL = "https://www.gehalt.de/einkommen/brutto-netto-rechner";
const FINANZTIP_URL = "https://www.finanztip.de/brutto-netto-rechner/";

/**
 * Vergleichsseite (Roundup). Alle Wettbewerber-Angaben stammen aus den
 * öffentlich abrufbaren Rechnerseiten und sind je Zelle mit einer Fußnote
 * belegt — Voraussetzung für zulässige vergleichende Werbung (§ 6 UWG). Bei
 * fehlender öffentlicher Information wird "nicht auf dieser Seite" (Minus)
 * gesetzt, nie ein "kann das nicht" behauptet. "Nein" nur, wenn der Anbieter
 * es selbst so schreibt oder die Seite es eindeutig zeigt.
 *
 * Geprüft: gehalt.de 29.07.2026 und erneut 02.10.2026 (unverändert: kein 2027,
 * Jahre 2024–2026); Finanztip 02.10.2026 (Stand der Seite: 02.10.2026).
 * Quartalsweise neu prüfen — nächster Termin Anfang Januar 2027, und sofort,
 * wenn ein Anbieter 2027-Funktionen nachrüstet.
 */
const GEPRUEFT_AM = "2. Oktober 2026";

export const metadata: Metadata = {
  title: "Brutto-Netto-Rechner Vergleich 2026/2027: wer kann was?",
  description:
    "Brutto-Netto-Rechner im Vergleich: BruttoNettoCalculator, gehalt.de und Finanztip — 2027-Werte, Netto zu Brutto, Midijob und Beamte im belegten Feature-Check.",
  keywords: [
    "brutto netto rechner vergleich",
    "bester brutto netto rechner",
    "brutto netto rechner 2027 vergleich",
    "welcher brutto netto rechner stimmt",
    "finanztip brutto netto rechner",
    "gehalt.de brutto netto rechner",
    "brutto netto rechner ohne anmeldung",
    "brutto netto rechner test",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    images: [pageImageUrl("/brutto-netto-rechner-vergleich")],
    title: "Brutto-Netto-Rechner im Vergleich 2026/2027",
    description:
      "Drei Rechner, 17 Funktionen, jede Angabe belegt: Wer rechnet 2027, Netto zu Brutto, Midijob und Beamte? Geprüft im Oktober 2026.",
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
  },
  twitter: {
    card: "summary",
    title: "Brutto-Netto-Rechner im Vergleich 2026/2027",
    description: "BruttoNettoCalculator, gehalt.de und Finanztip im belegten Feature-Check — Oktober 2026.",
  },
};

type Cell = { state: "yes" | "no" | "partial" | "na"; note?: string; fn?: number };

/*
 * Fußnoten: 1–9 gehalt.de, 10–19 Finanztip, 20+ eigene Angaben. Nummern
 * bleiben stabil, auch wenn Zeilen dazukommen.
 */
const matrix: { feature: string; uns: Cell; gehalt: Cell; ft: Cell }[] = [
  {
    feature: "Steuerjahr 2026 nach § 32a EStG",
    uns: { state: "yes" },
    gehalt: { state: "yes" },
    ft: { state: "yes" },
  },
  {
    feature: "Steuertarif 2027 (Regierungsentwurf vom 2.9.2026)",
    uns: { state: "yes", note: "eigener Rechner" },
    gehalt: { state: "no", fn: 1 },
    ft: { state: "yes", note: "Jahr umschaltbar", fn: 10 },
  },
  {
    feature: "Reformszenarien 2027 (ohne Reform · Entwurf · Stufe 2028)",
    uns: { state: "yes", note: "3 Szenarien" },
    gehalt: { state: "na", fn: 1 },
    ft: { state: "partial", note: "ein Szenario (Entwurf)", fn: 10 },
  },
  {
    feature: "Sozialabgaben 2027 mit neuen Beitragsbemessungsgrenzen",
    uns: { state: "yes", note: "Umschalter, Entwurf wählbar", fn: 20 },
    gehalt: { state: "na", fn: 1 },
    ft: { state: "yes", note: "BMAS-Entwurf eingerechnet", fn: 11 },
  },
  {
    feature: "Netto → Brutto (exakte Umkehrrechnung)",
    uns: { state: "yes", note: "eigener Rechner, 2026 & 2027", fn: 23 },
    gehalt: { state: "partial", note: "Faustregel 1,3–1,4 ×", fn: 2 },
    ft: { state: "na", fn: 12 },
  },
  {
    feature: "Vergangene Steuerjahre",
    uns: { state: "no" },
    gehalt: { state: "yes", note: "2024 · 2025", fn: 3 },
    ft: { state: "no", note: "2026 & 2027", fn: 10 },
  },
  {
    feature: "Eigener Krankenkassen-Zusatzbeitrag",
    uns: { state: "partial", note: "Krankenkassen-Rechner", fn: 21 },
    gehalt: { state: "yes", note: "Detailmodus", fn: 3 },
    ft: { state: "yes", note: "Kassenauswahl", fn: 13 },
  },
  {
    feature: "Alter bzw. Geburtsjahr als Eingabe",
    uns: { state: "partial", note: "nur „kinderlos ab 23“" },
    gehalt: { state: "yes", note: "Detailmodus", fn: 3 },
    ft: { state: "yes", fn: 13 },
  },
  {
    feature: "Privat versichert / ohne Renten- oder Arbeitslosenversicherung",
    uns: { state: "partial", note: "Beamten-Rechner", fn: 22 },
    gehalt: { state: "yes", fn: 3 },
    ft: { state: "yes", fn: 13 },
  },
  {
    feature: "Zusätzlicher Steuerfreibetrag",
    uns: { state: "no" },
    gehalt: { state: "yes", note: "Jahresfreibetrag", fn: 4 },
    ft: { state: "yes", fn: 13 },
  },
  {
    feature: "Beamten-Besoldung (ohne Sozialabgaben)",
    uns: { state: "yes", note: "eigener Rechner" },
    gehalt: { state: "na", fn: 5 },
    ft: { state: "partial", note: "„erste Orientierung“", fn: 14 },
  },
  {
    feature: "Midijob-Übergangsbereich (603,01–2.000 €)",
    uns: { state: "yes", note: "eigener Rechner" },
    gehalt: { state: "na", fn: 5 },
    ft: { state: "no", fn: 15 },
  },
  {
    feature: "Firmenwagen (1 %-Regelung)",
    uns: { state: "yes", note: "eigener Rechner" },
    gehalt: { state: "na", fn: 5 },
    ft: { state: "na", fn: 16 },
  },
  {
    feature: "Eigene Seite je Bundesland",
    uns: { state: "yes", note: "alle 16" },
    gehalt: { state: "no", note: "nur Eingabefeld", fn: 6 },
    ft: { state: "no", note: "nur Eingabefeld", fn: 13 },
  },
  {
    feature: "Kostenlos, ohne Konto",
    uns: { state: "yes", note: "nur Brutto nötig" },
    gehalt: { state: "yes", note: "Beruf & Wohnort Pflicht", fn: 7 },
    ft: { state: "yes" },
  },
  {
    feature: "Rechtsquellen bzw. Entwürfe verlinkt",
    uns: { state: "yes", note: "§ 32a EStG, Entwürfe" },
    gehalt: { state: "partial", note: "erklärt, nicht verlinkt", fn: 8 },
    ft: { state: "yes", note: "Entwürfe verlinkt", fn: 11 },
  },
  {
    feature: "Sprachen",
    uns: { state: "yes", note: "DE · EN · PL · RO · TR · UK" },
    gehalt: { state: "partial", note: "DE", fn: 9 },
    ft: { state: "partial", note: "DE", fn: 9 },
  },
];

const fussnoten: Record<number, string> = {
  1: "gehalt.de: Die geprüfte Rechnerseite erwähnt 2027 nicht; das Abrechnungsjahr ist wählbar zwischen 2026, 2025 und 2024 (geprüft 29.07. und 02.10.2026).",
  2: "gehalt.de beantwortet „Gibt es auch einen Netto-Brutto-Rechner?“ mit der Empfehlung, das 1,3- bis 1,4-fache des gewünschten Nettos als Brutto einzugeben — eine Näherung, keine Umkehrrechnung.",
  3: "gehalt.de: Detailmodus laut Seitentext mit Berechnungsjahr, Geburtsjahr, Krankenkassensatz und Rentenversicherung; im Formular „gesetzlich / privat versichert“.",
  4: "gehalt.de erläutert den Jahresfreibetrag in einem eigenen Abschnitt der Rechnerseite.",
  5: "Auf der geprüften gehalt.de-Rechnerseite nicht angeboten. gehalt.de kann solche Rechner an anderer Stelle führen — deshalb „nicht auf dieser Seite“ statt „kann das nicht“.",
  6: "gehalt.de erhebt das Bundesland als Eingabefeld (wegen der Kirchensteuer), führt aber keine eigenen Bundesland-Seiten.",
  7: "gehalt.de: Im Formular sind Beruf und Wohnort als Pflichtfelder markiert; eine Anmeldung ist nicht nötig.",
  8: "gehalt.de erläutert Lohnsteuer, Freibeträge und Kirchensteuer ausführlich, verlinkt aber nicht auf Gesetzestexte.",
  9: "Die geprüften Seiten sind deutschsprachig; eine anderssprachige Fassung des Rechners war nicht verlinkt.",
  10: "Finanztip: Rechner „Brutto-Netto-Rechner 2026 & 2027“; Anleitung: Daten für 2026 eingeben, dann „oben das Jahr auf 2027“ ändern. Steuerwerte 2027 laut Finanztip aus dem Regierungsentwurf vom 2. September 2026, ausdrücklich als vorläufig gekennzeichnet.",
  11: "Finanztip rechnet für 2027 die Beitragsbemessungsgrenzen aus dem Verordnungsentwurf des BMAS vom 21. September 2026 (KV/PV 76.500 €, RV/ALV 106.200 €) inklusive der Sonderanhebung nach dem GKV-Beitragssatzstabilisierungsgesetz ein und verlinkt beide Entwürfe.",
  12: "Auf der geprüften Finanztip-Seite war keine Netto-zu-Brutto-Rechnung zu finden.",
  13: "Finanztip-Formular: Zeitraum, Bruttolohn, Alter, Steuerklasse, Bundesland (Auswahlfeld), Kinder, Kirchensteuer, zusätzlicher Steuerfreibetrag, gesetzliche Renten-, Kranken- und Arbeitslosenversicherung jeweils Ja/Nein sowie Auswahl der eigenen gesetzlichen Krankenkasse.",
  14: "Finanztip schreibt selbst, der Rechner sei für Beamte „meist nur eine erste Orientierung“, und verweist auf den Bezügerechner des Bundesverwaltungsamts.",
  15: "Finanztip schreibt selbst, man habe sich entschieden, „den Midijob nicht speziell zu berücksichtigen“, und verweist auf den Midijob-Rechner der Deutschen Rentenversicherung.",
  16: "Auf der geprüften Finanztip-Rechnerseite nicht angeboten; Finanztip kann andere Rechner an anderer Stelle führen.",
  20: "Im Hauptrechner wählbar unter „Sozialabgaben 2027“: Stand 2026 (Voreinstellung, solange die Rechengrößen-Verordnung 2027 nicht beschlossen ist) oder die Beitragsbemessungsgrenzen aus dem BMAS-Entwurf vom 21.09.2026, jeweils mit den Beitragssätzen 2026. Abweichende Sätze rechnet der Sozialabgaben-Rechner 2027.",
  21: "Im Hauptrechner gilt der durchschnittliche Zusatzbeitrag (2026: 2,9 %); den Satz der eigenen Kasse rechnet der Brutto-Netto-Rechner mit Krankenkasse.",
  23: "Der Netto-zu-Brutto-Rechner ist eine eigene Seite (nicht im Hauptrechner) und sucht das Brutto exakt mit derselben Engine, wahlweise für 2026 oder 2027.",
  22: "Ohne Sozialabgaben und mit privater Krankenversicherung rechnet der Beamten-Rechner; der Hauptrechner geht von gesetzlicher Versicherung aus.",
};
const fussnotenNummern = Object.keys(fussnoten).map(Number);

const faqs = [
  {
    q: "Welcher Brutto-Netto-Rechner ist der genaueste?",
    a: "Seriöse Brutto-Netto-Rechner rechnen alle mit derselben Grundlage: der amtlichen Einkommensteuer-Formel nach § 32a EStG und den Sozialversicherungs-Rechengrößen des jeweiligen Jahres. Abweichungen zwischen Rechnern entstehen fast immer durch Annahmen, nicht durch Rechenfehler — vor allem beim Krankenkassen-Zusatzbeitrag (durchschnittlich 2,9 % gegenüber Ihrem individuellen Satz), bei Kinderfreibeträgen und beim Bundesland. Wer seinen exakten Zusatzbeitrag eingeben kann, kommt näher an die Lohnabrechnung heran.",
  },
  {
    q: "Welcher Rechner kann das Steuerjahr 2027?",
    a: "BruttoNettoCalculator und Finanztip rechnen beide den Steuertarif 2027 nach dem Regierungsentwurf vom 2. September 2026. Beide können auch die geplanten Beitragsbemessungsgrenzen 2027 einrechnen — Finanztip immer, unser Rechner wahlweise über den Umschalter „Sozialabgaben 2027“ (Voreinstellung: beschlossener Stand 2026). Zusätzlich bietet unser Rechner drei Steuer-Szenarien — ohne Reform, Entwurf 2027 und Stufe 2028. Auf der geprüften gehalt.de-Seite war im Oktober 2026 keine 2027-Berechnung verfügbar.",
  },
  {
    q: "Was kann der Brutto-Netto-Rechner von Finanztip?",
    a: "Er rechnet 2026 und vorläufig 2027, legt offen, welche Entwurfswerte er für 2027 verwendet, und lässt Sie Ihre eigene gesetzliche Krankenkasse auswählen — so sehen Sie, ob ein Kassenwechsel Geld spart. Abfragen lassen sich auch Alter, ein zusätzlicher Steuerfreibetrag und ob Sie renten-, kranken- und arbeitslosenversichert sind. Nach eigener Aussage berücksichtigt der Rechner den Midijob nicht speziell und ist für Beamte nur eine erste Orientierung.",
  },
  {
    q: "Sind die Rechner von gehalt.de und Finanztip kostenlos?",
    a: "Ja. Beide sind kostenlos und ohne Konto nutzbar — ebenso wie der Rechner auf dieser Seite. Bei gehalt.de sind im Formular Beruf und Wohnort als Pflichtfelder markiert.",
  },
  {
    q: "Wo liegen die Stärken von gehalt.de?",
    a: "gehalt.de gehört zur Stepstone-Gruppe und hat seinen Schwerpunkt in einer großen Gehaltsdatenbank mit Vergleichswerten für Berufe und Branchen. Beim Rechner selbst sind die Berechnung vergangener Steuerjahre (2024 und 2025) und der Detailmodus mit Geburtsjahr und individuellem Krankenkassensatz echte Vorteile.",
  },
  {
    q: "Warum zeigen zwei Rechner unterschiedliche Nettobeträge?",
    a: "Meist wegen unterschiedlicher Voreinstellungen: Krankenkassen-Zusatzbeitrag, Kirchensteuerpflicht, Kinderfreibeträge, Bundesland und der Pflegeversicherungszuschlag für Kinderlose ab 23 Jahren. Für 2027 kommt eine weitere Ursache dazu: ob der Rechner die geplanten Beitragsbemessungsgrenzen schon einrechnet — bei uns lässt sich das umschalten. Das wirkt erst ab rund 5.800 € brutto im Monat — darunter sind die Ergebnisse bei gleichen Eingaben nahezu gleich.",
  },
  {
    q: "Ist dieser Vergleich neutral?",
    a: "Nein — und das sagen wir offen: BruttoNettoCalculator ist unser eigenes Produkt. Deshalb ist jede Zelle mit Unterschied mit einer Fußnote belegt, jede Angabe zu gehalt.de und Finanztip stammt von der öffentlich abrufbaren Rechnerseite (geprüft am " + GEPRUEFT_AM + "), und die Stärken der anderen Rechner stehen genauso in der Tabelle wie unsere. Prüfen Sie die Rechner mit Ihren eigenen Zahlen.",
  },
];

const breadcrumbJsonLd = {
  "@type": "BreadcrumbList",
  "@id": `${CANONICAL}#breadcrumb`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Brutto-Netto-Rechner im Vergleich", item: CANONICAL },
  ],
};

// Bewusst ohne Product/AggregateRating: es liegen keine echten Nutzerbewertungen vor.
const app = (name: string, url: string, extra: object = {}) => ({
  "@type": "SoftwareApplication",
  name,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  ...extra,
});
const itemListJsonLd = {
  "@type": "ItemList",
  "@id": `${CANONICAL}#itemlist`,
  name: "Brutto-Netto-Rechner im Vergleich 2026/2027",
  numberOfItems: 3,
  itemListElement: [
    { "@type": "ListItem", position: 1, item: app("BruttoNettoCalculator", "https://bruttonettocalculator.com/brutto-netto-rechner-2027", { publisher: { "@id": ORG_ID } }) },
    { "@type": "ListItem", position: 2, item: app("gehalt.de Brutto-Netto-Rechner", GEHALT_URL) },
    { "@type": "ListItem", position: 3, item: app("Finanztip Brutto-Netto-Rechner 2026 & 2027", FINANZTIP_URL) },
  ],
};

const schemaJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    breadcrumbJsonLd,
    {
      ...webPageSchema({
        name: "Brutto-Netto-Rechner im Vergleich 2026/2027",
        url: CANONICAL,
        description:
          "Belegter Feature-Vergleich der Brutto-Netto-Rechner von BruttoNettoCalculator, gehalt.de und Finanztip — 2027-Werte, Netto zu Brutto, Krankenkasse, Spezialrechner.",
        breadcrumbId: `${CANONICAL}#breadcrumb`,
      }),
      "@context": undefined,
    },
    itemListJsonLd,
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

function Mark({ cell }: { cell: Cell }) {
  const icon =
    cell.state === "yes" ? <Check size={17} className="text-[#0F7A3D]" aria-hidden /> :
    cell.state === "no" ? <X size={17} className="text-[#B44A0F]" aria-hidden /> :
    <Minus size={17} className="text-black/40" aria-hidden />;
  const label =
    cell.state === "yes" ? "Ja" :
    cell.state === "no" ? "Nein" :
    cell.state === "partial" ? "Teilweise" : "Nicht auf dieser Seite";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-[#16181D]">
        {icon}
        <span>{label}</span>
        {cell.fn && <sup className="text-[10px] text-black/45 font-mono">{cell.fn}</sup>}
      </span>
      {cell.note && <span className="text-[11px] text-black/55 leading-tight text-center">{cell.note}</span>}
    </div>
  );
}

const ext = (href: string, label: string) => (
  <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="underline hover:text-[#16181D]">
    {label} <ExternalLink size={11} className="inline align-baseline" />
  </a>
);

export default function VergleichPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 text-[#16181D] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Brutto-Netto-Rechner im Vergleich</span>
      </div>

      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <Scale size={14} /> Feature-Vergleich · geprüft {GEPRUEFT_AM}
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-[#16181D] mb-4 tracking-tight leading-tight">
          <span className="text-gradient-accent">Brutto-Netto-Rechner</span> im Vergleich 2026/2027
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-4xl leading-relaxed mb-6">
          Ein Brutto-Netto-Rechner ermittelt aus dem Bruttogehalt nach der amtlichen Steuerformel das
          Nettogehalt. Alle seriösen Rechner nutzen dieselbe gesetzliche Grundlage —{" "}
          <strong className="text-[#16181D]">unterschiedlich sind Funktionen und Annahmen</strong>, gerade
          für 2027. Dieser Vergleich stellt BruttoNettoCalculator, gehalt.de und Finanztip Zeile für Zeile
          gegenüber: Wer rechnet 2027 und mit welchen Werten, wer kann Netto zu Brutto, Krankenkasse,
          Midijob und Beamte — und wo die anderen die Nase vorn haben.
        </p>
        <ReviewerByline />
      </div>

      {/* Offenlegung — direkt unter dem Hero, bevor der Vergleich beginnt */}
      <div className="mb-12 flex items-start gap-3 bg-[#F4F5F7] border border-black/[0.08] rounded-2xl p-5 text-sm text-black/70 leading-relaxed">
        <Info size={18} className="shrink-0 mt-0.5 text-[#E60A1C]" />
        <p>
          <strong className="text-[#16181D]">Offenlegung:</strong> BruttoNettoCalculator ist unser eigenes
          Produkt. Alle Angaben zu {ext(GEHALT_URL, "gehalt.de")} und {ext(FINANZTIP_URL, "Finanztip")} stammen
          von den öffentlich abrufbaren Rechnerseiten, geprüft am {GEPRUEFT_AM}, und sind unten einzeln mit
          Fußnoten belegt. Stärken der anderen Rechner stehen genauso in der Tabelle wie unsere.
        </p>
      </div>

      {/* Feature-Matrix */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Funktionen im direkten Vergleich
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-3xl">
          „Nicht auf dieser Seite“ bedeutet: auf der verglichenen Rechnerseite nicht angeboten — der
          Anbieter kann die Funktion an anderer Stelle führen. Hochgestellte Zahlen verweisen auf die Belege
          unter der Tabelle.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-black/[0.10] shadow-sm">
          <table className="w-full text-left border-collapse min-w-[720px] bg-[#FFFFFF]">
            <thead>
              <tr className="bg-[#F1F3F5] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Merkmal</th>
                <th className="py-4 px-4 text-center text-[#E60A1C]">BruttoNettoCalculator</th>
                <th className="py-4 px-4 text-center">gehalt.de</th>
                <th className="py-4 px-4 text-center">Finanztip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06] text-sm">
              {matrix.map((row) => (
                <tr key={row.feature} className="hover:bg-black/[0.02] transition-colors">
                  <th scope="row" className="py-4 px-5 text-black/80 font-medium text-left">{row.feature}</th>
                  <td className="py-4 px-4"><Mark cell={row.uns} /></td>
                  <td className="py-4 px-4"><Mark cell={row.gehalt} /></td>
                  <td className="py-4 px-4"><Mark cell={row.ft} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fußnoten — Belege je Zelle */}
        <ol className="mt-5 space-y-1.5 text-xs text-black/55 leading-relaxed">
          {fussnotenNummern.map((n) => (
            <li key={n} className="flex gap-2">
              <span className="font-mono text-black/45 w-5 shrink-0 text-right">{n}</span>
              <span>{fussnoten[n]}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link
            href="/brutto-netto-rechner-2027"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-[#E60A1C] hover:bg-[#c50918] text-white px-4 py-2.5 rounded-xl transition-colors"
          >
            Rechner 2027 öffnen <ArrowRight size={14} />
          </Link>
          <Link
            href="/brutto-netto-rechner-2026"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
          >
            Rechner 2026 öffnen <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Was der Vergleich praktisch bedeutet */}
      <div className="mb-16 bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-6 sm:p-10">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-6">
          Was die Unterschiede praktisch bedeuten
        </h2>
        <div className="space-y-6 text-sm sm:text-base text-black/70 leading-relaxed">
          <div>
            <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-2">
              2027: gleicher Steuerentwurf, Sozialabgaben wählbar
            </h3>
            <p>
              Für die Lohnsteuer 2027 nutzen BruttoNettoCalculator und Finanztip denselben Regierungsentwurf vom
              2. September 2026 — bei gleichen Eingaben stimmt der Steueranteil überein. Bei den Sozialabgaben
              rechnet Finanztip die geplanten Beitragsbemessungsgrenzen immer ein; im{" "}
              <Link href="/brutto-netto-rechner-2027" className="text-[#E60A1C] font-semibold hover:underline">
                Rechner 2027
              </Link>{" "}
              wählen Sie selbst zwischen dem beschlossenen Stand 2026 und dem Entwurf 2027 — spürbar wird das erst
              ab rund 5.800 € brutto im Monat. Höhere Beitragssätze spielt der{" "}
              <Link href="/sozialabgaben-rechner-2027" className="text-[#E60A1C] font-semibold hover:underline">
                Sozialabgaben-Rechner 2027
              </Link>{" "}
              durch. Beim Steuerteil können Sie zwischen „ohne Reform“, „Entwurf 2027“ und „Stufe 2028“ wechseln —
              falls der Entwurf im Bundestag noch geändert wird.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-2">
              Netto zu Brutto: die Frage vor jedem Jobwechsel
            </h3>
            <p>
              „Ich will 2.500 € netto — welches Brutto muss ich fordern?“ Diese Umkehrrechnung löst bei uns ein
              eigener Rechner exakt mit derselben Engine, auch für 2027. gehalt.de empfiehlt dafür eine Faustregel
              (1,3- bis 1,4-fach), auf der geprüften Finanztip-Seite gibt es sie nicht. Direkt zum{" "}
              <Link href="/rechner/netto-zu-brutto" className="text-[#E60A1C] font-semibold hover:underline">
                Netto-zu-Brutto-Rechner
              </Link>
              .
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-2">Sonderfälle: Beamte, Midijob, Firmenwagen</h3>
            <p>
              Für Beamte gilt eine andere Logik — keine Sozialabgaben, dafür Beihilfe und private
              Krankenversicherung. Im Midijob-Übergangsbereich (603,01–2.000 € brutto) sind die
              Arbeitnehmer-Beiträge reduziert; Finanztip schreibt selbst, diesen Fall nicht speziell zu
              berücksichtigen. Ein Firmenwagen erhöht über die 1 %-Regelung das zu versteuernde Brutto. Für alle
              drei Fälle gibt es hier eigene Rechner:{" "}
              <Link href="/brutto-netto-rechner-beamte" className="text-[#E60A1C] font-semibold hover:underline">Beamten-Rechner</Link>,{" "}
              <Link href="/midijob-rechner" className="text-[#E60A1C] font-semibold hover:underline">Midijob-Rechner</Link>,{" "}
              <Link href="/firmenwagenrechner" className="text-[#E60A1C] font-semibold hover:underline">Firmenwagenrechner</Link>.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-2">Wo Finanztip stärker ist</h3>
            <p>
              Finanztip lässt Sie im selben Formular Ihre eigene Krankenkasse auswählen und zeigt so direkt, ob
              ein Kassenwechsel Geld spart — bei uns ist das ein{" "}
              <Link href="/brutto-netto-rechner-krankenkasse" className="text-[#E60A1C] font-semibold hover:underline">
                separater Rechner
              </Link>
              . Alter, Steuerfreibetrag und ein Verzicht auf Renten- oder Arbeitslosenversicherung lassen sich
              direkt einstellen, und die verwendeten 2027-Entwürfe sind auf der Seite verlinkt.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-2">Wo gehalt.de stärker ist</h3>
            <p>
              gehalt.de kann vergangene Steuerjahre berechnen (2024 und 2025) — praktisch, wenn Sie eine alte
              Abrechnung nachvollziehen wollen. Der Detailmodus erlaubt Geburtsjahr und individuellen
              Krankenkassensatz, und als Teil der Stepstone-Gruppe steht dahinter eine große Gehaltsdatenbank
              mit Branchen-Vergleichswerten.
            </p>
          </div>
        </div>
      </div>

      {/* Beispielrechnung mit Chart */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-3">
          Beispiel: Was passiert eigentlich mit dem Brutto?
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-2 max-w-3xl">
          Unabhängig vom gewählten Rechner läuft jede Berechnung nach demselben Schema — Steuern und
          Sozialabgaben werden vom Brutto abgezogen. Für 3.000 € brutto in Steuerklasse I sieht die
          Aufteilung 2026 so aus:
        </p>
        <BruttoNettoBreakdownChart bruttoMonat={3000} jahr={2026} steuerklasse={1} />
      </div>

      {/* Checkliste — bedient "welcher brutto netto rechner stimmt" */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-3">
          Woran Sie einen verlässlichen Brutto-Netto-Rechner erkennen
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-3xl">
          Wenn zwei Rechner unterschiedliche Nettobeträge zeigen, liegt das fast nie an einem
          Rechenfehler, sondern an Voreinstellungen. Diese Punkte entscheiden, wie nah ein Ergebnis an
          Ihrer echten Lohnabrechnung liegt — prüfen Sie sie in jedem Rechner:
        </p>
        <div className="space-y-3">
          {[
            {
              t: "Nennt der Rechner sein Steuerjahr und seine Rechtsgrundlage?",
              d: "Seriöse Rechner schreiben hin, mit welchem Jahr sie rechnen (2026 oder 2027) und auf welcher Grundlage — der Einkommensteuer-Formel nach § 32a EStG und den Sozialversicherungs-Rechengrößen. Für 2027 sollte zusätzlich klar sein, ob Entwurfswerte verwendet werden.",
            },
            {
              t: "Können Sie den Krankenkassen-Zusatzbeitrag anpassen?",
              d: "Der Zusatzbeitrag liegt 2026 im Schnitt bei 2,9 %, Ihre Kasse kann darüber oder darunter liegen. Bei 3.000 € brutto machen 0,5 Prozentpunkte Unterschied rund 7,50 € netto im Monat aus. Rechner mit fester Voreinstellung sind für den Überblick gut, für die exakte Abrechnung eher nicht.",
            },
            {
              t: "Wird der Pflegeversicherungs-Zuschlag für Kinderlose berücksichtigt?",
              d: "Kinderlose ab 23 Jahren zahlen 0,6 % mehr in die Pflegeversicherung. Wer das nicht abfragt, rechnet für einen großen Teil der Nutzer zu hoch.",
            },
            {
              t: "Gibt es ein Feld für Kirchensteuer und Bundesland?",
              d: "Kirchensteuer kostet 8 % (Bayern, Baden-Württemberg) oder 9 % (übrige Länder) der Lohnsteuer. Ohne diese Angabe kann das Ergebnis bei Kirchenmitgliedern deutlich abweichen.",
            },
            {
              t: "Steht dabei, wann zuletzt aktualisiert wurde?",
              d: "Steuerwerte ändern sich jährlich, teils unterjährig. Ein sichtbares Aktualisierungsdatum ist das einfachste Qualitätssignal — fehlt es, rechnet der Rechner womöglich noch mit Vorjahreswerten.",
            },
          ].map((item) => (
            <div key={item.t} className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 sm:p-6 shadow-sm">
              <h3 className="font-bold text-[#16181D] text-sm sm:text-base mb-2 flex gap-2.5">
                <Check size={18} className="text-[#0F7A3D] shrink-0 mt-0.5" />
                {item.t}
              </h3>
              <p className="text-sm text-black/70 leading-relaxed sm:pl-[28px]">{item.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Methodik */}
      <div className="mb-16 bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-10 shadow-sm">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-4">
          Methodik: So wurde verglichen
        </h2>
        <ul className="space-y-2.5 text-sm sm:text-base text-black/70 leading-relaxed">
          <li className="flex gap-3">
            <Check size={18} className="text-[#0F7A3D] shrink-0 mt-0.5" />
            <span>Grundlage sind ausschließlich die <strong className="text-[#16181D]">öffentlich abrufbaren Rechnerseiten</strong>, aufgerufen am {GEPRUEFT_AM} — ohne Konto, ohne Login.</span>
          </li>
          <li className="flex gap-3">
            <Check size={18} className="text-[#0F7A3D] shrink-0 mt-0.5" />
            <span>Jede Zelle mit Unterschied trägt eine <strong className="text-[#16181D]">Fußnote mit Beleg</strong>. „Nein“ steht nur, wo der Anbieter es selbst so schreibt oder die Seite es eindeutig zeigt; alles andere als „nicht auf dieser Seite“.</span>
          </li>
          <li className="flex gap-3">
            <Check size={18} className="text-[#0F7A3D] shrink-0 mt-0.5" />
            <span>Es werden <strong className="text-[#16181D]">keine Nutzerbewertungen oder Sterne</strong> ausgewiesen — uns liegen dazu keine belastbaren Daten vor.</span>
          </li>
          <li className="flex gap-3">
            <Check size={18} className="text-[#0F7A3D] shrink-0 mt-0.5" />
            <span>Der Vergleich wird <strong className="text-[#16181D]">quartalsweise geprüft</strong>. Ändert ein Anbieter seinen Funktionsumfang, wird die Tabelle korrigiert.</span>
          </li>
        </ul>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-6">
          Häufige Fragen zum Rechner-Vergleich
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

      {/* Abschluss-CTA */}
      <div className="bg-gradient-to-br from-[#E60A1C]/10 via-[#FFFFFF] to-[#FFFFFF] border border-[#E60A1C]/30 rounded-3xl p-6 sm:p-10 shadow-xl">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-3">
          Fazit: Rechnen Sie mit Ihren eigenen Zahlen
        </h2>
        <p className="text-base sm:text-lg text-black/80 leading-relaxed mb-6 max-w-4xl">
          Für das Netto 2026 nehmen sich die drei Rechner wenig — sie nutzen dieselbe gesetzliche Formel. Der
          Unterschied liegt im Drumherum: Wer <strong className="text-[#16181D]">2027 in mehreren Szenarien</strong> — Steuer und Sozialabgaben getrennt umschaltbar —,
          die <strong className="text-[#16181D]">exakte Netto-zu-Brutto-Rechnung</strong> oder einen Sonderfall
          wie Beamte, Midijob oder Firmenwagen braucht, findet das hier. Wer seine{" "}
          <strong className="text-[#16181D]">eigene Krankenkasse, Alter und Freibetrag</strong> im selben Formular
          eingeben will, ist bei Finanztip gut aufgehoben; wer eine{" "}
          <strong className="text-[#16181D]">alte Abrechnung nachrechnen</strong> will, bei gehalt.de.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/brutto-netto-rechner-2027"
            className="inline-flex items-center gap-1.5 text-sm font-bold bg-[#E60A1C] hover:bg-[#c50918] text-white px-5 py-3 rounded-xl transition-colors"
          >
            Netto 2027 berechnen <ArrowRight size={15} />
          </Link>
          <Link
            href="/rechner/netto-zu-brutto"
            className="inline-flex items-center gap-1.5 text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-5 py-3 rounded-xl transition-colors"
          >
            Netto zu Brutto rechnen <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
