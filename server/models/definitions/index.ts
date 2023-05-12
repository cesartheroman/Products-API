export interface ProductsListProps {
  count?: number;
  page?: number;
}

export interface Product {
  id: number;
  name: string;
  slogan: string;
  description: string;
  category: string;
  default_price: number;
  features?: Record<string, string>[];
}
