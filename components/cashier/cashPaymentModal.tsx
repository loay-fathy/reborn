"use client";

import React, { useState, useEffect } from "react";
import GenericModal from "@/components/ui/modal";
import { Coins } from "lucide-react";

interface CashPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    onConfirm: (cashGiven: number, change: number) => void;
}

export default function CashPaymentModal({
    isOpen,
    onClose,
    totalAmount,
    onConfirm,
}: CashPaymentModalProps) {
    const [cashGiven, setCashGiven] = useState<string>("");
    const [change, setChange] = useState<number>(0);

    useEffect(() => {
        if (isOpen) {
            setCashGiven("");
            setChange(0);
        }
    }, [isOpen]);

    const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCashGiven(value);

        const cash = parseFloat(value);
        if (!isNaN(cash)) {
            setChange(cash - totalAmount);
        } else {
            setChange(0 - totalAmount);
        }
    };

    const handleConfirm = () => {
        const cash = parseFloat(cashGiven);
        if (!isNaN(cash) && cash >= totalAmount) {
            onConfirm(cash, change);
            onClose();
        }
    };

    const isValid = !isNaN(parseFloat(cashGiven)) && parseFloat(cashGiven) >= totalAmount;

    return (
        <GenericModal
            isOpen={isOpen}
            onClose={onClose}
            title="Cash Payment"
            subtitle="Enter the amount received from the customer"
            imageSrc="/icons/cashIcon.svg" // Assuming you might have an icon or use a default
        >
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold text-gray-700">Total Amount</label>
                    <div className="text-3xl font-bold text-main-color">${totalAmount.toFixed(2)}</div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold text-gray-700">Cash Given</label>
                    <div className="relative">
                        <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="number"
                            value={cashGiven}
                            onChange={handleCashChange}
                            placeholder="0.00"
                            className="w-full pl-10 pr-4 py-3 text-xl border-2 border-gray-200 rounded-xl focus:border-main-color focus:outline-none transition-colors"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold text-gray-700">Change</label>
                    <div className={`text-2xl font-bold ${change >= 0 ? "text-green-600" : "text-red-500"}`}>
                        ${change.toFixed(2)}
                    </div>
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!isValid}
                        className={`flex-1 py-3 px-6 rounded-xl text-white font-bold transition-colors ${isValid ? "bg-main-color hover:bg-opacity-90" : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        Confirm Payment
                    </button>
                </div>
            </div>
        </GenericModal>
    );
}
