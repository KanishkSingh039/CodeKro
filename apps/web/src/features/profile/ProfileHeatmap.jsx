import React, { useState, useMemo } from 'react';
import { Flame, Trophy, CalendarDays, ChevronDown } from 'lucide-react';
import Card from '../../components/ui/Card';
import { COPY } from '../../constants/copy';

/**
 * ProfileHeatmap Component
 * 12-month calendar activity heatmap with green shades, year selector,
 * active days count, current streak, and max streak.
 */
export default function ProfileHeatmap({
  activity,
  isLoading = false,
  selectedYear = '2026',
  onYearChange,
}) {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate 52 weeks (364 days) of contribution cells
  const yearWeeks = useMemo(() => {
    const weeks = [];
    const seed = selectedYear === '2026' ? 42 : selectedYear === '2025' ? 19 : 7;
    let dayCounter = 0;

    for (let w = 0; w < 52; w++) {
      const weekDays = [];
      for (let d = 0; d < 7; d++) {
        dayCounter++;
        // Pseudorandom yet stable distribution based on week and day
        const pseudo = Math.sin(dayCounter * 12.9898 + seed) * 43758.5453;
        const rand = pseudo - Math.floor(pseudo);
        let level = 0;
        let count = 0;

        if (rand > 0.45) {
          if (rand > 0.88) {
            level = 4;
            count = Math.floor(rand * 6) + 4;
          } else if (rand > 0.72) {
            level = 3;
            count = Math.floor(rand * 3) + 3;
          } else if (rand > 0.58) {
            level = 2;
            count = 2;
          } else {
            level = 1;
            count = 1;
          }
        }

        // Approximate date
        const monthNum = Math.floor((w / 52) * 12) + 1;
        const dayNum = ((w * 7 + d) % 28) + 1;
        const dateStr = `${selectedYear}-${String(monthNum).padStart(2, '0')}-${String(
          dayNum
        ).padStart(2, '0')}`;

        weekDays.push({
          date: dateStr,
          count,
          level,
        });
      }
      weeks.push(weekDays);
    }
    return weeks;
  }, [selectedYear]);

  // Aggregate stats
  const totalSubmissionsInYear = useMemo(() => {
    return yearWeeks.reduce((acc, week) => {
      return acc + week.reduce((wAcc, day) => wAcc + day.count, 0);
    }, 0);
  }, [yearWeeks]);

  const activeDaysInYear = useMemo(() => {
    return yearWeeks.reduce((acc, week) => {
      return acc + week.filter((day) => day.count > 0).length;
    }, 0);
  }, [yearWeeks]);

  if (isLoading) {
    return (
      <Card padding="md" className="space-y-4">
        <div className="h-4 w-44 bg-border-default rounded animate-pulse" />
        <div className="h-28 bg-border-default rounded animate-pulse" />
      </Card>
    );
  }

  const { currentStreak = 14, longestStreak = 48 } = activity || {};

  const getCellColor = (level) => {
    switch (level) {
      case 4:
        return 'bg-accent';
      case 3:
        return 'bg-accent/70';
      case 2:
        return 'bg-accent/40';
      case 1:
        return 'bg-accent/20';
      case 0:
      default:
        return 'bg-bg-surface-subtle border border-border-subtle/70';
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = ['2026', '2025', '2024'];

  return (
    <Card padding="md" className="space-y-4">
      {/* Heatmap Top Bar with Streaks and Year Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-default">
        <div className="flex items-center gap-4 text-xs">
          <span className="text-text-secondary">
            Submissions in {selectedYear}:{' '}
            <strong className="font-mono text-text-primary">{totalSubmissionsInYear}</strong>
          </span>
          <span className="text-text-muted hidden sm:inline-block">•</span>
          <span className="text-text-secondary hidden sm:inline-block">
            {COPY.profile.meta.activeDays}:{' '}
            <strong className="font-mono text-text-primary">{activeDaysInYear}</strong>
          </span>
          <span className="text-text-muted hidden md:inline-block">•</span>
          <span className="flex items-center gap-1 text-text-secondary hidden md:flex">
            <Flame className="w-3.5 h-3.5 text-accent" />
            <span>Streak:</span>
            <strong className="font-mono text-text-primary">{currentStreak}d</strong>
          </span>
          <span className="flex items-center gap-1 text-text-muted hidden md:flex">
            <Trophy className="w-3 h-3 text-text-muted" />
            <span className="font-mono">{longestStreak}d max</span>
          </span>
        </div>

        {/* Year Dropdown */}
        <div className="relative inline-block text-xs">
          <select
            value={selectedYear}
            onChange={(e) => onYearChange && onYearChange(e.target.value)}
            className="appearance-none bg-bg-surface-subtle border border-border-default text-text-primary px-2.5 py-1 pr-6 rounded-[var(--radius-sm)] focus:border-accent focus:outline-none cursor-pointer"
            aria-label="Select activity calendar year"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-text-muted absolute right-2 top-2 pointer-events-none" />
        </div>
      </div>

      {/* 52-Week Contribution Grid (Horizontally scrollable on mobile) */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[720px] select-none">
          {/* Month Labels */}
          <div className="flex justify-between text-[10px] text-text-muted mb-1.5 px-1 font-mono">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          {/* Grid of Weeks x Days */}
          <div className="flex gap-[3px]">
            {yearWeeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    tabIndex={0}
                    role="button"
                    aria-label={`${day.count} submissions on ${day.date}`}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onFocus={() => setHoveredDay(day)}
                    onBlur={() => setHoveredDay(null)}
                    className={`w-[11px] h-[11px] rounded-[2px] transition-transform hover:scale-125 focus:scale-125 focus:outline-none focus:ring-1 focus:ring-accent ${getCellColor(
                      day.level
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Hover tooltip + Color Legend */}
      <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border-subtle">
        <div className="truncate min-w-0 pr-2">
          {hoveredDay ? (
            <span className="text-text-secondary">
              <strong className="font-mono text-text-primary">{hoveredDay.count}</strong> submissions on{' '}
              <span className="font-mono">{hoveredDay.date}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-text-muted">
              <CalendarDays className="w-3 h-3" />
              <span>Hover or focus cells for daily activity</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[10px] shrink-0 font-mono">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-[2px] bg-bg-surface-subtle border border-border-subtle" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-accent/20" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-accent/40" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-accent/70" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-accent" />
          <span>More</span>
        </div>
      </div>
    </Card>
  );
}
