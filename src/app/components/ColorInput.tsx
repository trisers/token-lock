import React from 'react';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center space-x-4">
      <label className="font-medium text-md text-gray-700 w-1/3">{label}</label>
      <div className="relative flex-grow">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 pr-10 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute right-2 border-black top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-lg cursor-pointer bg-white"
        />
      </div>
    </div>
  );
};

export default ColorInput;