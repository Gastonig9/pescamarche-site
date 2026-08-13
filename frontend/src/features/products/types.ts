export interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  brand?: string;
  category?: string;
  subcategory?: string;
  sku?: string;
  stock: number;
  featured?: boolean;
}
