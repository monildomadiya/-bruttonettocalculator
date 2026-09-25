import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import PostGrid from "@/components/PostGrid";
import { getPublishedPosts } from "@/lib/postsStore";

/**
 * "Neueste Infografiken" teaser for high-traffic pages (homepage, Ratgeber):
 * crawlable links into the gallery and one more reason to click on.
 * Renders nothing until the first post exists.
 */
export default async function LatestPosts({ count = 6 }: { count?: number }) {
  const posts = (await getPublishedPosts()).slice(0, count);
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 sm:pb-20">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E60A1C]">
            <Images size={14} /> Infografiken
          </p>
          <h2 className="font-display text-2xl font-extrabold text-[#16181D] sm:text-3xl">
            Auf einen Blick: die wichtigsten Zahlen
          </h2>
        </div>
        <Link
          href="/infografiken"
          className="hidden flex-shrink-0 items-center gap-1.5 text-sm font-bold text-[#E60A1C] hover:underline sm:inline-flex"
        >
          Alle Infografiken <ArrowRight size={14} />
        </Link>
      </div>
      <PostGrid filter={false} posts={posts.map(({ slug, title, category, image }) => ({ slug, title, category, image }))} />
      <p className="mt-5 text-center sm:hidden">
        <Link href="/infografiken" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E60A1C]">
          Alle Infografiken <ArrowRight size={14} />
        </Link>
      </p>
    </section>
  );
}
