import React, { useState } from "react";

interface PromptBarProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
  onNewDrawing: () => void;
}

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
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow-lg">
      <div className="flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What would you like to draw? 🐶 🐱 🌈"
          className="flex-1 text-lg rounded-full px-6 py-3 border-2 border-purple-200 focus:border-purple-400 focus:outline-none"
        />
        <button
          type="submit" // Set the button type to submit
          disabled={isGenerating || !inputValue}
          className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-8 py-3 font-semibold transition-colors disabled:opacity-50"
        >
          {isGenerating ? "Creating..." : "Let's Draw! ✨"}
        </button>
      </div>
    </form>
  );
} 