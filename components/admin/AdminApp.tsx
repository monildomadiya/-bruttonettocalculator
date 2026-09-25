"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Images, LayoutDashboard, Loader2, RefreshCw, Sparkles, Wrench } from "lucide-react";
import type { Post } from "@/lib/posts";
import {
  AdminContext,
  type AdminContextValue,
  type AdminStory,
  type LinkOption,
  type PostEditorState,
  type StoryEditorState,
  type Tab,
} from "./context";
import Dashboard from "./Dashboard";
import PostEditor from "./PostEditor";
import PostsPanel from "./PostsPanel";
import StoriesPanel from "./StoriesPanel";
import StoryEditor from "./StoryEditor";
import ToolsPanel from "./ToolsPanel";
import { Button, inputClass, ToastProvider } from "./ui";

/** Password lives only for this browser tab (sessionStorage), never in a cookie. */
const PW_KEY = "bnc_stories_pw";

const TABS: { id: Tab; label: string; icon: typeof Images }[] = [
  { id: "dashboard", label: "Übersicht", icon: LayoutDashboard },
  { id: "stories", label: "Stories", icon: Sparkles },
  { id: "posts", label: "Infografiken", icon: Images },
  { id: "tools", label: "Tools", icon: Wrench },
];

function tabFromUrl(): Tab {
  const t = new URLSearchParams(window.location.search).get("tab");
  return TABS.some((x) => x.id === t) ? (t as Tab) : "dashboard";
}

export default function AdminApp(props: { linkOptions: LinkOption[]; calculators: LinkOption[] }) {
  return (
    <ToastProvider>
      <Admin {...props} />
    </ToastProvider>
  );
}

