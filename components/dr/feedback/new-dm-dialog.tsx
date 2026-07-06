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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFeedbackActions, useFeedbackUsers } from '@/lib/dr/useDrFeedback';
import { displayNameFromEmail } from './display';

export default function NewDmDialog() {
  const router = useRouter();
  const { createConversation } = useFeedbackActions();
  const { data: users } = useFeedbackUsers();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const others = (users ?? []).filter((u) => !u.isMe);

  const submit = async () => {
    if (!email || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      // Handles the "already exists → 200" case identically — the server returns
      // the existing conversation and we simply navigate to it.
      const convo = await createConversation({ kind: 'dm', participantEmail: email });
      setOpen(false);
      setEmail('');
      router.push(`/dr/feedback/c/${convo.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start conversation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setEmail('');
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="New direct message"
          className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Plus className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New direct message</DialogTitle>
          <DialogDescription>Start a private conversation with another portal member.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Person</Label>
            <Select value={email} onValueChange={setEmail}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a person" />
              </SelectTrigger>
              <SelectContent>
                {others.map((u) => (
                  <SelectItem key={u.email} value={u.email}>
                    {displayNameFromEmail(u.email)}
                    <span className="ml-1 text-muted-foreground">({u.email})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {others.length === 0 && <p className="text-sm text-muted-foreground">No other portal members are available yet.</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => void submit()} disabled={!email || submitting}>
            {submitting ? 'Opening…' : 'Start conversation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
