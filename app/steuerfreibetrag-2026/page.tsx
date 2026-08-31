import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Landmark, ArrowRight, Wallet2, Info } from "lucide-react";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import ReviewerByline from "@/components/ReviewerByline";
import ToolContent from "@/components/ToolContent";
import { TOOL_CONTENT } from "@/data/tool-content";

const CANONICAL = "https://bruttonettocalculator.com/steuerfreibetrag-2026";

export const metadata: Metadata = {
  title: "Steuerfreibetrag 2026: Grundfreibetrag & alle Freibeträge",
  description:
    "Steuerfreibetrag 2026: Grundfreibetrag 12.348 € (24.696 € für Paare), Kinderfreibetrag 9.756 €, Arbeitnehmer-Pauschbetrag 1.230 € — alle Werte im Überblick.",
  keywords: [
    "steuerfreibetrag 2026",
    "grundfreibetrag 2026",
    "steuerfreibetrag",
    "kinderfreibetrag 2026",
    "freibeträge 2026",
    "arbeitnehmer pauschbetrag 2026",
    "steuerfrei verdienen 2026",
    "ab wann steuern zahlen",
    "lohnsteuer freibetrag",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Steuerfreibetrag 2026 — alle Freibeträge im Überblick",
    description:
      "Grundfreibetrag 12.348 €, Kinderfreibetrag 9.756 €, alle Pauschbeträge 2026 — und ab welchem Brutto Lohnsteuer anfällt.",
    url: CANONICAL,
    type: "website",
    locale: "de_DE",
    siteName: "BruttoNettoCalculator.com",
  },
  twitter: {
    card: "summary",
    title: "Steuerfreibetrag 2026: Grundfreibetrag & alle Freibeträge",
    description: "Alle Steuerfreibeträge 2026 mit Beträgen — und ab wann Lohnsteuer anfällt.",
  },
};

// All statutory 2026 allowances. Grundfreibetrag, Pauschbeträge, Soli-Freigrenze
// and Minijob-Grenze match the values baked into lib/taxCalculator.ts.
const freibetraege = [
  {
    name: "Grundfreibetrag",
    wert: "12.348 €",
    paar: "24.696 € (Zusammenveranlagung)",
    desc: "Bis zu diesem zu versteuernden Einkommen fällt keine Einkommensteuer an (§ 32a EStG). Er steigt 2026 von 12.096 € auf 12.348 €.",
    link: { href: "/einkommensteuer-rechner", label: "Einkommensteuer-Rechner" },
  },
  {
    name: "Arbeitnehmer-Pauschbetrag (Werbungskosten)",
    wert: "1.230 €",
    paar: null,
    desc: "Wird automatisch vom Arbeitslohn abgezogen — ohne Nachweis. Höhere Werbungskosten (Pendeln, Arbeitsmittel, Homeoffice) lohnen sich erst über 1.230 €.",
    link: { href: "/pendlerpauschale-rechner", label: "Pendlerpauschale-Rechner" },
  },
  {
    name: "Kinderfreibetrag (inkl. BEA)",
    wert: "9.756 €",
    paar: "je Kind, beide Elternteile zusammen",
    desc: "6.828 € sächliches Existenzminimum + 2.928 € Betreuungs-/Erziehungsfreibetrag. Das Finanzamt prüft automatisch, ob Kindergeld (259 €/Monat) oder der Freibetrag günstiger ist.",
    link: { href: "/elterngeld-rechner", label: "Elterngeld-Rechner" },
  },
  {
    name: "Entlastungsbetrag für Alleinerziehende",
    wert: "4.260 €",
    paar: "+ 240 € je weiterem Kind",
    desc: "Steckt in Steuerklasse II und senkt das zu versteuernde Einkommen von Alleinerziehenden — nur auf Antrag beim Finanzamt.",
    link: { href: "/welche-steuerklasse-bin-ich", label: "Welche Steuerklasse bin ich?" },
  },
  {
    name: "Sparer-Pauschbetrag",
    wert: "1.000 €",
    paar: "2.000 € (Zusammenveranlagung)",
    desc: "Kapitalerträge (Zinsen, Dividenden, Fondsgewinne) bleiben bis zu dieser Höhe steuerfrei — Freistellungsauftrag bei der Bank nicht vergessen.",
    link: null,
  },
  {
    name: "Sonderausgaben-Pauschbetrag",
    wert: "36 €",
    paar: "72 € (Zusammenveranlagung)",
    desc: "Mini-Pauschale für Sonderausgaben ohne Nachweis. Real fast immer übertroffen durch Versicherungsbeiträge, Spenden oder Kirchensteuer.",
    link: null,
  },
  {
    name: "Übungsleiterpauschale",
    wert: "3.000 €",
    paar: null,
    desc: "Nebenberufliche Tätigkeit als Trainer, Ausbilder, Dozent oder Pfleger im gemeinnützigen Bereich bleibt bis 3.000 €/Jahr steuer- und sozialabgabenfrei (§ 3 Nr. 26 EStG).",
    link: null,
  },
  {
    name: "Ehrenamtspauschale",
    wert: "840 €",
    paar: null,
    desc: "Für ehrenamtliches Engagement (z. B. Vereinsvorstand, Kassenwart) — nicht kombinierbar mit der Übungsleiterpauschale für dieselbe Tätigkeit (§ 3 Nr. 26a EStG).",
    link: null,
  },
  {
    name: "Minijob-Grenze",
    wert: "603 € / Monat",
    paar: "7.236 € / Jahr",
    desc: "Verdienst aus einem Minijob bleibt für Arbeitnehmer steuer- und sozialabgabenfrei (Pauschalbesteuerung durch den Arbeitgeber).",
    link: { href: "/minijob-rechner", label: "Minijob-Rechner" },
  },
  {
    name: "Solidaritätszuschlag-Freigrenze",
    wert: "20.350 € ESt",
    paar: "40.700 € (Splitting)",
    desc: "Erst wenn die festgesetzte Einkommensteuer diese Freigrenze übersteigt, fällt (abgeschmolzen) Soli an — rund 90 % der Steuerzahler zahlen keinen.",
    link: null,
  },
];

