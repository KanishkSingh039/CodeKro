import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, BookOpen, MessageSquare, History } from 'lucide-react';
import { COPY } from '../../constants/copy';

const STORAGE_SPLIT_H = 'codekro_problem_split_h';
const STORAGE_SPLIT_V = 'codekro_problem_split_v';

/**
 * ProblemLayout Component
 * Implements the resizable 2-pane desktop layout with independent scrolling,
 * keyboard-operable dividers, and responsive single-column mobile switcher.
 */
export default function ProblemLayout({
  // Left pane contents
  leftActiveTab = 'description',
  onLeftTabChange,
  descriptionContent,
  editorialContent,
  solutionsContent,
  submissionsContent,
  submissionsCount = 0,

  // Right pane contents
  editorContent,
  consoleContent,
  runSubmitBar,

  // Console state
  isConsoleOpen = true,

  // Mobile state
  mobileTab = 'description', // 'description' | 'code' | 'results'
  onMobileTabChange,
}) {
  // Horizontal split ratio (left pane width percentage, default 45%)
  const [splitH, setSplitH] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SPLIT_H);
      return saved ? Math.min(75, Math.max(25, Number(saved))) : 45;
    } catch {
      return 45;
    }
  });

  // Vertical split ratio for right pane (editor height percentage, default 65%)
  const [splitV, setSplitV] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SPLIT_V);
      return saved ? Math.min(85, Math.max(20, Number(saved))) : 65;
    } catch {
      return 65;
    }
  });

  const [isDraggingH, setIsDraggingH] = useState(false);
  const [isDraggingV, setIsDraggingV] = useState(false);
  const containerRef = useRef(null);
  const rightPaneRef = useRef(null);

  // Save split state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SPLIT_H, String(splitH));
    } catch {
      // ignore
    }
  }, [splitH]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SPLIT_V, String(splitV));
    } catch {
      // ignore
    }
  }, [splitV]);

  // Mouse drag handlers for horizontal divider
  const handleMouseMoveH = useCallback(
    (e) => {
      if (!isDraggingH || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newPct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitH(Math.min(75, Math.max(25, newPct)));
    },
    [isDraggingH]
  );

  // Mouse drag handlers for vertical divider
  const handleMouseMoveV = useCallback(
    (e) => {
      if (!isDraggingV || !rightPaneRef.current) return;
      const rect = rightPaneRef.current.getBoundingClientRect();
      const newPct = ((e.clientY - rect.top) / rect.height) * 100;
      setSplitV(Math.min(85, Math.max(20, newPct)));
    },
    [isDraggingV]
  );

  const handleMouseUp = useCallback(() => {
    setIsDraggingH(false);
    setIsDraggingV(false);
  }, []);

  useEffect(() => {
    if (isDraggingH || isDraggingV) {
      window.addEventListener('mousemove', isDraggingH ? handleMouseMoveH : handleMouseMoveV);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isDraggingH ? 'col-resize' : 'row-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveH);
      window.removeEventListener('mousemove', handleMouseMoveV);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingH, isDraggingV, handleMouseMoveH, handleMouseMoveV, handleMouseUp]);

  // Left tabs definition
  const leftTabs = [
    { id: 'description', label: COPY.problem.tabs.description, icon: FileText },
    { id: 'editorial', label: COPY.problem.tabs.editorial, icon: BookOpen },
    { id: 'solutions', label: COPY.problem.tabs.solutions, icon: MessageSquare },
    {
      id: 'submissions',
      label: COPY.problem.tabs.submissions,
      icon: History,
      count: submissionsCount,
    },
  ];

  return (
    <div className="flex-1 w-full h-[calc(100vh-48px)] overflow-hidden flex flex-col font-sans">
      {/* ======================================================== */}
      {/* MOBILE / TABLET VIEW (Below 1024px)                     */}
      {/* ======================================================== */}
      <div className="lg:hidden flex flex-col h-full overflow-hidden">
        {/* Segmented Switcher Top Bar */}
        <div className="h-10 px-3 bg-bg-surface border-b border-border-default flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-1 p-0.5 bg-bg-surface-subtle border border-border-default rounded-[var(--radius-sm)] w-full max-w-sm">
            <button
              type="button"
              onClick={() => onMobileTabChange('description')}
              className={`flex-1 py-1 text-xs font-medium rounded transition-colors text-center cursor-pointer ${
                mobileTab === 'description'
                  ? 'bg-bg-surface text-accent font-semibold shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => onMobileTabChange('code')}
              className={`flex-1 py-1 text-xs font-medium rounded transition-colors text-center cursor-pointer ${
                mobileTab === 'code'
                  ? 'bg-bg-surface text-accent font-semibold shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Code
            </button>
            <button
              type="button"
              onClick={() => onMobileTabChange('results')}
              className={`flex-1 py-1 text-xs font-medium rounded transition-colors text-center cursor-pointer ${
                mobileTab === 'results'
                  ? 'bg-bg-surface text-accent font-semibold shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Results
            </button>
          </div>
        </div>

        {/* Mobile Tab Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {mobileTab === 'description' && descriptionContent}
          {mobileTab === 'code' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-[350px]">{editorContent}</div>
            </div>
          )}
          {mobileTab === 'results' && (
            <div className="h-full overflow-y-auto">{consoleContent}</div>
          )}
        </div>

        {/* Mobile Sticky Bottom Bar */}
        <div className="shrink-0">{runSubmitBar}</div>
      </div>

      {/* ======================================================== */}
      {/* DESKTOP VIEW (1024px and up): 2-Column Split Panes       */}
      {/* ======================================================== */}
      <div
        ref={containerRef}
        className="hidden lg:flex flex-1 w-full h-full overflow-hidden select-text"
      >
        {/* LEFT PANE (Problem Tabs & Statement) */}
        <section
          style={{ width: `${splitH}%` }}
          aria-label="Problem details"
          className="h-full flex flex-col border-r border-border-default bg-bg-base overflow-hidden"
        >
          {/* Left Pane Tab Bar (36px) */}
          <div className="h-9 px-2 bg-bg-surface border-b border-border-default flex items-center gap-1 select-none shrink-0" role="tablist">
            {leftTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = leftActiveTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => onLeftTabChange(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-bg-surface-subtle text-accent border border-accent/20'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="text-[10px] font-mono px-1 rounded bg-bg-surface border border-border-subtle text-text-muted">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Left Pane Active Content (Scrolls independently) */}
          <div className="flex-1 min-h-0 overflow-y-auto" role="tabpanel">
            {leftActiveTab === 'description' && descriptionContent}
            {leftActiveTab === 'editorial' && editorialContent}
            {leftActiveTab === 'solutions' && solutionsContent}
            {leftActiveTab === 'submissions' && submissionsContent}
          </div>
        </section>

        {/* DRAGGABLE HORIZONTAL DIVIDER (Left / Right Split) */}
        <div
          role="separator"
          tabIndex={0}
          aria-label="Resize left and right panels"
          aria-valuenow={Math.round(splitH)}
          onMouseDown={() => setIsDraggingH(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setSplitH((prev) => Math.max(25, prev - 2));
            if (e.key === 'ArrowRight') setSplitH((prev) => Math.min(75, prev + 2));
          }}
          className={`w-1.5 h-full bg-border-default hover:bg-accent/60 cursor-col-resize transition-colors shrink-0 outline-none focus-visible:bg-accent ${
            isDraggingH ? 'bg-accent' : ''
          }`}
          title="Drag to resize panels (Arrow keys operable)"
        />

        {/* RIGHT PANE (Code Editor & Test Console) */}
        <section
          ref={rightPaneRef}
          style={{ width: `${100 - splitH}%` }}
          aria-label="Code editor and testing console"
          className="h-full flex flex-col bg-bg-base overflow-hidden"
        >
          {/* Top Half: Code Editor */}
          <div
            style={{
              height: isConsoleOpen ? `${splitV}%` : '100%',
            }}
            className="w-full min-h-0 flex flex-col overflow-hidden"
          >
            {editorContent}
          </div>

          {/* DRAGGABLE VERTICAL DIVIDER (Editor / Console Split) */}
          {isConsoleOpen && (
            <div
              role="separator"
              tabIndex={0}
              aria-label="Resize editor and console panels"
              aria-valuenow={Math.round(splitV)}
              onMouseDown={() => setIsDraggingV(true)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp') setSplitV((prev) => Math.max(20, prev - 3));
                if (e.key === 'ArrowDown') setSplitV((prev) => Math.min(85, prev + 3));
              }}
              className={`h-1.5 w-full bg-border-default hover:bg-accent/60 cursor-row-resize transition-colors shrink-0 outline-none focus-visible:bg-accent ${
                isDraggingV ? 'bg-accent' : ''
              }`}
              title="Drag to resize editor/console"
            />
          )}

          {/* Bottom Half: Testcase / Console Panel */}
          {isConsoleOpen && (
            <div
              style={{ height: `${100 - splitV}%` }}
              className="w-full min-h-0 flex flex-col bg-bg-surface overflow-hidden"
            >
              {consoleContent}
            </div>
          )}

          {/* Sticky Action Bar */}
          <div className="shrink-0">{runSubmitBar}</div>
        </section>
      </div>
    </div>
  );
}
