import type { Metadata } from "next";
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import Calculator from "@/components/Calculator";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Brutto Netto Rechner 2026 — Gehaltsrechner & Lohnrechner",
  description:
    "Brutto Netto Rechner 2026: Nettogehalt mit den amtlichen Werten 2026 berechnen — Grundfreibetrag 12.348 €, alle 6 Steuerklassen, Sozialabgaben & Soli nach § 32a EStG 2026. Kostenlos, ohne Anmeldung, sofort.",
  keywords: [
    "brutto netto rechner 2026",
    "brutto netto 2026",
    "brutto-netto-rechner 2026",
    "netto brutto rechner 2026",
    "gehaltsrechner 2026",
    "lohnrechner 2026",
    "nettolohn 2026",
    "netto 2026",
    "brutto netto rechner 2026 kostenlos",
    "steuerrechner 2026",
    "lohnsteuer 2026",
    "grundfreibetrag 2026",
    "grundfreibetrag 12348",
    "beitragsbemessungsgrenze 2026",
    "sozialabgaben 2026",
    "mindestlohn 2026",
    "wie viel netto vom brutto 2026",
    "nettogehalt berechnen 2026",
    "steuerklasse 2026",
    "brutto netto rechner für 2026",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/brutto-netto-rechner-2026" },
  openGraph: {
    title: "Brutto Netto Rechner 2026 — Gehaltsrechner & Lohnrechner",
    description:
      "Nettogehalt 2026 mit den amtlichen Werten berechnen — Grundfreibetrag 12.348 €, alle Steuerklassen, Sozialabgaben & Soli nach § 32a EStG 2026. Kostenlos & sofort.",
    url: "https://bruttonettocalculator.com/brutto-netto-rechner-2026",
    locale: "de_DE",
    type: "website",
  },
};

/* Amtliche Rechengrößen 2026 — Werte konsistent zu RECHENGROESSEN_2026 in lib/taxCalculator.ts */
const werte2026: { label: string; value: string }[] = [
  { label: "Grundfreibetrag (steuerfrei)", value: "12.348 € / Jahr" },
  { label: "Mindestlohn", value: "13,90 € / Stunde" },
  { label: "BBG Kranken- & Pflegeversicherung", value: "69.750 € / Jahr (5.812,50 € / Monat)" },
  { label: "BBG Renten- & Arbeitslosenversicherung", value: "101.400 € / Jahr (8.450 € / Monat)" },
  { label: "Rentenversicherung", value: "18,6 % (Arbeitnehmer 9,3 %)" },
  { label: "Arbeitslosenversicherung", value: "2,6 % (Arbeitnehmer 1,3 %)" },
  { label: "Krankenversicherung", value: "14,6 % + Ø 2,9 % Zusatzbeitrag" },
  { label: "Pflegeversicherung", value: "3,6 % (+0,6 % für Kinderlose ab 23 J.)" },
  { label: "Werbungskostenpauschale", value: "1.230 € / Jahr" },
  { label: "Spitzensteuersatz", value: "42 % ab 69.878 € zvE (45 % ab 277.825 €)" },
  { label: "Soli-Freigrenze (ledig)", value: "18.130 € Einkommensteuer" },
];

