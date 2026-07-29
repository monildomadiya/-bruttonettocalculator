import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, AlertCircle, Check, X, HeartPulse } from "lucide-react";
import Calculator from "@/components/Calculator";
import ReviewerByline from "@/components/ReviewerByline";
import RelatedCalculators from "@/components/RelatedCalculators";

export const metadata: Metadata = {
  title: "PKV vs GKV 2026: Ab welchem Brutto lohnt sich die private KV?",
  description:
    "PKV oder GKV? Ab welchem Bruttogehalt sich die private Krankenversicherung 2026 lohnt: Versicherungspflichtgrenze 77.400 €, GKV-Höchstbeitrag & Beitragsbemessungsgrenze 69.750 € einfach erklärt – mit Vergleichstabelle, Vor- & Nachteilen und Netto-Rechner.",
  keywords: [
    "pkv vs gkv",
    "private krankenversicherung ab welchem brutto",
    "ab welchem gehalt private krankenversicherung",
    "pkv vergleich 2026",
    "private krankenversicherung vs gesetzlich",
    "versicherungspflichtgrenze 2026",
    "gkv höchstbeitrag 2026",
    "beitragsbemessungsgrenze krankenversicherung 2026",
    "wechsel gkv pkv",
    "private krankenversicherung kosten",
    "lohnt sich private krankenversicherung",
    "pkv gkv vergleich rechner",
    "krankenversicherung brutto netto",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/private-krankenversicherung-vs-gesetzlich" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "PKV vs GKV 2026: Ab welchem Brutto lohnt sich die private KV?",
    description:
      "Ab welchem Bruttogehalt sich die private Krankenversicherung 2026 lohnt – Versicherungspflichtgrenze 77.400 €, GKV-Höchstbeitrag & Vergleichstabelle.",
    url: "https://bruttonettocalculator.com/private-krankenversicherung-vs-gesetzlich",
    locale: "de_DE",
    type: "article",
  },
};

/* ── Authoritative 2026 figures (identical to the site's calculation engine) ── */
const BBG_KV_JAHR = 69_750; // Beitragsbemessungsgrenze KV/PV 2026
const BBG_KV_MONAT = BBG_KV_JAHR / 12; // 5.812,50 €
const JAEG_JAHR = 77_400; // Versicherungspflichtgrenze (JAEG) 2026
const JAEG_MONAT = JAEG_JAHR / 12; // 6.450 €
const KV_SATZ = 0.146; // allgemeiner Beitragssatz
const ZUSATZ = 0.029; // durchschnittlicher Zusatzbeitrag 2026
const KV_AN_MONAT = BBG_KV_MONAT * (KV_SATZ + ZUSATZ) / 2; // AN-Anteil KV am Höchstbeitrag

