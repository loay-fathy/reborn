"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FinancialData {
  label: string;
  revenue: number;
  expenses: number;
  profit: number;
}

const ExpenseRevenueChart = () => {
  const [activeTab, setActiveTab] = useState("Month");
  const [chartData, setChartData] = useState<{ name: string; revenue: number; expense: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/dashboard/financialstats?period=${activeTab}`);
        if (!res.ok) throw new Error("Failed to fetch financial stats");
        const data: FinancialData[] = await res.json();

        // Map API data to chart format
        // API returns { label: "Week 3", revenue: 0, expenses: 0, profit: 0 }
        // Chart expects { name: "Week 3", revenue: 0, expense: 0 }
        const mappedData = data.map(item => ({
          name: item.label,
          revenue: item.revenue,
          expense: item.expenses
        }));
        setChartData(mappedData);
      } catch (error) {
        console.error("Error fetching financial stats:", error);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Colors
  const colors = {
    revenue: "#C08B5C", // Brown
    expense: "#E5E7EB", // Light Gray
    text: "#9CA3AF", // Gray-400
    grid: "#F3F4F6", // Gray-100
  };

  // Custom Y-Axis Tick Formatter ($0k - $25k)
  const formatYAxis = (value: number) => {
    if (value === 0) return "$0k";
    return `$${value / 1000}k`;
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 rounded-xl shadow-lg">
          <p className="text-gray-900 font-bold mb-2">{label}</p>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#C08B5C]"></div>
            <span className="text-sm text-gray-600">
              Revenue:{" "}
              <span className="font-semibold">
                ${payload[0].value.toLocaleString()}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#E5E7EB]"></div>
            <span className="text-sm text-gray-600">
              Expenses:{" "}
              <span className="font-semibold">
                ${payload[1].value.toLocaleString()}
              </span>
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    // Changed padding to be smaller on mobile (p-4)
    <div className="w-full bg-white p-4 md:p-8 rounded-[20px] shadow-sm border border-gray-100 relative">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#111827]">
            Expense vs Revenue
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Financial balance overview
          </p>
        </div>

        {/* Toggle Buttons */}
        {/* Container is full width on mobile */}
        <div className="flex items-center bg-[#F9FAFB] p-1 rounded-xl w-full md:w-auto">
          {["Week", "Month", "Year"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              // Buttons share equal width (flex-1) on mobile for better touch targets
              className={`flex-1 md:flex-none px-3 md:px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-center ${activeTab === tab
                ? "bg-[#C08B5C] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- Custom Legend --- */}
      <div className="flex justify-end gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#C08B5C]"></div>
          <span className="text-sm font-medium text-gray-500">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#E5E7EB]"></div>
          <span className="text-sm font-medium text-gray-500">Expenses</span>
        </div>
      </div>

      {/* --- Chart Section --- */}
      {/* Height adjusts: 300px on mobile, 350px on desktop */}
      <div className="h-[250px] md:h-[250px] w-full relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <span className="text-main-color font-semibold">Loading...</span>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke={colors.grid}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.text, fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.text, fontSize: 12 }}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={<CustomTooltip />}
            />

            {/* Revenue Bar - using maxBarSize for better responsiveness */}
            <Bar
              dataKey="revenue"
              fill={colors.revenue}
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />

            {/* Expense Bar */}
            <Bar
              dataKey="expense"
              fill={colors.expense}
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseRevenueChart;
