import { eur, pct, netto } from "@/data/tool-content-shared";
import type { ToolContentConfig } from "@/components/ToolContent";

/**
 * Long-form content for the calculator pages — fourth batch.
 *
 * Same contract and rationale as `data/tool-content.ts` (see the header there).
 * These pages already carry more content than the earlier batches, so most
 * configs deliberately omit `table` — all but `/brutto-netto-gehaltstabelle`
 * already render one of their own, and a second would read as padding.
 */

/* ── /brutto-netto-gehaltstabelle ────────────────────────────────────── */

const TABELLE_STUFEN = [2000, 2500, 3000, 3500, 4000, 5000, 6000];

const gehaltstabelle: ToolContentConfig = {
  heading: "Brutto-Netto-Tabelle 2026: Nettogehalt je Bruttobetrag",
  answer:
    "Von 3.000 € brutto im Monat bleiben 2026 in Steuerklasse 1 rund 2.065 € netto. Die Nettoquote sinkt mit steigendem Bruttogehalt, weil der Einkommensteuertarif progressiv verläuft — von rund 74 % bei 2.000 € auf gut 61 % bei 6.000 € brutto. Ab den Beitragsbemessungsgrenzen flacht der Rückgang wieder ab.",
  facts: [
    { label: "Sozialabgaben Arbeitnehmer", value: "21,15 % bis BBG" },
    { label: "Grundfreibetrag 2026", value: "12.348 €" },
    { label: "BBG Kranken-/Pflegeversicherung", value: "5.812,50 € / Monat" },
    { label: "BBG Renten-/Arbeitslosenvers.", value: "8.450 € / Monat" },
    { label: "Durchschnittlicher Zusatzbeitrag", value: "2,9 %" },
    { label: "Berechnungsgrundlage", value: "§ 32a EStG" },
  ],
  steps: [
    {
      title: "Sozialabgaben abziehen",
      text: "21,15 % Arbeitnehmeranteil, jedoch nur bis zu den Beitragsbemessungsgrenzen von 5.812,50 € beziehungsweise 8.450 € im Monat.",
    },
    {
      title: "Zu versteuerndes Einkommen bilden",
      text: "Arbeitnehmer-Pauschbetrag, Vorsorgepauschale und die Freibeträge der [Steuerklasse](/steuerklassen) mindern die Bemessungsgrundlage.",
    },
    {
      title: "Lohnsteuer nach Tarif berechnen",
      text: "Der progressive Tarif nach § 32a EStG wird angewandt, in Steuerklasse 3 im Splittingverfahren.",
    },
    {
      title: "Zuschläge berücksichtigen",
      text: "Solidaritätszuschlag oberhalb der Freigrenze und gegebenenfalls Kirchensteuer mit 8 % oder 9 %.",
    },
  ],
  table: {
    caption: "Brutto-Netto-Tabelle 2026 nach Steuerklasse (Monatswerte)",
    head: ["Brutto", "Klasse 1", "Klasse 3", "Klasse 4", "Klasse 5", "Nettoquote (Kl. 1)"],
    rows: TABELLE_STUFEN.map((b) => {
      const k1 = netto(b, { steuerklasse: 1 }).nettoMonat;
      return [
        eur(b),
        eur(k1),
        eur(netto(b, { steuerklasse: 3 }).nettoMonat),
        eur(netto(b, { steuerklasse: 4 }).nettoMonat),
        eur(netto(b, { steuerklasse: 5 }).nettoMonat),
        pct((k1 / b) * 100, 1),
      ];
    }),
    note: "Kinderlos über 23 Jahre, ohne Kirchensteuer, durchschnittlicher Zusatzbeitrag 2,9 %. Für jeden einzelnen Betrag gibt es eine Detailseite mit allen sechs Steuerklassen, Stundenlohn und der vollständigen Aufschlüsselung der Abzüge.",
  },
  sections: [
    {
      h3: "Warum die Nettoquote mit dem Gehalt sinkt",
      body: [
        "Bei 2.000 € brutto bleiben anteilig deutlich mehr Prozent übrig als bei 6.000 €. Ursache ist der **progressive Tarif**: Der Grundfreibetrag von 12.348 € wirkt bei niedrigen Einkommen relativ stark, und jeder weitere Euro wird höher besteuert als der vorherige. Der Unterschied zwischen Durchschnitts- und Grenzsteuersatz lässt sich am [Einkommensteuer-Rechner](/einkommensteuer-rechner) ablesen.",
        "Oberhalb der [Beitragsbemessungsgrenzen](/beitragsbemessungsgrenze-2026) kehrt sich der Trend teilweise um: Ab 5.812,50 € entfallen weitere Beiträge zur Kranken- und Pflegeversicherung, ab 8.450 € auch zur Renten- und Arbeitslosenversicherung. Die Nettoquote fällt dort langsamer, weil nur noch die Steuer wächst.",
      ],
    },
    {
      h3: "Was die Tabelle bewusst nicht abbildet",
      body: [
        "Die Werte gelten für **Steuerklasse 1 ohne Kirchensteuer** und mit dem durchschnittlichen Zusatzbeitrag von 2,9 %. In der Praxis verschieben vier Faktoren das Ergebnis: die Steuerklasse (der [Steuerklassen-Finder](/welche-steuerklasse-bin-ich) hilft bei der Zuordnung), der Kinderlosenzuschlag in der Pflegeversicherung, die Kirchensteuer und der kassenindividuelle Zusatzbeitrag — Letzteren berücksichtigt der [Rechner mit Krankenkassenauswahl](/brutto-netto-rechner-krankenkasse).",
        "Ebenfalls nicht enthalten sind Einmalzahlungen, die als sonstige Bezüge anders besteuert werden ([Bonus-Steuerrechner](/bonus-steuerrechner)), ein Dienstwagen als geldwerter Vorteil ([Firmenwagenrechner](/firmenwagenrechner)) und die [betriebliche Altersvorsorge](/bav-rechner), die das steuerpflichtige Brutto senkt.",
      ],
    },
    {
      h3: "Das eigene Gehalt einordnen",
      body: [
        "Wo ein Bruttogehalt im bundesweiten Vergleich steht, zeigt die Übersicht [Durchschnittsgehalt Deutschland](/durchschnittsgehalt-deutschland) mit Median und Perzentilen. Für die Verhandlung ist die Gegenrichtung nützlicher: Welches Brutto ergibt ein gewünschtes Netto? Das löst der [Netto-zu-Brutto-Rechner](/rechner/netto-zu-brutto).",
        "Die vollständige, individuell einstellbare Berechnung liefert der [Brutto-Netto-Rechner](/) — inklusive Bundesland, Kirchensteuer, Kinderfreibeträgen und Krankenkasse.",
      ],
    },
  ],
  source: "§ 32a EStG · § 39b EStG · SGB IV/V/VI/XI",
};

