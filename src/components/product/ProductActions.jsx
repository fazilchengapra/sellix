import { ShoppingCart, Heart, Share2 } from "lucide-react";
import { Button } from "../ui/Button";

const ProductActions = ({ onAddToCart, onToggleWishlist, isInWishlist }) => {
  return (
    <div className="mt-10 flex gap-4">
      <Button
        size="lg"
        className="flex-1 h-14 text-lg"
        onClick={onAddToCart}
      >
        <ShoppingCart className="w-5 h-5 mr-3" />
        Add to Cart
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="h-14 px-6"
        onClick={onToggleWishlist}
      >
        <Heart
          className={`w-6 h-6 ${
            isInWishlist ? "fill-red-500 text-red-500" : ""
          }`}
        />
      </Button>
      <Button variant="ghost" size="lg" className="h-14 px-6">
        <Share2 className="w-6 h-6" />
      </Button>
    </div>
  );
};
export default ProductActions;
