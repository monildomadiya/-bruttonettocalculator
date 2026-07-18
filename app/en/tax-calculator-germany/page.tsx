import type { Metadata } from "next";
import Link from "next/link";
import { Calculator as CalcIcon, ChevronRight, Globe, BarChart3 } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import Calculator from "@/components/Calculator";
import AccordionFaq from "@/components/AccordionFaq";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Germany Salary Calculator 2026 – Gross to Net",
  description:
    "Free Germany salary calculator 2026: work out your net salary from gross — income tax, solidarity surcharge and social security contributions for all 6 tax classes. English gross-to-net calculator, no sign-up.",
  keywords: [
    "salary calculator germany",
    "germany salary calculator",
    "tax calculator germany",
    "german tax calculator",
    "germany gross to net calculator",
    "gross net calculator germany",
    "net salary germany",
    "income tax germany calculator",
    "brutto netto calculator english",
  ],
  alternates: {
    canonical: "https://bruttonettocalculator.com/en/tax-calculator-germany",
    languages: {
      "de-DE": "https://bruttonettocalculator.com/",
      "en-DE": "https://bruttonettocalculator.com/en/tax-calculator-germany",
      "pl-DE": "https://bruttonettocalculator.com/pl/kalkulator-brutto-netto-niemcy",
      "x-default": "https://bruttonettocalculator.com/",
    },
  },
  openGraph: {
    title: "Germany Salary Calculator 2026 – Gross to Net",
    description:
      "Work out your net salary in Germany from gross — income tax, solidarity surcharge and social security for all 6 tax classes. Free English calculator.",
    url: "https://bruttonettocalculator.com/en/tax-calculator-germany",
    locale: "en_US",
    type: "website",
    siteName: "BruttoNettoCalculator.com",
  },
};

const REFERENCE = [2500, 3000, 4000, 5000, 6000];
const TAX_CLASS_LABEL: Record<number, string> = {
  1: "Class I — Single",
  3: "Class III — Married (main earner)",
};

const faqs = [
  {
    q: "How is net salary calculated in Germany?",
    a: "From your gross salary, social security contributions are deducted first (pension 9.3%, health ~8.7%, long-term care 1.8–2.4%, unemployment 1.3% — employee shares). Income tax (Lohnsteuer) is then calculated on the remaining taxable income under § 32a EStG, plus the solidarity surcharge and, if applicable, church tax. What remains is your net salary (Netto).",
  },
  {
    q: "What are the German tax classes (Steuerklassen)?",
    a: "Germany has six tax classes: I (single), II (single parent), III (married, higher earner), IV (married, equal earners), V (married, lower earner) and VI (second job). Your tax class determines how much wage tax is withheld each month. Class III has the lowest deductions, class VI the highest.",
  },
  {
    q: "What is the tax-free allowance in Germany for 2026?",
    a: "The basic tax-free allowance (Grundfreibetrag) is €12,348 for single people and €24,696 for jointly assessed couples in 2026. Income up to this amount is not subject to income tax.",
  },
  {
    q: "Is this German salary calculator free?",
    a: "Yes. The calculator is completely free, requires no registration and stores no personal data. All calculations run in your browser using the official German figures for 2026.",
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
    { "@type": "ListItem", position: 1, name: "Home", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Germany Tax Calculator", item: "https://bruttonettocalculator.com/en/tax-calculator-germany" },
  ],
};
const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  name: "Germany Tax Calculator 2026",
  url: "https://bruttonettocalculator.com/en/tax-calculator-germany",
  inLanguage: "en",
  description: "Free German gross-to-net salary and income tax calculator for 2026 (§ 32a EStG), all 6 tax classes.",
};

export default function GermanyTaxCalculatorPage() {
  const rows = REFERENCE.map((brutto) => {
    const c1 = calculateNetto({ bruttoMonat: brutto, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 });
    const c3 = calculateNetto({ bruttoMonat: brutto, jahr: 2026, verheiratet: true, kinderlosUeber23: true, kirche: false, steuerklasse: 3 });
    return { brutto, net1: c1.nettoMonat, net3: c3.nettoMonat };
  });

  return (
    <main lang="en" className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-24 text-[#16181D]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Home</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Germany Tax Calculator</span>
      </div>

      <div className="mb-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-5">
          <Globe size={14} /> Germany · Tax year 2026 · English
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-5 max-w-4xl">
          Salary <span className="text-gradient-accent">Calculator</span> Germany 2026
        </h1>
        <p className="text-lg sm:text-xl text-black/80 max-w-3xl leading-relaxed mb-4">
          Work out your <strong className="text-[#16181D]">net salary</strong> in Germany from your gross pay. This free{" "}
          <strong className="text-[#16181D]">German tax calculator</strong> covers income tax (Lohnsteuer), the
          solidarity surcharge, church tax and all social security contributions — for all six tax classes, updated for 2026.
        </p>
        <p className="text-sm text-black/55 max-w-2xl">
          Prefer German? Use the <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner</Link>.
        </p>
      </div>

      {/* Ad — right below the hero, above the calculator */}
      <AdUnit placement="content" className="!my-0 !mb-10 !px-0" />

      <section id="calculator" className="mb-14 scroll-mt-24">
        <Calculator initialBrutto={3500} lang="en" deepLink={false} />
      </section>

      <AdUnit placement="content" className="!my-0 !mb-14 !px-0" />

      <section className="mb-16">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-[#E60A1C]/10 border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-2">
            <BarChart3 size={13} /> Gross to net · 2026
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D]">
            Net salary examples (per month)
          </h2>
          <p className="text-sm sm:text-base text-black/70 mt-1">
            Approximate monthly net pay in Germany for 2026 (no church tax).
          </p>
        </div>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Gross / month</th>
                <th className="py-4 px-5 text-right">{TAX_CLASS_LABEL[1]}</th>
                <th className="py-4 px-5 text-right">{TAX_CLASS_LABEL[3]}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {rows.map((r) => (
                <tr key={r.brutto} className="hover:bg-black/[0.04] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#16181D] font-mono">{formatEUR(r.brutto)}</td>
                  <td className="py-4 px-5 text-right font-mono text-[#16181D] font-semibold">{formatEUR(r.net1)}</td>
                  <td className="py-4 px-5 text-right font-mono text-emerald-600 font-semibold">{formatEUR(r.net3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-16 bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/75 text-sm sm:text-base leading-relaxed space-y-5">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D]">How income tax works in Germany</h2>
        <p>
          Germany uses a <strong className="text-[#16181D]">progressive income tax</strong> system defined by § 32a of
          the Income Tax Act (EStG). Earnings up to the basic allowance of €12,348 (2026) are tax-free. Above that, the
          marginal rate rises from 14% to a top rate of 42% (from €69,879 of taxable income) and 45% for very high
          incomes (from €277,826).
        </p>
        <p>
          Employees also pay <strong className="text-[#16181D]">social security contributions</strong>: pension
          insurance, health insurance, long-term care insurance and unemployment insurance. Employers pay roughly the
          same amount on top. The calculator above accounts for all of these using the official 2026 figures.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8 text-center flex items-center justify-center gap-2">
          <CalcIcon className="text-[#E60A1C]" size={22} /> Frequently asked questions
        </h2>
        <AccordionFaq faqs={faqs} />
      </section>
    </main>
  );
}
