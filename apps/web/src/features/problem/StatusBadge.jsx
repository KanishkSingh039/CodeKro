import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ZapOff,
  Clock,
  Database,
  Loader2,
  Circle,
} from 'lucide-react';

/**
 * StatusBadge Component
 * Shows an icon PLUS text label for every JudgeStatus.
 * Never relies on color alone.
 */
export default function StatusBadge({ status, size = 'sm', className = '' }) {
  const norm = (status || 'Idle').toLowerCase();

  const getStatusConfig = () => {
    switch (norm) {
      case 'accepted':
        return {
          label: 'Accepted',
          icon: CheckCircle2,
          colorClass: 'text-accent border-accent/20 bg-bg-surface-subtle',
        };
      case 'wrong answer':
        return {
          label: 'Wrong Answer',
          icon: XCircle,
          colorClass: 'text-error border-error/30 bg-bg-surface-subtle',
        };
      case 'compile error':
        return {
          label: 'Compile Error',
          icon: AlertTriangle,
          colorClass: 'text-[var(--difficulty-medium)] border-border-default bg-bg-surface-subtle',
        };
      case 'runtime error':
        return {
          label: 'Runtime Error',
          icon: ZapOff,
          colorClass: 'text-error border-error/30 bg-bg-surface-subtle',
        };
      case 'time limit exceeded':
        return {
          label: 'Time Limit Exceeded',
          icon: Clock,
          colorClass: 'text-[var(--difficulty-medium)] border-border-default bg-bg-surface-subtle',
        };
      case 'memory limit exceeded':
        return {
          label: 'Memory Limit Exceeded',
          icon: Database,
          colorClass: 'text-[var(--difficulty-medium)] border-border-default bg-bg-surface-subtle',
        };
      case 'running':
        return {
          label: 'Running tests...',
          icon: Loader2,
          iconClass: 'animate-spin',
          colorClass: 'text-text-primary border-border-default bg-bg-surface-subtle',
        };
      case 'queued':
        return {
          label: 'In queue...',
          icon: Loader2,
          iconClass: 'animate-spin',
          colorClass: 'text-text-muted border-border-default bg-bg-surface-subtle',
        };
      case 'idle':
      default:
        return {
          label: 'Not Run',
          icon: Circle,
          colorClass: 'text-text-muted border-border-default bg-bg-surface',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
    lg: 'text-base px-3.5 py-2 gap-2.5 font-semibold',
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-[var(--radius-sm)] border select-none ${config.colorClass} ${sizeStyles} ${className}`}
      role="status"
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${config.iconClass || ''}`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
