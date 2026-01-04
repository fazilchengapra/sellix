export interface ProductSize {
  size: number;
  stock: number;
}

export interface ProductColor {
  colorName: string;
  hex: string;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  discount: number;
  finalPrice: number;
  description: string;
  ratings: number;
  reviewsCount: number;
  sizes: ProductSize[];
  colors: ProductColor[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  image: string;
  userId: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
  size?: number;
  color?: string;
  userId: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
  size: number;
  color: string;
  userId: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}
