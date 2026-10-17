import React from 'react';

const LANGUAGES = [
  { id: 'cpp', label: 'C++', monacoLang: 'cpp' },
  { id: 'java', label: 'Java', monacoLang: 'java' },
  { id: 'python', label: 'Python3', monacoLang: 'python' },
  { id: 'javascript', label: 'JavaScript', monacoLang: 'javascript' },
  { id: 'go', label: 'Go', monacoLang: 'go' },
];

/**
 * LanguageSelect Component
 * Compact language selector dropdown for the code editor toolbar.
 */
export default function LanguageSelect({ language, onChange, disabled = false }) {
  return (
    <select
      value={language}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label="Select Programming Language"
      className="h-7 px-2 text-xs font-medium font-mono bg-bg-surface border border-border-default rounded-[var(--radius-sm)] text-text-primary hover:border-border-default focus:border-accent focus:outline-none cursor-pointer disabled:opacity-50"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.id} value={lang.id}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}

export { LANGUAGES };
