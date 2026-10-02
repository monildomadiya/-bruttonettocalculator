import Link from "next/link";
import { GraduationCap, Table2, TrendingUp, HelpCircle, Info } from "lucide-react";
import Section from "@/components/ui/Section";
import TableOfContents from "@/components/TableOfContents";
import { berechneBruttoNettoAT, formatEURat as eur } from "@/lib/oesterreich";
import { atMetadata, AtSchemas, AtHero, AtFaqList, AtQuellen, AT_STANDARD, type AtFaq } from "@/components/oesterreich/AtShared";

/**
 * Lehrer-Gehalt Österreich (Entlohnungsschema pd) mit Netto. Rising-CSV AT
 * 25.9.–2.10.2026: "gehalt lehrer österreich" Breakout, "lehrer gehalt
 * österreich" +150 %.
 *
 * Beträge: GÖD/CLV „Neue Gehaltsansätze ab 1. Juli 2026“ (+3,3 %, Abschluss
 * vom 7.10.2025, vom Nationalrat am 12.12.2025 beschlossen). Netto mit den
 * ASVG-Sätzen für Angestellte, aber ohne AK-Umlage: Lehrpersonen im
 * öffentlichen Dienst sind keine AK-Mitglieder.
 */

const PATH = "/lehrer-gehalt-oesterreich";
const TITLE = "Lehrer Gehalt Österreich 2026 — Schema pd mit Netto";
const DESCRIPTION =
  "Lehrer-Gehalt in Österreich ab Juli 2026: alle Entlohnungsstufen im Schema pd (3.636 € bis 6.462 € brutto) und was netto bleibt. Mit Gehaltserhöhung 2027.";

export const metadata = atMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "lehrer gehalt österreich",
    "gehalt lehrer österreich",
    "lehrer gehalt österreich netto",
    "entlohnungsschema pd 2026",
    "lehrer einstiegsgehalt österreich",
    "lehrer gehalt 2026 österreich",
    "vertragslehrer gehalt pd",
  ],
});

/** Schema pd, Monatsentgelt brutto ab 1.7.2026, Verweildauer in Jahren. */
const PD = [
  { stufe: 1, brutto: 3636.4, verweil: "5,5 (3,5)" },
  { stufe: 2, brutto: 4138.2, verweil: "5" },
  { stufe: 3, brutto: 4641.2, verweil: "5" },
  { stufe: 4, brutto: 5144.3, verweil: "6" },
  { stufe: 5, brutto: 5647.6, verweil: "6" },
  { stufe: 6, brutto: 6150.9, verweil: "6" },
  { stufe: 7, brutto: 6461.6, verweil: "—" },
];
/** Beginn der Stufe in Dienstjahren bei Regel-Verweildauer. */
const AB_JAHR = [0, 5.5, 10.5, 15.5, 21.5, 27.5, 33.5];

const lehrer = (brutto: number, bundesland: "niederoesterreich" | "wien" = "niederoesterreich") =>
  berechneBruttoNettoAT({ ...AT_STANDARD, bundesland, bruttoMonat: brutto, akUmlage: false });

const ZEILEN = PD.map((p, i) => {
  const r = lehrer(p.brutto);
  return { ...p, ab: AB_JAHR[i], netto: r.laufend.netto, jahrBrutto: r.jahr.brutto, jahrNetto: r.jahr.netto };
});
const S1 = ZEILEN[0];
const S7 = ZEILEN[6];
const LEBENS_NETTO_DIFF = S7.netto - S1.netto;

