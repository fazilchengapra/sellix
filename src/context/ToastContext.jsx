import { createContext, useContext, useState, useCallback } from 'react';




const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
    const removeToast = useCallback((id) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

  const showToast = useCallback((
    message) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  return (
    
      {children}
    
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};