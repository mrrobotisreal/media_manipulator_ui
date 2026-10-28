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
  // MM82: AdSense loader under Consent Mode, advertising switch, consent bar fix.
  {
    id: '2026-10-28-ads-tool-pages',
    date: '2026-10-28',
    title: 'Ads are switching on for free and anonymous visitors on tool pages',
    body: 'Ads are switching on for free and anonymous visitors on tool pages; Premium and Pro never see them. At most one ad appears on a tool page, well below the tool itself, and never on the home page, the tools list, pricing, your account or the legal pages. Google\'s ad script only loads on pages that can show an ad, with every consent signal denied until you choose, so ads are not personalised unless you allow it. Outside Europe you can now turn personalised ads on or off under "Cookie settings" in the footer; in Europe, the UK and Switzerland Google\'s own consent message asks about ads, and our bar still asks only about analytics.',
    tags: ['new', 'improved'],
  },
  // MM80: large results download through the browser's download manager.
  {
    id: '2026-10-28-large-downloads',
    date: '2026-10-28',
    title: 'Large results now download reliably, with clear feedback',
    body: 'Downloading a very large result, such as the vocal or instrumental track of a long recording, could sit on a spinner and never produce a file. Downloads now go straight to your browser\'s own download manager, so even files close to a gigabyte arrive with the browser\'s progress bar and can be paused and resumed. The Download button says "Preparing download…" while it gets ready, then a line under it confirms that the download has started, with the file size. If something goes wrong you see why, with a Try again button. Downloading a result again never runs the job again and never uses up an operation.',
    tags: ['fixed', 'improved'],
  },
  // MM79: Darkroom voiceover from a saved or preset voice.
  {
    id: '2026-10-28-darkroom-voiceover',
    date: '2026-10-28',
    title: 'Generate a voiceover from a saved voice inside Darkroom',
    body: 'Darkroom\'s media bin has a new Generate voiceover button next to the microphone. Type a script, pick one of your saved voices or a preset voice and a language, and the voiceover is rendered on our own servers, added to the project as an audio clip and placed at the playhead, just like a recorded voiceover. Saved voices need you to be signed in; the preset voices work for everyone. Each voiceover counts as one AI job, a failed one is not counted, and the length of text per request depends on your plan. The button only appears when the voice engine is available.',
    tags: ['new'],
    links: [
      { label: 'Open Darkroom', href: '/tools/content-studio' },
      { label: 'Clone your voice', href: '/tools/voice-cloning' },
    ],
  },
  // MM75: video and audio summaries (the MM74 pipeline).
  {
    id: '2026-10-28-video-summaries',
    date: '2026-10-28',
    title: 'AI summaries of videos and recordings, with chapters you can click',
    body: 'Summarize video now writes a real summary: a title, a few sentences, chapters with start and end times, the topics, and the text that appears on screen, plus short notes on the picture and the speech. Click a chapter to jump to that moment in your file, copy the whole summary as Markdown, or download it as Markdown or JSON. The new Summarize audio page does the same for podcasts, interviews and voice memos. Pick the language the summary is written in, or keep the language that is spoken. Whisper transcribes the speech, a vision model looks at frames chosen where the picture changes, and a language model writes the summary, all on our own GPU servers; nothing is sent to a third-party AI. Summaries need a free account and count as one AI job; a failed job is not counted. Signed-in history now labels a summary with its title.',
    tags: ['new'],
    links: [
      { label: 'Summarize a video', href: '/tools/summarize-video' },
      { label: 'Summarize audio', href: '/tools/summarize-audio' },
    ],
  },
  // MM78: voices (clone, design, change a voice).
  {
    id: '2026-10-28-voices',
    date: '2026-10-28',
    title: 'Voices: clone your voice, design a new one, change the voice of a recording',
    body: 'Three new voice tools run on open models on our own servers. Voice cloning makes a voice from 5 to 60 seconds of your own speech and reads any text with it in 23 languages, with an emotion control. The voice designer turns a written description into free previews (three per description an hour) and keeps the one you like. The voice changer shifts the pitch and character of a recording instantly, or converts it to one of your saved voices or a preset voice with AI, and lets you compare before and after. Saving a voice needs an account and a confirmation that the voice is yours or that you have the speaker\'s permission; the number of saved voices, the length of text per request and conversion depend on your plan. Speech made with a saved or preset voice, and converted recordings, carry an inaudible watermark; shifted audio does not. Nothing you record is used to train any model, and you can delete a voice at any time from Account, Voices. A voice will not be a perfect copy of anyone, and the first request after a quiet period can take up to 20 seconds while the engine loads. The Privacy Policy (new section 1.10) and the Terms (new section 8.11) cover voices.',
    tags: ['new'],
    links: [
      { label: 'Clone your voice', href: '/tools/voice-cloning' },
      { label: 'Design a voice', href: '/tools/voice-designer' },
      { label: 'Change a voice', href: '/tools/voice-changer' },
    ],
  },
  {
    id: '2026-10-28-tools-catalog',
    date: '2026-10-28',
    title: 'The Tools page now lists every tool, with search',
    body: 'The Tools page is now a full catalog of more than a hundred tools, with a search box and category tabs, instead of the short list it showed before. The Audio section is back, and features that until now were only reachable inside the home-page converter have their own pages: change video speed, reverse, flip and stabilise video, change the frame rate, adjust brightness and colour, convert to HEVC; convert audio to WAV, FLAC, OGG, M4A or Opus, change audio speed or pitch, normalise, adjust volume, equalise, add reverb, trim and transcribe audio; add text to an image, crop, rotate, sharpen, blur, apply filters and edit image metadata; generate VTT captions; and a metadata inspector for any file. Each page opens its form on the setting it is about.',
    tags: ['new', 'improved'],
    links: [{ label: 'Browse all tools', href: '/tools' }],
  },
  {
    id: '2026-10-28-failed-jobs-not-counted',
    date: '2026-10-28',
    title: 'Failed and refused jobs no longer count against your daily allowance',
    body: 'A job that the server refuses (a file over your plan\'s size or length limit, an unsupported type) or that fails while processing no longer uses up one of your daily operations; the allowance is given back and the meter updates. Separately, an audio file with embedded cover art (for example an MP3 saved from a video) was being treated as a 90,000 fps video and rejected; cover art is now recognised as a picture and the audio converts normally.',
    tags: ['fixed'],
  },
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
