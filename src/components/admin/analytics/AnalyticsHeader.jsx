const AnalyticsHeader = ({ timeRange, setTimeRange }) => {
  return (
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
  );
};
export default AnalyticsHeader;
