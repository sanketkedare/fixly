"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  HiOutlineViewGrid,
} from "react-icons/hi";

const categories = [
  {
    id: "electrician",
    name: "Electrician",
    image: "/services/electrician.png",
    // mobile pill colours
    color: "bg-yellow-50 text-yellow-500 border-yellow-100",
    // desktop card gradient + accent
    gradient: "from-yellow-400 to-amber-500",
    lightBg: "bg-yellow-50",
    tag: "Most Booked",
  },
  {
    id: "plumber",
    name: "Plumber",
    image: "/services/plumber.png",
    color: "bg-blue-50 text-blue-500 border-blue-100",
    gradient: "from-blue-400 to-blue-600",
    lightBg: "bg-blue-50",
  },
  {
    id: "driver",
    name: "Driver",
    image: "/services/driver.png",
    color: "bg-green-50 text-green-500 border-green-100",
    gradient: "from-emerald-400 to-green-600",
    lightBg: "bg-green-50",
  },
  {
    id: "cook",
    name: "Cook",
    image: "/services/cook.png",
    color: "bg-orange-50 text-orange-500 border-orange-100",
    gradient: "from-orange-400 to-orange-600",
    lightBg: "bg-orange-50",
    tag: "Trending",
  },
  {
    id: "carpenter",
    name: "Carpenter",
    image: "/services/carpenter.png",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    gradient: "from-amber-500 to-yellow-600",
    lightBg: "bg-amber-50",
  },
  {
    id: "painter",
    name: "Painter",
    image: "/services/painter.png",
    color: "bg-red-50 text-red-500 border-red-100",
    gradient: "from-rose-400 to-red-600",
    lightBg: "bg-red-50",
  },
  {
    id: "ac-repair",
    name: "AC Repair",
    image: "/services/ac-repair.png",
    color: "bg-cyan-50 text-cyan-500 border-cyan-100",
    gradient: "from-cyan-400 to-sky-600",
    lightBg: "bg-cyan-50",
  },
  {
    id: "cleaner",
    name: "Cleaner",
    image: "/services/cleaner.png",
    color: "bg-teal-50 text-teal-500 border-teal-100",
    gradient: "from-teal-400 to-teal-600",
    lightBg: "bg-teal-50",
  },
  {
    id: "more",
    name: "More",
    icon: HiOutlineViewGrid,
    color: "bg-gray-50 text-gray-400 border-gray-100",
    gradient: "from-gray-400 to-gray-500",
    lightBg: "bg-gray-50",
  },
];

export default function CategoryGrid() {
  const router = useRouter();

  const handleClick = (id: string) => {
    if (id === "more") router.push("/services");
    else router.push(`/services/${id}`);
  };

  return (
    <>
      {/* ── Mobile: compact pill grid ────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 lg:hidden">
        {categories.map((cat) => {
          const Icon = "icon" in cat ? cat.icon : null;
          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className="flex flex-col items-center gap-2 group cursor-pointer transition-all duration-300 active:scale-95"
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm transition-all duration-300 group-hover:scale-105 border",
                  cat.color
                )}
              >
                {cat.image ? (
                   <Image src={cat.image} alt={cat.name} width={64} height={64} className="object-cover w-full h-full" />
                ) : Icon && (
                  <Icon className="text-2xl" />
                )}
              </div>
              <span className="text-[10px] font-black text-gray-700 uppercase tracking-tight text-center">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Desktop: premium card grid ───────────────────────────────────── */}
      <div className="hidden lg:grid grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = "icon" in cat ? cat.icon : null;
          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className="group relative flex items-center gap-4 p-4 bg-white border border-gray-100
                         rounded-2xl hover:border-transparent hover:shadow-xl hover:-translate-y-1
                         transition-all duration-300 text-left overflow-hidden"
            >
              {/* Hover gradient background */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl bg-gradient-to-br",
                cat.gradient
              )} />

              {/* Icon/Image */}
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden",
                !cat.image && "bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110",
                !cat.image && cat.gradient
              )}>
                {cat.image ? (
                   <Image src={cat.image} alt={cat.name} width={48} height={48} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
                ) : Icon && (
                  <Icon size={20} />
                )}
              </div>

              {/* Label + sub */}
              <div className="min-w-0">
                <p className="font-black text-gray-900 text-sm leading-tight group-hover:text-blue-700 transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Starting ₹199</p>
              </div>

              {/* Badge */}
              {cat.tag && (
                <span className={cn(
                  "absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
                  cat.tag === "Trending"
                    ? "bg-orange-100 text-orange-600"
                    : "bg-blue-100 text-blue-600"
                )}>
                  {cat.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
