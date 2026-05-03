"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { HiOutlineSparkles, HiOutlineBriefcase, HiOutlineLocationMarker, HiOutlineClipboardCheck } from "react-icons/hi";
import { useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/slices/uiSlice";

export default function ProfileCompletePage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "service_provider") {
        router.push("/home");
      } else if (user.isProfileComplete) {
        router.push("/home");
      }
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bio.trim() || !category || !address.trim()) {
      dispatch(showToast({ message: "Please fill in all fields.", type: "error" }));
      return;
    }

    if (!auth.currentUser) {
      dispatch(showToast({ message: "Session expired. Please log in again.", type: "error" }));
      router.push("/login");
      return;
    }

    setSubmitting(true);
    dispatch(showToast({ message: "Completing your profile...", type: "loading" }));

    try {
      const token = await auth.currentUser.getIdToken();

      // ✅ Correct: POST to /api/user/complete-profile (not PUT /api/user)
      const res = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firebaseId: user?.uid,
          bio,
          category,
          address,
        }),
      });

      if (res.ok) {
        // Refresh AuthContext so isProfileComplete updates
        await refreshUser();
        dispatch(showToast({ message: "Profile completed! Welcome to Fixly 🎉", type: "success" }));
        router.push("/home");
      } else {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile complete error:", error);
      dispatch(showToast({ message: "Error updating profile. Please try again.", type: "error" }));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pb-24">
      <div className="max-w-xl w-full bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-blue-900/5 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30 mb-6">
            <HiOutlineSparkles size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Complete Your Profile</h1>
          <p className="text-gray-500 font-bold mt-2">
            As a Service Provider, we need a few more details to get you started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {/* Bio */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Professional Bio
            </label>
            <div className="relative">
              <HiOutlineClipboardCheck className="absolute left-4 top-4 text-gray-400" size={20} />
              <textarea
                placeholder="Tell us about your skills and experience..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-bold min-h-[120px] resize-none"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Service Category
            </label>
            <div className="relative">
              <HiOutlineBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-bold appearance-none"
              >
                <option value="">Select a Category</option>
                <option value="electrician">Electrician</option>
                <option value="plumber">Plumber</option>
                <option value="carpenter">Carpenter</option>
                <option value="cleaner">Cleaner</option>
                <option value="painter">Painter</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Business Address
            </label>
            <div className="relative">
              <HiOutlineLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Where are you located?"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 mt-4 disabled:opacity-50"
          >
            {submitting ? "Saving Profile..." : "Finalize Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
