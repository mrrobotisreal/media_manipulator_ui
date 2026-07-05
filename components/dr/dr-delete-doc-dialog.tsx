'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteDrDoc } from '@/lib/dr/docEditorApi';

interface DrDeleteDocDialogProps {
  docId: string;
  slug: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

// Shared creator-only soft-delete confirmation. On confirm it soft-deletes the
// document, invalidates the docs list + the specific doc query, toasts, and runs
// onDeleted (list rows do nothing extra; the viewer navigates away).
export default function DrDeleteDocDialog({ docId, slug, title, open, onOpenChange, onDeleted }: DrDeleteDocDialogProps) {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDrDoc(docId);
      await queryClient.invalidateQueries({ queryKey: ['dr', 'docs'] });
      queryClient.removeQueries({ queryKey: ['dr', 'docs', slug] });
      toast.success('Document deleted');
      onOpenChange(false);
      onDeleted();
    } catch (err) {
      toast.error('Could not delete document', { description: err instanceof Error ? err.message : undefined });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => !deleting && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{title}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This document will be removed from the portal for everyone. Comments and version history are preserved for
            archival purposes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          {/* Plain destructive Button (not AlertDialogAction) so the dialog stays
              open with a spinner until the request resolves. */}
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting && <Loader2 className="size-4 animate-spin" />}
            Delete document
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
