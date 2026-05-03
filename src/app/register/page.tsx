"use client";

import { useState, useEffect, Suspense } from "react";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  HiUser,
  HiMail,
  HiLockClosed,
  HiArrowLeft,
  HiPhone,
  HiShieldCheck,
  HiOutlineSparkles,
} from "react-icons/hi";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/slices/uiSlice";

// ── DB Sync helper ────────────────────────────────────────────────────────────
async function syncUserToDB(
  firebaseUser: FirebaseUser,
  role: string,
  mobile: string,
  displayName?: string
): Promise<boolean> {
  try {
    const token = await firebaseUser.getIdToken();
    const res = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        firebaseId: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName ?? displayName ?? "User",
        role,
        mobile,
      }),
    });
    return res.ok;
  } catch (error) {
    console.error("syncUserToDB error:", error);
    return false;
  }
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const isSocialMode = searchParams.get("mode") === "social";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"user" | "service_provider">("user");

  // OTP state — no OTP value ever stored client-side
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTicket, setOtpTicket] = useState(""); // server-signed ticket
  const [otpInput, setOtpInput] = useState("");

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  // Pre-fill from Google auth in social mode
  useEffect(() => {
    if (isSocialMode && auth.currentUser) {
      setEmail(auth.currentUser.email ?? "");
      setName(auth.currentUser.displayName ?? "");
    }
  }, [isSocialMode]);

  // ── Validation ────────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword || !mobile.trim()) {
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
    if (password !== confirmPassword) {
      dispatch(showToast({ message: "Passwords do not match.", type: "error" }));
      return false;
    }
    if (mobile.replace(/\D/g, "").length < 10) {
      dispatch(showToast({ message: "Enter a valid 10-digit mobile number.", type: "error" }));
      return false;
    }
    return true;
  };

  // ── Step 1: Send OTP via server (EmailJS + signed ticket) ─────────────────
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSendingOtp(true);
    dispatch(showToast({ message: "Sending OTP to your email...", type: "loading" }));

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(showToast({ message: data.error ?? "Failed to send OTP.", type: "error" }));
        return;
      }

      // Store the signed ticket (not the OTP itself)
      setOtpTicket(data.ticket);
      setIsOtpSent(true);
      dispatch(showToast({ message: "OTP sent! Check your email.", type: "success" }));
    } catch (error) {
      console.error("Send OTP error:", error);
      dispatch(showToast({ message: "Network error. Please try again.", type: "error" }));
    } finally {
      setSendingOtp(false);
    }
  };

  // ── Step 2: Verify OTP → create Firebase account → sync DB ───────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpInput || otpInput.length !== 6) {
      dispatch(showToast({ message: "Please enter the 6-digit OTP.", type: "error" }));
      return;
    }

    setVerifying(true);
    dispatch(showToast({ message: "Verifying OTP...", type: "loading" }));

    try {
      // 1️⃣ Verify OTP server-side first
      const verifyRes = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket: otpTicket, otp: otpInput }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        dispatch(showToast({ message: verifyData.error ?? "Invalid OTP.", type: "error" }));
        return;
      }

      dispatch(showToast({ message: "OTP verified! Creating account...", type: "loading" }));

      // 2️⃣ Create Firebase auth account
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      // 3️⃣ Sync to MongoDB
      const synced = await syncUserToDB(credential.user, role, mobile, name);

      if (synced) {
        // Set cookie so middleware allows /home navigation
        const token = await credential.user.getIdToken();
        document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict`;
        dispatch(showToast({ message: "Account created! Welcome to Fixly 🎉", type: "success" }));
        router.push("/home");
      } else {
        // DB sync failed — roll back Firebase account to prevent orphaned auth records
        await credential.user.delete();
        dispatch(showToast({ message: "Account setup failed. Please try again.", type: "error" }));
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);
      let message = "Registration failed. Please try again.";
      if (error instanceof Error && "code" in error) {
        const code = (error as { code: string }).code;
        if (code === "auth/email-already-in-use") message = "This email is already registered. Try logging in.";
        if (code === "auth/weak-password") message = "Password is too weak. Use at least 6 characters.";
      }
      dispatch(showToast({ message, type: "error" }));
    } finally {
      setVerifying(false);
    }
  };

  // ── Social mode: Google already authed — just collect mobile + role ───────
  const handleSocialRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mobile.replace(/\D/g, "").length < 10) {
      dispatch(showToast({ message: "Please enter a valid 10-digit mobile number.", type: "error" }));
      return;
    }

    if (!auth.currentUser) {
      dispatch(showToast({ message: "Session expired. Please sign in with Google again.", type: "error" }));
      router.push("/login");
      return;
    }

    setVerifying(true);
    dispatch(showToast({ message: "Saving your profile...", type: "loading" }));

    try {
      const synced = await syncUserToDB(auth.currentUser, role, mobile);
      if (synced) {
        // Set cookie so middleware allows /home navigation
        const token = await auth.currentUser.getIdToken();
        document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict`;
        dispatch(showToast({ message: "Registration complete! Welcome 🎉", type: "success" }));
        router.push("/home");
      } else {
        dispatch(showToast({ message: "Failed to save profile. Please try again.", type: "error" }));
      }
    } catch (error) {
      console.error("Social register error:", error);
      dispatch(showToast({ message: "Something went wrong. Please try again.", type: "error" }));
    } finally {
      setVerifying(false);
    }
  };

  // ── Google sign-up from register page ─────────────────────────────────────
  const handleGoogleSignup = async () => {
    setSendingOtp(true);
    dispatch(showToast({ message: "Connecting to Google...", type: "loading" }));

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      // Set cookie immediately so middleware allows subsequent page navigations
      document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict`;

      const res = await fetch(`/api/user?firebaseId=${result.user.uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        dispatch(showToast({ message: "Welcome back!", type: "success" }));
        router.push("/home");
      } else if (res.status === 404) {
        // New user — go to social completion mode
        router.push("/register?mode=social");
      } else {
        dispatch(showToast({ message: "Unexpected error. Please try again.", type: "error" }));
      }
    } catch (error) {
      console.error("Google signup error:", error);
      dispatch(showToast({ message: "Google sign-up failed. Please try again.", type: "error" }));
    } finally {
      setSendingOtp(false);
    }
  };

  const isLoading = sendingOtp || verifying;

  return (
    <div className="p-6 md:p-12 flex flex-col min-h-screen bg-white max-w-2xl mx-auto pb-24">
      <Link href="/login" className="p-2 -ml-2 text-gray-600 hover:text-blue-600 transition-colors w-fit">
        <HiArrowLeft size={24} />
      </Link>

      <div className="mt-8">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">
          {isSocialMode ? "Complete Signup" : "Create Account"}
        </h1>
        <p className="text-gray-500 font-bold mt-2">
          {isSocialMode ? "Select your role to get started" : "Join Fixly to book or provide services"}
        </p>
      </div>

      {/* Google badge in social mode */}
      {isSocialMode && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
            <HiOutlineSparkles size={24} />
          </div>
          <div>
            <p className="text-sm font-black text-blue-900">Signed in with Google</p>
            <p className="text-xs font-bold text-blue-600/70">{email}</p>
          </div>
        </div>
      )}

      {/* ── SOCIAL MODE FORM ────────────────────────────────────────────── */}
      {isSocialMode ? (
        <form onSubmit={handleSocialRegister} className="mt-10 flex flex-col gap-6">
          {/* Role selection */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">I want to...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={cn(
                  "py-4 rounded-2xl border-2 font-black transition-all",
                  role === "user" ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 text-gray-400"
                )}
              >
                Book Services
              </button>
              <button
                type="button"
                onClick={() => setRole("service_provider")}
                className={cn(
                  "py-4 rounded-2xl border-2 font-black transition-all",
                  role === "service_provider" ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 text-gray-400"
                )}
              >
                Provide Services
              </button>
            </div>
          </div>

          {/* Mobile */}
          <div className="relative">
            <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 mt-2 disabled:opacity-50"
          >
            {verifying ? "Completing Setup..." : "Complete Registration"}
          </button>
        </form>
      ) : (
        /* ── STANDARD EMAIL/PASSWORD FORM ─────────────────────────────────── */
        <form
          onSubmit={isOtpSent ? handleRegister : handleSendOTP}
          className="mt-10 flex flex-col gap-6"
        >
          {!isOtpSent ? (
            <>
              {/* Role selection */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">I want to...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole("user")}
                    className={cn(
                      "py-4 rounded-2xl border-2 font-black transition-all",
                      role === "user" ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 text-gray-400"
                    )}
                  >
                    Book Services
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("service_provider")}
                    className={cn(
                      "py-4 rounded-2xl border-2 font-black transition-all",
                      role === "service_provider" ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 text-gray-400"
                    )}
                  >
                    Provide Services
                  </button>
                </div>
              </div>

              {/* Full name */}
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-bold"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-bold"
                />
              </div>

              {/* Mobile */}
              <div className="relative">
                <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-bold"
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-bold"
                  />
                </div>
                <div className="relative">
                  <HiShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 mt-2 disabled:opacity-50"
              >
                {sendingOtp ? "Sending OTP..." : "Continue"}
              </button>
            </>
          ) : (
            /* ── OTP verification step ──────────────────────────────────── */
            <>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p className="text-blue-600 font-bold text-sm">
                  We&apos;ve sent a 6-digit code to{" "}
                  <span className="font-black underline">{email}</span>
                </p>
              </div>

              <div className="relative">
                <HiShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-digit OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-6 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-black text-2xl tracking-[0.5em] text-center"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
              >
                {verifying ? "Verifying..." : "Verify & Sign Up"}
              </button>

              <button
                type="button"
                onClick={() => { setIsOtpSent(false); setOtpInput(""); setOtpTicket(""); }}
                className="text-gray-400 font-bold hover:text-blue-600 transition-colors text-sm text-center"
              >
                Change email or details
              </button>
            </>
          )}
        </form>
      )}

      {/* ── Google sign-up option (standard mode only) ──────────────────── */}
      {!isSocialMode && (
        <div className="mt-12 flex flex-col items-center gap-6">
          <p className="text-gray-400 text-sm font-black uppercase tracking-widest">Or sign up with</p>
          <button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-100 py-4 rounded-2xl hover:bg-gray-50 transition-all font-bold shadow-sm disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-gray-500 font-bold">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-black hover:underline">Log In</Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
