import { request } from "@/lib/utils";

export const CategoryService = {
  fetchCategories: async () =>
    await request({ method: "GET", path: "/v1/category/list" }),
};
