import { Headphones, Loader2, CheckCircle2, Send, AlertCircle, MessageCircle } from 'lucide-react';
import { StatusBadge, ChatBubble, fmtDate } from './ui/Atoms';
import { PRIORITY_STYLES } from '../../../constants/adminTickets.constants';

export function ThreadView({ ticket, messages, loadingThread, replyText, setReplyText, sending, resolving, wsConnected, inputRef, messagesEndRef, catMeta, onSend, onKeyDown, onResolve }) {
  const isClosed = ticket.status === 'resolved' || ticket.status === 'closed';
  const CatIcon  = catMeta?.icon ?? MessageCircle;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Thread header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            <CatIcon size={16} className={catMeta?.color ?? 'text-gray-400'} />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-gray-900 text-sm leading-snug truncate">{ticket.subject}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <StatusBadge status={ticket.status} />
              <span className={`text-[11px] font-medium ${PRIORITY_STYLES[ticket.priority] ?? ''}`}>{ticket.priority} priority</span>
              <span className="text-[11px] text-gray-400">User #{ticket.user}</span>
              <span className="text-[11px] text-gray-400">#{ticket.id}</span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${wsConnected ? 'text-emerald-500' : 'text-gray-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-gray-300'}`} />
                {wsConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        {!isClosed && (
          <button onClick={onResolve} disabled={resolving} id="admin-resolve-ticket-btn"
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
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[11px] text-gray-400 flex-shrink-0">Ticket opened · {fmtDate(ticket.created_at)}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {messages.map((msg) => <ChatBubble key={msg.id} msg={msg} />)}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply bar */}
      {isClosed ? (
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-center">
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <AlertCircle size={13} /> This ticket is {ticket.status}. No further replies allowed.
          </p>
        </div>
      ) : (
        <div className="px-4 py-3 border-t border-gray-100 bg-white">
          <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mb-0.5">
              <Headphones size={11} className="text-white" />
            </div>
            <textarea
              ref={inputRef} id="admin-reply-input" value={replyText}
              onChange={(e) => setReplyText(e.target.value)} onKeyDown={onKeyDown}
              placeholder="Type a reply as staff…" rows={1}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none leading-5 max-h-32 overflow-y-auto py-1"
              style={{ minHeight: '24px' }}
            />
            <button onClick={onSend} disabled={!replyText.trim() || sending} id="admin-send-reply-btn" aria-label="Send reply"
              className="mb-0.5 w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-all active:scale-95 shadow-sm shadow-blue-600/25"
            >
              {sending ? <Loader2 size={14} className="text-white animate-spin" /> : <Send size={14} className="text-white translate-x-0.5" />}
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5 px-1">Replying as <span className="font-semibold text-blue-600">Staff</span></p>
        </div>
      )}
    </div>
  );
}
