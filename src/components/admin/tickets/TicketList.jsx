import { Search, Filter, Loader2, Inbox } from 'lucide-react';
import { TicketRow } from './ui/Atoms';

export function TicketList({ filtered, loading, search, setSearch, statusFilter, setStatusFilter, stats, selectedId, onSelect }) {
  return (
    <div className="w-96 flex-shrink-0 flex flex-col border-r border-gray-100">
      {/* Search + filter */}
      <div className="p-3 border-b border-gray-100 space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            id="admin-ticket-search" type="text"
            placeholder="Search by subject, ID or user…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-gray-400 flex-shrink-0" />
          <select
            id="admin-ticket-status-filter" value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all cursor-pointer"
          >
            <option value="all">All tickets ({stats.all})</option>
            <option value="open">Open ({stats.open})</option>
            <option value="in_progress">In Progress ({stats.in_progress})</option>
            <option value="resolved">Resolved ({stats.resolved})</option>
            <option value="closed">Closed ({stats.closed})</option>
          </select>
          <span className="text-[11px] text-gray-400 flex-shrink-0 font-medium">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Ticket rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={22} className="animate-spin text-blue-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-300 py-10">
            <Inbox size={26} />
            <p className="text-xs text-gray-400">No tickets found</p>
          </div>
        ) : (
          filtered.map((t) => (
            <TicketRow key={t.id} ticket={t} selected={selectedId === t.id} onClick={onSelect} />
          ))
        )}
      </div>
    </div>
  );
}
