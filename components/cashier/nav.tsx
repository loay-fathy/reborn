"use client";
import { TextAlignStart } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Category {
  id: number;
  name: string;
}

interface CashierNavProps {
  onCategoryChange?: (categoryId: number) => void;
}

export default function CashierNav({ onCategoryChange }: CashierNavProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          const firstCategoryId = data[0].id;
          setSelectedCategoryId(firstCategoryId);
          if (onCategoryChange) {
            onCategoryChange(firstCategoryId);
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "حدث خطأ غير متوقع";
        setError(errorMessage);
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Move clicked category to the top
  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);

    // reorder array: clicked item first, rest follow
    setCategories((prev) => {
      const clickedCategory = prev.find((cat) => cat.id === categoryId);
      const otherCategories = prev.filter((cat) => cat.id !== categoryId);
      return clickedCategory ? [clickedCategory, ...otherCategories] : prev;
    });

    setIsOpen(false);

    // Notify parent component about category change
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="relative col-span-5 h-20">
      <div className="col-span-2 flex items-start absolute right-0 left-0 justify-between gap-5 bg-white rounded-4xl px-4">
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
          <ul className="w-full grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 items-center justify-between gap-5 text-center py-2 ">
            {loading ? (
              <li className="col-span-full py-4 text-secondary-color">
                Loading categories...
              </li>
            ) : error ? (
              <li className="col-span-full py-4 text-red-500">
                Error: {error}
              </li>
            ) : categories.length === 0 ? (
              <li className="col-span-full py-4 text-secondary-color">
                No categories available
              </li>
            ) : (
              categories.map((category) => (
                <li
                  key={category.id}
                  className={`cursor-pointer py-4 rounded-3xl text-xl font-semibold text-secondary-color hover:bg-main-color hover:text-white ${
                    selectedCategoryId === category.id
                      ? " bg-main-color text-white"
                      : ""
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name.length > 12
                    ? category.name.slice(0, 10) + "..."
                    : category.name}
                </li>
              ))
            )}
          </ul>
        </motion.div>

        {/* TOGGLE BUTTON */}
        <button className="mt-[26px] mr-2" onClick={() => setIsOpen(!isOpen)}>
          <TextAlignStart
            className="text-main-color cursor-pointer mx-auto"
            fontWeight={800}
          />
        </button>
      </div>
    </div>
  );
}
