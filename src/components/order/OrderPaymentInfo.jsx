import { CreditCard } from "lucide-react";

const OrderPaymentInfo = ({ order }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
        <CreditCard size={16} /> Payment Info
      </h3>
      <div className="text-sm text-gray-600">
        <p className="flex justify-between mb-2">
          <span>Payment Method</span>
          <span className="font-medium text-gray-900">
            {order.paymentMethod}
          </span>
        </p>
        {order.cardName && (
          <p className="text-xs text-gray-500">
            Card holder: {order.cardName}
          </p>
        )}
      </div>
    </div>
  );
};
export default OrderPaymentInfo;
