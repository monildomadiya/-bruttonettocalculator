"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, AlertCircle, Mail, Lock } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Email & Password State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // We check if the backend already considers us authorized
    async function checkBackendAuth() {
      try {
        const res = await fetch("/api/auth/admin");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setAuthorized(true);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Backend auth check failed:", err);
      }
      setAuthorized(false);
      setLoading(false);
    }
    checkBackendAuth();

    // Optionally sync Firebase Auth state (e.g., if already logged in via Firebase but no session cookie)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in to Firebase, ensure backend has the session cookie
        try {
          const idToken = await user.getIdToken(true);
          await fetch("/api/auth/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });
          setAuthorized(true);
        } catch (err) {
          console.error("Failed to sync session with backend");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setLoginError("Bitte E-Mail und Passwort eingeben.");
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    try {
      // 1. Log in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 2. Get ID Token
      const idToken = await userCredential.user.getIdToken();
      
      // 3. Send ID Token to backend to set the session cookie
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAuthorized(true);
        router.refresh();
      } else {
        setLoginError(data.error || "Zugriff verweigert (Backend).");
        await signOut(auth); // Sign out of Firebase if backend rejects
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setLoginError("Ungültige E-Mail oder Passwort.");
      } else {
        setLoginError("Ein unerwarteter Fehler ist aufgetreten.");
      }
    } finally {
      setLoginLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-white/40" />
      </div>
    );
  }

  // Render Login Screen directly on /admin-secure when unauthorized!
  if (!authorized) {
    return (
      <main className="min-h-screen bg-[#000000] text-white flex flex-col justify-center items-center px-4 py-12 select-none">
        <div className="w-full max-w-[400px] bg-[#0c0c0c] border border-[#1a1a1a] rounded-[38px] p-8 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,1)] relative flex flex-col items-center">
          
          <div className="mb-6">
            <Image
              src="/BRUTTO-NETTO-LOGO.svg"
              alt="BruttoNetto Calculator Logo"
              width={200}
              height={50}
              className="h-9 sm:h-10 w-auto mx-auto drop-shadow-[0_0_20px_rgba(230,10,28,0.5)] transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>
          
          <h1 className="font-display font-bold text-[22px] sm:text-[24px] tracking-tight text-white mb-8 text-center">
            Admin Login
          </h1>

          {loginError && (
            <div className="w-full mb-6 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 z-10 pointer-events-none" size={18} />
              <input
                type="email"
                placeholder="E-Mail Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loginLoading}
                className="w-full bg-[#141414] border border-[#222222] rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-white focus:border-white/35 focus:bg-[#1a1a1a] outline-none transition-all duration-150 disabled:opacity-50 relative z-0"
                required
              />
            </div>

            <div className="relative mt-4">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 z-10 pointer-events-none" size={18} />
              <input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginLoading}
                className="w-full bg-[#141414] border border-[#222222] rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-white focus:border-white/35 focus:bg-[#1a1a1a] outline-none transition-all duration-150 disabled:opacity-50 relative z-0"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-2 bg-gradient-to-r from-[#E60A1C] to-[#FF2436] text-white font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(230,10,28,0.4)] hover:shadow-[0_8px_30px_rgba(230,10,28,0.6)] hover:brightness-110 transition-all duration-200 disabled:opacity-70 disabled:hover:brightness-100"
            >
              {loginLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Secure Login</span>
              )}
            </button>
          </form>

        </div>
      </main>
    );
  }

  // Render Admin Dashboard when authorized!
  return <>{children}</>;
}
