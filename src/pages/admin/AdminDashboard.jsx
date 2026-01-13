import { DollarSign, Package, ShoppingCart, Users, TrendingUp, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/dashboard.api";
import Spinner from "../../components/ui/Spinner";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, change, iconColor = "blue", subtext }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[iconColor]}`}>
          <Icon size={22} strokeWidth={2} />
        </div>
        {change !== undefined && (
             <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                 change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
             }`}>
                {change >= 0 ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
                {Math.abs(change)}%
            </div>
        )}
      </div>
      <div>
         <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
         <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
         {subtext && <p className="text-xs text-gray-400 mt-2">{subtext}</p>}
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl">
        <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
        <p className="text-sm text-blue-600">
          Revenue: ₹{payload[0].value.toLocaleString()}
        </p>
        {payload[1] && (
            <p className="text-sm text-purple-600">
            Orders: {payload[1].value}
            </p>
        )}
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        products: 0,
        users: 0,
        recentActivity: [],
        chartData: [],
        topUsers: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                if (data) setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center"><Spinner size={40} /></div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-right">
             <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={DollarSign} change={12.5} iconColor="green" subtext="+20.1% from last month" />
        <StatCard title="Total Orders" value={stats.orders} icon={ShoppingCart} change={8.2} iconColor="purple" subtext="+180 orders this month" />
        <StatCard title="Total Products" value={stats.products} icon={Package} change={-2.4} iconColor="orange" subtext="4 items low on stock" />
        <StatCard title="Total Users" value={stats.users} icon={Users} change={15.3} iconColor="blue" subtext="+12 new users today" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
                 <select className="bg-gray-50 border-none text-sm font-medium text-gray-500 rounded-lg px-3 py-1 outline-none cursor-pointer">
                     <option>Last 7 Days</option>
                     <option>Last 30 Days</option>
                 </select>
            </div>
           
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.chartData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9ca3af', fontSize: 12}}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9ca3af', fontSize: 12}}
                            tickFormatter={(value) => `₹${value/1000}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#2563eb" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorRevenue)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Orders Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Orders Overview</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={stats.chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis 
                             dataKey="date" 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{fill: '#9ca3af', fontSize: 10}} // Smaller font for XAxis in small chart
                             interval={1}
                        />
                         <Tooltip 
                            cursor={{fill: '#f9fafb'}}
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                         />
                        <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                     </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Users Table */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-gray-900">Top Customers</h3>
                 <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                     View All <ArrowUpRight size={16} />
                 </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                            <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Orders</th>
                            <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Spent</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {stats.topUsers && stats.topUsers.map((user, i) => (
                             <tr key={user.id} className="group hover:bg-gray-50 transition-colors">
                                 <td className="py-4">
                                     <div className="flex items-center gap-3">
                                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                                             ${i === 0 ? 'bg-yellow-400 shadow-yellow-200' : 
                                               i === 1 ? 'bg-gray-400 shadow-gray-200' : 
                                               i === 2 ? 'bg-orange-400 shadow-orange-200' : 'bg-blue-100 text-blue-600 shadow-none'}`}
                                         >
                                             {i < 3 ? i + 1 : user.name.charAt(0)}
                                         </div>
                                         <div>
                                             <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                             <p className="text-xs text-gray-400">{user.email}</p>
                                         </div>
                                     </div>
                                 </td>
                                 <td className="py-4 text-right text-sm text-gray-600 font-medium">{user.totalOrders}</td>
                                 <td className="py-4 text-right text-sm text-gray-900 font-bold">₹{user.totalSpent.toLocaleString()}</td>
                             </tr>
                        ))}
                        {(!stats.topUsers || stats.topUsers.length === 0) && (
                            <tr><td colSpan="3" className="py-4 text-center text-gray-500">No user data available</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                 <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                     View All <ArrowUpRight size={16} />
                 </button>
            </div>
          <div className="space-y-4">
            {stats.recentActivity.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                  <Package size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                       <p className="text-sm font-semibold text-gray-900">Order #{order.id}</p>
                       <span className="text-sm font-bold text-gray-900">₹{Number(order.total).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide
                          ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 
                            'bg-gray-100 text-gray-600'}`}>
                          {order.status || 'Pending'}
                      </span>
                  </div>
                </div>
              </div>
            ))}
            {stats.recentActivity.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No recent activity.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
