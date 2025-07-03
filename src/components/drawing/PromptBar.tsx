import React, { useState } from "react";
import type { PromptBarProps } from '@/types'

export function PromptBar({ onSubmit, isGenerating, onNewDrawing }: PromptBarProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (inputValue.trim()) {
      onSubmit(inputValue); // Call the onSubmit function with the input value
      // setInputValue(""); // Clear the input after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg border-[6px] border-[#FFD900]">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What would you like to draw? 🐶 🐱 🌈"
          className="flex-1 text-lg rounded-2xl px-6 py-4 border-4 border-[#E5E5E5] focus:border-[#1CB0F6] focus:outline-none"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        />
        <button
          type="submit" // Set the button type to submit
          disabled={isGenerating || !inputValue}
          className="bg-[#58CC02] hover:bg-[#46A302] text-white rounded-2xl px-8 py-4 font-bold transition-colors disabled:opacity-50 border-b-4 border-[#46A302] text-lg shadow-md"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          {isGenerating ? "Creating..." : "Let's Draw! ✨"}
        </button>
      </div>
    </form>
  );
}