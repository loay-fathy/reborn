// components/UserModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import GenericModal from "./ui/modal";
import { User, emptyUser } from "../types/user";
import {
  PERMISSION_LIST,
  hasPermission,
  addPermission,
  removePermission
} from "@/lib/permissions";
import { getAuthToken } from "@/lib/auth";

const MAIN_COLOR = "bg-[#C2782F]";
const SECONDARY_TEXT = "text-[#8F9297]";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onSave: (userData: User) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState<User>(user || emptyUser);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Reset form when modal opens or the user prop changes
  useEffect(() => {
    console.log(user)
    const baseUser = user || emptyUser;
    setFormData({
      ...baseUser,
      permissions: baseUser.permissions || 0,
      password: ""
    });
  }, [user, isOpen]);

  const handleTextChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleActiveToggle = (isActive: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: isActive }));
  };

  const handlePermissionToggle = (value: number, isChecked: boolean) => {
    setFormData((prev) => {
      const currentPerms = prev.permissions || 0;
      const newPerms = isChecked
        ? addPermission(currentPerms, value)
        : removePermission(currentPerms, value);
      return { ...prev, permissions: newPerms };
    });
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
        handleTextChange("image", data.imageUrl);
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
    if (!formData.fullName?.trim()) {
      alert("Veuillez entrer un nom complet");
      return;
    }

    // VALIDATION: Only require password if we are creating a NEW user
    if (!user && !formData.password?.trim()) {
      alert("Veuillez créer un mot de passe pour le nouvel utilisateur");
      return;
    }

    onSave(formData);
    onClose();
  };

  const headerActiveToggle = (
    <div className="flex items-center gap-2 md:gap-6">
      <span className={`text-sm md:text-lg lg:text-2xl ${SECONDARY_TEXT}`}>
        Actif
      </span>
      <ToggleSwitch
        checked={!!formData.isActive}
        onChange={handleActiveToggle}
        showLabels={true}
      />
    </div>
  );

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={formData.fullName || "Nouvel Utilisateur"}
      subtitle={formData.role || "Rôle non défini"}
      imageSrc={formData.image}
      headerAction={headerActiveToggle}
      onImageClick={handleImageClick}
    >
      <div className="flex flex-col">
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

        <div className="flex-1 space-y-4 sm:space-y-6 lg:space-y-8">

          {/* --- Main Info Section --- */}
          <div className="space-y-4 py-2">

            {/* 1. Full Name */}
            <div className="flex items-center justify-between">
              <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black font-medium">
                Nom Complet
              </label>
              <input
                type="text"
                value={formData.fullName || ""}
                onChange={(e) => handleTextChange("fullName", e.target.value)}
                placeholder="Entrez le nom complet"
                className={`text-sm sm:text-base md:text-xl lg:text-2xl ${SECONDARY_TEXT} text-right outline-none w-2/3 bg-transparent placeholder:${SECONDARY_TEXT}/50`}
              />
            </div>

            {/* 2. Username */}
            <div className="flex items-center justify-between">
              <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black font-medium">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={formData.username || ""}
                onChange={(e) => handleTextChange("username", e.target.value)}
                placeholder="Entrez le nom d'utilisateur"
                className={`text-sm sm:text-base md:text-xl lg:text-2xl ${SECONDARY_TEXT} text-right outline-none w-2/3 bg-transparent placeholder:${SECONDARY_TEXT}/50`}
              />
            </div>

            {/* 3. Password (HIDDEN if editing an existing user) */}
            {!user && (
              <div className="flex items-center justify-between">
                <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black font-medium">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) => handleTextChange("password", e.target.value)}
                  placeholder="Entrez le mot de passe"
                  className={`text-sm sm:text-base md:text-xl lg:text-2xl ${SECONDARY_TEXT} text-right outline-none w-2/3 bg-transparent placeholder:${SECONDARY_TEXT}/50`}
                />
              </div>
            )}

            {/* 4. Role */}
            <div className="flex items-center justify-between">
              <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black font-medium">
                Rôle
              </label>
              <input
                type="text"
                value={formData.role || ""}
                onChange={(e) => handleTextChange("role", e.target.value)}
                placeholder="Entrez le rôle"
                className={`text-sm sm:text-base md:text-xl lg:text-2xl ${SECONDARY_TEXT} text-right outline-none w-2/3 bg-transparent placeholder:${SECONDARY_TEXT}/50`}
              />
            </div>
          </div>

          <div className="w-full h-1 bg-[radial-gradient(ellipse_at_center,#432C2C,#501C1C00,transparent_100%)]"></div>

          {/* --- Permissions Grid Section --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 sm:gap-y-6 lg:gap-y-8 py-4">
            {PERMISSION_LIST.map((permission) => {
              const isSelected = hasPermission(formData.permissions || 0, permission.value);

              return (
                <div key={permission.value} className="flex items-center justify-between">
                  <div className="flex flex-col mr-2 truncate">
                    <label className="text-sm sm:text-base md:text-lg lg:text-2xl text-black font-medium">
                      {permission.label}
                    </label>
                  </div>

                  <ToggleSwitch
                    checked={isSelected}
                    onChange={(checked) => handlePermissionToggle(permission.value, checked)}
                    showLabels={true}
                    size="sm"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Footer Action --- */}
        <div className="mt-6 shrink-0">
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full sm:w-auto ${MAIN_COLOR} text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-md transition-opacity hover:opacity-90`}
          >
            Enregistrer les Modifications
          </motion.button>
        </div>
      </div>
    </GenericModal>
  );
};

export default UserModal;

// ... (ToggleSwitch component remains the same)
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  showLabels?: boolean;
  size?: "default" | "sm";
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  showLabels = false,
  size = "default",
}) => {
  const containerClasses =
    size === "default"
      ? "h-7 w-14 md:h-8 md:w-16 lg:h-10 lg:w-20"
      : "h-6 w-12 sm:h-7 sm:w-14 lg:h-9 lg:w-[4.5rem]";

  const knobClasses =
    size === "default"
      ? "h-5.5 w-5.5 md:h-6 md:w-6 lg:h-8 lg:w-8"
      : "h-5 w-5 sm:h-5.5 sm:w-5.5 lg:h-7 lg:w-7";

  const translateClass =
    size === "default"
      ? checked
        ? "translate-x-7 md:translate-x-8 lg:translate-x-11"
        : "translate-x-1"
      : checked
        ? "translate-x-6 sm:translate-x-7 lg:translate-x-10"
        : "translate-x-1";

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center rounded-full transition-colors shrink-0 ${containerClasses} ${checked ? MAIN_COLOR : "bg-[#E5E7EB]"
        }`}
    >
      <span className="sr-only">Toggle setting</span>
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`inline-block transform rounded-full bg-white shadow-sm ${knobClasses} ${translateClass}`}
      />
      {showLabels && checked && (
        <span
          className={`absolute left-1.5 md:left-2 font-bold text-white ${size === "default"
            ? "text-[9px] md:text-xs"
            : "text-[8px] sm:text-[9px]"
            }`}
        >
          ON
        </span>
      )}
    </button>
  );
};