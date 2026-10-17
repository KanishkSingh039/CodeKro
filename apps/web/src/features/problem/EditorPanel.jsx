import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { RotateCcw, Settings, Maximize2, Minimize2, AlertCircle } from 'lucide-react';
import LanguageSelect, { LANGUAGES } from './LanguageSelect';
import EditorSettings from './EditorSettings';
import Button from '../../components/ui/Button';
import { COPY } from '../../constants/copy';

/**
 * EditorPanel Component
 * Monaco code editor integration with multi-language starter templates,
 * local storage auto-save per problem & language, reset confirmation, and editor preferences.
 */
export default function EditorPanel({
  _problemId,
  code,
  language = 'cpp',
  onCodeChange,
  onLanguageChange,
  onResetCode,
  theme = 'dark',
  fullscreen = false,
  onToggleFullscreen,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('codekro_editor_settings');
      return stored
        ? JSON.parse(stored)
        : { fontSize: 13, tabSize: 4, keybinding: 'standard' };
    } catch {
      return { fontSize: 13, tabSize: 4, keybinding: 'standard' };
    }
  });

  const editorRef = useRef(null);

  const handleUpdateSettings = (partial) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem('codekro_editor_settings', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const currentLangObj = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];
  const monacoLang = currentLangObj.monacoLang || 'cpp';

  // Handle Monaco editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define custom dark theme tokens matching MongoDB / CodeKro palette
    monaco.editor.defineTheme('codekro-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '5C6B76', fontStyle: 'italic' },
        { token: 'keyword', foreground: '00ED64', fontStyle: 'bold' },
        { token: 'string', foreground: 'E6EDF1' },
        { token: 'number', foreground: 'FFA116' },
      ],
      colors: {
        'editor.background': '#0B1217',
        'editor.foreground': '#E6EDF1',
        'editorLineNumber.foreground': '#5C6B76',
        'editorLineNumber.activeForeground': '#E6EDF1',
        'editorCursor.foreground': '#00ED64',
        'editor.selectionBackground': '#1A2833',
        'editor.lineHighlightBackground': '#111A21',
      },
    });

    monaco.editor.setTheme(theme === 'dark' ? 'codekro-dark' : 'vs');
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: settings.fontSize,
        tabSize: settings.tabSize,
      });
    }
  }, [settings]);

  return (
    <div className={`flex flex-col h-full bg-bg-base border-b border-border-default overflow-hidden ${
      fullscreen ? 'fixed inset-0 z-50 bg-bg-base' : ''
    }`}>
      {/* Editor Toolbar (36px) */}
      <div className="h-9 px-3 bg-bg-surface border-b border-border-default flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <LanguageSelect
            language={language}
            onChange={onLanguageChange}
          />
        </div>

        <div className="flex items-center gap-1">
          {/* Reset Code Button */}
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="p-1.5 text-text-muted hover:text-text-primary rounded hover:bg-bg-surface-hover transition-colors cursor-pointer"
            title={COPY.problem.actions.resetCode}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="p-1.5 text-text-muted hover:text-text-primary rounded hover:bg-bg-surface-hover transition-colors cursor-pointer"
            title={COPY.problem.actions.settings}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-1.5 text-text-muted hover:text-text-primary rounded hover:bg-bg-surface-hover transition-colors cursor-pointer"
            title={fullscreen ? COPY.problem.actions.exitFullscreen : COPY.problem.actions.fullscreen}
          >
            {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          language={monacoLang}
          value={code}
          onChange={(val) => onCodeChange && onCodeChange(val || '')}
          onMount={handleEditorDidMount}
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          options={{
            fontSize: settings.fontSize,
            fontFamily: "'JetBrains Mono', monospace",
            tabSize: settings.tabSize,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            bracketPairColorization: { enabled: true },
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            padding: { top: 8, bottom: 8 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            wordWrap: 'on',
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
          loading={
            <div className="h-full w-full flex items-center justify-center text-xs text-text-muted bg-bg-base font-mono">
              Loading editor environment...
            </div>
          }
        />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <EditorSettings
          settings={settings}
          onUpdate={handleUpdateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-bg-surface border border-border-default rounded-[var(--radius-md)] p-5 space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-text-primary">
                  {COPY.problem.actions.resetCode}?
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {COPY.problem.actions.confirmReset}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  if (onResetCode) onResetCode();
                  setShowResetConfirm(false);
                }}
              >
                Reset Code
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
