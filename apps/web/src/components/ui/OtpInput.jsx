import React, { useRef, useEffect, useCallback } from 'react';

/**
 * OtpInput — 6-box OTP digit input with auto-advance, backspace, and paste support.
 * Each box is a single <input type="text" maxLength=1> that jumps focus automatically.
 */
export default function OtpInput({ value = '', onChange, length = 6, error = false, disabled = false }) {
  // Normalise to an array of `length` chars (pad or trim)
  const digits = Array.from({ length }, (_, i) => value[i] || '');
  const inputsRef = useRef([]);

  // Focus first empty slot on mount
  useEffect(() => {
    const firstEmpty = digits.findIndex((d) => d === '');
    const idx = firstEmpty === -1 ? length - 1 : firstEmpty;
    inputsRef.current[idx]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notify = useCallback(
    (newDigits) => {
      onChange?.(newDigits.join(''));
    },
    [onChange]
  );

  const handleChange = (e, idx) => {
    const raw = e.target.value.replace(/\D/g, ''); // digits only
    if (!raw) return;

    // Handle paste of multiple digits into one box
    if (raw.length > 1) {
      const pasted = raw.slice(0, length);
      const newDigits = [...digits];
      for (let i = 0; i < pasted.length && idx + i < length; i++) {
        newDigits[idx + i] = pasted[i];
      }
      notify(newDigits);
      const nextFocus = Math.min(idx + pasted.length, length - 1);
      inputsRef.current[nextFocus]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[idx] = raw[0];
    notify(newDigits);

    // Advance to next input
    if (idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];
      if (newDigits[idx]) {
        newDigits[idx] = '';
        notify(newDigits);
      } else if (idx > 0) {
        newDigits[idx - 1] = '';
        notify(newDigits);
        inputsRef.current[idx - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    const newDigits = Array.from({ length }, (_, i) => pasted[i] || '');
    notify(newDigits);
    const nextFocus = Math.min(pasted.length, length - 1);
    inputsRef.current[nextFocus]?.focus();
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div
      className="flex items-center justify-center gap-2.5"
      role="group"
      aria-label="One-time password input"
    >
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          id={`otp-digit-${idx}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          autoComplete={idx === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${idx + 1}`}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          style={{
            width: '46px',
            height: '54px',
            fontSize: '1.375rem',
            fontWeight: '700',
            letterSpacing: '0.05em',
            textAlign: 'center',
            caretColor: 'transparent',
            backgroundColor: 'var(--bg-input)',
            border: `2px solid ${
              error
                ? 'var(--color-error)'
                : digit
                ? 'var(--accent-primary)'
                : 'var(--border-default)'
            }`,
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            boxShadow: error
              ? '0 0 0 3px rgba(239,68,68,0.15)'
              : digit
              ? '0 0 0 3px var(--accent-focus-ring)'
              : 'none',
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
          }}
        />
      ))}
    </div>
  );
}
