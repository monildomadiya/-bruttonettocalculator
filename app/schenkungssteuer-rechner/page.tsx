import type { Metadata } from "next";
import Link from "next/link";
import ErbschaftsteuerRechner from "../erbschaftssteuer-rechner/ErbschaftsteuerRechner";
import RelatedCalculators from "@/components/RelatedCalculators";
import { VERWANDTSCHAFT } from "@/lib/erbschaftsteuer";
import { formatEUR } from "@/lib/taxCalculator";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";

export const metadata: Metadata = {
  title: "Schenkungssteuer-Rechner 2026: Freibetrag & Steuer berechnen",
  description:
    "Schenkungssteuer berechnen: Freibeträge nach Verwandtschaftsgrad, die 10-Jahres-Frist und Steuersätze von 7 bis 50 %. Mit Nießbrauch und Kettenschenkung erklärt.",
  keywords: [
    "Schenkungssteuer Rechner",
    "Schenkungssteuer berechnen",
    "Schenkungssteuer Freibetrag",
    "Schenkungssteuer wie hoch",
    "Schenkungssteuer Kinder",
    "Schenkung 10 Jahre Frist",
    "Schenkungssteuer Immobilie",
    "Schenkungssteuer 2026",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/schenkungssteuer-rechner" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Schenkungssteuer-Rechner 2026 — Freibetrag & Steuer",
    description: "Wie viel Schenkungssteuer fällt an? Mit Freibeträgen, 10-Jahres-Frist und Härteausgleich.",
    url: "https://bruttonettocalculator.com/schenkungssteuer-rechner",
    locale: "de_DE",
    type: "website",
  },
};

