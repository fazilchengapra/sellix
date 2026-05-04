import { Star } from "lucide-react";
import { formatPrice } from "../../lib/utils";

const ProductInfo = ({ product }) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-blue-600 font-semibold mb-2 uppercase tracking-wide">
          {product.brand}
        </p>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-gray-900 font-medium">
              {product.ratings}
            </span>
          </div>
          <span className="text-gray-500 text-sm">
            ({product.reviews_count || product.reviewsCount || 0} reviews)
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold text-gray-900">
          {formatPrice(product.finalPrice)}
        </p>
        {product.discount > 0 && (
          <p className="text-sm text-gray-400 line-through">
            {formatPrice(product.price)}
          </p>
        )}
      </div>
    </div>
  );
};
export default ProductInfo;
