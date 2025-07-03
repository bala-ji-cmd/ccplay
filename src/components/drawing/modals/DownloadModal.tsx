"use client";
import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface DownloadModalProps {
  initialFileName: string;
  onClose: () => void;
  onSave: (fileName: string) => void;
}

export const DownloadModal = ({ initialFileName, onClose, onSave }: DownloadModalProps) => {
  const [localFileName, setLocalFileName] = useState(initialFileName);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(localFileName);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border-8 border-[#FFD900]">
        <div className="flex justify-between items-start mb-4">
          <h3
            className="text-xl font-bold text-[#4B4B4B]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Save your artwork
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={localFileName}
            onChange={(e) => setLocalFileName(e.target.value)}
            placeholder={initialFileName}
            className="w-full px-4 py-2 border-4 border-[#E5E5E5] rounded-xl mb-4 focus:outline-none focus:border-[#1CB0F6] bg-white text-black"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-[#FF4B4B] text-white rounded-xl hover:bg-red-600 font-bold border-b-2 border-red-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-[#58CC02] text-white rounded-xl hover:bg-[#46A302] font-bold border-b-2 border-[#46A302]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}; 