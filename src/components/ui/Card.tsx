import { forwardRef, HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className = '', children, ...props }, ref) => {
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
