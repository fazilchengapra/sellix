import api from "./axios";

export const getDashboardStats = async () => {
    try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
            api.get('/orders'),
            api.get('/products'),
            api.get('/users')
        ]);

        const orders = ordersRes.data;
        const products = productsRes.data;
        const users = usersRes.data;

        const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
        const totalOrders = orders.length;
        const totalProducts = products.length;
        const totalUsers = users.length;

        // Calculate recent activity (last 5 orders)
        const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const recentActivity = sortedOrders.slice(0, 5);

        // Calculate Chart Data (Last 7 days)
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const chartData = last7Days.map(date => {
            const daysOrders = orders.filter(o => o.createdAt.startsWith(date));
            return {
                date: new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
                revenue: daysOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0),
                orders: daysOrders.length
            };
        });

        // Calculate Top Users by Spending
        const userSpending = {};
        orders.forEach(order => {
            if (userSpending[order.userId]) {
                userSpending[order.userId] += Number(order.total) || 0;
            } else {
                userSpending[order.userId] = Number(order.total) || 0;
            }
        });

        const topUsers = Object.entries(userSpending)
            .map(([userId, totalSpent]) => {
                const user = users.find(u => u.id === userId) || { name: 'Unknown User', email: 'N/A' };
                return {
                    id: userId,
                    name: user.name || 'Unknown',
                    email: user.email,
                    totalOrders: orders.filter(o => o.userId === userId).length,
                    totalSpent
                };
            })
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 5);

        return {
            revenue: totalRevenue,
            orders: totalOrders,
            products: totalProducts,
            users: totalUsers,
            recentActivity,
            chartData,
            topUsers
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        throw error;
    }
};