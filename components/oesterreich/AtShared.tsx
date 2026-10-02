import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/authors";
import { formatEURat as eur } from "@/lib/oesterreich";

/**
 * Gemeinsame Bausteine des Österreich-Clusters (Rechner, Pension, Lehrer,
 * Mindestlohn …). Alle Seiten rechnen österreichisches Recht über
 * lib/oesterreich.ts; hier liegen nur Metadaten, Schema, Kopf und Tabellen,
 * damit die Seiten gleich aussehen und dieselben Signale senden (de-AT,
 * Breadcrumb über den Österreich-Rechner).
 */

export const AT_BASE = "https://bruttonettocalculator.com";
export const AT_HUB = { name: "Brutto-Netto-Rechner Österreich", path: "/brutto-netto-rechner-oesterreich" };

export interface AtFaq {
  q: string;
  a: string;
}

export function atMetadata({
  path,
  title,
  description,
  keywords,
}: {
  path: string;
  title: string;
  description: string;
  keywords: string[];
}): Metadata {
  const url = `${AT_BASE}${path}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "de_AT",
      siteName: "BruttoNettoCalculator.com",
      images: [`${AT_BASE}/og-image.png`],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function AtSchemas({
  path,
  title,
  description,
  crumb,
  faqs,
  dateModified = siteConfig.lastUpdatedISO,
}: {
  path: string;
  title: string;
  description: string;
  /** Name des letzten Breadcrumb-Elements. */
  crumb: string;
  faqs: AtFaq[];
  dateModified?: string;
}) {
  const url = `${AT_BASE}${path}`;
  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url,
      url,
      name: title,
      description,
      inLanguage: "de-AT",
      dateModified,
      isPartOf: { "@id": `${AT_BASE}/#website` },
      publisher: { "@id": `${AT_BASE}/#organization` },
      about: { "@type": "Country", name: "Österreich" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: `${AT_BASE}/` },
        { "@type": "ListItem", position: 2, name: AT_HUB.name, item: `${AT_BASE}${AT_HUB.path}` },
        { "@type": "ListItem", position: 3, name: crumb, item: url },
      ],
    },
  ];
  if (faqs.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
    </>
  );
}

export function AtHero({
  crumb,
  badge,
  title,
  accent,
  children,
}: {
  crumb: string;
  badge: string;
  title: string;
  accent: string;
  children: ReactNode;
}) {
  return (
    <section className="tool-hero relative border-b border-black/[0.08]">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 pt-8 sm:pt-10 pb-14 sm:pb-20">
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-black/50 mb-6 flex-wrap" aria-label="Brotkrumen">
          <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
          <ChevronRight size={14} className="flex-shrink-0" />
          <Link href={AT_HUB.path} className="hover:text-[#16181D] transition-colors">Österreich</Link>
          <ChevronRight size={14} className="flex-shrink-0" />
          <span className="text-[#16181D] font-medium">{crumb}</span>
        </nav>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E60A1C]/10 border border-[#E60A1C]/25 text-[#E60A1C] text-xs font-bold mb-4">
          <MapPin size={14} />
          {badge}
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight mb-4 max-w-4xl">
          {title} <span className="text-gradient-accent">{accent}</span>
        </h1>
        <div className="text-base sm:text-lg text-black/75 max-w-3xl leading-relaxed space-y-3">{children}</div>
      </div>
    </section>
  );
}

export function AtFaqList({ faqs }: { faqs: AtFaq[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((f) => (
        <details key={f.q} className="group bg-white border border-black/[0.08] rounded-2xl p-5">
          <summary className="font-bold text-[#16181D] cursor-pointer list-none flex items-start justify-between gap-3">
            {f.q}
            <ChevronRight size={18} className="flex-shrink-0 mt-0.5 text-black/40 transition-transform group-open:rotate-90" />
          </summary>
          <p className="text-sm sm:text-base text-black/75 leading-relaxed mt-3">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export interface AtTabellenZeile {
  label: ReactNode;
  werte: number[];
  hervorheben?: boolean;
}

/** Schlichte Zahlentabelle (Euro), erste Spalte Text, letzte Spalte fett. */
export function AtTabelle({
  kopf,
  zeilen,
  minWidth = 560,
  format = eur,
  formats,
}: {
  kopf: string[];
  zeilen: AtTabellenZeile[];
  minWidth?: number;
  format?: (v: number) => string;
  /** Formatierer je Wertspalte; fehlende Einträge nutzen `format`. */
  formats?: ((v: number) => string)[];
}) {
  return (
    <div className="overflow-x-auto bg-white border border-black/[0.08] rounded-2xl">
      <table className="w-full text-sm tabular-nums" style={{ minWidth }}>
        <thead>
          <tr className="text-left bg-black/[0.03] border-b border-black/[0.08]">
            {kopf.map((k, i) => (
              <th key={k} className={`px-4 py-3 font-bold ${i > 0 ? "text-right" : ""}`}>{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {zeilen.map((z, zi) => (
            <tr key={zi} className={`border-b border-black/[0.05] last:border-0 ${z.hervorheben ? "bg-[#E60A1C]/[0.04]" : ""}`}>
              <th scope="row" className="px-4 py-3 font-semibold text-left">{z.label}</th>
              {z.werte.map((v, i) => (
                <td key={i} className={`px-4 py-3 text-right whitespace-nowrap ${i === z.werte.length - 1 ? "font-bold" : ""}`}>
                  {(formats?.[i] ?? format)(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AtQuellen({ children }: { children: ReactNode }) {
  return <p className="text-xs text-black/45 leading-relaxed">{children}</p>;
}

/** Standard-Eingabe: Angestellte/r, 14 Gehälter, ohne Kinder/Pendler, NÖ. */
export const AT_STANDARD = {
  bundesland: "niederoesterreich" as const,
  gehaelter: 14 as const,
  kinderUnter18: 0,
  kinderAb18: 0,
  familienbonusVoll: true,
  avab: false,
  pendler: "keine" as const,
  pendlerKm: 0,
};

export const eur0 = (v: number) => Math.round(v).toLocaleString("de-AT") + " €";
