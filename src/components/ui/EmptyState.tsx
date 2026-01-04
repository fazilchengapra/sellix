import { ElementType } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

interface EmptyStateProps {
  icon: ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  actionLink 
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-gray-300" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        {description}
      </p>
      {actionLabel && actionLink && (
        <Link to={actionLink}>
          <Button size="lg">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
