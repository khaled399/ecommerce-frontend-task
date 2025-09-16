import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";

const Home = () => (
  <div className="bg-white">
    {/* Hero Section */}
    <div className="relative bg-gray-900">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-30"
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
          alt="Fashion collection"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Welcome to ShopEase
        </h1>
        <p className="mt-6 text-xl text-gray-200 max-w-3xl mx-auto">
          Discover amazing products at unbeatable prices. Quality you can trust,
          delivered to your doorstep.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Shop Now
          </Link>
          <a
            href="#featured"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-100 bg-blue-900 bg-opacity-60 hover:bg-opacity-70 transition-colors"
          >
            Featured Categories
          </a>
        </div>
      </div>
    </div>

    {/* Featured Categories */}
    <div id="featured" className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-8">
        Shop by Category
      </h2>
      <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {[
          {
            name: "Electronics",
            href: "/products?category=electronics",
            imageSrc:
              "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
          },
          {
            name: "Clothing",
            href: "/products?category=clothing",
            imageSrc:
              "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
          },
          {
            name: "Home & Living",
            href: "/products?category=home",
            imageSrc:
              "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
          },
          {
            name: "Accessories",
            href: "/products?category=accessories",
            imageSrc:
              "https://media.istockphoto.com/id/531786318/photo/top-view-of-female-fashion-accessories.jpg?s=612x612&w=0&k=20&c=kA9wOhgfDQiz7RO6GoEztqlPNGaTxZyFwf14991aMM0=",
          },
        ].map((category) => (
          <div key={category.name} className="group relative">
            <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
              <img
                src={category.imageSrc}
                alt={category.name}
                className="w-full h-full object-center object-cover lg:w-full lg:h-full"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <h3 className="text-sm text-gray-700">
                <Link to={category.href}>
                  <span aria-hidden="true" className="absolute inset-0" />
                  {category.name}
                </Link>
              </h3>
              <Link
                to={category.href}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Shop now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* CTA Section */}
    <div className="bg-blue-700">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Ready to start shopping?</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-blue-100">
          Browse our collection of high-quality products and find exactly what
          you're looking for.
        </p>
        <Link
          to="/products"
          className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
        >
          View All Products
        </Link>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
            <p className="text-center text-base text-gray-500">
              &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
};

export default App;
