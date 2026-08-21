import type { Metadata } from "next";
import Link from "next/link";
import { Calculator as CalcIcon, ChevronRight, Globe, BarChart3, HeartPulse, Layers, ArrowRight } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import {
  GUENSTIGSTE_KASSE,
  TEUERSTE_KASSE,
  DURCHSCHNITT_ZUSATZBEITRAG_2026,
  ALLGEMEINER_BEITRAGSSATZ,
} from "@/data/krankenkassen";
import Calculator from "@/components/Calculator";
import AccordionFaq from "@/components/AccordionFaq";

/**
 * English landing page for the German gross-to-net calculator.
 *
 * Targets English speakers working in Germany, who search a mix of English
 * ("salary calculator germany", "german tax calculator") and borrowed German
 * ("brutto netto calculator", "brutto netto meaning", "brutto netto in
 * english") terms. The page previously led with "Salary Calculator Germany"
 * and used the phrase "brutto netto" nowhere in its title or headings — even
 * though the domain is literally bruttonettocalculator.com, which is an exact
 * match for that query family. Title, H1 and the section structure now cover
 * both vocabularies.
 */

const BASE = "https://bruttonettocalculator.com";
const CANONICAL = `${BASE}/en/tax-calculator-germany`;

export const metadata: Metadata = {
  title: "Brutto Netto Calculator Germany 2026 – Gross to Net Salary",
  description:
    "Free brutto netto calculator for Germany 2026: turn your gross salary into net pay — income tax, solidarity surcharge, health, pension and care contributions for all 6 tax classes.",
  keywords: [
    "brutto netto calculator",
    "brutto netto calculator english",
    "brutto netto meaning",
    "salary calculator germany",
    "german tax calculator",
    "germany gross to net calculator",
    "gross net calculator germany",
    "net salary germany",
    "income tax germany calculator",
  ],
  alternates: {
    canonical: CANONICAL,
    languages: {
      "de-DE": `${BASE}/`,
      "en-DE": CANONICAL,
      "pl-DE": `${BASE}/pl/kalkulator-brutto-netto-niemcy`,
      "x-default": `${BASE}/`,
    },
  },
  openGraph: {
    images: [`${BASE}/og-image.png`],
    title: "Brutto Netto Calculator Germany 2026 – Gross to Net Salary",
    description:
      "Turn gross into net pay in Germany — income tax, solidarity surcharge and all social security contributions, for all six tax classes. Free, in English.",
    url: CANONICAL,
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

/* ── Official 2026 figures (same constants the engine uses) ───────────── */
const GRUNDFREIBETRAG = 12348;
const SOLI_THRESHOLD = 20350;
const BBG_KV_PV = 69750;
const BBG_RV_ALV = 101400;

const CONTRIBUTIONS = [
  { name: "Pension insurance", german: "Rentenversicherung", total: "18.6%", employee: "9.3%", ceiling: BBG_RV_ALV },
  { name: "Health insurance", german: "Krankenversicherung", total: "14.6% + supplement", employee: "≈ 8.75%", ceiling: BBG_KV_PV },
  { name: "Long-term care", german: "Pflegeversicherung", total: "3.6%", employee: "1.8%", ceiling: BBG_KV_PV },
  { name: "Unemployment", german: "Arbeitslosenversicherung", total: "2.6%", employee: "1.3%", ceiling: BBG_RV_ALV },
];

const faqs = [
  {
    q: "What does brutto netto mean in English?",
    a: "Brutto is German for gross — your salary before any deductions, and the figure written in your employment contract. Netto is net — the amount that actually lands in your bank account after income tax, the solidarity surcharge, any church tax and your share of social security contributions have been taken off. A brutto netto calculator converts one into the other.",
  },
  {
    q: "How is net salary calculated in Germany?",
    a: "From your gross salary, social security contributions are deducted first (pension 9.3%, health approximately 8.75%, long-term care 1.8% or 2.4% if you are over 23 and have no children, unemployment 1.3% — these are the employee shares). Income tax (Lohnsteuer) is then calculated on the remaining taxable income under § 32a EStG, plus the solidarity surcharge and, if applicable, church tax. What remains is your net salary.",
  },
  {
    q: "What are the German tax classes (Steuerklassen)?",
    a: "Germany has six tax classes: I (single), II (single parent), III (married, higher earner), IV (married, equal earners), V (married, lower earner) and VI (second job). Your tax class determines how much wage tax is withheld each month. Class III has the lowest deductions, class VI the highest. The class only affects monthly withholding — your final tax liability is settled in the annual tax return.",
  },
  {
    q: "What is the tax-free allowance in Germany for 2026?",
    a: `The basic tax-free allowance (Grundfreibetrag) is €${GRUNDFREIBETRAG.toLocaleString("en-US")} for single people and €${(GRUNDFREIBETRAG * 2).toLocaleString("en-US")} for jointly assessed couples in 2026. Income up to this amount is not subject to income tax.`,
  },
  {
    q: "How much is health insurance in Germany?",
    a: `The general contribution rate is ${ALLGEMEINER_BEITRAGSSATZ.toString().replace(".", ".")}% and is identical at every statutory health insurer. What differs is the supplementary rate (Zusatzbeitrag) each fund sets itself: in 2026 it ranges from ${GUENSTIGSTE_KASSE.zusatzbeitrag.toFixed(2)}% (${GUENSTIGSTE_KASSE.name}) to ${TEUERSTE_KASSE.zusatzbeitrag.toFixed(2)}% (${TEUERSTE_KASSE.name}), against an official average of ${DURCHSCHNITT_ZUSATZBEITRAG_2026.toFixed(1)}%. Employer and employee split both rates equally, so switching to a cheaper fund can be worth several hundred euros of net pay a year.`,
  },
  {
    q: "Do I have to pay church tax in Germany?",
    a: "Only if you are a registered member of a church that collects it (mainly Catholic and Protestant). It costs 8% of your income tax in Bavaria and Baden-Württemberg and 9% everywhere else. If you are not a member, you pay nothing — but note that registering your religion when you register your address (Anmeldung) is what triggers it.",
  },
  {
    q: "What is the solidarity surcharge (Solidaritätszuschlag)?",
    a: `A 5.5% surcharge on your income tax. Since 2021 it only applies to higher incomes: in 2026 it starts once your annual income tax exceeds €${SOLI_THRESHOLD.toLocaleString("en-US")} for single filers (€${(SOLI_THRESHOLD * 2).toLocaleString("en-US")} jointly), and it phases in gradually above that threshold. Roughly 90% of taxpayers no longer pay it at all.`,
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
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    { "@type": "ListItem", position: 2, name: "Brutto Netto Calculator (English)", item: CANONICAL },
  ],
};
const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  isPartOf: { "@id": `${BASE}/#website` },
  name: "Brutto Netto Calculator Germany 2026",
  url: CANONICAL,
  inLanguage: "en",
  description: "Free German gross-to-net (brutto netto) salary and income tax calculator for 2026 (§ 32a EStG), all 6 tax classes.",
};

export default function GermanyTaxCalculatorPage() {
  const rows = REFERENCE.map((brutto) => {
    const c1 = calculateNetto({ bruttoMonat: brutto, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 });
    const c3 = calculateNetto({ bruttoMonat: brutto, jahr: 2026, verheiratet: true, kinderlosUeber23: true, kirche: false, steuerklasse: 3 });
    return { brutto, net1: c1.nettoMonat, net3: c3.nettoMonat };
  });

  // Worked example for the "what actually comes off" section — engine-computed
  // so it can never drift from the calculator above it.
  const example = calculateNetto({
    bruttoMonat: 4000,
    jahr: 2026,
    verheiratet: false,
    kinderlosUeber23: true,
    kirche: false,
    steuerklasse: 1,
  });

  return (
    <main lang="en" className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-24 text-[#16181D]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Home</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Brutto Netto Calculator (English)</span>
      </div>

      <div className="mb-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-5">
          <Globe size={14} /> Germany · Tax year 2026 · English
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-5 max-w-4xl">
          Brutto Netto <span className="text-gradient-accent">Calculator</span> Germany 2026
        </h1>
        <p className="text-lg sm:text-xl text-black/80 max-w-3xl leading-relaxed mb-4">
          Turn your <strong className="text-[#16181D]">gross salary (Brutto)</strong> into{" "}
          <strong className="text-[#16181D]">net pay (Netto)</strong>. This free German tax calculator covers income
          tax (Lohnsteuer), the solidarity surcharge, church tax and every social security contribution — for all six
          tax classes, updated for 2026.
        </p>
        <p className="text-sm text-black/55 max-w-2xl">
          Prefer German? Use the <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner</Link>.
        </p>
      </div>

      <section id="calculator" className="mb-14 scroll-mt-24">
        <Calculator initialBrutto={3500} lang="en" deepLink={false} />
      </section>

      {/* ── Brutto vs Netto — the "what does it mean" query ─────────────── */}
      <section className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
          Brutto vs. Netto — what the two words mean
        </h2>
        <p className="text-sm sm:text-base text-black/75 leading-relaxed max-w-3xl mb-6">
          <strong className="text-[#16181D]">Brutto</strong> is the German word for <em>gross</em> — the salary written
          in your employment contract, before anything is taken off.{" "}
          <strong className="text-[#16181D]">Netto</strong> is <em>net</em> — what actually reaches your bank account.
          The gap between them in Germany is large, typically 35–45% of gross for a single employee, because both taxes
          and social security come out of the same pay slip.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: "Brutto (gross)", value: formatEUR(example.bruttoMonat), note: "your contract figure" },
            { label: "Deductions", value: `− ${formatEUR(example.sv.summeMonat + example.steuer.summeMonat)}`, note: "tax + social security" },
            { label: "Netto (net)", value: formatEUR(example.nettoMonat), note: "paid into your account" },
          ].map((c) => (
            <div key={c.label} className="bg-white border border-black/[0.08] rounded-2xl p-5 shadow-sm">
              <div className="text-[10px] font-mono uppercase tracking-widest text-black/45 mb-1.5">{c.label}</div>
              <div className="text-2xl font-extrabold text-[#16181D] tabular-nums">{c.value}</div>
              <div className="text-xs text-black/50 mt-1">{c.note}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-black/45 mt-3">
          Example: €4,000 gross per month, tax class I, no church tax, no children — calculated with the engine above.
        </p>
      </section>

      {/* ── What comes off ──────────────────────────────────────────────── */}
      <section className="mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-[#E60A1C]/10 border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-2">
          <Layers size={13} /> Social security · 2026
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
          What is deducted from your gross salary
        </h2>
        <p className="text-sm sm:text-base text-black/75 leading-relaxed max-w-3xl mb-6">
          Social security is split between you and your employer. Your employer pays roughly the same amount again on
          top of your gross salary. Contributions are only charged up to a ceiling — earn above it and the contribution
          stops growing.
        </p>
        <div className="bg-white border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Contribution</th>
                <th className="py-4 px-5">German name</th>
                <th className="py-4 px-5 text-right">Total rate</th>
                <th className="py-4 px-5 text-right">Your share</th>
                <th className="py-4 px-5 text-right">Ceiling / year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm">
              {CONTRIBUTIONS.map((c) => (
                <tr key={c.name} className="hover:bg-black/[0.03] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#16181D]">{c.name}</td>
                  <td className="py-4 px-5 text-black/60 italic">{c.german}</td>
                  <td className="py-4 px-5 text-right font-mono text-black/80">{c.total}</td>
                  <td className="py-4 px-5 text-right font-mono font-semibold text-[#16181D]">{c.employee}</td>
                  <td className="py-4 px-5 text-right font-mono text-black/60">
                    €{c.ceiling.toLocaleString("en-US")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-black/60 mt-4 max-w-3xl leading-relaxed">
          Long-term care is <strong className="text-[#16181D]">2.4%</strong> instead of 1.8% if you are over 23 and have
          no children, and slightly higher again in Saxony. On top of social security come income tax, the solidarity
          surcharge (only above €{SOLI_THRESHOLD.toLocaleString("en-US")} of annual income tax) and church tax if you
          are a member.{" "}
          <Link href="/beitragsbemessungsgrenze-2026" className="text-[#E60A1C] font-semibold hover:underline">
            See all 2026 contribution ceilings
          </Link>
          .
        </p>
      </section>

      {/* ── Health insurer choice — genuinely useful for newcomers ──────── */}
      <section className="mb-16 bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-white border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-3">
          <HeartPulse size={13} /> Choosing a health insurer
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
          Your health insurer changes your net pay
        </h2>
        <p className="text-sm sm:text-base text-black/75 leading-relaxed max-w-3xl mb-5">
          If you are new to Germany you have to pick a statutory health insurer (Krankenkasse). The core rate of{" "}
          {ALLGEMEINER_BEITRAGSSATZ}% is fixed by law and identical everywhere — but each fund adds its own
          supplementary rate. In 2026 that ranges from{" "}
          <strong className="text-[#16181D]">{GUENSTIGSTE_KASSE.zusatzbeitrag.toFixed(2)}%</strong> to{" "}
          <strong className="text-[#16181D]">{TEUERSTE_KASSE.zusatzbeitrag.toFixed(2)}%</strong>. Since benefits are
          about 95% identical by law, that difference is close to free money.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/brutto-netto-rechner-krankenkasse"
            className="inline-flex items-center gap-2 bg-[#E60A1C] text-white font-bold text-sm px-5 py-3 rounded-2xl hover:bg-[#c4081a] transition-colors"
          >
            Compare all health insurers
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/krankenkasse/tk"
            className="inline-flex items-center gap-2 bg-white border border-black/[0.10] text-[#16181D] font-bold text-sm px-5 py-3 rounded-2xl hover:border-[#E60A1C]/40 transition-colors"
          >
            TK supplementary rate 2026
          </Link>
        </div>
      </section>

      {/* ── Net salary examples ─────────────────────────────────────────── */}
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
          the Income Tax Act (EStG). Earnings up to the basic allowance of €{GRUNDFREIBETRAG.toLocaleString("en-US")}{" "}
          (2026) are tax-free. Above that, the marginal rate rises from 14% to a top rate of 42% (from €69,879 of
          taxable income) and 45% for very high incomes (from €277,826).
        </p>
        <p>
          Your <strong className="text-[#16181D]">tax class</strong> does not change how much tax you owe over the year
          — it only changes how much is withheld each month. If too much was withheld, you get it back through your
          annual tax return (Steuererklärung), which is worth filing for most employees.
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
