"use client";

import React, { useEffect, useState } from 'react';
import CampaignCard, { Campaign } from '../app/components/CampaignCard';

const Campaigns: React.FC = () => {
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaignData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/createCampaign', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }

      const result = await response.json();
      console.log('Campaigns fetched successfully:', result);
      setCampaigns(result);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      alert('Failed to fetch campaigns. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, []);

  const CampaignSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Campaigns</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <CampaignSkeleton key={index} />
            ))
          : campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
      </div>
    </div>
  );
};

export default Campaigns;