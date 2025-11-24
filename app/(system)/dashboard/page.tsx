"use client";

import React, { useEffect, useState } from "react";
import { Calendar, FileText, Tag } from "lucide-react";
import DataCard from "@/components/dashboard/dataCard";
import TopSellingProducts from "@/components/dashboard/topSelling";
import SalesOverview from "@/components/dashboard/salesOverview";
import CashierPerformance from "@/components/dashboard/cashierPerformance";
import ExpenseRevenueChart from "@/components/dashboard/expenseRevenueChart";
import TopClients from "@/components/dashboard/topClients";
import { ShoppingBag, Users } from "lucide-react";
import NotificationsCard from "@/components/dashboard/alertSection";
import { ReportsModal } from "@/components/dashboard/reportsModal";
import { getAuthToken } from "@/lib/auth";

interface DashboardSummary {
  todaysSales: number;
  todaysTransactions: number;
  salesChangePercentage: number;
  totalClients: number;
  newClientsThisWeek: number;
  clientsChangePercentage: number;
  discountsThisWeek: number;
  totalDiscountTransactions: number;
  discountsChangePercentage: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false)

  const token = getAuthToken();
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/dashboard/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch summary");
        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="flex flex-col gap-10 mt-10 mr-10 sm:mt-20 sm:mr-20">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">
            Dashboard Overview
          </h1>
          <h3 className="text-lg md:text-xl text-secondary-color">
            Welcome back! Here&apos;s what is happening today.
          </h3>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button className="bg-main-color rounded-xl h-fit text-white font-semibold flex gap-2 p-3 cursor-pointer hover:bg-opacity-90 transition-opacity" onClick={() => setIsReportsModalOpen(true)}>
            <FileText size={20} />
            <span className="whitespace-nowrap">Download Report</span>
          </button>

        </div>
      </section>
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
        <DataCard
          title="Today's Sales"
          value={summary ? formatCurrency(summary.todaysSales) : "Loading..."}
          countText={
            summary
              ? `${summary.todaysTransactions} orders completed`
              : "Loading..."
          }
          percentage={summary?.salesChangePercentage || 0}
          isPositive={(summary?.salesChangePercentage || 0) >= 0}
          icon={ShoppingBag}
        />
        <DataCard
          title="Total Customers"
          value={summary ? summary.totalClients.toString() : "Loading..."}
          countText={
            summary
              ? `${summary.newClientsThisWeek} new this week`
              : "Loading..."
          }
          percentage={summary?.clientsChangePercentage || 0}
          isPositive={(summary?.clientsChangePercentage || 0) >= 0}
          icon={Users}
        />
        <DataCard
          title="Discounts This Week"
          value={
            summary ? formatCurrency(summary.discountsThisWeek) : "Loading..."
          }
          countText={
            summary
              ? `${summary.totalDiscountTransactions} transactions`
              : "Loading..."
          }
          percentage={summary?.discountsChangePercentage || 0}
          isPositive={(summary?.discountsChangePercentage || 0) >= 0}
          icon={Tag}
        />
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        <SalesOverview />
        <TopSellingProducts />
        <ExpenseRevenueChart />
        <CashierPerformance />
      </section>
      <section className="grid grid-cols-1 h-[calc(100vh-30rem)] lg:grid-cols-3 gap-6 lg:gap-10">
        <TopClients />
        <NotificationsCard />
      </section>
      <ReportsModal isOpen={isReportsModalOpen} onClose={() => setIsReportsModalOpen(false)} />
    </div>
  );
}
