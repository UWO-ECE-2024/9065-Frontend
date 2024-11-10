"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";

// Mock data for saved addresses and cart items
const initialSavedAddresses = [
  {
    id: 1,
    name: "John Doe",
    address: "123 Main St",
    city: "Anytown",
    state: "AT",
    zipCode: "12345",
  },
  {
    id: 2,
    name: "Jane Smith",
    address: "456 Elm St",
    city: "Othertown",
    state: "OT",
    zipCode: "67890",
  },
];

const cartItems = [
  { id: 1, name: "Classic T-Shirt", price: 29.99, quantity: 2 },
  { id: 2, name: "Denim Jeans", price: 59.99, quantity: 1 },
];

const page = () => {
  const [savedAddresses, setSavedAddresses] = useState(initialSavedAddresses);
  const [selectedAddress, setSelectedAddress] = useState<number | "new">("new");
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxRate = 0.08; // 8% tax rate (you would typically calculate this based on the address)
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingAddress !== null) {
      setSavedAddresses((addresses) =>
        addresses.map((addr) =>
          addr.id === editingAddress ? { ...addr, [name]: value } : addr
        )
      );
    } else {
      setNewAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditAddress = (id: number) => {
    setEditingAddress(id);
    setSelectedAddress(id);
  };

  const handleSaveAddress = () => {
    if (editingAddress !== null) {
      setEditingAddress(null);
    } else {
      setSavedAddresses((prev) => [...prev, { id: Date.now(), ...newAddress }]);
      setNewAddress({
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
      });
    }
  };

  const handleDeleteAddress = (id: number) => {
    setSavedAddresses((addresses) =>
      addresses.filter((addr) => addr.id !== id)
    );
    if (selectedAddress === id) {
      setSelectedAddress("new");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the order data to your backend
    console.log("Order submitted", {
      selectedAddress,
      newAddress,
      paymentMethod,
      total,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 ">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedAddress?.toString() || ""}
                  onValueChange={(value) => {
                    setSelectedAddress(value === "new" ? "new" : Number(value));
                    setEditingAddress(null);
                  }}
                >
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex items-center justify-between mb-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={address.id.toString()}
                          id={`address-${address.id}`}
                        />
                        <Label htmlFor={`address-${address.id}`}>
                          {editingAddress === address.id ? (
                            <Input
                              name="name"
                              value={address.name}
                              onChange={handleAddressChange}
                              className="mb-2"
                            />
                          ) : (
                            address.name
                          )}
                          {editingAddress === address.id ? (
                            <>
                              <Input
                                name="address"
                                value={address.address}
                                onChange={handleAddressChange}
                                className="mb-2"
                              />
                              <div className="grid grid-cols-3 gap-2">
                                <Input
                                  name="city"
                                  value={address.city}
                                  onChange={handleAddressChange}
                                />
                                <Input
                                  name="state"
                                  value={address.state}
                                  onChange={handleAddressChange}
                                />
                                <Input
                                  name="zipCode"
                                  value={address.zipCode}
                                  onChange={handleAddressChange}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              {" "}
                              - {address.address}, {address.city},{" "}
                              {address.state} {address.zipCode}
                            </>
                          )}
                        </Label>
                      </div>
                      <div>
                        {editingAddress === address.id ? (
                          <Button
                            type="button"
                            onClick={handleSaveAddress}
                            size="sm"
                          >
                            Save
                          </Button>
                        ) : (
                          <>
                            <Button
                              type="button"
                              onClick={() => handleEditAddress(address.id)}
                              size="icon"
                              variant="ghost"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              onClick={() => handleDeleteAddress(address.id)}
                              size="icon"
                              variant="ghost"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="address-new" />
                    <Label htmlFor="address-new">Use a new address</Label>
                  </div>
                </RadioGroup>
                {selectedAddress === "new" && (
                  <div className="mt-4 space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newAddress.name}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={newAddress.address}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2 md:grid-cols-3">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={newAddress.city}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={newAddress.state}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={newAddress.zipCode}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                    </div>
                    <Button type="button" onClick={handleSaveAddress}>
                      Save New Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem
                      value="credit-card"
                      id="payment-credit-card"
                    />
                    <Label htmlFor="payment-credit-card">Credit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="paypal" id="payment-paypal" />
                    <Label htmlFor="payment-paypal">PayPal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="payment-cash" />
                    <Label htmlFor="payment-cash">Cash on Delivery</Label>
                  </div>
                </RadioGroup>
                {paymentMethod === "credit-card" && (
                  <div className="mt-4 space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="grid gap-2 md:grid-cols-3">
                      <div>
                        <Label htmlFor="expiry-month">Expiry Month</Label>
                        <Select>
                          <SelectTrigger id="expiry-month">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                              (month) => (
                                <SelectItem
                                  key={month}
                                  value={month.toString().padStart(2, "0")}
                                >
                                  {month.toString().padStart(2, "0")}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="expiry-year">Expiry Year</Label>
                        <Select>
                          <SelectTrigger id="expiry-year">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(
                              { length: 10 },
                              (_, i) => new Date().getFullYear() + i
                            ).map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button type="submit" className="w-full mt-8">
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default page;
