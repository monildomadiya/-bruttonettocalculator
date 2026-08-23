import type { Metadata } from "next";
import Link from "next/link";
import UeberstundenRechner from "./UeberstundenRechner";
import RelatedCalculators from "@/components/RelatedCalculators";

export const metadata: Metadata = {
  title: "Überstunden auszahlen Rechner 2026: Was bleibt netto?",
  description:
    "Überstunden-Rechner 2026: Wie viel von ausgezahlten Überstunden netto bleibt — inklusive steuerfreier Zuschläge für Nacht-, Sonntags- und Feiertagsarbeit.",
  keywords: [
    "Überstunden auszahlen Rechner",
    "Überstunden Rechner netto",
    "Überstunden auszahlen Steuern",
    "Überstunden versteuern",
    "Überstunden auszahlen Rechner Steuerklasse 1",
    "Nachtzuschlag steuerfrei",
    "Sonntagszuschlag steuerfrei",
    "Feiertagszuschlag berechnen",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/ueberstunden-rechner" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Überstunden auszahlen — Netto-Rechner 2026",
    description: "Was von ausgezahlten Überstunden netto bleibt, inklusive steuerfreier Zuschläge nach § 3b EStG.",
    url: "https://bruttonettocalculator.com/ueberstunden-rechner",
    locale: "de_DE",
    type: "website",
  },
};

