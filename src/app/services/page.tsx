"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { HiArrowLeft, HiSearch, HiStar, HiChevronRight } from "react-icons/hi";
import { SERVICES } from "@/data/services";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";

const FILTERS = ["All", "Electrical", "Plumbing", "Transport", "Home & Kitchen", "Furniture", "Appliances", "Home Cleaning"];

export default function ServicesPage() {
  const router = useRouter();
  const [query, setQuery]   = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = SERVICES.filter((s) => {
    const matchesQuery  = s.name.toLowerCase().includes(query.toLowerCase()) || s.description.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || s.category === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50/40 pb-32 lg:pb-12">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-12 py-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all">
            <HiArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900">All Services</h1>
        </div>

        {/* Search */}
        <div className="relative mb-6 group">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium shadow-sm"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-black transition-all ${
                filter === f
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white text-gray-500 border border-gray-100 hover:border-blue-200 hover:text-blue-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Service List */}
        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4">
          {filtered.map((service, i) => (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => router.push(`/services/${service.id}`)}
              className="group flex items-center gap-4 bg-white border border-gray-100 rounded-3xl p-4 hover:shadow-xl hover:border-blue-100 hover:-translate-y-0.5 transition-all text-left"
            >
              {/* Image thumbnail */}
              <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center overflow-hidden shadow-lg shrink-0`}>
                <Image src={service.image} alt={service.name} width={80} height={80} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-black text-gray-900 text-base lg:text-lg group-hover:text-blue-700 transition-colors">{service.name}</p>
                  {service.tags?.[0] && (
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                      service.tags[0] === "Trending" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                    }`}>{service.tags[0]}</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 font-medium mt-0.5 truncate">{service.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <HiStar className="text-yellow-400" size={14} />
                    <span className="text-sm font-black text-gray-700">{service.rating}</span>
                    <span className="text-xs text-gray-400 font-medium">({service.reviews.toLocaleString()}+)</span>
                  </div>
                  <span className="text-sm font-black text-blue-600">From ₹{service.price}</span>
                </div>
              </div>

              <HiChevronRight size={20} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-black text-gray-900 text-lg">No services found</p>
            <p className="text-gray-400 font-medium mt-1">Try a different search or filter</p>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
}
