import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Info, TrendingUp, ShieldCheck, Wallet2, ArrowRight } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import ReviewerByline from "@/components/ReviewerByline";
import { siteConfig } from "@/lib/authors";

/**
 * Beitragsbemessungsgrenze 2026.
 *
 * Zielt auf "beitragsbemessungsgrenze 2026" — eine der am stärksten steigenden
 * Suchanfragen im Cluster (Rising Searches DE, 20./21.08.2026: +120 %). Die
 * Zahlen standen bisher nur verstreut in `RECHENGROESSEN_2026` und in Fließtext
 * anderer Seiten, ohne eigene Landingpage.
 *
 * Die Grenzwerte sind die amtlichen der Sozialversicherungsrechengrößen-
 * Verordnung 2026; die Euro-Beispiele rechnet `calculateNetto`, damit die Seite
 * denselben Stand wie der Rechner hat.
 */

const BASE = "https://bruttonettocalculator.com";
const CANONICAL = `${BASE}/beitragsbemessungsgrenze-2026`;

/* ── Amtliche Rechengrößen 2026 ──────────────────────────────────────── */
const BBG_KV_PV_JAHR = 69750;
const BBG_RV_ALV_JAHR = 101400;
/** Versicherungspflichtgrenze (JAEG) — ab hier ist ein PKV-Wechsel möglich. */
const JAEG_JAHR = 77400;
/** Ermäßigte JAEG für Ende 2002 bereits privat Versicherte (Bestandsschutz). */
const JAEG_BESTAND_JAHR = 69750;

const eur = (v: number) => v.toLocaleString("de-DE") + " €";

export const metadata: Metadata = {
  title: "Beitragsbemessungsgrenze 2026: 69.750 € & 101.400 € — alle Werte",
  description:
    "Beitragsbemessungsgrenze 2026: 69.750 € (Kranken-/Pflegeversicherung) und 101.400 € (Renten-/Arbeitslosenversicherung), monatlich 5.812,50 € und 8.450 €. Plus Versicherungspflichtgrenze 77.400 € und was die Grenzen netto bedeuten.",
  keywords: [
    "beitragsbemessungsgrenze 2026",
    "beitragsbemessungsgrenze krankenversicherung 2026",
    "beitragsbemessungsgrenze rentenversicherung 2026",
    "versicherungspflichtgrenze 2026",
    "jahresarbeitsentgeltgrenze 2026",
    "bbg 2026",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Beitragsbemessungsgrenze 2026 — alle Grenzwerte auf einen Blick",
    description:
      "69.750 € für KV/PV, 101.400 € für RV/ALV, Versicherungspflichtgrenze 77.400 €. Mit Netto-Beispielen aus dem Rechner.",
    url: CANONICAL,
    type: "article",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
    images: [`${BASE}/og-image.png`],
  },
  twitter: {
    card: "summary",
    title: "Beitragsbemessungsgrenze 2026: 69.750 € & 101.400 €",
    description: "Alle Grenzwerte 2026 inkl. Versicherungspflichtgrenze und Netto-Wirkung.",
  },
};

/** Ab welchem Brutto greift welche Grenze — mit echtem Netto aus der Engine. */
const BEISPIELE = [5000, 5812.5, 7000, 8450, 10000];

