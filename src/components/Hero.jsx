import { Link } from "react-router-dom";
import { ShoppingBag, Star, TrendingUp } from "lucide-react";
import { Button } from "./ui/Button";

const Hero = () => {
  return (
    <div className="relative bg-linear-to-br from-blue-50 via-white to-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent"></div>
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                <Star className="w-4 h-4 mr-2 fill-current" />
                <span>Premium Collection 2026</span>
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6">
                <span className="block">Discover Products</span>
                <span className="block bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  That Define You
                </span>
              </h1>
              <p className="mt-4 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 mb-8">
                Explore our curated collection of premium products, designed for
                the modern lifestyle. Quality meets exceptional value.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                <Link to="/products">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 shadow-lg hover:shadow-xl transition-all"
                  >
                    Shop Now
                    <ShoppingBag className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                  >
                    View Collection
                    <TrendingUp className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="relative h-56 sm:h-72 md:h-96 lg:h-full w-full">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Shopping collection"
          />
          <div className="absolute inset-0 bg-linear-to-r from-white via-white/60 to-transparent lg:via-white/20"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
