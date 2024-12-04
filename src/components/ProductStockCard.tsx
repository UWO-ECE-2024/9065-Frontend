"use client";
import { ProductStockCardProps } from "@/types/components";
import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { API_URL } from "@/common/config";

interface Category {
  categoryId: number;
  name: string;
}

const ProductStockCard: React.FC<ProductStockCardProps> = (props) => {
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: props.name,
    description: props.description,
    basePrice: props.basePrice,
    stockQuantity: props.stockQuantity,
    imageUrl: props.imageUrl,
    productCategory: props.productCategory?.toString() || "",
    pics: [] as string[],
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/category/list`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || []);

          if (props.productCategory) {
            const category = data.data.find(
              (cat: Category) => cat.categoryId === props.productCategory
            );

            if (category) {
              setFormData((prev) => ({
                ...prev,
                productCategory: category.name,
              }));
            }
          }
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, [props.productCategory]);

  useEffect(() => {
    const loadProductImage = async () => {
      try {
        const response = await fetch(
          `${API_URL}/v1/stocks/getPicsByProductId/${props.productId}`
        );
        if (response.ok) {
          const data = await response.json();
          const primaryImage = data.images.find((img: any) => img.isPrimary);
          if (primaryImage) {
            setPreviewImage(
              `data:${primaryImage.mimeType};base64,${primaryImage.data}`
            );
            setFormData((prev) => ({
              ...prev,
              imageUrl: primaryImage.data,
            }));
          }
        }
      } catch (error) {
        console.error("Error loading product image:", error);
      }
    };

    loadProductImage();
  }, [props.productId]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Create FormData for image upload
      const uploadFormData = new FormData();
      uploadFormData.append("images", files[0]);

      try {
        // First upload the image
        const response = await fetch(`${API_URL}/v1/stocks/addPics`, {
          method: "POST",
          body: uploadFormData,
        });

        if (response.ok) {
          const result = await response.json();
          const imagePaths = result.filePaths;

          // Set the image paths in formData
          setFormData((prev) => ({
            ...prev,
            pics: imagePaths,
          }));

          // Show preview of the uploaded image
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result as string);
          };
          reader.readAsDataURL(files[0]);
        } else {
          throw new Error("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (isConfirmed) {
      try {
        const response = await fetch(
          `${API_URL}/v1/stocks/deleteProductById/${props.productId}`,
          {
            method: "PATCH",
          }
        );
        if (response.ok) {
          props.onStockChange?.();
        } else {
          throw new Error("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.pics || formData.pics.length === 0) {
      alert("Please select an image");
      return;
    }

    try {
      const category = categories.find(
        (c) => c.name === formData.productCategory
      );
      if (!category) {
        alert("Invalid category selected");
        return;
      }

      const formDataToSend = {
        id: props.productId,
        category_id: category.categoryId.toString(),
        name: formData.name,
        base_price: formData.basePrice,
        description: formData.description || "",
        stock_quantity: formData.stockQuantity,
        pics: formData.pics,
      };

      const response = await fetch(`${API_URL}/v1/stocks/updateProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        setShowEditDialog(false);
        props.onStockChange?.(); // Refresh the product list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update product. Please try again."
      );
    }
  };

  const handleIncreaseStock = async () => {
    try {
      const response = await fetch(
        `${API_URL}/v1/stocks/increaseStockById/${props.productId}`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        // Immediately update local state
        setFormData((prev) => ({
          ...prev,
          stockQuantity: prev.stockQuantity + 1,
        }));
        props.onStockChange?.(); // Still trigger parent refresh
      } else {
        throw new Error("Failed to increase stock");
      }
    } catch (error) {
      console.error("Error increasing stock:", error);
      alert("Failed to increase stock. Please try again.");
    }
  };

  const handleDecreaseStock = async () => {
    try {
      const response = await fetch(
        `${API_URL}/v1/stocks/decreaseStockById/${props.productId}`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          stockQuantity: prev.stockQuantity - 1,
        }));
        props.onStockChange?.();
      } else {
        throw new Error("Failed to decrease stock");
      }
    } catch (error) {
      console.error("Error decreasing stock:", error);
      alert("Failed to decrease stock. Please try again.");
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg duration-200 ease-in-out">
        <CardHeader>
          <CardTitle>
            <Button
              onClick={handleDelete}
              style={{
                width: "3rem",
                marginRight: ".5rem",
              }}
              className="w-full hover:scale-105 duration-75 ease-in-out bg-red-500 text-white"
            >
              🗑️
            </Button>{" "}
            {formData.name}{" "}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div
            className="aspect-square rounded-md mb-4 hover:scale-105 duration-200 cursor-pointer relative"
            onClick={() => router.push(`/product/${props.productId}`)}
            role="img"
            aria-label={formData.name}
            style={{
              width: "100%",
              height: 0,
              paddingTop: "100%",
            }}
          >
            <div
              style={{
                backgroundImage: previewImage
                  ? `url('${previewImage}')`
                  : `url('/images/placeholder.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              }}
            ></div>
          </div>

          <p className="text-xl font-semibold">${formData.basePrice}</p>
          <p className="text-xl">Inventory: {formData.stockQuantity}</p>
          <p className="text-xl">
            Category: {formData.productCategory || "No Category"}
          </p>
          {/* <p className="text-xl">Description: {formData.description}</p> */}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            onClick={() => setShowEditDialog(true)}
            className="w-full hover:scale-105 duration-75 ease-in-out bg-blue-500 text-white"
          >
            Edit
          </Button>
          <Button
            onClick={handleIncreaseStock}
            className="w-full hover:scale-105 duration-75 ease-in-out bg-green-500 text-white"
          >
            ➕
          </Button>
          <Button
            onClick={handleDecreaseStock}
            className="w-full hover:scale-105 duration-75 ease-in-out bg-red-500 text-white"
          >
            ➖
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basePrice: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stockQuantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockQuantity: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.productCategory}
                onValueChange={(value) =>
                  setFormData({ ...formData, productCategory: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.categoryId} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="image">Product Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              {previewImage && (
                <div className="mt-2">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-w-full h-auto rounded-md"
                    style={{ maxHeight: "200px" }}
                  />
                </div>
              )}
            </div>
            <Button type="submit" className="w-full">
              Update Product
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductStockCard;
