import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';

export function useOrderPicker() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [query, setQuery]     = useState('');
  const [open, setOpen]       = useState(false);
  const dropdownRef           = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const res = await api.get('/orders/');
        const data = res.data?.results || res.data || [];
        setOrders(Array.isArray(data) ? data : []);
      } catch { setError('Could not load orders.'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = orders.filter((o) => {
    const q = query.toLowerCase();
    return !q || String(o.id).toLowerCase().includes(q) || o.status?.toLowerCase().includes(q);
  });

  return { orders, loading, error, query, setQuery, open, setOpen, filtered, dropdownRef };
}
