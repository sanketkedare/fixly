"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HiCalendar, HiChat, HiUser, HiCog, HiLogout,
  HiCollection, HiCurrencyRupee, HiShieldCheck, HiLogin, HiHome,
} from "react-icons/hi";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const hideSidebar =
    pathname === "/" || pathname === "/login" || pathname === "/register";
  if (hideSidebar) return null;

  const baseItems = [
    { label: "Home",     icon: HiHome,     href: "/home" },
    { label: "Messages", icon: HiChat,     href: "/messages" },
  ];

  const userItems = [
    { label: "Bookings", icon: HiCalendar, href: "/bookings" },
    { label: "Profile",  icon: HiUser,     href: "/profile" },
  ];

  const providerItems = [
    { label: "Jobs",     icon: HiCollection,    href: "/jobs" },
    { label: "Earnings", icon: HiCurrencyRupee, href: "/earnings" },
  ];

  const adminItems = [
    { label: "Admin Panel", icon: HiShieldCheck, href: "/admin" },
  ];

  const getRenderItems = () => {
    let items = [...baseItems];
    if (user?.role === "user")             items = [...items, ...userItems];
    if (user?.role === "service_provider") items = [...items, ...providerItems];
    if (user?.role === "admin")            items = [...items, ...adminItems];
    items.push({ label: "Settings", icon: HiCog, href: "/settings" });
    return items;
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="hidden lg:flex flex-col w-72 h-screen sticky top-0 z-40
                    bg-white border-r border-gray-100/80 p-5">

      {/* ── Brand ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-11 h-11 rounded-2xl overflow-hidden bg-blue-500 p-2 flex items-center justify-center shadow-md border border-gray-100">
          <Image src="/fixly logo.png" alt="Fixly" width={40} height={40} className="object-contain" />
        </div>
        <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
          Fixly
        </span>
      </div>

      {/* ── Nav items ─────────────────────────────────────────────────────── */}
      <nav className="flex flex-col gap-1 flex-grow">
        {mounted ? (
          getRenderItems().map((navItem) => {
            const isActive = pathname === navItem.href;
            const Icon = navItem.icon;
            return (
              <Link
                key={navItem.href}
                href={navItem.href}
                className={cn(
                  "relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-bold group",
                  isActive
                    ? "text-white shadow-lg shadow-blue-600/25"
                    : "text-gray-400 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                {/* Active gradient bg */}
                {isActive && (
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500" />
                )}
                <Icon size={21} className="relative z-10 shrink-0" />
                <span className="relative z-10 text-[15px]">{navItem.label}</span>

                {/* Hover accent line */}
                {!isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-6 bg-blue-500 rounded-r-full transition-all duration-200" />
                )}
              </Link>
            );
          })
        ) : (
          <div className="animate-pulse flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-2xl w-full" />
            ))}
          </div>
        )}
      </nav>

      {/* ── User card ─────────────────────────────────────────────────────── */}
      <div className="mt-auto pt-5 border-t border-gray-100">
        {mounted ? (
          user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600
                                flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-blue-500/20">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-gray-900 text-sm truncate leading-tight">{user.name}</p>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600
                                   bg-blue-50 px-2 py-0.5 rounded-lg inline-block mt-0.5">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={async () => { await logout(); router.push("/login"); }}
                className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 font-bold
                           hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all text-[15px]"
              >
                <HiLogout size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-3 px-4 py-3 w-full text-blue-600 font-bold
                         hover:bg-blue-50 rounded-2xl transition-all"
            >
              <HiLogin size={20} />
              <span>Login / Register</span>
            </Link>
          )
        ) : null}
      </div>
    </div>
  );
}
