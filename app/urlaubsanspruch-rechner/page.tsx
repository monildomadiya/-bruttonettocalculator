import type { Metadata } from "next";
import Link from "next/link";
import UrlaubsanspruchRechner from "./UrlaubsanspruchRechner";
import RelatedCalculators from "@/components/RelatedCalculators";

export const metadata: Metadata = {
  title: "Urlaubsanspruch berechnen: Rechner für Teilzeit & Vollzeit",
  description:
    "Urlaubsanspruch berechnen nach § 3 BUrlG — für Vollzeit, Teilzeit, 4-Tage-Woche und Minijob. Inklusive anteiligem Anspruch bei Kündigung und Zusatzurlaub.",
  keywords: [
    "Urlaubsanspruch berechnen",
    "Urlaubsanspruch Rechner",
    "Urlaubstage berechnen",
    "Urlaubsanspruch Teilzeit",
    "Urlaubsanspruch 4 Tage Woche",
    "Urlaubsanspruch Minijob",
    "Urlaubsanspruch Kündigung",
    "wie viele Urlaubstage stehen mir zu",
  ],
  alternates: { canonical: "https://bruttonettocalculator.com/urlaubsanspruch-rechner" },
  openGraph: {
    images: ["https://bruttonettocalculator.com/og-image.png"],
    title: "Urlaubsanspruch berechnen — Rechner 2026",
    description: "Wie viele Urlaubstage stehen Ihnen zu? Für Teilzeit, 4-Tage-Woche, Minijob und unterjährigen Eintritt.",
    url: "https://bruttonettocalculator.com/urlaubsanspruch-rechner",
    locale: "de_DE",
    type: "website",
  },
};

