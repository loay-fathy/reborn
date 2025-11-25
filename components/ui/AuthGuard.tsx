"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";

// Map routes to required permissions
const ROUTE_PERMISSIONS: Record<string, number> = {
    "/cashier": PERMISSIONS.ProcessSales,
    "/dashboard": PERMISSIONS.AccessReports,
    "/premiumClients": PERMISSIONS.ManageCustomers,
    "/products": PERMISSIONS.ManageProducts,
    "/users": PERMISSIONS.ManageUsers,
    "/expenses": PERMISSIONS.ManageExpenses,
    "/inventory": PERMISSIONS.ManageInventory,
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const permissionsStr = localStorage.getItem("permissions");
        const userPermissions = permissionsStr ? parseInt(permissionsStr, 10) : 0;

        if (!token) {
            router.replace("/");
            return;
        }

        // Check if current route requires specific permissions
        // We check if the pathname starts with the route key to handle sub-routes (e.g. /products/123)
        const requiredPermission = Object.entries(ROUTE_PERMISSIONS).find(([route]) =>
            pathname === route || pathname.startsWith(`${route}/`)
        )?.[1];

        if (requiredPermission) {
            if (!hasPermission(userPermissions, requiredPermission)) {
                // Redirect to home if user lacks permission
                router.replace("/home");
                return;
            }
        }

        setAuthorized(true);
    }, [router, pathname]);

    // Prevent flashing of unauthorized content
    if (!authorized) {
        return null;
    }

    return <>{children}</>;
}
