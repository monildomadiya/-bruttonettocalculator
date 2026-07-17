/**
 * Central SEO utilities.
 *
 * Single source of truth for the canonical (non-WWW, HTTPS) origin and the
 * reusable JSON-LD/canonical helpers. Keeping metadata logic here avoids the
 * per-page drift that caused broken canonicals and www/non-www inconsistencies.
 */

/** Preferred canonical origin — always HTTPS, always non-WWW. */
export const SITE_URL = "https://bruttonettocalculator.com" as const;

/** Stable @id references for the site-wide graph (see app/layout.tsx). */
export const WEBSITE_ID = `${SITE_URL}/#website` as const;
export const ORG_ID = `${SITE_URL}/#organization` as const;

/**
 * Build an absolute URL on the canonical origin.
 * Accepts a path ("/foo") or a full URL and always returns a non-WWW HTTPS URL.
 */
export function absoluteUrl(pathOrUrl = "/"): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return normalizeUrl(pathOrUrl);
  }
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

/**
 * Normalize any URL to the preferred host: force HTTPS, strip a leading "www.".
 * Used to sanitise editor-supplied canonical values coming from the database.
 */
export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.protocol = "https:";
    u.host = u.host.replace(/^www\./i, "");
    // Drop a trailing slash on non-root paths for consistency.
    if (u.pathname.length > 1 && u.pathname.endsWith("/")) {
      u.pathname = u.pathname.replace(/\/+$/, "");
    }
    return u.toString().replace(/\/$/, u.pathname === "/" ? "/" : "");
  } catch {
    return url;
  }
}

/**
 * Self-referencing canonical for a blog article.
 * Blog posts always live under /blog/<slug>; this guarantees the canonical is
 * correct even when the stored canonical_url is empty or malformed (e.g. it was
 * missing the /blog/ segment — the original Semrush "broken canonical" bug).
 */
export function blogCanonical(slug: string): string {
  return `${SITE_URL}/blog/${slug}`;
}

/** Minimal, valid WebPage JSON-LD. No SoftwareApplication/rating fields. */
export function webPageSchema(opts: {
  name: string;
  url: string;
  description?: string;
  breadcrumbId?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${opts.url}#webpage`,
    name: opts.name,
    url: opts.url,
    inLanguage: "de-DE",
    isPartOf: { "@id": WEBSITE_ID },
  };
  if (opts.description) schema.description = opts.description;
  if (opts.breadcrumbId) schema.breadcrumb = { "@id": opts.breadcrumbId };
  return schema;
}
