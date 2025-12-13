"use client";

import React from "react";
import GenericModal from "@/components/ui/modal";
import { Check, CreditCard, Terminal } from "lucide-react";

interface CardModalProps {
    isOpen: boolean;
    onClose: () => void;
    // --- ADD THIS LINE ---
    totalAmount: number; 
    // --------------------
    onConfirm: () => void;
}

// Update component signature to destructure totalAmount
export default function CardModal({ 
    isOpen, 
    onClose, 
    totalAmount, // <-- Make sure to accept it here
    onConfirm 
}: CardModalProps) {

    return (
        <GenericModal
            isOpen={isOpen}
            onClose={onClose}
            title="Paiement Carte Bancaire"
            subtitle=""
            imageSrc={null}
        >
            <div className="flex flex-col gap-6 p-4 max-w-md mx-auto">
                
                {/* Instruction */}
                <div className="text-center text-gray-600 font-medium flex flex-col items-center gap-2">
                    <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-2">
                        <Terminal size={40} />
                    </div>
                    <p>Veuillez saisir ce montant sur le terminal de paiement (TPE)</p>
                </div>

                {/* Display Screen */}
                <div className="bg-gray-900 text-white p-6 rounded-xl shadow-inner font-mono text-center flex flex-col gap-2">
                    <span className="text-gray-400 text-sm uppercase tracking-wider">Montant à Payer</span>
                    <div className="flex items-center justify-center gap-3">
                        <CreditCard className="text-blue-400" size={28} />
                        {/* Display the amount */}
                        <span className="text-4xl font-bold">{totalAmount.toFixed(2)} DH</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 mt-2">
                    <button
                        onClick={onConfirm}
                        className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        <Check size={24} />
                        TRANSACTION RÉUSSIE
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 transition"
                    >
                        Annuler / Échec
                    </button>
                </div>
            </div>
        </GenericModal>
    );
}