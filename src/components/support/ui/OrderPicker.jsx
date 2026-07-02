import { Search, ShoppingBag, Package, ChevronDown, CheckCircle2, Loader2 } from 'lucide-react';
import { useOrderPicker } from '../../../hooks/useOrderPicker';
import { fmtDate, fmtPrice } from '../../../utils/format';

export function OrderPicker({ selectedOrder, onSelect }) {
  const { loading, error, query, setQuery, open, setOpen, filtered, dropdownRef } = useOrderPicker();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm text-left transition-all ${selectedOrder ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-200 bg-white hover:border-blue-300'}`}
      >
        <ShoppingBag size={14} className={selectedOrder ? 'text-blue-500' : 'text-gray-400'} />
        <span className={`flex-1 truncate ${selectedOrder ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
          {selectedOrder ? `Order #${String(selectedOrder.id).substring(0, 8).toUpperCase()} · ${selectedOrder.status}` : 'Select an order…'}
        </span>
        {selectedOrder
          ? <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0" />
          : <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        }
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <Search size={13} className="text-gray-400 flex-shrink-0" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search orders…" autoFocus className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent" />
          </div>
          <div className="max-h-44 overflow-y-auto">
            {loading ? <div className="flex items-center justify-center py-8"><Loader2 size={18} className="animate-spin text-blue-400" /></div>
              : error ? <p className="text-xs text-red-400 text-center py-6">{error}</p>
              : filtered.length === 0 ? <p className="text-xs text-gray-400 text-center py-6">No orders found</p>
              : filtered.map((o) => (
                <button key={o.id} type="button" onClick={() => { onSelect(o); setOpen(false); setQuery(''); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-blue-50 ${selectedOrder?.id === o.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Package size={12} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">Order #{String(o.id).substring(0, 8).toUpperCase()}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {fmtDate(o.created_at)}{o.total != null && ` · ${fmtPrice(o.total)}`}{' · '}
                      <span className={o.status === 'Delivered' ? 'text-emerald-600 font-medium' : o.status === 'Cancelled' ? 'text-red-400 font-medium' : 'text-gray-500'}>{o.status}</span>
                    </p>
                  </div>
                  {selectedOrder?.id === o.id && <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0" />}
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
