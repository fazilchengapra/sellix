import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

const RevenueChart = ({ data }) => {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
             <select className="bg-gray-50 border-none text-sm font-medium text-gray-500 rounded-lg px-3 py-1 outline-none cursor-pointer">
                 <option>Last 7 Days</option>
                 <option>Last 30 Days</option>
             </select>
        </div>
       
        <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
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
  );
};

export default RevenueChart;
