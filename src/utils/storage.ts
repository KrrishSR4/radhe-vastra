import { Product, ProductInput } from '@/types/product';

const STORAGE_KEY = 'krish_clothing_products';

export const getProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

export const saveProduct = (product: ProductInput): Product => {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return newProduct;
};

export const updateProduct = (id: string, productData: ProductInput): Product | null => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  const updatedProduct: Product = {
    ...productData,
    id: products[index].id,
    createdAt: products[index].createdAt,
  };
  
  products[index] = updatedProduct;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return updatedProduct;
};

export const deleteProduct = (id: string): void => {
  const products = getProducts().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const clearAllProducts = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
