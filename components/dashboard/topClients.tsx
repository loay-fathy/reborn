"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import OvalLine from "../ui/ovalLine"; // Ensure this path is correct

// --- Types & Mock Data ---

interface ClientData {
  customerId: number;
  customerName: string;
  totalSpent: number;
  totalOrders: number;
  outstandingBalance: number;
}

const TopClients = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    avgSpend: 0,
    avgOrders: 0,
    totalOutstanding: 0,
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/dashboard/topclients?count=4");
        if (!res.ok) throw new Error("Failed to fetch top clients");
        const data: ClientData[] = await res.json();
        setClients(data);

        // Calculate stats
        if (data.length > 0) {
          const totalSpent = data.reduce((acc, client) => acc + client.totalSpent, 0);
          const totalOrders = data.reduce((acc, client) => acc + client.totalOrders, 0);
          const totalOutstanding = data.reduce((acc, client) => acc + client.outstandingBalance, 0);

          setStats({
            avgSpend: totalSpent / data.length,
            avgOrders: Math.round(totalOrders / data.length),
            totalOutstanding: totalOutstanding,
          });
        }
      } catch (error) {
        console.error("Error fetching top clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    // Responsive padding: p-4 on mobile, p-8 on desktop
    <div className="w-full bg-white col-span-1 lg:col-span-2 p-4 md:p-8 rounded-[20px] border border-gray-100">
      {/* --- Header --- */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-[#111827]">
          Top Clients & Spending
        </h2>
      </div>

      {/* --- Stats Row --- */}
      {/* Stacks on mobile (grid-cols-1), 3 columns on tablet/desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-13">
        {/* Card 1 */}
        <div className="bg-[#F9FAFB] rounded-xl p-4 md:p-5 flex flex-col items-center justify-center gap-1">
          <span className="text-secondary-color font-medium text-xs md:text-sm">
            Avg Spend per Client
          </span>
          <span className="text-xl md:text-2xl font-bold text-[#111827]">
            {isLoading ? "..." : formatCurrency(stats.avgSpend)}
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-[#F9FAFB] rounded-xl p-4 md:p-5 flex flex-col items-center justify-center gap-1">
          <span className="text-secondary-color font-medium text-xs md:text-sm">
            Avg Orders per Client
          </span>
          <span className="text-xl md:text-2xl font-bold text-green-500">
            {isLoading ? "..." : stats.avgOrders}
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-[#F9FAFB] rounded-xl p-4 md:p-5 flex flex-col items-center justify-center gap-1">
          <span className="text-secondary-color font-medium text-xs md:text-sm">
            Total Outstanding
          </span>
          <span className="text-xl md:text-2xl font-bold text-red-500">
            {isLoading ? "..." : formatCurrency(stats.totalOutstanding)}
          </span>
        </div>
      </div>

      {/* --- Table Section --- */}
      {/* overflow-x-auto enables horizontal scroll on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left border-b border-transparent">
              <th className="pb-4 font-semibold text-secondary-color text-sm md:text-base">
                Client
              </th>
              <th className="pb-4 font-semibold text-secondary-color text-sm md:text-base">
                Total Spent
              </th>
              {/* Discount column removed as per plan */}
              <th className="pb-4 font-semibold text-secondary-color text-sm md:text-base">
                Orders
              </th>
              <th className="pb-4 font-semibold text-secondary-color text-sm md:text-base">
                Outstanding
              </th>
            </tr>
            <tr>
              <th colSpan={4}>
                <OvalLine className="h-0.5 w-full" />
              </th>
            </tr>
          </thead>
          <tbody className="text-[#111827]">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-secondary-color">Loading...</td>
              </tr>
            ) : (
              clients.map((client, index) => (
                <tr
                  key={client.customerId}
                  className={`group ${index !== clients.length - 1 ? "border-b border-gray-50" : ""
                    }`}
                >
                  {/* Client Name & Avatar */}
                  <td className="py-3 md:py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-gray-100 shrink-0">
                        <Image
                          src="/images/profile.jpg" // Placeholder
                          alt={client.customerName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-sm md:text-base whitespace-nowrap">
                        {client.customerName}
                      </span>
                    </div>
                  </td>

                  {/* Total Spent */}
                  <td className="py-3 md:py-4 align-middle font-bold text-sm md:text-base">
                    {formatCurrency(client.totalSpent)}
                  </td>

                  {/* Orders */}
                  <td className="py-3 md:py-4 align-middle font-medium text-sm md:text-base">
                    {client.totalOrders}
                  </td>

                  {/* Outstanding */}
                  <td className="py-3 md:py-4 align-middle font-semibold text-sm md:text-base">
                    {formatCurrency(client.outstandingBalance)}
                  </td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopClients;
