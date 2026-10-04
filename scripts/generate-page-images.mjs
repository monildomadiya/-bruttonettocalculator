/**
 * Erzeugt pro Seite ein eigenes Bild (1200 × 630 PNG) unter
 * public/seiten-bilder/<slug>.png und die Manifeste data/page-images*.json.
 *
 * WARUM
 * Bis 10/2026 teilten sich alle Seiten dasselbe og-image.png — 1024 × 1024,
 * quadratisch und in Wahrheit ein JPEG. Für Google Discover ist das zu schmal,
 * in WhatsApp/Facebook/X sah jede geteilte Seite gleich aus, und in der
 * Google-Bildersuche hatte keine Seite ein eigenes Bild. Jetzt bekommt jede
 * Seite eine Grafik aus ihren eigenen Inhalten: Überschrift und Kurzbeschreibung
 * aus dem gerenderten HTML, bei den Gehaltsseiten zusätzlich die echte
 * Aufteilung Netto / Steuern / Sozialabgaben aus der Rechen-Engine.
 *
 * WARUM ALS SKRIPT (und nicht next/og): siehe scripts/generate-blog-covers.mjs —
 * ImageResponse bricht auf dieser Toolchain den Build.
 *
 * AUSFÜHREN (gegen einen laufenden `next start`):
 *   npm run page:images                      # nur fehlende Bilder
 *   npm run page:images -- --force           # alle neu
 *   BASE_URL=http://localhost:3100 npm run page:images
 * Danach PNGs + Manifeste mitcommitten. Nach Steuerwert- oder Titeländerungen
 * mit --force neu erzeugen, sonst zeigt das Bild alte Zahlen.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { calculateNetto, solveBruttoForNetto } from "../lib/taxCalculator.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "seiten-bilder");
const MANIFEST = path.join(ROOT, "data", "page-images.json");
const MANIFEST_CLIENT = path.join(ROOT, "data", "page-images.client.json");
const FONT_DIR = path.join(ROOT, "assets", "fonts");
const BASE = (process.env.BASE_URL || "http://localhost:3100").replace(/\/$/, "");
const FORCE = process.argv.includes("--force");

const BRAND = "#E60A1C";
const INK = "#16181D";
const PAPER = "#F4F5F7";
const MUTED = "#5B6170";
const GREEN = "#0E9F6E";
const GREY = "#9CA3AF";

const fonts = [
  { name: "Noto Sans", data: fs.readFileSync(path.join(FONT_DIR, "NotoSans-Regular.ttf")), weight: 400, style: "normal" },
  { name: "Noto Sans", data: fs.readFileSync(path.join(FONT_DIR, "NotoSans-Bold.ttf")), weight: 700, style: "normal" },
];

/** Seiten ohne eigenes Bild: eigene Titelbilder (Blog), selbst Bilder (Infografiken), Rechtliches. */
const EXCLUDE = [/^\/blog(\/|$)/, /^\/infografiken(\/|$)/, /^\/(impressum|datenschutz|kontakt)$/];

/** Betragsseiten — Alt-Text und Existenz leitet <PageFigure> per Regel ab. */
const AMOUNT_PAGE = /^\/rechner\/\d+-euro-/;

