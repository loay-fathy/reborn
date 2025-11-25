import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import GenericModal from "../ui/modal";
import { Client } from "@/types/premiumClients";
import { getAuthToken } from "@/lib/auth";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onSave: (client: Client) => void;
}

const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  client,
  onSave,
}) => {
  const defaultValues: Client = {
    id: 0,
    name: "",
    image: "",
    discountPercentage: 0,
    currentBalance: 0,
    active: true,
    phoneNumber: "",
    address: "",
    createdAt: new Date().toISOString(),
  };
  const [formData, setFormData] = useState<Client>(defaultValues);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when the `client` prop changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData(client || defaultValues);
    }
  }, [client, isOpen]);

  const handleChange = (field: keyof Client, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const token = getAuthToken();
      const res = await fetch("/api/images/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        handleChange("image", data.imageUrl);
      } else {
        console.error("Failed to upload image");
        alert("Échec du téléchargement de l'image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.name) {
      alert("Veuillez entrer un nom");
      return;
    }
    onSave(formData);
    onClose();
  };

  // Reusable Toggle UI
  const ActiveToggle = (
    <>
      <span className="text-xs md:text-sm lg:text-3xl text-black sm:block hidden">
        Actif
      </span>
      <button
        type="button"
        onClick={() => handleChange("active", !formData.active)}
        className={`relative inline-flex h-6 w-12 sm:h-7 sm:w-14 md:h-8 md:w-16 lg:h-10 lg:w-20 items-center rounded-full transition-colors ${formData.active ? "bg-main-color" : "bg-secondary-color"
          }`}
      >
        <span className="sr-only">Toggle active</span>
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`inline-block h-5 w-5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6 lg:h-8 lg:w-8 transform rounded-full bg-white shadow-lg ${formData.active
            ? "translate-x-6 sm:translate-x-7 md:translate-x-8 lg:translate-x-11"
            : "translate-x-1"
            }`}
        />
        {formData.active && (
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
      title={formData.name || "Nouveau Client"}
      subtitle={formData.discountPercentage ? formData.discountPercentage + "%" : "Aucune remise définie"}
      imageSrc={formData.image}
      headerAction={ActiveToggle}
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

        {/* Loading Overlay for Image Upload */}
        {isUploading && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <div className="bg-white p-3 rounded-xl shadow-lg flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C2782F] mb-2"></div>
              <span className="text-xs font-semibold text-gray-600">Téléchargement...</span>
            </div>
          </div>
        )}

        {/* Mobile Only Active Toggle */}
        <div className="flex sm:hidden items-center justify-between py-2 border-b">
          <label className="text-sm font-semibold text-secondary-color">
            Actif
          </label>
          {ActiveToggle}
        </div>

        {/* --- Inputs Section --- */}

        <div className="flex items-center justify-between py-2 sm:py-3 md:py-4">
          <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black w-1/3">
            Nom
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Votre nom"
            className="text-sm sm:text-base md:text-xl lg:text-2xl text-right outline-none w-2/3 placeholder:text-secondary-color"
          />
        </div>

        <div className="flex items-center justify-between py-2 sm:py-3 md:py-4">
          <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black w-1/3">
            Remise
          </label>
          <input
            type="number"
            value={formData.discountPercentage}
            onChange={(e) => handleChange("discountPercentage", Number(e.target.value))}
            placeholder="0%"
            className="text-sm sm:text-base md:text-xl lg:text-2xl text-right outline-none w-2/3 placeholder:text-secondary-color"
          />
        </div>

        <div className="flex items-center justify-between py-2 sm:py-3 md:py-4">
          <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black w-1/3">
            Solde
          </label>
          <input
            type="number"
            value={formData.currentBalance}
            onChange={(e) => handleChange("currentBalance", Number(e.target.value))}
            placeholder="0"
            className="text-sm sm:text-base md:text-xl lg:text-2xl text-right outline-none w-2/3 placeholder:text-secondary-color"
          />
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 sm:mt-6 md:mt-8 w-full sm:w-auto bg-main-color hover:bg-main-color text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold px-8 sm:px-10 md:px-20 py-2.5 sm:py-3 md:py-5 rounded-xl sm:rounded-2xl shadow-lg transition-colors"
        >
          Enregistrer les Modifications
        </motion.button>
      </div>
    </GenericModal>
  );
};

export default ClientModal;
