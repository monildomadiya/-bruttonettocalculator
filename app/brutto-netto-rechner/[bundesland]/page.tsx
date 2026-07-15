import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calculator as CalcIcon, ChevronRight, MapPin, BarChart3,
  Sparkles, ShieldCheck, ArrowRight, Info,
} from "lucide-react";
import { calculateNetto, formatEUR, Steuerklasse } from "@/lib/taxCalculator";
import { BUNDESLAENDER, getBundeslandBySlug, Bundesland } from "@/data/bundeslaender";
import Calculator from "@/components/Calculator";
import ReviewerByline from "@/components/ReviewerByline";
import AccordionFaq from "@/components/AccordionFaq";
import AdUnit from "@/components/AdUnit";

export const revalidate = 0;

interface PageProps {
  params: { bundesland: string };
}

const REFERENCE_SALARIES = [2500, 3000, 3500, 4000, 4500, 5000, 6000];

export async function generateStaticParams() {
  return BUNDESLAENDER.map((b) => ({ bundesland: b.slug }));
}

function nettoFor(bl: Bundesland, brutto: number, sk: Steuerklasse, kirche: boolean) {
  return calculateNetto({
    bruttoMonat: brutto,
    jahr: 2026,
    verheiratet: sk === 3 || sk === 4 || sk === 5,
    kinderlosUeber23: true,
    kirche,
    kirchensteuerSatz: bl.kirchensteuerSatz,
    steuerklasse: sk,
    sachsen: bl.sachsen,
  }).nettoMonat;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const bl = getBundeslandBySlug(params.bundesland);
  if (!bl) return { title: "Bundesland nicht gefunden" };

  const netto = nettoFor(bl, 4000, 1, false);
  const nettoFmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(netto);
  const canonical = `https://bruttonettocalculator.com/brutto-netto-rechner/${bl.slug}`;
  const aliasPart = bl.alias ? ` (${bl.alias})` : "";

  const title = `Brutto-Netto-Rechner ${bl.name}${aliasPart} 2026 — Nettogehalt berechnen`;
  const description = `Brutto-Netto-Rechner für ${bl.name}: Nettogehalt 2026 mit dem in ${bl.name} gültigen Kirchensteuersatz von ${(bl.kirchensteuerSatz * 100).toFixed(0)} % berechnen. 4.000 € brutto ergeben ca. ${nettoFmt} netto (Steuerklasse I). Kostenlos & sofort.`;

  const kwBase = [
    `brutto netto rechner ${bl.name.toLowerCase()}`,
    `${bl.name.toLowerCase()} brutto netto rechner`,
    `netto brutto rechner ${bl.name.toLowerCase()}`,
    `gehaltsrechner ${bl.name.toLowerCase()}`,
    `nettogehalt ${bl.name.toLowerCase()}`,
    `brutto netto ${bl.name.toLowerCase()}`,
  ];
  if (bl.alias) {
    const a = bl.alias.toLowerCase();
    kwBase.push(`brutto netto rechner ${a}`, `${a} brutto netto rechner`, `gehaltsrechner ${a}`);
  }

  return {
    title,
    description,
    keywords: kwBase,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: "de_DE",
      siteName: "BruttoNettoCalculator.com",
    },
  };
}

const SK_LABEL: Record<number, string> = {
  1: "Steuerklasse I",
  3: "Steuerklasse III",
};

