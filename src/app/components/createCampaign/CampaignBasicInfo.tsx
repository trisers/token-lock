import React, { ChangeEventHandler } from 'react';

interface CampaignNameInputFieldProps {
  campaignName: string;
  onChange: (value: string) => void;
}

const CampaignBasicInfo: React.FC<CampaignNameInputFieldProps> = ({ campaignName, onChange }) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <h2 className="text-lg  mb-2">Campaign Name</h2>
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        placeholder="Campaign Name"
        value={campaignName}
        onChange={handleChange}
      />
    </div>
  );
};

export default CampaignBasicInfo;