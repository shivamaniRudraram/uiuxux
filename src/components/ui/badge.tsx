import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({ className = '', variant = 'primary', children, ...props }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border';
  
  const variants = {
    primary: 'bg-indigo-900/40 text-indigo-300 border-indigo-850/60',
    secondary: 'bg-neutral-800 text-neutral-300 border-neutral-700/60',
    success: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40',
    warning: 'bg-amber-950/40 text-amber-400 border-amber-900/40',
    danger: 'bg-red-950/40 text-red-400 border-red-900/40',
    purple: 'bg-purple-950/40 text-purple-300 border-purple-900/40',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
