/**
 * Erzeugt die Infografiken für /infografiken als 1080 × 1350 PNG (4:5) unter
 * marketing/infografiken/<slug>.png. Die Bilder werden danach im Admin
 * („Neue Infografik") hochgeladen — sie liegen bewusst nicht in public/.
 *
 * WARUM ALS SKRIPT UND NICHT PER KI-BILDGENERATOR
 * Bildgeneratoren verdrehen Ziffern, Kommas und Umlaute. Hier kommt jede Zahl
 * direkt aus `calculateNetto` (Jahr 2026 bzw. 2027-Entwurf) — dieselbe Engine
 * wie der Rechner, auf den die Grafik verlinkt.
 *
 * AUSFÜHREN
 *   npx tsx scripts/generate-infografiken.ts
 */

import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { calculateNetto, GRUNDFREIBETRAG, type Steuerklasse } from "../lib/taxCalculator";

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "marketing", "infografiken");
const FONT_DIR = path.join(ROOT, "assets", "fonts");

const W = 1080;
const H = 1350;
const RED = "#E60A1C";
const INK = "#16181D";
const PAPER = "#F4F5F7";
const MUTED = "#6B7280";
const BAR = "#C9CBCF";

const fonts = [600, 700, 800].map((weight) => ({
  name: "Outfit",
  data: fs.readFileSync(path.join(FONT_DIR, `Outfit-${weight}.woff`)),
  weight: weight as 600 | 700 | 800,
  style: "normal" as const,
}));

/* ───────────────────────── Zahlen ───────────────────────── */

