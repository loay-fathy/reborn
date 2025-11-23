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
import { User, emptyUser } from "@/types/user";

export default function UserManagementPage() {
  // State for the list of users
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for the user currently being edited (null = new user)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
  const handleDeleteUser = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  // 4. Save Logic (Handles both Create and Update)
  const handleSaveUser = (modalData: User) => {
    // Note: This needs to be updated to call the API
    // For now, just updating local state
    if (selectedUser && selectedUser.id) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, ...modalData } : u
        )
      );
    } else {
      const newUser: User = {
        ...modalData,
        id: Date.now(), // Temporary ID
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
    }
    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen mt-20 mr-20">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-5xl font-semibold tracking-tight">
            User Management
          </h1>
          <div className="relative">
            <Users className="w-8 h-8 text-main-color" />
            <div className="absolute -bottom-1 -right-1 bg-main-color rounded-full p-0.5 border-2 border-[#F9FAFB]">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-main-color hover:bg-[#a6652d] transition-colors text-white px-6 py-2.5 rounded-xl shadow-sm font-medium">
          Search
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-6 px-6 font-bold text-xl text-main-color w-16 text-center">
                  #
                </th>
                <th className="py-6 px-6 font-bold text-xl">Name</th>
                <th className="py-6 px-6 font-bold text-xl">Date Created</th>
                <th className="py-6 px-6 font-bold text-xl">Role</th>
                <th className="py-6 px-6 font-bold text-xl">Status</th>
                <th className="py-6 px-6 font-bold text-xl text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-xl text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-xl text-gray-500">
                    No users found.
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
                      {index + 1}
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
                          {user.isActive ? "Active" : "Inactive"}
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
      </div>

      {/* Creation Button (Triggers Modal) */}
      <CreationButton
        text="New User"
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
