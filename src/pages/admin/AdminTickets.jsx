import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Headphones,
  Search,
  Send,
  Loader2,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
  Package,
  RotateCcw,
  CreditCard,
  Wrench,
  MessageCircle,
  Inbox,
  AlertCircle,
  Filter,
} from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

/* ─── helpers ─── */
const CATEGORY_META = {
  general:     { label: 'General Inquiry',   icon: MessageCircle, color: 'text-gray-500' },
  order_issue: { label: 'Order Issue',       icon: Package,       color: 'text-blue-500' },
  refund:      { label: 'Refund Request',    icon: RotateCcw,     color: 'text-blue-500' },
  technical:   { label: 'Technical Problem', icon: Wrench,        color: 'text-gray-500' },
  payment:     { label: 'Payment Issue',     icon: CreditCard,    color: 'text-blue-500' },
};

const STATUS_STYLES = {
  open:        'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed:      'bg-gray-100 text-gray-500 border-gray-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  resolved:    'bg-purple-50 text-purple-700 border-purple-200',
};

const DOT_STYLES = {
  open:        'bg-emerald-500 animate-pulse',
  closed:      'bg-gray-400',
  in_progress: 'bg-blue-500',
  resolved:    'bg-purple-500',
};

const PRIORITY_STYLES = {
  low:    'text-gray-400',
  medium: 'text-amber-500',
  high:   'text-red-500',
};

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtTime(d) {
  if (!d) return '';
  return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ─── Status badge ─── */
function StatusBadge({ status }) {
  const label =
    status === 'in_progress' ? 'In Progress'
    : status?.charAt(0).toUpperCase() + status?.slice(1);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${STATUS_STYLES[status] ?? STATUS_STYLES.open}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${DOT_STYLES[status] ?? DOT_STYLES.open}`} />
      {label}
    </span>
  );
}

/* ─── Chat bubble ─── */
function ChatBubble({ msg }) {
  const isStaff = msg.is_staff_reply;
  return (
    <div className={`flex ${isStaff ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isStaff && (
        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
          <span className="text-[11px] font-bold text-gray-500">U</span>
        </div>
      )}
      <div className={`max-w-[72%] flex flex-col gap-1 ${isStaff ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isStaff
              ? 'bg-blue-600 text-white rounded-br-sm shadow-sm shadow-blue-100'
              : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
          }`}
        >
          {msg.message}
        </div>
        {msg.created_at && (
          <span className="text-[10px] text-gray-400 px-1">{fmtTime(msg.created_at)}</span>
        )}
        {isStaff && (
          <span className="text-[10px] text-blue-400 px-1 font-medium">Staff</span>
        )}
      </div>
      {isStaff && (
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center ml-2 flex-shrink-0 mt-1">
          <Headphones size={13} className="text-blue-600" />
        </div>
      )}
    </div>
  );
}

