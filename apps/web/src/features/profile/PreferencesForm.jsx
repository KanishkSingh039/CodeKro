import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { COPY } from '../../constants/copy';

/**
 * PreferencesForm Component
 * Code editor and system display settings: language, font size, tab width, Vim keybindings, theme, timezone.
 */
export default function PreferencesForm({
  initialPreferences = {},
  onSave,
  isSaving = false,
  onDirtyChange,
}) {
  const [prefs, setPrefs] = useState({
    defaultLanguage: initialPreferences.defaultLanguage || 'cpp',
    editorFontSize: initialPreferences.editorFontSize || 14,
    tabSize: initialPreferences.tabSize || 4,
    keybindings: initialPreferences.keybindings || 'default',
    theme: initialPreferences.theme || 'dark',
    timezone: initialPreferences.timezone || 'Asia/Kolkata',
  });

  // Derive dirtiness
  const isDirty = React.useMemo(() => {
    return (
      prefs.defaultLanguage !== (initialPreferences.defaultLanguage || 'cpp') ||
      prefs.editorFontSize !== (initialPreferences.editorFontSize || 14) ||
      prefs.tabSize !== (initialPreferences.tabSize || 4) ||
      prefs.keybindings !== (initialPreferences.keybindings || 'default') ||
      prefs.theme !== (initialPreferences.theme || 'dark') ||
      prefs.timezone !== (initialPreferences.timezone || 'Asia/Kolkata')
    );
  }, [prefs, initialPreferences]);

  useEffect(() => {
    if (onDirtyChange) onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(prefs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card padding="md" className="space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Editor & Environment Preferences
        </h3>

        {/* Default Language */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary block">
            {COPY.settings.preferencesForm.defaultLanguageLabel}
          </label>
          <select
            value={prefs.defaultLanguage}
            onChange={(e) => setPrefs((p) => ({ ...p, defaultLanguage: e.target.value }))}
            className="w-full sm:w-72 p-2 text-xs bg-bg-input border border-border-default text-text-primary rounded-[var(--radius-sm)] focus:border-accent focus:outline-none"
          >
            <option value="cpp">C++ (GCC 13)</option>
            <option value="python3">Python3 (v3.11)</option>
            <option value="java">Java (OpenJDK 21)</option>
            <option value="javascript">JavaScript (Node.js 20)</option>
            <option value="go">Go (v1.22)</option>
          </select>
        </div>

        {/* Editor Font Size & Tab Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary block">
              {COPY.settings.preferencesForm.fontSizeLabel}
            </label>
            <select
              value={prefs.editorFontSize}
              onChange={(e) => setPrefs((p) => ({ ...p, editorFontSize: Number(e.target.value) }))}
              className="w-full p-2 text-xs bg-bg-input border border-border-default text-text-primary rounded-[var(--radius-sm)] focus:border-accent focus:outline-none"
            >
              {[12, 13, 14, 15, 16, 18].map((size) => (
                <option key={size} value={size}>
                  {size} px
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary block">
              {COPY.settings.preferencesForm.tabSizeLabel}
            </label>
            <select
              value={prefs.tabSize}
              onChange={(e) => setPrefs((p) => ({ ...p, tabSize: Number(e.target.value) }))}
              className="w-full p-2 text-xs bg-bg-input border border-border-default text-text-primary rounded-[var(--radius-sm)] focus:border-accent focus:outline-none"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>
        </div>

        {/* Keybindings & Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary block">
              {COPY.settings.preferencesForm.keybindingsLabel}
            </label>
            <select
              value={prefs.keybindings}
              onChange={(e) => setPrefs((p) => ({ ...p, keybindings: e.target.value }))}
              className="w-full p-2 text-xs bg-bg-input border border-border-default text-text-primary rounded-[var(--radius-sm)] focus:border-accent focus:outline-none"
            >
              <option value="default">Standard (VS Code default)</option>
              <option value="vim">Vim Mode</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary block">
              {COPY.settings.preferencesForm.themeLabel}
            </label>
            <select
              value={prefs.theme}
              onChange={(e) => setPrefs((p) => ({ ...p, theme: e.target.value }))}
              className="w-full p-2 text-xs bg-bg-input border border-border-default text-text-primary rounded-[var(--radius-sm)] focus:border-accent focus:outline-none"
            >
              <option value="dark">Dark Theme (MongoDB Slate)</option>
              <option value="light">Light Theme</option>
              <option value="system">System Preference</option>
            </select>
          </div>
        </div>

        {/* Timezone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary block">
            {COPY.settings.preferencesForm.timezoneLabel}
          </label>
          <select
            value={prefs.timezone}
            onChange={(e) => setPrefs((p) => ({ ...p, timezone: e.target.value }))}
            className="w-full sm:w-72 p-2 text-xs bg-bg-input border border-border-default text-text-primary rounded-[var(--radius-sm)] focus:border-accent focus:outline-none"
          >
            <option value="Asia/Kolkata">(GMT+05:30) Asia/Kolkata (IST)</option>
            <option value="America/New_York">(GMT-05:00) America/New_York (EST)</option>
            <option value="America/Los_Angeles">(GMT-08:00) America/Los_Angeles (PST)</option>
            <option value="Europe/London">(GMT+00:00) Europe/London (GMT/BST)</option>
            <option value="Europe/Berlin">(GMT+01:00) Europe/Berlin (CET)</option>
            <option value="Asia/Tokyo">(GMT+09:00) Asia/Tokyo (JST)</option>
          </select>
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