/* ── /beitragsbemessungsgrenze-2026 ──────────────────────────────────── */

const bbg: ToolContentConfig = {
  heading: "Beitragsbemessungsgrenze 2026: 69.750 € und 101.400 €",
  answer:
    "Die Beitragsbemessungsgrenze ist das Einkommen, bis zu dem Sozialversicherungsbeiträge erhoben werden. 2026 liegt sie in der Kranken- und Pflegeversicherung bei 69.750 € im Jahr (5.812,50 € im Monat) und in der Renten- und Arbeitslosenversicherung bei 101.400 € im Jahr (8.450 € im Monat). Auf den übersteigenden Teil fallen keine Beiträge an.",
  facts: [
    { label: "BBG Kranken-/Pflegeversicherung", value: "69.750 € / Jahr" },
    { label: "monatlich", value: "5.812,50 €" },
    { label: "BBG Renten-/Arbeitslosenvers.", value: "101.400 € / Jahr" },
    { label: "monatlich", value: "8.450 €" },
    { label: "Arbeitnehmeranteil bis zur Grenze", value: "21,15 %" },
    { label: "Rechtsgrundlage", value: "§ 159 SGB VI, § 6 SGB V" },
  ],
  steps: [
    {
      title: "Beitragspflichtiges Entgelt begrenzen",
      text: "Das Bruttoentgelt wird für jeden Versicherungszweig auf die jeweilige Grenze gedeckelt.",
    },
    {
      title: "Beiträge auf den gedeckelten Betrag berechnen",
      text: "Kranken- und Pflegeversicherung auf höchstens 5.812,50 €, Renten- und Arbeitslosenversicherung auf höchstens 8.450 € im Monat.",
    },
    {
      title: "Höchstbeitrag ermitteln",
      text: "Oberhalb der Grenze bleibt der Beitrag konstant — jede weitere Gehaltssteigerung erhöht ihn nicht mehr.",
    },
    {
      title: "Steuer separat betrachten",
      text: "Die Lohnsteuer kennt keine Obergrenze. Sie steigt auch oberhalb der Beitragsbemessungsgrenzen weiter progressiv an.",
    },
  ],
  sections: [
    {
      h3: "Der Knick in der Nettokurve",
      body: [
        "Weil zwei unterschiedliche Grenzen gelten, hat die Nettokurve zwei Knicke. Ab **5.812,50 €** im Monat wachsen Kranken- und Pflegeversicherungsbeiträge nicht mehr mit, ab **8.450 €** auch Renten- und Arbeitslosenversicherung nicht. Von jeder Gehaltserhöhung oberhalb dieser Schwellen bleibt daher spürbar mehr netto übrig — sichtbar im [Gehaltserhöhung-Rechner](/gehaltserhoehung-rechner).",
        "Derselbe Effekt macht Einmalzahlungen oberhalb der Grenze attraktiver: Wer mit dem laufenden Gehalt bereits über der Jahresgrenze liegt, erhält [Weihnachtsgeld](/weihnachtsgeld-rechner), [Urlaubsgeld](/urlaubsgeld-rechner) oder einen [Bonus](/bonus-steuerrechner) sozialabgabenfrei.",
      ],
    },
    {
      h3: "Beitragsbemessungsgrenze ist nicht Versicherungspflichtgrenze",
      body: [
        "Die beiden werden häufig verwechselt. Die **Beitragsbemessungsgrenze** legt fest, bis zu welchem Entgelt Beiträge erhoben werden. Die **Versicherungspflichtgrenze** entscheidet dagegen darüber, ob ein Arbeitnehmer die gesetzliche Krankenversicherung überhaupt verlassen und in die private wechseln darf — sie liegt höher.",
        "Wer über beide Grenzen nachdenkt, findet den Systemvergleich unter [PKV vs. GKV](/private-krankenversicherung-vs-gesetzlich). Die Grenzen steigen jährlich mit der allgemeinen Lohnentwicklung, weshalb sie jedes Jahr neu festgesetzt werden.",
      ],
    },
    {
      h3: "Wirkung auf Rente und Lohnersatzleistungen",
      body: [
        "Was oberhalb der Grenze verdient wird, erzeugt **keine Entgeltpunkte** mehr. Das Maximum liegt deshalb bei rund 1,95 Punkten im Jahr — nachzuvollziehen im [Rentenpunkte-Rechner](/rentenpunkte-rechner). Aus demselben Grund sind auch [Arbeitslosengeld](/arbeitslosengeld-rechner), [Krankengeld](/krankengeld-rechner) und [Elterngeld](/elterngeld-rechner) nach oben begrenzt.",
        "Für die private Vorsorge ist die Rentenversicherungsgrenze doppelt relevant: Die steuer- und sozialabgabenfreien Höchstbeträge der [betrieblichen Altersvorsorge](/bav-rechner) leiten sich mit 8 % und 4 % direkt aus ihr ab — 676 € beziehungsweise 338 € im Monat.",
      ],
    },
  ],
  source: "§ 159 SGB VI · § 6 SGB V · Sozialversicherungs-Rechengrößenverordnung 2026",
};

