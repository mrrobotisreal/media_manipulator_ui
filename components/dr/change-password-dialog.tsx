'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { drAuthErrorMessage, drChangePassword } from '@/lib/dr/auth';

// In-app password change (Part A — client-side Firebase only, zero backend).
// Current password → reauthenticate → updatePassword. On success Firebase
// revokes the OTHER sessions' refresh tokens, so other signed-in devices get
// signed out shortly after — while THIS session keeps working. The DR API is
// unaffected either way: outstanding Firebase ID tokens remain valid until
// their normal expiry, so API calls keep succeeding right through the change.

const MIN_PASSWORD_CHARS = 10;

interface FieldErrors {
  current?: string;
  next?: string;
  confirm?: string;
  submit?: string;
}

export default function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  const reset = () => {
    setCurrent('');
    setNext('');
    setConfirm('');
    setErrors({});
    setPending(false);
  };

  const close = (o: boolean) => {
    if (!o) reset(); // fields never survive a closed dialog
    onOpenChange(o);
  };

  const submit = async () => {
    const fieldErrors: FieldErrors = {};
    if (!current) fieldErrors.current = 'Enter your current password.';
    if (next.length < MIN_PASSWORD_CHARS) {
      fieldErrors.next = `New password must be at least ${MIN_PASSWORD_CHARS} characters.`;
    } else if (next === current) {
      fieldErrors.next = 'New password must be different from the current one.';
    }
    if (confirm !== next) fieldErrors.confirm = "Passwords don't match.";
    setErrors(fieldErrors);
    if (fieldErrors.current || fieldErrors.next || fieldErrors.confirm) return;

    setPending(true);
    try {
      await drChangePassword(current, next);
      close(false);
      toast.success('Password updated. Other signed-in devices will be signed out.');
    } catch (err) {
      // drChangePassword's own session-expired message is already friendly;
      // Firebase errors go through the code → message mapper.
      const message =
        err instanceof Error && err.message.includes('session has expired')
          ? err.message
          : drAuthErrorMessage(err);
      setErrors({ submit: message });
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Enter your current password, then choose a new one (at least {MIN_PASSWORD_CHARS} characters).
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
          className="space-y-3"
        >
          <PasswordField
            label="Current password"
            autoComplete="current-password"
            value={current}
            onChange={setCurrent}
            error={errors.current}
          />
          <PasswordField
            label="New password"
            autoComplete="new-password"
            value={next}
            onChange={setNext}
            error={errors.next}
          />
          <PasswordField
            label="Confirm new password"
            autoComplete="new-password"
            value={confirm}
            onChange={setConfirm}
            error={errors.confirm}
          />
          {errors.submit && <p className="text-sm text-destructive">{errors.submit}</p>}
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => close(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              Update password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PasswordField({
  label,
  autoComplete,
  value,
  onChange,
  error,
}: {
  label: string;
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">
        {label}
        <div className="relative mt-1">
          <Input
            type={visible ? 'text' : 'password'}
            autoComplete={autoComplete}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={!!error}
            className="pr-9"
          />
          <button
            type="button"
            aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground hover:text-foreground"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
