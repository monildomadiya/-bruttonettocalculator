/**
 * IndexNow ping (Bing, Yandex, Seznam — Bing also feeds Copilot). Called after
 * an infographic is published, changed or deleted, so those engines recrawl it
 * within hours instead of waiting for the sitemap. Google does not use
 * IndexNow; it picks the page up from the sitemap.
 *
 * Same key as scripts/indexnow-submit.mjs; the key file is public/<KEY>.txt.
 */
const HOST = "bruttonettocalculator.com";
const KEY = "33af1b0483f517023972479ca06917c5";

/** Fire-and-forget: a failed ping must never fail the save that triggered it. */
export async function pingIndexNow(paths: string[]): Promise<void> {
  if (process.env.NODE_ENV !== "production" || paths.length === 0) return;
  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `https://${HOST}/${KEY}.txt`,
        urlList: paths.map((p) => `https://${HOST}${p}`),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error("[indexnow]", err);
  }
}
