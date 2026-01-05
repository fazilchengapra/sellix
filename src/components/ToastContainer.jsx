import { useToast } from '../context/ToastContext';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const styles = {
    success: 'border-green-100 bg-white',
    error: 'border-red-100 bg-white',
    warning: 'border-yellow-100 bg-white',
    info: 'border-blue-100 bg-white',
  };

  return (
    <div className="fixed top-4 right-4 z-100 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 min-w-75 max-w-sm p-4 rounded-xl border shadow-lg shadow-gray-200/50 animate-in slide-in-from-right-full duration-300 ${styles[toast.type] || styles.info}`}
        >
          <div className="shrink-0 mt-0.5">
            {icons[toast.type] || icons.info}
          </div>
          <div className="flex-1 text-sm font-medium text-gray-700">
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
