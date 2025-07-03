"use client";

import { motion } from 'framer-motion';

interface Version {
  image: string;
  prompt?: string;
  type: 'drawn' | 'generated' | 'colorized';
}

interface VersionHistoryProps {
  versionHistory: Version[];
}

export const VersionHistory = ({ versionHistory }: VersionHistoryProps) => (
  <div className="mt-8 p-4 bg-white rounded-2xl shadow-md border-4 border-[#FFD900]">
    <h3
      className="text-lg font-bold mb-4 text-[#8549BA]"
      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
    >
      Version History
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {versionHistory.map((version, index) => (
        <div key={index} className="relative bg-[#FFF9E5] p-3 rounded-xl border-2 border-[#FFD900]">
          <img
            src={version.image || "/placeholder.svg"}
            alt={`Version ${index + 1}`}
            style={{ filter: 'none' }}
            className="w-full h-32 object-contain mb-2"
          />

          <div
            className="text-center mt-1 text-sm text-[#4B4B4B] font-medium"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            "{version.prompt}"
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#58CC02] text-white rounded-full flex items-center justify-center text-xs font-bold">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  </div>
); 