const buildFaqs = (lohnsteuerfreiBrutto: number) => [
  {
    q: "Wie hoch ist der Steuerfreibetrag 2026?",
    a: "Der Grundfreibetrag beträgt 2026 12.348 € pro Person (24.696 € für zusammenveranlagte Paare) — bis zu diesem zu versteuernden Einkommen fällt keine Einkommensteuer an. Er stieg zum 1. Januar 2026 von 12.096 € um 252 €.",
  },
  {
    q: "Bis zu welchem Bruttogehalt zahlt man 2026 keine Lohnsteuer?",
    a: `In Steuerklasse I bleibt ein Monatsbrutto von etwa ${new Intl.NumberFormat("de-DE").format(lohnsteuerfreiBrutto)} € komplett lohnsteuerfrei, weil neben dem Grundfreibetrag auch Sozialversicherungsbeiträge, Arbeitnehmer-Pauschbetrag (1.230 €) und Sonderausgaben-Pauschbetrag abgezogen werden. Sozialabgaben fallen oberhalb der Minijob-Grenze (603 €) trotzdem an — im Midijob-Bereich reduziert.`,
  },
  {
    q: "Was ist der Unterschied zwischen Freibetrag, Freigrenze und Pauschbetrag?",
    a: "Ein Freibetrag (z. B. Grundfreibetrag) bleibt immer steuerfrei — versteuert wird nur, was darüber liegt. Bei einer Freigrenze (z. B. beim Soli) wird bei Überschreiten grundsätzlich der gesamte Betrag relevant. Ein Pauschbetrag (z. B. 1.230 € Werbungskosten) wird ohne Nachweis automatisch abgezogen.",
  },
  {
    q: "Wie beantrage ich einen zusätzlichen Lohnsteuerfreibetrag?",
    a: "Beim Finanzamt über den \"Antrag auf Lohnsteuer-Ermäßigung\" (auch via ELSTER). Eingetragene Freibeträge — etwa für hohe Fahrtkosten, doppelte Haushaltsführung oder Unterhalt — senken direkt die monatliche Lohnsteuer statt erst bei der Steuererklärung. Die Antragsgrenze liegt bei 600 € Werbungskosten über dem Pauschbetrag.",
  },
  {
    q: "Kinderfreibetrag oder Kindergeld — was ist besser?",
    a: "Das Finanzamt macht automatisch die Günstigerprüfung: Bis zu einem Familieneinkommen von grob 80.000 € ist meist das Kindergeld (259 €/Monat je Kind 2026) vorteilhafter, darüber der Kinderfreibetrag von 9.756 €. Sie müssen nichts wählen — es zählt automatisch die günstigere Variante.",
  },
];