const faqs = [
  {
    q: "Wie berechnet der Brutto Netto Rechner 2026 mein Nettogehalt?",
    a: "Der Brutto Netto Rechner 2026 ermittelt aus Ihrem Bruttogehalt zuerst die Lohnsteuer nach § 32a EStG in der für 2026 gültigen Fassung, dann den Solidaritätszuschlag und ggf. die Kirchensteuer sowie alle Sozialversicherungsbeiträge (Kranken-, Pflege-, Renten- und Arbeitslosenversicherung). Was übrig bleibt, ist Ihr Nettogehalt 2026. Geben Sie Ihr Bruttogehalt oben ein und wählen Sie Ihre Steuerklasse.",
  },
  {
    q: "Wie hoch ist der Grundfreibetrag 2026?",
    a: "Der steuerliche Grundfreibetrag 2026 beträgt 12.348 € pro Jahr. Bis zu diesem zu versteuernden Einkommen fällt keine Einkommensteuer an — erst darüber beginnt der Eingangssteuersatz von 14 %. Der Grundfreibetrag ist bereits in jeder Berechnung dieses Rechners für 2026 berücksichtigt.",
  },
  {
    q: "Welche Sozialabgaben gelten 2026?",
    a: "2026 tragen Arbeitnehmer je zur Hälfte: Rentenversicherung 9,3 %, Arbeitslosenversicherung 1,3 %, Krankenversicherung rund 8,75 % (inkl. hälftigem durchschnittlichem Zusatzbeitrag von 2,9 %) sowie die Pflegeversicherung. Kinderlose ab 23 Jahren zahlen bei der Pflegeversicherung einen Zuschlag von 0,6 %. Beiträge fallen nur bis zur jeweiligen Beitragsbemessungsgrenze an (69.750 € für KV/PV, 101.400 € für RV/ALV).",
  },
  {
    q: "Wie viel Netto bleibt 2026 von 3.000 € Brutto?",
    a: "Bei 3.000 € Brutto im Monat in Steuerklasse I (ledig, ohne Kirchensteuer) bleiben 2026 rund 2.150 € netto übrig — abhängig von Zusatzbeitrag der Krankenkasse und Kinderfreibeträgen. Nutzen Sie den Rechner oben und tragen Sie Ihren exakten Betrag ein, um Ihr persönliches Netto 2026 zu sehen; eine detaillierte Aufschlüsselung finden Sie auf unseren Gehaltsseiten.",
  },
  {
    q: "Wie hoch ist der Mindestlohn 2026?",
    a: "Der gesetzliche Mindestlohn steigt 2026 auf 13,90 € pro Stunde (2027 sind 14,60 € vorgesehen). Bei einer 40-Stunden-Woche entspricht das einem Bruttolohn von rund 2.409 € im Monat.",
  },
  {
    q: "Welche Steuerklasse ist 2026 die beste?",
    a: "Die günstigste Steuerklasse hängt von Ihrer Lebenssituation ab: Ledige haben Steuerklasse I, Alleinerziehende II. Verheiratete können zwischen den Kombinationen III/V, IV/IV und IV/IV mit Faktor wählen — welche Variante 2026 am meisten Netto bringt, zeigt Ihnen unser Steuerklassenwechsel-Rechner. Wichtig: Die Steuerklasse verändert nur die monatliche Vorauszahlung, nicht die endgültige Jahressteuer.",
  },
  {
    q: "Kann ich mit dem Rechner auch Netto zu Brutto 2026 berechnen?",
    a: "Ja. Der Rechner beherrscht beide Richtungen: die klassische Brutto-zu-Netto-Rechnung und die umgekehrte Netto-zu-Brutto-Kalkulation für 2026. So finden Sie zum Beispiel heraus, welches Bruttogehalt Sie verhandeln müssen, um ein bestimmtes Wunsch-Netto zu erreichen.",
  },
  {
    q: "Sind die Werte im Brutto Netto Rechner 2026 amtlich?",
    a: "Ja. Der Rechner nutzt die Einkommensteuer-Formel nach § 32a EStG 2026, die Solidaritätszuschlag-Regeln inkl. Milderungszone sowie die Sozialversicherungs-Rechengrößen 2026 (Beitragssätze und Beitragsbemessungsgrenzen). Die Berechnungen sind sorgfältig geprüft, ersetzen aber keine individuelle Steuerberatung.",
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

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Brutto Netto Rechner 2026",
  url: "https://bruttonettocalculator.com/brutto-netto-rechner-2026",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  inLanguage: "de-DE",
  description:
    "Kostenloser Brutto Netto Rechner 2026: Nettogehalt mit den amtlichen Werten 2026 nach § 32a EStG berechnen — alle Steuerklassen und Sozialabgaben.",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
    { "@type": "ListItem", position: 2, name: "Brutto Netto Rechner 2026", item: "https://bruttonettocalculator.com/brutto-netto-rechner-2026" },
  ],
};

