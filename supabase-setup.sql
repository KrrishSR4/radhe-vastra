-- Create products table in Supabase
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Create the products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    old_price NUMERIC(10, 2),
    discount_percent NUMERIC(5, 2),
    wow_price NUMERIC(10, 2),
    offers TEXT,
    type TEXT,
    description TEXT NOT NULL,
    sizes JSONB DEFAULT '[]'::jsonb,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to allow re-running this script)
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
DROP POLICY IF EXISTS "Allow all operations" ON public.products;

-- Create policy to allow anyone to read products (for public access)
CREATE POLICY "Allow public read access" ON public.products
    FOR SELECT
    USING (true);

-- Create policy to allow insert, update, delete (you can restrict this later with authentication)
-- For now, allowing all operations. You should add authentication later.
CREATE POLICY "Allow all operations" ON public.products
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- ============================================
-- STORAGE BUCKET SETUP (Do this manually)
-- ============================================
-- The storage bucket needs to be created manually in Supabase dashboard:
-- 
-- 1. Go to Storage section in Supabase dashboard
-- 2. Click "Create a new bucket"
-- 3. Name: product-images
-- 4. Make it Public (check the checkbox)
-- 5. Click "Create bucket"
--
-- Storage policies will be created automatically when bucket is created.
-- If you need custom policies, create them in Storage > Policies section.

