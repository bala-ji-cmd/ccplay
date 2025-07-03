"use client";
import { motion } from 'framer-motion';
import { Copy, Twitter, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  shareId: string | null;
  onClose: () => void;
}

export const ShareModal = ({ shareId, onClose }: ShareModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full border-8 border-[#FFD900]">
        <h3
          className="text-xl font-bold mb-4 text-[#4B4B4B]"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          Share your creation
        </h3>
        <div className="space-y-4">
          <div className="p-3 bg-white rounded-xl flex items-center gap-2 border-2 border-[#FFD900]">
            <input
              type="text"
              value={shareId ? `${window.location.origin}/share/draw/${shareId}` : ''}
              className="flex-1 bg-transparent outline-none text-[#4B4B4B] font-semibold"
              readOnly
            />
            <button
              onClick={async () => {
                if (shareId) {
                  await navigator.clipboard.writeText(`${window.location.origin}/share/draw/${shareId}`);
                  // You could add a toast notification here to show "Copied!"
                }
              }}
              className="text-[#1CB0F6] hover:text-[#1BA0E1]"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a
              href={shareId ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/share/draw/${shareId}`)}&text=${encodeURIComponent('Check out my drawing!')}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2 bg-[#1CB0F6] text-white rounded-xl hover:bg-opacity-90 font-bold border-b-2 border-[#1BA0E1]"
            >
              <Twitter className="w-5 h-5" />
              Twitter
            </a>
            <a
              href={shareId ? `https://wa.me/?text=${encodeURIComponent(`Check out my drawing! ${window.location.origin}/share/draw/${shareId}`)}` : '#'}
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