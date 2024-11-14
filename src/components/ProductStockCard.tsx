"use client";
import {ProductCardProps, ProductStockCardProps} from "@/types/components";
import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const ProductStockCard: React.FC<ProductStockCardProps> = (props) => {
    const router = useRouter();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{props.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    className="aspect-square bg-gray-200 rounded-md mb-4 hover:scale-105 duration-100 cursor-pointer"
                    onClick={() => router.push(`/product/${props.name}`)}
                ></div>
                <p className="text-2xl font-bold">${props.price.toFixed(2)}</p>
                <p className="text-2xl font-bold">inventory: {props.inventory}</p>
            </CardContent>
            <CardFooter>
                <Button className="w-full hover:scale-105 duration-75 ease-in-out">
                    Edit
                </Button>
                <Button  className="w-full hover:scale-105 duration-75 ease-in-out">
                    ➕
                </Button>
                <Button className="w-full hover:scale-105 duration-75 ease-in-out">
                    ➖
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductStockCard;
