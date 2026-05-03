"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiArrowLeft, HiMail, HiLockClosed, HiEyeOff, HiEye } from "react-icons/hi";
import { FaGoogle, FaApple } from "react-icons/fa";
import { useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/slices/uiSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const syncUserToDB = async (user: any) => {
    try {
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseId: user.uid,
          email: user.email,
          name: user.displayName || "User",
          role: "user", // Default role for social login
        }),
      });
    } catch (error) {
      console.error("Error syncing user to DB:", error);
    }
  };

  const validate = () => {
    if (!email || !password) {
      dispatch(showToast({ message: "Please fill in all fields.", type: "error" }));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch(showToast({ message: "Please enter a valid email address.", type: "error" }));
      return false;
    }
    if (password.length < 6) {
      dispatch(showToast({ message: "Password must be at least 6 characters.", type: "error" }));
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    dispatch(showToast({ message: "Logging in...", type: "loading" }));
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      dispatch(showToast({ message: "Welcome back! Login successful.", type: "success" }));
      router.push("/home");
    } catch (error: any) {
      console.error("Login error:", error);
      let message = "Invalid credentials. Please try again.";
      if (error.code === "auth/user-not-found") message = "No account found with this email.";
      if (error.code === "auth/wrong-password") message = "Incorrect password. Please try again.";
      if (error.code === "auth/invalid-email") message = "Please enter a valid email address.";
      
      dispatch(showToast({ message, type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    dispatch(showToast({ message: "Connecting to Google...", type: "loading" }));
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncUserToDB(result.user);
      dispatch(showToast({ message: "Google login successful!", type: "success" }));
      router.push("/home");
    } catch (error) {
      console.error("Google login error:", error);
      dispatch(showToast({ message: "Google login failed. Please try again.", type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 flex flex-col min-h-screen bg-white max-w-2xl mx-auto">
      <Link href="/" className="p-2 -ml-2 text-gray-600 hover:text-blue-600 transition-colors w-fit">
        <HiArrowLeft size={24} />
      </Link>

      <div className="mt-8">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900">Welcome Back!</h1>
        <p className="text-gray-500 font-bold mt-2">Log in to your Fixly account</p>
      </div>

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
          <button type="button" className="text-blue-600 font-black text-sm hover:underline">
            Forgot Password?
          </button>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl text-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 mt-2 disabled:opacity-50"
        >
          {loading ? "Logging In..." : "Log In"}
        </button>
      </form>

      <div className="mt-12 flex flex-col items-center gap-6">
        <p className="text-gray-400 text-sm font-black uppercase tracking-widest">Or continue with</p>
        
        <div className="flex gap-4 w-full">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-3 border border-gray-100 py-4 rounded-2xl hover:bg-gray-50 transition-all font-bold shadow-sm disabled:opacity-50"
          >
            <FaGoogle className="text-red-500" />
            <span>Google</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-3 border border-gray-100 py-4 rounded-2xl hover:bg-gray-50 transition-all font-bold shadow-sm">
            <FaApple className="text-black" />
            <span>Apple</span>
          </button>
        </div>

        <p className="text-gray-500 font-bold mt-4">
          Don't have an account? <Link href="/register" className="text-blue-600 font-black hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
