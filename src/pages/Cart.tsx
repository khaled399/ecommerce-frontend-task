import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();

  const formattedTotal = useMemo(() => {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(cartTotal);
    } catch {
      return `$${cartTotal.toFixed(2)}`;
    }
  }, [cartTotal]);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-16 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-2 text-gray-600">Start adding items to your cart.</p>
        <div className="mt-6">
          <Link to="/products" className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={`${item.id}-${item.variant ?? "_"}`} className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-sm md:text-base font-semibold text-gray-900 truncate" title={item.name}>
                      {item.name}
                    </h2>
                    {item.variant && (
                      <p className="text-xs text-gray-600 mt-0.5">Variant: {item.variant}</p>
                    )}
                    <p className="text-sm text-gray-700 mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    className="text-sm text-red-600 hover:text-red-700"
                    onClick={() => removeFromCart(item.id, { variant: item.variant })}
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-3 inline-flex items-center rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    className="px-3 py-1 text-gray-700 hover:bg-gray-50"
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1), { variant: item.variant })}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    −
                  </button>
                  <span className="px-4 py-1 text-sm min-w-8 text-center select-none">{item.quantity}</span>
                  <button
                    className="px-3 py-1 text-gray-700 hover:bg-gray-50"
                    onClick={() => updateQuantity(item.id, item.quantity + 1, { variant: item.variant })}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-white border border-gray-200 rounded-xl p-4 h-fit">
          <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-gray-700">Subtotal</span>
            <span className="font-medium text-gray-900">{formattedTotal}</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Taxes and shipping calculated at checkout.</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={clearCart}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50"
            >
              Clear Cart
            </button>
            <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Checkout
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
