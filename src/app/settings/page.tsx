"use client";

import { useState } from "react";
import { HiBell, HiLockClosed, HiGlobeAlt, HiMoon, HiChevronRight, HiOutlineExternalLink } from "react-icons/hi";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const sections = [
    {
      title: "General",
      items: [
        { label: "App Language", icon: HiGlobeAlt, value: "English (US)", color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Privacy Policy", icon: HiLockClosed, value: null, color: "text-red-500", bg: "bg-red-50" },
      ]
    },
    {
      title: "Appearance",
      items: [
        { label: "Dark Mode", icon: HiMoon, type: "toggle", state: darkMode, setState: setDarkMode, color: "text-purple-500", bg: "bg-purple-50" },
      ]
    },
    {
      title: "Notifications",
      items: [
        { label: "Push Notifications", icon: HiBell, type: "toggle", state: notifications, setState: setNotifications, color: "text-orange-500", bg: "bg-orange-50" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 pb-32 lg:pb-12">
      <div className="max-w-screen-xl mx-auto p-6 md:p-12">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-12">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {sections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-6">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest px-4">{section.title}</h2>
              <div className="bg-white rounded-[2.5rem] p-4 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col gap-2">
                {section.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-4 md:p-6 rounded-3xl transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm", item.bg, item.color)}>
                          <Icon />
                        </div>
                        <span className="text-base font-black text-gray-700">{item.label}</span>
                      </div>
                      
                      {item.type === "toggle" ? (
                        <button 
                          onClick={() => item.setState && item.setState(!item.state)}
                          className={cn(
                            "w-14 h-8 rounded-full p-1 transition-all duration-300 relative",
                            item.state ? "bg-blue-600" : "bg-gray-200"
                          )}
                        >
                          <div className={cn(
                            "w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 absolute top-1",
                            item.state ? "left-7" : "left-1"
                          )} />
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          {item.value && <span className="text-xs font-bold">{item.value}</span>}
                          <HiChevronRight size={20} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Help & Support Card */}
          <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col gap-6 relative overflow-hidden h-full">
            <h3 className="text-xl md:text-2xl font-black relative z-10">Need help?</h3>
            <p className="text-sm text-gray-400 font-bold leading-relaxed relative z-10">
              Our support team is available 24/7 to help you with any issues regarding your bookings or payments.
            </p>
            <button className="w-full bg-blue-600 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-blue-600/30 relative z-10 flex items-center justify-center gap-2">
              Contact Support
              <HiOutlineExternalLink size={20} />
            </button>
            <div className="absolute top-[-40px] right-[-40px] text-[15rem] opacity-5 grayscale rotate-12 pointer-events-none select-none">🆘</div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
}