/** Muss inhaltlich mit den FAQ-Fragen in UrlaubsanspruchRechner.tsx übereinstimmen. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wie viele Urlaubstage stehen mir gesetzlich zu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Das Bundesurlaubsgesetz nennt 24 Werktage bei einer Sechs-Tage-Woche (§ 3 BUrlG). Weil Werktage Montag bis Samstag umfassen, entspricht das bei der üblichen Fünf-Tage-Woche 20 Urlaubstagen im Jahr. Arbeits- und Tarifverträge sehen häufig mehr vor, meist 25 bis 30 Tage.",
      },
    },
    {
      "@type": "Question",
      name: "Wie berechne ich den Urlaubsanspruch bei Teilzeit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Entscheidend ist die Zahl der Arbeitstage pro Woche, nicht die Stundenzahl. Formel: Urlaubstage × eigene Arbeitstage ÷ Arbeitstage einer Vollzeitkraft. Bei 30 Urlaubstagen und Reduzierung auf drei Tage sind es 18 Tage. Wer dieselbe Stundenzahl auf fünf Tage verteilt, behält die vollen 30 Tage.",
      },
    },
    {
      "@type": "Question",
      name: "Wie viel Urlaub steht mir bei einer 4-Tage-Woche zu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bei gesetzlichem Mindesturlaub 16 Tage (24 × 4 ÷ 6). Bei einem vertraglichen Anspruch von 30 Tagen auf Basis einer Fünf-Tage-Woche sind es 24 Tage. Die Zahl der Urlaubstage sinkt, der Erholungswert bleibt gleich — für eine freie Woche brauchen Sie nur vier statt fünf Tage.",
      },
    },
    {
      "@type": "Question",
      name: "Wie viel Urlaub bekomme ich bei unterjährigem Eintritt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Für jeden vollen Monat des Arbeitsverhältnisses ein Zwölftel des Jahresanspruchs (§ 5 BUrlG). Bruchteile von mindestens einem halben Tag werden auf volle Tage aufgerundet. Den vollen Jahresanspruch erwerben Sie erstmals nach sechs Monaten Wartezeit.",
      },
    },
    {
      "@type": "Question",
      name: "Was passiert mit dem Urlaub bei Kündigung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bei Ausscheiden in der ersten Jahreshälfte gibt es ein Zwölftel pro vollem Beschäftigungsmonat. Bei Ausscheiden nach dem 30. Juni und erfüllter sechsmonatiger Wartezeit steht der volle Jahresurlaub zu. Nicht genommener Urlaub muss abgegolten, also ausgezahlt werden.",
      },
    },
    {
      "@type": "Question",
      name: "Bekommen Minijobber Urlaub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, in vollem Umfang. Der Urlaubsanspruch hängt nicht vom Verdienst ab, sondern allein von den Arbeitstagen pro Woche. Wer an zwei Tagen pro Woche arbeitet, hat gesetzlich acht Urlaubstage (24 × 2 ÷ 6).",
      },
    },
    {
      "@type": "Question",
      name: "Wann verfällt mein Urlaub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Grundsätzlich am 31. Dezember des Urlaubsjahres, mit Übertragung bis zum 31. März nur bei dringenden betrieblichen oder persönlichen Gründen. Nach der Rechtsprechung des Bundesarbeitsgerichts verfällt Urlaub aber nur, wenn der Arbeitgeber rechtzeitig auf den Resturlaub und den drohenden Verfall hingewiesen hat.",
      },
    },
  ],
};

function Content() {
  return (
    <div className="max-w-6xl mx-auto px-5">
      <section className="py-6" aria-labelledby="ua-kurzantwort">
        <div className="bg-[#FFFFFF] border-l-4 border-[#E60A1C] rounded-2xl p-6 sm:p-7 shadow-sm">
          <h2 id="ua-kurzantwort" className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">
            Kurzantwort
          </h2>
          <p className="text-black/75 text-sm sm:text-base leading-relaxed">
            Gesetzlich stehen Ihnen <strong className="text-[#16181D]">24 Werktage</strong> Urlaub zu (§ 3
            BUrlG). Weil das Gesetz von einer Sechs-Tage-Woche ausgeht, sind das bei der üblichen
            Fünf-Tage-Woche <strong className="text-[#16181D]">20 Urlaubstage</strong>. Entscheidend für die
            Umrechnung sind immer die <strong className="text-[#16181D]">Arbeitstage pro Woche</strong>,
            nicht die Wochenstunden — deshalb behält jemand, der Teilzeit auf fünf Tage verteilt, die volle
            Zahl an Urlaubstagen.
          </p>
        </div>
      </section>

      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4"
        aria-labelledby="ua-formel"
      >
        <h2 id="ua-formel" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Die Formel — und der häufigste Denkfehler
        </h2>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 shadow-sm">
          <p className="font-mono text-sm text-black/80 bg-black/[0.04] rounded-lg px-3 py-2 mb-3">
            Urlaubstage = Urlaubsanspruch × eigene Arbeitstage ÷ Arbeitstage Vollzeit
          </p>
          <p className="text-black/65 text-sm">
            Beispiel: 30 Vertragstage bei Fünf-Tage-Woche, reduziert auf drei Tage → 30 × 3 ÷ 5 ={" "}
            <strong className="text-[#16181D]">18 Urlaubstage</strong>.
          </p>
        </div>
        <p>
          Der Denkfehler, der in der Praxis am häufigsten zu Streit führt: Viele rechnen mit den{" "}
          <em>Stunden</em>. Wer seine Arbeitszeit von 40 auf 20 Wochenstunden halbiert, dabei aber weiter an
          fünf Tagen arbeitet, behält den <strong className="text-[#16181D]">vollen Urlaubsanspruch</strong> —
          er arbeitet ja weiterhin an fünf Tagen pro Woche, nur kürzer. Gekürzt wird nur, wenn sich die Zahl
          der Arbeitstage ändert.
        </p>
        <p>
          Umgekehrt gilt: Wechseln Sie unterjährig von fünf auf vier Tage, muss der Resturlaub anteilig
          umgerechnet werden — bereits genommener Urlaub bleibt dabei unangetastet.
        </p>
      </section>

      <section className="py-6" aria-labelledby="ua-tabelle">
        <h2 id="ua-tabelle" className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Urlaubstage nach Arbeitstagen pro Woche
        </h2>
        <p className="text-black/65 text-sm sm:text-base mb-5 max-w-3xl">
          Links das gesetzliche Minimum, rechts typische vertragliche Ansprüche — jeweils umgerechnet auf
          Ihre Arbeitstage.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Arbeitstage / Woche</th>
                <th className="py-4 px-5 text-right text-[#16181D] font-bold">Gesetzlich</th>
                <th className="py-4 px-5 text-right">bei 25 Tagen</th>
                <th className="py-4 px-5 text-right">bei 30 Tagen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {[6, 5, 4, 3, 2, 1].map((t) => (
                <tr key={t} className="hover:bg-black/[0.03] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#16181D]">
                    {t} {t === 1 ? "Tag" : "Tage"}
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-emerald-600 bg-emerald-50/60">
                    {((24 * t) / 6).toLocaleString("de-DE")}
                  </td>
                  <td className="py-4 px-5 text-right font-mono text-black/70">
                    {((25 * t) / 5).toLocaleString("de-DE")}
                  </td>
                  <td className="py-4 px-5 text-right font-mono text-black/70">
                    {((30 * t) / 5).toLocaleString("de-DE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3">
          Vertragliche Ansprüche beziehen sich üblicherweise auf eine Fünf-Tage-Woche. Der gesetzliche
          Anspruch rechnet dagegen mit sechs Werktagen — daher die unterschiedlichen Divisoren.
        </p>
      </section>

      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4"
        aria-labelledby="ua-verfall"
      >
        <h2 id="ua-verfall" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Verfall: Was das BAG geändert hat
        </h2>
        <p>
          Formal verfällt Urlaub am 31. Dezember, eine Übertragung bis zum 31. März ist nur bei dringenden
          Gründen vorgesehen. In der Praxis ist diese Regel aber deutlich entschärft: Nach der
          Rechtsprechung des Bundesarbeitsgerichts — im Anschluss an den Europäischen Gerichtshof — verfällt
          Urlaub nur, wenn der Arbeitgeber seine <strong className="text-[#16181D]">Mitwirkungsobliegenheit</strong>{" "}
          erfüllt hat.
        </p>
        <p>Er muss also rechtzeitig und klar</p>
        <ul>
          <li>auf den konkreten Resturlaub hinweisen,</li>
          <li>auffordern, ihn zu nehmen, und</li>
          <li>auf den drohenden Verfall hinweisen.</li>
        </ul>
        <p>
          Unterbleibt das, sammelt sich der Urlaub an. Bei langer Krankheit gilt zusätzlich eine
          Sonderregel: Der Anspruch erlischt dort erst 15 Monate nach Ende des Urlaubsjahres.
        </p>
      </section>

      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-3"
        aria-labelledby="ua-links"
      >
        <h2 id="ua-links" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">Passende Rechner</h2>
        <p>
          Was während des Urlaubs weitergezahlt wird, ist Ihr normales Gehalt — berechnen Sie es mit dem{" "}
          <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">
            Brutto-Netto-Rechner
          </Link>
          . Ein zusätzlich gezahltes <strong className="text-[#16181D]">Urlaubsgeld</strong> wird dagegen als
          Sonderzahlung versteuert — dafür gibt es den{" "}
          <Link href="/urlaubsgeld-rechner" className="text-[#E60A1C] font-semibold hover:underline">
            Urlaubsgeld-Rechner
          </Link>
          . Bei reduzierter Stundenzahl lohnt der{" "}
          <Link href="/teilzeitrechner" className="text-[#E60A1C] font-semibold hover:underline">
            Teilzeitrechner
          </Link>
          , für Minijobs der{" "}
          <Link href="/minijob-rechner" className="text-[#E60A1C] font-semibold hover:underline">
            Minijob-Rechner
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

export default function UrlaubsanspruchRechnerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UrlaubsanspruchRechner content={<Content />} />
      <RelatedCalculators
        links={[
          { href: "/urlaubsgeld-rechner", label: "Urlaubsgeld-Rechner", desc: "Netto vom Urlaubsgeld" },
          { href: "/teilzeitrechner", label: "Teilzeitrechner", desc: "Netto bei Teilzeit" },
          { href: "/minijob-rechner", label: "Minijob-Rechner", desc: "Verdienstgrenze 603 €" },
          { href: "/", label: "Brutto-Netto-Rechner", desc: "Vollständiges Nettogehalt 2026" },
        ]}
      />
    </>
  );
}
