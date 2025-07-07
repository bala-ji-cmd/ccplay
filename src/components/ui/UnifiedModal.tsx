"use client";

import { motion } from "framer-motion";
import { X, Download, Copy, Twitter, MessageCircle } from 'lucide-react';
import { Loader } from "@/components/ui/loader";
import { useState, FormEvent, useEffect } from 'react';

interface UnifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'download' | 'share';
  title: string;
  // Download props
  fileName?: string;
  onFileNameChange?: (name: string) => void;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  isDownloading?: boolean;
  // Share props
  shareId?: string | null;
  shareUrl?: string;
  shareText?: string;
}

export const UnifiedModal = ({ 
  isOpen, 
  onClose, 
  type, 
  title,
  fileName = '',
  onFileNameChange,
  onSubmit,
  isDownloading = false,
  shareId,
  shareUrl,
  shareText = 'Check out my creation!'
}: UnifiedModalProps) => {
  const [copied, setCopied] = useState(false);
  const [localFileName, setLocalFileName] = useState(fileName);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setLocalFileName(fileName);
  }, [fileName]);

  const handleCopy = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

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
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {type === 'download' ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={localFileName}
              onChange={(e) => {
                setLocalFileName(e.target.value);
                if (onFileNameChange) {
                  onFileNameChange(e.target.value);
                }
              }}
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
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-[#FFF9E5] rounded-xl flex items-center gap-2 border-2 border-[#FFD900]">
              <input
                type="text"
                value={shareUrl || ''}
                className="flex-1 bg-white outline-none text-[#4B4B4B] font-bold text-base px-2 py-1 rounded"
                readOnly
                style={{ letterSpacing: '0.01em' }}
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
                href={shareUrl ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2 bg-[#1CB0F6] text-white rounded-xl hover:bg-opacity-90 font-bold border-b-2 border-[#1BA0E1]"
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </a>
              <a
                href={shareUrl ? `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}` : '#'}
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
        )}
      </div>
    </motion.div>
  );
}; 