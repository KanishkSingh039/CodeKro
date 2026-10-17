import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { COPY } from '../../constants/copy';

/**
 * TestcasePanel Component
 * Interactive testcase editor with selectable Case chips, parameter inputs, and custom case creation.
 */
export default function TestcasePanel({
  testCases = [],
  onUpdateTestCase,
  onAddTestCase,
  onRemoveTestCase,
}) {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);

  const activeCase = testCases[activeCaseIdx] || testCases[0];

  const handleAdd = () => {
    const newId = `custom-${Date.now()}`;
    const newCase = {
      id: newId,
      input: 'nums = [1,2,3], target = 4',
      expectedOutput: '[0,2]',
      actualOutput: '',
      isPassed: null,
    };
    if (onAddTestCase) {
      onAddTestCase(newCase);
      setActiveCaseIdx(testCases.length);
    }
  };

  if (!testCases || testCases.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-text-muted">
        {COPY.problem.console.noCases}
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3 font-sans h-full overflow-y-auto">
      {/* Case Chips Row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {testCases.map((tc, idx) => {
          const isSelected = activeCaseIdx === idx;
          return (
            <button
              key={tc.id || idx}
              type="button"
              onClick={() => setActiveCaseIdx(idx)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-bg-surface-subtle text-accent border border-accent/30'
                  : 'bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover border border-border-default'
              }`}
            >
              <span>{COPY.problem.actions.case} {idx + 1}</span>
              {tc.id?.startsWith('custom-') && testCases.length > 1 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onRemoveTestCase) onRemoveTestCase(idx);
                    if (activeCaseIdx >= testCases.length - 1) {
                      setActiveCaseIdx(Math.max(0, testCases.length - 2));
                    }
                  }}
                  className="hover:text-error ml-0.5"
                  title="Remove custom case"
                >
                  <Trash2 className="w-3 h-3" />
                </span>
              )}
            </button>
          );
        })}

        {/* Add custom case button */}
        <button
          type="button"
          onClick={handleAdd}
          className="p-1 rounded bg-bg-surface border border-border-default text-text-muted hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer"
          title={COPY.problem.actions.addCase}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editable input for current case */}
      {activeCase && (
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider block">
            {COPY.problem.meta.input}
          </label>
          <textarea
            value={activeCase.input || ''}
            onChange={(e) => {
              if (onUpdateTestCase) {
                onUpdateTestCase(activeCaseIdx, { ...activeCase, input: e.target.value });
              }
            }}
            rows={3}
            className="w-full p-2.5 text-xs font-mono bg-bg-surface border border-border-default rounded-[var(--radius-sm)] text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none resize-none leading-relaxed"
            placeholder="Enter input parameters..."
          />
        </div>
      )}
    </div>
  );
}
