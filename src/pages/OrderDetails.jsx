import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../api/axios";
import { Spinner } from "../components/ui/Spinner";
import OrderStatusTimeline from "../components/order/OrderStatusTimeline";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import AlertDialog from "../components/ui/AlertDialog";
import OrderActions from "../components/order/OrderActions";
import OrderItemsList from "../components/order/OrderItemsList";
import OrderShippingInfo from "../components/order/OrderShippingInfo";
import OrderPaymentInfo from "../components/order/OrderPaymentInfo";
import OrderCostSummary from "../components/order/OrderCostSummary";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingStatus, setPendingStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
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
      if(response.data.user !== user.id && !user.is_staff) {
          // If not admin and not owner
          // Ideally handle 403 or redirect
      }
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
      await api.patch(`/orders/${order.id}/`, { status: pendingStatus });
      setOrder({ ...order, status: pendingStatus });
      showToast("Order status updated", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update status", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      await api.patch(`/orders/${order.id}/`, {
        status: "Cancelled",
      });
      setOrder({ ...order, status: "Cancelled" });
      showToast("Order cancelled successfully", "success");
      setShowCancelDialog(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to cancel order", "error");
    } finally {
      setCancelling(false);
    }
  };

  const handleReturnItem = (itemName, returnDays = 7) => {
    showToast(
      `Return process initiated for ${itemName} (Policy: ${returnDays} days)`,
      "success"
    );
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
            Order #{String(order.id).substring(0, 8).toUpperCase()}
          </h1>
          <p className="text-gray-500 mt-1">
            Placed on {new Date(order.created_at).toLocaleDateString()} at{" "}
            {new Date(order.created_at).toLocaleTimeString()}
          </p>
        </div>

        <OrderActions 
            user={user}
            order={order}
            pendingStatus={pendingStatus}
            setPendingStatus={setPendingStatus}
            handleSaveStatus={handleSaveStatus}
            saving={saving}
            onCancelClick={() => setShowCancelDialog(true)}
        />
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
          <OrderItemsList order={order} onReturnItem={handleReturnItem} />
        </div>

        <div className="space-y-6">
          <OrderShippingInfo user={user} />
          <OrderPaymentInfo order={order} />
          <OrderCostSummary order={order} />
        </div>
      </div>

      {/* Cancel Order Alert Dialog */}
      <AlertDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelOrder}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        variant="danger"
        confirmText="Yes, Cancel Order"
        cancelText="No, Keep Order"
        loading={cancelling}
      />
    </div>
  );
};

export default OrderDetails;
