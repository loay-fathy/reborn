"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Pencil,
  Trash2,
  Users,
  CheckCircle2,
  Plus,
} from "lucide-react";
import CreationButton from "@/components/ui/creationButton";
import UserModal from "@/components/userModal"; // Adjust path if needed
// We import the types to ensure compatibility with the Modal
import { User } from "@/types/user";
import Pagination from "@/components/ui/pagination";
import { getAuthToken } from "@/lib/auth";

export default function UserManagementPage() {
  // State for the list of users
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for the user currently being edited (null = new user)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Pagination & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const token = getAuthToken();

  // Fetch users function
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      params.append("pageNumber", currentPage.toString());
      params.append("pageSize", pageSize.toString());

      const res = await fetch(`/api/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();

      if (data.data && Array.isArray(data.data)) {
        setUsers(data.data);
        setTotalRecords(data.totalRecords || 0);
      } else if (Array.isArray(data)) {
        // Fallback for old API structure if needed
        setUsers(data);
        setTotalRecords(data.length);
      } else {
        setUsers([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users on mount or when dependencies change
  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentPage, pageSize]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // --- Handlers ---

  // 1. Open Modal for Creation
  const handleCreateNew = () => {
    setSelectedUser(null); // Clear selection indicates "Create Mode"
    setIsModalOpen(true);
  };

  // 2. Open Modal for Editing
  const handleEditUser = (user: User) => {
    setSelectedUser(user); // Set selection indicates "Edit Mode"
    setIsModalOpen(true);
  };

  // 3. Handle Delete
  const handleDeleteUser = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur?")) {
      try {
        const res = await fetch(`/api/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to delete user");
        }

        // Refresh the list
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Échec de la suppression de l'utilisateur");
      }
    }
  };

  // 4. Save Logic (Handles both Create and Update)
  const handleSaveUser = async (modalData: User) => {
    try {
      let res;
      if (selectedUser && selectedUser.id) {
        // Update existing user
        res = await fetch(`/api/users/${selectedUser.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modalData),
        });
      } else {
        // Create new user
        res = await fetch("/api/users", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modalData),
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save user");
      }

      setIsModalOpen(false);
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error saving user:", error);
      alert(error instanceof Error ? error.message : "Échec de l'enregistrement de l'utilisateur");
    }
  };

  return (
    <main className="min-h-screen mt-20 mr-20 flex flex-col">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-5xl font-semibold tracking-tight">
            Gestion des Utilisateurs
          </h1>
          <div className="relative">
            <Users className="w-8 h-8 text-main-color" />
            <div className="absolute -bottom-1 -right-1 bg-main-color rounded-full p-0.5 border-2 border-[#F9FAFB]">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-main-color hover:bg-[#a6652d] transition-colors text-white text-2xl px-6 py-2.5 rounded-xl font-semibold w-64">
          <Search className="w-8 h-8 shrink-0" />
          <input
            type="text"
            placeholder="Rechercher"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full placeholder:text-white/80 text-white"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden flex-grow flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-6 px-6 font-bold text-xl text-main-color w-16 text-center">
                  #
                </th>
                <th className="py-6 px-6 font-bold text-xl">Nom</th>
                <th className="py-6 px-6 font-bold text-xl">Date de Création</th>
                <th className="py-6 px-6 font-bold text-xl">Rôle</th>
                <th className="py-6 px-6 font-bold text-xl">État</th>
                <th className="py-6 px-6 font-bold text-xl text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-xl text-gray-500">
                    Chargement des utilisateurs...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-xl text-gray-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-5 px-6 text-secondary-color font-medium text-center">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>

                    {/* Name & image */}
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-18 h-18 rounded-3xl overflow-hidden">
                          <Image
                            src={user.image || "/images/profile.jpg"}
                            alt={user.fullName}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <span className="font-bold text-xl text-secondary-color group-hover:text-gray-700">
                          {user.fullName}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-5 px-6 text-secondary-color font-bold text-xl">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    {/* Role */}
                    <td className="py-5 px-6 text-secondary-color font-bold text-xl">
                      {user.role}
                    </td>

                    {/* Status */}
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-secondary-color font-bold text-xl">
                          {user.isActive ? "Actif" : "Inactif"}
                        </span>
                        <span
                          className={`h-3 w-3 rounded-full ${user.isActive
                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                            : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                            }`}
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-5 px-6">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          aria-label="Edit user"
                          onClick={() => handleEditUser(user)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                        <button
                          aria-label="Delete user"
                          onClick={() => handleDeleteUser(user.id!)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalRecords > 0 && (
          <div className="mt-auto p-4 border-t border-gray-100">
            <Pagination
              currentPage={currentPage}
              totalItems={totalRecords}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Creation Button (Triggers Modal) */}
      <CreationButton
        text="Nouvel Utilisateur"
        icon={<Plus />}
        handleOnClick={handleCreateNew}
      />

      {/* The User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </main>
  );
}
