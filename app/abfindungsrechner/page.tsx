import type { Metadata } from "next";
import Link from "next/link";
import AbfindungsRechner from "./AbfindungsRechner";
import ToolContent from "@/components/ToolContent";
import AccordionFaq from "@/components/AccordionFaq";
import AffiliateBox from "@/components/AffiliateBox";
import Section from "@/components/ui/Section";
import { TOOL_CONTENT } from "@/data/tool-content";
import { pageImageUrl } from "@/lib/pageImage";
import { berechneAbfindung } from "@/lib/abfindung";
import { formatEUR } from "@/lib/taxCalculator";

const URL = "https://bruttonettocalculator.com/abfindungsrechner";
// Google Trends DE (30 Tage bis 6.10.2026): „abfindungsrechner brutto netto“ Breakout
// (auch im Thema „brutto netto“ +60 %), dazu als Breakout „wie viel abfindung steht
// mir zu“, „mit wieviel prozent wird eine abfindung versteuert“, „abfindung
// sozialversicherungsfrei“, „berechnung abfindung formel“; „krankheitsbedingte
// kündigung abfindung“ +1.850 %. Title und FAQ-Fragen tragen jetzt diese Wortlaute.
const TITLE = "Abfindungsrechner Brutto Netto 2026: Abfindung netto berechnen";
const DESCRIPTION =
  "Abfindung netto berechnen: Lohnsteuer bei Auszahlung, Fünftelregelung über die Steuererklärung und Erstattung – kostenloser Rechner 2026.";
/** Stand der Seite — bei inhaltlichen Änderungen anpassen. */
const STAND = "6. Oktober 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "abfindungsrechner",
    "abfindung rechner",
    "abfindung steuer",
    "fünftelregelung abfindung",
    "abfindung versteuern",
    "abfindung brutto netto",
    "abfindung berechnen",
    "abfindung nach 10 jahren",
    "abfindungsrechner brutto netto",
    "wie viel abfindung steht mir zu",
    "abfindung formel",
    "mit wieviel prozent wird eine abfindung versteuert",
    "abfindung sozialversicherungsfrei",
  ],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl("/abfindungsrechner")],
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    locale: "de_DE",
    type: "website",
  },
};

// Beispiel und Tabelle: gleiche Funktion wie der Rechner (SK I, ohne KiSt).
const BEISPIEL_JAHR = 54000;
const bsp = berechneAbfindung({ abfindung: 30000, jahresbrutto: BEISPIEL_JAHR, steuerklasse: 1, kirche: false });
const TABELLE = [10000, 20000, 30000, 50000, 100000].map((abfindung) => ({
  abfindung,
  r: berechneAbfindung({ abfindung, jahresbrutto: BEISPIEL_JAHR, steuerklasse: 1, kirche: false }),
}));
const halbJahr = berechneAbfindung({ abfindung: 30000, jahresbrutto: BEISPIEL_JAHR / 2, steuerklasse: 1, kirche: false });
const prozent = (steuer: number, abfindung: number) => ((steuer / abfindung) * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 });

