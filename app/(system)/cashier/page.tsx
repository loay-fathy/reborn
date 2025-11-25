"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Search, CreditCard, Coins } from "lucide-react";
import { motion } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import Receipt from "@/components/receipt";
import { getAuthToken } from "@/lib/auth";
import CashierNav from "@/components/cashier/nav";
import ProductCard from "@/components/cashier/productCard";
import CheckoutProductItem from "@/components/cashier/checkoutProductItem";
import Pagination from "@/components/ui/pagination";
import OvalLine from "@/components/ui/ovalLine";
import CashModal from "@/components/cashier/cashModal";
import CardModal from "@/components/cashier/cardModal";
import MixedPaymentModal from "@/components/cashier/splitModal";
import { OrderModal } from "@/components/cashier/orderModal";

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  stock: number;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

function CashierContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Receipt State
  const receiptRef = useRef<HTMLDivElement>(null);
  const [receiptData, setReceiptData] = useState<any>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    onAfterPrint: () => setReceiptData(null),
  });

  // Trigger print when receipt data is ready
  useEffect(() => {
    if (receiptData) {
      handlePrint();
    }
  }, [receiptData, handlePrint]);

  // 1. Get ID from URL
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const router = useRouter();

  // Multiple Carts State
  const [carts, setCarts] = useState<CartItem[][]>([[]]);
  const [activeCartIndex, setActiveCartIndex] = useState(0);
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);

  // Payment Method State
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);

  const togglePaymentMethod = (method: string) => {
    setSelectedPaymentMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const isCardSelected = selectedPaymentMethods.includes("card");
  const isCashSelected = selectedPaymentMethods.includes("cash");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const addToCart = (product: Product) => {
    setCarts((prevCarts) => {
      const newCarts = [...prevCarts];
      const currentCart = [...newCarts[activeCartIndex]];
      const existingItemIndex = currentCart.findIndex((item) => item.id === product.id);

      if (existingItemIndex > -1) {
        currentCart[existingItemIndex] = {
          ...currentCart[existingItemIndex],
          quantity: currentCart[existingItemIndex].quantity + 1,
        };
      } else {
        currentCart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
        });
      }

      newCarts[activeCartIndex] = currentCart;
      return newCarts;
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCarts((prevCarts) => {
      const newCarts = [...prevCarts];
      const currentCart = newCarts[activeCartIndex]
        .map((item) => {
          if (item.id === productId) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      newCarts[activeCartIndex] = currentCart;
      return newCarts;
    });
  };

  const addNewCart = () => {
    setCarts((prev) => [...prev, []]);
    setActiveCartIndex(carts.length);
    setIsCartMenuOpen(false);
  };

  const switchCart = (index: number) => {
    setActiveCartIndex(index);
    setIsCartMenuOpen(false);
  };

  const deleteCart = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (carts.length === 1) {
      setCarts([[]]);
      return;
    }

    setCarts((prev) => {
      const newCarts = prev.filter((_, i) => i !== index);
      return newCarts;
    });

    if (activeCartIndex >= index && activeCartIndex > 0) {
      setActiveCartIndex(activeCartIndex - 1);
    } else if (activeCartIndex === index) {
      setActiveCartIndex(0);
    }
  };

  const activeCartItems = carts[activeCartIndex] || [];

  const subtotal = activeCartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  const discountAmount = (parseFloat(subtotal) * discountPercentage) / 100;
  const totalAmount = (parseFloat(subtotal) - discountAmount).toFixed(2);

  const token = getAuthToken();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategoryId !== null) {
          params.append("categoryId", selectedCategoryId.toString());
        }
        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }
        params.append("pageNumber", currentPage.toString());
        params.append("pageSize", pageSize.toString());

        const url = `/api/products${params.toString() ? `?${params.toString()}` : ""}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          setProducts(data.data);
          setTotalRecords(data.totalRecords || 0);
        } else if (Array.isArray(data)) {
          setProducts(data);
          setTotalRecords(data.length);
        } else {
          setProducts([]);
          setTotalRecords(0);
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "unexpected error";
        setError(errorMessage);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryId, searchQuery, currentPage, pageSize, refreshKey, token]);

  // Fetch Premium Client Discount
  useEffect(() => {
    if (idParam) {
      const fetchClient = async () => {
        try {
          const res = await fetch(`/api/customers/${idParam}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            const user = data.data || data;
            setDiscountPercentage(user.discountPercentage || 0);
          }
        } catch (err) {
          console.error("Error fetching client:", err);
          router.push(`/premiumclient/${idParam}`);
        }
      };
      fetchClient();
    }
  }, [idParam, token, router]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId, searchQuery]);

  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);

  // State for split modal visibility options
  const [splitModalConfig, setSplitModalConfig] = useState({ showCash: true, showCard: true });

  // Order Modal State
  const [orderModal, setOrderModal] = useState<{ isOpen: boolean; status: "success" | "failed" }>({
    isOpen: false,
    status: "success",
  });

  const processSale = async (details: { change: number; method: string; cashAmount?: number; cardAmount?: number }) => {
    try {
      // 2. Map sale details from cart (used in both scenarios)
      const saleDetails = activeCartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      let payload;

      if (idParam) {
        // --- SCENARIO: ID PARAM EXISTS ---
        const totalPaid = (details.cashAmount || 0) + (details.cardAmount || 0);

        // Determine method name for backend
        let finalMethod = "Cash";
        if (details.cardAmount && details.cardAmount > 0 && (!details.cashAmount || details.cashAmount === 0)) {
          finalMethod = "Card";
        } else if (details.cardAmount && details.cardAmount > 0 && details.cashAmount && details.cashAmount > 0) {
          finalMethod = "split";
        }

        payload = {
          saleDetails: saleDetails, // Actual cart data
          paymentMethod: finalMethod,
          amountPaid: totalPaid,
          customerId: parseInt(idParam) || 0, // ID from param
          splitCashAmount: details.cashAmount || 0,
          splitCardAmount: details.cardAmount || 0
        };

      } else {
        // --- SCENARIO: STANDARD SALE ---
        payload = {
          saleDetails,
          paymentMethod: details.method,
          splitCashAmount: details.cashAmount || 0,
          splitCardAmount: details.cardAmount || 0,
        };
      }

      console.log("Sending Payload:", payload);

      const response = await fetch("/api/sale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process sale");
      }

      console.log(`Order Confirmed! Change: $${details.change.toFixed(2)}`);

      // Show Success Modal
      setOrderModal({ isOpen: true, status: "success" });
      // Trigger product refetch
      setRefreshKey((prev) => prev + 1);

      // Prepare receipt data
      const currentSubtotal = activeCartItems
        .reduce((total, item) => total + item.price * item.quantity, 0);
      const currentDiscountAmount = (currentSubtotal * discountPercentage) / 100;
      const currentTotalAmount = currentSubtotal - currentDiscountAmount;

      const cashierName = localStorage.getItem("fullName") || "Cashier";

      // Calculate receipt values based on client type
      let amountPaid: number;
      let changeAmount: number;

      if (!idParam) {
        // For normal clients: they pay in full, so amountPaid = total + change
        changeAmount = details.change;
        amountPaid = currentTotalAmount + changeAmount;
      } else {
        // For premium clients: they can pay partially
        amountPaid = (details.cashAmount || 0) + (details.cardAmount || 0);
        changeAmount = 0; // No change for credit sales
      }

      setReceiptData({
        sale: {
          cashierName,
          subTotal: currentSubtotal.toFixed(2),
          discount: currentDiscountAmount.toFixed(2),
          totalAmount: currentTotalAmount.toFixed(2),
          date: new Date().toLocaleString(),
          amountPaid: amountPaid.toFixed(2),
          change: changeAmount.toFixed(2),
        },
        cartItems: activeCartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      });

      // Clear current cart
      setCarts((prev) => {
        const newCarts = [...prev];
        newCarts[activeCartIndex] = [];
        return newCarts;
      });

      setIsCashModalOpen(false);
      setIsCardModalOpen(false);
      setIsSplitModalOpen(false);

    } catch (err) {
      console.error("Sale Error:", err);
      setOrderModal({ isOpen: true, status: "failed" });
    }
  };

  const handleConfirmOrder = () => {
    if (activeCartItems.length === 0) {
      alert("Le panier est vide!");
      return;
    }

    const isCash = selectedPaymentMethods.includes("cash");
    const isCard = selectedPaymentMethods.includes("card");

    if (!isCash && !isCard) {
      alert("Veuillez sélectionner un mode de paiement.");
      return;
    }

    // 3. Logic for ID Param exists: Always use Split Modal, control visibility
    if (idParam) {
      setSplitModalConfig({
        showCash: isCash,
        showCard: isCard
      });
      setIsSplitModalOpen(true);
      return;
    }

    // Standard Logic
    if (isCash && isCard) {
      setSplitModalConfig({ showCash: true, showCard: true });
      setIsSplitModalOpen(true);
    } else if (isCash) {
      setIsCashModalOpen(true);
    } else if (isCard) {
      setIsCardModalOpen(true);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-2rem)] grid grid-cols-7 grid-rows-[auto_1fr] gap-6 mt-4 overflow-hidden">
      {/* Hidden Receipt Component */}
      <div style={{ display: "none" }}>
        {receiptData && (
          <Receipt
            ref={receiptRef}
            sale={receiptData.sale}
            cartItems={receiptData.cartItems}
          />
        )}
      </div>

      {/* ... Left Side Content (Nav, Search, Products) ... */}
      <div className="col-span-5 flex flex-row gap-4">

        {idParam ? (<div className="relative z-40">
          <button
            className="relative bg-white w-20 h-20 flex items-center justify-center rounded-4xl cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => router.push(`/premiumClients/${idParam}`)}
          >
            <ArrowLeft size={35} className="text-main-color" />
          </button>
        </div>) : <div className="relative z-40">
          <button
            className="relative bg-white w-30 h-20 flex items-center justify-center rounded-4xl cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsCartMenuOpen(!isCartMenuOpen)}
          >
            <Image src="/icons/cartIcon.svg" alt="cartIcon" width={35} height={35} />
            <span className="absolute top-0 right-0 w-5 h-5 text-white text-xs flex items-center justify-center bg-main-color rounded-full">
              {activeCartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </button>

          {isCartMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <span className="font-bold text-gray-700">Paniers</span>
                <button
                  onClick={addNewCart}
                  className="text-xs bg-main-color text-white px-2 py-1 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  + Nouveau Panier
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {carts.map((cart, index) => (
                  <div
                    key={index}
                    onClick={() => switchCart(index)}
                    className={`p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors ${activeCartIndex === index ? 'bg-orange-50 border-l-4 border-main-color' : ''}`}
                  >
                    <div className="flex flex-col">
                      <span className={`font-medium ${activeCartIndex === index ? 'text-main-color' : 'text-gray-700'}`}>
                        Panier #{index + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        {cart.reduce((acc, item) => acc + item.quantity, 0)} articles
                      </span>
                    </div>
                    <button
                      onClick={(e) => deleteCart(index, e)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Supprimer le Panier"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>}
        <CashierNav onCategoryChange={setSelectedCategoryId} />

      </div>
      <div className="bg-white rounded-l-4xl col-span-2 flex flex-row items-center justify-center gap-3 px-10">
        <Search className="text-main-color" size={30} />
        <input
          type="text"
          placeholder="Rechercher Menu"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-full p-2 rounded-l-2xl outline-none placeholder:font-semibold placeholder:text-secondary-color placeholder:text-xl"
        />
      </div>
      <div className="col-span-5 flex flex-col gap-4 overflow-y-auto pr-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-secondary-color">les produits se chargent...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-red-500">Erreur de chargement des produits: {error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-secondary-color">Aucun produit disponible</p>
            </div>
          ) : (
            products.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={addToCart}
                  isInCart={activeCartItems.some((item) => item.id === product.id)}
                />
              )
            })
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && totalRecords > 0 && (
          <div className="mt-auto">
            <Pagination
              currentPage={currentPage}
              totalItems={totalRecords}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <section className="col-span-2 h-full flex flex-col justify-between bg-white rounded-4xl overflow-hidden">
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-5">
          {activeCartItems.length > 0 ? activeCartItems.map((item) => (
            <CheckoutProductItem
              key={item.id}
              item={item}
              onIncrease={() => updateQuantity(item.id, 1)}
              onDecrease={() => updateQuantity(item.id, -1)}
            />
          )) : (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-secondary-color">Aucun article dans le panier</p>
            </div>
          )}
        </div>
        {/* Fixed Bottom Section */}
        <div className="flex-none bg-white">
          <OvalLine className="w-full h-px bg-gray-100" />
          <div className="flex flex-col gap-2 2xl:gap-3 px-5 pt-5 pb-3 2xl:px-7 2xl:pt-7 2xl:pb-5">
            <div className="flex justify-between text-[16px] 2xl:text-[20px] font-semibold">
              <p className="text-secondary-color">Sous-total</p>
              <p className="text-black">${subtotal}</p>
            </div>
            <div className="flex justify-between text-[16px] 2xl:text-[20px] font-semibold">
              <p className="text-secondary-color">Remise</p>
              <p className="text-black">{discountPercentage > 0 ? `${discountPercentage}% (-$${discountAmount.toFixed(2)})` : "0%"}</p>
            </div>
            <OvalLine className="h-px bg-gray-100" />
            <div className="flex justify-between text-[16px] 2xl:text-[20px] font-semibold">
              <p className="text-black">Total</p>
              <p className="text-black">${totalAmount}</p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col gap-y-3 2xl:gap-y-4 items-end w-full">
            <motion.button
              className="flex items-center justify-center gap-3 text-xl 2xl:text-2xl text-white font-bold h-[60px] 2xl:h-[75px] rounded-l-4xl cursor-pointer"
              onClick={() => togglePaymentMethod("card")}
              initial={false}
              animate={{
                width: isCardSelected ? "250px" : "180px",
                backgroundColor: isCardSelected ? "#bc7428" : "#848382",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <CreditCard size={35} className="2xl:w-10 2xl:h-10" />
              Card
            </motion.button>
            <motion.button
              className="flex items-center justify-center gap-3 text-xl 2xl:text-2xl text-white font-bold h-[60px] 2xl:h-[75px] rounded-l-4xl cursor-pointer"
              onClick={() => togglePaymentMethod("cash")}
              initial={false}
              animate={{
                width: isCashSelected ? "250px" : "180px",
                backgroundColor: isCashSelected ? "#bc7428" : "#848382",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Coins size={35} className="2xl:w-10 2xl:h-10" />
              Cash
            </motion.button>
            <button
              className="w-full bg-black text-white text-xl 2xl:text-2xl font-bold h-[60px] 2xl:h-[75px] rounded-l-4xl cursor-pointer"
              onClick={handleConfirmOrder}
            >
              Confirmer la Commande
            </button>
          </div>
        </div>
      </section>

      <CashModal
        isOpen={isCashModalOpen}
        onClose={() => setIsCashModalOpen(false)}
        totalPrice={parseFloat(totalAmount)}
        confirmOrder={(change: number) => processSale({ change, method: "cash" })}
      />
      <CardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onConfirm={() => processSale({ change: 0, method: "card" })}
      />

      <MixedPaymentModal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        totalPrice={parseFloat(totalAmount)}
        showCash={splitModalConfig.showCash}
        showCard={splitModalConfig.showCard}
        allowPartial={!!idParam} // Allow partial payment if ID exists
        onConfirm={({ cash, card, change }) =>
          processSale({ change, method: "split", cashAmount: cash, cardAmount: card })
        }
      />

      <OrderModal
        isOpen={orderModal.isOpen}
        status={orderModal.status}
        onClose={() => setOrderModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div >
  );
}

// Wrap in Suspense for useSearchParams
export default function Cashier() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CashierContent />
    </Suspense>
  );
}
