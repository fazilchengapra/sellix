const TopProductsTable = ({ products }) => {
    return (
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
                      {products.map((product, i) => (
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
    );
  };
  export default TopProductsTable;
  
