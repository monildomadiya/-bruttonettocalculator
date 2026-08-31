import { BBG_2026, KV_2026, estFormel2026 } from "@/lib/taxCalculator";
import { eur, eur2, pct, netto } from "@/data/tool-content-shared";
import type { ToolContentConfig } from "@/components/ToolContent";

/**
 * Long-form content for the calculator pages — third batch.
 *
 * Same contract and rationale as `data/tool-content.ts` (see the header there);
 * split off only because one file holding every config would be unreadable. The
 * registry in `tool-content.ts` merges all three.
 *
 * Configs for pages that already render their own comparison table
 * (schenkungssteuer, buergergeld, beamte, PKV-vs-GKV) deliberately omit `table`,
 * so a page never ends up with two near-identical ones.
 */

/* ── /mehrwertsteuer-rechner ─────────────────────────────────────────── */

const mehrwertsteuer: ToolContentConfig = {
  heading: "Mehrwertsteuer 2026 berechnen: 19 % und 7 % richtig herausrechnen",
  answer:
    "Um die Mehrwertsteuer aus einem Bruttobetrag herauszurechnen, wird durch 1,19 geteilt (Regelsatz 19 %) beziehungsweise durch 1,07 (ermäßigter Satz 7 %). Um sie aufzuschlagen, wird der Nettobetrag mit 1,19 oder 1,07 multipliziert. 119 € brutto entsprechen also 100 € netto und 19 € Mehrwertsteuer.",
  facts: [
    { label: "Regelsteuersatz", value: "19 %" },
    { label: "Ermäßigter Steuersatz", value: "7 %" },
    { label: "Brutto → Netto (19 %)", value: "÷ 1,19" },
    { label: "Netto → Brutto (19 %)", value: "× 1,19" },
    { label: "Kleinunternehmer Vorjahresumsatz", value: "bis 25.000 €" },
    { label: "Kleinunternehmer laufendes Jahr", value: "bis 100.000 €" },
  ],
  steps: [
    {
      title: "Steuersatz bestimmen",
      text: "19 % ist der Regelfall. 7 % gelten nach § 12 Abs. 2 UStG unter anderem für die meisten Lebensmittel, Bücher, Zeitungen und E-Books, den Personennahverkehr, Hotelübernachtungen und Eintritte zu Kulturveranstaltungen.",
    },
    {
      title: "Richtung wählen",
      text: "Aus einem Bruttopreis den Nettobetrag: durch 1,19 teilen. Auf einen Nettopreis aufschlagen: mit 1,19 multiplizieren.",
    },
    {
      title: "Steueranteil ermitteln",
      text: "Die Differenz zwischen Brutto und Netto ist die enthaltene Mehrwertsteuer — beim Regelsatz sind das 15,97 % des Bruttobetrags, nicht 19 %.",
    },
    {
      title: "Auf der Rechnung ausweisen",
      text: "Nettobetrag, Steuersatz und Steuerbetrag müssen getrennt erkennbar sein, damit der Empfänger die Vorsteuer geltend machen kann.",
    },
  ],
  table: {
    caption: "Mehrwertsteuer aus dem Bruttobetrag herausrechnen",
    head: ["Brutto", "Netto (19 %)", "MwSt (19 %)", "Netto (7 %)", "MwSt (7 %)"],
    rows: [50, 100, 119, 500, 1000].map((b) => [
      eur2(b),
      eur2(b / 1.19),
      eur2(b - b / 1.19),
      eur2(b / 1.07),
      eur2(b - b / 1.07),
    ]),
    note: "Der häufigste Fehler ist, einfach 19 % vom Bruttobetrag abzuziehen. Das ergibt einen zu niedrigen Nettobetrag — bei 119 € wären es 96,39 € statt der korrekten 100 €.",
  },
  sections: [
    {
      h3: "Warum 19 % vom Brutto nicht 19 % sind",
      body: [
        "Die Mehrwertsteuer wird **auf** den Nettobetrag aufgeschlagen, nicht aus dem Bruttobetrag entnommen. Der Steueranteil bezogen auf den Bruttopreis beträgt deshalb 19 ÷ 119 = **15,97 %**, beim ermäßigten Satz 7 ÷ 107 = 6,54 %. Wer stattdessen 19 % vom Brutto abzieht, rechnet systematisch zu wenig Netto heraus — bei größeren Beträgen summiert sich das schnell.",
        "Praktisch relevant wird das überall dort, wo aus einem Endpreis rückwärts gerechnet wird: bei Reisekostenabrechnungen, bei der Vorsteuer aus Belegen und bei der Kalkulation eines Verkaufspreises.",
      ],
    },
    {
      h3: "Umsatzsteuer, Mehrwertsteuer, Vorsteuer",
      body: [
        "Im Gesetz heißt die Steuer **Umsatzsteuer**; „Mehrwertsteuer\" ist der umgangssprachliche Begriff für dieselbe Sache. **Vorsteuer** ist wiederum nur die Perspektive: Es ist die Umsatzsteuer, die ein Unternehmen selbst gezahlt hat und von seiner eigenen Umsatzsteuerschuld abziehen darf.",
        "Kleinunternehmer nach § 19 UStG — Vorjahresumsatz höchstens 25.000 € und im laufenden Jahr nicht über 100.000 € — stellen Rechnungen ohne Umsatzsteuer aus, dürfen dafür aber auch keine Vorsteuer ziehen. Wer hohe Anfangsinvestitionen hat, fährt mit der Regelbesteuerung deshalb oft besser.",
      ],
    },
    {
      h3: "Wo die Mehrwertsteuer sonst noch auftaucht",
      body: [
        "Bei der Vermietung ist die Umsatzsteuer meist ausgeschlossen, was den Vorsteuerabzug kostet — die steuerliche Seite dazu steht unter [Mieteinnahmen versteuern](/mieteinnahmen-versteuern). Beim Dienstwagen fließt die Umsatzsteuer in den geldwerten Vorteil ein: [Firmenwagenrechner](/firmenwagenrechner).",
        "Für die Einkommensseite sind der [Brutto-Netto-Rechner](/) und der [Einkommensteuer-Rechner](/einkommensteuer-rechner) zuständig — anders als die Umsatzsteuer hängen sie am persönlichen Steuersatz, nicht an einem festen Prozentsatz.",
      ],
    },
  ],
  source: "§ 12 UStG · § 14 UStG · § 19 UStG",
};

/* ── /schenkungssteuer-rechner ───────────────────────────────────────── */

const schenkungssteuer: ToolContentConfig = {
  heading: "Schenkungssteuer 2026: Freibeträge alle zehn Jahre neu",
  answer:
    "Bei einer Schenkung stehen Ehepartnern 500.000 €, Kindern 400.000 €, Enkeln 200.000 € und allen übrigen Empfängern 20.000 € steuerfrei zu. Anders als im Erbfall lebt jeder Freibetrag alle zehn Jahre in voller Höhe neu auf — die Frist läuft taggenau ab der jeweiligen Schenkung, nicht kalenderjahrweise.",
  facts: [
    { label: "Ehepartner / Lebenspartner", value: "500.000 €" },
    { label: "Kinder und Stiefkinder", value: "400.000 €" },
    { label: "Enkel", value: "200.000 €" },
    { label: "Geschwister, Nichten, Neffen u. a.", value: "20.000 €" },
    { label: "Freibetrag lebt neu auf", value: "alle 10 Jahre" },
    { label: "Zusammenrechnung früherer Schenkungen", value: "§ 14 ErbStG" },
  ],
  steps: [
    {
      title: "Steuerklasse bestimmen",
      text: "Sie richtet sich nach dem Verwandtschaftsverhältnis und entscheidet über Freibetrag und Steuersatz — nicht zu verwechseln mit der Lohnsteuerklasse.",
    },
    {
      title: "Frühere Schenkungen addieren",
      text: "Alle Zuwendungen derselben Person aus den letzten zehn Jahren werden zusammengerechnet. Der Freibetrag wird dabei nur einmal gewährt.",
    },
    {
      title: "Freibetrag abziehen",
      text: "Was nach Abzug des Freibetrags übrig bleibt, ist der steuerpflichtige Erwerb.",
    },
    {
      title: "Tarif anwenden",
      text: "Der Steuersatz steigt mit dem steuerpflichtigen Erwerb und ist in Steuerklasse I am niedrigsten, in Steuerklasse III am höchsten.",
    },
  ],
  sections: [
    {
      h3: "Der Zehnjahresrhythmus ist der wichtigste Hebel",
      body: [
        "Weil jeder Freibetrag alle zehn Jahre in voller Höhe neu entsteht, lässt sich Vermögen in Etappen praktisch steuerfrei übertragen. Bei einem Kind sind das über dreißig Jahre viermal 400.000 € — also 1,6 Mio. €, ohne dass ein Cent Schenkungssteuer anfällt. Wer früh beginnt, gewinnt schlicht mehr Zehnjahresfenster.",
        "Die Frist läuft **taggenau** ab der jeweiligen Schenkung. Und sie wirkt über den Tod hinaus: Schenkungen aus den letzten zehn Jahren vor dem Erbfall werden dem Nachlass hinzugerechnet, weshalb sich der [Erbschaftssteuer-Rechner](/erbschaftssteuer-rechner) und dieser Rechner immer gemeinsam betrachten lassen.",
      ],
    },
    {
      h3: "Schenkung oder Erbschaft — die zwei echten Unterschiede",
      body: [
        "Tarif, Steuerklassen und Freibeträge stehen für beide Steuern im selben Gesetz und sind weitgehend identisch. Nur zwei Punkte weichen ab: Den **Versorgungsfreibetrag** nach § 17 ErbStG gibt es ausschließlich im Erbfall. Dafür stehen die Freibeträge bei Schenkungen alle zehn Jahre neu zur Verfügung, während sie im Erbfall naturgemäß nur einmal greifen.",
        "Ein weiterer Unterschied betrifft die Eltern: Bei einer Schenkung an die eigenen Eltern gilt nicht die günstige Steuerklasse I, sondern die ungünstigere Einstufung — im Erbfall dagegen schon.",
      ],
    },
    {
      h3: "Immobilien und der Nießbrauch",
      body: [
        "Bei Immobilien lässt sich der steuerpflichtige Wert oft erheblich senken, indem der Schenker sich den **Nießbrauch** vorbehält: Das Eigentum geht über, die Nutzung — Mieteinnahmen oder Wohnrecht — bleibt beim Schenker. Der Kapitalwert dieses Nießbrauchs mindert den Wert der Schenkung, und zwar umso stärker, je jünger der Schenker ist.",
        "Wer eine vermietete Immobilie überträgt, sollte zusätzlich die laufende Besteuerung kennen: [Mieteinnahmen versteuern](/mieteinnahmen-versteuern). Für die Finanzierung einer selbstgenutzten Immobilie ist der [Immobilienkredit-Rechner](/immobilienkredit-rechner) zuständig, für Kapitalerträge aus geschenktem Vermögen der [Abgeltungssteuer-Rechner](/abgeltungssteuer-rechner).",
      ],
    },
  ],
  source: "§ 14 ErbStG · § 16 ErbStG · § 19 ErbStG",
};

