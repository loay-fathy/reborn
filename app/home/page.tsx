"use client";
import Link from "next/link";
import {
    LogOut,
    Banknote,
    BarChart3,
    Percent,
    PackageSearch,
    UserCheck,
    Store
} from "lucide-react";
import { clearAuthData } from "@/lib/auth";
import AuthGuard from "@/components/ui/AuthGuard";

export default function Dashboard() {
    // Configuration for the menu items
    // I interpreted the icons from left to right based on the image
    const menuItems = [
        {
            label: "Cashier",
            icon: Banknote,
            href: "/cashier"
        },
        {
            label: "Dashboard",
            icon: BarChart3,
            href: "/dashboard"
        },
        {
            label: "Premium",
            icon: Percent,
            href: "/premiumClients"
        },
        {
            label: "Products",
            icon: PackageSearch,
            href: "/products"
        },
        {
            label: "Users",
            icon: UserCheck,
            href: "/users"
        },
        {
            label: "Expenses",
            icon: Store,
            href: "/expenses"
        },
    ];

    return (
        <AuthGuard>

            <main className="relative min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">

                {/* Top Left Logout Button */}
                <div className="absolute top-8 left-8">
                    <button
                        onClick={() => {
                            clearAuthData();
                            window.location.href = "/";
                        }}
                        className="flex items-center justify-center w-16 h-16 bg-[#C17F36] rounded-3xl hover:bg-[#a86e2f] transition-colors shadow-sm"
                    >
                        <LogOut className="w-8 h-8 text-white" strokeWidth={2} />
                    </button>
                </div>

                {/* Main Content Container */}
                <div className="flex flex-col items-center gap-12">

                    {/* Heading */}
                    <h1 className="text-4xl font-bold text-black tracking-tight">
                        Welcome to KKP
                    </h1>

                    {/* Icons Grid */}
                    {/* Uses flex-wrap to handle smaller screens gracefully */}
                    <div className="flex flex-wrap justify-center gap-6 max-w-5xl">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="group flex flex-col items-center gap-3"
                            >
                                {/* Icon Container */}
                                <div className="flex items-center justify-center w-24 h-24 bg-[#C17F36] rounded-[2rem] shadow-sm group-hover:scale-105 group-hover:bg-[#a86e2f] transition-all duration-200 ease-in-out">
                                    <item.icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                                </div>

                                {/* Label */}
                                <span className="text-xl font-bold text-black">
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </AuthGuard>
    );
}