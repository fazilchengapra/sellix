import { Loader2, List } from 'lucide-react';
import { TicketRow } from '../ui/TicketRow';
import { ErrorState } from '../ui/Atoms';

export function ListStep({ tickets, loadingTickets, error, loadTickets, onOpenTicket, onNewTicket }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 pt-3">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-0.5">Your tickets</p>
        <button onClick={onNewTicket} className="text-xs text-blue-600 font-semibold hover:underline">+ New ticket</button>
      </div>
      {loadingTickets ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={20} className="animate-spin text-blue-400" /></div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadTickets} />
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-300">
          <List size={24} />
          <p className="text-xs text-gray-400">No tickets yet.</p>
          <button onClick={onNewTicket} className="mt-1 text-xs text-blue-600 font-medium hover:underline">Create your first ticket</button>
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.map((t) => <TicketRow key={t.id} ticket={t} onClick={onOpenTicket} />)}
        </div>
      )}
    </div>
  );
}
