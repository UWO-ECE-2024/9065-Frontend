import { Product, ProductAttribute, ProductImage } from "./store";

export type CustomRequest = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  data?: object;
};

export type ProductData = Product & {
  attributes: ProductAttribute[];
  images: ProductImage[];
};
