"use client";
import { ProductStockCardProps } from "@/types/components";
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

    // Debug: Log component props to trace values
    console.log("ProductStockCard Props:", props);

    return (
        <Card className="hover:shadow-lg duration-200 ease-in-out">
            <CardHeader>
                <CardTitle>{props.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    className="aspect-square rounded-md mb-4 hover:scale-105 duration-200 cursor-pointer relative"
                    onClick={() => router.push(`/product/${props.productId}`)}
                    role="img"
                    aria-label={props.name}
                    style={{
                        width: '100%', // Ensure div has enough width
                        height: 0,
                        paddingTop: '100%' // Maintain 1:1 aspect ratio
                    }}
                >
                    <div style={{
                        backgroundImage: props.imageUrl
                            ? `url('data:image/jpeg;base64,${props.imageUrl}')`
                            : `url('/images/placeholder.png')`, // Fallback to a placeholder image
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }}></div>
                </div>

                <p className="text-xl font-semibold">${props.basePrice}</p>
                <p className="text-xl">Inventory: {props.stockQuantity}</p>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button className="w-full hover:scale-105 duration-75 ease-in-out bg-blue-500 text-white">
                    Edit
                </Button>
                <Button className="w-full hover:scale-105 duration-75 ease-in-out bg-green-500 text-white">
                    ➕
                </Button>
                <Button className="w-full hover:scale-105 duration-75 ease-in-out bg-red-500 text-white">
                    ➖
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductStockCard;
