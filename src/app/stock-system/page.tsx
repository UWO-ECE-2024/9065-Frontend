"use client";
import Footer from "@/components/Footer";
import ProductStockCard from "@/components/ProductStockCard";
import NavbarStocking from "@/components/NavbarStocking";
import AddItemCard from "@/components/AddItemCard";
import { SetStateAction, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { ProductStockCardProps } from "@/types/components";
import { API_URL } from "@/common/config";
import { useRouter } from "next/navigation";

const Page = () => {
  const [products, setProducts] = useState<ProductStockCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/v1/products/list`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const products = data.data.map((product: any) => ({
        productId: product.productId,
        name: product.name,
        description: product.description,
        basePrice: product.basePrice,
        stockQuantity: product.stockQuantity,
        productCategory: product.categoryId,
        imageUrl: "",
        onStockChange: fetchProducts
      }));
      setProducts(products);
    } catch (error) {
      console.error("Fetching products failed: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products list
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch product images
  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const updatedProducts = await Promise.all(
          products.map(async (product) => {
            if (product.imageUrl) return product; // Skip if image already fetched
            const response = await fetch(
              `${API_URL}/v1/stocks/getPicsByProductId/${product.productId}`
            );
            if (!response.ok)
              throw new Error(
                `Failed to fetch for product ${product.productId}`
              );
            const imageData = await response.json();
            const primaryImage = imageData.images.find(
              (img: any) => img.isPrimary
            );

            return {
              ...product,
              imageUrl: primaryImage ? `${primaryImage.data}` : "",
            };
          })
        );
        setProducts(updatedProducts);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error fetching product images:", error);
      }
    };

    if (!imagesLoaded && products.length > 0) {
      fetchProductImages();
    }
  }, [products, imagesLoaded]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarStocking />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Stock Tracking</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            //@ts-ignore
            <ProductStockCard 
              key={product.productId} 
              {...product} 
              onStockChange={fetchProducts}
            />
          ))}
          <AddItemCard />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
