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
        const res = await api.get("/admin/analytics/");
        const { summary, revenueTrend, salesByCategory, orderStatus, topProducts } = res.data;

        setData({
          totalRevenue: summary.totalRevenue,
          totalOrders: summary.totalOrders,
          avgOrderValue: summary.avgOrderValue,
          revenueChange: summary.revenueChange || 0,
          ordersChange: summary.ordersChange || 0,
          avgValueChange: summary.avgValueChange || 0,
          salesData: revenueTrend,
          categoryData: salesByCategory,
          statusData: orderStatus,
          topProducts,
        });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

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

