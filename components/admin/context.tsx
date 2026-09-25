"use client";

import { createContext, useContext } from "react";
import type { Post } from "@/lib/posts";

export interface AdminStory {
  id: string;
  version: number;
  title: string;
  caption: string;
  link: string;
  linkLabel: string;
  createdAt: string;
  expiresAt: string | null;
  expired: boolean;
}

export interface LinkOption {
  href: string;
  label: string;
  group: string;
}

export type Tab = "dashboard" | "stories" | "posts" | "tools";

export type StoryEditorState =
  | { mode: "create" }
  | { mode: "edit"; story: AdminStory }
  | { mode: "from-post"; post: Post };

export type PostEditorState = { mode: "create" } | { mode: "edit"; post: Post } | { mode: "duplicate"; post: Post };

export interface AdminContextValue {
  api: <T = Record<string, unknown>>(path: string, init?: { method?: string; body?: unknown }) => Promise<T>;
  stories: AdminStory[];
  posts: Post[];
  loading: boolean;
  reload: () => Promise<void>;
  setTab: (tab: Tab) => void;
  openStory: (state: StoryEditorState) => void;
  openPost: (state: PostEditorState) => void;
  linkOptions: LinkOption[];
  calculators: LinkOption[];
  logout: () => void;
}

export const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin outside AdminApp");
  return ctx;
}

/** "noch 5 Std.", "noch 3 Tage", "abgelaufen", "unbegrenzt" */
export function expiryLabel(expiresAt: string | null): string {
  if (!expiresAt) return "unbegrenzt";
  const ms = Date.parse(expiresAt) - Date.now();
  if (ms <= 0) return "abgelaufen";
  const hours = Math.round(ms / 3600000);
  if (hours < 1) return "noch < 1 Std.";
  if (hours < 48) return `noch ${hours} Std.`;
  return `noch ${Math.round(hours / 24)} Tage`;
}

export function expiresSoon(s: AdminStory): boolean {
  return !s.expired && s.expiresAt !== null && Date.parse(s.expiresAt) - Date.now() < 24 * 3600000;
}

export function sortByDate<T extends { createdAt?: string; publishedAt?: string }>(list: T[]): T[] {
  return [...list].sort(
    (a, b) => Date.parse(b.createdAt ?? b.publishedAt ?? "") - Date.parse(a.createdAt ?? a.publishedAt ?? "")
  );
}
