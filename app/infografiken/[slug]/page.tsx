import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calculator, ChevronRight } from "lucide-react";
import PostActions from "@/components/PostActions";
import PostBody from "@/components/PostBody";
import PostGrid from "@/components/PostGrid";
import { allCalculatorLinks } from "@/lib/navigation";
import { formatPostDate, postImagePath, postImageSize } from "@/lib/posts";
import { getPublishedPost, getPublishedPosts, relatedPosts } from "@/lib/postsStore";
import { ORG_ID, SITE_URL } from "@/lib/seo";

/** Posts that exist at build time are prerendered; new ones render on first request. */
export async function generateStaticParams() {
  return (await getPublishedPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPublishedPost(params.slug);
  if (!post) return { title: "Infografik nicht gefunden", robots: { index: false } };

  const url = `${SITE_URL}/infografiken/${post.slug}`;
  const og = { url: `${SITE_URL}${postImagePath(post, "og")}`, ...postImageSize(post.image, "og"), alt: post.image.alt };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: post.category,
      images: [og],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [og.url] },
  };
}

export default async function InfografikPage({ params }: { params: { slug: string } }) {
  const all = await getPublishedPosts();
  const index = all.findIndex((p) => p.slug === params.slug);
  if (index < 0) notFound();

  const post = all[index];
  const newer = all[index - 1];
  const older = all[index + 1];
  const related = relatedPosts(all, post);
  const tool = allCalculatorLinks.find((t) => t.href === post.calculator);

  const url = `${SITE_URL}/infografiken/${post.slug}`;
  const full = postImageSize(post.image, "full");
  const imageUrl = `${SITE_URL}${postImagePath(post, "full")}`;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.description,
      url,
      mainEntityOfPage: url,
      inLanguage: "de-DE",
      articleSection: post.category,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      image: {
        "@type": "ImageObject",
        contentUrl: imageUrl,
        url: imageUrl,
        width: full.width,
        height: full.height,
        caption: post.image.alt,
        creditText: "BruttoNettoCalculator.com",
        creator: { "@id": ORG_ID },
        copyrightNotice: "BruttoNettoCalculator.com",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Infografiken", item: `${SITE_URL}/infografiken` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <nav aria-label="Breadcrumb" className="mb-6 flex min-w-0 items-center gap-1.5 text-sm text-black/55">
        <Link href="/" className="flex-shrink-0 hover:text-[#16181D]">Startseite</Link>
        <ChevronRight size={14} className="flex-shrink-0" />
        <Link href="/infografiken" className="flex-shrink-0 hover:text-[#16181D]">Infografiken</Link>
        <ChevronRight size={14} className="flex-shrink-0" />
        <span className="truncate font-medium text-[#16181D]">{post.title}</span>
      </nav>

      <article className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-12">
        {/* ── Instagram-style card ── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <figure className="overflow-hidden rounded-3xl border border-black/[0.08] bg-white shadow-sm">
            <figcaption className="flex items-center gap-3 px-4 py-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full p-[2px]"
                style={{ background: "conic-gradient(from 210deg, #E60A1C, #FF6A00, #FFC400, #FF6A00, #E60A1C)" }}
              >
                <span className="flex h-full w-full items-center justify-center rounded-full bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/favicon.png?v=7" alt="" className="h-4/6 w-4/6 object-contain" />
                </span>
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block text-sm font-semibold text-[#16181D]">BruttoNettoCalculator</span>
                <span className="block text-xs text-black/55">{post.category}</span>
              </span>
            </figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element -- resized by Cloudinary, served from /bilder */}
            <img
              src={postImagePath(post, "full")}
              alt={post.image.alt}
              width={full.width}
              height={full.height}
              className="block h-auto w-full bg-[#ECEEF1]"
            />
            <div className="border-t border-black/[0.08]">
              <PostActions
                slug={post.slug}
                title={post.title}
                url={url}
                imageUrl={imageUrl}
                alt={post.image.alt}
                width={full.width}
                height={full.height}
              />
            </div>
          </figure>
        </div>

        {/* ── Text ── */}
        <div className="min-w-0">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#E60A1C]">{post.category}</p>
          <h1 className="font-display text-3xl font-black leading-tight tracking-tight text-[#16181D] sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-black/55">
            Redaktion BruttoNettoCalculator ·{" "}
            <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
            {post.updatedAt.slice(0, 10) !== post.publishedAt.slice(0, 10) && (
              <> · aktualisiert <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt)}</time></>
            )}
          </p>
          <p className="mt-5 text-lg leading-relaxed text-black/75">{post.description}</p>

          {post.facts.length > 0 && (
            <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.08] sm:grid-cols-2">
              {post.facts.map((f) => (
                <div key={f.label} className="bg-white px-4 py-3">
                  <dt className="text-xs font-medium text-black/55">{f.label}</dt>
                  <dd className="mt-0.5 text-lg font-bold text-[#16181D]">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {tool && (
            <Link
              href={tool.href}
              className="group mt-6 flex items-center gap-4 rounded-2xl bg-[#E60A1C] p-4 text-white shadow-lg shadow-[#E60A1C]/20 transition hover:bg-[#B5081A]"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/15">
                <Calculator size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold uppercase tracking-wider text-white/80">
                  Selbst ausrechnen
                </span>
                <span className="block font-bold leading-snug">{tool.label}</span>
                {tool.description && <span className="block text-sm text-white/80">{tool.description}</span>}
              </span>
              <ArrowRight size={20} className="flex-shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          <div className="mt-8">
            <PostBody body={post.body} />
          </div>

          {(newer || older) && (
            <nav aria-label="Weitere Infografiken" className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {older ? (
                <Link
                  href={`/infografiken/${older.slug}`}
                  className="group rounded-2xl border border-black/[0.08] bg-white p-4 transition hover:border-[#E60A1C]/40"
                >
                  <span className="flex items-center gap-1 text-xs font-semibold text-black/50">
                    <ArrowLeft size={14} /> Vorherige
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm font-semibold text-[#16181D]">{older.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {newer && (
                <Link
                  href={`/infografiken/${newer.slug}`}
                  className="group rounded-2xl border border-black/[0.08] bg-white p-4 text-right transition hover:border-[#E60A1C]/40"
                >
                  <span className="flex items-center justify-end gap-1 text-xs font-semibold text-black/50">
                    Nächste <ArrowRight size={14} />
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm font-semibold text-[#16181D]">{newer.title}</span>
                </Link>
              )}
            </nav>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-[#16181D]">Weitere Infografiken</h2>
            <Link href="/infografiken" className="text-sm font-semibold text-[#E60A1C] hover:underline">
              Alle ansehen
            </Link>
          </div>
          <PostGrid
            filter={false}
            posts={related.map(({ slug, title, category, image }) => ({ slug, title, category, image }))}
          />
        </section>
      )}
    </div>
  );
}
