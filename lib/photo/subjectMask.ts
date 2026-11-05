/**
 * The AI subject mask flow (MM98), shared by the Masks panel and Medi's `subject_mask`
 * suggested action (MM108): signed-in projects use the project route, guests the stateless one;
 * the result becomes a `subject` component of `layerId`'s mask (one history step,
 * "Select subject"). Spends one `ops` (the API counts it); a 429 is raised to the quota sheet by
 * authedFetch and rethrown here as `QuotaExceededError`.
 */
import { fetchProjectFile, requestSubjectMask, requestSubjectMaskStateless } from '@/lib/photo/aiApi';
import { loadSubjectAlpha, registerSubjectMask } from '@/lib/photo/maskAssets';
import { addComponent, maskOfLayer } from '@/lib/photo/maskOps';
import { usePhotoStore } from '@/lib/photo/photoStore';
import type { MaskComponent } from '@/lib/photo/photoTypes';
import { onAiMaskCompleted, onAiMaskFailed, onAiMaskRequested, onMaskAdded } from '@/lib/photo/seams';
import { useToolStore } from '@/lib/photo/toolStore';
import type { PhotoSession } from '@/components/photo/session-context';

export async function selectSubjectMask(session: Pick<PhotoSession, 'projectId' | 'signedIn' | 'currentFile' | 'keepLocalMask'>, layerId: string, invert = false): Promise<void> {
  onAiMaskRequested();
  try {
    let maskRef: string;
    if (session.projectId && session.signedIn) {
      const r = await requestSubjectMask(session.projectId);
      maskRef = r.maskRef;
      void loadSubjectAlpha(maskRef, (ref) => fetchProjectFile(session.projectId as string, ref));
    } else {
      const f = session.currentFile();
      if (!f) throw new Error('no file');
      const id = `${Date.now().toString(36)}${Math.floor(performance.now()).toString(36)}`;
      const r = await requestSubjectMaskStateless(f.blob, f.name, () => id);
      maskRef = r.maskRef;
      if (r.blob) {
        registerSubjectMask(maskRef, r.blob);
        session.keepLocalMask(maskRef, r.blob);
        await loadSubjectAlpha(maskRef);
      }
    }
    usePhotoStore.getState().mutate('Select subject', (d) => addComponent(d, layerId, { kind: 'subject', mode: 'add', maskRef, invert } as MaskComponent));
    const n = (maskOfLayer(usePhotoStore.getState().doc!, layerId)?.components.length ?? 1) - 1;
    useToolStore.getState().setComponent(n);
    onMaskAdded('subject');
    onAiMaskCompleted();
  } catch (e) {
    // A 429 is raised to the existing quota sheet by authedFetch; the caller shows its own message otherwise.
    onAiMaskFailed(e instanceof Error ? e.name : 'failed');
    throw e;
  }
}
