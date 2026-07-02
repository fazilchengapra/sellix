import { X, Headphones, ChevronLeft } from 'lucide-react';
import { useTicketModal } from '../../hooks/useTicketModal';
import { StatusBadge } from './ui/Atoms';
import { SelectStep } from './steps/SelectStep';
import { FormStep }   from './steps/FormStep';
import { ChatStep }   from './steps/ChatStep';
import { ListStep }   from './steps/ListStep';

const SLIDE_UP = `
  @keyframes support-slide-up {
    from { opacity: 0; transform: translateY(32px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .animate-support-slide-up { animation: support-slide-up 0.28s cubic-bezier(0.34,1.56,0.64,1) both; }
`;

const TITLE = { select: 'Customer Support', list: 'My Tickets' };

const SupportTicketModal = ({ isOpen, onClose, order }) => {
  const m = useTicketModal({ isOpen, onClose, order });
  if (!isOpen) return null;

  const title = TITLE[m.step] ?? (m.step === 'chat' ? (m.ticket?.subject || m.selectedCategory?.label || 'Ticket') : m.selectedCategory?.label);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) m.handleClose(); }}
      aria-modal="true" role="dialog" aria-label="Customer Support"
    >
      <div className="w-full sm:w-[460px] sm:max-w-lg h-[92dvh] sm:h-[620px] bg-gray-50 sm:rounded-3xl rounded-t-3xl flex flex-col overflow-hidden shadow-2xl shadow-black/20 animate-support-slide-up">

        {/* Header */}
        <div className="flex-shrink-0 bg-blue-600 px-5 pt-5 pb-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {m.step !== 'select' && (
                <button onClick={m.goBack} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors" aria-label="Go back">
                  <ChevronLeft size={16} className="text-white" />
                </button>
              )}
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Headphones size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-[15px] leading-tight">{title}</h2>
                {m.step === 'chat' && m.ticket && (
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={m.ticket.status} />
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${m.wsConnected ? 'text-white/70' : 'text-white/40'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${m.wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
                      {m.wsConnected ? 'Live' : 'Connecting…'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button onClick={m.handleClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors" aria-label="Close support">
              <X size={15} className="text-white" />
            </button>
          </div>
          {m.step === 'select' && <p className="text-white/70 text-xs mt-3">How can we help you today?</p>}
        </div>

        {/* Curved cap */}
        <div className="flex-shrink-0 h-4 bg-blue-600 relative">
          <div className="absolute inset-0 bg-gray-50 rounded-t-3xl" />
        </div>

        {/* Step body */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {m.step === 'select' && (
            <SelectStep onSelect={m.selectCategory} onViewTickets={m.goToList} />
          )}

          {m.step === 'form' && m.selectedCategory && (
            <FormStep
              category={m.selectedCategory} order={order} subject={m.subject} setSubject={m.setSubject}
              subjectRef={m.subjectRef} selectedOrder={m.selectedOrder} setSelectedOrder={m.setSelectedOrder}
              showOrderPicker={m.showOrderPicker} orderLocked={m.orderLocked} orderMissing={m.orderMissing}
              canCreate={m.canCreate} creating={m.creating} error={m.error} onCreate={m.handleCreate}
            />
          )}

          {m.step === 'chat' && (
            <ChatStep
              ticket={m.ticket} messages={m.messages} messagesEndRef={m.messagesEndRef} inputRef={m.inputRef}
              inputValue={m.inputValue} setInputValue={m.setInputValue} loadingMsgs={m.loadingMsgs}
              error={m.error} sending={m.sending} ticketAction={m.ticketAction} isTicketOpen={m.isTicketOpen}
              loadThread={m.loadThread} onSend={m.handleSend} onKeyDown={m.handleKeyDown}
              onClose={m.handleCloseTicket} onReopen={m.handleReopen}
              stagingAttachments={m.stagingAttachments} uploadError={m.uploadError}
              fileInputRef={m.fileInputRef} onFilePick={m.handleFilePick}
              onRemoveAttachment={m.removeStagingAttachment}
            />
          )}

          {m.step === 'list' && (
            <ListStep
              tickets={m.tickets} loadingTickets={m.loadingTickets} error={m.error}
              loadTickets={m.loadTickets} onOpenTicket={m.openTicketFromList} onNewTicket={m.goBack}
            />
          )}
        </div>

      </div>
      <style>{SLIDE_UP}</style>
    </div>
  );
};

export default SupportTicketModal;