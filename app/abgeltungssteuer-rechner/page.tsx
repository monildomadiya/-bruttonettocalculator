import type { Metadata } from "next";
import Link from "next/link";
import AbgeltungssteuerRechner from "./AbgeltungssteuerRechner";
import RelatedCalculators from "@/components/RelatedCalculators";

export const metadata: Metadata = {
  title: "Abgeltungssteuer-Rechner 2026: Kapitalertragsteuer berechnen",
  description:
    "Abgeltungssteuer berechnen: 25 % plus Soli und Kirchensteuer, abzüglich Sparer-Pauschbetrag von 1.000 €. Mit Günstigerprüfung und Teilfreistellung für Fonds.",
  keywords: [
    "Abgeltungssteuer Rechner",
    "Abgeltungssteuer berechnen",
    "Kapitalertragsteuer Rechner",
    "Kapitalertragsteuer berechnen",
    "Sparerpauschbetrag",
    "Abgeltungssteuer wie hoch",
    "Freistellungsauftrag",
    "Günstigerprüfung",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/abgeltungssteuer-rechner" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Abgeltungssteuer-Rechner 2026 — Kapitalertragsteuer",
    description: "Was bleibt von Zinsen, Dividenden und Kursgewinnen netto? Mit Sparer-Pauschbetrag und Kirchensteuer.",
    url: "https://bruttonettocalculator.com/abgeltungssteuer-rechner",
    locale: "de_DE",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wie hoch ist die Abgeltungssteuer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "25 % auf Kapitalerträge, plus 5,5 % Solidaritätszuschlag auf diese Steuer. Ohne Kirchensteuer ergibt das 26,375 % Gesamtbelastung. Mit Kirchensteuer sind es 27,82 % (8 %) beziehungsweise 27,99 % (9 %).",
      },
    },
    {
      "@type": "Question",
      name: "Wie hoch ist der Sparer-Pauschbetrag?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1.000 € pro Person und Jahr, bei zusammen veranlagten Ehepaaren 2.000 € (§ 20 Abs. 9 EStG). Der Betrag wirkt nur, wenn der Bank ein Freistellungsauftrag vorliegt — sonst wird ab dem ersten Euro einbehalten.",
      },
    },
    {
      "@type": "Question",
      name: "Warum entfällt der Soli bei der Abgeltungssteuer nicht?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Soli-Freigrenze gilt nur für die veranlagte Einkommensteuer und die Lohnsteuer. Auf die Kapitalertragsteuer wird der Solidaritätszuschlag von 5,5 % unverändert und ohne Freigrenze erhoben.",
      },
    },
    {
      "@type": "Question",
      name: "Was ist die Günstigerprüfung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Liegt der persönliche Steuersatz unter 25 %, kann in der Steuererklärung die Günstigerprüfung nach § 32d Abs. 6 EStG beantragt werden. Die Kapitalerträge werden dann mit dem niedrigeren persönlichen Satz versteuert und zu viel gezahlte Abgeltungssteuer erstattet.",
      },
    },
    {
      "@type": "Question",
      name: "Gilt die Abgeltungssteuer auch für ETFs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, mit einer Besonderheit: Bei Aktienfonds bleiben 30 % der Erträge steuerfrei, bei Mischfonds 15 % (Teilfreistellung nach § 20 InvStG). Auf thesaurierende Fonds fällt zusätzlich jährlich eine Vorabpauschale an, die beim Verkauf angerechnet wird.",
      },
    },
    {
      "@type": "Question",
      name: "Was ist eine Nichtveranlagungsbescheinigung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wer voraussichtlich unter dem Grundfreibetrag bleibt, etwa Studierende oder Kinder mit eigenem Depot, kann beim Finanzamt eine NV-Bescheinigung beantragen. Die Bank behält dann gar keine Abgeltungssteuer ein. Sie gilt in der Regel drei Jahre.",
      },
    },
  ],
};

