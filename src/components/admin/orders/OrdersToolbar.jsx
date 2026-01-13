import { Filter, Search } from "lucide-react";

const OrdersToolbar = ({ 
    searchQuery, 
    setSearchQuery, 
    statusFilter, 
    setStatusFilter, 
    statusOptions 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 w-full sm:w-auto">
       {/* Filter Dropdown */}
       <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
             <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm w-full sm:w-auto">
                 <Filter size={16} className="text-gray-400" />
                 <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent border-none text-sm font-medium text-gray-700 outline-none cursor-pointer w-full"
                >
                     {statusOptions.map(opt => (
                         <option key={opt} value={opt}>{opt === 'All' ? 'All Status' : opt}</option>
                     ))}
                 </select>
             </div>
        </div>
    </div>
  );
};

export const OrdersSearch = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search by Order ID or User ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
    );
}

export default OrdersToolbar;