/* ── /grundsicherung-rechner ─────────────────────────────────────────── */

const grundsicherung: ToolContentConfig = {
  heading: "Grundsicherung im Alter 2026: Regelbedarf, Wohnkosten und Anrechnung",
  answer:
    "Der Regelbedarf für Alleinstehende liegt 2026 bei 563 € im Monat — unverändert gegenüber 2025, weil es eine gesetzliche Nullrunde gibt. Für Partner gelten je 506 €. Hinzu kommen die tatsächlichen angemessenen Kosten für Unterkunft und Heizung. Eigenes Einkommen, etwa die gesetzliche Rente, wird auf diesen Bedarf angerechnet.",
  facts: [
    { label: "Regelbedarfsstufe 1 (alleinstehend)", value: "563 € / Monat" },
    { label: "Regelbedarfsstufe 2 (je Partner)", value: "506 € / Monat" },
    { label: "Anpassung 2026", value: "Nullrunde" },
    { label: "Unterkunft und Heizung", value: "tatsächlich, soweit angemessen" },
    { label: "Anspruch ab", value: "Regelaltersgrenze" },
    { label: "Erwerbsgeminderte ab", value: "18 Jahren, bei Dauerhaftigkeit" },
  ],
  steps: [
    {
      title: "Regelbedarf ansetzen",
      text: "563 € für Alleinstehende, je 506 € für Partner in einer Bedarfsgemeinschaft — die Pauschale für Ernährung, Kleidung, Strom und Ähnliches.",
    },
    {
      title: "Wohnkosten addieren",
      text: "Die tatsächliche Warmmiete, soweit sie nach den örtlichen Grenzen angemessen ist. Die Kommunen legen diese Grenzen individuell fest.",
    },
    {
      title: "Mehrbedarfe prüfen",
      text: "Bei Gehbehinderung mit Merkzeichen G, kostenaufwändiger Ernährung oder dezentraler Warmwasserbereitung erhöht sich der Bedarf.",
    },
    {
      title: "Einkommen anrechnen",
      text: "Renten und sonstige Einkünfte mindern den Anspruch. Für Einkünfte aus zusätzlicher Altersvorsorge und aus Erwerbstätigkeit gelten Freibeträge.",
    },
  ],
  table: {
    caption: "Anspruch auf Grundsicherung im Alter (Beispielrechnung 2026)",
    head: ["Warmmiete", "Gesamtbedarf", "bei 700 € Rente", "bei 900 € Rente"],
    rows: [450, 600, 750, 900].map((miete) => {
      const bedarf = 563 + miete;
      return [
        eur(miete),
        eur(bedarf),
        eur(Math.max(0, bedarf - 700)),
        eur(Math.max(0, bedarf - 900)),
      ];
    }),
    note: "Alleinstehende Person, Regelbedarfsstufe 1. Vereinfachte Darstellung ohne Mehrbedarfe und ohne die Freibeträge für Einkünfte aus zusätzlicher Altersvorsorge, die den Anspruch in der Praxis erhöhen können.",
  },
  sections: [
    {
      h3: "Grundsicherung im Alter oder Bürgergeld?",
      body: [
        "Die Abgrenzung läuft über die **Erwerbsfähigkeit**, nicht über das Alter allein. Wer die Regelaltersgrenze erreicht hat oder dauerhaft voll erwerbsgemindert ist, erhält Grundsicherung nach SGB XII. Wer erwerbsfähig ist, bekommt stattdessen [Bürgergeld](/buergergeld-rechner) nach SGB II. Die Regelsätze sind identisch, die Zuständigkeit und die Zumutbarkeitsregeln unterscheiden sich.",
        "Wann die Regelaltersgrenze erreicht ist und wie hoch die eigene Rente ausfällt, zeigen der [Rentenrechner](/rentenrechner) und der [Rentenpunkte-Rechner](/rentenpunkte-rechner).",
      ],
    },
    {
      h3: "Was angerechnet wird — und was nicht",
      body: [
        "Die gesetzliche Rente wird grundsätzlich **voll** angerechnet und mindert den Anspruch Euro für Euro. Für Einkünfte aus zusätzlicher Altersvorsorge — [Riester](/riester-rechner), [betriebliche Altersvorsorge](/bav-rechner) und private Renten — gibt es dagegen einen Freibetrag, sodass sich eigene Vorsorge auch im Grundsicherungsbezug lohnt. Genau dafür wurde dieser Freibetrag eingeführt.",
        "Beim Vermögen gelten eigene Schonbeträge; die Systematik ist der beim Bürgergeld ähnlich und im [Schonvermögen-Rechner](/schonvermoegen-rechner) nachvollziehbar. Ein angemessenes selbstgenutztes Eigenheim bleibt unangetastet.",
      ],
    },
    {
      h3: "Der Unterhaltsrückgriff — die häufigste Sorge",
      body: [
        "Viele beantragen die Grundsicherung nicht, weil sie fürchten, ihre Kinder würden herangezogen. Seit dem Angehörigen-Entlastungsgesetz greift der Unterhaltsrückgriff erst ab einem **Jahresbruttoeinkommen von 100.000 €** je unterhaltspflichtigem Kind — darunter fragt der Träger nicht nach. Das eigene Bruttojahreseinkommen lässt sich mit dem [Jahresgehalt-Rechner](/jahresgehalt-rechner) prüfen.",
        "Die Leistung wird nur auf Antrag und nicht rückwirkend gezahlt. Ein zu später Antrag kostet also unwiederbringlich Geld.",
      ],
    },
  ],
  source: "§§ 41 ff. SGB XII · § 82 SGB XII · § 94 SGB XII",
};

/* ── /schonvermoegen-rechner ─────────────────────────────────────────── */

