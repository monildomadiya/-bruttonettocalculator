import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Globe, BarChart3, Receipt, Users, Scale, HelpCircle, ArrowRight, Wallet2 } from "lucide-react";
import Calculator from "@/components/Calculator";
import Section from "@/components/ui/Section";
import type { ExpatContent, Faq, SeitenText } from "@/lib/expat/types";
import { LANGUAGE_CLUSTER } from "@/lib/expat/cluster";
import {
  BEISPIELE,
  KLASSEN_BRUTTO,
  KLASSEN_TABELLE,
  MINDESTLOHN_STUNDEN_TABELLE,
  MINDESTLOHN_ZEILEN,
  eur,
} from "@/lib/expat/numbers";
import { siteConfig } from "@/lib/authors";

/**
 * Seitenvorlagen für die Expat-Sprachen. Texte: lib/expat/content-*.ts,
 * Zahlen: lib/expat/numbers.ts (deutsche Engine). Die drei Seiten einer
 * Sprache verlinken sich gegenseitig und auf das deutsche Pendant.
 */

const BASE = "https://bruttonettocalculator.com";
const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

type Art = "calc" | "klassen" | "mindestlohn";
const DE_PENDANT: Record<Art, { href: string; label: string }> = {
  calc: { href: "/", label: "Brutto-Netto-Rechner" },
  klassen: { href: "/steuerklassen", label: "Steuerklassen" },
  mindestlohn: { href: "/mindestlohn", label: "Mindestlohn" },
};

export function expatMetadata(c: ExpatContent, art: Art): Metadata {
  const t = c[art];
  const url = `${BASE}${t.path}`;
  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    alternates: { canonical: url, ...(art === "calc" ? { languages: LANGUAGE_CLUSTER } : {}) },
    openGraph: {
      title: t.title,
      description: t.description,
      url,
      type: "website",
      locale: c.ogLocale,
      siteName: "BruttoNettoCalculator.com",
      images: [`${BASE}/og-image.png`],
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.description },
  };
}

