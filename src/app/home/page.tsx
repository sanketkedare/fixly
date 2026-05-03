"use client";

import Image from "next/image";
import { HiLocationMarker, HiSearch, HiBell, HiChevronDown, HiTrendingUp, HiShieldCheck, HiCurrencyRupee, HiCalendar } from "react-icons/hi";
import CategoryGrid from "@/components/home/CategoryGrid";
import Navbar from "@/components/layout/Navbar";
import ServiceCard from "@/components/home/ServiceCard";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocation } from "@/context/LocationContext";

const popularServices = [
  { id: "1", name: "Master Electrician", category: "Electrician", rating: 4.9, reviews: 2400, price: 499 },
  { id: "2", name: "Emergency Plumber", category: "Plumber", rating: 4.8, reviews: 1800, price: 399 },
  { id: "3", name: "Luxury Car Driver", category: "Driver", rating: 4.9, reviews: 500, price: 899 },
  { id: "4", name: "Deep Cleaning Service", category: "Cleaner", rating: 4.8, reviews: 2100, price: 1500 },
];

const trendingServices = [
  { name: "AC Service", trend: "+12%", color: "text-green-500" },
  { name: "Home Painting", trend: "+8%", color: "text-blue-500" },
  { name: "Deep Cleaning", trend: "+25%", color: "text-purple-500" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function HomePage() {
  const { address, loading: locationLoading, refreshLocation } = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-white px-[5%] lg:px-[10%] py-6 pb-32">
      {/* Header: Location & Notifications */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <button 
            onClick={() => refreshLocation()}
            className="flex items-center gap-1 text-gray-900 hover:text-blue-600 transition-colors"
          >
            <HiLocationMarker className="text-blue-600" size={18} />
            <span className="text-sm font-bold truncate max-w-[200px]">
              {locationLoading ? "Detecting..." : address || "Sector 21, Noida"}
            </span>
            <HiChevronDown className="text-gray-400" />
          </button>
        </div>
        <button className="p-2 bg-gray-50 rounded-full text-gray-900 border border-gray-100 shadow-sm">
          <HiBell size={24} />
        </button>
      </header>

      <div className="lg:grid lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-8">
          {/* Search Bar */}
          <div className="relative mb-8 group">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search for a service..." 
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
            />
          </div>

          {/* Hero Banner */}
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0A1A3B] rounded-3xl p-8 relative overflow-hidden mb-12 min-h-[220px] flex items-center shadow-xl shadow-blue-900/20"
          >
            <div className="relative z-10 w-3/5">
              <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-6">
                Reliable Services <br />
                <span className="text-yellow-400">Right at Your Doorstep</span>
              </h2>
              <button className="bg-white text-[#0A1A3B] px-8 py-3 rounded-xl text-base font-black hover:scale-105 transition-all shadow-lg">
                Book Now
              </button>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] w-64 h-64 lg:w-80 lg:h-80 opacity-90">
               <Image src="/fixly home.png" alt="Worker" fill className="object-contain" />
            </div>
          </motion.div>

          {/* Popular Services Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Popular Services</h3>
            </div>
            <CategoryGrid />
          </section>
        </div>

        {/* Sidebar: Why Choose Us Section */}
        <div className="lg:col-span-4 space-y-12">
          <section>
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6">Why Choose Us?</h3>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-6">
              <div className="flex flex-col lg:flex-row items-center lg:items-center text-center lg:text-left gap-2 lg:gap-4 lg:p-4 lg:bg-gray-50 lg:rounded-2xl lg:border lg:border-gray-100">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 shrink-0">
                   <HiShieldCheck size={24} />
                </div>
                <div>
                  <span className="text-[10px] lg:text-sm font-black text-gray-700 uppercase lg:normal-case tracking-tighter leading-tight">Verified Professionals</span>
                  <p className="hidden lg:block text-xs text-gray-400 font-medium">Background checked experts</p>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-center lg:items-center text-center lg:text-left gap-2 lg:gap-4 lg:p-4 lg:bg-gray-50 lg:rounded-2xl lg:border lg:border-gray-100">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm border border-orange-100 shrink-0">
                   <HiCurrencyRupee size={24} />
                </div>
                <div>
                  <span className="text-[10px] lg:text-sm font-black text-gray-700 uppercase lg:normal-case tracking-tighter leading-tight">Affordable Pricing</span>
                  <p className="hidden lg:block text-xs text-gray-400 font-medium">No hidden costs</p>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-center lg:items-center text-center lg:text-left gap-2 lg:gap-4 lg:p-4 lg:bg-gray-50 lg:rounded-2xl lg:border lg:border-gray-100">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm border border-green-100 shrink-0">
                   <HiCalendar size={24} />
                </div>
                <div>
                  <span className="text-[10px] lg:text-sm font-black text-gray-700 uppercase lg:normal-case tracking-tighter leading-tight">On-time Service</span>
                  <p className="hidden lg:block text-xs text-gray-400 font-medium">Punctual and reliable</p>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Desktop Sidebar Content */}
          <section className="hidden lg:block p-6 bg-blue-600 rounded-3xl text-white relative overflow-hidden">
             <h4 className="text-xl font-black mb-2">Refer & Earn</h4>
             <p className="text-sm text-blue-100 mb-6">Invite your friends and get ₹200 off your next booking!</p>
             <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg">
                Invite Friends
             </button>
             <div className="absolute top-[-20px] right-[-20px] text-6xl opacity-10 rotate-12">🎁</div>
          </section>
        </div>
      </div>

      <Navbar />
    </div>
  );
}
