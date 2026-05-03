"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiUser, HiMail, HiLockClosed, HiArrowLeft, HiPhone, HiShieldCheck } from "react-icons/hi";
import { FaGoogle, FaApple } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/slices/uiSlice";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState<"user" | "service_provider">("user");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const dispatch = useAppDispatch();

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
          mobile: mobile,
        }),
      });
    } catch (error) {
      console.error("Error syncing user to DB:", error);
    }
  };

  const validateInitial = () => {
    if (!name || !email || !password || !confirmPassword || !mobile) {
      dispatch(showToast({ message: "Please fill in all fields.", type: "error" }));
      return false;
    }
    if (password !== confirmPassword) {
      dispatch(showToast({ message: "Passwords do not match.", type: "error" }));
      return false;
    }
    if (mobile.length < 10) {
      dispatch(showToast({ message: "Enter a valid mobile number.", type: "error" }));
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

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInitial()) return;

    setLoading(true);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: newOtp, name }),
      });

      if (!res.ok) throw new Error("Failed to send OTP");

      setIsOtpSent(true);
      dispatch(showToast({ message: "OTP sent to your email!", type: "success" }));
    } catch (error) {
      console.error("OTP Error:", error);
      dispatch(showToast({ message: "Failed to send OTP. Please try again.", type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      dispatch(showToast({ message: "Invalid OTP. Please check and try again.", type: "error" }));
      return;
    }
    
    setLoading(true);
    dispatch(showToast({ message: "Creating your account...", type: "loading" }));
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await syncUserToDB(userCredential.user, role);
      dispatch(showToast({ message: "Account created successfully!", type: "success" }));
      router.push("/home");
    } catch (error: any) {
      console.error("Registration error:", error);
      let message = "Registration failed. Please try again.";
      if (error.code === "auth/email-already-in-use") message = "This email is already registered.";
      dispatch(showToast({ message, type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 flex flex-col min-h-screen bg-white max-w-2xl mx-auto pb-24">
      <Link href="/login" className="p-2 -ml-2 text-gray-600 hover:text-blue-600 transition-colors w-fit">
        <HiArrowLeft size={24} />
      </Link>

      <div className="mt-8">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">Create Account</h1>
        <p className="text-gray-500 font-bold mt-2">Join Fixly to book or provide services</p>
      </div>

      <form onSubmit={isOtpSent ? handleRegister : handleSendOTP} className="mt-10 flex flex-col gap-6">
        {!isOtpSent ? (
          <>
            {/* Role Selection */}
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
                  placeholder="Confirm" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-bold"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl text-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 mt-2 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </>
        ) : (
          <>
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <p className="text-blue-600 font-bold text-sm">We've sent a 6-digit code to <span className="font-black underline">{email}</span></p>
            </div>
            
            <div className="relative">
              <HiShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Enter 6-digit OTP" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-6 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-black text-2xl tracking-[0.5em] text-center"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl text-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Sign Up"}
            </button>
            
            <button 
              type="button"
              onClick={() => setIsOtpSent(false)}
              className="text-gray-400 font-bold hover:text-blue-600 transition-colors text-sm text-center"
            >
              Change email or details
            </button>
          </>
        )}
      </form>

      <div className="mt-12 flex flex-col items-center gap-6">
        <p className="text-gray-400 text-sm font-black uppercase tracking-widest">Or sign up with</p>
        
        <div className="flex gap-4 w-full">
          <button 
            onClick={async () => {
              // Google login handles its own verification
              setLoading(true);
              dispatch(showToast({ message: "Connecting to Google...", type: "loading" }));
              const provider = new GoogleAuthProvider();
              try {
                const result = await signInWithPopup(auth, provider);
                await syncUserToDB(result.user, role);
                dispatch(showToast({ message: "Google signup successful!", type: "success" }));
                router.push("/home");
              } catch (error) {
                dispatch(showToast({ message: "Google signup failed.", type: "error" }));
              } finally {
                setLoading(false);
              }
            }}
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
          Already have an account? <Link href="/login" className="text-blue-600 font-black hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}
