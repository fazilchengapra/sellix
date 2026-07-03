import { List } from 'lucide-react';
import { CATEGORIES } from '../../../constants/support.constants';
import { CategoryCard } from '../ui/CategoryCard';
import { useAuth } from '../../../context/AuthContext';

export function SelectStep({ onSelect, onViewTickets }) {
  const user_data = useAuth();
  
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-0.5">Choose a topic</p>
      <div className="space-y-2">
        {CATEGORIES.map((c) => <CategoryCard key={c.key} cat={c} onClick={onSelect} user={user_data.user} />)}
      </div>
      <button
        onClick={onViewTickets}
        className="w-full flex items-center justify-center gap-1.5 mt-5 py-2 text-xs text-gray-400 hover:text-blue-600 transition-colors font-medium"
      >
        <List size={13} />
        View my tickets
      </button>
    </div>
  );
}
