'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Share2, Copy, Twitter, MessageCircle, Home, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Loader } from "@/components/ui/loader";
import Link from 'next/link';

export default function SharePage({ params }: { params: { id: string } }) {
  const [imageData, setImageData] = useState<{
    image_data: string;
    drawing_name: string;
    created_at: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const { data, error } = await supabase
          .from('user_images')
          .select('image_data, drawing_name, created_at')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setImageData(data);
      } catch (err) {
        console.error('Error fetching image:', err);
        setError('Failed to load image');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [params.id]);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error || !imageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-red-500 mb-2">Oops! Magic Gone Wrong!</h1>
          <p className="text-gray-600">{error || 'This masterpiece seems to be playing hide and seek!'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:scale-105 transition-transform"
          >
            Let's Make Your Own Magic! ✨
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50 py-12 px-4">
   
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
              {imageData.drawing_name}
            </h1>
            
            <div className="relative aspect-video mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200 rounded-2xl transform -rotate-1"></div>
              <img
                src={imageData.image_data}
                alt={imageData.drawing_name}
                className="relative w-full h-full object-contain rounded-xl transform rotate-1 hover:rotate-0 transition-transform duration-300"
              />
            </div>

            <div className="text-center mb-8">
              <p className="text-lg text-gray-600 font-medium" style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}>
                Pinky promise, your friend made this masterpiece! 🎨
              </p>
              <p className="text-purple-600 text-xl font-bold mt-2" style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}>
                And guess what? You can create magic too! ✨
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <motion.button
                onClick={handleCopyLink}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-6 py-3 flex items-center gap-2 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                <Copy className="w-5 h-5" />
                Copy Link
              </motion.button>
              <motion.a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  'Check out my drawing! 🎨'
                )}&url=${encodeURIComponent(
                  `${window.location.origin}/share/draw/${params.id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full px-6 py-3 flex items-center gap-2 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                <Twitter className="w-5 h-5" />
                Share on Twitter
              </motion.a>
              <motion.a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out my drawing! 🎨 ${window.location.origin}/share/draw/${params.id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full px-6 py-3 flex items-center gap-2 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                <MessageCircle className="w-5 h-5" />
                Share on WhatsApp
              </motion.a>
            </div>

            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/draw')}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                ✨ Start Your Magical Drawing! ✨
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 