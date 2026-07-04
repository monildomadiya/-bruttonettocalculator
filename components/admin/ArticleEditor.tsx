"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Check, X, Plus, Trash2, Upload, Sparkles, HelpCircle,
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Code, Link as LinkIcon, Unlink, Image as ImageIcon,
  Table as TableIcon, Video, RotateCcw, RotateCw, Loader2, CheckCircle2, Circle,
  Eye, Edit3, Columns, Wand2, Calculator, AlertCircle, Info, Highlighter, FileText
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
  const [editorTab, setEditorTab] = useState<"edit" | "preview" | "split">("edit");

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

  // Advanced Rich Block Generator
  function insertSpecialBlock(type: string) {
    let snippet = "";
    if (type === "tip") {
      snippet = `\n<div class="my-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-4 shadow-lg">\n  <div class="text-2xl select-none">💡</div>\n  <div>\n    <h4 class="font-bold text-white mb-1">Experten-Tipp</h4>\n    <p class="text-sm leading-relaxed text-emerald-200/90">Hier Ihren hilfreichen Tipp oder Hinweis eintragen...</p>\n  </div>\n</div>\n`;
    } else if (type === "warning") {
      snippet = `\n<div class="my-6 p-5 rounded-2xl bg-[#E60A1C]/15 border border-[#E60A1C]/40 text-white flex items-start gap-4 shadow-[0_0_25px_rgba(230,10,28,0.2)]">\n  <div class="text-2xl select-none">⚠️</div>\n  <div>\n    <h4 class="font-bold text-[#FF2E44] mb-1">Wichtiger Hinweis (Achtung)</h4>\n    <p class="text-sm leading-relaxed text-white/90">Hier wichtige Fristen, Steuerstrafen oder Gesetzesänderungen notieren...</p>\n  </div>\n</div>\n`;
    } else if (type === "info") {
      snippet = `\n<div class="my-6 p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300 flex items-start gap-4">\n  <div class="text-2xl select-none">ℹ️</div>\n  <div>\n    <h4 class="font-bold text-white mb-1">Gut zu wissen</h4>\n    <p class="text-sm leading-relaxed text-blue-200/90">Hier Hintergrundinformationen oder Details zur Sozialversicherung angeben...</p>\n  </div>\n</div>\n`;
    } else if (type === "tax") {
      snippet = `\n<div class="my-8 p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#1a1a1a] to-transparent border-l-4 border-amber-400 text-amber-200 shadow-xl">\n  <div class="flex items-center gap-2 mb-2">\n    <span class="text-xl">💰</span>\n    <h4 class="font-extrabold text-amber-400 uppercase tracking-wider text-xs">Steuer-Optimierung 2026</h4>\n  </div>\n  <p class="text-base text-white font-medium leading-relaxed">Wussten Sie schon? Mit der richtigen Steuerklasse oder Freibeträgen lassen sich jährlich bis zu 1.200 € mehr Netto herausholen!</p>\n</div>\n`;
    } else if (type === "calculator") {
      snippet = `\n<div class="my-10 p-8 rounded-[32px] bg-gradient-to-br from-[#161616] via-[#0d0d0d] to-[#1c0305] border border-[#E60A1C]/40 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">\n  <div class="absolute top-0 right-0 w-48 h-48 bg-[#E60A1C]/15 rounded-full blur-3xl pointer-events-none"></div>\n  <span class="inline-block px-3 py-1 rounded-full bg-[#E60A1C]/20 border border-[#E60A1C]/40 text-[#FF2E44] text-xs font-extrabold uppercase tracking-widest mb-3">Kostenloser Gehaltsrechner</span>\n  <h3 class="text-2xl sm:text-3xl font-black text-white mb-3">Wie viel Netto bleibt von Ihrem Brutto in 2026?</h3>\n  <p class="text-white/70 max-w-xl mx-auto mb-6 text-sm sm:text-base">Berechnen Sie jetzt sekundenschnell Ihre exakten Abzüge für Lohnsteuer, Krankenkasse, Rentenversicherung und Pflegeversicherung!</p>\n  <a href="/" target="_blank" class="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-extrabold text-white text-sm sm:text-base shadow-xl transition-all hover:scale-105" style="background: linear-gradient(135deg,#E60A1C,#FF2436); box-shadow: 0 4px 20px rgba(230,10,28,0.5);">🧮 Jetzt Brutto-Netto berechnen →</a>\n</div>\n`;
    } else if (type === "table") {
      snippet = `\n<div class="my-8 overflow-x-auto rounded-2xl border border-white/15 bg-[#111111] shadow-2xl">\n  <table class="w-full text-left border-collapse text-sm">\n    <thead>\n      <tr class="bg-[#1a1a1a] text-white border-b border-white/15 font-bold">\n        <th class="p-4">Steuerklasse</th>\n        <th class="p-4">Zielgruppe / Merkmal</th>\n        <th class="p-4">Durchschnittlicher Abzug</th>\n      </tr>\n    </thead>\n    <tbody class="divide-y divide-white/10 text-white/80">\n      <tr class="hover:bg-white/5 transition-colors">\n        <td class="p-4 font-bold text-white">Klasse I</td>\n        <td class="p-4">Ledige, Geschiedene</td>\n        <td class="p-4 text-[#FF2E44] font-semibold">Standard (ca. 32-36%)</td>\n      </tr>\n      <tr class="hover:bg-white/5 transition-colors">\n        <td class="p-4 font-bold text-white">Klasse III</td>\n        <td class="p-4">Verheiratete (Allein- / Besserverdiener)</td>\n        <td class="p-4 text-emerald-400 font-semibold">Geringster Abzug (ca. 20-25%)</td>\n      </tr>\n      <tr class="hover:bg-white/5 transition-colors">\n        <td class="p-4 font-bold text-white">Klasse V</td>\n        <td class="p-4">Verheiratete (Zweitverdiener)</td>\n        <td class="p-4 text-amber-400 font-semibold">Höchster Abzug (ca. 45-50%)</td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n`;
    } else if (type === "video") {
      snippet = `\n<div class="my-8 aspect-video w-full rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black">\n  <iframe class="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n</div>\n`;
    } else if (type === "image") {
      snippet = `\n<figure class="my-8 rounded-3xl overflow-hidden border border-white/15 bg-[#0f0f0f] shadow-2xl">\n  <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80" alt="Finanzen und Steuern 2026" class="w-full h-auto object-cover max-h-[480px]" />\n  <figcaption class="p-3.5 bg-[#141414] text-center text-xs text-white/60 font-medium border-t border-white/5">Abb. 1: Gehaltsberechnung und Steuerabzüge im Überblick</figcaption>\n</figure>\n`;
    } else if (type === "hr") {
      snippet = `\n<hr class="my-10 border-t border-white/15" />\n`;
    } else if (type === "grid") {
      snippet = `\n<div class="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">\n  <div class="p-6 rounded-2xl bg-[#141414] border border-white/10">\n    <h4 class="font-bold text-white text-lg mb-2">✅ Vorteile</h4>\n    <ul class="space-y-2 text-sm text-white/80 list-disc pl-4">\n      <li>Höheres monatliches Nettoeinkommen</li>\n      <li>Volle Freibeträge nutzbar</li>\n    </ul>\n  </div>\n  <div class="p-6 rounded-2xl bg-[#141414] border border-white/10">\n    <h4 class="font-bold text-white text-lg mb-2">❌ Nachteile</h4>\n    <ul class="space-y-2 text-sm text-white/80 list-disc pl-4">\n      <li>Eventuelle Nachzahlung am Jahresende</li>\n      <li>Pflicht zur Steuererklärung</li>\n    </ul>\n  </div>\n</div>\n`;
    }
    insertFormatting(snippet);
  }

  function cleanWhitespace() {
    setContent((prev) => prev.replace(/\n{3,}/g, "\n\n").trim());
  }

  function insertSampleHook() {
    const hook = `<p class="text-lg leading-relaxed text-white/90 font-medium mb-6">\n  Das deutsche Steuer- und Sozialabgabensystem bringt auch im Jahr <strong>2026</strong> wichtige Neuerungen mit sich. Egal ob Erhöhung des Grundfreibetrags, Anpassungen bei den Beitragsbemessungsgrenzen oder neue Regelungen in den Steuerklassen – wer seine Abrechnung genau versteht, sichert sich am Monatsende bares Geld.\n</p>\n`;
    insertFormatting(hook);
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

        {/* Dynamic SEO Score Badge & Close Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#141414] border border-amber-500/40 shadow-inner">
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
            <span className="text-sm font-bold text-amber-400">
              SEO Score: {passedCount}/{checks.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin-secure")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-500/15 hover:bg-red-500/30 border border-red-500/40 text-red-400 hover:text-red-300 font-extrabold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            title="Editor schließen und zum Dashboard zurückkehren"
          >
            <X size={18} />
            <span>Editor schließen</span>
          </button>
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

          {/* SECTION 5: ADVANCED LUXURY RICH-TEXT STUDIO */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <h2 className="text-xs font-black tracking-widest text-[#FF2E44] uppercase flex items-center gap-2">
                <span>5. ADVANCED LUXURY STORY STUDIO</span>
                <span className="px-2 py-0.5 rounded-md bg-[#E60A1C]/20 text-[#FF2E44] text-[10px] font-bold">PRO 2026</span>
              </h2>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#141414] border border-white/10">
                <button
                  type="button"
                  onClick={() => setEditorTab("edit")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    editorTab === "edit"
                      ? "bg-[#E60A1C] text-white shadow-lg"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <Edit3 size={13} />
                  <span>Schreib-Modus</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("preview")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    editorTab === "preview"
                      ? "bg-[#E60A1C] text-white shadow-lg"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <Eye size={13} />
                  <span>Live-Vorschau</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("split")}
                  className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    editorTab === "split"
                      ? "bg-[#E60A1C] text-white shadow-lg"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <Columns size={13} />
                  <span>Split-Screen</span>
                </button>
              </div>
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
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all"
                >
                  <Wand2 size={13} />
                  <span>⚡ SEO-Einleitung einfügen</span>
                </button>
                <button
                  type="button"
                  onClick={cleanWhitespace}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-xs font-bold transition-all"
                >
                  <Sparkles size={13} />
                  <span>✨ Formatierung bereinigen</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-[#141414] border border-white/15 overflow-hidden shadow-2xl">
              
              {/* Advanced Multi-Row Rich Toolbar (Shown in Edit & Split mode) */}
              {(editorTab === "edit" || editorTab === "split") && (
                <div className="bg-[#0b0b0b] border-b border-white/10 p-3 space-y-2 text-xs">
                  
                  {/* Row 1: Typography & Headings */}
                  <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-white/5">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-wider mr-1">Typografie:</span>
                    <button type="button" onClick={() => insertFormatting("<h2>", "</h2>")} className="px-2.5 py-1 hover:bg-white/10 rounded-lg font-bold text-white bg-white/5 border border-white/10">H2</button>
                    <button type="button" onClick={() => insertFormatting("<h3>", "</h3>")} className="px-2.5 py-1 hover:bg-white/10 rounded-lg font-bold text-white/90 bg-white/5 border border-white/10">H3</button>
                    <button type="button" onClick={() => insertFormatting("<h4>", "</h4>")} className="px-2.5 py-1 hover:bg-white/10 rounded-lg font-semibold text-white/80 bg-white/5 border border-white/10">H4</button>
                    <button type="button" onClick={() => insertFormatting("<p>", "</p>")} className="px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/70 bg-white/5 border border-white/10">Absatz</button>
                    <div className="h-4 w-px bg-white/10 mx-1" />

                    <button type="button" onClick={() => insertFormatting("<strong>", "</strong>")} className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white" title="Fett"><Bold size={15} /></button>
                    <button type="button" onClick={() => insertFormatting("<em>", "</em>")} className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white" title="Kursiv"><Italic size={15} /></button>
                    <button type="button" onClick={() => insertFormatting("<u>", "</u>")} className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white" title="Unterstrichen"><Underline size={15} /></button>
                    <button type="button" onClick={() => insertFormatting("<s>", "</s>")} className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white" title="Durchgestrichen"><Strikethrough size={15} /></button>
                    <div className="h-4 w-px bg-white/10 mx-1" />

                    <button type="button" onClick={() => insertFormatting('<span class="text-[#FF2E44] font-bold">', "</span>")} className="px-2 py-1 rounded bg-[#E60A1C]/15 hover:bg-[#E60A1C]/25 border border-[#E60A1C]/30 text-[#FF2E44] font-extrabold text-[11px]" title="Rote Akzentfarbe">🔴 Rot</button>
                    <button type="button" onClick={() => insertFormatting('<mark class="bg-amber-500/20 text-amber-300 px-1 rounded font-medium">', "</mark>")} className="px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-extrabold text-[11px]" title="Gold Highlight">🟡 Gold</button>
                  </div>

                  {/* Row 2: Structure, Lists & Code */}
                  <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-white/5">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-wider mr-1">Struktur:</span>
                    <button type="button" onClick={() => insertFormatting("<ul>\n  <li>", "</li>\n</ul>")} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10"><List size={13} /><span>Liste</span></button>
                    <button type="button" onClick={() => insertFormatting("<ol>\n  <li>", "</li>\n</ol>")} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10"><ListOrdered size={13} /><span>1. 2. 3.</span></button>
                    <button type="button" onClick={() => insertFormatting("<blockquote>\n  ", "\n</blockquote>")} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10"><Quote size={13} /><span>Zitat</span></button>
                    <button type="button" onClick={() => insertFormatting("<pre><code>", "</code></pre>")} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10"><Code size={13} /><span>Code</span></button>
                    <button type="button" onClick={() => insertSpecialBlock("hr")} className="px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10">--- Trennlinie</button>
                    <button type="button" onClick={() => insertSpecialBlock("grid")} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10"><span>⚡ 2-Spalten Layout</span></button>
                  </div>

                  {/* Row 3: Luxury Callouts & Info Boxes */}
                  <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-white/5">
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider mr-1 flex items-center gap-1"><Sparkles size={12} /><span>Luxus-Boxen:</span></span>
                    <button type="button" onClick={() => insertSpecialBlock("tip")} className="px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold transition-all flex items-center gap-1">💡 Tipp-Box</button>
                    <button type="button" onClick={() => insertSpecialBlock("warning")} className="px-3 py-1 rounded-lg bg-[#E60A1C]/15 hover:bg-[#E60A1C]/25 border border-[#E60A1C]/40 text-[#FF2E44] font-bold transition-all flex items-center gap-1 shadow-sm">⚠️ Wichtig / Warnung</button>
                    <button type="button" onClick={() => insertSpecialBlock("info")} className="px-3 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 font-bold transition-all flex items-center gap-1">ℹ️ Info-Box</button>
                    <button type="button" onClick={() => insertSpecialBlock("tax")} className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/40 text-amber-200 font-extrabold transition-all flex items-center gap-1">💰 Steuer-Tipp 2026</button>
                  </div>

                  {/* Row 4: Interactive CTA & Media Embeds */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider mr-1 flex items-center gap-1"><Calculator size={12} /><span>Embeds:</span></span>
                    <button type="button" onClick={() => insertSpecialBlock("calculator")} className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#E60A1C] to-[#FF2436] hover:brightness-110 text-white font-black transition-all flex items-center gap-1.5 shadow-md">🧮 Brutto-Netto Rechner CTA</button>
                    <button type="button" onClick={() => insertSpecialBlock("image")} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10"><ImageIcon size={13} /><span>Bild + Text</span></button>
                    <button type="button" onClick={() => insertSpecialBlock("table")} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10"><TableIcon size={13} /><span>Steuer-Tabelle</span></button>
                    <button type="button" onClick={() => insertSpecialBlock("video")} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10"><Video size={13} /><span>YouTube</span></button>
                    <button type="button" onClick={() => insertFormatting('<a href="https://" target="_blank" class="text-[#FF2E44] underline font-bold hover:text-[#ff5264]">', '</a>')} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10"><LinkIcon size={13} /><span>Link</span></button>
                  </div>

                </div>
              )}

              {/* Editor Workspace (Edit / Preview / Split) */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 min-h-[480px]">
                
                {/* Textarea (Hidden in preview only mode) */}
                {(editorTab === "edit" || editorTab === "split") && (
                  <div className={editorTab === "edit" ? "md:col-span-2 flex flex-col" : "flex flex-col"}>
                    <div className="bg-[#0f0f0f] px-4 py-1.5 border-b border-white/5 text-[11px] font-bold text-white/40 flex justify-between">
                      <span>HTML / MARKDOWN CODE EDITOR</span>
                      <span className="text-[#E60A1C]">● Live aktiv</span>
                    </div>
                    <textarea
                      id="article-content-editor"
                      rows={18}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Starten Sie Ihre Steuer-Story oder nutzen Sie die Luxus-Buttons oben..."
                      className="w-full flex-1 p-5 bg-[#0a0a0a] text-white/95 text-sm sm:text-base leading-relaxed outline-none font-mono resize-y selection:bg-[#E60A1C]/40 selection:text-white"
                    />
                  </div>
                )}

                {/* Live Visual Preview (Hidden in edit only mode) */}
                {(editorTab === "preview" || editorTab === "split") && (
                  <div className={editorTab === "preview" ? "md:col-span-2 flex flex-col bg-[#080808]" : "flex flex-col bg-[#080808]"}>
                    <div className="bg-[#111111] px-4 py-1.5 border-b border-white/10 text-[11px] font-bold text-emerald-400 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>LIVE BLOG VORSCHAU (REAL-TIME RENDER)</span>
                      </span>
                      <span className="text-white/40">100% Responsive Design</span>
                    </div>
                    <div className="p-6 sm:p-8 overflow-y-auto max-h-[640px] flex-1 prose prose-invert max-w-none">
                      {content ? (
                        <div
                          className="space-y-4 text-white/90 leading-relaxed font-sans"
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full py-16 text-center text-white/30">
                          <FileText size={40} className="mb-3 opacity-30" />
                          <p className="font-bold">Noch kein Inhalt vorhanden</p>
                          <p className="text-xs mt-1 max-w-xs">Tippen Sie links im Editor oder klicken Sie oben auf "⚡ SEO-Einleitung einfügen"</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Editor Analytics & Stats Footer Bar */}
              <div className="bg-[#0b0b0b] border-t border-white/10 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-white/70 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="text-white/40">📝 Wörter:</span>
                    <span className="text-white font-bold">{content.trim().split(/\s+/).filter(Boolean).length}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-white/40">🔤 Zeichen:</span>
                    <span className="text-white font-bold">{content.length}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-white/40">⏱️ Lesezeit:</span>
                    <span className="text-emerald-400 font-bold">{readTime}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-white/80 font-bold">SEO & Lesbarkeit: <span className="text-emerald-400">Exzellent optimiert für 2026</span></span>
                </div>
              </div>

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
          <div className="flex flex-wrap items-center justify-end gap-4 pt-8 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/admin-secure")}
              className="px-6 py-3.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-extrabold text-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <X size={18} />
              <span>Editor schließen (Abbrechen)</span>
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-2xl font-extrabold text-white text-base shadow-xl flex items-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 cursor-pointer"
              style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)", boxShadow: "0 4px 20px rgba(230,10,28,0.50)" }}
            >
              {saving && <Loader2 size={18} className="animate-spin" />}
              <span>{saving ? "Saving..." : "Save & Publish"}</span>
            </button>
          </div>

        </div>

        {/* Right Sidebar Columns (9 to 12 on desktop) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* STICKY QUICK ACTION & CLOSE BAR */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#181818] via-[#121212] to-[#1a0507] border border-red-500/30 space-y-3 sticky top-24 z-40 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between text-xs font-black text-white/80 border-b border-white/10 pb-2.5">
              <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-[#FF2E44]" /><span>SCHNELL-AKTIONEN</span></span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold animate-pulse">● Live</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => router.push("/admin-secure")}
                className="w-full py-3 px-3 rounded-2xl bg-red-500/15 hover:bg-red-500/30 border border-red-500/40 text-red-400 hover:text-red-300 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
                title="Editor schließen und zurück zum Dashboard"
              >
                <X size={16} />
                <span>Schließen</span>
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 px-3 rounded-2xl font-extrabold text-white text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
                style={{ background: "linear-gradient(135deg,#E60A1C,#FF2436)", boxShadow: "0 4px 15px rgba(230,10,28,0.40)" }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                <span>{saving ? "Speichert..." : "Speichern"}</span>
              </button>
            </div>
          </div>

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
