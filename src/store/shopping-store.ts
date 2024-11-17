import { useShoppingStore } from "@/providers/shopping-store-provider";
import { Category, ShoppingState, ShoppingStore } from "@/types/store";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

export const InitState: ShoppingState = {
  categorys: [],
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
        },
      }),
      {
        name: "shopping-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => {
          return { categorys: state.categorys };
        },
      }
    )
  );
};
export const useActions = () => useShoppingStore((state) => state.actions);
export const useCategorys = () => useShoppingStore((state) => state.categorys);
