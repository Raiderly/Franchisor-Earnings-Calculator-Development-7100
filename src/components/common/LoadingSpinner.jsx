import React from 'react';
import SafeIcon from './SafeIcon';
import { FiLoader } from 'react-icons/fi';

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <div className="flex justify-center items-center">
      <SafeIcon
        icon={FiLoader}
        className={`${sizes[size]} text-blue-600 animate-spin ${className}`}
      />
    </div>
  );
};

export default LoadingSpinner;