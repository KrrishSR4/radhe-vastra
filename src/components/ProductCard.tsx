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
            {product.type && (
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {product.type}
              </p>
            )}
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {product.title}
            </h3>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {product.oldPrice && product.oldPrice > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.oldPrice}
              </span>
            )}
            {product.discountPercent && product.discountPercent > 0 && (
              <span className="text-sm font-semibold text-green-600">
                {product.discountPercent}% OFF
              </span>
            )}
            <span className="text-xl font-bold text-primary">₹{product.price}</span>
            {product.wowPrice && product.wowPrice > 0 && (
              <span className="text-xs bg-muted px-2 py-1 rounded">
                WOW ₹{product.wowPrice}
              </span>
            )}
          </div>
          {product.offers && (
            <p className="text-xs text-blue-600 font-medium">{product.offers}</p>
          )}
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
