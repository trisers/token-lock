import React from 'react';
import PurchaseLimitsComponent from '../../components/purchase-limits/PurchaseLimitsComponent';
import TokenRedemptions from '@/app/components/TokenRedemtion';

const PurchaseLimitsPage: React.FC = () => {
  return (
    <div>
    <div className="container mx-auto p-4">
      <PurchaseLimitsComponent />
    </div>
        <div>
        <TokenRedemptions />
      </div>
      </div>
  );
};

export default PurchaseLimitsPage;