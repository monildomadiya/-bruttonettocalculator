import Link from "next/link";
import { Table2, Scale, CalendarClock, HelpCircle, ListChecks } from "lucide-react";
import Section from "@/components/ui/Section";
import TableOfContents from "@/components/TableOfContents";
import RechnerOesterreich from "../brutto-netto-rechner-oesterreich/RechnerOesterreich";
import { AT_2026, AT_2027, berechneBruttoNettoAT, formatEURat as eur } from "@/lib/oesterreich";
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
 * Brutto-Netto-Rechner Österreich 2027. "brutto netto rechner 2027" stieg in
 * AT (Google Trends, Rising, 25.9.–2.10.2026) — bis dahin landeten diese
 * Suchen auf der deutschen 2027-Seite, die anderes Recht rechnet.
 *
 * Werte: Inflationsanpassungsverordnung 2027 (BGBl. II Nr. 260/2026), ÖGK
 * „Voraussichtliche Werte 2027“ (SV, vorläufig bis zur Verordnung im Herbst),
 * Budgetbegleitgesetz 2027-2028 (AV-Staffel, Familienbonus-Aufteilung).
 */

const PATH = "/brutto-netto-rechner-oesterreich-2027";
const TITLE = "Brutto Netto Rechner Österreich 2027 — neue Steuerstufen";
const DESCRIPTION =
  "Brutto Netto Rechner Österreich 2027: Nettogehalt mit den Steuerstufen ab Jänner 2027 (+2,27 %), neuer Höchstbeitragsgrundlage 7.410 € und Vergleich zu 2026.";

export const metadata = atMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "brutto netto rechner 2027",
    "brutto netto rechner österreich 2027",
    "steuerstufen 2027 österreich",
    "gehaltsrechner 2027 österreich",
    "lohnsteuer 2027 österreich",
    "höchstbeitragsgrundlage 2027",
    "netto 2027 österreich",
  ],
});

const STUFEN = [1500, 2000, 2500, 3000, 3500, 4000, 5000, 6000, 7000, 8000];
const VERGLEICH = STUFEN.map((brutto) => {
  const a = berechneBruttoNettoAT({ ...AT_STANDARD, bruttoMonat: brutto, jahr: 2026 });
  const b = berechneBruttoNettoAT({ ...AT_STANDARD, bruttoMonat: brutto, jahr: 2027 });
  return { brutto, n26: a.laufend.netto, n27: b.laufend.netto, j26: a.jahr.netto, j27: b.jahr.netto };
});
const ref = VERGLEICH.find((v) => v.brutto === 3000)!;
const ref8 = VERGLEICH.find((v) => v.brutto === 8000)!;
const ref15 = VERGLEICH.find((v) => v.brutto === 1500)!;
const neu2400 = berechneBruttoNettoAT({ ...AT_STANDARD, bruttoMonat: 2400, jahr: 2027, neuesDienstverhaeltnis: true });
const alt2400 = berechneBruttoNettoAT({ ...AT_STANDARD, bruttoMonat: 2400, jahr: 2027 });

const vonBis = (t: readonly { bis: number; satz: number }[]) =>
  t.slice(0, 6).map((s, i) => ({
    von: i === 0 ? 0 : t[i - 1].bis,
    bis: s.bis,
    satz: s.satz,
  }));
const T26 = vonBis(AT_2026.tarif);
const T27 = vonBis(AT_2027.tarif);

