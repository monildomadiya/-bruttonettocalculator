import type { Metadata } from "next";
import Link from "next/link";
import { Wallet2, ChevronRight, Sparkles, BarChart3, Info } from "lucide-react";
import {
  calculateNetto,
  formatEUR,
  midijobArbeitnehmerBemessungMonat,
  isMidijob,
  UEBERGANGSBEREICH_2026,
  UEBERGANGSBEREICH_2027,
} from "@/lib/taxCalculator";
import Calculator from "@/components/Calculator";
import AccordionFaq from "@/components/AccordionFaq";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";

const PAGE_TITLE = "Midijob-Rechner 2026/2027 — Übergangsbereich bis 2.000 €";
const PAGE_DESCRIPTION =
  "Midijob-Rechner 2026/2027: Netto im Übergangsbereich berechnen — 2026 ab 603,01 €, 2027 ab 633,01 € bis 2.000 €. Reduzierte Abgaben, voller Rentenanspruch.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "Midijob Rechner",
    "Midijob Rechner 2026",
    "Midijob Rechner 2027",
    "Midijob 2027",
    "Midijob Grenze 2027",
    "Midijob Untergrenze 2027",
    "Übergangsbereich 2027",
    "Übergangsbereich Rechner",
    "Gleitzone Rechner",
    "Midijob netto",
    "Midijob Grenze 2000 Euro",
    "Midijob Sozialabgaben",
    "beitragspflichtige Einnahme Midijob",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/midijob-rechner" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "https://bruttonettocalculator.com/midijob-rechner",
    locale: "de_DE",
    type: "website",
    siteName: "BruttoNettoCalculator.com",
  },
};

// Beispielhafte Monatsentgelte im Übergangsbereich (603,01 €–2.000 €).
const MIDIJOB_STUFEN = [700, 900, 1100, 1300, 1500, 1700, 1900, 2000];

// Vergleichsbeträge 2026 ↔ 2027 — 620 € liegt bewusst zwischen den beiden Untergrenzen.
const VERGLEICH_STUFEN = [620, 650, 800, 1000, 1200, 1500, 1800, 2000];

const faqs = [
  {
    q: "Wie hoch ist die Midijob-Grenze 2027?",
    a: "2027 reicht der Midijob-Übergangsbereich von 633,01 € bis 2.000 € im Monat. Die Obergrenze bleibt gleich, die Untergrenze steigt mit der Minijob-Grenze von 603 € auf 633 €. Diese folgt automatisch dem Mindestlohn, der zum 1. Januar 2027 per Verordnung auf 14,60 € steigt (14,60 € × 130 ÷ 3 = 632,67 €, aufgerundet 633 €). Beide Grenzen stehen damit fest.",
  },
  {
    q: "Was ändert sich beim Midijob 2027?",
    a: "Zwei Dinge. Erstens: Wer zwischen 603,01 € und 633 € verdient, ist 2027 kein Midijobber mehr, sondern Minijobber — und damit über diesen Job nicht mehr selbst kranken-, pflege- und arbeitslosenversichert. Zweitens: Weil der Übergangsbereich jetzt höher beginnt, sinkt die beitragspflichtige Einnahme bei gleichem Brutto etwas; bei 1.200 € etwa von 854,69 € auf 829,55 €. Allein dadurch zahlen Midijobber 2027 bei gleichem Lohn etwas weniger Sozialabgaben. Wie viel am Ende bleibt, hängt aber auch an den Beitragssätzen 2027 — die stehen noch nicht alle fest.",
  },
  {
    q: "Was ist ein Midijob 2026?",
    a: "Ein Midijob ist eine Beschäftigung im sogenannten Übergangsbereich (früher Gleitzone). 2026 umfasst er Monatsentgelte von 603,01 € bis 2.000 €. In diesem Bereich zahlen Arbeitnehmer reduzierte Sozialversicherungsbeiträge, sind aber voll sozialversichert (Kranken-, Pflege-, Renten- und Arbeitslosenversicherung).",
  },
  {
    q: "Wie werden die Beiträge im Midijob berechnet?",
    a: "Die Arbeitnehmerbeiträge werden nicht vom vollen Bruttolohn, sondern von einer reduzierten „beitragspflichtigen Einnahme“ berechnet. Diese wird über den amtlichen Faktor F (2026: 0,6619) und zwei lineare Formeln ermittelt. An der Untergrenze (603,01 €) ist der Eigenanteil am geringsten und steigt bis 2.000 € gleitend auf den vollen Beitragssatz an.",
  },
  {
    q: "Was ist der Unterschied zwischen Minijob und Midijob?",
    a: "Ein Minijob (bis 603 € im Jahr 2026) ist für Arbeitnehmer weitgehend abgabenfrei — es fällt nur der Renten­versicherungs-Eigenanteil von 3,6 % an, von dem man sich befreien lassen kann. Ein Midijob (603,01 € bis 2.000 €) ist voll sozialversicherungspflichtig, jedoch mit reduzierten, gleitend ansteigenden Arbeitnehmerbeiträgen.",
  },
  {
    q: "Bekomme ich im Midijob trotz reduzierter Beiträge die volle Rente?",
    a: "Ja. Seit 2019 wird der Rentenanspruch aus dem vollen Bruttoentgelt berechnet, obwohl Sie nur reduzierte Beiträge zahlen. Ein Midijob mindert Ihre spätere Rente also nicht — anders als früher in der alten Gleitzonenregelung.",
  },
  {
    q: "Was passiert bei mehr als 2.000 € im Monat?",
    a: "Ab einem Monatsentgelt von 2.000,01 € endet der Übergangsbereich. Dann gelten die regulären, vollen Sozialversicherungsbeiträge auf das gesamte Bruttoentgelt. Für die genaue Berechnung nutzen Sie den Gehaltsrechner.",
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
    { "@type": "ListItem", position: 2, name: "Midijob-Rechner", item: "https://bruttonettocalculator.com/midijob-rechner" },
  ],
};
const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "Midijob-Rechner 2026/2027 Deutschland",
  url: "https://bruttonettocalculator.com/midijob-rechner",
  description:
    "Kostenloser Midijob-Rechner — Nettogehalt im Übergangsbereich (2026: 603,01–2.000 €, 2027: 633,01–2.000 €) mit reduzierten Sozialabgaben nach § 20 Abs. 2a SGB IV berechnen.",
};

