import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/dashboard.api";
import Spinner from "../../components/ui/Spinner";
import StatCard from "../../components/admin/dashboard/StatCard";
import RevenueChart from "../../components/admin/dashboard/RevenueChart";
import OrdersBarChart from "../../components/admin/dashboard/OrdersBarChart";
import TopCustomersTable from "../../components/admin/dashboard/TopCustomersTable";
import RecentActivityList from "../../components/admin/dashboard/RecentActivityList";

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
        <StatCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={DollarSign} change={stats.revenueChange} iconColor="green" subtext="+20.1% from last month" />
        <StatCard title="Total Orders" value={stats.orders} icon={ShoppingCart} change={stats.ordersChange} iconColor="purple" subtext="+180 orders this month" />
        <StatCard title="Total Products" value={stats.products} icon={Package} change={stats.productsChange} iconColor="orange" subtext="4 items low on stock" />
        <StatCard title="Total Users" value={stats.users} icon={Users} change={stats.usersChange} iconColor="blue" subtext="+12 new users today" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RevenueChart data={stats.chartData} />
        <OrdersBarChart data={stats.chartData} />
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopCustomersTable users={stats.topUsers} />
        <RecentActivityList activities={stats.recentActivity} />
      </div>
    </div>
  );
};

export default AdminDashboard;
