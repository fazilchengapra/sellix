import { Headphones } from 'lucide-react';
import { fmtTime } from '../../../utils/format';

export function ChatBubble({ msg }) {
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
        {msg.created_at && <span className="text-[10px] text-gray-400 px-1">{fmtTime(msg.created_at)}</span>}
      </div>
    </div>
  );
}