export default function MidijobRechnerPage() {
  const rows = MIDIJOB_STUFEN.map((brutto) => {
    const res = calculateNetto({
      bruttoMonat: brutto,
      jahr: 2026,
      verheiratet: false,
      kinderlosUeber23: true,
      kirche: false,
      steuerklasse: 1,
    });
    const anBemessung = Math.max(0, midijobArbeitnehmerBemessungMonat(brutto));
    return {
      brutto,
      anBemessung,
      netto: res.nettoMonat,
      quote: brutto > 0 ? (res.nettoMonat / brutto) * 100 : 0,
    };
  });

  // 2026 ↔ 2027 bei gleichem Brutto. Isoliert den Effekt der neuen Untergrenze:
  // Die SV-Sätze 2027 stehen noch nicht fest, die Engine rechnet 2027 mit den
  // amtlichen Sätzen 2026. Bis 633 € ist man 2027 Minijobber — dort fällt nur
  // der (befreibare) RV-Eigenanteil von 3,6 % an, keine Engine-Rechnung.
  const svAn = (brutto: number, jahr: 2026 | 2027) =>
    calculateNetto({ bruttoMonat: brutto, jahr, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 }).sv
      .summeMonat;
  const vergleich = VERGLEICH_STUFEN.map((brutto) => {
    const minijob2027 = brutto <= UEBERGANGSBEREICH_2027.untergrenze;
    const be2026 = isMidijob(brutto, 2026) ? Math.max(0, midijobArbeitnehmerBemessungMonat(brutto, 2026)) : brutto;
    const be2027 = minijob2027
      ? null
      : isMidijob(brutto, 2027)
        ? Math.max(0, midijobArbeitnehmerBemessungMonat(brutto, 2027))
        : brutto;
    const sv2026 = svAn(brutto, 2026);
    const sv2027 = minijob2027 ? brutto * 0.036 : svAn(brutto, 2027);
    return { brutto, minijob2027, be2026, be2027, sv2026, sv2027, diff: sv2027 - sv2026 };
  });
  const at1200 = vergleich.find((v) => v.brutto === 1200)!;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-16 pb-24 text-[#16181D]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-4 sm:mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Midijob-Rechner</span>
      </div>

      <div className="mb-6 sm:mb-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-5">
          <Wallet2 size={14} /> Übergangsbereich · 2026 ab 603,01 € · 2027 ab 633,01 €
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3 sm:mb-5 max-w-4xl">
          <span className="text-gradient-accent">Midijob-Rechner</span> 2026/2027: Netto im Übergangsbereich
        </h1>
        <p className="text-base sm:text-xl text-black/80 max-w-3xl leading-relaxed mb-2 sm:mb-6">
          Mit dem <strong className="text-[#16181D]">Midijob-Rechner</strong> berechnen Sie Ihr Nettogehalt im
          Übergangsbereich (<strong className="text-[#16181D]">603,01 € bis 2.000 €</strong> im Monat). Hier zahlen Sie
          <strong className="text-[#16181D]"> reduzierte Sozialabgaben</strong>, bleiben aber voll versichert und behalten
          den vollen Rentenanspruch. Ab dem 1. Januar 2027 beginnt der Übergangsbereich erst bei{" "}
          <strong className="text-[#16181D]">633,01 €</strong> — im Rechner können Sie auf 2027 umschalten.
        </p>
      </div>

      <section id="rechner" className="mb-14 scroll-mt-24">
        <Calculator initialBrutto={1200} deepLink={false} />
      </section>

      {/* Answer-first quotable box */}
      <section data-section="" className="mb-16 bg-[#E60A1C]/[0.05] border border-[#E60A1C]/25 rounded-3xl p-6 sm:p-8 flex items-start gap-4">
        <Info size={22} className="text-[#E60A1C] flex-shrink-0 mt-1" />
        <p className="text-sm sm:text-base text-black/80 leading-relaxed">
          <strong className="text-[#16181D]">Kurz erklärt:</strong> Im Midijob-Übergangsbereich 2026
          (<strong className="text-[#16181D]">603,01 €–2.000 €</strong>) werden Ihre Arbeitnehmer-Sozialbeiträge nicht
          vom vollen Brutto, sondern von einer reduzierten <em>beitragspflichtigen Einnahme</em> berechnet
          (Faktor F {String(UEBERGANGSBEREICH_2026.faktorF).replace(".", ",")}). Dadurch bleibt netto mehr übrig als bei
          voller Beitragslast — den Differenzbetrag trägt der Arbeitgeber, Ihr Rentenanspruch bleibt voll erhalten.
        </p>
      </section>

      <section data-section="" className="mb-16">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-[#E60A1C]/10 border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-2">
            <BarChart3 size={13} /> Midijob-Tabelle 2026
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">
            Netto im Übergangsbereich (Steuerklasse I, 2026)
          </h2>
          <p className="text-sm sm:text-base text-black/70 mt-1">
            Die reduzierte Bemessungsgrundlage ist die Basis für Ihre Arbeitnehmerbeiträge — sie liegt unter dem
            Bruttolohn und steigt bis 2.000 € gleitend an.
          </p>
        </div>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Brutto / Monat</th>
                <th className="py-4 px-5 text-right">Beitragspfl. Einnahme (AN)</th>
                <th className="py-4 px-5 text-right text-[#16181D] font-bold">Netto / Monat</th>
                <th className="py-4 px-5 text-right">Netto-Quote</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {rows.map((r) => (
                <tr key={r.brutto} className={`hover:bg-black/[0.04] transition-colors ${r.brutto === UEBERGANGSBEREICH_2026.obergrenze ? "bg-[#E60A1C]/5 font-semibold" : ""}`}>
                  <td className="py-4 px-5 font-bold text-[#16181D]">
                    {formatEUR(r.brutto)}
                    {r.brutto === UEBERGANGSBEREICH_2026.obergrenze && (
                      <span className="text-xs font-normal text-black/50"> (Obergrenze)</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right font-mono text-black/80">{formatEUR(r.anBemessung)}</td>
                  <td className="py-4 px-5 text-right font-mono text-[#16181D] font-bold bg-black/[0.04]">{formatEUR(r.netto)}</td>
                  <td className="py-4 px-5 text-right font-mono text-emerald-600">{r.quote.toFixed(1).replace(".", ",")} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/45 mt-3">
          Vereinfachte Berechnung (Steuerklasse I, kinderlos, ohne Kirchensteuer) nach § 32a EStG und § 20 Abs. 2a SGB IV,
          Stand 2026. Keine Steuer- oder Sozialversicherungsberatung.
        </p>
      </section>

      <section data-section="" className="mb-16">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-[#E60A1C]/10 border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-2">
            <BarChart3 size={13} /> Midijob 2027
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">
            Midijob 2027: Übergangsbereich ab 633,01 €
          </h2>
          <p className="text-sm sm:text-base text-black/70 mt-2 leading-relaxed">
            Zum 1. Januar 2027 steigt die Minijob-Grenze mit dem Mindestlohn (14,60 €) auf 633 € — und damit die
            Untergrenze des Übergangsbereichs. Die Obergrenze bleibt bei 2.000 €. Zwei Folgen: Wer bisher knapp
            über 603 € verdient hat, wird 2027 zum{" "}
            <Link href="/minijob-rechner" className="text-[#E60A1C] font-semibold hover:underline">Minijobber</Link>.
            Und weil der Bereich höher beginnt, sinkt die beitragspflichtige Einnahme bei gleichem Brutto — bei{" "}
            {formatEUR(1200)} von {formatEUR(at1200.be2026)} auf {formatEUR(at1200.be2027 ?? 0)}.
          </p>
        </div>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-4">Brutto / Monat</th>
                <th className="py-4 px-4 text-right">Beitragspfl. Einnahme 2026</th>
                <th className="py-4 px-4 text-right">Beitragspfl. Einnahme 2027</th>
                <th className="py-4 px-4 text-right">SV-Abzug 2026</th>
                <th className="py-4 px-4 text-right">SV-Abzug 2027*</th>
                <th className="py-4 px-4 text-right">Differenz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {vergleich.map((v) => (
                <tr key={v.brutto} className="hover:bg-black/[0.04] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#16181D]">{formatEUR(v.brutto)}</td>
                  <td className="py-3 px-4 text-right font-mono text-black/80">{formatEUR(v.be2026)}</td>
                  <td className="py-3 px-4 text-right font-mono text-black/80">
                    {v.be2027 === null ? <span className="text-black/55">Minijob</span> : formatEUR(v.be2027)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">{formatEUR(v.sv2026)}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#16181D]">
                    {formatEUR(v.sv2027)}
                    {v.minijob2027 && <span className="block text-xs font-normal text-black/50">nur RV 3,6 %</span>}
                  </td>
                  <td className={`py-3 px-4 text-right font-mono ${v.diff < 0 ? "text-emerald-600" : "text-[#E60A1C]"}`}>
                    {v.diff > 0 ? "+" : ""}
                    {formatEUR(v.diff)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/45 mt-3 leading-relaxed">
          Arbeitnehmer-Sozialabgaben pro Monat, kinderlos, durchschnittlicher Zusatzbeitrag. * Die Grenzen 2027 stehen
          fest, die Beitragssätze 2027 noch nicht — beide Spalten rechnen deshalb mit den amtlichen Sätzen 2026 und
          zeigen allein den Effekt der neuen Untergrenze. Bis 633 € ist man 2027 Minijobber: kein eigener Kranken-,
          Pflege- und Arbeitslosenschutz über den Job, nur der befreibare Rentenversicherungs-Eigenanteil.
        </p>
      </section>

      <section data-section="" className="mb-16 bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-5 sm:p-10 text-black/75 text-sm sm:text-base leading-relaxed space-y-5">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">Midijob 2026: Was Sie wissen sollten</h2>
        <p>
          Ein <strong className="text-[#16181D]">Midijob</strong> liegt im sogenannten Übergangsbereich zwischen dem
          <Link href="/minijob-rechner" className="text-[#E60A1C] font-semibold hover:underline"> Minijob (bis 603 €)</Link> und
          der regulären sozialversicherungspflichtigen Beschäftigung. 2026 reicht er von
          <strong className="text-[#16181D]"> 603,01 € bis 2.000 €</strong> Monatsentgelt. Anders als beim Minijob sind Sie
          im Midijob voll kranken-, pflege-, renten- und arbeitslosenversichert.
        </p>
        <p>
          Der Vorteil: Ihre <strong className="text-[#16181D]">Arbeitnehmerbeiträge werden reduziert</strong>. Grundlage ist
          nicht das volle Brutto, sondern eine niedrigere beitragspflichtige Einnahme, die über den amtlichen
          <strong className="text-[#16181D]"> Faktor F (2026: 0,6619)</strong> ermittelt wird. An der Untergrenze zahlen Sie
          am wenigsten; bis 2.000 € steigt Ihr Beitragsanteil gleitend auf den vollen Satz. Den Differenzbetrag übernimmt
          Ihr Arbeitgeber.
        </p>
        <p>
          Wichtig für die Altersvorsorge: Trotz reduzierter Beiträge wird Ihr{" "}
          <Link href="/rentenrechner" className="text-[#E60A1C] font-semibold hover:underline">Rentenanspruch</Link> aus dem
          vollen Bruttoentgelt berechnet. Für Gehälter oberhalb von 2.000 € gilt die reguläre Berechnung — nutzen Sie dafür
          den <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Gehaltsrechner</Link> oder
          den <Link href="/teilzeitrechner" className="text-[#E60A1C] font-semibold hover:underline">Teilzeitrechner</Link>.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-8 text-center flex items-center justify-center gap-2">
          <Sparkles className="text-[#E60A1C]" size={22} /> Häufige Fragen zum Midijob
        </h2>
        <AccordionFaq faqs={faqs} />
      </section>
      <ToolContent config={TOOL_CONTENT["/midijob-rechner"]} />
    </div>
  );
}
