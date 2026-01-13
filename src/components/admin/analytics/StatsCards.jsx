import { DollarSign, TrendingUp, ShoppingBag, CreditCard } from 'lucide-react';

const ChangeIndicator = ({ value }) => {
    const isPositive = value >= 0;
    const colorClass = isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600';
    // If value is 0, maybe neutral?
    // Let's stick to positive color for 0 or logic:
    // If 0, show neutral gray? 
    // Usually 0 is considered stable. Let's strictly use green for >=0 and red for <0 for now as per previous design.
  
    return (
      <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${colorClass}`}>
        <TrendingUp size={14} className={!isPositive ? "rotate-180" : ""} />
        {isPositive ? "+" : ""}{value.toFixed(1)}%
      </div>
    );
};

const StatsCards = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <DollarSign size={24} />
            </div>
            <ChangeIndicator value={data.revenueChange || 0} />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <h3 className="text-3xl font-bold text-gray-900">₹{data.totalRevenue.toLocaleString()}</h3>
        </div>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                <ShoppingBag size={24} />
            </div>
            <ChangeIndicator value={data.ordersChange || 0} />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <h3 className="text-3xl font-bold text-gray-900">{data.totalOrders}</h3>
        </div>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
                <CreditCard size={24} />
            </div>
            <ChangeIndicator value={data.avgValueChange || 0} />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
            <h3 className="text-3xl font-bold text-gray-900">₹{Math.round(data.avgOrderValue).toLocaleString()}</h3>
        </div>
    </div>
  </div>
  );
};

export default StatsCards;
