"use client";

import { useState } from "react";
import { HiArrowLeft, HiChevronRight, HiCalendar, HiLocationMarker, HiClock } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";

const bookings = [
  { id: "1", name: "Master Electrician", date: "25 May 2024", time: "10:00 AM - 12:00 PM", status: "Confirmed", price: 499, address: "Sector 21, Noida", icon: "⚡" },
  { id: "2", name: "Emergency Plumber", date: "28 May 2024", time: "11:00 AM - 01:00 PM", status: "Pending", price: 399, address: "Sector 21, Noida", icon: "🔧" },
  { id: "3", name: "Luxury Car Driver", date: "30 May 2024", time: "01:00 PM - 03:00 PM", status: "Confirmed", price: 899, address: "Sector 21, Noida", icon: "🚗" },
  { id: "4", name: "Deep Cleaning Service", date: "02 June 2024", time: "09:00 AM - 04:00 PM", status: "Completed", price: 1500, address: "Sector 21, Noida", icon: "🧼" },
];

export default function BookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Upcoming");

  const filteredBookings = activeTab === "Upcoming" 
    ? bookings.filter(b => b.status !== "Completed")
    : bookings.filter(b => b.status === "Completed");

  return (
    <div className="pb-32 lg:pb-12 min-h-screen bg-gray-50/30">
      <div className="max-w-screen-xl mx-auto p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="lg:hidden text-gray-900">
              <HiArrowLeft size={24} />
            </button>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900">My Bookings</h1>
          </div>

          <div className="bg-white p-1.5 rounded-[1.5rem] border border-gray-100 flex shadow-sm w-full md:w-fit">
            {["Upcoming", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 md:w-40 py-3 text-sm font-black rounded-2xl transition-all duration-300",
                  activeTab === tab ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {filteredBookings.map((booking, i) => (
            <motion.div 
              key={booking.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-8 flex flex-col gap-6 hover:border-blue-200 hover:shadow-2xl hover:shadow-gray-200/50 transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {booking.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-gray-900 leading-tight">{booking.name}</h3>
                    <div className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest mt-1",
                      booking.status === "Confirmed" ? "text-green-500" : booking.status === "Pending" ? "text-orange-500" : "text-gray-400"
                    )}>
                      {booking.status}
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-300 group-hover:text-blue-600 transition-colors">
                  <HiChevronRight size={28} />
                </button>
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                  <HiCalendar className="text-blue-600" size={20} />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                  <HiClock className="text-blue-600" size={20} />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                  <HiLocationMarker className="text-blue-600" size={20} />
                  <span>{booking.address}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-2xl font-black text-gray-900">₹{booking.price}</span>
                <button className="bg-gray-50 text-gray-600 px-6 py-2 rounded-xl text-xs font-black hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
              <HiCalendar size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-900">No {activeTab} Bookings</h2>
            <p className="text-gray-400 font-bold mt-2">You haven't booked any services in this category yet.</p>
            <button 
              onClick={() => router.push("/home")}
              className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-blue-600/20"
            >
              Explore Services
            </button>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
}
