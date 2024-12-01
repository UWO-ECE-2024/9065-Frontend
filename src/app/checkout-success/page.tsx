"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Truck } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/store/shopping-store";
import NotFound from "../not-found";
import { ProductData } from "@/types/request-and-response";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

// Mock data for the order
const orderDetails = {
  orderNumber: "ORD-12345-ABCDE",
  orderDate: "June 15, 2023",
  estimatedDelivery: "June 20, 2023",
  items: [
    { id: 1, name: "Ergonomic Chair", price: 199.99, quantity: 1 },
    { id: 2, name: "Mechanical Keyboard", price: 129.99, quantity: 2 },
    { id: 3, name: "4K Monitor", price: 349.99, quantity: 1 },
  ],
};

export default function PaymentSuccessPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const [orderDetail, setOrderDetail] = useState<null | {
    orderId: number;
    orderTime: Date;
    products: (ProductData & { quantity: number })[];
  }>(null);
  const subtotal = useMemo(
    () =>
      orderDetail?.products.reduce(
        (sum, item) => sum + Number(item.basePrice) * item.quantity,
        0
      ),
    [orderDetail]
  );
  const tax = useMemo(
    () => (subtotal !== undefined ? subtotal * 0.13 : 0),
    [subtotal]
  );
  const total = useMemo(() => (subtotal ?? 0) + (tax ?? 0), [subtotal, tax]);

  useEffect(() => {
    const orderData = localStorage.getItem("order");
    if (orderData !== null) {
      setLoading(false);
      setOrderDetail(JSON.parse(orderData));
      localStorage.removeItem("order");
    } else {
      router.push("/");
    }
    if (
      !user.userId ||
      localStorage.getItem("token") === null ||
      localStorage.getItem("refreshToken") === null
    ) {
      router.push("/login");
    }
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Thank you for your purchase. Your order has been confirmed.
          </CardDescription>
        </CardHeader>
        {orderDetail !== null && (
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Order number
                </p>
                <p className="font-semibold">{orderDetail.orderId}</p>
              </div>
              <div className="mt-2 md:mt-0 md:text-right">
                <p className="text-sm font-medium text-gray-500">Order date</p>
                <p className="font-semibold">
                  {dayjs(orderDetail.orderTime).format("MMMM D, YYYY")}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Package className="h-5 w-5 text-gray-400" />
              <Separator className="flex-grow" />
              <Truck className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-center mb-6">
              Estimated delivery:{" "}
              <span className="font-semibold">
                {dayjs(orderDetail.orderTime)
                  .add(5, "day")
                  .format("MMMM D, YYYY")}
              </span>
            </p>
            <Separator className="my-4" />
            <div className="space-y-2">
              {isExpanded ? (
                orderDetail.products.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>
                      ${(Number(item.basePrice) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500">
                  {orderDetail.products.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}{" "}
                  items purchased
                </div>
              )}
              <Button
                variant="link"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-sm"
              >
                {isExpanded ? "Hide details" : "Show details"}
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${(subtotal ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        )}
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          {/* <Button className="w-full sm:w-auto" asChild>
            <Link href="/order-details">View Order Details</Link>
          </Button> */}
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
