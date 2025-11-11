# Supabase Setup Guide

## Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Sign up / Login
3. Create a new project
4. Wait for the project to be set up (takes 2-3 minutes)

## Step 2: Get Your Supabase Credentials
1. Go to your Supabase project dashboard
2. Click on "Settings" (gear icon) in the sidebar
3. Go to "API" section
4. Copy the following:
   - **Project URL** (something like: `https://xxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys")

## Step 3: Create Environment Variables
1. In your project root (`radhe-vastra` folder), create a `.env` file
2. Add the following:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
3. Replace `your_project_url_here` and `your_anon_key_here` with your actual values

## Step 4: Create Database Table
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Click "New query"
4. Copy and paste the entire contents of `supabase-setup.sql` file
5. Click "Run" or press Ctrl+Enter
6. You should see "Success. No rows returned" message

## Step 5: Create Storage Bucket (if not created by SQL)
1. Go to "Storage" in the sidebar
2. Click "Create a new bucket"
3. Name it: `product-images`
4. Make it **Public**
5. Click "Create bucket"

## Step 6: Verify Setup
1. Go to "Table Editor" in the sidebar
2. You should see `products` table
3. Check the columns match:
   - id (uuid)
   - title (text)
   - price (numeric)
   - old_price (numeric)
   - discount_percent (numeric)
   - wow_price (numeric)
   - offers (text)
   - type (text)
   - description (text)
   - sizes (jsonb)
   - image (text)
   - created_at (timestamp)

## Step 7: Test Your Application
1. Run `npm run dev` in your project
2. Open the website
3. Click on the black heart emoji (🖤) in the footer
4. Enter password: `Apriye6213kaithe`
5. Try adding a product

## Troubleshooting

### Error: "Could not find the table 'public.products'"
- Make sure you ran the SQL script from `supabase-setup.sql`
- Check that the table exists in "Table Editor"

### Error: "Missing Supabase environment variables"
- Make sure `.env` file exists in `radhe-vastra` folder
- Make sure variable names are correct: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after creating `.env` file

### Error: "Error uploading image"
- Make sure storage bucket `product-images` exists
- Make sure the bucket is public
- Check storage policies in "Storage" > "Policies"

### Images not showing
- Check that storage bucket is public
- Verify the image URL is accessible
- Check browser console for CORS errors

## Security Note
Currently, the RLS (Row Level Security) policies allow all operations. For production, you should:
1. Add authentication to your app
2. Restrict insert/update/delete operations to authenticated users only
3. Keep read operations public for products

