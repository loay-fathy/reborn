"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CashModal({ isOpen, onClose, totalPrice, confirmOrder }) {
    const [cashPaid, setCashPaid] = useState("");
    const change = cashPaid ? parseFloat(cashPaid) - totalPrice : 0;

    const handleConfirm = () => {
        if (cashPaid && parseFloat(cashPaid) >= totalPrice) {
            confirmOrder(change);
            setCashPaid("");
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-60"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-0 z-70 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Paiement</h2>

                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Montant Total</p>
                                    <p className="text-3xl font-bold text-indigo-600">
                                        ${totalPrice.toFixed(2)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Espèces Payées
                                    </label>
                                    <input
                                        type="number"
                                        value={cashPaid}
                                        onChange={(e) => setCashPaid(e.target.value)}
                                        placeholder="Entrez le montant"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                                    />
                                </div>

                                {cashPaid && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="bg-green-50 p-4 rounded-lg border-2 border-green-200"
                                    >
                                        <p className="text-sm text-green-700 mb-1">Monnaie</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ${change >= 0 ? change.toFixed(2) : "0.00"}
                                        </p>
                                        {change < 0 && (
                                            <p className="text-sm text-red-600 mt-2">
                                                Montant insuffisant
                                            </p>
                                        )}
                                    </motion.div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        onClick={handleConfirm}
                                        disabled={!cashPaid || parseFloat(cashPaid) < totalPrice}
                                        className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Confirmer la Commande
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
