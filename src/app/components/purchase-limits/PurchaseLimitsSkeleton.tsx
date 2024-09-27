import React from 'react';

const PurchaseLimitsSkeleton: React.FC = () => {
  return (
    <div className="max-w-full mx-auto p-6 bg-white shadow-lg rounded-lg border animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseLimitsSkeleton;