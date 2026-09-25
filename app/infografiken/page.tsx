import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Images } from "lucide-react";
import PostGrid from "@/components/PostGrid";
import { postImagePath } from "@/lib/posts";
import { getPublishedPosts } from "@/lib/postsStore";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Infografiken: Gehalt, Steuern & Sozialabgaben auf einen Blick";
const DESCRIPTION =
  "Infografiken zu Nettogehalt, Lohnsteuer, Krankenkasse, Rente und Sozialabgaben — die wichtigsten Zahlen 2026/2027 kompakt erklärt, mit passendem Rechner.";

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPublishedPosts();
  const cover = posts[0] ? `${SITE_URL}${postImagePath(posts[0], "og")}` : `${SITE_URL}/og-image.png`;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `${SITE_URL}/infografiken` },
    // An empty gallery is a thin page — keep it out of the index until it has content.
    robots: posts.length
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
      : { index: false, follow: true },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}/infografiken`,
      type: "website",
      images: [cover],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [cover] },
  };
}

export default async function InfografikenPage() {
  const posts = await getPublishedPosts();
  const categories = new Set(posts.map((p) => p.category));

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}/infografiken`,
      inLanguage: "de-DE",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: posts.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/infografiken/${p.slug}`,
          name: p.title,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Infografiken", item: `${SITE_URL}/infografiken` },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-black/55">
        <Link href="/" className="hover:text-[#16181D]">Startseite</Link>
        <ChevronRight size={14} />
        <span className="font-medium text-[#16181D]">Infografiken</span>
      </nav>

      {/* Profile header */}
      <header className="mb-8 flex items-center gap-5 sm:mb-10 sm:gap-8">
        <div
          className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full p-[3px] sm:h-28 sm:w-28"
          style={{ background: "conic-gradient(from 210deg, #E60A1C, #FF6A00, #FFC400, #FF6A00, #E60A1C)" }}
        >
          <span className="flex h-full w-full items-center justify-center rounded-full bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.png?v=7" alt="" className="h-3/5 w-3/5 object-contain" />
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-extrabold leading-tight text-[#16181D] sm:text-4xl">
            Infografiken
          </h1>
          <p className="mt-1 text-sm text-black/60">
            <strong className="text-[#16181D]">{posts.length}</strong> Beiträge ·{" "}
            <strong className="text-[#16181D]">{categories.size}</strong> Themen
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/70 sm:text-base">
            Gehalt, Steuern und Sozialabgaben in Bildern — jede Grafik mit Erklärung und dem passenden Rechner.
          </p>
        </div>
      </header>

      {posts.length ? (
        <PostGrid
          posts={posts.map(({ slug, title, category, image }) => ({ slug, title, category, image }))}
        />
      ) : (
        <div className="rounded-3xl border border-dashed border-black/15 bg-white px-6 py-16 text-center">
          <Images size={36} className="mx-auto mb-3 text-[#E60A1C]" />
          <p className="font-semibold text-[#16181D]">Die ersten Infografiken erscheinen in Kürze.</p>
          <p className="mt-1 text-sm text-black/60">
            Bis dahin: <Link href="/blog" className="font-semibold text-[#E60A1C] hover:underline">zum Ratgeber</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