export default function BeitragsbemessungsgrenzePage() {
  const beispiele = BEISPIELE.map((bruttoMonat) => {
    const r = calculateNetto({
      bruttoMonat,
      jahr: 2026,
      verheiratet: false,
      kinderlosUeber23: false,
      kirche: false,
      steuerklasse: 1,
    });
    return {
      bruttoMonat,
      nettoMonat: r.nettoMonat,
      svMonat: r.sv.summeMonat,
      kvGedeckelt: bruttoMonat * 12 > BBG_KV_PV_JAHR,
      rvGedeckelt: bruttoMonat * 12 > BBG_RV_ALV_JAHR,
    };
  });

  const grenzen = [
    {
      titel: "Kranken- und Pflegeversicherung",
      jahr: BBG_KV_PV_JAHR,
      monat: BBG_KV_PV_JAHR / 12,
      vorjahr: 66150,
      hinweis: "Gilt bundeseinheitlich für GKV und soziale Pflegeversicherung.",
    },
    {
      titel: "Renten- und Arbeitslosenversicherung",
      jahr: BBG_RV_ALV_JAHR,
      monat: BBG_RV_ALV_JAHR / 12,
      vorjahr: 96600,
      hinweis: "Seit 2025 bundeseinheitlich — keine Trennung West/Ost mehr.",
    },
  ];

  const faqs = [
    {
      q: "Was ist die Beitragsbemessungsgrenze?",
      a:
        "Die Beitragsbemessungsgrenze ist der Betrag, bis zu dem Ihr Bruttoeinkommen für Sozialversicherungsbeiträge herangezogen wird. Was Sie darüber hinaus verdienen, bleibt beitragsfrei — der Beitrag steigt also nicht weiter. 2026 liegt die Grenze bei " +
        eur(BBG_KV_PV_JAHR) +
        " im Jahr für die Kranken- und Pflegeversicherung und bei " +
        eur(BBG_RV_ALV_JAHR) +
        " für die Renten- und Arbeitslosenversicherung. Festgelegt werden die Werte jährlich in der Sozialversicherungsrechengrößen-Verordnung.",
    },
    {
      q: "Wie hoch ist die Beitragsbemessungsgrenze 2026 im Monat?",
      a:
        "Monatlich sind das " +
        formatEUR(BBG_KV_PV_JAHR / 12) +
        " für die Kranken- und Pflegeversicherung und " +
        formatEUR(BBG_RV_ALV_JAHR / 12) +
        " für die Renten- und Arbeitslosenversicherung. Wer mehr verdient, zahlt auf den übersteigenden Teil keine Beiträge mehr — der Nettozuwachs pro zusätzlichem Euro Brutto fällt oberhalb der Grenze daher spürbar höher aus.",
    },
    {
      q: "Was ist der Unterschied zur Versicherungspflichtgrenze?",
      a:
        "Die Beitragsbemessungsgrenze begrenzt die Höhe der Beiträge, die Versicherungspflichtgrenze (Jahresarbeitsentgeltgrenze, JAEG) entscheidet dagegen, ob Sie die gesetzliche Krankenversicherung überhaupt verlassen dürfen. 2026 liegt die JAEG bei " +
        eur(JAEG_JAHR) +
        " im Jahr. Erst wer regelmäßig darüber verdient, kann in die private Krankenversicherung wechseln. Für Personen, die bereits Ende 2002 privat versichert waren, gilt die ermäßigte Grenze von " +
        eur(JAEG_BESTAND_JAHR) +
        ".",
    },
    {
      q: "Warum steigt die Beitragsbemessungsgrenze jedes Jahr?",
      a:
        "Die Grenzen werden an die allgemeine Lohnentwicklung des vorvergangenen Jahres gekoppelt. Für 2026 bedeutet das einen Anstieg von " +
        eur(66150) +
        " auf " +
        eur(BBG_KV_PV_JAHR) +
        " bei KV/PV (+5,4 %) und von " +
        eur(96600) +
        " auf " +
        eur(BBG_RV_ALV_JAHR) +
        " bei RV/ALV (+5,0 %). Für Gutverdiener steigen dadurch die Sozialabgaben, auch wenn sich am Beitragssatz selbst nichts ändert.",
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
      { "@type": "ListItem", position: 2, name: "Beitragsbemessungsgrenze 2026", item: CANONICAL },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": CANONICAL,
    url: CANONICAL,
    name: "Beitragsbemessungsgrenze 2026",
    inLanguage: "de-DE",
    dateModified: siteConfig.lastUpdatedISO,
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
          <span className="text-[#16181D] font-medium">Beitragsbemessungsgrenze 2026</span>
        </nav>

        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E60A1C]/10 border border-[#E60A1C]/25 text-[#E60A1C] text-xs font-bold mb-4">
            <ShieldCheck size={14} />
            Rechengrößen 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#16181D] leading-tight mb-3">
            Beitragsbemessungsgrenze 2026: {eur(BBG_KV_PV_JAHR)} und {eur(BBG_RV_ALV_JAHR)}
          </h1>
          <p className="text-base sm:text-lg text-black/70 leading-relaxed max-w-3xl">
            Bis zu diesen Beträgen werden Sozialversicherungsbeiträge erhoben. Alles, was Sie darüber
            hinaus verdienen, bleibt beitragsfrei — pro zusätzlichem Euro Brutto bleibt oberhalb der
            Grenze also deutlich mehr netto übrig.
          </p>
          <div className="mt-4">
            <ReviewerByline />
          </div>
        </header>

        {/* ── Die beiden Grenzen ────────────────────────────────────── */}
        <section className="grid md:grid-cols-2 gap-4 mb-10">
          {grenzen.map((g) => (
            <div key={g.titel} className="bg-white border border-black/[0.08] rounded-2xl p-5 shadow-sm">
              <div className="text-[10px] font-mono uppercase tracking-widest text-black/45 mb-2">
                {g.titel}
              </div>
              <div className="text-3xl font-extrabold text-[#16181D] tabular-nums mb-1">{eur(g.jahr)}</div>
              <div className="text-sm text-black/60 mb-3">
                im Jahr · <strong className="text-[#16181D]">{formatEUR(g.monat)}</strong> im Monat
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#0E9F6E] font-semibold mb-2">
                <TrendingUp size={13} />
                von {eur(g.vorjahr)} in 2025 (+
                {(((g.jahr - g.vorjahr) / g.vorjahr) * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 })} %)
              </div>
              <p className="text-xs text-black/55 leading-relaxed">{g.hinweis}</p>
            </div>
          ))}
        </section>

        {/* ── Abgrenzung JAEG ───────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-3">
            Nicht verwechseln: Versicherungspflichtgrenze
          </h2>
          <div className="bg-black/[0.03] border border-black/[0.10] rounded-2xl p-5">
            <p className="text-sm sm:text-base text-black/75 leading-relaxed mb-4">
              Die Beitragsbemessungsgrenze begrenzt die <strong className="text-[#16181D]">Höhe der
              Beiträge</strong>. Die Versicherungspflichtgrenze (Jahresarbeitsentgeltgrenze, JAEG)
              entscheidet dagegen, <strong className="text-[#16181D]">ob Sie die GKV verlassen
              dürfen</strong> — beide Zahlen sind unterschiedlich.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-white border border-black/[0.08] rounded-xl p-4">
                <div className="text-xs text-black/50 mb-1">Versicherungspflichtgrenze 2026</div>
                <div className="text-xl font-extrabold text-[#16181D] tabular-nums">{eur(JAEG_JAHR)}</div>
                <div className="text-xs text-black/50 mt-1">{formatEUR(JAEG_JAHR / 12)} im Monat</div>
              </div>
              <div className="bg-white border border-black/[0.08] rounded-xl p-4">
                <div className="text-xs text-black/50 mb-1">Ermäßigt (privat vor 2003)</div>
                <div className="text-xl font-extrabold text-[#16181D] tabular-nums">{eur(JAEG_BESTAND_JAHR)}</div>
                <div className="text-xs text-black/50 mt-1">{formatEUR(JAEG_BESTAND_JAHR / 12)} im Monat</div>
              </div>
            </div>
            <Link
              href="/private-krankenversicherung-vs-gesetzlich"
              className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-[#E60A1C] hover:underline"
            >
              PKV oder GKV — was lohnt sich?
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* ── Netto-Wirkung ─────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-2">
            Was die Grenzen konkret bedeuten
          </h2>
          <p className="text-sm text-black/60 mb-5 max-w-3xl">
            Steuerklasse I, ohne Kirchensteuer, mit Kindern. Sobald eine Grenze erreicht ist, wächst der
            entsprechende Beitrag nicht weiter mit.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-black/[0.08] bg-white shadow-sm">
            <table className="w-full text-sm min-w-[620px]">
              <thead>
                <tr className="bg-black/[0.03] text-left">
                  <th className="px-4 py-3 font-bold text-[#16181D]">Brutto / Monat</th>
                  <th className="px-4 py-3 font-bold text-[#16181D] text-right">Sozialabgaben / Monat</th>
                  <th className="px-4 py-3 font-bold text-[#16181D] text-right">Netto / Monat</th>
                  <th className="px-4 py-3 font-bold text-[#16181D]">Status</th>
                </tr>
              </thead>
              <tbody>
                {beispiele.map((b) => (
                  <tr key={b.bruttoMonat} className="border-t border-black/[0.06]">
                    <td className="px-4 py-3 font-semibold text-[#16181D] tabular-nums">
                      {formatEUR(b.bruttoMonat)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-mono text-black/85">
                      {formatEUR(b.svMonat)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-mono font-semibold text-[#16181D]">
                      {formatEUR(b.nettoMonat)}
                    </td>
                    <td className="px-4 py-3 text-xs text-black/60">
                      {b.rvGedeckelt
                        ? "KV/PV und RV/ALV gedeckelt"
                        : b.kvGedeckelt
                        ? "KV/PV gedeckelt"
                        : "unter beiden Grenzen"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-black/45 mt-3 flex items-start gap-1.5">
            <Info size={13} className="flex-shrink-0 mt-0.5" />
            Berechnet mit derselben Engine wie der Hauptrechner. Stand: {siteConfig.lastUpdatedDisplay}.
          </p>
        </section>

        {/* ── Weiterführend ─────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-4">Passende Rechner</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: "/", label: "Brutto-Netto-Rechner 2026", desc: "Nettogehalt mit allen Grenzen" },
              { href: "/brutto-netto-rechner-krankenkasse", label: "Krankenkassen-Vergleich", desc: "Zusatzbeiträge 2026" },
              { href: "/arbeitgeber-brutto-netto-rechner", label: "Arbeitgeberkosten", desc: "AG-Anteil bis zur BBG" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group flex items-center justify-between gap-3 bg-white border border-black/[0.08] rounded-2xl p-4 hover:border-[#E60A1C]/40 hover:shadow-md transition-all"
              >
                <div className="min-w-0">
                  <div className="font-bold text-sm text-[#16181D] group-hover:text-[#E60A1C] transition-colors">
                    {l.label}
                  </div>
                  <div className="text-xs text-black/50 mt-0.5">{l.desc}</div>
                </div>
                <Wallet2 size={16} className="text-black/30 group-hover:text-[#E60A1C] flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-extrabold text-[#16181D] mb-5">Häufige Fragen</h2>
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
