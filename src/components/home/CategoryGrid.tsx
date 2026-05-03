"use client";

import { cn } from "@/lib/utils";
import { 
  HiLightBulb, 
  HiTruck, 
  HiFire, 
  HiOutlineEmojiHappy, 
  HiOutlineViewGrid 
} from "react-icons/hi";
import { FaWrench, FaPaintRoller, FaSoap } from "react-icons/fa";

const categories = [
  { id: "electrician", name: "Electrician", icon: HiLightBulb, color: "bg-yellow-50 text-yellow-500 border-yellow-100" },
  { id: "plumber", name: "Plumber", icon: FaWrench, color: "bg-blue-50 text-blue-500 border-blue-100" },
  { id: "driver", name: "Driver", icon: HiTruck, color: "bg-green-50 text-green-500 border-green-100" },
  { id: "cook", name: "Cook", icon: HiOutlineEmojiHappy, color: "bg-orange-50 text-orange-500 border-orange-100" },
  { id: "carpenter", name: "Carpenter", icon: FaWrench, color: "bg-amber-50 text-amber-600 border-amber-100" },
  { id: "painter", name: "Painter", icon: FaPaintRoller, color: "bg-red-50 text-red-500 border-red-100" },
  { id: "ac-repair", name: "AC Repair", icon: HiFire, color: "bg-cyan-50 text-cyan-500 border-cyan-100" },
  { id: "cleaner", name: "Cleaner", icon: FaSoap, color: "bg-teal-50 text-teal-500 border-teal-100" },
  { id: "more", name: "More", icon: HiOutlineViewGrid, color: "bg-gray-50 text-gray-400 border-gray-100" },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4 md:gap-8">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <div key={cat.id} className="flex flex-col items-center gap-2 group cursor-pointer transition-all duration-300">
            <div className={cn(
              "w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-sm transition-all duration-300 group-hover:scale-105 border", 
              cat.color
            )}>
              <Icon />
            </div>
            <span className="text-[10px] md:text-xs font-black text-gray-700 transition-colors uppercase tracking-tight text-center">
              {cat.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
