import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import { CATEGORIES, ORDER_REQUIRED_KEYS } from '../constants/support.constants';

const getCat = (key) => CATEGORIES.find((c) => c.key === key);

export function useTicketModal({ isOpen, onClose, order }) {
  const [step, setStep]                       = useState('select');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subject, setSubject]                 = useState('');
  const [selectedOrder, setSelectedOrder]     = useState(order ?? null);
  const [ticket, setTicket]                   = useState(null);
  const [messages, setMessages]               = useState([]);
  const [tickets, setTickets]                 = useState([]);
  const [inputValue, setInputValue]           = useState('');
  const [creating, setCreating]               = useState(false);
  const [sending, setSending]                 = useState(false);
  const [loadingMsgs, setLoadingMsgs]         = useState(false);
  const [loadingTickets, setLoadingTickets]   = useState(false);
  const [ticketAction, setTicketAction]       = useState(false);
  const [error, setError]                     = useState(null);
  const [wsConnected, setWsConnected]         = useState(false);
  const [stagingAttachments, setStagingAttachments] = useState([]); // File objects awaiting send
  const [uploadError, setUploadError]         = useState(null);

  const messagesEndRef  = useRef(null);
  const inputRef        = useRef(null);
  const subjectRef      = useRef(null);
  const wsRef           = useRef(null);
  const fileInputRef    = useRef(null);

  useEffect(() => { setSelectedOrder(order ?? null); }, [order]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
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
  useEffect(() => { if (step === 'chat' && ticket?.id) loadThread(ticket.id); }, [step, ticket?.id]);
  useEffect(() => { if (step === 'list') loadTickets(); }, [step]);
  useEffect(() => () => { wsRef.current?.close(); wsRef.current = null; }, []);

  const closeWs = () => { wsRef.current?.close(); wsRef.current = null; setWsConnected(false); };

  const reset = () => {
    closeWs();
    setStep('select'); setSelectedCategory(null); setSubject('');
    setSelectedOrder(order ?? null); setTicket(null);
    setMessages([]); setTickets([]); setInputValue('');
    setError(null); setStagingAttachments([]); setUploadError(null);
  };

  const handleClose = () => { onClose(); setTimeout(reset, 300); };

  const goBack = () => {
    setError(null);
    if (step === 'form')      { setStep('select'); setSelectedCategory(null); setSubject(''); if (!order?.id) setSelectedOrder(null); }
    else if (step === 'chat') { closeWs(); setStep('list'); }
    else if (step === 'list') { setStep('select'); }
  };

  const loadTickets = async () => {
    setLoadingTickets(true); setError(null);
    try   { const res = await api.get('/tickets/'); setTickets(res.data.data ?? []); }
    catch { setError('Failed to load tickets.'); }
    finally { setLoadingTickets(false); }
  };

  const loadThread = async (id) => {
    setLoadingMsgs(true); setError(null);
    try {
      const res = await api.get(`/tickets/${id}/`);
      const data = res.data.data;
      setTicket((prev) => ({ ...prev, ...data }));
      setMessages(data.messages ?? []);
      closeWs();

      const ws = new WebSocket(`ws://localhost:8000/ws/tickets/${id}/`);
      ws.onopen    = () => { setWsConnected(true); setError(null); };
      ws.onerror   = () => { setError('Connection error. Messages may be delayed.'); setWsConnected(false); };
      ws.onclose   = () => setWsConnected(false);
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type !== 'ticket.message') return;
          const normalized = {
            id: msg.message_id,
            message: msg.message,
            is_staff_reply: msg.is_staff_reply,
            created_at: msg.created_at,
            // include attachments from the WS frame if the server sends them
            attachments: Array.isArray(msg.attachments) ? msg.attachments : undefined,
          };
          setMessages((prev) => {
            if (prev.some((m) => m.id === normalized.id)) return prev;
            const tempIdx = prev.findLastIndex?.((m) => String(m.id).startsWith('temp-'));
            if (tempIdx !== -1) {
              const next = [...prev];
              // If WS frame has no attachments, keep the ones from the optimistic temp message
              next[tempIdx] = {
                ...normalized,
                attachments: normalized.attachments ?? prev[tempIdx].attachments,
              };
              return next;
            }
            return [...prev, normalized];
          });
        } catch { /* ignore malformed frames */ }
      };
      wsRef.current = ws;
    } catch { setError('Failed to load messages.'); }
    finally { setLoadingMsgs(false); }
  };

  const handleCreate = async () => {
    if (!subject.trim() || creating) return;
    setCreating(true); setError(null);
    try {
      const body = { category: selectedCategory.key, subject: subject.trim() };
      if (selectedOrder?.id) body.order = selectedOrder.id;
      const res = await api.post('/tickets/', body);
      setTicket(res.data.data); setStep('chat');
    } catch { setError('Could not create ticket. Please try again.'); }
    finally { setCreating(false); }
  };

  /**
   * Upload staged files to /tickets/{id}/attachment/ and return an array of
   * { file_url, cloudinary_public_id } objects from the API response.
   */
  const uploadAttachments = async (ticketId) => {
    if (!stagingAttachments.length) return [];
    setUploadError(null);
    const form = new FormData();
    stagingAttachments.forEach((file) => form.append('attachments', file));
    try {
      const res = await api.post(`/tickets/${ticketId}/attachment/`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data ?? [];
    } catch {
      setUploadError('Failed to upload attachment(s). Please try again.');
      return null; // null signals failure
    }
  };

  const removeStagingAttachment = (index) =>
    setStagingAttachments((prev) => prev.filter((_, i) => i !== index));

  const handleFilePick = (e) => {
    const picked = Array.from(e.target.files ?? []);
    setStagingAttachments((prev) => [...prev, ...picked]);
    // Reset the input so the same file can be re-added after removal
    e.target.value = '';
  };

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    const hasFiles = stagingAttachments.length > 0;
    if ((!trimmed && !hasFiles) || sending || !ticket?.id) return;

    setSending(true);
    setUploadError(null);

    // 1. Upload any staged attachments first
    let uploadedAttachments = [];
    if (hasFiles) {
      const result = await uploadAttachments(ticket.id);
      if (result === null) { setSending(false); return; } // upload failed
      uploadedAttachments = result;
    }

    // Clear staged files now that they're uploaded
    setStagingAttachments([]);

    // 2. Build an optimistic temp message (with attachment previews)
    const attachmentUrls = uploadedAttachments.map((a) => a.file_url);
    const tempMsg = {
      id: `temp-${Date.now()}`,
      message: trimmed || '',
      is_staff_reply: false,
      created_at: new Date().toISOString(),
      attachments: uploadedAttachments,
    };
    setMessages((prev) => [...prev, tempMsg]);
    setInputValue('');

    // 3. Send the message text (with attachment references) over WS or REST
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message: trimmed, attachments: uploadedAttachments }));
      setSending(false);
      return;
    }

    try {
      await api.post(`/tickets/${ticket.id}/replay/`, { message: trimmed, attachments: attachmentUrls });
      await loadThread(ticket.id);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      setInputValue(trimmed);
      setError('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleTicketAction = async (action) => {
    if (!ticket?.id || ticketAction) return;
    setTicketAction(true);
    try {
      const res = await api.patch(`/tickets/${ticket.id}/${action}/`);
      setTicket((prev) => ({ ...prev, status: res.data.data.status }));
    } catch { setError(`Failed to ${action === 'close' ? 'close' : 'reopen'} ticket.`); }
    finally { setTicketAction(false); }
  };

  const openTicketFromList = (t) => { setTicket(t); setSelectedCategory(getCat(t.category) ?? null); setStep('chat'); };
  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const selectCategory = (cat) => { setSelectedCategory(cat); setStep('form'); };

  const needsOrder     = selectedCategory && ORDER_REQUIRED_KEYS.has(selectedCategory.key);
  const orderLocked    = Boolean(order?.id);
  const showOrderPicker = needsOrder && !orderLocked;
  const orderMissing   = needsOrder && !selectedOrder?.id;
  const canCreate      = subject.trim() && !orderMissing && !creating;
  const isTicketOpen   = ticket?.status === 'open' || ticket?.status === 'in_progress';

  const goToList = () => { setError(null); setStep('list'); };

  return {
    // state
    step, selectedCategory, subject, setSubject, selectedOrder, setSelectedOrder,
    ticket, messages, tickets, inputValue, setInputValue,
    creating, sending, loadingMsgs, loadingTickets, ticketAction,
    error, wsConnected,
    stagingAttachments, uploadError,
    // refs
    messagesEndRef, inputRef, subjectRef, fileInputRef,
    // computed
    needsOrder, orderLocked, showOrderPicker, orderMissing, canCreate, isTicketOpen,
    // actions
    handleClose, goBack, goToList, loadTickets, loadThread,
    handleCreate, handleSend, handleKeyDown,
    handleFilePick, removeStagingAttachment,
    handleCloseTicket: () => handleTicketAction('close'),
    handleReopen:      () => handleTicketAction('re-open'),
    openTicketFromList, selectCategory,
  };
}