const eur = (n: number) =>
  n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const eur2 = (n: number) =>
  n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const faqs = [
  {
    q: "Ab welchem Brutto lohnt sich die private Krankenversicherung?",
    a: `Als Arbeitnehmer können Sie 2026 erst in die private Krankenversicherung wechseln, wenn Ihr regelmäßiges Bruttogehalt die Versicherungspflichtgrenze von ${eur(JAEG_JAHR)} € im Jahr (${eur(JAEG_MONAT)} € im Monat) übersteigt. Ob sich die PKV dann tatsächlich lohnt, hängt aber weniger vom Gehalt als von Alter, Gesundheit und Familiensituation ab: Der PKV-Beitrag richtet sich nach Ihrem persönlichen Risiko, nicht nach dem Einkommen. Junge, gesunde Gutverdiener ohne (viele) Kinder profitieren am meisten, Familien fahren mit der beitragsfreien Familienversicherung der GKV oft günstiger.`,
  },
  {
    q: "Wie hoch ist der GKV-Höchstbeitrag 2026?",
    a: `Gesetzliche Krankenkassenbeiträge werden nur bis zur Beitragsbemessungsgrenze von ${eur(BBG_KV_JAHR)} € im Jahr (${eur2(BBG_KV_MONAT)} € im Monat) erhoben — jeder Euro darüber ist beitragsfrei. Beim durchschnittlichen Gesamtsatz von ${((KV_SATZ + ZUSATZ) * 100).toLocaleString("de-DE")} % (14,6 % + 2,9 % Zusatzbeitrag) zahlen Arbeitnehmer maximal rund ${eur2(KV_AN_MONAT)} € Kranken­versicherung pro Monat; den gleichen Betrag steuert der Arbeitgeber bei. Hinzu kommt die Pflegeversicherung (rund 105–140 € Arbeitnehmeranteil, je nach Kinderzahl).`,
  },
  {
    q: "Was ist der Unterschied zwischen Versicherungspflichtgrenze und Beitragsbemessungsgrenze?",
    a: `Die Versicherungspflichtgrenze (JAEG, ${eur(JAEG_JAHR)} € in 2026) entscheidet, ob Sie überhaupt in die PKV wechseln dürfen — nur oberhalb dieser Grenze sind Sie als Angestellter krankenversicherungsfrei. Die Beitragsbemessungsgrenze (${eur(BBG_KV_JAHR)} € in 2026) legt dagegen fest, bis zu welchem Bruttoeinkommen in der GKV Beiträge fällig werden. Beide Werte werden jährlich angepasst.`,
  },
  {
    q: "Bekomme ich in der PKV auch einen Arbeitgeberzuschuss?",
    a: `Ja. Auch privat versicherte Angestellte erhalten einen Arbeitgeberzuschuss zur Kranken- und Pflegeversicherung — maximal die Hälfte des GKV-Höchstbeitrags. Dieser Zuschuss ist gedeckelt: Liegt Ihr PKV-Beitrag höher, tragen Sie den Rest allein. Deshalb ist die PKV im Alter, wenn die Beiträge steigen, ein wichtiger Planungsfaktor.`,
  },
  {
    q: "Kann ich von der PKV zurück in die gesetzliche Krankenversicherung?",
    a: `Als Angestellter geht das grundsätzlich nur, wenn Ihr Bruttogehalt wieder unter die Versicherungspflichtgrenze fällt — etwa durch Teilzeit oder Jobwechsel. Ab dem 55. Lebensjahr ist eine Rückkehr in die GKV in der Regel ausgeschlossen. Wer über einen Wechsel nachdenkt, sollte diese Einbahnstraße unbedingt einkalkulieren.`,
  },
  {
    q: "Wie beeinflusst die Krankenversicherung mein Nettogehalt?",
    a: `Der Arbeitnehmeranteil zur Kranken- und Pflegeversicherung wird direkt vom Brutto abgezogen und mindert Ihr Netto. In der GKV steigt der Beitrag mit dem Gehalt — allerdings nur bis zur Beitragsbemessungsgrenze. Mit dem Brutto-Netto-Rechner auf dieser Seite sehen Sie den exakten Kranken- und Pflegeversicherungsabzug für Ihr konkretes Bruttogehalt.`,
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "PKV vs GKV 2026: Ab welchem Brutto lohnt sich die private Krankenversicherung?",
  description:
    "Vergleich privater und gesetzlicher Krankenversicherung 2026: Versicherungspflichtgrenze 77.400 €, GKV-Höchstbeitrag, Vor- und Nachteile und die Auswirkung auf das Nettogehalt.",
  inLanguage: "de-DE",
  url: "https://bruttonettocalculator.com/private-krankenversicherung-vs-gesetzlich",
  author: { "@type": "Organization", name: "BruttoNettoCalculator.com" },
  publisher: { "@id": "https://bruttonettocalculator.com/#organization" },
  isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
  dateModified: "2026-07-01",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "PKV vs GKV", item: "https://bruttonettocalculator.com/private-krankenversicherung-vs-gesetzlich" },
  ],
};

const relatedLinks = [
  { href: "/", label: "Brutto Netto Rechner", desc: "Kranken- & Pflegeversicherung im Netto sehen" },
  { href: "/gehaltsrechner", label: "Gehaltsrechner 2026", desc: "Alle Sozialabgaben im Detail" },
  { href: "/arbeitgeber-brutto-netto-rechner", label: "Arbeitgeber-Rechner", desc: "Arbeitgeberzuschuss zur KV berechnen" },
  { href: "/lohnsteuerrechner", label: "Lohnsteuerrechner", desc: "Lohnsteuer & Nettolohn" },
  { href: "/rentenrechner", label: "Rentenrechner", desc: "Vorsorge & Rentenbeitrag" },
  { href: "/steuerklassen", label: "Steuerklassen", desc: "Alle 6 Klassen im Vergleich" },
];

