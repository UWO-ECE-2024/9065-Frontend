"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Menu, Search, ShoppingBag, ShoppingCart, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
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

const Navbar = () => {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = [
    { title: "Brand A's Collection", category: "Brand A" },
    { title: "Brand B's Collection", category: "Brand B" },
    { title: "Brand C's Collcation", category: "Brand C" },
  ];

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
              <div className="mt-4">
                <p>Your cart items will appear here.</p>
              </div>
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
