"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose }) => {
    // Animation variants for the backdrop
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    // Animation variants for the modal card
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 10 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 25 }
        },
        exit: { opacity: 0, scale: 0.95, y: 10 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={overlayVariants}
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-[2.5rem]"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                    >
                        <div className="p-8 pt-10">
                            <form className="flex flex-col gap-6">
                                {/* Input Group */}
                                <div className="space-y-5">
                                    {/* Description Row */}
                                    <div className="flex items-center justify-between">
                                        <label className="text-lg font-medium text-black">
                                            Description
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Your Description"
                                            className="text-right text-gray-400 placeholder:text-gray-400 focus:outline-none bg-transparent w-1/2"
                                        />
                                    </div>

                                    {/* Paid Row */}
                                    <div className="flex items-center justify-between">
                                        <label className="text-lg font-medium text-black">
                                            Paid
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Your Paid"
                                            className="text-right text-gray-400 placeholder:text-gray-400 focus:outline-none bg-transparent w-1/2"
                                        />
                                    </div>

                                    {/* Category Row */}
                                    <div className="flex items-center justify-between cursor-pointer group">
                                        <label className="text-lg font-medium text-black">
                                            Category
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">Select</span>
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#C2782F] text-white transition-transform group-hover:scale-110">
                                                <ChevronDown size={16} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-gray-100 my-2" />

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        className="flex-1 bg-[#C2782F] hover:bg-[#a66526] text-white font-semibold py-3.5 px-6 rounded-2xl transition-colors text-lg shadow-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 bg-black hover:bg-gray-900 text-white font-semibold py-3.5 px-6 rounded-2xl transition-colors text-lg shadow-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};