import Link from "next/link";
import { BarChart3, Table2, Info, HelpCircle } from "lucide-react";
import Section from "@/components/ui/Section";
import TableOfContents from "@/components/TableOfContents";
import { berechneBruttoNettoAT, berechnePensionAT, formatEURat as eur } from "@/lib/oesterreich";
import { atMetadata, AtSchemas, AtHero, AtFaqList, AtTabelle, AtQuellen, AT_STANDARD, eur0, type AtFaq } from "@/components/oesterreich/AtShared";

/**
 * Durchschnittsgehalt Österreich. Rising-CSV AT: "durchschnittsgehalt
 * österreich" und "… netto". Zahlen: Statistik Austria, Jährliche
 * Personeneinkommen 2024 (veröffentlicht 9.1.2026). Das sind MEDIANE, keine
 * arithmetischen Mittel — die Seite sagt das ausdrücklich (vgl. den
 * Destatis-Fehler auf der deutschen Seite, Memory "trend-build-2026-08-03").
 */

const PATH = "/durchschnittsgehalt-oesterreich";
const TITLE = "Durchschnittsgehalt Österreich — brutto & netto (Median)";
const DESCRIPTION =
  "Durchschnittsgehalt in Österreich: Vollzeit verdient man im Median 55.678 € brutto im Jahr. Was das netto pro Monat bedeutet — mit Werten für alle Beschäftigten und Pensionen.";

export const metadata = atMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "durchschnittsgehalt österreich",
    "durchschnittsgehalt österreich netto",
    "medianeinkommen österreich",
    "durchschnittseinkommen österreich 2026",
    "durchschnittsgehalt vollzeit österreich",
    "was verdient man in österreich",
  ],
});

const DATEN = [
  { key: "vollzeit", label: "Ganzjährig Vollzeit", jahr: 55678, plus: "+8,1 %" },
  { key: "alle", label: "Alle unselbständig Erwerbstätigen", jahr: 38043, plus: "+7,7 %" },
] as const;
const PENSION_JAHR = 28660;

const ZEILEN = DATEN.map((d) => {
  const monat = d.jahr / 14;
  const r = berechneBruttoNettoAT({ ...AT_STANDARD, bruttoMonat: monat });
  return { ...d, monat, netto: r.laufend.netto, jahrNetto: r.jahr.netto };
});
const VZ = ZEILEN[0];
const ALLE = ZEILEN[1];
const P = berechnePensionAT({ bruttoPension: PENSION_JAHR / 14, erhoehterPab: false, avabKinder: 0 });

const FAQS: AtFaq[] = [
  {
    q: "Wie hoch ist das Durchschnittsgehalt in Österreich?",
    a: `Ganzjährig Vollzeitbeschäftigte verdienten 2024 im Median ${eur0(VZ.jahr)} brutto im Jahr — das sind 14 Bezüge zu je rund ${eur0(
      VZ.monat
    )}. Netto bleiben davon nach heutigen Abzügen (2026) rund ${eur(VZ.netto)} im Monat. Über alle Beschäftigten, also mit Teilzeit und unterjährigen Jobs, lag der Median bei ${eur0(ALLE.jahr)} brutto.`,
  },
  {
    q: "Was ist der Unterschied zwischen Durchschnitt und Median?",
    a: "Der Median teilt alle Beschäftigten in zwei gleich große Hälften: Die eine verdient mehr, die andere weniger. Der arithmetische Durchschnitt liegt höher, weil wenige sehr hohe Gehälter ihn nach oben ziehen. Statistik Austria veröffentlicht deshalb Mediane — wer „Durchschnittsgehalt“ sucht, meint meist genau diese Zahl.",
  },
  {
    q: "Wie viel netto verdient der Durchschnitt in Österreich?",
    a: `Mit dem Vollzeit-Median von ${eur0(VZ.monat)} brutto pro Monat bleiben 2026 rund ${eur(VZ.netto)} netto pro Monat, im Jahr mit 13. und 14. Gehalt ${eur(
      VZ.jahrNetto
    )}. Wien liegt wegen des höheren Wohnbauförderungsbeitrags knapp darunter.`,
  },
  {
    q: "Wie hoch ist die durchschnittliche Pension in Österreich?",
    a: `Der Median aller Pensionen lag 2024 bei ${eur0(PENSION_JAHR)} brutto im Jahr (+11,0 %), also rund ${eur0(
      PENSION_JAHR / 14
    )} pro Auszahlung. Netto bleiben davon 2026 rund ${eur(P.laufend.netto)} im Monat.`,
  },
];

