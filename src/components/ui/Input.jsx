import { forwardRef } from 'react';

const Input = forwardRef(({ className = '', type = 'text', label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all ${
          error ? 'border-red-500' : 'border-gray-200'
        } ${className}`}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
export default Input;
