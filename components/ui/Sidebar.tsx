"use client";
import { useState } from "react";
import {
  BadgePercent,
  Banknote,
  ChartNoAxesColumn,
  PackageSearch,
  UserRoundPlus,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OvalLine from "./ovalLine";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
    { name: "settings", icon: <Settings size={30} />, label: "Settings" },
    { name: "logout", icon: <LogOut size={30} />, label: "Logout" },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 304 : 120 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="px-8 h-full bg-white shadow-2xl shadow-[#6625004D] rounded-e-4xl fixed z-50 top-0 left-0 flex flex-col justify-between items-center"
    >
      <div className="mt-20 w-full mx-auto flex flex-col items-start">
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
              opacity: isOpen ? 1 : 0,
              height: isOpen ? "auto" : 0,
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
            className={`${
              pathname === `/${link.name}` && "bg-main-color text-white"
            } my-2 text-main-color rounded-2xl p-3 hover:bg-main-color hover:text-white transition-colors w-full flex items-center gap-4`}
          >
            <span className="shrink-0">{link.icon}</span>
            <motion.span
              initial={false}
              animate={{
                opacity: isOpen ? 1 : 0,
                width: isOpen ? "auto" : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden whitespace-nowrap font-medium"
            >
              {link.label}
            </motion.span>
          </Link>
        ))}
      </div>

      <div className="w-full mx-auto flex flex-col items-center mb-8">
        {options.map((option) => (
          <Link
            key={option.name}
            href={`/${option.name}`}
            className={`${
              pathname === `/${option.name}` && "bg-main-color text-white"
            } my-2 text-main-color rounded-2xl p-3 hover:bg-main-color hover:text-white transition-colors w-full flex items-center gap-4`}
          >
            <span className="shrink-0">{option.icon}</span>
            <motion.span
              initial={false}
              animate={{
                opacity: isOpen ? 1 : 0,
                width: isOpen ? "auto" : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden whitespace-nowrap font-medium"
            >
              {option.label}
            </motion.span>
          </Link>
        ))}
      </div>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer absolute top-23 -right-4"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="text-white bg-main-color w-8 h-8 rounded-full" />
        </motion.div>
      </motion.button>
    </motion.aside>
  );
};

export default Sidebar;
// "use client";
// import {
//   BadgePercent,
//   Banknote,
//   ChartNoAxesColumn,
//   PackageSearch,
//   UserRoundPlus,
//   Settings,
//   LogOut,
//   ChevronRight,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const Sidebar = () => {
//   const pathname = usePathname();
//   const links = [
//     { name: "cashier", icon: <Banknote size={30} /> },
//     { name: "dashboard", icon: <ChartNoAxesColumn size={30} /> },
//     { name: "premiumClients", icon: <BadgePercent size={30} /> },
//     { name: "products", icon: <PackageSearch size={30} /> },
//     { name: "users", icon: <UserRoundPlus size={30} /> },
//   ];
//   const options = [
//     { name: "settings", icon: <Settings size={30} /> },
//     { name: "logout", icon: <LogOut size={30} /> },
//   ];
//   return (
//     <aside className="w-76 px-8 bg-white shadow-2xl shadow-[#6625004D] rounded-e-4xl fixed top-0 left-0 bottom-0 flex flex-col justify-between items-center">
//       <div className="mt-20 w-full mx-auto flex flex-col items-">
//         <Image
//           src="/images/profile.jpg"
//           alt="logo kkp"
//           width={60}
//           height={60}
//           className="aspect-square rounded-2xl"
//         />
//         <span className="block w-full h-px bg-[#6552474d] rounded-full mx-auto my-5" />
//         {links.map((link) => (
//           <Link
//             key={link.name}
//             href={`/${link.name}`}
//             className={`${
//               pathname === `/${link.name}` && "bg-main-color text-white"
//             } my-2 text-main-color rounded-2xl p-4 hover:bg-main-color hover:text-white transition-colors`}
//           >
//             {link.icon}
//           </Link>
//         ))}
//       </div>
//       <div className="w-full mx-auto flex flex-col items-center">
//         {options.map((option) => (
//           <Link
//             key={option.name}
//             href={`/${option.name}`}
//             className={`${
//               pathname === `/${option.name}` && "bg-main-color text-white"
//             } my-2 text-main-color rounded-2xl p-3 hover:bg-main-color hover:text-white transition-colors`}
//           >
//             {option.icon}
//           </Link>
//         ))}
//       </div>
//       <button className="cursor-pointer absolute top-23 -right-4"><ChevronRight className="text-white bg-main-color w-8 h-8 rounded-full" /></button>
//     </aside>
//   );
// };
// export default Sidebar;
