import { ProductData } from "./request-and-response";

export type ProductCardProps = ProductData;
export type ProductStockCardProps = {
  productId: number;
  name: string;
  description: string;
  basePrice: number;
  stockQuantity: number;
  productCategory: number;
  imageUrl?: string;
  onStockChange?: () => void;
};
