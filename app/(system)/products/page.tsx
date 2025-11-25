"use client";
import { Search, Pencil, Trash2, Package, Plus, X, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import CreationButton from "@/components/ui/creationButton";
import ProductModal from "@/components/productModal";
import CategoryModal from "@/components/categoryModal";
import Pagination from "@/components/ui/pagination";
import { AnimatePresence, motion } from "motion/react";

import { TextAlignStart } from "lucide-react";
import { getAuthToken } from "@/lib/auth";

export function CashierNav({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}) {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [isOpen, setIsOpen] = useState(false);

  const token = getAuthToken();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Move clicked category to the top
  const handleCategoryClick = (categoryId: number) => {
    onSelectCategory(categoryId);
    setIsOpen(false);
  };
  return (
    <motion.div
      className="col-span-5 h-20"
      layout
      transition={{ duration: 0.3 }}
      initial={false}
      animate={{ height: isOpen ? "auto" : 80 }}
    >
      <div className="col-span-2 flex items-start justify-between gap-5 bg-white rounded-4xl px-4">
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 80 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 10,
          }}
          className="overflow-hidden w-full"
        >
          <ul className="w-full grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between gap-5 text-center py-3 ">
            <li
              className={`cursor-pointer py-3 rounded-2xl text-xl font-semibold text-secondary-color hover:bg-main-color hover:text-white ${selectedCategory === null
                ? " bg-main-color text-white"
                : ""
                }`}
              onClick={() => onSelectCategory(null)}
            >
              Tous
            </li>
            {categories.map((category) => (
              <li
                key={category.id}
                className={`cursor-pointer py-3 rounded-2xl text-xl font-semibold text-secondary-color hover:bg-main-color hover:text-white ${selectedCategory === category.id
                  ? " bg-main-color text-white"
                  : ""
                  }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name.length > 8
                  ? category.name.slice(0, 8) + "..."
                  : category.name}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* TOGGLE BUTTON */}
        <button className="mt-7" onClick={() => setIsOpen(!isOpen)}>
          <TextAlignStart
            className="text-main-color cursor-pointer mx-auto"
            fontWeight={800}
          />
        </button>
      </div>
    </motion.div>
  );
}

interface Product {
  id?: number;
  name: string;
  description?: string;
  barcode?: string;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  isActive: boolean;
  categoryId?: number;
  categoryName?: string;
}

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch products when category, search, or page changes
  const token = getAuthToken();
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== null) params.append("categoryId", selectedCategory.toString());
        if (searchQuery) params.append("search", searchQuery);
        params.append("pageNumber", currentPage.toString());
        params.append("pageSize", pageSize.toString());

        const res = await fetch(`/api/products?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        if (data.data && Array.isArray(data.data)) {
          setProducts(data.data);
          setTotalRecords(data.totalRecords || 0);
        } else if (Array.isArray(data)) {
          // Fallback for old API structure if needed
          setProducts(data);
          setTotalRecords(data.length);
        } else {
          console.error("Unexpected API response format", data);
          setProducts([]);
          setTotalRecords(0);
        }

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search if needed, but for now direct fetch
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchQuery, currentPage, pageSize, refreshTrigger]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedProduct: Product) => {
    try {
      let res;
      if (updatedProduct.id) {
        console.log(updatedProduct);
        // Update existing product
        res = await fetch(`/api/products/${updatedProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(updatedProduct),
        });
      } else {
        // Create new product
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(updatedProduct),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save product");
      }

      // Refresh products
      setRefreshTrigger(prev => !prev);
      setIsModalOpen(false);

    } catch (error) {
      console.error("Error saving product:", error);
      alert("Échec de l'enregistrement du produit");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit?")) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to delete product");
        }

        // Refresh products
        setRefreshTrigger(prev => !prev);
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Échec de la suppression du produit");
      }
    }
  };

  return (
    <div className="min-h-screen bg-secondary-text-secondary-color mt-20 mr-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 mx-auto">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <h1 className="text-4xl font-bold text-black">Produits</h1>
          <div className="bg-main-color/10 p-2 rounded-lg">
            <Package className="w-8 h-8 text-main-color" />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4 md:mb-0">
          {/* Search Button/Bar */}
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 text-2xl font-semibold bg-[#1F2937] hover:bg-[#1F2937]/90 text-white px-6 py-4 rounded-3xl transition-colors"
          >
            <SlidersHorizontal size={25} />
            <span className="font-semibold text-2xl">Catégories</span>
          </button>
          <div className="relative flex justify-center z-50">
            <motion.button
              key="search-button"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="flex items-center gap-2 text-2xl font-semibold bg-main-color hover:bg-main-color/90 text-white px-9 py-4 rounded-3xl transition-colors"
            >
              <Search className="w-7 h-7" />
              <span className="font-semibold text-2xl">Rechercher</span>
            </motion.button>

            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  key="search-dropdown"
                  initial={{ opacity: 0, top: -15, right: -15, scale: 0.95 }}
                  animate={{ opacity: 1, top: 0, right: 0, scale: 1 }}
                  exit={{ opacity: 0, top: -15, right: -15, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full w-[50dvw] bg-main-color rounded-4xl p-4 shadow-2xl origin-top"
                >
                  <div className="flex items-center justify-between mb-3 px-2">
                    <input
                      type="text"
                      placeholder="Search for product"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-white placeholder-white/90 outline-none text-lg w-full font-medium"
                    />
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="text-white hover:text-white/80 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <CashierNav
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-4xl p-8 shadow-sm mx-auto overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-left">
              <th className="pb-6 font-bold text-main-color text-lg pl-4">
                Stock
              </th>
              <th className="pb-6 font-bold text-black text-lg w-3/12">
                Photo
              </th>
              <th className="pb-6 font-bold text-black text-lg w-3/12">Name</th>
              <th className="pb-6 font-bold text-black text-lg">Price</th>
              <th className="pb-6 font-bold text-black text-lg">Status</th>
              <th className="pb-6 font-bold text-black text-lg text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="space-y-4">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-xl text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-xl text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-secondary-text-secondary-color transition-colors group"
                >
                  {/* Stock */}
                  <td className="py-4 pl-4 text-xl text-secondary-color font-semibold">
                    {product.stockQuantity}
                  </td>

                  {/* Photo */}
                  <td className="py-4">
                    <div className="w-64 relative overflow-hidden rounded-xl">
                      <Image
                        src={product.imageUrl || "/images/product.jpg"}
                        width={274}
                        height={100}
                        alt={product.name}
                        className="max-w-11/12 rounded-xl h-24 aspect-[2.7/1] object-cover"
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td className="py-4 text-xl font-bold text-secondary-color">
                    {product.name}
                  </td>

                  {/* Price */}
                  <td className="py-4 text-xl font-bold text-secondary-color">
                    ${product.price}
                  </td>

                  {/* Status */}
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-secondary-color">
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                      <div
                        className={`w-3 h-3 rounded-full ${product.isActive
                          ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                          : "bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.6)]"
                          }`}
                      ></div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 rounded-lg hover:bg-blue-50 transition-colors group-hover:scale-110"
                      >
                        <Pencil className="w-6 h-6 text-blue-500 fill-blue-500/10" />
                      </button>
                      <button
                        onClick={() => product.id && handleDelete(product.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors group-hover:scale-110"
                      >
                        <Trash2 className="w-6 h-6 text-red-500 fill-red-500/20" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalRecords > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalRecords}
            itemsPerPage={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <CreationButton
        text="Nouveau produit"
        icon={<Plus />}
        handleOnClick={handleCreate}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSave={handleSave}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        type="product"
      />
    </div>
  );
};

export default Products;
