import type { ReactNode } from "react";
import Sidebar from "@/components/ui/Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="xl:w-52 w-40">
        <Sidebar />
      </div>
      <main className="w-full">{children}</main>
    </div>
  );
}