export default function SteuerfreibetragPage() {
  // Server-computed: highest monthly gross (SK I) that stays income-tax-free in
  // 2026 — uses the real engine instead of a hand-maintained number.
  let lohnsteuerfreiBrutto = 0;
  for (let b = 900; b <= 2000; b += 5) {
    const res = calculateNetto({ bruttoMonat: b, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 });
    if (res.steuer.einkommensteuerJahr <= 0) lohnsteuerfreiBrutto = b;
  }
  const beispielRes = calculateNetto({ bruttoMonat: lohnsteuerfreiBrutto, jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false, steuerklasse: 1 });
  const faqs = buildFaqs(lohnsteuerfreiBrutto);

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
          { "@type": "ListItem", position: 2, name: "Lexikon", item: "https://bruttonettocalculator.com/lexikon" },
          { "@type": "ListItem", position: 3, name: "Steuerfreibetrag 2026", item: CANONICAL },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${CANONICAL}#webpage`,
        url: CANONICAL,
        name: "Steuerfreibetrag 2026 — alle Freibeträge im Überblick",
        description:
          "Grundfreibetrag 12.348 €, Kinderfreibetrag 9.756 €, alle Pauschbeträge 2026 und die lohnsteuerfreie Brutto-Grenze.",
        isPartOf: { "@id": "https://bruttonettocalculator.com/#website" },
        breadcrumb: { "@id": `${CANONICAL}#breadcrumb` },
      },
      {
        "@type": "FAQPage",
        "@id": `${CANONICAL}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 text-[#16181D] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-black/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#16181D] transition-colors">Startseite</Link>
        <ChevronRight size={14} className="text-black/30" />
        <Link href="/lexikon" className="hover:text-[#16181D] transition-colors">Lexikon</Link>
        <ChevronRight size={14} className="text-black/30" />
        <span className="text-black/80">Steuerfreibetrag 2026</span>
      </div>

      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <Landmark size={14} /> Freibeträge · Steuerjahr 2026
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-[#16181D] mb-4 tracking-tight leading-tight">
          <span className="text-gradient-accent">Steuerfreibetrag 2026:</span> alle Freibeträge
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-4xl leading-relaxed mb-6">
          Der wichtigste Steuerfreibetrag ist der <strong className="text-[#16181D]">Grundfreibetrag: 12.348 €</strong> pro
          Person (24.696 € für Paare) — bis dahin bleibt das zu versteuernde Einkommen 2026 komplett steuerfrei.
          Dazu kommen Kinderfreibetrag, Pauschbeträge und Sonderfreibeträge. Hier finden Sie alle Beträge im
          Überblick — und ab welchem Bruttogehalt tatsächlich Lohnsteuer anfällt.
        </p>
        <ReviewerByline />
      </div>

      {/* Engine-computed highlight */}
      <div className="mb-14 bg-gradient-to-br from-[#E60A1C]/10 via-[#FFFFFF] to-[#FFFFFF] border border-[#E60A1C]/30 rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-3 py-1 rounded-full mb-4">
          <Wallet2 size={13} /> Mit unserem Rechenkern ermittelt
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-3">
          Bis ca. {formatEUR(lohnsteuerfreiBrutto)} brutto im Monat: 0 € Lohnsteuer
        </h2>
        <p className="text-base sm:text-lg text-black/80 leading-relaxed mb-6 max-w-4xl">
          In Steuerklasse I bleibt ein Monatsbrutto bis etwa <strong className="text-[#16181D]">{formatEUR(lohnsteuerfreiBrutto)}</strong>{" "}
          2026 komplett lohnsteuerfrei — denn neben dem Grundfreibetrag mindern auch Sozialversicherungsbeiträge und
          Pauschbeträge das zu versteuernde Einkommen. Bei genau diesem Brutto bleiben nach Sozialabgaben rund{" "}
          <strong className="text-[#E60A1C] font-extrabold">{formatEUR(beispielRes.nettoMonat)}</strong> netto übrig.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href={`/?brutto=${lohnsteuerfreiBrutto}&jahr=2026&sk=1#rechner`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-[#E60A1C] hover:bg-[#c50918] text-white px-4 py-2.5 rounded-xl transition-colors"
          >
            Im Brutto-Netto-Rechner prüfen <ArrowRight size={14} />
          </Link>
          <Link
            href="/midijob-rechner"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-black/[0.05] hover:bg-black/[0.08] text-[#16181D] border border-black/[0.10] px-4 py-2.5 rounded-xl transition-colors"
          >
            Midijob-Rechner (reduzierte Sozialabgaben) <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Freibeträge table */}
      <div className="mb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Alle Steuerfreibeträge 2026 in der Übersicht
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6 max-w-3xl">
          Freibeträge und Pauschbeträge senken das zu versteuernde Einkommen — die meisten wirken automatisch,
          einige nur auf Antrag:
        </p>
        <div className="space-y-3">
          {freibetraege.map((f) => (
            <div key={f.name} className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <h3 className="font-bold text-[#16181D] text-sm sm:text-base">{f.name}</h3>
                <div className="text-right shrink-0">
                  <span className="font-mono font-extrabold text-lg text-[#E60A1C]">{f.wert}</span>
                  {f.paar && <span className="block text-xs text-black/55 font-mono">{f.paar}</span>}
                </div>
              </div>
              <p className="text-sm text-black/70 leading-relaxed">{f.desc}</p>
              {f.link && (
                <Link href={f.link.href} className="inline-flex items-center gap-1 text-xs font-bold text-[#E60A1C] hover:underline mt-2.5">
                  {f.link.label} <ArrowRight size={12} />
                </Link>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-start gap-2 mt-5 text-xs text-black/50 leading-relaxed">
          <Info size={14} className="shrink-0 mt-0.5" />
          <span>
            Stand: Steuerjahr 2026 (Steuerfortentwicklungsgesetz). Alle Angaben ohne Gewähr — keine Steuerberatung.
          </span>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-4">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Häufige Fragen zum Steuerfreibetrag 2026
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between px-5 sm:px-6 py-4 cursor-pointer list-none hover:bg-black/[0.03] transition-colors">
                <span className="font-semibold text-[#16181D] text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronRight size={18} className="text-[#E60A1C] flex-shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-5 sm:px-6 pb-5 pt-1 text-black/70 text-sm sm:text-base leading-relaxed border-t border-black/[0.05]">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
      <ToolContent config={TOOL_CONTENT["/steuerfreibetrag-2026"]} />
    </main>
  );
}
