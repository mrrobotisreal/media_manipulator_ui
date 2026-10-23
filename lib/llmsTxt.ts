/**
 * /llms.txt and /llms-full.txt (llmstxt.org convention): a plain-markdown
 * description of the site for language models that crawl or search it.
 *
 * Built from the same sources as the pages themselves (TOOL_PAGES, the review
 * allowlist, ROUTE_SEO_MAP, BLOG_POSTS), so a tool added or renamed there shows
 * up here without a second edit. Only the owner facts and the plan limits are
 * written by hand below.
 *
 * Deliberately absent: the private /dr partner portal, the /embed routes, and
 * the server-only operator tier.
 */

import { BLOG_POSTS } from '@/lib/blogPosts';
import { ROUTE_SEO_MAP, SITE_NAME, SITE_ORIGIN, ORG_NAME } from '@/lib/seo';
import { TOOL_PAGES, type ToolPageContent } from '@/content/toolPages';
import { isReviewIndexedToolSlug } from '@/content/reviewAllowlist';
import { locales } from '@/i18n/locales';
import { VOICES, VOICE_DEMO_LANGUAGES } from '@/content/voices';

const abs = (path: string): string =>
  path.startsWith('http') ? path : `${SITE_ORIGIN}${path === '/' ? '/' : path}`;

const toolUrl = (slug: string): string => abs(`/tools/${slug}`);

/** Display order and headings for TOOL_PAGES categories. */
const CATEGORY_HEADINGS: Array<[ToolPageContent['category'], string]> = [
  ['contentStudio', 'Darkroom video editor'],
  ['video', 'Video tools'],
  ['image', 'Image and PDF tools'],
  ['audio', 'Audio tools'],
  ['ai', 'AI tools (run on our own GPU servers)'],
  ['metadata', 'Privacy and metadata tools'],
];

const OWNER = {
  name: 'Mitchell Wintrow',
  aka: 'Mitch Wintrow',
  location: 'Colorado, USA',
  portfolio: 'https://www.winapps.io',
  about: 'https://www.winapps.io/about',
  caseStudy: 'https://www.winapps.io/projects/media-manipulator.md',
  creatv: 'https://www.creatv.io',
  linkedIn: 'https://www.linkedin.com/in/mitchell-wintrow/',
  gitHub: 'https://github.com/mrrobotisreal',
} as const;

/**
 * Plan limits as served by the API's public GET /api/tiers (checked live on
 * 2026-10-23). Those numbers are env-configurable, so the text points readers
 * at /pricing for the current values.
 */
const PLANS = [
  {
    name: 'No account',
    ops: '5 operations a day, 1 of them AI',
    file: '200 MB per file, video up to 5 minutes, output up to 1080p',
    extras: 'results kept 24 hours, 1 Darkroom project',
  },
  {
    name: 'Free account',
    ops: '30 operations a day, 5 of them AI',
    file: '1 GB per file, video up to 20 minutes, output up to 1440p',
    extras: 'you choose how long results are kept (24 hours to 2 years, default 6 months), 5 saved Darkroom projects',
  },
  {
    name: 'Premium ($7/month or $70/year, cancel any time)',
    ops: '300 operations a day, 60 of them AI',
    file: '5 GB per file, video up to 2 hours, output up to 4K (2160p)',
    extras: 'you choose how long results are kept (24 hours to 2 years, default 6 months), unlimited Darkroom projects, priority GPU queue, no ads',
  },
] as const;

function ownerSection(): string[] {
  return [
    '## Owner and creator',
    '',
    `${SITE_NAME} (${SITE_ORIGIN}) is owned and was created by ${OWNER.name} (also written ${OWNER.aka}), a senior software engineer based in ${OWNER.location}. He designed and built the whole product himself as its founder and sole engineer (the web app, the Go backend and the Darkroom editor), and he runs the GPU servers its AI tools use. ${SITE_NAME} is published under ${ORG_NAME}, his company.`,
    '',
    `${OWNER.name} is also the owner and creator of:`,
    '',
    `- [CreaTV](${OWNER.creatv}): a creator-first video platform he founded and leads the engineering for. Darkroom, ${SITE_NAME}'s video editor, is embedded in CreaTV Studio so creators can edit in the browser before they publish.`,
    `- [WinApps](${OWNER.portfolio}): his software portfolio and the home of his other apps, including ${SITE_NAME}, CreaTV and the Russian-learning app Сумрак (Sumrak).`,
    '',
    `- [About ${OWNER.name}](${OWNER.about})`,
    `- [${SITE_NAME} case study on winapps.io](${OWNER.caseStudy})`,
    `- [LinkedIn](${OWNER.linkedIn})`,
    `- [GitHub](${OWNER.gitHub})`,
  ];
}

