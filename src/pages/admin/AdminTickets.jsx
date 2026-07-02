import { Headphones, RefreshCw } from 'lucide-react';
import { useAdminTickets } from '../../hooks/useAdminTickets';
import { STATS_CONFIG } from '../../constants/adminTickets.constants';
import { TicketList } from '../../components/admin/tickets/TicketList';
import { ThreadView } from '../../components/admin/tickets/ThreadView';

const AdminTickets = () => {
  const m = useAdminTickets();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-sm text-gray-500 mt-0.5">{m.stats.all} total tickets</p>
        </div>
        <button
          onClick={m.fetchTickets}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={14} className={m.loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS_CONFIG.map((s) => (
          <div key={s.key} className={`${s.bg} border ${s.border} rounded-2xl p-4`}>
            <p className={`text-2xl font-bold ${s.color}`}>{m.stats[s.key]}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Split pane */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex" style={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}>
        <TicketList
          filtered={m.filtered} loading={m.loading}
          search={m.search} setSearch={m.setSearch}
          statusFilter={m.statusFilter} setStatusFilter={m.setStatusFilter}
          stats={m.stats} selectedId={m.selectedTicket?.id}
          onSelect={m.handleSelectTicket}
        />

        {!m.selectedTicket ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-300">
            <Headphones size={36} />
            <p className="text-sm text-gray-400">Select a ticket to view the conversation</p>
          </div>
        ) : (
          <ThreadView
            ticket={m.selectedTicket} messages={m.messages}
            loadingThread={m.loadingThread} replyText={m.replyText} setReplyText={m.setReplyText}
            sending={m.sending} resolving={m.resolving} wsConnected={m.wsConnected}
            inputRef={m.inputRef} messagesEndRef={m.messagesEndRef} catMeta={m.catMeta}
            onSend={m.handleSendReply} onKeyDown={m.handleKeyDown} onResolve={m.handleResolve}
          />
        )}
      </div>
    </div>
  );
};

export default AdminTickets;
