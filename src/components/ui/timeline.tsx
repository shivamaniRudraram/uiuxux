import React from 'react';

interface TimelineItemProps {
  title: string;
  subtitle: string;
  date: string;
  description?: string;
  active?: boolean;
}

export const Timeline: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative border-l-2 border-neutral-800 ml-3 pl-6 space-y-8 py-2">
      {children}
    </div>
  );
};

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  subtitle,
  date,
  description,
  active = false,
}) => {
  return (
    <div className="relative">
      {/* Node Bullet */}
      <span className={`absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-neutral-950 ${
        active ? 'border-indigo-500 ring-4 ring-indigo-500/20' : 'border-neutral-800'
      }`} />
      
      {/* Node Details */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{date}</span>
        <h4 className="text-base font-bold text-neutral-100">{title}</h4>
        <h5 className="text-sm font-medium text-neutral-450">{subtitle}</h5>
        {description && <p className="text-sm text-neutral-400 mt-1 max-w-xl leading-relaxed">{description}</p>}
      </div>
    </div>
  );
};