const FAQS: AtFaq[] = [
  {
    q: "Wie viel mehr netto bleibt 2027 in Österreich?",
    a: `Bei 3.000 € brutto im Monat steigt das Netto 2027 von ${eur(ref.n26)} auf ${eur(ref.n27)} — das sind ${eur(
      ref.n27 - ref.n26
    )} mehr pro Monat und ${eur(ref.j27 - ref.j26)} mehr im Jahr inklusive 13. und 14. Gehalt. Grund sind die um 2,27 % angehobenen Steuerstufen und Absetzbeträge. Nicht alle gewinnen: Bis rund 2.300 € brutto kostet die höhere Arbeitslosenversicherung mehr, als die Steuerentlastung bringt (bei 1.500 € ${eur(
      ref15.n26 - ref15.n27
    )} weniger im Monat), und ab rund 7.300 € frisst die höhere Höchstbeitragsgrundlage den Vorteil auf (bei 8.000 € ${eur(
      ref8.n26 - ref8.n27
    )} weniger).`,
  },
  {
    q: "Welche Steuerstufen gelten 2027 in Österreich?",
    a: "0 % bis 13.846 €, 20 % bis 22.491 €, 30 % bis 37.285 €, 40 % bis 71.960 €, 48 % bis 107.236 €, 50 % bis 1 Million € und 55 % darüber. Die Grenzen steigen um 2,27 % — zwei Drittel der maßgeblichen Inflation von 3,4 %. Das restliche Drittel wird aus Budgetgründen nicht ausgeschüttet.",
  },
  {
    q: "Wie hoch ist die Höchstbeitragsgrundlage 2027?",
    a: "7.410 € im Monat (2026: 6.930 €) und 14.820 € pro Jahr für Sonderzahlungen. Neben der normalen Aufwertung (Aufwertungszahl 1,046) wird sie durch das Budgetbegleitgesetz 2027-2028 zusätzlich um 5 € pro Tag angehoben. Die ÖGK veröffentlicht die Werte als vorläufig, bis die Verordnung erscheint.",
  },
  {
    q: "Was ändert sich 2027 bei der Arbeitslosenversicherung?",
    a: `Die Ermäßigung für kleine Einkommen läuft aus. Wer am 31.12.2026 schon beschäftigt ist, zahlt 2027 bis 2.327 € brutto 0,5 %, bis 2.539 € 1,5 % und bis 2.751 € 2,5 % statt bisher 0 bis 2 %. Neue Dienstverhältnisse ab 1.1.2027 zahlen bis 2.327 € 1 %, bis 2.539 € 2 % und darüber die vollen 2,95 %. Bei 2.400 € brutto macht das im Monat ${eur(
      alt2400.laufend.netto - neu2400.laufend.netto
    )} Unterschied.`,
  },
  {
    q: "Bleibt die Geringfügigkeitsgrenze 2027 gleich?",
    a: "Ja. Die Geringfügigkeitsgrenze wird 2027 wie schon 2026 nicht aufgewertet und bleibt bei 551,10 € im Monat.",
  },
  {
    q: "Was ändert sich 2027 beim Familienbonus Plus?",
    a: "Die Höhe bleibt gleich (bis zu 2.000,16 € pro Kind unter 18). Neu ist die Aufteilung: Ist das jüngste Kind im Haushalt mindestens 4 Jahre alt, können zwei Berechtigte den Familienbonus nur noch 50:50 oder 75:25 aufteilen, nicht mehr 100:0. Der Rechner bietet dafür die Anteile 75 % und 25 %.",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen">
      <AtSchemas path={PATH} title={TITLE} description={DESCRIPTION} crumb="Rechner 2027" faqs={FAQS} />
      <AtHero crumb="Rechner 2027" badge="Österreich · Werte ab 1.1.2027" title="Brutto Netto Rechner Österreich" accent="2027">
        <p>
          Ihr Nettogehalt ab Jänner 2027 — mit den neuen Steuerstufen, den höheren Absetzbeträgen, der Höchstbeitragsgrundlage
          von 7.410 € und dem Auslaufen der AV-Ermäßigung. Der Rechner zeigt, wie viel sich gegenüber 2026 ändert: Bei 3.000 €
          brutto sind es {eur(ref.n27 - ref.n26)} mehr im Monat — bei kleinen und sehr hohen Gehältern dagegen weniger.
        </p>
      </AtHero>

      <RechnerOesterreich jahr={2027} />

      <div className="max-w-5xl mx-auto px-4 sm:px-5 pb-16">
        <TableOfContents
          className="mb-8"
          items={[
            { id: "vergleich", label: "2026 vs. 2027" },
            { id: "steuerstufen", label: "Steuerstufen 2027" },
            { id: "aenderungen", label: "Alle Änderungen" },
            { id: "faq", label: "Häufige Fragen" },
          ]}
        />

        <Section
          id="vergleich"
          eyebrow="Vergleich"
          eyebrowIcon={Table2}
          title="Netto 2026 und 2027 im Vergleich"
          intro="Angestellte, 14 Gehälter, ohne Kinder und Pendlerpauschale, Bundesland außerhalb Wiens, bestehendes Dienstverhältnis."
        >
          <AtTabelle
            kopf={["Brutto / Monat", "Netto 2026", "Netto 2027", "Differenz / Monat", "Differenz / Jahr"]}
            minWidth={620}
            zeilen={VERGLEICH.map((v) => ({
              label: eur(v.brutto),
              werte: [v.n26, v.n27, v.n27 - v.n26, v.j27 - v.j26],
              hervorheben: v.brutto === 3000,
            }))}
          />
          <ul className="text-sm text-black/65 mt-3 leading-relaxed space-y-1.5 list-disc pl-5">
            <li>
              <strong className="text-[#16181D]">Unter rund 2.300 € brutto</strong> sinkt das Netto: Wer keine oder kaum Lohnsteuer
              zahlt, hat nichts von den höheren Steuerstufen, zahlt aber 0,5 Prozentpunkte mehr Arbeitslosenversicherung — bei{" "}
              {eur(1500)} sind das {eur(ref15.n26 - ref15.n27)} weniger im Monat.
            </li>
            <li>
              <strong className="text-[#16181D]">Ab rund 7.300 € brutto</strong> sinkt es ebenfalls: Die Höchstbeitragsgrundlage
              steigt um 480 € im Monat, darauf fallen 18,07 % Sozialversicherung an — bei {eur(8000)} brutto{" "}
              {eur(ref8.n26 - ref8.n27)} weniger im Monat.
            </li>
            <li>Dazwischen bleibt mehr netto — je nach Gehalt rund 10 bis 20 € im Monat.</li>
          </ul>
        </Section>

        <Section
          id="steuerstufen"
          variant="muted"
          eyebrow="Tarif"
          eyebrowIcon={Scale}
          title="Steuerstufen 2027 in Österreich"
          intro="Jahreseinkommen nach Abzug der Sozialversicherung. Grenzen +2,27 % (Inflationsanpassungsverordnung 2027)."
        >
          <div className="overflow-x-auto bg-white border border-black/[0.08] rounded-2xl">
            <table className="w-full text-sm tabular-nums min-w-[480px]">
              <thead>
                <tr className="text-left bg-black/[0.03] border-b border-black/[0.08]">
                  <th className="px-4 py-3 font-bold">Steuersatz</th>
                  <th className="px-4 py-3 font-bold text-right">2026 bis</th>
                  <th className="px-4 py-3 font-bold text-right">2027 bis</th>
                </tr>
              </thead>
              <tbody>
                {T27.map((s, i) => (
                  <tr key={s.satz} className="border-b border-black/[0.05] last:border-0">
                    <th scope="row" className="px-4 py-3 font-semibold text-left">{(s.satz * 100).toLocaleString("de-AT")} %</th>
                    <td className="px-4 py-3 text-right">{eur0(T26[i].bis)}</td>
                    <td className="px-4 py-3 text-right font-bold">{eur0(s.bis)}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="px-4 py-3 font-semibold text-left">55 %</th>
                  <td className="px-4 py-3 text-right" colSpan={2}>über 1 Million € (unverändert)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-black/65 mt-3">
            Mehr zum Tarif, zur Lohnsteuertabelle und warum es in Österreich keine Steuerklassen gibt:{" "}
            <Link href="/lohnsteuer-oesterreich" className="text-[#E60A1C] font-semibold hover:underline">Lohnsteuer Österreich</Link>.
          </p>
        </Section>

        <Section id="aenderungen" eyebrow="Überblick" eyebrowIcon={ListChecks} title="Was sich 2027 bei Gehalt und Lohnzettel ändert">
          <AtTabelle
            kopf={["Wert", "2026", "2027"]}
            minWidth={460}
            format={eur}
            zeilen={[
              { label: "Verkehrsabsetzbetrag", werte: [AT_2026.verkehrsabsetzbetrag, AT_2027.verkehrsabsetzbetrag] },
              { label: "Erhöhter Verkehrsabsetzbetrag", werte: [AT_2026.vabErhoeht.betrag, AT_2027.vabErhoeht.betrag] },
              { label: "Pensionistenabsetzbetrag", werte: [AT_2026.pension.pab.betrag, AT_2027.pension.pab.betrag] },
              { label: "AVAB/AEAB mit einem Kind", werte: [AT_2026.avab.einKind, AT_2027.avab.einKind] },
              { label: "AVAB/AEAB mit zwei Kindern", werte: [AT_2026.avab.zweiKinder, AT_2027.avab.zweiKinder] },
              { label: "Höchstbeitragsgrundlage / Monat", werte: [AT_2026.sv.hoechstbeitragsgrundlageMonat, AT_2027.sv.hoechstbeitragsgrundlageMonat] },
              { label: "Geringfügigkeitsgrenze / Monat", werte: [AT_2026.sv.geringfuegigkeitsgrenze, AT_2027.sv.geringfuegigkeitsgrenze] },
              { label: "Familienbonus Plus / Kind < 18 / Jahr", werte: [AT_2026.familienbonus.unter18, AT_2027.familienbonus.unter18] },
            ]}
          />
          <ul className="mt-5 space-y-2.5 text-sm sm:text-base text-black/75 leading-relaxed list-disc pl-5">
            <li>
              <strong className="text-[#16181D]">Arbeitslosenversicherung:</strong> Die Staffel für kleine Einkommen wird
              schrittweise abgeschafft — bestehende Dienstverhältnisse zahlen 2027 je 0,5 Prozentpunkte mehr, neue ab 1.1.2027
              schon 1 bzw. 2 % und ab 2.539 € den vollen Satz.
            </li>
            <li>
              <strong className="text-[#16181D]">Ältere Beschäftigte:</strong> Die Befreiung von AV- und IESG-Beitrag ab 63
              entfällt; Beiträge sind bis zum Anspruch auf Alterspension zu zahlen.
            </li>
            <li>
              <strong className="text-[#16181D]">Homeoffice:</strong> Die steuer- und beitragsfreie Telearbeitspauschale fällt
              ab 1.1.2027 weg.
            </li>
            <li>
              <strong className="text-[#16181D]">E-Dienstauto:</strong> Statt 0 € Sachbezug gilt 2027 0,375 % der
              Anschaffungskosten (höchstens 180 € im Monat).
            </li>
            <li>
              <strong className="text-[#16181D]">Nicht angepasst:</strong> Familienbonus Plus, Kindermehrbetrag,
              Pendlerpauschale, Werbungskostenpauschale (132 €) und die Steuersätze auf Urlaubs- und Weihnachtsgeld.
            </li>
          </ul>
        </Section>

        <Section id="faq" variant="muted" eyebrow="FAQ" eyebrowIcon={HelpCircle} title="Häufige Fragen zu 2027">
          <AtFaqList faqs={FAQS} />
        </Section>

        <Section eyebrow="Weiter" eyebrowIcon={CalendarClock} title="Werte für 2026 und Pensionen">
          <p className="text-sm sm:text-base text-black/75 leading-relaxed">
            Für Gehälter im laufenden Jahr gilt der{" "}
            <Link href="/brutto-netto-rechner-oesterreich" className="text-[#E60A1C] font-semibold hover:underline">
              Brutto-Netto-Rechner Österreich 2026
            </Link>
            . Pensionen steigen 2027 um 2,95 % — was davon netto bleibt, zeigt der{" "}
            <Link href="/pension-brutto-netto-rechner-oesterreich" className="text-[#E60A1C] font-semibold hover:underline">
              Pensionsrechner Österreich
            </Link>
            .
          </p>
        </Section>

        <AtQuellen>
          Quellen: Inflationsanpassungsverordnung 2027 (BGBl. II Nr. 260/2026) laut BMF und Steuerberatungs-Übersichten vom
          September 2026; ÖGK „Voraussichtliche Werte 2027“ (vorläufig); Budgetbegleitgesetz 2027-2028. Freigrenze für
          Sonderzahlungen 2027 im Rechner aus dem 2026er-Wert × 1,0227 abgeleitet (wirkt nur bei rund 1.300 € brutto). Angaben
          ohne Gewähr.
        </AtQuellen>
      </div>
    </div>
  );
}
