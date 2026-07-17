import Link from "next/link";
import { ArrowRight, BookOpen, Calculator } from "lucide-react";
import { dbQuery, Article } from "@/lib/db";

/**
 * Reusable "Ähnliche Artikel" block for blog articles.
 *
 * Fixes the Semrush "only one internal link" warning: every article now links
 * out to 2–3 genuinely related, *published* posts plus the most relevant
 * calculator, using descriptive German anchor text (the article headline), not
 * generic "mehr"/"weiterlesen" anchors. Rendered once per page.
 */
export default async function RelatedArticles({
  currentSlug,
  category,
}: {
  currentSlug: string;
  category?: string;
}) {
  let related: Article[] = [];

  try {
    // Prefer same-category articles, then backfill with the newest others.
    if (category) {
      const sameCat = await dbQuery<Article[]>(
        "SELECT slug, headline, excerpt, category, read_time FROM articles WHERE status = 'Published' AND slug != ? AND category = ? ORDER BY created_at DESC LIMIT 3",
        [currentSlug, category]
      );
      related = Array.isArray(sameCat) ? sameCat : [];
    }
    if (related.length < 3) {
      const backfill = await dbQuery<Article[]>(
        "SELECT slug, headline, excerpt, category, read_time FROM articles WHERE status = 'Published' AND slug != ? ORDER BY created_at DESC LIMIT 6",
        [currentSlug]
      );
      const seen = new Set([currentSlug, ...related.map((r) => r.slug)]);
      for (const art of Array.isArray(backfill) ? backfill : []) {
        if (related.length >= 3) break;
        if (!seen.has(art.slug)) {
          related.push(art);
          seen.add(art.slug);
        }
      }
    }
  } catch (err) {
    console.error("❌ RelatedArticles fetch error:", err);
  }

  // Defensive filter (the offline fallback store may return the current post).
  related = related.filter((r) => r.slug && r.slug !== currentSlug).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-black/[0.08]" aria-labelledby="related-heading">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={18} className="text-[#E60A1C]" />
        <h2 id="related-heading" className="font-display font-black text-2xl sm:text-3xl tracking-tight text-[#16181D]">
          Ähnliche Artikel
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {related.map((art) => (
          <Link
            key={art.slug}
            href={`/blog/${art.slug}`}
            className="group flex flex-col justify-between bg-[#FFFFFF] hover:bg-[#F1F3F5] border border-black/[0.08] hover:border-[#E60A1C]/40 rounded-2xl p-5 shadow-sm transition-all"
          >
            <div>
              {art.category && (
                <span className="inline-block mb-2 text-[10px] font-bold uppercase tracking-wider text-[#FF2E44]">
                  {art.category}
                </span>
              )}
              <h3 className="font-bold text-base text-[#16181D] leading-snug mb-2 line-clamp-3 group-hover:text-[#FF2E44] transition-colors">
                {art.headline}
              </h3>
              {art.excerpt && (
                <p className="text-xs text-black/55 leading-relaxed line-clamp-2">{art.excerpt}</p>
              )}
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#E60A1C]">
              Artikel lesen <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </div>

      {/* Link to the most relevant calculator (descriptive anchor). */}
      <div className="mt-6">
        <Link
          href="/rechner/brutto-zu-netto"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#16181D] hover:text-[#E60A1C] transition-colors"
        >
          <Calculator size={16} className="text-[#E60A1C]" />
          Passenden Brutto-Netto-Rechner öffnen
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
