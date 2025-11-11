# 🚀 Quick Setup Guide - Radhe Vastra

## ⚡ Fast Setup (5 Minutes)

### Step 1: Supabase Project Setup
1. Go to https://supabase.com/dashboard
2. Create a new project (or use existing)
3. Wait for project to be ready (~2 minutes)

### Step 2: Get Your Credentials
1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (long string under "Project API keys")

### Step 3: Add Environment Variables
1. Create `.env` file in `radhe-vastra` folder
2. Add these lines:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
3. Replace with your actual values from Step 2

### Step 4: Create Database Table ⚠️ IMPORTANT
1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Open `supabase-setup.sql` file from your project
4. **Copy ALL the SQL code**
5. Paste in SQL Editor
6. Click **Run** button (or press `Ctrl+Enter`)
7. Wait for **"Success"** message ✅

### Step 5: Create Storage Bucket
1. In Supabase dashboard, click **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Name: `product-images`
4. ✅ Check **Public bucket**
5. Click **Create bucket**

### Step 6: Test Your Setup
1. Run `npm run dev` in terminal
2. Open your website
3. Click the black heart emoji (🖤) in footer
4. Enter password: `Apriye6213kaithe`
5. If you see setup error → SQL script not run properly
6. If you see admin panel → ✅ Everything is working!

## 🔍 Troubleshooting

### ❌ Error: "Could not find the table 'public.products'"
**Solution:** You didn't run the SQL script!
- Go to Supabase → SQL Editor
- Run the `supabase-setup.sql` script again
- Make sure you see "Success" message

### ❌ Error: "Missing Supabase environment variables"
**Solution:** `.env` file is missing or incorrect!
- Check if `.env` file exists in `radhe-vastra` folder
- Verify variable names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after creating `.env` file

### ❌ Error: "Error uploading image"
**Solution:** Storage bucket not created!
- Go to Supabase → Storage
- Create bucket named `product-images`
- Make sure it's **Public**

### ❌ Admin Panel shows blank page
**Solution:** Check browser console for errors
- Open browser DevTools (F12)
- Check Console tab for error messages
- Follow the error instructions shown in admin panel

## ✅ Checklist

Before testing, make sure:
- [ ] Supabase project created
- [ ] `.env` file created with correct credentials
- [ ] SQL script run successfully in Supabase
- [ ] Storage bucket `product-images` created and public
- [ ] Dev server restarted after `.env` changes
- [ ] No errors in browser console

## 🎯 Next Steps

Once setup is complete:
1. Add your first product through admin panel
2. Check if it appears in the shop section
3. Test editing and deleting products
4. Verify images are uploading correctly

## 📞 Need Help?

If you're still facing issues:
1. Check browser console for detailed error messages
2. Verify all steps in this guide
3. Make sure SQL script ran without errors
4. Check Supabase dashboard for table and bucket

---

**Note:** The admin panel will automatically detect if the table is missing and show setup instructions. Just follow the steps shown in the error message!

