import Link from "next/link";
import { Scale, Table2, Store, HelpCircle } from "lucide-react";
import Section from "@/components/ui/Section";
import TableOfContents from "@/components/TableOfContents";
import { AT_2026, berechneBruttoNettoAT, formatEURat as eur } from "@/lib/oesterreich";
import { atMetadata, AtSchemas, AtHero, AtFaqList, AtTabelle, AtQuellen, AT_STANDARD, type AtFaq } from "@/components/oesterreich/AtShared";

/**
 * Mindestlohn Österreich. Rising-CSV AT 25.9.–2.10.2026: "mindestlohn
 * österreich" Breakout. Österreich hat keinen gesetzlichen Mindestlohn — die
 * Seite beantwortet das sofort und rechnet die KV-Mindestgehälter netto.
 * Handels-KV ab 1.1.2026 aus den WKO-Gehalts- und Lohntafeln.
 */

const PATH = "/mindestlohn-oesterreich";
const TITLE = "Mindestlohn Österreich 2026 — KV-Mindestgehalt & Netto";
const DESCRIPTION =
  "Gibt es einen Mindestlohn in Österreich? Nein — die Kollektivverträge regeln ihn. Handel 2026: 2.090 € brutto. Was netto bleibt, pro Stunde und im Jahr.";

export const metadata = atMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "mindestlohn österreich",
    "mindestlohn österreich 2026",
    "mindestgehalt österreich",
    "kollektivvertrag mindestlohn",
    "mindestlohn handel 2026",
    "mindestlohn österreich netto",
    "gesetzlicher mindestlohn österreich",
  ],
});

const HANDEL_ANG = 2090;
const HANDEL_ARB = 2146;
const WOCHE = 38.5;
const STUNDE = (monat: number) => monat / (WOCHE * 4.33);

const BETRAEGE = [1500, 1800, 2000, HANDEL_ANG, HANDEL_ARB, 2200, 2400, 2600];
const TABELLE = BETRAEGE.map((b) => {
  const r = berechneBruttoNettoAT({ ...AT_STANDARD, bruttoMonat: b });
  return { b, netto: r.laufend.netto, jahr: r.jahr.netto, stunde: STUNDE(b) };
});
const H = berechneBruttoNettoAT({ ...AT_STANDARD, bruttoMonat: HANDEL_ANG });
const H2000 = berechneBruttoNettoAT({ ...AT_STANDARD, bruttoMonat: 2000 });

