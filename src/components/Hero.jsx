import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- Types ---

// --- Data ---
const SLIDES: Slide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1556906781-9a412961d289?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    title: "Level Up Your Style",
    subtitle: "Premium Sneakers Collection",
    description: "Discover the latest trends in footwear fashion. Find your perfect pair today.",
    cta: "Shop Now",
    link: "#featured"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    title: "Run With Comfort",
    subtitle: "Performance Series",
    description: "Lightweight, breathable, and designed for speed. Break your personal records.",
    cta: "View Collection",
    link: "#featured"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    title: "Urban Streetwear",
    subtitle: "The City Edition",
    description: "Bold designs for the modern sneakerhead. Stand out from the crowd.",
    cta: "Explore",
    link: "#featured"
  }
];

// --- Sub-components ---

const SlideContent = ({ slide, isActive }) => {
  const handleScroll = (e) => {
    e.preventDefault();
    const element = document.getElementById('featured');
    if (element) {
      element.scrollIntoView({ behavior);
    }
  };

  return (
     void }) => {
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
    const positionClass = direction === 'prev' ? 'left-4' : 'right-4';

    return (
         void }) => {
    return (
        
            {Array.from({ length).map((_, index) => (
                 onChange(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        current === index
                            ? "w-8 bg-blue-600"
                            : "bg-white/50 hover:bg-white"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        
    );
};

// --- Main Component ---
const Hero = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev === SLIDES.length - 1 ? 0 ));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev === 0 ? SLIDES.length - 1 ));
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]); 

  return (
    
      {SLIDES.map((slide, index) => (
        
      ))}

      
      

      
    
  );
};

export default Hero;
