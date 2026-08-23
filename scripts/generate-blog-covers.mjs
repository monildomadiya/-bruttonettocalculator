/**
 * Erzeugt pro Ratgeber-Artikel ein Titelbild (1200 × 630 PNG) unter
 * public/blog-cover/<slug>.png.
 *
 * WARUM ES DIESES SKRIPT GIBT
 * Google Discover ist ein bildgetriebener Feed. Für die große Bilddarstellung
 * verlangt Google ein Bild von mindestens 1200 px Breite zusammen mit der
 * Direktive `max-image-preview:large`. Die Direktive war gesetzt, aber kein
 * Beitrag hatte ein Bild (`featured_image` war fest ""), und das globale
 * og-image.png ist 1024 × 1024 — zu schmal und quadratisch. Der Ratgeber war
 * damit für Discover praktisch nicht darstellbar.
 *
 * WARUM ALS SKRIPT UND NICHT ALS ROUTE
 * Ein `ImageResponse`-Routehandler (next/og) wäre eleganter, ist aber auf
 * dieser Windows-Toolchain nicht lauffähig: Das in Next gebündelte @vercel/og
 * baut beim Import den Pfad zur Standardschrift falsch zusammen
 * ("./file:\C:\...") und wirft ERR_INVALID_URL — das bricht den gesamten Build.
 * Statisch vorgenerierte PNGs sind hier ohnehin die robustere Lösung: keine
 * Funktion zur Laufzeit, gewöhnliche Dateien, die Googlebot-Image direkt
 * abrufen kann, und keine Abhängigkeit davon, ob der Deploy-Host rastern kann.
 *
 * AUSFÜHREN
 *   npm run blog:covers
 * Nach jedem neuen Artikel einmal laufen lassen und das PNG mitcommitten.
 * Bereits vorhandene Bilder werden nur mit --force überschrieben.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content", "blog");
const OUT_DIR = path.join(ROOT, "public", "blog-cover");
const FONT_DIR = path.join(ROOT, "assets", "fonts");

const FORCE = process.argv.includes("--force");

const BRAND = "#E60A1C";
const INK = "#16181D";
const PAPER = "#F4F5F7";
const MUTED = "#6B7280";

const fontRegular = fs.readFileSync(path.join(FONT_DIR, "NotoSans-Regular.ttf"));
const fontBold = fs.readFileSync(path.join(FONT_DIR, "NotoSans-Bold.ttf"));

/** Alle Artikel laden. Node strippt die Typannotationen selbst (Node ≥ 22.18). */
async function loadPosts() {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts");

  const posts = [];
  for (const file of files) {
    const url = new URL(`file://${path.join(CONTENT_DIR, file).replace(/\\/g, "/")}`);
    const mod = await import(url.href);
    if (mod.post?.slug) posts.push(mod.post);
  }
  return posts;
}

/**
 * Wählt die Kennzahl fürs Titelbild.
 *
 * Im Feed entscheidet die Zahl über den Tap — ein Paragrafenzitat
 * ("§ 9 Abs. 1 Satz 3 EStG") ist als Blickfang wertlos. Bevorzugt werden
 * deshalb kurze Werte mit einer echten Zahl und Einheit (€, %, Cent, km);
 * Rechtsgrundlagen fallen ans Ende.
 */
function pickFact(post) {
  const facts = (post.keyFacts ?? []).filter((f) => f?.value);
  if (facts.length === 0) return undefined;

  const isCitation = (f) =>
    /^§/.test(f.value.trim()) ||
    /rechtsgrundlage|paragraf|gesetz|norm/i.test(f.label ?? "");
  const hasNumber = (f) => /\d/.test(f.value) && /[€%]|cent|km|monat|jahr/i.test(f.value);

  const score = (f) => {
    let s = 0;
    if (isCitation(f)) s -= 100;
    if (hasNumber(f)) s += 50;
    if (f.value.length <= 24) s += 20;
    else if (f.value.length <= 30) s += 8;
    else s -= 15;
    return s;
  };

  return [...facts].sort((a, b) => score(b) - score(a))[0];
}

function template(post) {
  const headline = post.headline;
  const fact = pickFact(post);

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: PAPER,
        fontFamily: "Noto Sans",
        padding: "64px 72px",
      },
      children: [
        // Kopfzeile: Markenbalken + Kategorie
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    width: 10,
                    height: 44,
                    backgroundColor: BRAND,
                    borderRadius: 4,
                    marginRight: 18,
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontSize: 26,
                    fontWeight: 700,
                    color: BRAND,
                    letterSpacing: 1,
                  },
                  children: post.category.toUpperCase(),
                },
              },
            ],
          },
        },

        // Headline
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              fontSize: headline.length > 78 ? 54 : headline.length > 58 ? 62 : 72,
              fontWeight: 700,
              color: INK,
              lineHeight: 1.14,
              letterSpacing: -1.5,
              maxWidth: 1010,
            },
            children: headline,
          },
        },

        // Fußzeile: Kennzahl links, Absender rechts
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              width: "100%",
            },
            children: [
              fact
                ? {
                    type: "div",
                    props: {
                      style: { display: "flex", flexDirection: "column", maxWidth: 560 },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: { display: "flex", fontSize: 24, color: MUTED, marginBottom: 8 },
                            children: fact.label,
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              // Lange Werte sonst zweizeilig bis in den Absender hinein
                              fontSize: fact.value.length > 22 ? 40 : fact.value.length > 16 ? 48 : 56,
                              fontWeight: 700,
                              color: BRAND,
                              lineHeight: 1.1,
                            },
                            children: fact.value,
                          },
                        },
                      ],
                    },
                  }
                : { type: "div", props: { style: { display: "flex" } } },
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", fontSize: 28, fontWeight: 700, color: INK },
                        children: "bruttonettocalculator.com",
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", fontSize: 21, color: MUTED, marginTop: 6 },
                        children: "Gehalt, Steuern & Sozialabgaben 2026",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const posts = await loadPosts();
  if (posts.length === 0) {
    console.error("Keine Artikel gefunden — Abbruch.");
    process.exit(1);
  }

  let written = 0;
  let skipped = 0;

  for (const post of posts) {
    const out = path.join(OUT_DIR, `${post.slug}.png`);
    if (fs.existsSync(out) && !FORCE) {
      skipped++;
      continue;
    }

    const svg = await satori(template(post), {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Noto Sans", data: fontRegular, weight: 400, style: "normal" },
        { name: "Noto Sans", data: fontBold, weight: 700, style: "normal" },
      ],
    });

    const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
    fs.writeFileSync(out, png);
    written++;
    console.log(`  ✓ ${post.slug}.png  (${(png.length / 1024).toFixed(0)} kB)`);
  }

  console.log(
    `\n${written} Titelbild(er) erzeugt, ${skipped} übersprungen (bereits vorhanden).` +
      (skipped && !FORCE ? " Mit --force neu erzeugen." : "")
  );
}

main().catch((err) => {
  console.error("Fehler beim Erzeugen der Titelbilder:", err);
  process.exit(1);
});
