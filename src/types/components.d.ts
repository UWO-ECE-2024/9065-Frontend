import { ProductData } from "./request-and-response";

export type ProductCardProps = ProductData;
export type ProductStockCardProps = {
  productId: number;
  name: string;
  basePrice: number;
  stockQuantity: number;
  key?: unknown;
  imageUrl?: string;
};
