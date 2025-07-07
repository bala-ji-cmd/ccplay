"use client";

import { motion } from "framer-motion";
import { Download, X } from 'lucide-react';
import { Loader } from "@/components/ui/loader";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isDownloading: boolean;
  fileName: string;
  onFileNameChange: (name: string) => void;
}

export const DownloadModal = ({ isOpen, onClose, onSubmit, isDownloading, fileName, onFileNameChange }: DownloadModalProps) => {
  if (!isOpen) return null;

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

        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
            placeholder="Enter file name"
            className="w-full px-4 py-3 border-4 border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1CB0F6] mb-4"
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
              disabled={isDownloading}
              className="px-4 py-2 text-sm bg-[#58CC02] text-white rounded-xl hover:bg-[#46A302] flex items-center gap-2 font-bold border-b-2 border-[#46A302]"
            >
              {isDownloading ? (
                <>
                  <Loader size="sm" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}; 