/**
 * Branchen-Cluster: „Brutto Netto <Branche>" — programmatische Seiten unter
 * /brutto-netto/<slug>.
 *
 * ── Warum es diese Seiten gibt ──────────────────────────────────────────
 * Die Suchintention „was bleibt in MEINER Branche netto übrig" ist eine
 * andere als die des allgemeinen Rechners. Wer „brutto netto pflege" sucht,
 * will nicht nur eine Zahl, sondern wissen, ob die eigenen Nacht- und
 * Sonntagszuschläge steuerfrei sind. Genau dieser branchenspezifische
 * Steuerteil steht in `besonderheit` — er ist der Grund, warum die Seiten
 * kein Thin Content sind, und er ist je Branche fachlich verschieden.
 *
 * ── Zur Gehaltszahl ────────────────────────────────────────────────────
 * `durchschnittJahr` ist der **durchschnittliche** (arithmetisch gemittelte)
 * Bruttojahresverdienst von Vollzeitbeschäftigten 2025 **einschließlich
 * Sonderzahlungen**, aus der Destatis-Tabelle „Durchschnittliche
 * Bruttojahresverdienste von Vollzeitbeschäftigten" (Stand 1. April 2026).
 *
 * Das ist NICHT der Median. Der Median liegt deutlich darunter (Gesamt-
 * wirtschaft: 54.066 € Median gegenüber 64.441 € Durchschnitt) — die beiden
 * Maße wurden in diesem Repo schon einmal verwechselt. Die Seiten weisen den
 * Wert deshalb ausdrücklich als Durchschnitt aus. Gegenprobe: der hier
 * hinterlegte Gesamtwert 64.441 € stimmt mit `DESTATIS_JAHR_2025.durchschnittJahr`
 * in `data/wage-stats.ts` überein — beide stammen aus derselben Erhebung.
 *
 * `wzName` ist der amtliche Name des Wirtschaftszweigs. Er weicht teils vom
 * umgangssprachlichen Branchennamen ab (Pflege → „Gesundheits- und
 * Sozialwesen"); die Seiten nennen deshalb immer beides, damit die Zahl
 * nachprüfbar bleibt und nicht mehr verspricht, als sie abdeckt.
 */

export interface BrancheBesonderheit {
  titel: string;
  text: string;
}

export interface Branche {
  slug: string;
  /** Umgangssprachlicher Branchenname, wie gesucht wird. */
  name: string;
  /** Präpositionalform für Fließtext, z. B. „in der Pflege". */
  praep: string;
  /** Amtlicher Wirtschaftszweig laut Destatis. */
  wzName: string;
  /**
   * Durchschnittlicher Bruttojahresverdienst Vollzeit 2025 inkl.
   * Sonderzahlungen (Destatis). Kein Median — siehe Modul-Doc.
   */
  durchschnittJahr: number;
  /**
   * Gesetzt, wenn der amtliche Wirtschaftszweig deutlich breiter ist als der
   * Branchenname. Wird auf der Seite als Einschränkung ausgewiesen, damit die
   * Zahl nicht mehr behauptet, als sie hergibt.
   */
  abgrenzung?: string;
  /** Typische Berufe — bedient die Longtail-Suche und liefert Kontext. */
  berufe: string[];
  /** 2–4 Sätze fachlicher Kontext, je Branche verschieden. */
  kontext: string;
  /** Der branchenspezifische Steuer-/SV-Sachverhalt. Kern der Seite. */
  besonderheit: BrancheBesonderheit;
  /** Interne Verlinkung auf die passenden Rechner. */
  verwandteRechner: { href: string; label: string }[];
}

/** Gesamtwirtschaft als Vergleichsanker — dieselbe Erhebung, dieselbe Basis. */
export const GESAMTWIRTSCHAFT_DURCHSCHNITT_2025 = 64441;

