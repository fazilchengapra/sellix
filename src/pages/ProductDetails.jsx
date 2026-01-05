import { useEffect, useState } from 'react';
import { formatPrice } from '../lib/utils';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft, Star, Share2 } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const {user} = useAuth()
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      const data = response.data;
      setProduct(data);
      if (data.sizes?.length > 0) setSelectedSize(data.sizes[0].size);
      if (data.colors?.length > 0) setSelectedColor(data.colors[0].colorName);
    } catch (error) {
      console.error("Error fetching product", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentImage = () => {
    if (!product) return '';
    const colorObj = product.colors.find(c => c.colorName === selectedColor);
    return colorObj?.images[0] || product.colors[0]?.images[0] || '';
  };

  const handleAddToCart = () => {
    if(!user) return showToast('Please login, then try again', 'warning')
    if (!product || !selectedSize || !selectedColor) return;
    
    addToCart({ 
        productId: product.id,
        productName: product.name,
        price: product.finalPrice || product.price,
        image: getCurrentImage(),
        quantity: 1,
        size: selectedSize,
        color: selectedColor
    });
    showToast("Added to cart", "success");
  };

const toggleWishlist = () => {
    if (!product) return;
    
    // Check if item is already in wishlist to get its ID
    const wishlistItem = wishlist.find(item => item.productId === product.id);
    
    if (wishlistItem) {
        removeFromWishlist(wishlistItem.id);
        showToast("Removed from wishlist", "info");
    } else {
        addToWishlist({
            productId: product.id,
            productName: product.name,
            price: product.finalPrice || product.price,
            image: getCurrentImage()
        });
        showToast("Added to wishlist", "success");
    }
};

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size={40} /></div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  const currentImage = getCurrentImage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-blue-600" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Gallery */}
        <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <img src={currentImage} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            {/* Thumbnails could be added here iterating product.colors[x].images */}
        </div>

        {/* Info */}
        <div className="py-4">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-sm text-blue-600 font-semibold mb-2 uppercase tracking-wide">{product.brand}</p>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-gray-900 font-medium">{product.ratings}</span>
                    </div>
                    <span className="text-gray-500 text-sm">({product.reviewsCount} reviews)</span>
                </div>
             </div>
             <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{formatPrice(product.finalPrice)}</p>
                {product.discount > 0 && (
                    <p className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</p>
                )}
             </div>
          </div>

          <div className="prose prose-blue text-gray-500 mb-8">
            <p>{product.description}</p>
          </div>

          {/* Selectors */}
          <div className="space-y-6 pt-6 border-t border-gray-100">
             {product.sizes && (
                 <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Select Size</h3>
                    <div className="flex flex-wrap gap-3">
                        {product.sizes.map(sizeObj => (
                           <button 
                             key={sizeObj.size}
                             onClick={() => setSelectedSize(sizeObj.size)}
                             className={`w-12 h-12 rounded-xl border flex items-center justify-center font-medium transition-all ${
                                 selectedSize === sizeObj.size 
                                 ? 'border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-600 ring-offset-2' 
                                 : 'border-gray-200 text-gray-700 hover:border-gray-300'
                             }`}
                           >
                            {sizeObj.size}
                           </button>
                        ))}
                    </div>
                 </div>
             )}

             {product.colors && (
                 <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Select Color</h3>
                    <div className="flex flex-wrap gap-3">
                        {product.colors.map(color => (
                           <button 
                             key={color.colorName}
                             onClick={() => setSelectedColor(color.colorName)}
                             className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                                 selectedColor === color.colorName 
                                 ? 'ring-2 ring-blue-600 ring-offset-2' 
                                 : 'border-gray-200 hover:border-gray-300'
                             }`}
                             style={{ backgroundColor: color.hex }}
                             title={color.colorName}
                           />
                        ))}
                    </div>
                 </div>
             )}
          </div>

          <div className="mt-10 flex gap-4">
             <Button size="lg" className="flex-1 h-14 text-lg" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5 mr-3" />
                Add to Cart
             </Button>
             <Button variant="outline" size="lg" className="h-14 px-6" onClick={toggleWishlist}>
                 <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
             </Button>
             <Button variant="ghost" size="lg" className="h-14 px-6">
                 <Share2 className="w-6 h-6" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
