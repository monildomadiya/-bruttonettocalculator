/**
 * Which pages a story can link to, and how a link is presented in the viewer.
 * Server-side only (reads the full blog corpus).
 */
import { getAllPosts, getCoverImage, getPostBySlug, SITE_ORIGIN } from "@/lib/blog";
import { allCalculatorLinks, calculatorGroups } from "@/lib/navigation";
import type { StoryLinkKind } from "@/lib/stories";

export interface StoryLinkOption {
  href: string;
  label: string;
  group: string;
}

/** Link targets offered in the admin form: every article, then every tool. */
export function storyLinkOptions(): StoryLinkOption[] {
  const articles = getAllPosts().map((p) => ({
    href: `/blog/${p.slug}`,
    label: p.headline,
    group: "Ratgeber",
  }));
  const tools = calculatorGroups.flatMap((g) =>
    g.items.map((item) => ({ href: item.href, label: item.label, group: g.label }))
  );
  return [...articles, ...tools];
}

export interface ResolvedStoryLink {
  linkKind: StoryLinkKind;
  linkExcerpt?: string;
  linkImage?: string;
  /** Used when the story was saved without its own link text. */
  defaultLabel?: string;
}

export function resolveStoryLink(link: string): ResolvedStoryLink {
  if (!link.startsWith("/")) return { linkKind: "external" };

  const path = link.split(/[?#]/)[0].replace(/\/$/, "") || "/";

  const blog = path.match(/^\/blog\/([^/]+)$/);
  const post = blog ? getPostBySlug(blog[1]) : undefined;
  if (post) {
    return {
      linkKind: "article",
      linkExcerpt: post.excerpt,
      linkImage: getCoverImage(post).replace(SITE_ORIGIN, ""),
      defaultLabel: post.headline,
    };
  }

  const tool = allCalculatorLinks.find((t) => t.href === path);
  if (tool) {
    return { linkKind: "tool", linkExcerpt: tool.description, defaultLabel: tool.label };
  }

  return { linkKind: "page" };
}
