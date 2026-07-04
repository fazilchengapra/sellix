import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { CATEGORY_META } from '../constants/adminTickets.constants';
import { CgAttachment } from 'react-icons/cg';

export function useAdminTickets() {
  const [tickets, setTickets]           = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages]             = useState([]);
  const [loadingThread, setLoadingThread]   = useState(false);
  const [replyText, setReplyText]           = useState('');
  const [sending, setSending]               = useState(false);
  const [resolving, setResolving]           = useState(false);
  const [wsConnected, setWsConnected]       = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const wsRef          = useRef(null);
  const { showToast }  = useToast();

  // Scroll to bottom on new messages
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Focus input on ticket change
  useEffect(() => { if (selectedTicket) setTimeout(() => inputRef.current?.focus(), 200); }, [selectedTicket?.id]);

  // WS cleanup on unmount
  useEffect(() => () => { wsRef.current?.close(); wsRef.current = null; }, []);

  // Filter logic
  useEffect(() => {
    let result = [...tickets];
    if (statusFilter !== 'all') result = result.filter((t) => t.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.subject?.toLowerCase().includes(q) || String(t.id).includes(q) || String(t.user).includes(q));
    }
    setFiltered(result);
  }, [tickets, search, statusFilter]);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try   { const res = await api.get('/admin/tickets/'); setTickets(res.data.data ?? []); }
    catch { showToast('Failed to load tickets', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const openWebSocket = (id) => {
    wsRef.current?.close();
    wsRef.current = null;
    setWsConnected(false);

    const ws = new WebSocket(`${import.meta.env.VITE_WS_BASE_URL}/ws/tickets/${id}/`);
    ws.onopen  = () => setWsConnected(true);
    ws.onerror = () => setWsConnected(false);
    ws.onclose = () => setWsConnected(false);
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type !== 'ticket.message') return;
        console.log('Received WS message:', msg);
        const normalized = { id: msg.message_id, message: msg.message, is_staff_reply: msg.is_staff_reply, created_at: msg.created_at, attachments: msg.attachments ?? [] };
        setMessages((prev) => {
          if (prev.some((m) => m.id === normalized.id)) return prev;
          const tempIdx = prev.findLastIndex?.((m) => String(m.id).startsWith('temp-'));
          if (tempIdx !== -1) { const next = [...prev]; next[tempIdx] = normalized; return next; }
          return [...prev, normalized];
        });
      } catch { /* ignore malformed frames */ }
    };
    wsRef.current = ws;
  };

  const fetchThread = async (id) => {
    setLoadingThread(true);
    try {
      const res = await api.get(`/admin/tickets/${id}/`);
      const data = res.data.data;
      setSelectedTicket((prev) => ({ ...prev, ...data }));
      setMessages(data.messages ?? []);
      openWebSocket(id);
    } catch { showToast('Failed to load ticket thread', 'error'); }
    finally { setLoadingThread(false); }
  };

  const handleSelectTicket = (ticket) => { setSelectedTicket(ticket); setMessages([]); setReplyText(''); fetchThread(ticket.id); };

  const handleSendReply = async () => {
    const trimmed = replyText.trim();
    if (!trimmed || sending || !selectedTicket?.id) return;
    const tempMsg = { id: `temp-${Date.now()}`, message: trimmed, is_staff_reply: true, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, tempMsg]);
    setReplyText('');
    if (wsRef.current?.readyState === WebSocket.OPEN) { wsRef.current.send(JSON.stringify({ message: trimmed })); return; }
    setSending(true);
    try {
      await api.post(`/admin/tickets/${selectedTicket.id}/reply/`, { message: trimmed });
      const res = await api.get(`/admin/tickets/${selectedTicket.id}/`);
      const data = res.data.data;
      setSelectedTicket((prev) => ({ ...prev, ...data }));
      setMessages(data.messages ?? []);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      setReplyText(trimmed);
      showToast('Failed to send reply', 'error');
    } finally { setSending(false); }
  };

  const handleResolve = async () => {
    if (!selectedTicket?.id || resolving) return;
    setResolving(true);
    try {
      const res = await api.patch(`/admin/tickets/${selectedTicket.id}/resolve/`);
      const updated = res.data.data;
      setSelectedTicket((prev) => ({ ...prev, status: updated.status }));
      setTickets((prev) => prev.map((t) => t.id === updated.id ? { ...t, status: updated.status } : t));
      showToast('Ticket resolved', 'success');
    } catch { showToast('Failed to resolve ticket', 'error'); }
    finally { setResolving(false); }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(); } };

  const stats = {
    all:         tickets.length,
    open:        tickets.filter((t) => t.status === 'open').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved:    tickets.filter((t) => t.status === 'resolved').length,
    closed:      tickets.filter((t) => t.status === 'closed').length,
  };

  const catMeta = selectedTicket ? (CATEGORY_META[selectedTicket.category] ?? CATEGORY_META.general) : null;

  return {
    // list state
    filtered, loading, search, setSearch, statusFilter, setStatusFilter, stats, fetchTickets,
    // thread state
    selectedTicket, messages, loadingThread, replyText, setReplyText, sending, resolving, wsConnected,
    // refs
    messagesEndRef, inputRef,
    // computed
    catMeta,
    // actions
    handleSelectTicket, handleSendReply, handleResolve, handleKeyDown,
  };
}
