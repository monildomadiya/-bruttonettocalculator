import type { Metadata } from "next";
import Link from "next/link";
import ErbschaftsteuerRechner from "./ErbschaftsteuerRechner";
import RelatedCalculators from "@/components/RelatedCalculators";
import { VERWANDTSCHAFT, TARIF } from "@/lib/erbschaftsteuer";
import { formatEUR } from "@/lib/taxCalculator";

export const metadata: Metadata = {
  title: "Erbschaftssteuer-Rechner 2026: Freibetrag & Steuer berechnen",
  description:
    "Erbschaftssteuer berechnen: Freibeträge nach Verwandtschaftsgrad, Steuerklassen I–III und Steuersätze von 7 bis 50 %. Kostenlos, mit Härteausgleich.",
  keywords: [
    "Erbschaftssteuer Rechner",
    "Erbschaftssteuer berechnen",
    "Erbschaftssteuer Freibetrag",
    "Erbschaftssteuer wie hoch",
    "Erbschaftssteuer Kinder",
    "Erbschaftssteuer Immobilie",
    "Erbschaftssteuer Steuerklassen",
    "Erbschaftssteuer 2026",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/erbschaftssteuer-rechner" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Erbschaftssteuer-Rechner 2026 — Freibetrag & Steuer",
    description: "Wie viel Erbschaftssteuer fällt an? Mit Freibeträgen, Steuerklassen und Härteausgleich.",
    url: "https://bruttonettocalculator.com/erbschaftssteuer-rechner",
    locale: "de_DE",
    type: "website",
  },
};

