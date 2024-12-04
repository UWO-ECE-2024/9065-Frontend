import { useShoppingStore } from "@/providers/shopping-store-provider";
import { Category, ShoppingState, ShoppingStore } from "@/types/store";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

export const InitState: ShoppingState = {
  categorys: [],
  cart: [],
  user: {
    userId: 0,
    email: "",
    firstName: "",
    lastName: "",
  },
  tokens: {
    accessToken: "",
    refreshToken: "",
  },
};

export const createShoppingStore = (initState: ShoppingState = InitState) => {
  return createStore<ShoppingStore>()(
    persist(
      (set) => ({
        ...initState,
        actions: {
          setCategorys: (new_categorys: Category[]) =>
            set((state) => ({
              ...state,
              categorys: new_categorys,
            })),
          updateUser: (new_user) =>
            set((state) => ({
              ...state,
              user: new_user,
            })),
          updateTokens: (new_tokens) =>
            set((state) => ({
              ...state,
              tokens: new_tokens,
            })),
          updateCart: (new_cart) =>
            set((state) => ({
              ...state,
              cart: new_cart,
            })),
        },
      }),
      {
        name: "shopping-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => {
          return {
            categorys: state.categorys,
            user: state.user,
            tokens: state.tokens,
            cart: state.cart,
          };
        },
      }
    )
  );
};
export const useActions = () => useShoppingStore((state) => state.actions);
export const useCategorys = () => useShoppingStore((state) => state.categorys);
export const useUser = () => useShoppingStore((state) => state.user);
export const useTokens = () => useShoppingStore((state) => state.tokens);
export const useCart = () => useShoppingStore((state) => state.cart);