const faqs = [
  {
    q: "Wie wird eine Abfindung versteuert?",
    a: `Seit 2025 behält der Arbeitgeber die Lohnsteuer auf die Abfindung wie bei jeder Einmalzahlung ein, ohne Fünftelregelung. Die ermäßigte Besteuerung nach § 34 EStG gibt es erst mit der Steuererklärung. Bei 30.000 € Abfindung und ${formatEUR(BEISPIEL_JAHR)} Jahresgehalt (Steuerklasse I) behält der Arbeitgeber rund ${formatEUR(bsp.auszahlung.summe)} ein; nach der Steuererklärung bleiben voraussichtlich ${formatEUR(bsp.veranlagung.summe)} Steuer, ${formatEUR(bsp.erstattung)} kommen zurück.`,
  },
  {
    q: "Wendet der Arbeitgeber die Fünftelregelung noch an?",
    a: "Nein. Mit dem Wachstumschancengesetz wurde die Anwendung der Fünftelregelung im Lohnsteuerabzug ab 2025 gestrichen. Sie wird nur noch vom Finanzamt in der Einkommensteuerveranlagung berücksichtigt. Dafür müssen Sie eine Steuererklärung abgeben und die Abfindung in der Anlage N als ermäßigt zu besteuernden Arbeitslohn angeben.",
  },
  {
    q: "Ist eine Abfindung sozialversicherungsfrei?",
    a: "Nein, wenn die Abfindung für den Verlust des Arbeitsplatzes gezahlt wird. Sie ist dann kein Arbeitsentgelt im Sinne der Sozialversicherung (BSG, 21.02.1990, 12 RK 20/88). Beitragspflichtig sind dagegen Zahlungen, die in Wahrheit noch ausstehenden Lohn ausgleichen, etwa für die Zeit bis zum Ende der Kündigungsfrist.",
  },
  {
    q: "Wie viel Abfindung steht mir zu?",
    a: "Einen allgemeinen Anspruch gibt es nicht; die Höhe wird ausgehandelt. Als Faustregel gilt ein halbes Bruttomonatsgehalt je Beschäftigungsjahr. Nach 10 Jahren bei 4.500 € brutto wären das 22.500 €. Gesetzlich festgelegt ist dieser Wert nur für die Abfindung nach § 1a KSchG bei einer betriebsbedingten Kündigung mit Abfindungsangebot.",
  },
  {
    q: "Wie lautet die Formel zur Berechnung der Abfindung?",
    a: "Abfindung = Bruttomonatsgehalt × Beschäftigungsjahre × Faktor. Der übliche Faktor ist 0,5, so steht es auch in § 1a KSchG; ein Rest von mehr als sechs Monaten wird dort auf ein volles Jahr aufgerundet. Zum Monatsgehalt zählen anteilig auch Sonderzahlungen wie Weihnachtsgeld. In Verhandlungen und vor dem Arbeitsgericht liegt der Faktor je nach Prozessrisiko des Arbeitgebers oft zwischen 0,25 und 1,5.",
  },
  {
    q: "Mit wie viel Prozent wird eine Abfindung versteuert?",
    a: `Einen festen Prozentsatz gibt es nicht. Die Abfindung wird mit Ihrem persönlichen Steuersatz versteuert, der durch die Abfindung selbst steigt. Beispiel 30.000 € Abfindung bei ${formatEUR(BEISPIEL_JAHR)} Jahresgehalt, Steuerklasse I: Der Arbeitgeber behält rund ${prozent(bsp.auszahlung.summe, 30000)} % ein, nach der Steuererklärung mit Fünftelregelung bleiben etwa ${prozent(bsp.veranlagung.summe, 30000)} %. Bei niedrigerem übrigem Einkommen ist der Satz deutlich geringer.`,
  },
  {
    q: "Gibt es eine Abfindung bei krankheitsbedingter Kündigung?",
    a: "Einen gesetzlichen Anspruch gibt es auch hier nicht. Eine krankheitsbedingte Kündigung ist aber nur unter strengen Voraussetzungen wirksam (negative Gesundheitsprognose, erhebliche betriebliche Beeinträchtigung, Interessenabwägung). Weil Arbeitgeber das vor Gericht oft nicht beweisen können, endet eine Kündigungsschutzklage häufig mit einem Vergleich gegen Abfindung. Die Klage muss innerhalb von drei Wochen nach Zugang der Kündigung erhoben werden (§ 4 KSchG).",
  },
  {
    q: "Wird die Abfindung auf das Arbeitslosengeld angerechnet?",
    a: "Nein, die Abfindung selbst mindert das Arbeitslosengeld nicht. Endet das Arbeitsverhältnis aber vor Ablauf der ordentlichen Kündigungsfrist, ruht der Anspruch für eine gewisse Zeit (§ 158 SGB III). Wer einen Aufhebungsvertrag ohne wichtigen Grund unterschreibt, riskiert zudem eine Sperrzeit von bis zu zwölf Wochen (§ 159 SGB III).",
  },
  {
    q: "Wie kann ich die Steuer auf die Abfindung senken?",
    a: `Am wirksamsten ist ein Auszahlungsjahr mit niedrigem übrigem Einkommen. Liegt der übrige Lohn im Auszahlungsjahr bei ${formatEUR(BEISPIEL_JAHR / 2)} statt ${formatEUR(BEISPIEL_JAHR)}, sinkt die Steuer auf 30.000 € Abfindung nach der Veranlagung von ${formatEUR(bsp.veranlagung.summe)} auf ${formatEUR(halbJahr.veranlagung.summe)}. Auch Einzahlungen in eine Basisrente mindern das zu versteuernde Einkommen.`,
  },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${URL}#webpage`,
      url: URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "de-DE",
      isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
        { "@type": "ListItem", position: 2, name: "Abfindungsrechner", item: URL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

const QUELLEN = [
  { label: "§ 34 EStG — Außerordentliche Einkünfte (Fünftelregelung)", url: "https://www.gesetze-im-internet.de/estg/__34.html" },
  { label: "§ 39b EStG — Lohnsteuer auf sonstige Bezüge", url: "https://www.gesetze-im-internet.de/estg/__39b.html" },
  { label: "Deutsche Rentenversicherung — Abfindungen (Lexikon für Arbeitgeber)", url: "https://www.deutsche-rentenversicherung.de/DRV/DE/Experten/Arbeitgeber-und-Steuerberater/summa-summarum/Lexikon/A/abfindungen.html" },
  { label: "BSG, Urteil vom 21.02.1990 – 12 RK 20/88", url: "https://rvrecht.deutsche-rentenversicherung.de/SharedDocs/rvRecht/06_Urteile/BSG/1990/urt_bsg_1990_02_21_12rk20_88.html" },
  { label: "§ 158 SGB III — Ruhen bei Entlassungsentschädigung", url: "https://www.gesetze-im-internet.de/sgb_3/__158.html" },
  { label: "§ 1a KSchG — Abfindungsanspruch bei betriebsbedingter Kündigung", url: "https://www.gesetze-im-internet.de/kschg/__1a.html" },
];

export default function AbfindungsrechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <AbfindungsRechner />

      <div className="bg-[#F4F5F7]">
        <div className="max-w-6xl mx-auto px-5 pb-6">
          <Section id="antwort" variant="card" title="Wie viel bleibt von der Abfindung netto?" prose>
            <p>
              Von <strong>30.000 € Abfindung</strong> bleiben bei {formatEUR(BEISPIEL_JAHR)} Jahresgehalt in Steuerklasse I bei
              Auszahlung zunächst <strong>{formatEUR(bsp.nettoBeiAuszahlung)}</strong> netto, denn der Arbeitgeber behält{" "}
              {formatEUR(bsp.auszahlung.summe)} Lohnsteuer und Soli ein. Mit der Fünftelregelung in der Steuererklärung sinkt die
              Steuer auf {formatEUR(bsp.veranlagung.summe)}. Rund <strong>{formatEUR(bsp.erstattung)}</strong> erstattet das
              Finanzamt also später. Sozialabgaben fallen auf eine Abfindung für den Verlust des Arbeitsplatzes nicht an.
            </p>
          </Section>

          <Section id="tabelle" variant="plain" title="Abfindung: Steuer bei Auszahlung und nach der Steuererklärung">
            <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-sm sm:text-base min-w-[560px]">
                <thead>
                  <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                    <th className="py-3 px-4">Abfindung</th>
                    <th className="py-3 px-4 text-right">Einbehalt</th>
                    <th className="py-3 px-4 text-right">Steuer nach § 34</th>
                    <th className="py-3 px-4 text-right">Erstattung</th>
                    <th className="py-3 px-4 text-right">Netto endgültig</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {TABELLE.map(({ abfindung, r }) => (
                    <tr key={abfindung}>
                      <td className="py-3 px-4 font-mono font-bold text-[#16181D]">{formatEUR(abfindung)}</td>
                      <td className="py-3 px-4 text-right font-mono">{formatEUR(r.auszahlung.summe)}</td>
                      <td className="py-3 px-4 text-right font-mono">{formatEUR(r.veranlagung.summe)}</td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700 font-bold">{formatEUR(r.erstattung)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold">{formatEUR(r.nettoNachErklaerung)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-black/55 mt-3">
              Jahresgehalt ohne Abfindung {formatEUR(BEISPIEL_JAHR)}, Steuerklasse I, ohne Kirchensteuer, Steuerjahr 2026; Lohnsteuer und
              Solidaritätszuschlag.
            </p>
          </Section>

          <Section id="so-rechnen-wir" variant="muted" title="So rechnen wir" prose>
            <p>
              <strong>Bei Auszahlung:</strong> Die Abfindung ist ein sonstiger Bezug. Der Arbeitgeber berechnet die
              Jahreslohnsteuer mit und ohne Abfindung und behält die Differenz ein (§ 39b Abs. 3 EStG). Seit 2025 darf er dabei
              die Fünftelregelung nicht mehr anwenden.
            </p>
            <p>
              <strong>In der Steuererklärung:</strong> Das Finanzamt rechnet ein Fünftel der Abfindung zum übrigen zu
              versteuernden Einkommen, ermittelt die Mehrsteuer und verfünffacht sie (§ 34 Abs. 1 EStG). Ist die normale
              Besteuerung günstiger, bleibt es bei ihr. Die Differenz zum Einbehalt ist die Erstattung.
            </p>
            <p>
              <strong>Vereinfachungen:</strong> zu versteuerndes Einkommen aus Lohn, Sozialabgaben und Pauschbeträgen, keine
              weiteren Einkünfte oder Abzüge. Klasse III mit Splittingtarif für ein Paar mit einem Einkommen; Klasse IV, V und VI
              mit dem Grundtarif. Den Lohn aus dem neuen Job rechnet der{" "}
              <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner</Link>, eine allgemeine
              Erstattung der{" "}
              <Link href="/steuerrueckerstattung-rechner" className="text-[#E60A1C] font-semibold hover:underline">Steuerrückerstattung-Rechner</Link>.
            </p>
          </Section>

          <Section id="hoehe" variant="plain" title="Wie hoch ist eine Abfindung?" prose>
            <p>
              Ein gesetzlicher Anspruch auf eine Abfindung besteht in der Regel nicht. Sie entsteht aus einem Vergleich vor dem
              Arbeitsgericht, einem Aufhebungsvertrag, einem Sozialplan oder dem Angebot nach § 1a KSchG. Als Faustregel gilt
              <strong> ein halbes Bruttomonatsgehalt je Beschäftigungsjahr</strong>: Nach 10 Jahren bei 4.500 € brutto wären das
              22.500 €. Das ist ein Verhandlungswert, kein Anspruch; nur für die Abfindung nach § 1a KSchG ist genau dieser Betrag
              gesetzlich festgelegt.
            </p>
            <p>
              Für das Arbeitslosengeld zählt die Abfindung nicht als Einkommen. Wird die Kündigungsfrist nicht eingehalten, ruht
              der Anspruch aber zeitweise (§ 158 SGB III); nach einem Aufhebungsvertrag ohne wichtigen Grund droht eine Sperrzeit.
              Die Höhe des Arbeitslosengelds zeigt der{" "}
              <Link href="/arbeitslosengeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Arbeitslosengeld-Rechner</Link>.
            </p>
          </Section>

          <AffiliateBox slot="steuererklaerung" />

          <Section id="faq" variant="plain" title="Häufige Fragen zur Abfindung">
            <AccordionFaq faqs={faqs} />
          </Section>
        </div>
      </div>

      <ToolContent config={TOOL_CONTENT["/abfindungsrechner"]} />

      <div className="bg-[#F4F5F7]">
        <div className="max-w-6xl mx-auto px-5 pb-12">
          <Section id="quellen" variant="muted" title="Quellen">
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {QUELLEN.map((q) => (
                <li key={q.url}>
                  <a href={q.url} target="_blank" rel="noopener noreferrer" className="text-[#E60A1C] hover:underline">{q.label}</a>
                </li>
              ))}
            </ul>
            <p className="text-sm text-black/60 mt-4">Stand: {STAND}. Alle Angaben ohne Gewähr, keine Steuerberatung.</p>
          </Section>
        </div>
      </div>
    </>
  );
}
