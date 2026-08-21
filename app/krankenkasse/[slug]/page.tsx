import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, HeartPulse, TrendingDown, TrendingUp, Info, ArrowRight, Wallet2 } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import {
  KRANKENKASSEN_2026,
  DURCHSCHNITT_ZUSATZBEITRAG_2026,
  ALLGEMEINER_BEITRAGSSATZ,
  GUENSTIGSTE_KASSE,
  TEUERSTE_KASSE,
  ZUSATZBEITRAG_STAND,
  ZUSATZBEITRAG_STAND_ISO,
  findKrankenkasse,
  gesamtbeitragssatz,
  arbeitnehmeranteilProzent,
  type Krankenkasse,
} from "@/data/krankenkassen";
import KrankenkassenRechner from "@/components/KrankenkassenRechner";
import ReviewerByline from "@/components/ReviewerByline";

/**
 * Detailseite je gesetzlicher Krankenkasse.
 *
 * Zielt auf die kassenspezifischen Suchanfragen, die 2026 stark steigen
 * ("zusatzbeitrag tk 2026", "bkk firmus zusatzbeitrag 2026", "dak
 * zusatzbeitrag 2026"). Die Hub-Seite /brutto-netto-rechner-krankenkasse
 * beantwortet die generische Frage; hier steht je Kasse der eigene Satz,
 * was er konkret netto kostet und wie er zum Durchschnitt steht.
 *
 * Alle Euro-Beträge kommen aus `calculateNetto` — jede Seite trägt damit
 * eigene, echte Zahlen und ist kein Textduplikat mit ausgetauschtem Namen.
 */

const BASE = "https://bruttonettocalculator.com";

/** Gehaltsstufen für die Kostentabelle — deckt Teilzeit bis Gutverdiener ab. */
const BEISPIEL_BRUTTO = [2500, 3500, 4500, 6000];

export async function generateStaticParams() {
  return KRANKENKASSEN_2026.map((k) => ({ slug: k.slug }));
}

function fmtPct(value: number): string {
  return value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " %";
}

