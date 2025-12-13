"use client";
import { Minus, Plus } from "lucide-react";

interface CheckoutProductItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  };
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
}

const CheckoutProductItem = ({ item, onIncrease, onDecrease }: CheckoutProductItemProps) => {
  return (
    <div className="w-full rounded-4xl p-4 border-3 border-main-color shadow-sm hover:border-main-color hover:shadow-md transition-all duration-200">
      
      {/* Top Row: Name and Total Price */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-tight">
            {item.name}
          </h3>
          <span className="text-xs text-gray-500 mt-1">
            {item.price.toFixed(2)} MAD / unit
          </span>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-main-color">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Bottom Row: Quantity Controls */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1">
        
        {/* Decrease Button */}
        <button
          onClick={() => onDecrease(item.id)}
          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200 active:scale-95 transition-all"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>

        {/* Quantity Display */}
        <span className="font-bold text-gray-800 text-sm w-8 text-center">
          {item.quantity}
        </span>

        {/* Increase Button */}
        <button
          onClick={() => onIncrease(item.id)}
          className="w-8 h-8 flex items-center justify-center bg-main-color text-white rounded-lg shadow-sm hover:bg-opacity-90 active:scale-95 transition-all"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default CheckoutProductItem;