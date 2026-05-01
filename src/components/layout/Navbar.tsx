"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome, HiCalendar, HiChat, HiUser, HiCollection, HiLogin } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hideNavbar = pathname === "/" || pathname === "/login" || pathname === "/register";
  if (hideNavbar) return null;

  const getNavItems = () => {
    const baseItems = [
      { label: "Home", icon: HiHome, href: "/home" },
      { label: "Messages", icon: HiChat, href: "/messages" },
    ];

    if (!user) {
      return [...baseItems, { label: "Login", icon: HiLogin, href: "/login" }];
    }

    const items = [...baseItems];
    if (user?.role === "user") {
      items.push({ label: "Bookings", icon: HiCalendar, href: "/bookings" });
    } else if (user?.role === "service_provider") {
      items.push({ label: "Jobs", icon: HiCollection, href: "/jobs" });
    }
    items.push({ label: "Profile", icon: HiUser, href: "/profile" });
    return items;
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none p-4">
      <nav className="w-full bg-white/80 backdrop-blur-md border border-gray-100 flex justify-around py-3 rounded-3xl pointer-events-auto shadow-2xl transition-all duration-300">
        {mounted ? (
          getNavItems().map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all duration-200 px-4 py-1 rounded-2xl",
                  isActive ? "text-blue-600 bg-blue-50/50" : "text-gray-400"
                )}
              >
                <Icon className={cn("text-2xl", isActive && "scale-110")} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })
        ) : (
          // Placeholder to maintain layout during hydration
          [1, 2, 3, 4].map(i => (
            <div key={i} className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse" />
          ))
        )}
      </nav>
    </div>
  );
}
