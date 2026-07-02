import { Headphones } from 'lucide-react';
import { STATUS_STYLES, DOT_STYLES, PRIORITY_STYLES, CATEGORY_META } from '../../../../constants/adminTickets.constants';
import { MessageCircle, ChevronRight } from 'lucide-react';

/* ── Date / time helpers ── */
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '';
export const fmtTime = (d) => d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

/* ── StatusBadge ── */
export function StatusBadge({ status }) {
  const label = status === 'in_progress' ? 'In Progress' : (status?.charAt(0).toUpperCase() + status?.slice(1));
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${STATUS_STYLES[status] ?? STATUS_STYLES.open}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${DOT_STYLES[status] ?? DOT_STYLES.open}`} />
      {label}
    </span>
  );
}

/* ── ChatBubble ── */
export function ChatBubble({ msg }) {
  const isStaff = msg.is_staff_reply;
  return (
    <div className={`flex ${isStaff ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isStaff && (
        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
          <span className="text-[11px] font-bold text-gray-500">U</span>
        </div>
      )}
      <div className={`max-w-[72%] flex flex-col gap-1 ${isStaff ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isStaff ? 'bg-blue-600 text-white rounded-br-sm shadow-sm shadow-blue-100' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'}`}>
          {msg.message}
        </div>
        {msg.created_at && <span className="text-[10px] text-gray-400 px-1">{fmtTime(msg.created_at)}</span>}
        {isStaff && <span className="text-[10px] text-blue-400 px-1 font-medium">Staff</span>}
      </div>
      {isStaff && (
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center ml-2 flex-shrink-0 mt-1">
          <Headphones size={13} className="text-blue-600" />
        </div>
      )}
    </div>
  );
}

/* ── TicketRow ── */
export function TicketRow({ ticket, selected, onClick }) {
  const meta = CATEGORY_META[ticket.category];
  const Icon = meta?.icon ?? MessageCircle;
  return (
    <button
      onClick={() => onClick(ticket)}
      className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all duration-150 border-l-2 ${selected ? 'bg-blue-50 border-l-blue-600' : 'bg-white border-l-transparent hover:bg-gray-50/80'}`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${selected ? 'bg-blue-100' : 'bg-gray-100'}`}>
        <Icon size={14} className={selected ? 'text-blue-600' : (meta?.color ?? 'text-gray-400')} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1.5 mb-1">
          <p className={`font-medium text-sm truncate leading-snug ${selected ? 'text-blue-900' : 'text-gray-800'}`}>{ticket.subject}</p>
          <ChevronRight size={13} className={`flex-shrink-0 ${selected ? 'text-blue-400' : 'text-gray-300'}`} />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <StatusBadge status={ticket.status} />
          <span className={`text-[11px] font-medium capitalize ${PRIORITY_STYLES[ticket.priority] ?? 'text-gray-400'}`}>{ticket.priority}</span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-400">User #{ticket.user}</span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-400">{fmtDate(ticket.created_at)}</span>
        </div>
      </div>
    </button>
  );
}
