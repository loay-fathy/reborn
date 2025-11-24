import type { ReactNode } from "react";
import Sidebar from "@/components/ui/Sidebar";
import AuthGuard from "@/components/ui/AuthGuard";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <div className="xl:w-52 sm:w-40 w-10">
          <Sidebar />
        </div>
        <main className="w-full">{children}</main>
      </div>
    </AuthGuard>
  );
}
