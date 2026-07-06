'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DrApiError } from '@/lib/dr/apiClient';
import { useFeedbackActions } from '@/lib/dr/useDrFeedback';

// Live slug validation mirroring the server's channel-name rule.
const CHANNEL_NAME_RE = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

export default function NewChannelDialog() {
  const router = useRouter();
  const { createConversation } = useFeedbackActions();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const normalized = name.trim().toLowerCase();
  const nameValid = normalized.length >= 2 && normalized.length <= 80 && CHANNEL_NAME_RE.test(normalized);
  const showNameError = name.trim().length > 0 && !nameValid;

  const reset = () => {
    setName('');
    setTopic('');
    setError(null);
  };

  const submit = async () => {
    if (!nameValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const convo = await createConversation({ kind: 'channel', name: normalized, topic: topic.trim() || undefined });
      setOpen(false);
      reset();
      router.push(`/dr/feedback/c/${convo.id}`);
    } catch (e) {
      if (e instanceof DrApiError && e.status === 409) setError('A channel with that name already exists.');
      else setError(e instanceof Error ? e.message : 'Failed to create channel.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="New channel"
          className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Plus className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New channel</DialogTitle>
          <DialogDescription>Channels are open to everyone in the portal.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="dr-channel-name">Name</Label>
            <div className="flex items-center gap-2 rounded-md border border-input px-3 focus-within:border-ring">
              <span className="text-muted-foreground">#</span>
              <Input
                id="dr-channel-name"
                value={name}
                autoFocus
                placeholder="general"
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void submit();
                  }
                }}
                className="border-0 px-0 shadow-none focus-visible:ring-0"
              />
            </div>
            {showNameError && (
              <p className="text-xs text-destructive">
                Lowercase letters, numbers, hyphens and underscores only; 2–80 characters.
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dr-channel-topic">Topic (optional)</Label>
            <Input
              id="dr-channel-topic"
              value={topic}
              maxLength={250}
              placeholder="What's this channel about?"
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => void submit()} disabled={!nameValid || submitting}>
            {submitting ? 'Creating…' : 'Create channel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
