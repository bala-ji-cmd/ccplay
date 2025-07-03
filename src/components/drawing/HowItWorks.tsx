"use client";

import { motion } from 'framer-motion';
import { Pencil, SendHorizontal, Sparkles, Palette } from 'lucide-react';

export const HowItWorks = () => (
  <section className="bg-[#FFF9E5] py-12 px-4 sm:px-6 mt-8 rounded-2xl border-4 border-[#FFD900]">
    <div className="max-w-5xl mx-auto">
      <h2
        className="text-3xl font-bold text-center mb-8 text-[#8549BA]"
        style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
      >
        Let's Make Awesome Art Together! 🎨
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Step 1 */}
        <div className="text-center bg-white p-6 rounded-2xl border-4 border-[#FFD900] shadow-md">
          <div className="bg-[#E5FFC2] w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-[#58CC02]">
            <Pencil className="w-10 h-10 text-[#58CC02]" />
          </div>
          <h3
            className="font-bold text-lg mb-2 text-[#58CC02]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            First, You Draw!
          </h3>
          <p className="text-[#4B4B4B]">
            Use your finger or mouse to draw anything you like on the big white space. Go wild with your ideas!
          </p>
        </div>

        {/* Step 2 */}
        <div className="text-center bg-white p-6 rounded-2xl border-4 border-[#FFD900] shadow-md">
          <div className="bg-[#E5F8FF] w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-[#1CB0F6]">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <SendHorizontal className="w-10 h-10 text-[#1CB0F6]" />
            </motion.div>
          </div>
          <h3
            className="font-bold text-lg mb-2 text-[#1CB0F6]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Tell the Computer What to Add!
          </h3>
          <p className="text-[#4B4B4B]">
            Type what you want to add in the box and watch as your ideas come to life!
          </p>
        </div>

        {/* Step 3 */}
        <div className="text-center bg-white p-6 rounded-2xl border-4 border-[#FFD900] shadow-md">
          <div className="bg-[#F9E9FF] w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-[#8549BA]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-10 h-10 text-[#8549BA]" />
            </motion.div>
          </div>
          <h3
            className="font-bold text-lg mb-2 text-[#8549BA]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Watch the Magic Happen!
          </h3>
          <p className="text-[#4B4B4B]">
            Press the green arrow and see your drawing transform with AI magic!
          </p>
        </div>

        {/* Step 4 */}
        <div className="text-center bg-white p-6 rounded-2xl border-4 border-[#FFD900] shadow-md">
          <div className="bg-[#FFF1E5] w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-[#FF9600]">
            <Palette className="w-10 h-10 text-[#FF9600]" />
          </div>
          <h3
            className="font-bold text-lg mb-2 text-[#FF9600]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Make it Colorful!
          </h3>
          <p className="text-[#4B4B4B]">
            Click the Colorize button to fill your drawing with magical colors!
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <motion.div
          className="inline-block"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-[#58CC02] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#46A302] transition-all border-b-4 border-[#46A302] shadow-lg"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Start Drawing Now! ✨
          </button>
        </motion.div>
      </div>

      <div className="mt-8 text-center">
        <p
          className="text-sm bg-[#FFF9E5] inline-block px-4 py-2 rounded-full border-2 border-[#FFD900] font-bold text-[#4B4B4B]"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          You can make up to 5 changes and then add colors to create your masterpiece!
        </p>
      </div>
    </div>
  </section>
); 