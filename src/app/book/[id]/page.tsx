"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { HiArrowLeft, HiCalendar, HiClock, HiLocationMarker, HiChat } from "react-icons/hi";
import { getServiceById } from "@/data/services";
import Navbar from "@/components/layout/Navbar";

export default function BookServicePage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();
  const service = getServiceById(id);

  const [date, setDate]               = useState("");
  const [time, setTime]               = useState("10:00");
  const [address, setAddress]         = useState("Sector 21, Noida, Uttar Pradesh");
  const [instructions, setInstructions] = useState("");
  const [error, setError]             = useState("");

  if (!service) {
    router.push("/services");
    return null;
  }

  const handleContinue = () => {
    if (!date) { setError("Please select a date."); return; }
    // Store booking context for confirm page
    sessionStorage.setItem("fixly_booking", JSON.stringify({ serviceId: service.id, serviceName: service.name, date, time, address, instructions, price: service.price }));
    router.push(`/book/${service.id}/confirm`);
  };

  return (
    <div className="min-h-screen bg-gray-50/40 pb-32 lg:pb-12">
      <div className="max-w-xl mx-auto px-4 lg:px-0 py-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all">
            <HiArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-black text-gray-900">Book a Service</h1>
        </div>

        {/* Service Summary Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-4 mb-6 flex items-center gap-4 shadow-sm">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-3xl shadow-lg shrink-0`}>
            {service.emoji}
          </div>
          <div>
            <p className="font-black text-gray-900 text-base">{service.name}</p>
            <p className="text-sm text-gray-400 font-medium">{service.description}</p>
            <p className="text-sm font-black text-blue-600 mt-1">From ₹{service.price}</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex flex-col gap-6">

          {/* Select Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-black text-gray-700 mb-2">
              <HiCalendar className="text-blue-600" size={18} /> Select Date
            </label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => { setDate(e.target.value); setError(""); }}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Select Time */}
          <div>
            <label className="flex items-center gap-2 text-sm font-black text-gray-700 mb-2">
              <HiClock className="text-blue-600" size={18} /> Select Time
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              {["08:00 AM – 10:00 AM","10:00 AM – 12:00 PM","12:00 PM – 02:00 PM","02:00 PM – 04:00 PM","04:00 PM – 06:00 PM"].map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center gap-2 text-sm font-black text-gray-700 mb-2">
              <HiLocationMarker className="text-blue-600" size={18} /> Enter Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Your full address"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="flex items-center gap-2 text-sm font-black text-gray-700 mb-2">
              <HiChat className="text-blue-600" size={18} /> Add Instructions <span className="text-gray-400 font-medium">(Optional)</span>
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="E.g. Please call before arriving"
              rows={3}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {error && <p className="text-sm font-bold text-red-500 -mt-2">{error}</p>}
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          className="w-full mt-6 bg-blue-600 text-white py-4 rounded-2xl font-black text-base hover:bg-blue-700 hover:scale-[1.02] transition-all shadow-xl shadow-blue-600/20"
        >
          Continue
        </button>
      </div>
      <Navbar />
    </div>
  );
}