const eur0 = (n: number) => `${Math.round(n).toLocaleString("de-DE")} €`;
const eur2 = (n: number) =>
  `${n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
const pct1 = (n: number) => `${n.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;

/** SK II gibt es nur mit Kind → kein Kinderlosenzuschlag in der PV. */
function netto(brutto: number, sk: Steuerklasse, jahr: 2026 | 2027 = 2026) {
  return calculateNetto({
    bruttoMonat: brutto,
    jahr,
    verheiratet: sk === 3 || sk === 4 || sk === 5,
    kinderlosUeber23: sk !== 2,
    kirche: false,
    steuerklasse: sk,
  });
}

/* ───────────────────────── Layout ───────────────────────── */

type Bar = { label: string; value: number; text: string };
type Card = { label: string; value: string };
interface Graphic {
  slug: string;
  headline: string;
  subline: string;
  bars: Bar[];
  cards: [Card, Card];
  footnote: string;
}

const div = (style: Record<string, unknown>, children?: unknown) => ({
  type: "div",
  props: { style: { display: "flex", ...style }, children },
});

function render(g: Graphic) {
  const max = Math.max(...g.bars.map((b) => b.value));
  const many = g.bars.length > 4;
  const rowGap = many ? 34 : 48;
  const barH = many ? 50 : 60;

  const rows = g.bars.map((b) => {
    const isMax = b.value === max;
    return div({ alignItems: "center", width: "100%" }, [
      div({ width: 250, fontSize: 30, fontWeight: 700, color: INK }, b.label),
      div({ flex: 1, height: barH, alignItems: "center", paddingRight: 20 }, [
        div({
          width: `${Math.max(4, (b.value / max) * 100)}%`,
          height: barH,
          borderRadius: 12,
          backgroundColor: isMax ? RED : BAR,
        }),
      ]),
      div({ width: 210, justifyContent: "flex-end", fontSize: 38, fontWeight: 800, color: INK }, b.text),
    ]);
  });

  const card = (c: Card) =>
    div(
      {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: "34px 20px",
        boxShadow: "0 6px 24px rgba(22,24,29,0.08)",
      },
      [
        div({ fontSize: 32, fontWeight: 700, color: INK }, c.label),
        div({ fontSize: 66, fontWeight: 800, color: RED, marginTop: 8, letterSpacing: -1 }, c.value),
      ],
    );

  return div(
    {
      width: W,
      height: H,
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: PAPER,
      padding: "90px 80px 60px",
      fontFamily: "Outfit",
    },
    [
      div({ fontSize: 118, fontWeight: 800, color: RED, letterSpacing: -3, lineHeight: 1.05 }, g.headline),
      div({ fontSize: 64, fontWeight: 800, color: INK, letterSpacing: -1.5, marginTop: 10 }, g.subline),
      // Balken im freien Raum zwischen Überschrift und Karten zentrieren.
      div({ flex: 1, flexDirection: "column", justifyContent: "center", width: "100%", gap: rowGap }, rows),
      div({ width: "100%", gap: 32 }, [card(g.cards[0]), card(g.cards[1])]),
      div({ fontSize: 24, fontWeight: 600, color: MUTED, marginTop: 40, textAlign: "center" }, g.footnote),
      div({ fontSize: 26, fontWeight: 700, color: RED, marginTop: 14 }, "bruttonettocalculator.com"),
    ],
  );
}

/* ───────────────────────── Grafiken ───────────────────────── */

const FUSS_SK = "kinderlos, ohne Kirchensteuer, Ø Zusatzbeitrag 2,9 % · SK II mit 1 Kind";
const FUSS_SK1 = "Steuerklasse I, kinderlos, ohne Kirchensteuer, Ø Zusatzbeitrag 2,9 %";

function gehalt(brutto: number): Graphic {
  const r1 = netto(brutto, 1);
  const lst = r1.steuer.einkommensteuerJahr / 12;
  const bars = ([1, 2, 3, 4] as const).map((sk) => {
    const n = netto(brutto, sk).nettoMonat;
    return { label: `Steuerklasse ${["I", "II", "III", "IV"][sk - 1]}`, value: n, text: eur0(n) };
  });
  return {
    slug: `${brutto}-euro-brutto-in-netto-2026`,
    headline: `${brutto.toLocaleString("de-DE")} € brutto`,
    subline: "So viel bleibt netto 2026",
    bars,
    cards: [
      { label: "Sozialabgaben", value: eur2(r1.sv.summeMonat) },
      { label: "Lohnsteuer (SK I)", value: eur2(lst) },
    ],
    footnote: FUSS_SK,
  };
}

function abzuege3000(): Graphic {
  const r = netto(3000, 1);
  const lst = r.steuer.einkommensteuerJahr / 12;
  const items: [string, number][] = [
    ["Netto", r.nettoMonat],
    ["Lohnsteuer", lst],
    ["Rente", r.sv.rente / 12],
    ["Krankenkasse", r.sv.kranken / 12],
    ["Pflege", r.sv.pflege / 12],
    ["Arbeitslosen", r.sv.arbeitslosen / 12],
  ];
  return {
    slug: "wohin-gehen-3000-euro-brutto-abzuege-2026",
    headline: "3.000 € brutto",
    subline: "Wohin dein Geld geht",
    bars: items.map(([label, v]) => ({ label, value: v, text: eur2(v) })),
    cards: [
      { label: "Abzüge gesamt", value: eur2(3000 - r.nettoMonat) },
      { label: "Netto-Quote", value: pct1((r.nettoMonat / 3000) * 100) },
    ],
    footnote: FUSS_SK1,
  };
}

function leiterSk1(): Graphic {
  return {
    slug: "brutto-netto-steuerklasse-1-2026-tabelle",
    headline: "Steuerklasse I",
    subline: "Brutto in Netto 2026",
    bars: [2000, 3000, 4000, 5000, 6000].map((b) => {
      const n = netto(b, 1).nettoMonat;
      return { label: `${b.toLocaleString("de-DE")} € brutto`, value: n, text: eur0(n) };
    }),
    cards: [
      { label: "Soli bis 6.000 €", value: "0 €" },
      { label: "Grundfreibetrag", value: eur0(GRUNDFREIBETRAG.amtlich2026) },
    ],
    footnote: "kinderlos, ohne Kirchensteuer, Ø Zusatzbeitrag 2,9 %",
  };
}

function netto2027(): Graphic {
  const bars = [3000, 4000, 5000].map((b) => {
    // Auf Cent gerundete Nettos subtrahieren, damit das Plus zu den im Text
    // genannten Beträgen (2.075,52 − 2.067,43) passt.
    const cents = (n: number) => Math.round(n * 100);
    const plus = (cents(netto(b, 1, 2027).nettoMonat) - cents(netto(b, 1).nettoMonat)) / 100;
    return { label: `${b.toLocaleString("de-DE")} € brutto`, value: plus, text: `+${eur2(plus)}` };
  });
  return {
    slug: "netto-2027-steuerreform-mehr-netto",
    headline: "Netto 2027",
    subline: "Was die Steuerreform bringt",
    bars,
    cards: [
      { label: "Grundfreibetrag 2027", value: eur0(GRUNDFREIBETRAG.entwurf2027) },
      { label: "Status", value: "Entwurf" },
    ],
    footnote: "Plus pro Monat, Steuerklasse I, kinderlos · Regierungsentwurf, nicht beschlossen",
  };
}

const GRAPHICS: Graphic[] = [
  gehalt(3000),
  gehalt(2000),
  gehalt(2500),
  gehalt(3500),
  gehalt(4000),
  gehalt(5000),
  gehalt(6000),
  abzuege3000(),
  leiterSk1(),
  netto2027(),
];

/* ───────────────────────── Stories (9:16) ───────────────────────── */

/**
 * Teaser für die Story-Leiste: eine große Zahl statt des ganzen Diagramms —
 * das Diagramm steht auf der verlinkten Infografik-Seite.
 *
 * Der StoryViewer legt oben Fortschrittsbalken + Avatar (~10 %) und unten
 * Caption + Link-Karte (~33 %) über das Bild. Alles Wichtige steht deshalb
 * zwischen STORY_TOP und STORY_H − STORY_BOTTOM.
 */
const STORY_W = 1080;
const STORY_H = 1920;
const STORY_TOP = 220;
const STORY_BOTTOM = 640;

interface StoryGraphic {
  slug: string;
  kicker: string;
  headline: string;
  subline: string;
  hero: { label: string; value: string; sub: string };
  cards: [Card, Card];
  footnote: string;
}

function renderStory(s: StoryGraphic) {
  const small = (c: Card) =>
    div(
      {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 28,
        padding: "30px 16px",
        boxShadow: "0 6px 24px rgba(22,24,29,0.08)",
      },
      [
        div({ fontSize: 32, fontWeight: 700, color: MUTED }, c.label),
        div({ fontSize: 64, fontWeight: 800, color: INK, marginTop: 6, letterSpacing: -1 }, c.value),
      ],
    );

  return div(
    {
      width: STORY_W,
      height: STORY_H,
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: PAPER,
      padding: `${STORY_TOP}px 70px ${STORY_BOTTOM}px`,
      fontFamily: "Outfit",
    },
    [
      div(
        {
          backgroundColor: RED,
          color: "#FFFFFF",
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: 3,
          padding: "12px 30px",
          borderRadius: 999,
        },
        s.kicker,
      ),
      div({ fontSize: 124, fontWeight: 800, color: RED, letterSpacing: -3, marginTop: 40, lineHeight: 1.05 }, s.headline),
      div({ fontSize: 70, fontWeight: 800, color: INK, letterSpacing: -1.5, marginTop: 6 }, s.subline),
      div({ flex: 1 }),
      div(
        {
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          borderRadius: 36,
          padding: "44px 20px 48px",
          boxShadow: "0 10px 36px rgba(22,24,29,0.10)",
        },
        [
          div({ fontSize: 40, fontWeight: 700, color: INK }, s.hero.label),
          div({ fontSize: 176, fontWeight: 800, color: RED, letterSpacing: -5, lineHeight: 1.1 }, s.hero.value),
          div({ fontSize: 38, fontWeight: 600, color: MUTED }, s.hero.sub),
        ],
      ),
      div({ width: "100%", gap: 28, marginTop: 28 }, [small(s.cards[0]), small(s.cards[1])]),
      div({ flex: 1 }),
      div({ fontSize: 26, fontWeight: 600, color: MUTED, textAlign: "center" }, s.footnote),
    ],
  );
}

function gehaltStory(brutto: number): StoryGraphic {
  const n = (sk: Steuerklasse) => netto(brutto, sk).nettoMonat;
  return {
    slug: `${brutto}-euro-brutto-in-netto-2026`,
    kicker: "BRUTTO IN NETTO 2026",
    headline: `${brutto.toLocaleString("de-DE")} € brutto`,
    subline: "Was bleibt netto?",
    hero: { label: "Steuerklasse I", value: eur0(n(1)), sub: "netto im Monat" },
    cards: [
      { label: "Steuerklasse III", value: eur0(n(3)) },
      { label: "Steuerklasse II", value: eur0(n(2)) },
    ],
    footnote: "kinderlos, ohne Kirchensteuer, Ø Zusatzbeitrag 2,9 % · SK II mit 1 Kind",
  };
}

const STORIES: StoryGraphic[] = [
  gehaltStory(3000),
  gehaltStory(2000),
  gehaltStory(2500),
  gehaltStory(3500),
  gehaltStory(4000),
  gehaltStory(5000),
  gehaltStory(6000),
  (() => {
    const r = netto(3000, 1);
    return {
      slug: "wohin-gehen-3000-euro-brutto-abzuege-2026",
      kicker: "ABZÜGE 2026",
      headline: "3.000 € brutto",
      subline: "Wohin geht dein Geld?",
      hero: { label: "Abzüge gesamt", value: eur2(3000 - r.nettoMonat), sub: "jeden Monat" },
      cards: [
        { label: "Sozialabgaben", value: eur2(r.sv.summeMonat) },
        { label: "Lohnsteuer", value: eur2(r.steuer.einkommensteuerJahr / 12) },
      ],
      footnote: FUSS_SK1,
    };
  })(),
  {
    slug: "brutto-netto-steuerklasse-1-2026-tabelle",
    kicker: "STEUERKLASSE I · 2026",
    headline: "6.000 € brutto",
    subline: "Was bleibt netto?",
    hero: { label: "Steuerklasse I", value: eur0(netto(6000, 1).nettoMonat), sub: "netto im Monat" },
    cards: [
      { label: "bei 3.000 € brutto", value: eur0(netto(3000, 1).nettoMonat) },
      { label: "bei 4.000 € brutto", value: eur0(netto(4000, 1).nettoMonat) },
    ],
    footnote: "kinderlos, ohne Kirchensteuer, Ø Zusatzbeitrag 2,9 %",
  },
  (() => {
    const cents = (x: number) => Math.round(x * 100);
    const plus = (cents(netto(5000, 1, 2027).nettoMonat) - cents(netto(5000, 1).nettoMonat)) / 100;
    return {
      slug: "netto-2027-steuerreform-mehr-netto",
      kicker: "STEUERREFORM 2027",
      headline: "Netto 2027",
      subline: "Wie viel mehr?",
      hero: { label: "bei 5.000 € brutto", value: `+${eur2(plus)}`, sub: "mehr netto im Monat" },
      cards: [
        { label: "Grundfreibetrag", value: eur0(GRUNDFREIBETRAG.entwurf2027) },
        { label: "Status", value: "Entwurf" },
      ],
      footnote: "Steuerklasse I, kinderlos · Regierungsentwurf, nicht beschlossen",
    };
  })(),
];

const STORY_DIR = path.join(ROOT, "marketing", "stories");

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const [i, g] of GRAPHICS.entries()) {
    const svg = await satori(render(g) as any, { width: W, height: H, fonts });
    const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
    const file = path.join(OUT_DIR, `${i}-${g.slug}.png`);
    fs.writeFileSync(file, png);
    console.log(`✓ ${path.relative(ROOT, file)}  ${g.bars.map((b) => b.text).join(" | ")}`);
  }

  fs.mkdirSync(STORY_DIR, { recursive: true });
  for (const [i, s] of STORIES.entries()) {
    const svg = await satori(renderStory(s) as any, { width: STORY_W, height: STORY_H, fonts });
    const png = new Resvg(svg, { fitTo: { mode: "width", value: STORY_W } }).render().asPng();
    const file = path.join(STORY_DIR, `${i}-story-${s.slug}.png`);
    fs.writeFileSync(file, png);
    console.log(`✓ ${path.relative(ROOT, file)}  ${s.hero.value} | ${s.cards.map((c) => c.value).join(" | ")}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
