/**
 * Which pages a story can link to, and how a link is presented in the viewer.
 * Server-side only (reads the full blog corpus).
 */
import { getAllPosts, getCoverImage, getPostBySlug, SITE_ORIGIN } from "@/lib/blog";
import { allCalculatorLinks, calculatorGroups } from "@/lib/navigation";
import { postImagePath, type Post } from "@/lib/posts";
import type { StoryLinkKind } from "@/lib/stories";

export interface StoryLinkOption {
  href: string;
  label: string;
  group: string;
}

/** Link targets offered in the admin form: infographics, articles, then every tool. */
export function storyLinkOptions(posts: Post[] = []): StoryLinkOption[] {
  const infographics = posts.map((p) => ({
    href: `/infografiken/${p.slug}`,
    label: p.title,
    group: "Infografiken",
  }));
  const articles = getAllPosts().map((p) => ({
    href: `/blog/${p.slug}`,
    label: p.headline,
    group: "Ratgeber",
  }));
  const tools = calculatorGroups.flatMap((g) =>
    g.items.map((item) => ({ href: item.href, label: item.label, group: g.label }))
  );
  return [...infographics, ...articles, ...tools];
}

export interface ResolvedStoryLink {
  linkKind: StoryLinkKind;
  linkExcerpt?: string;
  linkImage?: string;
  /** Used when the story was saved without its own link text. */
  defaultLabel?: string;
}

export function resolveStoryLink(link: string, posts: Post[] = []): ResolvedStoryLink {
  if (!link.startsWith("/")) return { linkKind: "external" };

  const path = link.split(/[?#]/)[0].replace(/\/$/, "") || "/";

  const info = path.match(/^\/infografiken\/([^/]+)$/);
  const infoPost = info ? posts.find((p) => p.slug === info[1]) : undefined;
  if (infoPost) {
    return {
      linkKind: "article",
      linkExcerpt: infoPost.description,
      linkImage: postImagePath(infoPost, "thumb"),
      defaultLabel: infoPost.title,
    };
  }

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
