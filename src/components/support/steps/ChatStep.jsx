import { Headphones, Loader2, XCircle, RefreshCw, Send, AlertCircle } from 'lucide-react';
import { ChatBubble } from '../ui/ChatBubble';
import { ErrorState } from '../ui/Atoms';

export function ChatStep({ ticket, messages, messagesEndRef, inputRef, inputValue, setInputValue, loadingMsgs, error, sending, ticketAction, isTicketOpen, loadThread, onSend, onKeyDown, onClose, onReopen }) {
  return (
    <>
      {/* Ticket meta bar */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-gray-100 bg-white flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] text-gray-400 font-medium flex-shrink-0">#{ticket?.id}</span>
          {ticket?.priority && <span className={`text-[11px] font-medium ${({ low: 'text-gray-400', medium: 'text-yellow-600', high: 'text-red-500' })[ticket.priority] ?? 'text-gray-400'}`}>{ticket.priority?.charAt(0).toUpperCase() + ticket.priority?.slice(1)} priority</span>}
        </div>
        {isTicketOpen ? (
          <button onClick={onClose} disabled={ticketAction} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 font-medium">
            {ticketAction ? <Loader2 size={11} className="animate-spin" /> : <XCircle size={13} />} Close ticket
          </button>
        ) : (
          <button onClick={onReopen} disabled={ticketAction} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0 font-medium">
            {ticketAction ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />} Re-open
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loadingMsgs ? <div className="flex items-center justify-center h-full"><Loader2 size={20} className="animate-spin text-blue-400" /></div>
          : error ? <ErrorState message={error} onRetry={() => loadThread(ticket?.id)} />
          : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-300">
              <Headphones size={26} />
              <p className="text-xs text-gray-400 text-center">Ticket created. Send a message to get started.</p>
            </div>
          ) : messages.map((msg) => <ChatBubble key={msg.id} msg={msg} />)
        }
        <div ref={messagesEndRef} />
      </div>

      {/* Input / Closed footer */}
      {!isTicketOpen && ticket ? (
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-100 bg-white flex flex-col items-center gap-2.5">
          <p className="text-xs text-gray-400">This ticket is closed.</p>
          <button onClick={onReopen} disabled={ticketAction} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
            {ticketAction ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Re-open ticket
          </button>
        </div>
      ) : (
        <div className="flex-shrink-0 px-3 pb-4 pt-2 border-t border-gray-100 bg-white">
          {error && !loadingMsgs && <p className="text-[11px] text-red-500 mb-1.5 px-1 flex items-center gap-1"><AlertCircle size={11} /> {error}</p>}
          <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <textarea ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={onKeyDown} placeholder="Type your message…" rows={1}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none leading-5 max-h-28 overflow-y-auto py-1" style={{ minHeight: '24px' }}
            />
            <button onClick={onSend} disabled={!inputValue.trim() || sending} aria-label="Send message"
              className="mb-0.5 w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-all active:scale-95 shadow-sm shadow-blue-600/20"
            >
              {sending ? <Loader2 size={13} className="text-white animate-spin" /> : <Send size={13} className="text-white translate-x-0.5" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
