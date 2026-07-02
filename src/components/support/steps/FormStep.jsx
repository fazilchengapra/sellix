import { Package, AlertCircle, ShoppingBag, Loader2 } from 'lucide-react';
import { OrderPicker } from '../ui/OrderPicker';

export function FormStep({ category, order, subject, setSubject, subjectRef, selectedOrder, setSelectedOrder, showOrderPicker, orderLocked, orderMissing, canCreate, creating, error, onCreate }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
      {orderLocked && (
        <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-2.5">
          <Package size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-blue-700 font-semibold">Order #{String(order.id).substring(0, 8).toUpperCase()} linked</p>
            <p className="text-[11px] text-blue-400 mt-0.5">This order will be attached to your ticket.</p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {showOrderPicker && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Related Order <span className="text-red-400">*</span>
            </label>
            <div className="mb-2 flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <AlertCircle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 leading-snug">
                A <strong>{category.label}</strong> ticket requires you to link an order so our team can assist you faster.
              </p>
            </div>
            <OrderPicker selectedOrder={selectedOrder} onSelect={setSelectedOrder} />
            {!selectedOrder && (
              <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                <ShoppingBag size={11} className="flex-shrink-0" /> Please select the order this ticket is about.
              </p>
            )}
          </div>
        )}
        <div>
          <label htmlFor="ticket-subject-input" className="block text-sm font-medium text-gray-700 mb-1.5">
            Subject <span className="text-red-400">*</span>
          </label>
          <input
            ref={subjectRef} id="ticket-subject-input" type="text"
            value={subject} onChange={(e) => setSubject(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onCreate(); }}
            placeholder="Briefly describe your issue…" maxLength={120}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          <p className="text-[11px] text-gray-400 mt-1.5">{subject.length}/120 characters</p>
        </div>
        {showOrderPicker && orderMissing && subject.trim() && (
          <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
            <p className="text-[11px] text-red-600">Please select an order to continue.</p>
          </div>
        )}
        {error && <p className="text-xs text-red-500 flex items-center gap-1.5"><AlertCircle size={13} /> {error}</p>}
        <button onClick={onCreate} disabled={!canCreate}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-600/25"
        >
          {creating && <Loader2 size={14} className="animate-spin" />}
          {creating ? 'Creating ticket…' : 'Start conversation'}
        </button>
      </div>
    </div>
  );
}