export default function BundeslandPage({ params }: PageProps) {
  const bl = getBundeslandBySlug(params.bundesland);
  if (!bl) notFound();

  const kirchePct = (bl.kirchensteuerSatz * 100).toFixed(0);
  const canonical = `https://bruttonettocalculator.com/brutto-netto-rechner/${bl.slug}`;

  const rows = REFERENCE_SALARIES.map((brutto) => ({
    brutto,
    nettoSK1: nettoFor(bl, brutto, 1, false),
    nettoSK1Kirche: nettoFor(bl, brutto, 1, true),
    nettoSK3: nettoFor(bl, brutto, 3, false),
  }));

  const others = BUNDESLAENDER.filter((b) => b.slug !== bl.slug);

  const faqs = [
    {
      q: `Unterscheidet sich das Nettogehalt ${bl.praep} vom Rest Deutschlands?`,
      a: `Lohnsteuer, Solidaritätszuschlag und die Sozialversicherungsbeiträge sind bundeseinheitlich. Der einzige regionale Unterschied ist die Kirchensteuer: ${bl.praep} beträgt sie ${kirchePct} %${
        bl.kirchensteuerSatz === 0.08 ? " (der ermäßigte Satz, den nur Bayern und Baden-Württemberg anwenden)" : ""
      }.${bl.sachsen ? " Zusätzlich tragen Arbeitnehmer in Sachsen einen um 0,5 % höheren Eigenanteil an der Pflegeversicherung." : ""} Für Arbeitnehmer ohne Kirchensteuer ist das Nettogehalt daher praktisch identisch mit dem in anderen Bundesländern.`,
    },
    {
      q: `Wie hoch ist die Kirchensteuer ${bl.praep}?`,
      a: `${bl.praep} beträgt der Kirchensteuersatz ${kirchePct} % der Lohnsteuer. ${
        bl.kirchensteuerSatz === 0.08
          ? "Das ist der ermäßigte Satz von 8 %, der bundesweit nur in Bayern und Baden-Württemberg gilt — in allen anderen Ländern sind es 9 %."
          : "Das entspricht dem Regelsatz von 9 %, der in 14 der 16 Bundesländer gilt (nur Bayern und Baden-Württemberg haben 8 %)."
      }`,
    },
    {
      q: `Welches Nettogehalt bleibt bei 4.000 € brutto ${bl.praep}?`,
      a: `Bei 4.000 € Bruttogehalt im Monat bleiben ${bl.praep} in Steuerklasse I (ledig, ohne Kirchensteuer) 2026 rund ${formatEUR(
        nettoFor(bl, 4000, 1, false)
      )} netto. Mit Kirchensteuer (${kirchePct} %) sind es etwa ${formatEUR(nettoFor(bl, 4000, 1, true))}.`,
    },
    {
      q: "Ist der Brutto-Netto-Rechner kostenlos?",
      a: "Ja, der Rechner ist zu 100 % kostenlos, erfordert keine Anmeldung und speichert keine Daten. Die Berechnung erfolgt nach den amtlichen Werten für 2026 (§ 32a EStG).",
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
      { "@type": "ListItem", position: 2, name: "Brutto-Netto-Rechner nach Bundesland", item: "https://bruttonettocalculator.com/brutto-netto-rechner/bayern" },
      { "@type": "ListItem", position: 3, name: bl.name, item: canonical },
    ],
  };
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Brutto-Netto-Rechner ${bl.name} 2026`,
    url: canonical,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0.00", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
    description: `Kostenloser Brutto-Netto-Rechner für ${bl.name} — Nettogehalt 2026 mit dem regionalen Kirchensteuersatz von ${kirchePct} % berechnen.`,
  };

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-24 text-[#16181D]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium flex-wrap">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/50">Bundesland</span>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">{bl.name}</span>
      </div>

      {/* Hero */}
      <div className="mb-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-5">
          <MapPin size={14} /> {bl.name} · Steuerjahr 2026
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-5 max-w-4xl">
          <span className="text-gradient-accent">Brutto-Netto-Rechner</span> {bl.name}
        </h1>
        <p className="text-lg sm:text-xl text-black/80 max-w-3xl leading-relaxed mb-6">
          Berechnen Sie Ihr <strong className="text-[#16181D]">Nettogehalt {bl.praep}</strong> für 2026 —
          mit dem regional gültigen <strong className="text-[#16181D]">Kirchensteuersatz von {kirchePct} %</strong>.
          Lohnsteuer, Soli und Sozialabgaben werden nach den amtlichen Werten (§ 32a EStG) berechnet.
        </p>
        <ReviewerByline />
      </div>

      <AdUnit placement="content" className="!my-0 !mb-10 !px-0" />

      {/* State context */}
      <section className="mb-14 bg-gradient-to-br from-[#F1F3F5] via-[#FFFFFF] to-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-9 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#E60A1C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 text-[#E60A1C] font-bold text-sm sm:text-base mb-3">
          <MapPin size={18} /> {bl.name} · Landeshauptstadt {bl.hauptstadt}
        </div>
        <p className="text-base sm:text-lg text-black/85 leading-relaxed">{bl.kontext}</p>
      </section>

      {/* Reference table */}
      <section className="mb-16">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-[#E60A1C]/10 border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-2">
            <BarChart3 size={13} /> Netto-Tabelle {bl.name} 2026
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D]">
            Brutto-Netto-Tabelle für {bl.name}
          </h2>
          <p className="text-sm sm:text-base text-black/70 mt-1">
            Monatliches Nettogehalt bei gängigen Bruttogehältern (Steuerklasse I, Kirchensteuer {kirchePct} % {bl.praep}).
          </p>
        </div>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Brutto / Monat</th>
                <th className="py-4 px-5 text-right">Netto SK I (ohne Kirche)</th>
                <th className="py-4 px-5 text-right">Netto SK I (mit Kirche {kirchePct} %)</th>
                <th className="py-4 px-5 text-right">Netto SK III</th>
                <th className="py-4 px-5 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {rows.map((r) => (
                <tr key={r.brutto} className="hover:bg-black/[0.04] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#16181D] font-mono">{formatEUR(r.brutto)}</td>
                  <td className="py-4 px-5 text-right font-mono text-[#16181D] font-semibold">{formatEUR(r.nettoSK1)}</td>
                  <td className="py-4 px-5 text-right font-mono text-black/70">{formatEUR(r.nettoSK1Kirche)}</td>
                  <td className="py-4 px-5 text-right font-mono text-emerald-600 font-semibold">{formatEUR(r.nettoSK3)}</td>
                  <td className="py-4 px-5 text-right">
                    <Link href={`/rechner/${r.brutto}-euro-brutto-netto`} className="text-xs font-bold text-[#E60A1C] hover:underline inline-flex items-center gap-1">
                      Details <ArrowRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3 flex items-start gap-1.5">
          <Info size={13} className="flex-shrink-0 mt-0.5" />
          Vereinfachte Berechnung für einen ersten Überblick (Steuerklasse I, kinderlos ab 23, GKV-Zusatzbeitrag Ø 2,9 %). Keine Steuerberatung.
        </p>
      </section>

      <AdUnit placement="content" className="!my-0 !mb-14 !px-0" />

      {/* Interactive calculator */}
      <section id="rechner" className="mb-16 scroll-mt-24">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
            Interaktiver Brutto-Netto-Rechner {bl.name}
          </h2>
          <p className="text-black/70 text-sm sm:text-base">
            Geben Sie Ihr Bruttogehalt ein und passen Sie Steuerklasse, Kirchensteuer und Kinderfreibeträge an:
          </p>
        </div>
        <Calculator initialBrutto={4000} initialJahr={2026} initialSk={1} />
      </section>

      {/* SEO explainer */}
      <section className="mb-16 bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/75 text-sm sm:text-base leading-relaxed space-y-5">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Nettogehalt {bl.praep}: Was das Bundesland beeinflusst
        </h2>
        <p>
          In Deutschland sind <strong className="text-[#16181D]">Lohnsteuer</strong>,{" "}
          <strong className="text-[#16181D]">Solidaritätszuschlag</strong> und die{" "}
          <strong className="text-[#16181D]">Sozialversicherungsbeiträge</strong> bundeseinheitlich geregelt.
          Der wesentliche regionale Unterschied beim Nettogehalt ist die{" "}
          <strong className="text-[#16181D]">Kirchensteuer</strong>: {bl.praep} beträgt sie{" "}
          <strong className="text-[#16181D]">{kirchePct} %</strong> der Lohnsteuer
          {bl.kirchensteuerSatz === 0.08
            ? " — der ermäßigte Satz, den bundesweit nur Bayern und Baden-Württemberg anwenden."
            : ", wie in 14 der 16 Bundesländer."}
        </p>
        {bl.sachsen && (
          <p>
            Eine Besonderheit gilt in <strong className="text-[#16181D]">Sachsen</strong>: Bei der{" "}
            <strong className="text-[#16181D]">Pflegeversicherung</strong> tragen Arbeitnehmer einen um{" "}
            <strong className="text-[#16181D]">0,5 %</strong> höheren Eigenanteil als im Rest Deutschlands, weil
            zum Ausgleich der Feiertag Buß- und Bettag erhalten blieb. Das Netto fällt dadurch minimal geringer aus.
          </p>
        )}
        <p>
          Wer keiner steuererhebenden Religionsgemeinschaft angehört, zahlt keine Kirchensteuer — für diese
          Arbeitnehmer ist das Nettogehalt {bl.praep} praktisch identisch mit dem in jedem anderen Bundesland.
          Nutzen Sie den <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Gehaltsrechner</Link>{" "}
          oder den <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">Brutto-Netto-Rechner</Link>{" "}
          oben, um Ihren individuellen Wert zu ermitteln.
        </p>
      </section>

      {/* Other Bundesländer — internal link mesh */}
      <section className="mb-16">
        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
          <MapPin className="text-[#E60A1C]" size={20} /> Brutto-Netto-Rechner für andere Bundesländer
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/brutto-netto-rechner/${o.slug}`}
              className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl px-4 py-3 hover:border-[#E60A1C]/50 transition-all group flex items-center gap-2"
            >
              <MapPin size={14} className="text-[#E60A1C]/70 flex-shrink-0" />
              <span className="font-semibold text-sm text-[#16181D] group-hover:text-[#E60A1C] transition-colors truncate">{o.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Related tools */}
      <section className="mb-16">
        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
          <Sparkles className="text-[#E60A1C]" size={20} /> Weitere Rechner
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/gehaltsrechner", label: "Gehaltsrechner", desc: "Brutto Netto Gehalt 2026" },
            { href: "/lohnsteuerrechner", label: "Lohnsteuerrechner", desc: "Lohnsteuer & Nettolohn" },
            { href: "/steuerklassen", label: "Steuerklassen", desc: "Alle 6 Klassen im Vergleich" },
            { href: "/arbeitgeber-brutto-netto-rechner", label: "Arbeitgeber-Rechner", desc: "Arbeitgeberkosten & -anteil" },
            { href: "/stundenlohn-rechner", label: "Stundenlohn-Rechner", desc: "Netto pro Stunde" },
            { href: "/firmenwagenrechner", label: "Firmenwagenrechner", desc: "1%-Regelung & Dienstwagen" },
          ].map((t) => (
            <Link key={t.href} href={t.href} className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 hover:border-[#E60A1C]/50 transition-all group">
              <div className="font-bold text-[#16181D] mb-1 group-hover:text-[#E60A1C] transition-colors">{t.label}</div>
              <div className="text-xs text-black/60">{t.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8 text-center flex items-center justify-center gap-2">
          <ShieldCheck className="text-[#E60A1C]" size={22} /> Häufige Fragen — Nettogehalt {bl.name}
        </h2>
        <AccordionFaq faqs={faqs} />
      </section>
    </main>
  );
}
