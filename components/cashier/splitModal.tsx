"use client";

import React, { useState, useEffect } from "react";
import GenericModal from "@/components/ui/modal";
import Image from "next/image";
import { RotateCcw, Check, CreditCard, Banknote, Calculator, Delete } from "lucide-react";

interface SplitModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalPrice: number;
    onConfirm: (details: { cash: number; card: number; change: number }) => void;
    showCash?: boolean;
    showCard?: boolean;
    allowPartial?: boolean;
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

export default function SplitModal({
    isOpen,
    onClose,
    totalPrice,
    onConfirm,
    showCash = true,
    showCard = true,
    allowPartial = false,
}: SplitModalProps) {
    const [cashGiven, setCashGiven] = useState<number>(0);
    const [inputMode, setInputMode] = useState<'bills' | 'keypad'>('bills');
    const [keypadString, setKeypadString] = useState("");

    useEffect(() => {
        if (isOpen) {
            setCashGiven(0);
            setKeypadString("");
            setInputMode('bills');
        }
    }, [isOpen]);

    const cardAmount = Math.max(0, totalPrice - cashGiven);
    const change = Math.max(0, cashGiven - totalPrice);
    
    // For Split, we usually allow confirmation immediately if Card takes the rest
    const canConfirm = true; 

    // --- Logic ---
    const addMoney = (amount: number) => {
        const newVal = cashGiven + amount;
        setCashGiven(newVal);
        setKeypadString(newVal.toString());
    };

    const handleKeypadPress = (key: string) => {
        let newStr = keypadString;
        if (key === 'BACKSPACE') newStr = newStr.slice(0, -1);
        else if (key === '.') { if (!newStr.includes('.')) newStr += key; }
        else {
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
        onConfirm({
            cash: cashGiven - change,
            card: cardAmount,
            change: change
        });
        onClose();
    };

    const KeyButton = ({ label, value, span = 1 }: { label: React.ReactNode, value: string, span?: number }) => (
        <button
            onClick={() => handleKeypadPress(value)}
            className={`h-20 bg-white border-2 border-gray-200 rounded-xl text-2xl font-bold hover:border-main-color hover:bg-orange-50 active:scale-95 transition-all ${span === 2 ? 'col-span-2' : ''}`}
        >
            {label}
        </button>
    );

    return (
        <GenericModal
            isOpen={isOpen}
            onClose={onClose}
            title="Paiement Mixte / Crédit"
            subtitle=""
            imageSrc={null}
        >
            <div className="flex flex-col md:flex-row h-[550px] gap-4 p-2">
                
                {/* LEFT: Input Area */}
                <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-500 font-bold flex items-center gap-2">
                            {inputMode === 'bills' ? <Banknote size={20}/> : <Calculator size={20}/>}
                            {inputMode === 'bills' ? 'Sélectionner Espèces' : 'Saisie Espèces'}
                        </h3>
                        {/* Toggle */}
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

                    <div className="flex-1 overflow-y-auto">
                        {inputMode === 'bills' ? (
                            <div className="grid grid-cols-2 gap-3">
                                {MONEY_OPTIONS.map((money) => (
                                    <button
                                        key={money.value}
                                        onClick={() => addMoney(money.value)}
                                        className="relative h-20 w-full bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-main-color hover:shadow-md transition-all active:scale-95 flex items-center justify-center"
                                    >
                                        <div className="relative w-full h-full p-1">
                                            <Image 
                                                src={money.img} 
                                                alt={`${money.value} DH`} 
                                                fill
                                                className="object-contain"
                                                sizes="150px"
                                            />
                                        </div>
                                        <span className="absolute bottom-0 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                            {money.value}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
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
                                <KeyButton label={<Delete />} value="BACKSPACE" />
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Display */}
                <div className="w-full md:w-80 flex flex-col gap-4">
                    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-inner font-mono flex flex-col gap-3">
                        <div className="flex justify-between items-end border-b border-gray-700 pb-2">
                            <span className="text-gray-400 text-sm">Total Commande</span>
                            <span className="text-2xl font-bold">{totalPrice.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-orange-400">
                            <span className="flex items-center gap-2 text-sm"><Banknote size={16}/> Espèces:</span>
                            <span className="text-xl">
                                {inputMode === 'keypad' && keypadString === "" ? "0.00" : 
                                 inputMode === 'keypad' ? keypadString : 
                                 cashGiven.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-blue-400">
                            <span className="flex items-center gap-2 text-sm"><CreditCard size={16}/> Carte (Reste):</span>
                            <span className="text-xl font-bold border-b-2 border-blue-400/30">
                                {cardAmount.toFixed(2)}
                            </span>
                        </div>

                        {change > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-700 text-green-500">
                                <div className="flex justify-between text-xs"><span>Monnaie:</span></div>
                                <div className="text-right text-2xl font-bold">{change.toFixed(2)} DH</div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handleReset} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition flex items-center justify-center gap-2">
                            <RotateCcw size={18} /> Reset
                        </button>
                    </div>
                    <div className="flex-grow"></div>

                    <button onClick={handleConfirm} className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg bg-main-color hover:bg-opacity-90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                        <Check size={24} />
                        {allowPartial ? "VALIDER (DÉPÔT)" : "VALIDER"}
                    </button>

                    <button onClick={onClose} className="w-full py-3 rounded-xl border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 transition">
                        Annuler
                    </button>
                </div>
            </div>
        </GenericModal>
    );
}