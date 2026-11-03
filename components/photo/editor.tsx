'use client';

import * as React from 'react';
import { Redo2, Undo2 } from 'lucide-react';
import { toast } from 'sonner';

import { Wordmark } from '@/components/darkroom/wordmark';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/i18n/useLocalization';
import { authedFetch } from '@/lib/auth/authedFetch';
import Link from 'next/link';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { PHOTO_BRAND } from '@/lib/photo/brand';
import { createDraftWriter, deletePhotoDraft, getPhotoDraft, prunePhotoDrafts, putPhotoDraft, shouldOfferRecovery, type PhotoDraft } from '@/lib/photo/draftStore';
import { workerHistogramPort, type Histogram, type HistogramPort } from '@/lib/photo/gl/histogram';
import {
  clearLocalProject,
  decideOpen,
  decideUploadOffer,
  docForUpload,
  getLocalProject,
  putLocalProject,
  updateLocalDoc,
  type LocalProject,
} from '@/lib/photo/localProject';
import { classifyPhotoRoute, isJobId, isLikelyServerOnlyFormat, nameFromFile } from '@/lib/photo/projects';
import {
  createPhotoProject,
  fetchProjectImage,
  getPhotoCapabilities,
  getPhotoProject,
  listPhotoProjects,
  type PhotoCapabilities,
  type PhotoProjectSummary,
} from '@/lib/photo/projectsApi';
import { keepMine, loadTheirs, saveDoc } from '@/lib/photo/saveFlow';
import { newPhotoDoc } from '@/lib/photo/photoTypes';
import { usePhotoStore } from '@/lib/photo/photoStore';
import { getBaseURL } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { PhotoCanvas, type CanvasHandle, type PhotoSourceInfo } from './canvas';
import { fetchProjectFile, proxyCandidates, type HealOutcome } from '@/lib/photo/aiApi';
import { currentBaseRef } from '@/lib/photo/healOps';
import { onCompareUsed } from '@/lib/photo/seams';
import { setLocalBase } from '@/lib/photo/localProject';
import { clearMaskAssets, registerSubjectMask } from '@/lib/photo/maskAssets';
import { useToolStore } from '@/lib/photo/toolStore';
import { BRUSH_SIZE_MAX, BRUSH_SIZE_MIN } from '@/lib/photo/brushEngine';
import { getHealStrokes, setHealStrokes } from './heal-session';
import { PhotoSessionProvider, type PhotoSession } from './session-context';
import { ToolOverlay } from './tool-overlay';
import { MasksPanel } from './masks/masks-panel';
import { GeometryPanel } from './panels/geometry-panel';
import { HealPanel } from './panels/heal-panel';
import { RedEyePanel } from './panels/redeye-panel';
import { ConflictDialog, DraftDialog, LocalBanner, ReplaceLocalDialog, UploadOffer } from './dialogs';
import { ExportDialog } from './export-dialog';
import { LayersPanel, panelForLayer, type PanelId } from './layers-panel';
import { OpenScreen } from './open-screen';
import { BasicPanel } from './panels/basic-panel';
import { BlackWhitePanel, ChannelMixerPanel, ColorBalancePanel, PhotoFilterPanel, SplitTonePanel } from './panels/color-panels';
import { CurvesPanel } from './panels/curves-panel';
import { HslPanel } from './panels/hsl-panel';
import { LevelsPanel } from './panels/levels-panel';
import { EffectsPanel, LutPanel } from './panels/lut-effects-panels';
import { HistogramPlot } from './histogram-plot';
import { useSignedIn } from './use-signed-in';

const PANELS: PanelId[] = ['basic', 'geometry', 'masks', 'heal', 'redEye', 'curves', 'levels', 'hsl', 'colorBalance', 'blackWhite', 'channelMixer', 'photoFilter', 'splitTone', 'lut', 'effects'];
const AUTOSAVE_MS = 2500;

type Picked = { r: number; g: number; b: number; n: number } | null;

export interface PhotoEditorProps {
  projectId: string;
}

