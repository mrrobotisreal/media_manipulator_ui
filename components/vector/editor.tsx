'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Circle,
  Download,
  FileUp,
  Hand,
  Loader2,
  Maximize,
  Minus,
  MousePointer2,
  PenTool,
  Plus,
  Redo2,
  Spline,
  Square,
  Trash2,
  Type,
  Undo2,
  History,
  Cloud,
  CloudOff,
  FileJson,
  AlertTriangle,
} from 'lucide-react';
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
import { Wordmark } from '@/components/darkroom/wordmark';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { saveBlobToDisk } from '@/lib/results/save';
import { MOTION_BRAND } from '@/lib/vector/brand';
import { evaluateVectorDraft, formatRelativeTime, summarizeVectorDraft } from '@/lib/vector/draftRecovery';
import {
  createDraftWriter,
  deleteVectorDraft,
  getVectorDraft,
  pruneVectorDrafts,
  putVectorDraft,
  type VectorDraft,
} from '@/lib/vector/draftStore';
import { serializeSvg, svgFileName } from '@/lib/vector/exportSvg';
import { parseSvg, SvgImportError, type ImportWarning } from '@/lib/vector/importSvg';
import { blankDoc, classifyProjectId, docFileName, newLocalProjectId } from '@/lib/vector/projects';
import { VectorApiError, getVectorProject } from '@/lib/vector/projectsApi';
import { getCurrentIdToken } from '@/lib/firebase';
import { TOOL_SHORTCUTS, type DrawToolId, type ToolId } from '@/lib/vector/tools/types';
import { useVectorStore } from '@/lib/vector/vectorStore';
import { VECTOR_MAX_DOC_BYTES, parseVectorDoc, serializeVectorDoc } from '@/lib/vector/vectorTypes';
import { cn } from '@/lib/utils';
import { VectorCanvas, fitView, zoomAt, type View } from './canvas';
import { Inspector } from './inspector';
import { IconButton, LayerPanel } from './layer-panel';
import { ExportDialog } from './export-dialog';
import { Timeline } from './timeline';
import { usePlayback } from './use-playback';
import { useSignedIn } from './use-signed-in';
import { useProjectSync, type ProjectSync } from './use-project-sync';

export interface MotionEditorProps {
  projectId: string;
  /**
   * Ticket decision 10: the single analytics seam. MM49 passes a callback that
   * emits `vector_tool_used`; MM42 emits nothing.
   */
  onToolUsed?: (tool: DrawToolId) => void;
}

const TOOLS: Array<{ id: ToolId; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'select', icon: MousePointer2 },
  { id: 'node', icon: Spline },
  { id: 'rect', icon: Square },
  { id: 'ellipse', icon: Circle },
  { id: 'line', icon: Minus },
  { id: 'pen', icon: PenTool },
  { id: 'text', icon: Type },
  { id: 'hand', icon: Hand },
];

type Phase =
  | { kind: 'loading' }
  | { kind: 'ready' }
  | { kind: 'recover'; draft: VectorDraft }
  /** MM44: an account project could not be opened. */
  | { kind: 'error'; reason: 'signin' | 'notFound' | 'failed' | 'unreadable' };

/**
 * The Motion editor shell (`/motion/[projectId]`, chromeless). MM42 scope:
 * blank canvas or SVG import, editing, IndexedDB crash-recovery drafts and
 * the free, uncounted static SVG export. MM44 adds the timeline, the export
 * dialog (counted animated SVG) and account projects (save / load / 409).
 *
 * The chrome follows the locale's direction (Hebrew/Arabic mirror); the canvas
 * itself stays LTR.
 */
