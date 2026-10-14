import React, { useState } from 'react';
import { Flame, Trophy } from 'lucide-react';
import Card from '../../components/ui/Card';

/**
 * StreakActivityCard Component
 * Current streak, longest streak, and 12-week contribution heatmap in green shades.
 */
export default function StreakActivityCard({ activity, isLoading = false }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  if (isLoading || !activity) {
    return (
      <Card padding="sm" className="space-y-3">
        <div className="h-4 w-32 bg-border-default rounded animate-pulse" />
        <div className="h-20 bg-border-default rounded animate-pulse" />
      </Card>
    );
  }

  const { currentStreak = 0, longestStreak = 0, heatmap = [] } = activity;

  // Group 84 days into 12 columns of 7 days (weeks)
  const weeks = [];
  for (let w = 0; w < 12; w++) {
    weeks.push(heatmap.slice(w * 7, w * 7 + 7));
  }

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
        return 'bg-bg-surface-subtle border border-border-subtle/60';
    }
  };

  return (
    <Card padding="sm" className="space-y-3">
      {/* Header with Streaks */}
      <div className="flex items-center justify-between pb-2 border-b border-border-default">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <Flame className="w-3.5 h-3.5 text-accent" />
          <span>Activity & Streak</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-text-secondary">
            Streak: <strong className="font-mono text-text-primary">{currentStreak}d</strong>
          </span>
          <span className="flex items-center gap-1 text-text-muted">
            <Trophy className="w-3 h-3 text-text-muted" />
            <span className="font-mono">{longestStreak}d max</span>
          </span>
        </div>
      </div>

      {/* 12-Week Contribution Heatmap */}
      <div>
        <div className="flex justify-between items-center text-[10px] text-text-muted mb-1.5 px-0.5">
          <span>12 weeks ago</span>
          <span>Today</span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-2.5 h-2.5 rounded-[2px] cursor-pointer transition-transform hover:scale-125 ${getCellColor(
                    day.level
                  )}`}
                  title={`${day.count} submissions on ${day.date}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Heatmap Legend and Hover Detail */}
        <div className="flex items-center justify-between text-[10px] text-text-muted pt-2 border-t border-border-subtle mt-2">
          <div className="truncate max-w-[180px]">
            {hoveredDay ? (
              <span className="text-text-secondary">
                <strong className="font-mono text-text-primary">{hoveredDay.count}</strong> solves on{' '}
                {hoveredDay.date}
              </span>
            ) : (
              <span>Hover for daily activity</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span>Less</span>
            <span className="w-2 h-2 rounded-[2px] bg-bg-surface-subtle border border-border-subtle" />
            <span className="w-2 h-2 rounded-[2px] bg-accent/20" />
            <span className="w-2 h-2 rounded-[2px] bg-accent/40" />
            <span className="w-2 h-2 rounded-[2px] bg-accent/70" />
            <span className="w-2 h-2 rounded-[2px] bg-accent" />
            <span>More</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
