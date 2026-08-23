import Link from "next/link";

/**
 * Server-gerenderter SEO-Block für "Mieteinnahmen versteuern". Enthält die
 * Kurzantwort, die Werbungskosten-Übersicht und die AfA-Sätze — bewusst als
 * statischer Text, weil hier Rechtsstände und keine Engine-Werte gefragt sind.
 */
const WERBUNGSKOSTEN = [
  {
    titel: "Abschreibung (AfA)",
    text: "2 %, 2,5 % oder 3 % des Gebäudewerts pro Jahr — meist der größte Einzelposten.",
  },
  {
    titel: "Schuldzinsen",
    text: "Der Zinsanteil der Finanzierung. Die Tilgung ist nicht absetzbar.",
  },
  {
    titel: "Grundsteuer",
    text: "Die auf das Objekt entfallende Grundsteuer, soweit sie nicht umgelegt wird.",
  },
  {
    titel: "Nicht umlagefähiges Hausgeld",
    text: "Verwaltervergütung und Zuführung zur Instandhaltungsrücklage bei Eigentumswohnungen.",
  },
  {
    titel: "Instandhaltung & Reparaturen",
    text: "Erhaltungsaufwand ist sofort abziehbar; größere Modernisierungen kurz nach dem Kauf können als anschaffungsnahe Herstellungskosten gelten und müssen dann abgeschrieben werden.",
  },
  {
    titel: "Versicherungen",
    text: "Wohngebäude-, Haftpflicht- und Rechtsschutzversicherung für das Mietobjekt.",
  },
  {
    titel: "Fahrt- & Nebenkosten",
    text: "Fahrten zum Objekt, Kontoführung, Inserate, Maklerkosten bei Neuvermietung, Steuerberatungskosten für die Anlage V.",
  },
];

