'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { DrDocContent } from '@/schemas/drDocs';
import { isTextAnchorLive, type DrComment, type DrCommentAnchor } from '@/schemas/drComments';
import type { useDrCommentActions } from '@/lib/dr/useDrComments';
import CommentCard from './comment-card';
import CommentComposer from './comment-composer';

type Actions = ReturnType<typeof useDrCommentActions>;
const GAP = 12;

export interface CommentDraft {
  commentId: string;
  anchor: DrCommentAnchor;
}

interface CommentsSidebarProps {
  content: DrDocContent;
  comments: DrComment[];
  articleRef: React.RefObject<HTMLDivElement | null>;
  activeCommentId: string | null;
  onActivate: (id: string | null) => void;
  currentUserEmail: string;
  actions: Actions;
  draft: CommentDraft | null;
  onDraftResolved: () => void;
}

const DRAFT_KEY = '__draft__';

function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return desktop;
}

function isOrphan(content: DrDocContent, c: DrComment): boolean {
  if (c.anchor.type !== 'text') return false;
  return !isTextAnchorLive(content.blocks[c.anchor.blockIndex], c.anchor);
}

function findAnchorEl(article: HTMLElement, anchor: DrCommentAnchor, commentId: string | null): HTMLElement | null {
  if (anchor.type === 'block') {
    return article.querySelector(`[data-block-index="${anchor.blockIndex}"]`);
  }
  const token = commentId ?? '__pending__';
  return article.querySelector(`mark[data-comment-ids~="${token}"]`);
}

