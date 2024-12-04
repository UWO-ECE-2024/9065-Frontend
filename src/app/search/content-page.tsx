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
import { ProductService } from "@/services/product.service";
import { useCategorys } from "@/store/shopping-store";
import { Props } from "@/types/pages";
import { ProductData } from "@/types/request-and-response";
import { Category } from "@/types/store";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const ContentPage = (props: Props) => {
  const [title, setTitle] = useState("Search Results");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState("relevance");
  const categories = useCategorys();
  const [queryParams, setQueryParams] = useState({
    category: "",
    query: "",
    stale: false,
  });
  const [modifyProducts, setModifyProducts] = useState<ProductData[]>([]);
  const searchResults = useQuery<{ data: ProductData[] }>({
    queryKey: ["search", queryParams],
    queryFn: () =>
      ProductService.searchProducts({
        query: queryParams.query,
        category: queryParams.category,
      }),
    enabled: queryParams.stale,
  });

  const handleCategoryChange = (category:number) => {
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
    let filteredProducts = searchResults.data?.data || [];
    filteredProducts = filteredProducts.filter(
      (product) =>
        (selectedCategories.length === 0 ||
          selectedCategories.includes(product.categoryId)) &&
        Number(product.basePrice) >= priceRange[0] &&
        Number(product.basePrice) <= priceRange[1]
    );

    switch (sortOrder) {
      case "price-asc":
        filteredProducts.sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
        break;
      case "price-desc":
        filteredProducts.sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
        break;
      case "name":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      // 'relevance' is default, no sorting needed
    }

    setModifyProducts(filteredProducts);
  }, [selectedCategories, priceRange, sortOrder,searchResults.data]);

  const cateTitle = async () => {
    const cate = (await props.searchParams).category;
    const query = (await props.searchParams).query;

    if (cate) {
      setTitle(`${cate} Products`);
    }
    if (cate === undefined) {
      setTitle("Search Results");
    }
    setQueryParams({
      category: cate as string,
      query: Array.isArray(query) ? query.join(", ") : query ?? "",
      stale: true,
    });
  };

  useEffect(() => {
    cateTitle();
  }, [props.searchParams, searchResults.isFetched]);


  useEffect(() => {
    if (searchResults.isSuccess && searchResults.data.data.length > 0) {
      setModifyProducts(searchResults.data.data);
      let pricePeak = Math.max(
        ...searchResults.data.data.map((product) => Number(product.basePrice))
      );
      setPriceRange([0, pricePeak]);
    }
  }, [searchResults.isSuccess]);

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
                    key={category.categoryId}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Checkbox
                      id={category.categoryId.toString()}
                      checked={selectedCategories.includes(category.categoryId)}
                      onCheckedChange={() => handleCategoryChange(category.categoryId)}
                    />
                    <label
                      htmlFor={category.name}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Price Range</h2>
                <Slider
                  min={0}
                  max={priceRange[1]}
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
              {searchResults.isFetched &&
                searchResults.data?.data.length === 0 && (
                  <div className="text-center py-10">
                    <h2 className="text-2xl font-semibold mb-2">
                      No results found
                    </h2>
                    <p className="text-gray-600">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              {modifyProducts.map((product) => (
                <ProductCard key={product.productId} {...product} />
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