const schonvermoegen: ToolContentConfig = {
  heading: "Schonvermögen 2026: Freibeträge beim Bürgergeld",
  answer:
    "In der Karenzzeit — dem ersten Bezugsjahr laufender Fälle — bleiben 40.000 € für die antragstellende Person und 15.000 € für jede weitere Person der Bedarfsgemeinschaft anrechnungsfrei. Danach gelten 15.000 € pro Person. Für Neuanträge ab dem 1. Juli 2026 entfällt die Karenzzeit; stattdessen greifen altersgestaffelte Freibeträge.",
  facts: [
    { label: "Karenzzeit, antragstellende Person", value: "40.000 €" },
    { label: "Karenzzeit, je weitere Person", value: "15.000 €" },
    { label: "Nach der Karenzzeit", value: "15.000 € pro Person" },
    { label: "Ab 1.7.2026: bis 30 / bis 40 Jahre", value: "5.000 € / 10.000 €" },
    { label: "Ab 1.7.2026: bis 50 / über 50 Jahre", value: "12.500 € / 20.000 €" },
    { label: "Selbstgenutztes Eigenheim", value: "geschützt" },
  ],
  steps: [
    {
      title: "Verwertbares Vermögen zusammenstellen",
      text: "Bargeld, Konten, Sparguthaben, Wertpapiere und Rückkaufswerte von Versicherungen — alles, was kurzfristig zu Geld gemacht werden kann.",
    },
    {
      title: "Geschütztes Vermögen aussondern",
      text: "Ein angemessenes selbstgenutztes Haus oder eine Eigentumswohnung, ein angemessenes Auto und Vermögen zur Altersvorsorge bleiben außen vor.",
    },
    {
      title: "Freibetrag bestimmen",
      text: "Bei laufenden Fällen nach Karenzzeit und Personenzahl, bei Neuanträgen ab dem 1. Juli 2026 nach dem Alter jeder Person.",
    },
    {
      title: "Differenz bilden",
      text: "Was über dem Freibetrag liegt, muss zuerst für den Lebensunterhalt eingesetzt werden, bevor ein Leistungsanspruch entsteht.",
    },
  ],
  table: {
    caption: "Altersgestaffelte Freibeträge für Neuanträge ab 1. Juli 2026",
    head: ["Alter", "Freibetrag je Person", "Paar, beide in dieser Stufe"],
    rows: [
      ["bis 30 Jahre", eur(5000), eur(10000)],
      ["31 bis 40 Jahre", eur(10000), eur(20000)],
      ["41 bis 50 Jahre", eur(12500), eur(25000)],
      ["über 50 Jahre", eur(20000), eur(40000)],
    ],
    note: "Wer sich zum Stichtag bereits in einem laufenden Bewilligungszeitraum befindet, behält bis zu dessen Ende die bisherigen Regeln mit Karenzzeit.",
  },
  sections: [
    {
      h3: "Was die Reform zum 1. Juli 2026 ändert",
      body: [
        "Bislang war der entscheidende Faktor die **Zeit**: Im ersten Bezugsjahr galt ein hoher Karenzbetrag von 40.000 €, danach fiel er auf 15.000 € pro Person. Für Neuanträge ab dem 1. Juli 2026 wird das Alter zum entscheidenden Faktor — von 5.000 € bei unter 30-Jährigen bis 20.000 € bei über 50-Jährigen.",
        "Die Logik dahinter ist nachvollziehbar: Wer länger gearbeitet hat, soll mehr Erspartes behalten dürfen. Für jüngere Antragstellende bedeutet die Umstellung allerdings eine deutliche Verschlechterung gegenüber der bisherigen Karenzzeit.",
      ],
    },
    {
      h3: "Was gar nicht erst mitzählt",
      body: [
        "Ein **angemessenes selbstgenutztes Eigenheim** oder eine Eigentumswohnung bleiben geschützt, ebenso ein angemessenes Auto und Vermögen, das erkennbar der Altersvorsorge dient — dazu zählen insbesondere [Riester-Verträge](/riester-rechner) und Ansprüche aus der [betrieblichen Altersvorsorge](/bav-rechner). Diese Positionen müssen also nicht aufgelöst werden.",
        "Bei der Angemessenheit von Haus und Auto kommt es auf die Umstände an — Haushaltsgröße, Wohnfläche, Verkehrswert. Wer eine Immobilie finanziert, findet die Belastungsrechnung im [Immobilienkredit-Rechner](/immobilienkredit-rechner).",
      ],
    },
    {
      h3: "Vermögen und Einkommen sind zwei getrennte Prüfungen",
      body: [
        "Das Schonvermögen entscheidet nur darüber, **ob** überhaupt ein Anspruch besteht. Wie hoch er ausfällt, richtet sich anschließend nach dem laufenden Einkommen, für das eigene Freibeträge gelten — nachzurechnen im [Bürgergeld-Rechner](/buergergeld-rechner).",
        "Ein [Minijob](/minijob-rechner) bleibt dabei teilweise anrechnungsfrei: Die ersten 100 € bleiben vollständig frei, darüber gestaffelt weitere Anteile. Wer die Regelaltersgrenze erreicht hat, fällt nicht unter das Bürgergeld, sondern unter die [Grundsicherung im Alter](/grundsicherung-rechner).",
      ],
    },
  ],
  source: "§ 12 SGB II · § 12 Abs. 1 SGB II n. F. (ab 1.7.2026)",
};

/* ── /bafoeg-rueckzahlung-rechner ────────────────────────────────────── */

const bafoegRueckzahlung: ToolContentConfig = {
  heading: "BAföG-Rückzahlung: höchstens 10.010 € in 77 Raten",
  answer:
    "Studierenden-BAföG wird zur Hälfte als Zuschuss und zur Hälfte als zinsloses Staatsdarlehen gezahlt. Wer erstmals ab August 2019 gefördert wurde, zahlt höchstens 77 Raten zu je 130 € zurück — also maximal 10.010 €. Alles darüber wird erlassen. Die Rückzahlung beginnt fünf Jahre nach dem Ende der Förderungshöchstdauer.",
  facts: [
    { label: "Förderung als Zuschuss / Darlehen", value: "je 50 %" },
    { label: "Maximale Rückzahlung", value: "10.010 €" },
    { label: "Höchstzahl der Raten", value: "77" },
    { label: "Monatsrate", value: "130 €" },
    { label: "Zahlung", value: "vierteljährlich 390 €" },
    { label: "Beginn", value: "5 Jahre nach Förderungshöchstdauer" },
  ],
  steps: [
    {
      title: "Darlehensanteil bestimmen",
      text: "Die Hälfte der erhaltenen Förderung ist Darlehen. Der Rest ist Zuschuss und wird nie zurückgefordert.",
    },
    {
      title: "Deckelung anwenden",
      text: "Übersteigt der Darlehensanteil 10.010 €, wird der übersteigende Teil erlassen — unabhängig davon, wie lange gefördert wurde.",
    },
    {
      title: "Bescheid abwarten",
      text: "Das Bundesverwaltungsamt schickt fünf Jahre nach Ende der Förderungshöchstdauer einen Feststellungs- und Rückzahlungsbescheid.",
    },
    {
      title: "Freistellung oder Ablösung prüfen",
      text: "Bei geringem Einkommen ist eine Freistellung möglich; bei einer Ablösung in einer Summe gewährt das Bundesverwaltungsamt einen Nachlass.",
    },
  ],
  table: {
    caption: "Rückzahlungsdauer nach Höhe der Darlehensschuld",
    head: ["Darlehensschuld", "Raten à 130 €", "Dauer", "Quartalszahlung"],
    rows: [2600, 5200, 7800, 10010].map((schuld) => {
      const raten = Math.ceil(schuld / 130);
      const jahre = raten / 12;
      return [
        eur(schuld),
        String(raten),
        jahre.toFixed(1).replace(".", ",") + " Jahre",
        eur(390),
      ];
    }),
    note: "Bei der Höchstschuld von 10.010 € sind es genau 77 Raten, also etwas mehr als sechs Jahre. Wer die Schuld sofort in einer Summe ablöst, erhält bei 10.010 € einen Nachlass von 21,5 % und zahlt 7.857,85 €.",
  },
  sections: [
    {
      h3: "Warum die Deckelung so viel wert ist",
      body: [
        "Wer über die gesamte Regelstudienzeit den [BAföG-Höchstsatz](/bafoeg-rechner) bezieht, kommt schnell auf ein Darlehen deutlich oberhalb von 10.010 €. Alles darüber wird **erlassen**. Praktisch heißt das: Ab einem gewissen Punkt kostet jeder weitere Fördermonat nichts mehr — ein Grund, die Förderung nicht aus Sorge vor Schulden vorzeitig aufzugeben.",
        "Das Darlehen ist außerdem **zinslos**. Es gibt damit keinen finanziellen Grund, es vorzeitig zu tilgen, außer dem Ablösenachlass — und der will gegen die Rendite einer alternativen Anlage gerechnet werden.",
      ],
    },
    {
      h3: "Ablösung, Freistellung und Erlass",
      body: [
        "Bei sofortiger Volltilgung der Höchstschuld von 10.010 € gewährt das Bundesverwaltungsamt einen Nachlass von **21,5 %**; zu zahlen sind dann 7.857,85 €. Der Prozentsatz hängt von der Höhe des Ablösebetrags ab — je mehr auf einmal getilgt wird, desto größer der Nachlass.",
        "Wer wenig verdient, kann eine **Freistellung** beantragen: Liegt das Einkommen unter dem Freistellungsbetrag, ruht die Rückzahlung. Freistellungszeiten verlängern die Rückzahlungsfrist, führen aber nicht zu einer höheren Gesamtschuld. Ob das eigene Einkommen darunter liegt, lässt sich mit dem [Brutto-Netto-Rechner](/) prüfen.",
      ],
    },
    {
      h3: "Berufseinstieg planen",
      body: [
        "Die Rückzahlung fällt typischerweise in die ersten Berufsjahre. 390 € im Quartal sind planbar, sollten aber im Budget stehen — insbesondere neben einer [Immobilienfinanzierung](/immobilienkredit-rechner), bei der die Bank die BAföG-Rate als laufende Verpflichtung berücksichtigt.",
        "Wer noch studiert und nebenher arbeitet, findet die Abgabenregeln im [Werkstudent-Rechner](/werkstudent-rechner) und im [Minijob-Rechner](/minijob-rechner). Die Rückzahlung selbst ist steuerlich nicht absetzbar — anders als Fortbildungskosten, die der [Steuerrückerstattung-Rechner](/steuerrueckerstattung-rechner) abbildet.",
      ],
    },
  ],
  source: "§ 17 BAföG · § 18 BAföG · § 18a BAföG",
};

