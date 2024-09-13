import React, { ChangeEventHandler } from 'react';

interface DateRangeProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

const DateRange: React.FC<DateRangeProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const handleStartDateChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onStartDateChange(event.target.value);
  };

  const handleEndDateChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onEndDateChange(event.target.value);
  };

  return (
    <div>
       <div className='flex gap-4 mb-4'>
      <h2 className="text-lg ">Date Range</h2>
      <div className="flex items-center space-x-4">
        <input
          type="date"
          className="px-3 py-2 border border-gray-300 rounded-md"
          value={startDate}
          onChange={handleStartDateChange}
        />
        <span>to</span>
        <input
          type="date"
          className="px-3 py-2 border border-gray-300 rounded-md"
          value={endDate}
          onChange={handleEndDateChange}
        />
      </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        (GMT-05:00) America/New York is the default time zone of your store
      </p>
    </div>
  );
};

export default DateRange;