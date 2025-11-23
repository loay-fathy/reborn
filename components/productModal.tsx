import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import GenericModal from "./ui/modal";
import OvalLine from "./ui/ovalLine";

interface Product {
  id?: number;
  name: string;
  description?: string;
  barcode?: string;
  imageUrl: string | null;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  categoryId?: number;
  categoryName?: string;
}

interface Category {
  id: number;
  name: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const defaultProduct: Product = {
    name: "",
    imageUrl: "",
    price: 0,
    stockQuantity: 0,
    isActive: true,
    categoryId: undefined,
  };

  const [formData, setFormData] = useState<Product>(product || defaultProduct);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(product || defaultProduct);
      fetchCategories();
    }
  }, [isOpen, product]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        // Set default category if creating new product and categories exist
        if (!product && data.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.categoryId) {
      alert("Please fill in all required fields (Name, Category)");
      return;
    }
    console.log(formData);
    onSave(formData);
    onClose();
  };

  const handleChange = (
    field: keyof Product,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        handleChange("imageUrl", data.imageUrl);
      } else {
        console.error("Failed to upload image");
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  // Active Toggle Component
  const ActiveToggle = (
    <>
      <span className="text-xs md:text-sm lg:text-3xl text-black">Active</span>
      <button
        type="button"
        onClick={() => handleChange("isActive", !formData.isActive)}
        className={`relative inline-flex h-6 w-12 sm:h-7 sm:w-14 md:h-8 md:w-16 lg:h-10 lg:w-20 items-center rounded-full transition-colors ${formData.isActive ? "bg-main-color" : "bg-secondary-color"
          }`}
      >
        <span className="sr-only">Toggle active</span>
        <motion.span
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className={`inline-block h-5 w-5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6 lg:h-8 lg:w-8 transform rounded-full bg-white shadow-lg ${formData.isActive
            ? "translate-x-6 sm:translate-x-7 md:translate-x-8 lg:translate-x-11"
            : "translate-x-1"
            }`}
        />
        {formData.isActive && (
          <span className="absolute left-1 sm:left-1.5 md:left-2 text-[8px] sm:text-[9px] md:text-xs font-bold text-white">
            ON
          </span>
        )}
      </button>
    </>
  );

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={formData.name || "New Product"}
      subtitle={formData.price ? `$${formData.price}` : "$0.00"}
      imageSrc={formData.imageUrl || "/images/product.jpg"}
      headerAction={ActiveToggle}
      // Pass the handler to GenericModal so clicking the header image triggers upload
      // Note: GenericModal needs to support 'onImageClick' prop
      onImageClick={handleImageClick}
    >
      <div className="">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Active Toggle - Mobile Only */}
        <div className="flex sm:hidden items-center justify-between py-2 border-b">
          <label className="text-sm font-semibold text-secondary-color">
            Active
          </label>
          <button
            type="button"
            onClick={() => handleChange("isActive", !formData.isActive)}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${formData.isActive ? "bg-main-color" : "bg-secondary-color"
              }`}
          >
            <span className="sr-only">Toggle active</span>
            <motion.span
              layout
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ${formData.isActive ? "translate-x-6" : "translate-x-1"
                }`}
            />
            {formData.isActive && (
              <span className="absolute left-1 text-[8px] font-bold text-white">
                ON
              </span>
            )}
          </button>
        </div>

        {/* Name Field */}
        <div className="flex items-center justify-between py-2 sm:py-3 md:py-4">
          <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black w-1/3">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Product Name"
            className="text-sm sm:text-base md:text-xl lg:text-2xl text-secondary-color text-right outline-none w-2/3 placeholder:text-secondary-color/50"
          />
        </div>

        {/* Category Field */}
        <div className="flex items-center justify-between py-2 sm:py-3 md:py-4">
          <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black w-1/3">
            Category
          </label>
          <select
            value={formData.categoryId || ""}
            onChange={(e) => handleChange("categoryId", Number(e.target.value))}
            className="text-sm sm:text-base md:text-xl lg:text-2xl text-secondary-color text-right outline-none w-2/3 bg-transparent cursor-pointer"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Field */}
        <div className="flex items-center justify-between py-2 sm:py-3 md:py-4">
          <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black w-1/3">
            Price
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              handleChange("price", parseFloat(e.target.value) || 0)
            }
            placeholder="0.00"
            className="text-sm sm:text-base md:text-xl lg:text-2xl text-secondary-color text-right outline-none w-2/3 placeholder:text-secondary-color/50"
          />
        </div>

        {/* Stock Field */}
        <div className="flex items-center justify-between py-2 sm:py-3 md:py-4">
          <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black w-1/3">
            Stock
          </label>
          <input
            type="number"
            value={formData.stockQuantity}
            onChange={(e) =>
              handleChange("stockQuantity", parseInt(e.target.value) || 0)
            }
            placeholder="0"
            className="text-sm sm:text-base md:text-xl lg:text-2xl text-secondary-color text-right outline-none w-2/3 placeholder:text-secondary-color/50"
          />
        </div>
        <OvalLine />

        {/* Save Button */}
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 sm:mt-6 md:mt-8 w-full sm:w-auto bg-main-color hover:bg-main-color text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold px-8 sm:px-10 md:px-20 py-2.5 sm:py-3 md:py-5 rounded-xl sm:rounded-2xl shadow-lg transition-colors"
        >
          Save Change
        </motion.button>
      </div>
    </GenericModal>
  );
};

export default ProductModal;