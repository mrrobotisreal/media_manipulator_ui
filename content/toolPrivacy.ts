/**
 * MM84 decision 2(a): the privacy note of every tool page outside the copy bar
 * is one page-specific first sentence (what this tool does with the file)
 * followed by its category's template. The copy-bar pages (the 24 in
 * REVIEW_CATALOG_SLUGS) write their own notes in full.
 *
 * The retention sentence is RETENTION_PROMISE verbatim (MM26); nothing else
 * may describe retention. content/toolCopy.test.ts exempts these template
 * sentences from the site-wide duplication limit, and only these.
 */
import { RETENTION_PROMISE } from '@/content/retentionPromise';

export type PrivacyTemplateKey = 'image' | 'video' | 'audio' | 'ai' | 'metadata';

export const PRIVACY_TEMPLATES: Record<PrivacyTemplateKey, string> = {
  image: `Nothing is sent to an outside service. ${RETENTION_PROMISE}. The original is never altered: you download a new file.`,
  video: `The work runs on our own servers, not a third-party transcoding service. ${RETENTION_PROMISE}. Your source file is left untouched and the result is a new file.`,
  audio: `No outside audio service is involved. ${RETENTION_PROMISE}. You get a new file; the upload itself is not changed.`,
  ai: `AI work runs on hardware we operate, never a third-party AI provider, and nothing you upload is used to train a model. ${RETENTION_PROMISE}.`,
  metadata: `No third party sees the file or its tags. ${RETENTION_PROMISE}.`,
};

/** A bulk page's privacy note: its own first sentence, then the category template. */
export function privacyNoteFor(key: PrivacyTemplateKey, firstSentence: string): string {
  return `${firstSentence.trim()} ${PRIVACY_TEMPLATES[key]}`;
}
