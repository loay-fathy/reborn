"use client";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState, // Import this
} from "@tanstack/react-table";
// Import useState
import { useEffect, useState } from "react";

// Change 1: Import getColumns instead of columns
import { Client } from "@/types/premiumClients";
import CreationButton from "../ui/creationButton";
import { Plus } from "lucide-react";
import ClientModal from "./clientModal";

interface DataTableProps {
  getColumns: any;
  data: Client[];
  passSelectedClient: (client: Client) => void;
  onDelete: (client: Client) => void;
  onSave: (client: Client) => void;
}

export default function DataTable({ getColumns, data, passSelectedClient, onDelete, onSave }: DataTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({
    "0": false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    if (rowSelection) {
      // @ts-ignore
      const selectedRow = table.getRowModel().rows.find((row) => row.getIsSelected());
      if (selectedRow) {
        const selectedClient = selectedRow.original;
        console.log(selectedClient);
        passSelectedClient(selectedClient);
      }
    }
  }, [rowSelection]);

  // 5. Create the function to handle the edit click
  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  // 6. Call the 'getColumns' function and pass the handler
  const tableColumns = getColumns(handleEdit, onDelete);

  const table = useReactTable({
    data,
    // 7. Use the columns we just created
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),

    // 8. Add selection state and handlers
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    enableMultiRowSelection: false,
  });

  return (
    <div className="mr-20 rounded-4xl bg-white mt-10 p-5">
      <table className="w-full border-separate border-spacing-y-3">
        {/* TABLE HEAD */}
        <thead className="text-black font-semibold">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-5 text-left text-xl font-bold border-b border-secondary-color/20"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* TABLE BODY */}
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const isSelected = row.getIsSelected();

            return (
              <tr
                key={row.id}
                // 9. Change onClick to 'toggleSelected(true)'
                // This forces selection and prevents deselection
                onClick={() => row.toggleSelected(true)}
                className="cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`
                      p-5 text-xl font-bold
                      ${isSelected
                        ? "bg-main-color/80 text-white"
                        : "bg-white text-secondary-color"
                      }
                      first:rounded-l-2xl
                      last:rounded-r-2xl
                    `}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        client={editingClient}
        onSave={(client) => {
          onSave(client);
          setIsModalOpen(false);
          setEditingClient(null);
        }}
      />
      <CreationButton
        text="Nouveau client"
        icon={<Plus size={30} />}
        handleOnClick={() => {
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}
