import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Product } from '../types';

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const image = product.colors?.[0]?.images?.[0] || '';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ 
        productId: product.id, 
        productName: product.name, 
        price: product.price, 
        image: image, 
        quantity: 1,
        size: product.sizes?.[0]?.size,
        color: product.colors?.[0]?.colorName
    });
    showToast("Added to cart", "success");
  };

  return (
    <Card className="group h-full flex flex-col transition-all hover:shadow-xl border border-gray-100">
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] bg-gray-50 overflow-hidden">
        <img 
          src={image} 
          alt={product.name} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            -{product.discount}%
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Button size="lg" className="w-full shadow-xl" onClick={handleAddToCart}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
            </Button>
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`} className="block">
             <h3 className="text-gray-900 font-semibold group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500 mb-3">{product.brand}</p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {product.discount > 0 ? (
                <>
                  <span className="text-lg font-bold text-blue-600">${product.finalPrice}</span>
                  <span className="text-sm text-gray-400 line-through">${product.price}</span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">${product.price}</span>
              )}
            </div>
          </div>
          <div className="flex items-center text-yellow-500 text-xs">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="ml-1 text-gray-600 font-medium">{product.ratings}</span>
            <span className="ml-1 text-gray-400">({product.reviewsCount})</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
