import PhotoEditorClient from '@/components/photo/editor-client';

/**
 * /photo/[projectId]: the Aperture editor. `projectId` is `new` (file picker /
 * drop zone, or `?from=<jobId>` to open a result), `local` (the one
 * browser-local project) or a server project id. Next 16: `params` is a
 * Promise, awaited here and handed to the browser-only editor.
 */
export default async function PhotoEditorPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <PhotoEditorClient projectId={projectId} />;
}
