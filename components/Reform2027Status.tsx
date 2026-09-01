import { CheckCircle2, Clock, Gavel, ShieldCheck } from "lucide-react";

/**
 * Gesetzgebungs-Status der Steuerreform 2027.
 *
 * Bewusst als eigenständige Komponente: Der Reformstand ist die einzige
 * Information auf der 2027-Seite, die sich laufend ändert. Wird eine Stufe
 * erreicht, wird hier `status` umgestellt und `STAND` aktualisiert — das ist
 * zugleich die Quelle für `dateModified` im Schema der Seite.
 *
 * Quellenlage: Seit dem 18.08.2026 liegt der Referentenentwurf eines
 * Einkommensteuerreformgesetzes 2027 (EStRefG 2027) vor. Er enthält die
 * konkreten Tarifeckwerte nach § 32a EStG für 2027 und 2028 — die Zahlen auf
 * dieser Seite sind seitdem keine Modellierung mehr, sondern Entwurfsrecht.
 * Bindend werden sie erst mit der Verkündung im Bundesgesetzblatt.
 */

/** Letzter redaktioneller Stand — auch als `dateModified` verwendet. */
export const REFORM_STAND = "2026-09-01";

type Status = "erledigt" | "offen";

interface Schritt {
  titel: string;
  status: Status;
  datum: string;
  detail: string;
}

const gesetzgebung: Schritt[] = [
  {
    titel: "Koalitionsbeschluss",
    status: "erledigt",
    datum: "1. Juli 2026",
    detail:
      "Der Koalitionsausschuss einigt sich auf ein Reformpaket mit 34 Maßnahmen, darunter die Anhebung von Grundfreibetrag, Kinderfreibetrag, Kindergeld und Arbeitnehmer-Pauschbetrag zum 1.1.2027.",
  },
  {
    titel: "Referentenentwurf (BMF)",
    status: "erledigt",
    datum: "18. August 2026",
    detail:
      "Das Bundesfinanzministerium legt den Referentenentwurf eines Einkommensteuerreformgesetzes 2027 vor (Bearbeitungsstand 18.08.2026). Er fasst § 32a Absatz 1 EStG für 2027 und 2028 vollständig neu — damit stehen erstmals konkrete Tarifeckwerte im Raum. Dieser Rechner verwendet seitdem genau diese Zahlen.",
  },
  {
    titel: "Verbändeanhörung",
    status: "erledigt",
    datum: "bis 21. August 2026",
    detail:
      "Verbände und Fachkreise konnten zum Entwurf Stellung nehmen. Aus dieser Runde stammen die ersten Änderungsvorschläge, insbesondere zur Gegenfinanzierung.",
  },
  {
    titel: "Kabinettsbeschluss",
    status: "offen",
    datum: "angekündigt für September 2026",
    detail:
      "Beschluss der Bundesregierung über den Gesetzentwurf und Zuleitung an den Bundesrat. Bis dahin kann das BMF den Entwurf noch selbst ändern.",
  },
  {
    titel: "Bundestag (2./3. Lesung)",
    status: "offen",
    datum: "ausstehend",
    detail: "Im parlamentarischen Verfahren können sich die Beträge noch verändern.",
  },
  {
    titel: "Bundesrat",
    status: "offen",
    datum: "ausstehend",
    detail: "Zustimmung der Länderkammer; bei Steuergesetzen mit Länderanteil zwingend erforderlich.",
  },
  {
    titel: "Verkündung im Bundesgesetzblatt",
    status: "offen",
    datum: "ausstehend",
    detail:
      "Erst mit der Verkündung stehen die Werte endgültig fest. Dieser Rechner wird dann auf die amtlichen Formeln umgestellt.",
  },
];

/** Werte, die für 2027 bereits verbindlich feststehen — im Gegensatz zur Steuerreform. */
const bereitsBeschlossen = [
  {
    titel: "Mindestlohn 14,60 € / Stunde",
    status: "erledigt" as Status,
    datum: "ab 1. Januar 2027",
    detail:
      "Die zweistufige Erhöhung ist per Verordnung bereits beschlossen: 13,90 € (2026) → 14,60 € (2027). Dieser Wert ist geltendes Recht, keine Prognose.",
  },
  {
    titel: "SV-Rechengrößen 2027",
    status: "offen" as Status,
    datum: "erwartet Herbst 2026",
    detail:
      "Beitragsbemessungsgrenzen und durchschnittlicher Zusatzbeitrag werden jährlich per Verordnung festgelegt — üblicherweise im Herbst, also deutlich vor der Steuerreform. Der Referentenentwurf ändert daran nichts — er betrifft nur das Steuerrecht. Bis zur Verordnung rechnet dieser Rechner in allen 2027-Szenarien mit den amtlichen SV-Werten 2026.",
  },
];

