import React from 'react';
import { Button } from './button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass-card border border-dashed border-neutral-800/80 bg-neutral-900/10">
      {icon && <div className="p-3 bg-neutral-800/40 rounded-full text-indigo-400 mb-4">{icon}</div>}
      <h3 className="text-lg font-bold text-neutral-100 mb-1">{title}</h3>
      <p className="text-sm text-neutral-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
