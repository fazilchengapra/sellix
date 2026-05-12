import api from "./axios";

export const getDashboardStats = async () => {
    try {
        const [dashboardRes, chartRes] = await Promise.all([
            api.get('/admin/dashboard/'),
            api.get('/admin/dashboard/orders-overview/')
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