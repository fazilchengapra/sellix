import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductSelectors from "../components/product/ProductSelectors";
import ProductActions from "../components/product/ProductActions";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();
  const { showToast } = useToast();
  const { user } = useAuth();

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
    if (!product) return "";
    const colorObj = product.colors.find((c) => c.colorName === selectedColor);
    return colorObj?.images[0] || product.colors[0]?.images[0] || "";
  };

  const handleAddToCart = () => {
    try {
      if (!product || !selectedSize || !selectedColor) return;

      addToCart({
        productId: product.id,
        productName: product.name,
        price: product.finalPrice || product.price,
        image: getCurrentImage(),
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
      });
      showToast("Added to cart", "success");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleWishlist = () => {
    if (!product) return;

    // Check if item is already in wishlist to get its ID
    const wishlistItem = wishlist.find((item) => item.productId === product.id);

    if (wishlistItem) {
      removeFromWishlist(wishlistItem.id);
      showToast("Removed from wishlist", "info");
    } else {
      addToWishlist({
        productId: product.id,
        productName: product.name,
        price: product.finalPrice || product.price,
        image: getCurrentImage(),
      });
      showToast("Added to wishlist", "success");
    }
  };

  const handleActions = (action) => {
    if (!user) return showToast("Please login, then try again", "warning");
    action()
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );
  }

  const currentImage = getCurrentImage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        variant="ghost"
        className="mb-8 pl-0 hover:bg-transparent hover:text-blue-600 focus:outline-none border-none"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Gallery */}
        <ProductGallery image={currentImage} name={product.name} />

        {/* Info */}
        <div className="py-4">
          <ProductInfo product={product} />

          <div className="prose prose-blue text-gray-500 mb-8">
            <p>{product.description}</p>
          </div>

          {/* Selectors */}
          <ProductSelectors
            sizes={product.sizes}
            colors={product.colors}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />

          <ProductActions
            onAddToCart={() => handleActions(handleAddToCart)}
            onToggleWishlist={() => handleActions(toggleWishlist)}
            isInWishlist={isInWishlist(product.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
