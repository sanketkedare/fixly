"use client";

import { HiArrowLeft, HiSearch } from "react-icons/hi";
import { useRouter } from "next/navigation";
import ServiceCard from "@/components/home/ServiceCard";
import Navbar from "@/components/layout/Navbar";

const allServices = [
  { id: "1", name: "Electrician", category: "Wiring, Faults, Fittings and more", rating: 4.6, reviews: 1200, price: 299 },
  { id: "2", name: "Plumber", category: "Pipes, Leaks, Installations", rating: 4.5, reviews: 980, price: 299 },
  { id: "3", name: "Driver", category: "Personal Driver, Outstation, Airport Drop", rating: 4.7, reviews: 1100, price: 399 },
  { id: "4", name: "Cook", category: "Daily Cooking, Meal Prep, Special Meals", rating: 4.6, reviews: 850, price: 299 },
  { id: "5", name: "Carpenter", category: "Furniture, Repairs, Woodwork", rating: 4.4, reviews: 620, price: 299 },
];

export default function AllServicesPage() {
  const router = useRouter();

  return (
    <div className="pb-24">
      <div className="p-6 border-b border-gray-100 flex items-center gap-4 sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} className="text-gray-900">
          <HiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">All Services</h1>
      </div>

      <div className="p-6">
        <div className="relative mb-6">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for a service..." 
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
        </div>

        <div className="flex flex-col gap-4">
          {allServices.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </div>

      <Navbar />
    </div>
  );
}
