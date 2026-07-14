import type { Metadata } from "next";
import Link from "next/link";
import { Receipt, ChevronRight, Sparkles, Percent } from "lucide-react";
import { calculateNetto, formatEUR, Steuerklasse } from "@/lib/taxCalculator";
import Calculator from "@/components/Calculator";
import AccordionFaq from "@/components/AccordionFaq";
import ReviewerByline from "@/components/ReviewerByline";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Lohnsteuerrechner 2026 — Lohnsteuer & Nettolohn berechnen (kostenlos)",
  description:
    "Lohnsteuerrechner 2026/2027: Lohnsteuer, Solidaritätszuschlag und Nettolohn aus dem Bruttolohn berechnen. Kostenloser Lohnrechner & Nettolohnrechner für alle 6 Steuerklassen — ohne Anmeldung.",
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
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/lohnsteuerrechner" },
  openGraph: {
    title: "Lohnsteuerrechner 2026 — Lohnsteuer & Nettolohn berechnen",
    description:
      "Lohnsteuer, Soli & Nettolohn aus dem Bruttolohn berechnen — kostenloser Lohnrechner & Nettolohnrechner für 2026 & 2027, alle 6 Steuerklassen.",
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

const faqs = [
  {
    q: "Was ist die Lohnsteuer?",
    a: "Die Lohnsteuer ist eine Erhebungsform der Einkommensteuer, die der Arbeitgeber direkt vom Bruttolohn einbehält und ans Finanzamt abführt. Ihre Höhe richtet sich nach dem zu versteuernden Einkommen, der Steuerklasse und dem Tarif nach § 32a EStG. Der Lohnsteuerrechner ermittelt sie automatisch für 2026 und 2027.",
  },
  {
    q: "Wie berechnet der Lohnsteuerrechner den Nettolohn?",
    a: "Der Nettolohnrechner zieht vom Bruttolohn zuerst die Sozialversicherungsbeiträge ab, ermittelt daraus das zu versteuernde Einkommen und berechnet die Lohnsteuer nach dem amtlichen Tarif. Nach Abzug von Lohnsteuer, Solidaritätszuschlag und ggf. Kirchensteuer bleibt der Nettolohn übrig.",
  },
  {
    q: "Wann fällt der Solidaritätszuschlag an?",
    a: "Der Solidaritätszuschlag (5,5 % der Lohnsteuer) wird 2026 erst oberhalb einer Freigrenze von 19.950 € Jahres-Lohnsteuer (Einzelveranlagung) fällig und steigt in einer Milderungszone langsam an. Die allermeisten Arbeitnehmer zahlen daher keinen Soli mehr.",
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
  "@type": "WebApplication",
  name: "Lohnsteuerrechner 2026 Deutschland",
  url: "https://bruttonettocalculator.com/lohnsteuerrechner",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  description: "Kostenloser Lohnsteuerrechner & Nettolohnrechner — Lohnsteuer, Soli und Nettolohn aus dem Bruttolohn berechnen (§ 32a EStG 2026).",
};

export default function LohnsteuerrechnerPage() {
  const rows = ([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => {
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
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-24 text-[#16181D]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Lohnsteuerrechner</span>
      </div>

      <div className="mb-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-5">
          <Receipt size={14} /> Lohnsteuer · Nettolohn · 2026/2027
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-5 max-w-4xl">
          <span className="text-gradient-accent">Lohnsteuerrechner</span> 2026: Lohnsteuer & Nettolohn berechnen
        </h1>
        <p className="text-lg sm:text-xl text-black/80 max-w-3xl leading-relaxed mb-6">
          Der kostenlose <strong className="text-[#16181D]">Lohnsteuerrechner</strong> zeigt Ihnen, wie viel{" "}
          <strong className="text-[#16181D]">Lohnsteuer</strong>, Solidaritätszuschlag und Sozialabgaben von Ihrem
          Bruttolohn abgehen — und welcher <strong className="text-[#16181D]">Nettolohn</strong> übrig bleibt. Nutzen Sie
          ihn auch als <strong className="text-[#16181D]">Lohnrechner</strong> und <strong className="text-[#16181D]">Nettolohnrechner</strong>{" "}
          für 2026 und 2027 — in allen 6 Steuerklassen.
        </p>
        <ReviewerByline />
      </div>

      <section id="rechner" className="mb-14 scroll-mt-24">
        <Calculator initialBrutto={REF_BRUTTO} />
      </section>

      <AdUnit placement="content" className="!my-0 !mb-14 !px-0" />

      {/* Lohnsteuer breakdown per Steuerklasse */}
      <section className="mb-16">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-[#E60A1C]/10 border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-2">
            <Percent size={13} /> Lohnsteuer-Vergleich
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D]">
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
      <section className="mb-16 bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/75 text-sm sm:text-base leading-relaxed space-y-5">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D]">
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
        <p>
          Möchten Sie umgekehrt vom Netto auf das Brutto rechnen — etwa für eine Gehaltsverhandlung? Nutzen Sie unseren{" "}
          <Link href="/rechner/netto-zu-brutto" className="text-[#E60A1C] font-semibold hover:underline">Netto-zu-Brutto-Rechner</Link>.
          Für die jährliche Steuerlast steht Ihnen der{" "}
          <Link href="/einkommensteuer-rechner" className="text-[#E60A1C] font-semibold hover:underline">Einkommensteuer-Rechner</Link> zur Verfügung.
        </p>
      </section>

      {/* Related */}
      <section className="mb-16">
        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
          <Sparkles className="text-[#E60A1C]" size={20} /> Weitere Rechner
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8 text-center">
          Häufige Fragen zur Lohnsteuer
        </h2>
        <AccordionFaq faqs={faqs} />
      </section>
    </main>
  );
}
