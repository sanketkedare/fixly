"use client";

import { useParams, useRouter } from "next/navigation";
import { HiArrowLeft, HiStar, HiCheckCircle, HiHeart } from "react-icons/hi";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

const serviceData = {
  id: "1",
  name: "Electrician",
  category: "Wiring, Faults, Fittings and more",
  rating: 4.6,
  reviews: 1200,
  price: 299,
  image: null,
  features: [
    "Verified Professional",
    "On-time Service",
    "Affordable Pricing"
  ],
  includes: [
    "New Installations",
    "Wiring & Rewiring",
    "Fault Detection"
  ]
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <div className="pb-32">
      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative aspect-video w-full bg-gray-200"
      >
        <button 
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-lg"
        >
          <HiArrowLeft size={20} />
        </button>
        <button 
          className="absolute top-6 right-6 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-lg"
        >
          <HiHeart size={20} className="text-gray-400" />
        </button>
        <div className="w-full h-full flex items-center justify-center text-8xl grayscale opacity-50">
          ⚡
        </div>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="p-6 md:p-12"
      >
        <div className="max-w-none">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900">{serviceData.name}</h1>
          <p className="text-gray-500 mt-2 text-lg">{serviceData.category}</p>
          
          <div className="flex items-center gap-4 mt-4 text-base">
            <div className="flex items-center gap-1 text-yellow-500 font-black bg-yellow-50 px-3 py-1 rounded-full">
              <HiStar />
              <span>{serviceData.rating}</span>
            </div>
            <span className="text-gray-400 font-bold">({serviceData.reviews}+ reviews)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {serviceData.features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex flex-col items-center md:items-start p-6 bg-gray-50 rounded-3xl border border-gray-100 gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                   <HiCheckCircle size={28} />
                </div>
                <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{f}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-blue-600 pl-4">Service Includes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceData.includes.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
                >
                  <HiCheckCircle className="text-green-500" size={24} />
                  <span className="text-lg font-bold text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer CTA */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 p-6 md:p-8 flex items-center justify-between z-50"
      >
        <div className="max-w-none w-full flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-widest">Starting Price</p>
            <p className="text-2xl md:text-4xl font-black text-blue-600">₹{serviceData.price}</p>
          </div>
          <Link 
            href={`/book/${serviceData.id}`}
            className="bg-blue-600 text-white px-8 md:px-16 py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl hover:scale-105 transition-all shadow-2xl shadow-blue-600/40"
          >
            Book This Service
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
