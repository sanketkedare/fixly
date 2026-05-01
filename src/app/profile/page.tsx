"use client";

import { HiUser, HiCamera, HiPencil, HiCheckCircle, HiChevronRight, HiOutlineShieldCheck, HiCreditCard, HiUsers } from "react-icons/hi";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

export default function ProfilePage() {
  const menuItems = [
    { label: "Account Information", icon: HiUser, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Payment Methods", icon: HiCreditCard, color: "text-green-500", bg: "bg-green-50" },
    { label: "Refer & Earn", icon: HiUsers, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Security & Privacy", icon: HiOutlineShieldCheck, color: "text-red-500", bg: "bg-red-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 pb-32 lg:pb-12">
      <div className="max-w-screen-xl mx-auto p-6 md:p-12">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-12">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-5xl md:text-6xl text-white shadow-2xl border-4 border-white">
                  SK
                </div>
                <button className="absolute bottom-1 right-1 w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-xl border border-gray-100 hover:scale-110 transition-all">
                  <HiCamera size={24} />
                </button>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Sanket Kedare</h2>
              <p className="text-gray-400 font-bold mt-1">sanket@example.com</p>
              
              <div className="mt-6 flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest">
                <HiCheckCircle size={18} />
                <span>Verified User</span>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full mt-10">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Bookings</span>
                  <span className="text-xl font-black text-gray-900">12</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Spent</span>
                  <span className="text-xl font-black text-gray-900">₹4.2k</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Menu */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-white rounded-[2.5rem] p-4 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
              <h3 className="text-xl font-black text-gray-900 mb-8 px-4">Account Settings</h3>
              <div className="flex flex-col gap-2">
                {menuItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button 
                      key={i}
                      className="group flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 rounded-3xl transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm", item.bg, item.color)}>
                          <Icon />
                        </div>
                        <span className="text-base md:text-xl font-black text-gray-700 group-hover:text-blue-600 transition-colors">
                          {item.label}
                        </span>
                      </div>
                      <HiChevronRight size={24} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile CTA */}
            <div className="bg-blue-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
               <div className="relative z-10">
                 <h4 className="text-xl md:text-3xl font-black mb-4">Complete your profile</h4>
                 <p className="text-blue-100 font-bold mb-8 max-w-md leading-relaxed">
                   Finish setting up your account to get personalized recommendations and faster checkouts.
                 </p>
                 <button className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
                   Finish Setup
                 </button>
               </div>
               <div className="absolute top-[-50px] right-[-50px] text-[15rem] opacity-10 grayscale brightness-200 select-none pointer-events-none">✨</div>
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
}
