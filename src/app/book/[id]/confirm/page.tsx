"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { HiArrowLeft, HiCheckCircle } from "react-icons/hi";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ConfirmBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date") || "25 May 2024";
  const time = searchParams.get("time") || "10:00 AM - 12:00 PM";
  
  const [paymentMethod, setPaymentMethod] = useState("upi");

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-6 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-900">
          <HiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Confirm Booking</h1>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* Booking Info */}
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
           <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-3xl">⚡</div>
           <div>
              <h3 className="font-bold">Electrician</h3>
              <p className="text-xs text-gray-500 font-medium">{date} • {time}</p>
              <p className="text-xs text-gray-400 mt-1">Sector 21, Noida, Uttar Pradesh</p>
           </div>
        </div>

        {/* Price Details */}
        <div>
           <h2 className="font-bold text-gray-900 mb-4">Price Details</h2>
           <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service Charge</span>
                <span className="font-bold text-gray-900">₹299</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Convenience Fee</span>
                <span className="font-bold text-gray-900">₹30</span>
              </div>
              <div className="h-px bg-gray-200 my-1" />
              <div className="flex justify-between text-base">
                <span className="font-bold text-gray-900">Total Payable</span>
                <span className="font-bold text-blue-600">₹329</span>
              </div>
           </div>
        </div>

        {/* Payment Method */}
        <div>
           <h2 className="font-bold text-gray-900 mb-4">Payment Method</h2>
           <div className="flex flex-col gap-3">
              {[
                { id: "upi", label: "UPI", icon: "📱" },
                { id: "card", label: "Card", icon: "💳" },
                { id: "cash", label: "Cash on Service", icon: "💵" }
              ].map((method) => (
                <button 
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border transition-all",
                    paymentMethod === method.id ? "bg-blue-50 border-blue-600 ring-1 ring-blue-600" : "bg-white border-gray-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-bold text-gray-900 text-sm">{method.label}</span>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    paymentMethod === method.id ? "border-blue-600" : "border-gray-200"
                  )}>
                    {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                  </div>
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="p-6 mt-auto">
        <button 
          onClick={() => router.push("/bookings")}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          Confirm & Pay ₹329
        </button>
      </div>
    </div>
  );
}