const FAQS: AtFaq[] = [
  {
    q: "Gibt es einen gesetzlichen Mindestlohn in Österreich?",
    a: "Nein. Österreich hat — anders als Deutschland — keinen gesetzlichen Mindestlohn. Mindestlöhne legen die rund 450 Kollektivverträge (KV) fest, die Gewerkschaften und Arbeitgeber jedes Jahr für ihre Branche verhandeln. Weil fast alle Arbeitsverhältnisse unter einen KV fallen, gilt praktisch trotzdem überall eine Untergrenze. Die Sozialpartner hatten 2017 vereinbart, dass jeder KV mindestens 1.500 € brutto vorsieht; heute liegen die meisten Branchen deutlich darüber.",
  },
  {
    q: "Wie hoch ist der Mindestlohn im Handel 2026?",
    a: `Seit 1. Jänner 2026 verdienen Angestellte im Handel mindestens ${eur(HANDEL_ANG)} brutto im Monat (Beschäftigungsgruppe A, erste drei Jahre), Arbeiterinnen und Arbeiter mindestens ${eur(
      HANDEL_ARB
    )}. Netto bleiben von ${eur(HANDEL_ANG)} rund ${eur(H.laufend.netto)} im Monat — plus Urlaubs- und Weihnachtsgeld.`,
  },
  {
    q: "Wie viel netto sind 2.000 € brutto in Österreich?",
    a: `${eur(H2000.laufend.netto)} im Monat für Angestellte (2026, ohne Kinder, außerhalb Wiens). Weil bei 2.000 € noch keine Arbeitslosenversicherung anfällt, sind die Abzüge niedrig: ${eur(
      H2000.laufend.sv
    )} Sozialversicherung und ${eur(H2000.laufend.lohnsteuer)} Lohnsteuer. Mit 13. und 14. Gehalt sind es ${eur(H2000.jahr.netto)} netto im Jahr.`,
  },
  {
    q: "Was ist der Mindestlohn in Österreich pro Stunde?",
    a: `Das hängt vom KV ab. Im Handel ergeben ${eur(HANDEL_ANG)} bei 38,5 Wochenstunden rund ${eur(
      STUNDE(HANDEL_ANG)
    )} brutto pro Stunde — ohne Sonderzahlungen gerechnet. Rechnet man das 13. und 14. Gehalt auf die Stunde um, sind es rund ${eur(
      (STUNDE(HANDEL_ANG) * 14) / 12
    )}. In Deutschland liegt der gesetzliche Mindestlohn 2026 bei 13,90 € pro Stunde, ohne Sonderzahlungen.`,
  },
  {
    q: "Was gilt, wenn es keinen Kollektivvertrag gibt?",
    a: "Für die wenigen Branchen ohne KV kann das Bundeseinigungsamt einen Mindestlohntarif festsetzen (etwa für Hausbetreuung oder private Haushalte). Gibt es auch den nicht, schuldet der Arbeitgeber ein „angemessenes Entgelt“ nach dem ABGB, das sich an vergleichbaren KVs orientiert.",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen">
      <AtSchemas path={PATH} title={TITLE} description={DESCRIPTION} crumb="Mindestlohn" faqs={FAQS} />
      <AtHero crumb="Mindestlohn" badge="Österreich · Kollektivverträge 2026" title="Mindestlohn Österreich" accent="2026">
        <p>
          <strong>Einen gesetzlichen Mindestlohn gibt es in Österreich nicht.</strong> Die Untergrenze steht im Kollektivvertrag
          Ihrer Branche — im Handel sind es 2026 {eur(HANDEL_ANG)} brutto im Monat. Hier sehen Sie, was davon netto bleibt.
        </p>
      </AtHero>

      <div className="max-w-5xl mx-auto px-4 sm:px-5 pb-16">
        <TableOfContents
          className="mb-8"
          items={[
            { id: "netto", label: "Mindestlohn netto" },
            { id: "handel", label: "Handel 2026" },
            { id: "kv", label: "So funktioniert der KV" },
            { id: "faq", label: "Häufige Fragen" },
          ]}
        />

        <Section
          id="netto"
          eyebrow="Netto"
          eyebrowIcon={Table2}
          title="Typische Mindestgehälter: brutto, netto, pro Stunde"
          intro="Angestellte, 14 Gehälter, Werte 2026, ohne Kinder, Bundesland außerhalb Wiens. Stundenlohn brutto bei 38,5 Wochenstunden ohne Sonderzahlungen."
        >
          <AtTabelle
            kopf={["Brutto / Monat", "Brutto / Stunde", "Netto / Monat", "Netto / Jahr"]}
            minWidth={560}
            zeilen={TABELLE.map((t) => ({
              label: (
                <>
                  {eur(t.b)}
                  {t.b === HANDEL_ANG && <span className="font-normal text-black/50"> · Handel Angestellte</span>}
                  {t.b === HANDEL_ARB && <span className="font-normal text-black/50"> · Handel Arbeiter</span>}
                  {t.b === 1500 && <span className="font-normal text-black/50"> · Sozialpartner-Ziel 2017</span>}
                </>
              ),
              werte: [t.stunde, t.netto, t.jahr],
              hervorheben: t.b === HANDEL_ANG,
            }))}
          />
        </Section>

        <Section
          id="handel"
          variant="muted"
          eyebrow="Beispiel Handel"
          eyebrowIcon={Store}
          title="Mindestgehalt im Handel 2026"
          intro="Größter Kollektivvertrag Österreichs, gültig ab 1.1.2026 (WKO-Gehaltstafeln)."
        >
          <AtTabelle
            kopf={["Gruppe (1.–3. Jahr)", "Brutto / Monat", "Netto / Monat"]}
            minWidth={420}
            zeilen={[
              ["A — einfache Tätigkeiten", 2090],
              ["B", 2156],
              ["C", 2251],
              ["D", 2362],
              ["Arbeiter/innen, bis 1 Jahr", HANDEL_ARB],
            ].map(([label, b]) => ({
              label: label as string,
              werte: [b as number, berechneBruttoNettoAT({ ...AT_STANDARD, bruttoMonat: b as number }).laufend.netto],
            }))}
          />
          <p className="text-sm text-black/65 mt-3">
            Mit mehr Berufsjahren und in höheren Beschäftigungsgruppen steigt das KV-Gehalt. Ihr genaues Netto, auch in Wien oder
            mit Kindern:{" "}
            <Link href="/brutto-netto-rechner-oesterreich" className="text-[#E60A1C] font-semibold hover:underline">
              Brutto-Netto-Rechner Österreich
            </Link>
            .
          </p>
        </Section>

        <Section id="kv" eyebrow="Kollektivvertrag" eyebrowIcon={Scale} title="Warum Österreich ohne gesetzlichen Mindestlohn auskommt" prose>
          <p>
            Rund 98 % der Arbeitsverhältnisse in Österreich fallen unter einen Kollektivvertrag. Weil Arbeitgeber über die
            Wirtschaftskammer Pflichtmitglieder sind, gilt der KV auch für Betriebe, die selbst nichts unterschrieben haben. Der
            KV legt nicht nur das Mindestgehalt fest, sondern meist auch Urlaubs- und Weihnachtsgeld, Zuschläge und Vorrückungen.
          </p>
          <p>
            Wichtig: Der KV-Lohn ist eine Untergrenze. Ihr Arbeitgeber darf mehr zahlen („Ist-Gehalt“) — bei den jährlichen
            KV-Abschlüssen steigen meist beide. Unterhalb der Geringfügigkeitsgrenze von {eur(AT_2026.sv.geringfuegigkeitsgrenze)}{" "}
            fallen keine Sozialversicherungsbeiträge an.
          </p>
          <p>
            Zum Vergleich: In Deutschland gilt ein gesetzlicher Mindestlohn pro Stunde — mehr dazu im{" "}
            <Link href="/mindestlohn">Mindestlohn-Rechner Deutschland</Link>.
          </p>
        </Section>

        <Section id="faq" variant="muted" eyebrow="FAQ" eyebrowIcon={HelpCircle} title="Häufige Fragen zum Mindestlohn in Österreich">
          <AtFaqList faqs={FAQS} />
        </Section>

        <AtQuellen>
          Quellen: WKO „Gehaltstafeln für Angestellte im Handel, gültig ab 1.1.2026“ und „Lohntafeln für Arbeiter/innen im
          Handel, gültig ab 1.1.2026“; Netto nach ÖGK-Werten 2026 und § 33 EStG 1988. Andere Branchen: siehe den jeweiligen
          Kollektivvertrag auf kollektivvertrag.at. Angaben ohne Gewähr.
        </AtQuellen>
      </div>
    </div>
  );
}
