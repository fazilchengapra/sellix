import { ArrowUpRight } from "lucide-react";

const TopCustomersTable = ({ users }) => {
  return (
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
                    {users && users.map((user, i) => (
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
                    {(!users || users.length === 0) && (
                        <tr><td colSpan="3" className="py-4 text-center text-gray-500">No user data available</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default TopCustomersTable;
