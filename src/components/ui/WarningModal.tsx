import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./button";
import type { Action, WarningModalProps } from '@/types'

export function WarningModal({ isOpen, onClose, message, actions = [] }: WarningModalProps) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl"
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Warning</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    {actions.map((action, index) => (
                        <Button
                            key={index}
                            onClick={action.onClick}
                            variant={action.variant || 'default'}
                            className="rounded-full"
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
} 