/* ── /bafoeg-rechner ─────────────────────────────────────────────────── */

const bafoeg: ToolContentConfig = {
  heading: "BAföG 2026: Höchstsatz, Elternfreibeträge und Zuverdienst",
  answer:
    "Der BAföG-Höchstsatz für Studierende, die nicht bei den Eltern wohnen und selbst kranken- und pflegeversichert sind, liegt bei rund 992 € im Monat: 475 € Grundbedarf, 380 € Wohnzuschlag und 140 € für Kranken- und Pflegeversicherung. Vom Elterneinkommen wird ein Freibetrag abgezogen; nur der übersteigende Teil mindert den Anspruch.",
  facts: [
    { label: "Höchstsatz gesamt", value: "rund 992 € / Monat" },
    { label: "Grundbedarf", value: "475 €" },
    { label: "Wohnzuschlag (nicht bei den Eltern)", value: "380 €" },
    { label: "Kranken- und Pflegeversicherung", value: "140 €" },
    { label: "Elternfreibetrag (verheiratet)", value: "rund 2.540 € netto" },
    { label: "Anrechnungsfreier Zuverdienst", value: "rund 556 € / Monat" },
  ],
  steps: [
    {
      title: "Bedarf zusammensetzen",
      text: "Grundbedarf 475 €, dazu der Wohnzuschlag von 380 € für alle, die nicht bei den Eltern wohnen, und 140 € für die eigene Kranken- und Pflegeversicherung.",
    },
    {
      title: "Elterneinkommen prüfen",
      text: "Vom Nettoeinkommen der Eltern wird ein Freibetrag abgezogen — bei verheirateten, zusammenlebenden Eltern rund 2.540 € im Monat, je weiterem Kind zusätzlich 770 €.",
    },
    {
      title: "Anrechnung vornehmen",
      text: "Der Betrag oberhalb des Freibetrags mindert den BAföG-Anspruch anteilig. Eigenes Vermögen und eigener Verdienst werden ebenfalls berücksichtigt.",
    },
    {
      title: "Zuverdienstgrenze einhalten",
      text: "Rund 556 € im Monat bleiben anrechnungsfrei — das entspricht ungefähr einem Minijob. Darüber wird der übersteigende Betrag angerechnet.",
    },
  ],
  table: {
    caption: "BAföG-Bedarf 2026 je nach Wohnsituation",
    head: ["Situation", "Grundbedarf", "Wohnzuschlag", "KV/PV", "Bedarf gesamt"],
    rows: [
      ["Eigene Wohnung, selbst versichert", eur(475), eur(380), eur(140), eur(995)],
      ["Eigene Wohnung, familienversichert", eur(475), eur(380), "—", eur(855)],
      ["Bei den Eltern wohnend", eur(475), "—", eur(140), eur(615)],
    ],
    note: "Der ausgewiesene Höchstsatz von rund 992 € ergibt sich aus dem Bedarf abzüglich der individuellen Anrechnung. Wer bei den Eltern wohnt, erhält den Wohnzuschlag nicht.",
  },
  sections: [
    {
      h3: "Warum ein Antrag fast immer sinnvoll ist",
      body: [
        "Die häufigste Fehlannahme ist, das Elterneinkommen sei „zu hoch\". Die Freibeträge sind aber beträchtlich: rund 2.540 € **netto** im Monat bei verheirateten, zusammenlebenden Eltern, plus 770 € je weiterem Kind. Bei zwei Geschwistern in Ausbildung verschiebt sich die Grenze also deutlich nach oben. Was vom Bruttogehalt der Eltern netto übrig bleibt, zeigt der [Brutto-Netto-Rechner](/).",
        "Hinzu kommt: Nur die Hälfte ist Darlehen, und dieses ist zinslos und auf 10.010 € gedeckelt — Details im [BAföG-Rückzahlungsrechner](/bafoeg-rueckzahlung-rechner). Das wirtschaftliche Risiko eines Antrags ist damit gering.",
      ],
    },
    {
      h3: "Nebenjob richtig dimensionieren",
      body: [
        "Rund 556 € im Monat bleiben anrechnungsfrei, im Bewilligungszeitraum also etwa 6.672 €. Das entspricht ungefähr einem [Minijob](/minijob-rechner), dessen Grenze 2026 bei 603 € liegt — wer die Minijob-Grenze voll ausschöpft, überschreitet die BAföG-Grenze also bereits leicht.",
        "Eine [Werkstudentenstelle](/werkstudent-rechner) erlaubt höhere Verdienste bei nur 9,3 % Rentenbeitrag, führt aber zur Anrechnung auf das BAföG. Wer über 20 Wochenstunden hinaus arbeitet, verliert zusätzlich das Werkstudentenprivileg — beide Grenzen wollen zusammen geplant werden.",
      ],
    },
    {
      h3: "Steuerlich lohnt sich das Studium später",
      body: [
        "BAföG selbst ist steuerfrei und unterliegt **nicht** dem Progressionsvorbehalt — anders als [Arbeitslosengeld](/arbeitslosengeld-rechner) oder [Elterngeld](/elterngeld-rechner). Es erhöht also auch den Steuersatz auf Nebeneinkünfte nicht.",
        "Kosten für ein Zweitstudium oder eine Fortbildung sind dagegen als Werbungskosten absetzbar und können als Verlustvortrag in spätere Jahre mitgenommen werden. Was das im Berufseinstieg wert ist, schätzt der [Steuerrückerstattung-Rechner](/steuerrueckerstattung-rechner).",
      ],
    },
  ],
  source: "§§ 11 ff. BAföG · § 13 BAföG · § 25 BAföG",
};

/* ── /buergergeld-rechner ────────────────────────────────────────────── */

const buergergeld: ToolContentConfig = {
  heading: "Bürgergeld 2026: Regelsatz, Wohnkosten und Freibeträge",
  answer:
    "Der Bürgergeld-Regelsatz beträgt 2026 für Alleinstehende 563 € im Monat — eine Nullrunde gegenüber 2025. Partner in einer Bedarfsgemeinschaft erhalten je 506 €, Kinder je nach Alter zwischen 357 € und 471 €. Dazu kommen die tatsächlichen angemessenen Kosten für Unterkunft und Heizung.",
  facts: [
    { label: "Regelsatz alleinstehend", value: "563 € / Monat" },
    { label: "Partner in Bedarfsgemeinschaft", value: "je 506 €" },
    { label: "Kinder 0–5 / 6–13 Jahre", value: "357 € / 390 €" },
    { label: "Anpassung 2026", value: "Nullrunde" },
    { label: "Erste 100 € Erwerbseinkommen", value: "voll anrechnungsfrei" },
    { label: "100–520 € / 520–1.000 €", value: "20 % / 30 % frei" },
  ],
  steps: [
    {
      title: "Regelbedarf der Bedarfsgemeinschaft addieren",
      text: "Für jede Person der Bedarfsgemeinschaft den passenden Regelsatz ansetzen — Alleinstehende, Partner und Kinder nach Altersstufen.",
    },
    {
      title: "Kosten der Unterkunft ergänzen",
      text: "Die tatsächliche Warmmiete, soweit angemessen. Die Grenzen legt jede Kommune individuell fest; im ersten Jahr gelten sie großzügiger.",
    },
    {
      title: "Einkommen bereinigen",
      text: "Vom Erwerbseinkommen bleiben die ersten 100 € vollständig frei, von 100 bis 520 € weitere 20 %, von 520 bis 1.000 € 30 %.",
    },
    {
      title: "Differenz ermitteln",
      text: "Gesamtbedarf minus bereinigtes Einkommen ergibt den Auszahlungsbetrag.",
    },
  ],
  sections: [
    {
      h3: "Die Freibeträge machen Arbeit lohnend — bis zu einem Punkt",
      body: [
        "Die gestaffelten Freibeträge sorgen dafür, dass von jedem hinzuverdienten Euro etwas übrig bleibt. Besonders wirksam sind die **ersten 100 €**, die vollständig anrechnungsfrei bleiben: Ein kleiner [Minijob](/minijob-rechner) erhöht das verfügbare Einkommen also in voller Höhe.",
        "Darüber sinkt die Behaltensquote stufenweise auf 20 % und 30 %. Wer die Bedürftigkeit ganz verlassen will, muss deshalb einen deutlichen Sprung machen — im Bereich zwischen [Minijob](/minijob-rechner) und [Midijob](/midijob-rechner) lohnt sich der Vergleich der tatsächlichen Nettowirkung mit dem [Brutto-Netto-Rechner](/).",
      ],
    },
    {
      h3: "Vermögen wird getrennt geprüft",
      body: [
        "Ob überhaupt ein Anspruch besteht, entscheidet zuerst das **Vermögen**. In der Karenzzeit bleiben 40.000 € für die antragstellende Person und 15.000 € je weiterer Person frei; für Neuanträge ab dem 1. Juli 2026 gelten altersgestaffelte Beträge von 5.000 € bis 20.000 €. Die Systematik zeigt der [Schonvermögen-Rechner](/schonvermoegen-rechner).",
        "Geschützt bleiben ein angemessenes selbstgenutztes Eigenheim, ein angemessenes Auto und Altersvorsorgevermögen wie [Riester](/riester-rechner) — diese Positionen müssen nicht aufgelöst werden.",
      ],
    },
    {
      h3: "Bürgergeld, Arbeitslosengeld und Grundsicherung",
      body: [
        "[Arbeitslosengeld I](/arbeitslosengeld-rechner) ist eine Versicherungsleistung und hängt am früheren Nettoentgelt, nicht an der Bedürftigkeit — es wird vorrangig gezahlt und läuft nach seiner Bezugsdauer aus. Erst danach greift das Bürgergeld als bedarfsabhängige Leistung.",
        "Wer die Regelaltersgrenze erreicht hat oder dauerhaft voll erwerbsgemindert ist, fällt nicht unter das Bürgergeld, sondern unter die [Grundsicherung im Alter](/grundsicherung-rechner) nach SGB XII. Die Regelsätze sind identisch, die Zuständigkeit unterscheidet sich.",
      ],
    },
  ],
  source: "§ 20 SGB II · § 22 SGB II · § 11b SGB II",
};

