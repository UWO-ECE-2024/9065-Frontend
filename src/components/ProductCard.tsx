"use client";
import { ProductCardProps } from "@/types/components";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

const ProductCard: React.FC<ProductCardProps> = (props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-square bg-gray-200 rounded-md mb-4"></div>
        <p className="text-2xl font-bold">${props.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
