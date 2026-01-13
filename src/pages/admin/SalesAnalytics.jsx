import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Spinner from "../../components/ui/Spinner";
import AnalyticsHeader from "../../components/admin/analytics/AnalyticsHeader";
import StatsCards from "../../components/admin/analytics/StatsCards";
import RevenueTrendChart from "../../components/admin/analytics/RevenueTrendChart";
import CategorySalesChart from "../../components/admin/analytics/CategorySalesChart";
import OrderStatusChart from "../../components/admin/analytics/OrderStatusChart";
import TopProductsTable from "../../components/admin/analytics/TopProductsTable";

const SalesAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    salesData: [],
    categoryData: [],
    statusData: [],
    topProducts: [],
  });
  const [timeRange, setTimeRange] = useState("30");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, productsRes] = await Promise.all([
          api.get("/orders"),
          api.get("/products"),
        ]);

        const orders = ordersRes.data;
        const products = productsRes.data;

        processData(orders, products);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const processData = (orders, products) => {
    // Helper to check if date is within range
    const isWithinRange = (date, startDate, endDate) => {
        const d = new Date(date);
        return d >= startDate && d <= endDate;
    };

    const today = new Date();
    const range = parseInt(timeRange);
    
    // Define Current Period
    const currentEndDate = new Date(today);
    const currentStartDate = new Date(today);
    currentStartDate.setDate(today.getDate() - range);

    // Define Previous Period
    const prevEndDate = new Date(currentStartDate);
    const prevStartDate = new Date(currentStartDate);
    prevStartDate.setDate(currentStartDate.getDate() - range);

    // Filter Orders
    const currentOrders = orders.filter(o => isWithinRange(o.createdAt, currentStartDate, currentEndDate));
    const previousOrders = orders.filter(o => isWithinRange(o.createdAt, prevStartDate, prevEndDate));

    // Calculate Metrics via Helper
    const calculateMetrics = (orderList) => {
        const revenue = orderList.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
        const count = orderList.length;
        const avgValue = count > 0 ? revenue / count : 0;
        return { revenue, count, avgValue };
    };

    const currentMetrics = calculateMetrics(currentOrders);
    const prevMetrics = calculateMetrics(previousOrders);

    // Calculate Percentage Changes
    const calculateChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    const revenueChange = calculateChange(currentMetrics.revenue, prevMetrics.revenue);
    const ordersChange = calculateChange(currentMetrics.count, prevMetrics.count);
    const avgValueChange = calculateChange(currentMetrics.avgValue, prevMetrics.avgValue);

    // 1. KPIs (Use Current Period Data)
    const totalRevenue = currentMetrics.revenue;
    const totalOrders = currentMetrics.count;
    const avgOrderValue = currentMetrics.avgValue;

    // 2. Sales Over Time (Chart) - Already correct logic but ensure it uses filtered logic or re-generates map
    const salesMap = {};
    const dateOptions = { month: "short", day: "numeric" };

    for (let i = range - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      salesMap[dateStr] = {
        date: d.toLocaleDateString("en-US", dateOptions),
        rawDate: dateStr,
        revenue: 0,
        orders: 0,
      };
    }

    // Only map current period orders to chart
    currentOrders.forEach((order) => {
      const orderDate = order.createdAt.split("T")[0];
      if (salesMap[orderDate]) {
        salesMap[orderDate].revenue += Number(order.total) || 0;
        salesMap[orderDate].orders += 1;
      }
    });

    const salesData = Object.values(salesMap).sort((a, b) =>
      a.rawDate.localeCompare(b.rawDate)
    );

    // 3. Sales By Category (Use Current Period)
    const categoryMap = {};
    currentOrders.forEach((order) => {
      order.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId) || {};
        const category = product.category || "Uncategorized";

        if (!categoryMap[category]) {
          categoryMap[category] = 0;
        }

        const itemTotal =
          (Number(item.price) || 0) * (Number(item.quantity) || 1);
        categoryMap[category] += itemTotal;
      });
    });

    const categoryData = Object.entries(categoryMap)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
      .sort((a, b) => b.value - a.value);

    // 4. Order Status Distribution (Use Current Period)
    const statusMap = {};
    currentOrders.forEach((order) => {
      const status = order.status || "Pending";
      statusMap[status] = (statusMap[status] || 0) + 1;
    });

    const statusData = Object.entries(statusMap).map(([name, value]) => ({
      name,
      value,
    }));

    // 5. Top Selling Products (Use Current Period)
    const productSales = {};
    currentOrders.forEach((order) => {
      order.items.forEach((item) => {
        const id = item.productId;
        if (!productSales[id]) {
          productSales[id] = {
            id,
            name: item.productName || "Unknown Product",
            sales: 0,
            revenue: 0,
          };
        }
        productSales[id].sales += Number(item.quantity) || 1;
        productSales[id].revenue +=
          (Number(item.price) || 0) * (Number(item.quantity) || 1);
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    setData({
      totalRevenue,
      totalOrders,
      avgOrderValue,
      revenueChange,
      ordersChange,
      avgValueChange,
      salesData,
      categoryData,
      statusData,
      topProducts,
    });
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Spinner size={40} />
      </div>
    );

  return (
    <div className="space-y-8 pb-10">
      <AnalyticsHeader timeRange={timeRange} setTimeRange={setTimeRange} />

      <StatsCards data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueTrendChart data={data.salesData} />
        <CategorySalesChart data={data.categoryData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <OrderStatusChart data={data.statusData} />
        <TopProductsTable products={data.topProducts} />
      </div>
    </div>
  );
};

export default SalesAnalytics;
