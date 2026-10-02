import type { ExpatContent } from "./types";
import { BEISPIELE, GEHALT, GRUNDFREIBETRAG_2026, MINDESTLOHN_ZEILEN, MINIJOB, eur } from "./numbers";

/**
 * Rumänisch. Keywords aus Google Autocomplete (hl=ro, gl=ro/de, 2.10.2026):
 * "salariu net germania 2026", "calculator salariu germania", "clasa de
 * impozitare germania" (+ "tabel"), "salariu minim germania 2026 net", "2027".
 */

const b3000 = BEISPIELE.find((b) => b.brutto === 3000)!;
const [ml26, ml27] = MINDESTLOHN_ZEILEN;

export const RO: ExpatContent = {
  lang: "ro",
  ogLocale: "ro_RO",
  start: "Acasă",
  hinweisDeutsch: "Calculatorul aplică impozitele și contribuțiile din Germania. Preferi în germană?",
  linkDeutsch: "Brutto-Netto-Rechner (DE)",
  weitere: "Mai multe pentru cei care lucrează în Germania",
  quellenLabel: "Surse",
  faqTitel: "Întrebări frecvente",
  quellen:
    "Surse: § 32a EStG (tariful 2026), valorile oficiale pentru asigurări sociale 2026, Mindestlohnverordnung (13,90 € din 2026, 14,60 € din 2027), Destatis (salarii 2025). Calcul orientativ, nu constituie consultanță fiscală.",
  calc: {
    path: "/ro/calculator-salariu-germania",
    title: "Calculator salariu Germania 2026 — brut net, în română",
    description:
      "Calculator salariu net Germania 2026 în limba română: din brut în net cu impozit, Soli și asigurări sociale, pentru toate cele 6 clase de impozitare.",
    keywords: [
      "calculator salariu germania",
      "salariu net germania",
      "salariu net germania 2026",
      "calculator salariu brut net germania",
      "salariu brut net germania",
      "taxe salariu germania",
      "salariu mediu germania",
    ],
    nav: "Calculator salariu",
    h1: "Calculator salariu",
    h1Akzent: "Germania 2026",
    badge: "Germania · 2026 · Română",
    intro:
      "Află cât primești în mână din salariul brut german: impozit pe venit (Lohnsteuer), contribuția de solidaritate, impozit bisericesc și toate asigurările sociale — pentru toate cele 6 clase de impozitare, cu valorile oficiale 2026.",
    beispieleTitel: "Salariu brut și net în Germania (pe lună)",
    beispieleIntro: "Fără copii, fără impozit bisericesc, asigurare de sănătate cu contribuția suplimentară medie, valori 2026.",
    spalteBrutto: "Brut / lună",
    spalteSk1: "Net clasa I (singur)",
    spalteSk3: "Net clasa III (căsătorit)",
    abzuegeTitel: "Ce se reține din salariu în Germania",
    abzuege: [
      "Asigurare de pensie (Rentenversicherung): 9,3 %",
      "Asigurare de sănătate (Krankenversicherung): 7,3 % plus jumătate din contribuția suplimentară a casei — în medie 8,75 %",
      "Asigurare de îngrijire (Pflegeversicherung): 1,8 %, fără copii și peste 23 de ani 2,4 %",
      "Asigurare de șomaj (Arbeitslosenversicherung): 1,3 %",
      `Impozit pe venit (Lohnsteuer) după tarif — primii ${eur(GRUNDFREIBETRAG_2026, 0)} pe an sunt scutiți`,
      "Contribuția de solidaritate (Soli): doar la venituri mari; impozit bisericesc 8–9 % doar pentru membrii bisericilor înregistrate",
    ],
    gehaltTitel: "Salariul mediu în Germania",
    gehaltText: `Angajații cu normă întreagă au câștigat în 2025 în medie ${eur(GEHALT.durchschnittJahr, 0)} brut pe an (Destatis); salariul median — jumătate câștigă mai mult, jumătate mai puțin — a fost ${eur(
      GEHALT.medianJahr,
      0
    )}. Pe lună, la clasa I, rămân net aproximativ ${eur(GEHALT.medianNetto)} din salariul median și ${eur(GEHALT.durchschnittNetto)} din cel mediu.`,
    faqs: [
      {
        q: "Cât înseamnă 3.000 € brut în net în Germania?",
        a: `În 2026 rămân aproximativ ${eur(b3000.sk1)} net pe lună în clasa I (persoană singură, fără copii) și ${eur(
          b3000.sk3
        )} în clasa III (căsătorit, partenerul cu venit mic sau fără venit). Diferența vine din impozit — contribuțiile sociale sunt aceleași.`,
      },
      {
        q: "Cât la sută din salariu se reține în Germania?",
        a: "La un salariu mediu, între 35 și 40 % din brut în clasa I: aproximativ 22 % asigurări sociale, restul impozit. La salarii mici procentul este mai mic, pentru că primii 12.348 € pe an nu se impozitează; la salarii mari este mai mare, din cauza tarifului progresiv.",
      },
      {
        q: "Calculatorul este pentru impozitele din Germania sau din România?",
        a: "Exclusiv pentru Germania: impozitul pe venit german (§ 32a EStG) și asigurările sociale germane, cu valorile oficiale 2026. Dacă lucrezi în Germania și locuiești acolo, salariul tău este impozitat în Germania.",
      },
      {
        q: "Primesc al 13-lea salariu în Germania?",
        a: "Nu există o obligație legală. Multe contracte colective (Tarifvertrag) prevăd însă o primă de Crăciun (Weihnachtsgeld) sau de concediu (Urlaubsgeld). Aceste plăți se impozitează ca venit suplimentar în luna plății, deci rămâne relativ mai puțin net din ele decât dintr-un salariu lunar.",
      },
    ],
  },
  klassen: {
    path: "/ro/clase-de-impozitare-germania",
    title: "Clasa de impozitare Germania 2026 — tabel și explicații",
    description:
      "Clasele de impozitare din Germania (Steuerklasse I–VI) explicate în română: cine primește ce clasă, tabel cu salariul net 2026 și cum schimbi clasa.",
    keywords: [
      "clasa de impozitare germania",
      "tabel clasa de impozitare germania 2026",
      "clase de impozitare germania",
      "clasa 1 de impozitare germania",
      "clasa 3 de impozitare germania",
      "clasa 6 de impozitare germania",
      "schimbare clasa de impozitare germania",
    ],
    nav: "Clase de impozitare",
    h1: "Clasa de impozitare",
    h1Akzent: "Germania 2026",
    badge: "Steuerklassen · 2026 · Română",
    intro:
      "În Germania, clasa de impozitare (Steuerklasse) stabilește cât impozit ți se reține lunar din salariu. Există șase clase — iată cine primește care, cât rămâne net în fiecare și cum o schimbi.",
    tabelleTitel: "Tabel: salariul net pe clase de impozitare 2026",
    tabelleIntro: "Net pe lună, fără impozit bisericesc; clasa II cu un copil, celelalte fără copii.",
    spalteKlasse: "Clasa",
    klassen: [
      { titel: "Clasa I", text: "Persoane necăsătorite, divorțate sau văduve. Și cei căsătoriți al căror partener nu locuiește în Germania primesc implicit clasa I." },
      { titel: "Clasa II", text: "Părinți singuri care locuiesc cu cel puțin un copil pentru care primesc alocație. Se aplică în plus o deducere pentru familiile monoparentale." },
      { titel: "Clasa III", text: "Căsătoriți, când un partener câștigă mult mai mult sau celălalt nu lucrează. Cea mai mică reținere — partenerul ia atunci clasa V." },
      { titel: "Clasa IV", text: "Căsătoriți cu venituri asemănătoare. Fiecare plătește ca în clasa I. Automat după căsătorie." },
      { titel: "Clasa V", text: "Partenerul cu venitul mai mic, în combinația III/V. Reținerea lunară este mare; diferența se reglează la declarația anuală." },
      { titel: "Clasa VI", text: "Pentru al doilea și orice alt loc de muncă cu impozit. Nu are nicio scutire — de aceea se reține cel mai mult." },
    ],
    wechselTitel: "Partenerul locuiește în România — ce clasă primesc?",
    wechselText:
      "Implicit clasa I. Ca cetățean UE poți cere însă clasa III dacă partenerul locuiește în UE și cel puțin 90 % din venitul vostru comun se impozitează în Germania, sau dacă veniturile din afara Germaniei nu depășesc dublul sumei scutite de bază (§ 1a EStG). Cererea se face la Finanzamt, cu o adeverință de venit a partenerului de la autoritatea fiscală din România. Schimbarea clasei între soți se poate face online prin ELSTER, de mai multe ori pe an.",
    faqs: [
      {
        q: "Ce clasă de impozitare primesc când mă mut în Germania?",
        a: "După înregistrarea domiciliului (Anmeldung) primești automat un cod fiscal (Steuer-ID) și clasa I. Dacă ești căsătorit și partenerul locuiește tot în Germania, amândoi primiți clasa IV; puteți trece apoi la III/V.",
      },
      {
        q: "Care clasă de impozitare este cea mai bună?",
        a: "Clasa III are reținerea lunară cea mai mică, dar e disponibilă doar pentru căsătoriți, în combinație cu clasa V pentru partener. Pe an, impozitul total al cuplului este însă același în III/V și IV/IV — diferența se regularizează prin declarația de impozit (Steuererklärung), care în III/V este obligatorie.",
      },
      {
        q: "De ce se reține atât de mult în clasa VI?",
        a: "Pentru că scutirea de bază și deducerile se acordă deja la primul loc de muncă. La al doilea job, fiecare euro se impozitează de la început. Pentru joburi mici până la 603 € pe lună (2026) există minijobul, fără impozit pentru angajat.",
      },
    ],
  },
  mindestlohn: {
    path: "/ro/salariu-minim-germania",
    title: "Salariu minim Germania 2026 net — 13,90 € pe oră",
    description:
      "Salariul minim în Germania 2026: 13,90 € brut pe oră, din 2027 14,60 €. Cât înseamnă pe lună brut și net, pe clase de impozitare și pe ore pe săptămână.",
    keywords: [
      "salariu minim germania",
      "salariu minim germania 2026",
      "salariu minim germania 2026 net",
      "salariu minim net germania",
      "salariu minim germania pe luna",
      "salariu minim germania 2027",
      "salariu minim germania pe ora",
    ],
    nav: "Salariu minim",
    h1: "Salariu minim",
    h1Akzent: "Germania 2026",
    badge: "Mindestlohn · 2026/2027 · Română",
    intro: `Salariul minim legal în Germania este de 13,90 € brut pe oră din 1 ianuarie 2026 și crește la 14,60 € din 1 ianuarie 2027. La 40 de ore pe săptămână înseamnă ${eur(
      ml26.brutto
    )} brut pe lună — și aproximativ ${eur(ml26.netto)} net în clasa I.`,
    tabelleTitel: "Salariul minim pe lună: brut și net",
    tabelleIntro: "40 de ore pe săptămână (173,33 ore pe lună), fără copii, fără impozit bisericesc.",
    spalteJahr: "An",
    spalteStunde: "Pe oră",
    spalteBruttoMonat: "Brut / lună",
    spalteNettoSk1: "Net clasa I",
    spalteNettoSk3: "Net clasa III",
    stundenTitel: "Salariul minim net după numărul de ore (2026)",
    spalteStundenWoche: "Ore / săptămână",
    minijobTitel: "Minijob: până la 603 € pe lună",
    minijobText: `Un minijob poate aduce în 2026 cel mult ${MINIJOB[2026]} € pe lună (din 2027: ${MINIJOB[2027]} €). Angajatul nu plătește impozit, doar 3,6 % la pensie — de care se poate scuti la cerere. Limita crește automat cu salariul minim.`,
    faqs: [
      {
        q: "Cât este salariul minim în Germania în 2026 pe lună net?",
        a: `Cu normă întreagă (40 de ore pe săptămână) salariul minim de 13,90 € înseamnă ${eur(ml26.brutto)} brut pe lună. Net rămân aproximativ ${eur(
          ml26.netto
        )} în clasa I și ${eur(ml26.netto3)} în clasa III.`,
      },
      {
        q: "Cât va fi salariul minim în Germania în 2027?",
        a: `14,60 € pe oră din 1 ianuarie 2027. La 40 de ore pe săptămână asta înseamnă ${eur(ml27.brutto)} brut și aproximativ ${eur(
          ml27.netto
        )} net pe lună în clasa I. În 2026 creșterea a fost de la 12,82 € la 13,90 €.`,
      },
      {
        q: "Salariul minim este valabil și pentru străini?",
        a: "Da. Salariul minim se aplică tuturor angajaților care lucrează în Germania, indiferent de cetățenie — și lucrătorilor detașați de o firmă din România. Excepții există doar pentru minori fără calificare, ucenici și unele stagii.",
      },
    ],
  },
};
