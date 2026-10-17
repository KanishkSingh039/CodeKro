import React, { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Star,
  Share2,
  Flag,
  Tag,
  Building2,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import DifficultyLabel from '../../components/ui/DifficultyLabel';
import ExampleBlock from './ExampleBlock';
import HintList from './HintList';
import { COPY } from '../../constants/copy';

/**
 * ProblemDescription Component
 * Displays the complete problem statement, examples, constraints, hints, and interactive footer.
 */
export default function ProblemDescription({
  problem,
  onVote,
  onBookmarkToggle,
}) {
  const [showTopics, setShowTopics] = useState(false);
  const [showCompanies, setShowCompanies] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  if (!problem) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 select-text overflow-y-auto max-w-full">
      {/* Title & Metadata Header */}
      <div className="space-y-3 pb-4 border-b border-border-default">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
            {problem.frontendQuestionId}. {problem.title}
          </h1>
          <DifficultyLabel difficulty={problem.difficulty} />
        </div>

        {/* Collapsible Topic & Company Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* Topics Toggle */}
          {problem.topicTags && problem.topicTags.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTopics(!showTopics)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface hover:bg-bg-surface-hover text-text-secondary cursor-pointer"
              >
                <Tag className="w-3 h-3 text-text-muted" />
                <span>{COPY.problem.meta.topics}</span>
                <span className="text-[10px] text-text-muted font-mono">({problem.topicTags.length})</span>
                {showTopics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showTopics && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {problem.topicTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-[4px] bg-bg-surface-subtle border border-border-subtle text-text-secondary text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Companies Toggle */}
          {problem.companies && problem.companies.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCompanies(!showCompanies)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface hover:bg-bg-surface-hover text-text-secondary cursor-pointer"
              >
                <Building2 className="w-3 h-3 text-text-muted" />
                <span>{COPY.problem.meta.companies}</span>
                <span className="text-[10px] text-text-muted font-mono">({problem.companies.length})</span>
                {showCompanies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showCompanies && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {problem.companies.map((company) => (
                    <span
                      key={company}
                      className="px-2 py-0.5 rounded-[4px] bg-bg-surface-subtle border border-border-subtle text-text-secondary text-[11px]"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Problem Statement Body */}
      <div className="text-xs sm:text-sm text-text-primary leading-relaxed space-y-3 font-sans">
        {problem.description?.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Examples List */}
      {problem.examples && problem.examples.length > 0 && (
        <div className="space-y-4 pt-2">
          {problem.examples.map((example) => (
            <ExampleBlock key={example.id} example={example} />
          ))}
        </div>
      )}

      {/* Constraints */}
      {problem.constraints && problem.constraints.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border-subtle">
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            {COPY.problem.meta.constraints}:
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs text-text-secondary font-mono">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="leading-relaxed">
                <span className="font-mono bg-bg-surface-subtle px-1.5 py-0.5 rounded border border-border-subtle text-text-primary">
                  {constraint}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Follow-up Note */}
      {problem.followUp && (
        <div className="p-3 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface-subtle text-xs text-text-secondary space-y-1">
          <span className="font-semibold text-text-primary">{COPY.problem.meta.followUp}: </span>
          <span>{problem.followUp}</span>
        </div>
      )}

      {/* Collapsible Hints */}
      {problem.hints && problem.hints.length > 0 && (
        <HintList hints={problem.hints} />
      )}

      {/* Footer Action Row: Votes, Bookmark, Share, Report */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border-default text-xs text-text-muted">
        <div className="flex items-center gap-2">
          {/* Like */}
          <button
            type="button"
            onClick={() => onVote && onVote('like')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-sm)] border border-border-default transition-colors cursor-pointer ${
              problem.userVote === 'like'
                ? 'bg-bg-surface-subtle text-accent border-accent/40 font-medium'
                : 'bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover'
            }`}
            title="Like this problem"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="font-mono">{problem.likes || 0}</span>
          </button>

          {/* Dislike */}
          <button
            type="button"
            onClick={() => onVote && onVote('dislike')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-sm)] border border-border-default transition-colors cursor-pointer ${
              problem.userVote === 'dislike'
                ? 'bg-bg-surface-subtle text-text-primary border-border-default font-medium'
                : 'bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover'
            }`}
            title="Dislike this problem"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span className="font-mono">{problem.dislikes || 0}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Bookmark */}
          <button
            type="button"
            onClick={() => onBookmarkToggle && onBookmarkToggle(problem.id)}
            className={`p-1.5 rounded-[var(--radius-sm)] border border-border-default transition-colors cursor-pointer ${
              problem.isBookmarked
                ? 'text-accent border-accent/40 bg-bg-surface-subtle'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover bg-bg-surface'
            }`}
            title={problem.isBookmarked ? COPY.problem.actions.bookmarked : COPY.problem.actions.bookmark}
          >
            <Star className={`w-3.5 h-3.5 ${problem.isBookmarked ? 'fill-accent' : ''}`} />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer"
            title="Share problem URL"
          >
            {shareCopied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{shareCopied ? 'Copied' : COPY.problem.actions.share}</span>
          </button>

          {/* Report */}
          <button
            type="button"
            className="p-1.5 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer"
            title={COPY.problem.actions.report}
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
