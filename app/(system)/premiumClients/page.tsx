"use client";

import React, { useState, useEffect } from "react";
import { ArrowBigRight, BadgePercent, Search } from "lucide-react";
import { Client } from "@/types/premiumClients";
import DataTable from "@/components/premiumClients/dataTable";
import { getColumns } from "@/components/premiumClients/columns";
import Pagination from "@/components/ui/pagination";
import { useRouter } from 'next/navigation'; // For App Router
import { getAuthToken } from "@/lib/auth";

export default function PremiumClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const router = useRouter();

  const fetchClients = async () => {
    const token = getAuthToken();
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      params.append("pageNumber", currentPage.toString());
      params.append("pageSize", pageSize.toString());

      const res = await fetch(`/api/customers?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data = await res.json();

      if (data.data && Array.isArray(data.data)) {
        setClients(data.data);
        setTotalRecords(data.totalRecords || 0);
      } else {
        setClients([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchClients();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSaveClient = async (client: Client) => {
    const token = getAuthToken();
    try {
      let res;
      if (client.id && client.id !== 0) {
        // Update existing client
        res = await fetch(`/api/customers/${client.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(client),
        });
      } else {
        // Create new client
        res = await fetch("/api/customers", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(client),
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save client");
      }

      fetchClients(); // Refresh list
    } catch (error) {
      console.error("Error saving client:", error);
      alert(error instanceof Error ? error.message : "Échec de l'enregistrement du client");
    }
  };

  const handleDeleteClient = async (client: Client) => {
    const token = getAuthToken();
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client?")) return;

    try {
      const res = await fetch(`/api/customers/${client.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        // Check for the specific error details from the backend
        const errorMessage = errorData.details?.message || errorData.details || errorData.error || "Failed to delete client";
        throw new Error(errorMessage);
      }

      fetchClients(); // Refresh list
    } catch (error) {
      console.error("Error deleting client:", error);
      alert(error instanceof Error ? error.message : "Échec de la suppression du client");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mt-20 mr-20">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">Clients Premium</h1>
          <BadgePercent className="text-main-color" size={35} />
        </div>

        <button onClick={() => { selectedClient ? router.push(`/premiumClients/${selectedClient?.id}`) : alert("Veuillez sélectionner un client") }} className="flex items-center justify-center gap-3 bg-main-color hover:bg-[#a6652d] transition-colors text-white text-2xl px-4 py-4 rounded-3xl font-semibold w-64">
          <svg width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M1.33337 23.8908C4.5956 19.9086 7.49249 17.6491 10.024 17.1122C12.5556 16.5753 14.9658 16.4942 17.2547 16.8688V24.0002L28 12.3635L17.2547 1.3335V8.1115C13.0223 8.14483 9.42404 9.66327 6.46004 12.6668C3.49693 15.6704 1.78804 19.4117 1.33337 23.8908Z" fill="white" stroke="white" strokeWidth="2.66667" strokeLinejoin="round" />
          </svg>
          Suivant
        </button>
      </div>

      <div className="flex flex-col">
        <DataTable
          getColumns={getColumns}
          data={clients}
          passSelectedClient={setSelectedClient}
          onSave={handleSaveClient}
          onDelete={handleDeleteClient}
        />

        {!isLoading && totalRecords > 0 && (
          <div className="mr-20 mt-4 p-4 bg-white rounded-3xl border border-gray-100">
            <Pagination
              currentPage={currentPage}
              totalItems={totalRecords}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </>
  );
}
