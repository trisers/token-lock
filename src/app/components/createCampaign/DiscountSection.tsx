import React, { useState, ChangeEventHandler } from 'react';

interface DiscountSectionProps {
  discountType: string;
  discountValue: number;
  onTypeChange: (value: string) => void;
  onValueChange: (value: number) => void;
}

const DiscountSection: React.FC<DiscountSectionProps> = ({
  discountType,
  discountValue,
  onTypeChange,
  onValueChange,
}) => {
  const handleTypeClick = (type: string) => {
    onTypeChange(type);
  };

  const handleValueChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onValueChange(Number(event.target.value));
  };

  const handleIncrement = () => {
    onValueChange(discountValue + 1);
  };

  const handleDecrement = () => {
    onValueChange(Math.max(0, discountValue - 1));
  };

  return (
    <div className='flex gap-8 items-center'>
      <div className="flex rounded-full border-[1.5px] border-gray-500">
        <button
          className={`px-6 py-2 rounded-full  ${
            discountType === 'percentage' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
          }`}
          onClick={() => handleTypeClick('percentage')}
        >
          Percentage
        </button>
        <button
          className={`px-6 py-2 rounded-full ${
            discountType === 'fixed' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
          }`}
          onClick={() => handleTypeClick('fixed')}
        >
          Fixed Amount
        </button>
      </div>
      <div className="flex items-center w-8">
        <span className="mr-2 font-light">Discount:</span>
        <div className='flex border-gray-300 border px-4 py-1 rounded-full'>
          <button
            className="w-8 h-8 flex items-center justify-center border bg-white-200 rounded-full"
            onClick={handleDecrement}
          >
            -
          </button>
          <input
            type="number"
            className="w-20 px-2 py-1 rounded-md mx-2 text-center"
            value={discountValue}
            onChange={handleValueChange}
          />
          <button
            className="w-8 h-8 flex items-center justify-center border bg-white-200 rounded-full"
            onClick={handleIncrement}
          >
            +
          </button>
          {discountType === 'percentage' && <span className="ml-2 mt-1">%</span>}
        </div>
      </div>
    </div>
  );
};

export default DiscountSection;