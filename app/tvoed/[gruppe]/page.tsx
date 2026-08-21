import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Landmark, Info, ArrowRight, TrendingUp } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import {
  TVOED_VKA_2026,
  findTvoedGruppe,
  belegteStufen,
  ENTGELTTABELLE_STAND,
  ENTGELTTABELLE_STAND_ISO,
  GUELTIG_AB,
  GUELTIG_BIS,
  TARIFERHOEHUNG_PROZENT,
} from "@/data/tvoed";
import ReviewerByline from "@/components/ReviewerByline";

/**
 * Detailseite je TVöD-Entgeltgruppe.
 *
 * Der Wettbewerb im TVöD-Cluster (oeffentlicher-dienst.info und Co.) zeigt
 * durchweg *Bruttotabellen*. Die Frage, die Beschäftigte tatsächlich haben —
 * "was bleibt davon netto?" — beantwortet dort niemand. Genau das ist hier der
 * Hebel: die Tabellenentgelte kommen aus `data/tvoed.ts`, das Netto je Stufe
 * rechnet dieselbe Engine wie der Hauptrechner.
 *
 * TVöD-Beschäftigte sind normale Arbeitnehmer (keine Beamten), `calculateNetto`
 * ist also unmittelbar anwendbar.
 */

const BASE = "https://bruttonettocalculator.com";

/** Steuerklassen, die in der Netto-Tabelle gegenübergestellt werden. */
const SK_SPALTEN = [
  { sk: 1 as const, label: "Steuerklasse I", verheiratet: false },
  { sk: 3 as const, label: "Steuerklasse III", verheiratet: true },
];

export async function generateStaticParams() {
  return TVOED_VKA_2026.map((g) => ({ gruppe: g.slug }));
}

function netto(bruttoMonat: number, sk: 1 | 3, verheiratet: boolean) {
  return calculateNetto({
    bruttoMonat,
    jahr: 2026,
    verheiratet,
    kinderlosUeber23: false,
    kirche: false,
    steuerklasse: sk,
  }).nettoMonat;
}

export async function generateMetadata({ params }: { params: { gruppe: string } }): Promise<Metadata> {
  const g = findTvoedGruppe(params.gruppe);
  if (!g) return {};

  const canonical = `${BASE}/tvoed/${g.slug}`;
  const stufen = belegteStufen(g);
  const min = stufen[0][1];
  const max = stufen[stufen.length - 1][1];

  const title = `TVöD ${g.label} 2026: Gehalt ${formatEUR(min)}–${formatEUR(max)} + Netto`;
  // Unter 165 Zeichen halten — längere Descriptions schneidet Google ab.
  const description =
    `TVöD ${g.label} 2026: ${formatEUR(min)} bis ${formatEUR(max)} brutto im Monat — ` +
    `mit Netto je Stufe für Steuerklasse I und III. Gültig ab ${GUELTIG_AB}.`;

  return {
    title,
    description,
    keywords: [
      `tvöd ${g.label.toLowerCase().replace(/\s/g, "")}`,
      `tvöd ${g.label.toLowerCase().replace(/\s/g, "")} gehalt`,
      `tvöd ${g.label.toLowerCase().replace(/\s/g, "")} netto`,
      "tvöd entgelttabelle 2026",
      "tvöd tabelle 2026",
    ],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      locale: "de_DE",
      siteName: "BruttoNettoCalculator.com",
      images: [`${BASE}/og-image.png`],
    },
    twitter: {
      card: "summary",
      title: `TVöD ${g.label} 2026 — Brutto und Netto`,
      description: `${formatEUR(min)} bis ${formatEUR(max)} brutto — mit Netto je Stufe.`,
    },
  };
}

