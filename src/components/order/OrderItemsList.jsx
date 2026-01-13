import { AlertCircle } from "lucide-react";
import { formatPrice } from "../../lib/utils";

const OrderItemsList = ({ order, onReturnItem }) => {
  const isReturnable = (currentOrder, itemReturnDays = 7) => {
    if (currentOrder.status !== "Delivered") return false;

    const deliveryDate = currentOrder.deliveredAt
      ? new Date(currentOrder.deliveredAt)
      : new Date(
          new Date(currentOrder.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000
        );
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - deliveryDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= itemReturnDays;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Items in Order
      </h2>
      <div className="divide-y divide-gray-100">
        {order.items.map((item, idx) => {
          const returnPolicyDays = item.productName.includes("Sneaker")
            ? 5
            : 7;
          const canReturn = isReturnable(order, returnPolicyDays);

          return (
            <div key={idx} className="py-4 first:pt-0 last:pb-0">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Size: {item.size} • Color: {item.color}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Return Action */}
                  {order.status === "Delivered" && (
                    <div className="mt-3">
                      {canReturn ? (
                        <button
                          onClick={() =>
                            onReturnItem(
                              item.productName,
                              returnPolicyDays
                            )
                          }
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          Return Item
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <AlertCircle size={14} />
                          Return window closed
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default OrderItemsList;