export default function Page() {
  return (
    <div className="min-h-screen">
      <AtSchemas path={PATH} title={TITLE} description={DESCRIPTION} crumb="Durchschnittsgehalt" faqs={FAQS} />
      <AtHero crumb="Durchschnittsgehalt" badge="Österreich · Statistik Austria 2024" title="Durchschnittsgehalt" accent="Österreich">
        <p>
          Vollzeitbeschäftigte verdienen in Österreich im Median <strong>{eur0(VZ.jahr)} brutto im Jahr</strong> — rund{" "}
          {eur0(VZ.monat)} pro Monat bei 14 Gehältern und <strong>{eur(VZ.netto)} netto</strong>.
        </p>
      </AtHero>

      <div className="max-w-5xl mx-auto px-4 sm:px-5 pb-16">
        <TableOfContents
          className="mb-8"
          items={[
            { id: "zahlen", label: "Brutto & netto" },
            { id: "einordnung", label: "Median statt Durchschnitt" },
            { id: "faq", label: "Häufige Fragen" },
          ]}
        />

        <Section
          id="zahlen"
          eyebrow="Zahlen"
          eyebrowIcon={Table2}
          title="Mittleres Einkommen in Österreich: brutto und netto"
          intro="Brutto: Median 2024 laut Statistik Austria (Lohnsteuer- und SV-Daten). Netto: mit den Abzügen 2026 für Angestellte, 14 Gehälter, ohne Kinder."
        >
          <AtTabelle
            kopf={["Gruppe", "Brutto / Jahr", "Brutto / Monat (÷ 14)", "Netto / Monat", "Netto / Jahr"]}
            minWidth={660}
            zeilen={[
              ...ZEILEN.map((z) => ({ label: z.label, werte: [z.jahr, z.monat, z.netto, z.jahrNetto], hervorheben: z.key === "vollzeit" })),
              { label: "Pensionen", werte: [PENSION_JAHR, PENSION_JAHR / 14, P.laufend.netto, P.jahr.netto] },
            ]}
          />
          <p className="text-xs text-black/50 mt-3 flex items-start gap-1.5">
            <Info size={12} className="flex-shrink-0 mt-0.5" />
            Veränderung zum Vorjahr laut Statistik Austria: Vollzeit {DATEN[0].plus}, alle Erwerbstätigen {DATEN[1].plus},
            Pensionen +11,0 %. Die Werte für 2025 erscheinen voraussichtlich Anfang 2027.
          </p>
        </Section>

        <Section id="einordnung" variant="muted" eyebrow="Einordnung" eyebrowIcon={BarChart3} title="Median statt Durchschnitt — und was er aussagt" prose>
          <p>
            Die Hälfte der ganzjährig Vollzeitbeschäftigten verdient mehr als {eur0(VZ.jahr)} brutto, die andere Hälfte weniger.
            Über alle Beschäftigten ist der Median mit {eur0(ALLE.jahr)} deutlich niedriger, weil Teilzeit und Jobs, die nicht das
            ganze Jahr laufen, mitzählen — rund 46 % Abstand.
          </p>
          <p>
            Wo Ihr Gehalt liegt, hängt stark von Branche und Kollektivvertrag ab. Typische Untergrenzen zeigt die Seite{" "}
            <Link href="/mindestlohn-oesterreich">Mindestlohn Österreich</Link>, ein Beispiel aus dem öffentlichen Dienst das{" "}
            <Link href="/lehrer-gehalt-oesterreich">Lehrer-Gehalt</Link>. Ihr persönliches Netto rechnet der{" "}
            <Link href="/brutto-netto-rechner-oesterreich">Brutto-Netto-Rechner Österreich</Link>; für Deutschland gibt es das{" "}
            <Link href="/durchschnittsgehalt-deutschland">Durchschnittsgehalt Deutschland</Link>.
          </p>
        </Section>

        <Section id="faq" eyebrow="FAQ" eyebrowIcon={HelpCircle} title="Häufige Fragen zum Durchschnittsgehalt">
          <AtFaqList faqs={FAQS} />
        </Section>

        <AtQuellen>
          Quelle: Statistik Austria, „Jährliche Personeneinkommen“, Einkommensjahr 2024, veröffentlicht am 9.1.2026. Netto mit
          der Rechenlogik des Brutto-Netto-Rechners Österreich (Werte 2026); die Bruttowerte stammen aus 2024 und dürften inzwischen
          höher liegen. Angaben ohne Gewähr.
        </AtQuellen>
      </div>
    </div>
  );
}
