"use client";
import CashierNav from "@/components/cashier/nav";
import { Search, ArrowLeft } from "lucide-react";
import ProductCard from "@/components/cashier/productCard";
import CheckoutProductItem from "@/components/cashier/checkoutProductItem";
import OvalLine from "@/components/ui/ovalLine";
import { useState, useEffect } from "react";
import Pagination from "@/components/ui/pagination";
import Image from "next/image";
import { getAuthToken } from "@/lib/auth";
import { useSearchParams, useRouter } from "next/navigation";

interface Product {
    id: number;
    imageUrl: string;
    name: string;
    price: number;
    stock: number;
}

export default function PremiumCashier() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);
    const [userName, setUserName] = useState<string>("");

    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id");

    // Cart State
    interface CartItem {
        id: number;
        name: string;
        price: number;
        imageUrl: string;
        quantity: number;
    }

    // Single Cart State
    const [cart, setCart] = useState<CartItem[]>([]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [paid, setPaid] = useState<number>(0);

    const token = getAuthToken();

    // Check for User ID and Fetch Discount
    useEffect(() => {
        if (!id) {
            router.push("/premiumClients");
            return;
        }

        const fetchUser = async () => {
            try {
                console.log(id);
                const response = await fetch(`/api/customers/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }
                const data = await response.json();
                // Assuming the API returns { data: { discountPercentage: number, fullName: string } } or similar
                // Adjust based on actual API response structure. 
                // Based on previous interactions, data might be directly in data or data.data
                const user = data.data || data;
                setDiscountPercentage(user.discountPercentage || 0);
                setUserName(user.fullName || "Client");
            } catch (err) {
                console.error("Error fetching user:", err);
                // Optionally redirect on error or show alert
                alert("Failed to load client data");
                router.push("/premiumClients");
            }
        };

        fetchUser();
    }, [id, router, token]);


    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);

            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex] = {
                    ...newCart[existingItemIndex],
                    quantity: newCart[existingItemIndex].quantity + 1,
                };
                return newCart;
            } else {
                return [...prevCart, {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity: 1,
                }];
            }
        });
    };

    const updateQuantity = (productId: number, delta: number) => {
        setCart((prevCart) => {
            return prevCart
                .map((item) => {
                    if (item.id === productId) {
                        return { ...item, quantity: item.quantity + delta };
                    }
                    return item;
                })
                .filter((item) => item.quantity > 0);
        });
    };

    const subtotal = cart
        .reduce((total, item) => total + item.price * item.quantity, 0);

    const discountAmount = subtotal * (discountPercentage / 100);
    const totalAmount = (subtotal - discountAmount).toFixed(2);
    const subtotalDisplay = subtotal.toFixed(2);


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
                    // Fallback for old API structure if needed
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
    }, [selectedCategoryId, searchQuery, currentPage, pageSize, token]);

    // Reset page when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategoryId, searchQuery]);

    const processSale = async () => {
        try {
            const saleDetails = cart.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
            }));

            const payload = {
                saleDetails,
                paymentMethod: "credit",
                amountPaid: paid,
                customerId: id ? parseInt(id) : null,
            };

            const response = await fetch("/api/sale", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            }).finally(() => {
                router.push(`/premiumClients/${id}`);
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to process sale");
            }

            // Success
            console.log(`Order Confirmed!`);

            // Clear the cart
            setCart([]);

            alert(`Order Confirmed!`);

        } catch (err) {
            console.error("Sale processing error:", err);
            alert(err instanceof Error ? err.message : "Failed to process sale");
        }
    };

    const handleConfirmOrder = () => {
        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }
        processSale();
    };

    if (!id) {
        return null; // Don't render anything while redirecting
    }

    return (
        <div className="w-full h-[calc(100vh-2rem)] grid grid-cols-7 grid-rows-[auto_1fr] gap-6 mt-4 overflow-hidden">
            <div className="col-span-5 flex flex-row gap-4">

                <div className="relative z-40">
                    <button
                        className="relative bg-white w-20 h-20 flex items-center justify-center rounded-4xl cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => router.push(`/premiumClients/${id}`)}
                    >
                        <ArrowLeft size={35} className="text-main-color" />
                    </button>
                </div>
                <CashierNav onCategoryChange={setSelectedCategoryId} />
            </div>
            <div className="bg-white rounded-l-4xl col-span-2 flex flex-row items-center justify-center gap-3 px-10">
                <Search className="text-main-color" size={30} />
                <input
                    type="text"
                    placeholder="Search Menu"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-full p-2 rounded-l-2xl outline-none placeholder:font-semibold placeholder:text-secondary-color placeholder:text-xl"
                />
            </div>
            <div className="col-span-5 flex flex-col gap-4 overflow-y-auto pr-2 h-full min-h-0">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {loading ? (
                        <div className="col-span-full text-center py-10">
                            <p className="text-lg text-secondary-color">products are loading...</p>
                        </div>
                    ) : error ? (
                        <div className="col-span-full text-center py-10">
                            <p className="text-lg text-red-500">Error loading products: {error}</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="col-span-full text-center py-10">
                            <p className="text-lg text-secondary-color">No products available</p>
                        </div>
                    ) : (
                        products.map((product) => {
                            return (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={addToCart}
                                    isInCart={cart.some((item) => item.id === product.id)}
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

            <section className="col-span-2 h-full flex flex-col justify-between bg-white rounded-4xl overflow-hidden min-h-0">
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-5">
                    {/* <h2 className="text-xl font-bold text-main-color mb-2">{userName}</h2> */}
                    {cart.length > 0 ? cart.map((item) => (
                        <CheckoutProductItem
                            key={item.id}
                            item={item}
                            onIncrease={() => updateQuantity(item.id, 1)}
                            onDecrease={() => updateQuantity(item.id, -1)}
                        />
                    )) : (
                        <p className="text-center text-secondary-color">No items in cart</p>
                    )}
                </div>

                <div className="flex flex-col gap-y-2 items-end">
                    <div className="w-full flex flex-col gap-1 mb-8 p-5">
                        <div className="flex justify-between text-lg">
                            <p className="font-semibold text-secondary-color text-lg">
                                Sub Total:
                            </p>
                            <p className="font-bold ">${subtotalDisplay}</p>
                        </div>

                        {discountPercentage > 0 && (
                            <div className="flex justify-between text-lg text-secondary-color">
                                <p className="font-semibold text-lg">
                                    Discount ({discountPercentage}%):
                                </p>
                                <p className="font-bold text-black">-${discountAmount.toFixed(2)}</p>
                            </div>
                        )}

                        <OvalLine className="my-4 h-px" />
                        <div className="flex justify-between text-lg">
                            <p className="font-semibold text-secondary-color text-lg">Total:</p>
                            <p className="font-bold ">
                                ${totalAmount}
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex flex-row gap-x-2 items-center justify-end">
                        <span className="w-fit mx-auto text-secondary-color text-2xl font-semibold">paid</span>
                        <input
                            className="w-4/7 bg-secondary-color text-center text-white text-xl font-bold py-4 rounded-l-4xl outline-none"
                            type="text"
                            placeholder="Enter paid"
                            onChange={(e) => setPaid(Number(e.target.value))}
                        />
                    </div>
                    {/* Payment Methods - Removed for Premium Cashier */}
                    <div className="w-full flex flex-col gap-y-2 items-end">
                        <button
                            className="w-full bg-black text-white text-xl font-bold py-4 rounded-l-4xl cursor-pointer"
                            onClick={handleConfirmOrder}
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
