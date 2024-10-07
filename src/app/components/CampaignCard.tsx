import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface Campaign {
  id: number;
  campaignName: string;
  campaignType: string;
  discountType: string;
  discountValue: string | null;
  offerHeading: string;
  offerDescription: string;
  startDate: string;
  endDate: string;
  autoActivate: number;
  eligibilityConditions: any[] | null;
  selectedProducts: number[] | 'all' | null;
  campaignStatus: number;
}

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const router = useRouter();
  const [status, setStatus] = useState<'Active' | 'Idle'>(
    campaign.campaignStatus === 1 ? 'Active' : 'Idle'
  );
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEditCampaign = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/campaigns/${campaign.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch campaign data');
      }
      const campaignData = await response.json();
      router.push(`/editCampaign/${campaign.id}`);
    } catch (error) {
      console.error('Error fetching campaign data:', error);
      alert('Failed to load campaign data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateDeactivate = async () => {
    const newStatus = status === 'Active' ? 0 : 1;
    try {
      const response = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignStatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update campaign status');
      }

      setStatus(newStatus === 1 ? 'Active' : 'Idle');
      console.log(`Campaign ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating campaign status:', error);
      alert('Failed to update campaign status. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow-md border rounded-lg p-4 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center mb-[37px]">
          <h2 className="text-lg font-medium">{campaign.campaignName}</h2>

          <div className="flex flex-wrap gap-4 ml-4">
            <span className="bg-blue-150 border-blue-500 border-solid border-[1.5px] text-blue-700 text-xs px-2.5 py-0.5 rounded-full">
              {campaign.campaignType}
            </span>
            {campaign.campaignType === 'discount' && campaign.discountValue && (
              <span className="bg-[#FFF2EF] border-[#BE1202] border-solid border-[1.5px] text-red-700 text-xs px-2.5 py-0.5 rounded-full">
                {campaign.discountType === 'percentage' ? `${campaign.discountValue}% Discount` : `Rs. ${campaign.discountValue} Off`}
              </span>
            )}
            <span
              className={`border-solid border-[1.5px] text-xs px-2.5 py-0.5 rounded-full ${status === 'Active'
                  ? 'border-[#007D35] bg-[#FEFEF7] text-[#007D35]'
                  : 'border-yellow-500 bg-[#FEFEF7] text-yellow-600'
                }`}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <p>
            <span style={{ fontFamily: 'Nunito Sans', color: '#2C2C2C', fontWeight: 'bold' }}>Product</span>
            <br />
            <span className="text-sm">
              {campaign.selectedProducts === 'all' || (Array.isArray(campaign.selectedProducts) && campaign.selectedProducts.length === 0)
                ? 'All products'
                : `${campaign.selectedProducts?.length || 0} products selected`}
            </span>
          </p>
          <p>
            <span style={{ fontFamily: 'Nunito Sans', color: '#2C2C2C', fontWeight: 'bold' }}>Eligible Accounts</span>
            <br />
            <span className="text-sm">

              {campaign.eligibilityConditions ? `${campaign.eligibilityConditions.length} condition(s) set` : 'No conditions set'}
            </span>
          </p>
          <p>
            <span style={{ fontFamily: 'Nunito Sans', color: '#2C2C2C', fontWeight: 'bold' }}>Start</span>
            <br />
            <span className="text-sm">

              {formatDate(campaign.startDate)}
            </span>
          </p>
          <p>
            <span style={{ fontFamily: 'Nunito Sans', color: '#2C2C2C', fontWeight: 'bold' }}>End</span>
            <br />
            <span className="text-sm">

              {formatDate(campaign.endDate)}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-[48px] flex justify-between items-center mb-4">
        <button
          type="button"
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
            } flex items-center justify-center w-32`}
          onClick={handleEditCampaign}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          {isLoading ? 'Processing' : 'Edit'}
        </button>
        <div className="text-sm">
          <span>
            This campaign is {status} -
          </span>
          <button
            onClick={handleActivateDeactivate}
            className={`ml-2 ${status === 'Active'
                ? 'text-red-500 hover:text-red-600'
                : 'text-green-500 hover:text-green-600'
              } transition-colors`}
          >
            Click to {status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;