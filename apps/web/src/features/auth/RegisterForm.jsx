import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Checkbox from '../../components/ui/Checkbox';
import Button from '../../components/ui/Button';
import Link from '../../components/ui/Link';
import { COPY } from '../../constants/copy';
import { apiClient } from '../../lib/api';

export default function RegisterForm({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = COPY.auth.validation.nameRequired;
    }
    if (!formData.username.trim()) {
      newErrors.username = COPY.auth.validation.usernameRequired;
    }
    if (!formData.email.trim()) {
      newErrors.email = COPY.auth.validation.emailRequired;
    }
    if (!formData.password) {
      newErrors.password = COPY.auth.validation.passwordRequired;
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = COPY.auth.validation.termsRequired;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Connect to API client stub (no backend mutations)
      await apiClient.register({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
      {/* Full Name input (backend requires 'name') */}
      <Input
        id="register-name"
        label={COPY.auth.fields.name.label}
        placeholder={COPY.auth.fields.name.placeholder}
        value={formData.name}
        onChange={(e) => {
          setFormData({ ...formData, name: e.target.value });
          if (errors.name) setErrors({ ...errors, name: null });
        }}
        error={errors.name}
        autoComplete="name"
      />

      {/* Username input (backend requires 'username') */}
      <Input
        id="register-username"
        label={COPY.auth.fields.username.label}
        placeholder={COPY.auth.fields.username.placeholder}
        value={formData.username}
        onChange={(e) => {
          setFormData({ ...formData, username: e.target.value });
          if (errors.username) setErrors({ ...errors, username: null });
        }}
        error={errors.username}
        autoComplete="username"
      />

      {/* Email input (backend requires 'email') */}
      <Input
        id="register-email"
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

      {/* Password input (backend requires 'password') with simple strength hint text, no flashy meter */}
      <PasswordInput
        id="register-password"
        label={COPY.auth.fields.password.label}
        placeholder={COPY.auth.fields.password.placeholder}
        value={formData.password}
        onChange={(e) => {
          setFormData({ ...formData, password: e.target.value });
          if (errors.password) setErrors({ ...errors, password: null });
        }}
        helperText={COPY.auth.fields.password.hint}
        error={errors.password}
        autoComplete="new-password"
      />

      {/* Terms agreement checkbox */}
      <div className="pt-1">
        <Checkbox
          id="register-terms"
          checked={formData.agreeTerms}
          onChange={(e) => {
            setFormData({ ...formData, agreeTerms: e.target.checked });
            if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: null });
          }}
          error={errors.agreeTerms}
        >
          <span>
            I agree to the{' '}
            <Link href="#terms" variant="accent">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#privacy" variant="accent">
              Privacy Policy
            </Link>
            .
          </span>
        </Checkbox>
      </div>

      {/* Primary Submit Button */}
      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        {loading ? COPY.auth.buttons.creatingAccount : COPY.auth.buttons.register}
      </Button>

      {/* Footer Switch Link */}
      <div className="pt-2 text-center text-xs text-text-secondary">
        <span>{COPY.auth.footer.haveAccount} </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-accent hover:underline font-medium cursor-pointer ml-1"
        >
          {COPY.auth.footer.signIn}
        </button>
      </div>
    </form>
  );
}
