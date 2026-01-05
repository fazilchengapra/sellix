import { forwardRef } from 'react';

const Card = forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export { Card };
export default Card;
