import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { DollarSign, TrendingUp, ShoppingBag, CreditCard, Calendar } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const SalesAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    salesData: [],
    categoryData: [],
    statusData: [],
    topProducts: []
  });
  const [timeRange, setTimeRange] = useState('30'); // '7', '30', '90'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, productsRes] = await Promise.all([
          api.get('/orders'),
          api.get('/products')
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
    // 1. KPIs
    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // 2. Sales Over Time (Chart)
    // Create a map of date -> revenue
    const salesMap = {};
    const dateOptions = { month: 'short', day: 'numeric' };
    
    // Initialize last N days with 0
    const today = new Date();
    const range = parseInt(timeRange);
    
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      salesMap[dateStr] = { 
        date: d.toLocaleDateString('en-US', dateOptions),
        rawDate: dateStr, 
        revenue: 0, 
        orders: 0 
      };
    }

    orders.forEach(order => {
      const orderDate = order.createdAt.split('T')[0];
      if (salesMap[orderDate]) {
        salesMap[orderDate].revenue += Number(order.total) || 0;
        salesMap[orderDate].orders += 1;
      }
    });

    const salesData = Object.values(salesMap).sort((a, b) => a.rawDate.localeCompare(b.rawDate));

    // 3. Sales By Category
    const categoryMap = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            // Find product to get category (if item doesn't have it)
            // Assuming item might not have category, but product list does.
            // Items in order usually have productId.
            const product = products.find(p => p.id === item.productId) || {};
            const category = product.category || 'Uncategorized';
            
            if (!categoryMap[category]) {
                categoryMap[category] = 0;
            }
            // item.price is unit price, multiply by quantity
            // Using item.price from order to preserve historical price
            const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
            categoryMap[category] += itemTotal;
        });
    });

    const categoryData = Object.entries(categoryMap)
        .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
        .sort((a, b) => b.value - a.value);

    // 4. Order Status Distribution
    const statusMap = {};
    orders.forEach(order => {
        const status = order.status || 'Pending';
        statusMap[status] = (statusMap[status] || 0) + 1;
    });
    
    const statusData = Object.entries(statusMap)
        .map(([name, value]) => ({ name, value }));

    // 5. Top Selling Products
    const productSales = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            const id = item.productId;
            if (!productSales[id]) {
                productSales[id] = { 
                    id, 
                    name: item.productName || 'Unknown Product', 
                    sales: 0, 
                    revenue: 0 
                };
            }
            productSales[id].sales += Number(item.quantity) || 1;
            productSales[id].revenue += (Number(item.price) || 0) * (Number(item.quantity) || 1);
        });
    });

    const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    setData({
        totalRevenue,
        totalOrders,
        avgOrderValue,
        salesData,
        categoryData,
        statusData,
        topProducts
    });
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner size={40} /></div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sales Analytics</h1>
          <p className="text-gray-500 mt-2">Detailed insights into your store's performance.</p>
        </div>
        
        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
            {['7', '30', '90'].map((range) => (
                <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        timeRange === range 
                            ? 'bg-blue-50 text-blue-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                    Last {range} Days
                </button>
            ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <DollarSign size={24} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                    <TrendingUp size={14} /> +12.5%
                </div>
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
                <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                    <TrendingUp size={14} /> +8.2%
                </div>
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
                <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-red-50 text-red-600">
                    <TrendingUp size={14} className="rotate-180" /> -2.4%
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
                <h3 className="text-3xl font-bold text-gray-900">₹{Math.round(data.avgOrderValue).toLocaleString()}</h3>
            </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.salesData}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
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
                            minTickGap={30}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9ca3af', fontSize: 12}}
                            tickFormatter={(value) => `₹${value/1000}k`}
                        />
                        <Tooltip 
                             contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                             formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#2563eb" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorSales)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Sales by Category</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.categoryData} layout="vertical">
                         <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                         <XAxis type="number" hide />
                         <YAxis 
                            dataKey="name" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false}
                            width={100}
                            tick={{fill: '#4b5563', fontSize: 13, fontWeight: 500}}
                        />
                         <Tooltip 
                            cursor={{fill: '#f9fafb'}}
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
                         />
                         <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={32}>
                            {data.categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                         </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Order Status */}
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Status</h3>
            <div className="h-[300px] w-full flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* Top Products Table */}
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Selling Products</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product Name</th>
                            <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Units Sold</th>
                            <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.topProducts.map((product, i) => (
                             <tr key={i} className="group hover:bg-gray-50 transition-colors">
                                 <td className="py-4 text-sm font-medium text-gray-900">{product.name}</td>
                                 <td className="py-4 text-right text-sm text-gray-600">{product.sales}</td>
                                 <td className="py-4 text-right text-sm text-gray-900 font-bold">₹{product.revenue.toLocaleString()}</td>
                             </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
