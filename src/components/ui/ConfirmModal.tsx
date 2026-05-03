"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { hideModal } from "../../store/slices/uiSlice";
import { cn } from "@/lib/utils";
import { RootState } from "../../store/store";

export default function ConfirmModal() {
  const dispatch = useAppDispatch();
  const { isOpen, title, message, confirmText, cancelText, actionType, onConfirmId } = useAppSelector(
    (state: RootState) => state.ui.modal
  );

  const handleConfirm = () => {
    // In a real app, you'd listen for this ID in your middleware or a custom hook
    // For now, we'll just emit a custom event that components can listen to
    const event = new CustomEvent("modalConfirm", { detail: { id: onConfirmId } });
    window.dispatchEvent(event);
    dispatch(hideModal());
  };

  const handleCancel = () => {
    dispatch(hideModal());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-100"
          >
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">
              {title}
            </h3>
            <p className="text-gray-500 font-bold mb-10 leading-relaxed">
              {message}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCancel}
                className="flex-1 px-8 py-4 rounded-2xl font-black text-gray-500 hover:bg-gray-50 transition-all"
              >
                {cancelText || "Cancel"}
              </button>
              <button
                onClick={handleConfirm}
                className={cn(
                  "flex-1 px-8 py-4 rounded-2xl font-black text-white shadow-xl transition-all hover:scale-105 active:scale-95",
                  actionType === "danger" ? "bg-red-600 shadow-red-600/20" : "bg-blue-600 shadow-blue-600/20"
                )}
              >
                {confirmText || "Confirm"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
