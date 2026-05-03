"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  HiOutlineUserGroup, 
  HiOutlineClipboardList, 
  HiOutlineShieldCheck, 
  HiOutlineChartBar, 
  HiOutlineLogout,
  HiMenuAlt2
} from "react-icons/hi";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.push("/home");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Overview", icon: HiOutlineChartBar, href: "/admin" },
    { name: "Users", icon: HiOutlineUserGroup, href: "/admin/users" },
    { name: "Providers", icon: HiOutlineShieldCheck, href: "/admin/providers" },
    { name: "Bookings", icon: HiOutlineClipboardList, href: "/admin/bookings" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed inset-y-0 z-50",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">F</div>
          {isSidebarOpen && <span className="font-black text-2xl tracking-tighter text-gray-900">Fixly Admin</span>}
        </div>

        <nav className="flex-1 px-4 mt-6 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-blue-600 transition-all font-bold group"
            >
              <item.icon size={24} className="group-hover:scale-110 transition-transform" />
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-4 p-3 w-full rounded-xl hover:bg-red-50 text-gray-500 hover:text-red-600 transition-all font-bold group">
            <HiOutlineLogout size={24} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 px-8 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
          >
            <HiMenuAlt2 size={24} />
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black text-gray-900">{user.name}</p>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Super Admin</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
