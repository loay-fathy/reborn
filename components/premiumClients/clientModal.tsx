import React, { useState } from "react";
import { motion } from "framer-motion";
import GenericModal from "../ui/modal"; // Import the new reusable component

// Types
interface Client {
  name: string;
  image: string;
  discountPercentage: string;
  phoneNumber: string;
  active: boolean;
}

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
    name: "",
    image: "",
    discountPercentage: "",
    phoneNumber: "",
    active: true,
  };
  const [formData, setFormData] = useState<Client>(defaultValues);

  // 2. THIS IS THE KEY: Sync state when the `client` prop changes
  // If client exists, fill form. If null, reset to defaults.
  React.useEffect(() => {
    if (isOpen) {
      setFormData(client || defaultValues);
    }
  }, [client, isOpen]);

  const handleChange = (field: keyof Client, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.discountPercentage) return;
    onSave(formData);
    onClose();
  };

  // Reusable Toggle UI (defined here to reuse in Header AND Mobile view)
  const ActiveToggle = (
    <>
      <span className="text-xs md:text-sm lg:text-3xl text-black sm:block hidden">
        Active
      </span>
      <button
        type="button"
        onClick={() => handleChange("active", !formData.active)}
        className={`relative inline-flex h-6 w-12 sm:h-7 sm:w-14 md:h-8 md:w-16 lg:h-10 lg:w-20 items-center rounded-full transition-colors ${
          formData.active ? "bg-main-color" : "bg-secondary-color"
        }`}
      >
        <span className="sr-only">Toggle active</span>
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`inline-block h-5 w-5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6 lg:h-8 lg:w-8 transform rounded-full bg-white shadow-lg ${
            formData.active
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
      title={formData.name || "New Client"}
      subtitle={formData.discountPercentage || "No discount set"}
      imageSrc={client?.image}
      headerAction={ActiveToggle} // Pass the toggle to the header
    >
      <div className="">
        {/* Mobile Only Active Toggle (Matches your original design) */}
        <div className="flex sm:hidden items-center justify-between py-2 border-b">
          <label className="text-sm font-semibold text-secondary-color">
            Active
          </label>
          {ActiveToggle}
        </div>

        {/* --- Inputs Section --- */}

        <div className="flex items-center justify-between py-2 sm:py-3 md:py-4">
          <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black w-1/3">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Your name"
            className="text-sm sm:text-base md:text-xl lg:text-2xl text-secondary-color text-right outline-none w-2/3 placeholder:text-secondary-color"
          />
        </div>

        <div className="flex items-center justify-between py-2 sm:py-3 md:py-4">
          <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black w-1/3">
            Discount
          </label>
          <input
            type="text"
            value={formData.discountPercentage}
            onChange={(e) => handleChange("discountPercentage", e.target.value)}
            placeholder="0%"
            className="text-sm sm:text-base md:text-xl lg:text-2xl text-secondary-color text-right outline-none w-2/3 placeholder:text-secondary-color"
          />
        </div>

        <div className="flex items-center justify-between py-2 sm:py-3 md:py-4">
          <label className="text-sm sm:text-base md:text-xl lg:text-3xl text-black w-1/3">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder="+1 234 567"
            className="text-sm sm:text-base md:text-xl lg:text-2xl text-secondary-color text-right outline-none w-2/3 placeholder:text-secondary-color"
          />
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 sm:mt-6 md:mt-8 w-full sm:w-auto bg-main-color hover:bg-main-color text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold px-8 sm:px-10 md:px-20 py-2.5 sm:py-3 md:py-5 rounded-xl sm:rounded-2xl shadow-lg transition-colors"
        >
          Save Changes
        </motion.button>
      </div>
    </GenericModal>
  );
};

export default ClientModal;
