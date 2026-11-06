import React from 'react';
import { Code2, Database } from 'lucide-react';
import Card from '../../components/ui/Card';

/**
 * Empty workspace preview. Runtime problem and editor data is loaded only after sign-in.
 */
export function ProductPreview() {
  return (
    <Card
      padding="none"
      className="overflow-hidden border border-border shadow-md bg-surface select-none"
      aria-label="CodeKro workspace preview"
    >
      <div className="h-8 px-3 bg-surface-raised border-b border-border flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
          <span className="ml-2 font-mono text-[11px] text-muted">workspace</span>
        </div>
        <span className="text-[11px] font-mono">Backend data</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[340px]">
        <div className="md:col-span-5 p-4 border-b md:border-b-0 md:border-r border-border bg-surface flex flex-col justify-center">
          <div className="max-w-xs mx-auto text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded border border-border bg-base flex items-center justify-center text-muted">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-text text-sm">Problem workspace</h3>
            <p className="text-muted text-xs leading-relaxed">
              Sign in to load problems assigned to your account from the backend.
            </p>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col bg-base">
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="text-center space-y-3 text-muted">
              <Code2 className="w-6 h-6 mx-auto" />
              <p className="text-xs font-mono">Select a problem to load starter code.</p>
            </div>
          </div>

          <div className="p-3 bg-surface border-t border-border flex items-center justify-between gap-4">
            <span className="text-xs font-medium text-muted">No execution yet</span>
            <span className="text-[10px] text-muted">Results appear after a run</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProductPreview;
