import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  available: boolean;
};

export type CartItem = Product & { quantity: number; variant?: string };

type CartContextType = {
  cart: CartItem[];
  addToCart: (
    product: Product,
    options?: { variant?: string; quantity?: number }
  ) => void;
  updateQuantity: (
    id: number,
    quantity: number,
    options?: { variant?: string }
  ) => void;
  removeFromCart: (id: number, options?: { variant?: string }) => void;
  clearCart: () => Promise<void>;
  cartCount: number; // total quantity
  cartTotal: number; // total price
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "app_cart_v1";

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore persistence errors
    }
  }, [cart]);

  const addToCart: CartContextType["addToCart"] = (product, options) => {
    const variant = options?.variant;
    const quantity = Math.max(1, Math.floor(options?.quantity ?? 1));
    setCart((prev) => {
      const idx = prev.findIndex(
        (i) => i.id === product.id && i.variant === variant
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { ...product, quantity, variant }];
    });
  };

  const updateQuantity: CartContextType["updateQuantity"] = (
    id,
    quantity,
    options
  ) => {
    setCart((prev) => {
      const variant = options?.variant;
      return prev
        .map((i) =>
          i.id === id && i.variant === variant ? { ...i, quantity } : i
        )
        .filter((i) => i.quantity > 0);
    });
  };

  const removeFromCart: CartContextType["removeFromCart"] = (id, options) => {
    const variant = options?.variant;
    setCart((prev) =>
      prev.filter((i) => !(i.id === id && i.variant === variant))
    );
  };

  const clearCart = async () => {
    const API_BASE =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    try {
      await Promise.all(
        cart.map((item) =>
          fetch(`${API_BASE}/products/${item.id}/increment`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: item.quantity }),
          }).catch(() => undefined)
        )
      );
    } finally {
      setCart([]);
    }
  };

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart]
  );
  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart]
  );

  const value: CartContextType = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
