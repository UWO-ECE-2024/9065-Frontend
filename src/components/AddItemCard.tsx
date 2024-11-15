"use client";
import {ProductCardProps, ProductStockCardProps} from "@/types/components";
import React, {FormEvent, useEffect, useRef, useState} from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface FormData {
    name: string;
    description: string;
    quantity: number;
    price: string;
    image: File | null;
}

const AddItemCard = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dialog = useRef<HTMLDialogElement>(null);
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
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data: FormData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            quantity: parseInt(formData.get('quantity') as string),
            price: formData.get('price') as string,
            image: formData.get('image') as File | null
        };
        console.log(data);
// here to process the submit

        closeDialog();
    };


    return (
        <Card>
            <CardHeader>
                {/*<CardTitle>{props.name}</CardTitle>*/}
            </CardHeader>
            <CardContent>
                <div>
                    <button onClick={openDialog}>Add New</button>
                    <dialog ref={dialog} onClose={closeDialog}>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="image">Image:</label>
                                <input type="file" id="image" name="image" accept="image/*"/>
                            </div>
                            <div>
                                <label htmlFor="name">Name:</label>
                                <input type="text" id="name" name="name" required/>
                            </div>
                            <div>
                                <label htmlFor="description">Description:</label>
                                <input type="text" id="description" name="description" required/>
                            </div>
                            <div>
                                <label htmlFor="quantity">Quantity:</label>
                                <input type="number" id="quantity" name="quantity" required/>
                            </div>
                            <div>
                                <label htmlFor="price">Price:</label>
                                <input type="text" id="price" name="price" required/>
                            </div>
                            <button type="submit">Submit</button>
                            <button type="button" onClick={closeDialog}>Close</button>
                        </form>
                    </dialog>
                </div>
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    )
        ;
};

export default AddItemCard;
