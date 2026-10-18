import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { COPY } from '../../constants/copy';

/**
 * DangerZone Component
 * Account deletion with typed confirmation requirement ("delete my account").
 */
export default function DangerZone({ onDeleteAccount, isDeleting = false }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [typedPhrase, setTypedPhrase] = useState('');
  const [error, setError] = useState('');

  const requiredPhrase = 'delete my account';
  const isMatch = typedPhrase.trim().toLowerCase() === requiredPhrase;

  const handleDelete = async () => {
    if (!isMatch) {
      setError(`Please type "${requiredPhrase}" exactly to confirm.`);
      return;
    }
    setError('');
    if (onDeleteAccount) {
      try {
        await onDeleteAccount(typedPhrase);
      } catch (err) {
        setError(err.message || 'Failed to delete account.');
      }
    }
  };

  return (
    <Card padding="md" className="border-error/40 bg-error/5 space-y-3">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
        <div className="space-y-1 flex-1">
          <h3 className="text-xs font-bold text-error uppercase tracking-wider">
            {COPY.settings.dangerZone.title}
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            {COPY.settings.dangerZone.warning}
          </p>
        </div>
      </div>

      {!isConfirming ? (
        <div className="pt-2 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsConfirming(true)}
            className="text-xs text-error hover:bg-error/10 border border-error/30 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{COPY.settings.dangerZone.deleteBtn}</span>
          </Button>
        </div>
      ) : (
        <div className="pt-3 border-t border-error/20 space-y-3">
          <label className="text-xs text-text-primary block font-medium">
            {COPY.settings.dangerZone.confirmPrompt}
          </label>
          <Input
            value={typedPhrase}
            onChange={(e) => {
              setTypedPhrase(e.target.value);
              setError('');
            }}
            placeholder={COPY.settings.dangerZone.confirmPlaceholder}
            className="font-mono text-xs"
            error={error}
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsConfirming(false);
                setTypedPhrase('');
                setError('');
              }}
              className="text-xs"
            >
              {COPY.settings.dangerZone.cancelBtn}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!isMatch || isDeleting}
              loading={isDeleting}
              onClick={handleDelete}
              className="text-xs bg-error text-white hover:bg-error/90 disabled:opacity-50"
            >
              {COPY.settings.dangerZone.confirmDeleteBtn}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
