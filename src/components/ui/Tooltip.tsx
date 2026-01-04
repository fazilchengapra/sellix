import { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

const Tooltip = ({ content, children }: TooltipProps) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-auto">
        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export { Tooltip };
export default Tooltip;
