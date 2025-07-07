"use client";

import { motion } from "framer-motion";
import { Copy, Twitter, MessageCircle, X } from 'lucide-react';
import { useEffect, useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareId: string | null;
}

export const ShareModal = ({ isOpen, onClose, shareId }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if(!isOpen) {
        setCopied(false);
    }
  },[isOpen])

  if (!isOpen) return null;

  const shareUrl = shareId ? `${window.location.origin}/share/learn/${shareId}` : '';

  const handleCopy = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full border-8 border-[#FFD900]">
        <div className="flex justify-between items-start mb-4">
          <h3
            className="text-xl font-bold text-[#4B4B4B]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Share your creation
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-[#FFF9E5] rounded-xl flex items-center gap-2 border-2 border-[#FFD900]">
            <input
              type="text"
              value={shareUrl}
              className="flex-1 bg-transparent outline-none"
              readOnly
            />
            <button
              onClick={handleCopy}
              className="text-[#1CB0F6] hover:text-[#1BA0E1]"
            >
              {copied ? <span className="text-sm">Copied!</span> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a
              href={shareUrl ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Check out my drawing steps!')}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2 bg-[#1CB0F6] text-white rounded-xl hover:bg-opacity-90 font-bold border-b-2 border-[#1BA0E1]"
            >
              <Twitter className="w-5 h-5" />
              Twitter
            </a>
            <a
              href={shareUrl ? `https://wa.me/?text=${encodeURIComponent(`Check out my drawing steps! ${shareUrl}`)}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2 bg-[#58CC02] text-white rounded-xl hover:bg-opacity-90 font-bold border-b-2 border-[#46A302]"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
          
          <button
            onClick={onClose}
            className="w-full p-2 bg-[#FF4B4B] text-white rounded-xl hover:bg-red-600 font-bold border-b-2 border-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
}; 