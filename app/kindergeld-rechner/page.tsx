import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import KindergeldRechner from "./KindergeldRechner";
import CalculatorSchema from "@/components/CalculatorSchema";
import { BETREUUNGSFREIBETRAG, ENTWURF, formatEUR } from "@/lib/taxCalculator";
import { KG_JAHRE, KG_VERLAUF, KG_WERTE, kindergeldRechnen, schwelleFreibetrag, type Veranlagung } from "@/lib/kindergeld";
import { pageImageUrl } from "@/lib/pageImage";
import { KG_AUSZAHLUNG_2026, KG_AUSZAHLUNG_MONATE, KG_AUSZAHLUNG_QUELLE, KG_AUSZAHLUNG_STAND } from "@/data/kindergeldAuszahlung";

const PATH = "/kindergeld-rechner";
const URL = `https://bruttonettocalculator.com${PATH}`;
const TITLE = "Kindergeld 2027: 267 € pro Kind – Rechner & Freibetrag";
const DESCRIPTION =
  "Kindergeld 2027 steigt laut Regierungsentwurf auf 267 € pro Kind (2028: 272 €). Rechner mit Günstigerprüfung: Ab welchem Einkommen lohnt sich der Kinderfreibetrag?";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["kindergeld 2027", "kindergeld rechner", "kindergeld erhöhung 2027", "kindergeld 2026", "kinderfreibetrag 2027", "kindergeld oder kinderfreibetrag", "günstigerprüfung kindergeld", "kindergeld auszahlung oktober 2026", "auszahlungstermine kindergeld 2026"],
  alternates: { canonical: URL },
  openGraph: {
    images: [pageImageUrl(PATH)],
    title: TITLE,
    description: DESCRIPTION,
    url: URL, locale: "de_DE", type: "website", siteName: "BruttoNettoCalculator.com",
  },
};

const VERANLAGUNG_LABEL: Record<Veranlagung, string> = {
  verheiratet: "Verheiratet, ein Partner verdient",
  alleinerziehend: "Alleinerziehend (voller Freibetrag)",
  getrennt: "Nicht verheiratet (halber Freibetrag)",
};
const EINKOMMEN = [40000, 60000, 80000, 100000, 120000, 150000];

