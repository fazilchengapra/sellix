import { formatPrice } from "../../lib/utils";

const OrderCostSummary = ({ order }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
        Order Summary
      </h3>
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatPrice(0)}</span>
        </div>
        <div className="pt-3 border-t border-gray-100 flex justify-between font-bold text-gray-900 text-base">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
};
export default OrderCostSummary;
