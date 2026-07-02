import { MessageCircle } from 'lucide-react';
import { fmtDate } from '../../../utils/format';
import { CATEGORIES } from '../../../constants/support.constants';
import { StatusBadge, PriorityBadge } from './Atoms';

const getCat = (key) => CATEGORIES.find((c) => c.key === key);

export function TicketRow({ ticket, onClick }) {
  const cat  = getCat(ticket.category);
  const Icon = cat?.icon ?? MessageCircle;
  return (
    <button
      onClick={() => onClick(ticket)}
      className="w-full flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/20 transition-all duration-150 text-left group"
    >
      <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={13} className={cat?.iconColor ?? 'text-gray-500'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-800 truncate">{ticket.subject}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-gray-400">{fmtDate(ticket.created_at)}</span>
          <span className="text-gray-200">·</span>
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>
      <StatusBadge status={ticket.status} />
    </button>
  );
}
