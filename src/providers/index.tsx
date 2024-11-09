"use client";
import QueriesProvider from "./QueriesProvider";
import { ShoppingStoreProvider } from "./shopping-store-provider";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ShoppingStoreProvider>
      <QueriesProvider>{children}</QueriesProvider>
    </ShoppingStoreProvider>
  );
};

export default Providers;
