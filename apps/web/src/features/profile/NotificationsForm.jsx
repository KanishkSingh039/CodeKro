import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import { COPY } from '../../constants/copy';
import { Bell } from 'lucide-react';

/**
 * NotificationsForm Component
 * Email notifications toggles: contest reminders, daily problem, submission results, product updates.
 */
export default function NotificationsForm({
  initialNotifications = {},
  onSave,
  isSaving = false,
  onDirtyChange,
}) {
  const [notifs, setNotifs] = useState({
    contestReminders: initialNotifications.contestReminders ?? true,
    dailyProblem: initialNotifications.dailyProblem ?? true,
    submissionFeedback: initialNotifications.submissionFeedback ?? true,
    productUpdates: initialNotifications.productUpdates ?? false,
  });

  // Derive dirtiness
  const isDirty = React.useMemo(() => {
    return (
      notifs.contestReminders !== (initialNotifications.contestReminders ?? true) ||
      notifs.dailyProblem !== (initialNotifications.dailyProblem ?? true) ||
      notifs.submissionFeedback !== (initialNotifications.submissionFeedback ?? true) ||
      notifs.productUpdates !== (initialNotifications.productUpdates ?? false)
    );
  }, [notifs, initialNotifications]);

  useEffect(() => {
    if (onDirtyChange) onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(notifs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card padding="md" className="space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-border-default">
          <Bell className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {COPY.settings.notificationsForm.title}
          </h3>
        </div>

        <div className="space-y-4 divide-y divide-border-subtle">
          {/* Contest Reminders */}
          <div className="pt-2 first:pt-0 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="chk-cont-rem" className="text-xs font-semibold text-text-primary block cursor-pointer">
                {COPY.settings.notificationsForm.contestReminders}
              </label>
              <p className="text-[11px] text-text-secondary">
                {COPY.settings.notificationsForm.contestRemindersDesc}
              </p>
            </div>
            <Checkbox
              id="chk-cont-rem"
              checked={notifs.contestReminders}
              onChange={(e) => setNotifs((n) => ({ ...n, contestReminders: e.target.checked }))}
            />
          </div>

          {/* Daily Problem */}
          <div className="pt-3 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="chk-daily-prob" className="text-xs font-semibold text-text-primary block cursor-pointer">
                {COPY.settings.notificationsForm.dailyProblem}
              </label>
              <p className="text-[11px] text-text-secondary">
                {COPY.settings.notificationsForm.dailyProblemDesc}
              </p>
            </div>
            <Checkbox
              id="chk-daily-prob"
              checked={notifs.dailyProblem}
              onChange={(e) => setNotifs((n) => ({ ...n, dailyProblem: e.target.checked }))}
            />
          </div>

          {/* Submission Feedback */}
          <div className="pt-3 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="chk-sub-feed" className="text-xs font-semibold text-text-primary block cursor-pointer">
                {COPY.settings.notificationsForm.submissionFeedback}
              </label>
              <p className="text-[11px] text-text-secondary">
                {COPY.settings.notificationsForm.submissionFeedbackDesc}
              </p>
            </div>
            <Checkbox
              id="chk-sub-feed"
              checked={notifs.submissionFeedback}
              onChange={(e) => setNotifs((n) => ({ ...n, submissionFeedback: e.target.checked }))}
            />
          </div>

          {/* Product Updates */}
          <div className="pt-3 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="chk-prod-upd" className="text-xs font-semibold text-text-primary block cursor-pointer">
                {COPY.settings.notificationsForm.productUpdates}
              </label>
              <p className="text-[11px] text-text-secondary">
                {COPY.settings.notificationsForm.productUpdatesDesc}
              </p>
            </div>
            <Checkbox
              id="chk-prod-upd"
              checked={notifs.productUpdates}
              onChange={(e) => setNotifs((n) => ({ ...n, productUpdates: e.target.checked }))}
            />
          </div>
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
