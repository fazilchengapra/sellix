export function StatusBadge({ status }) {
  const cls    = { open: 'bg-emerald-50 text-emerald-700 border-emerald-200', closed: 'bg-gray-100 text-gray-500 border-gray-200', in_progress: 'bg-blue-50 text-blue-700 border-blue-200' };
  const dotCls = { open: 'bg-emerald-500 animate-pulse', closed: 'bg-gray-400', in_progress: 'bg-blue-500' };
  const label  = status === 'in_progress' ? 'In Progress' : (status?.charAt(0).toUpperCase() + status?.slice(1));
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${cls[status] ?? cls.open}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotCls[status] ?? dotCls.open}`} />
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const cls = { low: 'text-gray-400', medium: 'text-yellow-600', high: 'text-red-500' };
  return (
    <span className={`text-[11px] font-medium ${cls[priority] ?? 'text-gray-400'}`}>
      {priority?.charAt(0).toUpperCase() + priority?.slice(1)} priority
    </span>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
      <span className="text-2xl text-gray-300">⚠</span>
      <p className="text-xs text-gray-400 text-center max-w-[200px]">{message}</p>
      {onRetry && <button onClick={onRetry} className="text-xs text-blue-600 font-medium hover:underline">Try again</button>}
    </div>
  );
}

export function Spinner({ size = 20 }) {
  return (
    <div className="flex items-center justify-center h-full py-10">
      <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin text-blue-400" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    </div>
  );
}
