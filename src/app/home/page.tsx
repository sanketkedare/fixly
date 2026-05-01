"use client";

import { HiLocationMarker, HiSearch, HiBell, HiChevronDown, HiTrendingUp } from "react-icons/hi";
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-white md:bg-gray-50/30">
      {/* Main Content Area */}
      <div className="flex-grow pb-32 lg:pb-12">
        {/* Header Section */}
        <div className="bg-white md:bg-transparent border-b md:border-none border-gray-100 sticky top-0 z-30 px-4 md:px-12 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-none">
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-4xl font-black text-gray-900">Discover Services</h1>
              <button 
                onClick={() => refreshLocation()}
                disabled={locationLoading}
                className="flex items-center gap-2 text-sm md:text-base font-bold text-gray-500 mt-2 hover:text-blue-600 transition-colors w-fit group"
              >
                <HiLocationMarker className={cn("text-blue-600", locationLoading && "animate-bounce")} />
                <span className={cn(locationLoading && "opacity-50")}>{locationLoading ? "Detecting location..." : address}</span>
                <HiChevronDown className="text-gray-400 group-hover:text-blue-600" />
              </button>
            </div>

            <div className="flex items-center gap-4 flex-grow max-w-3xl">
              <div className="relative flex-grow group">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={24} />
                <input 
                  type="text" 
                  placeholder="Search for any service (e.g. Electrician, AC Repair...)" 
                  className="w-full bg-white md:bg-white border border-gray-100 md:border-gray-200 rounded-[2rem] py-4 pl-14 pr-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm md:text-base shadow-xl shadow-gray-200/50"
                />
              </div>
              <button className="hidden md:flex p-4 bg-white rounded-2xl text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-lg shadow-gray-200/50">
                <HiBell size={28} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-12 flex flex-col gap-8 md:gap-16">
          {/* Hero Banner */}
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full"
          >
            <div className="bg-blue-600 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 relative overflow-hidden flex items-center min-h-[220px] md:min-h-[400px] shadow-2xl shadow-blue-600/30">
              <div className="relative z-10 w-full md:w-3/5">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs md:text-sm font-black px-4 py-2 rounded-full mb-6 inline-block uppercase tracking-widest">Limited Offer</span>
                <h2 className="text-3xl md:text-6xl font-black text-white leading-[1.1] mb-8">
                  Get <span className="text-yellow-400 underline underline-offset-8">20% Off</span> on Your First Deep Cleaning
                </h2>
                <button className="bg-white text-blue-600 px-10 py-4 md:py-6 rounded-2xl md:rounded-3xl text-sm md:text-xl font-black hover:scale-105 active:scale-95 transition-all shadow-2xl">
                  Book with Discount
                </button>
              </div>
              <div className="absolute right-[-10%] bottom-[-10%] text-[20rem] md:text-[35rem] opacity-10 grayscale brightness-200 pointer-events-none select-none">
                 🧼
              </div>
            </div>
          </motion.div>

          {/* Categories */}
          <div>
            <div className="flex justify-between items-end mb-8 px-2">
              <div>
                <h2 className="text-xl md:text-3xl font-black text-gray-900">Explore Categories</h2>
                <p className="text-gray-400 font-bold mt-1">What can we help you with today?</p>
              </div>
              <button className="text-blue-600 font-black hover:underline px-4 py-2 bg-blue-50 rounded-xl transition-colors">View All</button>
            </div>
            <CategoryGrid />
          </div>

          {/* Grid Layout for Services and Trending */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            <div className="xl:col-span-2">
              <div className="flex justify-between items-end mb-8 px-2">
                <h2 className="text-xl md:text-3xl font-black text-gray-900">Recommended For You</h2>
                <button className="text-blue-600 font-black hover:underline">See More</button>
              </div>
              <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {popularServices.map((service) => (
                  <motion.div key={service.id} variants={item}>
                    <ServiceCard {...service} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Trending Sidebar for Desktop */}
            <div className="hidden xl:block bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 h-fit sticky top-32">
              <div className="flex items-center gap-3 mb-8">
                <HiTrendingUp className="text-blue-600" size={32} />
                <h3 className="text-2xl font-black text-gray-900">Trending Now</h3>
              </div>
              
              <div className="flex flex-col gap-6">
                {trendingServices.map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group cursor-pointer hover:border-blue-200 transition-all">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">{t.name}</span>
                      <span className="text-[10px] font-black text-gray-400 uppercase">Increased demand</span>
                    </div>
                    <span className={cn("font-black", t.color)}>{t.trend}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden">
                <h4 className="text-lg font-black mb-2 relative z-10">Refer & Earn</h4>
                <p className="text-sm text-gray-400 mb-6 relative z-10">Invite friends and get ₹200 off on your next booking.</p>
                <button className="w-full bg-blue-600 py-3 rounded-xl font-black text-sm hover:bg-blue-700 transition-all relative z-10">
                  Invite Friends
                </button>
                <div className="absolute top-[-20px] right-[-20px] text-6xl opacity-10 rotate-12">🎁</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
}
