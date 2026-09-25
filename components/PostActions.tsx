"use client";

import { useState } from "react";
import { Check, Code2, Link2, Share2 } from "lucide-react";
import { trackStory } from "@/lib/stories";

interface Props {
  slug: string;
  title: string;
  url: string;
  /** Absolute URL of the full-size image, for the embed snippet. */
  imageUrl: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * Share / copy / embed bar under a post image. The embed snippet is the SEO
 * lever: anyone who republishes the infographic carries two links back to it.
 */
export default function PostActions({ slug, title, url, imageUrl, alt, width, height }: Props) {
  const [copied, setCopied] = useState<"" | "link" | "embed">("");
  const [showEmbed, setShowEmbed] = useState(false);

  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const embed =
    `<a href="${url}"><img src="${imageUrl}" alt="${escape(alt)}" width="${width}" height="${height}" ` +
    `style="max-width:100%;height:auto" loading="lazy"></a>\n` +
    `<p>Quelle: <a href="${url}">${escape(title)} – BruttoNettoCalculator.com</a></p>`;

  const copy = async (value: string, what: "link" | "embed") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(what);
      window.setTimeout(() => setCopied(""), 2000);
    } catch {
      /* clipboard blocked — the embed textarea stays selectable */
    }
    trackStory(what === "link" ? "post_copy_link" : "post_copy_embed", { post: slug });
  };

  const share = async () => {
    trackStory("post_share", { post: slug });
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* dismissed */
      }
    } else {
      copy(url, "link");
    }
  };

  const btn =
    "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-black/70 transition hover:bg-black/[0.05] hover:text-[#16181D]";

  return (
    <div>
      <div className="flex items-center gap-1 px-2 py-1.5">
        <button type="button" onClick={share} className={btn}>
          <Share2 size={17} /> Teilen
        </button>
        <button type="button" onClick={() => copy(url, "link")} className={btn}>
          {copied === "link" ? <Check size={17} className="text-emerald-600" /> : <Link2 size={17} />}
          {copied === "link" ? "Kopiert" : "Link"}
        </button>
        <button
          type="button"
          onClick={() => setShowEmbed((v) => !v)}
          aria-expanded={showEmbed}
          className={`${btn} ml-auto`}
        >
          <Code2 size={17} /> Einbetten
        </button>
      </div>
      {showEmbed && (
        <div className="border-t border-black/[0.08] p-3">
          <p className="mb-2 text-xs text-black/60">
            Sie dürfen diese Infografik mit Quellenlink auf Ihrer Website verwenden:
          </p>
          <textarea
            readOnly
            value={embed}
            onFocus={(e) => e.currentTarget.select()}
            className="h-24 w-full resize-none rounded-xl border border-black/10 bg-[#F4F5F7] p-2 font-mono text-[11px] text-black/70"
          />
          <button
            type="button"
            onClick={() => copy(embed, "embed")}
            className="mt-2 rounded-xl bg-[#16181D] px-3 py-2 text-xs font-semibold text-white transition hover:bg-black"
          >
            {copied === "embed" ? "Code kopiert ✓" : "Code kopieren"}
          </button>
        </div>
      )}
    </div>
  );
}