export default function Rechner2026Page() {
  return (
    <section className="w-full max-w-6xl mx-auto px-5 pt-20 pb-16 min-h-[80vh]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="mb-14">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <Sparkles size={14} /> Amtliche Werte 2026
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#16181D] mb-4 tracking-tight">
          Brutto Netto Rechner <span className="text-gradient-accent">2026</span>
        </h1>
        <p className="text-lg sm:text-xl text-black/80 w-full max-w-6xl leading-relaxed">
          Berechnen Sie Ihr Nettogehalt für das Steuerjahr 2026 — sekundenschnell und kostenlos.
          Dieser <strong className="text-[#16181D] font-semibold">Brutto Netto Rechner 2026</strong> nutzt die
          amtliche Einkommensteuer-Formel nach § 32a EStG 2026, den Grundfreibetrag von 12.348 € sowie
          alle aktuellen Beitragssätze und Beitragsbemessungsgrenzen. Ob als <strong className="text-[#16181D] font-semibold">Gehaltsrechner 2026</strong>,{" "}
          <strong className="text-[#16181D] font-semibold">Lohnrechner 2026</strong> oder <strong className="text-[#16181D] font-semibold">Netto Brutto Rechner 2026</strong> — hier
          sehen Sie sofort, wie viel Netto vom Brutto übrig bleibt.
        </p>
      </div>

      {/* Ad — right below the hero, above the calculator */}
      <AdUnit placement="content" className="!my-0 !mb-10 !px-0" />

      <div className="w-full max-w-6xl mx-auto mb-14">
        <Calculator initialJahr={2026} />
      </div>

      {/* Ad: right after the calculator (high engagement) */}
      <AdUnit placement="content" className="!my-0 !mb-12 !px-0" />

      {/* Amtliche Rechengrößen 2026 — unique, engine-backed reference table */}
      <div className="w-full max-w-6xl mx-auto bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-6 sm:p-10 shadow-lg mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Alle amtlichen Werte 2026 auf einen Blick
        </h2>
        <p className="text-sm sm:text-base text-black/70 mb-6">
          Diese Rechengrößen liegen jeder Berechnung im Brutto Netto Rechner 2026 zugrunde:
        </p>
        <div className="overflow-x-auto rounded-2xl border border-black/[0.08]">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-[#F1F3F5] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3.5 px-5">Rechengröße</th>
                <th className="py-3.5 px-5 text-right">Wert 2026</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06] text-sm sm:text-base">
              {werte2026.map((row) => (
                <tr key={row.label} className="hover:bg-black/[0.02] transition-colors">
                  <td className="py-3.5 px-5 text-black/80 font-medium">{row.label}</td>
                  <td className="py-3.5 px-5 text-right font-mono font-semibold text-[#16181D]">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-4">
          Quelle: § 32a EStG 2026 sowie Sozialversicherungs-Rechengrößen-Verordnung 2026. Der durchschnittliche
          Zusatzbeitrag zur Krankenversicherung wird individuell von jeder Krankenkasse festgelegt.
        </p>
      </div>

      {/* Ad: between the values table and the explainer (deep-scroll) */}
      <AdUnit placement="content" className="!my-0 !mb-8 !px-0" />

      {/* Content section — targets "brutto netto rechner 2026" / "netto 2026" cluster */}
      <div className="w-full max-w-6xl mx-auto bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10 mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Was bleibt 2026 vom Brutto? So funktioniert die Berechnung
        </h2>
        <div className="text-sm sm:text-base text-black/70 leading-relaxed space-y-4">
          <p>
            Vom Bruttogehalt bis zum Netto 2026 sind es mehrere Schritte. Der{" "}
            <strong className="text-[#16181D] font-semibold">Brutto Netto Rechner 2026</strong> nimmt Ihnen die
            komplette Rechnung ab und berücksichtigt dabei alle für das Jahr 2026 gültigen Werte:
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <CheckCircle2 size={20} className="text-[#E60A1C] flex-shrink-0 mt-0.5" />
              <span><strong className="text-[#16181D]">Lohnsteuer nach § 32a EStG 2026:</strong> Erst ab einem zu versteuernden Einkommen über dem Grundfreibetrag von 12.348 € fällt Einkommensteuer an — beginnend mit 14 % Eingangssteuersatz.</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 size={20} className="text-[#E60A1C] flex-shrink-0 mt-0.5" />
              <span><strong className="text-[#16181D]">Solidaritätszuschlag:</strong> Fällt 2026 erst oberhalb der Freigrenze von 18.130 € Einkommensteuer (Ledige) an — für die meisten Arbeitnehmer also 0 €.</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 size={20} className="text-[#E60A1C] flex-shrink-0 mt-0.5" />
              <span><strong className="text-[#16181D]">Sozialversicherung:</strong> Renten- (9,3 %), Arbeitslosen- (1,3 %), Kranken- (rund 8,75 %) und Pflegeversicherung werden bis zur jeweiligen Beitragsbemessungsgrenze abgezogen.</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 size={20} className="text-[#E60A1C] flex-shrink-0 mt-0.5" />
              <span><strong className="text-[#16181D]">Steuerklasse &amp; Freibeträge:</strong> Ihre Steuerklasse und mögliche Kinderfreibeträge bestimmen, wie viel Lohnsteuer monatlich einbehalten wird.</span>
            </li>
          </ul>
          <p>
            Wechseln Sie im Rechner bei Bedarf auf den Modus <strong className="text-[#16181D] font-semibold">Netto zu Brutto</strong>,
            um aus einem gewünschten Nettobetrag das nötige Bruttogehalt 2026 zu ermitteln. Möchten Sie die geplante
            Entlastung durch die Steuerreform sehen, vergleichen Sie einfach mit dem{" "}
            <a href="/brutto-netto-rechner-2027" className="text-[#E60A1C] font-semibold hover:underline">Brutto Netto Rechner 2027</a>.
          </p>
        </div>
      </div>

      {/* Ad: before the FAQ block */}
      <AdUnit placement="content" className="!my-0 !mb-8 !px-0" />

      {/* SEO Q&A section for 2026 long-tail queries */}
      <div className="w-full max-w-6xl mx-auto bg-[#F4F5F7] border border-black/[0.08] rounded-3xl p-8 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-6">
          Häufige Fragen zum Brutto Netto Rechner 2026
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
  );
}
