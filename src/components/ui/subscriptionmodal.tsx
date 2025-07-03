import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';


export const SubscriptionModal = ({message, onClose}: {message: string, onClose: () => void}) => {
    const router = useRouter(); // Initialize the router here
    return (
         // Add subscription modal

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="bg-white rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 
          className="text-2xl font-bold mb-4 text-center"
          style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
        >
          Ready to Create More Magic? ✨
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          {message}
        </p>
        <div className="space-y-4">
          <button
            onClick={() => router.push('/pricing')}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-lg transition-shadow"
          >
            View Pricing Plans 🎨
          </button>
          <button
            onClick={onClose}    
            className="w-full py-3 border border-gray-200 rounded-full hover:bg-gray-50"
          >
            Go to Home
          </button>
        </div>
      </div>
    </motion.div>
  );
    
}