"use client";
import Image from "next/image";

const ProductCard = ({ product }) => {
  return (
    <div
      className="flex flex-col gap-5 rounded-4xl bg-white aspect-27/25"
      onClick={() => console.log("clicked")}
    >
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={300}
        height={300}
        className="w-full h-3/5 object-cover rounded-t-4xl"
      />
      <div className="flex flex-col items-center justify-center gap-2 pb-5">
        <span
          className={`text-md font-medium text-white px-5 rounded-lg ${
            !product.stockQuantity ? "bg-secondary-color" : "bg-main-color"
          }`}
        >
          {product.stockQuantity} peices left
        </span>
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