export const DESTATIS_BRANCHEN_QUELLE = {
  titel: "Durchschnittliche Bruttojahresverdienste von Vollzeitbeschäftigten im Jahr 2025",
  herausgeber: "Statistisches Bundesamt (Destatis)",
  stand: "1. April 2026",
  hinweis: "Vollzeitbeschäftigte, einschließlich Sonderzahlungen. Arithmetisches Mittel, nicht Median.",
  url: "https://www.destatis.de/DE/Themen/Arbeit/Verdienste/Verdienste-Branche-Berufe/Tabellen/bruttojahresverdienst.html",
} as const;

export const BRANCHEN: Branche[] = [
  {
    slug: "pflege",
    name: "Pflege",
    praep: "in der Pflege",
    wzName: "Gesundheits- und Sozialwesen",
    durchschnittJahr: 62503,
    abgrenzung:
      "Der amtliche Wirtschaftszweig umfasst neben der Kranken- und Altenpflege auch Kliniken, Arztpraxen und die gesamte Sozialwirtschaft. Reine Pflegekräfte liegen je nach Träger, Tarif und Schichtanteil darunter oder darüber.",
    berufe: [
      "Gesundheits- und Krankenpfleger",
      "Altenpfleger",
      "Pflegefachkraft",
      "Pflegehelfer",
      "Medizinische Fachangestellte",
      "Intensivpfleger",
    ],
    kontext:
      "Kaum eine Branche hängt beim Netto so stark an Zuschlägen wie die Pflege. Zwei Pflegekräfte mit identischem Grundgehalt können am Monatsende mehrere Hundert Euro auseinanderliegen — je nachdem, wie viele Nacht-, Sonntags- und Feiertagsdienste im Schichtplan standen. Der Grund ist steuerlicher Natur: Diese Zuschläge sind unter bestimmten Bedingungen steuerfrei, während das Grundgehalt voll versteuert wird.",
    besonderheit: {
      titel: "Nacht-, Sonntags- und Feiertagszuschläge sind steuerfrei (§ 3b EStG)",
      text:
        "Zuschläge für tatsächlich geleistete Nacht-, Sonntags- und Feiertagsarbeit bleiben nach § 3b EStG steuerfrei — bis zu 25 % des Grundlohns für Nachtarbeit (20 bis 6 Uhr), 50 % für Sonntagsarbeit und 125 % für gesetzliche Feiertage. Zwei Grenzen sind dabei entscheidend und werden oft verwechselt: Steuerfrei ist der Zuschlag nur, soweit der Grundlohn höchstens 50 € je Stunde beträgt; beitragsfrei in der Sozialversicherung ist er dagegen nur bis zu einem Grundlohn von 25 € je Stunde. Wer darüber liegt, zahlt auf den überschießenden Teil Sozialabgaben, obwohl der Zuschlag steuerfrei bleibt. Der Referentenentwurf EStRefG 2027 will die Grenze für Sonntags- und Feiertagsarbeit von 50 € auf 75 € je Stunde anheben, für Nachtarbeit soll es bei 50 € bleiben.",
    },
    verwandteRechner: [
      { href: "/", label: "Brutto-Netto-Rechner" },
      { href: "/ueberstunden-rechner", label: "Überstundenrechner" },
      { href: "/tvoed-rechner", label: "TVöD-Rechner" },
      { href: "/krankengeld-rechner", label: "Krankengeld-Rechner" },
    ],
  },
  {
    slug: "gastronomie",
    name: "Gastronomie",
    praep: "in der Gastronomie",
    wzName: "Gastgewerbe",
    durchschnittJahr: 39749,
    berufe: [
      "Koch",
      "Restaurantfachkraft",
      "Servicekraft",
      "Barkeeper",
      "Hotelfachkraft",
      "Küchenhilfe",
    ],
    kontext:
      "Das Gastgewerbe ist der Wirtschaftszweig mit dem niedrigsten Durchschnittsverdienst in Deutschland — ein erheblicher Teil der Beschäftigten arbeitet in Teilzeit, im Minijob oder nah am gesetzlichen Mindestlohn. Beim Netto spielen deshalb zwei Dinge eine überdurchschnittlich große Rolle: die Minijob- und Midijob-Grenzen und die Frage, wie Trinkgeld behandelt wird.",
    besonderheit: {
      titel: "Trinkgeld von Gästen ist unbegrenzt steuerfrei (§ 3 Nr. 51 EStG)",
      text:
        "Trinkgeld, das Gäste freiwillig und zusätzlich zum Rechnungsbetrag geben, ist nach § 3 Nr. 51 EStG in voller Höhe steuerfrei — es gibt anders als früher keine Obergrenze mehr, und es fallen darauf auch keine Sozialabgaben an. Entscheidend ist die Freiwilligkeit und dass das Trinkgeld dem Beschäftigten persönlich zugedacht ist. Nicht steuerfrei ist dagegen ein vom Arbeitgeber ausgezahltes Bedienungsgeld oder ein verpflichtender Servicezuschlag auf der Rechnung: Das ist Arbeitslohn und wird voll versteuert. Wer überwiegend im Abend- und Wochenendbetrieb arbeitet, kann zusätzlich die steuerfreien Sonntags- und Nachtzuschläge nach § 3b EStG nutzen.",
    },
    verwandteRechner: [
      { href: "/minijob-rechner", label: "Minijob-Rechner" },
      { href: "/midijob-rechner", label: "Midijob-Rechner" },
      { href: "/mindestlohn", label: "Mindestlohn-Rechner" },
      { href: "/stundenlohn-rechner", label: "Stundenlohnrechner" },
    ],
  },
  {
    slug: "handwerk",
    name: "Handwerk",
    praep: "im Handwerk",
    wzName: "Baugewerbe",
    durchschnittJahr: 54358,
    abgrenzung:
      "Die Zahl bildet das Baugewerbe ab. Handwerksberufe außerhalb des Baus — etwa Kfz-Mechatroniker oder Bäcker — zählen amtlich zum Handel beziehungsweise zum Verarbeitenden Gewerbe und verdienen im Schnitt abweichend.",
    berufe: [
      "Maurer",
      "Elektroniker",
      "Anlagenmechaniker SHK",
      "Zimmerer",
      "Dachdecker",
      "Maler und Lackierer",
    ],
    kontext:
      "Im Bauhauptgewerbe arbeiten viele Beschäftigte nicht am Betriebssitz, sondern auf wechselnden Baustellen. Steuerlich ist das ein Vorteil: Wer keine erste Tätigkeitsstätte hat, kann Verpflegungsmehraufwand geltend machen und Fahrten anders abrechnen als Pendler mit festem Arbeitsort.",
    besonderheit: {
      titel: "Verpflegungsmehraufwand bei Auswärtstätigkeit auf Baustellen",
      text:
        "Wer beruflich auswärts tätig ist, kann Verpflegungspauschalen als Werbungskosten ansetzen: 14 € bei einer Abwesenheit von mehr als 8 Stunden sowie für An- und Abreisetage einer mehrtägigen Tätigkeit, 28 € bei ganztägiger Abwesenheit von 24 Stunden. Zahlt der Arbeitgeber die Auslöse steuerfrei aus, ist der Betrag bereits abgegolten und kann nicht zusätzlich in der Steuererklärung angesetzt werden. Zahlt er nichts oder weniger, bleibt die Differenz als Werbungskosten abziehbar. Weil der Arbeitnehmer-Pauschbetrag von 1.230 € im Handwerk durch Arbeitsmittel, Arbeitskleidung und Fahrten oft überschritten wird, lohnt die Steuererklärung hier besonders häufig.",
    },
    verwandteRechner: [
      { href: "/", label: "Brutto-Netto-Rechner" },
      { href: "/pendlerpauschale-rechner", label: "Pendlerpauschale-Rechner" },
      { href: "/steuerrueckerstattung-rechner", label: "Steuererstattungsrechner" },
      { href: "/ueberstunden-rechner", label: "Überstundenrechner" },
    ],
  },
  {
    slug: "logistik",
    name: "Logistik",
    praep: "in der Logistik",
    wzName: "Verkehr und Lagerei",
    durchschnittJahr: 51843,
    berufe: [
      "Berufskraftfahrer",
      "Lagerist",
      "Fachkraft für Lagerlogistik",
      "Disponent",
      "Zusteller",
      "Staplerfahrer",
    ],
    kontext:
      "Die Logistik teilt sich beim Netto in zwei sehr unterschiedliche Gruppen: Lagerbeschäftigte mit festem Arbeitsort und Fahrpersonal im Fernverkehr. Für Berufskraftfahrer gibt es eine eigene Pauschale, die es in keiner anderen Branche gibt — sie wird in der Praxis häufig übersehen.",
    besonderheit: {
      titel: "Übernachtungspauschale für Berufskraftfahrer: 9 € pro Tag",
      text:
        "Berufskraftfahrer, die in der Schlafkabine ihres Fahrzeugs übernachten, können nach § 9 Absatz 1 Satz 3 Nummer 5b EStG eine Pauschale von 9 € je Kalendertag ansetzen — zusätzlich zur Verpflegungspauschale von 14 € beziehungsweise 28 €. Der Betrag wurde zum 1. Januar 2024 von 8 € auf 9 € angehoben. Die Pauschale deckt Nebenkosten wie Dusche, Sanitäranlagen oder die Reinigung der Kabine ab; wer sie nutzt, muss keine Einzelbelege sammeln, muss sich aber für das gesamte Jahr einheitlich entweder für die Pauschale oder für die tatsächlichen Kosten entscheiden. Nacht- und Sonntagszuschläge im Schichtbetrieb sind daneben nach § 3b EStG steuerfrei.",
    },
    verwandteRechner: [
      { href: "/", label: "Brutto-Netto-Rechner" },
      { href: "/steuerrueckerstattung-rechner", label: "Steuererstattungsrechner" },
      { href: "/ueberstunden-rechner", label: "Überstundenrechner" },
      { href: "/mindestlohn", label: "Mindestlohn-Rechner" },
    ],
  },
  {
    slug: "handel",
    name: "Handel & Einzelhandel",
    praep: "im Handel",
    wzName: "Handel, Instandhaltung und Reparatur von Kraftfahrzeugen",
    durchschnittJahr: 59558,
    abgrenzung:
      "Der amtliche Wirtschaftszweig fasst Einzelhandel, Großhandel und Kfz-Handel zusammen. Der Großhandel zieht den Durchschnitt spürbar nach oben — im reinen Einzelhandel liegen die Verdienste typischerweise darunter.",
    berufe: [
      "Verkäufer",
      "Kaufmann im Einzelhandel",
      "Filialleiter",
      "Kassierer",
      "Kaufmann im Großhandel",
      "Kfz-Mechatroniker",
    ],
    kontext:
      "Im Einzelhandel arbeiten überdurchschnittlich viele Beschäftigte in Teilzeit und mit wechselnden Stundenzahlen. Neben dem Grundgehalt gibt es einen geldwerten Vorteil, der oft nicht als Teil der Vergütung wahrgenommen wird: den Personalrabatt auf die Waren des eigenen Arbeitgebers.",
    besonderheit: {
      titel: "Personalrabatt bleibt bis 1.080 € im Jahr steuerfrei (§ 8 Abs. 3 EStG)",
      text:
        "Kauft man Waren beim eigenen Arbeitgeber vergünstigt ein, ist die Ersparnis grundsätzlich ein geldwerter Vorteil und damit Arbeitslohn. Nach § 8 Absatz 3 EStG bleibt sie aber bis zu einem Rabattfreibetrag von 1.080 € je Kalenderjahr steuer- und beitragsfrei. Zusätzlich wird der Endpreis für die Bewertung um einen Bewertungsabschlag von 4 % gemindert. Die Regel gilt nur für Waren und Dienstleistungen, die der Arbeitgeber auch fremden Kunden anbietet — ein vom Arbeitgeber eingekaufter Fremdartikel fällt nicht darunter. Erst der Betrag oberhalb von 1.080 € im Jahr wird lohnsteuer- und sozialversicherungspflichtig.",
    },
    verwandteRechner: [
      { href: "/", label: "Brutto-Netto-Rechner" },
      { href: "/minijob-rechner", label: "Minijob-Rechner" },
      { href: "/teilzeitrechner", label: "Teilzeitrechner" },
      { href: "/mindestlohn", label: "Mindestlohn-Rechner" },
    ],
  },
  {
    slug: "oeffentlicher-dienst",
    name: "Öffentlicher Dienst",
    praep: "im öffentlichen Dienst",
    wzName: "Öffentliche Verwaltung, Verteidigung, Sozialversicherung",
    durchschnittJahr: 59350,
    berufe: [
      "Verwaltungsfachangestellte",
      "Sachbearbeiter",
      "Erzieher",
      "Sozialarbeiter",
      "Beamter im mittleren Dienst",
      "IT-Fachkraft im öffentlichen Dienst",
    ],
    kontext:
      "Der öffentliche Dienst kennt zwei völlig verschiedene Abrechnungswelten: Tarifbeschäftigte nach TVöD oder TV-L auf der einen Seite, Beamte auf der anderen. Der Unterschied ist beim Netto größer als beim Brutto — Beamte zahlen weder in die Renten- noch in die Arbeitslosenversicherung ein und sind privat krankenversichert.",
    besonderheit: {
      titel: "Beamte und Tarifbeschäftigte werden völlig unterschiedlich abgerechnet",
      text:
        "Bei Tarifbeschäftigten nach TVöD oder TV-L greift die normale Sozialversicherungspflicht: Renten-, Arbeitslosen-, Kranken- und Pflegeversicherung werden vom Brutto abgezogen, dazu kommt die Zusatzversorgung (VBL). Beamte zahlen keine Renten- und keine Arbeitslosenversicherungsbeiträge; statt Krankenkassenbeiträgen tragen sie einen Eigenanteil zur privaten Krankenversicherung, weil der Dienstherr über die Beihilfe einen Großteil der Krankheitskosten übernimmt. Aus demselben Brutto bleibt bei Beamten deshalb spürbar mehr netto übrig — dafür entsteht kein gesetzlicher Rentenanspruch, sondern eine Pension nach eigenen Regeln. Tarifbeschäftigte erhalten zusätzlich eine Jahressonderzahlung, deren Höhe von Entgeltgruppe und Tarifgebiet abhängt.",
    },
    verwandteRechner: [
      { href: "/tvoed-rechner", label: "TVöD-Rechner" },
      { href: "/brutto-netto-rechner-beamte", label: "Beamten-Rechner" },
      { href: "/", label: "Brutto-Netto-Rechner" },
      { href: "/weihnachtsgeld-rechner", label: "Jahressonderzahlung" },
    ],
  },
  {
    slug: "it",
    name: "IT & Software",
    praep: "in der IT",
    wzName: "Information und Kommunikation",
    durchschnittJahr: 86638,
    berufe: [
      "Softwareentwickler",
      "IT-Consultant",
      "Systemadministrator",
      "Data Engineer",
      "DevOps Engineer",
      "IT-Projektleiter",
    ],
    kontext:
      "Die IT ist nach den Finanzdienstleistungen der bestbezahlte große Wirtschaftszweig in Deutschland. Genau daraus folgt eine Besonderheit beim Netto, die in niedriger bezahlten Branchen keine Rolle spielt: Ein erheblicher Teil der Beschäftigten verdient oberhalb der Beitragsbemessungsgrenzen — ab dort steigen die Sozialabgaben nicht weiter mit.",
    besonderheit: {
      titel: "Oberhalb der Beitragsbemessungsgrenzen sinkt die Abgabenquote",
      text:
        "Sozialversicherungsbeiträge werden nur bis zur jeweiligen Beitragsbemessungsgrenze erhoben. 2026 liegt sie in der Kranken- und Pflegeversicherung bei 5.812,50 € im Monat, in der Renten- und Arbeitslosenversicherung bei 8.450 € im Monat. Jeder Euro darüber ist beitragsfrei — die Sozialabgaben bleiben absolut konstant, während das Brutto weiter steigt. Die Folge wirkt zunächst widersprüchlich: Die Sozialabgabenquote sinkt mit steigendem Gehalt, während die Steuerquote durch den progressiven Tarif weiter steigt. Ab einem Jahreseinkommen von 73.800 € (2026) besteht außerdem Versicherungsfreiheit in der gesetzlichen Krankenversicherung — der Wechsel in die private Krankenversicherung wird damit möglich und verändert die Abzüge noch einmal grundlegend.",
    },
    verwandteRechner: [
      { href: "/", label: "Brutto-Netto-Rechner" },
      { href: "/beitragsbemessungsgrenze-2026", label: "Beitragsbemessungsgrenze 2026" },
      { href: "/firmenwagenrechner", label: "Firmenwagenrechner" },
      { href: "/bav-rechner", label: "Betriebliche Altersvorsorge" },
    ],
  },
  {
    slug: "industrie",
    name: "Industrie",
    praep: "in der Industrie",
    wzName: "Verarbeitendes Gewerbe",
    durchschnittJahr: 67520,
    berufe: [
      "Industriemechaniker",
      "Elektroniker für Betriebstechnik",
      "Maschinen- und Anlagenführer",
      "Fertigungsmitarbeiter",
      "Werkzeugmechaniker",
      "Qualitätsprüfer",
    ],
    kontext:
      "Das Verarbeitende Gewerbe liegt beim Durchschnittsverdienst deutlich über der Gesamtwirtschaft — vor allem wegen der Flächentarifverträge und des hohen Anteils an Schichtarbeit. Urlaubs- und Weihnachtsgeld sind hier tariflich weit verbreitet und verändern das Netto in den Auszahlungsmonaten spürbar.",
    besonderheit: {
      titel: "Einmalzahlungen werden anders besteuert als das laufende Gehalt",
      text:
        "Urlaubs- und Weihnachtsgeld gelten lohnsteuerlich als sonstige Bezüge. Sie werden nicht mit dem Steuersatz des laufenden Monats abgerechnet, sondern über die Jahreslohnsteuer: Der Arbeitgeber ermittelt die Steuer auf das Jahresgehalt mit und ohne Einmalzahlung, die Differenz ist die einbehaltene Lohnsteuer. Weil das den progressiven Tarif berücksichtigt, ist der Abzug auf eine Einmalzahlung fast immer höher als der gewohnte monatliche Prozentsatz — der Betrag ist deshalb nicht falsch abgerechnet, sondern korrekt progressiv besteuert. In der Sozialversicherung greift zusätzlich die anteilige Jahres-Beitragsbemessungsgrenze, sodass bei höheren Einkommen auf die Einmalzahlung oft weniger Beiträge anfallen als erwartet. Schichtzuschläge für Nacht- und Sonntagsarbeit bleiben daneben nach § 3b EStG steuerfrei.",
    },
    verwandteRechner: [
      { href: "/weihnachtsgeld-rechner", label: "Weihnachtsgeld-Rechner" },
      { href: "/urlaubsgeld-rechner", label: "Urlaubsgeld-Rechner" },
      { href: "/bonus-steuerrechner", label: "Bonus-Steuerrechner" },
      { href: "/ueberstunden-rechner", label: "Überstundenrechner" },
    ],
  },
];

export function getBrancheBySlug(slug: string): Branche | undefined {
  return BRANCHEN.find((b) => b.slug === slug);
}

/** Branchen absteigend nach Durchschnittsverdienst — für die Hub-Tabelle. */
export function branchenNachVerdienst(): Branche[] {
  return [...BRANCHEN].sort((a, b) => b.durchschnittJahr - a.durchschnittJahr);
}
