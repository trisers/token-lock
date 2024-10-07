import React from 'react';
import { Loader2 } from 'lucide-react';

const TableLoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
  );
};

export default TableLoadingSpinner;