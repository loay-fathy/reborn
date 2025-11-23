"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState, // Import this
} from "@tanstack/react-table";
// Import useState
import { useState } from "react";

// Change 1: Import getColumns instead of columns
import { Client } from "./columns";
import CreationButton from "../ui/creationButton";
import { Plus } from "lucide-react";
import ClientModal from "./clientModal";

interface DataTableProps {
  // Change 2: The 'columns' prop is no longer used to create the table,
  // but we still get it. We'll create our own 'columns' constant.
  getColumns: any;
  data: Client[];
}

export default function DataTable({ getColumns, data }: DataTableProps) {
  // 3. Add state for row selection, default to first row (index '0')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({
    "0": true, // Selects the first row by default
  });

  // 4. Add state for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // 5. Create the function to handle the edit click
  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  // 6. Call the 'getColumns' function and pass the handler
  const tableColumns = getColumns(handleEdit);

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
                  className="p-5 text-left border-b border-secondary-color/20"
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
                      p-5
                      ${
                        isSelected
                          ? "bg-main-color text-white"
                          : // 10. Update text color to 'text-main-color'
                            "bg-white text-secondary-color"
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
          console.log("Saved client:", client);
          setIsModalOpen(false);
          setEditingClient(null);
        }}
      />
      <CreationButton
        text="New Client"
        icon={<Plus size={30} />}
        handleOnClick={() => {
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}
