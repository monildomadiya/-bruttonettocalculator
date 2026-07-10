"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Code, Link as LinkIcon, Unlink, Image as ImageIcon,
  Table as TableIcon, Video, Eye, Edit3, Columns, Wand2, Calculator, Sparkles,
  Maximize2, Minimize2, Check, X, HelpCircle, RotateCcw, Palette
} from "lucide-react";

interface WordPressEditorProps {
  content: string;
  onChange: (newContent: string) => void;
}

export default function WordPressEditor({ content, onChange }: WordPressEditorProps) {
  const [mode, setMode] = useState<"visual" | "code" | "split">("visual");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Modals for Link, Image, Video
  const [activeModal, setActiveModal] = useState<"link" | "image" | "video" | null>(null);
  const [modalInput1, setModalInput1] = useState("");
  const [modalInput2, setModalInput2] = useState("");
  const [modalInput3, setModalInput3] = useState("");
  const [linkBlank, setLinkBlank] = useState(true);

  // Sync external content to visual editor on load or switch
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || "";
    }
  }, [content, mode]);

  // Handle live typing in visual editor
  function handleVisualInput() {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  // Execute standard formatting commands
  function execCmd(command: string, value: string = "") {
    if (mode === "visual") {
      editorRef.current?.focus();
      document.execCommand(command, false, value);
      handleVisualInput();
    } else {
      // In code mode, insert HTML tag wrapper
      let openTag = "";
      let closeTag = "";
      if (command === "bold") { openTag = "<strong>"; closeTag = "</strong>"; }
      else if (command === "italic") { openTag = "<em>"; closeTag = "</em>"; }
      else if (command === "underline") { openTag = "<u>"; closeTag = "</u>"; }
      else if (command === "strikethrough") { openTag = "<s>"; closeTag = "</s>"; }
      else if (command === "insertUnorderedList") { openTag = "<ul>\n  <li>"; closeTag = "</li>\n</ul>"; }
      else if (command === "insertOrderedList") { openTag = "<ol>\n  <li>"; closeTag = "</li>\n</ol>"; }
      else if (command === "formatBlock") { openTag = `<${value}>`; closeTag = `</${value}>`; }
      else if (command === "foreColor") { openTag = `<span style="color:${value}">`; closeTag = "</span>"; }
      
      const textarea = document.getElementById("wp-code-editor") as HTMLTextAreaElement | null;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = content.substring(start, end);
        const replacement = openTag + selected + closeTag;
        const newContent = content.substring(0, start) + replacement + content.substring(end);
        onChange(newContent);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
        }, 10);
      } else {
        onChange(content + openTag + closeTag);
      }
    }
  }

  // Insert raw HTMLsnippet at cursor position
  function insertHtmlSnippet(snippet: string) {
    if (mode === "visual" && editorRef.current) {
      editorRef.current.focus();
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        let range = sel.getRangeAt(0);
        range.deleteContents();
        const el = document.createElement("div");
        el.innerHTML = snippet;
        const frag = document.createDocumentFragment();
        let node, lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } else {
        editorRef.current.innerHTML += snippet;
      }
      handleVisualInput();
    } else {
      const textarea = document.getElementById("wp-code-editor") as HTMLTextAreaElement | null;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + snippet + content.substring(end);
        onChange(newContent);
      } else {
        onChange(content + snippet);
      }
    }
  }

  // Preset Special Blocks
  function insertSpecialBlock(type: string) {
    let snippet = "";
    if (type === "tip") {
      snippet = `\n<div class="my-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-4 shadow-lg">\n  <div class="text-2xl select-none mt-1">💡</div>\n  <div>\n    <h4 class="font-bold text-white mb-1 !mt-0">Experten-Tipp</h4>\n    <p class="text-sm leading-relaxed text-emerald-200/90 !mb-0">Hier Ihren hilfreichen Tipp oder Hinweis eintragen...</p>\n  </div>\n</div>\n`;
    } else if (type === "warning") {
      snippet = `\n<div class="my-6 p-5 rounded-2xl bg-[#E60A1C]/15 border border-[#E60A1C]/40 text-white flex items-start gap-4 shadow-[0_0_25px_rgba(230,10,28,0.2)]">\n  <div class="text-2xl select-none mt-1">⚠️</div>\n  <div>\n    <h4 class="font-bold text-[#FF2E44] mb-1 !mt-0">Wichtiger Hinweis (Achtung)</h4>\n    <p class="text-sm leading-relaxed text-white/90 !mb-0">Hier wichtige Fristen, Steuerstrafen oder Gesetzesänderungen notieren...</p>\n  </div>\n</div>\n`;
    } else if (type === "info") {
      snippet = `\n<div class="my-6 p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300 flex items-start gap-4">\n  <div class="text-2xl select-none mt-1">ℹ️</div>\n  <div>\n    <h4 class="font-bold text-white mb-1 !mt-0">Gut zu wissen</h4>\n    <p class="text-sm leading-relaxed text-blue-200/90 !mb-0">Hier Hintergrundinformationen oder Details zur Sozialversicherung angeben...</p>\n  </div>\n</div>\n`;
    } else if (type === "tax") {
      snippet = `\n<div class="my-8 p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#1a1a1a] to-transparent border-l-4 border-amber-400 text-amber-200 shadow-xl">\n  <div class="flex items-center gap-2 mb-2">\n    <span class="text-xl">💰</span>\n    <h4 class="font-extrabold text-amber-400 uppercase tracking-wider text-xs">Steuer-Optimierung 2026/2027</h4>\n  </div>\n  <p class="text-base text-white font-medium leading-relaxed">Wussten Sie schon? Mit der richtigen Steuerklasse oder Freibeträgen lassen sich jährlich bis zu 1.200 € mehr Netto herausholen!</p>\n</div>\n`;
    } else if (type === "calculator") {
      snippet = `\n<div class="my-10 p-8 rounded-[32px] bg-gradient-to-br from-[#161616] via-[#0d0d0d] to-[#1c0305] border border-[#E60A1C]/40 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">\n  <div class="absolute top-0 right-0 w-48 h-48 bg-[#E60A1C]/15 rounded-full blur-3xl pointer-events-none"></div>\n  <span class="inline-block px-3 py-1 rounded-full bg-[#E60A1C]/20 border border-[#E60A1C]/40 text-[#FF2E44] text-xs font-extrabold uppercase tracking-widest mb-3">Kostenloser Gehaltsrechner</span>\n  <h3 class="text-2xl sm:text-3xl font-black text-white mb-3">Wie viel Netto bleibt von Ihrem Brutto in 2026/2027?</h3>\n  <p class="text-white/70 max-w-xl mx-auto mb-6 text-sm sm:text-base">Berechnen Sie jetzt sekundenschnell Ihre exakten Abzüge für Lohnsteuer, Krankenkasse, Rentenversicherung und Pflegeversicherung!</p>\n  <a href="/" target="_blank" class="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-extrabold text-white text-sm sm:text-base shadow-xl transition-all hover:scale-105" style="background: linear-gradient(135deg,#E60A1C,#FF2436); box-shadow: 0 4px 20px rgba(230,10,28,0.5); color:#ffffff; text-decoration:none;">🧮 Jetzt Brutto-Netto berechnen →</a>\n</div>\n`;
    } else if (type === "table") {
      snippet = `\n<div class="my-8 overflow-x-auto rounded-2xl border border-white/15 bg-[#111111] shadow-2xl">\n  <table class="w-full text-left border-collapse text-sm">\n    <thead>\n      <tr class="bg-[#1a1a1a] text-white border-b border-white/15 font-bold">\n        <th class="p-4">Steuerklasse</th>\n        <th class="p-4">Zielgruppe / Merkmal</th>\n        <th class="p-4">Durchschnittlicher Abzug</th>\n      </tr>\n    </thead>\n    <tbody class="divide-y divide-white/10 text-white/80">\n      <tr class="hover:bg-white/5 transition-colors">\n        <td class="p-4 font-bold text-white">Klasse I</td>\n        <td class="p-4">Ledige, Geschiedene</td>\n        <td class="p-4 text-[#FF2E44] font-semibold">Standard (ca. 32-36%)</td>\n      </tr>\n      <tr class="hover:bg-white/5 transition-colors">\n        <td class="p-4 font-bold text-white">Klasse III</td>\n        <td class="p-4">Verheiratete (Allein- / Besserverdiener)</td>\n        <td class="p-4 text-emerald-400 font-semibold">Geringster Abzug (ca. 20-25%)</td>\n      </tr>\n      <tr class="hover:bg-white/5 transition-colors">\n        <td class="p-4 font-bold text-white">Klasse V</td>\n        <td class="p-4">Verheiratete (Zweitverdiener)</td>\n        <td class="p-4 text-amber-400 font-semibold">Höchster Abzug (ca. 45-50%)</td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n`;
    } else if (type === "hr") {
      snippet = `\n<hr class="my-10 border-t border-white/15" />\n`;
    } else if (type === "grid") {
      snippet = `\n<div class="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">\n  <div class="p-6 rounded-2xl bg-[#141414] border border-white/10">\n    <h4 class="font-bold text-white text-lg mb-2">✅ Vorteile</h4>\n    <ul class="space-y-2 text-sm text-white/80 list-disc pl-4">\n      <li>Höheres monatliches Nettoeinkommen</li>\n      <li>Volle Freibeträge nutzbar</li>\n    </ul>\n  </div>\n  <div class="p-6 rounded-2xl bg-[#141414] border border-white/10">\n    <h4 class="font-bold text-white text-lg mb-2">❌ Nachteile</h4>\n    <ul class="space-y-2 text-sm text-white/80 list-disc pl-4">\n      <li>Eventuelle Nachzahlung am Jahresende</li>\n      <li>Pflicht zur Steuererklärung</li>\n    </ul>\n  </div>\n</div>\n`;
    } else if (type === "hook") {
      snippet = `<p class="text-lg leading-relaxed text-white/90 font-medium mb-6">\n  Das deutsche Steuer- und Sozialabgabensystem bringt auch im Jahr <strong>2026/2027</strong> wichtige Neuerungen mit sich. Egal ob Erhöhung des Grundfreibetrags, Anpassungen bei den Beitragsbemessungsgrenzen oder neue Regelungen in den Steuerklassen – wer seine Abrechnung genau versteht, sichert sich am Monatsende bares Geld.\n</p>\n`;
    }
    insertHtmlSnippet(snippet);
  }

  // Handle Modal Submit
  function handleModalSubmit() {
    if (activeModal === "link" && modalInput1) {
      const target = linkBlank ? ' target="_blank" rel="noopener"' : "";
      const text = modalInput2 || modalInput1;
      insertHtmlSnippet(`<a href="${modalInput1}"${target} class="text-[#FF2E44] underline font-bold hover:text-[#ff5264]">${text}</a>`);
    } else if (activeModal === "image" && modalInput1) {
      const alt = modalInput2 || "Image";
      const caption = modalInput3 ? `<figcaption class="p-3 bg-[#141414] text-center text-xs text-white/60 font-medium border-t border-white/5">${modalInput3}</figcaption>` : "";
      insertHtmlSnippet(`\n<figure class="my-8 rounded-3xl overflow-hidden border border-white/15 bg-[#0f0f0f] shadow-2xl">\n  <img src="${modalInput1}" alt="${alt}" class="w-full h-auto object-cover max-h-[500px]" />\n  ${caption}\n</figure>\n`);
    } else if (activeModal === "video" && modalInput1) {
      let embedUrl = modalInput1;
      if (modalInput1.includes("watch?v=")) {
        embedUrl = modalInput1.replace("watch?v=", "embed/");
      } else if (modalInput1.includes("youtu.be/")) {
        const id = modalInput1.split("youtu.be/")[1]?.split("?")[0];
        if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
      }
      insertHtmlSnippet(`\n<div class="my-8 aspect-video w-full rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black">\n  <iframe class="w-full h-full" src="${embedUrl}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n</div>\n`);
    }
    setActiveModal(null);
    setModalInput1("");
    setModalInput2("");
    setModalInput3("");
  }

  function cleanWhitespace() {
    onChange(content.replace(/\n{3,}/g, "\n\n").trim());
  }

  // Word & Char Count
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const chars = content.length;
  const readMins = Math.max(1, Math.ceil(words / 200));

  return (
    <div className={`transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-50 bg-[#080808] p-4 sm:p-8 flex flex-col overflow-y-auto" : "space-y-4"}`}>
      
      {/* Editor Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#E60A1C] shadow-[0_0_10px_#E60A1C] animate-pulse" />
          <h3 className="text-sm font-black tracking-widest text-white uppercase flex items-center gap-2">
            <span>WordPress Gutenberg & Classic WYSIWYG Studio</span>
            <span className="px-2 py-0.5 rounded-md bg-[#E60A1C]/20 text-[#FF2E44] text-[10px] font-bold">PRO</span>
          </h3>
        </div>

        {/* View Switcher Tabs (WordPress Style) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#141414] border border-white/10">
            <button
              type="button"
              onClick={() => setMode("visual")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                mode === "visual"
                  ? "bg-[#E60A1C] text-white shadow-lg shadow-[#E60A1C]/30"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Eye size={13} />
              <span>Visueller Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("code")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                mode === "code"
                  ? "bg-[#E60A1C] text-white shadow-lg shadow-[#E60A1C]/30"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Code size={13} />
              <span>HTML Code</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("split")}
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                mode === "split"
                  ? "bg-[#E60A1C] text-white shadow-lg shadow-[#E60A1C]/30"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Columns size={13} />
              <span>Split-Screen</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-[#141414] border border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-all"
            title={isFullscreen ? "Vollbild beenden" : "Vollbild-Schreibmodus"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Main Formatting Toolbar (WordPress Gutenberg Style) */}
      <div className="rounded-2xl bg-[#121212] border border-white/15 shadow-2xl overflow-hidden">
        <div className="bg-[#0e0e0e] border-b border-white/10 p-3 space-y-2.5 text-xs">
          
          {/* Row 1: Headings & Typography */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2.5 border-b border-white/5">
            <span className="text-[10px] font-black uppercase text-white/40 tracking-wider mr-1">Typografie:</span>
            
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("formatBlock", "p"); }} className="px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10 font-medium">Absatz</button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("formatBlock", "h2"); }} className="px-2.5 py-1 hover:bg-white/10 rounded-lg font-bold text-white bg-white/5 border border-white/10">H2 Überschrift</button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("formatBlock", "h3"); }} className="px-2.5 py-1 hover:bg-white/10 rounded-lg font-bold text-white/90 bg-white/5 border border-white/10">H3</button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("formatBlock", "h4"); }} className="px-2.5 py-1 hover:bg-white/10 rounded-lg font-semibold text-white/80 bg-white/5 border border-white/10">H4</button>
            <div className="h-4 w-px bg-white/10 mx-1" />

            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("bold"); }} className="p-1.5 hover:bg-white/10 rounded-lg text-white/90 hover:text-white font-bold" title="Fett (Ctrl+B)"><Bold size={15} /></button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("italic"); }} className="p-1.5 hover:bg-white/10 rounded-lg text-white/90 hover:text-white" title="Kursiv (Ctrl+I)"><Italic size={15} /></button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("underline"); }} className="p-1.5 hover:bg-white/10 rounded-lg text-white/90 hover:text-white" title="Unterstrichen (Ctrl+U)"><Underline size={15} /></button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("strikethrough"); }} className="p-1.5 hover:bg-white/10 rounded-lg text-white/90 hover:text-white" title="Durchgestrichen"><Strikethrough size={15} /></button>
            <div className="h-4 w-px bg-white/10 mx-1" />

            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("justifyLeft"); }} className="p-1.5 hover:bg-white/10 rounded-lg text-white/80" title="Linksbündig"><AlignLeft size={15} /></button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("justifyCenter"); }} className="p-1.5 hover:bg-white/10 rounded-lg text-white/80" title="Zentriert"><AlignCenter size={15} /></button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("justifyRight"); }} className="p-1.5 hover:bg-white/10 rounded-lg text-white/80" title="Rechtsbündig"><AlignRight size={15} /></button>
            <div className="h-4 w-px bg-white/10 mx-1" />

            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("removeFormat"); }} className="inline-flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white" title="Formatierung löschen"><RotateCcw size={13} /><span>Reset</span></button>
          </div>

          {/* Row 2: Colors, Highlights & Structure */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2.5 border-b border-white/5">
            <span className="text-[10px] font-black uppercase text-white/40 tracking-wider mr-1 flex items-center gap-1"><Palette size={12} /><span>Farben:</span></span>
            
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("foreColor", "#FF2E44"); }} className="px-2.5 py-1 rounded bg-[#E60A1C]/15 hover:bg-[#E60A1C]/25 border border-[#E60A1C]/40 text-[#FF2E44] font-extrabold text-[11px]">🔴 Rot</button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("foreColor", "#F59E0B"); }} className="px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-extrabold text-[11px]">🟡 Gold</button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("foreColor", "#10B981"); }} className="px-2.5 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-extrabold text-[11px]">🟢 Grün</button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("foreColor", "#38BDF8"); }} className="px-2.5 py-1 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 font-extrabold text-[11px]">🔵 Blau</button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("foreColor", "#FFFFFF"); }} className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-[11px]">⚪ Weiß</button>
            <div className="h-4 w-px bg-white/10 mx-1" />

            <button type="button" onMouseDown={(e) => { e.preventDefault(); insertHtmlSnippet('<mark class="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">'); }} className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-[11px] font-bold">✨ Gold Highlight</button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); insertHtmlSnippet('<span class="bg-[#E60A1C]/20 text-[#FF2E44] px-1.5 py-0.5 rounded font-extrabold">'); }} className="px-2 py-1 rounded bg-[#E60A1C]/10 hover:bg-[#E60A1C]/20 border border-[#E60A1C]/30 text-[#FF2E44] text-[11px] font-bold">🔥 Rot Badge</button>
            <div className="h-4 w-px bg-white/10 mx-1" />

            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("insertUnorderedList"); }} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10"><List size={13} /><span>Aufzählung</span></button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("insertOrderedList"); }} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10"><ListOrdered size={13} /><span>1. 2. 3.</span></button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("formatBlock", "blockquote"); }} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10"><Quote size={13} /><span>Zitat</span></button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); insertHtmlSnippet("<pre><code>\n  \n</code></pre>"); }} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10"><Code size={13} /><span>Code</span></button>
          </div>

          {/* Row 3: Links, Media Embeds & Layouts */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2.5 border-b border-white/5">
            <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider mr-1">Medien & Links:</span>
            
            <button type="button" onMouseDown={(e) => { e.preventDefault(); setActiveModal("link"); }} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-sky-300 bg-sky-500/10 border border-sky-500/20 font-bold"><LinkIcon size={13} /><span>Link einfügen</span></button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd("unlink"); }} className="inline-flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white"><Unlink size={13} /><span>Unlink</span></button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); setActiveModal("image"); }} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 font-bold"><ImageIcon size={13} /><span>Bild + Text</span></button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); setActiveModal("video"); }} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-red-300 bg-red-500/10 border border-red-500/20 font-bold"><Video size={13} /><span>YouTube Video</span></button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); insertSpecialBlock("table"); }} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/80 bg-white/5 border border-white/10"><TableIcon size={13} /><span>Steuer-Tabelle</span></button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); insertSpecialBlock("hr"); }} className="px-2.5 py-1 hover:bg-white/10 rounded-lg text-white/70 bg-white/5 border border-white/10">--- Trennlinie</button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); insertSpecialBlock("grid"); }} className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-lg text-amber-300 bg-amber-500/10 border border-amber-500/20 font-bold"><Columns size={13} /><span>⚡ 2-Spalten Grid</span></button>
          </div>

          {/* Row 4: Luxury Fintech WordPress Widgets (Shortcodes) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider mr-1 flex items-center gap-1"><Sparkles size={12} /><span>WordPress Luxus-Widgets:</span></span>
            
            <button type="button" onMouseDown={(e) => { e.preventDefault(); insertSpecialBlock("tip"); }} className="px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold transition-all flex items-center gap-1">💡 Tipp-Box</button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); insertSpecialBlock("warning"); }} className="px-3 py-1 rounded-lg bg-[#E60A1C]/15 hover:bg-[#E60A1C]/25 border border-[#E60A1C]/40 text-[#FF2E44] font-bold transition-all flex items-center gap-1 shadow-sm">⚠️ Wichtig / Warnung</button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); insertSpecialBlock("info"); }} className="px-3 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 font-bold transition-all flex items-center gap-1">ℹ️ Info-Box</button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); insertSpecialBlock("tax"); }} className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/40 text-amber-200 font-extrabold transition-all flex items-center gap-1">💰 Steuer-Tipp</button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); insertSpecialBlock("calculator"); }} className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#E60A1C] to-[#FF2436] hover:brightness-110 text-white font-black transition-all flex items-center gap-1.5 shadow-md">🧮 Brutto-Netto Rechner CTA</button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); insertSpecialBlock("hook"); }} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-bold transition-all"><Wand2 size={13} /><span>⚡ SEO-Hook</span></button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); cleanWhitespace(); }} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white ml-auto"><Sparkles size={13} /><span>Clean Format</span></button>
          </div>

        </div>

        {/* Modal Dialog for Link, Image, Video */}
        {activeModal && (
          <div className="bg-[#181818] border-b border-white/20 p-4 animate-fade-down flex flex-col gap-3">
            <div className="flex items-center justify-between font-bold text-sm text-white">
              <span>
                {activeModal === "link" && "🔗 Link einfügen"}
                {activeModal === "image" && "🖼️ Bild einfügen (URL)"}
                {activeModal === "video" && "📺 YouTube Video einfügen"}
              </span>
              <button type="button" onClick={() => setActiveModal(null)} className="text-white/60 hover:text-white"><X size={16} /></button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder={activeModal === "link" ? "https://beispiel.de..." : activeModal === "image" ? "https://res.cloudinary.com/... oder Bild-URL" : "https://www.youtube.com/watch?v=..."}
                value={modalInput1}
                onChange={(e) => setModalInput1(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#0c0c0c] border border-white/20 text-white text-sm outline-none focus:border-[#E60A1C]"
                autoFocus
              />
              {activeModal === "link" && (
                <input
                  type="text"
                  placeholder="Link-Text (Optional)"
                  value={modalInput2}
                  onChange={(e) => setModalInput2(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#0c0c0c] border border-white/20 text-white text-sm outline-none focus:border-[#E60A1C]"
                />
              )}
              {activeModal === "image" && (
                <>
                  <input
                    type="text"
                    placeholder="Alt-Text (SEO Beschreibung)"
                    value={modalInput2}
                    onChange={(e) => setModalInput2(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#0c0c0c] border border-white/20 text-white text-sm outline-none focus:border-[#E60A1C]"
                  />
                  <input
                    type="text"
                    placeholder="Bildunterschrift / Caption (Optional)"
                    value={modalInput3}
                    onChange={(e) => setModalInput3(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-[#0c0c0c] border border-white/20 text-white text-sm outline-none focus:border-[#E60A1C]"
                  />
                </>
              )}
            </div>

            {activeModal === "link" && (
              <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                <input type="checkbox" checked={linkBlank} onChange={(e) => setLinkBlank(e.target.checked)} className="rounded bg-black border-white/30 text-[#E60A1C] focus:ring-0" />
                <span>In neuem Tab öffnen (_blank)</span>
              </label>
            )}

            <div className="flex justify-end gap-2 mt-1">
              <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold">Abbrechen</button>
              <button type="button" onClick={handleModalSubmit} className="px-5 py-1.5 rounded-xl bg-[#E60A1C] hover:bg-[#ff2436] text-white text-xs font-extrabold shadow-md">Einfügen →</button>
            </div>
          </div>
        )}

        {/* Editor Workspace (Visual vs Code vs Split) */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 min-h-[520px]">
          
          {/* Visueller Editor Mode (WYSIWYG) */}
          {(mode === "visual" || mode === "split") && (
            <div className={mode === "visual" ? "md:col-span-2 flex flex-col bg-[#0a0a0a]" : "flex flex-col bg-[#0a0a0a]"}>
              <div className="bg-[#111111] px-4 py-1.5 border-b border-white/5 text-[11px] font-bold text-white/40 flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>VISUELLER WYSIWYG EDITOR (WORDPRESS GUTENBERG STYLE)</span>
                </span>
                <span className="text-white/40">Direkt tippen und formatieren</span>
              </div>
              <div
                ref={editorRef}
                contentEditable={true}
                onInput={handleVisualInput}
                className="w-full flex-1 p-6 sm:p-8 text-white/95 text-sm sm:text-base leading-relaxed outline-none prose prose-invert max-w-none min-h-[500px] focus:ring-0 selection:bg-[#E60A1C]/40 selection:text-white overflow-y-auto"
                style={{ minHeight: isFullscreen ? "calc(100vh - 220px)" : "500px" }}
              />
            </div>
          )}

          {/* HTML / Markdown Code Editor Mode */}
          {(mode === "code" || mode === "split") && (
            <div className={mode === "code" ? "md:col-span-2 flex flex-col bg-[#0f0f0f]" : "flex flex-col bg-[#0f0f0f]"}>
              <div className="bg-[#141414] px-4 py-1.5 border-b border-white/5 text-[11px] font-bold text-white/40 flex justify-between items-center">
                <span>HTML / MARKDOWN SOURCE CODE</span>
                <span className="text-[#FF2E44]">● Live synchronisiert</span>
              </div>
              <textarea
                id="wp-code-editor"
                rows={22}
                value={content}
                onChange={(e) => onChange(e.target.value)}
                placeholder="HTML Quellcode oder Markdown..."
                className="w-full flex-1 p-5 bg-[#080808] text-white/90 text-sm font-mono leading-relaxed outline-none resize-y selection:bg-[#E60A1C]/40 selection:text-white"
                style={{ minHeight: isFullscreen ? "calc(100vh - 220px)" : "500px" }}
              />
            </div>
          )}

        </div>

        {/* WordPress Style Status Bar at Bottom */}
        <div className="bg-[#0b0b0b] px-5 py-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/70">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-white">📄 Wörter:</span>
              <span className="text-amber-400 font-bold">{words}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-white">🔤 Zeichen:</span>
              <span>{chars.toLocaleString("de-DE")}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-white">⏱️ Lesezeit:</span>
              <span className="text-emerald-400 font-bold">ca. {readMins} Min.</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-white/50">
            <span>Modus: <strong className="text-white uppercase">{mode}</strong></span>
            <span>•</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1"><Check size={13} /> Auto-Sync Aktiv</span>
          </div>
        </div>
      </div>

    </div>
  );
}
