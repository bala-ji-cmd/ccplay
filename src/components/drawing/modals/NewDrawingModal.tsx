"use client";

import { motion } from 'framer-motion';

interface NewDrawingModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const NewDrawingModal = ({ onClose, onConfirm }: NewDrawingModalProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9 }}
      className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border-8 border-[#FFD900]"
    >
      <h3
        className="text-xl font-bold text-[#4B4B4B] mb-4"
        style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
      >
        Start a New Drawing?
      </h3>
      <p className="text-[#4B4B4B] mb-6 text-base">
        Starting a new drawing will clear the current canvas. Are you sure you want to continue?
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-[#4B4B4B] border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] rounded-xl transition-colors font-bold"
        >
          No, Keep Drawing
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2 bg-[#FF9600] text-white rounded-xl hover:bg-[#E68600] transition-colors font-bold border-b-2 border-[#E68600]"
        >
          Yes, Start New
        </button>
      </div>
    </motion.div>
  </motion.div>
); 