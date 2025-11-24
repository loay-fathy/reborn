"use client";
import Transactions from "@/components/premiumClients/clientInfo/transactions";
// Adjust the import path based on where you saved the file in step 1
import SpendingAreaChart from "@/components/areaChart";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getAuthToken } from "@/lib/auth";

interface CustomerData {
  id: number;
  name: string;
  phoneNumber: string;
  discountPercentage: number;
  isActive: boolean;
  imageUrl: string | null;
  createdAt: string;
  totalSpent: number;
  totalDiscount: number;
  outstandingBalance: number;
  hasPendingPayments: boolean;
  monthlySpending: Array<{ month: string; amount: number }>;
  paymentMethods: Array<{ method: string; count: number }>;
  transactions: Array<{
    saleId: number;
    date: string;
    itemsSummary: string;
    total: number;
    discount: number;
    paid: number;
    change: number;
    paymentType: string;
  }>;
}

interface CustomerStats {
  label: string;
  value: string;
  valueColor: string;
}

interface CustomerCardProps {
  name: string;
  avatarSrc: string;
  phone: string;
  discountRate: string;
  status: "Active" | "Inactive";
  paymentStatus?: string;
  stats: CustomerStats[];
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  name,
  avatarSrc,
  phone,
  discountRate,
  status,
  paymentStatus,
  stats,
}) => {
  return (
    <div className="w-full bg-white p-5 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      {/* --- LEFT SECTION: Profile Info --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full lg:w-auto">
        <div className="relative shrink-0">
          <div className=" rounded-2xl border-[3px] border-[#B57B3F]">
            <Image
              src={avatarSrc}
              alt={name}
              width={80}
              height={80}
              className="rounded-xl object-cover aspect-square"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
                }`}
            >
              {status}
            </span>
            {paymentStatus && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-[#C06014]">
                {paymentStatus}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-gray-500 font-medium">
            <span>{discountRate}</span>
            <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></span>{" "}
            <span>{phone}</span>
          </div>
        </div>
      </div>

      {/* --- RIGHT SECTION: Financial Stats --- */}
      <div className="flex flex-wrap md:flex-nowrap gap-8 lg:gap-12 w-full lg:w-auto justify-start lg:justify-end border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col gap-1">
            <span className="text-gray-500 font-medium text-sm lg:text-base">
              {stat.label}
            </span>
            <span
              className={`text-xl lg:text-2xl font-extrabold ${stat.valueColor}`}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface TooltipPayload {
  value: number;
  [key: string]: unknown;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 border border-gray-200 rounded shadow-sm">
        <p className="text-sm font-medium">{`$${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function PremiumClientPage() {
  const params = useParams();
  const id = params?.id as string;
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const token = getAuthToken();
        const response = await fetch(`/api/customers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch customer data");
        }

        const data = await response.json();
        setCustomerData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="mt-20 mr-20 flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">loading...</div>
      </div>
    );
  }

  if (error || !customerData) {
    return (
      <div className="mt-20 mr-20 flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-red-600">
          {error || "Failed to load customer data"}
        </div>
      </div>
    );
  }

  // Prepare monthly spending data
  const monthlyData = customerData.monthlySpending.map((item) => ({
    month: item.month,
    amount: item.amount,
  }));

  // Prepare payment methods data
  const paymentData = customerData.paymentMethods.map((item, index) => {
    const colors = ["#10b981", "#3b82f6", "#f59e0b"];
    return {
      name: item.method,
      value: item.count,
      color: colors[index % colors.length],
    };
  });

  // Calculate if there are unpaid transactions
  const hasUnpaidTransactions = customerData.transactions.some(
    (t) => t.paid < t.total - t.discount
  );

  return (
    <div className="mt-20 mr-20 flex flex-col gap-8">
      <CustomerCard
        name={customerData.name}
        avatarSrc={customerData.imageUrl || "/images/profile.jpg"}
        phone={customerData.phoneNumber}
        discountRate={`${customerData.discountPercentage}% Discount`}
        status={customerData.isActive ? "Active" : "Inactive"}
        paymentStatus={
          customerData.hasPendingPayments || hasUnpaidTransactions
            ? "Pending Payments"
            : undefined
        }
        stats={[
          {
            label: "Total Spent",
            value: formatCurrency(customerData.totalSpent),
            valueColor: "text-[#8B5E3C]",
          },
          {
            label: "Total Discount",
            value: formatCurrency(customerData.totalDiscount),
            valueColor: "text-green-600",
          },
          {
            label: "Outstanding",
            value: formatCurrency(customerData.outstandingBalance),
            valueColor: "text-red-600",
          },
        ]}
      />

      <div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Reusable Area Chart Component */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 ml-2">
                Monthly Spending Trend
              </h2>
              <div className="h-[300px] w-full">
                <SpendingAreaChart data={monthlyData} />
              </div>
            </div>

            {/* 2. Payment Methods Pie Chart */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
                Payment Methods
              </h2>
              {paymentData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Tooltip content={<CustomTooltip />} />
                      <Pie
                        data={paymentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {paymentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {[
                      { method: "Cash", color: "#10b981" },
                      { method: "Credit", color: "#3b82f6" },
                      { method: "Partial", color: "#f59e0b" },
                    ].map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-gray-600">
                          {entry.method}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  no data
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Transactions transactions={customerData.transactions} clientId={id} />
    </div>
  );
}
