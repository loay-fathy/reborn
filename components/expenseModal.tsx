'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getAuthToken } from '@/lib/auth';
import OvalLine from './ui/ovalLine';

interface Category {
    id: number;
    name: string;
}

interface ExpenseFormData {
    id?: number;
    description: string;
    amount: number;
    categoryId: number;
}

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialExpense?: ExpenseFormData | null;
    onSuccess?: () => void;
}

export default function ExpenseModal({
    isOpen,
    onClose,
    initialExpense = null,
    onSuccess,
}: ExpenseModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = getAuthToken();

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const res = await fetch('/api/expenses/categories', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error('Failed to fetch categories');
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error(err);
                setError('Échec du chargement des catégories');
            } finally {
                setCategoriesLoading(false);
            }
        };

        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen, token]);

    // Seed modal with initial expense data if provided
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (initialExpense) {
            setDescription(initialExpense.description || '');
            setAmount(initialExpense.amount?.toString() || '');
            setCategoryId(initialExpense.categoryId ?? '');
        } else {
            setDescription('');
            setAmount('');
            setCategoryId('');
        }
        setError(null);
    }, [isOpen, initialExpense]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!description.trim() || !amount || categoryId === '') {
            setError('Veuillez remplir tous les champs');
            return;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Veuillez entrer un montant valide');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const payload = {
                description: description.trim(),
                amount: numAmount,
                categoryId: Number(categoryId),
            };

            const isEditMode = Boolean(initialExpense?.id);
            const url = isEditMode ? `/api/expenses/${initialExpense?.id}` : '/api/expenses';
            const method = isEditMode ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                const errorMessage = errorData.details?.message || errorData.details || errorData.error || 'Failed to save expense';
                throw new Error(errorMessage);
            }

            // Success
            if (onSuccess) {
                onSuccess();
            }
            onClose();
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Échec de l\'enregistrement de la dépense');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-4xl w-full max-w-2xl p-10 relative shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-4xl font-bold">
                                {initialExpense ? 'Modifier la Dépense' : 'Ajouter une Nouvelle Dépense'}
                            </h2>
                            <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                                <X size={30} />
                            </button>
                        </div>

                        <OvalLine />

                        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Entrez la description de la dépense"
                                    className="w-full border border-secondary-color text-lg rounded-3xl px-4 py-3 outline-none"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Montant
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full border border-secondary-color text-lg rounded-3xl px-4 py-3 outline-none"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catégorie
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                                    className="w-full border border-secondary-color text-lg rounded-3xl px-4 py-3 outline-none bg-white"
                                    disabled={loading || categoriesLoading}
                                >
                                    <option value="">Sélectionnez une catégorie</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-3xl font-semibold hover:bg-gray-50 transition-colors"
                                    disabled={loading}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-main-color text-white rounded-3xl font-semibold hover:bg-main-color/90 transition-colors disabled:opacity-50"
                                    disabled={loading || categoriesLoading}
                                >
                                    {loading ? 'Enregistrement...' : initialExpense ? 'Mettre à Jour la Dépense' : 'Créer la Dépense'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
