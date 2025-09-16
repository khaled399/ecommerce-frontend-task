import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image: string;
  category: string;
  available: boolean;
  quantity: number;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const API_BASE =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const response = await fetch(`${API_BASE}/products/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <Link
            to="/products"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isInStock = product.available && product.quantity > 0;
  const requiresVariant = false; // Add variant logic if needed

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product Image */}
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-gray-700">
                {product.description || "No description available."}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                {isInStock ? (
                  <span className="text-green-600">
                    In stock ({product.quantity} available)
                  </span>
                ) : (
                  <span className="text-red-600">Out of stock</span>
                )}
              </div>
            </div>

            {requiresVariant && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Variants</h3>
                <div className="mt-4 space-y-4">
                  {/* Add variant selection here */}
                </div>
              </div>
            )}

            <div className="mt-10 flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  type="button"
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  type="button"
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={!isInStock}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                disabled={!isInStock || (requiresVariant && !selectedVariant)}
                onClick={() =>
                  addToCart(
                    { ...product, available: isInStock },
                    { variant: selectedVariant || undefined, quantity }
                  )
                }
                className={`flex-1 py-3 px-6 rounded-md border border-transparent text-base font-medium text-white ${
                  isInStock
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isInStock ? "Add to cart" : "Out of stock"}
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Category</h3>
              <div className="mt-2">
                <Link
                  to={`/products?category=${encodeURIComponent(
                    product.category
                  )}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {product.category}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