/* ── /rentenrechner ──────────────────────────────────────────────────── */

const RENTENWERT = 42.52;
const DURCHSCHNITTSENTGELT = 51944;

const rentenrechner: ToolContentConfig = {
  heading: "Rentenrechner 2026: Beitrag, Entgeltpunkte und Prognose",
  answer:
    "Der Beitrag zur gesetzlichen Rentenversicherung beträgt 18,6 % des Bruttogehalts bis zur Beitragsbemessungsgrenze von 101.400 € im Jahr, je zur Hälfte von Arbeitnehmer und Arbeitgeber getragen — Arbeitnehmer zahlen also 9,3 %. Die spätere Rente ergibt sich aus den erworbenen Entgeltpunkten, multipliziert mit dem aktuellen Rentenwert von 42,52 €.",
  facts: [
    { label: "Beitragssatz gesamt", value: "18,6 %" },
    { label: "Arbeitnehmeranteil", value: "9,3 %" },
    { label: "Beitragsbemessungsgrenze RV", value: "101.400 € / Jahr" },
    { label: "Aktueller Rentenwert", value: "42,52 € / Entgeltpunkt" },
    { label: "Durchschnittsentgelt 2026", value: "51.944 € / Jahr" },
    { label: "Abschlag bei vorzeitigem Rentenbeginn", value: "0,3 % je Monat" },
  ],
  steps: [
    {
      title: "Beitrag ermitteln",
      text: "9,3 % des Bruttogehalts als Arbeitnehmeranteil, begrenzt auf die Beitragsbemessungsgrenze von 8.450 € im Monat. Der Arbeitgeber zahlt denselben Betrag.",
    },
    {
      title: "Entgeltpunkte bilden",
      text: "Das rentenversicherungspflichtige Bruttojahresentgelt geteilt durch das Durchschnittsentgelt von 51.944 € ergibt die Punkte des Jahres.",
    },
    {
      title: "Über die Erwerbsbiografie summieren",
      text: "Alle Jahrespunkte werden addiert, zuzüglich Kindererziehungs-, Ausbildungs- und Anrechnungszeiten.",
    },
    {
      title: "In Euro umrechnen",
      text: "Summe der Entgeltpunkte × 42,52 € × Zugangsfaktor × Rentenartfaktor ergibt die monatliche Bruttorente.",
    },
  ],
  table: {
    caption: "Beitrag und Rentenanspruch nach Bruttogehalt (2026)",
    head: ["Brutto / Monat", "RV-Beitrag AN 9,3 %", "Punkte / Jahr", "Rente nach 40 Jahren"],
    rows: [2500, 3500, 4329, 6000, 8450].map((b) => {
      const beitragsbasis = Math.min(b, BBG_2026.rvAlvJahr / 12);
      const punkte = (beitragsbasis * 12) / DURCHSCHNITTSENTGELT;
      return [
        eur(b),
        eur2(beitragsbasis * BBG_2026.anSatzRv),
        punkte.toFixed(2).replace(".", ","),
        eur(punkte * RENTENWERT * 40),
      ];
    }),
    note: "Bruttorente vor Kranken- und Pflegeversicherungsbeiträgen der Rentner und vor Steuern. Die Rechnung unterstellt 40 Jahre mit gleichbleibendem relativem Einkommen; 8.450 € im Monat entsprechen der Beitragsbemessungsgrenze.",
  },
  sections: [
    {
      h3: "Was die Prognose systematisch nicht abbilden kann",
      body: [
        "Jede Hochrechnung unterstellt ein über Jahrzehnte gleichbleibendes relatives Einkommen. Reale Erwerbsbiografien sehen anders aus: Ausbildung, [Teilzeit](/teilzeitrechner), Elternzeit, Arbeitslosigkeit und Gehaltssprünge verschieben die Punktzahl in beide Richtungen. Auch **Durchschnittsentgelt und Rentenwert** werden jährlich angepasst — die hier hinterlegten Werte sind Rechengrößen für 2026, keine Festwerte.",
        "Verbindlich ist allein die Renteninformation der Deutschen Rentenversicherung. Die Mechanik dahinter lässt sich aber vollständig nachvollziehen: Der [Rentenpunkte-Rechner](/rentenpunkte-rechner) zeigt Schritt für Schritt, wie aus Brutto Punkte und aus Punkten Euro werden.",
      ],
    },
    {
      h3: "Was die spätere Rente erhöht — und was sie senkt",
      body: [
        "**Erhöhend** wirken Kindererziehungszeiten (bis zu drei Jahre je Kind ab Geburten 1992), Pflegezeiten, freiwillige Beiträge und ein späterer Rentenbeginn. **Senkend** wirkt ein vorgezogener Rentenbeginn mit 0,3 % Abschlag je Monat — über mehrere Jahre summiert sich das erheblich und dauerhaft.",
        "Ebenfalls senkend wirkt alles, was das beitragspflichtige Brutto reduziert, insbesondere die [Entgeltumwandlung in die betriebliche Altersvorsorge](/bav-rechner). Das ist kein Argument gegen die bAV — die Förderung in der Ansparphase überwiegt meist deutlich —, aber es gehört in die Gesamtrechnung.",
      ],
    },
    {
      h3: "Von der Bruttorente zur Auszahlung",
      body: [
        "Von der errechneten Bruttorente gehen Beiträge zur Kranken- und Pflegeversicherung der Rentner ab, und oberhalb des Grundfreibetrags von 12.348 € fällt Einkommensteuer an — der steuerpflichtige Anteil richtet sich nach dem Jahr des Rentenbeginns: [Einkommensteuer-Rechner](/einkommensteuer-rechner).",
        "Reicht die Rente nicht aus, kommt die [Grundsicherung im Alter](/grundsicherung-rechner) in Betracht, wobei Einkünfte aus [Riester](/riester-rechner) und [bAV](/bav-rechner) dort teilweise anrechnungsfrei bleiben. Hinterbliebenenansprüche leiten sich mit 55 % beziehungsweise 25 % von derselben Rente ab: [Witwenrente-Rechner](/witwenrente-rechner).",
      ],
    },
  ],
  source: "§ 63 SGB VI · § 68 SGB VI · § 157 SGB VI",
};

/* ── /immobilienkredit-rechner ───────────────────────────────────────── */

