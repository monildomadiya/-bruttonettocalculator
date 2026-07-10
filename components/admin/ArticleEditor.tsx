"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Check, X, Plus, Trash2, Upload, Sparkles, HelpCircle,
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Code, Link as LinkIcon, Unlink, Image as ImageIcon,
  Table as TableIcon, Video, RotateCcw, RotateCw, Loader2, CheckCircle2, Circle,
  Eye, Edit3, Columns, Wand2, Calculator, AlertCircle, Info, Highlighter, FileText, History
} from "lucide-react";
import { Article } from "@/lib/db";
import WordPressEditor from "@/components/admin/WordPressEditor";

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

  // Live word count from the HTML content (tags stripped)
  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]*>/g, " ").replace(/&[a-z#0-9]+;/gi, " ");
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [content]);

  // Auto read time calculation
  useEffect(() => {
    const mins = Math.max(1, Math.ceil(wordCount / 200));
    setReadTime(`${mins} min read`);
  }, [wordCount]);

  // ── Autosave draft + unsaved-changes protection ──────────────────
  const draftKey = `bnc_draft_${isEdit ? (initialArticle?.slug || slug || "edit") : "new"}`;
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);
  const [restorable, setRestorable] = useState<{ savedAt: number; data: string } | null>(null);
  const savedRef = useRef(false);

  // Serialized snapshot of every field, used for dirty-detection + autosave
  const snapshot = useMemo(() => JSON.stringify({
    headline, slug, category, tags, excerpt, metaTitle, metaDescription,
    focusKeyword, canonicalUrl, featuredImage, featuredImageAlt, featuredImageCaption,
    enableToc, content, faqs, ogTitle, ogDescription, ogImage, status, readTime,
  }), [headline, slug, category, tags, excerpt, metaTitle, metaDescription,
    focusKeyword, canonicalUrl, featuredImage, featuredImageAlt, featuredImageCaption,
    enableToc, content, faqs, ogTitle, ogDescription, ogImage, status, readTime]);

  const initialSnapshotRef = useRef<string | null>(null);
  useEffect(() => {
    initialSnapshotRef.current = snapshot;
    // Offer to restore a newer autosaved draft if one exists
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.data && parsed.data !== snapshot) setRestorable(parsed);
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDirty = initialSnapshotRef.current !== null && snapshot !== initialSnapshotRef.current;

  // Debounced autosave to localStorage while dirty
  useEffect(() => {
    if (!isDirty || savedRef.current) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify({ savedAt: Date.now(), data: snapshot }));
        setDraftSavedAt(Date.now());
      } catch { /* quota / private mode */ }
    }, 1200);
    return () => clearTimeout(t);
  }, [snapshot, isDirty, draftKey]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty && !savedRef.current) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  function restoreDraft() {
    if (!restorable) return;
    try {
      const d = JSON.parse(restorable.data);
      setHeadline(d.headline ?? ""); setSlug(d.slug ?? ""); setCategory(d.category ?? "");
      setTags(d.tags ?? ""); setExcerpt(d.excerpt ?? ""); setMetaTitle(d.metaTitle ?? "");
      setMetaDescription(d.metaDescription ?? ""); setFocusKeyword(d.focusKeyword ?? "");
      setCanonicalUrl(d.canonicalUrl ?? ""); setFeaturedImage(d.featuredImage ?? "");
      setFeaturedImageAlt(d.featuredImageAlt ?? ""); setFeaturedImageCaption(d.featuredImageCaption ?? "");
      setEnableToc(Boolean(d.enableToc)); setContent(d.content ?? "");
      if (Array.isArray(d.faqs)) setFaqs(d.faqs);
      setOgTitle(d.ogTitle ?? ""); setOgDescription(d.ogDescription ?? ""); setOgImage(d.ogImage ?? "");
      setStatus(d.status ?? "Published");
    } catch { /* ignore */ }
    setRestorable(null);
  }

  function dismissDraft() {
    try { localStorage.removeItem(draftKey); } catch { /* ignore */ }
    setRestorable(null);
  }

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

  function insertSampleHook() {
    const hook = `<p class="text-lg leading-relaxed text-white/90 font-medium mb-6">\n  Das deutsche Steuer- und Sozialabgabensystem bringt auch im Jahr <strong>2026/2027</strong> wichtige Neuerungen mit sich. Egal ob Erhöhung des Grundfreibetrags, Anpassungen bei den Beitragsbemessungsgrenzen oder neue Regelungen in den Steuerklassen – wer seine Abrechnung genau versteht, sichert sich am Monatsende bares Geld.\n</p>\n`;
    setContent((prev) => prev + hook);
  }

  // Save / Publish
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!headline || !slug) {
      setErrorMessage("Please enter at least a Headline and a Slug.");
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
        savedRef.current = true;
        try { localStorage.removeItem(draftKey); } catch { /* ignore */ }
        router.push("/admin-secure");
        router.refresh();
      } else {
        setErrorMessage(data.error || "Save failed.");
      }
    } catch (err: any) {
      setErrorMessage("Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 sm:p-8 text-white shadow-2xl relative">
      
      {/* Hidden file input for Cloudinary */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/[0.08]">
        <div>
          <h1 className="font-display font-bold text-2xl tracking-tight text-white">
            {isEdit ? "Edit Article" : "New Article"}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Optimize for SEO and craft a compelling story.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Autosave status */}
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/40" aria-live="polite">
            {isDirty ? (
              <><Circle size={9} className="text-amber-400 fill-amber-400" /> Unsaved</>
            ) : draftSavedAt ? (
              <><CheckCircle2 size={13} className="text-emerald-400" /> Draft saved</>
            ) : null}
          </span>

          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#181818] border border-white/[0.08] text-sm font-medium text-white/70">
            <Sparkles size={15} className="text-amber-400" />
            SEO {passedCount}/{checks.length}
          </span>

          <button
            type="button"
            onClick={() => router.push("/admin-secure")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white font-medium text-sm transition-colors"
            title="Editor schließen und zum Dashboard zurückkehren"
          >
            <X size={16} />
            <span>Schließen</span>
          </button>
        </div>
      </div>

      {/* Restore autosaved draft */}
      {restorable && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-sm text-amber-200/90">
            <History size={16} className="text-amber-400 flex-shrink-0" />
            <span>Ein automatisch gespeicherter Entwurf von {new Date(restorable.savedAt).toLocaleString("de-DE")} wurde gefunden.</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button type="button" onClick={dismissDraft} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors">
              Verwerfen
            </button>
            <button type="button" onClick={restoreDraft} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-colors">
              Entwurf wiederherstellen
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {/* Grid Layout: Left Columns (Main Editor) vs Right Columns (Settings & Checklist) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Columns (1 to 8 on desktop) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* SECTION 1: CORE PUBLICATION DETAILS */}
          <div className="space-y-6">
            <h2 className="text-xs font-semibold tracking-wide text-white/45 uppercase flex items-center gap-2 border-b border-white/[0.08] pb-3">
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
                className="w-full px-4 py-3.5 rounded-2xl bg-[#181818] border border-white/[0.08] focus:border-[#E60A1C] text-white font-bold text-lg outline-none transition-all"
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
                  className="w-full px-4 py-3 rounded-2xl bg-[#181818] border border-white/[0.08] focus:border-[#E60A1C] text-white/90 text-sm font-mono outline-none transition-all"
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
                  className="w-full px-4 py-3 rounded-2xl bg-[#181818] border border-white/[0.08] focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
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
                className="w-full px-4 py-3 rounded-2xl bg-[#181818] border border-white/[0.08] focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
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
                className="w-full px-4 py-3 rounded-2xl bg-[#181818] border border-white/[0.08] focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* SECTION 2: SEO SETTINGS */}
          <div className="space-y-6">
            <h2 className="text-xs font-semibold tracking-wide text-white/45 uppercase flex items-center gap-2 border-b border-white/[0.08] pb-3">
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
                className="w-full px-4 py-3 rounded-2xl bg-[#181818] border border-white/[0.08] focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
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
                className="w-full px-4 py-3 rounded-2xl bg-[#181818] border border-white/[0.08] focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all resize-none"
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
                  className="w-full px-4 py-3 rounded-2xl bg-[#181818] border border-white/[0.08] focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
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
                  className="w-full px-4 py-3 rounded-2xl bg-[#181818] border border-white/[0.08] focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: FEATURED IMAGE */}
          <div className="space-y-6">
            <h2 className="text-xs font-semibold tracking-wide text-white/45 uppercase flex items-center gap-2 border-b border-white/[0.08] pb-3">
              <span>3. FEATURED IMAGE</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://res.cloudinary.com/diuy76wgh/image/upload/..."
                className="flex-1 px-4 py-3 rounded-2xl bg-[#181818] border border-white/[0.08] focus:border-[#E60A1C] text-white/90 text-sm font-mono outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="px-6 py-3 rounded-2xl font-semibold text-white bg-[#E60A1C] hover:bg-[#ff1a2e] flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-50 whitespace-nowrap"
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
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-black/40 p-2 max-w-md">
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
                  className="w-full px-4 py-3 rounded-2xl bg-[#181818] border border-white/[0.08] focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
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
                  className="w-full px-4 py-3 rounded-2xl bg-[#181818] border border-white/[0.08] focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: SOCIAL SHARING */}
          <div className="space-y-6">
            <h2 className="text-xs font-semibold tracking-wide text-white/45 uppercase flex items-center gap-2 border-b border-white/[0.08] pb-3">
              <span>4. SOCIAL SHARING</span>
            </h2>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white/90">Open Graph (Facebook/LinkedIn)</h3>
              <input
                type="text"
                value={ogTitle}
                onChange={(e) => setOgTitle(e.target.value)}
                placeholder="OG Title (Fallback: Meta Title)"
                className="w-full px-4 py-3 rounded-2xl bg-[#181818] border border-white/[0.08] focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
              />
              <input
                type="text"
                value={ogDescription}
                onChange={(e) => setOgDescription(e.target.value)}
                placeholder="OG Description (Fallback: Meta Desc)"
                className="w-full px-4 py-3 rounded-2xl bg-[#181818] border border-white/[0.08] focus:border-[#E60A1C] text-white/90 text-sm outline-none transition-all"
              />
              <input
                type="text"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder="OG Image URL (Fallback: Featured)"
                className="w-full px-4 py-3 rounded-2xl bg-[#181818] border border-white/[0.08] focus:border-[#E60A1C] text-white/90 text-sm font-mono outline-none transition-all"
              />
            </div>
          </div>

          {/* SECTION 5: ADVANCED LUXURY RICH-TEXT STUDIO */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
              <h2 className="text-xs font-semibold tracking-wide text-white/45 uppercase flex items-center gap-2">
                <span>5. Story Editor</span>
              </h2>
              <span className="inline-flex items-center gap-3 text-xs font-mono text-white/40">
                <span className={wordCount >= 800 ? "text-emerald-400" : ""}>{wordCount.toLocaleString("de-DE")} words</span>
                <span className="text-white/20">·</span>
                <span>{readTime}</span>
              </span>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableToc}
                  onChange={(e) => setEnableToc(e.target.checked)}
                  className="w-5 h-5 rounded border border-white/20 bg-black text-[#E60A1C] focus:ring-0 cursor-pointer accent-[#E60A1C]"
                />
                <span className="text-sm font-bold text-white">Inhaltsverzeichnis (TOC) automatisch aus H2/H3 generieren</span>
              </label>

              {/* Quick AI & Helper Tools */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={insertSampleHook}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all"
                >
                  <Wand2 size={13} />
                  <span>⚡ SEO-Einleitung einfügen</span>
                </button>
              </div>
            </div>

            {/* WordPress Gutenberg & Classic WYSIWYG Editor */}
            <WordPressEditor content={content} onChange={setContent} />
          </div>

          {/* SECTION 6: FAQ SECTION */}
          <div className="space-y-6">
            <h2 className="text-xs font-semibold tracking-wide text-white/45 uppercase flex items-center gap-2 border-b border-white/[0.08] pb-3">
              <span>6. FAQ SECTION</span>
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#181818] border border-white/[0.08] relative space-y-3">
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
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.08] text-white font-semibold text-sm outline-none"
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
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/[0.08] text-white/85 text-sm outline-none resize-none"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
                className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/[0.08] text-white font-bold text-sm flex items-center gap-2 transition-all"
              >
                <Plus size={16} />
                <span>Add FAQ</span>
              </button>
            </div>
          </div>

          {/* Bottom Actions Button Bar */}
          <div className="flex items-center justify-end gap-3 pt-8 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => router.push("/admin-secure")}
              className="px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white font-medium text-sm transition-colors flex items-center gap-2"
            >
              <span>Abbrechen</span>
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-3 rounded-xl font-semibold text-white text-sm bg-[#E60A1C] hover:bg-[#ff1a2e] flex items-center gap-2 transition-colors active:scale-95 disabled:opacity-50"
            >
              {saving && <Loader2 size={17} className="animate-spin" />}
              <span>{saving ? "Saving…" : "Save & Publish"}</span>
            </button>
          </div>

        </div>

        {/* Right Sidebar Columns (9 to 12 on desktop) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* STICKY QUICK ACTION & CLOSE BAR */}
          <div className="p-4 rounded-2xl bg-[#181818] border border-white/[0.08] space-y-2.5 sticky top-24 z-40">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => router.push("/admin-secure")}
                className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
                title="Close editor and return to dashboard"
              >
                <X size={15} />
                <span>Close</span>
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 px-3 rounded-xl font-semibold text-white text-sm bg-[#E60A1C] hover:bg-[#ff1a2e] flex items-center justify-center gap-1.5 transition-colors active:scale-95 disabled:opacity-50"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                <span>{saving ? "Saving…" : "Save"}</span>
              </button>
            </div>
          </div>

          {/* SECTION 7: PUBLISHING SETTINGS */}
          <div className="p-6 rounded-2xl bg-[#181818] border border-white/[0.08] space-y-6">
            <h2 className="text-xs font-semibold tracking-wide text-white/45 uppercase flex items-center gap-2 border-b border-white/[0.08] pb-3">
              <span>7. PUBLISHING SETTINGS</span>
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                STATUS <span className="text-white/40 font-normal">(Optional)</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-black border border-white/[0.08] text-white font-bold text-sm outline-none cursor-pointer"
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
                className="w-full px-4 py-3 rounded-2xl bg-black border border-white/[0.08] text-white/90 text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* SEO CHECKLIST PANEL */}
          <div className="p-6 rounded-2xl bg-[#181818] border border-white/[0.08] space-y-5 sticky top-28">
            <h3 className="text-xs font-semibold tracking-wide text-white/45 uppercase flex items-center justify-between border-b border-white/[0.08] pb-3">
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

            <div className="pt-3 border-t border-white/[0.08] text-xs text-white/40 leading-relaxed">
              Tipp: Eine vollständige SEO-Optimierung (8/8) erhöht Ihre Chancen auf Google Featured Snippets erheblich.
            </div>
          </div>

        </div>

      </div>
    </form>
  );
}
