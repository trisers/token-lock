"use client";

import React, { useState } from 'react';
import TokenRedemptions from '../../components/TokenRedemtion';
import Purchases from '../../components/Purchases';

const PurchaseHistoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('purchases');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Purchase History</h1>
      
      <div className="mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded-lg ${activeTab === 'purchases' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('purchases')}
        >
          Purchases
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${activeTab === 'redemptions' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('redemptions')}
        >
          Token Redemptions
        </button>
      </div>
      
      {activeTab === 'purchases' && <Purchases />}
      {activeTab === 'redemptions' && <TokenRedemptions />}
    </div>
  );
};

export default PurchaseHistoryPage;