"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { usePathname } from "next/navigation";

interface AuthUser {
  uid: string;
  email: string | null;
  name?: string;
  role: "user" | "admin" | "service_provider";
  isProfileComplete?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Cookie helpers ────────────────────────────────────────────────────────────
function setSessionCookie(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict`;
}

function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "__session=; path=/; max-age=0; SameSite=Strict";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // ── Core sync: Firebase user → MongoDB record → AuthUser state ────────────
  const syncFromDB = useCallback(
    async (firebaseUser: FirebaseUser) => {
      try {
        // Always get a fresh token and keep the __session cookie alive
        const token = await firebaseUser.getIdToken();
        setSessionCookie(token);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s for Atlas free-tier cold start

        const res = await fetch(`/api/user?firebaseId=${firebaseUser.uid}`, {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` },
        });
        clearTimeout(timeoutId);

        if (res.status === 404) {
          // Firebase user exists but not yet in MongoDB
          // (e.g., Google sign-in before social registration is complete)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName ?? undefined,
            role: "user",
          });
          return;
        }

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const dbUser = await res.json();
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: dbUser?.name ?? firebaseUser.displayName ?? undefined,
          role: dbUser?.role ?? "user",
          isProfileComplete: dbUser?.isProfileComplete ?? true,
        });
      } catch (error) {
        console.error("Auth sync error:", error);

        // Timeout/network error — NOT an auth failure, do NOT sign out
        // Keep existing user state if available; set minimal state if first load
        if (error instanceof Error && error.name === "AbortError") {
          if (!user) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName ?? undefined,
              role: "user",
            });
          }
          // else: keep whatever state we already have
          return;
        }

        // On auth pages (login/register), set minimal state — never sign out
        const isAuthPage =
          pathname?.startsWith("/register") ||
          pathname?.startsWith("/login");

        if (isAuthPage) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName ?? undefined,
            role: "user",
          });
        } else {
          // On a protected app page with a real auth error — sign out for safety
          await auth.signOut();
          clearSessionCookie();
          setUser(null);
        }
      }
    },
    [pathname]
  );

  // ── Listen to Firebase auth state ─────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncFromDB(firebaseUser);
      } else {
        setUser(null);
        clearSessionCookie();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [syncFromDB]);

  // ── Silent token refresh every 55 min (keeps __session cookie alive) ──────
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!auth.currentUser) return;
      try {
        const freshToken = await auth.currentUser.getIdToken(true);
        setSessionCookie(freshToken);
      } catch (err) {
        console.error("Silent token refresh failed:", err);
      }
    }, 55 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ── refreshUser: force re-sync from DB (call after profile updates) ───────
  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) return;
    await syncFromDB(auth.currentUser);
  }, [syncFromDB]);

  const logout = async () => {
    await auth.signOut();
    clearSessionCookie();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
