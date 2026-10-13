import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({
  id,
  label,
  placeholder = '••••••••',
  value,
  onChange,
  error,
  helperText,
  rightAction,
  disabled = false,
  required = false,
  autoComplete = 'current-password',
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="w-full space-y-1.5 text-left">
      <div className="flex items-center justify-between">
        {label && (
          <label 
            htmlFor={id} 
            className="block text-xs font-medium text-text-secondary select-none"
          >
            {label}
          </label>
        )}
        {rightAction && (
          <div className="text-xs">
            {rightAction}
          </div>
        )}
      </div>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          className={`w-full h-10 pl-3 pr-10 bg-bg-input border text-sm text-text-primary placeholder:text-text-muted rounded-[var(--radius-sm)] transition-colors outline-none
            ${error ? 'border-error focus:border-error focus:ring-1 focus:ring-error' : 'border-border-default focus:border-accent focus:ring-1 focus:ring-accent'}
            disabled:opacity-50 disabled:bg-bg-surface-subtle disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />

        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-secondary transition-colors focus:outline-none"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {helperText && !error && (
        <p id={helperId} className="text-xs text-text-muted mt-1">
          {helperText}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-xs text-error mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
