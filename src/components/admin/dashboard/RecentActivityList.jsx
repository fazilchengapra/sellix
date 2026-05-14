import { Package, ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const RecentActivityList = ({ activities }) => {
  const navigate = useNavigate("");
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
        <Link
          to="/admin/orders"
          className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1"
        >
          View All <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="space-y-4">
        {activities.map((order) => (
          <div
            key={order.id}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
              <Package size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <p className="text-sm font-semibold text-gray-900">
                  Order #{order.id}
                </p>
                <span className="text-sm font-bold text-gray-900">
                  ₹{Number(order.total).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide
                      ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Processing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                >
                  {order.status || "Pending"}
                </span>
              </div>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">
            No recent activity.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentActivityList;
