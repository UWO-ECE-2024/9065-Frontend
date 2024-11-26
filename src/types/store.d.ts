export type ShoppingState = {
  categorys: Category[];
};

export type ShoppingAction = {
  actions: {
    setCategorys: (categorys: Category[]) => void;
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
