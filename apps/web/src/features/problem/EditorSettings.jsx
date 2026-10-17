import React, { useRef, useEffect } from 'react';
import { X, Sliders } from 'lucide-react';
import { COPY } from '../../constants/copy';

/**
 * EditorSettings Component
 * Popover configuration modal for font size, tab size, and keybindings.
 */
export default function EditorSettings({ settings, onUpdate, onClose }) {
  const modalRef = useRef(null);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        ref={modalRef}
        className="w-full max-w-sm bg-bg-surface border border-border-default rounded-[var(--radius-md)] shadow-xl p-4 space-y-4"
      >
        <div className="flex items-center justify-between pb-2 border-b border-border-default">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
            <Sliders className="w-3.5 h-3.5 text-accent" />
            <span>{COPY.problem.actions.settings}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          {/* Font Size */}
          <div className="flex items-center justify-between">
            <span className="text-text-secondary font-medium">Font Size</span>
            <select
              value={settings.fontSize}
              onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
              className="h-7 px-2 bg-bg-input border border-border-default rounded font-mono text-xs text-text-primary focus:border-accent focus:outline-none cursor-pointer"
            >
              {[12, 13, 14, 15, 16, 18].map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </div>

          {/* Tab Size */}
          <div className="flex items-center justify-between">
            <span className="text-text-secondary font-medium">Tab Size</span>
            <select
              value={settings.tabSize}
              onChange={(e) => onUpdate({ tabSize: Number(e.target.value) })}
              className="h-7 px-2 bg-bg-input border border-border-default rounded font-mono text-xs text-text-primary focus:border-accent focus:outline-none cursor-pointer"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>

          {/* Keybinding */}
          <div className="flex items-center justify-between">
            <span className="text-text-secondary font-medium">Keybinding</span>
            <select
              value={settings.keybinding}
              onChange={(e) => onUpdate({ keybinding: e.target.value })}
              className="h-7 px-2 bg-bg-input border border-border-default rounded text-xs text-text-primary focus:border-accent focus:outline-none cursor-pointer"
            >
              <option value="standard">Standard</option>
              <option value="vim">Vim</option>
            </select>
          </div>

          {/* Accessibility Esc-then-Tab Notice */}
          <div className="p-2.5 rounded bg-bg-surface-subtle border border-border-subtle text-[11px] text-text-muted leading-relaxed">
            <strong className="text-text-secondary font-medium block mb-0.5">Accessibility Note:</strong>
            To navigate past the code editor using keyboard, press <kbd className="px-1 py-0.5 rounded bg-bg-surface border border-border-default font-mono text-[10px]">Esc</kbd> and then <kbd className="px-1 py-0.5 rounded bg-bg-surface border border-border-default font-mono text-[10px]">Tab</kbd>.
          </div>
        </div>
      </div>
    </div>
  );
}
