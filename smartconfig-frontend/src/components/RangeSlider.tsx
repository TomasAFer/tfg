import React, { useRef, useEffect, useState } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  label: string;
  unit: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChange,
  label,
  unit,
}) => {
  const [localMin, setLocalMin] = useState(valueMin);
  const [localMax, setLocalMax] = useState(valueMax);
  const rangeRef = useRef<HTMLDivElement>(null);

  const clampValue = (value: number, lower: number, upper: number) =>
    Math.min(Math.max(value, lower), upper);

  const normalizeValues = (nextMin: number, nextMax: number) => {
    let maxValue = clampValue(nextMax, min, max);
    let minValue = clampValue(nextMin, min, maxValue);

    if (minValue >= maxValue) {
      minValue = clampValue(maxValue - step, min, max);
    }

    if (maxValue - minValue < step) {
      maxValue = clampValue(minValue + step, min, max);
    }

    return { minValue, maxValue };
  };

  useEffect(() => {
    const { minValue, maxValue } = normalizeValues(valueMin, valueMax);
    setLocalMin(minValue);
    setLocalMax(maxValue);
  }, [valueMin, valueMax, min, max, step]);

  const handleMinChange = (value: number) => {
    const { minValue, maxValue } = normalizeValues(value, localMax);
    setLocalMin(minValue);
    setLocalMax(maxValue);
    onChange(minValue, maxValue);
  };

  const handleMaxChange = (value: number) => {
    const { minValue, maxValue } = normalizeValues(localMin, value);
    setLocalMin(minValue);
    setLocalMax(maxValue);
    onChange(minValue, maxValue);
  };

  const minPercent = ((localMin - min) / (max - min)) * 100;
  const maxPercent = ((localMax - min) / (max - min)) * 100;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="space-y-3">
        {/* Visual Range Slider */}
        <div ref={rangeRef} className="relative h-2">
          <div className="absolute w-full h-2 bg-gray-200 rounded-lg" />
          <div
            className="absolute h-2 bg-primary-600 rounded-lg"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />
          
          {/* Min Thumb */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localMin}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
            style={{ zIndex: localMin > max - (max - min) / 2 ? 5 : 3 }}
          />
          
          {/* Max Thumb */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localMax}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
            style={{ zIndex: 4 }}
          />
        </div>

        {/* Value Inputs */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="number"
              step={step}
              min={min}
              max={localMax}
              value={localMin}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
              placeholder={`Min ${unit}`}
            />
          </div>
          <span className="text-gray-500">-</span>
          <div className="flex-1">
            <input
              type="number"
              step={step}
              min={localMin}
              max={max}
              value={localMax}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
              placeholder={`Max ${unit}`}
            />
          </div>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          Rango: {min} - {max} {unit}
        </div>
      </div>
    </div>
  );
};
