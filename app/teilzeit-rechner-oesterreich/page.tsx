import Link from "next/link";
import { Table2, Lightbulb, HelpCircle } from "lucide-react";
import Section from "@/components/ui/Section";
import TableOfContents from "@/components/TableOfContents";
import TeilzeitRechnerAT from "./TeilzeitRechnerAT";
import { AT_2026, berechneBruttoNettoAT, formatEURat as eur } from "@/lib/oesterreich";
import { atMetadata, AtSchemas, AtHero, AtFaqList, AtTabelle, AtQuellen, AT_STANDARD, type AtFaq } from "@/components/oesterreich/AtShared";

/**
 * Teilzeit-Rechner Österreich. Rising-CSV AT: "brutto netto rechner teilzeit
 * österreich" (9). Kernaussage, die die Seite rechnet: Netto sinkt
 * unterproportional zu den Stunden (Tarif + AV-Staffel).
 */

const PATH = "/teilzeit-rechner-oesterreich";
const TITLE = "Teilzeit Rechner Österreich 2026 — Brutto Netto bei Teilzeit";
const DESCRIPTION =
  "Teilzeit-Rechner Österreich 2026: Aus Vollzeitgehalt und Wochenstunden das Teilzeit-Brutto und -Netto berechnen. Mit Tabelle für 20, 25, 30 und 32 Stunden.";

export const metadata = atMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "brutto netto rechner teilzeit österreich",
    "teilzeit rechner österreich",
    "teilzeit gehalt berechnen österreich",
    "20 stunden netto österreich",
    "30 stunden netto österreich",
    "teilzeit netto 2026",
  ],
});

const VZ = 3200;
const VZH = 38.5;
const STUNDEN = [10, 15, 20, 25, 30, 32, 35, 38.5];
const VOLL = berechneBruttoNettoAT({ ...AT_STANDARD, bruttoMonat: VZ });
const TABELLE = STUNDEN.map((h) => {
  const brutto = Math.round(((VZ * h) / VZH) * 100) / 100;
  const r = berechneBruttoNettoAT({ ...AT_STANDARD, bruttoMonat: brutto });
  return { h, brutto, netto: r.laufend.netto, anteil: r.laufend.netto / VOLL.laufend.netto, jahr: r.jahr.netto, gering: r.geringfuegig };
});
const T20 = TABELLE.find((t) => t.h === 20)!;
const T30 = TABELLE.find((t) => t.h === 30)!;
const pct0 = (v: number) => Math.round(v * 100) + " %";

const FAQS: AtFaq[] = [
  {
    q: "Wie viel netto bleibt bei 20 Stunden in Österreich?",
    a: `Bei einem Vollzeitgehalt von ${eur(VZ)} (38,5 Stunden) sind 20 Stunden ${eur(T20.brutto)} brutto. Davon bleiben 2026 ${eur(
      T20.netto
    )} netto im Monat — ${pct0(T20.anteil)} des Vollzeit-Nettos für ${pct0(20 / VZH)} der Arbeitszeit.`,
  },
  {
    q: "Warum verdient man in Teilzeit netto verhältnismäßig mehr?",
    a: "Weil zwei Abzüge bei kleinem Gehalt überproportional sinken: Die Lohnsteuer ist progressiv — die ersten rund 13.500 € im Jahr bleiben steuerfrei —, und die Arbeitslosenversicherung entfällt bis 2.225 € brutto ganz und ist bis 2.630 € ermäßigt. Wer die Stunden halbiert, verliert deshalb deutlich weniger als die Hälfte des Nettos.",
  },
  {
    q: "Bekommt man in Teilzeit auch 13. und 14. Gehalt?",
    a: "Ja. Teilzeitbeschäftigte haben Anspruch auf Urlaubs- und Weihnachtsgeld im Verhältnis ihrer Arbeitszeit, wenn der Kollektivvertrag Sonderzahlungen vorsieht — was praktisch alle tun. Steuerlich gelten dieselben Regeln: 620 € steuerfrei, darüber 6 %; liegt das Jahressechstel unter 2.615 €, sind beide Sonderzahlungen steuerfrei.",
  },
  {
    q: "Gibt es einen Zuschlag für Mehrstunden in Teilzeit?",
    a: "Ja. Arbeiten Teilzeitkräfte über die vereinbarte Arbeitszeit hinaus, steht für diese Mehrarbeitsstunden ein Zuschlag von 25 % zu — außer sie werden innerhalb des Kalendervierteljahres oder eines anderen festgelegten Zeitraums durch Zeitausgleich ausgeglichen. Manche Kollektivverträge regeln das abweichend.",
  },
  {
    q: "Ab wann ist man in Teilzeit geringfügig beschäftigt?",
    a: `Bis ${eur(AT_2026.sv.geringfuegigkeitsgrenze)} brutto im Monat (2026 und 2027). Dann zahlen Sie keine Sozialversicherung, sind aber auch nur unfallversichert; Kranken- und Pensionsversicherung gibt es über die freiwillige Selbstversicherung.`,
  },
];