export function slugFor(p) {
  return p === "/" ? "startseite" : p.slice(1).replace(/\//g, "--");
}

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
// Noto Sans hat keine Pfeile/Häkchen — sonst erscheinen sie als Kästchen im Bild.
const glyphSafe = (s) =>
  s
    .replace(/\s*[→⇒➜➔]\s*/g, " – ")
    .replace(/≈\s*/g, "= ca. ")
    .replace(/≤\s*/g, "bis ")
    .replace(/≥\s*/g, "ab ")
    .replace(/≙/g, "=")
    .replace(/⌀/g, "Ø")
    // Rest der Pfeil-, Mathe-, Technik- und Dingbat-Blöcke: nicht in Noto Sans
    .replace(/[←-⋿⌀-➿]/g, "")
    .replace(/\s{2,}/g, " ");
// Inline-Tags ohne Leerzeichen entfernen, wie der Browser rendert: "Altersvorsorgedepot-<span>Rechner</span>"
// ist "Altersvorsorgedepot-Rechner", nicht "Altersvorsorgedepot- Rechner". Block-Tags trennen weiter mit Leerzeichen.
const text = (html) =>
  glyphSafe(decode(html.replace(/<\/?(span|strong|em|b|i|a|small|sup|sub)\b[^>]*>/gi, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim());

function extract(html) {
  const h1 = text((/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html) || [])[1] || "");
  const desc = glyphSafe(decode((/<meta[^>]+name="description"[^>]+content="([^"]*)"/i.exec(html) || [])[1] || ""));
  // Rubrik: vorletzter Eintrag der BreadcrumbList, sofern es einen gibt.
  let rubrik = "";
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const j = JSON.parse(m[1]);
      const nodes = j["@graph"] ?? [j];
      const bc = nodes.find((n) => n["@type"] === "BreadcrumbList");
      const items = bc?.itemListElement ?? [];
      if (items.length >= 3) rubrik = items[items.length - 2].name;
    } catch {}
  }
  return { h1, desc, rubrik };
}

/** Sprache der Seite (Expat-Cluster) — nur für Rubrik und Fußzeile. */
function langOf(p) {
  const m = /^\/(en|pl|ro|tr|uk)\//.exec(p);
  return m ? m[1] : "de";
}
const TAGLINE = {
  de: "Gehalt, Steuern & Sozialabgaben 2026/2027",
  en: "Gross to net salary · Germany 2026",
  pl: "Wynagrodzenie brutto netto · Niemcy 2026",
  ro: "Salariu brut net · Germania 2026",
  tr: "Brüt net maaş · Almanya 2026",
  uk: "Зарплата брутто нетто · Німеччина 2026",
};

function eyebrowFor(p, rubrik, h1 = "") {
  if (p === "/") return "Brutto Netto Rechner";
  if (/-euro-netto-in-brutto$/.test(p)) return "Netto in Brutto 2026";
  if (/-euro-jahresgehalt-brutto-netto$/.test(p)) return "Jahresgehalt 2026";
  if (/^\/rechner\/\d+-euro-brutto-netto/.test(p)) return "Brutto in Netto 2026";
  if (p.startsWith("/krankenkasse/")) return "Krankenkasse 2026";
  if (p.startsWith("/tvoed/")) return "TVöD 2026";
  if (p.startsWith("/brutto-netto/")) return "Gehalt nach Branche";
  if (p.startsWith("/brutto-netto-rechner/")) return "Brutto Netto nach Bundesland";
  if (/oesterreich/.test(p)) return "Österreich";
  if (langOf(p) !== "de") return { en: "Germany", pl: "Niemcy", ro: "Germania", tr: "Almanya", uk: "Німеччина" }[langOf(p)];
  if (rubrik && rubrik !== "Startseite" && rubrik.length <= 34) return rubrik;
  return /2027/.test(p) || /2027/.test(h1) ? "Rechner 2027" : "Rechner 2026";
}

const eur = (n) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
const clip = (s, n) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)).replace(/[,;:–—-]$/, "") + " …");

/**
 * Gehaltsseiten bekommen statt Beschreibungstext die echte Aufteilung.
 * Annahmen wie auf den Seiten: 2026, ohne Kirchensteuer, kinderlos ab 23.
 */
function salaryData(p) {
  const base = { jahr: 2026, verheiratet: false, kinderlosUeber23: true, kirche: false };
  let m;
  if ((m = /^\/rechner\/(\d+)-euro-netto-in-brutto$/.exec(p))) {
    const netto = +m[1];
    const r = solveBruttoForNetto({ ...base, steuerklasse: 1, nettoMonatZiel: netto });
    return { big: eur(r.bruttoMonat), bigLabel: `brutto nötig für ${netto.toLocaleString("de-DE")} € netto (Steuerklasse I)`, r: r.forward };
  }
  if ((m = /^\/rechner\/(\d+)-euro-jahresgehalt-brutto-netto$/.exec(p))) {
    const r = calculateNetto({ ...base, steuerklasse: 1, bruttoMonat: +m[1] / 12 });
    return { big: eur(r.nettoJahr), bigLabel: "netto im Jahr (Steuerklasse I)", r, jahr: true };
  }
  if ((m = /^\/rechner\/(\d+)-euro-brutto-netto(?:-steuerklasse-([1-6]))?$/.exec(p))) {
    const sk = m[2] ? +m[2] : 1;
    const r = calculateNetto({ ...base, steuerklasse: sk, verheiratet: sk === 3 || sk === 4 || sk === 5, bruttoMonat: +m[1] });
    return { big: eur(r.nettoMonat), bigLabel: `netto im Monat (Steuerklasse ${["", "I", "II", "III", "IV", "V", "VI"][sk]})`, r };
  }
  return null;
}

const div = (style, children) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });

function header(eyebrow) {
  return div({ alignItems: "center" }, [
    div({ width: 10, height: 42, backgroundColor: BRAND, borderRadius: 4, marginRight: 18 }),
    div({ fontSize: 25, fontWeight: 700, color: BRAND, letterSpacing: 1.5 }, eyebrow.toUpperCase()),
  ]);
}

function footer(lang) {
  return div({ justifyContent: "space-between", alignItems: "flex-end", width: "100%" }, [
    div({ fontSize: 22, color: MUTED }, TAGLINE[lang]),
    div({ fontSize: 27, fontWeight: 700, color: INK }, "bruttonettocalculator.com"),
  ]);
}

function titleStyle(t) {
  return { fontSize: t.length > 70 ? 50 : t.length > 48 ? 58 : 68, fontWeight: 700, color: INK, lineHeight: 1.12, letterSpacing: -1.2, maxWidth: 1056 };
}