const immobilienkredit: ToolContentConfig = {
  heading: "Immobilienkredit 2026: Wie viel Haus ist finanzierbar?",
  answer:
    "Als Faustregel sollte die monatliche Kreditrate höchstens rund 35 % des Haushalts-Nettoeinkommens betragen. Aus dieser Rate, dem Eigenkapital, dem Sollzins und der anfänglichen Tilgung ergibt sich das maximal finanzierbare Darlehen. Hinzu kommen Kaufnebenkosten von meist 10 bis 15 % des Kaufpreises, die aus Eigenkapital zu tragen sind.",
  facts: [
    { label: "Empfohlene Rate", value: "max. 35 % vom Nettoeinkommen" },
    { label: "Grunderwerbsteuer", value: "3,5 – 6,5 % je Bundesland" },
    { label: "Notar und Grundbuch", value: "rund 1,5 – 2 %" },
    { label: "Maklercourtage", value: "rund 3,57 %" },
    { label: "Kaufnebenkosten gesamt", value: "meist 10 – 15 %" },
    { label: "Empfohlene anfängliche Tilgung", value: "2 %, besser 3 %" },
  ],
  steps: [
    {
      title: "Tragbare Rate bestimmen",
      text: "Höchstens rund 35 % des Haushalts-Nettoeinkommens, damit Rücklagen und laufende Kosten gedeckt bleiben.",
    },
    {
      title: "Darlehenshöhe ableiten",
      text: "Die Jahresrate geteilt durch die Summe aus Sollzins und anfänglicher Tilgung ergibt das maximal tragbare Darlehen.",
    },
    {
      title: "Eigenkapital einplanen",
      text: "Mindestens die Kaufnebenkosten, idealerweise zusätzlich 10 bis 20 % des Kaufpreises. Je mehr Eigenkapital, desto niedriger Zins und Rate.",
    },
    {
      title: "Kaufpreis errechnen",
      text: "Darlehen plus Eigenkapital minus Kaufnebenkosten ergibt den Kaufpreis, der realistisch darstellbar ist.",
    },
  ],
  table: {
    caption: "Maximales Darlehen bei 35 % Rate, 3,5 % Zins und 2 % Tilgung",
    head: ["Netto / Monat", "max. Rate", "Darlehen", "Kaufpreis bei 20 % EK"],
    rows: [2500, 3500, 4500, 6000].map((n) => {
      const rate = n * 0.35;
      const darlehen = (rate * 12) / 0.055; // Zins + anfängliche Tilgung
      return [eur(n), eur(rate), eur(darlehen), eur(darlehen / 0.8)];
    }),
    note: "Vereinfachte Annuitätenrechnung mit 3,5 % Sollzins und 2 % anfänglicher Tilgung. Die Kaufpreisspalte unterstellt 20 % Eigenkapitalanteil am Kaufpreis; die Kaufnebenkosten kommen zusätzlich obendrauf.",
  },
  sections: [
    {
      h3: "Die Kaufnebenkosten sind der unterschätzte Posten",
      body: [
        "Grunderwerbsteuer, Notar, Grundbuch und gegebenenfalls Makler summieren sich auf 10 bis 15 % des Kaufpreises — bei 400.000 € also 40.000 bis 60.000 €. Diese Kosten schaffen **keinen Gegenwert**, den eine Bank beleihen könnte, und müssen deshalb praktisch immer aus Eigenkapital kommen.",
        "Die Grunderwerbsteuer schwankt erheblich zwischen den Bundesländern — von 3,5 % bis 6,5 %. Bei einer Immobilie im mittleren Preissegment sind das mehrere zehntausend Euro Unterschied allein aufgrund des Standorts.",
      ],
    },
    {
      h3: "Warum die Tilgung wichtiger ist als der Zins",
      body: [
        "Die **anfängliche Tilgung** bestimmt, wie schnell die Restschuld sinkt und wie hoch das Zinsänderungsrisiko am Ende der Zinsbindung ausfällt. Bei 2 % Tilgung dauert die Rückzahlung über 30 Jahre; bei 3 % verkürzt sie sich auf gut 23 Jahre und die Restschuld nach zehn Jahren ist deutlich niedriger.",
        "Weil das Darlehen aus der Rate abgeleitet wird, senkt eine höhere Tilgung allerdings den finanzierbaren Betrag. Genau hier liegt die eigentliche Entscheidung: mehr Objekt oder mehr Sicherheit. Das verfügbare Nettoeinkommen als Ausgangspunkt liefert der [Brutto-Netto-Rechner](/).",
      ],
    },
    {
      h3: "Was die Bank noch anrechnet",
      body: [
        "In die Haushaltsrechnung fließen alle laufenden Verpflichtungen ein — bestehende Kredite, Leasingraten, Unterhalt und auch eine laufende [BAföG-Rückzahlung](/bafoeg-rueckzahlung-rechner). Ebenso wird ein pauschaler Lebenshaltungsbetrag je Haushaltsmitglied abgezogen.",
        "Auf der Einnahmenseite zählt das dauerhaft gesicherte Einkommen. Variable Bestandteile wie ein [Bonus](/bonus-steuerrechner) werden meist nur teilweise oder gar nicht berücksichtigt. Wer eine Immobilie vermieten will, sollte zusätzlich die Besteuerung der Mieteinnahmen kennen: [Mieteinnahmen versteuern](/mieteinnahmen-versteuern).",
      ],
    },
  ],
  source: "Kaufnebenkosten je Bundesland · Annuitätenrechnung",
};

/* ── /private-krankenversicherung-vs-gesetzlich ──────────────────────── */

const gkvHoechstAn =
  (BBG_2026.kvPvJahr / 12) * (BBG_2026.anSatzKv + BBG_2026.anSatzPv);

const pkvGkv: ToolContentConfig = {
  heading: "PKV oder GKV 2026: Ab welchem Einkommen sich der Wechsel rechnet",
  answer:
    "In der gesetzlichen Krankenversicherung richtet sich der Beitrag nach dem Einkommen und ist bei der Beitragsbemessungsgrenze von 5.812,50 € im Monat gedeckelt. Der Arbeitnehmeranteil für Kranken- und Pflegeversicherung erreicht dort seinen Höchstwert. In der privaten Krankenversicherung hängt der Beitrag dagegen von Alter, Gesundheitszustand und Tarif ab, nicht vom Gehalt.",
  facts: [
    { label: "Beitragsbemessungsgrenze KV/PV", value: "5.812,50 € / Monat" },
    { label: "GKV allgemeiner Beitragssatz", value: pct(KV_2026.allgemeinerBeitragssatz) },
    { label: "Durchschnittlicher Zusatzbeitrag", value: pct(KV_2026.durchschnittlicherZusatzbeitrag) },
    { label: "Arbeitnehmeranteil KV", value: pct(BBG_2026.anSatzKv, 2) },
    { label: "AN-Höchstbeitrag KV+PV (mit Kind)", value: eur2(gkvHoechstAn) + " / Monat" },
    { label: "Beitragsgrundlage PKV", value: "Alter, Gesundheit, Tarif" },
  ],
  steps: [
    {
      title: "Versicherungspflichtgrenze prüfen",
      text: "Ein Wechsel in die PKV ist Arbeitnehmern erst möglich, wenn das regelmäßige Jahresarbeitsentgelt die Versicherungspflichtgrenze übersteigt. Selbständige und Beamte können unabhängig davon wechseln.",
    },
    {
      title: "GKV-Beitrag bestimmen",
      text: "Prozentual vom Bruttoentgelt bis zur Beitragsbemessungsgrenze. Oberhalb bleibt der Beitrag konstant — das ist der Punkt, ab dem ein Vergleich überhaupt sinnvoll wird.",
    },
    {
      title: "PKV-Angebot gegenrechnen",
      text: "Die Prämie hängt vom Eintrittsalter, vom Gesundheitszustand und vom gewählten Leistungsumfang ab, nicht vom Einkommen.",
    },
    {
      title: "Arbeitgeberzuschuss und Familie einbeziehen",
      text: "Der Arbeitgeber zuschusst auch in der PKV, höchstens jedoch bis zum hälftigen GKV-Höchstbeitrag. Familienangehörige sind in der PKV nicht beitragsfrei mitversichert.",
    },
  ],
  sections: [
    {
      h3: "Der Vergleich kippt mit der Familienplanung",
      body: [
        "Der auffälligste Unterschied ist nicht der Beitrag, sondern die **Familienversicherung**. In der GKV sind Ehepartner ohne eigenes nennenswertes Einkommen und Kinder beitragsfrei mitversichert — in der PKV kostet jede Person eine eigene Prämie. Eine Rechnung, die im Single-Dasein klar für die PKV spricht, kann sich mit zwei Kindern vollständig umkehren.",
        "Ebenso wichtig: Der GKV-Beitrag ist oberhalb der Beitragsbemessungsgrenze **gedeckelt**. Weitere Gehaltssteigerungen erhöhen ihn nicht mehr — wie sich das im Netto niederschlägt, zeigt der [Brutto-Netto-Rechner mit Krankenkassenauswahl](/brutto-netto-rechner-krankenkasse).",
      ],
    },
    {
      h3: "Die PKV-Prämie steigt mit dem Alter, nicht mit dem Gehalt",
      body: [
        "Weil sich der PKV-Beitrag am Eintrittsalter und am Gesundheitszustand orientiert, ist er am Anfang oft deutlich günstiger — und steigt über die Jahrzehnte durch medizinischen Fortschritt und Alterung. Alterungsrückstellungen dämpfen diesen Effekt, heben ihn aber nicht auf. Wer im Ruhestand ein niedrigeres Einkommen hat, trägt die Prämie dann ohne Arbeitgeberzuschuss weiter.",
        "Der **Rückweg in die GKV** ist für Arbeitnehmer ab 55 Jahren praktisch versperrt. Diese Einbahnstraße ist der wichtigste Grund, die Entscheidung nicht allein an der aktuellen Monatsersparnis auszurichten. Die spätere Einkommenssituation lässt sich mit dem [Rentenrechner](/rentenrechner) abschätzen.",
      ],
    },
    {
      h3: "Sonderfall Beamte und Selbständige",
      body: [
        "Für **Beamte** ist die PKV der Regelfall, weil die Beihilfe des Dienstherrn bereits 50 % der Kosten trägt (70 % bei Versorgungsempfängern und bei zwei oder mehr Kindern) und nur der Restanteil privat abzusichern ist. Das macht die PKV dort strukturell günstig — der [Beamten-Rechner](/brutto-netto-rechner-beamte) zeigt die Nettowirkung.",
        "**Selbständige** können unabhängig von der Einkommenshöhe wählen, zahlen in der GKV aber auch auf sonstige Einkünfte Beiträge. Für sie ist zusätzlich die Altersvorsorge relevant: [Riester](/riester-rechner), [bAV](/bav-rechner) und die [Rentenpunkte](/rentenpunkte-rechner) aus freiwilligen Beiträgen.",
      ],
    },
  ],
  source: "§ 6 SGB V · § 223 SGB V · § 257 SGB V",
};