/* ─── Ticket list row ─── */
function TicketRow({ ticket, selected, onClick }) {
  const meta = CATEGORY_META[ticket.category];
  const Icon = meta?.icon ?? MessageCircle;
  return (
    <button
      onClick={() => onClick(ticket)}
      className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all duration-150 border-l-2 ${
        selected
          ? 'bg-blue-50 border-l-blue-600'
          : 'bg-white border-l-transparent hover:bg-gray-50/80'
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${selected ? 'bg-blue-100' : 'bg-gray-100'}`}>
        <Icon size={14} className={selected ? 'text-blue-600' : (meta?.color ?? 'text-gray-400')} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1.5 mb-1">
          <p className={`font-medium text-sm truncate leading-snug ${
            selected ? 'text-blue-900' : 'text-gray-800'
          }`}>
            {ticket.subject}
          </p>
          <ChevronRight size={13} className={`flex-shrink-0 ${selected ? 'text-blue-400' : 'text-gray-300'}`} />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <StatusBadge status={ticket.status} />
          <span className={`text-[11px] font-medium capitalize ${PRIORITY_STYLES[ticket.priority] ?? 'text-gray-400'}`}>
            {ticket.priority}
          </span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-400">User #{ticket.user}</span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-400">{fmtDate(ticket.created_at)}</span>
        </div>
      </div>
    </button>
  );
}

/* ─── Main page ─── */
const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [resolving, setResolving] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const wsRef = useRef(null);
  const [wsConnected, setWsConnected] = useState(false);
  const { showToast } = useToast();

  /* Scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* Focus input when ticket changes */
  useEffect(() => {
    if (selectedTicket) setTimeout(() => inputRef.current?.focus(), 200);
  }, [selectedTicket?.id]);

  /* Cleanup WebSocket on unmount */
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  /* Filter tickets */
  useEffect(() => {
    let result = [...tickets];
    if (statusFilter !== 'all') result = result.filter((t) => t.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.subject?.toLowerCase().includes(q) ||
          String(t.id).includes(q) ||
          String(t.user).includes(q)
      );
    }
    setFiltered(result);
  }, [tickets, search, statusFilter]);

  /* Load all tickets */
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/tickets/');
      const data = res.data.data ?? [];
      setTickets(data);
    } catch {
      showToast('Failed to load tickets', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  /* Open WebSocket for real-time incoming messages */
  const openWebSocket = (id) => {
    // Close any existing connection first
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setWsConnected(false);

    const ws = new WebSocket(`ws://localhost:8000/ws/tickets/${id}/`);

    ws.onopen = () => setWsConnected(true);

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        // Backend sends: { type: "ticket.message", message_id, message, is_staff_reply, created_at }
        if (msg.type === 'ticket.message') {
          const normalized = {
            id: msg.message_id,
            message: msg.message,
            is_staff_reply: msg.is_staff_reply,
            created_at: msg.created_at,
          };
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === normalized.id);
            if (exists) return prev;
            // Replace optimistic temp bubble if present
            const tempIdx = prev.findLastIndex?.((m) => String(m.id).startsWith('temp-'));
            if (tempIdx !== -1) {
              const next = [...prev];
              next[tempIdx] = normalized;
              return next;
            }
            return [...prev, normalized];
          });
        }
      } catch {
        // ignore malformed frames
      }
    };

    ws.onerror = () => setWsConnected(false);
    ws.onclose = () => setWsConnected(false);

    wsRef.current = ws;
  };

  /* Load ticket thread — REST for history, then open WS for real-time */
  const fetchThread = async (id) => {
    setLoadingThread(true);
    try {
      const res = await api.get(`/admin/tickets/${id}/`);
      const data = res.data.data;
      setSelectedTicket((prev) => ({ ...prev, ...data }));
      setMessages(data.messages ?? []);
      openWebSocket(id);
    } catch {
      showToast('Failed to load ticket thread', 'error');
    } finally {
      setLoadingThread(false);
    }
  };

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setMessages([]);
    setReplyText('');
    fetchThread(ticket.id);
  };

  /* Send reply — via WebSocket so both sides get it in real-time */
  const handleSendReply = async () => {
    const trimmed = replyText.trim();
    if (!trimmed || sending || !selectedTicket?.id) return;

    // Primary path: send via WebSocket
    // Backend receive() saves it (is_staff_reply=True for staff) and broadcasts to the group
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const tempId = `temp-${Date.now()}`;
      setMessages((prev) => [...prev, {
        id: tempId,
        message: trimmed,
        is_staff_reply: true,
        created_at: new Date().toISOString(),
      }]);
      setReplyText('');
      wsRef.current.send(JSON.stringify({ message: trimmed }));
      return;
    }

    // Fallback to REST if WebSocket is not open
    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [...prev, { id: tempId, message: trimmed, is_staff_reply: true, created_at: new Date().toISOString() }]);
    setReplyText('');
    setSending(true);
    try {
      await api.post(`/admin/tickets/${selectedTicket.id}/reply/`, { message: trimmed });
      const res = await api.get(`/admin/tickets/${selectedTicket.id}/`);
      const data = res.data.data;
      setSelectedTicket((prev) => ({ ...prev, ...data }));
      setMessages(data.messages ?? []);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setReplyText(trimmed);
      showToast('Failed to send reply', 'error');
    } finally {
      setSending(false);
    }
  };

  /* Resolve ticket */
  const handleResolve = async () => {
    if (!selectedTicket?.id || resolving) return;
    setResolving(true);
    try {
      const res = await api.patch(`/admin/tickets/${selectedTicket.id}/resolve/`);
      const updated = res.data.data;
      setSelectedTicket((prev) => ({ ...prev, status: updated.status }));
      setTickets((prev) => prev.map((t) => t.id === updated.id ? { ...t, status: updated.status } : t));
      showToast('Ticket resolved', 'success');
    } catch {
      showToast('Failed to resolve ticket', 'error');
    } finally {
      setResolving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(); }
  };

  const catMeta = selectedTicket ? (CATEGORY_META[selectedTicket.category] ?? CATEGORY_META.general) : null;
  const CatIcon = catMeta?.icon ?? MessageCircle;

  /* ── Stats bar ── */
  const stats = {
    all:         tickets.length,
    open:        tickets.filter((t) => t.status === 'open').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved:    tickets.filter((t) => t.status === 'resolved').length,
    closed:      tickets.filter((t) => t.status === 'closed').length,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-sm text-gray-500 mt-0.5">{tickets.length} total tickets</p>
        </div>
        <button
          onClick={fetchTickets}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Open',        count: stats.open,        color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'In Progress', count: stats.in_progress, color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
          { label: 'Resolved',    count: stats.resolved,    color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-100' },
          { label: 'Closed',      count: stats.closed,      color: 'text-gray-500',    bg: 'bg-gray-50',    border: 'border-gray-200' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main split pane */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex" style={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}>

        {/* ── Left: Ticket List ── */}
        <div className="w-96 flex-shrink-0 flex flex-col border-r border-gray-100">
          {/* Search + filter */}
          <div className="p-3 border-b border-gray-100 space-y-2">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by subject, ID or user…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                id="admin-ticket-search"
              />
            </div>
            {/* Status filter dropdown */}
            <div className="flex items-center gap-2">
              <Filter size={13} className="text-gray-400 flex-shrink-0" />
              <select
                id="admin-ticket-status-filter"
                value={statusFilter}
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

          {/* List */}
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
                <TicketRow
                  key={t.id}
                  ticket={t}
                  selected={selectedTicket?.id === t.id}
                  onClick={handleSelectTicket}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Right: Thread view ── */}
        {!selectedTicket ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-300">
            <Headphones size={36} />
            <p className="text-sm text-gray-400">Select a ticket to view the conversation</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Thread header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <CatIcon size={16} className={catMeta?.color ?? 'text-gray-400'} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-900 text-sm leading-snug truncate">
                    {selectedTicket.subject}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <StatusBadge status={selectedTicket.status} />
                    <span className={`text-[11px] font-medium ${PRIORITY_STYLES[selectedTicket.priority] ?? ''}`}>
                      {selectedTicket.priority} priority
                    </span>
                    <span className="text-[11px] text-gray-400">
                      User #{selectedTicket.user}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      #{selectedTicket.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resolve button */}
              {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
                <button
                  onClick={handleResolve}
                  disabled={resolving}
                  id="admin-resolve-ticket-btn"
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-700 border border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors disabled:opacity-50"
                >
                  {resolving ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={13} />}
                  Mark Resolved
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 bg-gray-50">
              {loadingThread ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 size={22} className="animate-spin text-blue-400" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-300">
                  <MessageCircle size={26} />
                  <p className="text-xs text-gray-400">No messages yet</p>
                </div>
              ) : (
                <>
                  {/* Ticket creation timestamp */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[11px] text-gray-400 flex-shrink-0">
                      Ticket opened · {fmtDate(selectedTicket.created_at)}
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  {messages.map((msg) => <ChatBubble key={msg.id} msg={msg} />)}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply bar */}
            {selectedTicket.status === 'resolved' || selectedTicket.status === 'closed' ? (
              <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-center">
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <AlertCircle size={13} />
                  This ticket is {selectedTicket.status}. No further replies allowed.
                </p>
              </div>
            ) : (
              <div className="px-4 py-3 border-t border-gray-100 bg-white">
                <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mb-0.5">
                    <Headphones size={11} className="text-white" />
                  </div>
                  <textarea
                    ref={inputRef}
                    id="admin-reply-input"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a reply as staff…"
                    rows={1}
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none leading-5 max-h-32 overflow-y-auto py-1"
                    style={{ minHeight: '24px' }}
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || sending}
                    id="admin-send-reply-btn"
                    aria-label="Send reply"
                    className="mb-0.5 w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-all active:scale-95 shadow-sm shadow-blue-600/25"
                  >
                    {sending
                      ? <Loader2 size={14} className="text-white animate-spin" />
                      : <Send size={14} className="text-white translate-x-0.5" />
                    }
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5 px-1">
                  Replying as <span className="font-semibold text-blue-600">Staff</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTickets;
