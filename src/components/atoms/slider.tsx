import React, { useState, useRef, useCallback } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  label?: string;
  showTooltip?: boolean;
  disabled?: boolean;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = min,
  onChange,
  label,
  showTooltip = true,
  disabled = false,
  className = ''
}) => {
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const currentValue = value ?? internalValue;
  const percentage = ((currentValue - min) / (max - min)) * 100;

  const handleValueChange = useCallback((newValue: number) => {
    const clampedValue = Math.max(min, Math.min(max, newValue));
    const steppedValue = Math.round(clampedValue / step) * step;

    if (value === undefined) {
      setInternalValue(steppedValue);
    }
    onChange?.(steppedValue);
  }, [min, max, step, value, onChange]);

  const getValueFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return currentValue;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return min + (max - min) * percentage;
  }, [min, max, currentValue]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;

    e.preventDefault();
    setIsDragging(true);

    const newValue = getValueFromPosition(e.clientX);
    handleValueChange(newValue);
  }, [disabled, getValueFromPosition, handleValueChange]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || disabled) return;

    const newValue = getValueFromPosition(e.clientX);
    handleValueChange(newValue);
  }, [isDragging, disabled, getValueFromPosition, handleValueChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    let newValue = currentValue;
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newValue = currentValue - step;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newValue = currentValue + step;
        break;
      case 'Home':
        e.preventDefault();
        newValue = min;
        break;
      case 'End':
        e.preventDefault();
        newValue = max;
        break;
      default:
        return;
    }

    handleValueChange(newValue);
  }, [disabled, currentValue, step, min, max, handleValueChange]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className={`w-full pb-10 ${className}`}>
      <style>
        {`
          .slider-thumb:focus {
            box-shadow: 0 0 0 3px var(--purple-light) !important;
          }
        `}
      </style>
      {label && (
        <label className="text-base text-gray-800 mb-3 flex text-left">
          {label}
        </label>
      )}

      <div className="flex justify-between mt-1 mb-2 text-xs" style={{ color: 'var(--purple-navy)' }}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
      <div className="relative">

        <div
          ref={sliderRef}
          className={`relative h-1 rounded-full cursor-pointer transition-all duration-150`}
          style={{
            backgroundColor: disabled ? '#e5e7eb' : 'var(--purple-light)'
          }}
          onMouseDown={handleMouseDown}
        >

          <div
            className="absolute h-full rounded-full transition-all duration-150"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: disabled ? '#9ca3af' : 'var(--purple-primary)'
            }}
          />

          <div
            ref={thumbRef}
            className={`slider-thumb absolute top-1/2 w-4 h-4 rounded-full transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 focus:outline-none ${
              disabled 
                ? 'cursor-not-allowed' 
                : 'cursor-grab active:cursor-grabbing hover:scale-110'
            }`}
            style={{ 
              left: `${percentage}%`,
              backgroundColor: 'var(--purple-primary)',
              boxShadow: disabled ? 'none' : '0 2px 8px rgba(118, 27, 228, 0.2)'
            }}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={handleKeyDown}
          />

          {showTooltip && (
            <div
              className="absolute top-full mt-2 px-4 py-2 text-sm font-medium rounded-lg transform -translate-x-1/2 pointer-events-none"
              style={{ 
                left: `${percentage}%`,
                backgroundColor: '#ffffff',
                color: 'var(--purple-primary)',
                border: `1px solid var(--purple-light)`
              }}
            >
              {currentValue}

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2">
                <div 
                  className="border-4 border-transparent" 
                  style={{ borderBottomColor: 'white' }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Slider;
