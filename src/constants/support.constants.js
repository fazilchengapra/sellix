import { MessageCircle, Package, RotateCcw, Wrench, CreditCard } from 'lucide-react';

export const CATEGORIES = [
  { key: 'general', label: 'General Inquiry', icon: MessageCircle, iconColor: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', description: "Ask us anything — we're here to help.", anonymous_allow: true },
  { key: 'order_issue', label: 'Order Issue', icon: Package, iconColor: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', description: "Problems with your order? Let's fix it.", anonymous_allow: false },
  { key: 'refund', label: 'Refund Request', icon: RotateCcw, iconColor: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', description: 'Request a refund for your purchase.', anonymous_allow: false },
  { key: 'technical', label: 'Technical Problem', icon: Wrench, iconColor: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', description: 'Experiencing technical difficulties?', anonymous_allow: true },
  { key: 'payment', label: 'Payment Issue', icon: CreditCard, iconColor: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', description: 'Issues with billing or payments.', anonymous_allow: false },
];

export const ORDER_REQUIRED_KEYS = new Set(['order_issue', 'refund', 'payment']);