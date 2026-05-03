"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  HiLocationMarker, HiSearch, HiBell, HiChevronDown,
  HiShieldCheck, HiCurrencyRupee, HiCalendar,
  HiTrendingUp, HiStar, HiUsers,
  HiCheckCircle, HiX, HiLightningBolt, HiClock,
} from "react-icons/hi";
import CategoryGrid from "@/components/home/CategoryGrid";
import Navbar from "@/components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "@/context/LocationContext";

// ── Static data ────────────────────────────────────────────────────────────────
const trustItems = [
  { icon: HiShieldCheck,   color: "from-blue-500 to-blue-600",      bg: "bg-blue-50",    label: "Verified Professionals", sub: "Background checked experts" },
  { icon: HiCurrencyRupee, color: "from-orange-400 to-orange-500",  bg: "bg-orange-50",  label: "Affordable Pricing",      sub: "No hidden costs" },
  { icon: HiCalendar,      color: "from-emerald-500 to-emerald-600",bg: "bg-emerald-50", label: "On-time Service",          sub: "Punctual and reliable" },
];

const stats = [
  { icon: HiUsers,       value: "50K+", label: "Happy Customers" },
  { icon: HiStar,        value: "4.9",  label: "Average Rating" },
  { icon: HiTrendingUp,  value: "200+", label: "Expert Providers" },
];