/* ── /steuerfreibetrag-2026 ──────────────────────────────────────────── */

const steuerfreibetrag: ToolContentConfig = {
  heading: "Steuerfreibeträge 2026: Welcher Betrag steuerfrei bleibt",
  answer:
    "Der Grundfreibetrag beträgt 2026 12.348 € je Person und 24.696 € für zusammenveranlagte Paare — bis zu diesem zu versteuernden Einkommen fällt keine Einkommensteuer an. Er stieg zum 1. Januar 2026 um 252 € von zuvor 12.096 €. Hinzu kommen Pauschbeträge und Freibeträge, die das zu versteuernde Einkommen weiter senken.",
  facts: [
    { label: "Grundfreibetrag (einzeln)", value: "12.348 €" },
    { label: "Grundfreibetrag (zusammenveranlagt)", value: "24.696 €" },
    { label: "Arbeitnehmer-Pauschbetrag", value: "1.230 €" },
    { label: "Sonderausgaben-Pauschbetrag", value: "36 €" },
    { label: "Kinderfreibetrag", value: "9.756 €" },
    { label: "Kindergeld je Kind", value: "259 € / Monat" },
  ],
  steps: [
    {
      title: "Pauschbeträge automatisch ansetzen",
      text: "Arbeitnehmer-Pauschbetrag und Sonderausgaben-Pauschbetrag werden ohne Nachweis berücksichtigt — sie mindern das zu versteuernde Einkommen in jedem Fall.",
    },
    {
      title: "Höhere tatsächliche Kosten nachweisen",
      text: "Wer mehr als 1.230 € Werbungskosten hat, setzt die tatsächlichen Kosten an. Nur der übersteigende Teil wirkt zusätzlich.",
    },
    {
      title: "Grundfreibetrag anwenden",
      text: "Auf das verbleibende zu versteuernde Einkommen wird der Tarif angewandt, der bis 12.348 € null beträgt.",
    },
    {
      title: "Freibetrag eintragen lassen",
      text: "Absehbar hohe Werbungskosten lassen sich als Lohnsteuerfreibetrag beim Finanzamt eintragen — sie wirken dann sofort im Monatsnetto statt erst über die Erstattung.",
    },
  ],
  table: {
    caption: "Wirkung des Grundfreibetrags: Steuer nach zu versteuerndem Einkommen 2026",
    head: ["zvE / Jahr", "steuerfrei", "steuerpflichtig", "Einkommensteuer"],
    rows: [12348, 15000, 20000, 30000, 45000].map((z) => {
      const steuerpflichtig = Math.max(0, z - 12348);
      const steuer = estFormel2026(z);
      return [
        eur(z),
        eur(Math.min(z, 12348)),
        eur(steuerpflichtig),
        eur(steuer),
      ];
    }),
    note: "Die Steuer wächst nicht linear mit dem übersteigenden Betrag: Der Tarif nach § 32a EStG steigt progressiv an, beginnend bei 14 % direkt oberhalb des Grundfreibetrags. Ohne Solidaritätszuschlag und Kirchensteuer.",
  },
  sections: [
    {
      h3: "Freibetrag, Freigrenze und Pauschbetrag sind drei verschiedene Dinge",
      body: [
        "Ein **Freibetrag** bleibt immer steuerfrei — versteuert wird nur, was darüber liegt. Bei einer **Freigrenze** dagegen wird bei Überschreiten grundsätzlich der gesamte Betrag relevant; das klassische Beispiel ist der Solidaritätszuschlag. Ein **Pauschbetrag** wird ohne Nachweis angesetzt, kann aber durch höhere tatsächliche Kosten ersetzt werden.",
        "Die Unterscheidung entscheidet darüber, ob sich ein einzelner Euro mehr Einkommen sprunghaft oder nur anteilig auswirkt. Wie stark ein zusätzlicher Euro belastet wird, zeigt der Grenzsteuersatz im [Einkommensteuer-Rechner](/einkommensteuer-rechner).",
      ],
    },
    {
      h3: "Kinderfreibetrag oder Kindergeld?",
      body: [
        "Das Finanzamt führt automatisch eine **Günstigerprüfung** durch — beantragen muss man nichts. Bis zu einem Familieneinkommen von grob 80.000 € ist in der Regel das Kindergeld von 259 € je Kind und Monat vorteilhafter, darüber der Kinderfreibetrag von 9.756 €.",
        "Für die Lohnsteuer während des Jahres zählt der Kinderfreibetrag ohnehin nur bei Solidaritätszuschlag und Kirchensteuer mit. Wie sich Kinder auf die Steuerklasse auswirken, klärt der [Steuerklassen-Finder](/welche-steuerklasse-bin-ich).",
      ],
    },
    {
      h3: "Den Freibetrag eintragen lassen statt auf die Erstattung zu warten",
      body: [
        "Wer absehbar hohe Werbungskosten hat — etwa durch eine große Entfernung zur Arbeit, die der [Pendlerpauschale-Rechner](/pendlerpauschale-rechner) beziffert —, kann beim Finanzamt einen **Lohnsteuerfreibetrag** eintragen lassen. Er senkt den monatlichen Steuerabzug sofort, statt das Geld ein Jahr lang zinslos beim Fiskus zu parken.",
        "Der Eintrag führt allerdings zur Pflichtveranlagung. Was ohne Eintrag über die Erklärung zurückkommt, schätzt der [Steuerrückerstattung-Rechner](/steuerrueckerstattung-rechner); weitere steuerfreie Gehaltsbestandteile bietet die [betriebliche Altersvorsorge](/bav-rechner).",
      ],
    },
  ],
  source: "§ 32a EStG · § 9a EStG · § 32 EStG · § 39a EStG",
};

/* ── /brutto-netto-rechner-beamte ────────────────────────────────────── */

const beamte: ToolContentConfig = {
  heading: "Beamte: Warum vom Brutto deutlich mehr netto übrig bleibt",
  answer:
    "Beamte zahlen keine Beiträge zur Renten-, Arbeitslosen- und gesetzlichen Kranken- oder Pflegeversicherung. Vom Bruttogehalt gehen nur Lohnsteuer, gegebenenfalls Solidaritätszuschlag und Kirchensteuer ab. Dafür tragen sie ihre private Krankenversicherung selbst — allerdings nur den Anteil, den die Beihilfe des Dienstherrn nicht abdeckt.",
  facts: [
    { label: "Sozialversicherungsbeiträge", value: "keine" },
    { label: "Ersparnis gegenüber Angestellten", value: "21,15 % vom Brutto" },
    { label: "Beihilfe im Regelfall", value: "50 % der Kosten" },
    { label: "Beihilfe Versorgungsempfänger / ab 2 Kindern", value: "70 %" },
    { label: "Mindestvorsorgepauschale", value: "12 % des Arbeitslohns" },
    { label: "Lohnsteuer", value: "bundeseinheitlich nach § 32a EStG" },
  ],
  steps: [
    {
      title: "Dienstbezüge feststellen",
      text: "Grundgehalt der Besoldungsgruppe und -stufe zuzüglich Familienzuschlag und etwaiger Zulagen.",
    },
    {
      title: "Lohnsteuer berechnen",
      text: "Nach demselben Tarif wie bei allen Arbeitnehmern. Da keine Sozialversicherungsbeiträge anfallen, wird beim Lohnsteuerabzug die Mindestvorsorgepauschale von 12 % des Arbeitslohns angesetzt.",
    },
    {
      title: "Zuschläge abziehen",
      text: "Solidaritätszuschlag oberhalb der Freigrenze und gegebenenfalls Kirchensteuer.",
    },
    {
      title: "PKV-Prämie berücksichtigen",
      text: "Die private Krankenversicherung wird direkt vom Konto gezahlt und ist kein Lohnabzug — versichert wird nur der nicht von der Beihilfe gedeckte Anteil.",
    },
  ],
  sections: [
    {
      h3: "Der Nettovorteil ist real, aber kein reiner Gewinn",
      body: [
        "Weil die 21,15 % Arbeitnehmer-Sozialabgaben entfallen, liegt das Nettogehalt eines Beamten bei gleichem Brutto deutlich über dem eines Angestellten — je nach Gehaltshöhe mehrere hundert Euro im Monat. Den direkten Vergleich rechnet der [Brutto-Netto-Rechner](/) für die Angestelltenseite.",
        "Diesem Vorteil stehen jedoch die **PKV-Prämie** gegenüber, die direkt vom Konto abgeht und mit dem Alter steigt, sowie der Umstand, dass keine Ansprüche in der gesetzlichen Rentenversicherung entstehen. An deren Stelle tritt die Beamtenversorgung, die anderen Regeln folgt als die Punktesystematik im [Rentenpunkte-Rechner](/rentenpunkte-rechner).",
      ],
    },
    {
      h3: "Beihilfe und private Krankenversicherung",
      body: [
        "Die **Beihilfe** ist der Zuschuss des Dienstherrn zu Krankheitskosten und übernimmt im Regelfall 50 %, bei Versorgungsempfängern und bei zwei oder mehr Kindern 70 %. Privat abzusichern ist deshalb nur der Restanteil, was die Prämie gegenüber einer Vollversicherung erheblich senkt — der Hauptgrund, warum die PKV für Beamte strukturell günstig ist.",
        "Der grundsätzliche Vergleich beider Systeme steht unter [PKV vs. GKV](/private-krankenversicherung-vs-gesetzlich). Zu beachten: Die Beihilfesätze für Ehepartner unterscheiden sich zwischen den Ländern.",
      ],
    },
    {
      h3: "Gilt der Rechner für alle Bundesländer?",
      body: [
        "Ja — die **Lohnsteuer ist bundeseinheitlich**, die Nettoberechnung passt daher für alle Länder. Unterschiedlich sind die Besoldungstabellen selbst (A-, B-, R- und W-Besoldung fallen je Land verschieden hoch aus) und die Beihilferegelungen im Detail.",
        "Wer im öffentlichen Dienst angestellt statt verbeamtet ist, rechnet mit dem [TVöD-Rechner](/tvoed-rechner); dort gelten die vollen Sozialabgaben. Für die Einordnung des Gehalts hilft das [Durchschnittsgehalt Deutschland](/durchschnittsgehalt-deutschland).",
      ],
    },
  ],
  source: "§ 32a EStG · § 39b Abs. 2 EStG · Beihilfeverordnungen der Länder",
};

