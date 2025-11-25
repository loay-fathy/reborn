"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MixedPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalPrice: number;
    onConfirm: (details: { cash: number; card: number; change: number }) => void;
    // New props to control behavior
    showCash?: boolean;
    showCard?: boolean;
    allowPartial?: boolean;
}

export default function MixedPaymentModal({
    isOpen,
    onClose,
    totalPrice,
    onConfirm,
    showCash = true,
    showCard = true,
    allowPartial = false,
}: MixedPaymentModalProps) {
    const [cashPaid, setCashPaid] = useState("");
    const [cardPaid, setCardPaid] = useState("");

    // Reset inputs when modal opens or visibility props change
    useEffect(() => {
        if (isOpen) {
            setCashPaid("");
            setCardPaid("");
        }
    }, [isOpen, showCash, showCard]);

    const cash = parseFloat(cashPaid) || 0;
    const card = parseFloat(cardPaid) || 0;
    const totalPaid = cash + card;

    const remaining = totalPrice - totalPaid;
    // Change is only applicable if they pay MORE than total
    const change = totalPaid > totalPrice ? totalPaid - totalPrice : 0;

    // Validation Logic:
    // 1. Must pay something (totalPaid > 0)
    // 2. If NOT partial, must pay full amount or more
    // 3. If partial IS allowed, they can pay any amount > 0
    const canConfirm = totalPaid > 0 && (allowPartial || totalPaid >= totalPrice);

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
                        className="fixed inset-0 bg-black/40 z-60"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.45 }}
                        onClick={onClose}
                        className="fixed inset-0 z-70 flex items-center justify-center p-4"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-md p-7 rounded-2xl shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                {allowPartial ? "Payment (Partial Allowed)" : "Payment (Cash + Card)"}
                            </h2>

                            <div className="space-y-5">
                                {/* Total price display */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        {allowPartial ? "Order Total" : "Total Amount"}
                                    </p>
                                    <p className="text-3xl font-bold text-main-color">
                                        ${totalPrice.toFixed(2)}
                                    </p>
                                </div>

                                {/* Cash input - Only show if showCash is true */}
                                {showCash && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cash Paid
                                        </label>
                                        <input
                                            type="number"
                                            value={cashPaid}
                                            onChange={(e) => setCashPaid(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-lg"
                                            placeholder="Enter cash amount"
                                        />
                                    </motion.div>
                                )}

                                {/* Card input - Only show if showCard is true */}
                                {showCard && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Card Paid
                                        </label>
                                        <input
                                            type="number"
                                            value={cardPaid}
                                            onChange={(e) => setCardPaid(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-lg"
                                            placeholder="Enter card amount"
                                        />
                                    </motion.div>
                                )}

                                {/* Payment summary */}
                                {(cashPaid || cardPaid) && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="bg-gray-50 border-2 border-gray-200 p-4 rounded-lg"
                                    >
                                        <p className="text-gray-700 text-sm">Total Paid</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            ${totalPaid.toFixed(2)}
                                        </p>

                                        {remaining > 0 && (
                                            <p className={`text-sm mt-2 ${allowPartial ? "text-orange-600" : "text-red-600"}`}>
                                                Remaining: ${remaining.toFixed(2)}
                                            </p>
                                        )}

                                        {change > 0 && (
                                            <p className="text-sm text-green-600 mt-2">
                                                Change: ${change.toFixed(2)}
                                            </p>
                                        )}
                                    </motion.div>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        disabled={!canConfirm}
                                        onClick={() => {
                                            onConfirm({ cash, card, change });
                                            onClose();
                                        }}
                                        className="flex-1 py-3 text-white font-semibold rounded-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed bg-main-color"
                                    >
                                        Confirm {allowPartial && remaining > 0 ? "Partial" : "Order"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}