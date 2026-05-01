"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HiHome, HiCalendar, HiChat, HiUser, HiCog, HiLogout, HiCollection, HiCurrencyRupee, HiShieldCheck, HiLogin } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hideSidebar = pathname === "/" || pathname === "/login" || pathname === "/register";
  if (hideSidebar) return null;

  const baseItems = [
    { label: "Home", icon: HiHome, href: "/home" },
    { label: "Messages", icon: HiChat, href: "/messages" },
  ];

  const userItems = [
    { label: "Bookings", icon: HiCalendar, href: "/bookings" },
    { label: "Profile", icon: HiUser, href: "/profile" },
  ];

  const providerItems = [
    { label: "Jobs", icon: HiCollection, href: "/jobs" },
    { label: "Earnings", icon: HiCurrencyRupee, href: "/earnings" },
  ];

  const adminItems = [
    { label: "Admin Panel", icon: HiShieldCheck, href: "/admin" },
  ];

  const getRenderItems = () => {
    let items = [...baseItems];
    if (user?.role === "user") items = [...items, ...userItems];
    if (user?.role === "service_provider") items = [...items, ...providerItems];
    if (user?.role === "admin") items = [...items, ...adminItems];
    items.push({ label: "Settings", icon: HiCog, href: "/settings" });
    return items;
  };

  return (
    <div className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 h-screen sticky top-0 p-6 z-40">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
          <HiHome size={24} />
        </div>
        <span className="text-2xl font-black tracking-tighter text-gray-900">Fixly</span>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        {mounted ? (
          getRenderItems().map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold",
                  isActive 
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 translate-x-2" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon size={24} />
                <span>{item.label}</span>
              </Link>
            );
          })
        ) : (
          // Skeleton or placeholder during hydration
          <div className="animate-pulse flex flex-col gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-gray-100 rounded-2xl w-full" />
            ))}
          </div>
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100 min-h-[120px]">
        {mounted ? (
          user ? (
            <>
              <div className="mb-6 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                <p className="font-black text-gray-900 truncate">{user.name}</p>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded-lg mt-1 inline-block">
                  {user.role}
                </span>
              </div>
              <button 
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                className="flex items-center gap-4 px-4 py-3.5 w-full text-gray-500 font-bold hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
              >
                <HiLogout size={24} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link 
              href="/login"
              className="flex items-center gap-4 px-4 py-3.5 w-full text-blue-600 font-bold hover:bg-blue-50 rounded-2xl transition-all"
            >
              <HiLogin size={24} />
              <span>Login / Register</span>
            </Link>
          )
        ) : null}
      </div>
    </div>
  );
}
