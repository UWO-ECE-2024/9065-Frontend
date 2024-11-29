"use client";
import Footer from "@/components/Footer";
import ProductStockCard from "@/components/ProductStockCard";
import NavbarStocking from "@/components/NavbarStocking";
import AddItemCard from "@/components/AddItemCard";
import { SetStateAction, useEffect, useState } from "react";
import { API_URL, URL } from "@/common/config";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const page = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);

  const fetchProducts = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/v1/products/list`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
  useEffect(() => {
    if (fetchProducts.isError) {
      toast({ title: "Failed to fetch products" });
    }
    if (fetchProducts.isSuccess) {
      console.log("Fetched data:", fetchProducts.data.data);

      setProducts(fetchProducts.data.data);
    }
  }, [fetchProducts.isSuccess, fetchProducts.isError]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarStocking />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Stock Tracking</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductStockCard key={product.productId ?? index} {...product} />
          ))}
          <AddItemCard />
        </div>
      </main>

      <Footer />
    </div>
  );
};
export default page;
