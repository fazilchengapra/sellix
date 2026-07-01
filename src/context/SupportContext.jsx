import { createContext, useContext, useState } from 'react';

const SupportContext = createContext(undefined);

export const SupportProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [linkedOrder, setLinkedOrder] = useState(null);

  const openSupport = (order = null) => {
    setLinkedOrder(order);
    setIsOpen(true);
  };

  const closeSupport = () => {
    setIsOpen(false);
    // Small delay so the modal can animate out before clearing the order
    setTimeout(() => setLinkedOrder(null), 300);
  };

  return (
    <SupportContext.Provider value={{ isOpen, linkedOrder, openSupport, closeSupport }}>
      {children}
    </SupportContext.Provider>
  );
};

export const useSupportModal = () => {
  const ctx = useContext(SupportContext);
  if (!ctx) throw new Error('useSupportModal must be used within a SupportProvider');
  return ctx;
};
