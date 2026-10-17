import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import SubmissionDetailModal from './SubmissionDetailModal';

/**
 * SubmissionTable Component
 * Shows past submission history for the problem with click-to-view code modal.
 */
export default function SubmissionTable({ submissions = [] }) {
  const [selectedSub, setSelectedSub] = useState(null);

  if (!submissions || submissions.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-text-muted space-y-1">
        <p className="text-text-primary font-medium">No submissions yet</p>
        <p>Run or submit your solution to start tracking your performance history.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 select-text overflow-y-auto">
      <div className="w-full border border-border-default rounded-[var(--radius-sm)] overflow-hidden bg-bg-surface">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border-default bg-bg-surface-subtle text-text-muted text-[11px] font-medium uppercase tracking-wider">
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Language</th>
              <th className="py-2.5 px-3">Runtime</th>
              <th className="py-2.5 px-3">Memory</th>
              <th className="py-2.5 px-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {submissions.map((sub) => (
              <tr
                key={sub.id}
                onClick={() => setSelectedSub(sub)}
                className="hover:bg-bg-surface-hover transition-colors cursor-pointer group"
              >
                <td className="py-2.5 px-3">
                  <StatusBadge status={sub.status} size="sm" />
                </td>
                <td className="py-2.5 px-3 font-mono text-text-secondary">
                  {sub.language}
                </td>
                <td className="py-2.5 px-3 font-mono text-text-primary">
                  {sub.runtime}
                </td>
                <td className="py-2.5 px-3 font-mono text-text-muted">
                  {sub.memory}
                </td>
                <td className="py-2.5 px-3 text-text-muted group-hover:text-text-primary transition-colors">
                  {sub.relativeTime || sub.submittedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSub && (
        <SubmissionDetailModal
          submission={selectedSub}
          onClose={() => setSelectedSub(null)}
        />
      )}
    </div>
  );
}
