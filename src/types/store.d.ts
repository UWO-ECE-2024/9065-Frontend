export type ShoppingState = {
  categorys: Category[];
  user: {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export type ShoppingAction = {
  actions: {
    setCategorys: (categorys: Category[]) => void;
    updateUser: (user: ShoppingState["user"]) => void;
    updateTokens: (tokens: ShoppingState["tokens"]) => void;
  };
};

export type ShoppingStore = ShoppingState & ShoppingAction;

export type Category = {
  categoryId: number;
  name: string;
  description: string;
  parentCategoryId: number | null;
  isActive: boolean;
};

export type Product = {
  productId: number;
  categoryId: number;
  name: string;
  description: string;
  basePrice: string;
  stockQuantity: number;
  isActive: boolean;
};

export type ProductAttribute = null | {};

export type ProductImage = {
  imageId: number;
  productId: number;
  url: string;
  altText: null | string;
  displayOrder: number;
  isPrimary: boolean;
};
