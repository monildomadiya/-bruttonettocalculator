"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Check, X, Plus, Trash2, Upload, Sparkles, HelpCircle,
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Code, Link as LinkIcon, Unlink, Image as ImageIcon,
  Table as TableIcon, Video, RotateCcw, RotateCw, Loader2, CheckCircle2, Circle
} from "lucide-react";
import { Article } from "@/lib/db";

interface Props {
  initialArticle?: Article;
  isEdit?: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function ArticleEditor({ initialArticle, isEdit = false }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [headline, setHeadline] = useState(initialArticle?.headline || "");
  const [slug, setSlug] = useState(initialArticle?.slug || "");
  const [category, setCategory] = useState(initialArticle?.category || "");
  const [tags, setTags] = useState(initialArticle?.tags || "");
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || "");

  // SEO states
  const [metaTitle, setMetaTitle] = useState(initialArticle?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(initialArticle?.meta_description || "");
  const [focusKeyword, setFocusKeyword] = useState(initialArticle?.focus_keyword || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialArticle?.canonical_url || "");

  // Image states
  const [featuredImage, setFeaturedImage] = useState(initialArticle?.featured_image || "");
  const [featuredImageAlt, setFeaturedImageAlt] = useState(initialArticle?.featured_image_alt || "");
  const [featuredImageCaption, setFeaturedImageCaption] = useState(initialArticle?.featured_image_caption || "");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Story Canvas
  const [enableToc, setEnableToc] = useState(initialArticle?.enable_toc !== undefined ? initialArticle.enable_toc : true);
  const [content, setContent] = useState(initialArticle?.content || "");

  // FAQs
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    if (initialArticle?.faqs) {
      if (typeof initialArticle.faqs === "string") {
        try { return JSON.parse(initialArticle.faqs); } catch { return []; }
      }
      return initialArticle.faqs;
    }
    return [
      { question: "", answer: "" },
      { question: "", answer: "" }
    ];
  });

  // Social
  const [ogTitle, setOgTitle] = useState(initialArticle?.og_title || "");
  const [ogDescription, setOgDescription] = useState(initialArticle?.og_description || "");
  const [ogImage, setOgImage] = useState(initialArticle?.og_image || "");

  // Publishing
  const [status, setStatus] = useState(initialArticle?.status || "Published");
  const [readTime, setReadTime] = useState(initialArticle?.read_time || "3 min read");

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-slug from headline if not editing
  useEffect(() => {
    if (!isEdit && !slug && headline) {
      const generated = headline
        .toLowerCase()
        .replace(/[^a-z0-9äöüß\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generated);
    }
  }, [headline, isEdit, slug]);

  // Auto read time calculation
  useEffect(() => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(wordCount / 200));
    setReadTime(`${mins} min read`);
  }, [content]);

  // SEO Validation Checklist
  const checks = [
    { label: "Meta title exists", passed: Boolean((metaTitle || headline).trim()) },
    { label: "Meta description exists", passed: Boolean((metaDescription || excerpt).trim()) },
    { label: "Slug exists", passed: Boolean(slug.trim()) },
    { label: "Focus keyword exists", passed: Boolean(focusKeyword.trim()) },
    { label: "Featured image alt exists", passed: Boolean(featuredImageAlt.trim()) },
    { label: "At least one H2 exists", passed: /<h2|## /i.test(content) },
    { label: "Has at least 2 FAQs", passed: faqs.filter(f => f.question.trim() && f.answer.trim()).length >= 2 },
    { label: "800+ words in content", passed: content.trim().split(/\s+/).filter(Boolean).length >= 800 },
  ];
  const passedCount = checks.filter(c => c.passed).length;

  // Cloudinary image upload handler
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFeaturedImage(data.url);
      } else {
        alert("Upload fehlgeschlagen: " + (data.error || "Unbekannter Fehler"));
      }
    } catch (err: any) {
      alert("Fehler beim Verbinden mit Cloudinary.");
    } finally {
      setUploadingImage(false);
    }
  }

  // Toolbar insertion helper
  function insertFormatting(tagOpen: string, tagClose: string = "") {
    const textarea = document.getElementById("article-content-editor") as HTMLTextAreaElement | null;
    if (!textarea) {
      setContent((prev) => prev + tagOpen + tagClose);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = tagOpen + selected + tagClose;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selected.length);
    }, 10);
  }

  // Save / Publish
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!headline || !slug) {
      setErrorMessage("Bitte mindestens eine Headline und einen Slug eingeben.");
      return;
    }

    setSaving(true);
    const payload: Article = {
      headline,
      slug,
      category,
      tags,
      excerpt,
      meta_title: metaTitle || headline,
      meta_description: metaDescription || excerpt,
      focus_keyword: focusKeyword,
      canonical_url: canonicalUrl,
      featured_image: featuredImage,
      featured_image_alt: featuredImageAlt,
      featured_image_caption: featuredImageCaption,
      enable_toc: enableToc,
      content,
      faqs: faqs.filter(f => f.question.trim() || f.answer.trim()),
      og_title: ogTitle || metaTitle || headline,
      og_description: ogDescription || metaDescription || excerpt,
      og_image: ogImage || featuredImage,
      status,
      read_time: readTime,
    };

    try {
      const url = isEdit ? `/api/articles/${initialArticle?.slug || slug}` : "/api/articles";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin-secure");
        router.refresh();
      } else {
        setErrorMessage(data.error || "Speichern fehlgeschlagen.");
      }
    } catch (err: any) {
      setErrorMessage("Netzwerkfehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative">
      
      {/* Hidden file input for Cloudinary */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-white/10">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white flex items-center gap-2.5">
            <span>{isEdit ? "Edit Article" : "Draft New Article"}</span>
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Optimize for SEO and craft a compelling story.
          </p>
        </div>

        {/* Dynamic SEO Score Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#141414] border border-amber-500/40 shadow-inner">
          <Sparkles size={16} className="text-amber-400 animate-pulse" />
          <span className="text-sm font-bold text-amber-400">
            SEO Score: {passedCount}/{checks.length}
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Grid Layout: Left Columns (Main Editor) vs Right Columns (Settings & Checklist) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Columns (1 to 8 on desktop) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* SECTION 1: CORE PUBLICATION DETAILS */}
          <div className="space-y-6">
            <h2 className="text-xs font-black tracking-widest text-[#FF2E44] uppercase flex items-center gap-2 border-b border-white/10 pb-3">
              <span>1. CORE PUBLICATION DETAILS</span>
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                ARTICLE HEADLINE <span className="text-[#FF2E44]">*</span>
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Enter a captivating title..."
                className="w-full px-4 py-3.5 rounded-2xl bg-[#141414] border border-white/15 focus:border-[#E60A1C] text-white font-bold text-lg outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                  URL SLUG <span className="text-[#FF2E44]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="best-ai-image-generator-2026"
                  className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/15 focus:border-[#E60A1C] text-white/90 text-sm font-mono outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                  CATEGORY <span className="text-white/40 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Steuerrecht oder AI Tools"
                  className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/15 focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                TAGS (COMMA SEPARATED) <span className="text-white/40 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Steuern, Grundfreibetrag, Lohnsteuer"
                className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/15 focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70">
                  ARTICLE EXCERPT (SHORT SUMMARY) <span className="text-white/40 font-normal">(Optional)</span>
                </label>
                <span className={`text-xs font-mono ${excerpt.length > 180 ? "text-amber-400" : "text-white/40"}`}>
                  {excerpt.length} / 180
                </span>
              </div>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short summary for blog cards and previews (120-180 chars)..."
                className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/15 focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* SECTION 2: SEO SETTINGS */}
          <div className="space-y-6">
            <h2 className="text-xs font-black tracking-widest text-[#FF2E44] uppercase flex items-center gap-2 border-b border-white/10 pb-3">
              <span>2. SEO SETTINGS</span>
            </h2>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70">
                  SEO META TITLE <span className="text-white/40 font-normal">(Optional)</span>
                </label>
                <span className={`text-xs font-mono ${metaTitle.length > 60 ? "text-amber-400" : "text-white/40"}`}>
                  {metaTitle.length} / 60
                </span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Defaults to Article Headline if empty"
                className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/15 focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70">
                  META DESCRIPTION <span className="text-white/40 font-normal">(Optional)</span>
                </label>
                <span className={`text-xs font-mono ${metaDescription.length > 160 ? "text-amber-400" : "text-white/40"}`}>
                  {metaDescription.length} / 160
                </span>
              </div>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Defaults to Excerpt if empty"
                className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/15 focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                  FOCUS KEYWORD <span className="text-white/40 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="e.g. Grundfreibetrag 2026"
                  className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/15 focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                  CANONICAL URL <span className="text-white/40 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="Defaults to this article's URL"
                  className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/15 focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: FEATURED IMAGE */}
          <div className="space-y-6">
            <h2 className="text-xs font-black tracking-widest text-[#FF2E44] uppercase flex items-center gap-2 border-b border-white/10 pb-3">
              <span>3. FEATURED IMAGE</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://res.cloudinary.com/diuy76wgh/image/upload/..."
                className="flex-1 px-4 py-3 rounded-2xl bg-[#141414] border border-white/15 focus:border-[#E60A1C] text-white/90 text-sm font-mono outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="px-6 py-3 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 whitespace-nowrap"
                style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)", boxShadow: "0 4px 15px rgba(230,10,28,0.40)" }}
              >
                {uploadingImage ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </div>

            {featuredImage && (
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/40 p-2 max-w-md">
                <img src={featuredImage} alt="Preview" className="w-full h-auto rounded-xl object-cover max-h-48" />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                  FEATURED IMAGE ALT TEXT <span className="text-white/40 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={featuredImageAlt}
                  onChange={(e) => setFeaturedImageAlt(e.target.value)}
                  placeholder="Taschenrechner und Gehaltsabrechnung"
                  className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/15 focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                  FEATURED IMAGE CAPTION <span className="text-white/40 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={featuredImageCaption}
                  onChange={(e) => setFeaturedImageCaption(e.target.value)}
                  placeholder="Optional caption below image"
                  className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/15 focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: SOCIAL SHARING */}
          <div className="space-y-6">
            <h2 className="text-xs font-black tracking-widest text-[#FF2E44] uppercase flex items-center gap-2 border-b border-white/10 pb-3">
              <span>4. SOCIAL SHARING</span>
            </h2>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white/90">Open Graph (Facebook/LinkedIn)</h3>
              <input
                type="text"
                value={ogTitle}
                onChange={(e) => setOgTitle(e.target.value)}
                placeholder="OG Title (Fallback: Meta Title)"
                className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/15 focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
              />
              <input
                type="text"
                value={ogDescription}
                onChange={(e) => setOgDescription(e.target.value)}
                placeholder="OG Description (Fallback: Meta Desc)"
                className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/15 focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
              />
              <input
                type="text"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder="OG Image URL (Fallback: Featured)"
                className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/15 focus:border-[#E60A1C] text-white/90 text-sm font-mono outline-none transition-all"
              />
            </div>
          </div>

          {/* SECTION 5: STORY CANVAS */}
          <div className="space-y-6">
            <h2 className="text-xs font-black tracking-widest text-[#FF2E44] uppercase flex items-center gap-2 border-b border-white/10 pb-3">
              <span>5. STORY CANVAS</span>
            </h2>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableToc}
                onChange={(e) => setEnableToc(e.target.checked)}
                className="w-5 h-5 rounded border border-white/20 bg-black text-[#E60A1C] focus:ring-0 cursor-pointer accent-[#E60A1C]"
              />
              <span className="text-sm font-bold text-white">Enable Table of Contents (Auto-generated from H2/H3)</span>
            </label>

            <div className="rounded-2xl bg-[#141414] border border-white/15 overflow-hidden">
              
              {/* Rich Editor Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 bg-black/40 border-b border-white/10 text-xs">
                <button type="button" onClick={() => insertFormatting("")} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white"><RotateCcw size={14} /></button>
                <button type="button" onClick={() => insertFormatting("")} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white"><RotateCw size={14} /></button>
                <div className="h-4 w-px bg-white/10 mx-1" />
                
                <button type="button" onClick={() => insertFormatting("<h2>", "</h2>")} className="px-2.5 py-1 hover:bg-white/10 rounded-lg font-bold text-white/80">H2</button>
                <button type="button" onClick={() => insertFormatting("<h3>", "</h3>")} className="px-2.5 py-1 hover:bg-white/10 rounded-lg font-bold text-white/80">H3</button>
                <button type="button" onClick={() => insertFormatting("<p>", "</p>")} className="px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80">P</button>
                <div className="h-4 w-px bg-white/10 mx-1" />

                <button type="button" onClick={() => insertFormatting("<strong>", "</strong>")} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white" title="Bold"><Bold size={14} /></button>
                <button type="button" onClick={() => insertFormatting("<em>", "</em>")} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white" title="Italic"><Italic size={14} /></button>
                <button type="button" onClick={() => insertFormatting("<u>", "</u>")} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white" title="Underline"><Underline size={14} /></button>
                <button type="button" onClick={() => insertFormatting("<s>", "</s>")} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white" title="Strikethrough"><Strikethrough size={14} /></button>
                <div className="h-4 w-px bg-white/10 mx-1" />

                <button type="button" onClick={() => insertFormatting("<ul>\n  <li>", "</li>\n</ul>")} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white" title="Bullet List"><List size={14} /></button>
                <button type="button" onClick={() => insertFormatting("<ol>\n  <li>", "</li>\n</ol>")} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white" title="Numbered List"><ListOrdered size={14} /></button>
                <button type="button" onClick={() => insertFormatting("<blockquote>\n  ", "\n</blockquote>")} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white" title="Quote"><Quote size={14} /></button>
                <button type="button" onClick={() => insertFormatting("<pre><code>", "</code></pre>")} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white" title="Code"><Code size={14} /></button>
                <button type="button" onClick={() => insertFormatting('<a href="https://example.com" target="_blank" rel="noopener noreferrer">', "</a>")} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white" title="Link"><LinkIcon size={14} /></button>
                <button type="button" onClick={() => insertFormatting('<img src="https://" alt="Bild" />')} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white" title="Image"><ImageIcon size={14} /></button>
                <button type="button" onClick={() => insertFormatting("<table>\n  <tr><th>Kopf</th></tr>\n  <tr><td>Daten</td></tr>\n</table>")} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white" title="Table"><TableIcon size={14} /></button>
                <button type="button" onClick={() => insertFormatting('<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>')} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white" title="YouTube Video"><Video size={14} /></button>
              </div>

              <textarea
                id="article-content-editor"
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing..."
                className="w-full p-5 bg-transparent text-white/95 text-base leading-relaxed outline-none font-mono resize-y"
              />
            </div>
          </div>

          {/* SECTION 6: FAQ SECTION */}
          <div className="space-y-6">
            <h2 className="text-xs font-black tracking-widest text-[#FF2E44] uppercase flex items-center gap-2 border-b border-white/10 pb-3">
              <span>6. FAQ SECTION</span>
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#141414] border border-white/15 relative space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-white/50">Question #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const copy = [...faqs];
                      copy[idx].question = e.target.value;
                      setFaqs(copy);
                    }}
                    placeholder="e.g. Wie hoch ist der Grundfreibetrag 2026?"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-semibold text-sm outline-none"
                  />
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => {
                      const copy = [...faqs];
                      copy[idx].answer = e.target.value;
                      setFaqs(copy);
                    }}
                    placeholder="Antwort hier eingeben..."
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white/85 text-sm outline-none resize-none"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
                className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm flex items-center gap-2 transition-all"
              >
                <Plus size={16} />
                <span>Add FAQ</span>
              </button>
            </div>
          </div>

          {/* Bottom Actions Button Bar */}
          <div className="flex items-center justify-end gap-4 pt-8 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/admin-secure")}
              className="px-6 py-3.5 rounded-2xl bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-white font-bold text-sm transition-all"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-2xl font-extrabold text-white text-base shadow-xl flex items-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)", boxShadow: "0 4px 20px rgba(230,10,28,0.50)" }}
            >
              {saving && <Loader2 size={18} className="animate-spin" />}
              <span>{saving ? "Saving..." : "Save & Publish"}</span>
            </button>
          </div>

        </div>

        {/* Right Sidebar Columns (9 to 12 on desktop) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* SECTION 7: PUBLISHING SETTINGS */}
          <div className="p-6 rounded-3xl bg-[#141414] border border-white/15 space-y-6">
            <h2 className="text-xs font-black tracking-widest text-[#FF2E44] uppercase flex items-center gap-2 border-b border-white/10 pb-3">
              <span>7. PUBLISHING SETTINGS</span>
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                STATUS <span className="text-white/40 font-normal">(Optional)</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-black border border-white/15 text-white font-bold text-sm outline-none cursor-pointer"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                READ TIME (AUTO) <span className="text-white/40 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="3 min read"
                className="w-full px-4 py-3 rounded-2xl bg-black border border-white/15 text-white/90 text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* SEO CHECKLIST PANEL */}
          <div className="p-6 rounded-3xl bg-[#141414] border border-white/15 space-y-5 sticky top-28">
            <h3 className="text-xs font-black tracking-widest text-[#FF2E44] uppercase flex items-center justify-between border-b border-white/10 pb-3">
              <span>SEO CHECKLIST</span>
              <span className="text-white/60 font-mono text-xs">{passedCount}/{checks.length}</span>
            </h3>

            <div className="space-y-3">
              {checks.map((chk, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  {chk.passed ? (
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle size={18} className="text-white/20 flex-shrink-0" />
                  )}
                  <span className={chk.passed ? "text-white font-medium" : "text-white/50"}>
                    {chk.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 text-xs text-white/40 leading-relaxed">
              Tipp: Eine vollständige SEO-Optimierung (8/8) erhöht Ihre Chancen auf Google Featured Snippets erheblich.
            </div>
          </div>

        </div>

      </div>
    </form>
  );
}
