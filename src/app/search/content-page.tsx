"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Props } from "@/types/pages";
import React, { useEffect, useState } from "react";

const initialProducts = [
  { id: 1, name: "Classic T-Shirt", price: 19.99, category: "Clothing" },
  { id: 2, name: "Leather Wallet", price: 39.99, category: "Accessories" },
  { id: 3, name: "Running Shoes", price: 79.99, category: "Footwear" },
  { id: 4, name: "Wireless Earbuds", price: 99.99, category: "Electronics" },
  { id: 5, name: "Denim Jeans", price: 59.99, category: "Clothing" },
  { id: 6, name: "Smartwatch", price: 199.99, category: "Electronics" },
  { id: 7, name: "Backpack", price: 49.99, category: "Accessories" },
  { id: 8, name: "Sunglasses", price: 29.99, category: "Accessories" },
];

const categories = ["Clothing", "Accessories", "Footwear", "Electronics"];

const ContentPage = (props: Props) => {
  const [title, setTitle] = useState("Search Results");
  const [products, setProducts] = useState(initialProducts);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("relevance");

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (newPriceRange: number[]) => {
    setPriceRange(newPriceRange);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  useEffect(() => {
    let filteredProducts = initialProducts.filter(
      (product) =>
        (selectedCategories.length === 0 ||
          selectedCategories.includes(product.category)) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1]
    );

    switch (sortOrder) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      // 'relevance' is default, no sorting needed
    }

    setProducts(filteredProducts);
  }, [selectedCategories, priceRange, sortOrder]);

  const cateTitle = async () => {
    const cate = (await props.searchParams).category;
    if (cate) {
      setTitle(`${cate} Products`);
    }
  };

  useEffect(() => {
    cateTitle();
  }, [props.searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <aside className="w-full md:w-1/4">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Categories</h2>
                {categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <label
                      htmlFor={category}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Price Range</h2>
                <Slider
                  min={0}
                  max={200}
                  step={1}
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <main className="w-full md:w-3/4">
            <div className="flex justify-end mb-4">
              <Select onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContentPage;
