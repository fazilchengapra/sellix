import { ElementType } from 'react';
import { Link } from 'react-router-dom';

interface NavIconLinkProps {
  to: string;
  icon: ElementType;
  count?: number;
  label?: string;
}

export const NavIconLink = ({ to, icon: Icon, count, label }: NavIconLinkProps) => {
  return (
    <Link 
      to={to} 
      className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
      title={label || to.replace('/', '')}
    >
      <Icon className="w-5 h-5" />
      {count !== undefined && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] bg-blue-600 text-white text-[10px] font-bold rounded-full px-1">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
};

export default NavIconLink;
