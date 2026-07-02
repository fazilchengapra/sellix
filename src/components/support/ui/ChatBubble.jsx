import { Headphones, FileText, ExternalLink } from 'lucide-react';
import { fmtTime } from '../../../utils/format';

function AttachmentPreview({ url }) {
  const isImage = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url);
  if (isImage) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-1.5">
        <img
          src={url}
          alt="Attachment"
          className="max-w-[200px] max-h-48 rounded-xl object-cover border border-white/20 hover:opacity-90 transition-opacity cursor-pointer"
        />
      </a>
    );
  }
  // Non-image: show a link chip
  const filename = url.split('/').pop().split('?')[0] || 'Attachment';
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1.5 flex items-center gap-1.5 text-[11px] underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity"
    >
      <FileText size={12} />
      <span className="truncate max-w-[160px]">{filename}</span>
      <ExternalLink size={10} />
    </a>
  );
}

export function ChatBubble({ msg }) {
  const isUser = !msg.is_staff_reply;
  const attachments = Array.isArray(msg.attachments) ? msg.attachments : [];

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mr-2 flex-shrink-0 mt-1 shadow-sm">
          <Headphones size={11} className="text-white" />
        </div>
      )}
      <div className={`max-w-[78%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Text bubble — skip if empty and there are attachments */}
        {(msg.message || msg.body) && (
          <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isUser ? 'bg-blue-600 text-white rounded-br-sm shadow-sm shadow-blue-200' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'}`}>
            {msg.message ?? msg.body}
          </div>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
            {attachments.map((attachment, i) => {
              const url = typeof attachment === 'string' ? attachment : (attachment.url ?? attachment.file_url ?? '');
              return (
                <div
                  key={i}
                  className={`px-2 py-1 rounded-2xl ${isUser ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-100 rounded-bl-sm shadow-sm'}`}
                >
                  <AttachmentPreview url={url} />
                </div>
              );
            })}
          </div>
        )}

        {msg.created_at && (
          <span className="text-[10px] text-gray-400 px-1">{fmtTime(msg.created_at)}</span>
        )}
      </div>
    </div>
  );
}