export default function CommentsSidebar({
  content,
  comments,
  articleRef,
  activeCommentId,
  onActivate,
  currentUserEmail,
  actions,
  draft,
  onDraftResolved,
}: CommentsSidebarProps) {
  const desktop = useIsDesktop();
  const columnRef = useRef<HTMLDivElement>(null);
  const wrapperRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const draftTextareaRef = useRef<HTMLTextAreaElement>(null);
  const focusedDraftRef = useRef<string | null>(null);
  const scrolledActiveRef = useRef<string | null>(null);
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [containerHeight, setContainerHeight] = useState(0);
  // Keys whose card has already painted at a real position at least once. ONLY
  // these carry the `top` transition, so a card's FIRST placement is instant —
  // there is no top:0 → realY animation for scrollIntoView to chase (see the
  // INVARIANT note by the wrapper markup below).
  const [positionedKeys, setPositionedKeys] = useState<Set<string>>(new Set());

  const anchored = comments.filter((c) => !isOrphan(content, c));
  const orphaned = comments.filter((c) => isOrphan(content, c));

  // Aligned items = the active draft (if any) + anchored comments.
  const alignedKeys = [...(draft ? [DRAFT_KEY] : []), ...anchored.map((c) => c.id)];
  // Stable string keys for hook dependency lists (the lint rule requires simple
  // dependency expressions).
  const anchoredIds = anchored.map((c) => c.id).join(',');
  const alignedKeysStr = alignedKeys.join(',');

  const recompute = useCallback(() => {
    if (!desktop) return;
    const article = articleRef.current;
    const column = columnRef.current;
    if (!article || !column) return;
    const columnTop = column.getBoundingClientRect().top;

    const items = alignedKeys.map((key) => {
      const wrapper = wrapperRefs.current.get(key);
      const height = wrapper?.offsetHeight ?? 0;
      let targetY = 0;
      if (key === DRAFT_KEY && draft) {
        const el = findAnchorEl(article, draft.anchor, null);
        if (el) targetY = el.getBoundingClientRect().top - columnTop;
      } else {
        const c = anchored.find((x) => x.id === key);
        if (c) {
          const el = findAnchorEl(article, c.anchor, c.id);
          if (el) targetY = el.getBoundingClientRect().top - columnTop;
        }
      }
      return { key, targetY: Math.max(0, targetY), height };
    });

    items.sort((a, b) => a.targetY - b.targetY);

    const next: Record<string, number> = {};
    let cursor = 0;
    for (const item of items) {
      const y = Math.max(item.targetY, cursor);
      next[item.key] = y;
      cursor = y + item.height + GAP;
    }

    setPositions((prev) => (shallowEqualNums(prev, next) ? prev : next));
    setContainerHeight((prev) => (Math.abs(prev - cursor) < 1 ? prev : cursor));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktop, articleRef, draft, anchoredIds, alignedKeysStr]);

  // Re-align after render and whenever inputs change.
  useLayoutEffect(() => {
    recompute();
  }, [recompute, comments, activeCommentId]);

  // Re-align on article/card size changes and window resize.
  useEffect(() => {
    if (!desktop) return;
    const ro = new ResizeObserver(() => recompute());
    if (articleRef.current) ro.observe(articleRef.current);
    for (const el of wrapperRefs.current.values()) ro.observe(el);
    const onResize = () => recompute();
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [desktop, recompute, alignedKeysStr]);

  // Post-paint: after a commit in which a key gained a real position, mark that
  // key "positioned" so subsequent renders give it the `top` transition. Because
  // this runs a commit LATER than the one that set `top`, the first visible frame
  // is transition-free (instant placement); later re-alignments animate. Keys
  // that leave `positions` (draft resolved, comment removed) drop out, so a
  // future card of the same key starts fresh (instant again).
  useEffect(() => {
    setPositionedKeys((prev) => {
      const keys = Object.keys(positions);
      const next = new Set(keys);
      if (next.size === prev.size && keys.every((k) => prev.has(k))) return prev;
      return next;
    });
  }, [positions]);

  // Bring a card minimally into view — but ONLY once its live rect matches its
  // computed top (i.e. it is NOT mid-transition). Polls via rAF for a bounded
  // number of frames; if it never settles, skip the scroll entirely (skipping is
  // strictly better than scrolling toward a moving target and hijacking the
  // viewport). block:'nearest' is a no-op when already fully visible.
  const settleAndReveal = useCallback(
    (key: string, expectedTop: number) => {
      let frames = 0;
      const tick = () => {
        const wrapper = wrapperRefs.current.get(key);
        const column = columnRef.current;
        if (!wrapper || !column) return;
        const actual = wrapper.getBoundingClientRect().top - column.getBoundingClientRect().top;
        if (Math.abs(actual - expectedTop) <= 2) {
          wrapper.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          return;
        }
        if (frames++ < 10) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    [],
  );

  // Focus the draft composer's textarea once its card has a committed position
  // (on desktop) — imperatively, with preventScroll, so opening the composer
  // never moves the viewport. Then bring the card just barely into view (only
  // after it has settled at its real position).
  useEffect(() => {
    if (!draft) {
      focusedDraftRef.current = null;
      return;
    }
    const draftTop = positions[DRAFT_KEY];
    if (desktop && draftTop === undefined) return; // wait for the position
    if (focusedDraftRef.current === draft.commentId) return;
    focusedDraftRef.current = draft.commentId;
    draftTextareaRef.current?.focus({ preventScroll: true });
    if (desktop && draftTop !== undefined) {
      settleAndReveal(DRAFT_KEY, draftTop);
    } else {
      wrapperRefs.current.get(DRAFT_KEY)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [draft, desktop, positions, settleAndReveal]);

  // Scroll the active card into view when activation changes — but NOT while its
  // position is still unknown on desktop, and only once it has settled. Scroll
  // once per activation, not on every recompute.
  useEffect(() => {
    if (!activeCommentId) {
      scrolledActiveRef.current = null;
      return;
    }
    const activeTop = positions[activeCommentId];
    if (desktop && activeTop === undefined) return;
    if (scrolledActiveRef.current === activeCommentId) return;
    scrolledActiveRef.current = activeCommentId;
    if (desktop && activeTop !== undefined) {
      settleAndReveal(activeCommentId, activeTop);
    } else {
      wrapperRefs.current.get(activeCommentId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeCommentId, desktop, positions, settleAndReveal]);

  const setWrapperRef = (key: string) => (el: HTMLDivElement | null) => {
    if (el) wrapperRefs.current.set(key, el);
    else wrapperRefs.current.delete(key);
  };

  const draftComposer = draft ? (
    <CommentComposer
      authorEmail={currentUserEmail}
      textareaRef={draftTextareaRef}
      upload={(file, onProgress) => actions.uploadCommentAttachment(draft.commentId, file, onProgress)}
      deleteAttachment={actions.deleteAttachment}
      onPublish={async (body) => {
        await actions.publishComment(draft.commentId, body);
        onDraftResolved();
      }}
      onCancel={async () => {
        await actions.cancelDraftComment(draft.commentId);
        onDraftResolved();
      }}
    />
  ) : null;

  const renderCard = (c: DrComment) => (
    <CommentCard
      comment={c}
      active={c.id === activeCommentId}
      orphaned={isOrphan(content, c)}
      currentUserEmail={currentUserEmail}
      actions={actions}
      onActivate={() => onActivate(c.id)}
    />
  );

  const empty = comments.length === 0 && !draft;

  // Mobile / narrow: simple stacked section (no floating alignment).
  if (!desktop) {
    return (
      <div className="space-y-3">
        {draft && <div ref={setWrapperRef(DRAFT_KEY)}>{draftComposer}</div>}
        {comments.map((c) => (
          <div key={c.id} ref={setWrapperRef(c.id)}>
            {renderCard(c)}
          </div>
        ))}
        {empty && <p className="text-sm text-muted-foreground">No comments yet. Select text to add one.</p>}
      </div>
    );
  }

  // Desktop: greedy Google-Docs alignment for anchored items + a stacked
  // "No longer anchored" section for orphans.
  return (
    <div>
      <div ref={columnRef} className="relative" style={{ height: containerHeight }}>
        {/* INVARIANT: a card's first visible painted frame must be at its final
            computed `top`. Cards must never carry a top-transition on first
            placement — a visible card animating from top:0 is what scrollIntoView
            chases, hijacking the viewport to the top of the page (bug fixed in
            v4; see also the no-autofocus note in comment-composer.tsx). Hence:
            transition ONLY once the key is in `positionedKeys` (added a commit
            after its position lands), and `invisible` until the position is
            known so nothing ever paints at top:0. */}
        {draft && (
          <div
            ref={setWrapperRef(DRAFT_KEY)}
            className={cn(
              'absolute w-full',
              positionedKeys.has(DRAFT_KEY) && 'transition-[top] duration-150',
              positions[DRAFT_KEY] === undefined && 'invisible',
            )}
            style={{ top: positions[DRAFT_KEY] ?? 0 }}
          >
            {draftComposer}
          </div>
        )}
        {anchored.map((c) => (
          <div
            key={c.id}
            ref={setWrapperRef(c.id)}
            className={cn(
              'absolute w-full',
              positionedKeys.has(c.id) && 'transition-[top] duration-150',
              positions[c.id] === undefined && 'invisible',
            )}
            style={{ top: positions[c.id] ?? 0 }}
          >
            {renderCard(c)}
          </div>
        ))}
      </div>

      {orphaned.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="border-t border-border pt-3 text-xs font-medium text-muted-foreground">No longer anchored</div>
          {orphaned.map((c) => (
            <div key={c.id} ref={setWrapperRef(c.id)}>
              {renderCard(c)}
            </div>
          ))}
        </div>
      )}

      {empty && <p className="text-sm text-muted-foreground">No comments yet. Select text to add one.</p>}
    </div>
  );
}

function shallowEqualNums(a: Record<string, number>, b: Record<string, number>): boolean {
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  return ak.every((k) => Math.abs((a[k] ?? NaN) - (b[k] ?? NaN)) < 1);
}
