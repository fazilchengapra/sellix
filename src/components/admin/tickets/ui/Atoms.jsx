import { useState } from 'react';
import { Headphones, FileText, ExternalLink } from 'lucide-react';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { STATUS_STYLES, DOT_STYLES, PRIORITY_STYLES, CATEGORY_META } from '../../../../constants/adminTickets.constants';
import { ImageLightbox } from '../../../ui/ImageLightbox';

/* ── Date / time helpers ── */
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '';
export const fmtTime = (d) => d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

/* ── StatusBadge ── */
export function StatusBadge({ status }) {
  const label = status === 'in_progress' ? 'In Progress' : (status?.charAt(0).toUpperCase() + status?.slice(1));
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${STATUS_STYLES[status] ?? STATUS_STYLES.open}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${DOT_STYLES[status] ?? DOT_STYLES.open}`} />
      {label}
    </span>
  );
}

/* ── AttachmentPreview ── */
function AttachmentPreview({ url, isStaff, onOpenLightbox }) {
  const isImage = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url);
  if (isImage) {
    return (
      <button onClick={() => onOpenLightbox(url)} className="block mt-1.5 focus:outline-none">
        <img
          src={url}
          alt="Attachment"
          className="max-w-[200px] max-h-48 rounded-xl object-cover border border-white/20 hover:opacity-90 hover:scale-[1.02] transition-all cursor-zoom-in"
        />
      </button>
    );
  }
  const filename = url.split('/').pop().split('?')[0] || 'Attachment';
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`mt-1.5 flex items-center gap-1.5 text-[11px] underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity ${isStaff ? 'text-white' : 'text-gray-600'}`}
    >
      <FileText size={12} />
      <span className="truncate max-w-[160px]">{filename}</span>
      <ExternalLink size={10} />
    </a>
  );
}

/* ── ChatBubble ── */
export function ChatBubble({ msg }) {
  const isStaff = msg.is_staff_reply;
  const attachments = Array.isArray(msg.attachments) ? msg.attachments : [];

  const imageUrls = attachments
    .map((a) => (typeof a === 'string' ? a : (a.url ?? a.file_url ?? '')))
    .filter((u) => /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(u));

  const [lightboxSrc, setLightboxSrc] = useState(null);
  const lightboxIdx = imageUrls.indexOf(lightboxSrc);

  const openLightbox  = (url) => setLightboxSrc(url);
  const closeLightbox = ()    => setLightboxSrc(null);
  const prevImage     = ()    => setLightboxSrc(imageUrls[(lightboxIdx - 1 + imageUrls.length) % imageUrls.length]);
  const nextImage     = ()    => setLightboxSrc(imageUrls[(lightboxIdx + 1) % imageUrls.length]);

  return (
    <>
      <ImageLightbox
        src={lightboxSrc}
        gallery={imageUrls}
        index={lightboxIdx}
        onClose={closeLightbox}
        onPrev={imageUrls.length > 1 ? prevImage : undefined}
        onNext={imageUrls.length > 1 ? nextImage : undefined}
      />

      <div className={`flex ${isStaff ? 'justify-end' : 'justify-start'} mb-3`}>
        {!isStaff && (
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
            <span className="text-[11px] font-bold text-gray-500">U</span>
          </div>
        )}
        <div className={`max-w-[72%] flex flex-col gap-1 ${isStaff ? 'items-end' : 'items-start'}`}>
          {/* Text bubble */}
          {msg.message && (
            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isStaff ? 'bg-blue-600 text-white rounded-br-sm shadow-sm shadow-blue-100' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'}`}>
              {msg.message}
            </div>
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className={`flex flex-col gap-1 ${isStaff ? 'items-end' : 'items-start'}`}>
              {attachments.map((attachment, i) => {
                const url = typeof attachment === 'string' ? attachment : (attachment.url ?? attachment.file_url ?? '');
                return (
                  <div
                    key={i}
                    className={`px-3 py-2 rounded-2xl ${isStaff ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-100 rounded-bl-sm shadow-sm'}`}
                  >
                    <AttachmentPreview url={url} isStaff={isStaff} onOpenLightbox={openLightbox} />
                  </div>
                );
              })}
            </div>
          )}

          {msg.created_at && <span className="text-[10px] text-gray-400 px-1">{fmtTime(msg.created_at)}</span>}
          {isStaff && <span className="text-[10px] text-blue-400 px-1 font-medium">Staff</span>}
        </div>
        {isStaff && (
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center ml-2 flex-shrink-0 mt-1">
            <Headphones size={13} className="text-blue-600" />
          </div>
        )}
      </div>
    </>
  );
}


/* ── TicketRow ── */
export function TicketRow({ ticket, selected, onClick }) {
  const meta = CATEGORY_META[ticket.category];
  const Icon = meta?.icon ?? MessageCircle;
  return (
    <button
      onClick={() => onClick(ticket)}
      className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all duration-150 border-l-2 ${selected ? 'bg-blue-50 border-l-blue-600' : 'bg-white border-l-transparent hover:bg-gray-50/80'}`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${selected ? 'bg-blue-100' : 'bg-gray-100'}`}>
        <Icon size={14} className={selected ? 'text-blue-600' : (meta?.color ?? 'text-gray-400')} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1.5 mb-1">
          <p className={`font-medium text-sm truncate leading-snug ${selected ? 'text-blue-900' : 'text-gray-800'}`}>{ticket.subject}</p>
          <ChevronRight size={13} className={`flex-shrink-0 ${selected ? 'text-blue-400' : 'text-gray-300'}`} />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <StatusBadge status={ticket.status} />
          <span className={`text-[11px] font-medium capitalize ${PRIORITY_STYLES[ticket.priority] ?? 'text-gray-400'}`}>{ticket.priority}</span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-400">User #{ticket.user}</span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-400">{fmtDate(ticket.created_at)}</span>
        </div>
      </div>
    </button>
  );
}
