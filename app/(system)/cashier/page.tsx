"use client";
import CashierNav from "@/components/cashier/nav";
import { Coins, CreditCard, Search } from "lucide-react";
import ProductCard from "@/components/cashier/productCard";
import CheckoutProductItem from "@/components/cashier/checkoutProductItem";
import { motion } from "motion/react";
import OvalLine from "@/components/ui/ovalLine";
import { useState, useEffect } from "react";
import Pagination from "@/components/ui/pagination";

interface Product {
  id: number;
  image: string;
  name: string;
  price: number;
  stock: number;
}

const checkoutItems = [
  {
    id: 1,
    image: "/images/product.jpg",
    name: "Cappuccino",
    price: 4.5,
    quantity: 2,
  },
];

const subtotal = checkoutItems
  .reduce((total, item) => total + item.price * item.quantity, 0)
  .toFixed(2);

const discount = (parseFloat(subtotal) * 0.1).toFixed(2);

export default function Cashier() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategoryId !== null) {
          params.append("categoryId", selectedCategoryId.toString());
        }
        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }
        params.append("pageNumber", currentPage.toString());
        params.append("pageSize", pageSize.toString());

        const url = `/api/products${params.toString() ? `?${params.toString()}` : ""}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          setProducts(data.data);
          setTotalRecords(data.totalRecords || 0);
        } else if (Array.isArray(data)) {
          // Fallback for old API structure if needed
          setProducts(data);
          setTotalRecords(data.length);
        } else {
          setProducts([]);
          setTotalRecords(0);
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
        setError(errorMessage);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryId, searchQuery, currentPage, pageSize]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId, searchQuery]);

  return (
    <div className="w-full grid grid-cols-7 gap-6 mt-4">
      <CashierNav onCategoryChange={setSelectedCategoryId} />
      <div className="bg-white rounded-l-4xl col-span-2 flex flex-row items-center justify-center gap-3 px-10">
        <Search className="text-main-color" size={30} />
        <input
          type="text"
          placeholder="Search Menu"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-full p-2 rounded-l-2xl outline-none placeholder:font-semibold placeholder:text-secondary-color placeholder:text-xl"
        />
      </div>
      <div className="col-span-5 flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-secondary-color">products are loading...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-red-500">Error loading products: {error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-secondary-color">No products available</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && totalRecords > 0 && (
          <div className="mt-auto">
            <Pagination
              currentPage={currentPage}
              totalItems={totalRecords}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <section className="col-span-2 h-lvh flex flex-col justify-between bg-white rounded-4xl">
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-220px)] p-5">
          {checkoutItems.map((item) => (
            <CheckoutProductItem key={item.id} product={item} />
          ))}
        </div>

        <div className="flex flex-col gap-1 mt-4 p-5">
          <div className="flex justify-between text-lg">
            <p className="font-semibold text-secondary-color text-lg">
              Sub Total:
            </p>
            <p className="font-extrabold ">${subtotal}</p>
          </div>
          <div className="flex justify-between text-lg">
            <p className="font-semibold text-secondary-color text-lg">
              Discount:
            </p>
            <p className="font-extrabold ">${discount}</p>
          </div>
          <OvalLine className="my-4 h-px" />
          <div className="flex justify-between text-lg">
            <p className="font-semibold text-secondary-color text-lg">Total:</p>
            <p className="font-extrabold ">
              {(parseFloat(subtotal) - parseFloat(discount)).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 items-end">
          <motion.button className="w-4/7 flex items-center justify-center gap-3 text-xl bg-secondary-color text-white font-bold py-4 rounded-l-4xl cursor-pointer">
            <CreditCard size={35} />
            Card
          </motion.button>
          <motion.button className="w-4/7 flex items-center justify-center gap-3 text-xl bg-secondary-color text-white font-bold py-4 rounded-l-4xl cursor-pointer">
            <Coins size={35} />
            Cash
          </motion.button>
          <button className="w-full bg-black text-white text-xl font-bold py-4 rounded-l-4xl cursor-pointer">
            Confirm Order
          </button>
        </div>
      </section>
    </div>
  );
}
