import Link from "next/link";
import { Scale, Table2, Users, HelpCircle, Calculator } from "lucide-react";
import Section from "@/components/ui/Section";
import TableOfContents from "@/components/TableOfContents";
import { AT_2026, AT_2027, berechneBruttoNettoAT, tarifsteuerAT, formatEURat as eur } from "@/lib/oesterreich";
import {
  atMetadata,
  AtSchemas,
  AtHero,
  AtFaqList,
  AtTabelle,
  AtQuellen,
  AT_STANDARD,
  eur0,
  type AtFaq,
} from "@/components/oesterreich/AtShared";

/**
 * Lohnsteuer Österreich: Steuerstufen 2026/2027, Lohnsteuertabelle,
 * Absetzbeträge. Fängt "lohnsteuer österreich" (10) und
 * "steuerklassen österreich" (6) aus dem Rising-CSV AT ab — letzteres ist eine
 * deutsche Denkweise; die Seite erklärt, dass es in Österreich keine
 * Steuerklassen gibt und was stattdessen wirkt.
 */

const PATH = "/lohnsteuer-oesterreich";
const TITLE = "Lohnsteuer Österreich 2026: Steuerstufen & Tabelle";
const DESCRIPTION =
  "Lohnsteuer in Österreich 2026 und 2027: alle Steuerstufen, Lohnsteuertabelle von 1.500 bis 10.000 € brutto, Absetzbeträge — und warum es keine Steuerklassen gibt.";

export const metadata = atMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "lohnsteuer österreich",
    "lohnsteuer österreich 2026",
    "steuerstufen österreich 2026",
    "steuerklassen österreich",
    "lohnsteuertabelle 2026 österreich",
    "einkommensteuer österreich tarif",
    "steuerstufen 2027",
  ],
});

const stufen = (t: readonly { bis: number; satz: number }[]) =>
  t.slice(0, 6).map((s, i) => ({ von: i === 0 ? 0 : t[i - 1].bis, bis: s.bis, satz: s.satz }));
const T26 = stufen(AT_2026.tarif);
const T27 = stufen(AT_2027.tarif);

const BRUTTO = [1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 10000];
const TABELLE = BRUTTO.map((b) => {
  const r = berechneBruttoNettoAT({ ...AT_STANDARD, bruttoMonat: b });
  const r27 = berechneBruttoNettoAT({ ...AT_STANDARD, bruttoMonat: b, jahr: 2027 });
  return {
    b,
    lst: r.laufend.lohnsteuer,
    satz: r.laufend.lohnsteuer / b,
    lstJahr: r.jahr.lohnsteuer,
    lst27: r27.laufend.lohnsteuer,
    grenz: r.grenzsteuersatz,
  };
});
const L3000 = TABELLE.find((t) => t.b === 3000)!;
const STEUERFREI_MONAT = (() => {
  let b = 1000;
  while (berechneBruttoNettoAT({ ...AT_STANDARD, bruttoMonat: b + 10 }).laufend.lohnsteuer === 0) b += 10;
  return b;
})();
const pct = (v: number) => (v * 100).toLocaleString("de-AT", { maximumFractionDigits: 1 }) + " %";

