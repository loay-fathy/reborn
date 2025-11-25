"use client";
import { motion, AnimatePresence } from "framer-motion";

interface CardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function CardModal({ isOpen, onClose, onConfirm }: CardModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-60"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.4 }}
                        onClick={onClose}
                        className="fixed inset-0 z-70 flex items-center justify-center p-4"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white p-10 rounded-xl shadow-xl w-full max-w-sm"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Paiement par Carte
                            </h2>

                            <p className="text-gray-700 text-xl font-semibold mb-6 text-center">
                                Le paiement par carte est-il effectué?
                            </p>

                            <div className="flex gap-3 text-xl">
                                <button
                                    className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                                    onClick={onClose}
                                >
                                    No
                                </button>

                                <button
                                    className="flex-1 py-3 rounded-lg bg-main-color text-white  hover:bg-main-color/80"
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
