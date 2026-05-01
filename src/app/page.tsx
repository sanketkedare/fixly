"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiHome } from "react-icons/hi";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A1A3B] text-white relative overflow-hidden h-screen-safe">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[80%] aspect-square bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[80%] aspect-square bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-grow flex flex-col items-center justify-center p-8 md:p-16 z-10">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 mb-12"
        >
          <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-[2rem] flex items-center justify-center text-[#FBBF24] shadow-2xl shadow-blue-900/50">
            <HiHome size={48} className="md:size-64" />
          </div>
          <div className="text-center">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-2">Fixly</h1>
            <p className="text-lg md:text-2xl text-gray-400 font-bold tracking-wide">All Services, One App</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="relative w-full max-w-sm md:max-w-xl aspect-square mb-12"
        >
          <Image 
            src="/hero.png" 
            alt="Fixly Services Illustration" 
            fill 
            className="object-contain drop-shadow-[0_35px_35px_rgba(37,99,235,0.3)]"
          />
        </motion.div>
      </div>

      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="p-8 md:p-16 w-full flex flex-col gap-4 mt-auto z-10"
      >
        <Link 
          href="/login" 
          className="w-full bg-white text-[#0A1A3B] font-black text-xl py-5 md:py-8 rounded-3xl text-center hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-black/20"
        >
          Get Started
        </Link>
        <Link 
          href="/home" 
          className="w-full bg-white/10 text-white font-black text-xl py-5 md:py-8 rounded-3xl text-center border border-white/20 hover:bg-white/20 active:scale-95 transition-all backdrop-blur-md"
        >
          Continue as Guest
        </Link>
        
        <p className="text-center text-gray-500 text-sm font-bold mt-4">
          By continuing, you agree to our <span className="text-white underline">Terms & Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
}