/* ── /brutto-netto-rechner-krankenkasse ──────────────────────────────── */

const krankenkasse: ToolContentConfig = {
  heading: "Zusatzbeitrag 2026: Warum die Krankenkasse das Netto verändert",
  answer:
    "Der allgemeine Beitragssatz zur gesetzlichen Krankenversicherung liegt bei 14,6 %, dazu kommt ein kassenindividueller Zusatzbeitrag — im Durchschnitt 2,9 % für 2026. Beide werden paritätisch getragen. Weil der Zusatzbeitrag je Kasse um mehrere Zehntelprozentpunkte abweicht, unterscheidet sich das Nettogehalt bei identischem Brutto von Kasse zu Kasse.",
  facts: [
    { label: "Allgemeiner Beitragssatz", value: "14,6 %" },
    { label: "Durchschnittlicher Zusatzbeitrag 2026", value: "2,9 %" },
    { label: "Arbeitnehmeranteil KV (Durchschnitt)", value: "8,75 %" },
    { label: "TK Zusatzbeitrag 2026", value: "2,69 %" },
    { label: "AOK-Spanne 2026", value: "ab 2,47 %" },
    { label: "Beitragsbemessungsgrenze KV/PV", value: "5.812,50 € / Monat" },
  ],
  steps: [
    {
      title: "Beitragssatz der eigenen Kasse feststellen",
      text: "14,6 % allgemeiner Satz plus der individuelle Zusatzbeitrag der Kasse ergeben den Gesamtbeitragssatz.",
    },
    {
      title: "Paritätisch aufteilen",
      text: "Arbeitnehmer und Arbeitgeber tragen je die Hälfte — auch beim Zusatzbeitrag, der seit 2019 nicht mehr allein vom Arbeitnehmer getragen wird.",
    },
    {
      title: "Auf das beitragspflichtige Entgelt anwenden",
      text: "Berechnet wird auf das Bruttoentgelt, höchstens jedoch auf 5.812,50 € im Monat.",
    },
    {
      title: "Pflegeversicherung ergänzen",
      text: "3,6 % paritätisch, zuzüglich 0,6 Prozentpunkte für Kinderlose ab 23 Jahren, die der Arbeitnehmer allein trägt.",
    },
  ],
  sections: [
    {
      h3: "Warum ein Standardrechner ein anderes Netto zeigt als die Abrechnung",
      body: [
        "Die meisten Brutto-Netto-Rechner rechnen mit dem **amtlichen Durchschnitts-Zusatzbeitrag** von 2,9 %. Die eigene Kasse kann darüber oder darunter liegen — die Spanne reicht 2026 von unter 2,5 % bis deutlich über 3 %. Genau diese Differenz erklärt die wenigen Euro Abweichung zwischen Rechner und Gehaltsabrechnung, die viele irritiert.",
        "Rechnerisch ist der Effekt überschaubar, aber nicht null: Ein halber Prozentpunkt Unterschied bedeutet bei 4.000 € brutto rund 10 € netto im Monat, also gut 120 € im Jahr. Der Rechner auf dieser Seite lässt den Zusatzbeitrag deshalb direkt auswählen.",
      ],
    },
    {
      h3: "Lohnt sich ein Kassenwechsel?",
      body: [
        "Der Beitragssatz ist der einzige Preisunterschied — die **Regelleistungen sind gesetzlich identisch**. Unterschiede gibt es nur bei Satzungs- und Zusatzleistungen wie Bonusprogrammen, Osteopathie-Zuschüssen oder professioneller Zahnreinigung. Wer allein auf den Beitrag schaut, sollte den Wechsel rechnen; wer bestimmte Zusatzleistungen nutzt, sollte gegenrechnen.",
        "Ein Wechsel ist nach zwölf Monaten Bindungsfrist mit zwei Monaten Kündigungsfrist möglich; bei einer Beitragserhöhung besteht ein Sonderkündigungsrecht. Oberhalb der Versicherungspflichtgrenze steht zusätzlich der Wechsel in die private Krankenversicherung offen — der Systemvergleich steht unter [PKV vs. GKV](/private-krankenversicherung-vs-gesetzlich).",
      ],
    },
    {
      h3: "Wo der Beitrag gedeckelt ist",
      body: [
        "Oberhalb von 5.812,50 € im Monat steigt der Krankenversicherungsbeitrag nicht weiter — das ist die [Beitragsbemessungsgrenze](/beitragsbemessungsgrenze-2026) für Kranken- und Pflegeversicherung. Der Zusatzbeitrag wirkt sich damit nur unterhalb dieser Schwelle in voller Höhe aus.",
        "Für die vollständige Abrechnung mit allen Stellschrauben ist der [Brutto-Netto-Rechner](/) zuständig; wer wissen will, was die Stelle den Arbeitgeber kostet, nutzt den [Arbeitgeber-Rechner](/arbeitgeber-brutto-netto-rechner), in den derselbe Zusatzbeitrag zur Hälfte einfließt.",
      ],
    },
  ],
  source: "§ 241 SGB V · § 242 SGB V · § 242a SGB V · § 55 SGB XI",
};

