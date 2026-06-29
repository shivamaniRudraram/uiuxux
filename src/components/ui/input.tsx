import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-xs font-medium text-neutral-300 tracking-wide">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-450">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`w-full rounded-[12px] bg-neutral-900 border ${
              error ? 'border-red-500/50 focus:ring-red-500/30' : 'border-neutral-800 focus:ring-indigo-500/30 focus:border-indigo-500'
            } ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2 text-sm text-neutral-100 placeholder-neutral-500 transition-all focus:outline-none focus:ring-4`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-400 font-medium mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-xs font-medium text-neutral-300 tracking-wide">{label}</label>}
        <textarea
          ref={ref}
          rows={rows}
          className={`w-full rounded-[12px] bg-neutral-900 border ${
            error ? 'border-red-500/50 focus:ring-red-500/30' : 'border-neutral-800 focus:ring-indigo-500/30 focus:border-indigo-500'
          } px-4 py-2 text-sm text-neutral-100 placeholder-neutral-500 transition-all focus:outline-none focus:ring-4 ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-400 font-medium mt-0.5">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-xs font-medium text-neutral-300 tracking-wide">{label}</label>}
        <select
          ref={ref}
          className={`w-full rounded-[12px] bg-neutral-900 border ${
            error ? 'border-red-500/50 focus:ring-red-500/30' : 'border-neutral-800 focus:ring-indigo-500/30 focus:border-indigo-500'
          } px-4 py-2 text-sm text-neutral-100 transition-all focus:outline-none focus:ring-4 cursor-pointer appearance-none ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-neutral-900 text-neutral-100">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-red-400 font-medium mt-0.5">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
