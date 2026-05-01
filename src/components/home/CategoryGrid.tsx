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
  { id: "electrician", name: "Electrician", icon: HiLightBulb, color: "bg-yellow-100 text-yellow-600" },
  { id: "plumber", name: "Plumber", icon: FaWrench, color: "bg-blue-100 text-blue-600" },
  { id: "driver", name: "Driver", icon: HiTruck, color: "bg-green-100 text-green-600" },
  { id: "cook", name: "Cook", icon: HiOutlineEmojiHappy, color: "bg-red-100 text-red-600" },
  { id: "carpenter", name: "Carpenter", icon: FaWrench, color: "bg-orange-100 text-orange-600" },
  { id: "painter", name: "Painter", icon: FaPaintRoller, color: "bg-pink-100 text-pink-600" },
  { id: "ac-repair", name: "AC Repair", icon: HiFire, color: "bg-cyan-100 text-cyan-600" },
  { id: "cleaner", name: "Cleaner", icon: FaSoap, color: "bg-teal-100 text-teal-600" },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4 md:gap-6">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <div key={cat.id} className="flex flex-col items-center gap-3 group cursor-pointer p-4 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
            <div className={cn(
              "w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-3xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-6", 
              cat.color
            )}>
              <Icon />
            </div>
            <span className="text-xs md:text-base font-black text-gray-700 group-hover:text-blue-600 transition-colors uppercase tracking-tighter">{cat.name}</span>
          </div>
        );
      })}
    </div>
  );
}
