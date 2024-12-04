import { request } from "@/lib/utils";

export const ProductService = {
  fetchProducts: async () =>
    await request({ method: "GET", path: "/v1/products/list" }),
  fetchProductById: async (productId: string) =>
    await request({ method: "GET", path: `/v1/products/${productId}` }),
  searchProducts: async (data: { query?: string; category?: string }) =>
    await request({
      method: "GET",
      path: `/v1/products/search?query=${data.query}&category=${data.category}`,
    }),
};
