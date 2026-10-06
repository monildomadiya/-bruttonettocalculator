import type { Metadata } from "next";
import Link from "next/link";
import { Receipt, ChevronRight, Sparkles, Percent, Table2 } from "lucide-react";
import { calculateNetto, formatEUR, Steuerklasse } from "@/lib/taxCalculator";
import Calculator from "@/components/Calculator";
import AccordionFaq from "@/components/AccordionFaq";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";
import { pageImageUrl } from "@/lib/pageImage";

/*
 * Google Trends DE (30 Tage bis 6.10.2026), Thema „lohnsteuer“, steigende
 * Suchanfragen: „lohnsteuertabelle 2026 pdf“ +4.650 %, „lohnsteuer klasse 2“,
 * „lohnsteuer 4 mit faktor“ und „wie viel lohnsteuer zahlt man bei
 * steuerklasse 1“ (Breakout), „unterschied einkommensteuer und lohnsteuer“
 * +350 %, „wie berechnet sich die lohnsteuer“ +100 %. Die Seite hatte dafür
 * weder eine Tabelle noch eine direkte Antwort. Alle Beträge kommen aus der
 * Engine (calculateNetto) — keine abgetippten Werte.
 */
const TITLE = "Lohnsteuerrechner 2026 + Lohnsteuertabelle (Steuerklasse 1–6)";
const DESCRIPTION =
  "Lohnsteuer 2026 berechnen: Wie viel Lohnsteuer zahlt man in Steuerklasse 1? Lohnsteuertabelle für alle 6 Steuerklassen, Klasse 2 und 4 mit Faktor erklärt.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "lohnsteuerrechner",
    "lohnsteuerrechner 2026",
    "lohnrechner",
    "lohnrechner 2026",
    "nettolohnrechner",
    "nettolohnrechner 2026",
    "lohn rechner",
    "lohn berechnen",
    "nettolohn berechnen",
    "lohnsteuer 2026",
    "lohnsteuer berechnen",
    "lohnsteuerberechnung 2026",
    "netto lohn rechner",
    "lohnsteuertabelle 2026",
    "lohnsteuer steuerklasse 1",
    "wie viel lohnsteuer zahlt man bei steuerklasse 1",
    "lohnsteuer klasse 2",
    "lohnsteuer 4 mit faktor",
    "wie berechnet sich die lohnsteuer",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/lohnsteuerrechner" },
  openGraph: {
    images: [pageImageUrl("/lohnsteuerrechner")],
    title: TITLE,
    description: DESCRIPTION,
    url: "https://bruttonettocalculator.com/lohnsteuerrechner",
    locale: "de_DE",
    type: "website",
    siteName: "BruttoNettoCalculator.com",
  },
};

const SK_LABEL: Record<Steuerklasse, string> = {
  1: "I — Ledig",
  2: "II — Alleinerziehend",
  3: "III — Verheiratet (Hauptverdiener)",
  4: "IV — Verheiratet (gleich)",
  5: "V — Zweitverdiener",
  6: "VI — Zweitjob",
};

const REF_BRUTTO = 4000;
const SKS = [1, 2, 3, 4, 5, 6] as Steuerklasse[];

/** Monatliche Lohnsteuer (ohne Soli/Kirchensteuer) aus der Engine. */
function lohnsteuerMonat(brutto: number, sk: Steuerklasse): number {
  const res = calculateNetto({
    bruttoMonat: brutto,
    jahr: 2026,
    verheiratet: sk === 3 || sk === 4 || sk === 5,
    kinderlosUeber23: sk !== 2,
    kirche: false,
    steuerklasse: sk,
  });
  return res.steuer.einkommensteuerJahr / 12;
}

const TABELLE_BRUTTO = [1500, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4500, 5000, 5500, 6000, 7000, 8000];
const tabelle = TABELLE_BRUTTO.map((brutto) => ({ brutto, ls: SKS.map((sk) => lohnsteuerMonat(brutto, sk)) }));

const LS1: Record<number, number> = Object.fromEntries([2500, 3000, 4000].map((b) => [b, lohnsteuerMonat(b, 1)]));
const pct = (ls: number, brutto: number) => ((ls / brutto) * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 });
const SK2_DIFF_3000 = lohnsteuerMonat(3000, 1) - lohnsteuerMonat(3000, 2);

/** Höchstes Monatsbrutto (in 5-€-Schritten), bei dem Klasse 1 noch keine Lohnsteuer zahlt. */
const LST_FREI_SK1 = (() => {
  let b = 1000;
  while (lohnsteuerMonat(b + 5, 1) < 0.005) b += 5;
  return b;
})();

