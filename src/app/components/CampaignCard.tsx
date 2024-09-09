"use client";

import React, { useState } from 'react';

export interface Campaign {
  title: string;
  products: string;
  eligibleAccounts: string;
  start: string;
  end: string;
  status: 'active' | 'Deactivated';
  isDiscount?: boolean;
  isOff?: boolean;
}

interface CampaignCardProps extends Campaign { }

const CampaignCard: React.FC<CampaignCardProps> = ({
  title,
  products,
  eligibleAccounts,
  start,
  end,
  status: initialStatus,
  isDiscount = true,
  isOff = true
}) => {
  const [status, setStatus] = useState(initialStatus);

  const toggleStatus = () => {
    setStatus(prevStatus => prevStatus === 'active' ? 'Deactivated' : 'active');
  };

  return (
    <div className="bg-white shadow-md border rounded-lg p-4 flex flex-col justify-between h-full">
      <div>
        <div className="flex  items-center mb-[37px]">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex flex-wrap gap-4 ml-4">
            {isDiscount && (
              <span className="bg-[#FFF2EF] border-[#BE1202] border-solid border-[1.5px] text-red-700 text-xs  px-2.5 py-0.5 rounded-full">
                % Discount
              </span>
            )}
            {isOff && (
              <span className="bg-[#FFF2EF] border-[#043AFF] border-solid border-[1.5px] text-[#043AFF] text-xs  px-2.5 py-0.5 rounded-full">
                Rs. 8 Off
              </span>
            )}
            <span
              className={`border-[#007D35] border-solid border-[1.5px] text-xs px-2.5 py-0.5 rounded-full ${status === 'active'
                  ? 'bg-[#FEFEF7] text-[#007D35]'
                  : 'bg-[#FEFEF7] text-[#007D35]'
                }`}
            >
              {status === 'active' ? 'Active' : 'Idle'}
            </span>
          </div>
        </div>
        <div className="space-y-9 text-sm">
          <p>
            <span style={{ fontFamily: 'Nunito Sans', color: '#2C2C2C', fontWeight: 'bold' }}>Product</span>
            <br />
            {products}
          </p>
          <p>
            <span style={{ fontFamily: 'Nunito Sans', color: '#2C2C2C', fontWeight: 'bold' }}>Eligible Accounts</span>
            <br />
            {eligibleAccounts}
          </p>
          <p>
            <span style={{ fontFamily: 'Nunito Sans', color: '#2C2C2C', fontWeight: 'bold' }}>Start</span>
            <br />
            {start}
          </p>
          <p>
            <span style={{ fontFamily: 'Nunito Sans', color: '#2C2C2C', fontWeight: 'bold' }}>End</span>
            <br />
            {end}
          </p>
        </div>
      </div>
      <div className="mt-[48px] flex justify-between items-center mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 w-28 rounded hover:bg-blue-600 transition-colors">
          Edit
        </button>
        <div className="text-sm">
          {/* <span className={status === 'active' ? 'text-green-500' : 'text-red-500'}> */}
          <span>
            This campaign is {status}
          </span>
          <button
            onClick={toggleStatus}
            className={`ml-2 ${status === 'active'
                ? 'text-red-500 hover:text-red-600'
                : 'text-green-500 hover:text-green-600'
              } transition-colors`}
          >
            Click to {status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;