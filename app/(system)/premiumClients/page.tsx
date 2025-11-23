import { ArrowBigRight, BadgePercent } from "lucide-react";
import { Client } from "@/types/premiumClients";
import DataTable from "@/components/premiumClients/dataTable";
import { getColumns } from "@/components/premiumClients/columns";

async function fetchClients(): Promise<Client[]> {
  // Replace with your real API endpoint
  const res = await fetch("https://swagger.quoril.space/api/Customers/", {
    method: "GET",
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsIm5iZiI6MTc2MzE5NDQ4NSwiZXhwIjoxNzYzNzk5Mjg1LCJpYXQiOjE3NjMxOTQ0ODV9.3mE80Lp95QdRmS2pNQkvWCX2ca_2ntipWrGnVJv6NTsBGOLHEZSU5bJcKnCwwgtXYUrT74yk0sZrrLWidOkCdw`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    // handle errors or return empty array
    return [];
  }
  return res.json();
}

export default async function PremiumClientsPage() {
  const clients = await fetchClients();
  console.log("Fetched clients:", clients);
  return (
    <>
      <div className="flex items-center justify-between mt-20 mr-20">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">Premium Clients</h1>
          <BadgePercent className="text-main-color" size={35} />
        </div>
        <div className="flex items-center text-white bg-main-color gap-2 py-2 px-5 rounded-2xl">
          <button className="text-xl font-semibold">Next</button>
          <ArrowBigRight />
        </div>
      </div>
      <DataTable getColumns={getColumns} data={clients} />
    </>
  );
}
