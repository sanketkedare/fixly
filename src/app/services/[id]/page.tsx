"use client";

import { useParams, useRouter } from "next/navigation";
import { HiArrowLeft, HiStar, HiShieldCheck, HiClock, HiCurrencyRupee, HiCheckCircle, HiHeart } from "react-icons/hi";
import { getServiceById } from "@/data/services";
import Navbar from "@/components/layout/Navbar";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const service = getServiceById(id);
  const [saved, setSaved] = useState(false);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="font-black text-gray-900 text-xl">Service not found</p>
          <button onClick={() => router.push("/services")} className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all">
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  const trustBadges = [
    { icon: HiShieldCheck, label: "Verified Professional", color: "text-blue-600",    bg: "bg-blue-50"    },
    { icon: HiClock,       label: "On-time Service",       color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: HiCurrencyRupee, label: "Affordable Pricing",  color: "text-orange-600",  bg: "bg-orange-50"  },
  ];

  return (
    <div className="min-h-screen bg-white pb-36 lg:pb-12">
      <div className="max-w-screen-xl mx-auto">

        {/* ── Hero / Banner ──────────────────────────────────────────────────── */}
        <div className="relative">
          <div className={`w-full h-64 lg:h-96 bg-gradient-to-br ${service.gradient} flex items-center justify-center text-8xl lg:text-[10rem] shadow-xl`}>
            {service.emoji}
          </div>

          {/* Overlay nav buttons */}
          <button
            onClick={() => router.back()}
            className="absolute top-5 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:bg-white transition-all"
          >
            <HiArrowLeft size={20} className="text-gray-700" />
          </button>
          <button
            onClick={() => setSaved((s) => !s)}
            className={`absolute top-5 right-4 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all ${saved ? "bg-red-500 text-white" : "bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500"}`}
          >
            <HiHeart size={20} />
          </button>
        </div>

        {/* ── Content ────────────────────────────────────────────────────────── */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 px-4 lg:px-12 pt-6">

          {/* Left col */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

              {/* Title + rating */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{service.category}</span>
                  <h1 className="text-2xl lg:text-4xl font-black text-gray-900 mt-2">{service.name}</h1>
                  <p className="text-gray-500 font-medium mt-1">{service.description}</p>
                </div>
              </div>

              {/* Rating row */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-100 px-3 py-1.5 rounded-xl">
                  <HiStar className="text-yellow-500" size={16} />
                  <span className="font-black text-gray-900 text-sm">{service.rating}</span>
                </div>
                <span className="text-sm text-gray-400 font-medium">{service.reviews.toLocaleString()}+ reviews</span>
                <span className="text-sm text-gray-400 font-medium">• {service.duration}</span>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {trustBadges.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.label} className={`flex flex-col items-center text-center gap-2 p-3 ${b.bg} rounded-2xl`}>
                      <Icon size={20} className={b.color} />
                      <span className="text-[10px] font-black text-gray-700 leading-tight">{b.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Service Includes */}
              <div className="bg-gray-50 rounded-3xl p-5 mb-6">
                <h3 className="font-black text-gray-900 text-base mb-4">Service Includes</h3>
                <div className="flex flex-col gap-3">
                  {service.includes.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <HiCheckCircle size={12} className="text-white" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right col — desktop booking card */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-8 bg-white border border-gray-100 rounded-3xl p-6 shadow-xl shadow-gray-100">
              <p className="text-3xl font-black text-gray-900 mb-1">From ₹{service.price}</p>
              <p className="text-sm text-gray-400 font-medium mb-6">+ ₹30 convenience fee</p>

              <div className="flex flex-col gap-3 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <HiClock size={16} className="text-blue-600" />
                  <span className="font-medium">Duration: <strong>{service.duration}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <HiShieldCheck size={16} className="text-blue-600" />
                  <span className="font-medium">Background verified professionals</span>
                </div>
              </div>

              <button
                onClick={() => router.push(`/book/${service.id}`)}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-base hover:bg-blue-700 hover:scale-[1.02] transition-all shadow-xl shadow-blue-600/20"
              >
                Book Now — ₹{service.price}
              </button>
              <p className="text-center text-xs text-gray-400 font-medium mt-3">No payment required until service is done</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ──────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-3 pb-6 z-30">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-black text-gray-900">₹{service.price}</p>
            <p className="text-xs text-gray-400 font-medium">Starting price</p>
          </div>
          <button
            onClick={() => router.push(`/book/${service.id}`)}
            className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
          >
            Book Now
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  );
}
