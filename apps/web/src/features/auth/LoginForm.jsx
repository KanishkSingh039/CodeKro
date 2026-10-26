import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Checkbox from '../../components/ui/Checkbox';
import Button from '../../components/ui/Button';
import Link from '../../components/ui/Link';
import { COPY } from '../../constants/copy';
import { apiClient } from '../../lib/api';

export default function LoginForm({ onSwitchToRegister, onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = COPY.auth.validation.emailRequired;
    }
    if (!formData.password) {
      newErrors.password = COPY.auth.validation.passwordRequired;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Connect to API client stub (no backend mutations)
      await apiClient.login({
        email: formData.email,
        password: formData.password,
      });
      if (onSuccess) {
        // Pass email so AuthCard can transition to the OTP verification step
        onSuccess(formData.email);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {/* Email input */}
      <Input
        id="login-email"
        label={COPY.auth.fields.email.label}
        type="email"
        placeholder={COPY.auth.fields.email.placeholder}
        value={formData.email}
        onChange={(e) => {
          setFormData({ ...formData, email: e.target.value });
          if (errors.email) setErrors({ ...errors, email: null });
        }}
        error={errors.email}
        autoComplete="email"
      />

      {/* Password input with forgot password right action */}
      <PasswordInput
        id="login-password"
        label={COPY.auth.fields.password.label}
        placeholder={COPY.auth.fields.password.placeholder}
        value={formData.password}
        onChange={(e) => {
          setFormData({ ...formData, password: e.target.value });
          if (errors.password) setErrors({ ...errors, password: null });
        }}
        error={errors.password}
        rightAction={
          <Link href="#forgot-password" variant="muted">
            {COPY.auth.fields.forgotPassword}
          </Link>
        }
        autoComplete="current-password"
      />

      {/* Remember me checkbox */}
      <div className="pt-0.5">
        <Checkbox
          id="login-remember"
          checked={formData.rememberMe}
          onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
          label={COPY.auth.fields.rememberMe}
        />
      </div>

      {/* Primary Submit Button */}
      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        {loading ? COPY.auth.buttons.signingIn : COPY.auth.buttons.login}
      </Button>

      {/* Footer Switch Link */}
      <div className="pt-2 text-center text-xs text-text-secondary">
        <span>{COPY.auth.footer.noAccount} </span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-accent hover:underline font-medium cursor-pointer ml-1"
        >
          {COPY.auth.footer.signUp}
        </button>
      </div>
    </form>
  );
}
