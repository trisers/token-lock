import React from 'react';

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number';
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = 'text', className = '' }) => {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="border p-1 rounded w-1/2 text-sm"
      />
    </div>
  );
};

export default InputField;