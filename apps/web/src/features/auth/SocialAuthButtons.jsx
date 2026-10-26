import React, { useState } from 'react';
import { COPY } from '../../constants/copy';
import { API_CONFIG } from '../../lib/api';

/**
 * SocialAuthButtons
 * Props:
 *   onGoogleSuccess  {fn(email)} – called after Google OAuth completes, with user email
 *   onGithubSuccess  {fn(email)} – called after GitHub OAuth completes, with user email
 */
export default function SocialAuthButtons({ onGoogleSuccess, onGithubSuccess }) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  /**
   * In real mode: redirect to backend Google OAuth URL.
   * In mock mode: simulate a successful Google login returning a mock email.
   */
  const handleGoogle = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      if (!API_CONFIG.USE_MOCK) {
        // Real flow: redirect browser to backend OAuth endpoint.
        // The backend will redirect back with token/session.
        // We store the callback intent so AuthCard can pick up the email after redirect.
        window.location.href = `${API_CONFIG.AUTH_SERVICE_URL}/auth/google`;
        return; // page will navigate away
      }

      // Mock flow: simulate OAuth returning a user email
      await new Promise((r) => setTimeout(r, 900));
      const mockEmail = 'googleuser@gmail.com';
      console.info('[SocialAuth] Mock Google OAuth success → email:', mockEmail);
      onGoogleSuccess?.(mockEmail);
    } catch (err) {
      console.error('[SocialAuth] Google OAuth error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGithub = async () => {
    if (githubLoading) return;
    setGithubLoading(true);
    try {
      if (!API_CONFIG.USE_MOCK) {
        window.location.href = `${API_CONFIG.AUTH_SERVICE_URL}/auth/github`;
        return;
      }

      // Mock flow
      await new Promise((r) => setTimeout(r, 900));
      const mockEmail = 'githubuser@github.com';
      console.info('[SocialAuth] Mock GitHub OAuth success → email:', mockEmail);
      onGithubSuccess?.(mockEmail);
    } catch (err) {
      console.error('[SocialAuth] GitHub OAuth error:', err);
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
      {/* Google Button */}
      <button
        id="social-auth-google"
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading || githubLoading}
        aria-label="Continue with Google"
        className="h-10 px-2 sm:px-3 inline-flex items-center justify-center gap-2 bg-bg-surface hover:bg-bg-surface-hover border border-border-default rounded-[var(--radius-sm)] text-xs font-medium text-text-primary transition-colors cursor-pointer select-none disabled:opacity-60 disabled:pointer-events-none"
      >
        {googleLoading ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        )}
        <span>{googleLoading ? 'Connecting…' : COPY.auth.oauth.google}</span>
      </button>

      {/* GitHub Button */}
      <button
        id="social-auth-github"
        type="button"
        onClick={handleGithub}
        disabled={googleLoading || githubLoading}
        aria-label="Continue with GitHub"
        className="h-10 px-2 sm:px-3 inline-flex items-center justify-center gap-2 bg-bg-surface hover:bg-bg-surface-hover border border-border-default rounded-[var(--radius-sm)] text-xs font-medium text-text-primary transition-colors cursor-pointer select-none disabled:opacity-60 disabled:pointer-events-none"
      >
        {githubLoading ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 shrink-0 fill-current text-text-primary" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        )}
        <span>{githubLoading ? 'Connecting…' : COPY.auth.oauth.github}</span>
      </button>
    </div>
  );
}
