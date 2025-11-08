import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-sm hover-lift hover-zoom group">
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500"
        />
      </div>
      <div className="p-6 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {product.type}
            </p>
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {product.title}
            </h3>
          </div>
          <p className="text-xl font-bold text-primary">₹{product.price}</p>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs text-muted-foreground">Sizes:</span>
          <div className="flex gap-1">
            {product.sizes.map((size) => (
              <span
                key={size}
                className="px-2 py-1 bg-muted text-xs rounded"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
