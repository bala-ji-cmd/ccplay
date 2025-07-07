"use client";
import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ErrorModalProps {
  initialApiKey: string;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
}

export const ErrorModal = ({ initialApiKey, onClose, onSubmit }: ErrorModalProps) => {
  const [apiKey, setApiKey] = useState(initialApiKey);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(apiKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border-8 border-[#FFD900]">
        <div className="flex justify-between items-start mb-4">
          <h3
            className="text-xl font-bold text-[#FF4B4B]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Failed to generate
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-[#4B4B4B] mb-2">
            Add your own API key to continue generating.
          </label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API Key..."
            className="w-full px-4 py-2 border-4 border-[#E5E5E5] rounded-xl mb-4 focus:outline-none focus:border-[#1CB0F6]"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border-2 border-[#E5E5E5] rounded-xl hover:bg-[#F7F7F7] font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-[#58CC02] text-white rounded-xl hover:bg-[#46A302] font-bold border-b-2 border-[#46A302]"
            >
              Use My API Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 