function genericCard({ eyebrow, title, desc, lang }) {
  return div(
    { width: "100%", height: "100%", flexDirection: "column", justifyContent: "space-between", backgroundColor: PAPER, fontFamily: "Noto Sans", padding: "60px 72px", position: "relative" },
    [
      // Dekor: rote Lichtfläche oben rechts, wie im Seiten-Hero
      div({ position: "absolute", top: -180, right: -160, width: 520, height: 520, borderRadius: 260, backgroundImage: "radial-gradient(circle, rgba(230,10,28,0.16), rgba(230,10,28,0))" }),
      header(eyebrow),
      div({ flexDirection: "column" }, [
        div(titleStyle(title), clip(title, 96)),
        desc ? div({ fontSize: 27, color: MUTED, lineHeight: 1.4, marginTop: 22, maxWidth: 1000 }, clip(desc, 150)) : div({}),
      ]),
      footer(lang),
    ],
  );
}

function salaryCard({ eyebrow, title, data }) {
  const { r } = data;
  const k = data.jahr ? 1 : 1 / 12; // Monats- bzw. Jahreswerte, passend zur Seite
  const netto = data.jahr ? r.nettoJahr : r.nettoMonat;
  const steuer = r.steuer.summeJahr * k;
  const sv = r.sv.summeJahr * k;
  const total = netto + steuer + sv;
  const W = 1056;
  const seg = (v, color) => div({ width: Math.max(4, Math.round((v / total) * W)), height: 54, backgroundColor: color });
  const legend = (color, label, v) =>
    div({ alignItems: "center", marginRight: 34 }, [
      div({ width: 18, height: 18, borderRadius: 9, backgroundColor: color, marginRight: 10 }),
      div({ fontSize: 23, color: MUTED, marginRight: 8 }, label),
      div({ fontSize: 23, fontWeight: 700, color: INK }, eur(v)),
    ]);

  return div(
    { width: "100%", height: "100%", flexDirection: "column", justifyContent: "space-between", backgroundColor: PAPER, fontFamily: "Noto Sans", padding: "56px 72px" },
    [
      header(eyebrow),
      div({ flexDirection: "column" }, [
        div({ ...titleStyle(title), fontSize: 50 }, clip(title, 70)),
        div({ alignItems: "flex-end", marginTop: 18 }, [
          div({ fontSize: 76, fontWeight: 700, color: BRAND, lineHeight: 1 }, data.big),
          div({ fontSize: 26, color: MUTED, marginLeft: 18, marginBottom: 8 }, data.bigLabel),
        ]),
        div({ marginTop: 30, borderRadius: 14, overflow: "hidden", width: W }, [seg(netto, GREEN), seg(steuer, BRAND), seg(sv, GREY)]),
        div({ marginTop: 18 }, [legend(GREEN, "Netto", netto), legend(BRAND, "Steuern", steuer), legend(GREY, "Sozialabgaben", sv)]),
      ]),
      footer("de"),
    ],
  );
}

async function render(tree, out) {
  const svg = await satori(tree, { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  fs.writeFileSync(out, png);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/")
    .filter((p) => !EXCLUDE.some((re) => re.test(p)))
    // ONLY=/a,/b — einzelne Seiten zum Testen (Manifeste bleiben dann unangetastet)
    .filter((p) => !process.env.ONLY || process.env.ONLY.split(",").includes(p));

  const manifest = {};
  let written = 0, skipped = 0, failed = 0;
  const CONC = 6;
  for (let i = 0; i < paths.length; i += CONC) {
    await Promise.all(
      paths.slice(i, i + CONC).map(async (p) => {
        try {
          const res = await fetch(BASE + p);
          if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
          const { h1, desc, rubrik } = extract(await res.text());
          if (!h1) throw new Error("keine H1");
          manifest[p] = h1;
          const out = path.join(OUT_DIR, `${slugFor(p)}.png`);
          if (fs.existsSync(out) && !FORCE) { skipped++; return; }
          const eyebrow = eyebrowFor(p, rubrik, h1);
          const data = salaryData(p);
          await render(data ? salaryCard({ eyebrow, title: h1, data }) : genericCard({ eyebrow, title: h1, desc, lang: langOf(p) }), out);
          written++;
        } catch (e) {
          failed++;
          console.error(`✗ ${p}: ${e.message}`);
        }
      }),
    );
    process.stdout.write(`\r  ${Math.min(i + CONC, paths.length)}/${paths.length}`);
  }

  if (process.env.ONLY) { console.log(`
${written} erzeugt (ONLY — Manifeste nicht geschrieben)`); return; }
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 0) + "\n");
  // Client-Manifest ohne /rechner/*: diese ~380 Seiten leitet <PageFigure> per Regel ab,
  // damit nicht jede Seite das ganze Manifest im JS-Bundle mitlädt.
  const client = Object.fromEntries(Object.entries(sorted).filter(([p]) => !AMOUNT_PAGE.test(p)));
  fs.writeFileSync(MANIFEST_CLIENT, JSON.stringify(client, null, 0) + "\n");

  console.log(`\n${written} erzeugt, ${skipped} vorhanden, ${failed} Fehler — ${Object.keys(sorted).length} Seiten im Manifest`);
  if (failed) process.exit(1);
}

main();
