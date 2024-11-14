"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Menu, Search, ShoppingBag, ShoppingCart, User, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";

const initialCartItems = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 29.99,
    quantity: 1,
    image: "/next.svg",
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    price: 59.99,
    quantity: 2,
    image: "/next.svg",
  },
];

const Navbar = () => {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = [
    { title: "Brand A's Collection", category: "Brand A" },
    { title: "Brand B's Collection", category: "Brand B" },
    { title: "Brand C's Collcation", category: "Brand C" },
  ];

  const updateQuantity = useCallback(
    (id: number, newQuantity: number) => {
      setCartItems((items) =>
        items.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, newQuantity) }
            : item
        )
      );
    },
    [cartItems]
  );

  const removeItem = useCallback(
    (id: number) => {
      setCartItems((items) => items.filter((item) => item.id !== id));
    },
    [cartItems]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );
  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  useEffect(() => {
    // Press cmd+k to open search
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const handleEnterKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isSearchOpen) {
        e.preventDefault();
        searchQuery.length > 0
          ? router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
          : router.push("/search");
      }
    };

    document.addEventListener("keydown", handleEnterKey);
    return () => document.removeEventListener("keydown", handleEnterKey);
  }, [isSearchOpen, searchQuery, router]);

  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {
          // left
        }
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-4">
              <Link href="/search?query=BrandA" className="text-lg font-medium">
                Brand A
              </Link>
              <Link href="/search?query=BrandA" className="text-lg font-medium">
                Brand B
              </Link>
              <Link href="/search?query=BrandA" className="text-lg font-medium">
                Brand C
              </Link>
              <Link href="/search?query=BrandA" className="text-lg font-medium">
                Brand D
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <nav className="hidden md:flex items-center gap-6 mx-6 z-10">
          <Link href="/search?query=BrandA" className="text-sm font-medium">
            Brand A
          </Link>
          <Link href="/search?query=BrandA" className="text-sm font-medium">
            Brand B
          </Link>
          <Link href="/search?query=BrandA" className="text-sm font-medium">
            Brand C
          </Link>
          <Link href="/search?query=BrandA" className="text-sm font-medium">
            Brand D
          </Link>
        </nav>

        <div className="w-full  absolute flex items-center justify-center flex-1 md:justify-center z-0">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
          </Link>
        </div>

        {
          // right
        }
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-6 w-6" />
            <span className="sr-only">Search</span>
          </Button>

          <Link href="/user-center">
            <Button variant="ghost" size="icon" className="relative">
              <User className="h-6 w-6" />
              <span className="sr-only">User Center</span>
            </Button>
          </Link>
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Open cart</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-200px)] mt-4">
                {cartItems.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    Your cart is empty.
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center py-4 border-b"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.id,
                                parseInt(e.target.value, 10)
                              )
                            }
                            className="w-14 mx-2 text-center "
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </ScrollArea>
              <SheetFooter className="mt-4">
                <div className="w-full">
                  <div className="flex justify-between mb-4">
                    <span>Total:</span>
                    <span className="font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <SheetClose asChild>
                    <Button className="w-full">Checkout</Button>
                  </SheetClose>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput
          placeholder="Search products..."
          onValueChange={(value) => {
            setSearchQuery(value);
          }}
        />
        <CommandList>
          <VisuallyHidden.Root>
            <SheetTitle>Menu</SheetTitle>
          </VisuallyHidden.Root>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {searchResults.map((result) => (
              <CommandItem
                key={result.title}
                onSelect={() => {
                  setIsSearchOpen(false);
                  // Handle navigation or other actions
                }}
              >
                <span>{result.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
};

export default Navbar;
