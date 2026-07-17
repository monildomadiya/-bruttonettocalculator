import { NextRequest, NextResponse } from "next/server";

/**
 * Canonical-host enforcement: permanently redirect the WWW hostname to the
 * preferred non-WWW origin, preserving the full path and query string.
 *
 *   https://www.bruttonettocalculator.com/foo?bar=1
 *     → https://bruttonettocalculator.com/foo?bar=1   (308)
 *
 * This lives in middleware so the redirect works regardless of the hosting
 * layer. If the site sits behind Nginx on the production server, doing this at
 * the server level is even better (see the deploy notes); a server-level rule
 * and this middleware do not chain — only one host ever needs redirecting.
 */
export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") || "").toLowerCase();

  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = host.slice(4); // strip "www."
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next's build assets and the favicon, so static
  // JS/CSS under /_next/ is never needlessly rewritten.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|favicon.png).*)"],
};
