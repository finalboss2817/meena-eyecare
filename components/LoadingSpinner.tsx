import React from 'react';

export const LoadingSpinner: React.FC<{className?: string}> = ({ className }) => {
  return (
    <div className={`flex justify-center items-center py-10 ${className}`}>
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};
