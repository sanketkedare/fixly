"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { HiArrowLeft, HiCalendar, HiClock, HiLocationMarker } from "react-icons/hi";
import Link from "next/link";

export default function BookServicePage() {
  const router = useRouter();
  const [date, setDate] = useState("2024-05-25");
  const [time, setTime] = useState("10:00 AM - 12:00 PM");

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-6 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-900">
          <HiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Book a Service</h1>
      </div>

      <div className="p-6 flex flex-col gap-8 flex-grow">
        {/* Service Summary Small */}
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
           <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-3xl">⚡</div>
           <div>
              <h3 className="font-bold">Electrician</h3>
              <p className="text-xs text-gray-500">Wiring, Faults, Fittings and more</p>
              <p className="text-blue-600 font-bold text-sm mt-1">From ₹299</p>
           </div>
        </div>

        {/* Date Selection */}
        <div className="flex flex-col gap-3">
          <label className="font-bold text-gray-900">Select Date</label>
          <div className="relative">
            <HiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Time Selection */}
        <div className="flex flex-col gap-3">
          <label className="font-bold text-gray-900">Select Time</label>
          <div className="relative">
            <HiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none"
            >
              <option>09:00 AM - 11:00 AM</option>
              <option>10:00 AM - 12:00 PM</option>
              <option>01:00 PM - 03:00 PM</option>
              <option>04:00 PM - 06:00 PM</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-3">
          <label className="font-bold text-gray-900">Enter Address</label>
          <div className="relative">
            <HiLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Sector 21, Noida, Uttar Pradesh"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="flex flex-col gap-3">
          <label className="font-bold text-gray-900">Add Instructions (Optional)</label>
          <textarea 
            placeholder="E.g. Please call before arriving"
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm min-h-[100px]"
          />
        </div>
      </div>

      <div className="p-6 mt-auto">
        <Link 
          href={`/book/1/confirm?date=${date}&time=${time}`}
          className="w-full block bg-blue-600 text-white font-bold py-4 rounded-2xl text-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
