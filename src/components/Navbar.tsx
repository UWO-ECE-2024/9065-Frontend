"use client";
import Link from "next/link";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import {
  Menu,
  Search,
  ShoppingBag,
  ShoppingCart,
  TextSearch,
  User,
  X,
} from "lucide-react";
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
import {
  useActions,
  useCart,
  useCategorys,
  useTokens,
} from "@/store/shopping-store";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types/store";
import { CategoryService } from "@/services/category.service";
import { API_URL } from "@/common/config";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const router = useRouter();
  const tokens = useTokens();
  const { toast } = useToast();
  const categorys = useCategorys();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cart = useCart();
  const updateCart = useActions().updateCart;
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isSuccess } = useQuery<{ data: Category[] }>({
    queryKey: ["categories"],
    queryFn: CategoryService.fetchCategories,
    enabled: !categorys.length,
  });
  const updateCategory = useActions().setCategorys;

  const updateCartItemsQuantity = useCallback(
    (id: number, quantity: number) => {
      if (quantity <= 0) {
        return;
      }
      if (
        quantity >=
        (cart.find((item) => item.productId === id)?.stockQuantity ?? 0)
      ) {
        toast({
          title: "Out of Stock",
          description: "This item is out of stock.",
          variant: "destructive",
        });
        return;
      }
      updateCart(
        cart.map((item) =>
          item.productId === id ? { ...item, quantity } : item
        )
      );
    },
    [cart]
  );

  const removeItem = (id: number) => {
    updateCart(cart.filter((item) => item.productId !== id));
  };

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );
  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.basePrice) * item.quantity,
        0
      ),
    [cart]
  );

  const handleCheckout = () => {
    if (!tokens.accessToken || !tokens.refreshToken) {
      router.push("/login");
    } else {
      router.push("/checkout");
    }
  };

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
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleEnterKey);
    return () => document.removeEventListener("keydown", handleEnterKey);
  }, [isSearchOpen, searchQuery, router]);

  useEffect(() => {
    if (isSuccess && categorys.length === 0) {
      updateCategory(data.data);
    }
  }, [isSuccess]);

  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {
          // left
        }
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden relative  z-10"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-4">
              {categorys.map((category) => (
                <Link
                  key={category.categoryId}
                  href={`/search?category=${category.name}`}
                  className="text-lg font-medium"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <nav className="hidden md:flex items-center gap-6 mx-6 z-10">
          {categorys.slice(0, 3).map((category) => (
            <Link
              key={category.categoryId}
              href={`/search?category=${category.name}`}
              className="text-lg font-medium"
            >
              {category.name}
            </Link>
          ))}
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
            <TextSearch className="h-6 w-6" />
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
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    Your cart is empty.
                  </p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center py-4 border-b"
                    >
                      <img
                        src={`${API_URL}${item.images[0].url}`}
                        alt={item.name}
                        className="w-16 h-16 object-contain mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${item.basePrice}
                        </p>
                        <div className="flex items-center mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateCartItemsQuantity(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) =>
                              updateCartItemsQuantity(
                                item.productId,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-14 mx-2 text-center "
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateCartItemsQuantity(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
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
                    <Button className="w-full" onClick={handleCheckout}>
                      Checkout
                    </Button>
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
            {categorys.slice(0, 3).map((result) => (
              <CommandItem
                key={result.categoryId}
                onSelect={() => {
                  setIsSearchOpen(false);
                  // Handle navigation or other actions
                  router.push(`/search?category=${result.name}`);
                }}
              >
                <span>{result.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
};

export default memo(Navbar);
