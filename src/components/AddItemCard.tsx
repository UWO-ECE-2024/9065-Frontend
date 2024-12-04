"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Upload } from "lucide-react";
import { API_URL } from "@/common/config";

interface Category {
  categoryId: number;
  name: string;
}

interface FormData {
  name: string;
  description: string;
  stock_quantity: number;
  base_price: string;
  pics: string[];
  category_id: number;
}

const AddItemCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    stock_quantity: 0,
    base_price: "",
    pics: [],
    category_id: 0,
  });
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/category/list`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || []);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name === "quantity") {
            // Convert value to integer for quantity
            const intValue = parseInt(value, 10);
            setFormData((prev) => ({
                ...prev,
                stock_quantity: intValue || 0 // Fallback to 0 if conversion fails
            }));
        } else if (name === "price") {
            // Handle base_price, ensuring it remains a string
            setFormData((prev) => ({
                ...prev,
                base_price: value
            }));
        } else {
            // Handle all other cases
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category_id: parseInt(value) }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // if (dialog.current && !dialog.current.contains(event.target as Node)) {
            //     closeDialog();
            // }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/v1/category/list`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched data cat:", data.data);
                    setCategories(data.data || []);
                } else {
                    console.error("category found error");
                }
            } catch (error) {
                console.error("category found error", error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new window.FormData(event.currentTarget);
        const files = formData.getAll("images") as File[];

        let imagePaths: string[] = [];

        if (files.length > 0) {
            const uploadFormData = new window.FormData();
            files.forEach(file => {
                uploadFormData.append("images", file);
            });

            try {
                const response = await fetch(`${API_URL}/v1/stocks/addPics`, {
                    method: "POST",
                    body: uploadFormData,
                });

                if (response.status === 200) {
                    const result = await response.json();
                    imagePaths = result.filePaths;
                    console.log("image paths = " + imagePaths);
                } else {
                    console.error("upload image failed");
                }
            } catch (error) {
                console.error("error when upload image", error);
            }
        } else {
            console.error("error here");
        }

        const data: FormData = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            stock_quantity: parseInt(formData.get("quantity") as string),
            base_price: formData.get("price") as string,
            pics: imagePaths,
            category_id: parseInt(formData.get("category") as string),
        };
        console.log('here is the data cat id' + formData.get("category"));

        try {
            const response = await fetch(`${API_URL}/v1/stocks/addProduct`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("product add successfully ：", result);
                // closeDialog();
            } else {
                const errorData = await response.json();
                console.error("fail on add product：", errorData);
            }
        } catch (error) {
            console.error("error when add product：", error);
        }
    };


                    return (
                    <Card className="w-full max-w-md mx-auto">
                        <CardHeader>
                            <CardTitle>Add New Item</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add New Item</DialogTitle>
                                        <DialogDescription>
                                            Fill in the details of the new item you want to add to your
                                            inventory.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                                <Label htmlFor="images">Images</Label>
                                                <Input
                                                    id="images"
                                                    name="images"
                                                    type="file"
                                                    multiple
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                                <Label htmlFor="name">Name</Label>
                                                <Input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                                <Label htmlFor="quantity">Quantity</Label>
                                                <Input
                                                    type="text"
                                                    id="quantity"
                                                    name="quantity"
                                                    value={formData.stock_quantity}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                                <Label htmlFor="price">Price</Label>
                                                <Input
                                                    type="text"
                                                    id="price"
                                                    name="price"
                                                    value={formData.base_price}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                                <Label htmlFor="category">Category</Label>
                                                <Select name="category" value={formData.category_id.toString()} onValueChange={handleSelectChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                    <SelectContent id="category">
                                                        {categories.map((category) => (
                                                            <SelectItem
                                                                key={category.categoryId}
                                                                value={category.categoryId.toString()}
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit">Add Item</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                    );
};

export default AddItemCard;
