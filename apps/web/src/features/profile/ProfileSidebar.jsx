import React from 'react';
import {
  MapPin,
  Building2,
  Globe,
  Calendar,
  Clock,
  Trophy,
  Award,
  Zap,
  Users,
  Edit3,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import TagChip from '../../components/ui/TagChip';
import { COPY } from '../../constants/copy';

function GithubIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.66 1.66 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66A1.66 1.66 0 0 0 7.83 6.2z" />
    </svg>
  );
}

/**
 * ProfileSidebar Component
 * Left identity column: 96px avatar, bio, links, stats summary, skills, languages, joined date.
 */
export default function ProfileSidebar({
  profile,
  isLoading = false,
  onEditProfile,
}) {
  if (isLoading || !profile) {
    return (
      <aside className="w-full space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-border-default animate-pulse shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-36 bg-border-default rounded animate-pulse" />
            <div className="h-4 w-24 bg-border-default rounded animate-pulse" />
          </div>
        </div>
        <div className="h-14 bg-border-default rounded animate-pulse" />
        <div className="h-28 bg-border-default rounded animate-pulse" />
      </aside>
    );
  }

  const {
    name = '',
    username = '',
    bio = '',
    location = '',
    organization = '',
    website = '',
    github = '',
    linkedin = '',
    globalRank = 0,
    contestRating = 0,
    reputation = 0,
    followersCount,
    followingCount,
    joinedDate = '',
    lastActive = '',
    skills = [],
    languages = [],
    isOwner = false,
    avatarUrl = '',
  } = profile;

  const initials = (name || username || 'CK')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Clean, sanitized URL helpers
  const formatUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  const getGithubUrl = (handle) => {
    if (!handle) return '';
    return handle.startsWith('http') ? handle : `https://github.com/${handle.replace('@', '')}`;
  };

  const getLinkedinUrl = (handle) => {
    if (!handle) return '';
    return handle.startsWith('http') ? handle : `https://linkedin.com/in/${handle.replace('@', '')}`;
  };

  return (
    <aside className="w-full space-y-6 lg:sticky lg:top-20">
      {/* 1. Identity Header: Avatar + Names + Bio */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name || username}
              className="w-24 h-24 rounded-full object-cover border border-border-default shrink-0 bg-bg-surface-subtle"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full border border-border-default bg-bg-surface-subtle flex items-center justify-center text-xl font-mono font-bold text-accent shrink-0 select-none"
              aria-label={name || username}
            >
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-text-primary truncate leading-tight">
              {name || username}
            </h1>
            <p className="text-xs font-mono text-text-secondary truncate mt-0.5">
              @{username}
            </p>
            {isOwner && (
              <div className="mt-2.5">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onEditProfile}
                  className="w-full sm:w-auto h-7 text-xs flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-text-muted" />
                  <span>{COPY.profile.editProfile}</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {bio && (
          <p className="text-xs text-text-secondary leading-relaxed break-words">
            {bio}
          </p>
        )}
      </div>

      {/* 2. Meta links list (only filled fields) */}
      <div className="space-y-2 text-xs border-t border-border-subtle pt-4">
        {location && (
          <div className="flex items-center gap-2 text-text-secondary">
            <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}

        {organization && (
          <div className="flex items-center gap-2 text-text-secondary">
            <Building2 className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <span className="truncate">{organization}</span>
          </div>
        )}

        {website && (
          <div className="flex items-center gap-2 text-text-secondary">
            <Globe className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <a
              href={formatUrl(website)}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-text-primary hover:text-accent transition-colors truncate"
            >
              {website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}

        {github && (
          <div className="flex items-center gap-2 text-text-secondary">
            <GithubIcon className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <a
              href={getGithubUrl(github)}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-text-primary hover:text-accent transition-colors truncate"
            >
              {github.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '')}
            </a>
          </div>
        )}

        {linkedin && (
          <div className="flex items-center gap-2 text-text-secondary">
            <LinkedinIcon className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <a
              href={getLinkedinUrl(linkedin)}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-text-primary hover:text-accent transition-colors truncate"
            >
              {linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')}
            </a>
          </div>
        )}
      </div>

      {/* 3. Community & Ranking Stats Summary */}
      <div className="border-t border-border-subtle pt-4 space-y-2.5">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Ranking & Reputation
        </h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded bg-bg-surface-subtle border border-border-subtle">
            <div className="flex items-center gap-1.5 text-text-muted mb-0.5">
              <Trophy className="w-3 h-3 text-text-muted" />
              <span className="text-[11px]">Rank</span>
            </div>
            <div className="font-mono font-semibold text-text-primary">
              #{globalRank.toLocaleString()}
            </div>
          </div>

          <div className="p-2 rounded bg-bg-surface-subtle border border-border-subtle">
            <div className="flex items-center gap-1.5 text-text-muted mb-0.5">
              <Award className="w-3 h-3 text-text-muted" />
              <span className="text-[11px]">Rating</span>
            </div>
            <div className="font-mono font-semibold text-text-primary">
              {contestRating}
            </div>
          </div>

          <div className="p-2 rounded bg-bg-surface-subtle border border-border-subtle">
            <div className="flex items-center gap-1.5 text-text-muted mb-0.5">
              <Zap className="w-3 h-3 text-text-muted" />
              <span className="text-[11px]">Reputation</span>
            </div>
            <div className="font-mono font-semibold text-text-primary">
              {reputation}
            </div>
          </div>

          {(followersCount !== undefined || followingCount !== undefined) && (
            <div className="p-2 rounded bg-bg-surface-subtle border border-border-subtle">
              <div className="flex items-center gap-1.5 text-text-muted mb-0.5">
                <Users className="w-3 h-3 text-text-muted" />
                <span className="text-[11px]">Community</span>
              </div>
              <div className="font-mono text-xs text-text-secondary truncate">
                <strong className="text-text-primary">{followersCount ?? 0}</strong> followers
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Skills (Top Topics Solved) */}
      {skills.length > 0 && (
        <div className="border-t border-border-subtle pt-4 space-y-2.5">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            {COPY.profile.meta.skills}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <TagChip key={s.topic} count={s.count}>
                {s.topic}
              </TagChip>
            ))}
          </div>
        </div>
      )}

      {/* 5. Languages Used */}
      {languages.length > 0 && (
        <div className="border-t border-border-subtle pt-4 space-y-2.5">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            {COPY.profile.meta.languages}
          </h2>
          <div className="space-y-2">
            {languages.map((l) => (
              <div key={l.language} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-text-secondary">{l.language}</span>
                  <span className="font-mono text-text-muted text-[11px]">
                    <strong className="text-text-primary">{l.count}</strong> solved
                  </span>
                </div>
                <div className="w-full bg-bg-surface-subtle h-1 rounded-full overflow-hidden border border-border-subtle">
                  <div
                    className="bg-accent/60 h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (l.count / (languages[0]?.count || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Joined date and last active */}
      <div className="border-t border-border-subtle pt-4 space-y-1.5 text-xs text-text-muted">
        {joinedDate && (
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>
              {COPY.profile.meta.joined} {joinedDate}
            </span>
          </div>
        )}
        {lastActive && (
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>
              {COPY.profile.meta.lastActive}: {lastActive}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
