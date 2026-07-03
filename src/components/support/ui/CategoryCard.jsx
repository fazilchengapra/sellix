import { ChevronRight } from 'lucide-react';
import { ORDER_REQUIRED_KEYS } from '../../../constants/support.constants';

export function CategoryCard({ cat, onClick, user }) {
  const Icon = cat.icon;
  
  if (cat.anonymous_allow === false && !user) {
    return
  }
  
  return (
    <button
      onClick={() => onClick(cat)}
      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border ${cat.border} ${cat.bg} hover:shadow-sm active:scale-[0.99] transition-all duration-150 group text-left`}
    >
      <Icon size={16} className={`${cat.iconColor} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-800">{cat.label}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{cat.description}</p>
      </div>
      {ORDER_REQUIRED_KEYS.has(cat.key) && (
        <span className="text-[9px] font-semibold text-blue-500 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
          Order required
        </span>
      )}
      <ChevronRight size={14} className="text-gray-300 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}