const NOTIFICATIONS = [
  {
    id: 1, unread: true,
    icon: HiCheckCircle, iconColor: "text-emerald-500", iconBg: "bg-emerald-50",
    title: "Booking Confirmed!",
    body: "Your Electrician booking for tomorrow 10 AM is confirmed.",
    time: "2 min ago",
  },
  {
    id: 2, unread: true,
    icon: HiLightningBolt, iconColor: "text-blue-500", iconBg: "bg-blue-50",
    title: "New Offer — 30% Off!",
    body: "Book any cleaning service today and save ₹450.",
    time: "1 hr ago",
  },
  {
    id: 3, unread: true,
    icon: HiStar, iconColor: "text-yellow-500", iconBg: "bg-yellow-50",
    title: "Rate Your Last Service",
    body: "How was Ravi Kumar's plumbing service? Tap to review.",
    time: "3 hr ago",
  },
  {
    id: 4, unread: false,
    icon: HiClock, iconColor: "text-gray-400", iconBg: "bg-gray-50",
    title: "Reminder",
    body: "Your AC service appointment is scheduled for May 5, 2 PM.",
    time: "Yesterday",
  },
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { address, loading: locationLoading, refreshLocation } = useLocation();
  const [notifOpen, setNotifOpen]       = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <div className="flex flex-col min-h-screen bg-white px-[5%] lg:px-[10%] py-6 pb-32">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between mb-8">
        {/* Location */}
        <button
          onClick={() => refreshLocation()}
          className="flex items-center gap-1.5 text-gray-900 hover:text-blue-600 transition-colors"
        >
          <HiLocationMarker className="text-blue-600" size={18} />
          <span className="text-sm font-bold truncate max-w-[200px]">
            {locationLoading ? "Detecting..." : address || "Sector 21, Noida"}
          </span>
          <HiChevronDown className="text-gray-400" size={16} />
        </button>

        {/* Bell + Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative p-2 bg-gray-50 rounded-full text-gray-900 border border-gray-100 shadow-sm hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            <HiBell size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md shadow-red-500/40 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-12 z-50 w-[340px] bg-white rounded-3xl shadow-2xl shadow-gray-200/80 border border-gray-100 overflow-hidden"
              >
                {/* Panel header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div>
                    <p className="font-black text-gray-900 text-base">Notifications</p>
                    {unreadCount > 0 && (
                      <p className="text-xs text-gray-400 font-medium">{unreadCount} unread</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs font-black text-blue-600 hover:underline">
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                    >
                      <HiX size={16} />
                    </button>
                  </div>
                </div>

                {/* Notification list */}
                <div className="divide-y divide-gray-50 max-h-[360px] overflow-y-auto">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className={`flex gap-3 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${n.unread ? "bg-blue-50/30" : ""}`}
                      >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${n.iconBg}`}>
                          <Icon size={20} className={n.iconColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-black text-gray-900 leading-tight">{n.title}</p>
                            {n.unread && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />}
                          </div>
                          <p className="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed">{n.body}</p>
                          <p className="text-[10px] text-gray-400 font-bold mt-1">{n.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Panel footer */}
                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                  <button className="w-full text-center text-sm font-black text-blue-600 hover:underline">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Main Grid ───────────────────────────────────────────────────────── */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-10">

        {/* ── Left: Main Content ──────────────────────────────────────────── */}
        <div className="lg:col-span-8">

          {/* Search Bar */}
          <div className="relative mb-8 group">
            <HiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for a service..."
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4
                         focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500
                         focus:bg-white transition-all text-sm font-medium shadow-sm
                         lg:py-[18px] lg:text-base"
            />
            <button className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2
                               bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-black
                               hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 items-center gap-2">
              <HiSearch size={16} /> Search
            </button>
          </div>

          {/* Hero Banner */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-3xl overflow-hidden mb-8 min-h-[220px] lg:min-h-[260px] flex items-center shadow-2xl shadow-blue-900/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A1A3B] via-[#0D2255] to-[#1a3a8f]" />
            <div className="absolute inset-0 opacity-10"
                 style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 p-8 lg:p-10 w-[55%]">
              <span className="hidden lg:inline-flex items-center gap-1.5 text-xs font-black text-blue-300 uppercase tracking-widest mb-4 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
                <HiStar size={12} className="text-yellow-400" /> #1 Home Services App
              </span>
              <h2 className="text-2xl lg:text-[2.2rem] font-black text-white leading-tight mb-4 lg:mb-6 lg:leading-[1.15]">
                Reliable Services <br />
                <span className="text-yellow-400">Right at Your<br className="hidden lg:block" /> Doorstep</span>
              </h2>
              <button className="bg-white text-[#0A1A3B] px-7 py-3 rounded-xl text-sm lg:text-base font-black hover:scale-105 transition-all shadow-xl shadow-black/20">
                Book Now
              </button>
            </div>
            <div className="absolute right-[-10px] lg:right-0 bottom-[-10px] w-60 h-60 lg:w-72 lg:h-72 opacity-95">
              <Image src="/fixly home.png" alt="Worker" fill className="object-contain" unoptimized />
            </div>
          </motion.div>

          {/* Stats Row (desktop only) */}
          <div className="hidden lg:grid grid-cols-3 gap-4 mb-8">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:shadow-md hover:border-blue-100 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-gray-900 leading-none">{s.value}</p>
                    <p className="text-xs font-bold text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Popular Services */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Popular Services</h3>
              <button className="hidden lg:block text-sm font-black text-blue-600 hover:underline">See all</button>
            </div>
            <CategoryGrid />
          </section>
        </div>

        {/* ── Right: Sidebar ──────────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-6">

          {/* Why Choose Us — desktop cards */}
          <section className="hidden lg:block">
            <h3 className="text-lg font-black text-gray-900 tracking-tight mb-4">Why Choose Us?</h3>
            <div className="flex flex-col gap-3">
              {trustItems.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.label}
                       className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl
                                  hover:shadow-md hover:border-blue-100 hover:-translate-y-0.5 transition-all group cursor-default">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${t.color} shadow-lg shrink-0`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800 group-hover:text-blue-700 transition-colors">{t.label}</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{t.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Why Choose Us — mobile compact row */}
          <section className="lg:hidden">
            <div className="grid grid-cols-3 gap-4">
              {trustItems.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.label} className="flex flex-col items-center text-center gap-2">
                    <div className={`w-12 h-12 ${t.bg} rounded-2xl flex items-center justify-center`}>
                      <Icon size={22} className="text-gray-700" />
                    </div>
                    <span className="text-[10px] font-black text-gray-700 uppercase tracking-tighter leading-tight">{t.label}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Refer & Earn — desktop */}
          <section className="hidden lg:block relative overflow-hidden rounded-3xl p-6 text-white
                              bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 shadow-xl shadow-blue-700/30">
            <div className="absolute inset-0 opacity-10"
                 style={{ backgroundImage: "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)", backgroundSize: "20px 20px" }} />
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <span className="text-2xl mb-2 block">🎁</span>
              <h4 className="text-xl font-black mb-1">Refer & Earn</h4>
              <p className="text-sm text-blue-100 mb-5 leading-relaxed">
                Invite friends & get <span className="text-yellow-300 font-black">₹200</span> off your next booking!
              </p>
              <button className="w-full bg-white text-blue-700 py-3 rounded-2xl font-black text-sm hover:scale-[1.03] transition-all shadow-lg shadow-blue-900/20">
                Invite Friends
              </button>
            </div>
          </section>

          {/* Refer & Earn — mobile */}
          <section className="lg:hidden p-6 bg-blue-600 rounded-3xl text-white relative overflow-hidden">
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