function Admin({ linkOptions, calculators }: { linkOptions: LinkOption[]; calculators: LinkOption[] }) {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [tab, setTabState] = useState<Tab>("dashboard");
  const [stories, setStories] = useState<AdminStory[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [storyEditor, setStoryEditor] = useState<StoryEditorState | null>(null);
  const [postEditor, setPostEditor] = useState<PostEditorState | null>(null);

  const logout = useCallback(() => {
    sessionStorage.removeItem(PW_KEY);
    setPassword("");
    setAuthed(false);
  }, []);

  const request = useCallback(
    async <T,>(pw: string, path: string, init: { method?: string; body?: unknown } = {}): Promise<T> => {
      const res = await fetch(path, {
        method: init.method ?? "GET",
        headers: {
          "x-stories-password": pw,
          ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
        },
        body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) logout();
      if (!res.ok) throw new Error(data.error || `Fehler ${res.status}`);
      return data as T;
    },
    [logout]
  );

  const loadAll = useCallback(
    async (pw: string) => {
      setLoading(true);
      try {
        const [s, p] = await Promise.all([
          request<{ stories: AdminStory[] }>(pw, "/api/stories/admin"),
          request<{ posts: Post[] }>(pw, "/api/posts/admin"),
        ]);
        setStories(s.stories);
        setPosts(p.posts);
      } finally {
        setLoading(false);
      }
    },
    [request]
  );

  // Restore the session and the tab from the URL.
  useEffect(() => {
    setTabState(tabFromUrl());
    const saved = sessionStorage.getItem(PW_KEY);
    if (!saved) return setChecking(false);
    setPassword(saved);
    loadAll(saved)
      .then(() => setAuthed(true))
      .catch((e) => setLoginError(e.message))
      .finally(() => setChecking(false));
  }, [loadAll]);

  const setTab = useCallback((t: Tab) => {
    setTabState(t);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", t);
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0 });
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setChecking(true);
    try {
      await loadAll(password);
      sessionStorage.setItem(PW_KEY, password);
      setAuthed(true);
    } catch (err) {
      setLoginError((err as Error).message);
    } finally {
      setChecking(false);
    }
  };

  const ctx: AdminContextValue = useMemo(
    () => ({
      api: (path, init) => request(password, path, init),
      stories,
      posts,
      loading,
      reload: () => loadAll(password),
      setTab,
      openStory: setStoryEditor,
      openPost: setPostEditor,
      linkOptions: [
        ...posts.map((p) => ({ href: `/infografiken/${p.slug}`, label: p.title, group: "Infografiken" })),
        ...linkOptions.filter((o) => o.group !== "Infografiken"),
      ],
      calculators,
      logout,
    }),
    [request, password, stories, posts, loading, loadAll, setTab, linkOptions, calculators, logout]
  );

  if (!authed) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#F4F5F7] px-4">
        <form onSubmit={login} className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-xl shadow-black/5">
          <div
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl p-[3px]"
            style={{ background: "conic-gradient(from 210deg, #E60A1C, #FF6A00, #FFC400, #FF6A00, #E60A1C)" }}
          >
            <span className="flex h-full w-full items-center justify-center rounded-[13px] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon.png?v=7" alt="" className="h-7 w-7 object-contain" />
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#16181D]">Admin</h1>
          <p className="mt-1 text-sm text-black/55">Stories, Infografiken und Tools an einem Ort.</p>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass} mt-5`}
            placeholder="Passwort"
            aria-label="Passwort"
            required
          />
          {loginError && <p className="mt-3 text-sm text-[#B5081A]">{loginError}</p>}
          <Button type="submit" busy={checking} className="mt-5 w-full">
            Anmelden
          </Button>
        </form>
      </div>
    );
  }

  const current = TABS.find((t) => t.id === tab)!;

  return (
    <AdminContext.Provider value={ctx}>
      <div className="min-h-[100dvh] bg-[#F4F5F7] lg:pl-64">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-black/[0.06] bg-white p-4 lg:flex">
          <div className="mb-6 flex items-center gap-3 px-2 pt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.png?v=7" alt="" className="h-9 w-9 object-contain" />
            <div className="leading-tight">
              <p className="font-display font-bold text-[#16181D]">BruttoNetto</p>
              <p className="text-xs text-black/50">Admin</p>
            </div>
          </div>
          <nav className="space-y-1" aria-label="Admin">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-current={tab === id ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  tab === id ? "bg-[#E60A1C]/10 text-[#E60A1C]" : "text-black/65 hover:bg-black/[0.04]"
                }`}
              >
                <Icon size={18} /> {label}
                {id === "stories" && <Badge n={stories.filter((s) => !s.expired).length} />}
                {id === "posts" && <Badge n={posts.length} />}
              </button>
            ))}
          </nav>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="mt-auto rounded-xl px-3 py-2.5 text-sm font-semibold text-black/55 hover:bg-black/[0.04]"
          >
            Website öffnen ↗
          </a>
        </aside>

        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/85 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl items-center gap-3">
            <h1 className="flex-1 font-display text-xl font-bold text-[#16181D] sm:text-2xl">{current.label}</h1>
            <button
              type="button"
              onClick={() => loadAll(password).catch(() => {})}
              aria-label="Neu laden"
              className="flex h-11 w-11 items-center justify-center rounded-full text-black/55 hover:bg-black/5"
            >
              {loading ? <Loader2 size={19} className="animate-spin" /> : <RefreshCw size={19} />}
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-[calc(96px+env(safe-area-inset-bottom))] pt-5 sm:px-6 lg:px-8 lg:pb-12">
          {tab === "dashboard" && <Dashboard />}
          {tab === "stories" && <StoriesPanel />}
          {tab === "posts" && <PostsPanel />}
          {tab === "tools" && <ToolsPanel />}
        </main>

        {/* Mobile bottom navigation */}
        <nav
          aria-label="Admin"
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-black/[0.06] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id ? "page" : undefined}
              className={`flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] font-semibold ${
                tab === id ? "text-[#E60A1C]" : "text-black/50"
              }`}
            >
              <Icon size={21} />
              {label}
            </button>
          ))}
        </nav>

        {storyEditor && <StoryEditor state={storyEditor} onClose={() => setStoryEditor(null)} />}
        {postEditor && <PostEditor state={postEditor} onClose={() => setPostEditor(null)} />}
      </div>
    </AdminContext.Provider>
  );
}

function Badge({ n }: { n: number }) {
  if (!n) return null;
  return <span className="ml-auto rounded-full bg-black/[0.06] px-2 py-0.5 text-xs font-bold text-black/55">{n}</span>;
}