/* ── /welche-steuerklasse-bin-ich ────────────────────────────────────── */

const steuerklasseFinder: ToolContentConfig = {
  heading: "Welche Steuerklasse habe ich? Die sechs Klassen im Überblick",
  answer:
    "Die Steuerklasse ergibt sich aus Familienstand und Zahl der Arbeitsverhältnisse. Ledige ohne Kind haben Klasse 1, Alleinerziehende Klasse 2. Verheiratete werden automatisch in Klasse 4 eingestuft und können 3/5 oder 4/4 mit Faktor wählen. Klasse 6 gilt für jedes zweite und weitere Arbeitsverhältnis.",
  facts: [
    { label: "Klasse 1", value: "ledig, verwitwet, geschieden" },
    { label: "Klasse 2", value: "alleinerziehend, mit Entlastungsbetrag" },
    { label: "Klasse 3", value: "verheiratet, höheres Einkommen" },
    { label: "Klasse 4", value: "verheiratet, ähnliche Einkommen" },
    { label: "Klasse 5", value: "verheiratet, niedrigeres Einkommen" },
    { label: "Klasse 6", value: "zweites und jedes weitere Arbeitsverhältnis" },
  ],
  steps: [
    {
      title: "Familienstand klären",
      text: "Ledig, verheiratet beziehungsweise verpartnert, verwitwet oder geschieden — das ist die erste Weiche.",
    },
    {
      title: "Kinder berücksichtigen",
      text: "Alleinerziehende mit mindestens einem Kind im Haushalt erhalten auf Antrag Klasse 2 mit dem Entlastungsbetrag.",
    },
    {
      title: "Bei Ehepaaren die Kombination wählen",
      text: "Nach der Heirat gilt automatisch 4/4. Alternativ 3/5 bei stark ungleichen Einkommen oder 4/4 mit Faktor für eine verursachungsgerechte Verteilung.",
    },
    {
      title: "Weitere Arbeitsverhältnisse prüfen",
      text: "Jedes zusätzliche Arbeitsverhältnis läuft in Klasse 6 — ohne Freibeträge und mit Abzug ab dem ersten Euro.",
    },
  ],
  table: {
    caption: "Nettogehalt bei 3.500 € brutto je Steuerklasse (2026)",
    head: ["Steuerklasse", "Lohnsteuer / Monat", "Netto / Monat", "Differenz zu Klasse 1"],
    rows: ([1, 2, 3, 4, 5, 6] as const).map((sk) => {
      const r = netto(3500, { steuerklasse: sk });
      const basis = netto(3500, { steuerklasse: 1 }).nettoMonat;
      const diff = r.nettoMonat - basis;
      return [
        "Klasse " + sk,
        eur(r.steuer.einkommensteuerJahr / 12),
        eur(r.nettoMonat),
        sk === 1 ? "—" : (diff >= 0 ? "+" : "") + eur(diff),
      ];
    }),
    note: "Kinderlos über 23 Jahre, ohne Kirchensteuer, durchschnittlicher Zusatzbeitrag 2,9 %. Die Unterschiede betreffen nur den laufenden Abzug — die Jahressteuer ist bei gleichem Jahreseinkommen identisch.",
  },
  sections: [
    {
      h3: "Die Steuerklasse ändert die Liquidität, nicht die Steuerschuld",
      body: [
        "Das ist der am häufigsten missverstandene Punkt. Alle sechs Klassen führen bei gleichem Jahreseinkommen zur **gleichen Jahressteuer**. Was sie verändern, ist die Verteilung über das Jahr — und bei Ehepaaren die Verteilung zwischen den Partnern. Ein zu hoher Abzug kommt über die Steuererklärung zurück, ein zu niedriger führt zur Nachzahlung.",
        "Praktisch relevant ist die Wahl trotzdem, und zwar aus zwei Gründen: wegen der monatlichen Liquidität und wegen der Lohnersatzleistungen, die am Nettoentgelt hängen. Beide Varianten vergleicht der [Steuerklassenwechsel-Rechner](/steuerklassenwechsel-rechner).",
      ],
    },
    {
      h3: "Klasse 2 wird oft übersehen",
      body: [
        "Alleinerziehende haben Anspruch auf Klasse 2 mit dem **Entlastungsbetrag für Alleinerziehende**, sofern mindestens ein Kind im Haushalt gemeldet ist und keine andere erwachsene Person mit im Haushalt lebt. Die Klasse wird nicht automatisch vergeben — sie muss beantragt werden, und genau daran scheitert es häufig.",
        "Auch Klasse 6 wird unterschätzt: Sie kennt keine Freibeträge, sodass ab dem ersten Euro Lohnsteuer anfällt. Bei einem [Minijob](/minijob-rechner) mit Pauschalversteuerung durch den Arbeitgeber entsteht dieses Problem dagegen nicht.",
      ],
    },
    {
      h3: "Vor Elterngeld, Krankengeld und Arbeitslosigkeit rechtzeitig wechseln",
      body: [
        "[Elterngeld](/elterngeld-rechner), [Krankengeld](/krankengeld-rechner), [Arbeitslosengeld](/arbeitslosengeld-rechner) und [Kurzarbeitergeld](/kurzarbeitergeld-rechner) bemessen sich am **Nettoentgelt** der Vormonate. Wer in Klasse 5 abgerechnet wird, erhält deshalb weniger — bei gleichem Bruttogehalt.",
        "Der Wechsel muss früh genug erfolgen, weil der Bemessungszeitraum mehrere Monate zurückreicht; beim Elterngeld sind es die zwölf Monate vor der Geburt. Ein Wechsel ist mehrfach im Jahr möglich, maßgeblich für das Folgejahr ist der Stand zum 30. November. Die Merkmale aller Klassen stellt die [Steuerklassen-Übersicht](/steuerklassen) gegenüber.",
      ],
    },
  ],
  source: "§ 38b EStG · § 39 EStG · § 24b EStG",
};

/* ── exports ─────────────────────────────────────────────────────────── */

export const TOOL_CONTENT_MORE: Record<string, ToolContentConfig> = {
  "/mehrwertsteuer-rechner": mehrwertsteuer,
  "/schenkungssteuer-rechner": schenkungssteuer,
  "/grundsicherung-rechner": grundsicherung,
  "/schonvermoegen-rechner": schonvermoegen,
  "/bafoeg-rueckzahlung-rechner": bafoegRueckzahlung,
  "/bafoeg-rechner": bafoeg,
  "/buergergeld-rechner": buergergeld,
  "/rentenrechner": rentenrechner,
  "/immobilienkredit-rechner": immobilienkredit,
  "/private-krankenversicherung-vs-gesetzlich": pkvGkv,
  "/steuerfreibetrag-2026": steuerfreibetrag,
  "/brutto-netto-rechner-beamte": beamte,
  "/welche-steuerklasse-bin-ich": steuerklasseFinder,
};
