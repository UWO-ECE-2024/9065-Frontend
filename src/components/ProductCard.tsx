"use client";
import { ProductCardProps } from "@/types/components";
import React, { useCallback, useMemo } from "react";
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
import { useActions, useCart } from "@/store/shopping-store";
import { useToast } from "@/hooks/use-toast";

const ProductCard: React.FC<ProductCardProps> = (props) => {
  const router = useRouter();
  const updateCart = useActions().updateCart;
  const cart = useCart();
  const { toast } = useToast();

  const primaryImage = useMemo(() => {
    return props.images
      ? props.images.find((image) => image.isPrimary)?.url
      : "";
  }, [props.images]);

  const handleAddToCart = useCallback(() => {
    const productInCart = cart.find(
      (item) => item.productId === props.productId
    );
    if (productInCart) {
      if (productInCart.quantity + 1 > props.stockQuantity) {
        toast({
          title: "Out of Stock",
          description: `${props.name} is out of stock.`,
          variant: "destructive",
        });
        return;
      }
      updateCart(
        cart.map((item) =>
          item.productId === props.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      if (props.stockQuantity <= 0) {
        toast({
          title: "Out of Stock",
          description: `${props.name} is out of stock.`,
          variant: "destructive",
        });
        return;
      }
      updateCart([...cart, { ...props, quantity: 1 }]);
    }
    toast({
      title: "Added to Cart",
      description: `${props.name} has been added to your cart.`,
    });
  }, [props]);

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
        <Button
          className="hover:scale-105 duration-75 ease-in-out"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="hover:scale-105 duration-75 ease-in-out"
          onClick={() => router.push(`/product/${props.productId}`)}
        >
          <Search className="h-6 w-6" />
          <span className="sr-only">View Details</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
