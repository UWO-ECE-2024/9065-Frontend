"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavbarStocking from "@/components/NavbarStocking";
import Footer from "@/components/Footer";
import { API_URL } from "@/common/config";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface OrderItem {
  orderItemId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  productName: string;
}

interface Order {
  orderId: number;
  userId: number;
  shippingAddressId: number;
  billingAddressId: number;
  paymentMethodId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

const formatPrice = (price: number | string) => {
  const num = Number(price);
  return isNaN(num) ? "0.00" : num.toFixed(2);
};

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/stocks/orders/list`);
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        console.log("Fetched orders data:", data);
        
        if (!data.data || !Array.isArray(data.data)) {
          console.error("Invalid data format:", data);
          setOrders([]);
          return;
        }
        
        const ordersWithProductNames = data.data.map((order: Order) => ({
          ...order,
          items: order.items.map(item => ({
            ...item,
            productName: item.productName || 'Unknown Product'
          }))
        }));
        
        setOrders(ordersWithProductNames);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/v1/stocks/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update order status');
      
      const updatedOrders = orders.map(order => 
        order.orderId === orderId 
          ? { ...order, status: newStatus }
          : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarStocking />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Order Management</h1>
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.orderId}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Order #{order.orderId}</CardTitle>
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusUpdate(order.orderId, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    Order Date: {dayjs(order.createdAt).format("MMMM D, YYYY")}
                  </p>
                  <p className="text-sm text-gray-500">
                    Shipping Address: {order.shippingAddress.streetAddress},{" "}
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.orderItemId}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${formatPrice(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${formatPrice(item.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">
                        Total:
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ${formatPrice(order.totalAmount)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