/* ── /durchschnittsgehalt-deutschland ────────────────────────────────── */

const MEDIAN_JAHR = 54066;

const durchschnittsgehalt: ToolContentConfig = {
  heading: "Durchschnittsgehalt Deutschland: Median statt Mittelwert",
  answer:
    "Das mittlere Bruttojahresgehalt in Deutschland liegt bei 54.066 € (Median, Destatis 2025). Der Median ist aussagekräftiger als der arithmetische Durchschnitt, weil er die Beschäftigten exakt in zwei Hälften teilt und nicht von wenigen sehr hohen Einkommen nach oben verzerrt wird — der Durchschnitt liegt deshalb systematisch über dem Median.",
  facts: [
    { label: "Median Bruttojahresgehalt", value: "54.066 €" },
    { label: "Median monatlich", value: eur(MEDIAN_JAHR / 12) },
    { label: "Netto daraus (Klasse 1)", value: eur(netto(MEDIAN_JAHR / 12).nettoMonat) + " / Monat" },
    { label: "Quelle", value: "Destatis, Verdiensterhebung" },
    { label: "Median teilt", value: "50 % darüber, 50 % darunter" },
    { label: "Durchschnittsentgelt RV 2026", value: "51.944 €" },
  ],
  steps: [
    {
      title: "Median statt Mittelwert heranziehen",
      text: "Der Median teilt die Beschäftigten in zwei gleich große Hälften und ist gegen Ausreißer nach oben unempfindlich.",
    },
    {
      title: "Eigenes Bruttojahresgehalt bilden",
      text: "Zwölf Monatsgehälter plus Sonderzahlungen wie Weihnachts- und Urlaubsgeld ergeben die Vergleichsgröße.",
    },
    {
      title: "Im Perzentil einordnen",
      text: "Aus der Verdienstverteilung lässt sich ablesen, welcher Anteil der Beschäftigten mehr oder weniger verdient.",
    },
    {
      title: "Netto gegenrechnen",
      text: "Für die Lebenswirklichkeit zählt das Netto — und das hängt zusätzlich von Steuerklasse, Kirchensteuer und Krankenkasse ab.",
    },
  ],
  sections: [
    {
      h3: "Warum der Durchschnitt fast immer zu hoch wirkt",
      body: [
        "Der arithmetische Durchschnitt wird von wenigen sehr hohen Einkommen nach oben gezogen; der **Median** nicht. Deshalb liegt der Durchschnitt regelmäßig über dem Median, und wer sich am Durchschnitt misst, kommt zu einem verzerrten Bild. Für die Frage „verdiene ich mehr oder weniger als die Hälfte der Beschäftigten?\" ist ausschließlich der Median die richtige Größe.",
        "Eine dritte Größe stiftet zusätzlich Verwirrung: das **Durchschnittsentgelt der Rentenversicherung** von 51.944 € für 2026. Es ist eine reine Rechengröße für die Entgeltpunkte und keine Gehaltsstatistik — nachzulesen im [Rentenpunkte-Rechner](/rentenpunkte-rechner).",
      ],
    },
    {
      h3: "Was einen Gehaltsvergleich sonst noch verzerrt",
      body: [
        "Bundesweite Zahlen mischen sehr unterschiedliche Arbeitsmärkte. Relevant für die eigene Einordnung sind Branche, Region, Berufserfahrung, Qualifikation, Betriebsgröße und Tarifbindung — im öffentlichen Dienst etwa der [TVöD](/tvoed-rechner) mit festen Entgeltgruppen. Auch die Arbeitszeit zählt: Teilzeitgehälter senken den Vergleichswert, ohne dass der Stundenlohn niedriger wäre ([Stundenlohn-Rechner](/stundenlohn-rechner)).",
        "Für den Vergleich sollte immer das **Bruttojahresgehalt** herangezogen werden, weil Sonderzahlungen sonst unter den Tisch fallen — der [Jahresgehalt-Rechner](/jahresgehalt-rechner) rechnet das zusammen.",
      ],
    },
    {
      h3: "Vom Vergleichswert zur Verhandlung",
      body: [
        "Ein belastbarer Vergleichswert ist das Fundament jeder Gehaltsverhandlung. Was von einer Erhöhung tatsächlich ankommt, zeigt der [Gehaltserhöhung-Rechner](/gehaltserhoehung-rechner) — durch die Steuerprogression sind es meist deutlich weniger als die Hälfte.",
        "Für die Zielformulierung ist die Rückwärtsrechnung praktischer: Welches Brutto ergibt ein bestimmtes Netto? Das löst der [Netto-zu-Brutto-Rechner](/rechner/netto-zu-brutto). Die vollständige Nettoübersicht je Bruttostufe steht in der [Brutto-Netto-Tabelle](/brutto-netto-gehaltstabelle).",
      ],
    },
  ],
  source: "Statistisches Bundesamt (Destatis), Verdiensterhebung",
};

