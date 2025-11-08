import { useState, useEffect } from 'react';
import { X, Upload, Trash2, Plus, Edit2 } from 'lucide-react';
import { ProductInput } from '@/types/product';
import { saveProduct, getProducts, deleteProduct, clearAllProducts, updateProduct } from '@/utils/storage';
import { toast } from 'sonner';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const [formData, setFormData] = useState<ProductInput>({
    title: '',
    price: 0,
    type: '',
    description: '',
    sizes: [],
    image: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [products, setProducts] = useState(getProducts());
  const [sizeInput, setSizeInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setProducts(getProducts());
    }
  }, [isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSize = () => {
    if (sizeInput.trim() && !formData.sizes.includes(sizeInput.trim())) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, sizeInput.trim()],
      });
      setSizeInput('');
    }
  };

  const handleRemoveSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter(s => s !== size),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      toast.error('Please upload an image');
      return;
    }
    
    if (formData.sizes.length === 0) {
      toast.error('Please add at least one size');
      return;
    }

    if (editingId) {
      // Update existing product
      const updated = updateProduct(editingId, formData);
      if (updated) {
        toast.success('Product updated successfully!');
      } else {
        toast.error('Failed to update product');
        return;
      }
    } else {
      // Add new product
      saveProduct(formData);
      toast.success('Product added successfully!');
    }
    
    // Reset form
    setFormData({
      title: '',
      price: 0,
      type: '',
      description: '',
      sizes: [],
      image: '',
    });
    setImagePreview('');
    setEditingId(null);
    setProducts(getProducts());
    
    // Dispatch event to update shop
    window.dispatchEvent(new Event('productsUpdated'));
  };

  const handleEdit = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setFormData({
        title: product.title,
        price: product.price,
        type: product.type,
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
      type: '',
      description: '',
      sizes: [],
      image: '',
    });
    setImagePreview('');
    setEditingId(null);
    toast.info('Edit cancelled');
  };

  const handleDelete = (id: string) => {
    if (editingId === id) {
      handleCancelEdit();
    }
    deleteProduct(id);
    toast.success('Product deleted');
    setProducts(getProducts());
    window.dispatchEvent(new Event('productsUpdated'));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL products?')) {
      clearAllProducts();
      toast.success('All products cleared');
      setProducts([]);
      window.dispatchEvent(new Event('productsUpdated'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-background rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

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
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g., Shirt, Hoodie"
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
                    {formData.sizes.map((size) => (
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
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                className="w-full px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                {editingId ? 'Update Product' : 'Add Product'}
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
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 flex items-center gap-2"
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
                      <p className="text-sm text-muted-foreground">
                        {product.type} • ₹{product.price} • {product.sizes.join(', ')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
      </div>
    </div>
  );
};

export default AdminPanel;
