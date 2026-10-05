"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  AlertCircle, Share2, Check, ChevronRight,
  TrendingUp, Landmark, HeartPulse, Briefcase,
  CircleDollarSign, Sparkles, MapPin, Calendar, ChevronDown, ChevronUp, Info,
} from "lucide-react";
import { calculateNetto, formatEUR, Steuerjahr, Szenario, Sv2027, GRUNDFREIBETRAG, BBG_2026, SV_RECHENGROESSEN_2027_ENTWURF } from "@/lib/taxCalculator";
import { siteConfig } from "@/lib/authors";
import ReviewerByline from "@/components/ReviewerByline";
import SupportButton from "@/components/SupportButton";
import AdUnit from "@/components/AdUnit";
import NextSteps from "@/components/NextSteps";

/* ─── Steuerklasse type ───────────────────────────────────────────── */
type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;
type Lang = "de" | "en" | "pl" | "ro" | "tr" | "uk";

const NUM_LOCALE: Record<Lang, string> = { de: "de-DE", en: "en-GB", pl: "pl-PL", ro: "ro-RO", tr: "tr-TR", uk: "uk-UA" };

const STEUERKLASSE_INFO: Record<Lang, Record<Steuerklasse, string>> = {
  de: {
    1: "Alleinstehende",
    2: "Alleinerziehende",
    3: "Verheiratet — höheres Einkommen",
    4: "Verheiratet — gleiches Einkommen",
    5: "Verheiratet — geringeres Einkommen",
    6: "Zweiter Job / Nebentätigkeit",
  },
  en: {
    1: "Single (Class I)",
    2: "Single parent (Class II)",
    3: "Married — higher earner (Class III)",
    4: "Married — equal earners (Class IV)",
    5: "Married — lower earner (Class V)",
    6: "Second job (Class VI)",
  },
  pl: {
    1: "Osoba samotna (klasa I)",
    2: "Samotny rodzic (klasa II)",
    3: "Małżeństwo — wyższy dochód (klasa III)",
    4: "Małżeństwo — równe dochody (klasa IV)",
    5: "Małżeństwo — niższy dochód (klasa V)",
    6: "Drugi etat (klasa VI)",
  },
  ro: {
    1: "Persoană singură (clasa I)",
    2: "Părinte singur (clasa II)",
    3: "Căsătorit — venit mai mare (clasa III)",
    4: "Căsătorit — venituri egale (clasa IV)",
    5: "Căsătorit — venit mai mic (clasa V)",
    6: "Al doilea loc de muncă (clasa VI)",
  },
  tr: {
    1: "Bekâr (I. sınıf)",
    2: "Tek ebeveyn (II. sınıf)",
    3: "Evli — yüksek gelirli (III. sınıf)",
    4: "Evli — eşit gelirli (IV. sınıf)",
    5: "Evli — düşük gelirli (V. sınıf)",
    6: "İkinci iş (VI. sınıf)",
  },
  uk: {
    1: "Неодружені (клас I)",
    2: "Батьки-одинаки (клас II)",
    3: "Одружені — вищий дохід (клас III)",
    4: "Одружені — рівні доходи (клас IV)",
    5: "Одружені — нижчий дохід (клас V)",
    6: "Друга робота (клас VI)",
  },
};

/*
 * Monat/Jahr des redaktionellen Stands als Chip am Ergebnis.
 *
 * Bewusst aus `siteConfig.lastUpdatedISO` abgeleitet statt fest eingetragen:
 * die drei Sprachvarianten standen zuletzt monatelang auf "Juli 2026", während
 * der Rest der Seite längst weiter war. Die Ableitung zerlegt den ISO-String
 * selbst, statt `Date`/`Intl` zu bemühen — beides wäre zeitzonenabhängig und
 * damit eine Quelle für Hydration-Mismatches zwischen Server und Client.
 */
const MONATSNAMEN: Record<Lang, readonly string[]> = {
  de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  pl: ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"],
  ro: ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"],
  tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
  uk: ["січень", "лютий", "березень", "квітень", "травень", "червень", "липень", "серпень", "вересень", "жовтень", "листопад", "грудень"],
};

function standChip(lang: Lang): string {
  const [jahr, monat] = siteConfig.lastUpdatedISO.split("-");
  return `${MONATSNAMEN[lang][Number(monat) - 1]} ${jahr}`;
}

/*
 * Beitragsbemessungsgrenzen (Monat) für die Hinweise zum SV-Umschalter 2027 —
 * aus den Engine-Konstanten, damit Text und Rechnung nicht auseinanderlaufen.
 * Bewusst "de-DE"/"en-GB" statt der Seitensprache: beide formatieren in Node
 * und Browser identisch (kein Hydration-Mismatch).
 */
function bbgText(locale: "de-DE" | "en-GB") {
  const f = (v: number) =>
    v.toLocaleString(locale, { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 });
  return {
    kv26: f(BBG_2026.kvPvJahr / 12),
    rv26: f(BBG_2026.rvAlvJahr / 12),
    kv27: f(SV_RECHENGROESSEN_2027_ENTWURF.kvPvBbgMonat),
    rv27: f(SV_RECHENGROESSEN_2027_ENTWURF.rvAlvBbgMonat),
  };
}
const B = bbgText("de-DE");
const BE = bbgText("en-GB");

