"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiHome } from "react-icons/hi";

export default function LandingPage() {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 h-screen bg-[#0A1A3B] text-white relative px-[5%] lg:px-[10%] py-8 lg:gap-16 lg:items-center overflow-hidden">
      {/* branding & text (Left on desktop, Top on mobile) */}
      <div className="flex flex-col items-center lg:items-start gap-8 lg:gap-12 z-10 order-1">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center lg:items-start gap-2"
        >
          {/* Use provided Logo image which includes branding text */}
          <div className="relative w-48 h-48 lg:w-64 lg:h-64">
            <Image 
              src="/fixly logo.png" 
              alt="Fixly Logo" 
              fill 
              className="object-contain" 
              priority 
            />
          </div>
        </motion.div>

        {/* Action Buttons for Desktop (hidden on mobile here, shown below) */}
        <div className="hidden lg:flex flex-col gap-6 w-full lg:max-w-md">
          <Link 
            href="/login" 
            className="w-full bg-white text-[#0A1A3B] font-black text-2xl py-6 rounded-3xl text-center hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-white/10"
          >
            Get Started
          </Link>
          <Link 
            href="/home" 
            className="w-full bg-white/10 text-white border-2 border-white/20 font-black text-2xl py-6 rounded-3xl text-center hover:bg-white/20 active:scale-95 transition-all backdrop-blur-md"
          >
            Continue as Guest
          </Link>
        </div>
      </div>

      {/* Illustration (Right on desktop, Middle on mobile) */}
      <div className="flex-grow flex items-center justify-center my-12 lg:my-0 relative h-[300px] md:h-[450px] lg:h-[600px] order-2 z-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full h-full"
        >
          <Image 
            src="/fixly home.png" 
            alt="Service Providers Illustration" 
            fill 
            className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            priority
          />
        </motion.div>
      </div>

      {/* Action Buttons for Mobile (shown at bottom, hidden on desktop here) */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="lg:hidden flex flex-col gap-4 w-full mb-8 z-10 order-3"
      >
        <Link 
          href="/login" 
          className="w-full bg-white text-[#0A1A3B] font-black text-xl py-5 rounded-2xl text-center shadow-2xl"
        >
          Get Started
        </Link>
        <Link 
          href="/home" 
          className="w-full bg-transparent text-white border-2 border-white/40 font-black text-xl py-5 rounded-2xl text-center"
        >
          Continue as Guest
        </Link>
      </motion.div>

      {/* Subtle Background Detail */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] aspect-square bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] aspect-square bg-blue-500/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