/* ── /arbeitslosengeld-rechner ───────────────────────────────────────── */

const arbeitslosengeld: ToolContentConfig = {
  heading: "Arbeitslosengeld I 2026: 60 % oder 67 % vom Nettoentgelt",
  answer:
    "Das Arbeitslosengeld I beträgt 60 % des pauschalierten Nettoentgelts der letzten zwölf Monate, mit mindestens einem Kind 67 %. Die Bezugsdauer richtet sich nach Alter und Versicherungszeit und liegt zwischen 6 und 24 Monaten. Es ist eine Versicherungsleistung und damit unabhängig von Vermögen oder Bedürftigkeit.",
  facts: [
    { label: "Leistungssatz ohne Kind", value: "60 %" },
    { label: "Leistungssatz mit Kind", value: "67 %" },
    { label: "Bemessungszeitraum", value: "letzte 12 Monate" },
    { label: "Bezugsdauer", value: "6 bis 24 Monate" },
    { label: "24 Monate ab", value: "58 Jahren" },
    { label: "Steuerpflicht", value: "steuerfrei, Progressionsvorbehalt" },
  ],
  steps: [
    {
      title: "Bemessungsentgelt bestimmen",
      text: "Das beitragspflichtige Bruttoentgelt der letzten zwölf Monate, geteilt durch 365 Tage, ergibt das tägliche Bemessungsentgelt — begrenzt durch die Beitragsbemessungsgrenze.",
    },
    {
      title: "Pauschaliertes Netto ermitteln",
      text: "Davon werden pauschal Sozialabgaben und die Lohnsteuer nach der eingetragenen Steuerklasse abgezogen. Es zählt also nicht das tatsächliche, sondern ein pauschaliertes Netto.",
    },
    {
      title: "Leistungssatz anwenden",
      text: "60 % des pauschalierten Nettoentgelts, oder 67 % bei mindestens einem Kind im Sinne des Kindergeldrechts.",
    },
    {
      title: "Bezugsdauer bestimmen",
      text: "Sie hängt von Alter und Versicherungsjahren ab: ab zwölf Versicherungsmonaten sechs Monate, mit 58 Jahren und langer Versicherungszeit bis zu 24 Monate.",
    },
  ],
  sections: [
    {
      h3: "Die Steuerklasse wirkt direkt auf die Leistungshöhe",
      body: [
        "Weil das **pauschalierte Netto** die Bemessungsgrundlage ist, entscheidet die eingetragene [Steuerklasse](/steuerklassen) unmittelbar über die Höhe des Arbeitslosengeldes. Wer in Klasse 5 abgerechnet wird, erhält bei gleichem Bruttogehalt deutlich weniger als in Klasse 3.",
        "Ein Wechsel muss rechtzeitig erfolgen, weil er erst ab dem Folgemonat wirkt und die Agentur für Arbeit auf die zu Jahresbeginn eingetragene Klasse abstellt. Die Varianten vergleicht der [Steuerklassenwechsel-Rechner](/steuerklassenwechsel-rechner). Derselbe Hebel wirkt beim [Elterngeld](/elterngeld-rechner), [Krankengeld](/krankengeld-rechner) und [Kurzarbeitergeld](/kurzarbeitergeld-rechner).",
      ],
    },
    {
      h3: "Sperrzeit, Abfindung und Ruhen des Anspruchs",
      body: [
        "Eine **Sperrzeit** von bis zu zwölf Wochen droht bei Eigenkündigung oder einem Aufhebungsvertrag ohne wichtigen Grund — sie verkürzt zugleich die Gesamtbezugsdauer. Eine [Abfindung](/abfindungsrechner) mindert das Arbeitslosengeld dagegen grundsätzlich nicht, weil sie sozialversicherungsfrei ist; wird jedoch die ordentliche Kündigungsfrist nicht eingehalten, kann der Anspruch nach § 158 SGB III ruhen.",
        "Ein Nebenverdienst bis 165 € im Monat bleibt anrechnungsfrei; darüber wird angerechnet. Die Grenzen eines [Minijobs](/minijob-rechner) passen dazu nur teilweise und sollten vorher geprüft werden.",
      ],
    },
    {
      h3: "Progressionsvorbehalt und was danach kommt",
      body: [
        "Arbeitslosengeld ist **steuerfrei**, erhöht aber über den Progressionsvorbehalt den Steuersatz auf das übrige Jahreseinkommen. Ab 410 € Lohnersatzleistungen im Jahr besteht Pflicht zur Steuererklärung, und eine Nachzahlung ist häufig — besonders, wenn im selben Jahr noch Arbeitslohn bezogen wurde. Die Größenordnung liefert der [Einkommensteuer-Rechner](/einkommensteuer-rechner).",
        "Läuft der Anspruch aus, folgt das bedarfsabhängige [Bürgergeld](/buergergeld-rechner), bei dem zusätzlich Vermögen geprüft wird ([Schonvermögen-Rechner](/schonvermoegen-rechner)). Während des Bezugs von Arbeitslosengeld I werden weiterhin Rentenbeiträge gezahlt, allerdings auf reduzierter Grundlage — die Wirkung zeigt der [Rentenpunkte-Rechner](/rentenpunkte-rechner).",
      ],
    },
  ],
  source: "§§ 149 ff. SGB III · § 158 SGB III · § 32b EStG",
};

/* ── /mindestlohn ────────────────────────────────────────────────────── */

const MINDESTLOHN_2026 = 13.9;
const MINDESTLOHN_2027 = 14.6;