/* ─── UI strings (de / en) ─────────────────────────────────────────── */
const T: Record<Lang, Record<string, string>> = {
  de: {
    inputParams: "Eingabe · Parameter",
    yourGross: "Ihr Bruttogehalt",
    perMonth: "/Monat",
    perYear: "/Jahr",
    grossPerMonth: "Bruttogehalt pro Monat",
    errInvalid: "Bitte einen gültigen Betrag eingeben",
    errPositive: "Der Betrag muss positiv sein",
    errMax: "Maximaler Betrag: 200.000 €",
    sliderAria: "Bruttogehalt Schieberegler",
    taxYear: "Steuerjahr",
    year2027Note: "Für 2027 gibt es noch kein verkündetes Gesetz — aber seit dem 2.9.2026 einen vom Kabinett beschlossenen Regierungsentwurf mit konkreten Tarifwerten. Wählen Sie ein Steuer-Szenario und darunter, ob die Sozialabgaben auf dem amtlichen Stand 2026 bleiben oder mit dem Entwurf 2027 gerechnet werden.",
    svLabel: "Sozialabgaben 2027",
    svBeschlossen: "Stand 2026",
    svEntwurf: "Entwurf 2027",
    svBeschlossenHint: `Amtliche Beitragsbemessungsgrenzen 2026 (KV/PV ${B.kv26} €, RV/ALV ${B.rv26} € im Monat) — sie gelten weiter, bis die Rechengrößen-Verordnung 2027 verkündet ist.`,
    svEntwurfHint: `BMAS-Referentenentwurf vom 21.9.2026: Beitragsbemessungsgrenze KV/PV ${B.kv27} €, RV/ALV ${B.rv27} € im Monat. Beitragssätze wie 2026. Wirkt erst ab ${B.kv26} € brutto.`,
    scenarioLabel: "Reformszenario 2027",
    scenarioOhne: "Ohne Reform",
    scenarioStufe1: "Entwurf 2027",
    scenarioVoll: "Stufe 2028",
    scenarioOhneHint: "Tarif 2026 unverändert fortgeschrieben — falls die Reform scheitert.",
    scenarioStufe1Hint: `Regierungsentwurf EStRefG 2027, Artikel 1 (ab 1.1.2027): Grundfreibetrag ${GRUNDFREIBETRAG.entwurf2027.toLocaleString("de-DE")} €, Arbeitnehmer-Pauschbetrag 1.430 €.`,
    scenarioVollHint: `Zweite Stufe desselben Entwurfs, Artikel 2 (ab 1.1.2028): Grundfreibetrag ${GRUNDFREIBETRAG.stufe2028.toLocaleString("de-DE")} €.`,
    taxClass: "Steuerklasse",
    moreOptions: "Weitere Optionen",
    childlessLabel: "Kinderlos & über 23 Jahre",
    childlessHint: "Pflegeversicherung +0,6 %",
    churchLabel: "Kirchensteuerpflichtig",
    churchHint: "9 % auf die Einkommensteuer",
    disclaimer: "Vereinfachte Berechnung nach § 32a EStG 2026. Keine Steuerberatung.",
    result: "Ergebnis",
    dateChip: standChip("de"),
    copyAria: "Ergebnis-Link kopieren",
    copyTitle: "Link für dieses Ergebnis kopieren",
    copied: "Kopiert!",
    share: "Teilen",
    annualNet: "Jahres-Nettogehalt",
    monthlyNet: "Monatliches Nettogehalt",
    equals: "Entspricht",
    perMonthWord: "/ Monat",
    netShare: "Netto-Anteil",
    fullAnalysisSub: "Alle 6 Steuerklassen, 2026 vs. 2027 & Netto-Stundenlohn im Detail",
    distribution: "Verteilung von Brutto zu Netto",
    legendNet: "Nettogehalt",
    legendTax: "Lohnsteuer & Soli",
    legendSv: "Sozialversicherungen",
    netWord: "Netto",
    detailed: "Detaillierte Aufschlüsselung",
    grossSalary: "Bruttogehalt",
    totalTaxes: "Steuern Gesamt",
    incomeTax: "Einkommensteuer (Lohnsteuer)",
    soli: "Solidaritätszuschlag",
    churchTax: "Kirchensteuer",
    totalSv: "Sozialabgaben Gesamt",
    pension: "Rentenversicherung (9,30 %)",
    health: "Krankenversicherung",
    care: "Pflegeversicherung",
    unemployment: "Arbeitslosenversicherung (1,30 %)",
    marginalRate: "Grenzsteuersatz",
    avgRate: "Ø-Steuersatz",
    blTitle: "So unterscheidet sich Ihr Netto je Bundesland",
    blSub: "Kirchensteuer-Tarife (8 % vs. 9 %) & Pflegeversicherung regional",
    bl8: "8 % K-Steuer",
    bl8States: "Bayern & Baden-Württemberg",
    bl9: "9 % K-Steuer",
    bl9States: "Übrige 14 Bundesländer",
    blChurchIn: "Bei Kirchensteuerpflicht im Jahr",
    netLabelShort: "Netto",
    yearCompareTitle: "Vergleich",
    yearCompareVs: "vs.",
    yearCompareSuffix: "(Steuerreform & Tarifverlauf)",
    diff: "Differenz",
    net: "Netto",
    selectedYear: "Ausgewähltes Jahr",
    compareYear: "Vergleichsjahr",
    taxYearWord: "Steuerjahr",
    netDiff: "Rechnerische Netto-Differenz",
    diffTax: "davon Lohnsteuer, Soli & Kirchensteuer",
    diffSv: "davon Sozialabgaben",
    provisional: "vorläufig",
    provisionalTip: "Vorläufige Werte 2027: Steuertarif, Grundfreibetrag, Arbeitnehmer-Pauschbetrag und Kindergeld aus dem Regierungsentwurf EStRefG 2027 (noch nicht beschlossen); Sozialabgaben mit den Werten 2026 oder dem BMAS-Entwurf der Rechengrößen 2027; Ø-Zusatzbeitrag 2,9 % (Wert 2027 gibt das BMG bis 1.11.2026 bekannt); Lohnsteuer-Grenzwerte Klasse V/VI aus dem PAP 2026.",
    monthlyAdj: "monatlich",
    annualAdj: "jährlich",
    perYearWord: "/ Jahr",
    perMonthWord2: "/ Monat",
    yearWord: "Jahr",
    monthShort: "Mon.",
  },
  en: {
    inputParams: "Input · Parameters",
    yourGross: "Your gross salary",
    perMonth: "/month",
    perYear: "/year",
    grossPerMonth: "Gross salary per month",
    errInvalid: "Please enter a valid amount",
    errPositive: "The amount must be positive",
    errMax: "Maximum amount: €200,000",
    sliderAria: "Gross salary slider",
    taxYear: "Tax year",
    year2027Note: "There is no enacted 2027 law yet — but since 2 Sep 2026 there is a cabinet-approved government draft with concrete tariff values. Pick a tax scenario and, below it, whether social contributions stay at official 2026 levels or use the 2027 draft.",
    svLabel: "Social contributions 2027",
    svBeschlossen: "2026 levels",
    svEntwurf: "2027 draft",
    svBeschlossenHint: `Official 2026 contribution ceilings (health/care €${BE.kv26}, pension/unemployment €${BE.rv26} per month) — they apply until the 2027 ordinance is enacted.`,
    svEntwurfHint: `Labour ministry draft of 21 Sep 2026: ceilings health/care €${BE.kv27}, pension/unemployment €${BE.rv27} per month. Rates as in 2026. Only matters above €${BE.kv26} gross.`,
    scenarioLabel: "2027 reform scenario",
    scenarioOhne: "No reform",
    scenarioStufe1: "Draft 2027",
    scenarioVoll: "Stage 2028",
    scenarioOhneHint: "2026 tariff carried forward unchanged — if the reform fails.",
    scenarioStufe1Hint: `Draft bill EStRefG 2027, article 1 (from 1 Jan 2027): basic allowance €${GRUNDFREIBETRAG.entwurf2027.toLocaleString("de-DE")}, employee lump sum €1,430.`,
    scenarioVollHint: `Second stage of the same draft, article 2 (from 1 Jan 2028): basic allowance €${GRUNDFREIBETRAG.stufe2028.toLocaleString("de-DE")}.`,
    taxClass: "Tax class",
    moreOptions: "More options",
    childlessLabel: "Childless & aged 23+",
    childlessHint: "Long-term care +0.6%",
    churchLabel: "Liable for church tax",
    churchHint: "9% of income tax",
    disclaimer: "Simplified calculation under § 32a EStG 2026. Not tax advice.",
    result: "Result",
    dateChip: standChip("en"),
    copyAria: "Copy result link",
    copyTitle: "Copy a link to this result",
    copied: "Copied!",
    share: "Share",
    annualNet: "Annual net salary",
    monthlyNet: "Monthly net salary",
    equals: "Equals",
    perMonthWord: "/ month",
    netShare: "Net share",
    fullAnalysisSub: "All 6 tax classes, 2026 vs. 2027 & net hourly wage in detail",
    distribution: "Gross-to-net breakdown",
    legendNet: "Net salary",
    legendTax: "Income tax & soli",
    legendSv: "Social security",
    netWord: "Net",
    detailed: "Detailed breakdown",
    grossSalary: "Gross salary",
    totalTaxes: "Total taxes",
    incomeTax: "Income tax (Lohnsteuer)",
    soli: "Solidarity surcharge",
    churchTax: "Church tax",
    totalSv: "Total social security",
    pension: "Pension insurance (9.30%)",
    health: "Health insurance",
    care: "Long-term care insurance",
    unemployment: "Unemployment insurance (1.30%)",
    marginalRate: "Marginal tax rate",
    avgRate: "Average tax rate",
    blTitle: "How your net pay differs by federal state",
    blSub: "Church-tax rates (8% vs. 9%) & regional long-term care",
    bl8: "8% church tax",
    bl8States: "Bavaria & Baden-Württemberg",
    bl9: "9% church tax",
    bl9States: "Other 14 federal states",
    blChurchIn: "With church-tax liability in",
    netLabelShort: "Net",
    yearCompareTitle: "Comparison",
    yearCompareVs: "vs.",
    yearCompareSuffix: "(tax reform & tariff curve)",
    diff: "Difference",
    net: "Net",
    selectedYear: "Selected year",
    compareYear: "Comparison year",
    taxYearWord: "Tax year",
    netDiff: "Calculated net difference",
    diffTax: "of which income tax, soli & church tax",
    diffSv: "of which social contributions",
    provisional: "provisional",
    provisionalTip: "Provisional 2027 values: tax tariff, basic allowance, employee lump sum and child benefit from the EStRefG 2027 government draft (not yet passed); social contributions at 2026 values or the BMAS 2027 draft; average additional contribution 2.9 % (2027 value due by 1 Nov 2026).",
    monthlyAdj: "monthly",
    annualAdj: "annually",
    perYearWord: "/ year",
    perMonthWord2: "/ month",
    yearWord: "Year",
    monthShort: "Mo.",
  },
  pl: {
    inputParams: "Dane · Parametry",
    yourGross: "Twoje wynagrodzenie brutto",
    perMonth: "/mies.",
    perYear: "/rok",
    grossPerMonth: "Wynagrodzenie brutto miesięcznie",
    errInvalid: "Podaj prawidłową kwotę",
    errPositive: "Kwota musi być dodatnia",
    errMax: "Maksymalna kwota: 200 000 €",
    sliderAria: "Suwak wynagrodzenia brutto",
    taxYear: "Rok podatkowy",
    year2027Note: "Na 2027 r. nie ma jeszcze uchwalonej ustawy — ale od 2.9.2026 istnieje przyjęty przez rząd projekt z konkretnymi wartościami taryfy. Wybierz scenariusz podatkowy, a poniżej — czy składki socjalne mają pozostać na urzędowym poziomie 2026 r., czy według projektu na 2027 r.",
    svLabel: "Składki socjalne 2027",
    svBeschlossen: "Poziom 2026",
    svEntwurf: "Projekt 2027",
    svBeschlossenHint: `Urzędowe limity składek 2026 (zdrowotna/pielęgnacyjna ${B.kv26} €, emerytalna/bezrobocie ${B.rv26} € miesięcznie) — obowiązują do ogłoszenia rozporządzenia na 2027 r.`,
    svEntwurfHint: `Projekt ministerstwa pracy z 21.9.2026: limity zdrowotna/pielęgnacyjna ${B.kv27} €, emerytalna/bezrobocie ${B.rv27} € miesięcznie. Stawki jak w 2026 r. Ma znaczenie dopiero powyżej ${B.kv26} € brutto.`,
    scenarioLabel: "Scenariusz reformy 2027",
    scenarioOhne: "Bez reformy",
    scenarioStufe1: "Projekt 2027",
    scenarioVoll: "Etap 2028",
    scenarioOhneHint: "Taryfa 2026 bez zmian — jeśli reforma nie dojdzie do skutku.",
    scenarioStufe1Hint: `Projekt ustawy EStRefG 2027, artykuł 1 (od 1.1.2027): kwota wolna ${GRUNDFREIBETRAG.entwurf2027.toLocaleString("de-DE")} €, ryczałt pracowniczy 1.430 €.`,
    scenarioVollHint: `Drugi etap tego samego projektu, artykuł 2 (od 1.1.2028): kwota wolna ${GRUNDFREIBETRAG.stufe2028.toLocaleString("de-DE")} €.`,
    taxClass: "Klasa podatkowa",
    moreOptions: "Więcej opcji",
    childlessLabel: "Bezdzietny/a i powyżej 23 lat",
    childlessHint: "Ubezpieczenie pielęgnacyjne +0,6%",
    churchLabel: "Podatek kościelny",
    churchHint: "9% od podatku dochodowego",
    disclaimer: "Uproszczone obliczenie niemieckiego wynagrodzenia wg § 32a EStG 2026. Nie stanowi porady podatkowej.",
    result: "Wynik",
    dateChip: standChip("pl"),
    copyAria: "Kopiuj link do wyniku",
    copyTitle: "Skopiuj link do tego wyniku",
    copied: "Skopiowano!",
    share: "Udostępnij",
    annualNet: "Wynagrodzenie netto rocznie",
    monthlyNet: "Wynagrodzenie netto miesięcznie",
    equals: "Odpowiada",
    perMonthWord: "/ miesiąc",
    netShare: "Udział netto",
    fullAnalysisSub: "Wszystkie 6 klas podatkowych, 2026 vs 2027 i stawka godzinowa netto",
    distribution: "Podział brutto na netto",
    legendNet: "Wynagrodzenie netto",
    legendTax: "Podatek + dopłata solid.",
    legendSv: "Ubezpieczenia społeczne",
    netWord: "Netto",
    detailed: "Szczegółowy podział",
    grossSalary: "Wynagrodzenie brutto",
    totalTaxes: "Podatki łącznie",
    incomeTax: "Podatek dochodowy (Lohnsteuer)",
    soli: "Dodatek solidarnościowy (Soli)",
    churchTax: "Podatek kościelny",
    totalSv: "Składki społeczne łącznie",
    pension: "Ubezpieczenie emerytalne (9,30%)",
    health: "Ubezpieczenie zdrowotne",
    care: "Ubezpieczenie pielęgnacyjne",
    unemployment: "Ubezpieczenie na wypadek bezrobocia (1,30%)",
    marginalRate: "Krańcowa stawka podatku",
    avgRate: "Średnia stawka podatku",
    blTitle: "Jak netto różni się w zależności od landu",
    blSub: "Podatek kościelny (8% vs 9%) i regionalne ubezpieczenie pielęgnacyjne",
    bl8: "8% pod. kośc.",
    bl8States: "Bawaria i Badenia-Wirtembergia",
    bl9: "9% pod. kośc.",
    bl9States: "Pozostałe 14 landów",
    blChurchIn: "Przy podatku kościelnym w roku",
    netLabelShort: "Netto",
    yearCompareTitle: "Porównanie",
    yearCompareVs: "vs.",
    yearCompareSuffix: "(reforma podatkowa i taryfa)",
    diff: "Różnica",
    net: "Netto",
    selectedYear: "Wybrany rok",
    compareYear: "Rok porównawczy",
    taxYearWord: "Rok podatkowy",
    netDiff: "Obliczona różnica netto",
    diffTax: "w tym podatek, soli i podatek kościelny",
    diffSv: "w tym składki socjalne",
    provisional: "wstępnie",
    provisionalTip: "Wartości wstępne 2027: taryfa, kwota wolna, ryczałt pracowniczy i Kindergeld z rządowego projektu EStRefG 2027 (jeszcze nieuchwalonego); składki według wartości 2026 lub projektu BMAS 2027; średnia składka dodatkowa 2,9 %.",
    monthlyAdj: "miesięcznie",
    annualAdj: "rocznie",
    perYearWord: "/ rok",
    perMonthWord2: "/ miesiąc",
    yearWord: "rok",
    monthShort: "mies.",
  },
  ro: {
    inputParams: "Date · Parametri",
    yourGross: "Salariul tău brut",
    perMonth: "/lună",
    perYear: "/an",
    grossPerMonth: "Salariu brut pe lună",
    errInvalid: "Introdu o sumă validă",
    errPositive: "Suma trebuie să fie pozitivă",
    errMax: "Suma maximă: 200.000 €",
    sliderAria: "Glisor salariu brut",
    taxYear: "An fiscal",
    year2027Note: "Pentru 2027 nu există încă o lege promulgată — doar proiectul guvernului din 2.9.2026, cu valori concrete. Alege un scenariu fiscal și, dedesubt, dacă contribuțiile sociale rămân la nivelul oficial din 2026 sau se calculează după proiectul pentru 2027.",
    svLabel: "Contribuții sociale 2027",
    svBeschlossen: "Nivel 2026",
    svEntwurf: "Proiect 2027",
    svBeschlossenHint: `Plafoanele oficiale de contribuții 2026 (sănătate/îngrijire ${B.kv26} €, pensie/șomaj ${B.rv26} € pe lună) — se aplică până la publicarea ordonanței pentru 2027.`,
    svEntwurfHint: `Proiectul Ministerului Muncii din 21.9.2026: plafon sănătate/îngrijire ${B.kv27} €, pensie/șomaj ${B.rv27} € pe lună. Cote ca în 2026. Contează doar peste ${B.kv26} € brut.`,
    scenarioLabel: "Scenariu reformă 2027",
    scenarioOhne: "Fără reformă",
    scenarioStufe1: "Proiect 2027",
    scenarioVoll: "Etapa 2028",
    scenarioOhneHint: "Tariful 2026 rămâne neschimbat — dacă reforma nu trece.",
    scenarioStufe1Hint: `Proiectul de lege EStRefG 2027, articolul 1 (de la 1.1.2027): sumă scutită de bază ${GRUNDFREIBETRAG.entwurf2027.toLocaleString("de-DE")} €, deducere forfetară pentru angajați 1.430 €.`,
    scenarioVollHint: `A doua etapă a aceluiași proiect, articolul 2 (de la 1.1.2028): sumă scutită de bază ${GRUNDFREIBETRAG.stufe2028.toLocaleString("de-DE")} €.`,
    taxClass: "Clasa de impozitare",
    moreOptions: "Mai multe opțiuni",
    childlessLabel: "Fără copii și peste 23 de ani",
    childlessHint: "Asigurare de îngrijire +0,6 %",
    churchLabel: "Plătesc impozit bisericesc",
    churchHint: "9 % din impozitul pe venit",
    disclaimer: "Calcul simplificat al salariului german conform § 32a EStG 2026. Nu constituie consultanță fiscală.",
    result: "Rezultat",
    dateChip: standChip("ro"),
    copyAria: "Copiază linkul rezultatului",
    copyTitle: "Copiază un link către acest rezultat",
    copied: "Copiat!",
    share: "Distribuie",
    annualNet: "Salariu net anual",
    monthlyNet: "Salariu net lunar",
    equals: "Echivalent",
    perMonthWord: "/ lună",
    netShare: "Procent net",
    fullAnalysisSub: "Toate cele 6 clase de impozitare, 2026 vs. 2027 și salariul net pe oră",
    distribution: "Împărțirea brut – net",
    legendNet: "Salariu net",
    legendTax: "Impozit și Soli",
    legendSv: "Asigurări sociale",
    netWord: "Net",
    detailed: "Detaliere completă",
    grossSalary: "Salariu brut",
    totalTaxes: "Impozite total",
    incomeTax: "Impozit pe venit (Lohnsteuer)",
    soli: "Contribuția de solidaritate (Soli)",
    churchTax: "Impozit bisericesc",
    totalSv: "Contribuții sociale total",
    pension: "Asigurare de pensie (9,30 %)",
    health: "Asigurare de sănătate",
    care: "Asigurare de îngrijire",
    unemployment: "Asigurare de șomaj (1,30 %)",
    marginalRate: "Cota marginală",
    avgRate: "Cota medie de impozitare",
    blTitle: "Cum diferă salariul net în funcție de land",
    blSub: "Impozit bisericesc (8 % vs. 9 %) și asigurarea de îngrijire regională",
    bl8: "8 % imp. bisericesc",
    bl8States: "Bavaria și Baden-Württemberg",
    bl9: "9 % imp. bisericesc",
    bl9States: "Celelalte 14 landuri",
    blChurchIn: "Cu impozit bisericesc în",
    netLabelShort: "Net",
    yearCompareTitle: "Comparație",
    yearCompareVs: "vs.",
    yearCompareSuffix: "(reforma fiscală și tariful)",
    diff: "Diferență",
    net: "Net",
    selectedYear: "Anul ales",
    compareYear: "Anul de comparație",
    taxYearWord: "An fiscal",
    netDiff: "Diferența netă calculată",
    diffTax: "din care impozit, soli și impozit bisericesc",
    diffSv: "din care contribuții sociale",
    provisional: "provizoriu",
    provisionalTip: "Valori provizorii 2027: tariful fiscal, suma scutită, deducerea forfetară și alocația pentru copii din proiectul EStRefG 2027 (încă neadoptat); contribuții după valorile 2026 sau proiectul BMAS 2027; contribuția suplimentară medie 2,9 %.",
    monthlyAdj: "lunar",
    annualAdj: "anual",
    perYearWord: "/ an",
    perMonthWord2: "/ lună",
    yearWord: "an",
    monthShort: "lună",
  },
  tr: {
    inputParams: "Giriş · Parametreler",
    yourGross: "Brüt maaşınız",
    perMonth: "/ay",
    perYear: "/yıl",
    grossPerMonth: "Aylık brüt maaş",
    errInvalid: "Lütfen geçerli bir tutar girin",
    errPositive: "Tutar pozitif olmalıdır",
    errMax: "Azami tutar: 200.000 €",
    sliderAria: "Brüt maaş kaydırıcısı",
    taxYear: "Vergi yılı",
    year2027Note: "2027 için henüz yürürlüğe girmiş bir yasa yok — ancak hükümetin 2.9.2026'da kabul ettiği, somut değerler içeren bir tasarı var. Bir vergi senaryosu seçin; altında da sosyal sigorta kesintilerinin 2026 resmî değerlerinde mi kalacağını yoksa 2027 taslağıyla mı hesaplanacağını belirleyin.",
    svLabel: "Sosyal sigorta 2027",
    svBeschlossen: "2026 değerleri",
    svEntwurf: "2027 taslağı",
    svBeschlossenHint: `2026 resmî prim tavanları (sağlık/bakım aylık ${B.kv26} €, emeklilik/işsizlik ${B.rv26} €) — 2027 yönetmeliği yayımlanana kadar geçerlidir.`,
    svEntwurfHint: `Çalışma Bakanlığı'nın 21.9.2026 tarihli taslağı: prim tavanı sağlık/bakım aylık ${B.kv27} €, emeklilik/işsizlik ${B.rv27} €. Oranlar 2026 ile aynı. Yalnızca ${B.kv26} € brütün üzerinde fark eder.`,
    scenarioLabel: "2027 reform senaryosu",
    scenarioOhne: "Reformsuz",
    scenarioStufe1: "Tasarı 2027",
    scenarioVoll: "2028 aşaması",
    scenarioOhneHint: "2026 tarifesi aynen devam eder — reform geçmezse.",
    scenarioStufe1Hint: `EStRefG 2027 tasarısı, madde 1 (1.1.2027'den itibaren): temel muafiyet ${GRUNDFREIBETRAG.entwurf2027.toLocaleString("de-DE")} €, çalışan götürü gider indirimi 1.430 €.`,
    scenarioVollHint: `Aynı tasarının ikinci aşaması, madde 2 (1.1.2028'den itibaren): temel muafiyet ${GRUNDFREIBETRAG.stufe2028.toLocaleString("de-DE")} €.`,
    taxClass: "Vergi sınıfı (Steuerklasse)",
    moreOptions: "Diğer seçenekler",
    childlessLabel: "Çocuksuz ve 23 yaş üstü",
    childlessHint: "Bakım sigortası +%0,6",
    churchLabel: "Kilise vergisi ödüyorum",
    churchHint: "Gelir vergisinin %9'u",
    disclaimer: "§ 32a EStG 2026'ya göre basitleştirilmiş Alman maaş hesabı. Vergi danışmanlığı yerine geçmez.",
    result: "Sonuç",
    dateChip: standChip("tr"),
    copyAria: "Sonuç bağlantısını kopyala",
    copyTitle: "Bu sonucun bağlantısını kopyala",
    copied: "Kopyalandı!",
    share: "Paylaş",
    annualNet: "Yıllık net maaş",
    monthlyNet: "Aylık net maaş",
    equals: "Karşılığı",
    perMonthWord: "/ ay",
    netShare: "Net oranı",
    fullAnalysisSub: "6 vergi sınıfı, 2026–2027 karşılaştırması ve saatlik net ücret",
    distribution: "Brütten nete dağılım",
    legendNet: "Net maaş",
    legendTax: "Gelir vergisi ve Soli",
    legendSv: "Sosyal sigorta",
    netWord: "Net",
    detailed: "Ayrıntılı döküm",
    grossSalary: "Brüt maaş",
    totalTaxes: "Toplam vergiler",
    incomeTax: "Gelir vergisi (Lohnsteuer)",
    soli: "Dayanışma vergisi (Soli)",
    churchTax: "Kilise vergisi",
    totalSv: "Toplam sosyal sigorta",
    pension: "Emeklilik sigortası (%9,30)",
    health: "Sağlık sigortası",
    care: "Bakım sigortası",
    unemployment: "İşsizlik sigortası (%1,30)",
    marginalRate: "Marjinal vergi oranı",
    avgRate: "Ortalama vergi oranı",
    blTitle: "Net maaşınız eyalete göre nasıl değişir",
    blSub: "Kilise vergisi (%8 / %9) ve bölgesel bakım sigortası",
    bl8: "%8 kilise vergisi",
    bl8States: "Bavyera ve Baden-Württemberg",
    bl9: "%9 kilise vergisi",
    bl9States: "Diğer 14 eyalet",
    blChurchIn: "Kilise vergisiyle,",
    netLabelShort: "Net",
    yearCompareTitle: "Karşılaştırma",
    yearCompareVs: "–",
    yearCompareSuffix: "(vergi reformu ve tarife)",
    diff: "Fark",
    net: "Net",
    selectedYear: "Seçilen yıl",
    compareYear: "Karşılaştırma yılı",
    taxYearWord: "Vergi yılı",
    netDiff: "Hesaplanan net fark",
    diffTax: "bunun vergi, soli ve kilise vergisi kısmı",
    diffSv: "bunun sosyal sigorta kısmı",
    provisional: "geçici",
    provisionalTip: "2027 geçici değerleri: vergi tarifesi, temel muafiyet, götürü gider ve çocuk parası EStRefG 2027 hükümet tasarısından (henüz kabul edilmedi); sosyal sigorta 2026 değerleri veya BMAS 2027 taslağı; ortalama ek prim %2,9.",
    monthlyAdj: "aylık",
    annualAdj: "yıllık",
    perYearWord: "/ yıl",
    perMonthWord2: "/ ay",
    yearWord: "yıl",
    monthShort: "ay",
  },
  uk: {
    inputParams: "Дані · Параметри",
    yourGross: "Ваша зарплата брутто",
    perMonth: "/міс.",
    perYear: "/рік",
    grossPerMonth: "Зарплата брутто на місяць",
    errInvalid: "Введіть коректну суму",
    errPositive: "Сума має бути додатною",
    errMax: "Максимальна сума: 200 000 €",
    sliderAria: "Повзунок зарплати брутто",
    taxYear: "Податковий рік",
    year2027Note: "Закону на 2027 рік ще немає — лише схвалений урядом 2.9.2026 законопроєкт із конкретними значеннями тарифу. Оберіть податковий сценарій, а нижче — чи залишити соціальні внески на офіційному рівні 2026 року, чи рахувати за проєктом 2027.",
    svLabel: "Соціальні внески 2027",
    svBeschlossen: "Рівень 2026",
    svEntwurf: "Проєкт 2027",
    svBeschlossenHint: `Офіційні граничні суми внесків 2026 (медичне/догляд ${B.kv26} €, пенсійне/безробіття ${B.rv26} € на місяць) — діють, доки не опубліковано постанову на 2027 рік.`,
    svEntwurfHint: `Проєкт Міністерства праці від 21.9.2026: граничні суми медичне/догляд ${B.kv27} €, пенсійне/безробіття ${B.rv27} € на місяць. Ставки як у 2026. Має значення лише понад ${B.kv26} € брутто.`,
    scenarioLabel: "Сценарій реформи 2027",
    scenarioOhne: "Без реформи",
    scenarioStufe1: "Проєкт 2027",
    scenarioVoll: "Етап 2028",
    scenarioOhneHint: "Тариф 2026 без змін — якщо реформа не пройде.",
    scenarioStufe1Hint: `Законопроєкт EStRefG 2027, стаття 1 (з 1.1.2027): базова неоподатковувана сума ${GRUNDFREIBETRAG.entwurf2027.toLocaleString("de-DE")} €, паушальна сума для працівників 1.430 €.`,
    scenarioVollHint: `Другий етап того ж проєкту, стаття 2 (з 1.1.2028): базова неоподатковувана сума ${GRUNDFREIBETRAG.stufe2028.toLocaleString("de-DE")} €.`,
    taxClass: "Податковий клас (Steuerklasse)",
    moreOptions: "Інші параметри",
    childlessLabel: "Без дітей і старше 23 років",
    childlessHint: "Страхування догляду +0,6 %",
    churchLabel: "Сплачую церковний податок",
    churchHint: "9 % від податку на доходи",
    disclaimer: "Спрощений розрахунок німецької зарплати за § 32a EStG 2026. Не є податковою консультацією.",
    result: "Результат",
    dateChip: standChip("uk"),
    copyAria: "Копіювати посилання на результат",
    copyTitle: "Скопіювати посилання на цей результат",
    copied: "Скопійовано!",
    share: "Поділитися",
    annualNet: "Чиста зарплата за рік",
    monthlyNet: "Чиста зарплата на місяць",
    equals: "Відповідає",
    perMonthWord: "/ місяць",
    netShare: "Частка нетто",
    fullAnalysisSub: "Усі 6 податкових класів, 2026 і 2027, погодинна оплата нетто",
    distribution: "Розподіл брутто – нетто",
    legendNet: "Зарплата нетто",
    legendTax: "Податок і Soli",
    legendSv: "Соціальне страхування",
    netWord: "Нетто",
    detailed: "Детальний розрахунок",
    grossSalary: "Зарплата брутто",
    totalTaxes: "Податки разом",
    incomeTax: "Податок на доходи (Lohnsteuer)",
    soli: "Збір солідарності (Soli)",
    churchTax: "Церковний податок",
    totalSv: "Соціальні внески разом",
    pension: "Пенсійне страхування (9,30 %)",
    health: "Медичне страхування",
    care: "Страхування догляду",
    unemployment: "Страхування на випадок безробіття (1,30 %)",
    marginalRate: "Гранична ставка податку",
    avgRate: "Середня ставка податку",
    blTitle: "Як нетто залежить від федеральної землі",
    blSub: "Церковний податок (8 % чи 9 %) і регіональне страхування догляду",
    bl8: "8 % церк. податок",
    bl8States: "Баварія та Баден-Вюртемберг",
    bl9: "9 % церк. податок",
    bl9States: "Інші 14 земель",
    blChurchIn: "З церковним податком у",
    netLabelShort: "Нетто",
    yearCompareTitle: "Порівняння",
    yearCompareVs: "і",
    yearCompareSuffix: "(податкова реформа й тариф)",
    diff: "Різниця",
    net: "Нетто",
    selectedYear: "Обраний рік",
    compareYear: "Рік для порівняння",
    taxYearWord: "Податковий рік",
    netDiff: "Розрахована різниця нетто",
    diffTax: "з них податки, солідарний збір і церковний податок",
    diffSv: "з них соціальні внески",
    provisional: "попередньо",
    provisionalTip: "Попередні значення 2027: тариф, неоподатковуваний мінімум, паушальна сума та Kindergeld з урядового законопроєкту EStRefG 2027 (ще не ухвалено); внески за значеннями 2026 або проєктом BMAS 2027; середній додатковий внесок 2,9 %.",
    monthlyAdj: "щомісяця",
    annualAdj: "щороку",
    perYearWord: "/ рік",
    perMonthWord2: "/ місяць",
    yearWord: "рік",
    monthShort: "міс.",
  },
};