/** The Aperture editor shell (ticket MM97 decision 8). */
export default function PhotoEditor({ projectId }: PhotoEditorProps) {
  const { t } = useLocalization('interface');
  const route = React.useMemo(() => classifyPhotoRoute(projectId), [projectId]);
  const signedIn = useSignedIn();
  const localized = useLocalizedHref();

  const doc = usePhotoStore((s) => s.doc);
  const name = usePhotoStore((s) => s.name);
  const revision = usePhotoStore((s) => s.revision);
  const dirty = usePhotoStore((s) => s.dirty);
  const canUndo = usePhotoStore((s) => s.past.length > 0 && s.gestureDepth === 0);
  const canRedo = usePhotoStore((s) => s.future.length > 0 && s.gestureDepth === 0);

  const [source, setSource] = React.useState<PhotoSourceInfo | null>(null);
  const [originalFile, setOriginalFile] = React.useState<File | null>(null);
  const [serverId, setServerId] = React.useState<string | null>(null);
  const [isLocal, setIsLocal] = React.useState(false);
  const [panel, setPanel] = React.useState<PanelId | 'layers'>('basic');
  const [openError, setOpenError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(route.kind !== 'new' && route.kind !== 'invalid');
  const [localProject, setLocalProject] = React.useState<LocalProject | null>(null);
  const [recent, setRecent] = React.useState<PhotoProjectSummary[]>([]);
  const [caps, setCaps] = React.useState<PhotoCapabilities | null>(null);
  const [pendingFile, setPendingFile] = React.useState<File | null>(null);
  const [draft, setDraft] = React.useState<PhotoDraft | null>(null);
  const [conflict, setConflict] = React.useState<number | null>(null);
  const [exportOpen, setExportOpen] = React.useState(false);
  const [showOriginal, setShowOriginal] = React.useState(false);
  const [split, setSplit] = React.useState<number | null>(null);
  const [picking, setPicking] = React.useState<'curves' | 'hsl' | 'mask' | null>(null);
  const [picked, setPicked] = React.useState<Picked>(null);
  const [reduced, setReduced] = React.useState(false);
  const [histogram, setHistogram] = React.useState<Histogram | null>(null);
  const [saveState, setSaveState] = React.useState<'saved' | 'saving' | 'error' | 'uploading'>('saved');
  const [uploadOffer, setUploadOffer] = React.useState<{ canUpload: boolean } | null>(null);
  const [offerBusy, setOfferBusy] = React.useState(false);
  const [offerError, setOfferError] = React.useState(false);
  const [freeProjects, setFreeProjects] = React.useState<number>(5);
  const [sheetOpen, setSheetOpen] = React.useState(true);
  const [pickedMask, setPickedMask] = React.useState<{ r: number; g: number; b: number; n: number; shift: boolean } | null>(null);
  const [thumb, setThumb] = React.useState<import('@/lib/photo/colorMath').FloatImage | null>(null);
  const tool = useToolStore((st) => st.tool);
  const maskView = useToolStore((st) => st.maskView);
  const maskLayerId = useToolStore((st) => st.maskLayerId);
  /** Heal bases already decoded for this session (hash/local id → bytes). */
  const baseBlobs = React.useRef(new Map<string, Blob>());
  const loadedBase = React.useRef<string | null>(null);
  const originalBlob = React.useRef<Blob | null>(null);

  const canvasRef = React.useRef<CanvasHandle>(null);
  const histPort = React.useRef<HistogramPort | null>(null);
  const revisionRef = React.useRef(0);
  const rendered = React.useRef(0);
  const histBusy = React.useRef(false);

  const title = name || t('photo.untitled');
  React.useEffect(() => {
    document.title = `${PHOTO_BRAND} · ${title}`;
  }, [title]);

  // Workstation parity spec hook (`e2e/photo-parity.spec.ts`): dev builds only, opt-in by query.
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (new URLSearchParams(window.location.search).get('parity') !== '1') return;
    void import('@/lib/photo/gl/photoRenderer').then((m) => {
      (window as unknown as { __photoParity?: unknown }).__photoParity = { PhotoRenderer: m.PhotoRenderer };
    });
  }, []);

  // ---- capabilities + tier numbers ------------------------------------
  React.useEffect(() => {
    void getPhotoCapabilities().then(setCaps);
  }, []);
  React.useEffect(() => {
    void fetch(`${getBaseURL()}/tiers`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { tiers?: Array<{ tier: string; limits: { photoProjects?: number } }> } | null) => {
        const free = j?.tiers?.find((x) => x.tier === 'free')?.limits.photoProjects;
        if (typeof free === 'number' && free > 0) setFreeProjects(free);
      })
      .catch(() => undefined);
  }, []);

  // ---- opening ------------------------------------------------------------
  const decode = React.useCallback(async (blob: Blob): Promise<PhotoSourceInfo> => {
    const bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image', premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
    return { bitmap, width: bitmap.width, height: bitmap.height };
  }, []);

  const beginEditing = React.useCallback(
    (src: PhotoSourceInfo, file: File | null, id: string, docIn: ReturnType<typeof newPhotoDoc>, projName: string, serverRev: number | null) => {
      setSource(src);
      setOriginalFile(file);
      clearMaskAssets();
      setHealStrokes(null);
      useToolStore.getState().setTool('none');
      useToolStore.getState().setMaskView('off');
      loadedBase.current = currentBaseRef(docIn);
      usePhotoStore.getState().load(id, docIn, projName, serverRev);
      revisionRef.current = usePhotoStore.getState().revision;
      setLoading(false);
    },
    [],
  );

  /** A server heal base as a decodable proxy (`bases/<hash>.proxy.jpg|png`); null when unavailable. */
  const loadServerBase = React.useCallback(
    async (projectId: string, ref: string): Promise<PhotoSourceInfo | null> => {
      for (const rel of proxyCandidates(ref)) {
        try {
          return await decode(await fetchProjectFile(projectId, rel));
        } catch {
          // try the next candidate
        }
      }
      return null;
    },
    [decode],
  );

  // Open a server project (by id).
  const openServer = React.useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const p = await getPhotoProject(id);
        let blob: Blob;
        try {
          blob = await fetchProjectImage(id, 'original');
        } catch {
          blob = await fetchProjectImage(id, 'proxy');
        }
        let src: PhotoSourceInfo;
        try {
          src = await decode(blob);
        } catch {
          src = await decode(await fetchProjectImage(id, 'proxy'));
        }
        const healed = currentBaseRef(p.doc);
        if (healed?.startsWith('bases/')) {
          const hs = await loadServerBase(id, healed);
          if (hs) src = hs;
        }
        originalBlob.current = blob;
        setServerId(id);
        setIsLocal(false);
        beginEditing(src, null, id, p.doc, p.name, p.revision);
        const d = await getPhotoDraft(id);
        if (shouldOfferRecovery(d, p.doc, p.updatedAt ? Date.parse(p.updatedAt) : null)) setDraft(d);
      } catch {
        setOpenError(t('photo.invalidProject'));
        setLoading(false);
      }
    },
    [beginEditing, decode, loadServerBase, t],
  );

  const openLocal = React.useCallback(
    async (lp: LocalProject) => {
      setLoading(true);
      if (!lp.original) {
        setOpenError(t('photo.open.decodeFailed'));
        setLoading(false);
        return;
      }
      try {
        const src = await decode(lp.base ?? lp.original);
        originalBlob.current = lp.original;
        const lb = currentBaseRef(lp.doc);
        if (lb && lp.base) baseBlobs.current.set(lb, lp.base);
        setServerId(null);
        setIsLocal(true);
        setLocalProject(lp);
        beginEditing(src, new File([lp.original], lp.fileName, { type: lp.original.type }), 'local', lp.doc, lp.name, null);
        window.history.replaceState(null, '', '/photo/local');
      } catch {
        setOpenError(t('photo.open.decodeFailed'));
        setLoading(false);
      }
    },
    [beginEditing, decode, t],
  );

  // New photo from a File (drop/choose/`?from=`).
  const openFile = React.useCallback(
    async (file: File, replaceConfirmed = false) => {
      setOpenError(null);
      const signed = signedIn === true;
      if (!signed) {
        const existing = await getLocalProject();
        if (decideOpen(existing) === 'confirm-replace' && !replaceConfirmed) {
          setPendingFile(file);
          return;
        }
      }
      setLoading(true);
      let src: PhotoSourceInfo | null = null;
      try {
        src = await decode(file);
      } catch {
        src = null;
      }
      const projName = nameFromFile(file.name, t('photo.untitled'));
      if (!src) {
        if (!signed) {
          setOpenError(isLikelyServerOnlyFormat(file) ? t('photo.open.signInFormat') : t('photo.open.decodeFailed'));
          setLoading(false);
          return;
        }
        // Signed in: the server makes a proxy we can decode.
        try {
          setSaveState('uploading');
          const proj = await createPhotoProject({ file, fileName: file.name, name: projName });
          const proxy = await decode(await fetchProjectImage(proj.id, 'proxy'));
          setServerId(proj.id);
          setIsLocal(false);
          beginEditing(proxy, file, proj.id, proj.doc, proj.name || projName, proj.revision);
          window.history.replaceState(null, '', `/photo/${proj.id}`);
          setSaveState('saved');
        } catch {
          setOpenError(t('photo.open.decodeFailed'));
          setLoading(false);
          setSaveState('error');
        }
        return;
      }
      const newDoc = newPhotoDoc(src.width, src.height);
      if (!signed) {
        const lp: LocalProject = { name: projName, fileName: file.name, original: file, base: null, doc: newDoc, savedAt: Date.now() };
        await putLocalProject(lp);
        setLocalProject(lp);
        setServerId(null);
        setIsLocal(true);
        beginEditing(src, file, 'local', newDoc, projName, null);
        window.history.replaceState(null, '', '/photo/local');
        return;
      }
      // Signed in: edit now, upload in the background.
      const tempId = `new-${Date.now().toString(36)}`;
      setServerId(null);
      setIsLocal(false);
      beginEditing(src, file, tempId, newDoc, projName, null);
      setSaveState('uploading');
      void createPhotoProject({ file, fileName: file.name, name: projName, doc: newDoc })
        .then((proj) => {
          setServerId(proj.id);
          usePhotoStore.getState().setProjectId(proj.id);
          usePhotoStore.getState().markSaved(proj.revision);
          window.history.replaceState(null, '', `/photo/${proj.id}`);
          setSaveState('saved');
        })
        .catch(async () => {
          // Could not create a project (cap, offline): keep the work in this browser.
          setSaveState('error');
          toast.error(t('photo.banner.uploadFailed'));
          const lp: LocalProject = { name: projName, fileName: file.name, original: file, base: null, doc: newDoc, savedAt: Date.now() };
          await putLocalProject(lp);
          setLocalProject(lp);
          setIsLocal(true);
        });
    },
    [beginEditing, decode, signedIn, t],
  );

  // First load once Firebase has answered.
  const started = React.useRef(false);
  React.useEffect(() => {
    if (started.current || signedIn === null) return;
    started.current = true;
    void (async () => {
      if (route.kind === 'invalid') {
        setOpenError(t('photo.invalidProject'));
        setLoading(false);
        return;
      }
      if (route.kind === 'server') {
        if (!signedIn) {
          setOpenError(t('photo.invalidProject'));
          setLoading(false);
          return;
        }
        await openServer(route.id);
        return;
      }
      const lp = await getLocalProject();
      if (route.kind === 'local') {
        if (lp) await openLocal(lp);
        else {
          setOpenError(t('photo.invalidProject'));
          setLoading(false);
        }
        return;
      }
      // /photo/new
      setLocalProject(lp);
      if (signedIn) void listPhotoProjects().then(setRecent).catch(() => undefined);
      const from = new URLSearchParams(window.location.search).get('from');
      if (isJobId(from)) {
        setLoading(true);
        try {
          let res = await authedFetch(`${getBaseURL()}/result/${encodeURIComponent(from)}`);
          if (!res.ok) res = await authedFetch(`${getBaseURL()}/download/${encodeURIComponent(from)}`);
          if (!res.ok) throw new Error('result unavailable');
          const blob = await res.blob();
          const cd = res.headers.get('Content-Disposition') ?? '';
          const fn = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(cd)?.[1];
          await openFile(new File([blob], fn ? decodeURIComponent(fn) : `result-${from}.${(blob.type.split('/')[1] || 'png').replace('jpeg', 'jpg')}`, { type: blob.type }));
        } catch {
          setOpenError(t('photo.open.fromFailed'));
          setLoading(false);
        }
      }
    })();
  }, [signedIn, route, openServer, openLocal, openFile, t]);

  // ---- sign-in offer for the browser-local project ----------------------
  React.useEffect(() => {
    if (signedIn !== true || route.kind === 'server' || !isLocal || !localProject?.original) return;
    let alive = true;
    void (async () => {
      const list = await listPhotoProjects().catch(() => [] as PhotoProjectSummary[]);
      const cap = (await getPhotoCapabilities()).photoProjects;
      if (alive) setUploadOffer({ canUpload: decideUploadOffer(localProject, list.length, cap || -1).offer });
    })();
    return () => {
      alive = false;
    };
  }, [signedIn, isLocal, localProject, route.kind]);

  const acceptOffer = async () => {
    if (!localProject?.original) return;
    setOfferBusy(true);
    setOfferError(false);
    try {
      const cur = usePhotoStore.getState().doc ?? localProject.doc;
      const proj = await createPhotoProject({ file: localProject.base ?? localProject.original, fileName: localProject.fileName, name: usePhotoStore.getState().name || localProject.name, doc: docForUpload({ ...localProject, doc: cur }) });
      await clearLocalProject();
      window.location.replace(`/photo/${proj.id}`);
    } catch {
      setOfferError(true);
      setOfferBusy(false);
    }
  };

  // ---- persistence: local doc, drafts, server autosave -------------------
  React.useEffect(() => {
    if (!doc) return;
    const id = usePhotoStore.getState().projectId ?? 'local';
    const writer = createDraftWriter(() => {
      const s = usePhotoStore.getState();
      if (!s.doc) return;
      void putPhotoDraft({ projectId: s.projectId ?? id, name: s.name, savedAt: Date.now(), baseRevision: s.serverRevision, document: s.doc });
    });
    void prunePhotoDrafts();
    const unsub = usePhotoStore.subscribe((s) => {
      if (s.revision === revisionRef.current) return;
      revisionRef.current = s.revision;
      writer.notifyChange();
    });
    const hide = () => writer.flush();
    window.addEventListener('pagehide', hide);
    document.addEventListener('visibilitychange', hide);
    return () => {
      unsub();
      writer.flush();
      writer.dispose();
      window.removeEventListener('pagehide', hide);
      document.removeEventListener('visibilitychange', hide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!doc]);

  // Guest: persist every edit to the one local project.
  React.useEffect(() => {
    if (!isLocal || !doc) return;
    const h = setTimeout(() => void updateLocalDoc(doc, name), 600);
    return () => clearTimeout(h);
  }, [isLocal, doc, name]);

  const save = React.useCallback(async () => {
    const s = usePhotoStore.getState();
    if (!s.doc || !serverId || s.serverRevision === null) return false;
    setSaveState('saving');
    const out = await saveDoc(serverId, s.serverRevision, s.name, s.doc);
    if (out.ok) {
      usePhotoStore.getState().markSaved(out.project.revision);
      setSaveState('saved');
      void deletePhotoDraft(serverId);
      return true;
    }
    if (out.kind === 'conflict') {
      setConflict(out.serverRevision);
      setSaveState('error');
    } else setSaveState('error');
    return false;
  }, [serverId]);

  React.useEffect(() => {
    if (!serverId || !dirty) return;
    const h = setTimeout(() => void save(), AUTOSAVE_MS);
    return () => clearTimeout(h);
  }, [serverId, dirty, revision, save]);

  const onKeepMine = async () => {
    const s = usePhotoStore.getState();
    if (!serverId || !s.doc || conflict === null) return;
    const out = await keepMine(serverId, conflict, s.name, s.doc);
    if (out.ok) {
      usePhotoStore.getState().markSaved(out.project.revision);
      setConflict(null);
      setSaveState('saved');
    }
  };
  const onLoadTheirs = async () => {
    if (!serverId) return;
    const p = await loadTheirs(serverId);
    if (p) {
      usePhotoStore.getState().replaceDoc(p.doc, p.revision);
      usePhotoStore.getState().rename(p.name);
      usePhotoStore.getState().markSaved(p.revision);
      void deletePhotoDraft(serverId);
    }
    setConflict(null);
  };

  // ---- histogram (every 200 ms while the doc changes) ---------------------
  React.useEffect(() => {
    if (!source) return;
    histPort.current = workerHistogramPort();
    const timer = setInterval(() => {
      if (histBusy.current || rendered.current === 0) return;
      const px = canvasRef.current?.readPixels();
      if (!px) return;
      rendered.current = 0;
      histBusy.current = true;
      void histPort.current?.compute(px).then((h) => setHistogram(h)).finally(() => (histBusy.current = false));
    }, 200);
    return () => {
      clearInterval(timer);
      histPort.current?.dispose();
    };
  }, [source]);
  const onRendered = React.useCallback(() => {
    rendered.current += 1;
  }, []);

  // ---- keyboard ---------------------------------------------------------------
  React.useEffect(() => {
    const typing = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
    };
    const down = (e: KeyboardEvent) => {
      if (e.key === '\\' && !typing(e)) {
        setShowOriginal(true);
        onCompareUsed('hold');
      }
      if (!typing(e) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const ts = useToolStore.getState();
        const key = e.key.toLowerCase();
        if (key === 'm') {
          ts.cycleMaskView();
          setPanel('masks');
        } else if (key === 'b') {
          ts.toggleTool('brush');
          ts.setBrush({ erase: false });
          setPanel('masks');
        } else if (key === 'e') {
          ts.setBrush({ erase: !ts.brush.erase });
          if (ts.tool !== 'brush' && ts.tool !== 'heal') ts.setTool('brush');
        } else if (e.key === '[') ts.setBrush({ size: Math.max(BRUSH_SIZE_MIN, Math.round(ts.brush.size * 0.85)) });
        else if (e.key === ']') ts.setBrush({ size: Math.min(BRUSH_SIZE_MAX, Math.round(ts.brush.size / 0.85) + 1) });
        else if (key === 'g') {
          ts.toggleTool('gradient');
          setPanel('masks');
        } else if (key === 'r') {
          ts.toggleTool('radial');
          setPanel('masks');
        } else if (key === 'c') {
          ts.toggleTool('crop');
          setPanel('geometry');
        } else if (key === 'h') {
          ts.toggleTool('heal');
          setPanel('heal');
        } else if (e.key === 'Escape') ts.setTool('none');
      }
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'z' && !typing(e)) {
        e.preventDefault();
        if (e.shiftKey) usePhotoStore.getState().redo();
        else usePhotoStore.getState().undo();
      } else if (mod && e.key.toLowerCase() === 'y' && !typing(e)) {
        e.preventDefault();
        usePhotoStore.getState().redo();
      } else if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void save();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === '\\') setShowOriginal(false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [save]);

  // ---- layer selection → panel -------------------------------------------------
  const openPanel = (p: PanelId) => setPanel(p);
  const selection = usePhotoStore((s) => s.selection);
  const selType = usePhotoStore((s) => s.doc?.layers.find((l) => l.id === s.selection)?.type);
  const [seenSel, setSeenSel] = React.useState<string | null>(null);
  if (selection !== seenSel) {
    setSeenSel(selection);
    const p = selType ? panelForLayer(selType) : null;
    if (p) setPanel(p);
  }

  const onPick = (rgb: { r: number; g: number; b: number }, shift = false) => {
    if (picking === 'mask') {
      setPickedMask({ ...rgb, n: Date.now(), shift });
      setPicking(null);
      return;
    }
    setPicked({ ...rgb, n: Date.now() });
    setPicking(null);
  };

  // ---- heal base swapping (MM98) -----------------------------------------------
  const healRef = usePhotoStore((st) => (st.doc ? currentBaseRef(st.doc) : null));
  const swapSource = React.useCallback(async (ref: string | null) => {
    try {
      let next: PhotoSourceInfo | null = null;
      if (ref === null) {
        const blob = originalBlob.current;
        if (blob) next = await decode(blob);
      } else if (ref.startsWith('local:')) {
        const b = baseBlobs.current.get(ref);
        if (b) next = await decode(b);
      } else if (serverId) {
        next = await loadServerBase(serverId, ref);
      }
      if (next) {
        loadedBase.current = ref;
        setSource(next);
        if (isLocal) void setLocalBase(ref ? baseBlobs.current.get(ref) ?? null : null);
      }
    } catch {
      // keep the current source; the doc and the pixels stay consistent with each other
    }
  }, [decode, isLocal, loadServerBase, serverId]);
  React.useEffect(() => {
    if (!source || loadedBase.current === healRef) return;
    void swapSource(healRef);
  }, [healRef, source, swapSource]);

  // A <= 64 px float thumbnail of the source for mask thumbnails.
  React.useEffect(() => {
    if (!source) return;
    try {
      const k = Math.min(1, 64 / Math.max(source.width, source.height));
      const w = Math.max(1, Math.round(source.width * k));
      const h = Math.max(1, Math.round(source.height * k));
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(source.bitmap, 0, 0, w, h);
      const px = ctx.getImageData(0, 0, w, h).data;
      const data = new Float32Array(w * h * 4);
      for (let i = 0; i < data.length; i += 1) data[i] = px[i] / 255;
      setThumb({ width: w, height: h, data });
    } catch {
      setThumb(null);
    }
  }, [source]);

  const session = React.useMemo<PhotoSession>(
    () => ({
      projectId: serverId,
      signedIn: signedIn === true,
      capabilities: caps,
      source: source ? { width: source.width, height: source.height } : null,
      currentFile: () => {
        if (isLocal && localProject) {
          const b = (healRef ? baseBlobs.current.get(healRef) : null) ?? localProject.base ?? localProject.original;
          return b ? { blob: b, name: localProject.fileName } : null;
        }
        const f = originalFile ?? (originalBlob.current ? new File([originalBlob.current], 'photo') : null);
        return f ? { blob: f, name: f.name } : null;
      },
      thumb,
      histogram,
      requestPick: () => setPicking('mask'),
      picked: pickedMask,
      keepLocalMask: (ref, blob) => registerSubjectMask(ref, blob),
      onHealed: async (outcome: HealOutcome) => {
        let next: PhotoSourceInfo | null = null;
        if (outcome.blob) {
          baseBlobs.current.set(outcome.baseRef, outcome.blob);
          next = await decode(outcome.blob);
          if (isLocal) void setLocalBase(outcome.blob);
        } else if (serverId) {
          next = await loadServerBase(serverId, outcome.baseRef);
        }
        if (!next) throw new Error('heal base could not be loaded');
        loadedBase.current = outcome.baseRef;
        setSource(next);
      },
    }),
    [serverId, signedIn, caps, source, isLocal, localProject, healRef, originalFile, thumb, histogram, pickedMask, decode, loadServerBase],
  );
  const fetchMaskBlob = React.useCallback(
    (ref: string) => (serverId ? fetchProjectFile(serverId, ref) : Promise.reject(new Error('no project'))),
    [serverId],
  );

  // ---- render ------------------------------------------------------------------------
  if (!doc || !source) {
    return (
      <>
        {loading ? (
          <div className="flex min-h-dvh items-center justify-center p-4 text-sm text-muted-foreground" role="status">
            {t('photo.loading')}
          </div>
        ) : (
          <OpenScreen
            onFile={(f) => void openFile(f)}
            localName={localProject ? localProject.name : null}
            onContinueLocal={() => localProject && void openLocal(localProject)}
            recent={recent}
            onOpenRecent={(id) => {
              window.location.assign(`/photo/${id}`);
            }}
            error={openError}
          />
        )}
        <ReplaceLocalDialog
          open={!!pendingFile}
          onCancel={() => setPendingFile(null)}
          onConfirm={() => {
            const f = pendingFile;
            setPendingFile(null);
            if (f) void openFile(f, true);
          }}
        />
      </>
    );
  }

  const stateLabel =
    saveState === 'uploading' ? t('photo.bar.state.uploading') : saveState === 'saving' ? t('photo.bar.state.saving') : saveState === 'error' ? t('photo.bar.state.error') : isLocal ? t('photo.bar.state.local') : dirty ? t('photo.bar.state.unsaved') : t('photo.bar.state.saved');
  const canSave = !!serverId && saveState !== 'uploading';
  const panelBody = (() => {
    switch (panel) {
      case 'basic':
        return <BasicPanel />;
      case 'curves':
        return <CurvesPanel pickedValue={picking === null && picked ? picked : null} onRequestPick={() => setPicking('curves')} />;
      case 'levels':
        return <LevelsPanel histogram={histogram} />;
      case 'hsl':
        return <HslPanel pickedValue={picking === null && picked ? picked : null} onRequestPick={() => setPicking('hsl')} />;
      case 'colorBalance':
        return <ColorBalancePanel />;
      case 'blackWhite':
        return <BlackWhitePanel />;
      case 'channelMixer':
        return <ChannelMixerPanel />;
      case 'photoFilter':
        return <PhotoFilterPanel />;
      case 'splitTone':
        return <SplitTonePanel />;
      case 'lut':
        return <LutPanel />;
      case 'effects':
        return <EffectsPanel />;
      case 'masks':
        return <MasksPanel />;
      case 'geometry':
        return <GeometryPanel />;
      case 'heal':
        return <HealPanel />;
      case 'redEye':
        return <RedEyePanel />;
      case 'layers':
        return <LayersPanel onOpenPanel={openPanel} />;
    }
  })();

  return (
    <PhotoSessionProvider value={session}>
    <div className="flex h-dvh flex-col bg-background text-foreground" data-testid="photo-editor">
      <header className="flex flex-wrap items-center gap-2 border-b border-edge px-3 py-2">
        <Link href={localized('/')} aria-label={t('photo.backHome', { brand: PHOTO_BRAND })} className="shrink-0">
          <Wordmark />
        </Link>
        <span className="rounded-full border border-premium/40 bg-premium/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-premium" data-testid="photo-beta-chip">
          {PHOTO_BRAND} · {t('photo.beta')}
        </span>
        <input
          aria-label={t('photo.projectName')}
          value={name}
          maxLength={80}
          placeholder={t('photo.untitled')}
          onChange={(e) => usePhotoStore.getState().rename(e.target.value)}
          className="min-w-0 flex-1 rounded border border-transparent bg-transparent px-2 py-1 text-sm hover:border-edge focus:border-primary"
        />
        {reduced ? (
          <span className="rounded border border-edge px-2 py-0.5 text-xs text-muted-foreground" data-testid="reduced-chip" title={t('photo.bar.bigPhotoNote')}>
            {t('photo.bar.reducedPreview')}
          </span>
        ) : null}
        <span className="text-xs text-muted-foreground" aria-live="polite" data-testid="save-state">
          {stateLabel}
        </span>
        <Button size="icon" variant="ghost" aria-label={t('photo.bar.undo')} disabled={!canUndo} onClick={() => usePhotoStore.getState().undo()}>
          <Undo2 className="size-4" aria-hidden="true" />
        </Button>
        <Button size="icon" variant="ghost" aria-label={t('photo.bar.redo')} disabled={!canRedo} onClick={() => usePhotoStore.getState().redo()}>
          <Redo2 className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => canvasRef.current?.fit()}>
          {t('photo.bar.fit')}
        </Button>
        <Button size="sm" variant="outline" onClick={() => canvasRef.current?.actualSize()}>
          {t('photo.bar.actualSize')}
        </Button>
        <Button size="sm" variant="outline" aria-pressed={split !== null} onClick={() => { if (split === null) onCompareUsed('split'); setSplit((s) => (s === null ? 0.5 : null)); }}>
          {t('photo.bar.split')}
        </Button>
        <Button size="sm" variant="outline" disabled={!canSave} onClick={() => void save()}>
          {t('photo.bar.save')}
        </Button>
        <Button size="sm" onClick={() => setExportOpen(true)} data-testid="export-open">
          {t('photo.bar.export')}
        </Button>
      </header>

      {isLocal && signedIn !== true ? <LocalBanner count={freeProjects} /> : null}
      {uploadOffer && isLocal && signedIn === true ? (
        <UploadOffer canUpload={uploadOffer.canUpload} busy={offerBusy} error={offerError} onAccept={() => void acceptOffer()} onDismiss={() => setUploadOffer(null)} />
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="relative min-h-0 flex-1">
          <PhotoCanvas
            handleRef={canvasRef}
            source={source}
            doc={doc}
            showOriginal={showOriginal}
            split={split}
            onSplitChange={setSplit}
            picking={picking !== null}
            onPick={onPick}
            onReducedPreview={setReduced}
            onRendered={onRendered}
            maskView={maskView}
            viewLayerId={maskLayerId ?? selection}
            fetchMaskBlob={fetchMaskBlob}
            toolActive={tool !== 'none' && tool !== 'eyedropper'}
            ignoreCrop={tool === 'crop'}
            overlay={({ view, iw, ih, wrap }) => <ToolOverlay view={view} iw={iw} ih={ih} wrap={wrap} source={{ width: source.width, height: source.height }} />}
          />
          <div className="pointer-events-none absolute bottom-2 start-2 w-48 opacity-90" dir="ltr">
            <HistogramPlot histogram={histogram} className="h-14 w-full" />
          </div>
        </div>

        <aside
          className={cn('flex min-h-0 flex-col border-edge bg-surface-1 md:w-80 md:shrink-0 md:border-s', 'max-md:border-t', sheetOpen ? 'max-md:h-[46dvh]' : 'max-md:h-11')}
          aria-label={t('photo.bar.panelsTab')}
        >
          <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-edge px-2 py-1.5" role="tablist">
            <button type="button" className="shrink-0 px-2 text-xs md:hidden" aria-expanded={sheetOpen} onClick={() => setSheetOpen((o) => !o)}>
              {sheetOpen ? '▾' : '▴'}
            </button>
            {[...PANELS, 'layers' as const].map((p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={panel === p}
                onClick={() => {
                  setPanel(p);
                  setSheetOpen(true);
                }}
                className={cn('shrink-0 whitespace-nowrap rounded px-2 py-1 text-xs', panel === p ? 'bg-primary/15 text-foreground' : 'text-muted-foreground hover:text-foreground')}
              >
                {t(`photo.panels.${p}`)}
              </button>
            ))}
          </div>
          <div className={cn('min-h-0 flex-1 overflow-y-auto', !sheetOpen && 'max-md:hidden')}>{panelBody}</div>
        </aside>
      </div>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        doc={doc}
        projectName={name || t('photo.untitled')}
        projectId={serverId}
        file={originalFile ? { blob: originalFile, name: originalFile.name } : localProject?.original ? { blob: localProject.original, name: localProject.fileName } : null}
        signedIn={signedIn === true}
        capabilities={caps}
        originalFile={originalFile}
      />
      <ConflictDialog open={conflict !== null} onKeepMine={() => void onKeepMine()} onLoadTheirs={() => void onLoadTheirs()} />
      <DraftDialog
        open={!!draft}
        when={draft ? new Date(draft.savedAt).toLocaleString() : ''}
        onRestore={() => {
          if (draft) usePhotoStore.getState().mutate('Restore draft', () => draft.document);
          setDraft(null);
        }}
        onDiscard={() => {
          if (draft) void deletePhotoDraft(draft.projectId);
          setDraft(null);
        }}
      />
      <ReplaceLocalDialog open={!!pendingFile} onCancel={() => setPendingFile(null)} onConfirm={() => { const f = pendingFile; setPendingFile(null); if (f) void openFile(f, true); }} />
    </div>
    </PhotoSessionProvider>
  );
}
