"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SimpleNavbar from "@/components/SimpleNavbar";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/common/config";

interface UserProfile {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
}

interface Address {
  addressId: number;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface PaymentMethod {
  paymentId: number;
  cardType: string;
  lastFour: string;
  holderName: string;
  expiryDate: string;
  isDefault: boolean;
}

export default function UserCenterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isAddingPayment, setIsAddingPayment] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [addressForm, setAddressForm] = useState({
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });

  const [paymentForm, setPaymentForm] = useState({
    cardType: "",
    lastFour: "",
    holderName: "",
    expiryDate: "",
    isDefault: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchProfile();
    fetchAddresses();
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/v1/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      setProfile(data.data);
      setProfileForm({
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        phone: data.data.phone || "",
      });
    } catch (error) {
      setError("Failed to load profile");
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${API_URL}/v1/profile/addresses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch addresses");
      }
      const data = await response.json();
      setAddresses(data.data);
    } catch (error) {
      setError("Failed to load addresses");
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`${API_URL}/v1/profile/payment-methods`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch payment methods");
      }
      const data = await response.json();
      setPaymentMethods(data.data);
    } catch (error) {
      setError("Failed to load payment methods");
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/v1/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profileForm),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      await fetchProfile();
      setIsEditingProfile(false);
      setSuccess("Profile updated successfully");
    } catch (error) {
      setError("Failed to update profile");
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingAddressId
        ? `${API_URL}/v1/profile/addresses/${editingAddressId}`
        : `${API_URL}/v1/profile/addresses`;

      const response = await fetch(url, {
        method: editingAddressId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(addressForm),
      });
      if (!response.ok) throw new Error("Failed to save address");
      await fetchAddresses();
      setIsAddingAddress(false);
      setEditingAddressId(null);
      setAddressForm({
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        isDefault: false,
      });
      setSuccess("Address saved successfully");
    } catch (error) {
      setError("Failed to save address");
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      const response = await fetch(
        `${API_URL}/v1/profile/addresses/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete address");
      await fetchAddresses();
      setSuccess("Address deleted successfully");
    } catch (error) {
      setError("Failed to delete address");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/v1/profile/payment-methods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(paymentForm),
      });
      if (!response.ok) throw new Error("Failed to save payment method");
      await fetchPaymentMethods();
      setIsAddingPayment(false);
      setPaymentForm({
        cardType: "",
        lastFour: "",
        holderName: "",
        expiryDate: "",
        isDefault: false,
      });
      setSuccess("Payment method added successfully");
    } catch (error) {
      setError("Failed to save payment method");
    }
  };

  const handleDeletePayment = async (paymentId: number) => {
    try {
      const response = await fetch(
        `${API_URL}/v1/profile/payment-methods/${paymentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete payment method");
      await fetchPaymentMethods();
      setSuccess("Payment method deleted successfully");
    } catch (error) {
      setError("Failed to delete payment method");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleNavbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">User Center</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        {/* Profile Section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            {!isEditingProfile && (
              <Button
                onClick={() => setIsEditingProfile(true)}
                variant="outline"
                size="sm"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditingProfile ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name: </span>
                  {profile?.firstName} {profile?.lastName}
                </p>
                <p>
                  <span className="font-medium">Email: </span>
                  {profile?.email}
                </p>
                <p>
                  <span className="font-medium">Phone: </span>
                  {profile?.phone || "Not provided"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Addresses Section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Addresses</CardTitle>
            {!isAddingAddress && addresses.length < 3 && (
              <Button
                onClick={() => setIsAddingAddress(true)}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {/* Address Form */}
            {(isAddingAddress || editingAddressId) && (
              <form onSubmit={handleAddressSubmit} className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input
                    id="streetAddress"
                    value={addressForm.streetAddress}
                    onChange={(e) =>
                      setAddressForm((prev) => ({
                        ...prev,
                        streetAddress: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={addressForm.postalCode}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          postalCode: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={addressForm.country}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={addressForm.isDefault}
                    onChange={(e) =>
                      setAddressForm((prev) => ({
                        ...prev,
                        isDefault: e.target.checked,
                      }))
                    }
                  />
                  <Label htmlFor="isDefault">Set as default address</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddingAddress(false);
                      setEditingAddressId(null);
                      setAddressForm({
                        streetAddress: "",
                        city: "",
                        state: "",
                        postalCode: "",
                        country: "",
                        isDefault: false,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAddressId ? "Update" : "Add"} Address
                  </Button>
                </div>
              </form>
            )}

            {/* Address List */}
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.addressId}
                  className="border p-4 rounded-lg flex justify-between items-start"
                >
                  <div>
                    <p>{address.streetAddress}</p>
                    <p>
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                    {address.isDefault && (
                      <span className="text-sm text-blue-600 font-medium">
                        Default Address
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        setEditingAddressId(address.addressId);
                        setAddressForm({
                          streetAddress: address.streetAddress,
                          city: address.city,
                          state: address.state,
                          postalCode: address.postalCode,
                          country: address.country,
                          isDefault: address.isDefault,
                        });
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteAddress(address.addressId)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Payment Methods</CardTitle>
            {!isAddingPayment && paymentMethods.length < 3 && (
              <Button
                onClick={() => setIsAddingPayment(true)}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {/* Payment Method Form */}
            {isAddingPayment && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardType">Card Type</Label>
                    <Input
                      id="cardType"
                      value={paymentForm.cardType}
                      onChange={(e) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          cardType: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastFour">Card Number</Label>
                    <Input
                      id="lastFour"
                      value={paymentForm.lastFour}
                      onChange={(e) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          lastFour: e.target.value,
                        }))
                      }
                      required
                      maxLength={16}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="holderName">Card Holder Name</Label>
                    <Input
                      id="holderName"
                      value={paymentForm.holderName}
                      onChange={(e) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          holderName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
                    <Input
                      id="expiryDate"
                      value={paymentForm.expiryDate}
                      onChange={(e) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          expiryDate: e.target.value,
                        }))
                      }
                      required
                      placeholder="MM/YY"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefaultPayment"
                    checked={paymentForm.isDefault}
                    onChange={(e) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        isDefault: e.target.checked,
                      }))
                    }
                  />
                  <Label htmlFor="isDefaultPayment">
                    Set as default payment method
                  </Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddingPayment(false);
                      setPaymentForm({
                        cardType: "",
                        lastFour: "",
                        holderName: "",
                        expiryDate: "",
                        isDefault: false,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Payment Method</Button>
                </div>
              </form>
            )}

            {/* Payment Methods List */}
            <div className="space-y-4">
              {paymentMethods.map((payment) => (
                <div
                  key={payment.paymentId}
                  className="border p-4 rounded-lg flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium">{payment.cardType}</p>
                    <p>**** **** **** {payment.lastFour.slice(-4)}</p>
                    <p>{payment.holderName}</p>
                    <p>Expires: {payment.expiryDate}</p>
                    {payment.isDefault && (
                      <span className="text-sm text-blue-600 font-medium">
                        Default Payment Method
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() => handleDeletePayment(payment.paymentId)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}