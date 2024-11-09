import { ShoppingState, ShoppingStore } from "@/types/store";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

export const InitState: ShoppingState = {
  cart: [],
};

export const createShoppingStore = (initState: ShoppingState = InitState) => {
  return createStore<ShoppingStore>()(
    persist(
      (set) => ({
        ...initState,
      }),
      {
        name: "shopping-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => {
          return { cart: state.cart };
        },
      }
    )
  );
};
