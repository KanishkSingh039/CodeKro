import React from 'react';

export default function Divider({ label, className = '' }) {
  if (!label) {
    return <hr className={`border-t border-border-default w-full ${className}`} />;
  }

  return (
    <div className={`relative flex items-center py-2 ${className}`}>
      <div className="grow border-t border-border-default"></div>
      <span className="shrink mx-3 text-xs text-text-muted font-normal lowercase select-none">
        {label}
      </span>
      <div className="grow border-t border-border-default"></div>
    </div>
  );
}
