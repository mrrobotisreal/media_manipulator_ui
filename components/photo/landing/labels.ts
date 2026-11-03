/** Server-side assembly of the strings the Aperture launcher and drop zone islands receive (MM100). */
import type { PhotoLauncherLabels } from './photo-launcher';
import type { PhotoDropzoneLabels } from './photo-dropzone';

type Translate = (key: string, options?: Record<string, unknown>) => string;

export function photoDropzoneLabels(t: Translate): PhotoDropzoneLabels {
  return {
    drop: t('photoPage.dropzone.drop'),
    choose: t('photoPage.dropzone.choose'),
    hint: t('photoPage.dropzone.hint'),
    opening: t('photoPage.dropzone.opening'),
    openEmpty: t('photoPage.dropzone.openEmpty'),
  };
}

export function photoLauncherLabels(t: Translate, title: string, description: string): PhotoLauncherLabels {
  return {
    ...photoDropzoneLabels(t),
    title,
    description,
    recentTitle: t('photoPage.launcher.recentTitle'),
    sourceAccount: t('photoPage.launcher.sourceAccount'),
    sourceBrowser: t('photoPage.launcher.sourceBrowser'),
    loading: t('photoPage.launcher.loading'),
    empty: t('photoPage.launcher.empty'),
    error: t('photoPage.launcher.error'),
    untitled: t('photo.untitled'),
    edited: t('photoPage.launcher.edited'),
  };
}