export default function Page() {
  const kg26 = KG_WERTE[2026].kindergeld;
  const kg27 = KG_WERTE[2027].kindergeld;
  const kg28 = KG_WERTE[2028].kindergeld;
  const schwellen = (["verheiratet", "alleinerziehend", "getrennt"] as Veranlagung[]).map((v) => ({
    v,
    werte: KG_JAHRE.map((j) => schwelleFreibetrag(j, v)),
  }));
  const schwelleVerh27 = schwellen[0].werte[1];
  const zeilen = EINKOMMEN.map((b) => ({ b, r: kindergeldRechnen({ jahr: 2027, veranlagung: "verheiratet", brutto1: b, kinder: 1 }) }));

  const okt = (d: number) => KG_AUSZAHLUNG_2026.find((z) => z.endziffer === d)!.tage[0];

  const faqs = [
    {
      q: "Wann wird das Kindergeld im Oktober 2026 ausgezahlt?",
      a: `Das hängt von der letzten Ziffer Ihrer Kindergeldnummer ab: Endziffer 0 am ${okt(0)}. Oktober, Endziffer 5 am ${okt(5)}. Oktober, Endziffer 9 am ${okt(9)}. Oktober 2026. Die Familienkasse überweist gestaffelt — Endziffer 0 am Monatsanfang, Endziffer 9 gegen Monatsende. Bis das Geld auf dem Konto ist, kann es ein bis zwei Bankarbeitstage dauern; einen Anspruch auf einen bestimmten Tag gibt es nicht.`,
    },
    {
      q: "Wie hoch ist das Kindergeld 2027?",
      a: `Laut Regierungsentwurf des Einkommensteuerreformgesetzes 2027 steigt das Kindergeld zum 1. Januar 2027 von ${kg26} € auf ${kg27} € pro Kind und Monat — ${kg27 - kg26} € mehr. Ab 2028 sind ${kg28} € vorgesehen. Der Betrag ist für jedes Kind gleich hoch, auch für das dritte und vierte Kind.`,
    },
    {
      q: "Ist die Kindergelderhöhung 2027 schon beschlossen?",
      a: `Noch nicht. Das Bundeskabinett hat den Entwurf am 2. September 2026 beschlossen; er liegt dem Bundestag seit dem 28. September 2026 als ${ENTWURF.drucksache} vor, die erste Lesung ist für den 8. Oktober 2026 angesetzt. Bundestag und Bundesrat müssen noch zustimmen. Bis dahin können sich die Beträge ändern — der Rechner wird dann angepasst.`,
    },
    {
      q: "Muss ich die Erhöhung beantragen?",
      a: "Nein. Wer bereits Kindergeld bekommt, erhält den höheren Betrag automatisch von der Familienkasse. Ein Antrag ist nur für ein neu geborenes Kind oder bei einem erstmaligen Anspruch nötig.",
    },
    {
      q: "Kindergeld oder Kinderfreibetrag — was bekomme ich?",
      a: `Zunächst immer das Kindergeld. Mit der Steuererklärung (Anlage Kind) prüft das Finanzamt automatisch, ob die Steuerersparnis durch Kinder- und Betreuungsfreibetrag höher wäre (Günstigerprüfung, § 31 EStG). Ist sie höher, bekommen Sie die Differenz erstattet; ist sie niedriger, behalten Sie das Kindergeld. Bei Ehepaaren mit einem Verdiener lohnt sich der Freibetrag 2027 nach unserer Rechnung ab etwa ${formatEUR(schwelleVerh27).replace(",00", "")} Jahresbrutto.`,
    },
    {
      q: "Wie lange gibt es Kindergeld?",
      a: "Bis zum 18. Geburtstag ohne Bedingungen. Danach bis zum 25. Geburtstag, solange das Kind in Ausbildung oder Studium ist oder auf einen Ausbildungsplatz wartet, und bis 21, wenn es arbeitslos gemeldet ist (§ 32 Abs. 4 EStG). Für Kinder mit Behinderung, die sich nicht selbst unterhalten können, auch darüber hinaus.",
    },
    {
      q: "Wird Kindergeld auf Bürgergeld und Unterhalt angerechnet?",
      a: "Beim Bürgergeld zählt das Kindergeld als Einkommen des Kindes — die Erhöhung verpufft dort weitgehend. Beim Kindesunterhalt mindert das Kindergeld den Bedarf eines minderjährigen Kindes zur Hälfte (§ 1612b BGB); deshalb sinkt der Zahlbetrag der Düsseldorfer Tabelle, wenn das Kindergeld steigt.",
    },
  ];

  return (
    <>
      <CalculatorSchema
        name="Kindergeld-Rechner 2027"
        url={URL}
        breadcrumbLabel="Kindergeld-Rechner"
        description="Kostenloser Kindergeld-Rechner: Kindergeld 2026, 2027 und 2028 laut Regierungsentwurf und Günstigerprüfung Kindergeld gegen Kinderfreibetrag für Ehepaare, Alleinerziehende und getrennte Eltern."
        faqs={faqs}
      />
      <KindergeldRechner />

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Kindergeld und Kinderfreibetrag 2025 bis 2028
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Kinderfreibetrag für beide Elternteile zusammen, Betreuungsfreibetrag {formatEUR(BETREUUNGSFREIBETRAG * 2)} unverändert.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Jahr</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">Kindergeld / Monat</th>
                <th className="py-3.5 px-5 text-right">Kindergeld / Jahr</th>
                <th className="py-3.5 px-5 text-right">Kinderfreibetrag</th>
                <th className="py-3.5 px-5 text-right">Freibeträge gesamt</th>
                <th className="py-3.5 px-5">Stand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {KG_VERLAUF.map((z) => (
                <tr key={z.jahr}>
                  <td className="py-3 px-5 font-mono font-semibold">{z.jahr}</td>
                  <td className="py-3 px-5 text-right font-mono font-bold">{formatEUR(z.kindergeld)}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR(z.kindergeld * 12)}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR(z.kfbJeElternteil * 2)}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR((z.kfbJeElternteil + BETREUUNGSFREIBETRAG) * 2)}</td>
                  <td className="py-3 px-5 text-sm">{z.status === "amtlich" ? "geltendes Recht" : "Regierungsentwurf"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Quellen: <a href="https://www.gesetze-im-internet.de/estg/__66.html" className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">§ 66</a> und{" "}
          <a href="https://www.gesetze-im-internet.de/estg/__32.html" className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">§ 32 Abs. 6 EStG</a>;
          2027/2028:{" "}
          <a href={ENTWURF.quelle} className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">{ENTWURF.drucksache}</a> (Art. 1 und 2).
        </p>
      </section>

      <section data-section="" id="auszahlungstermine" className="max-w-6xl mx-auto px-5 py-6 scroll-mt-24">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Kindergeld Auszahlungstermine 2026: Oktober, November, Dezember
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Wann das Kindergeld kommt, bestimmt die letzte Ziffer Ihrer Kindergeldnummer (z. B. 123FK45678<strong>9</strong> →
          Endziffer 9). Die Termine gelten auch für den Kinderzuschlag. Fällt der Eingang auf ein Wochenende oder einen
          Feiertag, kann er sich verschieben.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[480px]">
            <caption className="sr-only">Auszahlungstermine Kindergeld Oktober bis Dezember 2026 nach Endziffer der Kindergeldnummer</caption>
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Endziffer</th>
                {KG_AUSZAHLUNG_MONATE.map((m) => <th key={m} className="py-3.5 px-5 text-right">{m} 2026</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {KG_AUSZAHLUNG_2026.map((z) => (
                <tr key={z.endziffer}>
                  <td className="py-3 px-5 font-mono font-semibold">{z.endziffer}</td>
                  {z.tage.map((t, i) => (
                    <td key={i} className="py-3 px-5 text-right font-mono">{t}. {KG_AUSZAHLUNG_MONATE[i]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Quelle:{" "}
          <a href={KG_AUSZAHLUNG_QUELLE} className="underline hover:text-[#E60A1C]" rel="noopener" target="_blank">Familienkasse der Bundesagentur für Arbeit</a>,
          Stand {KG_AUSZAHLUNG_STAND}. Ab Januar 2027 kommt das Kindergeld laut Regierungsentwurf mit {kg27} € statt {kg26} € pro Kind.
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Ab welchem Einkommen lohnt sich der Kinderfreibetrag?
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Jahresbrutto, ab dem beim ersten Kind die Steuerersparnis das Kindergeld übersteigt — berechnet mit unserem
          Steuer-Rechner, Arbeitnehmer mit Pauschbeträgen, ohne weitere Einkünfte.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Familienstand</th>
                {KG_JAHRE.map((j) => <th key={j} className="py-3.5 px-5 text-right">{j}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {schwellen.map((s) => (
                <tr key={s.v}>
                  <td className="py-3 px-5 font-semibold">{VERANLAGUNG_LABEL[s.v]}</td>
                  {s.werte.map((w, i) => <td key={i} className="py-3 px-5 text-right font-mono">ab {formatEUR(w).replace(",00", "")}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-black/55">
          Verdienen bei Ehepaaren beide, gilt die Summe der Bruttogehälter näherungsweise ebenso.
        </p>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Kindergeld oder Freibetrag 2027 nach Einkommen
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-4xl">
          Ehepaar, ein Kind, ein Verdiener, Tarif 2027 laut Regierungsentwurf. Kindergeld im Jahr: {formatEUR(kg27 * 12)}.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Jahresbrutto</th>
                <th className="py-3.5 px-5 text-right">Steuerersparnis Freibetrag</th>
                <th className="py-3.5 px-5">Günstiger</th>
                <th className="py-3.5 px-5 text-right text-[#16181D] font-bold">Plus per Steuerbescheid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {zeilen.map(({ b, r }) => (
                <tr key={b}>
                  <td className="py-3 px-5 font-mono font-semibold">{formatEUR(b)}</td>
                  <td className="py-3 px-5 text-right font-mono">{formatEUR(r.kinder[0].ersparnis)}</td>
                  <td className="py-3 px-5">{r.kinder[0].freibetragGuenstiger ? "Freibetrag" : "Kindergeld"}</td>
                  <td className="py-3 px-5 text-right font-mono font-bold">{r.mehrGesamt > 0 ? `+${formatEUR(r.mehrGesamt)}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6">
        <div className="bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10 text-black/70 text-sm sm:text-base leading-relaxed space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">Mehr Netto für Familien 2027</h2>
          <p>
            Die Kindergelderhöhung ist Teil der Einkommensteuerreform 2027, die auch Grundfreibetrag und
            Arbeitnehmer-Pauschbetrag anhebt. Wie viel davon auf Ihrem Gehaltszettel ankommt, zeigt der{" "}
            <Link href="/brutto-netto-rechner-2027" className="text-[#E60A1C] font-semibold hover:underline">Steuerreform-2027-Rechner</Link>.
            Den Kinderfreibetrag berücksichtigt der Arbeitgeber schon monatlich bei Soli und Kirchensteuer — die Zahl der
            Kinderfreibeträge steht in Ihren Lohnsteuerabzugsmerkmalen; welche Steuerklasse für Ihre Familie passt, klärt der{" "}
            <Link href="/welche-steuerklasse-bin-ich" className="text-[#E60A1C] font-semibold hover:underline">Steuerklassen-Finder</Link>.
            Wie das Kindergeld den Kindesunterhalt mindert, rechnet der{" "}
            <Link href="/unterhaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Unterhaltsrechner</Link>,
            das Elterngeld nach der Geburt der{" "}
            <Link href="/elterngeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Elterngeld-Rechner</Link>.
            Ob Ihnen zusätzlich Wohngeld zusteht — Kindergeld zählt dabei nicht als Einkommen —, prüft der{" "}
            <Link href="/wohngeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">Wohngeld-Rechner 2027</Link>.
          </p>
        </div>
      </section>

      <section data-section="" className="max-w-6xl mx-auto px-5 py-6 pb-12">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8">Häufige Fragen zum Kindergeld 2027</h2>
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
