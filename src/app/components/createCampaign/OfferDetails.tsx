import React, { ChangeEventHandler } from 'react';

interface OfferDetailsProps {
  offerHeading: string;
  offerDescription: string;
  onHeadingChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const OfferDetails: React.FC<OfferDetailsProps> = ({
  offerHeading,
  offerDescription,
  onHeadingChange,
  onDescriptionChange,
}) => {
  const handleHeadingChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onHeadingChange(event.target.value);
  };

  const handleDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    onDescriptionChange(event.target.value);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg mb-2">Offer Heading</h2>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Your offer heading here"
          value={offerHeading}
          onChange={handleHeadingChange}
        />
      </div>
      <div>
        <h2 className="text-lg mb-2">Offer Description (Shown on Product)</h2>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
          placeholder="Available for all token holders"
          value={offerDescription}
          onChange={handleDescriptionChange}
        />
      </div>
    </div>
  );
};

export default OfferDetails;