function Zeile({ schritt }: { schritt: Schritt }) {
  const erledigt = schritt.status === "erledigt";
  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center flex-shrink-0">
        {erledigt ? (
          <CheckCircle2 size={22} className="text-emerald-600" aria-hidden="true" />
        ) : (
          <Clock size={22} className="text-black/30" aria-hidden="true" />
        )}
        <span className="w-px flex-1 bg-black/10 mt-1 last:hidden" />
      </div>
      <div className="pb-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className={`font-bold text-base ${erledigt ? "text-[#16181D]" : "text-black/55"}`}>
            {schritt.titel}
          </h3>
          <span
            className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              erledigt
                ? "bg-emerald-600/10 text-emerald-700 border border-emerald-600/25"
                : "bg-black/[0.05] text-black/45 border border-black/10"
            }`}
          >
            {schritt.datum}
          </span>
        </div>
        <p className="text-sm text-black/65 leading-relaxed mt-1.5">{schritt.detail}</p>
      </div>
    </li>
  );
}

export default function Reform2027Status() {
  const erledigteSchritte = gesetzgebung.filter((s) => s.status === "erledigt").length;

  return (
    <section
      aria-labelledby="reform-status-heading"
      className="w-full max-w-6xl mx-auto bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-8 sm:p-10 shadow-lg mb-8"
    >
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <Gavel size={22} className="text-[#E60A1C]" aria-hidden="true" />
        <h2 id="reform-status-heading" className="text-2xl sm:text-3xl font-extrabold text-[#16181D]">
          Gesetzgebungs-Status der Steuerreform 2027
        </h2>
      </div>
      <p className="text-sm sm:text-base text-black/70 leading-relaxed mb-8">
        Viele Rechner zeigen für 2027 einfach die 2026-Zahlen. Wir legen stattdessen offen, wie weit
        die Reform tatsächlich ist — <strong className="text-[#16181D]">{erledigteSchritte} von {gesetzgebung.length} Schritten</strong>{" "}
        des Gesetzgebungsverfahrens sind abgeschlossen. Seit dem Referentenentwurf rechnet diese
        Seite mit den amtlichen Entwurfszahlen statt mit Schätzungen. Verbindlich werden sie aber
        erst mit der Verkündung — bis dahin bleibt „Ohne Reform“ als Untergrenze im Rechner stehen.
      </p>

      <ol className="mb-10">
        {gesetzgebung.map((s) => (
          <Zeile key={s.titel} schritt={s} />
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-3 mb-2 pt-2 border-t border-black/[0.08]">
        <ShieldCheck size={22} className="text-emerald-600" aria-hidden="true" />
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#16181D] mt-6">
          Was für 2027 bereits feststeht
        </h2>
      </div>
      <p className="text-sm sm:text-base text-black/70 leading-relaxed mb-6">
        Nicht alles an 2027 ist unsicher. Diese Werte sind unabhängig von der Steuerreform bereits
        geregelt beziehungsweise folgen einem eigenen, früheren Zeitplan:
      </p>
      <ol>
        {bereitsBeschlossen.map((s) => (
          <Zeile key={s.titel} schritt={s} />
        ))}
      </ol>

      <p className="text-xs text-black/50 leading-relaxed border-t border-black/[0.08] pt-5">
        Redaktioneller Stand:{" "}
        <time dateTime={REFORM_STAND}>
          {new Date(REFORM_STAND).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
        </time>
        . Quellen: Referentenentwurf eines Einkommensteuerreformgesetzes 2027, Bundesministerium
        der Finanzen, Bearbeitungsstand 18.08.2026 (Artikel 1 für den Veranlagungszeitraum 2027,
        Artikel 2 für 2028); Beschluss des Koalitionsausschusses vom 1.7.2026;
        Mindestlohnanpassungsverordnung. Diese Seite wird bei jedem Verfahrensschritt aktualisiert.
      </p>
    </section>
  );
}
