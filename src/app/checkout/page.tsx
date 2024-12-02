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
import { useToast } from "@/hooks/use-toast";
import { update_tokens } from "@/lib/utils";
import { userService } from "@/services/user.service";
import {
  useActions,
  useCart,
  useTokens,
  useUser,
} from "@/store/shopping-store";
import { Address } from "@/types/request-and-response";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const cart = useCart();
  const tokens = useTokens();
  const router = useRouter();
  const user = useUser();
  const updateTokens = useActions().updateTokens;
  const updateCart = useActions().updateCart;
  const [refreshFlag, setRefreshFlag] = useState(false);
  const refreshToken = useMutation({
    mutationKey: [
      "refreshToken",
      typeof window !== "undefined" ? localStorage.getItem("refreshToken") : "",
    ],
    mutationFn: userService.refreshToken,
  });
  const addAddress = useMutation({
    mutationKey: ["addAddress"],
    mutationFn: userService.addAddress,
  });
  const updateAddress = useMutation({
    mutationKey: ["updateAddress"],
    mutationFn: userService.updateAddress,
  });
  const deleteAddress = useMutation({
    mutationKey: ["deleteAddress"],
    mutationFn: userService.deleteAddress,
  });
  const { toast } = useToast();
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | "new">("new");
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState({
    country: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [creditCard, setCreditCard] = useState({
    cardNumber: "",
    holderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const addressList = useQuery<{ data: Address[] }>({
    queryKey: ["addresses"],
    queryFn: () => userService.addressList(localStorage.getItem("token") || ""),
  });
  const checkout = useMutation({
    mutationKey: ["checkout"],
    mutationFn: userService.checkout,
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.basePrice) * item.quantity,
    0
  );
  const taxRate = 0.08; // 8% tax rate (you would typically calculate this based on the address)
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreditCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingAddress !== null) {
      setSavedAddresses((addresses) =>
        addresses.map((addr) =>
          addr.addressId === editingAddress ? { ...addr, [name]: value } : addr
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

  const handleSaveAddress = async () => {
    if (editingAddress !== null) {
      const oldAddress = savedAddresses.find(
        (addr) => addr.addressId === editingAddress
      );
      updateAddress.mutateAsync(
        {
          addressId: editingAddress,
          streetAddress: oldAddress?.streetAddress ?? "",
          city: oldAddress?.city ?? "",
          state: oldAddress?.state ?? "",
          postalCode: oldAddress?.postalCode ?? "",
          country: oldAddress?.country ?? "",
          isDefault: oldAddress?.isDefault ?? false,
          token:
            typeof window !== "undefined"
              ? localStorage.getItem("token") || ""
              : "",
        },
        {
          onSuccess: () => {
            addressList.refetch();
          },
          onError: (error) => {
            setRefreshFlag(false);
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          },
        }
      );
      setEditingAddress(null);
    } else {
      if (savedAddresses.length === 3) {
        toast({
          title: "Error",
          description: "You can only save up to 3 addresses",
        });
        setNewAddress({
          country: "",
          streetAddress: "",
          city: "",
          state: "",
          postalCode: "",
        });
        return;
      }
      await addAddress.mutateAsync(
        {
          streetAddress: newAddress.streetAddress,
          city: newAddress.city,
          state: newAddress.state,
          postalCode: newAddress.postalCode,
          country: newAddress.country,
          isDefault: false,
          token:
            typeof window !== "undefined"
              ? localStorage.getItem("token") || ""
              : "",
        },
        {
          onSuccess: () => {
            addressList.refetch();
          },
          onError: (error) => {
            setRefreshFlag(false);
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          },
        }
      );
      setNewAddress({
        country: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
      });
    }
  };

  const handleDeleteAddress = (id: number) => {
    deleteAddress.mutate(
      {
        addressId: id,
        token:
          typeof window !== "undefined"
            ? localStorage.getItem("token") || ""
            : "",
      },
      {
        onSuccess: () => {
          addressList.refetch();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
    if (selectedAddress === id) {
      setSelectedAddress("new");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the order data to your backend
    console.log("Order submitted", {
      products: cart,
      address: selectedAddress,
      paymentMethod,
      creditCard,
      userId: user.userId,
    });
    checkout.mutate(
      {
        products: cart,
        addressId: selectedAddress === "new" ? 0 : selectedAddress,
        token:
          typeof window !== "undefined"
            ? localStorage.getItem("token") || ""
            : "",
        paymentMethod:
          paymentMethod === "credit-card"
            ? {
                cardType: creditCard.cardNumber.startsWith("4")
                  ? "Visa"
                  : creditCard.cardNumber.startsWith("5")
                  ? "MasterCard"
                  : "UnionPay",
                lastFour: creditCard.cardNumber,
                holderName: creditCard.holderName,
                expiryDate: `${creditCard.expiryMonth}/${creditCard.expiryYear}`,
              }
            : 0,
        userId: user.userId,
        email: user.email,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Success",
            description: "Order placed successfully",
          });
          localStorage.setItem("order", JSON.stringify(data.data));
          updateCart([]);
          router.push("/checkout-success");
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleRefreshToken = async () => {
    await refreshToken.mutateAsync(
      {
        refreshToken:
          typeof window !== "undefined"
            ? localStorage.getItem("refreshToken") || ""
            : "",
      },
      {
        onSuccess: (data) => {
          updateTokens(data.data.tokens);
          update_tokens(data.data.tokens);
          setRefreshFlag(!refreshFlag);
        },
      }
    );
  };

  useEffect(() => {
    !refreshFlag && handleRefreshToken();
  }, [refreshFlag]);

  useEffect(() => {
    if (addressList.isError) {
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive",
      });
    }
    if (addressList.isFetched) {
      setSavedAddresses(addressList.data?.data || []);
    }
  }, [addressList.isError, addressList.isFetched]);

  useEffect(() => {
    if (
      !user.userId ||
      !localStorage.getItem("token") ||
      !localStorage.getItem("refreshToken")
    ) {
      router.push("/login");
    }
  }, []);

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
                  {addressList.data?.data.map((address) => (
                    <div
                      key={address.addressId}
                      className="flex items-center justify-between mb-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={address.addressId.toString()}
                          id={`address-${address.addressId}`}
                        />
                        <Label htmlFor={`address-${address.addressId}`}>
                          {editingAddress === address.addressId ? (
                            <Input
                              name="country"
                              defaultValue={address.country}
                              onChange={handleAddressChange}
                              className="mb-2"
                            />
                          ) : (
                            address.country
                          )}
                          {editingAddress === address.addressId ? (
                            <>
                              <Input
                                name="streetAddress"
                                defaultValue={address.streetAddress}
                                onChange={handleAddressChange}
                                className="mb-2"
                              />
                              <div className="grid grid-cols-3 gap-2">
                                <Input
                                  name="city"
                                  defaultValue={address.city}
                                  onChange={handleAddressChange}
                                />
                                <Input
                                  name="state"
                                  defaultValue={address.state}
                                  onChange={handleAddressChange}
                                />
                                <Input
                                  name="postalCode"
                                  defaultValue={address.postalCode}
                                  onChange={handleAddressChange}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              {" "}
                              - {address.streetAddress}, {address.city},{" "}
                              {address.state} {address.postalCode}
                            </>
                          )}
                        </Label>
                      </div>
                      <div>
                        {editingAddress === address.addressId ? (
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
                              onClick={() =>
                                handleEditAddress(address.addressId)
                              }
                              size="icon"
                              variant="ghost"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              onClick={() =>
                                handleDeleteAddress(address.addressId)
                              }
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
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={newAddress.country}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="streetAddress">Address</Label>
                      <Input
                        id="streetAddress"
                        name="streetAddress"
                        value={newAddress.streetAddress}
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
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={newAddress.postalCode}
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
                  {/* <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="paypal" id="payment-paypal" />
                    <Label htmlFor="payment-paypal">PayPal</Label>
                  </div> */}
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
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                        onChange={handleCardChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="holder-name">Holder Name</Label>
                      <Input
                        id="holder-name"
                        name="holderName"
                        placeholder="AAA BBB"
                        onChange={handleCardChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2 md:grid-cols-3">
                      <div>
                        <Label htmlFor="expiry-month">Expiry Month</Label>
                        <Select
                          onValueChange={(value) =>
                            setCreditCard((prev) => ({
                              ...prev,
                              expiryMonth: value.padStart(2, "0"),
                            }))
                          }
                        >
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
                        <Select
                          onValueChange={(value) => {
                            setCreditCard((prev) => ({
                              ...prev,
                              expiryYear: value,
                            }));
                          }}
                        >
                          <SelectTrigger id="expiry-year">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(
                              { length: 20 },
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
                        <Input
                          id="cvv"
                          type="password"
                          name="cvv"
                          placeholder="123"
                          onChange={handleCardChange}
                          required
                        />
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
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between mb-2"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>
                      ${(Number(item.basePrice) * item.quantity).toFixed(2)}
                    </span>
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