export default function TvoedGruppenSeite({ params }: { params: { gruppe: string } }) {
  const g = findTvoedGruppe(params.gruppe);
  if (!g) notFound();

  const canonical = `${BASE}/tvoed/${g.slug}`;
  const stufen = belegteStufen(g);
  const min = stufen[0][1];
  const max = stufen[stufen.length - 1][1];

  const zeilen = stufen.map(([stufe, brutto]) => ({
    stufe,
    brutto,
    netto1: netto(brutto, 1, false),
    netto3: netto(brutto, 3, true),
  }));

  const index = TVOED_VKA_2026.findIndex((x) => x.slug === g.slug);
  const nachbarn = [TVOED_VKA_2026[index - 1], TVOED_VKA_2026[index + 1]].filter(Boolean);

  const faqs = [
    {
      q: `Wie viel verdient man in TVöD ${g.label}?`,
      a:
        `Das Tabellenentgelt in ${g.label} (TVöD-VKA, gültig ab ${GUELTIG_AB}) reicht von ${formatEUR(min)} in ` +
        `Stufe ${stufen[0][0]} bis ${formatEUR(max)} in Stufe ${stufen[stufen.length - 1][0]} brutto im Monat. ` +
        `Das sind die Werte für Vollzeit ohne Zulagen, Zuschläge und Jahressonderzahlung.`,
    },
    {
      q: `Was bleibt in ${g.label} netto übrig?`,
      a:
        `In Stufe ${stufen[0][0]} bleiben von ${formatEUR(min)} brutto rund ${formatEUR(zeilen[0].netto1)} netto in ` +
        `Steuerklasse I bzw. ${formatEUR(zeilen[0].netto3)} in Steuerklasse III. In der höchsten Stufe sind es ` +
        `${formatEUR(zeilen[zeilen.length - 1].netto1)} bzw. ${formatEUR(zeilen[zeilen.length - 1].netto3)}. ` +
        `Gerechnet ohne Kirchensteuer, mit Kindern und mit dem durchschnittlichen Zusatzbeitrag zur Krankenkasse.`,
    },
    {
      q: "Wie komme ich in die nächste Stufe?",
      a:
        "Die Stufen richten sich nach der Zeit ununterbrochener Tätigkeit beim selben Arbeitgeber: von Stufe 1 nach 2 " +
        "nach einem Jahr, nach Stufe 3 nach zwei weiteren Jahren, dann nach drei, vier und fünf Jahren bis Stufe 6. " +
        "Einschlägige Berufserfahrung kann bei der Einstellung angerechnet werden, und bei Leistungen, die erheblich " +
        "über dem Durchschnitt liegen, ist eine schnellere Stufenzuordnung möglich.",
    },
    {
      q: "Gilt diese Tabelle auch für Bund, Länder und den Sozialdienst?",
      a:
        "Nein. Diese Tabelle ist der TVöD-VKA für Beschäftigte bei Kommunen und kommunalen Arbeitgebern. Der TVöD Bund, " +
        "der TV-L für die Länder sowie die eigenständigen Tabellen für den Sozial- und Erziehungsdienst (S-Gruppen) und " +
        "die Pflege (P-Gruppen) haben abweichende Beträge und lassen sich aus dieser Tabelle nicht ableiten.",
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
      { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "TVöD-Rechner", item: `${BASE}/tvoed-rechner` },
      { "@type": "ListItem", position: 3, name: `TVöD ${g.label}`, item: canonical },
    ],
  };
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": canonical,
    url: canonical,
    name: `TVöD ${g.label} 2026`,
    inLanguage: "de-DE",
    dateModified: ENTGELTTABELLE_STAND_ISO,
    isPartOf: { "@id": `${BASE}/#website` },
    publisher: { "@id": `${BASE}/#organization` },
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-5 pt-8 pb-16">
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-black/50 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
          <ChevronRight size={14} className="flex-shrink-0" />
          <Link href="/tvoed-rechner" className="hover:text-[#16181D] transition-colors">TVöD-Rechner</Link>
          <ChevronRight size={14} className="flex-shrink-0" />
          <span className="text-[#16181D] font-medium">TVöD {g.label}</span>
        </nav>

        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E60A1C]/10 border border-[#E60A1C]/25 text-[#E60A1C] text-xs font-bold mb-4">
            <Landmark size={14} />
            TVöD-VKA · gültig ab {GUELTIG_AB}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#16181D] leading-tight mb-3">
            TVöD {g.label} 2026: Gehalt, Stufen und Netto
          </h1>
          <p className="text-base sm:text-lg text-black/70 leading-relaxed max-w-3xl">
            In der Entgeltgruppe {g.label} liegt das Tabellenentgelt zwischen{" "}
            <strong className="text-[#16181D]">{formatEUR(min)}</strong> und{" "}
            <strong className="text-[#16181D]">{formatEUR(max)}</strong> brutto im Monat. Was davon tatsächlich auf
            dem Konto landet, steht in der Tabelle unten — Stufe für Stufe.
          </p>
          <p className="text-sm text-black/55 mt-2">{g.typisch}</p>
          <div className="mt-4">
            <ReviewerByline />
          </div>
        </header>

        {/* ── Brutto + Netto je Stufe ───────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-2">
            TVöD {g.label} — Brutto und Netto je Stufe
          </h2>
          <p className="text-sm text-black/60 mb-5 max-w-3xl">
            Monatliche Beträge für Vollzeit, ohne Zulagen und Jahressonderzahlung. Netto gerechnet ohne Kirchensteuer,
            mit Kindern und mit dem durchschnittlichen Krankenkassen-Zusatzbeitrag.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-black/[0.08] bg-white shadow-sm">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="bg-black/[0.03] text-left">
                  <th className="px-4 py-3 font-bold text-[#16181D]">Stufe</th>
                  <th className="px-4 py-3 font-bold text-[#16181D] text-right">Brutto / Monat</th>
                  {SK_SPALTEN.map((s) => (
                    <th key={s.sk} className="px-4 py-3 font-bold text-[#16181D] text-right whitespace-nowrap">
                      Netto {s.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zeilen.map((z) => (
                  <tr key={z.stufe} className="border-t border-black/[0.06]">
                    <td className="px-4 py-3 font-semibold text-[#16181D]">Stufe {z.stufe}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-[#16181D] tabular-nums">
                      {formatEUR(z.brutto)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-black/85">{formatEUR(z.netto1)}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-emerald-600 font-semibold">
                      {formatEUR(z.netto3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-2 text-xs text-black/45 mt-3">
            <Info size={13} className="flex-shrink-0 mt-0.5" />
            <span>
              Tabellenentgelte: TVöD-VKA, gültig {GUELTIG_AB} bis {GUELTIG_BIS} (+{TARIFERHOEHUNG_PROZENT.toString().replace(".", ",")} %).
              Stand {ENTGELTTABELLE_STAND}. Keine verbindliche Eingruppierung — maßgeblich ist Ihr Arbeitsvertrag.
            </span>
          </div>
        </section>

        {/* ── Stufenaufstieg ────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-3">Was der Stufenaufstieg bringt</h2>
          <div className="bg-black/[0.03] border border-black/[0.10] rounded-2xl p-5">
            <div className="flex items-center gap-2 text-[#0E9F6E] font-bold mb-2">
              <TrendingUp size={18} />
              {formatEUR(max - min)} mehr brutto von Stufe {stufen[0][0]} bis Stufe {stufen[stufen.length - 1][0]}
            </div>
            <p className="text-sm text-black/70 leading-relaxed">
              Das entspricht{" "}
              <strong className="text-[#16181D]">
                {(((max - min) / min) * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 })} %
              </strong>{" "}
              über die gesamte Laufbahn in dieser Entgeltgruppe — netto in Steuerklasse I sind das{" "}
              <strong className="text-[#16181D]">
                {formatEUR(zeilen[zeilen.length - 1].netto1 - zeilen[0].netto1)}
              </strong>{" "}
              mehr im Monat. Der Aufstieg erfolgt automatisch mit der Zeit ununterbrochener Tätigkeit, nicht auf Antrag.
            </p>
          </div>
        </section>

        {/* ── Nachbargruppen ────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-4">Benachbarte Entgeltgruppen</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {nachbarn.map((n) => {
              const ns = belegteStufen(n);
              return (
                <Link
                  key={n.slug}
                  href={`/tvoed/${n.slug}`}
                  className="group flex items-center justify-between gap-3 bg-white border border-black/[0.08] rounded-2xl p-4 hover:border-[#E60A1C]/40 hover:shadow-md transition-all"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-[#16181D] group-hover:text-[#E60A1C] transition-colors">
                      TVöD {n.label}
                    </div>
                    <div className="text-xs text-black/50 mt-0.5">
                      {formatEUR(ns[0][1])} – {formatEUR(ns[ns.length - 1][1])}
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-black/30 group-hover:text-[#E60A1C] flex-shrink-0 transition-colors" />
                </Link>
              );
            })}
          </div>
          <Link
            href="/tvoed-rechner"
            className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-[#E60A1C] hover:underline"
          >
            <Landmark size={16} />
            Komplette TVöD-Entgelttabelle 2026
          </Link>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-5">Häufige Fragen zu TVöD {g.label}</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group bg-white border border-black/[0.08] rounded-2xl overflow-hidden">
                <summary className="cursor-pointer list-none px-4 sm:px-5 py-4 font-bold text-[#16181D] text-sm sm:text-base flex items-center justify-between gap-3 hover:bg-black/[0.02]">
                  {f.q}
                  <ChevronRight size={18} className="flex-shrink-0 text-black/35 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-4 sm:px-5 pb-4 text-sm text-black/70 leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