export default function Page() {
  return (
    <div className="min-h-screen">
      <AtSchemas path={PATH} title={TITLE} description={DESCRIPTION} crumb="Teilzeit-Rechner" faqs={FAQS} />
      <AtHero crumb="Teilzeit-Rechner" badge="Österreich · Werte 2026" title="Teilzeit Rechner" accent="Österreich">
        <p>
          Vollzeitgehalt und Wochenstunden eingeben — der Rechner zeigt Teilzeit-Brutto, Netto, Netto pro Stunde und wie viel
          Prozent des Vollzeit-Nettos übrig bleiben.
        </p>
      </AtHero>

      <TeilzeitRechnerAT />

      <div className="max-w-5xl mx-auto px-4 sm:px-5 pb-16">
        <TableOfContents
          className="mb-8"
          items={[
            { id: "tabelle", label: "Teilzeit-Tabelle" },
            { id: "warum", label: "Warum Teilzeit sich rechnet" },
            { id: "faq", label: "Häufige Fragen" },
          ]}
        />

        <Section
          id="tabelle"
          eyebrow="Tabelle"
          eyebrowIcon={Table2}
          title={`Teilzeit-Tabelle: ${eur(VZ)} Vollzeitgehalt`}
          intro="Angestellte, 38,5-Stunden-Woche als Vollzeit, 14 Gehälter, ohne Kinder, Bundesland außerhalb Wiens, Werte 2026."
        >
          <AtTabelle
            kopf={["Stunden / Woche", "Brutto / Monat", "Netto / Monat", "Netto / Jahr", "% vom Vollzeit-Netto"]}
            minWidth={620}
            formats={[eur, eur, eur, pct0]}
            zeilen={TABELLE.map((t) => ({
              label: `${t.h.toLocaleString("de-AT")} Std.${t.gering ? " (geringfügig)" : ""}`,
              werte: [t.brutto, t.netto, t.jahr, t.anteil],
              hervorheben: t.h === 20,
            }))}
          />
        </Section>

        <Section id="warum" variant="muted" eyebrow="Einordnung" eyebrowIcon={Lightbulb} title="Warum Teilzeit netto relativ mehr bringt" prose>
          <p>
            Mit 30 statt 38,5 Stunden arbeiten Sie {pct0(30 / VZH)} der Zeit, bekommen aber {pct0(T30.anteil)} des Nettos. Bei
            20 Stunden ist der Effekt noch größer: {pct0(20 / VZH)} der Zeit, {pct0(T20.anteil)} des Nettos. Der Grund ist der
            progressive Tarif — die oberen Einkommensteile, die bei Vollzeit mit 30 oder 40 % besteuert werden, fallen bei
            Teilzeit weg — und die gestaffelte Arbeitslosenversicherung für kleine Gehälter.
          </p>
          <p>
            Achtung bei der Pension: Weniger Bruttogehalt heißt weniger Beiträge aufs Pensionskonto. Wie viel Steuer Sie bei
            Vollzeit zahlen, zeigt die <Link href="/lohnsteuer-oesterreich">Lohnsteuertabelle Österreich</Link>; das volle Netto
            mit Kindern und Pendlerpauschale der <Link href="/brutto-netto-rechner-oesterreich">Brutto-Netto-Rechner Österreich</Link>.
          </p>
        </Section>

        <Section id="faq" eyebrow="FAQ" eyebrowIcon={HelpCircle} title="Häufige Fragen zur Teilzeit">
          <AtFaqList faqs={FAQS} />
        </Section>

        <AtQuellen>
          Quellen: Rechenlogik wie im Brutto-Netto-Rechner Österreich (ÖGK Sozialversicherungswerte 2026, § 33 und § 67 EStG
          1988); Mehrarbeitszuschlag nach § 19d Abs. 3a AZG. Angaben ohne Gewähr.
        </AtQuellen>
      </div>
    </div>
  );
}
