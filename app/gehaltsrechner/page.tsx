import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator as CalcIcon, ArrowRight, ChevronRight, Sparkles,
  Wallet, TrendingUp, ShieldCheck, BarChart3,
} from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import Calculator from "@/components/Calculator";
import AccordionFaq from "@/components/AccordionFaq";
import ReviewerByline from "@/components/ReviewerByline";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Gehaltsrechner 2026/2027 — Brutto Netto Gehalt berechnen (kostenlos)",
  description:
    "Kostenloser Gehaltsrechner 2026/2027: Berechnen Sie Ihr Nettogehalt aus dem Brutto — Lohnsteuer, Soli, Sozialabgaben & alle 6 Steuerklassen. Netto-Gehaltsrechner ohne Anmeldung, aktuell für Deutschland.",
  keywords: [
    "gehaltsrechner",
    "gehaltsrechner 2026",
    "gehaltsrechner 2025",
    "gehaltsrechner 2027",
    "gehalt rechner",
    "gehaltsrechner brutto netto",
    "netto gehaltsrechner",
    "gehalt brutto netto rechner",
    "brutto netto gehaltsrechner",
    "gehalt berechnen",
    "nettogehalt berechnen",
    "gehaltsrechner deutschland",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/gehaltsrechner" },
  openGraph: {
    title: "Gehaltsrechner 2026/2027 — Brutto Netto Gehalt berechnen",
    description:
      "Nettogehalt aus dem Bruttogehalt berechnen: Lohnsteuer, Soli, Sozialabgaben & alle 6 Steuerklassen. Kostenloser Gehaltsrechner für 2026 & 2027.",
    url: "https://bruttonettocalculator.com/gehaltsrechner",
    locale: "de_DE",
    type: "website",
    siteName: "BruttoNettoCalculator.com",
  },
};

/* Reference salaries computed server-side for a genuinely useful comparison table */
const REFERENCE_SALARIES = [2500, 3000, 3500, 4000, 4500, 5000, 6000];

