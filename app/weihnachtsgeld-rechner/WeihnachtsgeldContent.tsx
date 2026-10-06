import Link from "next/link";
import { BBG_2026, calculateNetto, formatEUR, type Steuerklasse } from "@/lib/taxCalculator";
import { nettoEinmalzahlung } from "@/lib/einmalzahlung";
import { JSZ_TARIFE } from "@/data/jahressonderzahlung";

/**
 * Server-gerenderter Inhalt der Weihnachtsgeld-Seite (crawlbar, ohne JS).
 * Jede Zahl kommt aus lib/einmalzahlung.ts — derselben Funktion wie der Rechner
 * oben. Nichts ist hart codiert.
 */

// Seitendatum: lib/pageDates.ts ("/weihnachtsgeld-rechner").

export const BEISPIEL_BRUTTO = 3500;
export const BEISPIEL_WG = 1500;

/** Tabelle 1: Weihnachtsgeld = ein Monatsgehalt, 2.000–6.000 € in 500-€-Schritten. */
const MONATSGEHAELTER = [2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000];
/** Tabelle 2: feste Beträge bei 3.500 € Monatsbrutto, Steuerklasse I–VI. */
const FESTBETRAEGE = [500, 1000, 2000];
const ALLE_KLASSEN: Steuerklasse[] = [1, 2, 3, 4, 5, 6];
const ROEMISCH = ["", "I", "II", "III", "IV", "V", "VI"];

/**
 * Netto einer Weihnachtsgeld-Zahlung im November 2026 (Jahreslohnsteuer-Methode,
 * § 39b Abs. 3 EStG) — dieselbe Funktion wie der Rechner oben. Klasse II gilt für
 * Alleinerziehende und rechnet deshalb ohne Kinderlosenzuschlag zur Pflege.
 */
export function wgNetto(einmal: number, sk: Steuerklasse = 1, bruttoMonat = BEISPIEL_BRUTTO) {
  return nettoEinmalzahlung({ bruttoMonat, einmal, steuerklasse: sk, kirche: false, kinderlosUeber23: sk !== 2, auszahlungsMonat: 11 });
}

export function monatsNetto(bruttoMonat = BEISPIEL_BRUTTO, sk: Steuerklasse = 1) {
  return calculateNetto({
    bruttoMonat,
    jahr: 2026,
    steuerklasse: sk,
    verheiratet: sk === 3 || sk === 4 || sk === 5,
    kinderlosUeber23: true,
    kirche: false,
  }).nettoMonat;
}

const eur0 = (n: number) => Math.round(n).toLocaleString("de-DE") + " €";
const pct0 = (n: number) => Math.round(n).toLocaleString("de-DE") + " %";

export const QUELLEN = [
  { label: "§ 39b Abs. 3 EStG — Lohnsteuer auf sonstige Bezüge", url: "https://www.gesetze-im-internet.de/estg/__39b.html" },
  { label: "§ 23a SGB IV — Einmalig gezahltes Arbeitsentgelt (anteilige BBG, Märzklausel)", url: "https://www.gesetze-im-internet.de/sgb_4/__23a.html" },
  { label: "BMF — Programmablaufplan Lohnsteuer 2026", url: "https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Steuerarten/Lohnsteuer/Programmablaufplan/" },
  { label: "Minijob-Zentrale — Urlaubs- und Weihnachtsgeld im Minijob", url: "https://magazin.minijob-zentrale.de/einmalzahlungen-minijob/" },
  { label: "Einigungspapier TVöD vom 06.04.2025 (Jahressonderzahlung ab 2026)", url: JSZ_TARIFE[0].quelle.url },
];

