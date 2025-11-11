import { useState, useEffect } from 'react';
import { X, Upload, Trash2, Plus, Edit2, AlertCircle } from 'lucide-react';
import { Product, ProductInput } from '@/types/product';
import { saveProduct, getProducts, deleteProduct, clearAllProducts, updateProduct, uploadImage, checkTableExists } from '@/utils/storage';
import { toast } from 'sonner';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const [formData, setFormData] = useState<any>({
    title: '',
    price: 0,
    oldPrice: 0,
    discountPercent: 0,
    description: '',
    sizes: [],
    image: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [sizeInput, setSizeInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableExists, setTableExists] = useState<boolean | null>(null);
  const [tableError, setTableError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      checkSetup();
    }
  }, [isOpen]);

  const checkSetup = async () => {
    try {
      const result = await checkTableExists();
      setTableExists(result.exists);
      setTableError(result.error || '');
      if (result.exists) {
        loadProducts();
      } else {
        toast.error('Database table not found! Please run SQL setup script.', {
          duration: 10000,
        });
      }
    } catch (error: any) {
      setTableExists(false);
      setTableError(error?.message || 'Unknown error');
      toast.error('Database connection error!', {
        duration: 10000,
      });
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error loading products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImagePreview(result);
        };
        reader.readAsDataURL(file);

        // Upload to Supabase
        const imageUrl = await uploadImage(file);
        setFormData(prev => ({ ...prev, image: imageUrl }));
        toast.success('Image uploaded successfully');
      } catch (error: any) {
        console.error('Error uploading image:', error);
        toast.error('Error uploading image: ' + (error?.message || String(error)));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddSize = () => {
    if (sizeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        sizes: prev.sizes.includes(sizeInput.trim()) ? prev.sizes : [...prev.sizes, sizeInput.trim()],
      }));
      setSizeInput('');
    }
  };

  const handleRemoveSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      toast.error('Please upload an image');
      return;
    }
    
    if (formData.sizes.length === 0) {
      toast.error('Please add at least one size');
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        // Update existing product
        await updateProduct(editingId, formData);
        toast.success('Product updated successfully!');
      } else {
        // Add new product
        await saveProduct(formData);
        toast.success('Product added successfully!');
      }
      
      // Reset form
      setFormData({
        title: '',
        price: 0,
        oldPrice: 0,
        discountPercent: 0,
        description: '',
        sizes: [],
        image: '',
      });
      setImagePreview('');
      setEditingId(null);
      await loadProducts();
      
      // Dispatch event to update shop
      window.dispatchEvent(new Event('productsUpdated'));
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setFormData({
        title: product.title,
        price: product.price,
        oldPrice: product.oldPrice || 0,
        discountPercent: product.discountPercent || 0,
        type: product.type || '',
        description: product.description,
        sizes: product.sizes,
        image: product.image,
      });
      setImagePreview(product.image);
      setEditingId(id);
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.info('Editing product');
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      title: '',
      price: 0,
      oldPrice: 0,
      discountPercent: 0,
      description: '',
      sizes: [],
      image: '',
    });
    setImagePreview('');
    setEditingId(null);
    toast.info('Edit cancelled');
  };

  const handleDelete = async (id: string) => {
    if (editingId === id) {
      handleCancelEdit();
    }
    try {
      setLoading(true);
      await deleteProduct(id);
      toast.success('Product deleted');
      await loadProducts();
      window.dispatchEvent(new Event('productsUpdated'));
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error?.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL products?')) {
      try {
        setLoading(true);
        await clearAllProducts();
        toast.success('All products cleared');
        setProducts([]);
        window.dispatchEvent(new Event('productsUpdated'));
      } catch (error: any) {
        console.error('Error clearing products:', error);
        toast.error(error?.message || 'Failed to clear products');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-background rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between z-20">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-xl">
            <div className="text-lg font-medium">Loading...</div>
          </div>
        )}

        {/* Setup Error Alert */}
        {tableExists === false && (
          <div className="p-6">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-destructive mt-1 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-destructive">Database Table Not Found!</h3>
                  <p className="text-sm text-muted-foreground">
                    The products table does not exist in your Supabase database. Please follow these steps to set it up:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-2">
                    <li>Go to your Supabase dashboard: <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://supabase.com/dashboard</a></li>
                    <li>Select your project</li>
                    <li>Click on <strong>"SQL Editor"</strong> in the left sidebar</li>
                    <li>Click <strong>"New query"</strong> button</li>
                    <li>Open the file <code className="bg-muted px-2 py-1 rounded">supabase-setup.sql</code> from your project</li>
                    <li>Copy <strong>ALL</strong> the SQL code from that file</li>
                    <li>Paste it in the SQL Editor</li>
                    <li>Click <strong>"Run"</strong> button (or press Ctrl+Enter)</li>
                    <li>Wait for <strong>"Success"</strong> message</li>
                    <li>Close this admin panel and open it again</li>
                  </ol>
                  {tableError && (
                    <div className="mt-4 p-3 bg-muted rounded text-xs font-mono text-muted-foreground">
                      Error: {tableError}
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={checkSetup}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm"
                    >
                      Check Again
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:opacity-90 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tableExists === true && (
          <div className="p-6 space-y-8">
          {/* Add/Edit Product Form */}
          <div className="bg-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Old Price (₹)</label>
                  <input
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, oldPrice: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, discountPercent: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>



                <div>
                  <label className="block text-sm font-medium mb-2">Sizes</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                      placeholder="e.g., S, M, L"
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.sizes.map((size: string) => (
                      <span
                        key={size}
                        className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-2"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(size)}
                          className="hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-xs rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (editingId ? 'Update Product' : 'Add Product')}
              </button>
            </form>
          </div>

          {/* Product List */}
          <div className="bg-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Manage Products ({products.length})</h3>
              {products.length > 0 && (
                <button
                  onClick={handleClearAll}
                  disabled={loading}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            {products.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No products yet</p>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 bg-muted rounded-lg"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{product.title}</h4>
                      <div className="text-sm text-muted-foreground">
                        {product.oldPrice && (
                          <span style={{ textDecoration: 'line-through', marginRight: 8 }}>
                            ₹{product.oldPrice}
                          </span>
                        )}
                        <span style={{ color: '#388e3c', fontWeight: 'bold', marginRight: 8 }}>
                          {product.discountPercent ? `${product.discountPercent}% OFF` : ''}
                        </span>
                        <span style={{ fontWeight: 'bold', marginRight: 8 }}>
                          ₹{product.price}
                        </span>

                        <span style={{ marginLeft: 8 }}>
                          {product.sizes.join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product.id)}
                        disabled={loading}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Edit product"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={loading}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete product"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
