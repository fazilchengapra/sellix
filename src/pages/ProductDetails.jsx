import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Star } from 'lucide-react';
import { 
    ProductImages, 
    ProductHeader, 
    ProductPrice, 
    ColorSelector, 
    SizeSelector, 
    ActionButtons 
} from '../components/ProductDetailsComponents';

[];
  colors: { colorName: string; hex: string; images: string[] }[];
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product", error);
        showToast("Failed to load product details", "error");
      }
    };
    fetchProduct();
  }, [id, showToast]);

  if (!product) {
    return (
        
            
        
    )
  }

  const currentImages = product.colors[selectedColor].images;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = async () => {
    
    if (!selectedSize) {
        showToast("Please select a size", "warning");
        return;
    }
    await addToCart({
        productId);
    showToast(`${product.name} added to cart!`, "success");
  };

  const handleWishlist = async () => {
      await addToWishlist({
          productId);
      showToast(`Added to wishlist`, "success");
  };

  return (
     navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors"
        >
          
          Back to Browse
        

        
          

          
            
            
            
              
                
                {product.ratings}
              
              |
              {product.reviewsCount} reviews
            

            

            
              {product.description}
            

             {
                    setSelectedColor(idx);
                    setActiveImage(0);
                }} 
            />

            

            
          
        
      
    
  );
};

export default ProductDetails;
