'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Share2, Copy, Twitter, MessageCircle, Home, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Loader } from "@/components/ui/loader";
import Link from 'next/link';

interface LearningData {
  images: string[];
  drawing_name: string;
  created_at: string;
}

export default function ShareLearnPage({ params }: { params: { id: string } }) {
  const [learningData, setLearningData] = useState<LearningData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLearning = async () => {
      try {
        const { data, error } = await supabase
          .from('user_learnings')
          .select('images, drawing_name, created_at')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        
        // Add back the data URL prefix to each image
        const processedData = {
          ...data,
          images: data.images.map((img: string) => `data:image/png;base64,${img}`)
        };
        
        setLearningData(processedData);
      } catch (err) {
        console.error('Error fetching learning:', err);
        setError('Failed to load drawing steps');
      } finally {
        setLoading(false);
      }
    };

    fetchLearning();
  }, [params.id]);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error || !learningData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-red-500 mb-2">Oops! Magic Gone Wrong!</h1>
          <p className="text-gray-600">{error || 'These drawing steps seem to be playing hide and seek!'}</p>
          <button
            onClick={() => router.push('/learn')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:scale-105 transition-transform"
          >
            Let's Learn to Draw! ✨
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50">
     

      {/* Main Content */}
      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-purple-200"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200 rounded-full -mr-16 -mt-16 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200 rounded-full -ml-12 -mb-12 opacity-20"></div>
            
            <div className="relative p-8">
              <div className="absolute top-4 right-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <span className="text-3xl">✨</span>
                </motion.div>
              </div>

              <h1 
                className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 text-transparent bg-clip-text"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                {learningData.drawing_name}
              </h1>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {learningData.images.map((image, index) => (
                  <motion.div
                    key={index}
                    className="relative aspect-video cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200 rounded-xl transform ${currentStep === index ? 'scale-105' : 'scale-100'} transition-transform`}></div>
                    <img
                      src={image}
                      alt={`Step ${index + 1}`}
                      className="relative w-full h-full object-contain rounded-lg p-2"
                    />
                    <div className="absolute bottom-2 right-2 bg-white/80 rounded-full px-2 py-1 text-sm font-medium text-purple-600">
                      Step {index + 1}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="relative aspect-video mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200 rounded-2xl transform -rotate-1"></div>
                <img
                  src={learningData.images[currentStep]}
                  alt={`Step ${currentStep + 1}`}
                  className="relative w-full h-full object-contain rounded-xl transform rotate-1 hover:rotate-0 transition-transform duration-300 p-4"
                />
              </div>

              <div className="text-center mb-8">
                <p className="text-lg text-gray-600 font-medium" style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}>
                ✨ Watch this {learningData.drawing_name} go from doodles to WOW! 🎨
                </p>
                <p className="text-purple-600 text-xl font-bold mt-2" style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}>
                Want to make your own masterpiece? Let's have some fun! 🎉 ✨
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    await navigator.clipboard.writeText(window.location.href);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-shadow"
                >
                  <Copy className="w-5 h-5" />
                  Share the Magic
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Check out these magical drawing steps! ✨')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-[#1DA1F2] text-white rounded-full hover:shadow-lg transition-shadow"
                >
                  <Twitter className="w-5 h-5" />
                  Tweet the Magic
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`https://wa.me/?text=${encodeURIComponent(`✨ Look at these magical drawing steps! ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full hover:shadow-lg transition-shadow"
                >
                  <MessageCircle className="w-5 h-5" />
                  Share on WhatsApp
                </motion.a>
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/learn')}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow"
                  style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                  ✨ Start Learning to Draw! ✨
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 