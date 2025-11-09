import { Product, ProductInput } from '@/types/product';
import { supabase } from './supabase';

const STORAGE_BUCKET = 'product-images';
const STORAGE_KEY = 'krish_clothing_products';

// Initialize storage bucket (try create; ignore 'already exists' errors)
const initStorage = async () => {
  try {
    await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: 1024 * 1024 * 2, // 2MB
    });
  } catch (err) {
    // Supabase returns an error if the bucket already exists - ignore that
    let msg = '';
    if (err && typeof err === 'object' && 'message' in err) {
  msg = String((err as { message?: unknown }).message || '');
    } else {
      msg = String(err);
    }
    if (!/already exists|Bucket already exists/i.test(msg)) {
      console.warn('createBucket error (ignored):', msg);
    }
  }
};

// Initialize storage on first import
initStorage();

// Upload image and return public URL
export const uploadImage = async (imageFile: File): Promise<string> => {
  const extMatch = imageFile.name.match(/\.([0-9a-zA-Z]+)(?:\?|$)/);
  const ext = extMatch ? `.${extMatch[1]}` : '';
  const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}${ext}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, imageFile);

  if (error) {
    throw new Error('Error uploading image: ' + (error.message || JSON.stringify(error)));
  }

  // Get public URL
  const res = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);
  // res may contain data.publicUrl
  const publicUrl = (res as any)?.data?.publicUrl || '';

  if (!publicUrl) throw new Error('Failed to get public URL after upload');

  return publicUrl;
};

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
