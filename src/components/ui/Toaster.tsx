"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { hideToast } from "../../store/slices/uiSlice";
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiX } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { RootState } from "../../store/store";

export default function Toaster() {
  const dispatch = useAppDispatch();
  const { message, type, isVisible, isPersistent } = useAppSelector((state: RootState) => state.ui.toast);

  useEffect(() => {
    if (isVisible && !isPersistent) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isPersistent, dispatch]);

  const icons = {
    success: <HiCheckCircle className="text-green-500" size={24} />,
    error: <HiExclamationCircle className="text-red-500" size={24} />,
    info: <HiInformationCircle className="text-blue-500" size={24} />,
    loading: (
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    ),
  };

  const bgColors = {
    success: "bg-green-50 border-green-100 shadow-green-100/50",
    error: "bg-red-50 border-red-100 shadow-red-100/50",
    info: "bg-blue-50 border-blue-100 shadow-blue-100/50",
    loading: "bg-blue-50 border-blue-100 shadow-blue-100/50",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-24 lg:bottom-12 left-1/2 -translate-x-1/2 z-[100] w-[90%] md:w-auto min-w-[320px]"
        >
          <div className={cn(
            "flex items-center gap-4 p-4 rounded-2xl border shadow-2xl backdrop-blur-md transition-all",
            bgColors[type as keyof typeof bgColors]
          )}>
            <div className="shrink-0">{icons[type as keyof typeof icons]}</div>
            <p className="flex-grow text-sm font-black text-gray-800 tracking-tight leading-tight">
              {message}
            </p>
            {!isPersistent && (
              <button 
                onClick={() => dispatch(hideToast())}
                className="p-1 hover:bg-black/5 rounded-lg transition-colors shrink-0"
              >
                <HiX className="text-gray-400" size={18} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