const mindestlohn: ToolContentConfig = {
  heading: "Mindestlohn 2026 und 2027: 13,90 € und 14,60 € pro Stunde",
  answer:
    "Der gesetzliche Mindestlohn ist zum 1. Januar 2026 auf 13,90 € brutto pro Stunde gestiegen, von zuvor 12,82 €. Zum 1. Januar 2027 steigt er auf 14,60 €. Bei einer 40-Stunden-Woche entspricht der Mindestlohn 2026 einem Bruttogehalt von rund 2.409 € im Monat.",
  facts: [
    { label: "Mindestlohn seit 1.1.2026", value: "13,90 € / Stunde" },
    { label: "Mindestlohn ab 1.1.2027", value: "14,60 € / Stunde" },
    { label: "Vorher (2025)", value: "12,82 € / Stunde" },
    { label: "Vollzeit 40 Std. (2026)", value: "rund 2.409 € brutto" },
    { label: "Netto daraus (Klasse 1)", value: "rund 1.724 €" },
    { label: "Minijob-Grenze 2026", value: "603 € / Monat" },
  ],
  steps: [
    {
      title: "Wochenstunden festlegen",
      text: "Die vereinbarte Arbeitszeit bestimmt das Monatsbrutto — bei 40 Stunden entspricht das im Schnitt 173,33 Monatsstunden.",
    },
    {
      title: "Mit dem Stundensatz multiplizieren",
      text: "13,90 € für 2026, 14,60 € ab 2027. Zuschläge für Nacht-, Sonn- und Feiertagsarbeit kommen gegebenenfalls hinzu.",
    },
    {
      title: "Netto berechnen",
      text: "Vom Bruttolohn gehen 21,15 % Sozialabgaben ab; Lohnsteuer fällt erst oberhalb des Grundfreibetrags an.",
    },
    {
      title: "Schwellen prüfen",
      text: "Unterhalb von 603 € im Monat liegt ein [Minijob](/minijob-rechner), zwischen 603,01 € und 2.000 € der [Übergangsbereich](/midijob-rechner) mit reduzierten Beiträgen.",
    },
  ],
  table: {
    caption: "Mindestlohn 2026 und 2027 nach Wochenstunden",
    head: ["Wochenstunden", "Brutto 2026", "Netto 2026", "Brutto 2027", "Plus brutto"],
    rows: [10, 20, 30, 40].map((h) => {
      const std = (h * 52) / 12;
      const b26 = std * MINDESTLOHN_2026;
      const b27 = std * MINDESTLOHN_2027;
      return [
        h + " Std.",
        eur(b26),
        eur(netto(b26).nettoMonat),
        eur(b27),
        "+" + eur(b27 - b26),
      ];
    }),
    note: "Monatsstunden gerechnet mit 52 Wochen / 12 Monaten. Netto in Steuerklasse 1, kinderlos, ohne Kirchensteuer; bei 10 Wochenstunden greifen Minijob- beziehungsweise Übergangsbereichsregeln, die hier nicht berücksichtigt sind.",
  },
  sections: [
    {
      h3: "Der Mindestlohn steuert auch die Minijob-Grenze",
      body: [
        "Seit 2022 ist die [Minijob-Grenze](/minijob-rechner) dynamisch an den Mindestlohn gekoppelt: Sie entspricht dem Verdienst aus zehn Wochenstunden zum jeweiligen Mindestlohn. Aus 13,90 € folgen deshalb 603 € im Monat, aus 14,60 € ab 2027 entsprechend 633 €.",
        "Diese Kopplung hat einen praktischen Vorteil: Wer einen Minijob bis zur Grenze ausübt, muss die Arbeitszeit nach einer Mindestlohnerhöhung nicht mehr reduzieren, um im Minijob zu bleiben. Direkt oberhalb beginnt der [Übergangsbereich](/midijob-rechner) mit gleitend steigenden Beiträgen.",
      ],
    },
    {
      h3: "Wer vom Mindestlohn ausgenommen ist",
      body: [
        "Der gesetzliche Mindestlohn gilt nicht für Auszubildende (für sie gilt die Mindestausbildungsvergütung), für Jugendliche unter 18 ohne abgeschlossene Berufsausbildung, für Pflichtpraktika im Rahmen von Schule oder Studium, für freiwillige Praktika bis drei Monate und für Langzeitarbeitslose in den ersten sechs Monaten einer neuen Beschäftigung.",
        "In einzelnen Branchen gelten höhere **Branchenmindestlöhne** aufgrund allgemeinverbindlicher Tarifverträge — etwa im Bauhauptgewerbe, in der Pflege und im Gebäudereinigerhandwerk. Sie gehen dem gesetzlichen Mindestlohn vor. Im öffentlichen Dienst richtet sich die Vergütung nach dem [TVöD](/tvoed-rechner).",
      ],
    },
    {
      h3: "Was netto vom Mindestlohn bleibt",
      body: [
        "Bei Vollzeit mit 40 Wochenstunden ergeben sich 2026 rund 2.409 € brutto und in Steuerklasse 1 etwa 1.724 € netto. In den Steuerklassen 3 und 4 fällt das Netto höher aus — die vollständige Aufschlüsselung liefert der [Brutto-Netto-Rechner](/), die Übersicht je Bruttostufe die [Brutto-Netto-Tabelle](/brutto-netto-gehaltstabelle).",
        "Wer in Teilzeit arbeitet, findet die anteilige Rechnung im [Teilzeitrechner](/teilzeitrechner). Reicht das Einkommen nicht aus, kommen aufstockendes [Bürgergeld](/buergergeld-rechner) oder Wohngeld in Betracht.",
      ],
    },
  ],
  source: "§ 1 MiLoG · Mindestlohnanpassungsverordnung · § 8 SGB IV",
};

