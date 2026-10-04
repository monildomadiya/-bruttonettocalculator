import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import AltersvorsorgedepotRechner from "./AltersvorsorgedepotRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import { AVD, grundzulage, kinderzulage, guenstigerpruefung } from "@/lib/altersvorsorgedepot";
import { pageImageUrl } from "@/lib/pageImage";

const PATH = "/altersvorsorgedepot-rechner";
const URL = `https://bruttonettocalculator.com${PATH}`;
const TITLE = "Altersvorsorgedepot Rechner 2027: Zulagen & Steuervorteil";
const DESCRIPTION =
  "Altersvorsorgedepot ab 2027 berechnen: Grundzulage bis 540 €, Kinderzulage 300 €, Steuervorteil per Günstigerprüfung und Depotwert — nach BGBl. 2026 I Nr. 156.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "altersvorsorgedepot rechner",
    "altersvorsorgedepot 2027",
    "altersvorsorgedepot förderung rechner",
    "altersvorsorgedepot berechnen",
    "altersvorsorgedepot zulage",
    "altersvorsorgereformgesetz",
    "riester reform 2027",
  ],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl(PATH)],
    title: TITLE,
    description: DESCRIPTION,
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const BEITRAEGE = [120, 360, 600, 1000, 1200, 1800, 2400];
const GEHAELTER = [30000, 45000, 60000, 80000, 100000];

const zvE = (bruttoJahr: number) =>
  calculateNetto({ bruttoMonat: bruttoJahr / 12, jahr: 2027, steuerklasse: 1, verheiratet: false, kinderlosUeber23: false, kirche: false }).steuer.zvE;