function Content() {
  return (
    <div className="max-w-6xl mx-auto px-5">
      <section className="py-6" aria-labelledby="ab-kurzantwort">
        <div className="bg-[#FFFFFF] border-l-4 border-[#E60A1C] rounded-2xl p-6 sm:p-7 shadow-sm">
          <h2 id="ab-kurzantwort" className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">
            Kurzantwort
          </h2>
          <p className="text-black/75 text-sm sm:text-base leading-relaxed">
            Auf Kapitalerträge fallen <strong className="text-[#16181D]">25 % Kapitalertragsteuer</strong>{" "}
            an, dazu 5,5 % Solidaritätszuschlag auf diese Steuer — zusammen{" "}
            <strong className="text-[#16181D]">26,375 %</strong>. Mit Kirchensteuer steigt die Belastung auf
            27,82 % (8 %) oder 27,99 % (9 %). Steuerfrei bleiben die ersten{" "}
            <strong className="text-[#16181D]">1.000 €</strong> pro Person (2.000 € bei
            Zusammenveranlagung), sofern der Bank ein Freistellungsauftrag vorliegt.
          </p>
        </div>
      </section>

      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4"
        aria-labelledby="ab-belastung"
      >
        <h2 id="ab-belastung" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Warum die Belastung nicht einfach 25 % ist
        </h2>
        <p>
          Der Solidaritätszuschlag wird auf die <em>Steuer</em> erhoben, nicht auf den Ertrag: 5,5 % von
          25 % sind 1,375 Prozentpunkte. Das ist der Grund für die krumme Zahl 26,375 %.
        </p>
        <p>
          Ein Punkt, der regelmäßig überrascht: Für Arbeitnehmer ist der Soli durch die hohe Freigrenze
          praktisch abgeschafft — <strong className="text-[#16181D]">bei Kapitalerträgen aber nicht</strong>.
          Dort gilt keine Freigrenze, der Zuschlag fällt ab dem ersten steuerpflichtigen Euro an. Wie der
          Soli beim Gehalt wirkt, erklärt der Beitrag zum{" "}
          <Link href="/blog/solidaritaetszuschlag-2026" className="text-[#E60A1C] font-semibold hover:underline">
            Solidaritätszuschlag 2026
          </Link>
          .
        </p>
        <p>
          Bei Kirchenmitgliedern kommt eine Besonderheit hinzu: Die Kirchensteuer ist als Sonderausgabe
          abziehbar, was die Kapitalertragsteuer selbst mindert. Die Bank rechnet deshalb nicht schlicht
          25 %, sondern nach der Formel <em>Ertrag ÷ (4 + Kirchensteuersatz)</em>. Deshalb steigt die
          Gesamtbelastung nur auf 27,99 % statt auf über 28 %.
        </p>
      </section>

      <section className="py-6" aria-labelledby="ab-tabelle">
        <h2 id="ab-tabelle" className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Gesamtbelastung im Überblick
        </h2>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[480px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Konstellation</th>
                <th className="py-4 px-5 text-right text-[#16181D] font-bold">Belastung</th>
                <th className="py-4 px-5 text-right">von 1.000 € bleiben</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              <tr className="hover:bg-black/[0.03] transition-colors">
                <td className="py-4 px-5 font-semibold text-[#16181D]">Ohne Kirchensteuer</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-[#16181D]">26,375 %</td>
                <td className="py-4 px-5 text-right font-mono text-emerald-600 font-bold">736,25 €</td>
              </tr>
              <tr className="hover:bg-black/[0.03] transition-colors">
                <td className="py-4 px-5 font-semibold text-[#16181D]">Kirchensteuer 8 %</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-[#16181D]">27,82 %</td>
                <td className="py-4 px-5 text-right font-mono text-emerald-600 font-bold">721,80 €</td>
              </tr>
              <tr className="hover:bg-black/[0.03] transition-colors">
                <td className="py-4 px-5 font-semibold text-[#16181D]">Kirchensteuer 9 %</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-[#16181D]">27,99 %</td>
                <td className="py-4 px-5 text-right font-mono text-emerald-600 font-bold">720,10 €</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3">
          Werte für den steuerpflichtigen Teil, also nach Abzug des Sparer-Pauschbetrags.
        </p>
      </section>

      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4"
        aria-labelledby="ab-sparen"
      >
        <h2 id="ab-sparen" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Drei Wege, legal weniger zu zahlen
        </h2>
        <ol>
          <li>
            <strong className="text-[#16181D]">Freistellungsauftrag erteilen — und aufteilen.</strong> Ohne
            Auftrag behält die Bank ab dem ersten Euro ein. Wer mehrere Depots hat, kann die 1.000 €
            beliebig auf die Institute verteilen; in Summe darf der Betrag nicht überschritten werden.
          </li>
          <li>
            <strong className="text-[#16181D]">Günstigerprüfung beantragen.</strong> Liegt Ihr persönlicher
            Steuersatz unter 25 % — typisch bei Studierenden, in Elternzeit oder in der Rente —, holen Sie
            sich die Differenz über die Anlage KAP zurück. Der Antrag kann nie schaden: Das Finanzamt wendet
            automatisch die günstigere Variante an. Ihren Satz ermitteln Sie mit dem{" "}
            <Link href="/einkommensteuer-rechner" className="text-[#E60A1C] font-semibold hover:underline">
              Einkommensteuer-Rechner
            </Link>
            .
          </li>
          <li>
            <strong className="text-[#16181D]">Verluste verrechnen lassen.</strong> Die Bank führt
            automatisch Verlustverrechnungstöpfe. Wer bei mehreren Instituten anlegt, muss bis zum 15.
            Dezember eine Verlustbescheinigung anfordern, um Verluste des einen Depots mit Gewinnen des
            anderen zu verrechnen — sonst bleiben sie im falschen Topf liegen.
          </li>
        </ol>
        <p>
          Für Kinder und Studierende ohne nennenswertes Einkommen lohnt zusätzlich die{" "}
          <strong className="text-[#16181D]">Nichtveranlagungsbescheinigung</strong>: Damit behält die Bank
          gar keine Steuer ein, auch oberhalb des Sparer-Pauschbetrags.
        </p>
      </section>
    </div>
  );
}

export default function AbgeltungssteuerRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AbgeltungssteuerRechner content={<Content />} />
      <RelatedCalculators
        links={[
          { href: "/einkommensteuer-rechner", label: "Einkommensteuer-Rechner", desc: "Persönlicher Steuersatz" },
          { href: "/steuerfreibetrag-2026", label: "Steuerfreibetrag 2026", desc: "Alle Freibeträge im Überblick" },
          { href: "/mieteinnahmen-versteuern", label: "Mieteinnahmen versteuern", desc: "Steuer auf Mieteinnahmen" },
          { href: "/", label: "Brutto-Netto-Rechner", desc: "Vollständiges Nettogehalt 2026" },
        ]}
      />
    </>
  );
}
