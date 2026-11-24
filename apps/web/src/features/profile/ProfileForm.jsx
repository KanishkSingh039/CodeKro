import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AvatarUploader from './AvatarUploader';
import { COPY } from '../../constants/copy';

const MAX_BIO = 160;
const MAX_NAME = 100;
const MAX_LOCATION = 100;
const MAX_ORGANIZATION = 100;
const MAX_WEBSITE = 200;
const MAX_GITHUB = 100;
const MAX_LINKEDIN = 200;

const trimValue = (value) => String(value || '').trim();

const withProtocol = (value) => {
  const trimmed = trimValue(value);
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const isWebUrl = (value) => {
  try {
    const parsed = new URL(withProtocol(value));
    return (
      ['http:', 'https:'].includes(parsed.protocol) &&
      Boolean(parsed.hostname) &&
      (parsed.hostname === 'localhost' || parsed.hostname.includes('.'))
    );
  } catch {
    return false;
  }
};

const GITHUB_HANDLE_PATTERN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
const LINKEDIN_HANDLE_PATTERN = /^[a-z\d-]{3,100}$/i;

const isGithubValue = (value) => {
  const trimmed = trimValue(value).replace(/^@/, '');
  if (!trimmed) return true;
  if (!trimmed.includes('/') && GITHUB_HANDLE_PATTERN.test(trimmed)) return true;

  try {
    const parsed = new URL(withProtocol(trimmed));
    return (
      ['github.com', 'www.github.com'].includes(parsed.hostname.toLowerCase()) &&
      /^\/[a-z\d-]+\/?$/i.test(parsed.pathname)
    );
  } catch {
    return false;
  }
};

const isLinkedinValue = (value) => {
  const trimmed = trimValue(value).replace(/^@/, '');
  if (!trimmed) return true;
  if (!trimmed.includes('/') && LINKEDIN_HANDLE_PATTERN.test(trimmed)) return true;

  try {
    const parsed = new URL(withProtocol(trimmed));
    return (
      ['linkedin.com', 'www.linkedin.com'].includes(parsed.hostname.toLowerCase()) &&
      /^\/in\/[a-z\d-]+(?:\/.*)?$/i.test(parsed.pathname)
    );
  } catch {
    return false;
  }
};

/**
 * ProfileForm Component
 * Edit profile fields: avatar, display name, bio (with 160 char counter),
 * location, organization, website, GitHub, LinkedIn.
 * Save button disabled until dirty and valid.
 */
export default function ProfileForm({
  initialProfile,
  onSave,
  isSaving = false,
  onDirtyChange,
}) {
  const [formData, setFormData] = useState({
    name: initialProfile?.name || '',
    bio: initialProfile?.bio || '',
    location: initialProfile?.location || '',
    organization: initialProfile?.organization || '',
    website: initialProfile?.website || '',
    github: initialProfile?.github || '',
    linkedin: initialProfile?.linkedin || '',
    avatarUrl: initialProfile?.avatarUrl || '',
  });

  const [errors, setErrors] = useState({});

  // Derive dirtiness against initialProfile
  const isDirty = React.useMemo(() => {
    if (!initialProfile) return false;
    return (
      formData.name !== (initialProfile.name || '') ||
      formData.bio !== (initialProfile.bio || '') ||
      formData.location !== (initialProfile.location || '') ||
      formData.organization !== (initialProfile.organization || '') ||
      formData.website !== (initialProfile.website || '') ||
      formData.github !== (initialProfile.github || '') ||
      formData.linkedin !== (initialProfile.linkedin || '') ||
      formData.avatarUrl !== (initialProfile.avatarUrl || '')
    );
  }, [formData, initialProfile]);

  useEffect(() => {
    if (onDirtyChange) onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const validate = (data) => {
    const errs = {};
    if (!data.name) {
      errs.name = 'Display name cannot be empty.';
    }
    if (data.name.length > MAX_NAME) {
      errs.name = `Display name cannot exceed ${MAX_NAME} characters.`;
    }
    if (data.bio.length > MAX_BIO) {
      errs.bio = `Bio cannot exceed ${MAX_BIO} characters.`;
    }
    if (data.location.length > MAX_LOCATION) {
      errs.location = `Location cannot exceed ${MAX_LOCATION} characters.`;
    }
    if (data.organization.length > MAX_ORGANIZATION) {
      errs.organization = `College or company cannot exceed ${MAX_ORGANIZATION} characters.`;
    }
    if (data.website && !isWebUrl(data.website)) {
      errs.website = 'Enter a valid website URL.';
    }
    if (data.github && !isGithubValue(data.github)) {
      errs.github = 'Enter a GitHub username or github.com profile URL.';
    }
    if (data.linkedin && !isLinkedinValue(data.linkedin)) {
      errs.linkedin = 'Enter a LinkedIn username or linkedin.com/in profile URL.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalized = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    if (!validate(normalized)) return;
    setFormData(normalized);
    if (onSave) onSave(normalized);
  };

  const bioRemaining = MAX_BIO - (formData.bio?.length || 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card padding="md" className="space-y-5">
        {/* Avatar Uploader */}
        <AvatarUploader
          currentAvatarUrl={formData.avatarUrl}
          username={initialProfile?.username}
          onAvatarChange={(newUrl) => handleChange('avatarUrl', newUrl)}
        />

        <div className="border-t border-border-subtle pt-4 space-y-4">
          {/* Display Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary block">
              {COPY.settings.profileForm.displayNameLabel}
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Alex Morgan"
              error={errors.name}
              maxLength={MAX_NAME}
              className="text-xs"
            />
          </div>

          {/* Bio with character counter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-text-primary">
                {COPY.settings.profileForm.bioLabel}
              </label>
              <span
                className={`text-[11px] font-mono ${
                  bioRemaining < 0 ? 'text-error font-bold' : 'text-text-muted'
                }`}
              >
                {formData.bio.length} / {MAX_BIO}
              </span>
            </div>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Write a brief overview of your background and technical interests..."
              maxLength={MAX_BIO}
              className={`w-full p-2.5 text-xs bg-bg-input border ${
                errors.bio ? 'border-error' : 'border-border-default'
              } text-text-primary placeholder:text-text-muted rounded-[var(--radius-sm)] focus:border-accent focus:outline-none resize-none`}
            />
            {errors.bio && (
              <p className="text-xs text-error mt-1">{errors.bio}</p>
            )}
            <p className="text-[11px] text-text-muted">
              {COPY.settings.profileForm.bioHelp}
            </p>
          </div>

          {/* Location & Organization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary block">
                {COPY.settings.profileForm.locationLabel}
              </label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. San Francisco, CA"
                error={errors.location}
                maxLength={MAX_LOCATION}
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary block">
                {COPY.settings.profileForm.orgLabel}
              </label>
              <Input
                value={formData.organization}
                onChange={(e) => handleChange('organization', e.target.value)}
                placeholder="e.g. University / Tech Corp"
                error={errors.organization}
                maxLength={MAX_ORGANIZATION}
                className="text-xs"
              />
            </div>
          </div>

          {/* Social & Web Links */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              External Profiles
            </h4>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary block">
                {COPY.settings.profileForm.websiteLabel}
              </label>
              <Input
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://yourdomain.dev"
                error={errors.website}
                maxLength={MAX_WEBSITE}
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary block">
                {COPY.settings.profileForm.githubLabel}
              </label>
              <Input
                value={formData.github}
                onChange={(e) => handleChange('github', e.target.value)}
                placeholder="username or URL"
                error={errors.github}
                maxLength={MAX_GITHUB}
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary block">
                {COPY.settings.profileForm.linkedinLabel}
              </label>
              <Input
                value={formData.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
                error={errors.linkedin}
                maxLength={MAX_LINKEDIN}
                className="text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-3 border-t border-border-subtle">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!isDirty || isSaving}
            loading={isSaving}
            className="text-xs font-medium"
          >
            {isSaving ? COPY.settings.profileForm.saving : COPY.settings.profileForm.saveBtn}
          </Button>
        </div>
      </Card>
    </form>
  );
}
