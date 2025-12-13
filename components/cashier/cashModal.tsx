"use client";

import React, { useState, useEffect } from "react";
import GenericModal from "@/components/ui/modal";
import Image from "next/image";
import { RotateCcw, Check, Calculator, Banknote, Delete, AlignCenter, TextAlignCenter } from "lucide-react";

interface CashPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalPrice: number;
    confirmOrder: (change: number) => void;
}

const MONEY_OPTIONS = [
    { value: 200, img: '/assets/currency/200.png' },
    { value: 100, img: '/assets/currency/100.png' },
    { value: 50,  img: '/assets/currency/50.png' },
    { value: 20,  img: '/assets/currency/20.png' },
    { value: 10,  img: '/assets/currency/10.png' },
    { value: 5,   img: '/assets/currency/5.png' },
    { value: 2,   img: '/assets/currency/2.png' },
    { value: 1,   img: '/assets/currency/1.png' },
];

export default function CashPaymentModal({
    isOpen,
    onClose,
    totalPrice,
    confirmOrder,
}: CashPaymentModalProps) {
    const [cashGiven, setCashGiven] = useState<number>(0);
    // Mode state: 'bills' (images) or 'keypad' (numeric)
    const [inputMode, setInputMode] = useState<'bills' | 'keypad'>('bills');
    // String state to handle decimals correctly in keypad mode (e.g. "10.")
    const [keypadString, setKeypadString] = useState(""); 

    useEffect(() => {
        if (isOpen) {
            setCashGiven(0);
            setKeypadString("");
            setInputMode('bills'); // Default to bills
        }
    }, [isOpen]);

    const remaining = Math.max(0, totalPrice - cashGiven);
    const change = Math.max(0, cashGiven - totalPrice);
    const isPaid = cashGiven >= totalPrice;

    // --- Bill Mode Logic ---
    const addMoney = (amount: number) => {
        const newVal = cashGiven + amount;
        setCashGiven(newVal);
        setKeypadString(newVal.toString());
    };

    // --- Keypad Mode Logic ---
    const handleKeypadPress = (key: string) => {
        let newStr = keypadString;

        if (key === 'BACKSPACE') {
            newStr = newStr.slice(0, -1);
        } else if (key === '.') {
            if (!newStr.includes('.')) newStr += key;
        } else {
            // If it's a number
            if (newStr === "0" && key !== ".") newStr = key;
            else newStr += key;
        }

        setKeypadString(newStr);
        setCashGiven(parseFloat(newStr) || 0);
    };

    const handleReset = () => {
        setCashGiven(0);
        setKeypadString("");
    };

    const handleConfirm = () => {
        if (isPaid) {
            confirmOrder(change);
            onClose();
        }
    };

    // Helper for Keypad Buttons
    const KeyButton = ({ label, value, span = 1 }: { label: React.ReactNode, value: string, span?: number }) => (
        <button
            onClick={() => handleKeypadPress(value)}
            className={`place-items-center h-20 bg-white border-2 border-gray-200 rounded-xl text-2xl font-bold hover:border-main-color hover:bg-orange-50 active:scale-95 transition-all ${span === 2 ? 'col-span-2' : ''}`}
        >
            {label}
        </button>
    );

    return (
        <GenericModal
            isOpen={isOpen}
            onClose={onClose}
            title="Paiement Espèces"
            subtitle=""
            imageSrc={null}
        >
            <div className="flex flex-col md:flex-row h-[550px] gap-4 p-2">
                
                {/* LEFT: Input Area (Bills OR Keypad) */}
                <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col">
                    
                    {/* Toggle Switch */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-500 font-bold flex items-center gap-2">
                            {inputMode === 'bills' ? <Banknote size={20}/> : <Calculator size={20}/>}
                            {inputMode === 'bills' ? 'Sélectionner Billets' : 'Saisie Manuelle'}
                        </h3>
                        <div className="bg-gray-200 p-1 rounded-lg flex gap-1">
                            <button 
                                onClick={() => { setInputMode('bills'); handleReset(); }}
                                className={`p-2 rounded-md transition ${inputMode === 'bills' ? 'bg-white shadow text-main-color' : 'text-gray-500'}`}
                            >
                                <Banknote size={20} />
                            </button>
                            <button 
                                onClick={() => { setInputMode('keypad'); handleReset(); }}
                                className={`p-2 rounded-md transition ${inputMode === 'keypad' ? 'bg-white shadow text-main-color' : 'text-gray-500'}`}
                            >
                                <Calculator size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto">
                        {inputMode === 'bills' ? (
                            <div className="grid grid-cols-2 gap-3">
                                {MONEY_OPTIONS.map((money) => (
                                    <button
                                        key={money.value}
                                        onClick={() => addMoney(money.value)}
                                        className="relative h-24 w-full bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-main-color hover:shadow-md transition-all active:scale-95 flex items-center justify-center"
                                    >
                                        <div className="relative w-full h-full p-2">
                                            <Image 
                                                src={money.img} 
                                                alt={`${money.value} DH`} 
                                                fill
                                                className="object-contain"
                                                sizes="200px"
                                            />
                                        </div>
                                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                            {money.value}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            // NUMERIC KEYPAD
                            <div className="grid grid-cols-3 gap-3 h-full">
                                <KeyButton label="7" value="7" />
                                <KeyButton label="8" value="8" />
                                <KeyButton label="9" value="9" />
                                <KeyButton label="4" value="4" />
                                <KeyButton label="5" value="5" />
                                <KeyButton label="6" value="6" />
                                <KeyButton label="1" value="1" />
                                <KeyButton label="2" value="2" />
                                <KeyButton label="3" value="3" />
                                <KeyButton label="." value="." />
                                <KeyButton label="0" value="0" />
                                <KeyButton label={<Delete className="text-center"/>} value="BACKSPACE" />
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Summary & Actions */}
                <div className="w-full md:w-80 flex flex-col gap-4">
                    
                    {/* Screen Display */}
                    <div className="bg-gray-900 text-green-400 p-6 rounded-xl shadow-inner font-mono text-right flex flex-col gap-1">
                        <div className="text-gray-400 text-sm flex justify-between">
                            <span>Total:</span>
                            <span>{totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="text-gray-400 text-sm flex justify-between border-b border-gray-700 pb-2 mb-2">
                            <span>Reçu:</span>
                            <span className={inputMode === 'keypad' ? "text-white animate-pulse" : ""}>
                                {inputMode === 'keypad' && keypadString === "" ? "0.00" : 
                                 inputMode === 'keypad' ? keypadString : 
                                 cashGiven.toFixed(2)}
                            </span>
                        </div>
                        
                        {isPaid ? (
                            <div className="mt-auto">
                                <span className="text-xs text-green-500 block">Monnaie à rendre</span>
                                <span className="text-4xl font-bold">{change.toFixed(2)} DH</span>
                            </div>
                        ) : (
                             <div className="mt-auto">
                                <span className="text-xs text-red-500 block">Reste à payer</span>
                                <span className="text-4xl font-bold text-red-500">{remaining.toFixed(2)} DH</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={handleReset}
                            className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition flex flex-col items-center justify-center gap-1"
                        >
                            <RotateCcw size={20} />
                            <span className="text-sm">Effacer</span>
                        </button>
                    </div>

                    <div className="flex-grow"></div>

                    <button
                        onClick={handleConfirm}
                        disabled={!isPaid}
                        className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                            isPaid 
                            ? "bg-main-color hover:bg-opacity-90 hover:scale-[1.02]" 
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        <Check size={24} />
                        VALIDER
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 transition"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </GenericModal>
    );
}