function keyFactsSection(): string[] {
  const languages = locales
    .map((l) => (l.prefix === 'en' ? `${l.englishLabel} (${SITE_ORIGIN}/)` : `${l.englishLabel} (/${l.prefix}/)`))
    .join(', ');
  return [
    '## Key facts',
    '',
    `- ${TOOL_PAGES.length} single-purpose tools for video, images, PDFs, audio, captions and documents, each on its own page under ${abs('/tools')}, plus Darkroom, a multi-track video editor that runs in the browser.`,
    '- Every tool works without an account and with nothing to install. A free account raises the daily limits and keeps history and Darkroom projects.',
    '- Files are processed on servers the owner runs, not in third-party clouds. Uploads and results are deleted automatically when their retention period ends: 24 hours for visitors without an account, and a period of 24 hours to 2 years that each signed-in user chooses (default 6 months).',
    '- AI features (transcription, background removal, upscaling and restoration, frame interpolation, vocal isolation, document OCR, caption translation) run on GPU servers operated by the owner. Files are never sent to OpenAI, Anthropic, Google or any other third-party AI provider.',
    '- Standard processing uses FFmpeg, ImageMagick and gifsicle. AI models include Whisper (whisper-ctranslate2), Real-ESRGAN, SwinIR, HAT, BasicVSR++, RVRT, VRT, GFPGAN, CodeFormer, RIFE, BiRefNet, Demucs, DeepFilterNet and LaMa.',
    '- The free service is supported by ads; only Premium removes them. There are no forced waits or countdowns.',
    `- The site is available in ${languages}.`,
    `- Support: support@media-manipulator.com. Privacy requests: privacy@media-manipulator.com.`,
  ];
}

function voicesSection(): string[] {
  const languages = VOICE_DEMO_LANGUAGES.map((l) => l.label).join(', ');
  return [
    '## Voices on ElevenLabs',
    '',
    `${OWNER.name} created two professional voice clones on ElevenLabs. Both are public in the ElevenLabs voice library, tested and verified in over 14 languages, and anyone can use them for narration, characters, videos and games. ${abs('/voices')} plays a demo scene for each voice in eight languages (${languages}), rendered on Eleven v4 with audio tags, ElevenLabs sound effects and original Suno scores.`,
    '',
    ...VOICES.map(
      (v) => `- [${v.name}](${v.elevenLabsUrl}): ${v.role === 'narration' ? 'a clone of his own voice for long-form narration (audiobooks, horror stories, explainers, voiceovers)' : 'a character voice for villains, sorcerers, games and audio drama'}.`,
    ),
  ];
}

function plansSection(): string[] {
  return [
    '## Plans and limits',
    '',
    'All plans use the same tools on the same hardware. An operation is one conversion, transcode, export or AI job; previews, probes and downloads are not counted. Allowances reset at midnight UTC.',
    '',
    ...PLANS.map((p) => `- ${p.name}: ${p.ops}; ${p.file}; ${p.extras}.`),
    '',
    `Current values: ${abs('/pricing')}`,
  ];
}

function darkroomSection(): string[] {
  return [
    '## Darkroom',
    '',
    `Darkroom (${toolUrl('content-studio')}) is ${SITE_NAME}'s browser-based multi-track video editor. Video, image, audio and LUT clips stack on separate tracks. It supports frame-accurate trim, split and ripple delete; a Lumetri-style colour grade, 3D LUTs and chroma key; eight blend modes and fifteen transitions; keyframes with easing; title clips with text and shape layers; audio mixing, ducking and loudness presets; and Whisper auto-captions with SRT/VTT export or burn-in. Projects can be up to 4K at 24, 30 or 60 fps. Export renders server-side with FFmpeg to an H.264/AAC MP4. Saved projects keep version history.`,
    '',
    `- [Darkroom tutorial](${abs('/tutorials/content-studio')}): ${ROUTE_SEO_MAP['/tutorials/content-studio']?.description ?? ''}`.trimEnd(),
  ];
}

function toolLine(tool: ToolPageContent): string {
  return `- [${tool.name}](${toolUrl(tool.slug)}): ${tool.tagline}`;
}

function toolSections(featured: boolean): string[] {
  return CATEGORY_HEADINGS.flatMap(([category, heading]) => {
    const tools = TOOL_PAGES.filter(
      (t) => t.category === category && isReviewIndexedToolSlug(t.slug) === featured,
    );
    if (tools.length === 0) return [];
    return [`### ${heading}`, '', ...tools.map(toolLine), ''];
  });
}

