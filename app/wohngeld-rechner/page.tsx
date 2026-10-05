import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import WohngeldRechner from "./WohngeldRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import { formatEUR } from "@/lib/taxCalculator";
import {
  WOHNGELD_QUELLEN, einkommensgrenze, heizkostenentlastung, wohngeldRechnen,
  type Einkommensquelle, type WgRecht,
} from "@/lib/wohngeld";
import mietenstufen from "@/data/mietenstufen.json";
import { pageImageUrl } from "@/lib/pageImage";

const PATH = "/wohngeld-rechner";
const URL = `https://bruttonettocalculator.com${PATH}`;
const TITLE = "Wohngeld-Rechner 2027: Kürzung & neue Mietenstufen";
const DESCRIPTION =
  "Wohngeld 2026 und 2027 berechnen: Laut Regierungsentwurf keine Erhöhung, halbierte Heizkostenkomponente und neue Mietenstufen für 1.880 Orte – mit Vergleich.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["wohngeld rechner", "wohngeld 2027", "wohngeld rechner 2027", "wohngeld 2026", "mietenstufe 2027", "wohngeld kürzung 2027", "wohngeld berechnen"],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl(PATH)],
    title: TITLE,
    description: DESCRIPTION,
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const R = ["", "I", "II", "III", "IV", "V", "VI", "VII"];
type Ort = [string, string, string, number | null, number];
const ORTE = mietenstufen as Ort[];

const GROSSSTAEDTE = [
  "Berlin, Stadt", "Hamburg, Freie und Hansestadt", "München, Landeshauptstadt", "Köln, Stadt", "Frankfurt am Main, Stadt",
  "Stuttgart, Landeshauptstadt", "Düsseldorf, Stadt", "Leipzig, Stadt", "Dortmund, Stadt", "Essen, Stadt", "Bremen, Stadt",
  "Dresden, Stadt", "Hannover, Landeshauptstadt", "Nürnberg, Stadt", "Duisburg, Stadt", "Bochum, Stadt", "Wuppertal, Stadt",
  "Bielefeld, Stadt", "Bonn, Stadt", "Münster, Stadt", "Mannheim, Universitätsstadt", "Karlsruhe, Stadt", "Augsburg, Stadt",
  "Wiesbaden, Landeshauptstadt", "Mönchengladbach, Stadt", "Kiel, Landeshauptstadt", "Halle (Saale), Stadt",
  "Magdeburg, Landeshauptstadt", "Krefeld, Stadt", "Freiburg im Breisgau, Stadt",
];

/** Amtliche BMWSB-Rechenbeispiele 2025 (Mietenstufe festgehalten), einmal nach heutigem Recht, einmal nach dem Entwurf. */
const BEISPIELE: { titel: string; personen: number; stufe: number; miete: number; quellen: Einkommensquelle[]; alleinerziehend?: boolean; schwerbehindert?: number }[] = [
  { titel: "Rentnerin allein, 1.300 € Rente, Stufe I", personen: 1, stufe: 1, miete: 335, quellen: [{ art: "rente", bruttoMonat: 1300, steuern: false }] },
  { titel: "Single mit ALG I 1.350 €, Stufe IV", personen: 1, stufe: 4, miete: 470, quellen: [{ art: "ohneAbzug", bruttoMonat: 1350, steuern: false }] },
  { titel: "Rentnerpaar, ein Partner GdB 100, Stufe II", personen: 2, stufe: 2, miete: 480, quellen: [{ art: "rente", bruttoMonat: 1410, steuern: false }, { art: "rente", bruttoMonat: 540, steuern: false }], schwerbehindert: 1 },
  { titel: "Alleinerziehende, 2 Kinder, Stufe VI", personen: 3, stufe: 6, miete: 700, quellen: [{ art: "arbeitnehmer", bruttoMonat: 1530, steuern: false }, { art: "ohneAbzug", bruttoMonat: 696, steuern: false }], alleinerziehend: true },
  { titel: "Familie, 2 Kinder, ein Verdiener, Stufe III", personen: 4, stufe: 3, miete: 580, quellen: [{ art: "arbeitnehmer", bruttoMonat: 2240, steuern: false }] },
  { titel: "Familie, 2 Kinder, München (Stufe VII)", personen: 4, stufe: 7, miete: 1225, quellen: [{ art: "arbeitnehmer", bruttoMonat: 2490, steuern: true }, { art: "minijob", bruttoMonat: 556, steuern: false }] },
];

export default function Page() {
  const mitVorjahr = ORTE.filter((o) => o[3] !== null);
  const hoeher = mitVorjahr.filter((o) => o[4] > (o[3] as number)).length;
  const niedriger = mitVorjahr.filter((o) => o[4] < (o[3] as number)).length;
  const staedte = GROSSSTAEDTE.map((n) => ORTE.find((o) => o[2] === "g" && o[0] === n)).filter((o): o is Ort => !!o);

  const beispiele = BEISPIELE.map((b) => {
    const calc = (recht: WgRecht) =>
      wohngeldRechnen({ recht, personen: b.personen, mietenstufe: b.stufe, bruttokaltmiete: b.miete,
        einkommen: { quellen: b.quellen, alleinerziehend: b.alleinerziehend ?? false, schwerbehindert: b.schwerbehindert ?? 0 } }).wohngeld;
    return { ...b, w26: calc("2026"), w27: calc("2027") };
  });
  const grenzen = [1, 2, 3, 4, 5].map((p) => ({ p, g26: einkommensgrenze("2026", p, 4), g27: einkommensgrenze("2027", p, 4) }));
  const b1 = beispiele[0];

  const faqs = [
    {
      q: "Wird das Wohngeld 2027 erhöht?",
      a: "Nach dem Regierungsentwurf nein. Eigentlich schreibt § 43 WoGG alle zwei Jahre eine Anpassung an Preise und Mieten vor, zuletzt zum 1.1.2025. Der Gesetzentwurf zur Vereinfachung und Fortentwicklung des Wohngeldgesetzes setzt die Anpassung zum 1.1.2027 aus, halbiert die dauerhafte Heizkostenkomponente und erhöht den Parameter „c“ der Wohngeldformel. Laut Entwurf spart das 2027 je 738 Mio. € bei Bund und Ländern, ab 2029 je 1,08 Mrd. € im Jahr; rund 68.000 Haushalte würden ins Bürgergeld und 75.000 in die Sozialhilfe wechseln.",
    },
    {
      q: "Wie viel weniger Wohngeld gibt es 2027?",
      a: `Das hängt vom Einkommen ab. Im amtlichen Beispiel der alleinstehenden Rentnerin (1.300 € Rente, Mietenstufe I) sinkt das Wohngeld von ${formatEUR(b1.w26)} auf ${formatEUR(b1.w27)} im Monat. Allein die Heizkostenentlastung fällt für eine Person von ${formatEUR(heizkostenentlastung(1, "2026"))} auf ${formatEUR(heizkostenentlastung(1, "2027"))}. Haushalte nahe der Einkommensgrenze verlieren den Anspruch ganz; zugleich steigt der Mindestbetrag von 10 auf 15 €.`,
    },
    {
      q: "Welche Mietenstufe hat meine Stadt 2027?",
      a: `Der Entwurf ordnet alle Gemeinden ab 10.000 Einwohnern und alle Kreise neu zu — erstmals seit 2023. Von ${mitVorjahr.length} vergleichbaren Einträgen steigen ${hoeher} um mindestens eine Stufe, ${niedriger} sinken. Hamburg fällt von Stufe VI auf V, Münster und Essen steigen. Ihren Ort finden Sie über die Suche im Rechner.`,
    },
    {
      q: "Ist die Wohngeld-Kürzung 2027 schon beschlossen?",
      a: "Nein. Das Kabinett hat den Entwurf am 6. Juli 2026 beschlossen (BR-Drs. 474/26). Der Bundesrat hat am 25. September 2026 Stellung genommen und vor allem die Aussetzung der Anpassung und die Halbierung der Heizkostenkomponente kritisiert. Bundestag und Bundesrat müssen noch zustimmen. Kommt das Gesetz nicht, müsste das Wohngeld nach § 43 WoGG zum 1.1.2027 regulär erhöht werden.",
    },
    {
      q: "Lohnt es sich, Wohngeld noch 2026 zu beantragen?",
      a: "Ja, wenn Sie Anspruch haben. Nach der Übergangsregel des Entwurfs (§ 42e WoGG) gilt: Wer Wohngeld vor dem 1.1.2027 bewilligt bekommen hat, behält den Betrag bis zum Ende des Bewilligungszeitraums. Wird über einen bis 31.12.2026 gestellten Antrag erst 2027 entschieden und wäre das neue Wohngeld niedriger, bleibt es für den ganzen Bewilligungszeitraum beim höheren Dezember-Betrag. Wohngeld gibt es ab dem Monat des Antrags, der Bewilligungszeitraum dauert in der Regel zwölf Monate.",
    },
    {
      q: "Was zählt beim Wohngeld als Einkommen?",
      a: "Das Bruttoeinkommen aller Haushaltsmitglieder abzüglich Werbungskosten-Pauschbetrag und pauschal je 10 % für Steuern, Kranken- und Pflegeversicherung sowie Rentenversicherung (§ 16 WoGG). Kindergeld zählt nicht, Unterhalt, Unterhaltsvorschuss und Arbeitslosengeld I zählen voll. Ab 2027 sollen bei Arbeitnehmern nur noch die Werbungskosten-Pauschbeträge abgezogen werden, höhere Werbungskosten nicht mehr.",
    },
    {
      q: "Wie viel Vermögen darf ich beim Wohngeld haben?",
      a: "Heute gilt nach der Verwaltungsvorschrift: kein Wohngeld bei verwertbarem Vermögen über 60.000 € für die erste und 30.000 € für jede weitere Person. Der Entwurf schreibt diese Grenze ab 2027 ins Gesetz und deckelt sie bei 120.000 € für den ganzen Haushalt.",
    },
  ];

  return (
    <>
      <CalculatorSchema
        name="Wohngeld-Rechner 2027"
        url={URL}
        breadcrumbLabel="Wohngeld-Rechner"
        description="Kostenloser Wohngeld-Rechner nach § 19 WoGG: Wohngeld 2026 nach geltendem Recht und ab 2027 nach dem Regierungsentwurf (BR-Drs. 474/26), mit Mietenstufen-Suche für alle Gemeinden ab 10.000 Einwohnern und alle Kreise."
        faqs={faqs}
      />
      <WohngeldRechner />

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">Was sich beim Wohngeld 2027 ändern soll</h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">Geltendes Recht seit 1.1.2025 gegenüber dem Regierungsentwurf ab 1.1.2027.</p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Regel</th>
                <th className="py-3.5 px-5">2025/2026</th>
                <th className="py-3.5 px-5 text-[#16181D] font-bold">ab 2027 (Entwurf)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              <tr><td className="py-3 px-5 font-semibold">Anpassung an Preise und Mieten</td><td className="py-3 px-5">alle zwei Jahre (§ 43)</td><td className="py-3 px-5">zum 1.1.2027 ausgesetzt</td></tr>
              <tr><td className="py-3 px-5 font-semibold">Heizkostenentlastung, 1 Person</td><td className="py-3 px-5 font-mono">{formatEUR(heizkostenentlastung(1, "2026"))}</td><td className="py-3 px-5 font-mono">{formatEUR(heizkostenentlastung(1, "2027"))}</td></tr>
              <tr><td className="py-3 px-5 font-semibold">Heizkostenentlastung, 4 Personen</td><td className="py-3 px-5 font-mono">{formatEUR(heizkostenentlastung(4, "2026"))}</td><td className="py-3 px-5 font-mono">{formatEUR(heizkostenentlastung(4, "2027"))}</td></tr>
              <tr><td className="py-3 px-5 font-semibold">Parameter „c“, 1 Person</td><td className="py-3 px-5 font-mono">0,0000408</td><td className="py-3 px-5 font-mono">0,00006446</td></tr>
              <tr><td className="py-3 px-5 font-semibold">Höchstbeträge und Klimakomponente</td><td className="py-3 px-5">Stand 2025</td><td className="py-3 px-5">unverändert</td></tr>
              <tr><td className="py-3 px-5 font-semibold">Mindestbetrag</td><td className="py-3 px-5 font-mono">10 €</td><td className="py-3 px-5 font-mono">15 €</td></tr>
              <tr><td className="py-3 px-5 font-semibold">Vermögensgrenze</td><td className="py-3 px-5">60.000 € + 30.000 € je weitere Person (Verwaltungsvorschrift)</td><td className="py-3 px-5">gleich, im Gesetz, höchstens 120.000 €</td></tr>
              <tr><td className="py-3 px-5 font-semibold">Mietenstufen der Gemeinden</td><td className="py-3 px-5">Zuordnung seit 1.1.2023</td><td className="py-3 px-5">neu: {hoeher} höher, {niedriger} niedriger</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Quellen: <a href={`${WOHNGELD_QUELLEN.woggUrl}__12.html`} className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">§ 12</a>,{" "}
          <a href={`${WOHNGELD_QUELLEN.woggUrl}__19.html`} className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">§ 19 WoGG</a> mit Anlagen 1–3;{" "}
          <a href={WOHNGELD_QUELLEN.entwurfUrl} className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">{WOHNGELD_QUELLEN.entwurf}</a> (Art. 1 Nr. 8, 12, 26, 28, 29; Art. 2).
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">Wohngeld 2026 und 2027 im Vergleich</h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Die amtlichen Rechenbeispiele des Bundesbauministeriums — unser Rechner trifft die 2026er-Werte auf den Euro — und dieselben
          Haushalte nach dem Entwurf, bei gleicher Mietenstufe.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Haushalt</th>
                <th className="py-3.5 px-5 text-right">Miete</th>
                <th className="py-3.5 px-5 text-right">2026</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">2027</th>
                <th className="py-3.5 px-5 text-right">Differenz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {beispiele.map((b) => (
                <tr key={b.titel}>
                  <td className="py-3 px-5">{b.titel}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR(b.miete)}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR(b.w26)}</td>
                  <td className="py-3 px-5 text-right font-mono font-bold">{formatEUR(b.w27)}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR(b.w27 - b.w26)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Quelle der Fälle: BMWSB, „Beispiele für die Berechnung des Wohngelds“, Stand 1.1.2025. 2027 mit Arbeitnehmer-Pauschbetrag 1.430 €
          laut Entwurf des Einkommensteuerreformgesetzes 2027.
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">Mietenstufen 2027 der Großstädte</h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Je höher die Stufe, desto mehr Miete wird angerechnet. Alle {ORTE.length.toLocaleString("de-DE")} Gemeinden und Kreise finden Sie über die Suche im Rechner.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Stadt</th>
                <th className="py-3.5 px-5">Land</th>
                <th className="py-3.5 px-5 text-center">seit 2023</th>
                <th className="py-3.5 px-5 text-center text-[#16181D] font-bold">ab 2027</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {staedte.map((o) => (
                <tr key={o[0]}>
                  <td className="py-2.5 px-5">{o[0].split(",")[0]}</td>
                  <td className="py-2.5 px-5 font-mono text-black/60">{o[1]}</td>
                  <td className="py-2.5 px-5 text-center font-mono">{R[o[3] ?? 0]}</td>
                  <td className={`py-2.5 px-5 text-center font-mono font-bold ${o[3] && o[4] > o[3] ? "text-emerald-700" : o[3] && o[4] < o[3] ? "text-[#E60A1C]" : ""}`}>
                    {R[o[4]]}{o[3] && o[4] !== o[3] ? (o[4] > o[3] ? " ↑" : " ↓") : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Quellen: <a href={WOHNGELD_QUELLEN.wogvUrl} className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">Anlage zur Wohngeldverordnung</a> (seit 1.1.2023);
          2027: Anlage in Art. 2 der {WOHNGELD_QUELLEN.entwurf}, Daten der Wohngeldstatistik 2023/2024.
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">Einkommensgrenzen beim Wohngeld 2026 und 2027</h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Höchstes monatliches Gesamteinkommen (nach Abzügen und Freibeträgen), bei dem noch Wohngeld gezahlt wird — Mietenstufe IV,
          Miete in Höhe des Höchstbetrags. Bei einem Arbeitnehmer mit Steuern und Sozialabgaben entspricht das einem Bruttolohn von
          etwa Gesamteinkommen ÷ 0,7 + 102,50 €.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Personen</th>
                <th className="py-3.5 px-5 text-right">2026</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">2027 (Entwurf)</th>
                <th className="py-3.5 px-5 text-right">Differenz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {grenzen.map((g) => (
                <tr key={g.p}>
                  <td className="py-3 px-5 font-mono font-semibold">{g.p}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR(g.g26)}</td>
                  <td className="py-3 px-5 text-right font-mono font-bold">{formatEUR(g.g27)}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR(g.g27 - g.g26)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">Wohngeld, Bürgergeld oder Kinderzuschlag?</h2>
          <p>
            Wohngeld ist ein Zuschuss für Haushalte, die ihren Lebensunterhalt selbst decken, aber die Miete nicht ganz tragen können.
            Wer Bürgergeld oder Grundsicherung bezieht, bekommt die Wohnkosten dort und ist vom Wohngeld ausgeschlossen. Ob Sie mit
            Wohngeld besser fahren, zeigen der{" "}
            <Link href="/buergergeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Bürgergeld-Rechner</Link> und — im
            Alter — der{" "}
            <Link href="/grundsicherung-rechner" className="text-[#E60A1C] font-semibold hover:underline">Grundsicherung-Rechner</Link>.
            Familien mit Wohngeld haben oft zusätzlich Anspruch auf Kinderzuschlag; das Kindergeld 2027 rechnet der{" "}
            <Link href="/kindergeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Kindergeld-Rechner</Link>, die Rente
            nach Abzügen der{" "}
            <Link href="/rente-brutto-netto-rechner" className="text-[#E60A1C] font-semibold hover:underline">Rente-Brutto-Netto-Rechner</Link>.
          </p>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">Häufige Fragen zum Wohngeld 2027</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#F4F5F7] border border-black/[0.08] rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-black/[0.04] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 pt-1 text-black/65 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
