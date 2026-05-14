import api from "./axios";

export const getDashboardStats = async (days = 7) => {
    try {
        const [dashboardRes, chartRes] = await Promise.all([
            api.get('/admin/dashboard/'),
            api.get(`/admin/dashboard/orders-overview/?days=${days}`)
        ]);

        const { summary, topCustomers, recentOrders } = dashboardRes.data;
        const chartData = chartRes.data;

        return {
            revenue: summary.revenue,
            orders: summary.orders,
            products: summary.products,
            users: summary.users,
            recentActivity: recentOrders,
            chartData,
            topUsers: topCustomers
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        throw error;
    }
};