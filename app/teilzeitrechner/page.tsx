import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, ChevronRight, Sparkles, BarChart3 } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import Calculator from "@/components/Calculator";
import AccordionFaq from "@/components/AccordionFaq";
import ReviewerByline from "@/components/ReviewerByline";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Teilzeitrechner 2026 — Brutto Netto Gehalt bei Teilzeit berechnen",
  description:
    "Teilzeitrechner 2026: Berechnen Sie Ihr Nettogehalt bei Teilzeit — Brutto in Netto für 10, 20, 30 oder beliebige Wochenstunden. Kostenloser Brutto-Netto-Rechner für Teilzeit, alle Steuerklassen.",
  keywords: [
    "teilzeitrechner",
    "teilzeit rechner",
    "brutto netto rechner teilzeit",
    "teilzeit gehalt berechnen",
    "teilzeit netto",
    "gehalt teilzeit rechner",
    "stunden reduzieren gehalt rechner",
    "teilzeit brutto netto",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/teilzeitrechner" },
  openGraph: {
    title: "Teilzeitrechner 2026 — Netto-Gehalt bei Teilzeit berechnen",
    description:
      "Nettogehalt bei Teilzeit berechnen — Brutto in Netto für beliebige Wochenstunden. Kostenloser Teilzeitrechner 2026.",
    url: "https://bruttonettocalculator.com/teilzeitrechner",
    locale: "de_DE",
    type: "website",
    siteName: "BruttoNettoCalculator.com",
  },
};

const VOLLZEIT_STUNDEN = 40;
const VOLLZEIT_BRUTTO = 4000;
const TEILZEIT_STUFEN = [10, 15, 20, 25, 30, 35, 40];

const faqs = [
  {
    q: "Wie berechne ich mein Teilzeit-Gehalt?",
    a: "Das Teilzeit-Bruttogehalt ergibt sich anteilig aus den Wochenstunden: Teilzeit-Brutto = Vollzeit-Brutto × (Teilzeitstunden ÷ Vollzeitstunden). Bei 20 statt 40 Stunden erhalten Sie also das halbe Bruttogehalt. Der Teilzeitrechner ermittelt daraus über den amtlichen Steuertarif Ihr Nettogehalt.",
  },
  {
    q: "Warum ist das Teilzeit-Netto anteilig höher als das Vollzeit-Netto?",
    a: "Weil die Einkommensteuer progressiv ist: Ein niedrigeres Bruttogehalt wird mit einem niedrigeren Durchschnittssteuersatz belastet. Wer die Stunden halbiert, verliert daher meist etwas weniger als die Hälfte des Nettogehalts — die Netto-Quote steigt.",
  },
  {
    q: "Welche Steuerklasse gilt bei Teilzeit?",
    a: "Die Steuerklasse ist unabhängig von der Arbeitszeit — sie richtet sich nach Ihrer familiären Situation. Teilzeitbeschäftigte in Steuerklasse V (z. B. Zweitverdiener in einer Ehe) haben allerdings höhere Abzüge; oft lohnt hier ein Wechsel zu IV/IV mit Faktor.",
  },
  {
    q: "Ab wann lohnt sich Teilzeit gegenüber einem Minijob?",
    a: "Unterhalb von 603 € (2026) handelt es sich um einen Minijob, der weitgehend abgabenfrei ist. Im Übergangsbereich (Midijob, bis 2.000 €) steigen die Sozialabgaben gleitend an. Für höhere Teilzeit-Gehälter gilt die reguläre Berechnung — nutzen Sie dafür den Teilzeitrechner oben.",
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
    { "@type": "ListItem", position: 2, name: "Teilzeitrechner", item: "https://bruttonettocalculator.com/teilzeitrechner" },
  ],
};
const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Teilzeitrechner 2026 Deutschland",
  url: "https://bruttonettocalculator.com/teilzeitrechner",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
  },
  description: "Kostenloser Teilzeitrechner — Netto-Gehalt bei Teilzeit aus dem Brutto berechnen (§ 32a EStG 2026).",
};

