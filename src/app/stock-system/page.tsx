"use client";
import Footer from "@/components/Footer";
import ProductStockCard from "@/components/ProductStockCard";
import NavbarStocking from "@/components/NavbarStocking";
import AddItemCard from "@/components/AddItemCard";
import { SetStateAction, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { ProductStockCardProps } from "@/types/components";
import { API_URL } from "@/common/config";

const Page = () => {
  const [products, setProducts] = useState<ProductStockCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Fetch products list
  useEffect(() => {
    fetch(`${API_URL}/v1/products/list`)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        const products = data.data.map((product: ProductStockCardProps) => ({
          ...product,
          imageUrl: "", // Initialize imageUrl
        }));
        setProducts(products);
      })
      .catch((error) => console.error("Fetching products failed: ", error))
      .finally(() => setIsLoading(false));
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
              imageUrl: primaryImage ? `${primaryImage.data}` : "", // Default to empty if no primary image
            };
          })
        );
        console.log("1update products +++");
        setProducts(updatedProducts);
        setImagesLoaded(true);
        console.log("update products +++");
      } catch (error) {
        console.error("Error fetching product images:", error);
      }
    };

    if (!imagesLoaded && products.length > 0) {
      fetchProductImages();
      console.log("1update products +++");
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
            <ProductStockCard key={product.productId} {...product} />
          ))}
          <AddItemCard />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
