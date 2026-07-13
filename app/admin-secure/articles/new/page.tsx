"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArticleEditor from "@/components/admin/ArticleEditor";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export default function NewArticlePage() {
  return (
    <AdminAuthGuard>
      <main className="min-h-screen bg-[#F4F5F7] text-[#16181D] py-10 sm:py-16 px-3.5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Back link */}
          <Link
            href="/admin-secure"
            className="inline-flex items-center gap-2 text-black/60 hover:text-[#16181D] mb-6 text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>

          {/* Editor */}
          <ArticleEditor isEdit={false} />
        </div>
      </main>
    </AdminAuthGuard>
  );
}
