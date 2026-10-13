import React from 'react';
import { Check } from 'lucide-react';

export default function Checkbox({
  id,
  checked,
  onChange,
  label,
  children,
  disabled = false,
  required = false,
  error,
  className = '',
  ...props
}) {
  return (
    <div className={`space-y-1 text-left ${className}`}>
      <label 
        htmlFor={id} 
        className={`flex items-start gap-2.5 cursor-pointer select-none group ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className="peer sr-only"
            {...props}
          />
          <div className="w-4 h-4 rounded-[3px] border border-border-default bg-bg-input peer-checked:bg-accent peer-checked:border-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 transition-colors flex items-center justify-center">
            {checked && (
              <Check className="w-3 h-3 text-accent-text stroke-[3]" aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="text-xs text-text-secondary group-hover:text-text-primary transition-colors leading-relaxed">
          {label || children}
        </div>
      </label>

      {error && (
        <p className="text-xs text-error pl-6" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
