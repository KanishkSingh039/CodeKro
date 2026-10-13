import React from 'react';

export default function Logo({ size = 'md', className = '' }) {
  const isSm = size === 'sm';
  const iconSize = isSm ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = isSm ? 'text-sm' : 'text-base';

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight text-text-primary ${className}`}>
      {/* Clean, flat developer logo icon without glow */}
      <div className="flex items-center justify-center p-1.5 rounded-[var(--radius-sm)] bg-bg-surface-subtle border border-border-default">
        <svg 
          className={`${iconSize} text-accent`} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </div>
      <span className={`${textSize} font-semibold text-text-primary`}>CodeKro</span>
    </div>
  );
}
