import React from 'react';
import { BrainCircuit as Circuit } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin`}>
          <Circuit className="h-full w-full text-neon-blue" />
        </div>
        <div className={`absolute inset-0 ${sizeClasses[size]} animate-ping`}>
          <Circuit className="h-full w-full text-neon-blue/30" />
        </div>
      </div>
      {text && (
        <p className="text-gray-300 font-tech text-sm animate-pulse-neon">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;