function Schemas({ c, t, faqs }: { c: ExpatContent; t: SeitenText; faqs: Faq[] }) {
  const url = `${BASE}${t.path}`;
  const list = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url,
      url,
      name: t.title,
      description: t.description,
      inLanguage: c.lang,
      dateModified: siteConfig.lastUpdatedISO,
      isPartOf: { "@id": `${BASE}/#website` },
      publisher: { "@id": `${BASE}/#organization` },
      about: { "@type": "Country", name: "Germany" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: c.start, item: `${BASE}/` },
        ...(t.path === c.calc.path
          ? []
          : [{ "@type": "ListItem", position: 2, name: c.calc.nav, item: `${BASE}${c.calc.path}` }]),
        { "@type": "ListItem", position: t.path === c.calc.path ? 2 : 3, name: t.nav, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
  return (
    <>
      {list.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
    </>
  );
}

function Kopf({ c, t }: { c: ExpatContent; t: SeitenText }) {
  const istHub = t.path === c.calc.path;
  return (
    <>
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-4 sm:mb-8 font-medium flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#16181D] transition-colors">{c.start}</Link>
        <ChevronRight size={14} className="text-black/30" />
        {!istHub && (
          <>
            <Link href={c.calc.path} className="hover:text-[#16181D] transition-colors">{c.calc.nav}</Link>
            <ChevronRight size={14} className="text-black/30" />
          </>
        )}
        <span className="text-black/80">{t.nav}</span>
      </nav>
      <div className="mb-6 sm:mb-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-3 sm:mb-5">
          <Globe size={14} /> {t.badge}
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3 sm:mb-5 max-w-4xl">
          {t.h1} <span className="text-gradient-accent">{t.h1Akzent}</span>
        </h1>
        <p className="text-base sm:text-xl text-black/80 max-w-3xl leading-relaxed">{t.intro}</p>
      </div>
    </>
  );
}

function FaqBlock({ c, faqs }: { c: ExpatContent; faqs: Faq[] }) {
  return (
    <Section id="faq" variant="muted" eyebrow="FAQ" eyebrowIcon={HelpCircle} title={c.faqTitel}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-sm sm:text-base">
        {faqs.map((f) => (
          <div key={f.q}>
            <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-2">{f.q}</h3>
            <p className="text-black/70 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Weitere({ c, art }: { c: ExpatContent; art: Art }) {
  const links = (["calc", "klassen", "mindestlohn"] as Art[])
    .filter((a) => a !== art)
    .map((a) => ({ href: c[a].path, label: c[a].nav, desc: c[a].badge }));
  return (
    <Section eyebrow={c.weitere} eyebrowIcon={ArrowRight}>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group block bg-white border border-black/[0.08] rounded-2xl p-4 hover:border-[#E60A1C]/40 transition-colors h-full"
            >
              <span className="block font-bold text-[#16181D] group-hover:text-[#E60A1C]">{l.label}</span>
              <span className="block text-xs text-black/50 mt-1">{l.desc}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={DE_PENDANT[art].href}
            hrefLang="de"
            className="group block bg-white border border-black/[0.08] rounded-2xl p-4 hover:border-[#E60A1C]/40 transition-colors h-full"
          >
            <span className="block font-bold text-[#16181D] group-hover:text-[#E60A1C]">{DE_PENDANT[art].label}</span>
            <span className="block text-xs text-black/50 mt-1">Deutsch</span>
          </Link>
        </li>
      </ul>
      <p className="text-xs text-black/45 mt-6 leading-relaxed">{c.quellen}</p>
    </Section>
  );
}

function Tabelle({ kopf, zeilen, minWidth = 480 }: { kopf: string[]; zeilen: (string | number)[][]; minWidth?: number }) {
  return (
    <div className="overflow-x-auto bg-white border border-black/[0.10] rounded-2xl">
      <table className="w-full text-sm tabular-nums" style={{ minWidth }}>
        <thead>
          <tr className="text-left bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
            {kopf.map((k, i) => (
              <th key={k} className={`py-3 px-3 sm:px-4 ${i > 0 ? "text-right" : ""}`}>{k}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10">
          {zeilen.map((z, zi) => (
            <tr key={zi}>
              {z.map((v, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="py-2.5 px-3 sm:px-4 text-left font-bold text-[#16181D] whitespace-nowrap">{v}</th>
                ) : (
                  <td key={i} className={`py-2.5 px-3 sm:px-4 text-right whitespace-nowrap ${i === z.length - 1 ? "font-bold" : ""}`}>
                    {typeof v === "number" ? eur(v) : v}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Rahmen = ({ c, children }: { c: ExpatContent; children: React.ReactNode }) => (
  <main lang={c.lang} className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-16 pb-24 text-[#16181D]">
    {children}
  </main>
);

/* ── Seite 1: Rechner ──────────────────────────────────────────────── */
export function ExpatCalcPage({ c }: { c: ExpatContent }) {
  const t = c.calc;
  return (
    <Rahmen c={c}>
      <Schemas c={c} t={t} faqs={t.faqs} />
      <Kopf c={c} t={t} />
      <p className="text-sm text-black/55 max-w-2xl mx-auto text-center -mt-4 mb-8">
        {c.hinweisDeutsch}{" "}
        <Link href="/" hrefLang="de" className="text-[#E60A1C] font-semibold hover:underline">{c.linkDeutsch}</Link>
      </p>

      <section id="calculator" className="mb-14 scroll-mt-24">
        <Calculator initialBrutto={3000} lang={c.lang} deepLink={false} />
      </section>

      <Section id="exemple" eyebrow={t.spalteBrutto} eyebrowIcon={BarChart3} title={t.beispieleTitel} intro={t.beispieleIntro}>
        <Tabelle kopf={[t.spalteBrutto, t.spalteSk1, t.spalteSk3]} zeilen={BEISPIELE.map((b) => [eur(b.brutto, 0), b.sk1, b.sk3])} />
      </Section>

      <Section variant="muted" eyebrow="SV + Lohnsteuer" eyebrowIcon={Receipt} title={t.abzuegeTitel}>
        <ul className="space-y-2.5 text-sm sm:text-base text-black/75 leading-relaxed list-disc pl-5">
          {t.abzuege.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Destatis" eyebrowIcon={Wallet2} title={t.gehaltTitel}>
        <p className="text-sm sm:text-base text-black/75 leading-relaxed">{t.gehaltText}</p>
      </Section>

      <FaqBlock c={c} faqs={t.faqs} />
      <Weitere c={c} art="calc" />
    </Rahmen>
  );
}

/* ── Seite 2: Steuerklassen ────────────────────────────────────────── */
export function ExpatKlassenPage({ c }: { c: ExpatContent }) {
  const t = c.klassen;
  return (
    <Rahmen c={c}>
      <Schemas c={c} t={t} faqs={t.faqs} />
      <Kopf c={c} t={t} />

      <Section id="tabel" eyebrow="2026" eyebrowIcon={BarChart3} title={t.tabelleTitel} intro={t.tabelleIntro}>
        <Tabelle
          kopf={[t.spalteKlasse, ...KLASSEN_BRUTTO.map((b) => `${c.calc.spalteBrutto}: ${eur(b, 0)}`)]}
          zeilen={KLASSEN_TABELLE.map((k) => [ROMAN[k.sk - 1], ...k.netto])}
        />
      </Section>

      <Section variant="muted" eyebrow="Steuerklasse I–VI" eyebrowIcon={Users} title={t.h1}>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {t.klassen.map((k) => (
            <li key={k.titel} className="bg-white border border-black/[0.08] rounded-2xl p-4">
              <h3 className="font-display font-extrabold text-lg text-[#16181D] mb-1">{k.titel}</h3>
              <p className="text-sm text-black/70 leading-relaxed">{k.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="§ 1a EStG" eyebrowIcon={Scale} title={t.wechselTitel}>
        <p className="text-sm sm:text-base text-black/75 leading-relaxed">{t.wechselText}</p>
      </Section>

      <section className="mb-14">
        <Calculator initialBrutto={3500} initialSk={3} lang={c.lang} deepLink={false} />
      </section>

      <FaqBlock c={c} faqs={t.faqs} />
      <Weitere c={c} art="klassen" />
    </Rahmen>
  );
}

/* ── Seite 3: Mindestlohn ──────────────────────────────────────────── */
export function ExpatMindestlohnPage({ c }: { c: ExpatContent }) {
  const t = c.mindestlohn;
  return (
    <Rahmen c={c}>
      <Schemas c={c} t={t} faqs={t.faqs} />
      <Kopf c={c} t={t} />

      <Section id="net" eyebrow="2026 / 2027" eyebrowIcon={Scale} title={t.tabelleTitel} intro={t.tabelleIntro}>
        <Tabelle
          kopf={[t.spalteJahr, t.spalteStunde, t.spalteBruttoMonat, t.spalteNettoSk3, t.spalteNettoSk1]}
          minWidth={560}
          zeilen={MINDESTLOHN_ZEILEN.map((m) => [String(m.jahr), m.stunde, m.brutto, m.netto3, m.netto])}
        />
      </Section>

      <Section variant="muted" eyebrow="2026" eyebrowIcon={BarChart3} title={t.stundenTitel}>
        <Tabelle
          kopf={[t.spalteStundenWoche, t.spalteBruttoMonat, t.spalteNettoSk1]}
          zeilen={MINDESTLOHN_STUNDEN_TABELLE.map((m) => [String(m.h), m.brutto, m.netto])}
        />
      </Section>

      <Section eyebrow="Minijob" eyebrowIcon={Wallet2} title={t.minijobTitel}>
        <p className="text-sm sm:text-base text-black/75 leading-relaxed">{t.minijobText}</p>
      </Section>

      <section className="mb-14">
        <Calculator initialBrutto={MINDESTLOHN_ZEILEN[0].brutto} lang={c.lang} deepLink={false} />
      </section>

      <FaqBlock c={c} faqs={t.faqs} />
      <Weitere c={c} art="mindestlohn" />
    </Rahmen>
  );
}
