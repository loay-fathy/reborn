"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, X } from "lucide-react"

interface OrderModalProps {
    isOpen: boolean
    onClose: () => void
    status: "success" | "failed"
}

export function OrderModal({ isOpen, onClose, status }: OrderModalProps) {
    const isSuccess = status === "success"

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                    >
                        <div className="bg-white text-card-foreground rounded-xl shadow-xl p-8 mx-4">
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, type: "spring", damping: 15, stiffness: 200 }}
                                className="flex justify-center mb-6"
                            >
                                {isSuccess ? (
                                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                                        <XCircle className="w-12 h-12 text-red-500" />
                                    </div>
                                )}
                            </motion.div>

                            {/* Text */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-center"
                            >
                                <h2 className="text-2xl font-semibold mb-2">{isSuccess ? "Commande Réussie!" : "Échec de la Commande"}</h2>
                                <p className="text-muted-foreground">
                                    {isSuccess
                                        ? "Votre commande a été passée avec succès. Merci pour votre achat!"
                                        : "Un problème est survenu avec votre commande. Veuillez réessayer plus tard."}
                                </p>
                            </motion.div>

                            {/* Button */}
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                onClick={onClose}
                                className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-white transition-colors ${isSuccess ? "bg-main-color hover:bg-main-color/80" : "bg-red-500 hover:bg-red-600"
                                    }`}
                            >
                                {isSuccess ? "Continuer les Achats" : "Réessayer"}
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
