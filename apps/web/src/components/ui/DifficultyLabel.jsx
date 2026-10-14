import React from 'react';

/**
 * DifficultyLabel Component
 * Displays Easy / Medium / Hard as a calm, small text label.
 * Color tokens strictly respected. No inline hex values.
 */
export default function DifficultyLabel({ difficulty, className = '' }) {
  const norm = (difficulty || '').toLowerCase();

  const colorStyle = {
    easy: 'text-[var(--difficulty-easy)]',
    medium: 'text-[var(--difficulty-medium)]',
    hard: 'text-[var(--difficulty-hard)]',
  }[norm] || 'text-text-secondary';

  const label = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  }[norm] || difficulty;

  return (
    <span className={`inline-block text-xs font-medium ${colorStyle} ${className}`}>
      {label}
    </span>
  );
}
