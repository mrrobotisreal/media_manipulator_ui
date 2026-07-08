'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2, MessageSquare, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useChatLabSessions,
  useCreateChatLabSession,
  useDeleteChatLabSession,
  useRenameChatLabSession,
} from '@/lib/dr/useDrChatLab';
import type { ChatLabSession } from '@/schemas/drChatLab';

// The chat-lab sidebar: New Chat on top, a divider, then previous chats grouped
// by recency (Today / Yesterday / Previous 7 days / Older). Rename + delete via
// a per-item menu, enabled only for the creator (isMine) — the server
// re-enforces either way.

type RecencyGroup = 'Today' | 'Yesterday' | 'Previous 7 days' | 'Older';

function recencyGroup(iso: string, now = new Date()): RecencyGroup {
  const then = new Date(iso);
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(now) - startOfDay(then)) / 86_400_000);
  if (dayDiff <= 0) return 'Today';
  if (dayDiff === 1) return 'Yesterday';
  if (dayDiff <= 7) return 'Previous 7 days';
  return 'Older';
}

const GROUP_ORDER: RecencyGroup[] = ['Today', 'Yesterday', 'Previous 7 days', 'Older'];

interface ChatLabSidebarProps {
  /** Called after any navigation (mobile sheet closes itself). */
  onNavigate?: () => void;
}

export default function ChatLabSidebar({ onNavigate }: ChatLabSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: sessions, isLoading } = useChatLabSessions();
  const createSession = useCreateChatLabSession();
  const renameSession = useRenameChatLabSession();
  const deleteSession = useDeleteChatLabSession();

  const activeId = useMemo(() => pathname?.match(/^\/dr\/demos\/chat-lab\/c\/([^/?]+)/)?.[1] ?? null, [pathname]);

  const [renaming, setRenaming] = useState<ChatLabSession | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleting, setDeleting] = useState<ChatLabSession | null>(null);

  const groups = useMemo(() => {
    const map = new Map<RecencyGroup, ChatLabSession[]>();
    for (const s of sessions ?? []) {
      const g = recencyGroup(s.updatedAt);
      map.set(g, [...(map.get(g) ?? []), s]);
    }
    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => [g, map.get(g) as ChatLabSession[]] as const);
  }, [sessions]);

  const handleNewChat = async () => {
    try {
      const session = await createSession.mutateAsync();
      router.push(`/dr/demos/chat-lab/c/${session.id}`);
      onNavigate?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create chat');
    }
  };

  const handleRename = async () => {
    if (!renaming) return;
    const title = renameValue.trim();
    if (!title || title.length > 120) {
      toast.error('Title must be 1–120 characters');
      return;
    }
    try {
      await renameSession.mutateAsync({ sessionId: renaming.id, title });
      setRenaming(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to rename chat');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const wasActive = deleting.id === activeId;
    try {
      await deleteSession.mutateAsync(deleting.id);
      setDeleting(null);
      if (wasActive) {
        router.push('/dr/demos/chat-lab');
        onNavigate?.();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete chat');
    }
  };

  return (
    <nav className="flex h-full w-full flex-col p-2">
      <Button onClick={() => void handleNewChat()} disabled={createSession.isPending} className="w-full justify-start gap-2">
        {createSession.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        New Chat
      </Button>
      <Separator className="my-2" />

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
        {isLoading && (
          <div className="space-y-2 px-1 pt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-7 animate-pulse rounded-md bg-muted/60" />
            ))}
          </div>
        )}

        {!isLoading && (sessions?.length ?? 0) === 0 && (
          <p className="px-2 py-3 text-xs text-muted-foreground">No chats yet — start one!</p>
        )}

        {groups.map(([group, list]) => (
          <div key={group}>
            <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {group}
            </div>
            <div className="space-y-0.5">
              {list.map((s) => (
                <div
                  key={s.id}
                  className={cn(
                    'group flex items-center gap-1 rounded-md text-sm text-foreground/80 transition-colors hover:bg-accent/50',
                    activeId === s.id && 'bg-accent font-medium text-foreground',
                  )}
                >
                  <Link
                    href={`/dr/demos/chat-lab/c/${s.id}`}
                    onClick={onNavigate}
                    className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5"
                    title={s.title}
                  >
                    <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">{s.title}</span>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Options for ${s.title}`}
                        className="mr-1 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground focus:opacity-100 group-hover:opacity-100 data-[state=open]:opacity-100"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        disabled={!s.isMine}
                        onSelect={() => {
                          setRenaming(s);
                          setRenameValue(s.title);
                        }}
                      >
                        <Pencil className="size-4" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" disabled={!s.isMine} onSelect={() => setDeleting(s)}>
                        <Trash2 className="size-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Rename dialog */}
      <Dialog open={!!renaming} onOpenChange={(o) => !o && setRenaming(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename chat</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            maxLength={120}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void handleRename();
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenaming(null)}>
              Cancel
            </Button>
            <Button onClick={() => void handleRename()} disabled={renameSession.isPending}>
              {renameSession.isPending && <Loader2 className="size-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleting?.title}” and all of its messages and attachments will be permanently deleted. This can&apos;t
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteSession.isPending && <Loader2 className="size-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}
