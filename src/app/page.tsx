"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { ProductService } from "@/services/product.service";
import { ProductData } from "@/types/request-and-response";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const getProducts = useQuery<{ data: ProductData[] }>({
    queryKey: ["products"],
    queryFn: ProductService.fetchProducts,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {getProducts.isLoading && <div>Loading...</div>}
          {!!getProducts.data &&
            getProducts.data.data.map((product: ProductData) => (
              <ProductCard key={product.productId} {...product} />
            ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
