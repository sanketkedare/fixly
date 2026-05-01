"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiUser, HiMail, HiLockClosed, HiArrowLeft } from "react-icons/hi";
import { FaGoogle, FaApple } from "react-icons/fa";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"user" | "service_provider">("user");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const syncUserToDB = async (user: any, selectedRole: string) => {
    try {
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseId: user.uid,
          email: user.email,
          name: user.displayName || name || "User",
          role: selectedRole,
        }),
      });
    } catch (error) {
      console.error("Error syncing user to DB:", error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await syncUserToDB(userCredential.user, role);
      router.push("/home");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncUserToDB(result.user, role);
      router.push("/home");
    } catch (error) {
      console.error("Google register error:", error);
      alert("Google registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 flex flex-col min-h-screen bg-white max-w-2xl mx-auto">
      <Link href="/login" className="p-2 -ml-2 text-gray-600 hover:text-blue-600 transition-colors w-fit">
        <HiArrowLeft size={24} />
      </Link>

      <div className="mt-8">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900">Create Account</h1>
        <p className="text-gray-500 font-bold mt-2">Join Fixly to book or provide services</p>
      </div>

      <form onSubmit={handleRegister} className="mt-10 flex flex-col gap-6">
        {/* Role Selection */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-black text-gray-900 uppercase tracking-widest ml-1">I want to...</label>
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

        <div className="relative">
          <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
          />
        </div>

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
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl text-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 mt-2 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-12 flex flex-col items-center gap-6">
        <p className="text-gray-400 text-sm font-black uppercase tracking-widest">Or sign up with</p>
        
        <div className="flex gap-4 w-full">
          <button 
            onClick={handleGoogleRegister}
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

        <p className="mt-8 text-center text-gray-500 font-bold">
          Already have an account? <Link href="/login" className="text-blue-600 font-black">Log In</Link>
        </p>
      </div>
    </div>
  );
}
