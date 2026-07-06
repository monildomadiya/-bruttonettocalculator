import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbQuery, Article } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let sql = "SELECT * FROM articles ORDER BY created_at DESC";
    let params: any[] = [];

    if (status) {
      sql = "SELECT * FROM articles WHERE status = ? ORDER BY created_at DESC";
      params.push(status);
    }

    const articles = await dbQuery<Article[]>(sql, params);

    // Parse JSON fields if necessary
    const formatted = articles.map((art) => ({
      ...art,
      faqs: typeof art.faqs === "string" ? tryParseJson(art.faqs) : art.faqs || [],
      enable_toc: Boolean(art.enable_toc),
    }));

    return NextResponse.json({ success: true, articles: formatted });
  } catch (err: any) {
    console.error("❌ GET /api/articles error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get("admin_session");
    if (!session || session.value !== "authenticated_secret_token_2026") {
      return NextResponse.json({ success: false, error: "Nicht autorisiert. Bitte im Admin Center einloggen." }, { status: 401 });
    }

    const body: Article = await req.json();

    if (!body.headline || !body.slug) {
      return NextResponse.json({ success: false, error: "Headline und Slug sind erforderlich." }, { status: 400 });
    }

    const faqsStr = typeof body.faqs === "string" ? body.faqs : JSON.stringify(body.faqs || []);

    const sql = `
      INSERT INTO articles (
        headline, slug, category, tags, excerpt, meta_title, meta_description,
        focus_keyword, canonical_url, featured_image, featured_image_alt,
        featured_image_caption, enable_toc, content, faqs, og_title,
        og_description, og_image, status, read_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      body.headline,
      body.slug,
      body.category || "",
      body.tags || "",
      body.excerpt || "",
      body.meta_title || body.headline,
      body.meta_description || body.excerpt || "",
      body.focus_keyword || "",
      body.canonical_url || "",
      body.featured_image || "",
      body.featured_image_alt || "",
      body.featured_image_caption || "",
      body.enable_toc !== undefined ? body.enable_toc : true,
      body.content || "",
      faqsStr,
      body.og_title || body.meta_title || body.headline,
      body.og_description || body.meta_description || body.excerpt || "",
      body.og_image || body.featured_image || "",
      body.status || "Published",
      body.read_time || "3 min read",
    ];

    const result = await dbQuery(sql, params);

    return NextResponse.json({ success: true, insertId: result.insertId || Date.now() });
  } catch (err: any) {
    console.error("❌ POST /api/articles error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

function tryParseJson(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}