export default function PkvVsGkvPage() {
  return (
    <>
      <section className="w-full max-w-6xl mx-auto px-5 pt-20 pb-16 min-h-[80vh]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
            <HeartPulse size={14} /> Krankenversicherung 2026
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#16181D] mb-4 tracking-tight">
            PKV vs GKV: Ab welchem Brutto lohnt sich die <span className="text-gradient-accent">private Krankenversicherung</span>?
          </h1>
          <p className="text-lg sm:text-xl text-black/80 w-full max-w-6xl leading-relaxed">
            Der Wechsel in die <strong className="text-[#16181D] font-semibold">private Krankenversicherung (PKV)</strong> ist
            als Arbeitnehmer erst ab einem Bruttogehalt oberhalb der{" "}
            <strong className="text-[#16181D] font-semibold">Versicherungspflichtgrenze von {eur(JAEG_JAHR)} € (2026)</strong>{" "}
            möglich. Ob sich der Schritt lohnt, entscheidet aber Ihr persönliches Profil — hier finden Sie den
            direkten Vergleich zur <strong className="text-[#16181D] font-semibold">gesetzlichen Krankenversicherung (GKV)</strong>,
            die aktuellen Beitragsgrenzen und einen Rechner für Ihr Netto.
          </p>
        </div>

        <ReviewerByline variant="banner" className="mb-10" />

        {/* Answer-first quotable box (AI-SEO / featured-snippet target) */}
        <div className="w-full max-w-6xl mx-auto bg-[#FFFFFF] border-2 border-[#E60A1C]/25 rounded-3xl p-6 sm:p-8 mb-10 shadow-lg">
          <h2 className="text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold mb-3">Kurz &amp; knapp</h2>
          <p className="text-base sm:text-lg text-black/85 leading-relaxed">
            <strong className="text-[#16181D]">Ab {eur(JAEG_MONAT)} € Brutto im Monat ({eur(JAEG_JAHR)} € pro Jahr)</strong> dürfen
            Angestellte 2026 in die PKV wechseln. Finanziell lohnt sie sich vor allem für{" "}
            <strong className="text-[#16181D]">junge, gesunde Gutverdiener ohne Kinder</strong>. Familien und ältere
            Wechsler fahren mit der GKV — dank kostenloser Familienversicherung und einkommensabhängigem, im Alter
            stabilerem Beitrag — häufig besser.
          </p>
        </div>

        {/* ── Comparison table ─────────────────────────────────── */}
        <div className="w-full max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">PKV vs GKV 2026 im direkten Vergleich</h2>
          <div className="overflow-x-auto rounded-3xl border border-black/[0.10] shadow-lg">
            <table className="w-full text-sm sm:text-base bg-[#FFFFFF] border-collapse">
              <thead>
                <tr className="bg-[#F4F5F7] text-left">
                  <th className="p-4 font-bold text-[#16181D]">Kriterium</th>
                  <th className="p-4 font-bold text-[#16181D]">Gesetzlich (GKV)</th>
                  <th className="p-4 font-bold text-[#16181D]">Privat (PKV)</th>
                </tr>
              </thead>
              <tbody className="text-black/75">
                <tr className="border-t border-black/[0.08]">
                  <td className="p-4 font-semibold text-[#16181D]">Beitragsberechnung</td>
                  <td className="p-4">Einkommensabhängig ({((KV_SATZ + ZUSATZ) * 100).toLocaleString("de-DE")} % bis zur BBG)</td>
                  <td className="p-4">Nach Alter, Gesundheit &amp; Tarif</td>
                </tr>
                <tr className="border-t border-black/[0.08] bg-[#FAFAFB]">
                  <td className="p-4 font-semibold text-[#16181D]">Höchstbeitrag / Monat (AN-Anteil)</td>
                  <td className="p-4">≈ {eur2(KV_AN_MONAT)} € KV + Pflege (gedeckelt bei {eur2(BBG_KV_MONAT)} € Brutto)</td>
                  <td className="p-4">Individuell — kann günstiger oder teurer sein</td>
                </tr>
                <tr className="border-t border-black/[0.08]">
                  <td className="p-4 font-semibold text-[#16181D]">Familie mitversichert</td>
                  <td className="p-4 text-emerald-700"><Check size={18} className="inline mr-1" />Kostenlos (Familienversicherung)</td>
                  <td className="p-4 text-black/60"><X size={18} className="inline mr-1" />Eigener Beitrag pro Person</td>
                </tr>
                <tr className="border-t border-black/[0.08] bg-[#FAFAFB]">
                  <td className="p-4 font-semibold text-[#16181D]">Leistungen</td>
                  <td className="p-4">Gesetzlich einheitlich definiert</td>
                  <td className="p-4 text-emerald-700"><Check size={18} className="inline mr-1" />Frei wählbar, oft umfangreicher</td>
                </tr>
                <tr className="border-t border-black/[0.08]">
                  <td className="p-4 font-semibold text-[#16181D]">Beitrag im Alter</td>
                  <td className="p-4 text-emerald-700"><Check size={18} className="inline mr-1" />Sinkt mit Rente</td>
                  <td className="p-4 text-black/60"><X size={18} className="inline mr-1" />Kann deutlich steigen</td>
                </tr>
                <tr className="border-t border-black/[0.08] bg-[#FAFAFB]">
                  <td className="p-4 font-semibold text-[#16181D]">Rückkehr möglich?</td>
                  <td className="p-4">—</td>
                  <td className="p-4 text-black/60"><X size={18} className="inline mr-1" />Ab 55 praktisch ausgeschlossen</td>
                </tr>
                <tr className="border-t border-black/[0.08]">
                  <td className="p-4 font-semibold text-[#16181D]">Zugang (Angestellte)</td>
                  <td className="p-4">Immer möglich</td>
                  <td className="p-4">Erst ab {eur(JAEG_JAHR)} € Brutto/Jahr</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-black/50 mt-3">
            GKV-Werte auf Basis des durchschnittlichen Zusatzbeitrags 2026 (2,9 %) und der Beitragsbemessungsgrenze
            {" "}{eur(BBG_KV_JAHR)} € — identisch zur Berechnung im Brutto-Netto-Rechner. PKV-Beiträge sind
            individuell und hier nicht pauschalisierbar.
          </p>
        </div>

        {/* ── Embedded calculator ──────────────────────────────── */}
        <div className="w-full max-w-6xl mx-auto mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">Ihr GKV-Beitrag im Netto berechnen</h2>
          <p className="text-black/70 mb-6">
            Geben Sie Ihr Bruttogehalt ein und sehen Sie den exakten Kranken- und Pflegeversicherungsabzug (GKV) sowie
            Ihr Nettogehalt 2026. So erkennen Sie sofort, wie viel Sie aktuell für die gesetzliche Krankenkasse zahlen.
          </p>
        </div>
        <div className="w-full max-w-6xl mx-auto mb-14">
          <Calculator />
        </div>

        {/* ── When does each make sense ────────────────────────── */}
        <div className="w-full max-w-6xl mx-auto bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">Für wen lohnt sich die PKV — und für wen die GKV?</h2>
          <div className="grid md:grid-cols-2 gap-8 text-sm sm:text-base text-black/75 leading-relaxed">
            <div>
              <h3 className="font-bold text-[#16181D] text-lg mb-3 flex items-center gap-2"><Check size={18} className="text-emerald-600" />PKV kann sich lohnen für …</h3>
              <ul className="space-y-2">
                <li className="flex gap-2"><span className="text-[#E60A1C] font-bold">›</span> Gutverdiener dauerhaft über {eur(JAEG_JAHR)} € Brutto/Jahr</li>
                <li className="flex gap-2"><span className="text-[#E60A1C] font-bold">›</span> junge, gesunde Angestellte &amp; Beamte (Beihilfe)</li>
                <li className="flex gap-2"><span className="text-[#E60A1C] font-bold">›</span> Selbstständige ohne einkommensabhängige GKV-Vorteile</li>
                <li className="flex gap-2"><span className="text-[#E60A1C] font-bold">›</span> Singles / Paare ohne (geplante) Kinder</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#16181D] text-lg mb-3 flex items-center gap-2"><Check size={18} className="text-emerald-600" />Die GKV ist meist besser für …</h3>
              <ul className="space-y-2">
                <li className="flex gap-2"><span className="text-[#E60A1C] font-bold">›</span> Familien mit Kindern (kostenlose Familienversicherung)</li>
                <li className="flex gap-2"><span className="text-[#E60A1C] font-bold">›</span> Menschen mit Vorerkrankungen (keine Risikozuschläge)</li>
                <li className="flex gap-2"><span className="text-[#E60A1C] font-bold">›</span> wer im Alter einen stabilen, sinkenden Beitrag will</li>
                <li className="flex gap-2"><span className="text-[#E60A1C] font-bold">›</span> Angestellte mit schwankendem Einkommen</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-8 flex items-start gap-4 text-sm sm:text-base text-black/80 leading-relaxed shadow-lg mb-12">
          <AlertCircle size={22} className="text-[#E60A1C] flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#16181D] font-bold">Wichtiger Hinweis.</strong> Dieser Ratgeber dient der
            Orientierung und ersetzt keine individuelle Beratung. Ein PKV-Wechsel ist eine langfristige Entscheidung —
            lassen Sie Tarife und Ihren persönlichen Bedarf vor einem Wechsel unabhängig prüfen.
          </p>
        </div>

        {/* ── FAQ (visible + JSON-LD above) ────────────────────── */}
        <div className="w-full max-w-6xl mx-auto bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
            Häufige Fragen zu PKV, GKV &amp; Beitragsgrenzen 2026
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-sm sm:text-base">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-bold text-[#16181D] text-base sm:text-lg mb-2">{faq.q}</h3>
                <p className="text-black/70 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RelatedCalculators title="Passende Rechner &amp; Ratgeber" links={relatedLinks} className="pb-16" />
    </>
  );
}
