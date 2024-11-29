import { request } from "@/lib/utils";

export const ProductService = {
  fetchProducts: async () =>
    await request({ method: "GET", path: "/v1/products/list" }),
};
