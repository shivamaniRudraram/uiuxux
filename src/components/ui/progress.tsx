import React from 'react';

interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
  color?: 'primary' | 'accent' | 'success' | 'warning';
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  className = '', 
  color = 'primary',
  showLabel = false 
}) => {
  const clampedValue = Math.min(Math.max(0, value), 100);

  const colors = {
    primary: 'bg-indigo-600',
    accent: 'bg-purple-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
  };

  return (
    <div className="w-full flex flex-col gap-1">
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-neutral-450 font-medium">
          <span>Progress</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div className={`w-full h-2 bg-neutral-800 rounded-full overflow-hidden ${className}`}>
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${colors[color]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
