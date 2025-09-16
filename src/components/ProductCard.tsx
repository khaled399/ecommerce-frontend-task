import React, { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import type { Product } from "../context/CartContext";

type ProductCardProps = Product & {
  variants?: string[];
  category?: string;
  quantity?: number;
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  available,
  variants,
  category,
  quantity = 0,
}) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [stock, setStock] = useState<number>(quantity);
  const [locallyAvailable, setLocallyAvailable] = useState<boolean>(available);

  const priceLabel = useMemo(() => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(price);
    } catch {
      return `$${price.toFixed(2)}`;
    }
  }, [price]);

  const requiresVariant = Boolean(variants && variants.length);
  const isInStock = locallyAvailable && stock > 0;
  const canAdd = isInStock && (!requiresVariant || selectedVariant);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      <div className="relative">
        <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        </div>
        {category && (
          <span className="absolute top-2 left-2 text-xs font-medium bg-white/90 backdrop-blur px-2 py-1 rounded-full text-gray-800 border border-gray-200">
            {category}
          </span>
        )}
        {!isInStock && (
          <span className="absolute top-2 right-2 text-xs font-semibold bg-gray-900/85 text-white px-2 py-1 rounded-full">
            Out of Stock
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h2
            className="text-[15px] md:text-base font-semibold text-gray-900 truncate"
            title={name}
          >
            {name}
          </h2>
          <span
            className={`text-xs font-medium ${
              isInStock ? "text-green-700" : "text-red-600"
            }`}
          >
            {isInStock ? `In stock: ${stock}` : "Out of stock"}
          </span>
        </div>
        <p className="text-sm md:text-[15px] text-gray-700">{priceLabel}</p>

        {variants && variants.length > 0 && (
          <label className="text-sm text-gray-700">
            <span className="sr-only">Select variant for {name}</span>
            <select
              aria-label={`Select variant for ${name}`}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
            >
              <option value="" disabled>
                Select an option
              </option>
              {variants.map((v, i) => (
                <option key={i} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        )}

        <button
          type="button"
          disabled={!canAdd}
          onClick={async () => {
            if (!canAdd) return;
            try {
              const API_BASE =
                import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
              const res = await fetch(`${API_BASE}/products/${id}/decrement`, {
                method: "PATCH",
              });
              if (res.status === 409) {
                setStock(0);
                setLocallyAvailable(false);
                return;
              }
              if (!res.ok) throw new Error("Failed to reserve stock");
              const updated = await res.json();
              if (typeof updated.quantity === "number")
                setStock(updated.quantity);
              addToCart(
                { id, name, price, image, available },
                { variant: selectedVariant || undefined, quantity: 1 }
              );
            } catch {
              // fallback: do nothing on error
            }
          }}
          className={`${
            canAdd
              ? "bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          } inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
          aria-disabled={!canAdd}
          aria-label={
            isInStock ? `Add ${name} to cart` : `${name} is out of stock`
          }
          title={isInStock ? "Add to Cart" : "Out of Stock"}
        >
          {isInStock
            ? requiresVariant && !selectedVariant
              ? "Select a variant"
              : "Add to Cart"
            : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