/* ── /abgeltungssteuer-rechner ───────────────────────────────────────── */

const abgeltungssteuer: ToolContentConfig = {
  heading: "Abgeltungssteuer 2026: 26,375 % auf Kapitalerträge",
  answer:
    "Auf Kapitalerträge fallen 25 % Abgeltungssteuer an, zuzüglich 5,5 % Solidaritätszuschlag auf diese Steuer — zusammen 26,375 %. Mit Kirchensteuer sind es 27,82 % beziehungsweise 27,99 %. Bis zum Sparer-Pauschbetrag von 1.000 € je Person und 2.000 € bei zusammen veranlagten Ehepaaren bleiben Kapitalerträge steuerfrei.",
  facts: [
    { label: "Abgeltungssteuer", value: "25 %" },
    { label: "Solidaritätszuschlag darauf", value: "5,5 %" },
    { label: "Gesamtbelastung ohne Kirchensteuer", value: "26,375 %" },
    { label: "Mit Kirchensteuer (9 %)", value: "27,99 %" },
    { label: "Sparer-Pauschbetrag", value: "1.000 € / 2.000 €" },
    { label: "Rechtsgrundlage", value: "§ 20 Abs. 9, § 32d EStG" },
  ],
  steps: [
    {
      title: "Freistellungsauftrag erteilen",
      text: "Ohne Freistellungsauftrag behält die Bank auch auf die ersten Euro Steuer ein. Der Pauschbetrag lässt sich auf mehrere Banken aufteilen.",
    },
    {
      title: "Erträge zusammenrechnen",
      text: "Zinsen, Dividenden, Kursgewinne aus Verkäufen und Fondsausschüttungen zählen gleichermaßen zu den Kapitalerträgen.",
    },
    {
      title: "Steuer einbehalten lassen",
      text: "Die Bank führt die Steuer direkt ans Finanzamt ab — damit ist die Steuerpflicht in der Regel abgegolten, daher der Name.",
    },
    {
      title: "Günstigerprüfung erwägen",
      text: "Wer einen persönlichen Steuersatz unter 25 % hat, kann die Erträge in der Steuererklärung angeben und zu viel gezahlte Steuer zurückholen.",
    },
  ],
  sections: [
    {
      h3: "Warum der Soli hier weiterhin anfällt",
      body: [
        "Die Soli-Freigrenze, die den Zuschlag für rund 90 % der Steuerpflichtigen entfallen lässt, gilt ausschließlich für die veranlagte Einkommensteuer und die Lohnsteuer. Auf die **Kapitalertragsteuer** wird der Solidaritätszuschlag unverändert erhoben — deshalb liegt die Gesamtbelastung bei 26,375 % statt bei 25 %.",
        "Der Vergleich lohnt: Wer beim Arbeitslohn längst keinen Soli mehr zahlt ([Lohnsteuerrechner](/lohnsteuerrechner)), zahlt ihn auf Zinsen und Dividenden trotzdem in voller Höhe.",
      ],
    },
    {
      h3: "Die Günstigerprüfung wird oft übersehen",
      body: [
        "Liegt der **persönliche Grenzsteuersatz unter 25 %** — etwa bei niedrigem Einkommen, im Studium, in Elternzeit oder im Ruhestand —, ist die Abgeltungssteuer zu hoch. Über die Anlage KAP lassen sich die Erträge in die Veranlagung einbeziehen; das Finanzamt prüft dann automatisch, welche Variante günstiger ist, und erstattet die Differenz.",
        "Wo der eigene Grenzsteuersatz liegt, zeigt der [Einkommensteuer-Rechner](/einkommensteuer-rechner). Ab etwa 20.000 € zu versteuerndem Einkommen liegt er über 25 %, sodass sich die Prüfung dann nicht mehr lohnt. Auch eine [Nichtveranlagungsbescheinigung](/steuerfreibetrag-2026) kann sinnvoll sein, wenn das Einkommen dauerhaft unter dem Grundfreibetrag bleibt.",
      ],
    },
    {
      h3: "Kapitalerträge im Vergleich zu anderen Einkünften",
      body: [
        "Kapitalerträge werden mit einem festen Satz belastet, Arbeitseinkommen dagegen progressiv — deshalb ist die relative Belastung bei hohen Einkommen niedriger als beim Arbeitslohn und bei niedrigen Einkommen höher. Für die Altersvorsorge stehen daneben geförderte Wege offen: [Riester](/riester-rechner) mit Zulagen und die [betriebliche Altersvorsorge](/bav-rechner) mit Steuer- und Sozialabgabenfreiheit in der Ansparphase.",
        "Mieteinnahmen fallen nicht unter die Abgeltungssteuer, sondern werden mit dem persönlichen Satz versteuert — dazu der Rechner [Mieteinnahmen versteuern](/mieteinnahmen-versteuern). Erbschaften und Schenkungen folgen wiederum eigenen Regeln: [Erbschaftssteuer](/erbschaftssteuer-rechner) und [Schenkungssteuer](/schenkungssteuer-rechner).",
      ],
    },
  ],
  source: "§ 20 EStG · § 32d EStG · § 43a EStG",
};

/* ── /erbschaftssteuer-rechner ───────────────────────────────────────── */

