"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const products = [
    { id: 1, name: "Stylish T-Shirt", price: 29.99 },
    { id: 2, name: "Comfortable Jeans", price: 59.99 },
    { id: 3, name: "Classic Sneakers", price: 89.99 },
    { id: 4, name: "Elegant Watch", price: 129.99 },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
