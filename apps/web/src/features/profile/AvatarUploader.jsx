import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { COPY } from '../../constants/copy';

/**
 * AvatarUploader Component
 * Avatar upload with file size validation (max 2MB), format checking (jpg/png/webp),
 * and live square crop preview.
 */
export default function AvatarUploader({
  currentAvatarUrl = '',
  username = '',
  onAvatarChange,
}) {
  const [preview, setPreview] = useState(currentAvatarUrl);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    setError(null);
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid JPG, PNG, or WebP image.');
      return;
    }

    // Validate size: 2MB max
    if (file.size > 2 * 1024 * 1024) {
      setError('File size exceeds 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setPreview(result);
      if (onAvatarChange) onAvatarChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onAvatarChange) onAvatarChange('');
  };

  const initials = (username || 'CK').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-text-primary block">
        {COPY.settings.profileForm.avatarLabel}
      </label>

      <div className="flex items-center gap-4">
        {preview ? (
          <img
            src={preview}
            alt="Avatar preview"
            className="w-20 h-20 rounded-full object-cover border border-border-default shrink-0 bg-bg-surface-subtle"
          />
        ) : (
          <div className="w-20 h-20 rounded-full border border-border-default bg-bg-surface-subtle flex items-center justify-center font-mono font-bold text-accent text-lg shrink-0">
            {initials}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="hidden"
              id="avatar-file-input"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 h-8 text-xs"
            >
              <Upload className="w-3.5 h-3.5 text-text-muted" />
              <span>{COPY.settings.profileForm.uploadBtn}</span>
            </Button>

            {preview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-8 text-xs text-error hover:text-error"
                aria-label="Remove avatar"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                <span>Remove</span>
              </Button>
            )}
          </div>
          <p className="text-[11px] text-text-muted">
            {COPY.settings.profileForm.avatarHelp}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-error" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
