"use client";
import React, { useState, useEffect } from "react";
import SpendingAreaChart from "@/components/areaChart";
import { getAuthToken } from "@/lib/auth";

interface SalesData {
  label: string;
  totalSales: number;
}

const SalesOverview = () => {
  const [activeTab, setActiveTab] = useState("Week");
  const [chartData, setChartData] = useState<{ day: string; amount: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = getAuthToken();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/dashboard/salesovertime/?period=${activeTab}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch sales data");
        const data: SalesData[] = await res.json();

        // Map API data to chart format
        // Assuming API returns { label: "Mon", totalSales: 100 }
        // Chart expects { day: "Mon", amount: 100 }
        const mappedData = data.map(item => ({
          day: item.label,
          amount: item.totalSales
        }));
        setChartData(mappedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const brandColor = "#C08B5C";

  return (
    // 1. Reduced padding on mobile (p-4) -> larger on desktop (md:p-8)
    <div className="w-full bg-white p-4 md:p-8 rounded-[20px] shadow-sm">
      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
        {/* Title & Subtitle */}
        <div>
          {/* 2. Text scales slightly smaller on mobile */}
          <h2 className="text-xl md:text-2xl font-bold text-[#111827]">
            Aperçu des Ventes
          </h2>
          <p className="text-secondary-color text-sm mt-1">
            Tendances de revenus au cours de la dernière {activeTab === "Week" ? "semaine" : activeTab === "Month" ? "mois" : "année"}
          </p>
        </div>

        {/* Toggle Buttons */}
        {/* 3. Container is full width on mobile (w-full), auto on desktop */}
        <div className="flex items-center bg-[#F3F4F6] p-1 rounded-2xl w-full sm:w-auto">
          {["Semaine", "Mois", "Année"].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(["Week", "Month", "Year"][index])}
              // 4. Buttons are flex-1 (equal width) on mobile, normal size on desktop
              // 5. Reduced padding (px-3) on mobile
              className={`flex-1 sm:flex-none px-3 md:px-6 py-2 text-sm font-medium rounded-2xl transition-all duration-200 outline-none cursor-pointer text-center ${["Week", "Month", "Year"][index] === activeTab
                ? "bg-main-color text-white shadow-sm"
                : "text-secondary-color hover:text-gray-700 hover:bg-gray-200"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- Chart Section --- */}
      {/* 6. Slightly shorter chart on mobile to save vertical space */}
      <div className="h-[250px] md:h-[300px] w-full relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <span className="text-main-color font-semibold">Chargement...</span>
          </div>
        )}
        <SpendingAreaChart
          data={chartData}
          xAxisKey="day"
          color={brandColor}
        />
      </div>
    </div>
  );
};

export default SalesOverview;