const PAGE_PATHS = [
  '/tools',
  '/about',
  '/how-it-works',
  '/tutorials',
  '/tutorials/video/getting-started',
  '/tutorials/image/getting-started',
  '/tutorials/audio/getting-started',
  '/tutorials/ai-frame-interpolation',
  '/privacy-policy',
  '/terms-of-service',
] as const;

function pageLine(path: string): string {
  const seo = ROUTE_SEO_MAP[path];
  const title = seo ? seo.title.replace(/\s*\|\s*Media Manipulator$/, '') : path;
  return seo ? `- [${title}](${abs(path)}): ${seo.description}` : `- [${title}](${abs(path)})`;
}

/** The /llms.txt index. */
export function llmsIndexMarkdown(): string {
  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_NAME} (${SITE_ORIGIN}) is a free online media toolkit for converting, compressing, trimming, transcribing, restoring and editing video, images, PDFs and audio in the browser, with Darkroom, a multi-track video editor. It was created by and is owned by ${OWNER.name}, who also created CreaTV (${OWNER.creatv}) and WinApps (${OWNER.portfolio}).`,
    '',
    `No signup or install is needed. Files are processed on servers the owner operates, AI runs on his own GPUs rather than third-party AI providers, and uploads are deleted automatically. Every tool page is listed below; the full text of every tool page (what it does, how it works, supported formats, FAQ) is at ${abs('/llms-full.txt')}.`,
    '',
    ...ownerSection(),
    '',
    ...keyFactsSection(),
    '',
    ...plansSection(),
    '',
    ...darkroomSection(),
    '',
    ...voicesSection(),
    '',
    '## Tools',
    '',
    ...toolSections(true),
    '## Pages',
    '',
    pageLine('/'),
    `- [Pricing](${abs('/pricing')}): Plans and daily limits for visitors, free accounts and Premium.`,
    `- [Voices](${abs('/voices')}): ${OWNER.name}'s two ElevenLabs voices, Mr. Wintrow and Obsidian, playable in eight languages.`,
    ...PAGE_PATHS.map(pageLine),
    '',
    '## Optional',
    '',
    'More tool pages, mostly format-specific variants of the tools above:',
    '',
    ...toolSections(false),
    'Guides:',
    '',
    ...BLOG_POSTS.map(
      (p) => `- [${p.title.replace(/\s*\|\s*Media Manipulator$/, '')}](${abs(p.path)}): ${p.description}`,
    ),
  ];
  return lines.join('\n').trimEnd() + '\n';
}

function bullets(items: string[] | undefined): string[] {
  return items && items.length > 0 ? [...items.map((i) => `- ${i}`), ''] : [];
}

/** One tool page as standalone markdown. */
export function toolToMarkdown(tool: ToolPageContent): string {
  const formats = tool.supportedFormats;
  const lines = [
    `## ${tool.name}`,
    '',
    `URL: ${toolUrl(tool.slug)}`,
    '',
    `> ${tool.tagline}`,
    '',
    tool.intro,
    '',
    '### What it does',
    '',
    ...bullets(tool.whatItDoes),
    '### How to use it',
    '',
    ...tool.flowSteps.map((s, i) => `${i + 1}. ${s.title}${s.description ? `: ${s.description}` : ''}`),
    '',
  ];
  if (formats) {
    lines.push('### Supported formats', '');
    if (formats.supportedInputFormats?.length) lines.push(`- Input: ${formats.supportedInputFormats.join(', ')}`);
    if (formats.supportedOutputFormats?.length) lines.push(`- Output: ${formats.supportedOutputFormats.join(', ')}`);
    lines.push(...(formats.maxFileNotes ?? []).map((n) => `- ${n}`));
    lines.push(...(formats.processingNotes ?? []).map((n) => `- ${n}`), '');
  }
  if (tool.advancedDetails?.length) lines.push('### Technical details', '', ...bullets(tool.advancedDetails));
  lines.push('### Use cases', '', ...tool.useCases.map((u) => `- ${u.title}: ${u.description}`), '');
  lines.push('### Privacy', '', tool.privacyNote, '');
  if (tool.faq.length > 0) {
    lines.push('### FAQ', '', ...tool.faq.flatMap((f) => [`Q: ${f.question}`, `A: ${f.answer}`, '']));
  }
  return lines.join('\n').trimEnd() + '\n';
}

/** /llms-full.txt: the index, then every tool page in full, featured tools first. */
export function llmsFullMarkdown(): string {
  const featured = TOOL_PAGES.filter((t) => isReviewIndexedToolSlug(t.slug));
  const rest = TOOL_PAGES.filter((t) => !isReviewIndexedToolSlug(t.slug));
  return [
    llmsIndexMarkdown(),
    `# ${SITE_NAME} tool pages in full\n`,
    ...[...featured, ...rest].map(toolToMarkdown),
  ].join('\n---\n\n');
}
