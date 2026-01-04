import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes {
  label?: string;
  error?: string;
}

export const Input = forwardRef(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      
        {label && (
          
            {label}
          
        )}
        
        {error && {error}}
      
    );
  }
);

Input.displayName = 'Input';
