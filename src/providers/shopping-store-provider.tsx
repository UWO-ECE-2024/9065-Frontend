"use client";

import { createShoppingStore } from "@/store/shopping-store";
import { ShoppingStore } from "@/types/store";
import { createContext, ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

export type ShoppingStoreApi = ReturnType<typeof createShoppingStore>;

export const ShoppingStoreContext = createContext<ShoppingStoreApi | undefined>(
  undefined
);

export interface ShoppingStoreProviderProps {
  children: ReactNode;
}

export const ShoppingStoreProvider = ({
  children,
}: ShoppingStoreProviderProps) => {
  const storeRef = useRef<ShoppingStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createShoppingStore();
  }

  return (
    <ShoppingStoreContext.Provider value={storeRef.current}>
      {children}
    </ShoppingStoreContext.Provider>
  );
};

export const useShoppingStore = <T,>(
  selector: (store: ShoppingStore) => T
): T => {
  const shoppingStoreContext = useContext(ShoppingStoreContext);
  if (!shoppingStoreContext) {
    throw new Error(
      "useShoppingStore must be used within a ShoppingStoreProvider"
    );
  }
  return useStore(shoppingStoreContext, selector);
};
