import { useToast } from '../context/ToastContext';
import { Toast } from './ui/Toast';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    
      {toasts.map((toast) => (
        
          
        
      ))}
    
  );
};
