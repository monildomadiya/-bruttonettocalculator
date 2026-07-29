import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Scale, ArrowRight, Check, X, Minus, Info, ExternalLink } from "lucide-react";
import ReviewerByline from "@/components/ReviewerByline";
import BruttoNettoBreakdownChart from "@/components/BruttoNettoBreakdownChart";
import { webPageSchema, ORG_ID } from "@/lib/seo";

const CANONICAL = "https://bruttonettocalculator.com/brutto-netto-rechner-vergleich";
const COMPETITOR_URL = "https://www.gehalt.de/einkommen/brutto-netto-rechner";

/**
 * Vergleichsseite. Alle Wettbewerber-Angaben stammen aus der öffentlich
 * abrufbaren Rechnerseite (geprüft 29.07.2026) und sind je Zeile mit einer
 * Fußnote belegt — Voraussetzung für zulässige vergleichende Werbung (§ 6 UWG).
 * Bei fehlender öffentlicher Information wird "nicht auf dieser Seite" (Minus)
 * gesetzt, nie ein "kann das nicht" behauptet.
 */
const GEPRUEFT_AM = "29. Juli 2026";

export const metadata: Metadata = {
  title: "Brutto-Netto-Rechner im Vergleich 2026 — welcher kann was?",
  description:
    "Brutto-Netto-Rechner im Vergleich: BruttoNettoCalculator vs. gehalt.de — 2027-Vorschau, Netto-zu-Brutto, Beamte, Midijob und Firmenwagen im ehrlichen Feature-Check. Geprüft Juli 2026.",
  keywords: [
    "brutto netto rechner vergleich",
    "bester brutto netto rechner",
    "brutto netto rechner 2026 vergleich",
    "welcher brutto netto rechner stimmt",
    "gehalt.de brutto netto rechner",
    "gehalt.de alternative",
    "brutto netto rechner ohne anmeldung",
    "brutto netto rechner test",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Brutto-Netto-Rechner im Vergleich 2026",
    description:
      "Welcher Brutto-Netto-Rechner kann 2027, Netto-zu-Brutto, Beamte und Midijob? Ehrlicher Feature-Vergleich, geprüft Juli 2026.",
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
  },
  twitter: {
    card: "summary",
    title: "Brutto-Netto-Rechner im Vergleich 2026",
    description: "Feature-für-Feature: BruttoNettoCalculator vs. gehalt.de — geprüft Juli 2026.",
  },
};

type Cell = { state: "yes" | "no" | "partial" | "na"; note?: string };

const matrix: { feature: string; uns: Cell; sie: Cell; fn?: number }[] = [
  {
    feature: "Steuerjahr 2026 nach § 32a EStG",
    uns: { state: "yes" },
    sie: { state: "yes" },
  },
  {
    feature: "Vorschau auf Steuerjahr 2027",
    uns: { state: "yes", note: "eigener Rechner" },
    sie: { state: "no" },
    fn: 1,
  },
  {
    feature: "Netto → Brutto im selben Rechner",
    uns: { state: "yes", note: "Umschalter" },
    sie: { state: "partial", note: "separates Tool" },
    fn: 2,
  },
  {
    feature: "Vergangene Steuerjahre berechnen",
    uns: { state: "no" },
    sie: { state: "yes" },
    fn: 3,
  },
  {
    feature: "Individueller Krankenkassen-Zusatzbeitrag",
    uns: { state: "partial", note: "Ø 2,9 %" },
    sie: { state: "yes", note: "Detailmodus" },
    fn: 3,
  },
  {
    feature: "Beamten-Besoldung (ohne Sozialabgaben)",
    uns: { state: "yes", note: "eigener Rechner" },
    sie: { state: "na" },
    fn: 4,
  },
  {
    feature: "Midijob-Übergangsbereich 2026",
    uns: { state: "yes", note: "603–2.000 €" },
    sie: { state: "na" },
    fn: 4,
  },
  {
    feature: "Firmenwagen (1 %-Regelung)",
    uns: { state: "yes", note: "eigener Rechner" },
    sie: { state: "na" },
    fn: 4,
  },
  {
    feature: "Eigene Seite je Bundesland",
    uns: { state: "yes", note: "alle 16" },
    sie: { state: "no", note: "nur Eingabefeld" },
    fn: 5,
  },
  {
    feature: "Ohne Anmeldung & kostenlos",
    uns: { state: "yes" },
    sie: { state: "yes" },
  },
  {
    feature: "Gesetzesquellen direkt verlinkt",
    uns: { state: "yes", note: "§ 32a EStG, SVBezGrV" },
    sie: { state: "partial", note: "erklärt, nicht verlinkt" },
    fn: 6,
  },
  {
    feature: "Sprachen",
    uns: { state: "yes", note: "DE · EN · PL" },
    sie: { state: "partial", note: "DE" },
    fn: 7,
  },
];

