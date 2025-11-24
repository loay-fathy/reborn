"use client";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const CheckoutProductItem = ({ item, onIncrease, onDecrease }) => {
  return (
    <div className="rounded-4xl p-4 border-3 border-main-color flex flex-col aspect-[26/15]">
      <div className="flex flex-col items-center gap-3 xl:gap-10 xl:flex-row">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={100}
          height={75}
          className="rounded-2xl aspect-[4/3]"
        />
        <div className="flex flex-col gap-2 justify-center font-bold text-sm">
          <p> {item.name}</p>
          <div className="flex gap-2 text-main-color">
            <Minus
              className="cursor-pointer"
              onClick={() => onDecrease(item.id)}
            />
            <span className="text-white text-xs flex justify-center items-center bg-main-color rounded px-2">
              {item.quantity}
            </span>
            <Plus
              className="cursor-pointer"
              onClick={() => onIncrease(item.id)}
            />
          </div>
        </div>
      </div>
      <span className="block w-full h-px bg-[#6552474d] rounded-full mx-auto my-4" />
      <div className="flex justify-between items-center">
        <p className="font-semibold">Amount</p>
        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CheckoutProductItem;