/* ─── Animated number hook ─────────────────────────────────────────── */
function useAnimatedValue(target: number, duration = 380) {
  const [display, setDisplay] = useState(target);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const startVal = display;
    const startTime = performance.now();

    if (raf.current) cancelAnimationFrame(raf.current);

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(startVal + (target - startVal) * eased);
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return display;
}

/* ─── SVG Donut chart (LARGE PROPER SIZE) ──────────────────────────── */
function DonutChart({ steuer, sv, netto, total }: {
  steuer: number; sv: number; netto: number; total: number;
}) {
  const R    = 58;
  const circ = 2 * Math.PI * R;
  const pct  = (v: number) => (total > 0 ? v / total : 0);

  const nettoArc  = pct(netto)  * circ;
  const steuerArc = pct(steuer) * circ;
  const svArc     = pct(sv)     * circ;

  const svOff     = nettoArc + steuerArc;
  const steuerOff = nettoArc;

  const arc = (len: number, off: number, color: string) => (
    <circle
      r={R} cx={70} cy={70}
      fill="none"
      stroke={color}
      strokeWidth={12}
      strokeDasharray={`${len} ${circ - len}`}
      strokeDashoffset={-off + circ * 0.25}
      strokeLinecap="butt"
      style={{ transition: "stroke-dasharray 0.5s cubic-bezier(0.4,0,0.2,1)" }}
    />
  );

  return (
    <svg viewBox="0 0 140 140" className="w-[130px] h-[130px] sm:w-[140px] sm:h-[140px] -rotate-90 flex-shrink-0" aria-hidden="true">
      <circle r={R} cx={70} cy={70} fill="none" stroke="rgba(16,24,40,0.08)" strokeWidth={12} />
      {arc(svArc,     svOff,     "#6B7280")}
      {arc(steuerArc, steuerOff, "#E60A1C")}
      {arc(nettoArc,  0,         "#0E9F6E")}
    </svg>
  );
}

