import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import { COPY } from '../../constants/copy';
import { getUpcomingContest } from '../../lib/api';

function formatCountdown(targetDateStr) {
  if (!targetDateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  const diff = new Date(targetDateStr).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, ended: false };
}

export function ContestTeaser() {
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, ended: false });

  const cCopy = COPY.landing.contests;

  useEffect(() => {
    let mounted = true;
    getUpcomingContest()
      .then((data) => {
        if (!mounted) return;
        if (!data || !data.title) {
          setContest(null);
        } else {
          setContest(data);
          setTimeLeft(formatCountdown(data.startTime));
        }
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!contest?.startTime) return;
    const interval = setInterval(() => {
      setTimeLeft(formatCountdown(contest.startTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [contest?.startTime]);

  // Hide the section if no contest is scheduled or if error occurs
  if (error || (!loading && !contest)) {
    return null;
  }

  const formatLocalTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const formatted = date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      return `${formatted} (${tz})`;
    } catch {
      return isoString;
    }
  };

  return (
    <section id="contests" className="py-20 border-b border-border bg-base" aria-labelledby="contests-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-mono uppercase tracking-wider text-muted mb-2">Competition</p>
          <h2 id="contests-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
            {cCopy.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted">
            {cCopy.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="max-w-3xl mx-auto rounded-lg border border-border bg-surface p-6 sm:p-8 animate-pulse">
            <div className="h-6 w-48 bg-surface-raised rounded mb-4" />
            <div className="h-4 w-72 bg-surface-raised rounded mb-8" />
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-surface-raised rounded" />
              ))}
            </div>
            <div className="h-10 w-36 bg-surface-raised rounded" />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto rounded-lg border border-border bg-surface p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
              <div>
                <span className="inline-block px-2 py-0.5 text-xs font-mono font-medium rounded border border-border bg-surface-raised text-text mb-2">
                  Scheduled
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-text">{contest.title}</h3>
                <p className="text-xs sm:text-sm text-muted mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{formatLocalTime(contest.startTime)}</span>
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-muted">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {contest.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" aria-hidden="true" />
                  {contest.registeredCount?.toLocaleString()} registered
                </span>
              </div>
            </div>

            {/* Countdown grid */}
            <div className="py-6">
              <p className="text-xs font-mono text-muted uppercase tracking-wider mb-3">
                {cCopy.startsIn}
              </p>
              <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md">
                {[
                  { label: 'Days', val: timeLeft.days },
                  { label: 'Hours', val: timeLeft.hours },
                  { label: 'Minutes', val: timeLeft.minutes },
                  { label: 'Seconds', val: timeLeft.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center justify-center p-3 rounded border border-border bg-surface-raised"
                  >
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-text tracking-tight">
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] font-mono text-muted uppercase mt-0.5">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border">
              <p className="text-xs text-muted">
                Standard contest rules apply. 4 problems, 90 minutes.
              </p>
              <button
                type="button"
                onClick={() => setRegistered(!registered)}
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  registered
                    ? 'border border-border bg-surface-raised text-text hover:bg-surface'
                    : 'bg-accent text-accent-fg hover:opacity-95 font-semibold'
                }`}
              >
                <span>{registered ? cCopy.registeredBtn : cCopy.registerBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
