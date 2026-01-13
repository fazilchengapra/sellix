import { BarChart, Bar, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const OrdersBarChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Orders Overview</h3>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data}>
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
  );
};

export default OrdersBarChart;
