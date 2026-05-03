"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { HiArrowLeft, HiCheckCircle, HiCreditCard, HiCash, HiPhone } from "react-icons/hi";
import { getServiceById } from "@/data/services";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";

const CONVENIENCE_FEE = 30;

const PAYMENT_METHODS = [
  { id: "upi",  label: "UPI",              icon: HiPhone,       sub: "GPay, PhonePe, Paytm" },
  { id: "card", label: "Card",             icon: HiCreditCard,  sub: "Credit / Debit Card" },
  { id: "cash", label: "Cash on Service",  icon: HiCash,        sub: "Pay after the job is done" },
];

interface BookingData {
  serviceId: string; serviceName: string; date: string;
  time: string; address: string; price: number;
}

export default function ConfirmBookingPage() {
  const { id }    = useParams<{ id: string }>();
  const router    = useRouter();
  const service   = getServiceById(id);

  const [booking, setBooking]   = useState<BookingData | null>(null);
  const [payment, setPayment]   = useState("upi");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("fixly_booking");
    if (raw) setBooking(JSON.parse(raw));
  }, []);

  if (!service || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">⚠️</p>
          <p className="font-black text-gray-900">No booking data found.</p>
          <button onClick={() => router.push("/services")} className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black">
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  const total = booking.price + CONVENIENCE_FEE;

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate network
    sessionStorage.removeItem("fixly_booking");
    setConfirmed(true);
    setLoading(false);
    setTimeout(() => router.push("/bookings"), 2200);
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center px-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <HiCheckCircle size={52} className="text-emerald-500" />
          </motion.div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-400 font-medium">Redirecting to your bookings…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/40 pb-36 lg:pb-12">
      <div className="max-w-xl mx-auto px-4 lg:px-0 py-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all">
            <HiArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-black text-gray-900">Confirm Booking</h1>
        </div>

        {/* Service Summary */}
        <div className="bg-white border border-gray-100 rounded-3xl p-4 mb-4 flex items-center gap-4 shadow-sm">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center overflow-hidden shadow-lg shrink-0`}>
             <Image src={service.image} alt={service.name} width={64} height={64} className="object-cover w-full h-full" />
          </div>
          <div>
            <p className="font-black text-gray-900">{service.name}</p>
            <p className="text-xs text-gray-400 font-medium">{booking.date} • {booking.time}</p>
            <p className="text-xs text-gray-400 font-medium">{booking.address}</p>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 mb-4 shadow-sm">
          <h3 className="font-black text-gray-900 mb-4">Price Details</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Service Charge</span>
              <span className="text-sm font-black text-gray-900">₹{booking.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Convenience Fee</span>
              <span className="text-sm font-black text-gray-900">₹{CONVENIENCE_FEE}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="text-base font-black text-gray-900">Total Payable</span>
              <span className="text-base font-black text-blue-600">₹{total}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
          <h3 className="font-black text-gray-900 mb-4">Payment Method</h3>
          <div className="flex flex-col gap-3">
            {PAYMENT_METHODS.map((m) => {
              const Icon = m.icon;
              const isSelected = payment === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setPayment(m.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    isSelected ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-blue-200"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-black text-gray-900 text-sm">{m.label}</p>
                    <p className="text-xs text-gray-400 font-medium">{m.sub}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-200"}`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-3 pb-6 z-30 lg:relative lg:border-none lg:bg-transparent lg:mt-6 lg:max-w-xl lg:mx-auto lg:px-0">
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-70"
        >
          {loading ? "Processing…" : `Confirm & Pay ₹${total}`}
        </button>
      </div>

      <Navbar />
    </div>
  );
}
