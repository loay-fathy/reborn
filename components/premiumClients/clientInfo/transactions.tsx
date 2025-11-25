"use client";
import { useState } from "react";
import Pagination from "../../ui/pagination";
import Link from "next/link";

type PaymentType = "Credit" | "Cash" | "Partial";

interface TransactionRecord {
  saleId: number;
  date: string;
  itemsSummary: string;
  total: number;
  discount: number;
  paid: number;
  change: number;
  paymentType: string;
}

interface TransactionTableProps {
  transactions?: TransactionRecord[];
  clientId?: string;
}

const ITEMS_PER_PAGE = 5;

export default function TransactionTable({
  transactions = [],
  clientId,
}: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = transactions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  };

  // Format date from ISO string to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Updated badge styles for Payment methods
  const getPaymentStyles = (type: string): string => {
    switch (type) {
      case "Credit":
        return "bg-blue-100 text-blue-700";
      case "Cash":
        return "bg-green-100 text-green-700";
      case "Partial":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Determine payment type based on paid vs total
  const getPaymentType = (transaction: TransactionRecord): string => {
    const amountDue = transaction.total - transaction.discount;
    if (transaction.paid < amountDue) {
      return "Partial";
    }
    return transaction.paymentType;
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 font-sans overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 sm:p-8 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">
          Transaction History
        </h2>

        <div className="flex flex-wrap gap-3">
          <Link href={`/cashier/?id=${clientId}`} className="cursor-pointer bg-[#1EA348] hover:bg-[#18853a] text-white px-8 py-3 outline-none rounded-2xl font-semibold text-sm transition-all shadow-sm">
            $ Start New Order
          </Link>
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-[#F9FAFB]">
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-40">
                Date
              </th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Paid
              </th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Change
              </th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Payment
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentData.length > 0 ? (
              currentData.map((item, index) => {
                const paymentType = getPaymentType(item);
                return (
                  <tr
                    key={`${item.saleId}-${index}`}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6 text-sm text-gray-800">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-800">
                      {item.itemsSummary}
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-900">
                      {formatCurrency(item.total)}
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-green-600">
                      {formatCurrency(item.discount)}
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-900">
                      {formatCurrency(item.paid)}
                    </td>
                    <td
                      className={`px-8 py-6 text-sm font-bold ${item.change > 0 ? "text-red-500" : "text-green-600"
                        }`}
                    >
                      {formatCurrency(item.change)}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold ${getPaymentStyles(
                          paymentType
                        )}`}
                      >
                        {paymentType}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-8 py-12 text-center text-gray-500"
                >
                  no data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Pagination Footer --- */}
      {transactions.length > 0 && (
        <div className="mt-4 mx-6 sm:mx-8 border-t border-gray-50">
          <Pagination
            currentPage={currentPage}
            totalItems={transactions.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
