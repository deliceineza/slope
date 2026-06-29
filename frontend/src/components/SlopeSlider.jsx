import React from 'react';

const SlopeSlider = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
        <span>Slope</span>
        <span>{value}°</span>
      </div>
      <input
        type="range"
        min="0"
        max="45"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-orange-500"
      />
    </div>
  );
};

export default SlopeSlider;
