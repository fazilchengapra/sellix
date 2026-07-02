import { MessageCircle, Package, RotateCcw, Wrench, CreditCard } from 'lucide-react';

export const CATEGORY_META = {
  general:     { label: 'General Inquiry',   icon: MessageCircle, color: 'text-gray-500' },
  order_issue: { label: 'Order Issue',       icon: Package,       color: 'text-blue-500' },
  refund:      { label: 'Refund Request',    icon: RotateCcw,     color: 'text-blue-500' },
  technical:   { label: 'Technical Problem', icon: Wrench,        color: 'text-gray-500' },
  payment:     { label: 'Payment Issue',     icon: CreditCard,    color: 'text-blue-500' },
};

export const STATUS_STYLES = {
  open:        'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed:      'bg-gray-100 text-gray-500 border-gray-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  resolved:    'bg-purple-50 text-purple-700 border-purple-200',
};

export const DOT_STYLES = {
  open:        'bg-emerald-500 animate-pulse',
  closed:      'bg-gray-400',
  in_progress: 'bg-blue-500',
  resolved:    'bg-purple-500',
};

export const PRIORITY_STYLES = {
  low:    'text-gray-400',
  medium: 'text-amber-500',
  high:   'text-red-500',
};

export const STATS_CONFIG = [
  { key: 'open',        label: 'Open',        color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { key: 'in_progress', label: 'In Progress', color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
  { key: 'resolved',    label: 'Resolved',    color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-100' },
  { key: 'closed',      label: 'Closed',      color: 'text-gray-500',    bg: 'bg-gray-50',    border: 'border-gray-200' },
];