const faqs = [
  {
    q: "Wie viel Lohnsteuer zahlt man bei Steuerklasse 1?",
    a: `2026 bei ${formatEUR(2500)} brutto rund ${formatEUR(LS1[2500])} im Monat (${pct(LS1[2500], 2500)} % des Bruttos), bei ${formatEUR(3000)} rund ${formatEUR(LS1[3000])} (${pct(LS1[3000], 3000)} %) und bei ${formatEUR(4000)} rund ${formatEUR(LS1[4000])} (${pct(LS1[4000], 4000)} %). Lohnsteuerfrei bleibt in Steuerklasse 1 ein Monatsbrutto bis etwa ${formatEUR(LST_FREI_SK1)}. Solidaritätszuschlag fällt bei diesen Gehältern nicht an, Kirchensteuer nur bei Kirchenmitgliedschaft (8 bzw. 9 % der Lohnsteuer).`,
  },
  {
    q: "Wie berechnet sich die Lohnsteuer?",
    a: "Der Arbeitgeber rechnet den Monatslohn auf ein Jahr hoch, zieht den Arbeitnehmer-Pauschbetrag (1.230 €), den Sonderausgaben-Pauschbetrag (36 €) und die Vorsorgepauschale für Renten-, Kranken- und Pflegeversicherung ab und wendet auf den Rest den Einkommensteuertarif nach § 32a EStG an. In Steuerklasse 3 gilt das Splittingverfahren, in Klasse 2 kommt der Entlastungsbetrag für Alleinerziehende hinzu, in Klasse 6 fehlen alle Freibeträge. Das Jahresergebnis geteilt durch 12 ist die monatliche Lohnsteuer.",
  },
  {
    q: "Was ist der Unterschied zwischen Einkommensteuer und Lohnsteuer?",
    a: "Die Lohnsteuer ist keine eigene Steuer, sondern die Form, in der Arbeitnehmer ihre Einkommensteuer vorauszahlen: Der Arbeitgeber behält sie jeden Monat ein. Die Einkommensteuer ist die endgültige Jahressteuer, die das Finanzamt mit der Steuererklärung festsetzt — auf alle Einkünfte, nach Abzug von Werbungskosten, Sonderausgaben und Freibeträgen. Die gezahlte Lohnsteuer wird darauf angerechnet; war sie höher, gibt es eine Erstattung.",
  },
  {
    q: "Wie hoch ist die Lohnsteuer in Steuerklasse 2?",
    a: `Steuerklasse 2 entspricht Klasse 1 plus Entlastungsbetrag für Alleinerziehende (4.260 € im Jahr für das erste Kind, 240 € für jedes weitere). Bei ${formatEUR(3000)} brutto sind das 2026 rund ${formatEUR(SK2_DIFF_3000)} weniger Lohnsteuer im Monat als in Klasse 1. Voraussetzung ist, dass mindestens ein Kind im Haushalt lebt, für das Kindergeld bezogen wird, und keine weitere erwachsene Person im Haushalt wohnt.`,
  },
  {
    q: "Was bedeutet Steuerklasse 4 mit Faktor bei der Lohnsteuer?",
    a: "Beim Faktorverfahren (§ 39f EStG) zahlen beide Ehepartner Lohnsteuer nach Klasse 4, multipliziert mit einem Faktor unter 1, den das Finanzamt aus dem voraussichtlichen Splittingvorteil berechnet. So wird die Steuer schon im Monat so verteilt, wie sie am Jahresende tatsächlich anfällt — Nachzahlungen wie bei 3/5 bleiben meist aus. Den genauen Faktor für Ihr Paar berechnet die Seite Steuerklassen.",
  },
  {
    q: "Gibt es die Lohnsteuertabelle 2026 als PDF?",
    a: "Das Bundesfinanzministerium veröffentlicht keine amtliche Tabelle, sondern den Programmablaufplan, nach dem Lohnprogramme rechnen. Die Lohnsteuertabelle auf dieser Seite ist danach berechnet. Sie können sie über die Druckfunktion Ihres Browsers (Drucken → Als PDF speichern) als PDF sichern; für Ihr exaktes Gehalt nutzen Sie den Rechner oben.",
  },
  {
    q: "Was ist die Lohnsteuer?",
    a: "Die Lohnsteuer ist eine Erhebungsform der Einkommensteuer, die der Arbeitgeber direkt vom Bruttolohn einbehält und ans Finanzamt abführt. Ihre Höhe richtet sich nach dem zu versteuernden Einkommen, der Steuerklasse und dem Tarif nach § 32a EStG. Der Lohnsteuerrechner ermittelt sie automatisch für 2026 und 2027.",
  },
  {
    q: "Wann fällt der Solidaritätszuschlag an?",
    a: "Der Solidaritätszuschlag (5,5 % der Lohnsteuer) wird 2026 erst oberhalb einer Freigrenze von 20.350 € Jahres-Lohnsteuer (Einzelveranlagung) fällig und steigt in einer Milderungszone langsam an. Die allermeisten Arbeitnehmer zahlen daher keinen Soli mehr.",
  },
  {
    q: "Welche Steuerklasse zahlt die niedrigste Lohnsteuer?",
    a: "Steuerklasse III hat die niedrigste Lohnsteuer und ist für verheiratete Allein- oder Hauptverdiener gedacht. Am meisten Lohnsteuer zahlt Steuerklasse VI, die für einen zweiten Job ohne Freibeträge gilt. Der Lohnsteuerrechner zeigt alle 6 Klassen im Vergleich.",
  },
  {
    q: "Ist der Lohnsteuerrechner 2026 verbindlich?",
    a: "Der Lohnsteuerrechner liefert eine sehr genaue Orientierung nach den amtlichen Rechengrößen 2026, ersetzt aber keine verbindliche Lohnabrechnung des Arbeitgebers oder eine Steuerberatung. Individuelle Freibeträge (z. B. aus dem Lohnsteuer-Ermäßigungsverfahren) sind nicht berücksichtigt.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Lohnsteuerrechner", item: "https://bruttonettocalculator.com/lohnsteuerrechner" },
  ],
};
const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: TITLE,
  url: "https://bruttonettocalculator.com/lohnsteuerrechner",
  description: "Kostenloser Lohnsteuerrechner & Nettolohnrechner — Lohnsteuer, Soli und Nettolohn aus dem Bruttolohn berechnen (§ 32a EStG 2026).",
};