/* ─── Breakdown progress bar ───────────────────────────────────────── */
function BreakdownBar({ steuer, sv, netto, total }: {
  steuer: number; sv: number; netto: number; total: number;
}) {
  const pct = (v: number) => `${total > 0 ? ((v / total) * 100).toFixed(1) : 0}%`;
  return (
    <div className="flex h-3.5 rounded-full overflow-hidden w-full gap-1 p-0.5 bg-black/[0.04] border border-black/[0.08]" role="img" aria-label="Gehaltsverteilung">
      <div className="progress-bar-fill rounded-l-full shadow-sm" style={{ width: pct(netto),  background: "#0E9F6E" }} />
      <div className="progress-bar-fill shadow-sm"                style={{ width: pct(steuer), background: "#E60A1C" }} />
      <div className="progress-bar-fill rounded-r-full shadow-sm" style={{ width: pct(sv),     background: "#6B7280" }} />
    </div>
  );
}

/* ─── Main Calculator ──────────────────────────────────────────────── */
interface CalculatorProps {
  initialBrutto?: number;
  initialJahr?: Steuerjahr;
  initialSk?: Steuerklasse;
  /** Show the "full analysis" deep-link CTA under the result. Off on the /rechner/[betrag] pages to avoid a self-link. */
  deepLink?: boolean;
  /** UI language. Defaults to German; pass "en" on the English landing page. */
  lang?: Lang;
  /**
   * Overrides the byline's "zuletzt aktualisiert" date with the page's own date
   * (lib/pageDates.ts). `null` hides the date — for pages that already show
   * their single "Aktualisiert am" line elsewhere.
   */
  standDisplay?: string | null;
  /** Bundesland-Seiten: Kirchensteuersatz des Landes (8 % BY/BW, sonst 9 %). */
  kirchensteuerSatz?: number;
  /** Bundesland-Seite Sachsen: höherer PV-Arbeitnehmeranteil. */
  sachsen?: boolean;
  /**
   * Startseite: Netto 2026 und Netto 2027 (Entwurf) immer nebeneinander zeigen,
   * mit der Differenz pro Monat und Jahr — ohne dass der Nutzer das Steuerjahr
   * umschalten muss. Ersetzt dann das aufklappbare Jahresvergleich-Akkordeon.
   */
  jahresvergleich?: boolean;
}

