"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CirclePlus, User } from "lucide-react";
import { useRouter } from "next/navigation";

const NavbarStocking = () => {
  const router = useRouter();
  //   const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  //   const [cartCount, setCartCount] = useState(1);
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
          // "pos" // right
        }
        <div className="flex items-center space-x-4">
          <Link href="/user-center">
            <Button variant="ghost" size="icon" className="relative">
              <User className="h-6 w-6" />
              <span className="sr-only">User Center</span>
            </Button>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/user-center">
            <Button variant="ghost" size="icon" className="relative">
              <CirclePlus className="h-6 w-6" />
              <span className="sr-only">User Center</span>
            </Button>
          </Link>
        </div>
        {}
      </div>
    </header>
  );
};

export default NavbarStocking;
