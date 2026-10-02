import Link from "next/link";
import { Table2, ListOrdered, TrendingUp, HelpCircle } from "lucide-react";
import Section from "@/components/ui/Section";
import TableOfContents from "@/components/TableOfContents";
import PensionRechnerAT from "./PensionRechnerAT";
import { AT_2026, AT_2027, berechnePensionAT, formatEURat as eur } from "@/lib/oesterreich";
import { atMetadata, AtSchemas, AtHero, AtFaqList, AtTabelle, AtQuellen, eur0, type AtFaq } from "@/components/oesterreich/AtShared";

/**
 * Pension Brutto-Netto-Rechner Österreich. Aus dem Rising-CSV AT
 * (25.9.–2.10.2026): "brutto netto rechner pension österreich" (25),
 * "pension brutto netto rechner" (24), "pensionsrechner österreich".
 * Rechenlogik: berechnePensionAT() in lib/oesterreich.ts, geprüft gegen das
 * veröffentlichte Beispiel 2.000 € → 1.801,78 € netto.
 */

const PATH = "/pension-brutto-netto-rechner-oesterreich";
const TITLE = "Pension Brutto Netto Rechner Österreich 2026 & 2027";
const DESCRIPTION =
  "Pensionsrechner Österreich: Nettopension 2026 und 2027 mit 6 % Krankenversicherung, Lohnsteuer, Pensionistenabsetzbetrag und 13./14. Pension berechnen.";

export const metadata = atMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "brutto netto rechner pension österreich",
    "pension brutto netto rechner",
    "pensionsrechner österreich",
    "nettopension berechnen österreich",
    "pensionistenabsetzbetrag 2026",
    "pensionserhöhung 2027",
    "13. 14. pension netto",
  ],
});

const STUFEN = [1000, 1308.39, 1500, 1800, 2000, 2200, 2500, 3000, 3500, 4000, 5000, 6000];
const TABELLE = STUFEN.map((b) => {
  const r = berechnePensionAT({ bruttoPension: b, erhoehterPab: false, avabKinder: 0 });
  const r27 = berechnePensionAT({ bruttoPension: b, erhoehterPab: false, avabKinder: 0, jahr: 2027 });
  return { b, kv: r.laufend.kv, lst: r.laufend.lohnsteuer, netto: r.laufend.netto, jahr: r.jahr.netto, n27: r27.laufend.netto };
});
const R2000 = berechnePensionAT({ bruttoPension: 2000, erhoehterPab: false, avabKinder: 0 });
// Steuerfreigrenze: höchste Pension ohne laufende Lohnsteuer (auf 10 € genau).
const STEUERFREI_BIS = (() => {
  let b = 1000;
  while (berechnePensionAT({ bruttoPension: b + 10, erhoehterPab: false, avabKinder: 0 }).laufend.lohnsteuer === 0) b += 10;
  return b;
})();
const MEDIAN_JAHR = 28660;
const MEDIAN_MONAT = MEDIAN_JAHR / 14;
const RMEDIAN = berechnePensionAT({ bruttoPension: MEDIAN_MONAT, erhoehterPab: false, avabKinder: 0 });

