"use client";
import { ProductCardProps } from "@/types/components";
import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { API_URL } from "@/common/config";

const ProductCard: React.FC<ProductCardProps> = (props) => {
  const router = useRouter();

  const primaryImage = useMemo(() => {
    return props.images.find((image) => image.isPrimary)?.url;
  }, [props.images]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="aspect-square bg-gray-200 rounded-md mb-4 hover:scale-105 duration-100 cursor-pointer"
          onClick={() => router.push(`/product/${props.productId}`)}
        >
          <img
            src={`${API_URL}${primaryImage}`}
            alt={props.name}
            className="relative w-full h-full object-cover"
          />
        </div>
        <p className="text-2xl font-bold">${props.basePrice}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button className="hover:scale-105 duration-75 ease-in-out">
          Add to Cart
        </Button>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="hover:scale-105 duration-75 ease-in-out"
        >
          <Search className="h-6 w-6" />
          <span className="sr-only">View Details</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