export default function LohnsteuerrechnerPage() {
  const rows = SKS.map((sk) => {
    const res = calculateNetto({
      bruttoMonat: REF_BRUTTO,
      jahr: 2026,
      verheiratet: sk === 3 || sk === 4 || sk === 5,
      kinderlosUeber23: true,
      kirche: false,
      steuerklasse: sk,
    });
    return { sk, res };
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-16 pb-24 text-[#16181D]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-4 sm:mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Lohnsteuerrechner</span>
      </div>

      <div className="mb-6 sm:mb-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-5">
          <Receipt size={14} /> Lohnsteuer · Nettolohn · 2026/2027
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3 sm:mb-5 max-w-4xl">
          <span className="text-gradient-accent">Lohnsteuerrechner</span> 2026 mit Lohnsteuertabelle
        </h1>
        <p className="text-base sm:text-xl text-black/80 max-w-3xl leading-relaxed mb-2 sm:mb-6">
          Der kostenlose <strong className="text-[#16181D]">Lohnsteuerrechner</strong> zeigt Ihnen, wie viel{" "}
          <strong className="text-[#16181D]">Lohnsteuer</strong>, Solidaritätszuschlag und Sozialabgaben von Ihrem
          Bruttolohn abgehen — und welcher <strong className="text-[#16181D]">Nettolohn</strong> übrig bleibt. Nutzen Sie
          ihn auch als <strong className="text-[#16181D]">Lohnrechner</strong> und <strong className="text-[#16181D]">Nettolohnrechner</strong>{" "}
          für 2026 und 2027 — in allen 6 Steuerklassen.
        </p>
      </div>

      <section id="rechner" className="mb-14 scroll-mt-24">
        <Calculator initialBrutto={REF_BRUTTO} />
      </section>

      {/* Kurzantwort — „wie viel lohnsteuer zahlt man bei steuerklasse 1“ */}
      <section data-section="" className="mb-14">
        <div className="bg-[#FFFFFF] border border-[#E60A1C]/25 rounded-3xl p-5 sm:p-8 shadow-sm">
          <h2 id="lohnsteuer-steuerklasse-1" className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">
            Wie viel Lohnsteuer zahlt man in Steuerklasse 1?
          </h2>
          <p className="text-sm sm:text-base text-black/80 leading-relaxed">
            2026 bei <strong>{formatEUR(2500)}</strong> brutto rund <strong>{formatEUR(LS1[2500])}</strong> im Monat ({pct(LS1[2500], 2500)} %),
            bei <strong>{formatEUR(3000)}</strong> rund <strong>{formatEUR(LS1[3000])}</strong> ({pct(LS1[3000], 3000)} %) und bei{" "}
            <strong>{formatEUR(4000)}</strong> rund <strong>{formatEUR(LS1[4000])}</strong> ({pct(LS1[4000], 4000)} %). Bis etwa{" "}
            {formatEUR(LST_FREI_SK1)} Monatsbrutto fällt in Klasse 1 keine Lohnsteuer an. Soli zahlen Sie bei diesen Gehältern
            nicht, Kirchensteuer nur als Kirchenmitglied.
          </p>
        </div>
      </section>

      {/* Lohnsteuertabelle 2026 — „lohnsteuertabelle 2026 (pdf)“ */}
      <section data-section="" id="lohnsteuertabelle" className="mb-16 scroll-mt-24">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-[#E60A1C]/10 border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-2">
            <Table2 size={13} /> Lohnsteuertabelle 2026
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">
            Lohnsteuertabelle 2026: monatliche Lohnsteuer nach Steuerklasse
          </h2>
          <p className="text-sm sm:text-base text-black/70 mt-1">
            Lohnsteuer pro Monat ohne Solidaritätszuschlag und Kirchensteuer, gesetzlich versichert, ohne Kinderfreibeträge,
            berechnet nach dem Tarif 2026. Klasse 2 mit einem Kind.
          </p>
        </div>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <caption className="sr-only">Lohnsteuertabelle 2026: monatliche Lohnsteuer für die Steuerklassen 1 bis 6</caption>
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3 px-4">Brutto / Monat</th>
                {SKS.map((sk) => (
                  <th key={sk} className="py-3 px-4 text-right">Klasse {sk}</th>
                ))}
                <th className="py-3 px-4 text-right">Anteil Kl. 1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm font-mono">
              {tabelle.map((z) => (
                <tr key={z.brutto} className="hover:bg-black/[0.04] transition-colors">
                  <td className="py-2.5 px-4 font-sans font-semibold text-[#16181D]">{formatEUR(z.brutto)}</td>
                  {z.ls.map((v, i) => (
                    <td key={i} className={`py-2.5 px-4 text-right ${i === 0 ? "font-bold text-[#16181D]" : "text-black/75"}`}>{formatEUR(v)}</td>
                  ))}
                  <td className="py-2.5 px-4 text-right text-black/60">{pct(z.ls[0], z.brutto)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/55 mt-3">
          Klasse 4 ohne Faktor. Als PDF sichern Sie die Tabelle über „Drucken → Als PDF speichern“. Exakte Werte für Ihr
          Gehalt mit Kirchensteuer und Kinderfreibeträgen liefert der Rechner oben.
        </p>
      </section>

      {/* Lohnsteuer breakdown per Steuerklasse */}
      <section data-section="" className="mb-16">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-[#E60A1C]/10 border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-2">
            <Percent size={13} /> Lohnsteuer-Vergleich
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">
            Lohnsteuer & Nettolohn bei {formatEUR(REF_BRUTTO)} brutto
          </h2>
          <p className="text-sm sm:text-base text-black/70 mt-1">
            Monatliche Lohnsteuer, Sozialabgaben und Nettolohn je Steuerklasse (2026, ohne Kirchensteuer).
          </p>
        </div>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Steuerklasse</th>
                <th className="py-4 px-5 text-right">Lohnsteuer</th>
                <th className="py-4 px-5 text-right">Sozialabgaben</th>
                <th className="py-4 px-5 text-right text-[#16181D] font-bold">Nettolohn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {rows.map(({ sk, res }) => (
                <tr key={sk} className={`hover:bg-black/[0.04] transition-colors ${sk === 1 ? "bg-[#E60A1C]/5" : ""}`}>
                  <td className="py-4 px-5 text-[#16181D] font-semibold">{SK_LABEL[sk]}</td>
                  <td className="py-4 px-5 text-right text-rose-600 font-mono">−{formatEUR(res.steuer.summeMonat)}</td>
                  <td className="py-4 px-5 text-right text-amber-600 font-mono">−{formatEUR(res.sv.summeMonat)}</td>
                  <td className="py-4 px-5 text-right text-[#16181D] font-bold font-mono bg-black/[0.04]">{formatEUR(res.nettoMonat)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SEO content */}
      <section data-section="" className="mb-16 bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10 text-black/75 text-sm sm:text-base leading-relaxed space-y-5">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">
          Lohnrechner 2026: Vom Bruttolohn zum Nettolohn
        </h2>
        <p>
          Der Begriff <strong className="text-[#16181D]">Lohnrechner</strong> wird oft synonym zum Gehaltsrechner
          verwendet — technisch berechnet er dasselbe: aus dem <strong className="text-[#16181D]">Bruttolohn</strong> das
          <strong className="text-[#16181D]"> Nettolohn</strong>. Der zentrale Unterschied zwischen beiden ist die
          Lohnsteuer. Sie ist keine eigene Steuerart, sondern die vom Arbeitgeber einbehaltene Vorauszahlung auf die
          Einkommensteuer.
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Was der Nettolohnrechner alles abzieht</h3>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-[#16181D]">Lohnsteuer</strong> nach dem Einkommensteuertarif § 32a EStG (2026)</li>
          <li><strong className="text-[#16181D]">Solidaritätszuschlag</strong> (5,5 % der Lohnsteuer, erst über der Freigrenze)</li>
          <li>ggf. <strong className="text-[#16181D]">Kirchensteuer</strong> (8 % oder 9 % je nach Bundesland)</li>
          <li><strong className="text-[#16181D]">Rentenversicherung</strong> (9,3 % Arbeitnehmeranteil)</li>
          <li><strong className="text-[#16181D]">Krankenversicherung</strong> (7,3 % + halber Zusatzbeitrag)</li>
          <li><strong className="text-[#16181D]">Pflegeversicherung</strong> (1,8 % bzw. 2,4 % für Kinderlose ab 23)</li>
          <li><strong className="text-[#16181D]">Arbeitslosenversicherung</strong> (1,3 % Arbeitnehmeranteil)</li>
        </ul>
        <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Lohnsteuer in Steuerklasse 2 und Steuerklasse 4 mit Faktor</h3>
        <p>
          <strong className="text-[#16181D]">Steuerklasse 2</strong> ist Klasse 1 plus Entlastungsbetrag für Alleinerziehende
          (4.260 € im Jahr, 240 € je weiteres Kind). Bei {formatEUR(3000)} brutto spart das 2026 rund {formatEUR(SK2_DIFF_3000)}{" "}
          Lohnsteuer im Monat. <strong className="text-[#16181D]">Steuerklasse 4 mit Faktor</strong> verteilt die Lohnsteuer bei
          Ehepaaren so, wie sie nach dem Splittingtarif im Jahr tatsächlich anfällt: Beide zahlen Klasse-4-Lohnsteuer mal einen
          Faktor unter 1. Den genauen Faktor nach § 39f EStG berechnet die Seite{" "}
          <Link href="/steuerklassen" className="text-[#E60A1C] font-semibold hover:underline">Steuerklassen</Link>, welche
          Kombination sich lohnt, der{" "}
          <Link href="/steuerklassenwechsel-rechner" className="text-[#E60A1C] font-semibold hover:underline">Steuerklassenwechsel-Rechner</Link>.
        </p>
        <p>
          Möchten Sie umgekehrt vom Netto auf das Brutto rechnen — etwa für eine Gehaltsverhandlung? Nutzen Sie unseren{" "}
          <Link href="/rechner/netto-zu-brutto" className="text-[#E60A1C] font-semibold hover:underline">Netto-zu-Brutto-Rechner</Link>.
          Für die jährliche Steuerlast steht Ihnen der{" "}
          <Link href="/einkommensteuer-rechner" className="text-[#E60A1C] font-semibold hover:underline">Einkommensteuer-Rechner</Link> zur Verfügung.
        </p>
      </section>

      {/* Related */}
      <section data-section="" className="mb-16">
        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
          <Sparkles className="text-[#E60A1C]" size={20} /> Weitere Rechner
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/gehaltsrechner", label: "Gehaltsrechner", desc: "Brutto Netto Gehalt berechnen" },
            { href: "/einkommensteuer-rechner", label: "Einkommensteuer-Rechner", desc: "Jahressteuer nach § 32a EStG" },
            { href: "/steuerklassen", label: "Steuerklassen", desc: "Alle 6 Klassen im Vergleich" },
            { href: "/rechner/netto-zu-brutto", label: "Netto zu Brutto", desc: "Rückrechnung für Verhandlungen" },
            { href: "/stundenlohn-rechner", label: "Stundenlohn-Rechner", desc: "Nettolohn pro Stunde" },
            { href: "/", label: "Brutto-Netto-Rechner", desc: "Der Hauptrechner 2026/2027" },
          ].map((t) => (
            <Link key={t.href + t.label} href={t.href} className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 hover:border-[#E60A1C]/50 transition-all group">
              <div className="font-bold text-[#16181D] mb-1 group-hover:text-[#E60A1C] transition-colors">{t.label}</div>
              <div className="text-xs text-black/60">{t.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8 text-center">
          Häufige Fragen zur Lohnsteuer
        </h2>
        <AccordionFaq faqs={faqs} />
      </section>
      <ToolContent config={TOOL_CONTENT["/lohnsteuerrechner"]} />
    </div>
  );
}
