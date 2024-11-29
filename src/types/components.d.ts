export type ProductCardProps = {
  id: number;
  name: string;
  price: number;
};
export type ProductStockCardProps = {
    productId: number,
    name: string,
    basePrice: number,
    stockQuantity: number,
    key?: unknown,
    imageUrl?: string;
}
