import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import { COPY } from '../../constants/copy';
import { ShieldCheck, Info } from 'lucide-react';

/**
 * PrivacyForm Component
 * Controls visibility of profile, activity heatmap, submissions, solved problems, and contests.
 */
export default function PrivacyForm({
  initialPrivacy = {},
  onSave,
  isSaving = false,
  onDirtyChange,
}) {
  const [privacy, setPrivacy] = useState({
    publicProfile: initialPrivacy.publicProfile ?? true,
    showHeatmap: initialPrivacy.showHeatmap ?? true,
    showSubmissions: initialPrivacy.showSubmissions ?? true,
    showSolved: initialPrivacy.showSolved ?? true,
    showContests: initialPrivacy.showContests ?? true,
  });

  // Derive dirtiness
  const isDirty = React.useMemo(() => {
    return (
      privacy.publicProfile !== (initialPrivacy.publicProfile ?? true) ||
      privacy.showHeatmap !== (initialPrivacy.showHeatmap ?? true) ||
      privacy.showSubmissions !== (initialPrivacy.showSubmissions ?? true) ||
      privacy.showSolved !== (initialPrivacy.showSolved ?? true) ||
      privacy.showContests !== (initialPrivacy.showContests ?? true)
    );
  }, [privacy, initialPrivacy]);

  useEffect(() => {
    if (onDirtyChange) onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(privacy);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card padding="md" className="space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-border-default">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {COPY.settings.privacyForm.title}
          </h3>
        </div>

        <div className="space-y-4 divide-y divide-border-subtle">
          {/* Public Profile */}
          <div className="pt-2 first:pt-0 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="chk-public" className="text-xs font-semibold text-text-primary block cursor-pointer">
                {COPY.settings.privacyForm.publicProfile}
              </label>
              <p className="text-[11px] text-text-secondary">
                {COPY.settings.privacyForm.publicProfileDesc}
              </p>
            </div>
            <Checkbox
              id="chk-public"
              checked={privacy.publicProfile}
              onChange={(e) => setPrivacy((p) => ({ ...p, publicProfile: e.target.checked }))}
            />
          </div>

          {/* Show Activity Heatmap */}
          <div className="pt-3 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="chk-heatmap" className="text-xs font-semibold text-text-primary block cursor-pointer">
                {COPY.settings.privacyForm.showHeatmap}
              </label>
              <p className="text-[11px] text-text-secondary">
                {COPY.settings.privacyForm.showHeatmapDesc}
              </p>
            </div>
            <Checkbox
              id="chk-heatmap"
              checked={privacy.showHeatmap}
              onChange={(e) => setPrivacy((p) => ({ ...p, showHeatmap: e.target.checked }))}
            />
          </div>

          {/* Show Submissions */}
          <div className="pt-3 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="chk-subs" className="text-xs font-semibold text-text-primary block cursor-pointer">
                {COPY.settings.privacyForm.showSubmissions}
              </label>
              <p className="text-[11px] text-text-secondary">
                {COPY.settings.privacyForm.showSubmissionsDesc}
              </p>
            </div>
            <Checkbox
              id="chk-subs"
              checked={privacy.showSubmissions}
              onChange={(e) => setPrivacy((p) => ({ ...p, showSubmissions: e.target.checked }))}
            />
          </div>

          {/* Show Solved Problems */}
          <div className="pt-3 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="chk-solved" className="text-xs font-semibold text-text-primary block cursor-pointer">
                {COPY.settings.privacyForm.showSolved}
              </label>
              <p className="text-[11px] text-text-secondary">
                {COPY.settings.privacyForm.showSolvedDesc}
              </p>
            </div>
            <Checkbox
              id="chk-solved"
              checked={privacy.showSolved}
              onChange={(e) => setPrivacy((p) => ({ ...p, showSolved: e.target.checked }))}
            />
          </div>

          {/* Show Contest History */}
          <div className="pt-3 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="chk-contests" className="text-xs font-semibold text-text-primary block cursor-pointer">
                {COPY.settings.privacyForm.showContests}
              </label>
              <p className="text-[11px] text-text-secondary">
                {COPY.settings.privacyForm.showContestsDesc}
              </p>
            </div>
            <Checkbox
              id="chk-contests"
              checked={privacy.showContests}
              onChange={(e) => setPrivacy((p) => ({ ...p, showContests: e.target.checked }))}
            />
          </div>
        </div>

        {/* Notice */}
        <div className="p-3 rounded bg-bg-surface-subtle border border-border-subtle flex items-center gap-2 text-xs text-text-muted">
          <Info className="w-3.5 h-3.5 shrink-0 text-text-muted" />
          <span>Private sections will be displayed as "{COPY.settings.privacyForm.hiddenNotice}" to visitors.</span>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-3 border-t border-border-subtle">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!isDirty || isSaving}
            loading={isSaving}
            className="text-xs font-medium"
          >
            {COPY.settings.profileForm.saveBtn}
          </Button>
        </div>
      </Card>
    </form>
  );
}