/** Netto-Differenz dieser Kasse gegenüber einem Vergleichs-Zusatzbeitrag. */
function nettoDiff(bruttoMonat: number, zusatzbeitrag: number, vergleich: number) {
  const base = {
    bruttoMonat,
    jahr: 2026 as const,
    verheiratet: false,
    kinderlosUeber23: false,
    kirche: false,
    steuerklasse: 1 as const,
  };
  const meine = calculateNetto({ ...base, kvZusatzbeitrag: zusatzbeitrag / 100 });
  const andere = calculateNetto({ ...base, kvZusatzbeitrag: vergleich / 100 });
  return {
    nettoMonat: meine.nettoMonat,
    diffMonat: meine.nettoMonat - andere.nettoMonat,
    diffJahr: meine.nettoJahr - andere.nettoJahr,
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const kasse = findKrankenkasse(params.slug);
  if (!kasse) return {};

  const canonical = `${BASE}/krankenkasse/${kasse.slug}`;
  const satz = fmtPct(kasse.zusatzbeitrag);
  const gesamt = fmtPct(gesamtbeitragssatz(kasse.zusatzbeitrag));
  // Längen bewusst knapp gehalten: Google schneidet Titles über ~60 und
  // Descriptions über ~165 Zeichen ab, und abgeschnittene Snippets kosten CTR.
  // Der längste Kassenname ("HEK — Hanseatische Krankenkasse") bleibt mit
  // diesem Muster bei 57 Zeichen.
  const title = `${kasse.name} Zusatzbeitrag 2026: ${satz}`;
  const description =
    `${kasse.name}: Zusatzbeitrag ${satz}, Gesamtbeitrag ${gesamt}. ` +
    `Was der Satz Ihrer Kasse netto kostet — mit Vergleich zum Durchschnitt ` +
    `(${fmtPct(DURCHSCHNITT_ZUSATZBEITRAG_2026)}).`;

  return {
    title,
    description,
    keywords: [
      `${kasse.name} zusatzbeitrag 2026`,
      `zusatzbeitrag ${kasse.name} 2026`,
      `${kasse.name} beitragssatz 2026`,
      `brutto netto rechner ${kasse.name}`,
      "krankenkassen zusatzbeitrag 2026",
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
      title: `${kasse.name}: Zusatzbeitrag ${satz} (2026)`,
      description: `Gesamtbeitrag ${gesamt} — so viel Netto macht die Kassenwahl aus.`,
    },
  };
}

export default function KrankenkassenDetailSeite({ params }: { params: { slug: string } }) {
  const kasse = findKrankenkasse(params.slug);
  if (!kasse) notFound();

  const canonical = `${BASE}/krankenkasse/${kasse.slug}`;
  const gesamt = gesamtbeitragssatz(kasse.zusatzbeitrag);
  const anAnteil = arbeitnehmeranteilProzent(kasse.zusatzbeitrag);

  const vsDurchschnitt = kasse.zusatzbeitrag - DURCHSCHNITT_ZUSATZBEITRAG_2026;
  const istGuenstiger = vsDurchschnitt < 0;
  const istGuenstigste = kasse.slug === GUENSTIGSTE_KASSE.slug;
  const istTeuerste = kasse.slug === TEUERSTE_KASSE.slug;

  // Kostentabelle: Netto dieser Kasse und die Differenz zum Durchschnitt.
  const tabelle = BEISPIEL_BRUTTO.map((brutto) => ({
    brutto,
    ...nettoDiff(brutto, kasse.zusatzbeitrag, DURCHSCHNITT_ZUSATZBEITRAG_2026),
    vsGuenstigste: nettoDiff(brutto, kasse.zusatzbeitrag, GUENSTIGSTE_KASSE.zusatzbeitrag).diffJahr,
  }));

  // Ein konkreter Referenzwert für Fließtext und FAQ (4.500 € brutto).
  const referenz = tabelle.find((t) => t.brutto === 4500)!;

  // Nachbarkassen in der Preisliste — als interne Links und für den Kontext.
  const index = KRANKENKASSEN_2026.findIndex((k) => k.slug === kasse.slug);
  const nachbarn: Krankenkasse[] = [
    ...KRANKENKASSEN_2026.slice(Math.max(0, index - 3), index),
    ...KRANKENKASSEN_2026.slice(index + 1, index + 4),
  ];

  const faqs = [
    {
      q: `Wie hoch ist der Zusatzbeitrag der ${kasse.name} 2026?`,
      a:
        `Die ${kasse.name} erhebt 2026 einen Zusatzbeitrag von ${fmtPct(kasse.zusatzbeitrag)}. ` +
        `Zusammen mit dem gesetzlich für alle Kassen gleichen allgemeinen Beitragssatz von ` +
        `${fmtPct(ALLGEMEINER_BEITRAGSSATZ)} (§ 241 SGB V) ergibt das einen Gesamtbeitrag von ` +
        `${fmtPct(gesamt)}. Arbeitgeber und Arbeitnehmer teilen sich diesen Satz paritätisch, ` +
        `auf den Arbeitnehmer entfallen also ${fmtPct(anAnteil)}. Stand: ${ZUSATZBEITRAG_STAND}.`,
    },
    {
      q: `Was kostet der Zusatzbeitrag der ${kasse.name} im Vergleich zum Durchschnitt?`,
      a: istGuenstiger
        ? `Der Satz liegt ${fmtPct(Math.abs(vsDurchschnitt))} unter dem amtlichen Durchschnitt von ` +
          `${fmtPct(DURCHSCHNITT_ZUSATZBEITRAG_2026)}. Bei 4.500 € brutto im Monat (Steuerklasse I) ` +
          `bleiben dadurch rund ${formatEUR(Math.abs(referenz.diffJahr))} mehr netto im Jahr.`
        : vsDurchschnitt === 0
        ? `Der Satz entspricht exakt dem amtlichen Durchschnitt von ${fmtPct(DURCHSCHNITT_ZUSATZBEITRAG_2026)}.`
        : `Der Satz liegt ${fmtPct(vsDurchschnitt)} über dem amtlichen Durchschnitt von ` +
          `${fmtPct(DURCHSCHNITT_ZUSATZBEITRAG_2026)}. Bei 4.500 € brutto im Monat (Steuerklasse I) ` +
          `kostet das rund ${formatEUR(Math.abs(referenz.diffJahr))} netto im Jahr.`,
    },
    {
      q: `Kann ich von der ${kasse.name} zu einer günstigeren Kasse wechseln?`,
      a:
        `Ja. Nach § 175 SGB V sind Sie zwölf Monate an eine Kasse gebunden und können danach mit einer ` +
        `Frist von zwei Monaten zum Monatsende kündigen. Erhöht Ihre Kasse den Zusatzbeitrag, gilt ein ` +
        `Sonderkündigungsrecht — dann entfällt die Mindestbindung. Die Leistungen sind zu rund 95 % ` +
        `gesetzlich vorgeschrieben und damit bei allen Kassen gleich; Unterschiede gibt es vor allem bei ` +
        `Satzungsleistungen und Bonusprogrammen. Günstigste Kasse in unserer Übersicht: ` +
        `${GUENSTIGSTE_KASSE.name} mit ${fmtPct(GUENSTIGSTE_KASSE.zusatzbeitrag)}.`,
    },
    {
      q: `Zahlt der Arbeitgeber den Zusatzbeitrag der ${kasse.name} mit?`,
      a:
        `Ja. Seit 2019 wird der Zusatzbeitrag paritätisch getragen: Arbeitgeber und Arbeitnehmer zahlen ` +
        `je die Hälfte. Von den ${fmtPct(gesamt)} Gesamtbeitrag entfallen damit ${fmtPct(anAnteil)} auf ` +
        `Sie und ${fmtPct(anAnteil)} auf Ihren Arbeitgeber. Beiträge werden nur bis zur ` +
        `Beitragsbemessungsgrenze von 69.750 € im Jahr (5.812,50 € im Monat) erhoben.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Krankenkassen-Rechner", item: `${BASE}/brutto-netto-rechner-krankenkasse` },
      { "@type": "ListItem", position: 3, name: `${kasse.name} Zusatzbeitrag 2026`, item: canonical },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": canonical,
    url: canonical,
    name: `${kasse.name} Zusatzbeitrag 2026`,
    inLanguage: "de-DE",
    dateModified: ZUSATZBEITRAG_STAND_ISO,
    isPartOf: { "@id": `${BASE}/#website` },
    publisher: { "@id": `${BASE}/#organization` },
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-5 pt-8 pb-16">
        {/* ── Breadcrumb ────────────────────────────────────────────── */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-black/50 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
          <ChevronRight size={14} className="flex-shrink-0" />
          <Link href="/brutto-netto-rechner-krankenkasse" className="hover:text-[#16181D] transition-colors">
            Krankenkassen-Rechner
          </Link>
          <ChevronRight size={14} className="flex-shrink-0" />
          <span className="text-[#16181D] font-medium">{kasse.name}</span>
        </nav>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E60A1C]/10 border border-[#E60A1C]/25 text-[#E60A1C] text-xs font-bold mb-4">
            <HeartPulse size={14} />
            Krankenkasse 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#16181D] leading-tight mb-3">
            {kasse.name}: Zusatzbeitrag {fmtPct(kasse.zusatzbeitrag)} — was bleibt netto?
          </h1>
          <p className="text-base sm:text-lg text-black/70 leading-relaxed max-w-3xl">
            Die {kasse.name} erhebt 2026 einen Zusatzbeitrag von{" "}
            <strong className="text-[#16181D]">{fmtPct(kasse.zusatzbeitrag)}</strong>. Mit dem für alle
            Kassen gleichen allgemeinen Beitragssatz von {fmtPct(ALLGEMEINER_BEITRAGSSATZ)} ergibt das{" "}
            <strong className="text-[#16181D]">{fmtPct(gesamt)}</strong> Gesamtbeitrag — davon tragen Sie
            als Arbeitnehmer {fmtPct(anAnteil)}.
          </p>
          <div className="mt-4">
            <ReviewerByline />
          </div>
        </header>

        {/* ── Kennzahlen ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Zusatzbeitrag 2026", value: fmtPct(kasse.zusatzbeitrag) },
            { label: "Gesamtbeitrag", value: fmtPct(gesamt) },
            { label: "Ihr Anteil (AN)", value: fmtPct(anAnteil) },
            {
              label: "vs. Durchschnitt",
              value: vsDurchschnitt === 0 ? "±0,00 %" : `${vsDurchschnitt > 0 ? "+" : "−"}${fmtPct(Math.abs(vsDurchschnitt))}`,
              tone: vsDurchschnitt === 0 ? "" : istGuenstiger ? "text-[#0E9F6E]" : "text-[#E60A1C]",
            },
          ].map((k) => (
            <div key={k.label} className="bg-white border border-black/[0.08] rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-mono uppercase tracking-widest text-black/45 mb-1.5">{k.label}</div>
              <div className={`text-xl sm:text-2xl font-extrabold tabular-nums ${k.tone || "text-[#16181D]"}`}>
                {k.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── Einordnung ────────────────────────────────────────────── */}
        <div
          className={`flex items-start gap-3 rounded-2xl border p-4 sm:p-5 mb-10 ${
            istGuenstiger
              ? "bg-[#0E9F6E]/[0.06] border-[#0E9F6E]/25"
              : vsDurchschnitt === 0
              ? "bg-black/[0.03] border-black/[0.10]"
              : "bg-[#E60A1C]/[0.05] border-[#E60A1C]/25"
          }`}
        >
          {istGuenstiger ? (
            <TrendingDown size={20} className="text-[#0E9F6E] flex-shrink-0 mt-0.5" />
          ) : (
            <TrendingUp size={20} className={`flex-shrink-0 mt-0.5 ${vsDurchschnitt === 0 ? "text-black/50" : "text-[#E60A1C]"}`} />
          )}
          <p className="text-sm sm:text-base text-black/75 leading-relaxed">
            {istGuenstigste && (
              <>
                Die {kasse.name} ist in unserer Übersicht die{" "}
                <strong className="text-[#16181D]">günstigste gesetzliche Krankenkasse 2026</strong>.{" "}
              </>
            )}
            {istTeuerste && (
              <>
                Die {kasse.name} ist in unserer Übersicht die{" "}
                <strong className="text-[#16181D]">teuerste gesetzliche Krankenkasse 2026</strong>.{" "}
              </>
            )}
            {vsDurchschnitt === 0 ? (
              <>
                Der Zusatzbeitrag entspricht exakt dem amtlichen Durchschnitt von{" "}
                {fmtPct(DURCHSCHNITT_ZUSATZBEITRAG_2026)} (§ 242a SGB V).
              </>
            ) : (
              <>
                Der Zusatzbeitrag liegt {fmtPct(Math.abs(vsDurchschnitt))}{" "}
                {istGuenstiger ? "unter" : "über"} dem amtlichen Durchschnitt von{" "}
                {fmtPct(DURCHSCHNITT_ZUSATZBEITRAG_2026)}. Bei 4.500 € brutto im Monat sind das rund{" "}
                <strong className="text-[#16181D]">{formatEUR(Math.abs(referenz.diffJahr))}</strong>{" "}
                {istGuenstiger ? "mehr" : "weniger"} netto im Jahr.
              </>
            )}
            {!kasse.bundesweit && kasse.region && (
              <>
                {" "}Die Kasse ist nicht bundesweit geöffnet, sondern wählbar in: {kasse.region}.
              </>
            )}
          </p>
        </div>

        {/* ── Kostentabelle ─────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-2">
            Was der Zusatzbeitrag der {kasse.name} netto kostet
          </h2>
          <p className="text-sm text-black/60 mb-5 max-w-3xl">
            Nettogehalt in Steuerklasse I, ohne Kirchensteuer, mit Kindern (Pflegeversicherung ohne
            Kinderlosenzuschlag). Die Differenz vergleicht diese Kasse mit dem amtlichen Durchschnitt
            von {fmtPct(DURCHSCHNITT_ZUSATZBEITRAG_2026)} bzw. mit {GUENSTIGSTE_KASSE.name} als
            günstigster Kasse.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-black/[0.08] bg-white shadow-sm">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-black/[0.03] text-left">
                  <th className="px-4 py-3 font-bold text-[#16181D]">Brutto / Monat</th>
                  <th className="px-4 py-3 font-bold text-[#16181D] text-right">Netto / Monat</th>
                  <th className="px-4 py-3 font-bold text-[#16181D] text-right">vs. Durchschnitt / Jahr</th>
                  <th className="px-4 py-3 font-bold text-[#16181D] text-right">
                    vs. {GUENSTIGSTE_KASSE.name} / Jahr
                  </th>
                </tr>
              </thead>
              <tbody>
                {tabelle.map((row) => (
                  <tr key={row.brutto} className="border-t border-black/[0.06]">
                    <td className="px-4 py-3 font-semibold text-[#16181D] tabular-nums">
                      {formatEUR(row.brutto)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-mono text-black/85">
                      {formatEUR(row.nettoMonat)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right tabular-nums font-mono font-semibold ${
                        row.diffJahr > 0 ? "text-[#0E9F6E]" : row.diffJahr < 0 ? "text-[#E60A1C]" : "text-black/60"
                      }`}
                    >
                      {row.diffJahr > 0 ? "+" : ""}
                      {formatEUR(row.diffJahr)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right tabular-nums font-mono ${
                        row.vsGuenstigste < 0 ? "text-[#E60A1C]" : "text-black/60"
                      }`}
                    >
                      {row.vsGuenstigste > 0 ? "+" : ""}
                      {formatEUR(row.vsGuenstigste)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-black/45 mt-3 flex items-start gap-1.5">
            <Info size={13} className="flex-shrink-0 mt-0.5" />
            Beiträge werden nur bis zur Beitragsbemessungsgrenze von 69.750 € im Jahr erhoben — oberhalb
            davon steigt der Beitrag nicht weiter. Mehr dazu:{" "}
            <Link href="/beitragsbemessungsgrenze-2026" className="text-[#E60A1C] font-semibold hover:underline">
              Beitragsbemessungsgrenze 2026
            </Link>
            .
          </p>
        </section>

        {/* ── Interaktiver Rechner ──────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-2">
            Mit dem Satz der {kasse.name} rechnen
          </h2>
          <p className="text-sm text-black/60 mb-5 max-w-3xl">
            Der Rechner startet mit der {kasse.name} — tragen Sie Ihr Bruttogehalt ein und vergleichen Sie
            direkt mit jeder anderen Kasse.
          </p>
          <KrankenkassenRechner initialSlug={kasse.slug} />
        </section>

        {/* ── Nachbarkassen ─────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-2">Kassen mit ähnlichem Beitrag</h2>
          <p className="text-sm text-black/60 mb-5">
            Sortiert nach Zusatzbeitrag 2026 — Stand {ZUSATZBEITRAG_STAND}.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {nachbarn.map((n) => (
              <Link
                key={n.slug}
                href={`/krankenkasse/${n.slug}`}
                className="group flex items-center justify-between gap-3 bg-white border border-black/[0.08] rounded-2xl p-4 hover:border-[#E60A1C]/40 hover:shadow-md transition-all"
              >
                <div className="min-w-0">
                  <div className="font-bold text-sm text-[#16181D] group-hover:text-[#E60A1C] transition-colors truncate">
                    {n.name}
                  </div>
                  <div className="text-xs text-black/50 mt-0.5">Zusatzbeitrag {fmtPct(n.zusatzbeitrag)}</div>
                </div>
                <ArrowRight size={16} className="text-black/30 group-hover:text-[#E60A1C] flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
          <Link
            href="/brutto-netto-rechner-krankenkasse"
            className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-[#E60A1C] hover:underline"
          >
            <Wallet2 size={16} />
            Alle {KRANKENKASSEN_2026.length} Kassen im Vergleich
          </Link>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-5">
            Häufige Fragen zur {kasse.name}
          </h2>
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
