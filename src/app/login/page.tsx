"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiArrowLeft,
  HiMail,
  HiLockClosed,
  HiEyeOff,
  HiEye,
} from "react-icons/hi";
import { useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/slices/uiSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [sendingReset, setSendingReset] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    if (!email || !password) {
      dispatch(showToast({ message: "Please fill in all fields.", type: "error" }));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      dispatch(showToast({ message: "Please enter a valid email address.", type: "error" }));
      return false;
    }
    if (password.length < 6) {
      dispatch(showToast({ message: "Password must be at least 6 characters.", type: "error" }));
      return false;
    }
    return true;
  };

  // ── Email + Password login ────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    dispatch(showToast({ message: "Logging in...", type: "loading" }));

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      // Set cookie immediately so middleware allows the /home navigation
      const token = await credential.user.getIdToken();
      document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict`;
      dispatch(showToast({ message: "Welcome back!", type: "success" }));
      router.push("/home");
    } catch (error: unknown) {
      console.error("Login error:", error);
      let message = "Invalid credentials. Please try again.";
      if (error instanceof Error && "code" in error) {
        const code = (error as { code: string }).code;
        if (code === "auth/user-not-found") message = "No account found with this email.";
        if (code === "auth/wrong-password") message = "Incorrect password. Please try again.";
        if (code === "auth/invalid-credential") message = "Invalid email or password.";
        if (code === "auth/invalid-email") message = "Please enter a valid email address.";
        if (code === "auth/too-many-requests") message = "Too many attempts. Please try again later.";
      }
      dispatch(showToast({ message, type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  // ── Google login ──────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setLoading(true);
    dispatch(showToast({ message: "Connecting to Google...", type: "loading" }));

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      // Set cookie immediately so middleware allows subsequent page navigations
      document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict`;

      // Check if user already exists in our DB
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const res = await fetch(`/api/user?firebaseId=${result.user.uid}`, {
        signal: controller.signal,
        headers: { Authorization: `Bearer ${token}` },
      });
      clearTimeout(timeoutId);

      if (res.status === 404 || res.status === 401) {
        // 404 = new user | 401 = token timing issue on first sign-in
        // Both cases: send to social registration to complete profile
        dispatch(showToast({ message: "Almost there! Complete your profile.", type: "info" }));
        router.push("/register?mode=social");
        return;
      }

      if (res.ok) {
        const dbUser = await res.json();
        dispatch(showToast({ message: `Welcome back, ${dbUser.name}!`, type: "success" }));
        router.push("/home");
      } else {
        // Unexpected API error — send to social registration as fallback
        router.push("/register?mode=social");
      }
    } catch (error) {
      console.error("Google login error:", error);
      dispatch(showToast({ message: "Google login failed. Please try again.", type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot Password ───────────────────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      dispatch(showToast({ message: "Please enter a valid email address.", type: "error" }));
      return;
    }

    setSendingReset(true);
    dispatch(showToast({ message: "Sending reset link...", type: "loading" }));

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      dispatch(showToast({ message: "Reset link sent! Check your inbox.", type: "success" }));
      setShowForgot(false);
      setResetEmail("");
    } catch (error: unknown) {
      console.error("Password reset error:", error);
      let message = "Failed to send reset email.";
      if (error instanceof Error && "code" in error) {
        const code = (error as { code: string }).code;
        if (code === "auth/user-not-found") message = "No account found with this email.";
        if (code === "auth/too-many-requests") message = "Too many requests. Try again later.";
      }
      dispatch(showToast({ message, type: "error" }));
    } finally {
      setSendingReset(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-12 flex flex-col min-h-screen bg-white max-w-2xl mx-auto">
      <Link href="/" className="p-2 -ml-2 text-gray-600 hover:text-blue-600 transition-colors w-fit">
        <HiArrowLeft size={24} />
      </Link>

      <div className="mt-8">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900">Welcome Back!</h1>
        <p className="text-gray-500 font-bold mt-2">Log in to your Fixly account</p>
      </div>

      {/* ── Forgot Password modal ─────────────────────────────────────────── */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-500 font-bold text-sm mb-6">
              Enter your email and we&apos;ll send a reset link.
            </p>
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-bold"
                />
              </div>
              <button
                type="submit"
                disabled={sendingReset}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {sendingReset ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Login form ───────────────────────────────────────────────────── */}
      <form onSubmit={handleLogin} className="mt-10 flex flex-col gap-6">
        <div className="relative">
          <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
          />
        </div>

        <div className="relative">
          <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            {showPassword ? <HiEye size={20} /> : <HiEyeOff size={20} />}
          </button>
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="text-blue-600 font-black text-sm hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 mt-2 disabled:opacity-50"
        >
          {loading ? "Logging In..." : "Log In"}
        </button>
      </form>

      {/* ── Social login ─────────────────────────────────────────────────── */}
      <div className="mt-12 flex flex-col items-center gap-6">
        <p className="text-gray-400 text-sm font-black uppercase tracking-widest">Or continue with</p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-100 py-4 rounded-2xl hover:bg-gray-50 transition-all font-bold shadow-sm disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span>Google</span>
        </button>

        <p className="text-gray-500 font-bold mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 font-black hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
