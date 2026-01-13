import { Check, Clock, Package, Truck, Home } from "lucide-react";

const steps = [
  { id: 'Placed', label: 'Order Placed', icon: Clock },
  { id: 'Processing', label: 'Processing', icon: Package },
  { id: 'Shipped', label: 'Out for Delivery', icon: Truck },
  { id: 'Delivered', label: 'Delivered', icon: Home },
];

const OrderStatusTimeline = ({ currentStatus }) => {
  // Map statuses to indices
  const statusOrder = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  
  if (currentStatus === 'Cancelled') {
      return (
          <div className="w-full py-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full font-medium">
                  <span className="w-2 h-2 bg-red-600 rounded-full" />
                  Order Cancelled
              </div>
          </div>
      );
  }

  const currentIndex = statusOrder.indexOf(currentStatus) === -1 ? 0 : statusOrder.indexOf(currentStatus);

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
        {/* Progress Line Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0" />
        
        {/* Active Progress Line */}
        <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 rounded-full z-0 transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white
                ${isCompleted ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-300'}
                ${isCurrent ? 'ring-4 ring-green-100 scale-110' : ''}
                `}
              >
                {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={18} />}
              </div>
              <p className={`mt-3 text-xs sm:text-sm font-medium transition-colors ${
                  isCompleted ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
