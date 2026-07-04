"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin-secure");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
      <Loader2 size={24} className="animate-spin text-white/40" />
    </div>
  );
}
