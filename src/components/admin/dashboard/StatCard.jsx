import { TrendingUp } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, change, iconColor = "blue", subtext }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[iconColor]}`}>
          <Icon size={22} strokeWidth={2} />
        </div>
        {change && (
             <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                 change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
             }`}>
                {change >= 0 ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
                {Math.abs(change)}%
            </div>
        )}
      </div>
      <div>
         <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
         <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
         {/* {subtext && <p className="text-xs text-gray-400 mt-2">{subtext}</p>} */}
      </div>
    </div>
  );
};
export default StatCard;
