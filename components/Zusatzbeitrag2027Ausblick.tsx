import Link from "next/link";
import { CalendarClock, CheckCircle2, Clock } from "lucide-react";
import Section from "@/components/ui/Section";
import { DURCHSCHNITT_ZUSATZBEITRAG_2026, DURCHSCHNITT_ZUSATZBEITRAG_2027, type Krankenkasse } from "@/data/krankenkassen";
import { SV_RECHENGROESSEN_2027_ENTWURF, formatEUR } from "@/lib/taxCalculator";
import { ZUSATZBEITRAG_2027_PROGNOSE } from "@/lib/sozialabgaben2027";

// Geschütztes Leerzeichen: "3,1 %" darf nicht zwischen Zahl und Prozentzeichen umbrechen.
const pct = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + " %";

/**
 * Abschnitt "Zusatzbeitrag 2027" für die Kassenseiten und den Krankenkassen-Hub.
 *
 * Warum jetzt schon: 2026 stiegen die Kassen-Suchen ("bkk firmus zusatzbeitrag
 * 2026" +350 %) genau in den Wochen, in denen die Sätze bekannt wurden. Die
 * Seiten sollen für "<kasse> zusatzbeitrag 2027" bereitstehen, BEVOR die Zahlen
 * kommen — und dann nur noch Daten bekommen, keinen neuen Text.
 *
 * Regel: Es wird nie ein Kassensatz 2027 geschätzt. Bekannt ist er erst, wenn
 * `zusatzbeitrag2027` bzw. `DURCHSCHNITT_ZUSATZBEITRAG_2027` in
 * data/krankenkassen.ts gepflegt ist; bis dahin steht "noch nicht festgelegt".
 */
