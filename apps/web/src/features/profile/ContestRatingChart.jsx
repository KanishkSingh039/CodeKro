import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * ContestRatingChart Component
 * Neutral line chart for contest rating progression without gradient fill.
 * Followed by contest history table with rank, delta, and date.
 */
export default function ContestRatingChart({ contestsData, isLoading = false }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (isLoading || !contestsData) {
    return (
      <Card padding="md" className="space-y-4">
        <div className="h-4 w-36 bg-border-default rounded animate-pulse" />
        <div className="h-48 bg-border-default rounded animate-pulse" />
      </Card>
    );
  }

  const { history = [], currentRating = 1842, maxRating = 1890, globalRank = 4210 } = contestsData;

  if (history.length === 0) {
    return (
      <Card padding="md" className="text-center py-8 text-xs text-text-muted">
        No rated contests joined yet.
      </Card>
    );
  }

  // Calculate SVG line coordinates
  const ratings = history.map((h) => h.newRating);
  const minRating = Math.floor(Math.min(...ratings, 1500) / 100) * 100;
  const maxRatingBound = Math.ceil(Math.max(...ratings, maxRating) / 100) * 100 + 50;
  const ratingRange = maxRatingBound - minRating || 1;

  const svgWidth = 600;
  const svgHeight = 160;
  const paddingX = 40;
  const paddingY = 20;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  const points = history.map((item, idx) => {
    const x = paddingX + (idx / Math.max(1, history.length - 1)) * graphWidth;
    const y = svgHeight - paddingY - ((item.newRating - minRating) / ratingRange) * graphHeight;
    return { ...item, x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  return (
    <div className="space-y-4">
      {/* 1. Header with Contest Rating Badges */}
      <Card padding="md" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-default">
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-text-muted block text-[11px]">Contest Rating</span>
              <strong className="font-mono text-base font-bold text-text-primary">
                {currentRating}
              </strong>
            </div>
            <div>
              <span className="text-text-muted block text-[11px]">Global Rank</span>
              <strong className="font-mono text-base font-bold text-text-primary">
                #{globalRank.toLocaleString()}
              </strong>
            </div>
            <div>
              <span className="text-text-muted block text-[11px]">Top Rating</span>
              <strong className="font-mono text-base font-bold text-text-secondary">
                {maxRating}
              </strong>
            </div>
          </div>
          <span className="text-xs text-text-muted font-mono">
            {history.length} Contests Attended
          </span>
        </div>

        {/* 2. Neutral SVG Line Chart (No gradients, no glows) */}
        <div className="relative">
          <svg
            className="w-full h-44 overflow-visible select-none"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
            aria-label="Contest rating history line chart"
          >
            {/* Horizontal Grid lines */}
            <line
              x1={paddingX}
              y1={paddingY}
              x2={svgWidth - paddingX}
              y2={paddingY}
              className="stroke-border-subtle"
              strokeDasharray="4 4"
            />
            <line
              x1={paddingX}
              y1={paddingY + graphHeight / 2}
              x2={svgWidth - paddingX}
              y2={paddingY + graphHeight / 2}
              className="stroke-border-subtle"
              strokeDasharray="4 4"
            />
            <line
              x1={paddingX}
              y1={svgHeight - paddingY}
              x2={svgWidth - paddingX}
              y2={svgHeight - paddingY}
              className="stroke-border-subtle"
              strokeDasharray="4 4"
            />

            {/* Y-axis labels */}
            <text
              x={paddingX - 8}
              y={paddingY + 4}
              textAnchor="end"
              className="fill-text-muted text-[10px] font-mono"
            >
              {maxRatingBound}
            </text>
            <text
              x={paddingX - 8}
              y={svgHeight - paddingY + 4}
              textAnchor="end"
              className="fill-text-muted text-[10px] font-mono"
            >
              {minRating}
            </text>

            {/* Clean neutral SVG path */}
            <path
              d={pathD}
              fill="none"
              className="stroke-text-primary"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Data Point Nodes */}
            {points.map((pt, idx) => (
              <circle
                key={pt.id || idx}
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint?.id === pt.id ? '5' : '3.5'}
                className="fill-bg-surface stroke-accent cursor-pointer transition-all"
                strokeWidth="2"
                tabIndex={0}
                role="button"
                aria-label={`${pt.contestName}: Rating ${pt.newRating}`}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                onFocus={() => setHoveredPoint(pt)}
                onBlur={() => setHoveredPoint(null)}
              />
            ))}
          </svg>

          {/* Interactive Floating Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute z-10 px-2.5 py-1.5 bg-bg-surface border border-border-default rounded-[var(--radius-sm)] shadow-md text-xs pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2"
              style={{
                left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                top: `${(hoveredPoint.y / svgHeight) * 100}%`,
              }}
            >
              <p className="font-semibold text-text-primary truncate">{hoveredPoint.contestName}</p>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-secondary font-mono">
                <span>Rating: <strong className="text-text-primary">{hoveredPoint.newRating}</strong></span>
                <span>•</span>
                <span>Rank: #{hoveredPoint.rank}</span>
                <span>•</span>
                <span
                  className={
                    hoveredPoint.ratingChange > 0
                      ? 'text-accent'
                      : hoveredPoint.ratingChange < 0
                      ? 'text-error'
                      : 'text-text-muted'
                  }
                >
                  {hoveredPoint.ratingChange > 0 ? `+${hoveredPoint.ratingChange}` : hoveredPoint.ratingChange}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 3. Contest Participation History Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-3 border-b border-border-default">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Contest History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-surface-subtle text-text-muted border-b border-border-subtle uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-4 font-medium">Contest</th>
                <th className="py-2.5 px-4 font-medium">Rank</th>
                <th className="py-2.5 px-4 font-medium">Rating Change</th>
                <th className="py-2.5 px-4 font-medium">New Rating</th>
                <th className="py-2.5 px-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-mono text-text-secondary">
              {[...history].reverse().map((c) => (
                <tr key={c.id} className="hover:bg-bg-surface-hover transition-colors">
                  <td className="py-2.5 px-4 font-sans font-medium text-text-primary">
                    {c.contestName}
                  </td>
                  <td className="py-2.5 px-4">#{c.rank.toLocaleString()}</td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        c.ratingChange > 0
                          ? 'text-accent'
                          : c.ratingChange < 0
                          ? 'text-error'
                          : 'text-text-muted'
                      }`}
                    >
                      {c.ratingChange > 0 ? (
                        <>
                          <TrendingUp className="w-3 h-3" />
                          <span>+{c.ratingChange}</span>
                        </>
                      ) : c.ratingChange < 0 ? (
                        <>
                          <TrendingDown className="w-3 h-3" />
                          <span>{c.ratingChange}</span>
                        </>
                      ) : (
                        <>
                          <Minus className="w-3 h-3" />
                          <span>0</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-text-primary font-semibold">{c.newRating}</td>
                  <td className="py-2.5 px-4 text-text-muted font-sans">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
