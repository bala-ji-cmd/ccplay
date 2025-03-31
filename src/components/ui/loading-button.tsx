import { ButtonHTMLAttributes } from 'react';
import { Loader } from './loader';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function LoadingButton({ 
  isLoading, 
  loadingText, 
  children, 
  disabled, 
  className = '', 
  ...props 
}: LoadingButtonProps) {
  return (
    <button
      disabled={isLoading || disabled}
      className={`${className} relative`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader size="sm" />
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </div>
      ) : (
        children
      )}
    </button>
  );
} 