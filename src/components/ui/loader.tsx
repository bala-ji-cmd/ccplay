import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function Loader({ size = 'md', fullScreen = false }: LoaderProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const loaderContent = (
    <div className="animate-bounce">
      <div className={`relative ${sizeMap[size]}`}>
        <div className="animate-spin absolute inset-0 border-4 border-t-purple-500 border-r-pink-500 border-b-yellow-500 border-l-blue-500 rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}`}>
            ✨
          </span>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
} 