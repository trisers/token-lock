// src/app/page.tsx
import React from 'react';
import CampaignCard, { Campaign } from '../app/components/CampaignCard';

const campaigns: Campaign[] = [
  {
    title: 'Lorium',
    products: '7 Shakra Bracelet, Boho Bangle Bracelet',
    eligibleAccounts: 'Ethereum',
    start: '2024-07-17 18:17 (GMT-05:00)',
    end: '2024-07-19 18:17 (GMT-05:00)',
    status: 'active',
  },
  {
    title: 'Lorium',
    products: '7 Shakra Bracelet, Boho Bangle Bracelet',
    eligibleAccounts: 'Ethereum',
    start: '2024-07-17 18:17 (GMT-05:00)',
    end: '2024-07-19 18:17 (GMT-05:00)',
    status: 'Deactivated',
  },
  {
    title: 'Lorium',
    products: '7 Shakra Bracelet, Boho Bangle Bracelet',
    eligibleAccounts: 'Ethereum',
    start: '2024-07-17 18:17 (GMT-05:00)',
    end: '2024-07-19 18:17 (GMT-05:00)',
    status: 'active',
  },
  {
    title: 'Lorium',
    products: '7 Shakra Bracelet, Boho Bangle Bracelet',
    eligibleAccounts: 'Ethereum',
    start: '2024-07-17 18:17 (GMT-05:00)',
    end: '2024-07-19 18:17 (GMT-05:00)',
    status: 'Deactivated',
  },
];

const Campaigns: React.FC = () => (
  <div className="p-8">
    <h1 className="text-2xl font-semibold mb-6">Campaigns</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {campaigns.map((campaign, index) => (
        <CampaignCard key={index} {...campaign} />
      ))}
    </div>
  </div>
);

export default Campaigns;