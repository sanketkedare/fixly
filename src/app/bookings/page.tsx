"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiChevronRight, HiCheckCircle, HiClock, HiXCircle } from "react-icons/hi";
import { DUMMY_BOOKINGS, type Booking } from "@/data/services";
import Navbar from "@/components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_STYLES: Record<Booking["status"], { label: string; bg: string; text: string }> = {
  Confirmed:  { label: "Confirmed",  bg: "bg-emerald-100", text: "text-emerald-700" },
  Pending:    { label: "Pending",    bg: "bg-yellow-100",  text: "text-yellow-700"  },
  Completed:  { label: "Completed",  bg: "bg-gray-100",    text: "text-gray-500"    },
  Cancelled:  { label: "Cancelled",  bg: "bg-red-100",     text: "text-red-600"     },
};

export default function BookingsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"Upcoming" | "Completed">("Upcoming");

  const upcoming  = DUMMY_BOOKINGS.filter((b) => b.status === "Confirmed" || b.status === "Pending");
  const completed = DUMMY_BOOKINGS.filter((b) => b.status === "Completed" || b.status === "Cancelled");
  const list      = tab === "Upcoming" ? upcoming : completed;

  return (
    <div className="min-h-screen bg-gray-50/40 pb-32 lg:pb-12">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-12 py-6">

        {/* Header */}
        <h1 className="text-2xl lg:text-4xl font-black text-gray-900 mb-8">My Bookings</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(["Upcoming", "Completed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-full font-black text-sm transition-all ${
                tab === t
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white text-gray-500 border border-gray-100 hover:border-blue-200"
              }`}
            >
              {t}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black ${tab === t ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {t === "Upcoming" ? upcoming.length : completed.length}
              </span>
            </button>
          ))}
        </div>

        {/* Booking cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4"
          >
            {list.map((b) => {
              const style = STATUS_STYLES[b.status];
              return (
                <button
                  key={b.id}
                  onClick={() => router.push(`/services/${b.serviceId}`)}
                  className="group flex items-center gap-4 bg-white border border-gray-100 rounded-3xl p-4 hover:shadow-xl hover:border-blue-100 hover:-translate-y-0.5 transition-all text-left"
                >
                  {/* Emoji */}
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl shrink-0">
                    {b.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-black text-gray-900 text-sm lg:text-base group-hover:text-blue-700 transition-colors">{b.serviceName}</p>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 ${style.bg} ${style.text}`}>{style.label}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{b.date} • {b.time}</p>
                    <p className="text-xs text-gray-400 font-medium">{b.address}</p>
                    <p className="text-sm font-black text-gray-900 mt-1.5">₹{b.price}</p>
                  </div>

                  <HiChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {list.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">{tab === "Upcoming" ? "📅" : "✅"}</p>
            <p className="font-black text-gray-900 text-lg">No {tab.toLowerCase()} bookings</p>
            {tab === "Upcoming" && (
              <button onClick={() => router.push("/services")} className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                Browse Services
              </button>
            )}
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
}
