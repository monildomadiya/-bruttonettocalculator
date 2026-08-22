#!/usr/bin/env node
/**
 * indexnow-submit.mjs — meldet URLs per IndexNow an Bing/Yandex/Seznam.
 *
 * Warum: Google kennt kein IndexNow, Bing schon — und der Bing-Index speist
 * Microsoft Copilot. Neue Ratgeber sind darüber oft in Stunden statt Wochen
 * auffindbar. Für Google bleibt die Sitemap plus die interne Verlinkung der
 * Weg; beides passiert automatisch, sobald ein Artikel registriert ist.
 *
 *   node scripts/indexnow-submit.mjs            # alle Blog-URLs + /blog
 *   node scripts/indexnow-submit.mjs --all      # zusätzlich die Sitemap-URLs
 *   node scripts/indexnow-submit.mjs --dry      # nur anzeigen, nichts senden
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const HOST = "bruttonettocalculator.com";
const KEY = "33af1b0483f517023972479ca06917c5";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

/** Slugs direkt aus den Artikeldateien lesen — keine Laufzeit, kein Build nötig. */
function blogUrls() {
  const dir = path.join(ROOT, "content", "blog");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .map((f) => `https://${HOST}/blog/${f.replace(/\.ts$/, "")}`);
}

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry");

  const urls = [`https://${HOST}/blog`, ...blogUrls()];

  if (args.includes("--all")) {
    // Sitemap der Live-Seite dazunehmen (nur sinnvoll nach dem Deploy).
    try {
      const res = await fetch(`https://${HOST}/sitemap.xml`);
      const xml = await res.text();
      for (const m of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
        if (!urls.includes(m[1])) urls.push(m[1]);
      }
    } catch (err) {
      console.warn("⚠️  Sitemap konnte nicht geladen werden:", err.message);
    }
  }

  console.log(`📤 ${urls.length} URLs für IndexNow:`);
  for (const u of urls) console.log("  " + u);

  if (dry) {
    console.log("\n(--dry: nichts gesendet)");
    return;
  }

  // Der Schlüssel muss unter KEY_LOCATION erreichbar sein, sonst lehnt der
  // Dienst die Übermittlung ab. Vor dem Senden einmal prüfen — ein 403 nach
  // dem Absenden sagt nicht, woran es lag.
  try {
    const keyRes = await fetch(KEY_LOCATION);
    if (!keyRes.ok) {
      console.error(`❌ Schlüsseldatei nicht erreichbar (${keyRes.status}): ${KEY_LOCATION}`);
      console.error("   Deploy zuerst — public/<key>.txt muss live sein.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Schlüsseldatei nicht prüfbar:", err.message);
    process.exit(1);
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
  });

  // 200 und 202 gelten beide als Annahme; 202 heißt "Schlüssel wird geprüft".
  if (res.status === 200 || res.status === 202) {
    console.log(`\n✅ ${res.status} — ${urls.length} URLs angenommen.`);
  } else {
    console.error(`\n❌ ${res.status} ${res.statusText}`);
    console.error(await res.text());
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
