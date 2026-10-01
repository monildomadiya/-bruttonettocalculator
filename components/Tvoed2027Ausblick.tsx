import { CalendarClock, CheckCircle2, Clock } from "lucide-react";
import Section from "@/components/ui/Section";
import { calculateNetto, formatEUR } from "@/lib/taxCalculator";
import {
  GUELTIG_AB,
  GUELTIG_BIS,
  JAHRESSONDERZAHLUNG_VKA_PROZENT,
  URLAUBSTAGE_AB_2027,
  TARIFRUNDE_2027,
  TVOED_VKA_2026,
  belegteStufen,
  type TvoedGruppe,
} from "@/data/tvoed";

/**
 * "TVöD 2027" — Hub (/tvoed-rechner) und alle Gruppenseiten (/tvoed/<gruppe>).
 *
 * Zielt auf das Cluster "tvöd 2027 / gehaltserhöhung tvöd 2027 / tvöd 2027
 * prognose / tvöd weihnachtsgeld 2027 / tvöd 2027 urlaub" (26 Autocomplete-
 * Varianten, Lauf 30.09.2026). Feststehendes und Offenes werden getrennt:
 * Für 2027 ist KEINE Erhöhung vereinbart — die Erhöhungsspalten sind
 * ausdrücklich Rechenbeispiele, keine Prognose. Quellen der Fakten in
 * data/tvoed.ts.
 */

const NETTO_BASIS = { verheiratet: false, kinderlosUeber23: false, kirche: false, steuerklasse: 1 as const, jahr: 2026 as const };
// Ohne "€" in den Zellen (steht im Kopf): passt so bei 375 px ohne Querscrollen.
const zahl = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const netto = (brutto: number) => calculateNetto({ ...NETTO_BASIS, bruttoMonat: brutto }).nettoMonat;

/** Stufe 3 (oder die erste belegte Stufe), damit Beispiele vergleichbar bleiben. */
function beispielStufe(g: TvoedGruppe): [number, number] {
  const st = belegteStufen(g);
  return st.find(([s]) => s === 3) ?? st[0];
}

export default function Tvoed2027Ausblick({ gruppe }: { gruppe?: TvoedGruppe }) {
  const beispiele = (gruppe
    ? [gruppe]
    : ["e5", "e9b", "e13"].map((slug) => TVOED_VKA_2026.find((g) => g.slug === slug)!).filter(Boolean)
  ).map((g) => {
    const [stufe, brutto] = beispielStufe(g);
    return {
      label: `${g.label}, Stufe ${stufe}`,
      brutto,
      nettoHeute: netto(brutto),
      netto3: netto(brutto * 1.03),
      netto5: netto(brutto * 1.05),
      jsz: brutto * (JAHRESSONDERZAHLUNG_VKA_PROZENT / 100),
    };
  });

  const termine = [
    { datum: GUELTIG_BIS, text: "Frühestes Ende der laufenden Entgeltrunde (Mindestlaufzeit). Bis zu einem neuen Abschluss gilt die Tabelle weiter.", erledigt: false },
    ...TARIFRUNDE_2027.map((t) => ({ datum: t.datum, text: t.text, erledigt: false })),
  ];

  return (
    <Section
      id="tvoed-2027"
      variant="muted"
      eyebrow="Ausblick 2027"
      eyebrowIcon={CalendarClock}
      title={gruppe ? `TVöD ${gruppe.label} 2027: Was feststeht und was verhandelt wird` : "TVöD 2027: Was feststeht und was verhandelt wird"}
      prose
    >
      <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-4 sm:p-5">
        <p className="text-[#16181D]">
          <strong>Eine Gehaltserhöhung für 2027 ist noch nicht vereinbart.</strong> Die Tabelle vom {GUELTIG_AB} gilt
          mindestens bis zum {GUELTIG_BIS} und danach weiter, bis ein neuer Abschluss steht. Die nächste Tarifrunde
          beginnt im April 2027.
        </p>
      </div>

      <div>
        <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">Was 2027 schon feststeht</h3>
        <ul className="space-y-2">
          <li className="flex gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong className="text-[#16181D]">{URLAUBSTAGE_AB_2027} Urlaubstage</strong> ab dem Kalenderjahr 2027
              (5-Tage-Woche) — ein Tag mehr als bisher, vereinbart im Tarifabschluss vom April 2025.
            </span>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong className="text-[#16181D]">Jahressonderzahlung {JAHRESSONDERZAHLUNG_VKA_PROZENT} %</strong> bei den
              Kommunen für alle Entgeltgruppen, ausgezahlt mit dem Novembergehalt. Ein Teil davon lässt sich in bis zu
              drei freie Tage umwandeln.
            </span>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">Tarifrunde 2027: die Termine</h3>
        <ol className="space-y-2">
          {termine.map((t) => (
            <li key={t.datum} className="flex gap-3">
              {t.erledigt ? (
                <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <Clock size={20} className="text-black/35 flex-shrink-0 mt-0.5" aria-hidden="true" />
              )}
              <span>
                <strong className="text-[#16181D]">{t.datum}:</strong> {t.text}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">
          Rechenbeispiel: Was eine Erhöhung netto bringen würde
        </h3>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-base">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3 px-2 sm:px-4">Gruppe</th>
                <th className="py-3 px-2 sm:px-4 text-right">Netto heute (€)</th>
                <th className="py-3 px-2 sm:px-4 text-right">bei +3 %</th>
                <th className="py-3 px-2 sm:px-4 text-right">bei +5 %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {beispiele.map((b) => (
                <tr key={b.label}>
                  <td className="py-3 px-2 sm:px-4 font-semibold text-[#16181D]">
                    {b.label}
                    <span className="block text-xs font-normal text-black/50">{formatEUR(b.brutto)} brutto</span>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-right font-mono whitespace-nowrap">{zahl(b.nettoHeute)}</td>
                  <td className="py-3 px-2 sm:px-4 text-right font-mono whitespace-nowrap">
                    +{zahl(b.netto3 - b.nettoHeute)}
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-right font-mono whitespace-nowrap">
                    +{zahl(b.netto5 - b.nettoHeute)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-2">
          Beträge in Euro, Netto-Plus pro Monat, Steuerklasse I, mit Kindern, ohne Kirchensteuer, Steuer- und Abgabenrecht 2026.
          Rechenbeispiele, keine Prognose — wie hoch eine Erhöhung ausfällt, entscheidet die Tarifrunde.
        </p>
      </div>

      {beispiele.length === 1 && (
        <p>
          <strong className="text-[#16181D]">Jahressonderzahlung:</strong> In {beispiele[0].label} sind {JAHRESSONDERZAHLUNG_VKA_PROZENT} %
          des Monatsentgelts rund {formatEUR(beispiele[0].jsz)} brutto. Maßgeblich ist der Durchschnitt der Monate Juli bis
          September.
        </p>
      )}
    </Section>
  );
}