export default function MieteinnahmenContent() {
  return (
    <div className="max-w-6xl mx-auto px-5">
      {/* Kurzantwort */}
      <section className="py-6" aria-labelledby="mv-kurzantwort">
        <div className="bg-[#FFFFFF] border-l-4 border-[#E60A1C] rounded-2xl p-6 sm:p-7 shadow-sm">
          <h2 id="mv-kurzantwort" className="text-lg sm:text-xl font-extrabold text-[#16181D] mb-2">
            Kurzantwort
          </h2>
          <p className="text-black/75 text-sm sm:text-base leading-relaxed">
            Auf <strong className="text-[#16181D]">Mieteinnahmen</strong> gibt es keinen eigenen Steuersatz.
            Versteuert wird der Überschuss — also Mieteinnahmen minus Werbungskosten. Dieser Betrag wird zu
            Ihrem übrigen Einkommen addiert und mit Ihrem persönlichen Grenzsteuersatz belastet, der 2026
            zwischen 14 % und 45 % liegt. Weil Abschreibung und Zinsen den Überschuss stark drücken, fällt
            die tatsächliche Steuer oft deutlich niedriger aus als erwartet — in den ersten Jahren entsteht
            häufig sogar ein Verlust, der die Steuer auf das Gehalt senkt.
          </p>
        </div>
      </section>

      {/* Rechenweg */}
      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4"
        aria-labelledby="mv-rechenweg"
      >
        <h2 id="mv-rechenweg" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Steuer auf Mieteinnahmen: der Rechenweg
        </h2>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 shadow-sm space-y-2">
          <p className="font-mono text-sm text-black/80 bg-black/[0.04] rounded-lg px-3 py-2">
            Mieteinnahmen − Werbungskosten = Einkünfte aus Vermietung
          </p>
          <p className="font-mono text-sm text-black/80 bg-black/[0.04] rounded-lg px-3 py-2">
            Einkünfte aus Vermietung + übriges Einkommen = zu versteuerndes Einkommen
          </p>
          <p className="text-black/65 text-sm pt-1">
            Der Mietüberschuss landet also „oben auf“ Ihrem Gehalt und wird mit dem höchsten für Sie
            geltenden Steuersatz belastet — nicht mit dem Durchschnittssteuersatz.
          </p>
        </div>
        <p>
          Anzugeben sind die Einkünfte in der <strong className="text-[#16181D]">Anlage V</strong> der
          Einkommensteuererklärung. Umlagen und Nebenkostenvorauszahlungen der Mieter gehören dabei zu den
          Einnahmen — die entsprechenden Ausgaben ziehen Sie im Gegenzug als Werbungskosten wieder ab.
        </p>
      </section>

      {/* Werbungskosten */}
      <section className="py-6" aria-labelledby="mv-werbungskosten">
        <h2 id="mv-werbungskosten" className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Was Sie von den Mieteinnahmen absetzen können
        </h2>
        <p className="text-black/65 text-sm sm:text-base mb-5 max-w-3xl">
          Werbungskosten sind alle Aufwendungen, die durch die Vermietung veranlasst sind. Sie mindern den
          steuerpflichtigen Überschuss unmittelbar.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {WERBUNGSKOSTEN.map((w) => (
            <div key={w.titel} className="bg-[#FFFFFF] border border-black/[0.10] rounded-2xl p-5 shadow-sm">
              <div className="font-bold text-[#16181D] mb-1.5">{w.titel}</div>
              <p className="text-sm text-black/70 leading-relaxed">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AfA */}
      <section className="py-6" aria-labelledby="mv-afa">
        <h2 id="mv-afa" className="text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-2">
          Abschreibung: welcher AfA-Satz gilt?
        </h2>
        <p className="text-black/65 text-sm sm:text-base mb-5 max-w-3xl">
          Maßgeblich ist das Jahr der <strong className="text-[#16181D]">Fertigstellung</strong> des Gebäudes,
          nicht das Kaufjahr (§ 7 Abs. 4 EStG). Abgeschrieben wird ausschließlich der Gebäudeanteil.
        </p>
        <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[480px]">
            <thead>
              <tr className="bg-[#F1F3F5] border-b border-black/[0.10] text-xs font-mono uppercase tracking-wider text-black/70">
                <th className="py-4 px-5">Fertigstellung</th>
                <th className="py-4 px-5 text-right">AfA-Satz</th>
                <th className="py-4 px-5 text-right">Abschreibungsdauer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm sm:text-base">
              <tr className="hover:bg-black/[0.03] transition-colors">
                <td className="py-4 px-5 font-bold text-[#16181D]">ab 2023</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-[#16181D]">3,0 %</td>
                <td className="py-4 px-5 text-right font-mono text-black/70">33 Jahre</td>
              </tr>
              <tr className="hover:bg-black/[0.03] transition-colors">
                <td className="py-4 px-5 font-bold text-[#16181D]">1925 – 2022</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-[#16181D]">2,0 %</td>
                <td className="py-4 px-5 text-right font-mono text-black/70">50 Jahre</td>
              </tr>
              <tr className="hover:bg-black/[0.03] transition-colors">
                <td className="py-4 px-5 font-bold text-[#16181D]">vor 1925</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-[#16181D]">2,5 %</td>
                <td className="py-4 px-5 text-right font-mono text-black/70">40 Jahre</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-black/50 mt-3">
          Für neu gebaute Mietwohnungen mit Baubeginn zwischen dem 1.10.2023 und dem 30.9.2029 kommt
          zusätzlich eine degressive Abschreibung von 5 % in Betracht (§ 7 Abs. 5a EStG). Der Rechner oben
          bildet die lineare AfA ab.
        </p>
      </section>

      {/* Verluste */}
      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-4"
        aria-labelledby="mv-verluste"
      >
        <h2 id="mv-verluste" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Wenn die Vermietung Verlust macht
        </h2>
        <p>
          Übersteigen die Werbungskosten die Mieteinnahmen, entsteht ein{" "}
          <strong className="text-[#16181D]">Verlust aus Vermietung und Verpachtung</strong>. Dieser wird mit
          Ihren übrigen Einkünften verrechnet und senkt die Steuer auf Ihr Gehalt. In den ersten Jahren nach
          dem Kauf ist das durch hohe Zinsen und Erhaltungsaufwand der Normalfall.
        </p>
        <p>
          Voraussetzung ist die <strong className="text-[#16181D]">Einkünfteerzielungsabsicht</strong> — die
          erkennbare Absicht, über die Dauer der Vermietung einen Totalüberschuss zu erzielen. Bei einer auf
          Dauer angelegten Vermietung zu Wohnzwecken unterstellt das Finanzamt diese grundsätzlich. Kritisch
          wird es bei dauerhaft verbilligter Vermietung oder bei Ferienwohnungen mit hoher Eigennutzung.
        </p>
      </section>

      {/* Interne Verlinkung */}
      <section
        className="py-6 text-black/75 text-sm sm:text-base leading-relaxed space-y-3"
        aria-labelledby="mv-links"
      >
        <h2 id="mv-links" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Passende Rechner
        </h2>
        <p>
          Ihren persönlichen Steuersatz auf das Gesamteinkommen ermitteln Sie mit dem{" "}
          <Link href="/einkommensteuer-rechner" className="text-[#E60A1C] font-semibold hover:underline">
            Einkommensteuer-Rechner
          </Link>
          . Wenn Sie den Kauf noch planen, hilft der{" "}
          <Link href="/immobilienkredit-rechner" className="text-[#E60A1C] font-semibold hover:underline">
            Immobilienkredit-Rechner
          </Link>{" "}
          bei der Finanzierung. Ihr laufendes Nettogehalt berechnen Sie mit dem{" "}
          <Link href="/" className="text-[#E60A1C] font-semibold hover:underline">
            Brutto-Netto-Rechner
          </Link>
          , und was von einer Steuererstattung zu erwarten ist, zeigt der{" "}
          <Link href="/steuerrueckerstattung-rechner" className="text-[#E60A1C] font-semibold hover:underline">
            Steuerrückerstattungs-Rechner
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