const FAQS: AtFaq[] = [
  {
    q: "Gibt es in Österreich Steuerklassen?",
    a: "Nein. Anders als in Deutschland gibt es in Österreich keine Steuerklassen — jede Person wird einzeln besteuert, auch Ehepaare. Familienstand und Kinder wirken über Absetzbeträge, die direkt von der Steuer abgezogen werden: Familienbonus Plus, Alleinverdiener- und Alleinerzieherabsetzbetrag. Die Steuerstufen (0 bis 55 %) sind für alle gleich.",
  },
  {
    q: "Wie viel Lohnsteuer zahlt man bei 3.000 € brutto?",
    a: `2026 sind es als Angestellte/r ohne Absetzbeträge ${eur(L3000.lst)} im Monat, also ${pct(L3000.satz)} vom Brutto. Dazu kommt Lohnsteuer auf Urlaubs- und Weihnachtsgeld, die mit 6 % deutlich niedriger ist. Im ganzen Jahr sind es ${eur(
      L3000.lstJahr
    )}. 2027 sinkt die monatliche Lohnsteuer auf ${eur(L3000.lst27)}.`,
  },
  {
    q: "Bis zu welchem Gehalt zahlt man keine Lohnsteuer?",
    a: `Das steuerfreie Jahreseinkommen liegt 2026 bei ${eur0(AT_2026.tarif[0].bis)} (2027: ${eur0(
      AT_2027.tarif[0].bis
    )}). Für Angestellte mit 14 Gehältern entspricht das rund ${eur0(
      STEUERFREI_MONAT
    )} brutto im Monat: Bis dahin fällt keine laufende Lohnsteuer an, weil Sozialversicherung, Werbungskostenpauschale und Verkehrsabsetzbetrag die Steuer auf null drücken.`,
  },
  {
    q: "Was ist der Unterschied zwischen Grenzsteuersatz und Durchschnittssteuersatz?",
    a: "Der Grenzsteuersatz ist die Stufe, in der der letzte verdiente Euro liegt — 40 % heißt: Von einer Gehaltserhöhung gehen 40 % (nach SV) an Lohnsteuer. Der Durchschnittssteuersatz ist die gesamte Lohnsteuer im Verhältnis zum Einkommen und liegt immer deutlich darunter, weil die unteren Teile des Einkommens niedriger oder gar nicht besteuert werden.",
  },
  {
    q: "Wie werden Urlaubs- und Weihnachtsgeld besteuert?",
    a: "Mit festen Sätzen statt nach dem Tarif: Nach Abzug der Sozialversicherung bleiben 620 € im Jahr steuerfrei, die nächsten 24.380 € werden mit 6 % besteuert, danach 27 % und 35,75 %. Liegt das Jahressechstel unter der Freigrenze von 2.615 € (2026), sind beide Sonderzahlungen steuerfrei.",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen">
      <AtSchemas path={PATH} title={TITLE} description={DESCRIPTION} crumb="Lohnsteuer" faqs={FAQS} />
      <AtHero crumb="Lohnsteuer" badge="Österreich · Tarif 2026 & 2027" title="Lohnsteuer Österreich" accent="2026">
        <p>
          Alle Steuerstufen 2026 und 2027, eine Lohnsteuertabelle für typische Gehälter und die Absetzbeträge, die Ihre Steuer
          senken. Kurz vorweg: Steuerklassen wie in Deutschland gibt es in Österreich nicht.
        </p>
      </AtHero>

      <div className="max-w-5xl mx-auto px-4 sm:px-5 pb-16">
        <TableOfContents
          className="mb-8"
          items={[
            { id: "steuerstufen", label: "Steuerstufen" },
            { id: "tabelle", label: "Lohnsteuertabelle" },
            { id: "steuerklassen", label: "Steuerklassen?" },
            { id: "absetzbetraege", label: "Absetzbeträge" },
            { id: "faq", label: "Häufige Fragen" },
          ]}
        />

        <Section
          id="steuerstufen"
          eyebrow="Tarif"
          eyebrowIcon={Scale}
          title="Steuerstufen 2026 und 2027"
          intro="Steuerpflichtiges Jahreseinkommen (nach Sozialversicherung und Werbungskosten). Jeder Satz gilt nur für den Teil des Einkommens in seiner Stufe."
        >
          <div className="overflow-x-auto bg-white border border-black/[0.08] rounded-2xl">
            <table className="w-full text-sm tabular-nums min-w-[560px]">
              <thead>
                <tr className="text-left bg-black/[0.03] border-b border-black/[0.08]">
                  <th className="px-4 py-3 font-bold">Satz</th>
                  <th className="px-4 py-3 font-bold text-right">2026</th>
                  <th className="px-4 py-3 font-bold text-right">2027</th>
                  <th className="px-4 py-3 font-bold text-right">Steuer bis Stufenende 2026</th>
                </tr>
              </thead>
              <tbody>
                {T26.map((s, i) => (
                  <tr key={s.satz} className="border-b border-black/[0.05]">
                    <th scope="row" className="px-4 py-3 font-semibold text-left">{pct(s.satz)}</th>
                    <td className="px-4 py-3 text-right">
                      {eur0(s.von)} – {eur0(s.bis)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {eur0(T27[i].von)} – {eur0(T27[i].bis)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold">{eur0(tarifsteuerAT(s.bis))}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="px-4 py-3 font-semibold text-left">55 %</th>
                  <td className="px-4 py-3 text-right" colSpan={3}>über 1.000.000 €</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-black/65 mt-3 leading-relaxed">
            Die Grenzen bis 1 Million € werden jedes Jahr um zwei Drittel der Inflation angehoben: 2026 um 1,733 %, 2027 um
            2,27 %. Was das für Ihr Netto 2027 bedeutet, zeigt der{" "}
            <Link href="/brutto-netto-rechner-oesterreich-2027" className="text-[#E60A1C] font-semibold hover:underline">
              Brutto-Netto-Rechner Österreich 2027
            </Link>
            .
          </p>
        </Section>

        <Section
          id="tabelle"
          variant="muted"
          eyebrow="Tabelle"
          eyebrowIcon={Table2}
          title="Lohnsteuertabelle 2026 (monatlich)"
          intro="Angestellte, 14 Gehälter, ohne Kinder, Pendlerpauschale und Freibeträge. Lohnsteuer auf das laufende Monatsgehalt; Urlaubs- und Weihnachtsgeld sind im Jahreswert enthalten."
        >
          <div className="overflow-x-auto bg-white border border-black/[0.08] rounded-2xl">
            <table className="w-full text-sm tabular-nums min-w-[640px]">
              <thead>
                <tr className="text-left bg-black/[0.03] border-b border-black/[0.08]">
                  <th className="px-4 py-3 font-bold">Brutto / Monat</th>
                  <th className="px-4 py-3 font-bold text-right">Lohnsteuer 2026</th>
                  <th className="px-4 py-3 font-bold text-right">in % vom Brutto</th>
                  <th className="px-4 py-3 font-bold text-right">Grenzsteuersatz</th>
                  <th className="px-4 py-3 font-bold text-right">LSt / Jahr</th>
                  <th className="px-4 py-3 font-bold text-right">Lohnsteuer 2027</th>
                </tr>
              </thead>
              <tbody>
                {TABELLE.map((t) => (
                  <tr key={t.b} className={`border-b border-black/[0.05] last:border-0 ${t.b === 3000 ? "bg-[#E60A1C]/[0.04]" : ""}`}>
                    <th scope="row" className="px-4 py-3 font-semibold text-left">{eur(t.b)}</th>
                    <td className="px-4 py-3 text-right font-bold">{eur(t.lst)}</td>
                    <td className="px-4 py-3 text-right">{pct(t.satz)}</td>
                    <td className="px-4 py-3 text-right">{pct(t.grenz)}</td>
                    <td className="px-4 py-3 text-right">{eur(t.lstJahr)}</td>
                    <td className="px-4 py-3 text-right">{eur(t.lst27)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-black/65 mt-3">
            Ihr genaues Netto mit Kindern, Pendlerpauschale und Bundesland:{" "}
            <Link href="/brutto-netto-rechner-oesterreich" className="text-[#E60A1C] font-semibold hover:underline">
              Brutto-Netto-Rechner Österreich
            </Link>
            .
          </p>
        </Section>

        <Section id="steuerklassen" eyebrow="Steuerklassen" eyebrowIcon={Users} title="Steuerklassen in Österreich? Gibt es nicht" prose>
          <p>
            Wer aus Deutschland kommt, sucht oft nach der eigenen Steuerklasse. In Österreich gibt es keine: Jede Person wird
            einzeln nach demselben Tarif besteuert, ein Ehegattensplitting oder eine Wahl wie 3/5 gibt es nicht. Was in
            Deutschland die Steuerklasse regelt, erledigen hier Absetzbeträge — sie werden nicht vom Einkommen, sondern direkt von
            der Steuer abgezogen und sind deshalb für alle Einkommen gleich viel wert:
          </p>
          <ul>
            <li>
              <strong>Kinder:</strong> Familienbonus Plus bis {eur(AT_2026.familienbonus.unter18)} pro Kind unter 18 und Jahr.
            </li>
            <li>
              <strong>Alleinverdiener/Alleinerziehende:</strong> {eur0(AT_2026.avab.einKind)} mit einem Kind,{" "}
              {eur0(AT_2026.avab.zweiKinder)} mit zwei Kindern.
            </li>
            <li>
              <strong>Alle Arbeitnehmer:</strong> Verkehrsabsetzbetrag {eur0(AT_2026.verkehrsabsetzbetrag)}, mit
              Pendlerpauschale bis {eur0(AT_2026.vabErhoeht.betrag)}.
            </li>
            <li>
              <strong>Pensionisten:</strong> Pensionistenabsetzbetrag bis {eur0(AT_2026.pension.pab.betrag)} statt
              Verkehrsabsetzbetrag.
            </li>
          </ul>
          <p>
            Sie arbeiten in Deutschland? Dort gelten sechs Steuerklassen — alle im Vergleich auf der Seite{" "}
            <Link href="/steuerklassen">Steuerklassen Deutschland</Link>.
          </p>
        </Section>

        <Section
          id="absetzbetraege"
          variant="muted"
          eyebrow="Absetzbeträge"
          eyebrowIcon={Calculator}
          title="Absetzbeträge 2026 und 2027"
          intro="Jahresbeträge. Absetzbeträge mindern die Steuer direkt, nicht die Bemessungsgrundlage."
        >
          <AtTabelle
            kopf={["Absetzbetrag", "2026", "2027"]}
            minWidth={460}
            zeilen={[
              { label: "Verkehrsabsetzbetrag", werte: [AT_2026.verkehrsabsetzbetrag, AT_2027.verkehrsabsetzbetrag] },
              { label: "Erhöhter Verkehrsabsetzbetrag (mit Pendlerpauschale)", werte: [AT_2026.vabErhoeht.betrag, AT_2027.vabErhoeht.betrag] },
              { label: "Pensionistenabsetzbetrag", werte: [AT_2026.pension.pab.betrag, AT_2027.pension.pab.betrag] },
              { label: "Erhöhter Pensionistenabsetzbetrag", werte: [AT_2026.pension.pabErhoeht.betrag, AT_2027.pension.pabErhoeht.betrag] },
              { label: "AVAB/AEAB mit 1 Kind", werte: [AT_2026.avab.einKind, AT_2027.avab.einKind] },
              { label: "AVAB/AEAB mit 2 Kindern", werte: [AT_2026.avab.zweiKinder, AT_2027.avab.zweiKinder] },
              { label: "Familienbonus Plus je Kind unter 18", werte: [AT_2026.familienbonus.unter18, AT_2027.familienbonus.unter18] },
              { label: "Familienbonus Plus je Kind ab 18", werte: [AT_2026.familienbonus.ab18, AT_2027.familienbonus.ab18] },
            ]}
          />
        </Section>

        <Section id="faq" eyebrow="FAQ" eyebrowIcon={HelpCircle} title="Häufige Fragen zur Lohnsteuer in Österreich">
          <AtFaqList faqs={FAQS} />
        </Section>

        <AtQuellen>
          Quellen: § 33 EStG 1988; BMF Steuerbuch 2026 (Steuerabsetzbeträge 2026); Inflationsanpassungsverordnung 2027 (BGBl.
          II Nr. 260/2026); WKO „Sonstige Bezüge – steuerliche Behandlung“. Tabelle mit Sozialversicherung für Angestellte
          (18,07 %) und 14 Gehältern gerechnet. Angaben ohne Gewähr.
        </AtQuellen>
      </div>
    </div>
  );
}
