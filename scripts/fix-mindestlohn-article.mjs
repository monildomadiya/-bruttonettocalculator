/**
 * One-off content migration — rewrites the "brutto-netto-rechner-2026-mindestlohn-2027"
 * blog article into clean, professional, consistent German and removes all
 * editorial placeholders / mixed-language leftovers (Task 5 of the SEO brief).
 *
 * The article body lives in the MySQL `articles` table, not in the repository,
 * so this cannot be fixed by editing a file — it has to be applied against the
 * database. Run it once on a host that can reach the DB directly, e.g. the
 * production server where localhost:3306 IS the database:
 *
 *     node scripts/fix-mindestlohn-article.mjs
 *
 * It reads the same DB_* env vars as the app (.env / .env.local). Nothing is
 * deleted; only the single article row is UPDATEd by slug. It is idempotent.
 *
 * (If the DB is only reachable by the running Next app and not by a standalone
 * process, use scripts/apply-mindestlohn-via-api.mjs instead.)
 */
import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SLUG, CANONICAL, HEADLINE, META_TITLE, META_DESCRIPTION, EXCERPT,
  FOCUS_KEYWORD, TAGS, CONTENT, FAQS,
} from "./mindestlohn-article-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load DB_* vars from .env / .env.local without adding a dotenv dependency.
for (const file of [".env", ".env.local"]) {
  const p = path.join(__dirname, "..", file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 2,
  });

  try {
    const [existing] = await pool.query("SELECT id FROM articles WHERE slug = ? LIMIT 1", [SLUG]);
    if (!Array.isArray(existing) || existing.length === 0) {
      console.error(`❌ No article found with slug "${SLUG}". Aborting (nothing updated).`);
      process.exitCode = 1;
      return;
    }

    const [res] = await pool.query(
      `UPDATE articles SET
         headline = ?, meta_title = ?, meta_description = ?, excerpt = ?,
         focus_keyword = ?, tags = ?, canonical_url = ?, enable_toc = ?,
         content = ?, faqs = ?, og_title = ?, og_description = ?, status = 'Published'
       WHERE slug = ?`,
      [
        HEADLINE, META_TITLE, META_DESCRIPTION, EXCERPT, FOCUS_KEYWORD, TAGS,
        CANONICAL, 1, CONTENT, JSON.stringify(FAQS), META_TITLE, META_DESCRIPTION, SLUG,
      ]
    );
    console.log(`✅ Updated article "${SLUG}" — affectedRows: ${res.affectedRows}`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("❌ Migration failed:", err.code || err.message);
  process.exitCode = 1;
});