export default function Zusatzbeitrag2027Ausblick({
  kasse,
  aufVergleichsseite = false,
}: {
  kasse?: Krankenkasse;
  /** Auf /zusatzbeitrag-2027 selbst: kein Link auf die eigene Seite. */
  aufVergleichsseite?: boolean;
}) {
  const kasseSatz2027 = kasse?.zusatzbeitrag2027;
  const durchschnitt2027 = DURCHSCHNITT_ZUSATZBEITRAG_2027;
  const bbgMonat2027 = SV_RECHENGROESSEN_2027_ENTWURF.kvPvBbgJahr / 12;
  // Nominativ — "die Kasse" ist feminin, auch "die TK", "die hkk", "die Audi BKK".
  const subjekt = kasse ? `die ${kasse.name}` : "Ihre Kasse";

  const schritte = [
    {
      datum: "Mitte Oktober 2026",
      text: "Der GKV-Schätzerkreis prognostiziert Einnahmen und Ausgaben der Krankenkassen für 2027.",
      erledigt: false,
    },
    {
      datum: "bis 1. November 2026",
      text:
        durchschnitt2027 !== null
          ? `Das Bundesgesundheitsministerium hat den durchschnittlichen Zusatzbeitrag 2027 auf ${pct(durchschnitt2027)} festgelegt (2026: ${pct(DURCHSCHNITT_ZUSATZBEITRAG_2026)}).`
          : `Das Bundesgesundheitsministerium gibt den durchschnittlichen Zusatzbeitrag 2027 bekannt (§ 242a SGB V). 2026 lag er bei ${pct(DURCHSCHNITT_ZUSATZBEITRAG_2026)}.`,
      erledigt: durchschnitt2027 !== null,
    },
    {
      datum: "bis Ende Dezember 2026",
      text: `Jede Kasse beschließt ihren eigenen Satz für 2027. Erhöht ${subjekt} ihn, muss sie Sie vorher schriftlich informieren und auf Ihr Sonderkündigungsrecht hinweisen.`,
      erledigt: kasseSatz2027 !== undefined,
    },
    {
      datum: "bis 31. Januar 2027",
      text: "Bei einer Erhöhung zum 1. Januar können Sie bis Ende Januar kündigen und zu einer günstigeren Kasse wechseln (§ 175 Abs. 4 SGB V).",
      erledigt: false,
    },
  ];

  const erhoehungen = [0.2, 0.5, 0.8];
  const gehaelter = [3000, 4500, bbgMonat2027];

  return (
    <Section
      id="zusatzbeitrag-2027"
      variant="muted"
      eyebrow="Ausblick 2027"
      eyebrowIcon={CalendarClock}
      title={kasse ? `${kasse.name}: Zusatzbeitrag 2027` : "Zusatzbeitrag 2027"}
      prose
    >
      <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-4 sm:p-5">
        {kasse ? (
          kasseSatz2027 !== undefined ? (
            <p className="text-[#16181D]">
              <strong>Ab 1. Januar 2027: {pct(kasseSatz2027)}</strong> (2026: {pct(kasse.zusatzbeitrag)}).
            </p>
          ) : (
            <p className="text-[#16181D]">
              <strong>Noch nicht festgelegt.</strong> 2026 erhebt die {kasse.name} {pct(kasse.zusatzbeitrag)}. Den
              Satz für 2027 beschließt die Kasse in der Regel im Dezember — wir tragen ihn hier ein, sobald er
              veröffentlicht ist, und schätzen ihn bis dahin nicht.
            </p>
          )
        ) : (
          <p className="text-[#16181D]">
            {durchschnitt2027 !== null ? (
              <>
                <strong>Durchschnitt 2027: {pct(durchschnitt2027)}</strong> (2026: {pct(DURCHSCHNITT_ZUSATZBEITRAG_2026)}). Die
                Sätze der einzelnen Kassen folgen bis Ende Dezember.
              </>
            ) : (
              <>
                <strong>Noch nicht festgelegt.</strong> Fachleute erwarten für den Durchschnitt 2027{" "}
                {pct(ZUSATZBEITRAG_2027_PROGNOSE.von * 100)} bis {pct(ZUSATZBEITRAG_2027_PROGNOSE.bis * 100)} — das ist eine
                Prognose, kein Beschluss.
              </>
            )}
          </p>
        )}
      </div>

      <ol className="space-y-3">
        {schritte.map((s) => (
          <li key={s.datum} className="flex gap-3">
            {s.erledigt ? (
              <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <Clock size={20} className="text-black/35 flex-shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <span>
              <strong className="text-[#16181D]">{s.datum}:</strong> {s.text}
            </span>
          </li>
        ))}
      </ol>

      <div>
        <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">
          Was eine Erhöhung Sie kosten würde
        </h3>
        <p className="mb-3">
          Den Zusatzbeitrag teilen sich Arbeitnehmer und Arbeitgeber. Ihr Anteil pro Monat bei einer Erhöhung um …
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm sm:text-base">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-3 px-2 sm:px-4">Brutto / Monat</th>
                {erhoehungen.map((e) => (
                  <th key={e} className="py-3 px-2 sm:px-4 text-right">
                    +{e.toLocaleString("de-DE")} Pp.
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {gehaelter.map((g) => (
                <tr key={g}>
                  <td className="py-3 px-2 sm:px-4 font-mono font-bold text-[#16181D] whitespace-nowrap">
                    {g === bbgMonat2027 ? `ab ${formatEUR(g)}` : formatEUR(g)}
                  </td>
                  {erhoehungen.map((e) => (
                    <td key={e} className="py-3 px-2 sm:px-4 text-right font-mono whitespace-nowrap">
                      {formatEUR((Math.min(g, bbgMonat2027) * e) / 100 / 2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-2">
          Arbeitnehmeranteil = Brutto × Erhöhung ÷ 2, höchstens bis zur Beitragsbemessungsgrenze 2027 von{" "}
          {formatEUR(bbgMonat2027)} im Monat (Referentenentwurf der Rechengrößen-Verordnung 2027).
        </p>
      </div>

      <p>
        Alle Sozialabgaben 2027 auf einmal — Zusatzbeitrag, höhere Beitragsbemessungsgrenzen und Rentenbeitrag —
        rechnet der{" "}
        <Link href="/sozialabgaben-rechner-2027" className="text-[#E60A1C] font-semibold hover:underline">
          Sozialabgaben-Rechner 2027
        </Link>
        {kasse ? (
          <>
            ; Ihr Netto mit dem Satz jeder Kasse zeigt der{" "}
            <Link href="/brutto-netto-rechner-krankenkasse" className="text-[#E60A1C] font-semibold hover:underline">
              Brutto-Netto-Rechner mit Krankenkasse
            </Link>
          </>
        ) : null}
        .
        {!aufVergleichsseite && (
          <>
            {" "}Die Sätze 2027 aller Kassen, sobald sie feststehen, finden Sie in der Übersicht{" "}
            <Link href="/zusatzbeitrag-2027" className="text-[#E60A1C] font-semibold hover:underline">
              Zusatzbeitrag 2027: alle Krankenkassen im Vergleich
            </Link>
            .
          </>
        )}
      </p>
    </Section>
  );
}