/** Muss inhaltlich mit den FAQ-Fragen in UeberstundenRechner.tsx übereinstimmen. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wie werden ausgezahlte Überstunden versteuert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ausgezahlte Überstunden sind normaler laufender Arbeitslohn. Sie werden zusammen mit dem Monatsgehalt versteuert und voll verbeitragt — es gibt keinen ermäßigten Steuersatz. Weil das Monatsbrutto steigt, greift auf den Zusatzbetrag der persönliche Grenzsteuersatz.",
      },
    },
    {
      "@type": "Question",
      name: "Sind Überstunden steuerfrei?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Überstunde selbst nie. Steuerfrei sein können nur Zuschläge für Nacht-, Sonntags- und Feiertagsarbeit nach § 3b EStG, und auch nur bis zu bestimmten Prozentsätzen des Grundlohns.",
      },
    },
    {
      "@type": "Question",
      name: "Wie hoch sind die steuerfreien Zuschläge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "25 % für Nachtarbeit zwischen 20 und 6 Uhr, 40 % für Nachtarbeit zwischen 0 und 4 Uhr bei vor Mitternacht begonnener Arbeit, 50 % für Sonntagsarbeit, 125 % für gesetzliche Feiertage und 150 % für den 24.12. ab 14 Uhr, den 25. und 26.12. sowie den 1. Mai.",
      },
    },
    {
      "@type": "Question",
      name: "Gibt es eine Obergrenze für steuerfreie Zuschläge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. Steuerfrei bleiben Zuschläge nur, soweit der Grundlohn 50 € pro Stunde nicht übersteigt (§ 3b Abs. 2 EStG). Beitragsfrei in der Sozialversicherung sind sie sogar nur bis zu einem Grundlohn von 25 € pro Stunde.",
      },
    },
    {
      "@type": "Question",
      name: "Ist Auszahlung oder Freizeitausgleich günstiger?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rein finanziell fast immer der Freizeitausgleich. Bei der Auszahlung gehen je nach Steuerklasse rund 30 bis 45 Prozent an Steuern und Sozialabgaben ab, beim Freizeitausgleich bekommen Sie die Zeit ungekürzt zurück.",
      },
    },
    {
      "@type": "Question",
      name: "Muss mein Arbeitgeber Überstunden auszahlen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nicht automatisch. Ob ausgezahlt oder in Freizeit ausgeglichen wird, richtet sich nach Arbeitsvertrag, Betriebsvereinbarung oder Tarifvertrag. Pauschale Abgeltungsklauseln sind bei normalen Gehältern häufig unwirksam.",
      },
    },
  ],
};

function Content() {
  return (
    <div className="max-w-6xl mx-auto px-5">
      <section className="py-6" aria-labelledby="ue-kurzantwort">
        <div className="bg-[#FFFFFF] border-l-4 border-[#E60A1C] rounded-2xl p-6 sm:p-7 shadow-sm">
          <h2 id="ue-kurzantwort" className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">
            Kurzantwort
          </h2>
          <p className="text-black/75 text-sm sm:text-base leading-relaxed">
            Ausgezahlte Überstunden sind <strong className="text-[#16181D]">normaler Arbeitslohn</strong> —
            sie werden mit dem Monatsgehalt zusammen versteuert und voll verbeitragt. Einen ermäßigten
            Steuersatz gibt es nicht. Je nach Steuerklasse bleiben typischerweise{" "}
            <strong className="text-[#16181D]">55 bis 70 Prozent</strong> netto übrig. Steuerfrei sind
            ausschließlich <strong className="text-[#16181D]">Zuschläge</strong> für Nacht-, Sonntags- und
            Feiertagsarbeit nach § 3b EStG — und auch die nur bis zu einem Grundlohn von 50 € pro Stunde.
          </p>
        </div>
      </section>

      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4"
        aria-labelledby="ue-zuschlaege"
      >
        <h2 id="ue-zuschlaege" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Die steuerfreien Zuschläge nach § 3b EStG
        </h2>
        <p>
          Hier liegt der einzige echte Steuervorteil bei Überstunden — und er wird oft übersehen. Nicht die
          Überstunde ist begünstigt, sondern der <strong className="text-[#16181D]">Zuschlag</strong>, der
          für ungünstige Arbeitszeiten obendrauf gezahlt wird.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Arbeitszeit</th>
                <th className="py-4 px-5 text-right">Steuerfrei bis</th>
                <th className="py-4 px-5">Hinweis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              <tr className="hover:bg-black/[0.03] transition-colors">
                <td className="py-4 px-5 font-bold text-[#16181D]">Nacht 20–6 Uhr</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-emerald-600">25 %</td>
                <td className="py-4 px-5 text-black/65">Grundsatz für Nachtarbeit</td>
              </tr>
              <tr className="hover:bg-black/[0.03] transition-colors">
                <td className="py-4 px-5 font-bold text-[#16181D]">Nacht 0–4 Uhr</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-emerald-600">40 %</td>
                <td className="py-4 px-5 text-black/65">nur wenn die Arbeit vor 0 Uhr begann</td>
              </tr>
              <tr className="hover:bg-black/[0.03] transition-colors">
                <td className="py-4 px-5 font-bold text-[#16181D]">Sonntag</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-emerald-600">50 %</td>
                <td className="py-4 px-5 text-black/65">0–24 Uhr</td>
              </tr>
              <tr className="hover:bg-black/[0.03] transition-colors">
                <td className="py-4 px-5 font-bold text-[#16181D]">Gesetzlicher Feiertag</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-emerald-600">125 %</td>
                <td className="py-4 px-5 text-black/65">am Ort der Arbeitsstätte</td>
              </tr>
              <tr className="hover:bg-black/[0.03] transition-colors">
                <td className="py-4 px-5 font-bold text-[#16181D]">24.12. ab 14 Uhr, 25./26.12., 1.5.</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-emerald-600">150 %</td>
                <td className="py-4 px-5 text-black/65">höchster Satz</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50">
          Die Prozentsätze beziehen sich auf den Grundlohn pro Stunde. Zahlt der Arbeitgeber mehr, ist nur
          der übersteigende Teil steuerpflichtig.
        </p>

        <h3 className="text-lg sm:text-xl font-bold text-[#16181D] pt-2">Zwei Grenzen, die verwechselt werden</h3>
        <p>
          Für die <strong className="text-[#16181D]">Steuerfreiheit</strong> gilt eine Obergrenze von 50 €
          Grundlohn pro Stunde. Für die <strong className="text-[#16181D]">Beitragsfreiheit</strong> in der
          Sozialversicherung liegt sie deutlich niedriger bei 25 €. Wer 40 € Grundlohn hat, bekommt seinen
          Zuschlag also steuerfrei, zahlt darauf aber Sozialabgaben. Der Rechner oben berücksichtigt beide
          Grenzen getrennt.
        </p>
      </section>

      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4"
        aria-labelledby="ue-freizeit"
      >
        <h2 id="ue-freizeit" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Auszahlen oder abfeiern?
        </h2>
        <p>
          Rein rechnerisch gewinnt fast immer der <strong className="text-[#16181D]">Freizeitausgleich</strong>.
          Der Grund ist einfach: Eine ausgezahlte Überstunde wird mit Ihrem Grenzsteuersatz belastet, eine
          abgefeierte gar nicht. Bei 3.500 € Brutto in Steuerklasse I kommen von einer Überstunde rund
          zwei Drittel an — die andere Stunde bekämen Sie vollständig als freie Zeit zurück.
        </p>
        <p>
          Für die Auszahlung sprechen trotzdem gute Gründe: laufende Anschaffungen, ein Arbeitgeber, der
          Freizeitausgleich praktisch nicht zulässt, oder ein drohender Verfall der Stunden zum Jahresende.
          Prüfen Sie in dem Fall Ihren Arbeitsvertrag auf Verfallklauseln — viele Regelungen lassen
          Überstunden nach drei bis zwölf Monaten verfallen.
        </p>
      </section>

      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-3"
        aria-labelledby="ue-links"
      >
        <h2 id="ue-links" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Passende Rechner</h2>
        <p>
          Ihren Stundenlohn und den Netto-Wert einer Arbeitsstunde ermitteln Sie mit dem{" "}
          <Link href="/stundenlohn-rechner" className="text-[#E60A1C] font-semibold hover:underline">
            Stundenlohnrechner
          </Link>
          . Wie sich eine dauerhafte Gehaltserhöhung statt Überstunden auswirkt, zeigt der{" "}
          <Link href="/gehaltserhoehung-rechner" className="text-[#E60A1C] font-semibold hover:underline">
            Gehaltserhöhungs-Rechner
          </Link>
          . Einmalzahlungen wie Boni werden dagegen anders besteuert — dafür gibt es den{" "}
          <Link href="/bonus-steuerrechner" className="text-[#E60A1C] font-semibold hover:underline">
            Bonus-Steuerrechner
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

export default function UeberstundenRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UeberstundenRechner content={<Content />} />
      <RelatedCalculators
        links={[
          { href: "/stundenlohn-rechner", label: "Stundenlohn-Rechner", desc: "Netto pro Stunde" },
          { href: "/gehaltserhoehung-rechner", label: "Gehaltserhöhung-Rechner", desc: "Netto von der Erhöhung" },
          { href: "/teilzeitrechner", label: "Teilzeitrechner", desc: "Netto bei reduzierter Stundenzahl" },
          { href: "/", label: "Brutto-Netto-Rechner", desc: "Vollständiges Nettogehalt 2026" },
        ]}
      />
    </>
  );
}
