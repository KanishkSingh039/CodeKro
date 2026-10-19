import React from 'react';
import Card from '../../components/ui/Card';
import DifficultyLabel from '../../components/ui/DifficultyLabel';
import { CheckCircle2, Bot } from 'lucide-react';
import { COPY } from '../../constants/copy';

/**
 * ProductPreview Component
 * Static desktop product preview showing problem statement on the left
 * and code editor snippet with an 'Accepted' evaluation on the right.
 */
export function ProductPreview() {
  const p = COPY.landing.productPreview;

  const sampleCode = `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (seen.count(complement)) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`;

  const codeLines = sampleCode.split('\n');

  return (
    <Card
      padding="none"
      className="overflow-hidden border border-border shadow-md bg-surface select-none"
      aria-label="CodeKro workspace preview"
    >
      {/* Top Workspace Chrome Bar */}
      <div className="h-8 px-3 bg-surface-raised border-b border-border flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
          <span className="ml-2 font-mono text-[11px] text-muted">workspace/two-sum.cpp</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-muted">C++ (GCC 13)</span>
        </div>
      </div>

      {/* Two-Column Split Inside Preview */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[340px]">
        {/* Left Column: Problem Statement (5 cols) */}
        <div className="md:col-span-5 p-4 border-b md:border-b-0 md:border-r border-border space-y-3 bg-surface text-xs">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-text text-sm truncate">
              1. {p.sampleProblemTitle}
            </h3>
            <DifficultyLabel difficulty="Easy" size="sm" />
          </div>

          <p className="text-muted text-xs leading-relaxed">
            {p.sampleDescription}
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
              Example 1
            </span>
            <div className="p-2.5 rounded bg-base border border-border font-mono text-[11px] space-y-1 text-muted">
              <div><strong className="text-muted">Input:</strong> {p.sampleInput}</div>
              <div><strong className="text-muted">Output:</strong> {p.sampleOutput}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Accepted Console (7 cols) */}
        <div className="md:col-span-7 flex flex-col bg-base">
          {/* Static Syntax Highlighted Snippet */}
          <div className="p-3.5 font-mono text-[11px] leading-relaxed overflow-x-auto flex-1 text-muted">
            {codeLines.map((line, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="w-5 text-right select-none text-muted/50">{idx + 1}</span>
                <span className="whitespace-pre text-text">
                  {line.startsWith('class') || line.startsWith('public:') ? (
                    <span className="text-muted">{line}</span>
                  ) : line.includes('vector<int>') || line.includes('unordered_map') ? (
                    <span className="text-text font-medium">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Test Result Bar */}
          <div className="p-3 bg-surface border-t border-border space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold text-accent">{p.statusAccepted}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted bg-surface-raised px-2 py-0.5 rounded border border-border">
                <Bot className="w-3 h-3 text-muted" aria-hidden="true" />
                <span>{p.verdictCaption}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono text-muted">
              <span>Runtime: <strong className="text-text">{p.runtime}</strong></span>
              <span>Memory: <strong className="text-text">{p.memory}</strong></span>
              <span className="hidden sm:inline-block">Passed: <strong className="text-text">3 / 3</strong></span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProductPreview;