export default function WeihnachtsgeldContent() {
  const beispiel = wgNetto(BEISPIEL_WG);
  const monat = monatsNetto();
  const tabelleMonatsgehalt = MONATSGEHAELTER.map((brutto) => ({
    brutto,
    sk1: wgNetto(brutto, 1, brutto),
    sk3: wgNetto(brutto, 3, brutto),
  }));
  const tabelleFestbetrag = ALLE_KLASSEN.map((sk) => ({ sk, werte: FESTBETRAEGE.map((b) => wgNetto(b, sk)) }));
  const minijobJahr = 603 * 12;

  return (
    <div className="max-w-6xl mx-auto px-5">
      {/* Antwort zuerst */}
      <section className="py-6" aria-labelledby="kurzantwort">
        <div className="bg-[#FFFFFF] border-l-4 border-[#E60A1C] rounded-2xl p-6 sm:p-7 shadow-sm">
          <h2 id="kurzantwort" className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">
            Wie viel Weihnachtsgeld bleibt netto?
          </h2>
          <p className="text-black/75 text-sm sm:text-base leading-relaxed">
            Von <strong className="text-[#16181D]">{formatEUR(BEISPIEL_WG)} Weihnachtsgeld</strong> bleiben bei{" "}
            {formatEUR(BEISPIEL_BRUTTO)} Monatsbrutto in Steuerklasse I rund{" "}
            <strong className="text-[#16181D]">{eur0(beispiel.netto)} netto</strong> übrig, also{" "}
            {pct0(beispiel.nettoQuotePct)}. Abgezogen werden {formatEUR(beispiel.lohnsteuer)} Lohnsteuer und{" "}
            {formatEUR(beispiel.svSumme)} Sozialabgaben (kinderlos, ohne Kirchensteuer, Auszahlung im November 2026).
            Weihnachtsgeld ist ein sonstiger Bezug und wird mit Ihrem Grenzsteuersatz belastet. Deshalb bleibt davon
            prozentual weniger übrig als vom Monatsgehalt.
          </p>
        </div>
      </section>

      {/* Tabelle 1: ein Monatsgehalt */}
      <section data-section="" className="py-6" aria-labelledby="tabelle">
        <h2 id="tabelle" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Weihnachtsgeld = ein Monatsgehalt: so viel bleibt netto
        </h2>
        <p className="text-black/65 text-sm sm:text-base mb-5 max-w-3xl">
          Weihnachtsgeld in Höhe eines vollen Monatsgehalts, Auszahlung im November 2026, kinderlos, ohne Kirchensteuer,
          Ø-Zusatzbeitrag 2,9 %.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <caption className="sr-only">Netto vom Weihnachtsgeld in Höhe eines Monatsgehalts, Steuerklasse I und III, 2026</caption>
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th scope="col" className="py-4 px-5">Monatsbrutto = Weihnachtsgeld</th>
                <th scope="col" className="py-4 px-5 text-right">Netto Klasse I</th>
                <th scope="col" className="py-4 px-5 text-right">Netto Klasse III</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {tabelleMonatsgehalt.map((z) => (
                <tr key={z.brutto}>
                  <th scope="row" className="py-3.5 px-5 font-bold font-mono text-[#16181D] text-left">{formatEUR(z.brutto)}</th>
                  {[z.sk1, z.sk3].map((w, i) => (
                    <td key={i} className="py-3.5 px-5 text-right font-mono">
                      <span className="font-bold text-[#16181D]">{formatEUR(w.netto)}</span>
                      <span className="block text-xs text-black/50">{pct0(w.nettoQuotePct)}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3">
          Prozentwert = Anteil, der vom Weihnachtsgeld netto bleibt. Ab etwa 5.800 € Monatsbrutto ist die anteilige
          Beitragsbemessungsgrenze der Kranken- und Pflegeversicherung im November ausgeschöpft — darauf fallen dann keine
          KV- und PV-Beiträge mehr an.
        </p>
      </section>

      {/* Tabelle 2: feste Beträge, alle Steuerklassen */}
      <section data-section="" className="py-6" aria-labelledby="festbetrag">
        <h2 id="festbetrag" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D] mb-2">
          Fester Betrag: 500 €, 1.000 € und 2.000 € Weihnachtsgeld
        </h2>
        <p className="text-black/65 text-sm sm:text-base mb-5 max-w-3xl">
          Netto vom Weihnachtsgeld bei {formatEUR(BEISPIEL_BRUTTO)} Monatsbrutto, Auszahlung im November 2026, ohne
          Kirchensteuer, Ø-Zusatzbeitrag 2,9 %.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <caption className="sr-only">Netto von 500 €, 1.000 € und 2.000 € Weihnachtsgeld bei 3.500 € Monatsbrutto, Steuerklasse I bis VI, 2026</caption>
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th scope="col" className="py-4 px-5">Steuerklasse</th>
                {FESTBETRAEGE.map((b) => (
                  <th key={b} scope="col" className="py-4 px-5 text-right">Netto von {formatEUR(b)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              {tabelleFestbetrag.map((z) => (
                <tr key={z.sk}>
                  <th scope="row" className="py-3.5 px-5 font-bold text-[#16181D] text-left">Klasse {ROEMISCH[z.sk]}</th>
                  {z.werte.map((w, i) => (
                    <td key={i} className="py-3.5 px-5 text-right font-mono">
                      <span className="font-bold text-[#16181D]">{formatEUR(w.netto)}</span>
                      <span className="block text-xs text-black/50">{pct0(w.nettoQuotePct)}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3">
          Klasse I, III, IV, V und VI kinderlos, Klasse II (Alleinerziehende) ohne Kinderlosenzuschlag. Klasse IV rechnet
          wie Klasse I mit dem Grundtarif; in Klasse VI gibt es weder Arbeitnehmer- noch Sonderausgaben-Pauschbetrag.
        </p>
      </section>

      {/* Versteuerung */}
      <section data-section="" className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4" aria-labelledby="versteuerung">
        <h2 id="versteuerung" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">
          Warum vom Weihnachtsgeld so wenig netto bleibt
        </h2>
        <p>
          <strong className="text-[#16181D]">Sonstiger Bezug:</strong> Weihnachtsgeld wird nicht wie ein normales
          Monatsgehalt versteuert, sondern als sonstiger Bezug (§ 39b Abs. 3 EStG). Der Arbeitgeber rechnet die
          Jahreslohnsteuer auf Ihren voraussichtlichen Jahresarbeitslohn zweimal aus: einmal mit und einmal ohne
          Weihnachtsgeld. Die Differenz ist die Lohnsteuer auf das Weihnachtsgeld. Soli und Kirchensteuer folgen dieser
          Differenz.
        </p>
        <p>
          <strong className="text-[#16181D]">Progression:</strong> Weil das Weihnachtsgeld ganz oben auf Ihr
          Jahreseinkommen kommt, wird jeder Euro davon mit Ihrem Grenzsteuersatz belastet — nicht mit dem niedrigeren
          Durchschnittssteuersatz, den Sie von Ihrer Gehaltsabrechnung kennen. Bei {formatEUR(BEISPIEL_BRUTTO)}{" "}
          Monatsbrutto gehen vom Monatsgehalt {pct0(((BEISPIEL_BRUTTO - monat) / BEISPIEL_BRUTTO) * 100)} an Steuern und
          Abgaben, vom Weihnachtsgeld {pct0(beispiel.abzugsQuotePct)}.
        </p>
        <p>
          <strong className="text-[#16181D]">Beitragsbemessungsgrenze:</strong> Sozialabgaben fallen an, solange Ihr
          Entgelt die <strong className="text-[#16181D]">anteilige Beitragsbemessungsgrenze</strong> bis zum
          Auszahlungsmonat nicht erreicht (§ 23a SGB IV). Bei einer Zahlung im
          November und ganzjähriger Beschäftigung sind das 11/12 der Jahresgrenze:{" "}
          {formatEUR((BBG_2026.kvPvJahr * 11) / 12)} in der Kranken- und Pflegeversicherung,{" "}
          {formatEUR((BBG_2026.rvAlvJahr * 11) / 12)} in der Renten- und Arbeitslosenversicherung, jeweils abzüglich der elf schon
          gezahlten Monatsgehälter. Wer gut verdient, zahlt deshalb auf das Weihnachtsgeld oft keine oder nur
          teilweise Kranken- und Pflegebeiträge — und behält prozentual wieder mehr, wie die Tabelle oben ab 6.000 €
          zeigt.
        </p>
        <p>
          Höher besteuert als Ihr Gehalt wird das Weihnachtsgeld also nicht; es fällt nur in Ihren höchsten Steuersatz.
          Zu viel einbehaltene Lohnsteuer gibt es über die Steuererklärung nur zurück, wenn Ihre tatsächliche
          Jahressteuer niedriger ist, etwa wegen Werbungskosten.
        </p>
      </section>

      {/* Steuerfrei? */}
      <section data-section="" className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4" aria-labelledby="steuerfrei">
        <h2 id="steuerfrei" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">
          Ist Weihnachtsgeld steuerfrei?
        </h2>
        <p>
          Nein. Weihnachtsgeld in Geld ist voll lohnsteuer- und in der Regel sozialversicherungspflichtig. Es gibt keinen
          Freibetrag dafür. Steuerfrei bleiben können nur andere Zuwendungen rund um Weihnachten: Sachgeschenke bis zur
          monatlichen Sachbezugsfreigrenze von 50 € (§ 8 Abs. 2 Satz 11 EStG) und die Weihnachtsfeier bis 110 € je
          Beschäftigten als Betriebsveranstaltung (§ 19 Abs. 1 Satz 1 Nr. 1a EStG). Wer das Weihnachtsgeld in eine
          betriebliche Altersvorsorge umwandelt, spart im Rahmen von § 3 Nr. 63 EStG Steuern und Abgaben, bekommt es
          aber erst im Alter ausgezahlt.
        </p>
      </section>

      {/* Minijob */}
      <section data-section="" className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4" aria-labelledby="minijob">
        <h2 id="minijob" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">
          Weihnachtsgeld im Minijob
        </h2>
        <p>
          Auch Minijobber können Weihnachtsgeld bekommen. Ist es vertraglich zugesichert oder wird es regelmäßig
          gezahlt, zählt es laut Minijob-Zentrale zum regelmäßigen Verdienst. Entscheidend ist dann die Jahresgrenze:
          2026 sind das 12 × 603 € = <strong className="text-[#16181D]">{minijobJahr.toLocaleString("de-DE")} €</strong>.
          Wer jeden Monat die vollen 603 € verdient und zusätzlich Weihnachtsgeld bekommt, überschreitet diese Grenze.
          Dann liegt von Anfang an kein Minijob vor, sondern ein sozialversicherungspflichtiger Midijob. Bleibt das
          Jahresentgelt inklusive Weihnachtsgeld unter der Grenze, ist das Weihnachtsgeld für Minijobber in der Regel
          abgabenfrei. Ein freiwilliges, vorher nicht absehbares Weihnachtsgeld wird bei der Prüfung der Grenze nicht
          berücksichtigt. 2027 steigt die Jahresgrenze auf 7.596 € (633 € im Monat), mehr dazu im Beitrag{" "}
          <Link href="/blog/minijob-2027" className="text-[#E60A1C] font-semibold hover:underline">Minijob 2027</Link>.
        </p>
      </section>

      {/* TVöD */}
      <section data-section="" className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4" aria-labelledby="tvoed">
        <h2 id="tvoed" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">
          Weihnachtsgeld im TVöD (Jahressonderzahlung)
        </h2>
        <p>
          Im öffentlichen Dienst heißt das Weihnachtsgeld Jahressonderzahlung (§ 20 TVöD). Sie wird mit dem
          Novemberentgelt gezahlt und als Prozentsatz des durchschnittlichen Monatsentgelts aus Juli bis September
          berechnet. Seit 2026 gelten diese Sätze:
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[420px] text-sm">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3 px-4">Tarif</th>
                <th className="py-3 px-4">Entgeltgruppen</th>
                <th className="py-3 px-4 text-right">Satz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {JSZ_TARIFE.filter((t) => t.key !== "tvl").flatMap((t) =>
                t.staffel.map((st, i) => (
                  <tr key={`${t.key}-${st.bisEg}`}>
                    <td className="py-2.5 px-4 font-semibold text-[#16181D]">{i === 0 ? t.name : ""}</td>
                    <td className="py-2.5 px-4">{st.label}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold">{st.prozent.toLocaleString("de-DE")} %</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
        <p>
          Quelle: {JSZ_TARIFE[0].quelle.titel}. Den Betrag und das Netto für Ihre Entgeltgruppe rechnet der{" "}
          <Link href="/jahressonderzahlung-rechner" className="text-[#E60A1C] font-semibold hover:underline">Rechner für das Weihnachtsgeld im öffentlichen Dienst</Link>{" "}
          aus, das laufende TVöD-Gehalt der{" "}
          <Link href="/tvoed-rechner" className="text-[#E60A1C] font-semibold hover:underline">TVöD-Rechner</Link>. Für
          Landesbeschäftigte gilt der{" "}
          <Link href="/tv-l-rechner" className="text-[#E60A1C] font-semibold hover:underline">TV-L-Rechner</Link>.
        </p>
      </section>

      {/* Anspruch + Verwandtes */}
      <section data-section="" className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4" aria-labelledby="anspruch">
        <h2 id="anspruch" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">
          Habe ich überhaupt Anspruch auf Weihnachtsgeld?
        </h2>
        <p>
          Ein gesetzlicher Anspruch besteht nicht. Er kann sich aus Arbeitsvertrag, Tarifvertrag, Betriebsvereinbarung
          oder betrieblicher Übung ergeben. Wann Arbeitgeber kürzen oder zurückfordern dürfen, etwa bei Kündigung,
          Elternzeit oder Krankheit, erklärt der Beitrag{" "}
          <Link href="/blog/weihnachtsgeld-anspruch" className="text-[#E60A1C] font-semibold hover:underline">Weihnachtsgeld: Anspruch, Kündigung und Rückzahlung</Link>.
          Urlaubsgeld, das 13. Gehalt und Boni werden steuerlich genauso behandelt wie Weihnachtsgeld. Den Unterschied
          zwischen Urlaubs- und Weihnachtsgeld zeigt der Beitrag{" "}
          <Link href="/blog/weihnachtsgeld-urlaubsgeld-unterschied" className="text-[#E60A1C] font-semibold hover:underline">Weihnachtsgeld und Urlaubsgeld im Vergleich</Link>,
          einen Bonus rechnet der{" "}
          <Link href="/bonus-steuerrechner" className="text-[#E60A1C] font-semibold hover:underline">Bonus-Steuerrechner</Link>.
        </p>
      </section>

      {/* So rechnen wir + Quellen */}
      <section data-section="" className="py-6" aria-labelledby="methodik">
        <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl p-6 sm:p-8 text-sm text-black/70 leading-relaxed space-y-3">
          <h2 id="methodik" className="text-lg sm:text-xl font-extrabold text-[#16181D]">So rechnen wir</h2>
          <p>
            Lohnsteuer: Jahreslohnsteuer 2026 auf den voraussichtlichen Jahresarbeitslohn mit und ohne Weihnachtsgeld
            (Tarif § 32a EStG 2026; Klasse V/VI nach dem Programmablaufplan 2026). Soli und Kirchensteuer berücksichtigen
            die Kinderfreibeträge nach § 51a EStG. Sozialabgaben: Arbeitnehmeranteile 2026 auf den Teil der Zahlung, der
            unter der anteiligen Beitragsbemessungsgrenze bis zum Auszahlungsmonat liegt. Vereinfachungen: keine
            individuellen Freibeträge, keine Midijob-Sonderregel für Einmalzahlungen, keine Märzklausel.
          </p>
          <p>
            Alle Angaben ohne Gewähr, keine Steuerberatung.
          </p>
          <h3 className="font-bold text-[#16181D] pt-2">Quellen</h3>
          <ul className="list-disc pl-5 space-y-1">
            {QUELLEN.map((q) => (
              <li key={q.url}>
                <a href={q.url} target="_blank" rel="noopener noreferrer" className="text-[#E60A1C] hover:underline">
                  {q.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
