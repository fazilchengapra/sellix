import { useEffect, useRef, useState } from 'react';
import {
  X, Send, Headphones, ChevronRight, ChevronLeft, Package, RotateCcw,
  CreditCard, Wrench, MessageCircle, Loader2, XCircle, RefreshCw, List,
  AlertCircle, Search, ShoppingBag, ChevronDown, CheckCircle2,
} from 'lucide-react';
import api from '../../api/axios';

const CATEGORIES = [
  { key: 'general', label: 'General Inquiry', icon: MessageCircle, iconColor: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', description: "Ask us anything — we're here to help." },
  { key: 'order_issue', label: 'Order Issue', icon: Package, iconColor: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', description: "Problems with your order? Let's fix it." },
  { key: 'refund', label: 'Refund Request', icon: RotateCcw, iconColor: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', description: 'Request a refund for your purchase.' },
  { key: 'technical', label: 'Technical Problem', icon: Wrench, iconColor: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', description: 'Experiencing technical difficulties?' },
  { key: 'payment', label: 'Payment Issue', icon: CreditCard, iconColor: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', description: 'Issues with billing or payments.' },
];

const ORDER_REQUIRED_KEYS = new Set(['order_issue', 'refund', 'payment']);
const getCat = (key) => CATEGORIES.find((c) => c.key === key);

function fmtDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function fmtPrice(val) {
  if (val == null) return '';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

function StatusBadge({ status }) {
  const map = {
    open:        'bg-emerald-50 text-emerald-700 border-emerald-200',
    closed:      'bg-gray-100 text-gray-500 border-gray-200',
    in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  const dotMap = {
    open:        'bg-emerald-500 animate-pulse',
    closed:      'bg-gray-400',
    in_progress: 'bg-blue-500',
  };
  const label = status === 'in_progress' ? 'In Progress' : (status?.charAt(0).toUpperCase() + status?.slice(1));
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${map[status] ?? map.open}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotMap[status] ?? dotMap.open}`} />
      {label}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const map = { low: 'text-gray-400', medium: 'text-yellow-600', high: 'text-red-500' };
  return (
    <span className={`text-[11px] font-medium ${map[priority] ?? 'text-gray-400'}`}>
      {priority?.charAt(0).toUpperCase() + priority?.slice(1)} priority
    </span>
  );
}

function CategoryCard({ cat, onClick }) {
  const Icon = cat.icon;
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

function ChatBubble({ msg }) {
  const isUser = !msg.is_staff_reply;
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mr-2 flex-shrink-0 mt-1 shadow-sm">
          <Headphones size={11} className="text-white" />
        </div>
      )}
      <div className={`max-w-[78%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isUser ? 'bg-blue-600 text-white rounded-br-sm shadow-sm shadow-blue-200' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'}`}>
          {msg.message ?? msg.body}
        </div>
        {msg.created_at && (
          <span className="text-[10px] text-gray-400 px-1">{fmtTime(msg.created_at)}</span>
        )}
      </div>
    </div>
  );
}

function TicketRow({ ticket, onClick }) {
  const cat = getCat(ticket.category);
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

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
      <AlertCircle size={22} className="text-gray-300" />
      <p className="text-xs text-gray-400 text-center max-w-[200px]">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-xs text-blue-600 font-medium hover:underline">
          Try again
        </button>
      )}
    </div>
  );
}

function OrderPicker({ selectedOrder, onSelect }) {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [query, setQuery]     = useState('');
  const [open, setOpen]       = useState(false);
  const dropdownRef           = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/orders/');
        const data = res.data?.results || res.data || [];
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setError('Could not load orders.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = orders.filter((o) => {
    const q = query.toLowerCase();
    return !q || String(o.id).toLowerCase().includes(q) || o.status?.toLowerCase().includes(q);
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm text-left transition-all ${selectedOrder ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-200 bg-white hover:border-blue-300'}`}
      >
        <ShoppingBag size={14} className={selectedOrder ? 'text-blue-500' : 'text-gray-400'} />
        <span className={`flex-1 truncate ${selectedOrder ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
          {selectedOrder ? `Order #${String(selectedOrder.id).substring(0, 8).toUpperCase()} · ${selectedOrder.status}` : 'Select an order…'}
        </span>
        {selectedOrder
          ? <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0" />
          : <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        }
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <Search size={13} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search orders…"
              autoFocus
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
          </div>
          <div className="max-h-44 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={18} className="animate-spin text-blue-400" />
              </div>
            ) : error ? (
              <p className="text-xs text-red-400 text-center py-6">{error}</p>
            ) : filtered.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No orders found</p>
            ) : (
              filtered.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => { onSelect(o); setOpen(false); setQuery(''); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-blue-50 ${selectedOrder?.id === o.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Package size={12} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      Order #{String(o.id).substring(0, 8).toUpperCase()}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {fmtDate(o.created_at)}
                      {o.total != null && ` · ${fmtPrice(o.total)}`}
                      {` · `}
                      <span className={o.status === 'Delivered' ? 'text-emerald-600 font-medium' : o.status === 'Cancelled' ? 'text-red-400 font-medium' : 'text-gray-500'}>{o.status}</span>
                    </p>
                  </div>
                  {selectedOrder?.id === o.id && <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────── Main component ─────────────── */
const SupportTicketModal = ({ isOpen, onClose, order }) => {
  const [step, setStep]                   = useState('select');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subject, setSubject]             = useState('');
  const [selectedOrder, setSelectedOrder] = useState(order ?? null);

  const [ticket, setTicket]               = useState(null);
  const [messages, setMessages]           = useState([]);
  const [tickets, setTickets]             = useState([]);

  const [inputValue, setInputValue]       = useState('');
  const [creating, setCreating]           = useState(false);
  const [sending, setSending]             = useState(false);
  const [loadingMsgs, setLoadingMsgs]     = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketAction, setTicketAction]   = useState(false);
  const [error, setError]                 = useState(null);
  const [wsConnected, setWsConnected]     = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const subjectRef     = useRef(null);
  const wsRef          = useRef(null);   // ✅ WebSocket ref

  useEffect(() => { setSelectedOrder(order ?? null); }, [order]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  useEffect(() => {
    if (step === 'chat') setTimeout(() => inputRef.current?.focus(), 300);
    if (step === 'form') setTimeout(() => subjectRef.current?.focus(), 200);
  }, [step]);

  useEffect(() => {
    if (step === 'chat' && ticket?.id) loadThread(ticket.id);
  }, [step, ticket?.id]);

  useEffect(() => {
    if (step === 'list') loadTickets();
  }, [step]);

  // ✅ Cleanup WebSocket when component unmounts
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  const needsOrder        = selectedCategory && ORDER_REQUIRED_KEYS.has(selectedCategory.key);
  const orderLockedFromProp = Boolean(order?.id);
  const showOrderPicker   = needsOrder && !orderLockedFromProp;
  const orderMissing      = needsOrder && !selectedOrder?.id;
  const canCreate         = subject.trim() && !orderMissing && !creating;

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const reset = () => {
    // ✅ Close WebSocket on modal close
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setWsConnected(false);
    setStep('select');
    setSelectedCategory(null);
    setSubject('');
    setSelectedOrder(order ?? null);
    setTicket(null);
    setMessages([]);
    setTickets([]);
    setInputValue('');
    setError(null);
  };

  const goBack = () => {
    setError(null);
    if (step === 'form') {
      setStep('select');
      setSelectedCategory(null);
      setSubject('');
      if (!orderLockedFromProp) setSelectedOrder(null);
    } else if (step === 'chat') {
      // ✅ Close WS when leaving chat
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setWsConnected(false);
      setStep('list');
    } else if (step === 'list') {
      setStep('select');
    }
  };

  const loadTickets = async () => {
    setLoadingTickets(true);
    setError(null);
    try {
      const res = await api.get('/tickets/');
      setTickets(res.data.data ?? []);
    } catch {
      setError('Failed to load tickets.');
    } finally {
      setLoadingTickets(false);
    }
  };

  // ✅ Fixed loadThread — REST for history, WS for real-time
  const loadThread = async (id) => {
    setLoadingMsgs(true);
    setError(null);
    try {
      // 1. Load history via REST
      const res = await api.get(`/tickets/${id}/`);
      const data = res.data.data;
      setTicket((prev) => ({ ...prev, ...data }));
      setMessages(data.messages ?? []);

      // 2. Close any existing WS
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setWsConnected(false);

      // 3. Open WebSocket for real-time new messages
      const ws = new WebSocket(`ws://localhost:8000/ws/tickets/${id}/`);

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setWsConnected(true);
        setError(null);
      };

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
              // Replace the latest optimistic temp bubble
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

      ws.onerror = () => {
        setError('Connection error. Messages may be delayed.');
        setWsConnected(false);
      };

      ws.onclose = (e) => {
        console.log('🔌 WS closed', e.code, e.reason);
        setWsConnected(false);
      };

      wsRef.current = ws;

    } catch {
      setError('Failed to load messages.');
    } finally {
      setLoadingMsgs(false);
    }
  };

  const handleCreate = async () => {
    if (!canCreate) return;
    setCreating(true);
    setError(null);
    try {
      const body = { category: selectedCategory.key, subject: subject.trim() };
      if (selectedOrder?.id) body.order = selectedOrder.id;
      const res = await api.post('/tickets/', body);
      setTicket(res.data.data);
      setStep('chat');
    } catch {
      setError('Could not create ticket. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  // Send via WebSocket (with optimistic bubble) or fall back to REST
  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || sending || !ticket?.id) return;

    // Send via WebSocket if connected
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      // Optimistic bubble so the message appears immediately
      const tempId = `temp-${Date.now()}`;
      setMessages((prev) => [...prev, {
        id: tempId,
        message: trimmed,
        is_staff_reply: false,
        created_at: new Date().toISOString(),
      }]);
      setInputValue('');
      wsRef.current.send(JSON.stringify({ message: trimmed }));
      return;
    }

    // Fallback to REST if WS is not open
    const temp = {
      id: `temp-${Date.now()}`,
      message: trimmed,
      is_staff_reply: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, temp]);
    setInputValue('');
    setSending(true);
    try {
      await api.post(`/tickets/${ticket.id}/replay/`, { message: trimmed, attachments: [] });
      await loadThread(ticket.id);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== temp.id));
      setInputValue(trimmed);
      setError('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleClose_ticket = async () => {
    if (!ticket?.id || ticketAction) return;
    setTicketAction(true);
    try {
      const res = await api.patch(`/tickets/${ticket.id}/close/`);
      setTicket((prev) => ({ ...prev, status: res.data.data.status }));
    } catch {
      setError('Failed to close ticket.');
    } finally {
      setTicketAction(false);
    }
  };

  const handleReopen = async () => {
    if (!ticket?.id || ticketAction) return;
    setTicketAction(true);
    try {
      const res = await api.patch(`/tickets/${ticket.id}/re-open/`);
      setTicket((prev) => ({ ...prev, status: res.data.data.status }));
    } catch {
      setError('Failed to reopen ticket.');
    } finally {
      setTicketAction(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openTicketFromList = (t) => {
    setTicket(t);
    setSelectedCategory(getCat(t.category) ?? null);
    setStep('chat');
  };

  const isTicketOpen = ticket?.status === 'open' || ticket?.status === 'in_progress';
  const showBack = step !== 'select';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      aria-modal="true"
      role="dialog"
      aria-label="Customer Support"
    >
      <div className="w-full sm:w-[460px] sm:max-w-lg h-[92dvh] sm:h-[620px] bg-gray-50 sm:rounded-3xl rounded-t-3xl flex flex-col overflow-hidden shadow-2xl shadow-black/20 animate-support-slide-up">

        {/* Header */}
        <div className="flex-shrink-0 bg-blue-600 px-5 pt-5 pb-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {showBack && (
                <button
                  onClick={goBack}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  aria-label="Go back"
                >
                  <ChevronLeft size={16} className="text-white" />
                </button>
              )}
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Headphones size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-[15px] leading-tight">
                  {step === 'select' && 'Customer Support'}
                  {step === 'form'   && selectedCategory?.label}
                  {step === 'chat'   && (ticket?.subject || selectedCategory?.label || 'Ticket')}
                  {step === 'list'   && 'My Tickets'}
                </h2>
                {step === 'chat' && ticket && (
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={ticket.status} />
                    {/* ✅ WS connection indicator */}
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${wsConnected ? 'text-white/70' : 'text-white/40'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
                      {wsConnected ? 'Live' : 'Connecting…'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Close support"
            >
              <X size={15} className="text-white" />
            </button>
          </div>
          {step === 'select' && (
            <p className="text-white/70 text-xs mt-3">How can we help you today?</p>
          )}
        </div>

        {/* Curved cap */}
        <div className="flex-shrink-0 h-4 bg-blue-600 relative">
          <div className="absolute inset-0 bg-gray-50 rounded-t-3xl" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">

          {/* SELECT */}
          {step === 'select' && (
            <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-0.5">Choose a topic</p>
              <div className="space-y-2">
                {CATEGORIES.map((c) => (
                  <CategoryCard key={c.key} cat={c} onClick={(cat) => { setSelectedCategory(cat); setStep('form'); }} />
                ))}
              </div>
              <button
                onClick={() => setStep('list')}
                className="w-full flex items-center justify-center gap-1.5 mt-5 py-2 text-xs text-gray-400 hover:text-blue-600 transition-colors font-medium"
              >
                <List size={13} />
                View my tickets
              </button>
            </div>
          )}

          {/* FORM */}
          {step === 'form' && selectedCategory && (
            <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
              {orderLockedFromProp && (
                <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-2.5">
                  <Package size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-700 font-semibold">Order #{String(order.id).substring(0, 8).toUpperCase()} linked</p>
                    <p className="text-[11px] text-blue-400 mt-0.5">This order will be attached to your ticket.</p>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {showOrderPicker && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Related Order <span className="text-red-400">*</span>
                    </label>
                    <div className="mb-2 flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                      <AlertCircle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-700 leading-snug">
                        A <strong>{selectedCategory.label}</strong> ticket requires you to link an order so our team can assist you faster.
                      </p>
                    </div>
                    <OrderPicker selectedOrder={selectedOrder} onSelect={setSelectedOrder} />
                    {!selectedOrder && (
                      <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                        <ShoppingBag size={11} className="flex-shrink-0" />
                        Please select the order this ticket is about.
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label htmlFor="ticket-subject-input" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    ref={subjectRef}
                    id="ticket-subject-input"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
                    placeholder="Briefly describe your issue…"
                    maxLength={120}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5">{subject.length}/120 characters</p>
                </div>
                {showOrderPicker && orderMissing && subject.trim() && (
                  <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-red-50 border border-red-200">
                    <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
                    <p className="text-[11px] text-red-600">Please select an order to continue.</p>
                  </div>
                )}
                {error && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5">
                    <AlertCircle size={13} /> {error}
                  </p>
                )}
                <button
                  onClick={handleCreate}
                  disabled={!canCreate}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-600/25"
                >
                  {creating && <Loader2 size={14} className="animate-spin" />}
                  {creating ? 'Creating ticket…' : 'Start conversation'}
                </button>
              </div>
            </div>
          )}

          {/* CHAT */}
          {step === 'chat' && (
            <>
              <div className="flex-shrink-0 px-4 py-2 border-b border-gray-100 bg-white flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] text-gray-400 font-medium flex-shrink-0">#{ticket?.id}</span>
                  {ticket?.priority && <PriorityBadge priority={ticket.priority} />}
                </div>
                {isTicketOpen ? (
                  <button
                    onClick={handleClose_ticket}
                    disabled={ticketAction}
                    className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 font-medium"
                  >
                    {ticketAction ? <Loader2 size={11} className="animate-spin" /> : <XCircle size={13} />}
                    Close ticket
                  </button>
                ) : (
                  <button
                    onClick={handleReopen}
                    disabled={ticketAction}
                    className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0 font-medium"
                  >
                    {ticketAction ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
                    Re-open
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                {loadingMsgs ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 size={20} className="animate-spin text-blue-400" />
                  </div>
                ) : error ? (
                  <ErrorState message={error} onRetry={() => loadThread(ticket?.id)} />
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-300">
                    <Headphones size={26} />
                    <p className="text-xs text-gray-400 text-center">Ticket created. Send a message to get started.</p>
                  </div>
                ) : (
                  messages.map((msg) => <ChatBubble key={msg.id} msg={msg} />)
                )}
                <div ref={messagesEndRef} />
              </div>

              {!isTicketOpen && ticket ? (
                <div className="flex-shrink-0 px-4 py-4 border-t border-gray-100 bg-white flex flex-col items-center gap-2.5">
                  <p className="text-xs text-gray-400">This ticket is closed.</p>
                  <button
                    onClick={handleReopen}
                    disabled={ticketAction}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                  >
                    {ticketAction ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                    Re-open ticket
                  </button>
                </div>
              ) : (
                <div className="flex-shrink-0 px-3 pb-4 pt-2 border-t border-gray-100 bg-white">
                  {error && !loadingMsgs && (
                    <p className="text-[11px] text-red-500 mb-1.5 px-1 flex items-center gap-1">
                      <AlertCircle size={11} /> {error}
                    </p>
                  )}
                  <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message…"
                      rows={1}
                      className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none leading-5 max-h-28 overflow-y-auto py-1"
                      style={{ minHeight: '24px' }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || sending}
                      aria-label="Send message"
                      className="mb-0.5 w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-all active:scale-95 shadow-sm shadow-blue-600/20"
                    >
                      {sending
                        ? <Loader2 size={13} className="text-white animate-spin" />
                        : <Send size={13} className="text-white translate-x-0.5" />
                      }
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* LIST */}
          {step === 'list' && (
            <div className="flex-1 overflow-y-auto px-4 pb-6 pt-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-0.5">Your tickets</p>
                <button onClick={() => setStep('select')} className="text-xs text-blue-600 font-semibold hover:underline">
                  + New ticket
                </button>
              </div>
              {loadingTickets ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={20} className="animate-spin text-blue-400" />
                </div>
              ) : error ? (
                <ErrorState message={error} onRetry={loadTickets} />
              ) : tickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-300">
                  <List size={24} />
                  <p className="text-xs text-gray-400">No tickets yet.</p>
                  <button onClick={() => setStep('select')} className="mt-1 text-xs text-blue-600 font-medium hover:underline">
                    Create your first ticket
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {tickets.map((t) => <TicketRow key={t.id} ticket={t} onClick={openTicketFromList} />)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes support-slide-up {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-support-slide-up {
          animation: support-slide-up 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
      `}</style>
    </div>
  );
};

export default SupportTicketModal;