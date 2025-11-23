"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

// 1. Define Data Type
interface Product {
  productId: number;
  productName: string;
  totalSold: number;
  totalRevenue: number;
  growthPercentage: number;
}

const TopSellingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/dashboard/topselling?count=4");
        if (!res.ok) throw new Error("Failed to fetch top selling products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching top selling products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    // Changed p-6 to p-4 md:p-6 for better mobile spacing
    <div className="bg-white p-4 md:p-6 rounded-[20px] shadow-sm border border-gray-100 w-full h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-bold text-[#111827]">
          Top Selling Products
        </h2>
      </div>

      {/* List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center text-secondary-color py-10">Loading...</div>
        ) : (
          products.map((product) => (
            <div key={product.productId} className="flex items-center gap-3 md:gap-4">
              {/* Image Wrapper: Responsive Width/Height */}
              {/* Mobile: w-24 h-16 | Desktop: w-40 h-20 */}
              <div className="relative w-24 h-16 md:w-40 md:h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="/images/product.jpg" // Placeholder image
                  alt={product.productName}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info & Price Wrapper */}
              <div className="flex justify-between items-center flex-1 min-w-0">
                {/* Name & Sold Count */}
                <div className="pr-2">
                  <h3 className="font-bold text-[#1F2937] text-sm md:text-base truncate">
                    {product.productName}
                  </h3>
                  <p className="text-secondary-color text-xs md:text-sm font-medium">
                    {product.totalSold} sold
                  </p>
                </div>

                {/* Price & Growth */}
                <div className="text-right shrink-0">
                  <p className="font-black text-[#1F2937] text-sm md:text-lg">
                    ${product.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-emerald-500 text-[10px] md:text-xs font-bold">
                    +{product.growthPercentage}%
                  </p>
                </div>
              </div>
            </div>
          )))}
      </div>
    </div>
  );
};

export default TopSellingProducts;
