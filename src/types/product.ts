export interface Product {
  id: string;
  title: string;
  price: number;
  type: string;
  description: string;
  sizes: string[];
  image: string; // base64 encoded image
  createdAt: string;
}

export type ProductInput = Omit<Product, 'id' | 'createdAt'>;