export default function MotionEditor({ projectId, onToolUsed }: MotionEditorProps) {
  const { t, dir } = useLocalization('interface');
  const localized = useLocalizedHref();
  const doc = useVectorStore((s) => s.doc);
  const tool = useVectorStore((s) => s.tool);
  const canUndo = useVectorStore((s) => s.past.length > 0);
  const canRedo = useVectorStore((s) => s.future.length > 0);
  const name = useVectorStore((s) => s.name);
  const [phase, setPhase] = React.useState<Phase>({ kind: 'loading' });
  const [view, setView] = React.useState<View>({ zoom: 1, panX: 0, panY: 0 });
  const [warnings, setWarnings] = React.useState<ImportWarning[] | null>(null);
  const [importing, setImporting] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const idRef = React.useRef<string | null>(null);
  // MM44: the preview clock (play shares the scrub render path).
  usePlayback();
  const signedIn = useSignedIn();
  const [exportOpen, setExportOpen] = React.useState(false);
  const [initialServer, setInitialServer] = React.useState<{ id: string; revision: number } | null>(null);
  const [signInOpen, setSignInOpen] = React.useState(false);
  const [reloadAsk, setReloadAsk] = React.useState(false);
  const sync = useProjectSync({ ready: phase.kind === 'ready', signedIn, initialServer });
  const serverRef = React.useRef(sync.server);
  React.useEffect(() => {
    serverRef.current = sync.server;
  }, [sync.server]);

  // ---- save (MM44) ----
  const onSave = React.useCallback(() => {
    if (!sync.available) return;
    if (signedIn !== true) {
      setSignInOpen(true);
      return;
    }
    void sync.saveNow();
  }, [signedIn, sync]);
  const saveRef = React.useRef<(() => void) | null>(null);
  React.useEffect(() => {
    saveRef.current = sync.available ? onSave : null;
  }, [onSave, sync.available]);

  // ---- open: classify the id, look for a draft, maybe prompt ----
  React.useEffect(() => {
    let cancelled = false;
    const route = classifyProjectId(projectId);
    if (route.kind === 'invalid') return;
    void (async () => {
      void pruneVectorDrafts();
      if (route.kind === 'new') {
        const id = newLocalProjectId();
        idRef.current = id;
        useVectorStore.getState().load(id, blankDoc(), t('vector.untitled'));
        // Keep the URL stable across reloads without a navigation (Next 16
        // integrates history.replaceState with the router).
        try {
          window.history.replaceState(null, '', `/motion/${id}`);
        } catch {
          // ignore (sandboxed iframes)
        }
        if (!cancelled) setPhase({ kind: 'ready' });
        return;
      }
      idRef.current = route.id;
      if (route.kind === 'server') return; // opened below, once Firebase has restored the session
      const draft = await getVectorDraft(route.id);
      if (cancelled) return;
      const decision = evaluateVectorDraft(draft, blankDoc());
      if (decision === 'recover' && draft) {
        setPhase({ kind: 'recover', draft });
        return;
      }
      useVectorStore.getState().load(route.id, blankDoc(), draft?.name || t('vector.untitled'));
      setPhase({ kind: 'ready' });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open once per route id
  }, [projectId]);

  // ---- open an account project (MM44): GET it, then compare with the draft ----
  const openedServer = React.useRef<string | null>(null);
  React.useEffect(() => {
    const route = classifyProjectId(projectId);
    if (route.kind !== 'server' || signedIn === null || openedServer.current === route.id) return;
    openedServer.current = route.id;
    let cancelled = false;
    void (async () => {
      const token = signedIn ? await getCurrentIdToken() : null;
      if (!token) {
        if (!cancelled) setPhase({ kind: 'error', reason: 'signin' });
        openedServer.current = null; // retry once the user signs in (another tab)
        return;
      }
      try {
        const p = await getVectorProject(token, route.id);
        const draft = await getVectorDraft(route.id);
        if (cancelled) return;
        setInitialServer({ id: p.id, revision: p.revision });
        // A draft newer than the server copy and based on it is offered; older ones are stale.
        const decision = evaluateVectorDraft(draft, p.document, Date.parse(p.updatedAt) || undefined);
        if (decision === 'recover' && draft && (draft.baseRevision === null || draft.baseRevision >= p.revision)) {
          useVectorStore.getState().load(p.id, p.document, p.name);
          setPhase({ kind: 'recover', draft });
          return;
        }
        if (draft && decision !== 'recover') void deleteVectorDraft(route.id);
        useVectorStore.getState().load(p.id, p.document, p.name || t('vector.untitled'));
        setPhase({ kind: 'ready' });
      } catch (e) {
        if (cancelled) return;
        const err = e instanceof VectorApiError ? e : null;
        setPhase({
          kind: 'error',
          reason: err?.status === 404 ? 'notFound' : err?.status === 401 ? 'signin' : err?.code === 'vector_doc_unreadable' ? 'unreadable' : 'failed',
        });
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open once per route id, after auth resolves
  }, [projectId, signedIn]);

  React.useEffect(() => () => useVectorStore.getState().close(), []);

  // ---- drafts: 2 s debounce after the last change, flush on hide ----
  React.useEffect(() => {
    if (phase.kind !== 'ready') return;
    const writer = createDraftWriter(() => {
      const s = useVectorStore.getState();
      if (!s.doc || !s.projectId) return;
      void putVectorDraft({
        projectId: s.projectId,
        name: s.name,
        savedAt: Date.now(),
        baseRevision: serverRef.current?.revision ?? null,
        document: s.doc,
      });
    });
    let last = useVectorStore.getState().revision;
    const unsub = useVectorStore.subscribe((s) => {
      if (s.revision !== last) {
        last = s.revision;
        writer.notifyChange();
      }
    });
    const onHide = () => writer.flush();
    const onVis = () => document.visibilityState === 'hidden' && writer.flush();
    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      writer.flush();
      writer.dispose();
      unsub();
      window.removeEventListener('pagehide', onHide);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [phase.kind]);

  // ---- fit the canvas when a document arrives / the stage resizes ----
  const fit = React.useCallback(() => {
    const el = stageRef.current;
    const d = useVectorStore.getState().doc;
    if (!el || !d) return;
    setView(fitView(d, el.clientWidth, el.clientHeight));
  }, []);
  const docId = doc ? `${doc.canvas.viewBox.width}x${doc.canvas.viewBox.height}` : null;
  React.useEffect(() => {
    if (phase.kind === 'ready') fit();
  }, [phase.kind, docId, fit]);

  const zoomBy = React.useCallback((factor: number) => {
    const el = stageRef.current;
    setView((v) => zoomAt(v, factor, { x: (el?.clientWidth ?? 0) / 2, y: (el?.clientHeight ?? 0) / 2 }));
  }, []);

  // ---- shortcuts ----
  React.useEffect(() => {
    if (phase.kind !== 'ready') return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      const s = useVectorStore.getState();
      const mod = e.metaKey || e.ctrlKey;
      const k = e.key.toLowerCase();
      if (mod && k === 'z') {
        e.preventDefault();
        if (e.shiftKey) s.redo();
        else s.undo();
        return;
      }
      if (mod && k === 'y') {
        e.preventDefault();
        s.redo();
        return;
      }
      if (mod && k === 'g') {
        e.preventDefault();
        if (e.shiftKey) s.ungroupSelection();
        else s.groupSelection();
        return;
      }
      if (mod && k === 'd') {
        e.preventDefault();
        s.duplicateSelection();
        return;
      }
      if (mod && k === 'a') {
        e.preventDefault();
        s.selectAll();
        return;
      }
      // MM44: keyframe clipboard (layers have Duplicate, Cmd+D).
      if (mod && k === 'c' && s.keySelection.length > 0) {
        e.preventDefault();
        s.copySelectedKeys();
        return;
      }
      if (mod && k === 'v' && s.keyClipboard) {
        e.preventDefault();
        s.pasteKeys();
        return;
      }
      if (mod && k === 's') {
        e.preventDefault();
        // MM44: Cmd+S saves (account projects / signed in); otherwise the free static SVG.
        if (saveRef.current) saveRef.current();
        else exportSvg();
        return;
      }
      if (mod && (k === ']' || k === '[')) {
        e.preventDefault();
        s.restack(k === ']' ? 'up' : 'down', e.shiftKey);
        return;
      }
      if (mod && (k === '=' || k === '+' || k === '-' || k === '0')) {
        e.preventDefault();
        if (k === '0') fit();
        else zoomBy(k === '-' ? 1 / 1.25 : 1.25);
        return;
      }
      if (mod || e.altKey) return;
      // MM44 transport: Home / End (space is handled on keyup, see below).
      if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        s.setPlaying(false);
        if (s.doc) s.setTime(e.key === 'Home' ? (s.range?.start ?? 0) : (s.range?.end ?? s.doc.duration));
        return;
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && s.keySelection.length > 0) {
        e.preventDefault();
        s.deleteSelectedKeys();
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (s.selection.length > 0 && !(s.tool === 'pen' || s.tool === 'text')) {
          e.preventDefault();
          s.deleteSelection();
        }
        return;
      }
      if (e.key === 'Escape' && s.tool === 'select') {
        s.setSelection([]);
        return;
      }
      const hit = (Object.entries(TOOL_SHORTCUTS) as Array<[ToolId, string]>).find(([, key]) => key === k);
      if (hit) s.setTool(hit[0]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase.kind, fit, zoomBy]);

  // ---- space = play/pause (MM44). A TAP toggles; holding space and dragging
  // the canvas still pans (MM42), so the toggle fires on keyup only when no
  // pointer went down while space was held. ----
  React.useEffect(() => {
    if (phase.kind !== 'ready') return;
    let held = false;
    let panned = false;
    const typing = (el: EventTarget | null) => {
      const target = el as HTMLElement | null;
      return !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName));
    };
    const down = (e: KeyboardEvent) => {
      if (e.key !== ' ' || typing(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      if (e.repeat) return;
      held = true;
      panned = false;
    };
    const up = (e: KeyboardEvent) => {
      if (e.key !== ' ' || !held) return;
      held = false;
      if (!panned) useVectorStore.getState().togglePlaying();
    };
    const pointer = () => {
      if (held) panned = true;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('pointerdown', pointer, true);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('pointerdown', pointer, true);
    };
  }, [phase.kind]);

  // ---- import / export ----
  const importFile = async (file: File) => {
    if (file.size > VECTOR_MAX_DOC_BYTES) {
      toast.error(t('vector.import.tooLarge'));
      return;
    }
    setImporting(true);
    try {
      const text = await file.text();
      if (/\.json$/i.test(file.name) || file.type === 'application/json') {
        // MM44: a Motion document file (the signed-out "download .json").
        const parsed = parseVectorDoc(text);
        if (!parsed.ok) {
          toast.error(t('vector.import.errors.json'));
          return;
        }
        const s = useVectorStore.getState();
        s.mutate('Open file', () => parsed.doc, []);
        s.rename(file.name.replace(/(\.motion)?\.json$/i, '').slice(0, 120) || s.name);
        toast.success(t('vector.import.done', { count: parsed.doc.layers.length }));
        return;
      }
      const { doc: imported, warnings: w } = parseSvg(text);
      const s = useVectorStore.getState();
      const base = file.name.replace(/\.svg$/i, '').slice(0, 120);
      if (s.doc && s.doc.layers.length === 0 && s.past.length === 0) {
        // Empty canvas: the import becomes the document.
        s.load(s.projectId ?? idRef.current ?? newLocalProjectId(), imported, base || s.name);
      } else {
        s.mutate('Import SVG', () => imported);
        s.rename(base || s.name);
      }
      setWarnings(w.length > 0 ? w : null);
      toast.success(t('vector.import.done', { count: imported.layers.length }));
    } catch (e) {
      const code = e instanceof SvgImportError ? e.code : 'malformed';
      toast.error(t(`vector.import.errors.${code}`));
    } finally {
      setImporting(false);
    }
  };

  const recover = (draft: VectorDraft) => {
    useVectorStore.getState().load(draft.projectId, draft.document, draft.name || t('vector.untitled'));
    setPhase({ kind: 'ready' });
  };
  const discard = (draft: VectorDraft) => {
    void deleteVectorDraft(draft.projectId);
    // An account project already holds the server copy (loaded before the prompt).
    if (classifyProjectId(projectId).kind !== 'server') useVectorStore.getState().load(draft.projectId, blankDoc(), t('vector.untitled'));
    setPhase({ kind: 'ready' });
  };

  if (classifyProjectId(projectId).kind === 'invalid') {
    return (
      <div dir={dir} className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <p className="text-sm text-muted-foreground">{t('vector.invalidProject')}</p>
        <Button asChild>
          <Link href="/motion/new">{t('vector.newProject')}</Link>
        </Button>
      </div>
    );
  }

  if (phase.kind === 'error') {
    return (
      <div dir={dir} className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <p className="max-w-md text-sm text-muted-foreground" data-testid="vector-open-error">
          {t(`vector.projects.open.${phase.reason}`)}
        </p>
        <div className="flex gap-2">
          {phase.reason === 'signin' && (
            <Button asChild variant="outline">
              <a href={localized('/account')} target="_blank" rel="noopener">
                {t('vector.projects.signIn')}
              </a>
            </Button>
          )}
          <Button asChild>
            <Link href="/motion/new">{t('vector.newProject')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className="flex h-dvh min-h-0 flex-col bg-background text-foreground">
      {/* Top bar */}
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-edge bg-surface-1 px-2 sm:px-3">
        <Link href={localized('/')} className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-surface-2" aria-label={t('vector.backHome')}>
          <ArrowLeft className="size-4 rtl:-scale-x-100" />
          <Wordmark className="hidden h-4 sm:block" />
        </Link>
        <span className="h-5 w-px bg-edge" aria-hidden />
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold">{MOTION_BRAND}</span>
          <span className="rounded-full border border-premium/40 bg-premium/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-premium" data-testid="vector-beta-chip">
            {t('vector.beta', { brand: MOTION_BRAND })}
          </span>
        </span>
        <input
          aria-label={t('vector.projectName')}
          value={name}
          onChange={(e) => useVectorStore.getState().rename(e.target.value.slice(0, 120))}
          className="ms-2 hidden h-7 min-w-0 max-w-56 flex-1 rounded-md border border-transparent bg-transparent px-2 text-sm hover:border-edge focus-visible:border-data focus-visible:outline-none md:block"
        />
        <span className="flex-1" />
        <IconButton label={t('vector.undo')} disabled={!canUndo} onClick={() => useVectorStore.getState().undo()}>
          <Undo2 className="size-4 rtl:-scale-x-100" />
        </IconButton>
        <IconButton label={t('vector.redo')} disabled={!canRedo} onClick={() => useVectorStore.getState().redo()}>
          <Redo2 className="size-4 rtl:-scale-x-100" />
        </IconButton>
        {sync.available && phase.kind === 'ready' && <SaveIndicator sync={sync} onSave={onSave} />}
        <span className="h-5 w-px bg-edge" aria-hidden />
        <input
          ref={fileRef}
          type="file"
          accept=".svg,image/svg+xml,.json,application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (f) void importFile(f);
          }}
        />
        <Button variant="outline" size="sm" disabled={importing || phase.kind !== 'ready'} onClick={() => fileRef.current?.click()}>
          {importing ? <Loader2 className="animate-spin" /> : <FileUp />}
          <span className="hidden sm:inline">{t('vector.import.button')}</span>
        </Button>
        <Button size="sm" disabled={!doc} onClick={() => setExportOpen(true)}>
          <Download />
          <span className="hidden sm:inline">{t('vector.export.open')}</span>
        </Button>
      </header>

      {sync.conflict && (
        <div role="alert" data-testid="vector-conflict-banner" className="flex flex-wrap items-center gap-3 border-b border-premium/40 bg-premium/10 px-3 py-2 text-sm">
          <AlertTriangle className="size-4 shrink-0 text-premium" />
          <span className="min-w-0 flex-1">{t('vector.projects.conflict.title')}</span>
          <Button size="sm" variant="outline" onClick={() => setReloadAsk(true)}>
            {t('vector.projects.conflict.reload')}
          </Button>
          <Button size="sm" onClick={() => void sync.keepMine()}>
            {t('vector.projects.conflict.keep')}
          </Button>
        </div>
      )}
      {sync.refused && (
        <div role="alert" className="flex flex-wrap items-center gap-3 border-b border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
          <span className="min-w-0 flex-1">
            {sync.refused.code === 'vector_projects_limit'
              ? t('vector.projects.limit', { count: Number(sync.refused.body?.limit) || 0 })
              : t('vector.projects.saveFailed')}{' '}
            {sync.refused.code === 'vector_projects_limit' && (
              <a href={localized('/pricing')} className="font-medium underline underline-offset-2">
                {t('vector.exportDialog.upgrade')}
              </a>
            )}
          </span>
          <button type="button" className="text-xs text-muted-foreground hover:text-foreground" onClick={sync.clearRefused}>
            {t('common.close')}
          </button>
        </div>
      )}
      <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1">
        {/* Tool rail */}
        <nav aria-label={t('vector.tools.label')} className="flex w-11 shrink-0 flex-col items-center gap-1 border-e border-edge bg-surface-1 py-2">
          {TOOLS.map(({ id, icon: Icon }) => (
            <IconButton
              key={id}
              label={`${t(`vector.tools.${id}`)} (${TOOL_SHORTCUTS[id].toUpperCase()})`}
              active={tool === id}
              onClick={() => useVectorStore.getState().setTool(id)}
            >
              <Icon className="size-4" />
            </IconButton>
          ))}
        </nav>

        {/* Canvas */}
        <div ref={stageRef} className="relative min-w-0 flex-1">
          {phase.kind === 'ready' && doc ? (
            <VectorCanvas view={view} onViewChange={setView} onToolUsed={onToolUsed} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="me-2 size-4 animate-spin" />
              {t('common.loading')}
            </div>
          )}
          {phase.kind === 'ready' && (
            <div dir="ltr" className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md border border-edge bg-surface-1/90 p-1 backdrop-blur">
              <IconButton label={t('vector.zoomOut')} onClick={() => zoomBy(1 / 1.25)}>
                <Minus className="size-3.5" />
              </IconButton>
              <span className="w-12 text-center font-mono text-xs tabular-nums">{Math.round(view.zoom * 100)}%</span>
              <IconButton label={t('vector.zoomIn')} onClick={() => zoomBy(1.25)}>
                <Plus className="size-3.5" />
              </IconButton>
              <IconButton label={t('vector.zoomFit')} onClick={fit}>
                <Maximize className="size-3.5" />
              </IconButton>
            </div>
          )}
          {warnings && (
            <div className="absolute end-3 top-3 max-w-sm rounded-md border border-premium/40 bg-surface-1/95 p-3 text-xs shadow-lg" role="status">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-medium text-premium">{t('vector.import.warningsTitle', { count: warnings.length })}</span>
                <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => setWarnings(null)}>
                  {t('common.close')}
                </button>
              </div>
              <ul className="max-h-40 space-y-0.5 overflow-y-auto text-muted-foreground">
                {warnings.map((w, i) => (
                  <li key={i}>
                    {t(`vector.import.warnings.${w.code}`)} <span className="font-mono text-text-subtle">{w.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Side panels (stacked; scroll independently) */}
        <aside className={cn('hidden w-72 shrink-0 flex-col gap-2 border-s border-edge bg-surface-0 p-2 lg:flex')}>
          <div className="flex min-h-0 basis-2/5 flex-col">
            <LayerPanel />
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <Inspector />
          </div>
        </aside>
      </div>
      {/* MM44 timeline */}
      {phase.kind === 'ready' && doc && (
        <div className="flex h-56 shrink-0 flex-col">
          <Timeline />
        </div>
      )}
      </div>

      {doc && exportOpen && (
        <ExportDialog
          open={exportOpen}
          onOpenChange={setExportOpen}
          doc={doc}
          name={name}
          time={useVectorStore.getState().time}
          signedIn={signedIn === true}
        />
      )}
      {signInOpen && <SignInPrompt onClose={() => setSignInOpen(false)} />}
      {reloadAsk && (
        <ReloadTheirsDialog
          onCancel={() => setReloadAsk(false)}
          onReload={async () => {
            if (await sync.reloadTheirs()) setReloadAsk(false);
            else toast.error(t('vector.projects.conflict.reloadFailed'));
          }}
        />
      )}
      {phase.kind === 'recover' && <RecoveryDialog draft={phase.draft} onRecover={() => recover(phase.draft)} onDiscard={() => discard(phase.draft)} />}
    </div>
  );
}

/** Static SVG download. Free and uncounted (design §3.4): no API call, no tier check. */
function exportSvg(): void {
  const s = useVectorStore.getState();
  if (!s.doc) return;
  const svg = serializeSvg(s.doc);
  saveBlobToDisk(new Blob([svg], { type: 'image/svg+xml' }), svgFileName(s.name));
}

function RecoveryDialog({ draft, onRecover, onDiscard }: { draft: VectorDraft; onRecover: () => void; onDiscard: () => void }) {
  const { t } = useLocalization('interface');
  const summary = summarizeVectorDraft(draft.document);
  return (
    <Dialog open onOpenChange={() => undefined}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t('vector.draft.title')}</DialogTitle>
          <DialogDescription>{t('vector.draft.description')}</DialogDescription>
        </DialogHeader>
        <div className="rounded-md border border-edge bg-surface-2 px-3 py-2 text-sm">
          <span className="font-medium">{t('vector.draft.from', { time: formatRelativeTime(draft.savedAt), name: draft.name || t('vector.untitled') })}</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">{t('vector.draft.layers', { count: summary.totalLayers })}</span>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onDiscard}>
            <Trash2 />
            {t('vector.draft.discard')}
          </Button>
          <Button onClick={onRecover}>
            <History />
            {t('vector.draft.recover')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** The document as a `.motion.json` file (signed-out save; "keep my version" before a reload). */
function downloadDocJson(): void {
  const s = useVectorStore.getState();
  if (!s.doc) return;
  saveBlobToDisk(new Blob([serializeVectorDoc(s.doc)], { type: 'application/json' }), docFileName(s.name));
}

/** Header save control: status + "Save" (first save creates the account project). */
function SaveIndicator({ sync, onSave }: { sync: ProjectSync; onSave: () => void }) {
  const { t } = useLocalization('interface');
  const label = t(`vector.projects.status.${sync.status}`);
  const offline = sync.status === 'offline' || sync.status === 'failed' || sync.status === 'retrying';
  return (
    <span className="flex items-center gap-1.5" data-testid="vector-save-status" data-state={sync.status}>
      <span className="hidden items-center gap-1 text-xs text-muted-foreground md:flex" role="status" aria-live="polite">
        {sync.status === 'saving' ? <Loader2 className="size-3.5 animate-spin" /> : offline ? <CloudOff className="size-3.5" /> : <Cloud className="size-3.5" />}
        {label}
      </span>
      {/* `saving` also covers the autosave debounce; saves are serialised, so Save stays pressable. */}
      <Button size="sm" variant="outline" onClick={onSave} disabled={sync.status === 'conflict'}>
        {sync.server ? t('vector.projects.save') : t('vector.projects.saveToAccount')}
      </Button>
    </span>
  );
}

/** Signed-out save (§3.5): projects stay in this browser; offer sign-in and the .json file. */
function SignInPrompt({ onClose }: { onClose: () => void }) {
  const { t } = useLocalization('interface');
  const localized = useLocalizedHref();
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md" data-testid="vector-signin-prompt">
        <DialogHeader>
          <DialogTitle>{t('vector.projects.signInTitle')}</DialogTitle>
          <DialogDescription>{t('vector.projects.signInBody')}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={downloadDocJson}>
            <FileJson />
            {t('vector.projects.downloadJson')}
          </Button>
          <Button asChild>
            <a href={localized('/account')} target="_blank" rel="noopener">
              {t('vector.projects.signIn')}
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** 409 → Reload theirs: offer to keep a copy of the local version first. */
function ReloadTheirsDialog({ onCancel, onReload }: { onCancel: () => void; onReload: () => void }) {
  const { t } = useLocalization('interface');
  const [busy, setBusy] = React.useState(false);
  return (
    <Dialog open onOpenChange={(o) => !o && !busy && onCancel()}>
      <DialogContent className="sm:max-w-md" data-testid="vector-reload-dialog">
        <DialogHeader>
          <DialogTitle>{t('vector.projects.conflict.reloadTitle')}</DialogTitle>
          <DialogDescription>{t('vector.projects.conflict.reloadBody')}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={downloadDocJson} disabled={busy}>
            <FileJson />
            {t('vector.projects.conflict.downloadMine')}
          </Button>
          <Button
            variant="destructive"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onReload();
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy && <Loader2 className="animate-spin" />}
            {t('vector.projects.conflict.reloadConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
