import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 24, className = '', ...props }) => {
  return (
    <div className={`flex items-center justify-center ${className}`} {...props}>
      <Loader2 className="animate-spin text-blue-600" size={size} />
    </div>
  );
};

export { Spinner };
export default Spinner;
