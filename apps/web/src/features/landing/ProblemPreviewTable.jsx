import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import DifficultyLabel from '../../components/ui/DifficultyLabel';
import TagChip from '../../components/ui/TagChip';
import { ArrowRight } from 'lucide-react';
import { COPY } from '../../constants/copy';
import { getFeaturedProblems } from '../../lib/api';

/**
 * ProblemPreviewTable Component
 * Strip showing 5 featured problems in a clean, neutral table with skeletons.
 */
export function ProblemPreviewTable({
  problems: propProblems,
  isLoading: propLoading,
  onSelectProblem,
  onViewAll,
}) {
  const [internalProblems, setInternalProblems] = useState([]);
  const [internalLoading, setInternalLoading] = useState(!propProblems || propProblems.length === 0);
  const p = COPY.landing.problemStrip;

  useEffect(() => {
    if (propProblems && propProblems.length > 0) return;

    let mounted = true;
    getFeaturedProblems()
      .then((data) => {
        if (mounted) {
          setInternalProblems(data || []);
        }
      })
      .catch((err) => {
        console.warn('Failed to load featured problems:', err);
      })
      .finally(() => {
        if (mounted) setInternalLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [propProblems]);

  const problems = (propProblems && propProblems.length > 0) ? propProblems : internalProblems;
  const isLoading = propLoading !== undefined ? propLoading : (propProblems && propProblems.length > 0 ? false : internalLoading);

  // Fallback silently if empty and not loading
  if (!isLoading && (!problems || problems.length === 0)) {
    return null;
  }

  return (
    <section id="problems" className="py-16 bg-surface border-b border-border" aria-labelledby="problems-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-wider text-muted">Problem Set</p>
            <h2 id="problems-heading" className="text-xl sm:text-2xl font-bold text-text tracking-tight">
              {p.title}
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              {p.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline cursor-pointer self-start sm:self-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded py-1 px-2"
          >
            <span>{p.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Problems Table */}
        <Card padding="none" className="overflow-hidden border border-border bg-base">
          {isLoading ? (
            <div className="divide-y divide-border">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-3.5 flex items-center justify-between animate-pulse">
                  <div className="h-4 w-48 bg-surface-raised rounded" />
                  <div className="h-4 w-20 bg-surface-raised rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" aria-label="Sample problems list">
                <thead className="bg-surface text-muted border-b border-border uppercase tracking-wider text-[10px] font-mono">
                  <tr>
                    <th scope="col" className="py-3 px-4 font-medium w-12">#</th>
                    <th scope="col" className="py-3 px-4 font-medium">Title</th>
                    <th scope="col" className="py-3 px-4 font-medium w-28">Difficulty</th>
                    <th scope="col" className="py-3 px-4 font-medium">Topics</th>
                    <th scope="col" className="py-3 px-4 font-medium w-28 text-right">Acceptance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {problems.map((prob) => (
                    <tr
                      key={prob.id}
                      onClick={() => onSelectProblem && onSelectProblem(prob.titleSlug)}
                      className="hover:bg-surface-raised transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-mono text-muted">
                        {prob.frontendQuestionId}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-text group-hover:text-accent transition-colors">
                        {prob.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <DifficultyLabel difficulty={prob.difficulty} size="sm" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[280px]">
                          {prob.topicTags?.slice(0, 2).map((tag) => (
                            <TagChip key={tag}>{tag}</TagChip>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-muted text-right">
                        {prob.acceptanceRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}

export default ProblemPreviewTable;
