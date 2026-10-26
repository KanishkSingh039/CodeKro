import React, { useState, useEffect, useCallback, useRef } from 'react';
import OtpInput from '../../components/ui/OtpInput';
import Button from '../../components/ui/Button';
import { apiClient, API_CONFIG, request } from '../../lib/api';

const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Formats remaining seconds as MM:SS
 */
function formatCountdown(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * OtpVerifyForm
 * Props:
 *   email          {string}   – email OTP was sent to
 *   onVerified     {fn}       – called on successful verification
 *   onBack         {fn}       – go back (cancel / use different email)
 *   autoSendOnMount {bool}    – default true; sends OTP immediately on mount
 */
export default function OtpVerifyForm({ email, onVerified, onBack, autoSendOnMount = true }) {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0); // 0 means timer not active (resend allowed)
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sendError, setSendError] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [sentOnce, setSentOnce] = useState(false);

  const intervalRef = useRef(null);

  /** Starts a 60-second countdown; clears any previous timer */
  const startCountdown = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCountdown(RESEND_COOLDOWN_SECONDS);
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /** Send (or resend) OTP to the email via the auth service */
  const sendOtp = useCallback(async () => {
    if (!email) return;
    setSendError('');
    setVerifyError('');
    setSuccessMsg('');
    setIsSending(true);
    try {
      if (!API_CONFIG.USE_MOCK) {
        await request(`${API_CONFIG.AUTH_SERVICE_URL}/auth/otp/generate`, {
          method: 'POST',
          body: { email },
        });
      } else {
        // Mock: simulate network delay
        await new Promise((r) => setTimeout(r, 800));
        console.info('[OTP] Mock OTP sent to', email);
      }
      setSentOnce(true);
      startCountdown();
      setOtp(''); // clear any previous entry
    } catch (err) {
      setSendError(err?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSending(false);
    }
  }, [email, startCountdown]);

  // Auto-send on first mount
  useEffect(() => {
    if (autoSendOnMount) {
      sendOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Verify the entered OTP */
  const handleVerify = async (e) => {
    e?.preventDefault();
    if (otp.length < 6) {
      setVerifyError('Please enter the complete 6-digit OTP.');
      return;
    }
    setVerifyError('');
    setIsVerifying(true);
    try {
      if (!API_CONFIG.USE_MOCK) {
        await request(`${API_CONFIG.AUTH_SERVICE_URL}/auth/otp/verify`, {
          method: 'POST',
          body: { email, otp },
        });
      } else {
        // Mock: simulate network delay; accept any 6-digit code
        await new Promise((r) => setTimeout(r, 900));
        console.info('[OTP] Mock verification passed for', email, 'otp:', otp);
      }
      setSuccessMsg('Email verified! Redirecting…');
      setTimeout(() => onVerified?.(), 1200);
    } catch (err) {
      setVerifyError(err?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const canResend = countdown === 0 && !isSending;
  const isDisabled = isSending || isVerifying || !!successMsg;

  return (
    <form onSubmit={handleVerify} noValidate>
      {/* ── Header ── */}
      <div className="mb-6 text-center space-y-1">
        {/* Shield / key icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(0,237,100,0.15) 0%, rgba(0,200,83,0.08) 100%)',
            border: '1.5px solid rgba(0,237,100,0.25)',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
          Verify your email
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 0', lineHeight: 1.5 }}>
          {sentOnce ? (
            <>
              We sent a 6-digit code to{' '}
              <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{email}</span>.
              <br />
              Enter it below within 5 minutes.
            </>
          ) : (
            'Sending OTP…'
          )}
        </p>
      </div>

      {/* ── OTP boxes ── */}
      <div className="mb-5">
        <OtpInput
          value={otp}
          onChange={(val) => {
            setOtp(val);
            if (verifyError) setVerifyError('');
          }}
          length={6}
          error={!!verifyError}
          disabled={isDisabled}
        />
      </div>

      {/* ── Error / Success messages ── */}
      {verifyError && (
        <p
          role="alert"
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-error)',
            textAlign: 'center',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {verifyError}
        </p>
      )}

      {sendError && (
        <p
          role="alert"
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-error)',
            textAlign: 'center',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {sendError}
        </p>
      )}

      {successMsg && (
        <p
          role="status"
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-success)',
            textAlign: 'center',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {successMsg}
        </p>
      )}

      {/* ── Verify button ── */}
      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={isVerifying}
        disabled={isDisabled || otp.length < 6}
        className="mb-4"
      >
        {isVerifying ? 'Verifying…' : successMsg ? 'Verified ✓' : 'Verify OTP'}
      </Button>

      {/* ── Countdown + Resend row ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
        }}
      >
        {countdown > 0 ? (
          <>
            <span>Resend in</span>
            {/* Animated countdown badge */}
            <span
              key={countdown}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '48px',
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                fontWeight: '700',
                fontSize: '0.75rem',
                fontVariantNumeric: 'tabular-nums',
                color: countdown <= 10 ? 'var(--color-error)' : 'var(--text-primary)',
                transition: 'color 0.3s',
              }}
            >
              {formatCountdown(countdown)}
            </span>
          </>
        ) : (
          <>
            <span>Didn&apos;t receive the code?</span>
            <button
              type="button"
              id="otp-resend-btn"
              onClick={sendOtp}
              disabled={!canResend}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: canResend ? 'pointer' : 'not-allowed',
                color: canResend ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.78rem',
                textDecoration: canResend ? 'underline' : 'none',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              aria-label="Resend OTP"
            >
              {isSending ? (
                <>
                  <svg
                    className="animate-spin"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ animation: 'spin 0.8s linear infinite' }}
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path
                      fill="currentColor"
                      opacity="0.75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Sending…
                </>
              ) : (
                'Resend OTP'
              )}
            </button>
          </>
        )}
      </div>

      {/* ── Back link ── */}
      {onBack && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Use a different email
          </button>
        </div>
      )}
    </form>
  );
}
