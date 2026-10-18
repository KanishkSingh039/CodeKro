import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AvatarUploader from './AvatarUploader';
import { COPY } from '../../constants/copy';

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

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Display name cannot be empty.';
    }
    if (formData.bio.length > 160) {
      errs.bio = 'Bio cannot exceed 160 characters.';
    }
    // Optional URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    if (formData.website && !urlPattern.test(formData.website)) {
      errs.website = 'Please enter a valid website URL.';
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
    if (!validate()) return;
    if (onSave) onSave(formData);
  };

  const maxBio = 160;
  const bioRemaining = maxBio - (formData.bio?.length || 0);

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
                {formData.bio.length} / {maxBio}
              </span>
            </div>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Write a brief overview of your background and technical interests..."
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
