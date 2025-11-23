// components/UserModal.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GenericModal from "./ui/modal";
import { User, emptyUser, Permission } from "../types/user"; // Adjust path as needed

// --- Configuration ---
const MAIN_COLOR = "bg-[#C2782F]"; // The brownish-orange color
const SECONDARY_TEXT = "text-[#8F9297]"; // The grey text color

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Pass a user object to edit, or null to create a new user */
  user?: User | null;
  onSave: (userData: User) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  // Initialize form data. Use passed user if editing, otherwise use empty structure.
  const [formData, setFormData] = useState<User>(user || emptyUser);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  // Local state for permission toggles. 
  // We need to map the user's permissions (string) to this, but for now we'll just keep them independent 
  // or assume we start fresh/default.
  // If the API provided a list of user permissions, we would map them here.
  const [permissionToggles, setPermissionToggles] = useState<Record<string, boolean>>({});

  // Fetch permissions on mount
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await fetch("/api/permissions");
        if (!res.ok) throw new Error("Failed to fetch permissions");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAvailablePermissions(data);
          // Initialize toggles to false if not already set
          const initialToggles: Record<string, boolean> = {};
          data.forEach(p => {
            initialToggles[p.name] = false;
          });
          setPermissionToggles(prev => ({ ...initialToggles, ...prev }));
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    fetchPermissions();
  }, []);

  // Reset form when modal opens or the user prop changes
  useEffect(() => {
    setFormData(user || emptyUser);
    // Reset toggles or map user permissions here if possible
    // For now, we just reset to defaults or keep existing if we had logic
  }, [user, isOpen]);

  // Handlers for form updates
  const handleTextChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleActiveToggle = (isActive: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: isActive }));
  };

  const handlePermissionToggle = (name: string) => {
    setPermissionToggles((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSubmit = () => {
    // Add validation here if needed (e.g., require name)
    if (!formData.fullName.trim()) {
      alert("Please enter a name");
      return;
    }
    // We might want to save the toggles back to the user object somehow
    // For now, just passing the formData as is
    onSave(formData);
    onClose();
  };

  // Helper to convert camelCase keys to "Title Case" labels (e.g., "editPrice" -> "Edit Price")
  const formatLabel = (key: string) => {
    const result = key.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  // --- The Header "Active" Toggle Component ---
  const headerActiveToggle = (
    <div className="flex items-center gap-2 md:gap-6">
      <span className={`text-sm md:text-lg lg:text-2xl ${SECONDARY_TEXT}`}>
        Active
      </span>
      <ToggleSwitch
        checked={formData.isActive}
        onChange={handleActiveToggle}
        showLabels={true}
      />
    </div>
  );

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={formData.fullName || "New User"}
      subtitle={formData.role || "Role undefined"}
      imageSrc={formData.image} // Will use default in GenericModal if undefined
      headerAction={headerActiveToggle}
    >
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* --- Main Info Section --- */}
          <div className="space-y-4 py-2">
            {/* Name Input */}
            <div className="flex items-center justify-between">
              <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black font-medium">
                Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleTextChange("fullName", e.target.value)}
                placeholder="Enter name"
                className={`text-sm sm:text-base md:text-xl lg:text-2xl ${SECONDARY_TEXT} text-right outline-none w-2/3 bg-transparent placeholder:${SECONDARY_TEXT}/50`}
              />
            </div>

            {/* Username Input */}
            <div className="flex items-center justify-between">
              <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black font-medium">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleTextChange("username", e.target.value)}
                placeholder="Enter username"
                className={`text-sm sm:text-base md:text-xl lg:text-2xl ${SECONDARY_TEXT} text-right outline-none w-2/3 bg-transparent placeholder:${SECONDARY_TEXT}/50`}
              />
            </div>

            {/* Role Input */}
            <div className="flex items-center justify-between">
              <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black font-medium">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => handleTextChange("role", e.target.value)}
                placeholder="Enter role"
                className={`text-sm sm:text-base md:text-xl lg:text-2xl ${SECONDARY_TEXT} text-right outline-none w-2/3 bg-transparent placeholder:${SECONDARY_TEXT}/50`}
              />
            </div>
          </div>

          {/* Separator before permissions (Optional, based on preference) */}
          <div className="w-full h-1 bg-[radial-gradient(ellipse_at_center,#432C2C,#501C1C00,transparent_100%)]"></div>

          {/* --- Permissions Grid Section --- */}
          {/* Using CSS Grid to create the 3-column layout shown in the image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 sm:gap-y-6 lg:gap-y-8 py-4">
            {availablePermissions.map((permission) => (
              <div key={permission.name} className="flex items-center justify-between">
                <label className="text-sm sm:text-base md:text-lg lg:text-2xl text-black font-medium truncate mr-2">
                  {formatLabel(permission.name)}
                </label>
                <ToggleSwitch
                  checked={!!permissionToggles[permission.name]}
                  onChange={() => handlePermissionToggle(permission.name)}
                  showLabels={true}
                  size="sm" // Slightly smaller toggles for the grid
                />
              </div>
            ))}
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
            Save Change
          </motion.button>
        </div>
      </div>
    </GenericModal>
  );
};

export default UserModal;

// ==========================================
// Internal Reusable Toggle Switch Component
// ==========================================
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
  // Sizing mappings based on the original code's responsive classes
  const containerClasses =
    size === "default"
      ? "h-7 w-14 md:h-8 md:w-16 lg:h-10 lg:w-20"
      : "h-6 w-12 sm:h-7 sm:w-14 lg:h-9 lg:w-[4.5rem]"; // Slightly smaller for grid

  const knobClasses =
    size === "default"
      ? "h-5.5 w-5.5 md:h-6 md:w-6 lg:h-8 lg:w-8"
      : "h-5 w-5 sm:h-5.5 sm:w-5.5 lg:h-7 lg:w-7";

  // Calculate translation distance based on width minus knob size minus padding
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
