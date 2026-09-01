import type { Metadata } from "next";
import Link from "next/link";
import { Check, Zap, ShieldCheck, Euro } from "lucide-react";
import WidgetBuilder from "./WidgetBuilder";
import { SITE_URL, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Brutto-Netto-Rechner einbetten — kostenloses Widget",
  description:
    "Kostenloses Widget: Betten Sie den Brutto-Netto-Rechner 2026 per iframe auf Ihrer Website ein. Anpassbare Farbe, automatische Höhe, keine Registrierung.",
  alternates: { canonical: `${SITE_URL}/widget` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Brutto-Netto-Rechner als Widget einbetten | BruttoNettoCalculator",
    description: "Kostenlos, anpassbar, ohne Registrierung — der Gehaltsrechner 2026 für Ihre Website.",
    url: `${SITE_URL}/widget`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
};

export const dynamic = "force-static";

const VORTEILE = [
  { icon: Euro, title: "Kostenlos & ohne Registrierung", text: "Keine Anmeldung, kein API-Schlüssel, keine Nutzungsgebühr — Code kopieren und einbauen." },
  { icon: Zap, title: "Immer aktuelle Werte", text: "Der Rechner nutzt dieselbe Engine wie unsere Website. Gesetzesänderungen pflegen wir; Ihre Einbettung bleibt automatisch aktuell." },
  { icon: ShieldCheck, title: "Datenschutzfreundlich", text: "Die Berechnung läuft im Browser Ihrer Besucher. Wir speichern keine Eingaben und setzen im Widget keine Tracking-Cookies." },
];

const FAQS = [
  {
    q: "Ist die Einbettung wirklich kostenlos?",
    a: "Ja. Das Widget ist ohne Registrierung, ohne Gebühr und ohne Mengenbegrenzung nutzbar — für private wie kommerzielle Websites.",
  },
  {
    q: "Muss ich einen Link zu Ihnen setzen?",
    a: "Nein. Der Quellenhinweis unter dem Rechner ist freiwillig und lässt sich im Generator abschalten. Wir freuen uns darüber, machen ihn aber nicht zur Bedingung.",
  },
  {
    q: "Werden die Werte automatisch aktualisiert?",
    a: "Ja. Das Widget lädt bei jedem Aufruf die aktuelle Version von unserem Server. Ändern sich Grundfreibetrag, Beitragssätze oder Bemessungsgrenzen, pflegen wir das zentral — Sie müssen nichts anpassen.",
  },
  {
    q: "Welche Daten erhebt das Widget?",
    a: "Keine personenbezogenen. Die Berechnung erfolgt vollständig im Browser Ihrer Besucher; Eingaben werden weder gespeichert noch an uns übertragen. Im Widget laufen keine Werbe- oder Tracking-Skripte.",
  },
  {
    q: "Wie passe ich die Höhe an?",
    a: "Das mitgelieferte Skript meldet die tatsächliche Inhaltshöhe per postMessage an Ihre Seite und passt das iframe automatisch an. Ohne Skript genügt eine feste Starthöhe von etwa 520 Pixeln.",
  },
  {
    q: "Darf ich das Widget auf einer kommerziellen Seite einsetzen?",
    a: "Ja, ausdrücklich — auf Unternehmensseiten, in Stellenportalen, auf Kanzlei- oder Beratungsseiten und in Intranets.",
  },
];

export default function WidgetPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Widget einbetten", item: `${SITE_URL}/widget` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema({
              name: "Brutto-Netto-Rechner einbetten — kostenloses Widget",
              url: `${SITE_URL}/widget`,
              description:
                "Kostenloses iframe-Widget des Brutto-Netto-Rechners 2026 für die eigene Website.",
            })
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="min-h-screen bg-[#F4F5F7] text-[#16181D]">
        {/* ── Hero ── */}
        <section className="tool-hero relative overflow-hidden border-b border-black/[0.08]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-48 bg-[#E60A1C]/10 blur-3xl pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-5 py-16 sm:py-24 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-6">
              Kostenlos · Ohne Registrierung
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
              Brutto-Netto-Rechner{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60A1C] to-[#FF4D5E]">
                einbetten
              </span>
            </h1>
            <p className="text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
              Bieten Sie Ihren Besuchern eine Gehaltsberechnung nach den amtlichen Werten
              2026 — direkt auf Ihrer Seite. Code kopieren, einfügen, fertig.
            </p>
          </div>
        </section>

        {/* ── Vorteile ── */}
        <section className="max-w-6xl mx-auto px-5 py-12">
          <div className="grid sm:grid-cols-3 gap-5">
            {VORTEILE.map((v) => (
              <div key={v.title} className="bg-white border border-black/[0.08] rounded-2xl p-6">
                <v.icon size={22} className="text-[#E60A1C] mb-3" />
                <h2 className="font-bold text-base mb-1.5">{v.title}</h2>
                <p className="text-sm text-black/60 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Generator ── */}
        <section className="max-w-6xl mx-auto px-5 pb-12">
          <WidgetBuilder />
        </section>

        {/* ── Für wen ── */}
        <section className="max-w-6xl mx-auto px-5 pb-12">
          <div className="bg-white border border-black/[0.08] rounded-3xl p-8 sm:p-10">
            <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight mb-5">
              Für wen sich das Widget eignet
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
              {[
                "Personalabteilungen und Karriereseiten — Gehaltsangebote nachvollziehbar machen",
                "Stellenbörsen und Jobportale — Netto zum ausgeschriebenen Brutto zeigen",
                "Steuerberatungs- und Lohnbüro-Websites — Erstauskunft ohne Rückfrage",
                "Gewerkschaften und Betriebsräte — Tarifergebnisse greifbar machen",
                "Finanz- und Verbraucherblogs — Rechenbeispiele interaktiv statt statisch",
                "Intranets — Mitarbeitende rechnen Gehaltsänderungen selbst durch",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2.5 text-sm text-black/70">
                  <Check size={16} className="text-[#E60A1C] mt-0.5 flex-shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-6xl mx-auto px-5 pb-16">
          <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight mb-6">
            Häufige Fragen zum Widget
          </h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl bg-white border border-black/[0.08] overflow-hidden open:border-black/[0.18]"
              >
                <summary className="px-5 py-4 cursor-pointer font-bold text-sm list-none [&::-webkit-details-marker]:hidden flex justify-between gap-4">
                  <span>{f.q}</span>
                  <span className="text-[#E60A1C] group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="px-5 pb-4 text-sm text-black/65 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>

          <p className="mt-8 text-sm text-black/55 text-center">
            Fragen zur Einbettung?{" "}
            <Link href="/kontakt" className="text-[#E60A1C] font-semibold hover:underline">
              Schreiben Sie uns
            </Link>{" "}
            — wir helfen gern weiter.
          </p>
        </section>
      </main>
    </>
  );
}