const faqs = [
  {
    q: "Wie hoch ist der Freibetrag bei der Erbschaftssteuer?",
    a: "Ehepartner und eingetragene Lebenspartner haben 500.000 €, Kinder und Stiefkinder 400.000 €, Enkel 200.000 € und Eltern im Erbfall 100.000 €. Geschwister, Nichten, Neffen, Schwiegerkinder und alle Nichtverwandten haben nur 20.000 € (§ 16 ErbStG). Nur der Betrag oberhalb des Freibetrags wird besteuert.",
  },
  {
    q: "Wie hoch ist die Erbschaftssteuer?",
    a: "Der Satz hängt von Steuerklasse und Höhe des steuerpflichtigen Erwerbs ab. In Steuerklasse I reicht er von 7 % bis 30 %, in Klasse II von 15 % bis 43 % und in Klasse III von 30 % bis 50 %. Anders als bei der Einkommensteuer gilt der Satz für den gesamten Erwerb, nicht stufenweise.",
  },
  {
    q: "Welche Steuerklasse gilt für wen?",
    a: "Klasse I umfasst Ehepartner, Kinder, Enkel sowie Eltern und Großeltern im Erbfall. Klasse II gilt für Geschwister, Nichten und Neffen, Stiefeltern, Schwiegerkinder und -eltern sowie geschiedene Ehepartner. Klasse III trifft alle übrigen, etwa Freunde oder unverheiratete Partner (§ 15 ErbStG).",
  },
  {
    q: "Muss ich für ein geerbtes Haus Erbschaftssteuer zahlen?",
    a: "Nicht zwingend. Erbt der Ehepartner das selbst genutzte Familienheim, bleibt es vollständig steuerfrei, wenn er dort mindestens zehn Jahre weiter wohnt. Für Kinder gilt dasselbe, allerdings begrenzt auf 200 Quadratmeter Wohnfläche — der darüber hinausgehende Teil wird besteuert (§ 13 Abs. 1 Nr. 4b und 4c ErbStG).",
  },
  {
    q: "Wie wird eine geerbte Immobilie bewertet?",
    a: "Maßgeblich ist der steuerliche Verkehrswert nach dem Bewertungsgesetz, nicht der ursprüngliche Kaufpreis. Das Finanzamt ermittelt ihn je nach Objekt über das Vergleichswert-, Ertragswert- oder Sachwertverfahren. Wer den Wert für zu hoch hält, kann durch ein eigenes Gutachten einen niedrigeren Wert nachweisen.",
  },
  {
    q: "Was ist der Härteausgleich?",
    a: "Weil der Steuersatz auf den gesamten Erwerb angewendet wird, würde ein Euro über einer Tarifstufe die Steuer sprunghaft erhöhen. Der Härteausgleich nach § 19 Abs. 3 ErbStG begrenzt diesen Effekt: Vom Betrag oberhalb der Stufengrenze dürfen höchstens 50 % — in den oberen Stufen 75 % — zusätzlich erhoben werden.",
  },
  {
    q: "Bis wann muss ich eine Erbschaft melden?",
    a: "Innerhalb von drei Monaten nach Kenntnis vom Erbfall müssen Sie den Erwerb beim zuständigen Finanzamt anzeigen (§ 30 ErbStG). Das gilt auch dann, wenn der Freibetrag den Erwerb voraussichtlich vollständig abdeckt. Ob eine vollständige Steuererklärung nötig ist, entscheidet danach das Finanzamt.",
  },
  {
    q: "Kann ich Erbschaftssteuer legal vermeiden?",
    a: "Der wirksamste Hebel ist die Schenkung zu Lebzeiten: Freibeträge stehen alle zehn Jahre neu zu, wer früh beginnt, kann sie mehrfach nutzen. Weitere Ansätze sind die Steuerbefreiung für das Familienheim, die Übertragung unter Nießbrauchvorbehalt und bei Ehepaaren die Wahl der Güterstände. Das ersetzt keine Beratung — lassen Sie größere Vermögen fachlich prüfen.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function Content() {
  const erbfallKlasse1 = VERWANDTSCHAFT.filter((v) => v.steuerklasse === 1);

  return (
    <div className="max-w-6xl mx-auto px-5">
      <section className="py-6" aria-labelledby="es-kurzantwort">
        <div className="bg-[#FFFFFF] border-l-4 border-[#E60A1C] rounded-2xl p-6 sm:p-7 shadow-sm">
          <h2 id="es-kurzantwort" className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">
            Kurzantwort
          </h2>
          <p className="text-black/75 text-sm sm:text-base leading-relaxed">
            Besteuert wird nur der Teil des Erbes, der{" "}
            <strong className="text-[#16181D]">über dem persönlichen Freibetrag</strong> liegt. Der beträgt
            500.000 € für Ehepartner, 400.000 € für Kinder und 200.000 € für Enkel — für Geschwister und
            Nichtverwandte dagegen nur 20.000 €. Der Steuersatz richtet sich nach Verwandtschaftsgrad und
            Höhe des Erwerbs und reicht von <strong className="text-[#16181D]">7 % bis 50 %</strong>. In der
            Praxis bleiben die meisten Erbschaften innerhalb der Familie deshalb steuerfrei.
          </p>
        </div>
      </section>

      {/* Freibeträge */}
      <section className="py-6" aria-labelledby="es-freibetraege">
        <h2 id="es-freibetraege" className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Freibeträge nach Verwandtschaftsgrad
        </h2>
        <p className="text-black/65 text-sm sm:text-base mb-5 max-w-3xl">
          Persönliche Freibeträge nach § 16 ErbStG. Der Versorgungsfreibetrag nach § 17 ErbStG kommt nur im
          Erbfall hinzu — bei einer Schenkung gibt es ihn nicht.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Verhältnis</th>
                <th className="py-4 px-5 text-center">Steuerklasse</th>
                <th className="py-4 px-5 text-right text-[#16181D] font-bold">Freibetrag</th>
                <th className="py-4 px-5 text-right">Versorgungsfreibetrag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {VERWANDTSCHAFT.map((v) => (
                <tr key={v.key} className="hover:bg-black/[0.03] transition-colors">
                  <td className="py-4 px-5 font-semibold text-[#16181D]">{v.label}</td>
                  <td className="py-4 px-5 text-center font-mono text-black/70">{v.steuerklasse}</td>
                  <td className="py-4 px-5 text-right font-bold font-mono text-emerald-600 bg-emerald-50/60">
                    {formatEUR(v.freibetrag)}
                  </td>
                  <td className="py-4 px-5 text-right font-mono text-black/60">
                    {v.versorgungsfreibetrag ? formatEUR(v.versorgungsfreibetrag) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3">
          Bei Kindern ist der Versorgungsfreibetrag nach Alter gestaffelt und entfällt ab dem 27.
          Lebensjahr. Der angegebene Wert gilt für Kinder bis fünf Jahre.
        </p>
      </section>

      {/* Steuersätze */}
      <section className="py-6" aria-labelledby="es-saetze">
        <h2 id="es-saetze" className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Steuersätze nach § 19 ErbStG
        </h2>
        <p className="text-black/65 text-sm sm:text-base mb-5 max-w-3xl">
          Der Satz gilt für den <strong className="text-[#16181D]">gesamten</strong> steuerpflichtigen
          Erwerb — nicht stufenweise wie bei der Einkommensteuer. Deshalb gibt es den Härteausgleich an den
          Stufengrenzen.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Erwerb bis</th>
                <th className="py-4 px-5 text-right">Klasse I</th>
                <th className="py-4 px-5 text-right">Klasse II</th>
                <th className="py-4 px-5 text-right">Klasse III</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {TARIF.map((stufe, i) => (
                <tr key={i} className="hover:bg-black/[0.03] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#16181D] font-mono">
                    {stufe.bis === Infinity ? "darüber" : formatEUR(stufe.bis)}
                  </td>
                  <td className="py-4 px-5 text-right font-mono text-emerald-600 font-bold">
                    {(stufe.saetze[1] * 100).toFixed(0)} %
                  </td>
                  <td className="py-4 px-5 text-right font-mono text-black/70">
                    {(stufe.saetze[2] * 100).toFixed(0)} %
                  </td>
                  <td className="py-4 px-5 text-right font-mono text-black/70">
                    {(stufe.saetze[3] * 100).toFixed(0)} %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Familienheim */}
      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4"
        aria-labelledby="es-familienheim"
      >
        <h2 id="es-familienheim" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Das Familienheim bleibt oft steuerfrei
        </h2>
        <p>
          Die wichtigste Ausnahme im Erbschaftsteuerrecht — und der Grund, warum viele geerbte Häuser gar
          nicht besteuert werden. Nach § 13 Abs. 1 Nr. 4b und 4c ErbStG bleibt das selbst genutzte
          Familienheim steuerfrei, wenn:
        </p>
        <ul>
          <li>der <strong className="text-[#16181D]">Ehepartner</strong> erbt und mindestens zehn Jahre dort wohnen bleibt — ohne Größenbegrenzung,</li>
          <li>ein <strong className="text-[#16181D]">Kind</strong> erbt, dort einzieht und ebenfalls zehn Jahre bleibt — allerdings nur bis 200 m² Wohnfläche.</li>
        </ul>
        <p>
          Der Haken ist die Zehnjahresfrist: Wer vorher auszieht oder verkauft, verliert die Befreiung
          rückwirkend vollständig. Ausgenommen sind nur zwingende Gründe wie Pflegebedürftigkeit.
        </p>
        <p>
          Bei vermieteten Wohnimmobilien gibt es keine vollständige Befreiung, wohl aber einen
          Bewertungsabschlag von 10 % (§ 13d ErbStG). Was eine geerbte Mietwohnung laufend an Steuer kostet,
          zeigt der Rechner zu{" "}
          <Link href="/mieteinnahmen-versteuern" className="text-[#E60A1C] font-semibold hover:underline">
            Mieteinnahmen
          </Link>
          .
        </p>
      </section>

      {/* Gestaltung */}
      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4"
        aria-labelledby="es-gestaltung"
      >
        <h2 id="es-gestaltung" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Der stärkste Hebel: früh schenken
        </h2>
        <p>
          Freibeträge stehen bei Schenkungen <strong className="text-[#16181D]">alle zehn Jahre neu</strong>{" "}
          zu. Wer mit 55 beginnt, kann den Kinderfreibetrag von 400.000 € bis zum 85. Lebensjahr viermal
          nutzen — also 1,6 Mio. € steuerfrei übertragen, statt einmalig 400.000 €.
        </p>
        <p>
          Die Frist läuft vom Tag der jeweiligen Schenkung, nicht kalenderjahrweise. Und sie wirkt in beide
          Richtungen: Schenkungen innerhalb der letzten zehn Jahre vor dem Todesfall werden dem Nachlass
          hinzugerechnet (§ 14 ErbStG). Frühzeitig zu beginnen ist deshalb der entscheidende Faktor.
        </p>
        <p>
          Durchrechnen können Sie das im{" "}
          <Link href="/schenkungssteuer-rechner" className="text-[#E60A1C] font-semibold hover:underline">
            Schenkungssteuer-Rechner
          </Link>
          . Bei größeren Vermögen, Betriebsvermögen oder Auslandsbezug gehört die Gestaltung in fachkundige
          Hände — dieser Rechner liefert eine Orientierung, keine Beratung.
        </p>
      </section>
    </div>
  );
}

export default function ErbschaftssteuerRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ErbschaftsteuerRechner modus="erbschaft" faqs={faqs} content={<Content />} />
      <RelatedCalculators
        links={[
          { href: "/schenkungssteuer-rechner", label: "Schenkungssteuer-Rechner", desc: "Freibetrag alle 10 Jahre" },
          { href: "/mieteinnahmen-versteuern", label: "Mieteinnahmen versteuern", desc: "Steuer auf Mieteinnahmen" },
          { href: "/einkommensteuer-rechner", label: "Einkommensteuer-Rechner", desc: "Jahressteuer § 32a EStG" },
          { href: "/", label: "Brutto-Netto-Rechner", desc: "Vollständiges Nettogehalt 2026" },
        ]}
      />
    </>
  );
}
