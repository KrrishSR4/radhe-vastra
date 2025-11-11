import { Product, ProductInput } from '@/types/product';
import { supabase } from './supabase';

const STORAGE_BUCKET = 'product-images';

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

// Helper function to convert camelCase to snake_case for database
const toSnakeCase = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (typeof obj !== 'object') return obj;
  
  const snakeCaseObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      snakeCaseObj[snakeKey] = toSnakeCase(obj[key]);
    }
  }
  return snakeCaseObj;
};

// Helper function to convert snake_case to camelCase from database
const toCamelCase = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj !== 'object') return obj;
  
  const camelCaseObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      camelCaseObj[camelKey] = toCamelCase(obj[key]);
    }
  }
  return camelCaseObj;
};

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
  const publicUrl = (res as any)?.data?.publicUrl || '';

  if (!publicUrl) throw new Error('Failed to get public URL after upload');

  return publicUrl;
};

// Check if table exists
export const checkTableExists = async (): Promise<{ exists: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (error) {
      if (error.message.includes('does not exist') || error.message.includes('schema cache')) {
        return { exists: false, error: 'Table does not exist. Please run the SQL setup script.' };
      }
      return { exists: false, error: error.message };
    }
    return { exists: true };
  } catch (error: any) {
    return { exists: false, error: error?.message || 'Unknown error' };
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.message.includes('does not exist') || error.message.includes('schema cache')) {
        console.error('❌ PRODUCTS TABLE NOT FOUND!');
        console.error('Please follow these steps:');
        console.error('1. Go to your Supabase dashboard');
        console.error('2. Click on "SQL Editor"');
        console.error('3. Copy the SQL from supabase-setup.sql file');
        console.error('4. Run the SQL script');
        throw new Error('Products table does not exist. Please run the SQL setup script in Supabase dashboard (SQL Editor). See SUPABASE_SETUP.md for detailed instructions.');
      }
      throw error;
    }
    // Convert snake_case from database to camelCase for TypeScript
    return (data || []).map(toCamelCase) as Product[];
  } catch (error: any) {
    console.error('Error loading products:', error);
    if (error.message.includes('table does not exist')) {
      throw error; // Re-throw with clear message
    }
    return [];
  }
};

export const saveProduct = async (product: ProductInput): Promise<Product> => {
  // Convert camelCase to snake_case for database
  const dbProduct = toSnakeCase({
    ...product,
    created_at: new Date().toISOString(),
  });

  const { data, error } = await supabase
    .from('products')
    .insert([dbProduct])
    .select()
    .single();

  if (error) {
    if (error.message.includes('does not exist') || error.message.includes('schema cache')) {
      const setupMessage = `
❌ PRODUCTS TABLE NOT FOUND IN SUPABASE!

Please follow these steps to fix:
1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New query"
5. Open the file: supabase-setup.sql
6. Copy ALL the SQL code from that file
7. Paste it in the SQL Editor
8. Click "Run" button (or press Ctrl+Enter)
9. Wait for "Success" message
10. Refresh this page and try again

For detailed instructions, see: SUPABASE_SETUP.md

Error details: ${error.message}
      `;
      console.error(setupMessage);
      throw new Error('Products table does not exist. Please run the SQL setup script in Supabase dashboard. Check console for detailed instructions.');
    }
    throw new Error('Error saving product: ' + error.message);
  }
  if (!data) throw new Error('No data returned after saving product');

  // Convert back to camelCase
  return toCamelCase(data) as Product;
};

export const updateProduct = async (id: string, productData: ProductInput): Promise<Product | null> => {
  // Convert camelCase to snake_case for database
  const dbProduct = toSnakeCase(productData);

  const { data, error } = await supabase
    .from('products')
    .update(dbProduct)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error('Error updating product: ' + error.message);
  
  // Convert back to camelCase
  return data ? (toCamelCase(data) as Product) : null;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw new Error('Error deleting product: ' + error.message);
};

export const clearAllProducts = async (): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .neq('id', '0'); // Delete all products

  if (error) throw new Error('Error clearing products: ' + error.message);
};
