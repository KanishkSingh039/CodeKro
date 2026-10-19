import { useMemo } from 'react';
import DifficultyLabel from '../../components/ui/DifficultyLabel';
import { COPY } from '../../constants/copy';

export function ProgressPreview() {
  const pCopy = COPY.landing.progress;

  // Generate 36 weeks x 7 days of sample contribution data for the preview
  const heatmapWeeks = useMemo(() => {
    const weeks = [];
    const seed = 37;
    let dayIndex = 0;

    for (let w = 0; w < 32; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        dayIndex++;
        const pseudo = Math.sin(dayIndex * 12.9898 + seed) * 43758.5453;
        const rand = pseudo - Math.floor(pseudo);
        let level = 0;
        if (rand > 0.45) {
          if (rand > 0.82) level = 4;
          else if (rand > 0.68) level = 3;
          else if (rand > 0.55) level = 2;
          else level = 1;
        }
        days.push({ id: `${w}-${d}`, level });
      }
      weeks.push(days);
    }
    return weeks;
  }, []);

  const cellColor = (level) => {
    switch (level) {
      case 4:
        return 'bg-text opacity-90';
      case 3:
        return 'bg-text opacity-60';
      case 2:
        return 'bg-text opacity-35';
      case 1:
        return 'bg-text opacity-20';
      default:
        return 'bg-surface-raised border border-border/40';
    }
  };

  const difficulties = [
    { name: 'Easy', solved: 142, total: 820, percent: 17 },
    { name: 'Medium', solved: 118, total: 1650, percent: 7 },
    { name: 'Hard', solved: 24, total: 650, percent: 4 },
  ];

  return (
    <section id="progress" className="py-20 border-b border-border bg-surface" aria-labelledby="progress-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-mono uppercase tracking-wider text-muted mb-2">Analytics</p>
          <h2 id="progress-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
            {pCopy.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted">
            {pCopy.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
          {/* Difficulty breakdown card (5 cols) */}
          <div className="lg:col-span-5 rounded-lg border border-border bg-base p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-xs font-mono uppercase text-muted font-medium">Difficulty Breakdown</span>
                <span className="text-xs font-mono text-muted">284 Solved</span>
              </div>

              {/* Circular gauge summary */}
              <div className="py-6 flex items-center justify-center gap-6">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100" aria-hidden="true">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-surface-raised"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-text transition-all"
                      strokeWidth="8"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * 284) / 3120}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-mono text-xl font-bold text-text">284</span>
                    <span className="text-[10px] font-mono text-muted">/ 3,120</span>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <div className="text-muted">
                    Acceptance rate:{' '}
                    <strong className="font-mono text-text">68.4%</strong>
                  </div>
                  <div className="text-muted">
                    Active streak:{' '}
                    <strong className="font-mono text-text">18 days</strong>
                  </div>
                  <div className="text-muted">
                    Total submissions:{' '}
                    <strong className="font-mono text-text">412</strong>
                  </div>
                </div>
              </div>

              {/* Difficulty rows */}
              <div className="space-y-3 pt-2">
                {difficulties.map((d) => (
                  <div key={d.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <DifficultyLabel difficulty={d.name} size="sm" />
                      <span className="font-mono text-xs text-muted">
                        <strong className="text-text">{d.solved}</strong> / {d.total}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-raised rounded-full overflow-hidden">
                      <div
                        className="h-full bg-muted transition-all duration-300"
                        style={{ width: `${Math.min(100, (d.solved / d.total) * 100 * 3)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-muted mt-6 pt-4 border-t border-border">
              Detailed breakdown updates automatically after every verified submission.
            </p>
          </div>

          {/* Activity Heatmap Card (7 cols) */}
          <div className="lg:col-span-7 rounded-lg border border-border bg-base p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-xs font-mono uppercase text-muted font-medium">Activity Heatmap</span>
                <span className="text-xs font-mono text-muted">Recent Weeks</span>
              </div>

              <div className="py-4">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-muted">142 active days in the last year</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted font-mono">
                    <span>Less</span>
                    <span className="w-2.5 h-2.5 rounded-sm bg-surface-raised border border-border/40" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-text opacity-20" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-text opacity-60" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-text opacity-90" />
                    <span>More</span>
                  </div>
                </div>

                {/* Heatmap Grid */}
                <div className="overflow-x-auto pb-2">
                  <div className="inline-flex gap-1">
                    {heatmapWeeks.map((week, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-1">
                        {week.map((day) => (
                          <div
                            key={day.id}
                            className={`w-3 h-3 rounded-sm ${cellColor(day.level)}`}
                            title={`Activity level ${day.level}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border text-center">
                <div className="p-2.5 rounded border border-border bg-surface">
                  <div className="text-lg font-mono font-bold text-text">18</div>
                  <div className="text-[11px] font-mono text-muted uppercase">Current streak</div>
                </div>
                <div className="p-2.5 rounded border border-border bg-surface">
                  <div className="text-lg font-mono font-bold text-text">45</div>
                  <div className="text-[11px] font-mono text-muted uppercase">Max streak</div>
                </div>
                <div className="p-2.5 rounded border border-border bg-surface">
                  <div className="text-lg font-mono font-bold text-text">284</div>
                  <div className="text-[11px] font-mono text-muted uppercase">Total solved</div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted mt-6 pt-4 border-t border-border">
              Submissions across all supported languages count toward your daily practice streak.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
