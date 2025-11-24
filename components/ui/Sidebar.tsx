"use client";
import { useState } from "react";
import {
  BadgePercent,
  Banknote,
  ChartNoAxesColumn,
  PackageSearch,
  UserRoundPlus,
  LogOut,
  Store,
  ChevronLeft,
  Menu,
  X, // Imported X icon for close button
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import OvalLine from "./ovalLine";
import { clearAuthData } from "@/lib/auth";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Desktop collapse state
  const [isOpen, setIsOpen] = useState(false);
  // Mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // On mobile: force expanded width (304px). On desktop: toggle.
  const isExpanded = isOpen || isMobileOpen;

  const links = [
    { name: "cashier", icon: <Banknote size={30} />, label: "Cashier" },
    {
      name: "dashboard",
      icon: <ChartNoAxesColumn size={30} />,
      label: "Dashboard",
    },
    {
      name: "premiumClients",
      icon: <BadgePercent size={30} />,
      label: "Premium Clients",
    },
    { name: "products", icon: <PackageSearch size={30} />, label: "Products" },
    { name: "users", icon: <UserRoundPlus size={30} />, label: "Users" },
  ];

  const options = [
    { name: "expenses", icon: <Store size={30} />, label: "Expenses" },
    { name: "logout", icon: <LogOut size={30} />, label: "Logout" },
  ];

  const handleLogout = () => {
    clearAuthData();
    router.push("/");
  };

  return (
    <>
      {/* --- Mobile Toggle Button (Hamburger) --- */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white text-main-color rounded-full shadow-lg hover:bg-gray-100 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* --- Mobile Backdrop --- */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* --- Sidebar --- */}
      <motion.aside
        initial={false}
        animate={{
          width: isExpanded ? 304 : 120,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          /* Spacing: Reduced padding on mobile (px-4), standard on desktop (md:px-8) */
          px-4 md:px-8 
          bg-white shadow-2xl shadow-[#6625004D] rounded-e-4xl 
          fixed z-50 top-0 left-0 flex flex-col justify-between items-center
          h-screen
          
          /* Mobile Slide-in Logic */
          transform 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 
          transition-transform duration-300 ease-in-out 
          md:transition-none
        `}
      >
        {/* --- Mobile Close Icon (Top Right inside Sidebar) --- */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-main-color transition-colors"
        >
          <X size={28} />
        </button>

        {/* --- Top Section --- */}
        {/* Spacing: Reduced top margin on mobile (mt-10), standard on desktop (md:mt-20) */}
        <div className="mt-10 md:mt-20 w-full mx-auto flex flex-col items-start">
          <div className="flex flex-row gap-5 items-center">
            <Image
              src="/images/profile.jpg"
              alt="logo kkp"
              width={60}
              height={60}
              className="aspect-square rounded-2xl"
            />
            <motion.div
              initial={false}
              animate={{
                opacity: isExpanded ? 1 : 0,
                height: isExpanded ? "auto" : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-sm text-gray-500 mt-2">Admin</p>
              <p className="text-base font-semibold text-main-color whitespace-nowrap">
                Loay Fathy
              </p>
            </motion.div>
          </div>

          <OvalLine className="my-5 h-px" />

          {links.map((link) => (
            <Link
              key={link.name}
              href={`/${link.name}`}
              onClick={() => setIsMobileOpen(false)}
              className={`${pathname === `/${link.name}` && "bg-main-color text-white"
                }
            ${pathname === `/premiumCashier` &&
                link.name === "premiumClients" &&
                "bg-main-color text-white"
                }
             my-2 text-main-color rounded-2xl p-3 hover:bg-main-color hover:text-white transition-colors w-full flex items-center gap-4`}
            >
              <span className="shrink-0">{link.icon}</span>
              <motion.span
                initial={false}
                animate={{
                  opacity: isExpanded ? 1 : 0,
                  width: isExpanded ? "auto" : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden whitespace-nowrap font-medium"
              >
                {link.label}
              </motion.span>
            </Link>
          ))}
        </div>

        {/* --- Bottom Section --- */}
        <div className="w-full mx-auto flex flex-col items-center mb-8">
          {options.map((option) =>
            option.name === "logout" ? (
              <button
                key={option.name}
                onClick={handleLogout}
                className={`my-2 text-main-color rounded-2xl p-3 hover:bg-main-color hover:text-white transition-colors w-full flex items-center gap-4 cursor-pointer`}
              >
                <span className="shrink-0">{option.icon}</span>
                <motion.span
                  initial={false}
                  animate={{
                    opacity: isExpanded ? 1 : 0,
                    width: isExpanded ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden whitespace-nowrap font-medium"
                >
                  {option.label}
                </motion.span>
              </button>
            ) : (
              <Link
                key={option.name}
                href={`/${option.name}`}
                onClick={() => setIsMobileOpen(false)}
                className={`${pathname === `/${option.name}` && "bg-main-color text-white"
                  } my-2 text-main-color rounded-2xl p-3 hover:bg-main-color hover:text-white transition-colors w-full flex items-center gap-4`}
              >
                <span className="shrink-0">{option.icon}</span>
                <motion.span
                  initial={false}
                  animate={{
                    opacity: isExpanded ? 1 : 0,
                    width: isExpanded ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden whitespace-nowrap font-medium"
                >
                  {option.label}
                </motion.span>
              </Link>
            )
          )}
        </div>

        {/* --- Desktop Width Toggle (Hidden on Mobile) --- */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer absolute top-23 -right-4 hidden md:block"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="text-white bg-main-color w-8 h-8 rounded-full" />
          </motion.div>
        </motion.button>
      </motion.aside>
    </>
  );
};

export default Sidebar;