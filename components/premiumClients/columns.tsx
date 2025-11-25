"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Client } from "@/types/premiumClients";

// Change 1: Export a function 'getColumns' that takes 'onEdit' and 'onDelete' as arguments
export const getColumns = (
  onEdit: (client: Client) => void,
  onDelete: (client: Client) => void
): ColumnDef<Client>[] => [
    {
      accessorKey: "id",
      header: () => <span className="text-main-color">#</span>,
      cell: ({ row }) => <span>{row.original.id}</span>,
    },
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "createdAt",
      header: "Date de Création",
      cell: ({ row }) => <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>,
    },
    {
      accessorKey: "discountPercentage",
      header: "Remise",
      cell: ({ row }) => <span>{row.original.discountPercentage}%</span>,
    },
    {
      accessorKey: "currentBalance",
      header: "Solde",
      cell: ({ row }) => {
        const balance = row.original.currentBalance;
        return (
          <span className={balance < 0 ? "text-red-500" : "text-green-500"}>
            {balance}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      // Change 2: Use the 'onEdit' function in the onClick handler
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Edit
            onClick={(e) => {
              e.stopPropagation(); // Prevents the row from being selected
              onEdit(row.original);
            }}
            className="w-5 h-5 cursor-pointer"
          />
          <Trash
            onClick={(e) => {
              e.stopPropagation(); // Prevents the row from being selected
              onDelete(row.original);
            }}
            className="w-5 h-5 cursor-pointer text-red-500"
          />
        </div>
      ),
    },
  ];
