import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';


export const Toast = ({ id, message, type, duration = 3000, onRemove }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onRemove(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onRemove]);

  const icons = {
    success: ,
    error: ,
    info: ,
    warning: 
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800'
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-amber-600'
  };

  return (
    
      
        {icons[type]}
      
      {message}
       onRemove(id)}
        className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        
      
    
  );
};
