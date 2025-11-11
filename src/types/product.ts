export interface Product {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  wowPrice?: number;
  offers?: string;
  type?: string;
  description: string;
  sizes: string[];
  image: string;
  created_at?: string;
  createdAt?: string;
}

export type ProductInput = Omit<Product, 'id' | 'created_at' | 'createdAt'>;
