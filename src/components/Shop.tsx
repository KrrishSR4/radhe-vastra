import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { getProducts } from '@/utils/storage';
import ProductCard from './ProductCard';

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
    
    // Listen for storage changes from admin panel (same tab)
    const handleStorageChange = () => {
      loadProducts();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productsUpdated', handleStorageChange);
    
    // Auto-refresh products every 30 seconds to show new products added by admin
    // This ensures users see new products without manually refreshing the page
    const refreshInterval = setInterval(() => {
      loadProducts();
    }, 30000); // Refresh every 30 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productsUpdated', handleStorageChange);
      clearInterval(refreshInterval);
    };
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data || []);
  };

  return (
    <section id="shop" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Our Collection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated selection of minimalist fashion pieces
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-muted rounded-xl p-12 max-w-md mx-auto">
              <p className="text-muted-foreground text-lg mb-2">No products yet</p>
              <p className="text-sm text-muted-foreground">
                Products will appear here once added by admin
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Shop;
