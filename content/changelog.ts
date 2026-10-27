// MM34 — public changelog. Original, factual release notes (English body; the
// /changelog page chrome is localized). Newest first. Dates are the real
// merge dates from git (UI and API repos). Only list what has shipped. Email
// is configured off, so only the preference toggles are mentioned, never
// "we email you".

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
    id: '2026-10-27-18-languages',
    date: '2026-10-27',
    title: 'Now in 18 languages',
    body: 'Media Manipulator is now available in 18 languages. New since this month: French, Italian, Japanese, Simplified and Traditional Chinese, Korean, Arabic (right to left), Hindi, European and Brazilian Portuguese, Vietnamese, and Latin-American Spanish alongside the Spanish of Spain. Pick a language from the selector in the header; each one has its own address, such as /fr or /es-mx. The new translations were written with an AI model, and native-speaker review is ongoing, so some wording may still change. Where a translated Privacy Policy or Terms differs from the English text, the English version applies.',
    tags: ['new'],
  },
  {
    id: '2026-10-26-prices-in-euros',
    date: '2026-10-26',
    title: 'Prices in euros for European visitors, switchable any time',
    body: 'Visitors in Europe now see prices in euros: Premium is €8 a month or €80 a year and Pro is €15 or €150, the same numbers as in US dollars. Anyone can switch between USD and EUR on the pricing page, on the Billing tab and in the upgrade prompts, and the choice is remembered. A subscription keeps the currency it was bought in, and no tax is added on top.',
    tags: ['new'],
    links: [{ label: 'Compare plans', href: '/pricing' }],
  },
  {
    id: '2026-10-26-motion-pro-video',
    date: '2026-10-26',
    title: 'Motion: MP4, WebM and PNG sequence exports on Pro',
    body: 'Pro now includes video exports in Motion: MP4, WebM and PNG sequences, up to 4K at 60 fps and 60 seconds, with 150 Motion exports a day. The export dialog marks each format your plan does not include with a lock and names the plan that does, with one button to sign in or upgrade. Exports are still made in your browser.',
    tags: ['new', 'improved'],
    links: [
      { label: 'Open Motion', href: '/tools/motion' },
      { label: 'Compare plans', href: '/pricing' },
    ],
  },
  {
    id: '2026-10-26-motion-beta',
    date: '2026-10-26',
    title: 'Motion (beta): animate SVG in your browser',
    body: 'Motion is a new SVG animation editor. Import an SVG or Lottie file, or draw with the shape, pen and text tools, then animate position, scale, rotation, opacity, colour and stroke on a keyframe timeline with easing presets, custom curves and holds. One-click animators add stroke draw-on, motion paths, shape morphs, gradient, mask and blur animation. Export a static SVG for free, or an animated SVG, Lottie JSON, a React component, a JavaScript or TypeScript module, a Flutter widget or a GIF. Every export is made in your browser. Animated exports count toward a daily Motion allowance that depends on your plan, and the tool page shows which formats each plan includes. Projects stay in your browser, or in your account when you are signed in. The Privacy Policy and Terms have a short Motion addition.',
    tags: ['new'],
    links: [
      { label: 'Open Motion', href: '/tools/motion' },
      { label: 'Compare plans', href: '/pricing' },
    ],
  },
  {
    id: '2026-10-26-darkroom-rebuild-previews',
    date: '2026-10-26',
    title: 'Faster seeking for clips you imported earlier',
    body: 'Video clips imported before today now seek as quickly in the Darkroom preview as new ones, without importing them again. The media bin shows how many clips have an older preview: choose Rebuild to re-encode all of them from the original files, or pick Rebuild preview from a single clip\'s menu. You can keep editing while they rebuild, and each clip switches to its new preview when it is ready. Your edit and your exports are not changed.',
    tags: ['improved'],
    links: [{ label: 'Open Darkroom', href: '/tools/content-studio' }],
  },
  {
    id: '2026-10-26-darkroom-smoother-playback',
    date: '2026-10-26',
    title: 'Smoother Darkroom playback',
    body: 'Darkroom preview no longer freezes on a frame while the audio keeps playing. Before, a slow connection could leave the picture stuck for seconds, or until you paused and pressed play again. Now the music and dialogue set the pace, the picture catches up on its own, and the next clip starts loading before the cut. Video imported from today seeks faster in the preview. To speed up seeking on a clip imported earlier, import it again.',
    tags: ['fixed', 'improved'],
    links: [{ label: 'Open Darkroom', href: '/tools/content-studio' }],
  },
  {
    id: '2026-10-25-media-manipulator-pro',
    date: '2026-10-25',
    title: 'Media Manipulator Pro',
    body: 'A new plan above Premium: $15 a month or $150 a year. Pro raises the daily allowance for operations, AI jobs and Darkroom exports, keeps Premium\'s file size, length and resolution limits, and comes with the largest Motion allowance when Motion arrives. The pricing page now compares Free, Premium and Pro side by side. Premium subscribers can upgrade from the Billing tab and pay only the prorated difference, with the same renewal date; moving back to Premium happens at the end of the paid period. The 14-day refund on a first payment applies to both plans.',
    tags: ['new'],
    links: [{ label: 'Compare plans', href: '/pricing' }],
  },
  {
    id: '2026-10-24-share-links',
    date: '2026-10-24',
    title: 'Share a result with a link',
    body: 'Use Share on a finished result to copy a private link anyone can open to view and download it, with no account needed. Links last 72 hours by default and never longer than the file itself is kept. You can revoke them any time from your history. Metadata reports and Darkroom projects cannot be shared.',
    tags: ['new'],
  },
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
