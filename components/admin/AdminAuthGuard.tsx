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
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Loader2 size={22} className="animate-spin text-white/40" />
      </div>
    );
  }

  // Render Login Screen directly on /admin-secure when unauthorized!
  if (!authorized) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/BRUTTO-NETTO-LOGO.svg"
              alt="BruttoNetto Calculator Logo"
              width={200}
              height={50}
              className="h-9 w-auto mb-6"
              priority
            />
            <h1 className="font-display font-bold text-xl tracking-tight text-white">
              Admin Login
            </h1>
            <p className="text-sm text-white/40 mt-1.5">Bitte melden Sie sich an, um fortzufahren.</p>
          </div>

          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 sm:p-7">
            {loginError && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" size={17} />
                <input
                  type="email"
                  placeholder="E-Mail Adresse"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginLoading}
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/35 focus:border-white/25 outline-none transition-colors disabled:opacity-50"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" size={17} />
                <input
                  type="password"
                  placeholder="Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginLoading}
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/35 focus:border-white/25 outline-none transition-colors disabled:opacity-50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 bg-[#E60A1C] hover:bg-[#ff1a2e] text-white font-semibold text-sm rounded-xl py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {loginLoading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    <span>Anmelden…</span>
                  </>
                ) : (
                  <span>Anmelden</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // Render Admin Dashboard when authorized!
  return <>{children}</>;
}