const fussnoten = [
  "Auf der geprüften Rechnerseite von gehalt.de findet sich keine Angabe zum Steuerjahr 2027; das Intro nennt „das Jahr 2026 sowie vergangene Jahre“.",
  "gehalt.de beantwortet die Frage „Gibt es auch einen Netto-Brutto-Rechner?“ mit dem Verweis auf ein separates Tool — die Umkehrrechnung ist dort also nicht im selben Rechner integriert.",
  "Laut Beschreibung des Detailmodus auf der gehalt.de-Rechnerseite (Berechnungsjahr, Geburtsjahr, Krankenkassensatz, Rentenversicherung).",
  "Auf der geprüften Rechnerseite nicht angeboten. gehalt.de kann solche Rechner an anderer Stelle führen — deshalb „nicht auf dieser Seite“ statt „kann das nicht“.",
  "gehalt.de erhebt das Bundesland als Eingabefeld (wegen Kirchensteuer), führt dafür aber keine eigenen, einzeln aufrufbaren Bundesland-Seiten.",
  "gehalt.de erläutert Lohnsteuer, Freibeträge und Kirchensteuer ausführlich im Fließtext, verlinkt jedoch nicht auf die Gesetzestexte selbst.",
  "Geprüfte Seite ist deutschsprachig; eine englische oder polnische Fassung dieses Rechners war nicht verlinkt.",
];

const faqs = [
  {
    q: "Welcher Brutto-Netto-Rechner ist der genaueste?",
    a: "Seriöse Brutto-Netto-Rechner rechnen alle mit derselben Grundlage: der amtlichen Einkommensteuer-Formel nach § 32a EStG und den Sozialversicherungs-Rechengrößen des jeweiligen Jahres. Abweichungen zwischen Rechnern entstehen fast immer durch Annahmen, nicht durch Rechenfehler — vor allem beim Krankenkassen-Zusatzbeitrag (durchschnittlich 2,9 % gegenüber Ihrem individuellen Satz), bei Kinderfreibeträgen und beim Bundesland. Wer seinen exakten Zusatzbeitrag eingeben kann, kommt näher an die Lohnabrechnung heran.",
  },
  {
    q: "Ist der Brutto-Netto-Rechner von gehalt.de kostenlos?",
    a: "Ja. Der Brutto-Netto-Rechner von gehalt.de ist kostenlos und ohne Anmeldung nutzbar — ebenso wie der Rechner auf dieser Seite. Beide Anbieter finanzieren sich nicht über den Rechner selbst.",
  },
  {
    q: "Welcher Rechner kann das Steuerjahr 2027?",
    a: "Für 2027 gelten bereits beschlossene Eckwerte, etwa der Mindestlohn von 14,60 € pro Stunde. Auf der geprüften gehalt.de-Rechnerseite war im Juli 2026 keine 2027-Berechnung verfügbar; BruttoNettoCalculator bietet dafür einen eigenen Rechner. Wer eine Gehaltsverhandlung oder einen Jobwechsel für 2027 plant, sollte mit den 2027-Werten rechnen.",
  },
  {
    q: "Wo liegen die Stärken von gehalt.de?",
    a: "gehalt.de gehört zur Stepstone-Gruppe und hat seinen Schwerpunkt in einer großen Gehaltsdatenbank mit Vergleichswerten für Berufe und Branchen. Beim Rechner selbst sind die Berechnung vergangener Steuerjahre und der Detailmodus mit Geburtsjahr und individuellem Krankenkassensatz echte Vorteile.",
  },
  {
    q: "Warum zeigen zwei Rechner unterschiedliche Nettobeträge?",
    a: "Meist wegen unterschiedlicher Voreinstellungen: Krankenkassen-Zusatzbeitrag, Kirchensteuerpflicht, Kinderfreibeträge, Bundesland und der Pflegeversicherungszuschlag für Kinderlose ab 23 Jahren. Prüfen Sie diese fünf Werte in beiden Rechnern — danach stimmen die Ergebnisse in aller Regel bis auf Rundungsdifferenzen überein.",
  },
  {
    q: "Ist dieser Vergleich neutral?",
    a: "Nein — und das sagen wir offen: BruttoNettoCalculator ist unser eigenes Produkt. Deshalb ist jede Zeile der Tabelle mit einer Fußnote belegt, jede Angabe zu gehalt.de stammt von der öffentlich abrufbaren Rechnerseite (geprüft am " + GEPRUEFT_AM + "), und die Stärken des Wettbewerbers stehen genauso in der Tabelle wie unsere. Prüfen Sie beide Rechner mit Ihren eigenen Zahlen.",
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
const itemListJsonLd = {
  "@type": "ItemList",
  "@id": `${CANONICAL}#itemlist`,
  name: "Brutto-Netto-Rechner im Vergleich 2026",
  numberOfItems: 2,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "SoftwareApplication",
        name: "BruttoNettoCalculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: "https://bruttonettocalculator.com/brutto-netto-rechner-2026",
        publisher: { "@id": ORG_ID },
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "SoftwareApplication",
        name: "gehalt.de Brutto-Netto-Rechner",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: COMPETITOR_URL,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      },
    },
  ],
};

const schemaJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    breadcrumbJsonLd,
    {
      ...webPageSchema({
        name: "Brutto-Netto-Rechner im Vergleich 2026",
        url: CANONICAL,
        description:
          "Feature-Vergleich der Brutto-Netto-Rechner von BruttoNettoCalculator und gehalt.de — 2027-Vorschau, Netto-zu-Brutto, Spezialrechner und Datenquellen.",
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
      </span>
      {cell.note && <span className="text-[11px] text-black/55 leading-tight text-center">{cell.note}</span>}
    </div>
  );
}

export default function VergleichPage() {
  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 text-[#16181D] min-h-screen">
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
          <span className="text-gradient-accent">Brutto-Netto-Rechner</span> im Vergleich
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-4xl leading-relaxed mb-6">
          Ein Brutto-Netto-Rechner ist ein Online-Tool, das aus dem Bruttogehalt nach der amtlichen
          Steuerformel das Nettogehalt ermittelt. Alle seriösen Rechner nutzen dieselbe gesetzliche
          Grundlage — <strong className="text-[#16181D]">unterschiedlich sind die Funktionen</strong>. Dieser
          Vergleich stellt BruttoNettoCalculator und den Rechner von gehalt.de Zeile für Zeile
          gegenüber: Wer kann 2027, wer rechnet Netto zu Brutto, wer deckt Beamte, Midijob und
          Firmenwagen ab — und wo der Wettbewerber die Nase vorn hat.
        </p>
        <ReviewerByline />
      </div>

      {/* Offenlegung — direkt unter dem Hero, bevor der Vergleich beginnt */}
      <div className="mb-12 flex items-start gap-3 bg-[#F4F5F7] border border-black/[0.08] rounded-2xl p-5 text-sm text-black/70 leading-relaxed">
        <Info size={18} className="shrink-0 mt-0.5 text-[#E60A1C]" />
        <p>
          <strong className="text-[#16181D]">Offenlegung:</strong> BruttoNettoCalculator ist unser eigenes
          Produkt. Alle Angaben zu{" "}
          <a href={COMPETITOR_URL} target="_blank" rel="noopener noreferrer nofollow" className="underline hover:text-[#16181D]">
            gehalt.de <ExternalLink size={11} className="inline align-baseline" />
          </a>{" "}
          stammen von der öffentlich abrufbaren Rechnerseite, geprüft am {GEPRUEFT_AM}, und sind unten
          einzeln mit Fußnoten belegt. Stärken des Wettbewerbers stehen genauso in der Tabelle wie unsere.
        </p>
      </div>

      {/* Feature-Matrix */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Funktionen im direkten Vergleich
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-3xl">
          „Nicht auf dieser Seite“ bedeutet: auf der verglichenen Rechnerseite nicht angeboten — der
          Anbieter kann die Funktion an anderer Stelle führen.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-black/[0.10] shadow-sm">
          <table className="w-full text-left border-collapse min-w-[600px] bg-[#FFFFFF]">
            <thead>
              <tr className="bg-[#F1F3F5] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Merkmal</th>
                <th className="py-4 px-5 text-center text-[#E60A1C]">BruttoNettoCalculator</th>
                <th className="py-4 px-5 text-center">gehalt.de</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06] text-sm">
              {matrix.map((row) => (
                <tr key={row.feature} className="hover:bg-black/[0.02] transition-colors">
                  <td className="py-4 px-5 text-black/80 font-medium">
                    {row.feature}
                    {row.fn && (
                      <sup className="ml-1 text-[10px] text-black/45 font-mono">{row.fn}</sup>
                    )}
                  </td>
                  <td className="py-4 px-5"><Mark cell={row.uns} /></td>
                  <td className="py-4 px-5"><Mark cell={row.sie} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fußnoten — Belege je Tabellenzeile */}
        <ol className="mt-5 space-y-1.5 text-xs text-black/55 leading-relaxed list-decimal list-inside">
          {fussnoten.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link
            href="/brutto-netto-rechner-2026"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-[#E60A1C] hover:bg-[#c50918] text-white px-4 py-2.5 rounded-xl transition-colors"
          >
            Rechner 2026 öffnen <ArrowRight size={14} />
          </Link>
          <Link
            href="/brutto-netto-rechner-2027"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
          >
            Vorschau 2027 testen <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Was der Vergleich praktisch bedeutet */}
      <div className="mb-16 bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-6 sm:p-10">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Was die Unterschiede praktisch bedeuten
        </h2>
        <div className="space-y-6 text-sm sm:text-base text-black/70 leading-relaxed">
          <div>
            <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-2">
              Steuerjahr 2027: relevant für jede Verhandlung ab Herbst
            </h3>
            <p>
              Wer heute über ein Gehalt ab Januar 2027 verhandelt, sollte auch mit den 2027-Werten
              rechnen — der Mindestlohn steigt dann auf 14,60 € pro Stunde. Auf der geprüften
              gehalt.de-Rechnerseite war dafür im Juli 2026 keine Option vorhanden. Unser{" "}
              <Link href="/brutto-netto-rechner-2027" className="text-[#E60A1C] font-semibold hover:underline">
                Rechner für 2027
              </Link>{" "}
              stellt die beschlossenen Eckwerte dem Jahr 2026 gegenüber.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-2">
              Netto zu Brutto: die Frage vor jedem Jobwechsel
            </h3>
            <p>
              „Ich will 2.500 € netto — welches Brutto muss ich fordern?“ Diese Umkehrrechnung steckt
              bei uns im selben Rechner (Umschalter), gehalt.de verweist dafür auf ein separates Tool.
              Direkt zum{" "}
              <Link href="/rechner/netto-zu-brutto" className="text-[#E60A1C] font-semibold hover:underline">
                Netto-zu-Brutto-Rechner
              </Link>.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-2">
              Sonderfälle: Beamte, Midijob, Firmenwagen
            </h3>
            <p>
              Für Beamte gilt eine andere Logik — keine Sozialabgaben, dafür Beihilfe und private
              Krankenversicherung. Im Midijob-Übergangsbereich (603–2.000 € brutto) sind die
              Arbeitnehmer-Beiträge reduziert. Und ein Firmenwagen erhöht über die 1 %-Regelung das zu
              versteuernde Brutto. Für alle drei Fälle gibt es hier eigene Rechner:{" "}
              <Link href="/brutto-netto-rechner-beamte" className="text-[#E60A1C] font-semibold hover:underline">Beamten-Rechner</Link>,{" "}
              <Link href="/midijob-rechner" className="text-[#E60A1C] font-semibold hover:underline">Midijob-Rechner</Link>,{" "}
              <Link href="/firmenwagenrechner" className="text-[#E60A1C] font-semibold hover:underline">Firmenwagenrechner</Link>.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-2">
              Wo gehalt.de stärker ist
            </h3>
            <p>
              Fairerweise: gehalt.de kann vergangene Steuerjahre berechnen — praktisch, wenn Sie eine
              alte Abrechnung nachvollziehen wollen. Der Detailmodus erlaubt außerdem die Eingabe von
              Geburtsjahr und individuellem Krankenkassensatz; wir rechnen mit dem durchschnittlichen
              Zusatzbeitrag von 2,9 %. Und als Teil der Stepstone-Gruppe steht dahinter eine große
              Gehaltsdatenbank mit Branchen-Vergleichswerten.
            </p>
          </div>
        </div>
      </div>

      {/* Beispielrechnung mit Chart */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
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
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
          Woran Sie einen verlässlichen Brutto-Netto-Rechner erkennen
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-3xl">
          Wenn zwei Rechner unterschiedliche Nettobeträge zeigen, liegt das fast nie an einem
          Rechenfehler, sondern an Voreinstellungen. Diese fünf Punkte entscheiden, wie nah ein
          Ergebnis an Ihrer echten Lohnabrechnung liegt — prüfen Sie sie in jedem Rechner:
        </p>
        <div className="space-y-3">
          {[
            {
              t: "Nennt der Rechner sein Steuerjahr und seine Rechtsgrundlage?",
              d: "Seriöse Rechner schreiben hin, mit welchem Jahr sie rechnen (2026 oder 2027) und auf welcher Grundlage — der Einkommensteuer-Formel nach § 32a EStG und den Sozialversicherungs-Rechengrößen. Fehlt beides, wissen Sie nicht, ob die Werte aktuell sind.",
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
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-4">
          Methodik: So wurde verglichen
        </h2>
        <ul className="space-y-2.5 text-sm sm:text-base text-black/70 leading-relaxed">
          <li className="flex gap-3">
            <Check size={18} className="text-[#0F7A3D] shrink-0 mt-0.5" />
            <span>Grundlage ist ausschließlich die <strong className="text-[#16181D]">öffentlich abrufbare Rechnerseite</strong> des Wettbewerbers, aufgerufen am {GEPRUEFT_AM} — ohne Konto, ohne Login.</span>
          </li>
          <li className="flex gap-3">
            <Check size={18} className="text-[#0F7A3D] shrink-0 mt-0.5" />
            <span>Jede Tabellenzeile mit Unterschied trägt eine <strong className="text-[#16181D]">Fußnote mit Beleg</strong>. Was sich nicht belegen ließ, steht als „nicht auf dieser Seite“ — nicht als Nein.</span>
          </li>
          <li className="flex gap-3">
            <Check size={18} className="text-[#0F7A3D] shrink-0 mt-0.5" />
            <span>Es werden <strong className="text-[#16181D]">keine Nutzerbewertungen oder Sterne</strong> ausgewiesen — uns liegen dazu keine belastbaren Daten vor.</span>
          </li>
          <li className="flex gap-3">
            <Check size={18} className="text-[#0F7A3D] shrink-0 mt-0.5" />
            <span>Der Vergleich wird <strong className="text-[#16181D]">quartalsweise geprüft</strong>. Ändert der Wettbewerber seinen Funktionsumfang, wird die Tabelle korrigiert.</span>
          </li>
        </ul>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
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
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
          Fazit: Rechnen Sie mit Ihren eigenen Zahlen
        </h2>
        <p className="text-base sm:text-lg text-black/80 leading-relaxed mb-6 max-w-4xl">
          Für die reine Berechnung des Nettogehalts 2026 nehmen sich beide Rechner wenig — sie nutzen
          dieselbe gesetzliche Formel. Der Unterschied liegt im Drumherum: Wer die
          <strong className="text-[#16181D]"> Vorschau auf 2027</strong>, die
          <strong className="text-[#16181D]"> integrierte Netto-zu-Brutto-Rechnung</strong> oder einen
          Sonderfall wie Beamte, Midijob oder Firmenwagen braucht, findet das hier. Wer eine
          <strong className="text-[#16181D]"> alte Abrechnung nachrechnen</strong> oder seinen exakten
          Krankenkassensatz eingeben will, ist bei gehalt.de gut aufgehoben.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/brutto-netto-rechner-2026"
            className="inline-flex items-center gap-1.5 text-sm font-bold bg-[#E60A1C] hover:bg-[#c50918] text-white px-5 py-3 rounded-xl transition-colors"
          >
            Jetzt Netto 2026 berechnen <ArrowRight size={15} />
          </Link>
          <Link
            href="/rechner/netto-zu-brutto"
            className="inline-flex items-center gap-1.5 text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-5 py-3 rounded-xl transition-colors"
          >
            Netto zu Brutto rechnen <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}
