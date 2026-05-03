"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
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
          <div className={`w-full h-72 lg:h-[450px] relative overflow-hidden shadow-xl`}>
             <Image 
                src={service.image} 
                alt={service.name} 
                fill 
                className="object-cover" 
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
             
             {/* Bottom Title Overlay (Mobile only) */}
             <div className="absolute bottom-6 left-6 lg:hidden">
                <span className="text-xs font-black text-white uppercase tracking-widest bg-blue-600/80 backdrop-blur-md px-3 py-1 rounded-full">{service.category}</span>
                <h1 className="text-3xl font-black text-white mt-2 drop-shadow-lg">{service.name}</h1>
             </div>
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
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 px-4 lg:px-12 pt-6 lg:pt-10">

          {/* Left col */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

              {/* Title + rating (Desktop) */}
              <div className="hidden lg:flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full">{service.category}</span>
                  <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mt-4">{service.name}</h1>
                  <p className="text-xl text-gray-500 font-medium mt-3">{service.description}</p>
                </div>
              </div>
              
              {/* Description (Mobile only, since title is in hero) */}
              <div className="lg:hidden mb-6">
                 <p className="text-gray-500 font-medium">{service.description}</p>
              </div>

              {/* Rating row */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-100 px-4 py-2 rounded-2xl">
                  <HiStar className="text-yellow-500" size={18} />
                  <span className="font-black text-gray-900 text-base">{service.rating}</span>
                </div>
                <span className="text-base text-gray-400 font-medium">{service.reviews.toLocaleString()}+ reviews</span>
                <span className="text-base text-gray-400 font-medium">• {service.duration}</span>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                {trustBadges.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.label} className={`flex flex-col items-center text-center gap-3 p-4 ${b.bg} rounded-[2rem] border border-white shadow-sm`}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm`}>
                         <Icon size={24} className={b.color} />
                      </div>
                      <span className="text-[11px] lg:text-xs font-black text-gray-700 leading-tight">{b.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Service Includes */}
              <div className="bg-gray-50 rounded-[2.5rem] p-6 lg:p-8 mb-8 border border-gray-100">
                <h3 className="font-black text-gray-900 text-lg mb-6 flex items-center gap-2">
                   <div className="w-2 h-6 bg-blue-600 rounded-full" />
                   Service Includes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.includes.map((item) => (
                    <div key={item} className="flex items-center gap-4 bg-white/50 p-3 rounded-2xl border border-white/50">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
                        <HiCheckCircle size={14} className="text-white" />
                      </div>
                      <span className="text-sm lg:text-base font-bold text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right col — desktop booking card */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-8 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50">
              <div className="flex items-end gap-2 mb-2">
                 <p className="text-4xl font-black text-gray-900">₹{service.price}</p>
                 <p className="text-sm text-gray-400 font-bold mb-1">Starting</p>
              </div>
              <p className="text-sm text-gray-400 font-medium mb-8">+ ₹30 convenience fee</p>

              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl">
                  <HiClock size={20} className="text-blue-600" />
                  <span className="text-sm font-bold text-gray-700">Service Duration: <strong>{service.duration}</strong></span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl">
                  <HiShieldCheck size={20} className="text-emerald-600" />
                  <span className="text-sm font-bold text-gray-700">100% Background Verified</span>
                </div>
              </div>

              <button
                onClick={() => router.push(`/book/${service.id}`)}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-98 transition-all shadow-xl shadow-blue-600/30"
              >
                Book Now
              </button>
              <p className="text-center text-xs text-gray-400 font-bold mt-4 uppercase tracking-widest">Pay after service is done</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ──────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 pt-4 pb-8 z-30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
               <p className="text-2xl font-black text-gray-900">₹{service.price}</p>
               <p className="text-[10px] text-gray-400 font-black uppercase">Start</p>
            </div>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-tight">+ ₹30 fee</p>
          </div>
          <button
            onClick={() => router.push(`/book/${service.id}`)}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-600/30"
          >
            Book Now
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  );
}