const faqs = [
  {
    q: "Wie hoch ist der Freibetrag bei einer Schenkung?",
    a: "Ehepartner und eingetragene Lebenspartner haben 500.000 €, Kinder 400.000 €, Enkel 200.000 €. Geschwister, Nichten, Neffen, Schwiegerkinder und Nichtverwandte haben 20.000 €. Anders als im Erbfall stehen Eltern bei einer Schenkung nur in Steuerklasse II mit 20.000 € Freibetrag (§ 15, § 16 ErbStG).",
  },
  {
    q: "Wie oft kann ich den Freibetrag nutzen?",
    a: "Alle zehn Jahre erneut und in voller Höhe. Die Frist läuft taggenau ab der jeweiligen Schenkung, nicht kalenderjahrweise. Wer früh beginnt, kann den Freibetrag mehrfach ausschöpfen — bei einem Kind sind das über 30 Jahre viermal 400.000 €.",
  },
  {
    q: "Was ist der Unterschied zwischen Schenkungs- und Erbschaftssteuer?",
    a: "Tarif, Steuerklassen und Freibeträge sind weitgehend identisch — beide Steuern stehen im selben Gesetz. Zwei Unterschiede zählen: Den Versorgungsfreibetrag nach § 17 ErbStG gibt es nur im Erbfall. Dafür stehen die Freibeträge bei Schenkungen alle zehn Jahre neu zu, während im Erbfall nur einmal abgezogen wird.",
  },
  {
    q: "Werden frühere Schenkungen angerechnet?",
    a: "Ja. Alle Zuwendungen derselben Person innerhalb von zehn Jahren werden zusammengerechnet (§ 14 ErbStG). Das gilt auch über den Tod hinaus: Schenkungen in den letzten zehn Jahren vor dem Erbfall werden dem Nachlass hinzugerechnet. Nur der einmal gewährte Freibetrag zählt für den gesamten Zeitraum.",
  },
  {
    q: "Wie funktioniert eine Schenkung unter Nießbrauchvorbehalt?",
    a: "Der Schenker überträgt das Eigentum, behält sich aber die Nutzung vor — bei einer Immobilie also die Mieteinnahmen oder das Wohnrecht. Der Kapitalwert dieses Nießbrauchs mindert den steuerpflichtigen Wert der Schenkung, oft erheblich. Wie stark, hängt vom Alter des Schenkers und dem Jahreswert der Nutzung ab.",
  },
  {
    q: "Was ist eine Kettenschenkung?",
    a: "Statt direkt an das Schwiegerkind zu schenken (Klasse II, 20.000 € Freibetrag), schenkt man zunächst dem eigenen Kind (Klasse I, 400.000 €), das anschließend weiterschenkt. Das ist zulässig, verlangt aber echte Verfügungsfreiheit des Zwischenerwerbers — eine vertragliche Weitergabepflicht lässt das Finanzamt die Gestaltung verwerfen.",
  },
  {
    q: "Muss ich eine Schenkung dem Finanzamt melden?",
    a: "Ja, innerhalb von drei Monaten (§ 30 ErbStG) — und zwar sowohl vom Schenker als auch vom Beschenkten. Die Anzeigepflicht besteht unabhängig davon, ob am Ende Steuer anfällt. Bei notariell beurkundeten Schenkungen übernimmt der Notar die Meldung.",
  },
  {
    q: "Sind Gelegenheitsgeschenke steuerpflichtig?",
    a: "Übliche Gelegenheitsgeschenke zu Anlässen wie Geburtstag, Hochzeit oder Weihnachten bleiben nach § 13 Abs. 1 Nr. 14 ErbStG steuerfrei. Eine feste Wertgrenze nennt das Gesetz nicht — maßgeblich ist, was gemessen an den Vermögensverhältnissen der Beteiligten als üblich gilt.",
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
  const kind = VERWANDTSCHAFT.find((v) => v.key === "kind")!;

  return (
    <div className="max-w-6xl mx-auto px-5">
      <section className="py-6" aria-labelledby="ss-kurzantwort">
        <div className="bg-[#FFFFFF] border-l-4 border-[#E60A1C] rounded-2xl p-6 sm:p-7 shadow-sm">
          <h2 id="ss-kurzantwort" className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">
            Kurzantwort
          </h2>
          <p className="text-black/75 text-sm sm:text-base leading-relaxed">
            Schenkungen sind bis zum persönlichen Freibetrag steuerfrei — 500.000 € für Ehepartner,
            400.000 € für Kinder, 200.000 € für Enkel, 20.000 € für alle Übrigen. Der entscheidende
            Unterschied zur Erbschaft: Diese Freibeträge stehen{" "}
            <strong className="text-[#16181D]">alle zehn Jahre neu</strong> zu. Wer rechtzeitig beginnt,
            überträgt so ein Vielfaches steuerfrei. Der Steuersatz auf den übersteigenden Teil liegt
            zwischen 7 % und 50 %.
          </p>
        </div>
      </section>

      {/* 10-Jahres-Frist */}
      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4"
        aria-labelledby="ss-zehnjahre"
      >
        <h2 id="ss-zehnjahre" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Die 10-Jahres-Frist — der ganze Trick
        </h2>
        <p>
          Bei der Erbschaft wird der Freibetrag genau einmal abgezogen. Bei Schenkungen lebt er alle zehn
          Jahre wieder auf. Aus diesem einen Unterschied ergibt sich die wichtigste Gestaltung im
          Erbschaftsteuerrecht.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Übertragung an ein Kind</th>
                <th className="py-4 px-5 text-right">Steuerfrei übertragbar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              <tr className="hover:bg-black/[0.03] transition-colors">
                <td className="py-4 px-5 font-semibold text-[#16181D]">Einmalig im Erbfall</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-black/70">
                  {formatEUR(kind.freibetrag)}
                </td>
              </tr>
              {[2, 3, 4].map((n) => (
                <tr key={n} className="hover:bg-black/[0.03] transition-colors">
                  <td className="py-4 px-5 font-semibold text-[#16181D]">
                    {n} Schenkungen im Abstand von 10 Jahren
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-emerald-600 bg-emerald-50/60">
                    {formatEUR(kind.freibetrag * n)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Zwei Details entscheiden über den Erfolg. Erstens läuft die Frist{" "}
          <strong className="text-[#16181D]">taggenau</strong> ab der jeweiligen Schenkung — wer am 1. März
          2026 schenkt, kann den Freibetrag am 2. März 2036 erneut nutzen. Zweitens greift sie auch
          rückwärts: Schenkungen in den letzten zehn Jahren vor dem Tod werden dem Nachlass hinzugerechnet
          (§ 14 ErbStG). Eine Schenkung kurz vor dem Erbfall bringt daher nichts.
        </p>
        <p>
          Weil beide Elternteile jeweils eigene Freibeträge haben, verdoppelt sich der Effekt bei
          verheirateten Schenkern: 800.000 € pro Kind alle zehn Jahre.
        </p>
      </section>

      {/* Nießbrauch */}
      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4"
        aria-labelledby="ss-niessbrauch"
      >
        <h2 id="ss-niessbrauch" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Immobilie schenken, Nutzung behalten
        </h2>
        <p>
          Der häufigste Fall in der Praxis: Eltern übertragen das Haus, wollen aber weiter darin wohnen oder
          die Mieteinnahmen behalten. Das leistet der{" "}
          <strong className="text-[#16181D]">Nießbrauchvorbehalt</strong> — und er senkt zugleich die
          Steuer.
        </p>
        <p>
          Der Kapitalwert des vorbehaltenen Nießbrauchs wird vom Wert der Schenkung abgezogen. Er ergibt
          sich aus dem Jahreswert der Nutzung, multipliziert mit einem Vervielfältiger, der sich nach der
          statistischen Lebenserwartung des Schenkers richtet. Je jünger der Schenker, desto höher der
          Abzug.
        </p>
        <p>
          Tragen Sie den geschätzten Kapitalwert im Rechner oben unter „übernommene Schulden“ ein, um die
          Wirkung zu sehen. Den exakten Wert ermittelt das Finanzamt nach dem Bewertungsgesetz — für eine
          belastbare Zahl führt kein Weg an einer Beratung vorbei.
        </p>
      </section>

      {/* Fehler */}
      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4"
        aria-labelledby="ss-fehler"
      >
        <h2 id="ss-fehler" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Drei Fehler, die teuer werden
        </h2>
        <ol>
          <li>
            <strong className="text-[#16181D]">Zu spät anfangen.</strong> Die 10-Jahres-Frist ist der
            gesamte Hebel. Wer mit 75 beginnt, nutzt den Freibetrag realistisch noch einmal — wer mit 55
            beginnt, drei- bis viermal.
          </li>
          <li>
            <strong className="text-[#16181D]">Anzeige vergessen.</strong> Schenker und Beschenkter müssen
            binnen drei Monaten anzeigen (§ 30 ErbStG), auch wenn keine Steuer anfällt. Banken melden
            größere Übertragungen ohnehin.
          </li>
          <li>
            <strong className="text-[#16181D]">Kettenschenkung zu offensichtlich gestalten.</strong> Der Weg
            über das eigene Kind zum Schwiegerkind ist zulässig — aber nur, wenn der Zwischenerwerber
            tatsächlich frei über das Geschenk verfügen konnte. Steht die Weitergabe schon im Vertrag,
            rechnet das Finanzamt direkt zwischen den Endbeteiligten ab.
          </li>
        </ol>
        <p>
          Wie sich derselbe Vermögensübergang im Todesfall auswirkt, zeigt der{" "}
          <Link href="/erbschaftssteuer-rechner" className="text-[#E60A1C] font-semibold hover:underline">
            Erbschaftssteuer-Rechner
          </Link>
          . Dort finden Sie auch die vollständige Freibetrags- und Tariftabelle sowie die Steuerbefreiung
          für das Familienheim.
        </p>
      </section>
    </div>
  );
}

export default function SchenkungssteuerRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ErbschaftsteuerRechner modus="schenkung" faqs={faqs} content={<Content />} />
      <RelatedCalculators
        links={[
          { href: "/erbschaftssteuer-rechner", label: "Erbschaftssteuer-Rechner", desc: "Freibeträge & Tarif" },
          { href: "/mieteinnahmen-versteuern", label: "Mieteinnahmen versteuern", desc: "Steuer auf Mieteinnahmen" },
          { href: "/immobilienkredit-rechner", label: "Immobilienkredit-Rechner", desc: "Finanzierung planen" },
          { href: "/", label: "Brutto-Netto-Rechner", desc: "Vollständiges Nettogehalt 2026" },
        ]}
      />
      <ToolContent config={TOOL_CONTENT["/schenkungssteuer-rechner"]} />
    </>
  );
}
