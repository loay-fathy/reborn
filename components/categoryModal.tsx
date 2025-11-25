'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Edit3, Trash2, Plus } from 'lucide-react';
import { getAuthToken } from '@/lib/auth';
import OvalLine from './ui/ovalLine';

interface Category {
    id: number;
    name: string;
}

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    type?: 'expense' | 'product';
}

export default function CategoryModal({
    isOpen,
    onClose,
    type = 'expense',
}: CategoryModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const token = getAuthToken();

    const getApiEndpoints = () => {
        if (type === 'product') {
            return {
                base: '/api/categories',
                withId: (id: number) => `/api/categories/${id}`,
            };
        }
        return {
            base: '/api/expenses/categories',
            withId: (id: number) => `/api/expenses/categories/${id}`,
        };
    };

    const endpoints = getApiEndpoints();

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch(endpoints.base, {
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
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    // Focus input when editing starts
    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingId]);

    const handleAddCategory = async () => {
        if (newCategoryName.trim() !== '') {
            try {
                const res = await fetch(endpoints.base, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: newCategoryName.trim() }),
                });

                if (!res.ok) throw new Error('Failed to create category');

                await fetchCategories();
                setNewCategoryName('');
            } catch (err) {
                console.error(err);
                alert('Échec de la création de la catégorie');
            }
        }
    };

    const handleStartEdit = (id: number, name: string) => {
        setEditingId(id);
        setEditingName(name);
    };

    const handleSaveEdit = async (id: number) => {
        if (editingName.trim() !== '') {
            try {
                const res = await fetch(endpoints.withId(id), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: editingName.trim() }),
                });

                if (!res.ok) throw new Error('Failed to update category');

                await fetchCategories();
                setEditingId(null);
                setEditingName('');
            } catch (err) {
                console.error(err);
                alert('Échec de la mise à jour de la catégorie');
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie?')) return;

        try {
            const res = await fetch(endpoints.withId(id), {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                const errorMessage = errorData.details?.message || errorData.details || 'Failed to delete category';
                throw new Error(errorMessage);
            }

            await fetchCategories();
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : 'Échec de la suppression de la catégorie');
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
                        className="bg-white rounded-4xl w-full max-w-4xl p-10 relative shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-5xl font-bold">Catégorie</h2>
                            <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                                <X size={30} />
                            </button>
                        </div>

                        <OvalLine />

                        <div className="mt-4 space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                            {loading ? (
                                <p className="text-center text-gray-500">Chargement...</p>
                            ) : error ? (
                                <p className="text-center text-red-500">{error}</p>
                            ) : categories.length === 0 ? (
                                <p className="text-center text-gray-500">Aucune catégorie trouvée</p>
                            ) : (
                                categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center justify-between bg-gray-50 border border-gray-200 text-3xl font-semibold rounded-full px-4 py-3"
                                    >
                                        {editingId === category.id ? (
                                            <div className="flex items-center w-full">
                                                <input
                                                    ref={inputRef}
                                                    type="text"
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400 mr-2"
                                                    placeholder="Saisie..."
                                                />
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleSaveEdit(category.id)}
                                                        className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-md transition-colors"
                                                    >
                                                        <Check size={25} />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-md transition-colors"
                                                    >
                                                        <X size={25} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-gray-700 font-medium">{category.name}</span>
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => handleStartEdit(category.id, category.name)}
                                                        className="text-blue-500 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Edit3 size={25} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCategory(category.id)}
                                                        className="text-red-500 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ajouter une nouvelle Catégorie
                            </label>
                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Boulangerie"
                                    className="flex-grow border border-secondary-color text-xl rounded-3xl px-4 py-3 outline-none"
                                />
                                <button
                                    onClick={handleAddCategory}
                                    className="bg-main-color hover:bg-main-color/90 text-white p-3 rounded-3xl w-20 h-16 flex items-center justify-center transition-colors"
                                >
                                    <Plus size={30} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}