export default function Page() {
  const gp = GEHAELTER.map((b) => ({ b, ...guenstigerpruefung({ zvE: zvE(b), beitragJahr: 1800, zulage: 540, splitting: false, kirche: false }) }));
  // Ab welchem Bruttojahresgehalt der Steuerabzug die Zulage übersteigt (Single, 1.800 €, keine Kinder).
  let abBrutto = 0;
  for (let b = 10000; b <= 100000; b += 500) {
    if (guenstigerpruefung({ zvE: zvE(b), beitragJahr: 1800, zulage: 540, splitting: false, kirche: false }).zusaetzlicheErstattung > 0) { abBrutto = b; break; }
  }

  const faqs = [
    {
      q: "Was ist das Altersvorsorgedepot?",
      a: `Ein staatlich gefördertes Wertpapierdepot für die private Altersvorsorge, das ab dem ${AVD.start} angeboten wird und die Riester-Rente für neue Verträge ablöst. Gefördert werden Einzahlungen in Fonds und ETFs — ohne Beitragsgarantie und ohne Versicherungsmantel. Rechtsgrundlage ist das ${AVD.gesetz} (${AVD.bgbl}).`,
    },
    {
      q: "Wie hoch ist die Förderung im Altersvorsorgedepot?",
      a: `Die Grundzulage beträgt 50 Cent je eingezahltem Euro bis 360 € und 25 Cent je Euro von 360,01 € bis 1.800 € — höchstens ${AVD.grundzulageMax} € im Jahr (§ 84 EStG). Dazu kommen bis zu ${AVD.kinderzulageMax} € Kinderzulage je Kind mit Kindergeld (§ 85 EStG) und für unter 25-Jährige einmalig ${AVD.berufseinsteigerbonus} € Berufseinsteigerbonus. Voraussetzung ist ein Eigenbeitrag von mindestens ${AVD.mindesteigenbeitrag} € im Jahr (§ 86 EStG).`,
    },
    {
      q: "Wie viel muss ich einzahlen, um die volle Zulage zu bekommen?",
      a: `Für die volle Grundzulage von ${AVD.grundzulageMax} € sind 1.800 € im Jahr nötig, also 150 € im Monat. Die volle Kinderzulage von ${AVD.kinderzulageMax} € je Kind gibt es schon ab 300 € Eigenbeitrag im Jahr. Mit 30 € im Monat (360 € im Jahr) erreichen Sie die höchste Förderquote: 50 % Grundzulage.`,
    },
    {
      q: "Lohnt sich das Altersvorsorgedepot für Gutverdiener?",
      a: `Ja, über den Steuervorteil: Beiträge bis 1.800 € plus Zulage sind als Sonderausgaben absetzbar (§ 10a EStG). Das Finanzamt prüft, ob die Steuerersparnis höher ist als die Zulage, und erstattet dann die Differenz. Bei 1.800 € Beitrag und ohne Kinder ist das als Single schon ab etwa ${abBrutto.toLocaleString("de-DE")} € Bruttojahresgehalt der Fall; bei 100.000 € beträgt die Förderung insgesamt ${formatEUR(gp[gp.length - 1].foerderungGesamt)} im Jahr. Die Auszahlungen im Alter sind dafür voll steuerpflichtig.`,
    },
    {
      q: "Wie viel darf ich höchstens einzahlen?",
      a: `Bis zu ${AVD.einzahlungMax.toLocaleString("de-DE")} € im Jahr, davon sind 1.800 € gefördert. Das Standarddepot darf höchstens ${AVD.effektivkostenMaxStandard * 100} % Effektivkosten im Jahr kosten.`,
    },
    {
      q: "Wann und wie wird ausgezahlt?",
      a: `Frühestens ab ${AVD.auszahlungFruehestens}, spätestens ab ${AVD.auszahlungSpaetestens}. Ausgezahlt wird über einen Auszahlungsplan, der mindestens bis zum ${AVD.auszahlplanBis}. Lebensjahr läuft, oder als lebenslange Rente; bis zu ${AVD.teilkapitalMaxPct} % des Kapitals können zu Beginn auf einmal entnommen werden. Die Leistungen werden mit dem persönlichen Steuersatz versteuert (§ 22 Nr. 5 EStG).`,
    },
    {
      q: "Was passiert mit meinem Riester-Vertrag?",
      a: "Verträge, die vor dem 1. Januar 2027 abgeschlossen wurden, können mit der bisherigen Förderung weiterlaufen (Bestandsschutz). Laut Bundesfinanzministerium können Sie aber auch in einen Neuvertrag zu den neuen Konditionen wechseln, ohne die bisherige Förderung zurückzahlen zu müssen.",
    },
    {
      q: "Wer kann ein gefördertes Altersvorsorgedepot nutzen?",
      a: `Unmittelbar förderberechtigt sind unter anderem rentenversicherungspflichtige Arbeitnehmer, Beamte, Pflichtmitglieder berufsständischer Versorgungswerke und — neu — Selbständige, die eine Steuererklärung abgeben. Ehepartner ohne eigene Berechtigung bekommen über den Partner eine Grundzulage von höchstens ${AVD.mittelbarMax} €, wenn sie selbst mindestens ${AVD.mindesteigenbeitrag} € einzahlen.`,
    },
  ];

  return (
    <>
      <CalculatorSchema
        name="Altersvorsorgedepot-Rechner 2027"
        url={URL}
        breadcrumbLabel="Altersvorsorgedepot-Rechner"
        description="Kostenloser Rechner für das Altersvorsorgedepot ab 2027: Grund- und Kinderzulage, Berufseinsteigerbonus, Steuervorteil nach der Günstigerprüfung und Depotwert bei Rentenbeginn — nach dem Altersvorsorgereformgesetz (BGBl. 2026 I Nr. 156)."
        faqs={faqs}
      />
      <AltersvorsorgedepotRechner />

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Altersvorsorgedepot: Zulage nach Beitrag
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Grundzulage nach § 84 EStG, Kinderzulage nach § 85 EStG — je Jahr. Der Berufseinsteigerbonus von{" "}
          {AVD.berufseinsteigerbonus} € kommt für unter 25-Jährige einmal dazu.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Eigenbeitrag / Jahr</th>
                <th className="py-3.5 px-5 text-right">Grundzulage</th>
                <th className="py-3.5 px-5 text-right">Förderquote</th>
                <th className="py-3.5 px-5 text-right">mit 1 Kind</th>
                <th className="py-3.5 px-5 text-right">mit 2 Kindern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {BEITRAEGE.map((b) => {
                const g = grundzulage(b);
                return (
                  <tr key={b}>
                    <td className="py-3 px-5 font-mono font-semibold">{formatEUR(b)} <span className="text-black/45 font-sans text-xs">({formatEUR(b / 12)} / Monat)</span></td>
                    <td className="py-3 px-5 text-right font-mono font-bold">{formatEUR(g)}</td>
                    <td className="py-3 px-5 text-right font-mono">{Math.round((g / Math.min(b, AVD.stufe2Grenze)) * 100)} %</td>
                    <td className="py-3 px-5 text-right font-mono">{formatEUR(g + kinderzulage(b, 1))}</td>
                    <td className="py-3 px-5 text-right font-mono">{formatEUR(g + kinderzulage(b, 2))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Förderquote bezogen auf den geförderten Beitrag (höchstens 1.800 €). Quelle:{" "}
          <a href={AVD.bgblUrl} className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">{AVD.gesetz}, {AVD.bgbl}</a>, Artikel 2.
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Zulage oder Steuerabzug? Die Günstigerprüfung nach Gehalt
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          1.800 € Beitrag, Single, keine Kinder, ohne Kirchensteuer. Abziehbar sind Beitrag plus Zulage, also 2.340 €;
          gerechnet mit dem Einkommensteuertarif 2027 laut Gesetzentwurf (BT-Drucksache 21/8235).
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Bruttojahresgehalt</th>
                <th className="py-3.5 px-5 text-right">Zulage</th>
                <th className="py-3.5 px-5 text-right">Steuerersparnis</th>
                <th className="py-3.5 px-5 text-right">Zusätzlich vom Finanzamt</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">Förderung gesamt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {gp.map((x) => (
                <tr key={x.b}>
                  <td className="py-3 px-5 font-mono font-semibold">{formatEUR(x.b)}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR(540)}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR(x.steuerersparnis)}</td>
                  <td className="py-3 px-5 text-right font-mono">{x.zusaetzlicheErstattung > 0 ? `+${formatEUR(x.zusaetzlicheErstattung)}` : "—"}</td>
                  <td className="py-3 px-5 text-right font-mono font-bold">{formatEUR(x.foerderungGesamt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Vereinfachte Rechnung: zu versteuerndes Einkommen aus dem Bruttogehalt nach Sozialabgaben und Pauschbeträgen,
          Steuer inklusive Solidaritätszuschlag. Andere Einkünfte oder Abzüge verschieben die Werte.
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">Altersvorsorgedepot und Riester im Vergleich</h2>
          <ul className="space-y-3">
            <li><strong className="text-[#16181D]">Grundzulage:</strong> Riester zahlt starr 175 € — volle Zulage aber nur bei einem Mindesteigenbeitrag von 4 % des beitragspflichtigen Vorjahreseinkommens (abzüglich Zulagen). Neu: 50 % bzw. 25 % auf jeden Euro, höchstens {AVD.grundzulageMax} €, schon ab {AVD.mindesteigenbeitrag} € im Jahr.</li>
            <li><strong className="text-[#16181D]">Kinderzulage:</strong> Neu 1 € je eingezahltem Euro bis {AVD.kinderzulageMax} € je Kind, unabhängig vom Geburtsjahr des Kindes.</li>
            <li><strong className="text-[#16181D]">Anlage:</strong> Das Altersvorsorgedepot investiert direkt in Fonds und ETFs, ohne Beitragsgarantie. Das Standarddepot ist auf {AVD.effektivkostenMaxStandard * 100} % Effektivkosten gedeckelt.</li>
            <li><strong className="text-[#16181D]">Steuerabzug:</strong> bis 1.800 € plus Zulage als Sonderausgabe (§ 10a EStG) — mit Günstigerprüfung wie bisher.</li>
            <li><strong className="text-[#16181D]">Kreis der Berechtigten:</strong> erstmals auch Selbständige, die eine Steuererklärung abgeben.</li>
          </ul>
          <p>
            Den alten Vertrag rechnet weiterhin der{" "}
            <Link href="/riester-rechner" className="text-[#E60A1C] font-semibold hover:underline">Riester-Rechner</Link>; was von der
            gesetzlichen Rente netto bleibt, zeigt der{" "}
            <Link href="/rente-brutto-netto-rechner" className="text-[#E60A1C] font-semibold hover:underline">Rente-Brutto-Netto-Rechner</Link>, und
            ab wann Sie in Rente gehen können, der{" "}
            <Link href="/renteneintrittsalter-rechner" className="text-[#E60A1C] font-semibold hover:underline">Renteneintrittsalter-Rechner</Link>.
          </p>
          <p className="text-xs text-black/55">
            Quellen:{" "}
            <a href={AVD.bgblUrl} className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">{AVD.bgbl}</a> (verkündet 29.05.2026; die
            EStG-Änderungen gelten ab 01.01.2027) ·{" "}
            <a href={AVD.bmfFaqUrl} className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">BMF: Fragen und Antworten zur Reform der geförderten privaten Altersvorsorge</a>.
          </p>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">Häufige Fragen zum Altersvorsorgedepot</h2>
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
