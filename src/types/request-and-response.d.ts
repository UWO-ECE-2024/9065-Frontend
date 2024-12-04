import { Product, ProductAttribute, ProductImage } from "./store";

export type CustomRequest = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  data?: object;
  token?: string;
};

export type ProductData = Product & {
  attributes: ProductAttribute[];
  images: ProductImage[];
};

export type ProductPageData = ProductData & {
  reviews: ProductReview[];
};

export type Address = {
  addressId: number;
  userId: number;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};
