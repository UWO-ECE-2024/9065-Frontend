"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductPageProps } from "@/types/pages";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import { useParams } from "next/navigation";
import NotFound from "@/app/not-found";
import { ProductPageData } from "@/types/request-and-response";
import { API_URL } from "@/common/config";

const product = {
  name: "Classic Leather Jacket",
  price: 299.99,
  description:
    "A timeless leather jacket that never goes out of style. Made from premium leather with a comfortable fit and durable construction. This jacket features a sleek design with a full-zip front, multiple pockets for convenience, and a soft lining for added comfort. Perfect for casual outings or as a stylish layer for cooler evenings.",
  sizes: ["XS", "S", "M", "L", "XL"],
  images: ["/next.svg", "/next.svg", "/next.svg"],
  reviews: [
    {
      id: 1,
      author: "John D.",
      rating: 5,
      comment:
        "Excellent quality and fit! The leather is soft yet durable, and the jacket looks even better in person.",
    },
    {
      id: 2,
      author: "Sarah M.",
      rating: 4,
      comment:
        "Great jacket, but runs a bit small. I'd recommend sizing up if you're between sizes.",
    },
    {
      id: 3,
      author: "Mike R.",
      rating: 5,
      comment:
        "Exactly what I was looking for. The attention to detail is impressive, and it's quickly become my go-to jacket.",
    },
  ],
};

const page = () => {
  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const params = useParams();
  const productsInfo = useQuery<{ data: ProductPageData[] }>({
    queryKey: ["product", params.id],
    queryFn: () =>
      ProductService.fetchProductById(
        Array.isArray(params.id) ? params.id[0] : params.id ?? "0"
      ),
    enabled: !!params.id,
  });

  const handleAddToBag = () => {
    if (selectedSize) {
      console.log(`Added ${product.name} (Size: ${selectedSize}) to bag`);
      // Implement your add to cart logic here
    } else {
      alert("Please select a size");
    }
  };

  if (productsInfo.isLoading) {
    return <div>Loading...</div>;
  }

  if (productsInfo.isError) {
    NotFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Carousel */}
          <div className="w-full lg:w-1/2">
            <Carousel
              setApi={(api) => {
                api?.on("select", () => {
                  setCurrentImageIndex(api.selectedScrollSnap());
                });
              }}
            >
              <CarouselContent>
                {productsInfo.data?.data[0].images.map((src, index) => (
                  <CarouselItem key={index}>
                    <Dialog>
                      <DialogTrigger asChild>
                        <AspectRatio ratio={1 / 1} className="bg-muted">
                          <img
                            src={`${API_URL}${src.url}`}
                            alt={`Product image ${index + 1}`}
                            className="rounded-md object-contain cursor-pointer w-full h-full"
                          />
                        </AspectRatio>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <VisuallyHidden.Root>
                          <DialogTitle>Image</DialogTitle>
                        </VisuallyHidden.Root>
                        <AspectRatio ratio={1 / 1} className="bg-muted">
                          <img
                            src={`${API_URL}${src.url}`}
                            alt={`Product image ${index + 1}`}
                            className="rounded-md object-contain w-full h-full"
                          />
                        </AspectRatio>
                      </DialogContent>
                    </Dialog>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="z-10" />
              <CarouselNext className="z-10" />
            </Carousel>
            <div className="flex justify-center mt-4">
              {productsInfo.data?.data[0].images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentImageIndex ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl font-bold mb-4">
              {productsInfo.data?.data[0].name}
            </h1>
            <p className="text-2xl font-semibold mb-4">
              ${productsInfo.data?.data[0].basePrice}
            </p>
            {/* Size Selection */}
            {/* <div className="mb-4">
              <Select onValueChange={setSelectedSize}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            {/* Add to Bag Button */}
            <Button onClick={handleAddToBag} className="w-full mb-6">
              <ShoppingBag className="mr-2 h-4 w-4" /> Add to Bag
            </Button>

            {/* Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{productsInfo.data?.data[0].description}</p>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {product.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="mb-4 pb-4 border-b last:border-b-0"
                  >
                    <div className="flex items-center mb-1">
                      <span className="font-semibold mr-2">
                        {review.author}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default page;
