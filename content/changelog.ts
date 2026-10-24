// MM34 — public changelog. Original, factual release notes (English body; the
// /changelog page chrome is localized). Newest first. Dates are the real
// merge dates from git (UI and API repos). Only list what has shipped: no
// share links (MM32), and email is configured off, so only the preference
// toggles are mentioned, never "we email you".

export type ChangelogTag = 'new' | 'improved' | 'fixed';

export interface ChangelogLink {
  label: string;
  /** Locale-neutral site path, e.g. '/pricing'. */
  href: string;
}

export interface ChangelogEntry {
  id: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  title: string;
  body: string;
  tags: ChangelogTag[];
  links?: ChangelogLink[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    id: '2026-10-24-email-preferences',
    date: '2026-10-24',
    title: 'Email preferences in your profile',
    body: 'Signed-in accounts now have email toggles in Profile: one for AI job finished notices and one for expiry reminders. The choices are saved with your account and take effect once email sending is switched on; nothing is being sent yet.',
    tags: ['new'],
  },
  {
    id: '2026-10-24-account-tour',
    date: '2026-10-24',
    title: 'A short tour for new accounts',
    body: 'New accounts get a brief walkthrough covering History, Darkroom projects and your retention choice. You can skip it, and replay it any time from Profile.',
    tags: ['new'],
  },
  {
    id: '2026-10-24-upgrade-prompts',
    date: '2026-10-24',
    title: 'Clearer limit and upgrade messages',
    body: 'When you reach a daily limit, a file-size cap or a resolution cap, the message now says which one it was and what Premium changes. A small chip shows how many jobs you have left today.',
    tags: ['improved'],
    links: [{ label: 'Plans and limits', href: '/pricing' }],
  },
  {
    id: '2026-10-24-guest-recent',
    date: '2026-10-24',
    title: 'Recent results for guests',
    body: 'Without an account, your last results now appear in a Recent strip on the tool page. They are kept in your browser for 24 hours, up to 20 items, and move to your account history if you sign in.',
    tags: ['new'],
  },
  {
    id: '2026-10-24-presets-and-ai-tools',
    date: '2026-10-24',
    title: 'Tool presets and seven new AI tools',
    body: 'Tool pages now open with the right task already selected. Seven new AI tools have their own pages: AI image upscaler, blur faces in photo, redact text in image, remove object from photo, clean voice audio, remove background noise, and remove vocals from song.',
    tags: ['new', 'improved'],
    links: [{ label: 'Browse tools', href: '/tools' }],
  },
  {
    id: '2026-10-23-retention-and-account',
    date: '2026-10-23',
    title: 'You choose how long results are kept',
    body: 'Signed-in accounts can set retention from 24 hours to 2 years. The account page now has tabs for Overview, History, Projects, Billing, Privacy & data and Profile, with an export of your data and a way to delete your account.',
    tags: ['new'],
  },
  {
    id: '2026-10-23-premium',
    date: '2026-10-23',
    title: 'Premium with Stripe',
    body: 'Premium is available monthly or yearly through Stripe checkout. It removes ads and raises daily operations, file size, video length and output resolution. Manage or cancel from the account page.',
    tags: ['new'],
    links: [{ label: 'Plans and pricing', href: '/pricing' }],
  },
  {
    id: '2026-10-23-darkroom-images',
    date: '2026-10-23',
    title: 'Still images in Darkroom',
    body: 'Darkroom now accepts still images, including JPG, PNG, WebP and HEIC, as clips on the timeline alongside video and audio.',
    tags: ['new'],
    links: [{ label: 'Open Darkroom', href: '/tools/content-studio' }],
  },
  {
    id: '2026-10-23-metadata-inspector',
    date: '2026-10-23',
    title: 'Metadata inspector',
    body: 'Inspect the metadata embedded in an image, video or audio file, with a plain-language description for each tag. The inspector reads the file without altering it.',
    tags: ['new'],
    links: [{ label: 'Remove EXIF metadata', href: '/tools/remove-exif-metadata' }],
  },
  {
    id: '2026-10-23-result-viewers',
    date: '2026-10-23',
    title: 'Result viewers and compare',
    body: 'Results open in a built-in viewer instead of a plain download link. Compare original and result with a wipe slider, side by side or a toggle, for images, video and audio, and read transcripts and captions in the viewer.',
    tags: ['new', 'improved'],
  },
];
