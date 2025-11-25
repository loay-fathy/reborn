"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    LayoutGrid,
    Receipt,
    Pencil,
    Plus,
    SlidersHorizontal
} from "lucide-react";
import DataCard from "@/components/dashboard/dataCard";
import Pagination from "@/components/ui/pagination";
import { getAuthToken } from "@/lib/auth";
import CategoryModal from "@/components/categoryModal";
import ExpenseModal from "@/components/expenseModal";

interface Expense {
    id: number;
    date: string;
    description: string;
    amount: number;
    categoryId: number;
    categoryName: string;
    recordedByUserName: string;
}

interface SummaryData {
    totalAmount: number;
    transactionCount: number;
    period: string;
}

const ExpensesPage = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [summaryData, setSummaryData] = useState<SummaryData>({
        totalAmount: 0,
        transactionCount: 0,
        period: "This month"
    });
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

    const token = getAuthToken();

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchQuery.trim()) {
                params.append("search", searchQuery.trim());
            }
            params.append("pageNumber", currentPage.toString());
            params.append("pageSize", pageSize.toString());

            const response = await fetch(`/api/expenses?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch expenses");
            }

            const data = await response.json();

            // Handle potential different response structures
            if (data.data && Array.isArray(data.data)) {
                setExpenses(data.data);
                setTotalRecords(data.totalRecords || 0);
            } else if (Array.isArray(data)) {
                setExpenses(data);
                setTotalRecords(data.length);
            } else {
                setExpenses([]);
                setTotalRecords(0);
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "unexpected error";
            setError(errorMessage);
            console.error("Error fetching expenses:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [currentPage, pageSize, searchQuery, token]);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch("/api/expenses/summary", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch summary");
                }

                const data = await response.json();
                setSummaryData(data);
            } catch (err) {
                console.error("Error fetching summary:", err);
            }
        };

        fetchSummary();
    }, [token]);

    // Helper to get category badge styles
    const getCategoryStyle = (category: string) => {
        switch (category) {
            case "Utilities":
                return "bg-blue-100 text-blue-700";
            case "Raw Material":
                return "bg-green-100 text-green-700";
            case "Supplies":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const handleAddExpense = () => {
        setSelectedExpense(null);
        setIsExpenseModalOpen(true);
    };

    const handleEditExpense = (expense: Expense) => {
        setSelectedExpense(expense);
        setIsExpenseModalOpen(true);
    };

    const handleExpenseSuccess = () => {
        fetchExpenses();
    };

    return (
        <div className="min-h-screen mt-20 mr-20">
            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            />
            <ExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                initialExpense={selectedExpense}
                onSuccess={handleExpenseSuccess}
            />
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Dépenses</h1>
                    <p className="text-secondary-color mt-2 text-2xl">Gérer et suivre toutes les dépenses de la boulangerie</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-60">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                        type="text"
                        placeholder="Rechercher des dépenses..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset to page 1 on search
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none"
                    />
                </div>
            </div>

            {/* --- Stats Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <DataCard
                    title="Dépenses Totales"
                    value={`$${summaryData.totalAmount.toLocaleString()}`}
                    countText={summaryData.period}
                />
                <DataCard
                    title="Transactions"
                    value={summaryData.transactionCount.toString()}
                    countText={`Entrées de dépenses ${summaryData.period}`}
                    icon={Receipt}
                />
                <DataCard
                    title="Catégories"
                    value="8"
                    countText="Catégories actives"
                    icon={LayoutGrid}
                />
            </div>

            {/* --- Main Content Card --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Table Header / Actions */}
                <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">Registres de Dépenses</h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1F2937] text-white rounded-2xl text-base font-bold hover:bg-gray-800 transition-colors"
                        >
                            <SlidersHorizontal size={16} />
                            Catégorie
                        </button>
                        <button
                            onClick={handleAddExpense}
                            className="flex items-center gap-2 px-4 py-2 bg-[#16A34A] text-white rounded-2xl font-bold text-base hover:bg-[#16A34A]/90 transition-colors shadow-sm"
                        >
                            <Plus size={18} />
                            Ajouter une Nouvelle Dépense
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 w-3/9">Description</th>
                                <th className="px-6 py-4">Enregistré Par</th>
                                <th className="px-6 py-4">Montant</th>
                                <th className="px-6 py-4">Catégorie</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                        Chargement des dépenses...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-red-500">
                                        Error: {error}
                                    </td>
                                </tr>
                            ) : expenses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                        Aucune dépense trouvée.
                                    </td>
                                </tr>
                            ) : (
                                expenses.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5 text-sm font-semibold text-gray-700">
                                            {new Date(item.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5 text-sm font-semibold text-black">
                                            {item.description}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-black font-bold">
                                            {item.recordedByUserName}
                                        </td>
                                        <td className="px-6 py-5 text-sm font-bold text-gray-900">
                                            ${item.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryStyle(item.categoryName)}`}>
                                                {item.categoryName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => {
                                                    handleEditExpense(item);
                                                }}
                                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <Pencil size={25} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && !error && totalRecords > 0 && (
                    <div className="border-t border-gray-100">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalRecords}
                            itemsPerPage={pageSize}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpensesPage;