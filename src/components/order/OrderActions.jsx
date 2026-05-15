import { Badge } from "../ui/Badge";

const OrderActions = ({ 
    user, 
    order, 
    pendingStatus, 
    setPendingStatus, 
    handleSaveStatus, 
    saving, 
    onCancelClick 
}) => {
  if (user?.is_staff) {
    return (
      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">Status:</span>
        <select
          value={pendingStatus}
          onChange={(e) => setPendingStatus(e.target.value)}
          disabled={order.status === "Cancelled"}
          className="bg-white border-gray-300 text-sm rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 disabled:bg-gray-100 disabled:text-gray-500"
        >
          {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {order.status !== "Cancelled" && (
          <button
            onClick={handleSaveStatus}
            disabled={saving || pendingStatus === order.status}
            className="px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Badge
        variant={order.status === "Delivered" ? "success" : "default"}
        className="px-4 py-1.5 text-sm"
      >
        {order.status}
      </Badge>
      {order.status === "Pending" && (
        <button
          onClick={onCancelClick}
          className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
        >
          Cancel Order
        </button>
      )}
    </div>
  );
};
export default OrderActions;
