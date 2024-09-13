"use client";

import React, { useEffect } from 'react';

interface CampaignTypeSelectorProps {
  selectedType: string;
  onChange: (value: string) => void;
}

const CampaignTypeSelector: React.FC<CampaignTypeSelectorProps> = ({ selectedType, onChange }) => {
  const types = [
    { id: 'exclusive', title: 'Exclusive Products', description: 'Only available to token holders for purchase' },
    { id: 'redemption', title: 'Token Redemption (ERC-721 Only)', description: 'Offer products for redemption for unredeemed tokens held by shoppers' },
    { id: 'discount', title: 'Special Discount', description: 'Offer discounted prices for token holders while allowing anyone else to buy' },
  ];

  useEffect(() => {
    if (!selectedType) {
      onChange('exclusive');
    }
  }, [selectedType, onChange]);

  const handleTypeClick = (typeId: string) => {
    onChange(typeId);
  };

  return (
    <div>
      <h2 className="text-lg mb-2">Type of Campaign</h2>
      <div className="grid grid-cols-3 gap-4">
        {types.map((type) => (
          <button
            key={type.id}
            className={`p-4 border rounded-md text-left ${
              selectedType === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onClick={() => handleTypeClick(type.id)}
          >
            <h3 className={`font-semibold mb-4 text-center ${
              selectedType === type.id ? 'text-blue-500' : 'text-[#626E7F]'
            }`}>
              {type.title}
            </h3>
            <p className="text-sm text-[#626E7F] text-center">{type.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CampaignTypeSelector;