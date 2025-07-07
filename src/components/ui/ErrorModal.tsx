"use client";

import { motion } from "framer-motion";
import { XCircle, X } from "lucide-react";
import { Button } from "./button";
import { useError } from "@/contexts/ErrorContext";

const FUN_ERROR_MESSAGES = [
    "Whoops! Our digital crayons melted. Please try again in a moment!",
    "Oh no! The storybook pages are stuck together. Give it another go!",
    "Yikes! Our friendly robot artist is taking a nap. Please try again soon!",
    "Our magic paintbrush is out of ink! We're refilling it now. Please try again.",
    "A mischievous gnome is hiding our code. We're on the hunt! Please try again."
];

const getRandomErrorMessage = () => {
    const kidsCount = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
    const funMessages = [
        ...FUN_ERROR_MESSAGES,
        `${kidsCount} other kids are drawing right now, which is causing a bit of a jam. Please try again in a moment! 🎨`,
    ];
    return funMessages[Math.floor(Math.random() * funMessages.length)];
};


export function ErrorModal() {
    const { errorMessage, clearErrorMessage } = useError();
    const isOpen = !!errorMessage;

    if (!isOpen) return null;

    // Use a random fun message if a generic or no message is provided
    const displayMessage = errorMessage === 'DEFAULT_ERROR' 
        ? getRandomErrorMessage() 
        : errorMessage;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={clearErrorMessage}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border-4 border-red-200"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-full">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-red-700">Oops! Something went wrong.</h3>
                    </div>
                    <button
                        onClick={clearErrorMessage}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <p className="text-gray-700 mb-6 text-base">{displayMessage}</p>
                <div className="flex justify-end gap-3">
                    <Button
                        onClick={clearErrorMessage}
                        variant={'destructive'}
                        className="rounded-full font-semibold"
                    >
                        Got it
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
} 