import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Steuer-Lexikon — Brutto Netto Rechner 2026",
  description: "Über 25 Fachbegriffe rund um Brutto, Netto, Steuern und Sozialversicherung verständlich erklärt — mit aktuellen Zahlen für 2026.",
  alternates: { canonical: "https://bruttonettocalculator.com/lexikon" },
  openGraph: {
    title: "Steuer-Lexikon | Brutto Netto Rechner 2026",
    description: "Alle wichtigen Steuerbegriffe einfach erklärt: Grundfreibetrag, Soli, Beitragsbemessungsgrenze & mehr.",
    url: "https://bruttonettocalculator.com/lexikon",
    locale: "de_DE",
    type: "website",
    images: [{ url: "https://bruttonettocalculator.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Steuer-Lexikon 2026",
    description: "Steuerbegriffe einfach erklärt: Grundfreibetrag, Soli, Beitragsbemessungsgrenze & mehr.",
    images: ["https://bruttonettocalculator.com/og-image.png"],
  },
};

interface Begriff {
  titel: string;
  kurz: string;
}

const steuerBegriffe: Begriff[] = [
  {
    titel: "Grundfreibetrag",
    kurz: "Der Teil Ihres Einkommens, auf den keine Einkommensteuer anfällt. 2026 liegt er bei 12.348 € für Alleinstehende und 24.696 € für zusammen veranlagte Ehepaare. Er soll das steuerliche Existenzminimum absichern und wird deshalb regelmäßig an die Inflation angepasst.",
  },
  {
    titel: "Solidaritätszuschlag",
    kurz: "5,5 % der Einkommensteuer, umgangssprachlich „Soli”. Seit 2021 zahlen ihn nur noch Besserverdienende in voller Höhe — bei Ledigen entfällt er komplett bis zu einer Einkommensteuer von 18.130 € im Jahr, bei Verheirateten bis 36.260 €.",
  },
  {
    titel: "Spitzensteuersatz",
    kurz: "Der Grenzsteuersatz von 42 %, der 2026 ab einem zu versteuernden Einkommen von 69.879 € greift. Er gilt nur für den Einkommensanteil oberhalb dieser Grenze, nicht für das gesamte Einkommen.",
  },
  {
    titel: "Reichensteuer",
    kurz: "Ein zusätzlicher Spitzensteuersatz von 45 %, der ab einem zu versteuernden Einkommen von 277.826 € (2026) auf den darüberliegenden Einkommensanteil erhoben wird — die höchste Progressionsstufe im deutschen Steuertarif.",
  },
  {
    titel: "Grenzsteuersatz",
    kurz: "Der Steuersatz, mit dem der nächste zusätzlich verdiente Euro besteuert wird. Er liegt wegen der Steuerprogression immer über dem Durchschnittssteuersatz und ist entscheidend, um zu beurteilen, wie stark sich eine Gehaltserhöhung oder ein Bonus tatsächlich auszahlt.",
  },
  {
    titel: "Durchschnittssteuersatz",
    kurz: "Die gesamte gezahlte Einkommensteuer geteilt durch das gesamte zu versteuernde Einkommen. Er liegt stets unter dem Grenzsteuersatz, da der Grundfreibetrag und die niedrigeren Progressionsstufen den Durchschnitt nach unten ziehen.",
  },
  {
    titel: "Kirchensteuer",
    kurz: "Wird nur von Mitgliedern einer steuererhebenden Religionsgemeinschaft gezahlt und beträgt je nach Bundesland 8 % (Bayern, Baden-Württemberg) oder 9 % (übrige Bundesländer) der festgesetzten Einkommensteuer.",
  },
  {
    titel: "Kinderfreibetrag",
    kurz: "Steuerlicher Freibetrag pro Kind von insgesamt 9.756 € im Jahr 2026 (6.828 € sächliches Existenzminimum plus 2.928 € für Betreuung, Erziehung und Ausbildung). Das Finanzamt prüft bei der Steuererklärung automatisch, ob Kinderfreibetrag oder Kindergeld für Sie günstiger ist.",
  },
  {
    titel: "Kindergeld",
    kurz: "Monatliche Familienleistung von 259 € pro Kind im Jahr 2026 (3.108 € jährlich), einheitlich für jedes Kind unabhängig von der Geburtsreihenfolge. Wird direkt ausgezahlt und mit dem Kinderfreibetrag verrechnet, falls Letzterer günstiger ist.",
  },
  {
    titel: "Werbungskostenpauschale",
    kurz: "Auch Arbeitnehmer-Pauschbetrag genannt: ein pauschaler Abzug von 1.230 € jährlich für berufsbedingte Ausgaben (z. B. Fahrtkosten, Arbeitsmittel), der automatisch vom zu versteuernden Einkommen abgezogen wird — auch ohne Belege.",
  },
  {
    titel: "Sonderausgabenpauschale",
    kurz: "Ein kleiner Pauschbetrag von 36 € jährlich (72 € bei Verheirateten) für Sonderausgaben wie Spenden oder Kirchensteuer-Vorauszahlungen, der ohne Nachweis automatisch berücksichtigt wird.",
  },
  {
    titel: "Splittingverfahren",
    kurz: "Auch Ehegattensplitting: Bei gemeinsam veranlagten Ehepaaren wird das addierte Einkommen halbiert, der Steuertarif darauf angewendet und anschließend verdoppelt. Das senkt die gemeinsame Steuerlast besonders stark, wenn die Partner unterschiedlich viel verdienen.",
  },
  {
    titel: "Steuerklasse",
    kurz: "Bestimmt die Höhe der monatlichen Lohnsteuer-Vorauszahlung und richtet sich nach Familienstand und Erwerbssituation. Es gibt sechs Klassen (I bis VI) — die endgültige Steuerschuld wird aber erst mit der Jahressteuererklärung final festgestellt.",
  },
];

const sozialBegriffe: Begriff[] = [
  {
    titel: "Beitragsbemessungsgrenze",
    kurz: "Das maximale Bruttoeinkommen, bis zu dem Sozialversicherungsbeiträge erhoben werden. 2026 liegt sie bei 5.812,50 € monatlich für Kranken- und Pflegeversicherung sowie bei 8.450 € monatlich für Renten- und Arbeitslosenversicherung. Einkommen darüber ist beitragsfrei.",
  },
  {
    titel: "Sozialabgaben",
    kurz: "Sammelbegriff für die Pflichtbeiträge zur Renten-, Kranken-, Pflege- und Arbeitslosenversicherung, die im Regelfall je zur Hälfte von Arbeitnehmer und Arbeitgeber getragen werden — zusammen meist rund 20 % des Bruttogehalts für den Arbeitnehmeranteil.",
  },
  {
    titel: "Rentenversicherung",
    kurz: "Beitragssatz von 18,6 % des Bruttogehalts (bis zur Beitragsbemessungsgrenze), je zur Hälfte von Arbeitnehmer (9,3 %) und Arbeitgeber getragen. Die eingezahlten Beiträge werden in Entgeltpunkte umgerechnet, die später die gesetzliche Rente bestimmen.",
  },
  {
    titel: "Krankenversicherung (GKV)",
    kurz: "Allgemeiner Beitragssatz von 14,6 % plus einen kassenindividuellen Zusatzbeitrag (2026 im Schnitt rund 2,9 %), je zur Hälfte auf Arbeitnehmer und Arbeitgeber verteilt. Der Zusatzbeitrag unterscheidet sich je nach Krankenkasse (z. B. BKK, TK, HKK) teils deutlich.",
  },
  {
    titel: "Pflegeversicherung",
    kurz: "Beitragssatz von 3,6 % des Bruttogehalts, für kinderlose Versicherte ab 23 Jahren zusätzlich um 0,6 Prozentpunkte erhöht. Der Arbeitgeberanteil ist gesetzlich auf 1,7 % fixiert, den Rest zahlt der Arbeitnehmer.",
  },
  {
    titel: "Arbeitslosenversicherung",
    kurz: "Beitragssatz von 2,6 % des Bruttogehalts, je zur Hälfte von Arbeitnehmer und Arbeitgeber getragen. Sie finanziert unter anderem das Arbeitslosengeld I, das im Leistungsfall 60 % bzw. 67 % (mit Kind) des pauschalierten Nettoentgelts beträgt.",
  },
  {
    titel: "Minijob-Grenze",
    kurz: "Die Verdienstgrenze für geringfügige Beschäftigung liegt seit dem 1. Januar 2026 bei 603 € monatlich und ist seit 2024 dynamisch an den gesetzlichen Mindestlohn gekoppelt (130 Wochenstunden-Äquivalent × Mindestlohn ÷ 3).",
  },
  {
    titel: "Midijob (Übergangsbereich)",
    kurz: "Beschäftigung mit einem monatlichen Verdienst zwischen der Minijob-Grenze und 2.000 €. In diesem Bereich steigen die Sozialversicherungsbeiträge gleitend an, statt sofort in voller Höhe anzufallen — dadurch bleibt netto mehr vom Gehalt übrig als bei regulärer Vollbeschäftigung im gleichen Verdienstbereich.",
  },
  {
    titel: "Mindestlohn",
    kurz: "Der gesetzliche Mindestlohn liegt seit dem 1. Januar 2026 bei 13,90 € brutto pro Stunde und steigt zum 1. Januar 2027 auf 14,60 €. Er gilt grundsätzlich für alle Arbeitnehmer ab 18 Jahren, mit wenigen gesetzlichen Ausnahmen.",
  },
];

const gehaltsBegriffe: Begriff[] = [
  {
    titel: "Bruttogehalt",
    kurz: "Das vereinbarte Gehalt vor Abzug von Steuern und Sozialabgaben — die Zahl, die im Arbeitsvertrag steht. Erst nach Abzug von Lohnsteuer, Soli, ggf. Kirchensteuer und den Sozialversicherungsbeiträgen ergibt sich das tatsächlich ausgezahlte Nettogehalt.",
  },
  {
    titel: "Nettogehalt",
    kurz: "Der Betrag, der nach allen gesetzlichen Abzügen tatsächlich auf dem Konto ankommt. Er hängt von Steuerklasse, Kirchensteuerpflicht, Bundesland und individuellen Freibeträgen ab — bei gleichem Brutto kann das Netto daher stark variieren.",
  },
  {
    titel: "Geldwerter Vorteil",
    kurz: "Sachleistungen des Arbeitgebers mit Geldwert, die wie zusätzliches Bruttogehalt versteuert werden — am bekanntesten der Dienstwagen zur Privatnutzung, der über die 1%-Regelung (bzw. 0,25 %/0,5 % bei Elektrofahrzeugen) dem Bruttolohn hinzugerechnet wird.",
  },
  {
    titel: "Fünftelregelung",
    kurz: "Ermäßigte Besteuerung für außerordentliche Einkünfte wie Abfindungen (§ 34 EStG). Ein Fünftel der Zahlung wird fiktiv zum Jahreseinkommen addiert, um die Steuerprogression abzumildern — dadurch fällt die Steuerlast auf die Einmalzahlung niedriger aus als bei normaler Versteuerung.",
  },
  {
    titel: "Pfändungsfreigrenze",
    kurz: "Der Teil des Nettoeinkommens, der bei einer Lohnpfändung gesetzlich geschützt ist (§ 850c ZPO). 2026 liegt der monatliche Grundfreibetrag bei 1.491,75 €, mit zusätzlichem Schutz für jede unterhaltsberechtigte Person.",
  },
  {
    titel: "Elterngeld",
    kurz: "Lohnersatzleistung von 65–100 % des durchschnittlichen Nettoeinkommens vor der Geburt, mindestens 300 € und höchstens 1.800 € im Monat. Beim ElterngeldPlus wird nur die Hälfte des Betrags ausgezahlt, dafür über die doppelte Bezugsdauer.",
  },
];

const gruppen: Array<{ label: string; items: Begriff[] }> = [
  { label: "Steuern & Freibeträge", items: steuerBegriffe },
  { label: "Sozialversicherung", items: sozialBegriffe },
  { label: "Gehalt & Sonderfälle", items: gehaltsBegriffe },
];

export default function LexikonPage() {
  return (
    <section className="w-full max-w-6xl mx-auto px-5 py-24 min-h-[70vh]">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#E60A1C] font-bold bg-[#E60A1C]/15 border border-[#E60A1C]/30 px-4 py-1.5 rounded-full mb-4">
          <BookOpen size={14} /> Nachschlagewerk · {steuerBegriffe.length + sozialBegriffe.length + gehaltsBegriffe.length} Begriffe
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#16181D] mb-4 tracking-tight">
          Steuer-<span className="text-gradient-accent">Lexikon</span>
        </h1>
        <p className="text-lg sm:text-xl text-black/80 max-w-3xl mx-auto leading-relaxed">
          Alle relevanten Fachbegriffe rund um Ihr Gehalt, Steuern und Sozialabgaben verständlich
          erklärt — mit den amtlichen Zahlen für 2026.
        </p>
      </div>

      <div className="space-y-16">
        {gruppen.map((gruppe) => (
          <div key={gruppe.label}>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#16181D] mb-8 pb-3 border-b border-black/[0.08]">
              {gruppe.label}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 w-full">
              {gruppe.items.map((b) => (
                <div
                  key={b.titel}
                  className="bg-[#FFFFFF] border border-black/[0.10] hover:border-[#E60A1C]/50 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-[#16181D] mb-3">
                      {b.titel}
                    </h3>
                    <p className="text-base sm:text-lg text-black/80 leading-relaxed font-normal">
                      {b.kurz}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ad: below the glossary groups */}
      <AdUnit placement="content" className="!mb-0 !px-0" />
    </section>
  );
}