const erbschaftssteuer: ToolContentConfig = {
  heading: "Erbschaftssteuer 2026: Freibeträge und Steuerklassen",
  answer:
    "Im Erbfall stehen Ehepartnern 500.000 €, Kindern und Stiefkindern 400.000 €, Enkeln 200.000 € und Eltern 100.000 € steuerfrei zu. Geschwister, Nichten, Neffen und Nichtverwandte haben 20.000 €. Der Steuersatz richtet sich nach Steuerklasse und Höhe des Erwerbs und reicht von 7 % in Klasse I bis 50 % in Klasse III.",
  facts: [
    { label: "Ehepartner / Lebenspartner", value: "500.000 €" },
    { label: "Kinder und Stiefkinder", value: "400.000 €" },
    { label: "Enkel", value: "200.000 €" },
    { label: "Eltern im Erbfall", value: "100.000 €" },
    { label: "Übrige Erwerber", value: "20.000 €" },
    { label: "Steuersatz Klasse I / II / III", value: "7–30 % / 15–43 % / 30–50 %" },
  ],
  steps: [
    {
      title: "Steuerklasse bestimmen",
      text: "Klasse I umfasst Ehepartner, Kinder, Enkel sowie Eltern und Großeltern im Erbfall. Klasse II gilt für Geschwister, Nichten und Neffen, Stiefeltern und Schwiegerkinder. Alle übrigen fallen in Klasse III.",
    },
    {
      title: "Nachlasswert ermitteln",
      text: "Vermögen abzüglich Nachlassverbindlichkeiten. Immobilien werden mit dem Verkehrswert angesetzt.",
    },
    {
      title: "Freibeträge abziehen",
      text: "Der persönliche Freibetrag, im Erbfall zusätzlich der Versorgungsfreibetrag nach § 17 ErbStG für Ehepartner und Kinder.",
    },
    {
      title: "Tarif anwenden",
      text: "Der Steuersatz steigt mit dem steuerpflichtigen Erwerb und ist in Klasse I am niedrigsten.",
    },
  ],
  sections: [
    {
      h3: "Das selbstgenutzte Familienheim bleibt oft steuerfrei",
      body: [
        "Erbt der **überlebende Ehepartner** die selbstgenutzte Immobilie und bewohnt sie mindestens zehn Jahre weiter selbst, bleibt sie unabhängig vom Wert vollständig steuerfrei — der persönliche Freibetrag von 500.000 € bleibt dabei für das übrige Vermögen erhalten. Für **Kinder** gilt dieselbe Regel, allerdings begrenzt auf 200 Quadratmeter Wohnfläche.",
        "Die Zehnjahresfrist ist hart: Ein Verkauf oder Auszug ohne zwingenden Grund lässt die Steuerbefreiung rückwirkend entfallen. Wer stattdessen vermietet, findet die laufende Besteuerung unter [Mieteinnahmen versteuern](/mieteinnahmen-versteuern).",
      ],
    },
    {
      h3: "Zu Lebzeiten übertragen schlägt vererben",
      body: [
        "Der wirksamste Hebel liegt vor dem Erbfall. Bei einer [Schenkung](/schenkungssteuer-rechner) lebt jeder Freibetrag **alle zehn Jahre neu auf** — bei einem Kind lassen sich so über dreißig Jahre viermal 400.000 € steuerfrei übertragen, während im Erbfall nur ein einziger Freibetrag zur Verfügung steht.",
        "Zu beachten ist die Rückrechnung: Schenkungen aus den letzten zehn Jahren vor dem Erbfall werden dem Nachlass nach § 14 ErbStG hinzugerechnet. Wer früh beginnt, gewinnt schlicht mehr Zehnjahresfenster — der wichtigste Grund, das Thema nicht aufzuschieben.",
      ],
    },
    {
      h3: "Was nach dem Erbfall steuerlich weiterläuft",
      body: [
        "Geerbtes Kapitalvermögen erzeugt laufende Erträge, die der [Abgeltungssteuer](/abgeltungssteuer-rechner) mit 26,375 % unterliegen — der Sparer-Pauschbetrag von 1.000 € gilt auch hier. Eine geerbte vermietete Immobilie führt zu Einkünften aus Vermietung und Verpachtung, die mit dem persönlichen Steuersatz belastet werden.",
        "Hinterbliebene haben zusätzlich einen eigenständigen Rentenanspruch: 55 % beziehungsweise 25 % der Rente des Verstorbenen, nachzurechnen im [Witwenrente-Rechner](/witwenrente-rechner). Diese Rente ist unabhängig von der Erbschaft und wird nicht auf sie angerechnet.",
      ],
    },
  ],
  source: "§ 13 ErbStG · § 15 ErbStG · § 16 ErbStG · § 17 ErbStG · § 19 ErbStG",
};

/* ── exports ─────────────────────────────────────────────────────────── */

export const TOOL_CONTENT_FINAL: Record<string, ToolContentConfig> = {
  "/brutto-netto-gehaltstabelle": gehaltstabelle,
  "/beitragsbemessungsgrenze-2026": bbg,
  "/brutto-netto-rechner-krankenkasse": krankenkasse,
  "/durchschnittsgehalt-deutschland": durchschnittsgehalt,
  "/arbeitslosengeld-rechner": arbeitslosengeld,
  "/mindestlohn": mindestlohn,
  "/abgeltungssteuer-rechner": abgeltungssteuer,
  "/erbschaftssteuer-rechner": erbschaftssteuer,
};
