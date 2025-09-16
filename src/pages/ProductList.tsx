import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import type { Product } from "../context/CartContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type ApiProduct = Product & {
  category?: string;
  variants?: string[];
  quantity?: number;
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const categoriesInitialized = useRef(false);
  const { cartCount } = useCart();

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = selectedCategory
          ? `${API_BASE}/products?category=${encodeURIComponent(
              selectedCategory
            )}`
          : `${API_BASE}/products`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
        const data: ApiProduct[] = await res.json();
        if (isMounted) {
          setProducts(data);
          // Initialize categories only once from the first successful unfiltered fetch
          if (!selectedCategory && !categoriesInitialized.current) {
            const uniq = Array.from(
              new Set(
                data
                  .map((p) => p.category)
                  .filter(
                    (c): c is string => typeof c === "string" && c.length > 0
                  )
              )
            );
            setCategories(uniq);
            categoriesInitialized.current = true;
          }
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Something went wrong";
        if (isMounted) setError(msg);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-8">
            <Link
              to="/"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="-ml-0.5 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="w-full aspect-[4/3] bg-gray-200 rounded-xl mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-9 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="-ml-0.5 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </Link>
        </div>
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <h3 className="text-lg font-medium mb-2">Failed to load products</h3>
          <p>
            {typeof error === "object" && error !== null && "message" in error
              ? (error as { message: string }).message
              : String(error)}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="-ml-0.5 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Products
            </h1>
            <p className="mt-1 text-gray-600">Browse our latest selection</p>
          </div>
        </div>
        <Link
          to="/cart"
          className="relative inline-flex items-center text-sm text-gray-700 hover:text-gray-900"
        >
          Cart
          <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs font-medium rounded-full bg-blue-600 text-white">
            {cartCount}
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("")}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              selectedCategory === ""
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                selectedCategory === c
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            price={p.price}
            image={p.image}
            variants={p.variants}
            available={p.available}
            category={p.category}
            quantity={typeof p.quantity === "number" ? p.quantity : 0}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