export default function TeilzeitrechnerPage() {
  const rows = TEILZEIT_STUFEN.map((std) => {
    const brutto = Math.round((VOLLZEIT_BRUTTO * std) / VOLLZEIT_STUNDEN);
    const res = calculateNetto({ bruttoMonat: brutto, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 });
    return { std, brutto, netto: res.nettoMonat, quote: brutto > 0 ? (res.nettoMonat / brutto) * 100 : 0, prozent: (std / VOLLZEIT_STUNDEN) * 100 };
  });

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-24 text-[#16181D]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Teilzeitrechner</span>
      </div>

      <div className="mb-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-5">
          <Clock3 size={14} /> Teilzeit · Netto berechnen · 2026
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-5 max-w-4xl">
          <span className="text-gradient-accent">Teilzeitrechner</span> 2026: Netto-Gehalt bei Teilzeit
        </h1>
        <p className="text-lg sm:text-xl text-black/80 max-w-3xl leading-relaxed mb-6">
          Mit dem <strong className="text-[#16181D]">Teilzeitrechner</strong> berechnen Sie Ihr Nettogehalt bei
          reduzierter Arbeitszeit. Geben Sie Ihr Teilzeit-Bruttogehalt in den Rechner ein und sehen Sie sofort, wie
          viel netto bleibt — inklusive aller Sozialabgaben und Steuern für 2026.
        </p>
        <ReviewerByline />
      </div>

      {/* Ad — right below the hero, above the calculator */}
      <AdUnit placement="content" className="!my-0 !mb-10 !px-0" />

      <section id="rechner" className="mb-14 scroll-mt-24">
        <Calculator initialBrutto={2000} />
      </section>

      <AdUnit placement="content" className="!my-0 !mb-14 !px-0" />

      <section className="mb-16">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-semibold bg-[#E60A1C]/10 border border-[#E60A1C]/20 px-3 py-1 rounded-full mb-2">
            <BarChart3 size={13} /> Teilzeit-Tabelle
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D]">
            Netto nach Wochenstunden (Beispiel: {formatEUR(VOLLZEIT_BRUTTO)} bei Vollzeit)
          </h2>
          <p className="text-sm sm:text-base text-black/70 mt-1">
            So verändert sich Brutto und Netto (Steuerklasse I, 2026), wenn Sie ausgehend von einer 40-Stunden-Woche in Teilzeit gehen.
          </p>
        </div>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Wochenstunden</th>
                <th className="py-4 px-5 text-right">Anteil</th>
                <th className="py-4 px-5 text-right">Brutto / Monat</th>
                <th className="py-4 px-5 text-right text-[#16181D] font-bold">Netto / Monat</th>
                <th className="py-4 px-5 text-right">Netto-Quote</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {rows.map((r) => (
                <tr key={r.std} className={`hover:bg-black/[0.04] transition-colors ${r.std === VOLLZEIT_STUNDEN ? "bg-[#E60A1C]/5 font-semibold" : ""}`}>
                  <td className="py-4 px-5 font-bold text-[#16181D]">{r.std} h {r.std === VOLLZEIT_STUNDEN && <span className="text-xs font-normal text-black/50">(Vollzeit)</span>}</td>
                  <td className="py-4 px-5 text-right font-mono text-black/70">{r.prozent.toFixed(0)} %</td>
                  <td className="py-4 px-5 text-right font-mono text-black/80">{formatEUR(r.brutto)}</td>
                  <td className="py-4 px-5 text-right font-mono text-[#16181D] font-bold bg-black/[0.04]">{formatEUR(r.netto)}</td>
                  <td className="py-4 px-5 text-right font-mono text-emerald-600">{r.quote.toFixed(1).replace(".", ",")} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-16 bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 text-black/75 text-sm sm:text-base leading-relaxed space-y-5">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D]">Teilzeit & Netto: Was Sie wissen sollten</h2>
        <p>
          Bei <strong className="text-[#16181D]">Teilzeit</strong> sinkt Ihr Bruttogehalt proportional zur Arbeitszeit —
          Ihr <strong className="text-[#16181D]">Nettogehalt</strong> jedoch nicht ganz im gleichen Maß. Grund ist der
          progressive Einkommensteuertarif: Bei geringerem Einkommen greift ein niedrigerer Durchschnittssteuersatz, die
          Netto-Quote steigt also. Wer von 40 auf 30 Stunden reduziert, behält daher meist etwas mehr als 75 % des
          Nettogehalts.
        </p>
        <p>
          Beachten Sie bei sehr niedriger Stundenzahl die Grenzen zum <Link href="/minijob-rechner" className="text-[#E60A1C] font-semibold hover:underline">Minijob (603 €)</Link> und
          zum Midijob-Übergangsbereich. Für die genaue Berechnung eines konkreten Betrags nutzen Sie den{" "}
          <Link href="/gehaltsrechner" className="text-[#E60A1C] font-semibold hover:underline">Gehaltsrechner</Link> oder
          den <Link href="/stundenlohn-rechner" className="text-[#E60A1C] font-semibold hover:underline">Stundenlohn-Rechner</Link>.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8 text-center flex items-center justify-center gap-2">
          <Sparkles className="text-[#E60A1C]" size={22} /> Häufige Fragen zur Teilzeit
        </h2>
        <AccordionFaq faqs={faqs} />
      </section>
    </main>
  );
}
