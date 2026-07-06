import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbQuery, Article } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const isId = !isNaN(Number(slug));
    const query = isId 
      ? "SELECT * FROM articles WHERE slug = ? OR id = ? LIMIT 1"
      : "SELECT * FROM articles WHERE slug = ? LIMIT 1";
    const sqlParams = isId ? [slug, Number(slug)] : [slug];
    
    const articles = await dbQuery<Article[]>(query, sqlParams);

    if (!articles || articles.length === 0) {
      return NextResponse.json({ success: false, error: "Artikel nicht gefunden." }, { status: 404 });
    }

    const art = articles[0];
    const formatted = {
      ...art,
      faqs: typeof art.faqs === "string" ? tryParseJson(art.faqs) : art.faqs || [],
      enable_toc: Boolean(art.enable_toc),
    };

    return NextResponse.json({ success: true, article: formatted });
  } catch (err: any) {
    console.error(`❌ GET /api/articles/${params.slug} error:`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get("admin_session");
    if (!session || session.value !== "authenticated_secret_token_2026") {
      return NextResponse.json({ success: false, error: "Nicht autorisiert. Bitte im Admin Center einloggen." }, { status: 401 });
    }

    const { slug } = params;
    const body: Article = await req.json();

    const faqsStr = typeof body.faqs === "string" ? body.faqs : JSON.stringify(body.faqs || []);

    const isId = !isNaN(Number(slug));
    const sql = isId ? `
      UPDATE articles SET
        headline = ?, slug = ?, category = ?, tags = ?, excerpt = ?,
        meta_title = ?, meta_description = ?, focus_keyword = ?, canonical_url = ?,
        featured_image = ?, featured_image_alt = ?, featured_image_caption = ?,
        enable_toc = ?, content = ?, faqs = ?, og_title = ?, og_description = ?,
        og_image = ?, status = ?, read_time = ?
      WHERE slug = ? OR id = ?
    ` : `
      UPDATE articles SET
        headline = ?, slug = ?, category = ?, tags = ?, excerpt = ?,
        meta_title = ?, meta_description = ?, focus_keyword = ?, canonical_url = ?,
        featured_image = ?, featured_image_alt = ?, featured_image_caption = ?,
        enable_toc = ?, content = ?, faqs = ?, og_title = ?, og_description = ?,
        og_image = ?, status = ?, read_time = ?
      WHERE slug = ?
    `;

    const sqlParams = [
      body.headline,
      body.slug || slug,
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
    ];
    
    if (isId) {
      sqlParams.push(slug, Number(slug));
    } else {
      sqlParams.push(slug);
    }

    await dbQuery(sql, sqlParams);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`❌ PUT /api/articles/${params.slug} error:`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get("admin_session");
    if (!session || session.value !== "authenticated_secret_token_2026") {
      return NextResponse.json({ success: false, error: "Nicht autorisiert. Bitte im Admin Center einloggen." }, { status: 401 });
    }

    const { slug } = params;
    const isId = !isNaN(Number(slug));
    
    if (isId) {
      await dbQuery("DELETE FROM articles WHERE slug = ? OR id = ?", [slug, Number(slug)]);
    } else {
      await dbQuery("DELETE FROM articles WHERE slug = ?", [slug]);
    }
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`❌ DELETE /api/articles/${params.slug} error:`, err);
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
