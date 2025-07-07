"use client";
import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Pencil } from 'lucide-react';

interface EditNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
  currentName: string;
}

export const EditNameModal = ({ isOpen, onClose, onSave, currentName }: EditNameModalProps) => {
  const [localName, setLocalName] = useState(currentName);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (localName.trim()) {
      onSave(localName.trim());
      onClose();
    }
  };

  const handleClose = () => {
    setLocalName(currentName); // Reset to original name
    onClose();
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
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8549BA] rounded-full">
              <Pencil className="w-5 h-5 text-white" />
            </div>
            <h3
              className="text-xl font-bold text-[#4B4B4B]"
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            >
              Edit Drawing Name
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-[#4B4B4B] mb-2">
            Give your drawing a name:
          </label>
          <input
            type="text"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="Enter drawing name..."
            className="w-full px-4 py-3 border-4 border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#8549BA] mb-6"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            autoFocus
            maxLength={50}
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-[#4B4B4B] border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] rounded-xl transition-colors font-bold"
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!localName.trim()}
              className="px-4 py-2 bg-[#8549BA] text-white rounded-xl hover:bg-[#7038A8] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-bold border-b-2 border-[#7038A8]"
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            >
              Save Name
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}; 