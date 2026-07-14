import type { MetadataRoute } from "next";

/**
 * SEO + AI-SEO robots policy.
 *
 * We explicitly welcome AI answer/search crawlers (ChatGPT, Claude, Perplexity,
 * Google AI Overviews / Gemini, Apple) so the site can be cited as a source in
 * AI-generated answers — this is the core of "AI SEO" / GEO (Generative Engine
 * Optimization). Only private areas (admin, api, internals) stay disallowed.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin-secure/", "/admin/", "/api/", "/studio/"];

  // Major AI + search crawlers we explicitly want to allow.
  const aiAndSearchBots = [
    "Googlebot",
    "Googlebot-Image",
    "Bingbot",
    "Google-Extended",   // Gemini / AI Overviews training + grounding
    "GPTBot",            // OpenAI training
    "OAI-SearchBot",     // ChatGPT search
    "ChatGPT-User",      // ChatGPT browsing on user request
    "ClaudeBot",         // Anthropic training
    "Claude-User",       // Claude browsing on user request
    "Claude-SearchBot",  // Claude search
    "anthropic-ai",
    "PerplexityBot",     // Perplexity index
    "Perplexity-User",   // Perplexity on user request
    "Applebot",
    "Applebot-Extended", // Apple Intelligence
    "CCBot",             // Common Crawl (feeds many LLMs)
    "Amazonbot",
    "Bytespider",
    "YouBot",
    "cohere-ai",
    "Meta-ExternalAgent",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      // Explicitly welcome AI + search bots (redundant with the wildcard above,
      // but documents intent and overrides any cached restrictive policy).
      {
        userAgent: aiAndSearchBots,
        allow: "/",
        disallow,
      },
    ],
    sitemap: "https://bruttonettocalculator.com/sitemap.xml",
    host:    "https://bruttonettocalculator.com",
  };
}