const faqs = [
  {
    q: "Was macht ein Gehaltsrechner?",
    a: "Ein Gehaltsrechner ermittelt aus Ihrem Bruttogehalt das tatsächliche Nettogehalt, das nach allen Abzügen auf Ihrem Konto landet. Abgezogen werden die Lohnsteuer (Einkommensteuer nach § 32a EStG), der Solidaritätszuschlag, ggf. die Kirchensteuer sowie die Arbeitnehmeranteile zur Renten-, Kranken-, Pflege- und Arbeitslosenversicherung. Unser Netto-Gehaltsrechner rechnet dabei mit den amtlichen Werten für 2026.",
  },
  {
    q: "Wie berechne ich mein Nettogehalt aus dem Brutto?",
    a: "Geben Sie im Gehaltsrechner Ihr monatliches Bruttogehalt ein und wählen Sie Steuerklasse, Bundesland, Kirchensteuer-Pflicht und Kinderfreibeträge. Der Rechner zieht zunächst die Sozialabgaben ab, ermittelt das zu versteuernde Einkommen und berechnet daraus die Lohnsteuer. Das Ergebnis ist Ihr exaktes Nettogehalt pro Monat und Jahr.",
  },
  {
    q: "Welches Nettogehalt bleibt bei 3.000 € brutto?",
    a: "Bei 3.000 € brutto im Monat bleiben in Steuerklasse I (ledig, ohne Kirchensteuer) 2026 rund 2.150 € netto übrig. Der genaue Betrag hängt von Steuerklasse, Bundesland und Krankenkassen-Zusatzbeitrag ab — nutzen Sie den Gehaltsrechner oben, um Ihren individuellen Wert zu ermitteln.",
  },
  {
    q: "Ist der Gehaltsrechner für 2025, 2026 und 2027 aktuell?",
    a: "Ja. Der Gehaltsrechner arbeitet mit den amtlichen Rechengrößen für das Steuerjahr 2026 (§ 32a EStG i.d.F. ab 2026) und bietet zusätzlich eine Vorschau auf 2027. Für 2025 gelten leicht abweichende Grundfreibeträge; die Grundstruktur der Berechnung bleibt identisch.",
  },
  {
    q: "Berücksichtigt der Gehaltsrechner den Krankenkassen-Zusatzbeitrag?",
    a: "Ja. Der durchschnittliche GKV-Zusatzbeitrag von ca. 2,9 % (2026) ist bereits eingerechnet. Kassen wie AOK, TK, Barmer, DAK oder BKK haben individuelle Zusatzbeiträge — diese beeinflussen Ihr Nettogehalt um wenige Euro pro Monat.",
  },
  {
    q: "Ist der Netto-Gehaltsrechner kostenlos und anonym?",
    a: "Ja, der Gehaltsrechner ist zu 100 % kostenlos, erfordert keine Anmeldung und speichert keine persönlichen Daten. Alle Berechnungen laufen direkt in Ihrem Browser — DSGVO-konform und ohne Weitergabe an Dritte.",
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
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Gehaltsrechner", item: "https://bruttonettocalculator.com/gehaltsrechner" },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Gehaltsrechner 2026/2027 Deutschland",
  url: "https://bruttonettocalculator.com/gehaltsrechner",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  description:
    "Kostenloser Netto-Gehaltsrechner für Deutschland — Bruttogehalt in Nettogehalt umrechnen nach § 32a EStG 2026 mit allen 6 Steuerklassen.",
};

export default function GehaltsrechnerPage() {
  const rows = REFERENCE_SALARIES.map((brutto) => {
    const sk1 = calculateNetto({ bruttoMonat: brutto, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 });
    const sk3 = calculateNetto({ bruttoMonat: brutto, jahr: 2026, verheiratet: true, kinderlosUeber23: true, kirche: false, steuerklasse: 3 });
    return { brutto, netto1: sk1.nettoMonat, netto3: sk3.nettoMonat, quote: (sk1.nettoMonat / brutto) * 100 };
  });

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-24 text-[#16181D]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Gehaltsrechner</span>
      </div>

      {/* Hero */}
      <div className="mb-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-5">
          <CalcIcon size={14} /> Gehaltsrechner · Steuerjahr 2026/2027
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-5 max-w-4xl">
          <span className="text-gradient-accent">Gehaltsrechner</span> 2026: Brutto Netto Gehalt berechnen
        </h1>
        <p className="text-lg sm:text-xl text-black/80 max-w-3xl leading-relaxed mb-6">
          Mit unserem kostenlosen <strong className="text-[#16181D]">Gehaltsrechner</strong> ermitteln Sie in Sekunden Ihr
          exaktes <strong className="text-[#16181D]">Nettogehalt</strong> aus dem Bruttogehalt — inklusive Lohnsteuer,
          Solidaritätszuschlag und aller Sozialabgaben. Der <strong className="text-[#16181D]">Netto-Gehaltsrechner</strong>{" "}
          rechnet nach den amtlichen Werten für 2026 und 2027, in allen 6 Steuerklassen.
        </p>
        <ReviewerByline />
      </div>

      {/* Calculator */}
      <section id="rechner" className="mb-14 scroll-mt-24">
        <Calculator />
      </section>

      <AdUnit placement="content" className="!my-0 !mb-14 !px-0" />

      {/* Reference salary table */}
      <section className="mb-16">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-[#E60A1C]/10 border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-2">
            <BarChart3 size={13} /> Gehaltstabelle 2026
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D]">
            Brutto-Netto-Gehalt im Überblick
          </h2>
          <p className="text-sm sm:text-base text-black/70 mt-1">
            So viel Nettogehalt bleibt 2026 bei gängigen Bruttogehältern (monatlich, ohne Kirchensteuer).
          </p>
        </div>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Brutto / Monat</th>
                <th className="py-4 px-5 text-right">Netto Steuerklasse I</th>
                <th className="py-4 px-5 text-right">Netto Steuerklasse III</th>
                <th className="py-4 px-5 text-right">Netto-Quote</th>
                <th className="py-4 px-5 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {rows.map((r) => (
                <tr key={r.brutto} className="hover:bg-black/[0.04] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#16181D] font-mono">{formatEUR(r.brutto)}</td>
                  <td className="py-4 px-5 text-right font-mono text-[#16181D] font-semibold">{formatEUR(r.netto1)}</td>
                  <td className="py-4 px-5 text-right font-mono text-emerald-600 font-semibold">{formatEUR(r.netto3)}</td>
                  <td className="py-4 px-5 text-right font-mono text-black/70">{r.quote.toFixed(1).replace(".", ",")} %</td>
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
      </section>

      {/* SEO content */}
      <section className="mb-16 grid md:grid-cols-3 gap-6">
        {[
          { Icon: Wallet, title: "Netto aus Brutto", text: "Der Gehaltsrechner zieht Sozialabgaben und Lohnsteuer vom Bruttogehalt ab und zeigt Ihr Netto pro Monat und Jahr — exakt nach § 32a EStG 2026." },
          { Icon: TrendingUp, title: "Alle 6 Steuerklassen", text: "Vergleichen Sie das Nettogehalt in Steuerklasse I bis VI. Besonders für Verheiratete lohnt der Wechsel zwischen III/V und IV/IV." },
          { Icon: ShieldCheck, title: "Amtliche Werte", text: "Grundfreibetrag, Beitragsbemessungsgrenzen und Beitragssätze entsprechen den offiziellen Rechengrößen 2026 — inkl. GKV-Zusatzbeitrag." },
        ].map(({ Icon, title, text }) => (
          <div key={title} className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-7 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-[#E60A1C]/15 border border-[#E60A1C]/30 flex items-center justify-center mb-4">
              <Icon size={22} className="text-[#E60A1C]" />
            </div>
            <h3 className="font-display font-extrabold text-lg text-[#16181D] mb-2">{title}</h3>
            <p className="text-sm text-black/75 leading-relaxed">{text}</p>
          </div>
        ))}
      </section>

      <section className="mb-16 bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/75 text-sm sm:text-base leading-relaxed space-y-5">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Gehaltsrechner 2026: So funktioniert die Netto-Berechnung
        </h2>
        <p>
          Vom <strong className="text-[#16181D]">Bruttogehalt zum Nettogehalt</strong> führt ein klarer Weg: Zunächst
          werden die <strong className="text-[#16181D]">Sozialabgaben</strong> abgezogen — der Arbeitnehmeranteil zur
          Rentenversicherung (9,3 %), Krankenversicherung (ca. 8,7 % inkl. Zusatzbeitrag), Pflegeversicherung (1,8 % bzw.
          2,4 % für Kinderlose) und Arbeitslosenversicherung (1,3 %). Auf das verbleibende zu versteuernde Einkommen
          berechnet der Gehaltsrechner die <strong className="text-[#16181D]">Lohnsteuer</strong> nach dem
          Einkommensteuertarif § 32a EStG, zuzüglich Solidaritätszuschlag und ggf. Kirchensteuer.
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-[#16181D]">Warum das Nettogehalt bei gleichem Brutto unterschiedlich ist</h3>
        <p>
          Zwei Personen mit identischem Bruttogehalt können sehr unterschiedliche Nettogehälter haben. Entscheidend sind
          die <strong className="text-[#16181D]">Steuerklasse</strong>, die Kirchensteuer-Pflicht, das Bundesland (wegen
          unterschiedlicher Kirchensteuersätze und des Pflegeversicherungs-Sonderfalls Sachsen), Kinderfreibeträge sowie
          der individuelle Zusatzbeitrag der Krankenkasse. Unser <strong className="text-[#16181D]">Netto-Gehaltsrechner</strong>{" "}
          berücksichtigt all diese Faktoren.
        </p>
        <p>
          Sie möchten wissen, wie viel netto bei einem konkreten Betrag übrig bleibt? Nutzen Sie unsere Detailseiten wie{" "}
          <Link href="/rechner/3000-euro-brutto-netto" className="text-[#E60A1C] font-semibold hover:underline">3.000 € brutto in netto</Link>,{" "}
          <Link href="/rechner/4000-euro-brutto-netto" className="text-[#E60A1C] font-semibold hover:underline">4.000 € brutto in netto</Link> oder{" "}
          <Link href="/rechner/5000-euro-brutto-netto" className="text-[#E60A1C] font-semibold hover:underline">5.000 € brutto in netto</Link>.
        </p>
      </section>

      {/* Related tools */}
      <section className="mb-16">
        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#16181D] mb-6 flex items-center gap-2">
          <Sparkles className="text-[#E60A1C]" size={20} /> Weitere Rechner
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/lohnsteuerrechner", label: "Lohnsteuerrechner", desc: "Lohnsteuer & Nettolohn berechnen" },
            { href: "/einkommensteuer-rechner", label: "Einkommensteuer-Rechner", desc: "Jahressteuer nach § 32a EStG" },
            { href: "/steuerklassen", label: "Steuerklassen-Vergleich", desc: "Alle 6 Klassen im Detail" },
            { href: "/stundenlohn-rechner", label: "Stundenlohn-Rechner", desc: "Netto pro Stunde" },
            { href: "/firmenwagenrechner", label: "Firmenwagenrechner", desc: "1%-Regelung & Dienstwagen" },
            { href: "/rentenrechner", label: "Rentenrechner", desc: "Rente & Beitrag berechnen" },
          ].map((t) => (
            <Link key={t.href} href={t.href} className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 hover:border-[#E60A1C]/50 transition-all group">
              <div className="font-bold text-[#16181D] mb-1 group-hover:text-[#E60A1C] transition-colors">{t.label}</div>
              <div className="text-xs text-black/60">{t.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-4">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8 text-center">
          Häufige Fragen zum Gehaltsrechner
        </h2>
        <AccordionFaq faqs={faqs} />
      </section>
    </main>
  );
}
