"use client";

import { useState } from "react";
import { HiBell, HiMoon, HiGlobe, HiTrash, HiChevronRight, HiUser, HiLockClosed, HiShieldCheck } from "react-icons/hi";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode]           = useState(false);
  const [language, setLanguage]           = useState("English");

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-all duration-200 ${value ? "bg-blue-600" : "bg-gray-200"}`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${value ? "left-7" : "left-1"}`} />
    </button>
  );

  const sections = [
    {
      title: "Account",
      items: [
        { icon: HiUser,       label: "Edit Profile",        sub: user?.name || "—",         action: () => router.push("/profile") },
        { icon: HiLockClosed, label: "Change Password",     sub: "Update your password",    action: () => {} },
        { icon: HiShieldCheck,label: "Security & Privacy",  sub: "Manage access & data",    action: () => {} },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: HiBell,       label: "Push Notifications",  sub: "Booking updates & offers", toggle: true, value: notifications, onChange: () => setNotifications((v) => !v) },
        { icon: HiMoon,       label: "Dark Mode",           sub: "Coming soon",              toggle: true, value: darkMode,      onChange: () => {} },
        { icon: HiGlobe,      label: "Language",            sub: language,                   action: () => {} },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/40 pb-32 lg:pb-12">
      <div className="max-w-2xl mx-auto px-4 lg:px-0 py-6">
        <h1 className="text-2xl lg:text-4xl font-black text-gray-900 mb-8">Settings</h1>

        <div className="flex flex-col gap-6">
          {sections.map((sec) => (
            <div key={sec.title}>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{sec.title}</p>
              <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm divide-y divide-gray-50">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      onClick={!item.toggle ? item.action : undefined}
                      className={`flex items-center gap-4 px-5 py-4 ${!item.toggle ? "hover:bg-gray-50 cursor-pointer" : ""} transition-all`}
                    >
                      <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-900 text-sm">{item.label}</p>
                        <p className="text-xs text-gray-400 font-medium">{item.sub}</p>
                      </div>
                      {item.toggle
                        ? <Toggle value={item.value!} onChange={item.onChange!} />
                        : <HiChevronRight size={18} className="text-gray-300" />
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Danger zone */}
          <div>
            <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-3 px-1">Danger Zone</p>
            <div className="bg-white border border-red-100 rounded-3xl overflow-hidden shadow-sm">
              <button
                onClick={async () => { await logout(); router.push("/login"); }}
                className="flex items-center gap-4 px-5 py-4 w-full hover:bg-red-50 transition-all"
              >
                <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
                  <HiTrash size={20} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-black text-red-600 text-sm">Logout</p>
                  <p className="text-xs text-gray-400 font-medium">Sign out of your account</p>
                </div>
                <HiChevronRight size={18} className="text-red-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
}
