import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronRight, Images, Sparkles } from "lucide-react";
import PostGrid from "@/components/PostGrid";
import { allCalculatorLinks } from "@/lib/navigation";
import { formatPostDate, postImagePath } from "@/lib/posts";
import { getPublishedPosts } from "@/lib/postsStore";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Infografiken: Gehalt, Steuern & Abgaben auf einen Blick";
/** Shown under the gallery, after the calculators the posts themselves link to. */
const DEFAULT_TOOLS = ["/", "/steuerklassen", "/rechner/netto-zu-brutto", "/midijob-rechner", "/mindestlohn", "/brutto-netto-rechner-2027"];

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
  const lastUpdate = posts.reduce((max, p) => (p.updatedAt > max ? p.updatedAt : max), "");
  const tools = Array.from(new Set([...posts.map((p) => p.calculator).filter(Boolean), ...DEFAULT_TOOLS]))
    .map((href) => allCalculatorLinks.find((t) => t.href === href))
    .filter((t): t is (typeof allCalculatorLinks)[number] => Boolean(t))
    .slice(0, 6);

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
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-black/55">
        <Link href="/" className="hover:text-[#16181D]">Startseite</Link>
        <ChevronRight size={14} />
        <span className="font-medium text-[#16181D]">Infografiken</span>
      </nav>

      {/* Profile header */}
      <header className="relative mb-8 overflow-hidden rounded-3xl border border-black/[0.08] bg-white p-5 shadow-sm sm:mb-10 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-[0.12] blur-3xl"
          style={{ background: "radial-gradient(circle, #FF6A00, #E60A1C)" }}
        />
        <div className="relative flex items-start gap-4 sm:items-center sm:gap-8">
          <div
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full p-[3px] sm:h-28 sm:w-28"
            style={{ background: "conic-gradient(from 210deg, #E60A1C, #FF6A00, #FFC400, #FF6A00, #E60A1C)" }}
          >
            <span className="flex h-full w-full items-center justify-center rounded-full bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon.png?v=7" alt="" className="h-3/5 w-3/5 object-contain" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E60A1C]">
              <Sparkles size={13} /> Zahlen auf einen Blick
            </p>
            <h1 className="font-display text-2xl font-extrabold leading-tight text-[#16181D] sm:text-4xl">
              Infografiken
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/70 sm:text-base">
              Gehalt, Steuern und Sozialabgaben in Bildern — jede Grafik mit Erklärung, Kernfakten und dem passenden
              Rechner zum Selbst-Ausrechnen.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2 text-sm">
              <li className="rounded-full bg-[#F3F4F6] px-3 py-1 text-black/65">
                <strong className="text-[#16181D]">{posts.length}</strong> {posts.length === 1 ? "Infografik" : "Infografiken"}
              </li>
              <li className="rounded-full bg-[#F3F4F6] px-3 py-1 text-black/65">
                <strong className="text-[#16181D]">{categories.size}</strong> {categories.size === 1 ? "Thema" : "Themen"}
              </li>
              {lastUpdate && (
                <li className="rounded-full bg-[#F3F4F6] px-3 py-1 text-black/65">
                  Stand <time dateTime={lastUpdate}>{formatPostDate(lastUpdate)}</time>
                </li>
              )}
            </ul>
          </div>
        </div>
      </header>

      {posts.length ? (
        <section aria-labelledby="alle-infografiken">
          <h2 id="alle-infografiken" className="mb-4 font-display text-xl font-bold text-[#16181D] sm:text-2xl">
            Alle Infografiken
          </h2>
          <PostGrid
            posts={posts.map(({ slug, title, category, image }) => ({ slug, title, category, image }))}
          />
        </section>
      ) : (
        <div className="rounded-3xl border border-dashed border-black/15 bg-white px-6 py-16 text-center">
          <Images size={36} className="mx-auto mb-3 text-[#E60A1C]" />
          <p className="font-semibold text-[#16181D]">Die ersten Infografiken erscheinen in Kürze.</p>
          <p className="mt-1 text-sm text-black/60">
            Bis dahin: <Link href="/blog" className="font-semibold text-[#E60A1C] hover:underline">zum Ratgeber</Link>.
          </p>
        </div>
      )}

      {tools.length > 0 && (
        <section aria-labelledby="selbst-rechnen" className="mt-12 sm:mt-16">
          <h2 id="selbst-rechnen" className="font-display text-xl font-bold text-[#16181D] sm:text-2xl">
            Selbst ausrechnen
          </h2>
          <p className="mt-1 text-sm text-black/60">Die Zahlen aus den Grafiken — für Ihr eigenes Gehalt.</p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(({ href, label, description, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex h-full items-center gap-3 rounded-2xl border border-black/[0.08] bg-white p-4 transition hover:border-[#E60A1C]/40 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#E60A1C]/10 text-[#E60A1C]">
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-snug text-[#16181D]">{label}</span>
                    {description && <span className="block truncate text-xs text-black/55">{description}</span>}
                  </span>
                  <ArrowRight size={16} className="flex-shrink-0 text-black/30 transition group-hover:translate-x-0.5 group-hover:text-[#E60A1C]" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link
        href="/blog"
        className="group mt-6 flex items-center gap-4 rounded-2xl bg-[#16181D] p-5 text-white transition hover:bg-black"
      >
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
          <BookOpen size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold">Mehr Hintergrund im Ratgeber</span>
          <span className="block text-sm text-white/70">Ausführliche Artikel zu Steuern, Abgaben und Gehalt.</span>
        </span>
        <ArrowRight size={20} className="flex-shrink-0 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
