import { MapPin } from "lucide-react";

const OrderShippingInfo = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
        <MapPin size={16} /> Shipping Details
      </h3>
      <div className="text-sm text-gray-600 space-y-1">
        <p className="font-medium text-gray-900">
          {user?.name || "User Name"}
        </p>
        <p>123 Main Street, Apt 4B</p>
        <p>New York, NY 10001</p>
        <p>United States</p>
        <p className="mt-2 text-gray-500">+1 (555) 123-4567</p>
      </div>
    </div>
  );
};
export default OrderShippingInfo;
