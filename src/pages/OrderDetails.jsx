import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import api from "../api/axios";
import { formatPrice } from "../lib/utils";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";
import OrderStatusTimeline from "../components/order/OrderStatusTimeline";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingStatus, setPendingStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (order) setPendingStatus(order.status);
  }, [order]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      if(response.data.userId !== user.id) return false
      setOrder(response.data);
      setPendingStatus(response.data.status);
    } catch (error) {
      console.error("Error fetching order", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStatus = async () => {
    if (pendingStatus === order.status) return;
    setSaving(true);
    try {
      await api.patch(`/orders/${order.id}`, { status: pendingStatus });
      setOrder({ ...order, status: pendingStatus });
      showToast("Order status updated", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update status", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReturnItem = (itemName, returnDays = 7) => {
    showToast(
      `Return process initiated for ${itemName} (Policy: ${returnDays} days)`,
      "success"
    );
  };

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

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  if (!order) return <div className="p-8 text-center">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/orders"
        className="inline-flex items-center text-gray-500 hover:text-black mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Order #{order.id.substring(0, 8).toUpperCase()}
          </h1>
          <p className="text-gray-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>

        {user?.role === "admin" ? (
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <select
              value={pendingStatus}
              onChange={(e) => setPendingStatus(e.target.value)}
              disabled={order.status === "Cancelled"}
              className="bg-white border-gray-300 text-sm rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 disabled:bg-gray-100 disabled:text-gray-500"
            >
              {[
                "Pending",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
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
        ) : (
          <div className="flex items-center gap-3">
            <Badge
              variant={order.status === "Delivered" ? "success" : "default"}
              className="px-4 py-1.5 text-sm"
            >
              {order.status}
            </Badge>
            {["Pending", "Processing"].includes(order.status) && (
              <button
                onClick={() => {
                  setPendingStatus("Cancelled");
                  // We need to trigger the save immediately for user action or use a separate handler
                  // For simplicity re-using the logic but effectively calling api immediately
                  if (
                    window.confirm(
                      "Are you sure you want to cancel this order?"
                    )
                  ) {
                    api
                      .put(`/orders/${order.id}`, {
                        ...order,
                        status: "Cancelled",
                      })
                      .then(() => {
                        setOrder({ ...order, status: "Cancelled" });
                        showToast("Order cancelled successfully", "success");
                      })
                      .catch((err) => {
                        console.error(err);
                        showToast("Failed to cancel order", "error");
                      });
                  }
                }}
                className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
              >
                Cancel Order
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2 space-y-8">
          {/* Status Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Order Status
            </h2>
            <OrderStatusTimeline currentStatus={order.status} />
          </div>

          {/* Order Items */}
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
                                  handleReturnItem(
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
        </div>

        <div className="space-y-6">
          {/* Shipping Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin size={16} /> Shipping Details
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              {/* Assuming address is stored or using mock for now since it wasn't in db.json sample explicitly */}
              <p className="font-medium text-gray-900">
                {user?.name || "User Name"}
              </p>
              <p>123 Main Street, Apt 4B</p>
              <p>New York, NY 10001</p>
              <p>United States</p>
              <p className="mt-2 text-gray-500">+1 (555) 123-4567</p>
            </div>
          </div>

          {/* Payment Info */}
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

          {/* Order Summary */}
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
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