const FAQS: AtFaq[] = [
  {
    q: "Wie viel verdient ein Lehrer in Österreich?",
    a: `Neue Lehrpersonen im Schema pd verdienen seit 1. Juli 2026 ${eur(S1.brutto)} brutto im Monat, 14-mal im Jahr. Netto bleiben davon rund ${eur(
      S1.netto
    )}. In der höchsten Stufe 7 sind es ${eur(S7.brutto)} brutto oder rund ${eur(S7.netto)} netto. Dazu kommen Zulagen, etwa für Klassenvorstand, Mentoring oder Fächer mit hoher Korrekturarbeit.`,
  },
  {
    q: "Wie hoch ist das Einstiegsgehalt für Lehrer in Österreich?",
    a: `${eur(S1.brutto)} brutto (Entlohnungsstufe 1 im Schema pd, ab 1.7.2026) — für alle Schularten gleich, von der Volksschule bis zur AHS. Das sind ${eur(
      S1.jahrBrutto
    )} brutto und rund ${eur(S1.jahrNetto)} netto im Jahr.`,
  },
  {
    q: "Was ist das Entlohnungsschema pd?",
    a: "Das Dienstrecht „pädagogischer Dienst“ gilt für alle Lehrpersonen, die seit dem Schuljahr 2019/20 neu eintreten. Es hat sieben Entlohnungsstufen und ein einheitliches Grundgehalt für alle Schularten; die Lehrverpflichtung beträgt 22 Wochenstunden. Ältere Lehrkräfte sind meist noch in den Schemata l1, l2 oder als Beamte in L1/L2 eingestuft und haben andere Gehaltstabellen.",
  },
  {
    q: "Wann steigen die Lehrergehälter wieder?",
    a: "Laut dem dreijährigen Gehaltsabschluss für den öffentlichen Dienst steigen die Gehälter im August 2027 um durchschnittlich 1 % und im September 2028 noch einmal um durchschnittlich 1 %, jeweils sozial gestaffelt über Fixbeträge. Die letzte Erhöhung um 3,3 % galt ab 1. Juli 2026; von Jänner bis Juni 2026 gab es keine Erhöhung.",
  },
  {
    q: "Zahlen Lehrer Arbeiterkammerumlage?",
    a: "Nein. Lehrpersonen im öffentlichen Dienst sind keine Mitglieder der Arbeiterkammer und zahlen deshalb keine AK-Umlage von 0,5 %. Die Netto-Werte auf dieser Seite berücksichtigen das; Kranken-, Pensions-, Arbeitslosenversicherung und Wohnbauförderung fallen wie bei anderen Arbeitnehmern an.",
  },
  {
    q: "Wann werden die Sonderzahlungen bei Lehrern ausgezahlt?",
    a: "Im öffentlichen Dienst gibt es keine Urlaubs- und Weihnachtsgeld-Termine wie in der Privatwirtschaft: Die Sonderzahlungen werden vierteljährlich ausgezahlt, jeweils ein halbes Monatsentgelt im März, Juni, September und Dezember. In Summe sind es ebenfalls zwei Monatsentgelte im Jahr, steuerlich mit 6 % begünstigt.",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen">
      <AtSchemas path={PATH} title={TITLE} description={DESCRIPTION} crumb="Lehrer-Gehalt" faqs={FAQS} />
      <AtHero crumb="Lehrer-Gehalt" badge="Österreich · Schema pd ab 1.7.2026" title="Lehrer Gehalt Österreich" accent="2026">
        <p>
          Alle sieben Entlohnungsstufen im neuen Lehrerdienstrecht (Schema pd) nach der Erhöhung um 3,3 % im Juli 2026 — und was
          davon netto bleibt. Einstieg: <strong>{eur(S1.brutto)} brutto</strong>, rund <strong>{eur(S1.netto)} netto</strong> im
          Monat.
        </p>
      </AtHero>

      <div className="max-w-5xl mx-auto px-4 sm:px-5 pb-16">
        <TableOfContents
          className="mb-8"
          items={[
            { id: "tabelle", label: "Gehaltstabelle pd" },
            { id: "karriere", label: "Gehalt im Laufe der Jahre" },
            { id: "erhoehung", label: "Erhöhung 2027" },
            { id: "faq", label: "Häufige Fragen" },
          ]}
        />

        <Section
          id="tabelle"
          eyebrow="Gehaltstabelle"
          eyebrowIcon={Table2}
          title="Gehaltstabelle Lehrer Schema pd ab 1. Juli 2026"
          intro="Monatsentgelt brutto, Vollbeschäftigung (22 Wochenstunden), ohne Zulagen. Netto mit 14 Bezügen, ohne Kinder und Pendlerpauschale, ohne AK-Umlage."
        >
          <div className="overflow-x-auto bg-white border border-black/[0.08] rounded-2xl">
            <table className="w-full text-sm tabular-nums min-w-[640px]">
              <thead>
                <tr className="text-left bg-black/[0.03] border-b border-black/[0.08]">
                  <th className="px-4 py-3 font-bold">Stufe</th>
                  <th className="px-4 py-3 font-bold text-right">Verweildauer (Jahre)</th>
                  <th className="px-4 py-3 font-bold text-right">Brutto / Monat</th>
                  <th className="px-4 py-3 font-bold text-right">Netto / Monat</th>
                  <th className="px-4 py-3 font-bold text-right">Netto / Jahr</th>
                </tr>
              </thead>
              <tbody>
                {ZEILEN.map((z) => (
                  <tr key={z.stufe} className={`border-b border-black/[0.05] last:border-0 ${z.stufe === 1 ? "bg-[#E60A1C]/[0.04]" : ""}`}>
                    <th scope="row" className="px-4 py-3 font-semibold text-left">Stufe {z.stufe}</th>
                    <td className="px-4 py-3 text-right">{z.verweil}</td>
                    <td className="px-4 py-3 text-right">{eur(z.brutto)}</td>
                    <td className="px-4 py-3 text-right font-bold">{eur(z.netto)}</td>
                    <td className="px-4 py-3 text-right">{eur(z.jahrNetto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-black/50 mt-3 flex items-start gap-1.5">
            <Info size={12} className="flex-shrink-0 mt-0.5" />
            Vertragslehrpersonen im pädagogischen Dienst (pd), Bundes- und Landeslehrer. Klammerwert bei Stufe 1: verkürzte
            Verweildauer laut Gehaltstabelle. In Wien ist das Netto wegen des höheren Wohnbauförderungsbeitrags um rund{" "}
            {eur(lehrer(S1.brutto).laufend.netto - lehrer(S1.brutto, "wien").laufend.netto)} niedriger.
          </p>
        </Section>

        <Section
          id="karriere"
          variant="muted"
          eyebrow="Karriere"
          eyebrowIcon={GraduationCap}
          title="Lehrergehalt im Laufe der Dienstjahre"
          intro="Bei Regel-Verweildauer, ohne Vordienstzeiten. Angerechnete Vordienstzeiten verkürzen den Weg in höhere Stufen."
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ZEILEN.map((z) => (
              <li key={z.stufe} className="bg-white border border-black/[0.08] rounded-2xl p-4">
                <div className="text-xs font-mono uppercase tracking-wider text-black/50 font-bold">
                  {z.ab === 0 ? "Berufseinstieg" : `nach ${String(z.ab).replace(".", ",")} Dienstjahren`} · Stufe {z.stufe}
                </div>
                <div className="font-display font-extrabold text-xl text-[#16181D] mt-1 tabular-nums">{eur(z.netto)} netto</div>
                <div className="text-sm text-black/55 tabular-nums">{eur(z.brutto)} brutto</div>
              </li>
            ))}
          </ul>
          <p className="text-sm text-black/65 mt-4">
            Vom Einstieg bis zur letzten Stufe steigt das Netto um {eur(LEBENS_NETTO_DIFF)} im Monat. Ihr Netto mit Kindern oder
            Pendlerpauschale berechnet der{" "}
            <Link href="/brutto-netto-rechner-oesterreich" className="text-[#E60A1C] font-semibold hover:underline">
              Brutto-Netto-Rechner Österreich
            </Link>{" "}
            (dort ist die AK-Umlage enthalten, für Lehrpersonen also rund 0,5 % zu viel abgezogen).
          </p>
        </Section>

        <Section id="erhoehung" eyebrow="Gehaltsabschluss" eyebrowIcon={TrendingUp} title="Gehaltserhöhung 2026, 2027 und 2028" prose>
          <p>
            Die Gewerkschaft Öffentlicher Dienst und die Bundesregierung haben im Oktober 2025 einen Abschluss über drei Jahre
            vereinbart, den der Nationalrat im Dezember 2025 beschlossen hat:
          </p>
          <ul>
            <li><strong>Jänner bis Juni 2026:</strong> keine Erhöhung.</li>
            <li><strong>Ab 1. Juli 2026:</strong> +3,3 % auf Gehälter, Zulagen und Vergütungen (Werte oben).</li>
            <li><strong>August 2027:</strong> durchschnittlich +1 %, sozial gestaffelt über Fixbeträge.</li>
            <li><strong>September 2028:</strong> nochmals durchschnittlich +1 %.</li>
          </ul>
          <p>
            Zusätzlich steigen ab 2027 die Steuerstufen um 2,27 % — was das für Ihr Netto bedeutet, zeigt der{" "}
            <Link href="/brutto-netto-rechner-oesterreich-2027">Brutto-Netto-Rechner Österreich 2027</Link>.
          </p>
        </Section>

        <Section id="faq" variant="muted" eyebrow="FAQ" eyebrowIcon={HelpCircle} title="Häufige Fragen zum Lehrergehalt">
          <AtFaqList faqs={FAQS} />
        </Section>

        <AtQuellen>
          Quellen: GÖD/CLV „Neue Gehaltsansätze ab 1. Juli 2026“ (Vertragslehrpersonen im pädagogischen Dienst); Parlament,
          Parlamentskorrespondenz Nr. 1181 vom 12.12.2025 (Gehaltsabschluss 2026–2028); BVAEB „Beitragsrechtliche Werte 2026“.
          Netto mit Werten 2026; Zulagen, Gewerkschaftsbeitrag und Freibeträge sind nicht berücksichtigt. Angaben ohne Gewähr.
        </AtQuellen>
      </div>
    </div>
  );
}
