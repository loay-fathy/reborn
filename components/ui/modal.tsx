import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import OvalLine from "./ovalLine";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  imageSrc?: string;
  /**
   * Optional component to render in the header (e.g., the Active Toggle)
   * It will be wrapped in 'hidden sm:flex' to match your original responsive design
   */
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  /**
   * Optional handler for clicking the header image (e.g., to trigger file upload)
   */
  onImageClick?: () => void;
}

const GenericModal: React.FC<GenericModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  imageSrc,
  headerAction,
  children,
  onImageClick,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 bg-white/10 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
          >
            <div className="bg-white w-full sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] rounded-3xl sm:rounded-4xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* --- Header Section --- */}
              <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 lg:p-8 shrink-0">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-8">
                  {/* Profile Image - Clickable if onImageClick is provided */}
                  <div
                    onClick={onImageClick}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-30 lg:h-30 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shrink-0 ${onImageClick
                      ? "cursor-pointer hover:opacity-90 transition-opacity"
                      : ""
                      }`}
                  >
                    <Image
                      src={imageSrc || "/images/profile.jpg"}
                      width={120}
                      height={120}
                      alt={title}
                      className="w-full h-full object-cover rounded-full"
                    />

                    {/* Badge / Icon Overlay */}
                    <div className="absolute bottom-0 right-0 bg-main-color rounded-full lg:p-3 md:p-1">
                      {/* If clickable, we might want to hint it's editable, but keeping original icon for now */}
                      <svg
                        className="w-2 h-2 sm:w-3 sm:h-3 md:w-6 md:h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        {/* You might want to switch this to a Camera/Edit icon if onImageClick is present */}
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="min-w-0 flex-1">
                    <h2 className="mb-1 text-sm sm:text-lg md:text-2xl lg:text-3xl text-black truncate">
                      {title}
                    </h2>
                    {subtitle && (
                      <p className="text-xs sm:text-sm md:text-lg lg:text-2xl text-secondary-color truncate">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Header Actions (Toggle & Close) */}
                <div className="flex flex-col-reverse items-end gap-2 sm:gap-3 md:gap-4 lg:gap-8 shrink-0">
                  {headerAction && (
                    <div className="hidden sm:flex items-center gap-2 md:gap-10">
                      {headerAction}
                    </div>
                  )}

                  <button
                    onClick={onClose}
                    className="text-secondary-color hover:text-gray-600 transition-colors"
                    aria-label="Close modal"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <OvalLine />

              {/* --- Body Section --- */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GenericModal;