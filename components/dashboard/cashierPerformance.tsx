"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { getAuthToken } from "@/lib/auth";

// Define data types
interface CashierData {
  userId: number;
  cashierName: string;
  totalTransactions: number;
  totalSalesValue: number;
  averageSaleValue: number;
}

interface CashierDisplay extends CashierData {
  roleId: string;
  avatar: string;
  status: "Actif" | "Inactif";
}

const CashierPerformance = () => {
  const [cashiers, setCashiers] = useState<CashierDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = getAuthToken();

  useEffect(() => {
    const fetchCashiers = async () => {
      try {
        const res = await fetch("/api/dashboard/cashierperformance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch cashier performance");
        const data: CashierData[] = await res.json();
        // Map API data to display format with French placeholders
        const mappedData: CashierDisplay[] = data.map((item) => ({
          ...item,
          roleId: `Caissier #${item.userId}`,
          avatar: "/images/profile.jpg",
          status: "Actif",
        }));
        setCashiers(mappedData);
      } catch (error) {
        console.error("Error fetching cashier performance:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCashiers();
  }, []);

  return (
    // Padding mobile p-4, desktop md:p-6
    <div className="bg-white p-4 md:p-6 rounded-[20px] shadow-sm border border-gray-100 w-full h-full">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold text-[#1F2937]">Performance des Caissiers</h2>
      </div>

      {/* List of Cashier Cards */}
      <div className="space-y-3 md:space-y-4">
        {isLoading ? (
          <div className="text-center text-secondary-color py-10">Chargement...</div>
        ) : (
          cashiers.map((cashier) => (
            <div
              key={cashier.userId}
              className="bg-[#F9FAFB] p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-50"
            >
              {/* Top Row: Profile & Status */}
              <div className="flex justify-between items-start mb-4 md:mb-5">
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Avatar */}
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl overflow-hidden shadow-sm shrink-0">
                    <Image src={cashier.avatar} alt={cashier.cashierName} fill className="object-cover" />
                  </div>
                  {/* Name & ID */}
                  <div>
                    <h3 className="font-bold text-[#1F2937] text-sm md:text-base">{cashier.cashierName}</h3>
                    <p className="text-gray-400 text-[10px] md:text-xs font-medium">{cashier.roleId}</p>
                  </div>
                </div>
                {/* Status Badge */}
                <div
                  className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold ${cashier.status === "Actif" ? "bg-emerald-100 text-emerald-500" : "bg-gray-100 text-gray-500"}`}
                >
                  {cashier.status}
                </div>
              </div>

              {/* Bottom Row: Stats Grid */}
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {/* Sales Today */}
                <div className="text-left">
                  <p className="text-gray-400 text-[10px] md:text-xs mb-0.5 md:mb-1 font-medium">Ventes Totales</p>
                  <p className="text-[#1F2937] font-bold text-base md:text-lg">${cashier.totalSalesValue.toLocaleString()}</p>
                </div>
                {/* Transactions */}
                <div className="text-center">
                  <p className="text-gray-400 text-[10px] md:text-xs mb-0.5 md:mb-1 font-medium">Transactions</p>
                  <p className="text-[#1F2937] font-bold text-base md:text-lg">{cashier.totalTransactions}</p>
                </div>
                {/* Avg Sale */}
                <div className="text-right">
                  <p className="text-gray-400 text-[10px] md:text-xs mb-0.5 md:mb-1 font-medium">Vente Moy.</p>
                  <p className="text-[#1F2937] font-bold text-base md:text-lg">${cashier.averageSaleValue}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CashierPerformance;
