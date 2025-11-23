"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";

export type Client = {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
  currentBalance: number;
  discountPercentage: number;
};

// Change 1: Export a function 'getColumns' that takes 'onEdit' as an argument
export const getColumns = (
  onEdit: (client: Client) => void
): ColumnDef<Client>[] => [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => <span>{row.original.id}</span>,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "currentBalance",
    header: "Status",
    cell: ({ row }) => {
      const balance = row.original.currentBalance;
      return (
        <span className={balance < 0 ? "text-red-500" : "text-green-500"}>
          {balance < 0 ? "Debtor" : "Creditor"}
        </span>
      );
    },
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount",
    cell: ({ row }) => <span>{row.original.discountPercentage}%</span>,
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
            // Add your delete logic here
            console.log("Delete:", row.original);
          }}
          className="w-5 h-5 cursor-pointer"
        />
      </div>
    ),
  },
];