const FAQS: AtFaq[] = [
  {
    q: "Wie viel netto bleibt von 2.000 € Pension in Österreich?",
    a: `2026 bleiben von 2.000 € Bruttopension ${eur(R2000.laufend.netto)} netto: ${eur(R2000.laufend.kv)} gehen an die Krankenversicherung (6 %), ${eur(
      R2000.laufend.lohnsteuer
    )} sind Lohnsteuer. Im April und Oktober kommt je eine Sonderzahlung dazu, von der rund ${eur(R2000.sonderzahlungen[1].netto)} netto ankommen. Im Jahr sind das ${eur(R2000.jahr.netto)} netto.`,
  },
  {
    q: "Was wird von der Pension abgezogen?",
    a: "Nur zwei Posten: 6 % Krankenversicherungsbeitrag (seit 1. Juni 2025, vorher 5,1 %) und die Lohnsteuer. Pensions- und Arbeitslosenversicherung, AK-Umlage und Wohnbauförderung fallen in der Pension nicht mehr an. Die Krankenversicherung wird auch von der 13. und 14. Pension abgezogen.",
  },
  {
    q: "Bis zu welcher Pension zahlt man keine Lohnsteuer?",
    a: `Mit dem Pensionistenabsetzbetrag von ${eur0(AT_2026.pension.pab.betrag)} bleibt eine Pension 2026 bis rund ${eur0(
      STEUERFREI_BIS
    )} brutto im Monat lohnsteuerfrei (eine Pension, ohne weitere Einkünfte). Die 13. und 14. Pension sind steuerfrei, solange das Jahressechstel — zwei durchschnittliche Monatspensionen — höchstens 2.615 € beträgt.`,
  },
  {
    q: "Wie hoch ist der Pensionistenabsetzbetrag 2026 und 2027?",
    a: `2026 bis zu ${eur0(AT_2026.pension.pab.betrag)} im Jahr, eingeschliffen zwischen ${eur0(AT_2026.pension.pab.voll)} und ${eur0(
      AT_2026.pension.pab.bis
    )} Pensionseinkünften; der erhöhte bis zu ${eur0(AT_2026.pension.pabErhoeht.betrag)}. 2027 steigt er auf ${eur0(
      AT_2027.pension.pab.betrag
    )} (erhöht ${eur0(AT_2027.pension.pabErhoeht.betrag)}), die Einschleifung endet bei ${eur0(AT_2027.pension.pab.bis)}.`,
  },
  {
    q: "Um wie viel steigen die Pensionen 2027?",
    a: "Um 2,95 % für ein Gesamtpensionseinkommen bis 6.930 € brutto im Monat, darüber um einen Fixbetrag von 204,44 €. Wer 2026 in Pension gegangen ist, bekommt bei der ersten Erhöhung nur die Hälfte (1,475 %). Die Richtsätze für die Ausgleichszulage steigen um 3,3 %. Die Erhöhung gilt ab 1. Jänner 2027 und wird mit der Jänner-Pension Ende Jänner ausgezahlt.",
  },
  {
    q: "Wann wird die 13. und 14. Pension ausgezahlt?",
    a: "Mit der April- und der Oktober-Pension, jeweils in Höhe der Pension dieses Monats. Wer die Pension im Sonderzahlungsmonat und den fünf Monaten davor nicht durchgehend bezogen hat, bekommt die erste Sonderzahlung nur anteilig.",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen">
      <AtSchemas path={PATH} title={TITLE} description={DESCRIPTION} crumb="Pensionsrechner" faqs={FAQS} />
      <AtHero crumb="Pensionsrechner" badge="Österreich · Pension 2026 & 2027" title="Pension Brutto Netto Rechner" accent="Österreich">
        <p>
          Was von Ihrer Pension netto bleibt: 6 % Krankenversicherung, Lohnsteuer nach dem Tarif 2026 oder 2027,
          Pensionistenabsetzbetrag und die 13. und 14. Pension im April und Oktober.
        </p>
      </AtHero>

      <PensionRechnerAT />

      <div className="max-w-5xl mx-auto px-4 sm:px-5 pb-16">
        <TableOfContents
          className="mb-8"
          items={[
            { id: "tabelle", label: "Pensionstabelle" },
            { id: "berechnung", label: "So wird gerechnet" },
            { id: "erhoehung", label: "Pensionserhöhung" },
            { id: "faq", label: "Häufige Fragen" },
          ]}
        />

        <Section
          id="tabelle"
          eyebrow="Tabelle"
          eyebrowIcon={Table2}
          title="Pension brutto netto: Tabelle 2026"
          intro="Eine ASVG-Pension, ohne erhöhten Pensionistenabsetzbetrag und ohne Alleinverdienerabsetzbetrag. Letzte Spalte: dieselbe Bruttopension mit den Steuerwerten 2027."
        >
          <AtTabelle
            kopf={["Brutto / Monat", "KV 6 %", "Lohnsteuer", "Netto / Monat", "Netto / Jahr", "Netto 2027"]}
            minWidth={680}
            zeilen={TABELLE.map((t) => ({
              label: t.b === 1308.39 ? <>{eur(t.b)} <span className="font-normal text-black/50">(Ausgleichszulagen-Richtsatz)</span></> : eur(t.b),
              werte: [t.kv, t.lst, t.netto, t.jahr, t.n27],
              hervorheben: t.b === 2000,
            }))}
          />
          <p className="text-sm text-black/65 mt-3 leading-relaxed">
            Die mittlere Alterspension lag laut Statistik Austria 2024 bei {eur0(MEDIAN_JAHR)} brutto im Jahr, also rund{" "}
            {eur0(MEDIAN_MONAT)} pro Auszahlung. Mit den Werten 2026 bleiben davon {eur(RMEDIAN.laufend.netto)} netto im Monat.
          </p>
        </Section>

        <Section id="berechnung" variant="muted" eyebrow="Rechenweg" eyebrowIcon={ListOrdered} title="So wird die Nettopension berechnet">
          <ol className="space-y-3 text-sm sm:text-base text-black/75 leading-relaxed list-decimal pl-5">
            <li>
              <strong className="text-[#16181D]">Krankenversicherung:</strong> 6 % der Bruttopension. Auch Bezieher einer Ausgleichszulage zahlen seit 2026 6 %.
            </li>
            <li>
              <strong className="text-[#16181D]">Bemessungsgrundlage:</strong> Pension minus KV, hochgerechnet auf 12 Monate.
              Anders als bei Angestellten gibt es keine Werbungskostenpauschale und keinen Verkehrsabsetzbetrag.
            </li>
            <li>
              <strong className="text-[#16181D]">Tarif minus Absetzbeträge:</strong> Auf die Bemessungsgrundlage wird der Tarif
              angewendet (0 % bis {eur0(AT_2026.tarif[0].bis)}, dann 20 %, 30 % …). Davon gehen der Pensionistenabsetzbetrag
              und gegebenenfalls der Alleinverdiener- oder Alleinerzieherabsetzbetrag ab.
            </li>
            <li>
              <strong className="text-[#16181D]">Sonderzahlungen:</strong> 13. und 14. Pension nach Abzug der KV: 620 € im Jahr
              steuerfrei, der Rest mit festen 6 %.
            </li>
          </ol>
          <p className="text-sm text-black/65 mt-4">
            Arbeiten Sie neben der Pension? Dann rechnet der{" "}
            <Link href="/brutto-netto-rechner-oesterreich" className="text-[#E60A1C] font-semibold hover:underline">
              Brutto-Netto-Rechner Österreich
            </Link>{" "}
            das Gehalt; beide Einkünfte werden in der Arbeitnehmerveranlagung gemeinsam versteuert.
          </p>
        </Section>

        <Section id="erhoehung" eyebrow="Erhöhung" eyebrowIcon={TrendingUp} title="Pensionserhöhung 2026 und 2027">
          <div className="overflow-x-auto bg-white border border-black/[0.08] rounded-2xl">
            <table className="w-full text-sm min-w-[460px]">
              <thead>
                <tr className="text-left bg-black/[0.03] border-b border-black/[0.08]">
                  <th className="px-4 py-3 font-bold"></th>
                  <th className="px-4 py-3 font-bold">2026</th>
                  <th className="px-4 py-3 font-bold">2027</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black/[0.05]">
                  <th scope="row" className="px-4 py-3 font-semibold text-left">Erhöhung</th>
                  <td className="px-4 py-3">2,7 % bis 2.500 € Gesamtpension</td>
                  <td className="px-4 py-3">2,95 % bis 6.930 € Gesamtpension</td>
                </tr>
                <tr className="border-b border-black/[0.05]">
                  <th scope="row" className="px-4 py-3 font-semibold text-left">Darüber</th>
                  <td className="px-4 py-3">Fixbetrag 67,50 €</td>
                  <td className="px-4 py-3">Fixbetrag 204,44 €</td>
                </tr>
                <tr className="border-b border-black/[0.05]">
                  <th scope="row" className="px-4 py-3 font-semibold text-left">Erste Erhöhung</th>
                  <td className="px-4 py-3">50 % für Pensionsantritt 2025</td>
                  <td className="px-4 py-3">50 % für Pensionsantritt 2026</td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 font-semibold text-left">Ausgleichszulage (alleinstehend)</th>
                  <td className="px-4 py-3">1.308,39 €</td>
                  <td className="px-4 py-3">+3,3 %</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-black/65 mt-3 leading-relaxed">
            Ab 2027 steigt nicht nur die Bruttopension: Mit den höheren Steuerstufen und dem Pensionistenabsetzbetrag von{" "}
            {eur0(AT_2027.pension.pab.betrag)} sinkt zugleich die Lohnsteuer. Für die neuen Steuerwerte stellen Sie im Rechner
            das Jahr 2027 ein und tragen die erhöhte Bruttopension ein.
          </p>
        </Section>

        <Section id="faq" variant="muted" eyebrow="FAQ" eyebrowIcon={HelpCircle} title="Häufige Fragen zur Pension">
          <AtFaqList faqs={FAQS} />
        </Section>

        <AtQuellen>
          Quellen: PVA „Aktuelle Werte 2026“ und Merkblatt „Sonderzahlungen“; PVA „Pensionsanpassung 2027“; BMF Steuerbuch 2026
          (Pensionistenabsetzbeträge); Inflationsanpassungsverordnung 2027; Statistik Austria, Jährliche Personeneinkommen 2024
          (Veröffentlichung 9.1.2026). Gilt für eine Pension aus der gesetzlichen Pensionsversicherung; Beamtenpensionen haben
          zusätzlich einen Pensionssicherungsbeitrag. Angaben ohne Gewähr.
        </AtQuellen>
      </div>
    </div>
  );
}
