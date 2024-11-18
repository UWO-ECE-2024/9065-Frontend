"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";

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
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dialog = useRef<HTMLDialogElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const openDialog = () => {
        setIsOpen(true);
        dialog.current?.showModal();
    };

    const closeDialog = () => {
        setIsOpen(false);
        dialog.current?.close();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dialog.current && !dialog.current.contains(event.target as Node)) {
                closeDialog();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:8888/v1/category/list");
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
                const response = await fetch("http://localhost:8888/v1/stocks/addPics", {
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
        }

        const data: FormData = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            stock_quantity: parseInt(formData.get("quantity") as string),
            base_price: formData.get("price") as string,
            pics: imagePaths,
            category_id: parseInt(formData.get("category") as string),
        };
        console.log(data);

        try {
            const response = await fetch("http://localhost:8888/v1/stocks/addProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("product add successfully ：", result);
                closeDialog();
            } else {
                const errorData = await response.json();
                console.error("fail on add product：", errorData);
            }
        } catch (error) {
            console.error("error when add product：", error);
        }
    };


    return (
        <Card>
            <CardHeader>{/*<CardTitle>{props.name}</CardTitle>*/}</CardHeader>
            <CardContent>
                <div>
                    <button onClick={openDialog}>Add New</button>
                    <dialog ref={dialog} onClose={closeDialog}>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="images">Images:</label>
                                <input
                                    type="file"
                                    id="images"
                                    name="images"
                                    accept="image/*"
                                    multiple
                                />
                            </div>
                            <div>
                                <label htmlFor="name">Name:</label>
                                <input type="text" id="name" name="name" required />
                            </div>
                            <div>
                                <label htmlFor="description">Description:</label>
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="quantity">Quantity:</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="price">Price:</label>
                                <input type="text" id="price" name="price" required />
                            </div>
                            <div>
                                <label htmlFor="category">Category:</label>
                                <select id="category" name="category" required>
                                    <option value="">choose category</option>
                                    {Array.isArray(categories) &&
                                        categories.map((category) => (
                                            <option
                                                key={category.categoryId}
                                                value={category.categoryId}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <button type="submit">Submit</button>
                            <button type="button" onClick={closeDialog}>
                                Close
                            </button>
                        </form>
                    </dialog>
                </div>
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    );
};

export default AddItemCard;
