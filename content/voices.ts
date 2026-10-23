/**
 * Mitchell Wintrow's two professional voice clones on ElevenLabs, with the demo
 * scenes that show them off in eight languages.
 *
 * The audio files under public/audio/voices/ are copies of winapps.io's
 * public/sumrak/voices/ (same renders, same filenames). Opus in WebM first,
 * AAC in MP4 for older Safari. Durations are measured from the files.
 *
 * Only facts live here (ids, links, files, durations). Every visible string is
 * localized under `voices.*` in interface/pages.json and handed to the client
 * component by the server-rendered surfaces.
 */

export interface VoiceDemoLanguage {
  /** BCP 47 code; also the filename suffix. */
  code: string;
  /** Native name, shown in the picker. */
  label: string;
  dir: 'ltr' | 'rtl';
}

export interface VoiceDemoSource {
  src: string;
  type: string;
}

export interface VoiceDemoRendition {
  lang: string;
  durationSeconds: number;
  sources: VoiceDemoSource[];
}

export interface Voice {
  /** Stable id: analytics value and audio filename prefix. */
  id: 'mr-wintrow' | 'obsidian';
  /** Proper name, never translated. */
  name: string;
  /** Key under `voices.roles.*`. */
  role: 'narration' | 'characters';
  /** Key under `voices.*` holding description / demoTitle / demoDescription. */
  copyKey: 'mrWintrow' | 'obsidian';
  /** Public share link in the ElevenLabs voice library. */
  elevenLabsUrl: string;
  renditions: VoiceDemoRendition[];
}

/** Display order; the first is the default. */
export const VOICE_DEMO_LANGUAGES: VoiceDemoLanguage[] = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ru', label: 'Русский', dir: 'ltr' },
  { code: 'he', label: 'עברית', dir: 'rtl' },
  { code: 'uk', label: 'Українська', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'ja', label: '日本語', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
];

/** Site locale (`ru-RU`) → the demo language to preselect, when there is one. */
export function defaultDemoLanguageFor(locale: string | undefined): string {
  const code = (locale ?? 'en').slice(0, 2).toLowerCase();
  return VOICE_DEMO_LANGUAGES.some((l) => l.code === code) ? code : VOICE_DEMO_LANGUAGES[0].code;
}

const renditions = (voiceId: Voice['id'], seconds: Record<string, number>): VoiceDemoRendition[] =>
  VOICE_DEMO_LANGUAGES.map(({ code }) => ({
    lang: code,
    durationSeconds: seconds[code],
    sources: [
      { src: `/audio/voices/${voiceId}-${code}.webm`, type: 'audio/webm; codecs="opus"' },
      { src: `/audio/voices/${voiceId}-${code}.m4a`, type: 'audio/mp4' },
    ],
  }));

export const VOICES: Voice[] = [
  {
    id: 'mr-wintrow',
    name: 'Mr. Wintrow',
    role: 'narration',
    copyKey: 'mrWintrow',
    elevenLabsUrl:
      'https://elevenlabs.io/app/voice-lab/share/437b6c647ef328e2535d05d610a2cc1f1813a37ba51d58b502d655f8e1ed97f7/HQ4Xi3gPf8Q6bJUlao6z',
    renditions: renditions('mr-wintrow', { en: 180, ru: 180, he: 180, uk: 180, de: 180, fr: 180, ja: 192, es: 180 }),
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    role: 'characters',
    copyKey: 'obsidian',
    elevenLabsUrl:
      'https://elevenlabs.io/app/voice-lab/share/98f56dc987320f0d940cd99d45980b44a5b07a67a621c0f0cc4f091d2087b97a/QjEdRoRdZC2i3ncmFpNy',
    renditions: renditions('obsidian', { en: 114, ru: 114, he: 114, uk: 114, de: 114, fr: 114, ja: 114, es: 114 }),
  },
];
