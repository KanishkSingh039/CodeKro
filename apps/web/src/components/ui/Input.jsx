import React from 'react';

export default function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  required = false,
  autoComplete,
  className = '',
  ...props
}) {
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <div className="flex items-center justify-between">
          <label 
            htmlFor={id} 
            className="block text-xs font-medium text-text-secondary select-none"
          >
            {label}
          </label>
          {helperText && !error && (
            <span id={helperId} className="text-xs text-text-muted">
              {helperText}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}

        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          className={`w-full h-10 px-3 bg-bg-input border text-sm text-text-primary placeholder:text-text-muted rounded-[var(--radius-sm)] transition-colors outline-none
            ${Icon ? 'pl-9' : 'pl-3'}
            ${error ? 'border-error focus:border-error focus:ring-1 focus:ring-error' : 'border-border-default focus:border-accent focus:ring-1 focus:ring-accent'}
            disabled:opacity-50 disabled:bg-bg-surface-subtle disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p id={errorId} className="text-xs text-error mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