export default function Calculator({ initialBrutto = 3800, initialJahr = 2026, initialSk = 1, deepLink = true, lang = "de", standDisplay, kirchensteuerSatz = 0.09, sachsen = false, jahresvergleich = false }: CalculatorProps = {}) {
  const t = T[lang];
  const skInfo = STEUERKLASSE_INFO[lang];
  const [bruttoMonat,  setBruttoMonat]  = useState<number>(initialBrutto);
  const [inputStr,     setInputStr]     = useState<string>(String(initialBrutto));
  const [inputError,   setInputError]   = useState<string>("");
  const [jahr,         setJahr]         = useState<Steuerjahr>(initialJahr);
  const [steuerklasse, setSteuerklasse] = useState<Steuerklasse>(initialSk);
  const [kinderlosUeber23, setKinderlosUeber23] = useState(true);
  const [kirche,       setKirche]       = useState(false);
  const [isJahresansicht, setIsJahresansicht]   = useState(false);
  const [copied,       setCopied]       = useState(false);
  const [showBundesland, setShowBundesland] = useState(false);
  const [showYearCompare, setShowYearCompare] = useState(false);
  const [szenario,     setSzenario]     = useState<Szenario>("entwurf2027");
  const [sv2027,       setSv2027]       = useState<Sv2027>("beschlossen");

  const verheiratet = steuerklasse === 3 || steuerklasse === 4 || steuerklasse === 5;

  /* Sync URL params on mount */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const b = parseFloat(p.get("brutto") ?? "");
    const j = parseInt(p.get("jahr")    ?? "");
    const s = parseInt(p.get("sk")      ?? "");
    if (!isNaN(b) && b > 0 && b <= 200000) { setBruttoMonat(b); setInputStr(String(b)); }
    if (j === 2026 || j === 2027)           setJahr(j as Steuerjahr);
    if (s >= 1 && s <= 6)                   setSteuerklasse(s as Steuerklasse);
    if (p.get("sv") === "entwurf")          setSv2027("entwurf");
  }, []);

  /* Input validation */
  const handleBruttoChange = useCallback((raw: string) => {
    setInputStr(raw);
    const val = parseFloat(raw.replace(",", "."));
    if (raw === "" || isNaN(val)) {
      setInputError(t.errInvalid);
      setBruttoMonat(0);
    } else if (val < 0) {
      setInputError(t.errPositive);
      setBruttoMonat(0);
    } else if (val > 200000) {
      setInputError(t.errMax);
      setBruttoMonat(200000);
    } else {
      setInputError("");
      setBruttoMonat(val);
    }
  }, [t]);

  const sliderPct = Math.min((bruttoMonat || 0) / 20000, 1) * 100;

  const result = useMemo(
    () => calculateNetto({
      bruttoMonat: Math.max(0, bruttoMonat || 0),
      jahr,
      verheiratet,
      kinderlosUeber23,
      kirche,
      kirchensteuerSatz,
      sachsen,
      steuerklasse,
      szenario,
      sv2027,
    }),
    [bruttoMonat, jahr, verheiratet, kinderlosUeber23, kirche, kirchensteuerSatz, sachsen, steuerklasse, szenario, sv2027]
  );

  const resBW_BY = useMemo(() => calculateNetto({
    bruttoMonat: Math.max(0, bruttoMonat || 0),
    jahr,
    verheiratet,
    kinderlosUeber23,
    kirche: true,
    kirchensteuerSatz: 0.08,
    steuerklasse,
    szenario,
    sv2027,
  }), [bruttoMonat, jahr, verheiratet, kinderlosUeber23, steuerklasse, szenario, sv2027]);

  const resOtherStates = useMemo(() => calculateNetto({
    bruttoMonat: Math.max(0, bruttoMonat || 0),
    jahr,
    verheiratet,
    kinderlosUeber23,
    kirche: true,
    kirchensteuerSatz: 0.09,
    steuerklasse,
    szenario,
    sv2027,
  }), [bruttoMonat, jahr, verheiratet, kinderlosUeber23, steuerklasse, szenario, sv2027]);

  const otherYear = jahr === 2026 ? 2027 : 2026;
  const resOtherYear = useMemo(() => calculateNetto({
    bruttoMonat: Math.max(0, bruttoMonat || 0),
    jahr: otherYear,
    verheiratet,
    kinderlosUeber23,
    kirche,
    kirchensteuerSatz,
    sachsen,
    steuerklasse,
    szenario,
    sv2027,
  }), [bruttoMonat, otherYear, verheiratet, kinderlosUeber23, kirche, kirchensteuerSatz, sachsen, steuerklasse, szenario, sv2027]);

  const diffYear = result.nettoMonat - resOtherYear.nettoMonat;

  /*
   * Fester Jahresvergleich (nur mit `jahresvergleich`): immer 2026 gegen den
   * Regierungsentwurf 2027 ("entwurf2027"), unabhängig davon, welches Jahr und
   * welches Szenario oben gewählt ist. Sozialabgaben 2027 folgen dem Schalter
   * "Sozialabgaben 2027" (Voreinstellung: Werte 2026) — dieselbe Rechnung, die
   * der Rechner bei Steuerjahr 2027 zeigt.
   */
  const vergleich = useMemo(() => {
    if (!jahresvergleich) return null;
    const basis = {
      bruttoMonat: Math.max(0, bruttoMonat || 0),
      verheiratet,
      kinderlosUeber23,
      kirche,
      kirchensteuerSatz,
      sachsen,
      steuerklasse,
    };
    const n2026 = calculateNetto({ ...basis, jahr: 2026 });
    const n2027 = calculateNetto({ ...basis, jahr: 2027, szenario: "entwurf2027", sv2027 });
    return { n2026, n2027, diffMonat: n2027.nettoMonat - n2026.nettoMonat, diffJahr: n2027.nettoJahr - n2026.nettoJahr };
  }, [jahresvergleich, bruttoMonat, verheiratet, kinderlosUeber23, kirche, kirchensteuerSatz, sachsen, steuerklasse, sv2027]);

  const animatedNetto = useAnimatedValue(
    isJahresansicht ? result.nettoJahr : result.nettoMonat
  );

  /* Share / copy link */
  const handleCopy = useCallback(async () => {
    const url = new URL(window.location.href.split("?")[0]);
    url.searchParams.set("brutto", bruttoMonat.toFixed(0));
    url.searchParams.set("jahr",   String(jahr));
    url.searchParams.set("sk",     String(steuerklasse));
    if (jahr === 2027 && sv2027 === "entwurf") url.searchParams.set("sv", "entwurf");
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* ignore */ }
  }, [bruttoMonat, jahr, steuerklasse, sv2027]);

  const showVal = (monthly: number) => isJahresansicht ? monthly * 12 : monthly;

  // KV- und PV-Satz sind nicht fix: die KV hängt am Zusatzbeitrag der gewählten
  // Kasse, die PV an Kinderlosigkeit und Sachsen. Der Satz wird daher aus dem
  // Ergebnis gelesen und lokalisiert formatiert, statt im Label festzustehen.
  const formatPct = (value: number) =>
    new Intl.NumberFormat(NUM_LOCALE[lang], {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + " %";
  const sm = result.sv.summeMonat;
  const tm = result.steuer.summeMonat;
  const nm = result.nettoMonat;
  const bm = result.bruttoMonat;

  return (
    // Mobil steht die Prüf-Byline unter der Rechenkarte statt darüber: Sie bricht
    // bei 375 px auf zwei Zeilen um und schob das Eingabefeld unter den Falz.
    // Ab sm bleibt sie wie gehabt über dem Rechner.
    <div className="w-full flex flex-col">
      <div className="order-last sm:order-first flex justify-center mt-4 sm:mt-0 sm:mb-6">
        <ReviewerByline lang={lang} updatedDisplay={standDisplay} />
      </div>
      <div className="rounded-3xl overflow-hidden border border-black/[0.12] bg-[#FFFFFF] shadow-sm w-full max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] w-full max-w-full min-w-0">

        {/* ═══ LEFT — Inputs ════════════════════════════════════════ */}
        <div className="p-4 sm:p-10 bg-[#FFFFFF] border-b lg:border-b-0 lg:border-r border-black/[0.10] flex flex-col justify-between w-full max-w-full min-w-0">

          <div className="w-full max-w-full min-w-0">
            {/* Header */}
            <div className="flex flex-row items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
              <div>
                <p className="hidden sm:block font-mono text-xs uppercase tracking-widest text-black/50 mb-1 font-bold">{t.inputParams}</p>
                <h2 className="font-display text-lg sm:text-2xl font-extrabold text-[#16181D]">{t.yourGross}</h2>
              </div>
              {/* Monthly / Annual toggle */}
              <div className="flex items-center gap-1 bg-black/[0.04] border border-black/[0.10] rounded-2xl p-1 sm:p-1.5 text-sm font-semibold flex-shrink-0">
                {[{ label: t.perMonth, val: false }, { label: t.perYear, val: true }].map(({ label, val }) => (
                  <button
                    key={label}
                    id={`ansicht-${val ? "jahr" : "monat"}`}
                    onClick={() => setIsJahresansicht(val)}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl transition-all ${
                      isJahresansicht === val ? "bg-[#E60A1C] text-white  font-bold" : "text-black/60 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Brutto input ────────────────────────────────────── */}
            <div className="mb-6 sm:mb-8 w-full max-w-full">
              <label htmlFor="brutto-input" className="text-base font-bold text-[#16181D] block mb-3">
                {t.grossPerMonth}
              </label>
              <div className="relative w-full max-w-full">
                <input
                  id="brutto-input"
                  type="number"
                  inputMode="decimal"
                  value={inputStr}
                  onChange={(e) => handleBruttoChange(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className={`w-full max-w-full font-mono text-xl sm:text-2xl font-bold rounded-2xl border px-4 sm:px-6 py-3.5 sm:py-4.5 pr-14 sm:pr-20 transition-all outline-none ${
                    inputError
                      ? "border-red-500 bg-red-50 text-red-800 focus:border-red-500"
                      : "border-black/[0.12] bg-[#F1F3F5] text-[#16181D] focus:border-[#E60A1C] focus:bg-[#F1F3F5]"
                  }`}
                  min={0} max={200000} step={50}
                  aria-describedby={inputError ? "brutto-error" : undefined}
                  aria-invalid={!!inputError}
                />
                <span className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-black/50 font-mono text-sm sm:text-base font-bold">EUR</span>
              </div>
              {inputError && (
                <p id="brutto-error" role="alert" className="flex items-center gap-2 text-sm text-red-600 mt-2 font-medium">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {inputError}
                </p>
              )}

              {/* Salary slider */}
              <div className="mt-4 w-full max-w-full">
                <input
                  type="range"
                  id="brutto-slider"
                  aria-label={t.sliderAria}
                  min={500} max={20000} step={50}
                  value={Math.min(Math.max(bruttoMonat || 500, 500), 20000)}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setBruttoMonat(v);
                    setInputStr(String(v));
                    setInputError("");
                  }}
                  style={{ "--range-pct": `${sliderPct}%` } as React.CSSProperties}
                  className="w-full max-w-full block"
                />
                <div className="flex justify-between text-xs text-black/50 font-mono font-medium mt-1">
                  <span>500 €</span><span>20.000 €</span>
                </div>
              </div>
            </div>

            {/* ── Steuerjahr ────────────────────────────────────── */}
            <div className="mb-6 sm:mb-8 w-full max-w-full">
              <span className="text-base font-bold text-[#16181D] block mb-3">{t.taxYear}</span>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full">
                {([2026, 2027] as Steuerjahr[]).map((j) => (
                  <button
                    key={j}
                    id={`jahr-${j}`}
                    onClick={() => setJahr(j)}
                    className={`w-full py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base font-bold border transition-all ${
                      jahr === j
                        ? "text-white border-transparent "
                        : "border-black/[0.12] text-black/60 hover:border-black/[0.20] hover:bg-black/[0.04] hover:text-[#16181D]"
                    }`}
                    style={jahr === j ? { background: "linear-gradient(135deg,#E60A1C,#FF2436)" } : undefined}
                  >
                    {j}
                  </button>
                ))}
              </div>
              {jahr === 2027 && (
                <>
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-amber-700 mt-3 bg-amber-50 rounded-2xl p-3.5 sm:p-4 border border-amber-500/30 font-medium">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-amber-600" />
                    <span>{t.year2027Note}</span>
                  </div>

                  <div className="mt-4">
                    <span className="text-base font-bold text-[#16181D] block mb-3">{t.scenarioLabel}</span>
                    <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full">
                      {([
                        { key: "ohneReform" as Szenario, label: t.scenarioOhne,   hint: t.scenarioOhneHint },
                        { key: "entwurf2027" as Szenario, label: t.scenarioStufe1, hint: t.scenarioStufe1Hint },
                        { key: "stufe2028"   as Szenario, label: t.scenarioVoll,   hint: t.scenarioVollHint },
                      ]).map((s) => (
                        <button
                          key={s.key}
                          id={`szenario-${s.key}`}
                          onClick={() => setSzenario(s.key)}
                          title={s.hint}
                          aria-pressed={szenario === s.key}
                          className={`w-full py-2.5 sm:py-3 px-1 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                            szenario === s.key
                              ? "text-white border-transparent"
                              : "border-black/[0.12] text-black/60 hover:border-black/[0.20] hover:bg-black/[0.04] hover:text-[#16181D]"
                          }`}
                          style={szenario === s.key ? { background: "linear-gradient(135deg,#E60A1C,#FF2436)" } : undefined}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-black/55 mt-2.5 leading-relaxed">
                      {szenario === "ohneReform" ? t.scenarioOhneHint : szenario === "stufe2028" ? t.scenarioVollHint : t.scenarioStufe1Hint}
                    </p>
                  </div>

                  <div className="mt-4">
                    <span className="text-base font-bold text-[#16181D] block mb-3">{t.svLabel}</span>
                    <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full">
                      {([
                        { key: "beschlossen" as Sv2027, label: t.svBeschlossen },
                        { key: "entwurf" as Sv2027, label: t.svEntwurf },
                      ]).map((o) => (
                        <button
                          key={o.key}
                          id={`sv2027-${o.key}`}
                          onClick={() => setSv2027(o.key)}
                          aria-pressed={sv2027 === o.key}
                          className={`w-full py-2.5 sm:py-3 px-1 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                            sv2027 === o.key
                              ? "text-white border-transparent"
                              : "border-black/[0.12] text-black/60 hover:border-black/[0.20] hover:bg-black/[0.04] hover:text-[#16181D]"
                          }`}
                          style={sv2027 === o.key ? { background: "linear-gradient(135deg,#E60A1C,#FF2436)" } : undefined}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-black/55 mt-2.5 leading-relaxed">
                      {sv2027 === "entwurf" ? t.svEntwurfHint : t.svBeschlossenHint}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* ── Steuerklasse ──────────────────────────────────── */}
            <div className="mb-6 sm:mb-8 w-full max-w-full min-w-0">
              <span className="text-base font-bold text-[#16181D] block mb-3">{t.taxClass}</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5 w-full max-w-full min-w-0">
                {([1, 2, 3, 4, 5, 6] as Steuerklasse[]).map((sk) => (
                  <button
                    key={sk}
                    id={`sk-${sk}`}
                    onClick={() => setSteuerklasse(sk)}
                    title={skInfo[sk]}
                    aria-pressed={steuerklasse === sk}
                    className={`sk-tab py-3 sm:py-3.5 rounded-2xl text-base sm:text-lg font-extrabold border transition-all w-full min-w-0 ${
                      steuerklasse === sk
                        ? "text-white border-transparent "
                        : "border-black/[0.12] text-black/60 hover:border-black/[0.20] hover:bg-black/[0.04] hover:text-[#16181D]"
                    }`}
                    style={steuerklasse === sk ? { background: "linear-gradient(135deg,#E60A1C,#FF2436)" } : undefined}
                  >
                    {sk}
                  </button>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-black/70 mt-2.5 flex items-center gap-2 font-medium">
                <ChevronRight size={16} className="text-[#E60A1C] flex-shrink-0" />
                <span className="truncate">{skInfo[steuerklasse]}</span>
              </p>
            </div>

            {/* ── Toggles ───────────────────────────────────────── */}
            <div className="space-y-4 pt-6 border-t border-black/[0.10] mb-8">
              <p className="text-xs font-bold text-[#E60A1C] uppercase tracking-widest mb-4">{t.moreOptions}</p>
              <Toggle
                id="toggle-pflegeversicherung"
                checked={kinderlosUeber23}
                onChange={setKinderlosUeber23}
                label={t.childlessLabel}
                hint={t.childlessHint}
              />
              <Toggle
                id="toggle-kirchensteuer"
                checked={kirche}
                onChange={setKirche}
                label={t.churchLabel}
                hint={kirchensteuerSatz === 0.09 ? t.churchHint : t.churchHint.replace("9", String(Math.round(kirchensteuerSatz * 100)))}
              />
            </div>

          </div>

          {/* Disclaimer */}
          <div className="flex gap-3 text-sm text-black/70 bg-[#F1F3F5] rounded-2xl p-4 border border-black/[0.10] leading-relaxed font-medium">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-[#E60A1C]" />
            <span>{t.disclaimer}</span>
          </div>
        </div>

        {/* ═══ RIGHT — Results (LUXURY FINTECH DASHBOARD) ════════════ */}
        <div className="p-4 sm:p-10 bg-[#F4F5F7] text-[#16181D] flex flex-col justify-between w-full max-w-full min-w-0">

          <div className="w-full max-w-full min-w-0">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
              <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest px-3 sm:px-4 py-1.5 sm:py-2 bg-[#E60A1C]/15 border border-[#E60A1C]/30 text-[#E60A1C] rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#E60A1C] animate-pulse flex-shrink-0" />
                {t.result.toUpperCase()} · {jahr}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl border border-black/[0.10] text-black/60 bg-black/[0.04]">
                  {t.dateChip}
                </span>
                <button
                  id="copy-link-btn"
                  onClick={handleCopy}
                  aria-label={t.copyAria}
                  title={t.copyTitle}
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold px-3 sm:px-3.5 py-1.5 rounded-xl border border-black/[0.10] text-black/80 bg-black/[0.04] hover:text-[#16181D] hover:bg-black/[0.06] hover:border-black/[0.18] transition-all"
                >
                  {copied
                    ? <><Check size={14} className="text-[#E60A1C]" /><span>{t.copied}</span></>
                    : <><Share2 size={14} /><span>{t.share}</span></>
                  }
                </button>
              </div>
            </div>

            {/* ── Main Netto Hero Card ───────────────────────────── */}
            <div className="bg-gradient-to-br from-[#F1F3F5] via-[#FFFFFF] to-[#FFFFFF] border border-black/[0.12] rounded-3xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#E60A1C]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#E60A1C]/25 transition-all duration-500" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="w-full">
                  <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-black/70 font-semibold mb-2">
                    <Sparkles size={14} className="text-[#E60A1C] flex-shrink-0" />
                    <span>{isJahresansicht ? t.annualNet : t.monthlyNet}</span>
                    {jahr === 2027 && (
                      <span
                        title={t.provisionalTip}
                        aria-label={`${t.provisional}: ${t.provisionalTip}`}
                        className="ml-1 inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-500/40 text-amber-800 px-2 py-0.5 normal-case tracking-normal font-bold cursor-help"
                      >
                        <Info size={12} aria-hidden="true" />
                        {t.provisional}
                      </span>
                    )}
                  </div>
                  <p className="font-display font-black tabular-nums leading-none tracking-tight text-[#16181D] text-3xl sm:text-5xl lg:text-6xl number-animate break-all sm:break-normal">
                    {formatEUR(animatedNetto)}
                  </p>
                  {isJahresansicht && (
                    <p className="text-xs sm:text-sm text-black/60 mt-3 font-medium flex items-center gap-1.5">
                      {t.equals} <strong className="text-[#16181D] font-bold">{formatEUR(result.nettoMonat)}</strong> {t.perMonthWord}
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-black/[0.08]">
                  <span className="text-xs sm:text-sm font-medium text-black/60">{t.netShare}</span>
                  <span className="text-2xl sm:text-4xl font-extrabold font-display text-[#16181D] mt-0.5">
                    {bm > 0 ? Math.round((nm / bm) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* ── Fester Jahresvergleich 2026 ↔ 2027 (Startseite) ──────────
                Immer sichtbar, ohne Umschalten: die Suche „brutto netto rechner
                2027“ will das 2027er Netto sofort sehen, und zwar neben 2026. */}
            {vergleich && (
              <div className="bg-[#FFFFFF] border border-black/[0.12] rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm" data-testid="jahresvergleich">
                <table className="w-full text-left border-collapse text-sm sm:text-base">
                  <caption className="text-left text-[11px] sm:text-xs font-mono uppercase tracking-widest text-black/60 font-bold pb-3">
                    Ihr Netto 2026 und 2027 im Vergleich
                  </caption>
                  <thead>
                    <tr className="border-b border-black/[0.10] text-xs text-black/60">
                      <th scope="col" className="py-2 pr-2 font-semibold"><span className="sr-only">Zeitraum</span></th>
                      <th scope="col" className="py-2 px-2 text-right font-semibold">Netto 2026</th>
                      <th scope="col" className="py-2 pl-2 text-right font-semibold">Netto 2027 <span className="font-normal">(Entwurf)</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.06] tabular-nums">
                    <tr>
                      <th scope="row" className="py-2 pr-2 font-medium text-black/70">pro Monat</th>
                      <td className="py-2 px-2 text-right font-mono font-bold text-[#16181D] whitespace-nowrap">{formatEUR(vergleich.n2026.nettoMonat)}</td>
                      <td className="py-2 pl-2 text-right font-mono font-bold text-[#16181D] whitespace-nowrap">{formatEUR(vergleich.n2027.nettoMonat)}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-2 pr-2 font-medium text-black/70">pro Jahr</th>
                      <td className="py-2 px-2 text-right font-mono text-black/80 whitespace-nowrap">{formatEUR(vergleich.n2026.nettoJahr)}</td>
                      <td className="py-2 pl-2 text-right font-mono text-black/80 whitespace-nowrap">{formatEUR(vergleich.n2027.nettoJahr)}</td>
                    </tr>
                    <tr className="bg-[#F4F5F7]">
                      <th scope="row" className="py-2 pl-2 pr-2 font-bold text-[#16181D] rounded-l-lg">Unterschied</th>
                      <td colSpan={2} className={`py-2 pl-2 pr-2 text-right font-mono font-bold whitespace-nowrap rounded-r-lg ${vergleich.diffMonat >= 0.005 ? "text-emerald-700" : vergleich.diffMonat <= -0.005 ? "text-[#E60A1C]" : "text-black/60"}`}>
                        {vergleich.diffMonat >= 0.005 ? "+" : vergleich.diffMonat <= -0.005 ? "−" : "±"}{formatEUR(Math.abs(vergleich.diffMonat))} / Monat
                        <span className="text-black/30 font-normal"> · </span>
                        {vergleich.diffJahr >= 0.005 ? "+" : vergleich.diffJahr <= -0.005 ? "−" : "±"}{formatEUR(Math.abs(vergleich.diffJahr))} / Jahr
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-3 text-[11px] sm:text-xs text-black/55 leading-relaxed">
                  2027 vorläufig: Lohnsteuer nach Regierungsentwurf (BT-Drs. 21/8235),{" "}
                  {sv2027 === "entwurf" ? "Sozialabgaben mit den Beitragsbemessungsgrenzen aus dem BMAS-Entwurf" : "Sozialabgaben mit den Werten 2026"}.
                  Gleiche Angaben wie oben.
                </p>
              </div>
            )}

            {/* ── Deep-link funnel: full salary analysis (more pageviews / engagement) ─ */}
            {deepLink && bruttoMonat >= 500 && bruttoMonat <= 100000 && (
              <Link
                href={`/rechner/${Math.round(bruttoMonat)}-euro-brutto-netto`}
                className="group flex items-center justify-between gap-3 bg-[#16181D] hover:bg-black text-white rounded-2xl px-5 sm:px-6 py-4 mb-6 sm:mb-8 shadow-lg transition-all"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <TrendingUp size={20} className="text-[#E60A1C] flex-shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-sm sm:text-base font-bold truncate">
                      {lang === "en"
                        ? `Full analysis for €${Math.round(bruttoMonat).toLocaleString("en-US")} gross`
                        : lang === "ro"
                        ? `Analiză completă pentru ${Math.round(bruttoMonat).toLocaleString("de-DE")} € brut (în germană)`
                        : lang === "tr"
                        ? `${Math.round(bruttoMonat).toLocaleString("de-DE")} € brüt için tam analiz (Almanca)`
                        : lang === "uk"
                        ? `Повний аналіз для ${Math.round(bruttoMonat).toLocaleString("de-DE")} € брутто (німецькою)`
                        : `Vollständige Analyse für ${Math.round(bruttoMonat).toLocaleString("de-DE")} € Brutto`}
                    </span>
                    <span className="block text-xs text-white/60 truncate">
                      {t.fullAnalysisSub}
                    </span>
                  </span>
                </span>
                <ChevronRight size={20} className="text-[#E60A1C] flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            {/* ── Donut + legend + bar Card ────────────────────────── */}
            <div className="bg-[#FFFFFF] border border-black/[0.10] rounded-3xl p-5 sm:p-7 mb-6 sm:mb-8 shadow-lg">
              <p className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-black/60 font-bold mb-5">{t.distribution}</p>

              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-5 sm:gap-8 mb-5">
                {/* LARGE Donut */}
                <div className="relative flex-shrink-0">
                  <DonutChart netto={nm} steuer={tm} sv={sm} total={bm} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-[10px] sm:text-xs font-mono uppercase text-black/50 font-bold leading-none">{t.netWord}</p>
                      <p className="text-lg sm:text-xl font-black text-[#16181D] leading-tight mt-1">
                        {bm > 0 ? Math.round((nm / bm) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Clear Legend */}
                <div className="flex-1 w-full sm:w-auto lg:w-full xl:w-auto min-w-0 space-y-3">
                  {[
                    { color: "#0E9F6E", label: t.legendNet, val: showVal(nm), icon: CircleDollarSign },
                    { color: "#E60A1C", label: t.legendTax, val: showVal(tm), icon: Landmark },
                    { color: "#6B7280", label: t.legendSv,  val: showVal(sm), icon: HeartPulse },
                  ].map(({ color, label, val, icon: Icon }) => (
                    <div key={label} className="flex items-center justify-between text-sm sm:text-base font-semibold gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex-shrink-0 shadow-sm" style={{ background: color }} />
                        <Icon size={16} className="text-black/70 flex-shrink-0" />
                        <span className="text-black/90 truncate">{label}</span>
                      </div>
                      <span className="font-mono font-bold text-[#16181D] tabular-nums text-base sm:text-lg flex-shrink-0">{formatEUR(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              <div className="pt-2">
                <BreakdownBar netto={nm} steuer={tm} sv={sm} total={bm} />
              </div>
            </div>

            {/* ── Detailed breakdown (PROPER STRATIFIED CARDS) ──────── */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-black/60 font-bold mb-3">{t.detailed}</p>

              {/* Brutto Row */}
              <div className="flex justify-between items-center py-3.5 sm:py-4 px-4 sm:px-5 bg-black/[0.04] rounded-2xl border border-black/[0.10] text-base sm:text-lg font-bold text-[#16181D] gap-2">
                <span className="flex items-center gap-2 min-w-0">
                  <CircleDollarSign size={18} className="text-[#E60A1C] flex-shrink-0" />
                  <span className="truncate">{t.grossSalary}</span>
                </span>
                <span className="font-mono font-extrabold text-lg sm:text-xl text-[#16181D] tabular-nums flex-shrink-0">{formatEUR(showVal(bm))}</span>
              </div>

              {/* Lohnsteuer Group */}
              <div className="flex justify-between items-center py-3 sm:py-3.5 px-4 sm:px-5 bg-black/[0.02] rounded-xl border border-black/[0.08] text-sm sm:text-lg font-bold text-[#16181D] mt-4 gap-2">
                <span className="flex items-center gap-2 min-w-0">
                  <Landmark size={16} className="text-[#E60A1C] flex-shrink-0" />
                  <span className="truncate">{t.totalTaxes}</span>
                </span>
                <span className="font-mono font-bold text-base sm:text-lg text-[#FF2436] tabular-nums flex-shrink-0">-{formatEUR(showVal(tm))}</span>
              </div>

              <div className="pl-2 sm:pl-6 pr-1 sm:pr-4 space-y-1.5 text-xs sm:text-base text-black/80 font-medium py-1">
                <div className="flex justify-between items-start sm:items-center py-1.5 border-b border-black/[0.05] gap-2">
                  <span className="leading-snug">{t.incomeTax}</span>
                  <span className="font-mono font-semibold tabular-nums text-black/90 flex-shrink-0">-{formatEUR(showVal(result.steuer.einkommensteuerJahr / 12))}</span>
                </div>
                <div className="flex justify-between items-start sm:items-center py-1.5 border-b border-black/[0.05] gap-2">
                  <span className="leading-snug">{t.soli}</span>
                  <span className="font-mono font-semibold tabular-nums text-black/90 flex-shrink-0">-{formatEUR(showVal(result.steuer.soliJahr / 12))}</span>
                </div>
                {result.steuer.kirchensteuerJahr > 0 && (
                  <div className="flex justify-between items-start sm:items-center py-1.5 gap-2">
                    <span className="leading-snug">{t.churchTax}</span>
                    <span className="font-mono font-semibold tabular-nums text-black/90 flex-shrink-0">-{formatEUR(showVal(result.steuer.kirchensteuerJahr / 12))}</span>
                  </div>
                )}
              </div>

              {/* Sozialabgaben Group */}
              <div className="flex justify-between items-center py-3 sm:py-3.5 px-4 sm:px-5 bg-black/[0.02] rounded-xl border border-black/[0.08] text-sm sm:text-lg font-bold text-[#16181D] mt-4 gap-2">
                <span className="flex items-center gap-2 min-w-0">
                  <HeartPulse size={16} className="text-[#E60A1C] flex-shrink-0" />
                  <span className="truncate">{t.totalSv}</span>
                </span>
                <span className="font-mono font-bold text-base sm:text-lg text-[#FF2436] tabular-nums flex-shrink-0">-{formatEUR(showVal(sm))}</span>
              </div>

              <div className="pl-2 sm:pl-6 pr-1 sm:pr-4 space-y-1.5 text-xs sm:text-base text-black/80 font-medium py-1">
                <div className="flex justify-between items-start sm:items-center py-1.5 border-b border-black/[0.05] gap-2">
                  <span className="leading-snug">{t.pension}</span>
                  <span className="font-mono font-semibold tabular-nums text-black/90 flex-shrink-0">-{formatEUR(showVal(result.sv.rente / 12))}</span>
                </div>
                <div className="flex justify-between items-start sm:items-center py-1.5 border-b border-black/[0.05] gap-2">
                  <span className="leading-snug">{t.health} <span className="text-black/45">({formatPct(result.sv.krankenSatzAnPct)})</span></span>
                  <span className="font-mono font-semibold tabular-nums text-black/90 flex-shrink-0">-{formatEUR(showVal(result.sv.kranken / 12))}</span>
                </div>
                <div className="flex justify-between items-start sm:items-center py-1.5 border-b border-black/[0.05] gap-2">
                  <span className="leading-snug">{t.care} <span className="text-black/45">({formatPct(result.sv.pflegeSatzAnPct)})</span></span>
                  <span className="font-mono font-semibold tabular-nums text-black/90 flex-shrink-0">-{formatEUR(showVal(result.sv.pflege / 12))}</span>
                </div>
                <div className="flex justify-between items-start sm:items-center py-1.5 gap-2">
                  <span className="leading-snug">{t.unemployment}</span>
                  <span className="font-mono font-semibold tabular-nums text-black/90 flex-shrink-0">-{formatEUR(showVal(result.sv.arbeitslosen / 12))}</span>
                </div>
              </div>

            </div>

          </div>

          {/* ── Tax rates footer ────────────────────────────── */}
          <div className="bg-[#F1F3F5] border border-black/[0.10] rounded-2xl p-4 sm:p-5 mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 text-xs sm:text-base text-black/80 font-medium">
            <span className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#E60A1C] flex-shrink-0" />
              <span>{t.marginalRate}: <strong className="text-[#16181D] ml-1 font-bold">{result.grenzsteuersatzPct.toFixed(1)} %</strong></span>
            </span>
            <span className="flex items-center gap-2">
              <Briefcase size={16} className="text-[#E60A1C] flex-shrink-0" />
              <span>{t.avgRate}: <strong className="text-[#16181D] ml-1 font-bold">{result.durchschnittssteuersatzPct.toFixed(1)} %</strong></span>
            </span>
          </div>

          {/* ── In-content ad, placed at the result ───────────────────────
              The user has just read their Nettogehalt and the full breakdown:
              this is the highest-attention point on the page, and it sits below
              the fold so it never delays or covers the calculator itself.

              No margin override any more. `!my-6` left 24 px between this unit
              and the Bundesland accordion button directly beneath it — close
              enough on a phone that a tap aimed at the accordion lands on a
              fluid ad that grew into the gap a frame earlier. AdUnit now
              reserves its own height and carries a 32 px click buffer; the
              accordion below gets extra top margin to match. ── */}
          <AdUnit slot="result" format="in-article" />

          {/* ── Expandable: Bundesland Comparison ──────────────────────── */}
          {/* mt-8, not mt-4: this accordion's header is a full-width button and
              it is the first tap target below the result ad. Extra separation
              on top of AdUnit's own buffer. */}
          <div className="mt-8 bg-[#F1F3F5] border border-black/[0.10] rounded-2xl overflow-hidden transition-all shadow-lg">
            <button
              type="button"
              onClick={() => setShowBundesland(!showBundesland)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-black/[0.04] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#E60A1C]/15 border border-[#E60A1C]/30 flex items-center justify-center text-[#E60A1C] font-bold shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold text-[#16181D] group-hover:text-[#E60A1C] transition-colors">
                    {t.blTitle}
                  </div>
                  <div className="text-xs text-black/50">
                    {t.blSub}
                  </div>
                </div>
              </div>
              <div className="text-black/60 group-hover:text-[#16181D] ml-2 shrink-0">
                {showBundesland ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {showBundesland && (
              <div className="p-4 sm:p-5 border-t border-black/[0.08] bg-black/[0.04] space-y-4 text-xs sm:text-sm text-black/80">
                <p className="leading-relaxed text-black/70">
                  {lang === "en" ? (
                    <>Deductions in Germany depend on your state of residence. With church-tax liability, Bavaria and Baden-Württemberg apply a reduced rate of <strong>8%</strong>, all other 14 states <strong>9%</strong>. Employees in Saxony also pay a 0.5% higher share of long-term care insurance.</>
                  ) : lang === "ro" ? (
                    <>Deducerile din Germania depind de landul în care locuiești. Cu impozit bisericesc, Bavaria și Baden-Württemberg aplică o cotă redusă de <strong>8 %</strong>, celelalte 14 landuri <strong>9 %</strong>. Angajații din Saxonia plătesc în plus o cotă cu 0,5 % mai mare la asigurarea de îngrijire.</>
                  ) : lang === "tr" ? (
                    <>Almanya&apos;da kesintiler oturduğunuz eyalete bağlıdır. Kilise vergisi ödeyenler için Bavyera ve Baden-Württemberg&apos;de indirimli oran <strong>%8</strong>, diğer 14 eyalette <strong>%9</strong>&apos;dur. Saksonya&apos;daki çalışanlar ayrıca bakım sigortasına %0,5 daha fazla pay öder.</>
                  ) : lang === "uk" ? (
                    <>Утримання в Німеччині залежать від федеральної землі проживання. Для платників церковного податку в Баварії та Баден-Вюртемберзі діє знижена ставка <strong>8 %</strong>, в інших 14 землях — <strong>9 %</strong>. Крім того, працівники в Саксонії сплачують на 0,5 % більшу частку внеску на страхування догляду.</>
                  ) : lang === "pl" ? (
                    <>Wysokość potrąceń w Niemczech zależy od landu zamieszkania. Przy podatku kościelnym Bawaria i Badenia-Wirtembergia stosują obniżoną stawkę <strong>8%</strong>, pozostałe 14 landów <strong>9%</strong>. Ponadto pracownicy w Saksonii płacą o 0,5% wyższy udział w ubezpieczeniu pielęgnacyjnym.</>
                  ) : (
                    <>Die Höhe der Abzüge hängt in Deutschland von Ihrem Wohnsitz-Bundesland ab. Bei Kirchensteuerpflicht gilt in Bayern und Baden-Württemberg ein ermäßigter Satz von <strong>8 %</strong>, in allen anderen 14 Bundesländern <strong>9 %</strong>. Zudem tragen Arbeitnehmer in Sachsen einen um 0,5 % höheren Eigenanteil an der Pflegeversicherung.</>
                  )}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-black/[0.04] p-3.5 rounded-xl border border-black/[0.08]">
                    <div className="text-xs font-mono text-amber-600 font-bold mb-1">{t.bl8}</div>
                    <div className="font-bold text-[#16181D] text-sm sm:text-base mb-1">{t.bl8States}</div>
                    <div className="text-xs text-black/60 mb-2">{t.blChurchIn} {jahr}:</div>
                    <div className="font-mono font-extrabold text-[#16181D] text-base sm:text-lg bg-black/[0.04] p-2 rounded border border-black/[0.08] flex flex-col items-start gap-0.5 [&>span:first-child]:text-xs [&>span:first-child]:font-semibold [&>span:first-child]:text-black/55 [&>span:last-child]:whitespace-nowrap">
                      <span>{t.netLabelShort} ({isJahresansicht ? t.yearWord : t.monthShort}):</span>
                      <span className="text-emerald-600">{formatEUR(showVal(resBW_BY.nettoMonat))}</span>
                    </div>
                  </div>

                  <div className="bg-black/[0.04] p-3.5 rounded-xl border border-black/[0.08]">
                    <div className="text-xs font-mono text-rose-600 font-bold mb-1">{t.bl9}</div>
                    <div className="font-bold text-[#16181D] text-sm sm:text-base mb-1">{t.bl9States}</div>
                    <div className="text-xs text-black/60 mb-2">{t.blChurchIn} {jahr}:</div>
                    <div className="font-mono font-extrabold text-[#16181D] text-base sm:text-lg bg-black/[0.04] p-2 rounded border border-black/[0.08] flex flex-col items-start gap-0.5 [&>span:first-child]:text-xs [&>span:first-child]:font-semibold [&>span:first-child]:text-black/55 [&>span:last-child]:whitespace-nowrap">
                      <span>{t.netLabelShort} ({isJahresansicht ? t.yearWord : t.monthShort}):</span>
                      <span className="text-emerald-600">{formatEUR(showVal(resOtherStates.nettoMonat))}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Expandable: Year Comparison ──────────────────────────────
              Mit `jahresvergleich` steht der Vergleich bereits fest über dem
              Ergebnis — das Akkordeon entfällt dann. */}
          {!jahresvergleich && (
          <div className="mt-3 bg-[#F1F3F5] border border-black/[0.10] rounded-2xl overflow-hidden transition-all shadow-lg">
            <button
              type="button"
              onClick={() => setShowYearCompare(!showYearCompare)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-black/[0.04] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#E60A1C]/15 border border-[#E60A1C]/30 flex items-center justify-center text-[#E60A1C] font-bold shrink-0">
                  <Calendar size={16} />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold text-[#16181D] group-hover:text-[#E60A1C] transition-colors">
                    {t.yearCompareTitle} {jahr} {t.yearCompareVs} {otherYear} {t.yearCompareSuffix}
                  </div>
                  <div className="text-xs text-black/50">
                    {diffYear !== 0 ? (
                      <span>{t.diff}: <strong className={diffYear > 0 ? "text-emerald-600" : "text-rose-600"}>{diffYear > 0 ? `+${formatEUR(showVal(diffYear))}` : formatEUR(showVal(diffYear))}</strong> {t.net} ({isJahresansicht ? t.perYearWord : t.perMonthWord2})</span>
                    ) : (
                      <span>{lang === "en" ? `Compare your net pay between tax years 2026 and 2027` : lang === "pl" ? `Porównaj swoje netto między latami podatkowymi 2026 i 2027` : lang === "ro" ? `Compară salariul net între anii fiscali 2026 și 2027` : lang === "tr" ? `2026 ve 2027 vergi yılları arasında net maaşınızı karşılaştırın` : lang === "uk" ? `Порівняйте нетто між податковими роками 2026 і 2027` : `Vergleichen Sie Ihr Netto zwischen Steuerjahr 2026 und 2027`}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-black/60 group-hover:text-[#16181D] ml-2 shrink-0">
                {showYearCompare ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {showYearCompare && (
              <div className="p-4 sm:p-5 border-t border-black/[0.08] bg-black/[0.04] space-y-4 text-xs sm:text-sm text-black/80">
                <p className="leading-relaxed text-black/70">
                  {lang === "en"
                    ? "Due to the adjusted § 32a EStG tax tariff and modified contribution ceilings, your net salary changes at the same gross pay as follows:"
                    : lang === "ro"
                    ? "Din cauza tarifului modificat conform § 32a EStG și a plafoanelor de contribuții ajustate, salariul tău net se schimbă, la același salariu brut, astfel:"
                    : lang === "tr"
                    ? "§ 32a EStG'ye göre değişen vergi tarifesi ve güncellenen prim tavanları nedeniyle, aynı brüt maaşta net maaşınız şöyle değişir:"
                    : lang === "uk"
                    ? "Через змінений тариф за § 32a EStG і скориговані граничні суми внесків ваша зарплата нетто за тієї ж суми брутто змінюється так:"
                    : lang === "pl"
                    ? "Ze względu na zmienioną taryfę podatkową wg § 32a EStG i zmodyfikowane limity składek, Twoje wynagrodzenie netto przy tym samym brutto zmienia się następująco:"
                    : "Durch den angepassten Steuertarif nach § 32a EStG und modifizierte Beitragsbemessungsgrenzen verändert sich Ihr Nettogehalt bei gleichem Bruttogehalt wie folgt:"}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-black/[0.04] p-3.5 rounded-xl border border-black/[0.08]">
                    <div className="text-xs font-mono text-black/50 uppercase mb-1">{t.selectedYear}</div>
                    <div className="font-bold text-[#16181D] text-base mb-2">{t.taxYearWord} {jahr}</div>
                    <div className="font-mono font-extrabold text-[#16181D] text-base sm:text-lg bg-black/[0.04] p-2.5 rounded border border-black/[0.08] flex flex-col items-start gap-0.5 [&>span:first-child]:text-xs [&>span:first-child]:font-semibold [&>span:first-child]:text-black/55 [&>span:last-child]:whitespace-nowrap">
                      <span>{t.netLabelShort} ({isJahresansicht ? t.yearWord : t.monthShort}):</span>
                      <span className="text-[#16181D] font-bold">{formatEUR(showVal(result.nettoMonat))}</span>
                    </div>
                  </div>

                  <div className="bg-black/[0.04] p-3.5 rounded-xl border border-black/[0.08]">
                    <div className="text-xs font-mono text-black/50 uppercase mb-1">{t.compareYear}</div>
                    <div className="font-bold text-[#16181D] text-base mb-2">{t.taxYearWord} {otherYear}</div>
                    <div className="font-mono font-extrabold text-[#16181D] text-base sm:text-lg bg-black/[0.04] p-2.5 rounded border border-black/[0.08] flex flex-col items-start gap-0.5 [&>span:first-child]:text-xs [&>span:first-child]:font-semibold [&>span:first-child]:text-black/55 [&>span:last-child]:whitespace-nowrap">
                      <span>{t.netLabelShort} ({isJahresansicht ? t.yearWord : t.monthShort}):</span>
                      <span className="text-emerald-600 font-bold">{formatEUR(showVal(resOtherYear.nettoMonat))}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#E60A1C]/10 border border-[#E60A1C]/30 rounded-xl text-black/90 text-xs sm:text-sm flex items-center justify-between font-medium">
                  <span>{t.netDiff} ({isJahresansicht ? t.annualAdj : t.monthlyAdj}):</span>
                  <span className={`font-mono font-bold text-sm sm:text-base ${diffYear >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {diffYear > 0 ? `+${formatEUR(showVal(diffYear))}` : formatEUR(showVal(diffYear))}
                  </span>
                </div>

                {/* Aufschlüsselung: Steuereffekt (Tarif) vs. Sozialabgaben-Effekt (BBG/Zusatzbeitrag). */}
                <div className="space-y-1.5 px-1">
                  {[
                    { label: t.diffTax, val: resOtherYear.steuer.summeMonat - result.steuer.summeMonat },
                    { label: t.diffSv,  val: resOtherYear.sv.summeMonat - result.sv.summeMonat },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex flex-wrap items-center justify-between gap-x-3 text-xs sm:text-sm">
                      <span className="text-black/65">{label}</span>
                      <span className={`ml-auto font-mono font-semibold tabular-nums ${val >= 0.005 ? "text-emerald-700" : val <= -0.005 ? "text-rose-700" : "text-black/60"}`}>
                        {val >= 0.005 ? `+${formatEUR(showVal(val))}` : formatEUR(showVal(Math.abs(val) < 0.005 ? 0 : val))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
          )}

          {/* ── Personalised next steps — keeps the visit going after the result.
              Sits below both accordions, i.e. well clear of the result ad. ── */}
          {lang === "de" && (
            <NextSteps
              brutto={bruttoMonat}
              jahr={jahr}
              steuerklasse={steuerklasse}
              netto2027Gain={jahr === 2026 ? resOtherYear.nettoMonat - result.nettoMonat : 0}
            />
          )}

          {/* ── Support / Buy-me-a-coffee ──────────────────────────
              Placed at the END of the result column on purpose: the
              deep-link "Vollständige Analyse" CTA above drives pageviews
              (ad revenue) and must not compete with a donation ask. Readers
              who got this far are the ones most likely to give.
              Must stay OUTSIDE the year-comparison accordion above — it used
              to be its last child, so the accordion's grey box and border
              wrapped around the card. The card's own bottom margin is zeroed
              here so it doesn't leave a gap at the end of the column. */}
          <div className="mt-4 [&>div]:mb-0">
            <SupportButton variant="card" lang={lang} placement="calculator_result" />
          </div>

        </div>
      </div>
    </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */
function Toggle({
  id, checked, onChange, label, hint,
}: {
  id: string; checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-3.5 cursor-pointer select-none group">
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onChange(!checked); } }}
        className="relative flex-shrink-0 rounded-full transition-all duration-200 focus:outline-none"
        style={{
          width: "50px", height: "28px",
          background: checked ? "#E60A1C" : "rgba(16,24,40,0.12)",
          boxShadow: checked ? "0 1px 3px rgba(16,24,40,0.20)" : "none",
        }}
      >
        <span
          className="absolute top-[3px] left-[3px] rounded-full bg-white shadow-md transition-transform duration-200"
          style={{ width: "22px", height: "22px", transform: checked ? "translateX(22px)" : "none" }}
        />
      </button>
      <span>
        <span className="text-base text-black/90 group-hover:text-[#16181D] transition-colors font-semibold">{label}</span>
        {hint && <span className="block text-xs text-black/60 font-normal mt-0.5">{hint}</span>}
      </span>
    </label>
  );
}
