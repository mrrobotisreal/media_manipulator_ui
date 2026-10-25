import MotionEditorClient from '@/components/vector/editor-client';

/**
 * /motion/[projectId] — the Motion editor. `projectId` is `new` (blank or an
 * SVG import) or a local id (an IndexedDB draft) in MM42; server ids arrive
 * with MM44. Next 16: `params` is a Promise and is awaited here, then handed
 * to the browser-only editor.
 */
export default async function MotionEditorPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <MotionEditorClient projectId={projectId} />;
}
