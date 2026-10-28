/**
 * Catalog expansion (2026-10-28): tool pages for the converter features that
 * were only reachable from the home page's advanced sections, plus the
 * remaining format pairs the engine already supports.
 *
 * Every entry here is spliced into TOOL_PAGES by content/toolPages.ts and is
 * consumed exactly like the entries there: the /tools catalog, the /tools/[slug]
 * route, lib/seo.ts and llms.txt all read the one list. None of these pages is
 * in the review allowlist (they render noindex until the full-index flag is
 * on), which is the same footing as the other ~60 non-allowlisted pages.
 *
 * The `embed.preset` of kind `audio_effect` / `video_effect` / `image_effect`
 * is what makes a page genuinely about its subject: the form opens on and
 * highlights the one section the page promises, with its values seeded.
 */

import type { ToolPageContent } from '@/content/toolPages';
import { RETENTION_PROMISE } from '@/content/retentionPromise';

const privacyNote = `Your uploads are processed on our own servers. ${RETENTION_PROMISE}. We do not share your files with third-party AI providers, and AI features run on a local GPU server we operate. No login or account is required.`;

const AUDIO_INPUTS = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'opus', 'flac', 'alac', 'ac3', 'wma'];
const VIDEO_INPUTS = ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v', 'flv', 'wmv'];
const IMAGE_INPUTS = ['jpg', 'png', 'webp', 'gif', 'avif', 'heic', 'bmp', 'tiff'];

const AUDIO_FAQ_FREE = {
  question: 'Is it free?',
  answer: `Yes. No watermark, no signup. ${RETENTION_PROMISE}.`,
};

const audioRelated = (...skip: string[]) =>
  [
    { label: 'Audio converter', to: '/tools/audio-converter', description: 'Convert between every common audio format.' },
    { label: 'Change audio speed', to: '/tools/change-audio-speed', description: 'Speed up or slow down a recording.' },
    { label: 'Change audio pitch', to: '/tools/change-audio-pitch', description: 'Shift the key up or down.' },
    { label: 'Normalize audio', to: '/tools/normalize-audio', description: 'Even out the loudness.' },
    { label: 'Remove background noise', to: '/tools/remove-background-noise', description: 'AI noise removal.' },
    { label: 'Remove vocals from a song', to: '/tools/remove-vocals-from-song', description: 'Make an instrumental.' },
  ].filter((r) => !skip.some((s) => r.to.endsWith(s)));

const videoRelated = (...skip: string[]) =>
  [
    { label: 'Video converter', to: '/tools/video-converter', description: 'Convert between video formats.' },
    { label: 'Change video speed', to: '/tools/change-video-speed', description: 'Time-lapse or slow motion.' },
    { label: 'Reverse video', to: '/tools/reverse-video', description: 'Play a clip backwards.' },
    { label: 'Flip video', to: '/tools/flip-video', description: 'Mirror horizontally or vertically.' },
    { label: 'Stabilize video', to: '/tools/stabilize-video', description: 'Smooth out shaky footage.' },
    { label: 'Compress video', to: '/tools/compress-video', description: 'Shrink the file.' },
    { label: 'Trim video', to: '/tools/video-trimmer', description: 'Cut to a range.' },
  ].filter((r) => !skip.some((s) => r.to.endsWith(s)));

const imageRelated = (...skip: string[]) =>
  [
    { label: 'Image converter', to: '/tools/image-converter', description: 'Convert between image formats.' },
    { label: 'Crop image', to: '/tools/crop-image', description: 'Cut to a region.' },
    { label: 'Resize image', to: '/tools/image-resizer', description: 'Change the dimensions.' },
    { label: 'Add text to image', to: '/tools/add-text-to-image', description: 'Caption or watermark.' },
    { label: 'Image filters', to: '/tools/image-filters', description: 'Sepia, sketch, emboss and more.' },
    { label: 'Remove EXIF metadata', to: '/tools/remove-exif-metadata', description: 'Strip location and device data.' },
  ].filter((r) => !skip.some((s) => r.to.endsWith(s)));

/** Audio format → human facts used by the five "convert audio to X" pages. */
const audioTargets: Array<{
  slug: string;
  task: ToolPageContent['embed']['defaultTask'];
  ext: string;
  name: string;
  what: string;
  why: string[];
  whenNot: string;
  lossless: boolean;
}> = [
  {
    slug: 'convert-audio-to-wav',
    task: 'audio_to_wav',
    ext: 'wav',
    name: 'WAV',
    what: 'WAV is uncompressed PCM audio: every sample is stored as-is, so nothing is lost and every editor, DAW and sampler opens it instantly.',
    why: [
      'Editing or mastering: WAV is the format audio editors want, with no decode step and no generation loss.',
      'Archival of a master or a field recording.',
      'Samplers, game engines and broadcast systems that require PCM.',
    ],
    whenNot: 'Converting a lossy MP3 to WAV does not restore detail that the MP3 encoder discarded; it only stops further loss.',
    lossless: true,
  },
  {
    slug: 'convert-audio-to-flac',
    task: 'audio_to_flac',
    ext: 'flac',
    name: 'FLAC',
    what: 'FLAC compresses audio without losing anything, typically to 50 to 70 percent of the WAV size, and decodes to a bit-identical copy.',
    why: [
      'Lossless music libraries that take half the space of WAV.',
      'Sending a master to a collaborator without a 100 MB attachment.',
      'Long-term archival with checksums built into the format.',
    ],
    whenNot: 'A FLAC made from an MP3 is no better than the MP3; FLAC only preserves what is already there.',
    lossless: true,
  },
  {
    slug: 'convert-audio-to-ogg',
    task: 'audio_to_ogg',
    ext: 'ogg',
    name: 'OGG',
    what: 'OGG Vorbis is a free, patent-unencumbered lossy format that sounds better than MP3 at the same bitrate and is native in browsers, Android and game engines.',
    why: [
      'Game and app sound assets where small files and royalty-free decoding matter.',
      'Web audio that must play in Firefox and Chrome without a licence.',
      'Podcast or music files for Linux and Android players.',
    ],
    whenNot: 'Apple devices and some car stereos do not play OGG; use M4A or MP3 for those.',
    lossless: false,
  },
  {
    slug: 'convert-audio-to-m4a',
    task: 'audio_to_m4a',
    ext: 'aac',
    name: 'M4A / AAC',
    what: 'M4A is AAC audio in an MP4 container, the format Apple Music, iPhones, YouTube and most streaming services use. It beats MP3 on quality per kilobyte.',
    why: [
      'Music and voice memos for iPhone, iPad and Mac.',
      'Audio tracks you will later mux into an MP4 video.',
      'Podcasts and audiobooks: chapter markers and smaller files than MP3.',
    ],
    whenNot: 'Some older MP3-only players and car head units will not read AAC.',
    lossless: false,
  },
  {
    slug: 'convert-audio-to-opus',
    task: 'audio_to_opus',
    ext: 'opus',
    name: 'Opus',
    what: 'Opus is the newest open codec and the best lossy option for voice and music at low bitrates: 64 kbps Opus sounds like 128 kbps MP3. It is what WhatsApp, Discord and WebRTC use.',
    why: [
      'Voice notes, podcasts and audiobooks at a fraction of the size.',
      'Streaming or embedding audio where bandwidth matters.',
      'Discord, Matrix and messaging bots that take Opus natively.',
    ],
    whenNot: 'iTunes, older Apple devices and many hardware players do not support Opus; pick M4A for those.',
    lossless: false,
  },
];

const audioTargetPages: ToolPageContent[] = audioTargets.map(({ slug, task, ext, name, what, why, whenNot, lossless }) => ({
  slug,
  name: `Convert Audio to ${name}`,
  h1: `Convert Audio to ${name} Online Free`,
  tagline: `Turn MP3, M4A, WAV, OGG, FLAC and any other audio file into ${name}${lossless ? ' without losing anything' : ' at the bitrate you choose'}.`,
  metaTitle: `Convert Audio to ${name} Online Free | Media Manipulator`,
  metaDescription: `Free online audio to ${name} converter. Upload MP3, WAV, M4A, OGG, FLAC or AAC and download ${name}. ${lossless ? 'Lossless output.' : 'Pick the bitrate.'} No watermark, no signup. ${RETENTION_PROMISE}.`,
  ogTitle: `Convert Audio to ${name} Online Free`,
  ogDescription: `Upload any audio file and download ${name}. ${lossless ? 'Lossless.' : 'Choose the bitrate.'} Free, no signup.`,
  category: 'audio',
  embed: {
    defaultMediaKind: 'audio',
    defaultTask: task,
    lockedOutputFormat: ext,
    title: `Convert audio to ${name}`,
    description: `Upload any audio file. The output is locked to ${name}; ${lossless ? 'sample rate and channels are kept unless you change them' : 'choose the bitrate, sample rate and channels'}, then press Convert.`,
  },
  intro: `${what} Media Manipulator converts any common audio format to ${name} in one upload, keeping the sample rate and channel layout unless you change them, and offers trimming, normalisation, EQ and the AI cleanup tools on the same form.`,
  whatItDoes: [
    `Converts MP3, WAV, M4A/AAC, OGG, Opus, FLAC, ALAC, AC3 and WMA to ${name}.`,
    lossless ? 'Keeps every sample: the output decodes to exactly what went in.' : 'Lets you pick the bitrate, sample rate and channel layout.',
    'Optional trim, volume, normalisation, EQ and effects in the same pass.',
    'Optional AI cleanup: remove background noise, clean up a voice, isolate or remove vocals.',
  ],
  flowSteps: [
    { title: 'Upload audio', description: 'Drop in any common audio file.' },
    { title: 'Adjust if needed', description: lossless ? 'Trim, normalise or apply effects.' : 'Pick the bitrate; trim or apply effects.' },
    { title: 'Convert', description: `FFmpeg encodes ${name} on our servers.` },
    { title: 'Download', description: `Save the ${name} file.` },
  ],
  advancedDetails: [
    lossless
      ? `${name} output is encoded with FFmpeg's native ${ext === 'wav' ? 'pcm_s16le' : 'flac'} encoder at the source sample rate.`
      : `${name} output uses FFmpeg's ${ext === 'ogg' ? 'libvorbis' : ext === 'opus' ? 'libopus' : 'aac'} encoder; 192 kbps is the default and a safe choice for music.`,
    whenNot,
    'Embedded cover art in the source is ignored during validation and not treated as a video track.',
  ],
  whyItMatters: why,
  useCases: [
    { title: 'Switch formats for a device', description: `Make a ${name} copy for a player that needs it.` },
    { title: 'Prepare for editing', description: lossless ? 'Hand a lossless file to a DAW or video editor.' : 'Make a small, compatible file for a project.' },
    { title: 'Batch of voice notes', description: 'Convert one at a time, with trim and normalise if you like.' },
    { title: 'Clean up on the way', description: 'Turn on noise removal or voice cleanup in the same upload.' },
  ],
  whyMediaManipulator: [
    'Full control over bitrate, sample rate and channels, not a one-button black box.',
    'Trim, normalise, EQ and AI cleanup in the same upload.',
    `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
  ],
  privacyNote,
  supportedFormats: {
    supportedInputFormats: AUDIO_INPUTS,
    supportedOutputFormats: [ext],
    processingNotes: [lossless ? 'Lossless output; file size depends on duration and sample rate.' : 'Lossy output; the bitrate you choose sets the size.'],
  },
  faq: [
    { question: `What is ${name}?`, answer: what },
    { question: `Will converting to ${name} improve the sound?`, answer: `No. ${whenNot}` },
    { question: 'Can I trim the audio at the same time?', answer: 'Yes. Set a start and end in the trim section before converting.' },
    { question: 'Does cover art in my MP3 cause problems?', answer: 'No. Embedded album art is recognised as a picture, not a video track, and the conversion proceeds normally.' },
    AUDIO_FAQ_FREE,
  ],
  related: audioRelated(slug),
  primaryKeyword: `convert audio to ${name.toLowerCase()}`,
  secondaryKeywords: [`${ext} converter`, `mp3 to ${ext}`, `online ${ext} converter`, `convert to ${name.toLowerCase()} free`],
}));

// ------------------------------------------------------------------ VOICES (MM78)
// Clone, design and change a voice (design docs/design/VOICES.md §4.1, ADR-0015).
// Their own block, spliced into TOOL_PAGES by content/toolPages.ts after the catalog,
// so other catalog additions never touch these lines. Category `ai`, noindex like every
// non-allowlisted page. Copy is honest by decision: watermark on generated speech and
// conversions (not on shifted audio), own voice or permission only, no training, our
// own servers, and no claim that a voice is indistinguishable from the real person.

const voicePrivacyNote = `Voice recordings and saved voices are processed on our own servers; nothing is sent to a third-party AI provider and nothing is used to train any model. A saved voice (its reference recording and preview) is stored in your account, follows the retention period you choose and can be deleted from Account, Voices at any time; it is deleted with your account. Generated audio is kept like any other result: ${RETENTION_PROMISE}.`;

const voiceRelated = (...skip: string[]) =>
  [
    { label: 'Voice cloning', to: '/tools/voice-cloning', description: 'Make a voice from your own recording.' },
    { label: 'Voice designer', to: '/tools/voice-designer', description: 'Describe a new voice and keep it.' },
    { label: 'Voice changer', to: '/tools/voice-changer', description: 'Shift a recording or convert it to a voice.' },
    { label: 'Clean voice audio', to: '/tools/clean-voice-audio', description: 'Clean up a recording before using it.' },
    { label: 'Change audio pitch', to: '/tools/change-audio-pitch', description: 'Shift the key of music or speech.' },
  ].filter((r) => !skip.some((s) => r.to.endsWith(s)));

export const VOICE_TOOL_PAGES: ToolPageContent[] = [
  {
    slug: 'voice-cloning',
    name: 'Voice cloning',
    h1: 'Clone your voice from a short recording',
    tagline: 'Record or upload 5 to 60 seconds of your own speech, create a voice, and have it read any text in more than twenty languages.',
    metaTitle: 'Clone Your Own Voice from a Recording | Media Manipulator',
    metaDescription:
      'Create a voice from 5 to 60 seconds of your own speech and turn text into speech with it in over 20 languages. Runs on our own servers; outputs are watermarked.',
    ogTitle: 'Clone your own voice from a short recording',
    ogDescription:
      'Record a few sentences, confirm it is your voice, and generate speech with it in over 20 languages. Self-hosted models, watermarked output.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'voice_clone',
      title: 'Create a voice',
      description:
        'Record or upload a clean recording of 5 to 60 seconds, confirm that the voice is yours or that you have the speaker\'s permission, and create the voice. Then type a text and generate speech. Preset voices work without an account.',
    },
    intro:
      'Voice cloning makes a reusable voice from a short recording of your own speech. Read a few natural sentences into your microphone, or upload a clip of 5 to 60 seconds, confirm that the voice is yours (or that you have the explicit permission of the person speaking), and create the voice. It appears under My voices with a short preview. From then on you can type any text, pick one of more than twenty languages and an emotion level, and get an MP3 and a WAV of that voice reading it. The model runs on a GPU server we operate, every generated file carries an inaudible watermark, and nothing you record is used to train anything.',
    whatItDoes: [
      'Creates a saved voice from 5 to 60 seconds of speech recorded in the browser or uploaded as an audio file.',
      'Checks that the recording is long enough and actually contains speech before anything is counted.',
      'Speaks any text with the saved voice in over 20 languages, with an emotion control from calm to expressive.',
      'Returns the speech as an MP3, with a WAV download made in your browser.',
      'Marks every generated file with an inaudible watermark so synthetic speech can be identified.',
    ],
    flowSteps: [
      { title: 'Record or upload', description: '5 to 60 seconds of clear speech in a quiet room.' },
      { title: 'Confirm consent', description: 'Tick that the voice is yours, or that you have the speaker\'s permission.' },
      { title: 'Create the voice', description: 'A short preview renders and the voice is saved to your account.' },
      { title: 'Generate speech', description: 'Type text, pick a language and emotion, and download the audio.' },
    ],
    advancedDetails: [
      'The voice engine is Chatterbox Multilingual (MIT licence), run on our own GPU server. It clones from the reference clip at the moment you generate; no model is trained on your voice.',
      'Creating a voice counts as one AI job (the preview). Each generation counts as one AI job. A request that fails or is refused is not counted.',
      'The length of text per request depends on your plan, at roughly 18 characters per second of speech; the counter under the text box shows your limit.',
      'Every generated file carries Resemble AI\'s PerTh watermark, which is inaudible and survives common editing and compression.',
      'The first request after a quiet period can take up to 20 seconds while the engine loads.',
    ],
    whyItMatters: [
      'Narration in your own voice, without booking a studio session for every change to a script.',
      'The same voice in another language, for a video or a course that reaches more people.',
      'A self-hosted engine means your recordings stay with us, not with a third-party AI provider.',
    ],
    useCases: [
      { title: 'Video narration', description: 'Re-read a changed line of a script without re-recording it.' },
      { title: 'Courses and tutorials', description: 'Voice the same lesson in several languages.' },
      { title: 'Accessibility', description: 'Have long text read aloud in a familiar voice.' },
      { title: 'Prototyping', description: 'Hear a script read before recording the final take.' },
    ],
    whyMediaManipulator: [
      'Open models on hardware we operate; recordings never go to an outside AI service.',
      'Explicit consent before any voice is created, recorded with the voice.',
      'Watermarked output and your own delete button for every saved voice.',
    ],
    privacyNote: voicePrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['webm', 'm4a', 'mp3', 'wav', 'ogg', 'flac', 'mp4'],
      supportedOutputFormats: ['mp3', 'wav'],
      processingNotes: [
        'The reference must be 5 to 60 seconds long and contain speech.',
        'Saving a voice needs an account; preset voices work without one.',
      ],
    },
    faq: [
      { question: 'Can I clone someone else\'s voice?', answer: 'Only with that person\'s explicit permission. You must confirm that the voice is yours or that you have permission before a voice is created, and we store that confirmation with the voice. Impersonating someone without permission, fraud and political deepfakes are forbidden by our Terms.' },
      { question: 'Will it sound exactly like me?', answer: 'It usually sounds recognisably like the speaker, but it is not a perfect copy: accents, unusual voices and noisy recordings are harder. Record a few natural sentences in a quiet room for the best result.' },
      { question: 'Is my recording used to train an AI model?', answer: 'No. Nothing you upload or generate is used to train any model. The voice is cloned from your reference clip each time you generate speech.' },
      { question: 'Can people tell the audio is generated?', answer: 'Every file generated with a saved voice carries an inaudible watermark that detection tools can read. It does not change how the audio sounds.' },
      { question: 'How do I delete a voice?', answer: 'Open Account, Voices and delete it. Its reference recording and preview are removed; audio you already generated stays in your history until its own retention period ends.' },
      { question: 'How many voices can I keep?', answer: 'It depends on your plan; the page shows how many you have saved and your limit.' },
    ],
    related: voiceRelated('/voice-cloning'),
    primaryKeyword: 'clone your voice',
    secondaryKeywords: ['voice cloning online', 'text to speech in my voice', 'create a voice from a recording', 'multilingual voice clone'],
  },
  {
    slug: 'voice-designer',
    name: 'Voice designer',
    h1: 'Design a new voice from a description',
    tagline: 'Describe a voice in words, preview it, and keep the one you like to read any text in more than twenty languages.',
    metaTitle: 'Design a New Voice from a Text Description | Media Manipulator',
    metaDescription:
      'Describe the voice you want, such as warm, low and calm, preview it for free, keep it, and generate speech with it. Self-hosted models; watermarked output.',
    ogTitle: 'Design a new voice from a description',
    ogDescription: 'Describe a voice, listen to free previews, keep the one you like and generate speech with it. Self-hosted, watermarked.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'voice_design',
      title: 'Describe a voice',
      description:
        'Write a short description or click the trait chips, preview the voice (three free previews per description each hour), then keep it to generate speech. Keeping a voice needs an account.',
    },
    intro:
      'The voice designer creates a voice that does not belong to anyone. Describe it in a few words, such as gender, age, accent, tone and pace, or build the description from the chips, and preview a sample sentence. Previews are free, three per description each hour. When you hear the one you want, give it a name and keep it: the exact voice you previewed is saved to your account and can then read any text, in any language of the speech tool. Designing runs on Qwen3-TTS and speaking on Chatterbox, both on our own GPU server, and every generated file carries an inaudible watermark.',
    whatItDoes: [
      'Turns a text description of a voice into a spoken preview.',
      'Keeps the exact previewed voice (the same seed) when you save it.',
      'Speaks any text with the kept voice in over 20 languages.',
      'Returns an MP3 of the speech, with a WAV download made in your browser.',
    ],
    flowSteps: [
      { title: 'Describe', description: 'Write or click the traits you want.' },
      { title: 'Preview', description: 'Three free previews per description each hour.' },
      { title: 'Keep it', description: 'Name the voice and save it to your account.' },
      { title: 'Generate speech', description: 'Type any text and download the audio.' },
    ],
    advancedDetails: [
      'Designing uses Qwen3-TTS VoiceDesign (Apache 2.0). The preview sentence can be rendered in ten languages: Chinese, English, Japanese, Korean, German, French, Russian, Portuguese, Spanish and Italian.',
      'A kept voice is stored as its description, the seed and a 10-second reference clip; from then on Chatterbox speaks it, so it sounds the same everywhere and in every supported language.',
      'Previews are not counted. Keeping a voice counts as one AI job, and each generation counts as one AI job.',
      'Descriptions work best in English; the chips add English traits.',
    ],
    whyItMatters: [
      'A distinct narrator or character voice without hiring a voice actor for a draft.',
      'No real person\'s voice is involved, so no one\'s likeness is borrowed.',
      'The kept voice stays consistent across every script and language.',
    ],
    useCases: [
      { title: 'Characters', description: 'Give each character in a story or a game prototype its own voice.' },
      { title: 'Explainers', description: 'A calm, clear narrator for product and training videos.' },
      { title: 'Placeholder audio', description: 'Temporary voice-over while a script is still changing.' },
      { title: 'Accessibility', description: 'A pleasant reading voice for long documents.' },
    ],
    whyMediaManipulator: [
      'Open models on our own GPU server; no third-party AI provider.',
      'Free previews before anything is counted.',
      'Watermarked output and a delete button for every kept voice.',
    ],
    privacyNote: voicePrivacyNote,
    supportedFormats: {
      supportedInputFormats: ['text'],
      supportedOutputFormats: ['mp3', 'wav'],
      processingNotes: ['Previews: 3 per description per hour, not counted.', 'Keeping a voice needs an account.'],
    },
    faq: [
      { question: 'Is a designed voice someone\'s real voice?', answer: 'No. It is generated from your description and a random seed; it is not modelled on any particular person.' },
      { question: 'Why do previews run out?', answer: 'Each description can be previewed three times an hour so the free previews stay available for everyone. Change the description to preview again, or keep the voice you like.' },
      { question: 'Will the kept voice sound like the preview?', answer: 'Yes. Keeping sends the same description and seed as the preview you heard, and the voice is saved from that render.' },
      { question: 'Which languages can it speak?', answer: 'A voice is designed in one of ten languages, and once kept it can speak every language of the speech tool, more than twenty in all.' },
      { question: 'Is the output marked as generated?', answer: 'Yes. Every generated file carries an inaudible watermark that detection tools can read.' },
    ],
    related: voiceRelated('/voice-designer'),
    primaryKeyword: 'ai voice designer',
    secondaryKeywords: ['create a voice from text description', 'custom voice generator', 'design a narrator voice', 'text to speech custom voice'],
  },
  {
    slug: 'voice-changer',
    name: 'Voice changer',
    h1: 'Change the voice in a recording',
    tagline: 'Shift a recording\'s pitch and character instantly, or convert the speech to a saved or preset voice with AI.',
    metaTitle: 'Voice Changer: Shift or Convert a Recording | Media Manipulator',
    metaDescription:
      'Change the voice in a recording: shift pitch and formant instantly, or convert the speech to a saved or preset voice with AI. Compare before and after.',
    ogTitle: 'Change the voice in a recording',
    ogDescription: 'Shift pitch and formant instantly, or convert speech to another voice with AI, then compare before and after.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'voice_convert',
      title: 'Change a voice',
      description:
        'Record or upload speech. Shift changes pitch and formant instantly, for everyone. Convert makes the recording sound like one of your saved voices or a preset voice, and needs an account on a plan that includes it.',
    },
    intro:
      'The voice changer has two ways to change a recording. Shift is a classic pitch and formant change: move the pitch up to twelve semitones either way, keep the speaker\'s character or shift it with the pitch, or start from a preset such as Deeper, Higher, Child-like, Older or Telephone. It is instant, needs no account and does not use AI. Convert uses AI voice conversion to make the speech sound like one of your saved voices or a preset voice while keeping the words, timing and intonation. Either way you can compare the original and the result with a gapless A/B player before you download.',
    whatItDoes: [
      'Shifts pitch by up to 12 semitones up or down, with the formant preserved or shifted.',
      'Offers shift presets: deeper, higher, child-like, older and telephone.',
      'Converts speech to a saved voice or a preset voice with AI voice conversion.',
      'Plays the original and the result in a synced A/B comparison.',
      'Returns an MP3, with a WAV download made in your browser.',
    ],
    flowSteps: [
      { title: 'Record or upload', description: 'Speech from your microphone or an audio or video file.' },
      { title: 'Choose Shift or Convert', description: 'Instant pitch change, or AI conversion to another voice.' },
      { title: 'Compare', description: 'Switch between original and result without a gap.' },
      { title: 'Download', description: 'MP3, or a WAV made in your browser.' },
    ],
    advancedDetails: [
      'Shift uses the rubberband pitch shifter through ffmpeg on our server. "Keep the voice\'s character" preserves the formant; "Shift with the pitch" moves it, which sounds like a smaller or larger speaker. Telephone also applies a 300 to 3400 Hz band-pass.',
      'Shift counts as one operation and its output is not watermarked. Convert counts as one AI job and its output carries an inaudible watermark.',
      'Convert uses Chatterbox voice conversion on our own GPU server. The length of a recording you can convert depends on your plan.',
      'Converting needs an account. Converting to someone else\'s voice requires that person\'s permission, as for cloning.',
    ],
    whyItMatters: [
      'Disguise a voice for an anonymous interview or a privacy-conscious clip with a simple shift.',
      'Fix a take recorded in the wrong voice without re-recording it.',
      'Hear the difference immediately with the A/B player instead of guessing.',
    ],
    useCases: [
      { title: 'Anonymous audio', description: 'Shift a voice so a speaker is harder to recognise.' },
      { title: 'Character voices', description: 'Turn your own read into a different voice for a story.' },
      { title: 'Consistent narration', description: 'Convert a guest\'s line to the narrator\'s saved voice.' },
      { title: 'Effects', description: 'A telephone or child-like effect for a video scene.' },
    ],
    whyMediaManipulator: [
      'The shifter is free and needs no account.',
      'AI conversion runs on our own GPU server, not a third-party service.',
      'Built-in A/B comparison of the original and the result.',
    ],
    privacyNote: voicePrivacyNote,
    supportedFormats: {
      supportedInputFormats: [...AUDIO_INPUTS, 'webm', 'mp4', 'mov'],
      supportedOutputFormats: ['mp3', 'wav'],
      processingNotes: ['Shift: one operation, no account needed.', 'Convert: one AI job, account and plan required.'],
    },
    faq: [
      { question: 'What is the difference between Shift and Convert?', answer: 'Shift changes the pitch and character of the same voice with signal processing; it is instant and free. Convert uses AI to make the speech sound like a different voice, one of your saved voices or a preset.' },
      { question: 'Does shifting add a watermark?', answer: 'No. Shifted audio is ordinary signal processing and is not watermarked. Converted audio carries an inaudible watermark.' },
      { question: 'Can I convert my voice into a celebrity\'s?', answer: 'No. You can only convert to your own saved voices or our preset voices, and using a real person\'s voice requires their explicit permission. Impersonation without permission is forbidden by our Terms.' },
      { question: 'How long can the recording be?', answer: 'Shift accepts recordings up to your plan\'s length limit. Conversion has its own limit per plan, shown when you upload.' },
      { question: 'Can I use a video file?', answer: 'Yes. The audio track is used and the picture is dropped.' },
    ],
    related: [...voiceRelated('/voice-changer'), { label: 'Remove background noise', to: '/tools/remove-background-noise', description: 'Clean the recording first.' }],
    primaryKeyword: 'voice changer',
    secondaryKeywords: ['change voice in recording', 'pitch shift voice online', 'ai voice conversion', 'make my voice deeper'],
  },
];

export const CATALOG_TOOL_PAGES: ToolPageContent[] = [
  // ------------------------------------------------------------------ METADATA
  {
    slug: 'inspect-metadata',
    name: 'Metadata Inspector',
    h1: 'Inspect File Metadata Online',
    tagline:
      'See every tag hidden in a photo, video, audio file or PDF: EXIF, GPS location, camera, codecs, ID3, XMP and more, before you share it.',
    metaTitle: 'Inspect File Metadata Online: EXIF, GPS, Codecs, ID3 | Media Manipulator',
    metaDescription:
      'Free online metadata inspector for images, video, audio and PDF. See EXIF, GPS coordinates on a map, camera and lens, codecs and bitrates, ID3 tags, XMP and IPTC. No signup.',
    ogTitle: 'Inspect File Metadata Online',
    ogDescription:
      'Every EXIF, GPS, codec, ID3 and XMP tag in your file, grouped and searchable, with the private ones flagged.',
    category: 'metadata',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'inspect_metadata',
      acceptOverride: 'image/*,video/*,audio/*,application/pdf',
      title: 'Inspect a file',
      description:
        'Drop in an image, video, audio file or PDF. The report groups every tag by category, flags the ones that identify you or your location, and offers a raw ExifTool and ffprobe view.',
    },
    intro:
      'Files carry more than their pixels and samples. A phone photo records where and when it was taken and on which device; a video names its encoder and bitrates; an MP3 carries ID3 tags and album art; a PDF stores its author and the software that made it. The Media Manipulator metadata inspector reads all of it on our servers with ExifTool and ffprobe, groups it into camera, location, device, timing, codec and document sections, and highlights the entries that could identify you, so you can decide what to strip before a file leaves your hands.',
    whatItDoes: [
      'Reads EXIF, GPS, IPTC, XMP and ICC data from JPG, PNG, WebP, HEIC, AVIF, TIFF and RAW-derived images.',
      'Reads container, stream, codec, bitrate, frame-rate and chapter data from MP4, MOV, MKV, WebM and other video files.',
      'Reads ID3, Vorbis and MP4 tags, cover art and encoder settings from MP3, M4A, FLAC, OGG and WAV.',
      'Reads author, producer, creation dates and page counts from PDFs.',
      'Shows GPS coordinates on a map outline and flags every privacy-sensitive entry.',
      'Offers the raw ExifTool and ffprobe output and one-click copy of any block.',
    ],
    flowSteps: [
      { title: 'Upload a file', description: 'Image, video, audio or PDF.' },
      { title: 'We read it', description: 'ExifTool and ffprobe run on our servers.' },
      { title: 'Browse the report', description: 'Grouped, searchable, with private entries flagged.' },
      { title: 'Decide', description: 'Strip metadata with the EXIF tool if needed.' },
    ],
    advancedDetails: [
      'Images and PDFs are inspected automatically; video and audio over 100 MB wait for a click so a large file is not uploaded by accident.',
      'Embedded cover art in audio files is reported as a picture entry, not as a video stream.',
      'The report uses the same metadata catalog that powers the EXIF removal tool and the result inspector on every conversion.',
    ],
    whyItMatters: [
      'A photo shared from a phone can reveal your home address through its GPS tags.',
      'Knowing the real codec, bitrate and frame rate of a video explains why it will or will not play somewhere.',
      'Document metadata names authors and editing software, which matters for anything you publish anonymously.',
    ],
    useCases: [
      { title: 'Before posting a photo', description: 'Check for GPS coordinates and the device serial number.' },
      { title: 'Debugging a video', description: 'See the real codec, profile, frame rate and audio layout.' },
      { title: 'Checking a music file', description: 'Confirm tags, bitrate and whether it was transcoded from a lower bitrate.' },
      { title: 'Reviewing a PDF', description: 'See who the author field names and which software produced it.' },
    ],
    whyMediaManipulator: [
      'One inspector for images, video, audio and PDF, not four separate tools.',
      'Privacy-sensitive entries are flagged, with a direct path to stripping them.',
      `No conversion, no account. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: {
      supportedInputFormats: [...IMAGE_INPUTS, ...VIDEO_INPUTS, 'mp3', 'wav', 'm4a', 'flac', 'ogg', 'pdf'],
      processingNotes: ['Inspection is read-only and does not count as a conversion.'],
    },
    faq: [
      { question: 'Does inspecting a file change it?', answer: 'No. The file is read, reported on, and deleted after analysis. Nothing is written back.' },
      { question: 'Can I remove what the inspector finds?', answer: 'Yes. Use the Remove EXIF metadata tool for images; it strips everything and shows a before-and-after diff.' },
      { question: 'Why does a large video need a click?', answer: 'Video and audio over 100 MB are only uploaded when you ask, so you never send a large file by accident.' },
      { question: 'Does this count against my daily conversions?', answer: 'No. Inspection is free of charge and does not spend an operation.' },
      { question: 'Is the data sent to a third party?', answer: 'No. ExifTool and ffprobe run on our own servers, and the file is deleted afterwards.' },
    ],
    related: [
      { label: 'Remove EXIF metadata', to: '/tools/remove-exif-metadata', description: 'Strip everything the inspector found.' },
      { label: 'Edit image metadata', to: '/tools/edit-image-metadata', description: 'Rewrite title, author, copyright and GPS.' },
      { label: 'Image converter', to: '/tools/image-converter', description: 'Convert with or without metadata.' },
    ],
    primaryKeyword: 'metadata inspector',
    secondaryKeywords: ['view EXIF data online', 'check photo GPS location', 'ffprobe online', 'view ID3 tags', 'PDF metadata viewer'],
  },
  {
    slug: 'edit-image-metadata',
    name: 'Edit Image Metadata',
    h1: 'Edit Image Metadata Online',
    tagline:
      'Set the title, author, copyright, keywords and description of a photo, fix or remove its GPS location, and rewrite EXIF and IPTC tags.',
    metaTitle: 'Edit Image Metadata Online: EXIF, IPTC, Copyright, GPS | Media Manipulator',
    metaDescription:
      'Free online image metadata editor. Set title, author, copyright, description and keywords, replace or remove the GPS location, and edit EXIF and IPTC tags on JPG, PNG, WebP and more.',
    ogTitle: 'Edit Image Metadata Online',
    ogDescription: 'Write a copyright notice, fix the location, set keywords. Free, no signup.',
    category: 'metadata',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'edit_image_metadata',
      preset: { kind: 'image_effect', effect: 'metadata' },
      title: 'Edit the metadata of an image',
      description:
        'Upload an image. The metadata section opens in custom mode: fill in title, author, copyright, keywords, replace or remove the GPS location, and expand the advanced tags if you need to. The image pixels are left as they are unless you also change the format.',
    },
    intro:
      'Photographers need a copyright notice and contact details in every file they deliver. Agencies want IPTC keywords and captions. Anyone sharing a photo may want the location gone, or set to a city rather than a doorstep. Media Manipulator rewrites EXIF, IPTC and XMP fields in place on our servers with ExifTool, keeps the image data untouched, and shows you the before-and-after diff.',
    whatItDoes: [
      'Sets title, author/artist, description, copyright, comment and keywords.',
      'Removes the GPS location or replaces it with coordinates you choose.',
      'Edits individual EXIF/TIFF, IPTC and advanced tags by name.',
      'Keeps the pixels untouched; optionally converts the format in the same pass.',
      'Shows a diff of what changed after the job.',
    ],
    flowSteps: [
      { title: 'Upload an image', description: 'JPG, PNG, WebP, HEIC, TIFF.' },
      { title: 'Fill in the fields', description: 'Title, author, copyright, keywords, location.' },
      { title: 'Apply', description: 'ExifTool rewrites the tags on our servers.' },
      { title: 'Download', description: 'Compare before and after, then save.' },
    ],
    advancedDetails: [
      'The custom metadata mode writes the standard EXIF (Artist, Copyright, ImageDescription), IPTC (Keywords, Caption) and XMP (dc:title, dc:creator) counterparts together so every viewer agrees.',
      'Replacing the GPS location writes GPSLatitude/GPSLongitude with the right reference hemispheres; removing it clears every GPS tag.',
      'PNG and WebP carry metadata in text chunks and XMP; the same fields are written there.',
    ],
    whyItMatters: [
      'A copyright notice embedded in the file travels with it when it is reposted.',
      'Keywords and captions in IPTC are what stock agencies and DAM systems index.',
      'A location set to a city protects your home while keeping the photo geotagged.',
    ],
    useCases: [
      { title: 'Deliver client photos', description: 'Embed your name, copyright and contact in every file.' },
      { title: 'Stock submissions', description: 'Add IPTC keywords and a caption.' },
      { title: 'Coarse geotag', description: 'Replace a precise GPS fix with the city centre.' },
      { title: 'Fix a wrong tag', description: 'Correct the author or date a scanner wrote.' },
    ],
    whyMediaManipulator: [
      'Writes EXIF, IPTC and XMP together, not just one of them.',
      'Before-and-after diff so you can see exactly what changed.',
      `Free, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: IMAGE_INPUTS, supportedOutputFormats: ['jpg', 'png', 'webp', 'avif', 'gif'] },
    faq: [
      { question: 'Will editing metadata re-encode my JPG?', answer: 'Only if you change the output format or resize. With the same format and no edits to the pixels, the image data is copied and only the tags are rewritten.' },
      { question: 'Can I remove the location but keep everything else?', answer: 'Yes. Tick "remove location data" and leave the other fields untouched.' },
      { question: 'Can I edit a tag that is not listed?', answer: 'Yes. Expand the advanced section and set any EXIF or IPTC tag by name.' },
      { question: 'How do I remove everything instead?', answer: 'Use the Remove EXIF metadata tool, which strips every tag in one click.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'Inspect metadata', to: '/tools/inspect-metadata', description: 'See what is in the file first.' },
      { label: 'Remove EXIF metadata', to: '/tools/remove-exif-metadata', description: 'Strip everything.' },
      ...imageRelated('/edit-image-metadata', '/remove-exif-metadata'),
    ],
    primaryKeyword: 'edit image metadata',
    secondaryKeywords: ['edit EXIF online', 'add copyright to photo', 'change photo GPS location', 'IPTC keywords editor'],
  },

  // ------------------------------------------------------------------ VIDEO
  {
    slug: 'change-video-speed',
    name: 'Change Video Speed',
    h1: 'Change Video Speed Online: Speed Up or Slow Down',
    tagline: 'Make a time-lapse at 2x, 4x or faster, or slow a clip to 0.5x or 0.25x, with the audio kept in sync.',
    metaTitle: 'Change Video Speed Online Free: Speed Up or Slow Motion | Media Manipulator',
    metaDescription:
      'Free online video speed changer. Speed up a video to 1.5x, 2x or 4x for a time-lapse, or slow it down to 0.5x or 0.25x. Audio stays in sync. MP4 output, no watermark.',
    ogTitle: 'Change Video Speed Online Free',
    ogDescription: 'Speed up or slow down any video from 0.25x to 4x. Audio stays in sync. Free, no signup.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'change_video_speed',
      defaultVideoOutputFormat: 'mp4',
      preset: { kind: 'video_effect', effect: 'speed', defaults: { speed: 2 } },
      title: 'Change the speed of a video',
      description:
        'Upload a video and set a speed multiplier: above 1 is faster, below 1 is slower. 2x is preselected. The audio is re-timed to match, so a sped-up voice stays intelligible.',
    },
    intro:
      'A screen recording that drags, a sunset that needs to be a ten-second time-lapse, a skateboard trick that deserves slow motion: changing playback speed is one of the most common video edits, and it should not need a desktop editor. Media Manipulator re-times both the picture and the sound on our servers with FFmpeg, from a quarter speed to four times speed, and exports an MP4 that plays at the new pace everywhere.',
    whatItDoes: [
      'Speeds up (1.25x to 4x) or slows down (0.25x to 0.9x) any video.',
      'Re-times the audio with pitch-preserving tempo scaling so voices stay natural.',
      'Keeps resolution and quality; exports MP4 by default or any supported container.',
      'Combine with trim, resize or colour adjustments in the same pass.',
    ],
    flowSteps: [
      { title: 'Upload your video', description: 'Any common video format.' },
      { title: 'Set the speed', description: '0.25x to 4x; 2x is preselected.' },
      { title: 'Convert', description: 'FFmpeg re-times video and audio.' },
      { title: 'Download', description: 'Save the new MP4.' },
    ],
    advancedDetails: [
      'Video uses setpts to scale presentation timestamps; audio uses atempo, chained for factors outside 0.5 to 2.0.',
      'Slowing down does not invent frames; for smooth slow motion use AI frame interpolation after slowing the clip.',
      'The frame rate is preserved, so a 4x time-lapse has a quarter of the original frames.',
    ],
    whyItMatters: [
      'Time-lapses and recaps are far more watchable at 2x to 4x.',
      'Slow motion makes sports and action clips readable.',
      'Tutorials and screen recordings are often better at 1.25x to 1.5x.',
    ],
    useCases: [
      { title: 'Time-lapse', description: 'Compress an hour of building, cooking or painting into minutes.' },
      { title: 'Slow motion', description: 'Slow a sports or pet clip to half speed.' },
      { title: 'Faster tutorial', description: 'Speed up a screen recording without chipmunk audio.' },
      { title: 'Match a music track', description: 'Nudge a clip to 1.1x to fit a beat.' },
    ],
    whyMediaManipulator: [
      'Audio is re-timed with pitch preserved, not left behind or chipmunked.',
      'Pair with reverse, trim and colour on the same form.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: VIDEO_INPUTS, supportedOutputFormats: ['mp4', 'webm', 'mov', 'mkv', 'gif'] },
    faq: [
      { question: 'Does the audio stay in sync?', answer: 'Yes. The audio is tempo-scaled by the same factor, with the pitch preserved.' },
      { question: 'What is the maximum speed?', answer: '4x faster and 0.25x slower in one pass. For more, run the result through the tool again.' },
      { question: 'Will slow motion look smooth?', answer: 'Slowing down repeats frames. For true smooth slow motion, slow the clip here and then use AI frame interpolation.' },
      { question: 'Can I mute the audio instead?', answer: 'Yes, use the Remove audio from video tool first, or export as GIF which has no audio.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'AI frame interpolation', to: '/tools/ai-frame-interpolation', description: 'Smooth slow motion with generated frames.' },
      ...videoRelated('/change-video-speed'),
    ],
    primaryKeyword: 'change video speed',
    secondaryKeywords: ['speed up video online', 'slow down video', 'video time-lapse maker', 'slow motion video online', '2x video'],
  },
  {
    slug: 'reverse-video',
    name: 'Reverse Video',
    h1: 'Reverse a Video Online Free',
    tagline: 'Play any clip backwards, with or without the audio reversed, and optionally ping-pong it forward then back.',
    metaTitle: 'Reverse Video Online Free: Play Backwards, Ping-Pong | Media Manipulator',
    metaDescription:
      'Free online video reverser. Play a video backwards, reverse the audio too, or make a ping-pong loop that plays forward then back. MP4 or GIF output, no watermark, no signup.',
    ogTitle: 'Reverse a Video Online Free',
    ogDescription: 'Play a clip backwards or make a forward-then-back loop. Free, no signup.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'reverse_video',
      defaultVideoOutputFormat: 'mp4',
      preset: { kind: 'video_effect', effect: 'reverse', defaults: { reverse: true } },
      title: 'Reverse a video',
      description:
        'Upload a clip. Reverse is already switched on in the Temporal section; turn on ping-pong instead for a forward-then-back loop. Export MP4 or GIF.',
    },
    intro:
      'The reversed-video effect is older than the internet and still works: shattered glass reassembling, a diver leaping out of the pool, a crowd un-dispersing. Media Manipulator reverses the frames and, optionally, the audio of any clip on our servers with FFmpeg, and the ping-pong option appends the forward copy so the result loops seamlessly, which is what most social and GIF uses want.',
    whatItDoes: [
      'Reverses the video frames of any clip.',
      'Reverses the audio with it, or drops the audio for a silent result.',
      'Ping-pong mode plays forward then backward for a seamless loop.',
      'Exports MP4, WebM or an animated GIF.',
    ],
    flowSteps: [
      { title: 'Upload a clip', description: 'Short clips work best; reversing loads the whole clip in memory.' },
      { title: 'Choose reverse or ping-pong', description: 'Reverse is preselected.' },
      { title: 'Convert', description: 'FFmpeg reverses the frames and audio.' },
      { title: 'Download', description: 'MP4 for video, GIF for a loop.' },
    ],
    advancedDetails: [
      'Reversal buffers every frame of the clip, so very long or 4K clips take longer and more memory; trim first for best results.',
      'Audio uses the areverse filter; for a silent reversed clip, remove the audio first.',
      'Ping-pong concatenates the forward and reversed streams, doubling the duration.',
    ],
    whyItMatters: [
      'Reverse and boomerang clips are a staple of short-form social video.',
      'A ping-pong loop hides the cut that a plain loop would show.',
      'Reversing is also a cheap way to make a "rewind" transition.',
    ],
    useCases: [
      { title: 'Boomerang-style loop', description: 'Turn a two-second clip into a seamless back-and-forth.' },
      { title: 'Reverse reveal', description: 'Play an unboxing or a build in reverse.' },
      { title: 'Rewind transition', description: 'Reverse a few seconds to cut between scenes.' },
      { title: 'Reversed GIF', description: 'Export straight to GIF for chat and forums.' },
    ],
    whyMediaManipulator: [
      'Reverse and ping-pong in one switch, with audio handled correctly.',
      'Trim first and export GIF on the same form.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: VIDEO_INPUTS, supportedOutputFormats: ['mp4', 'webm', 'mov', 'gif'] },
    faq: [
      { question: 'Is the audio reversed too?', answer: 'Yes, by default. Remove the audio first if you want a silent clip.' },
      { question: 'What is ping-pong?', answer: 'The clip plays forward, then backward, so it loops without a visible jump.' },
      { question: 'Is there a length limit?', answer: 'Reversing holds the whole clip in memory. Clips of a minute or two are fine; trim longer videos first.' },
      { question: 'Can I get a GIF?', answer: 'Yes. Pick GIF as the output format; it is ideal for a ping-pong loop.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'Video to GIF', to: '/tools/convert-video-to-animated-gif', description: 'Make a looping GIF.' },
      ...videoRelated('/reverse-video'),
    ],
    primaryKeyword: 'reverse video',
    secondaryKeywords: ['reverse video online', 'play video backwards', 'boomerang video maker', 'ping pong video loop'],
  },
  {
    slug: 'flip-video',
    name: 'Flip & Mirror Video',
    h1: 'Flip or Mirror a Video Online Free',
    tagline: 'Mirror a video horizontally to fix a reversed webcam or selfie, or flip it vertically, in one click.',
    metaTitle: 'Flip or Mirror Video Online Free | Media Manipulator',
    metaDescription:
      'Free online video flipper. Mirror a video horizontally (fix mirrored selfie and webcam footage) or flip it vertically. MP4 output, no watermark, no signup.',
    ogTitle: 'Flip or Mirror a Video Online Free',
    ogDescription: 'Un-mirror a selfie video or flip a clip upside down. Free, no signup.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'flip_video',
      defaultVideoOutputFormat: 'mp4',
      preset: { kind: 'video_effect', effect: 'flip', defaults: { flipHorizontal: true } },
      title: 'Flip or mirror a video',
      description:
        'Upload a video. Horizontal flip (mirror) is preselected in the Transform section; switch on vertical flip instead or as well. Rotation is available in the same section.',
    },
    intro:
      'Front cameras and webcams often record a mirror image: text reads backwards and your parting is on the wrong side. Mirroring the clip once puts it right. Media Manipulator flips video horizontally or vertically on our servers with FFmpeg, re-encodes so the flip is baked into the frames, and exports MP4 that plays correctly in every player.',
    whatItDoes: [
      'Mirrors a video horizontally (left-right) or flips it vertically (top-bottom).',
      'Combine with 90°, 180° or 270° rotation in the same pass.',
      'Bakes the transform into the frames; no reliance on a rotation flag.',
      'Exports MP4 by default, or any supported container.',
    ],
    flowSteps: [
      { title: 'Upload a video', description: 'Any common format.' },
      { title: 'Pick a flip', description: 'Horizontal is preselected; add vertical or a rotation.' },
      { title: 'Convert', description: 'FFmpeg applies hflip/vflip and re-encodes.' },
      { title: 'Download', description: 'Save the corrected MP4.' },
    ],
    advancedDetails: [
      'Horizontal flip uses the hflip filter, vertical uses vflip; both are lossless in geometry and re-encode the frames.',
      'Mirroring plus a 180° rotation equals a vertical flip; the panel lets you combine them freely.',
      'MP4 output uses H.264 + AAC + yuv420p + faststart.',
    ],
    whyItMatters: [
      'Mirrored selfie video makes on-screen text unreadable.',
      'Some action cameras mounted upside down need a vertical flip rather than a rotation.',
      'A mirrored copy is a quick way to make a dance or exercise tutorial easier to follow.',
    ],
    useCases: [
      { title: 'Un-mirror a selfie', description: 'Make text and logos read correctly.' },
      { title: 'Upside-down mount', description: 'Flip footage from an inverted camera.' },
      { title: 'Mirror for a tutorial', description: 'Mirror a demonstration so viewers can copy it directly.' },
      { title: 'Match a shot', description: 'Mirror a clip so the subject faces the other way.' },
    ],
    whyMediaManipulator: [
      'Flip and rotate in one transform section, baked into the frames.',
      'Trim, resize and colour in the same upload.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: VIDEO_INPUTS, supportedOutputFormats: ['mp4', 'webm', 'mov', 'mkv'] },
    faq: [
      { question: 'Mirror or flip, what is the difference?', answer: 'Mirror (horizontal flip) swaps left and right. Vertical flip swaps top and bottom.' },
      { question: 'Is the flip permanent?', answer: 'Yes. The frames are re-encoded with the flip applied, so every player shows it.' },
      { question: 'Can I rotate as well?', answer: 'Yes. Rotation lives in the same Transform section, or use the dedicated Rotate video tool.' },
      { question: 'Does flipping reduce quality?', answer: 'Re-encoding has a small cost; choose high quality to keep it negligible.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'Rotate video', to: '/tools/rotate-video', description: '90°, 180°, 270°.' },
      ...videoRelated('/flip-video'),
    ],
    primaryKeyword: 'flip video',
    secondaryKeywords: ['mirror video online', 'flip video horizontally', 'un-mirror selfie video', 'flip video vertically'],
  },
  {
    slug: 'stabilize-video',
    name: 'Stabilize Video',
    h1: 'Stabilize Shaky Video Online Free',
    tagline: 'Smooth out handheld shake and walking bounce with a two-pass stabiliser, without a tripod or a desktop editor.',
    metaTitle: 'Stabilize Shaky Video Online Free | Media Manipulator',
    metaDescription:
      'Free online video stabilizer. Reduce handheld shake and walking bounce with FFmpeg motion smoothing. Adjustable strength, MP4 output, no watermark, no signup.',
    ogTitle: 'Stabilize Shaky Video Online Free',
    ogDescription: 'Smooth out camera shake in any clip. Free, no signup.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'stabilize_video',
      defaultVideoOutputFormat: 'mp4',
      preset: { kind: 'video_effect', effect: 'stabilize', defaults: { stabilize: true } },
      title: 'Stabilize a video',
      description:
        'Upload a shaky clip. Stabilization is already switched on in the Temporal section; adjust shakiness and accuracy if the default is too mild or crops too much.',
    },
    intro:
      'Handheld footage shakes, and a little shake becomes a lot on a big screen. Software stabilisation tracks the motion between frames, smooths the camera path, and crops a little from the edges to hide the correction. Media Manipulator runs FFmpeg\'s motion-compensation stabiliser on our servers with adjustable strength, so a walking vlog or a zoomed-in phone clip comes out noticeably steadier.',
    whatItDoes: [
      'Analyses frame-to-frame motion and smooths the camera path.',
      'Adjustable shakiness (how much shake to expect) and accuracy (how hard to search).',
      'Crops slightly to hide the correction; zoom is applied automatically.',
      'Exports MP4 by default; combine with trim and colour in the same pass.',
    ],
    flowSteps: [
      { title: 'Upload a shaky clip', description: 'Any common format.' },
      { title: 'Keep or tune the strength', description: 'Defaults suit handheld phone footage.' },
      { title: 'Convert', description: 'FFmpeg estimates and compensates motion.' },
      { title: 'Download', description: 'Compare the steadier result.' },
    ],
    advancedDetails: [
      'Uses FFmpeg\'s deshake motion-compensation filter; the shakiness value sets the search range and accuracy the search depth.',
      'Stabilisation cannot fix motion blur already in the frames; it only removes the jitter between them.',
      'Expect a small crop at the edges proportional to how much the camera moved.',
    ],
    whyItMatters: [
      'Steady footage reads as more professional and is easier to watch.',
      'Phone clips shot while walking are the most common case and respond well.',
      'A stabilised clip compresses better, since less of the frame changes between frames.',
    ],
    useCases: [
      { title: 'Walking vlog', description: 'Take the bounce out of a handheld walk-and-talk.' },
      { title: 'Zoomed phone video', description: 'Steady a concert or wildlife clip shot at full zoom.' },
      { title: 'Car or bike mount', description: 'Reduce vibration from a dashboard or handlebar mount.' },
      { title: 'Before a GIF', description: 'Stabilise first so the loop does not jitter.' },
    ],
    whyMediaManipulator: [
      'Real motion compensation, with the strength exposed rather than hidden.',
      'Trim, speed and colour on the same form.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: VIDEO_INPUTS, supportedOutputFormats: ['mp4', 'webm', 'mov', 'mkv'] },
    faq: [
      { question: 'Will it crop my video?', answer: 'Slightly. The stabiliser shifts frames to cancel shake and zooms a little to hide the moving edges.' },
      { question: 'Can it fix blur?', answer: 'No. Blur inside a frame cannot be undone; stabilisation only steadies the motion between frames.' },
      { question: 'What settings should I use?', answer: 'Start with the defaults. Raise shakiness for very rough footage; raise accuracy if the result still drifts.' },
      { question: 'Does it work on 4K?', answer: 'Yes, but processing takes longer. Consider resizing to 1080p in the same pass.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'AI video restoration', to: '/tools/ai-video-restoration', description: 'Denoise, deblur and upscale with AI.' },
      ...videoRelated('/stabilize-video'),
    ],
    primaryKeyword: 'stabilize video',
    secondaryKeywords: ['stabilize shaky video online', 'video stabilizer free', 'fix shaky video', 'remove camera shake'],
  },
  {
    slug: 'change-video-frame-rate',
    name: 'Change Video Frame Rate',
    h1: 'Change Video Frame Rate Online',
    tagline: 'Convert a video to 24, 25, 30 or 60 fps, drop a 60 fps clip to 30 for a smaller file, or match a project frame rate.',
    metaTitle: 'Change Video Frame Rate Online (24, 30, 60 fps) | Media Manipulator',
    metaDescription:
      'Free online frame rate converter. Change a video to 24, 25, 30, 50 or 60 fps, reduce 60 fps to 30 for a smaller file, or match an editing timeline. MP4 output, no signup.',
    ogTitle: 'Change Video Frame Rate Online',
    ogDescription: 'Convert any video to 24, 25, 30 or 60 fps. Free, no signup.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'change_video_frame_rate',
      defaultVideoOutputFormat: 'mp4',
      preset: { kind: 'video_effect', effect: 'frameRate', defaults: { targetFps: 30 } },
      title: 'Change the frame rate of a video',
      description:
        'Upload a video and set the target frame rate in the Temporal section; 30 fps is preselected. Frames are dropped or duplicated to hit the target. For a higher rate with generated in-between frames, use AI frame interpolation instead.',
    },
    intro:
      'Frame rate decides how a video feels and how big it is. Film is 24 fps, European broadcast 25, most phones 30 or 60, and mixing them in one timeline causes judder. Media Manipulator resamples any video to the frame rate you need on our servers with FFmpeg, dropping or repeating frames exactly, and exports MP4. When you want more frames rather than fewer, the AI frame interpolation tool generates the in-betweens.',
    whatItDoes: [
      'Resamples a video to any frame rate from 1 to 120 fps.',
      'Halves 60 fps to 30 for a much smaller file with no visible change for most content.',
      'Matches a project frame rate (24, 25, 29.97, 30, 50, 60) before importing into an editor.',
      'Keeps resolution, audio and duration unchanged.',
    ],
    flowSteps: [
      { title: 'Upload a video', description: 'Any common format.' },
      { title: 'Set the target fps', description: '30 is preselected.' },
      { title: 'Convert', description: 'FFmpeg drops or duplicates frames to match.' },
      { title: 'Download', description: 'Save the resampled MP4.' },
    ],
    advancedDetails: [
      'Uses the fps filter: frames are dropped or duplicated by timestamp, so duration and audio sync are preserved exactly.',
      'Going up (30 to 60) duplicates frames and does not look smoother; use AI frame interpolation for real new frames.',
      'Going down removes data and is not reversible; keep the original.',
    ],
    whyItMatters: [
      'A 60 fps phone clip is twice the size of 30 fps for the same visible quality in most content.',
      'Mixed frame rates in an editing timeline cause stutter; conforming first avoids it.',
      'Some platforms and devices cap or require a particular frame rate.',
    ],
    useCases: [
      { title: 'Shrink a 60 fps clip', description: 'Drop to 30 fps for email, chat or a smaller upload.' },
      { title: 'Conform for editing', description: 'Match every clip to the project rate.' },
      { title: 'Film look', description: 'Convert to 24 fps for a cinematic cadence.' },
      { title: 'Broadcast delivery', description: 'Convert to 25 or 50 fps for PAL regions.' },
    ],
    whyMediaManipulator: [
      'Exact timestamp-based resampling, with duration and audio untouched.',
      'AI interpolation available when you need more frames rather than fewer.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: VIDEO_INPUTS, supportedOutputFormats: ['mp4', 'webm', 'mov', 'mkv'] },
    faq: [
      { question: 'Does the video get shorter or longer?', answer: 'No. Duration is preserved; frames are dropped or repeated to hit the new rate.' },
      { question: 'Will 30 to 60 fps look smoother?', answer: 'Not with this tool, which duplicates frames. Use AI frame interpolation to generate real in-between frames.' },
      { question: 'What frame rate should I pick?', answer: '30 fps for most web and phone content, 24 for a film look, 25 or 50 for PAL broadcast, 60 for gaming and sports.' },
      { question: 'Is the audio affected?', answer: 'No. The audio stream is copied or re-encoded at the same timing.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'AI frame interpolation', to: '/tools/ai-frame-interpolation', description: 'Generate frames up to 120 fps.' },
      ...videoRelated('/change-video-frame-rate'),
    ],
    primaryKeyword: 'change video frame rate',
    secondaryKeywords: ['convert 60fps to 30fps', 'frame rate converter online', 'change fps of video', 'convert video to 24fps'],
  },
  {
    slug: 'adjust-video-color',
    name: 'Adjust Video Brightness & Color',
    h1: 'Adjust Video Brightness, Contrast and Color Online',
    tagline: 'Brighten a dark clip, add contrast and saturation, shift the hue, or apply a blur or artistic look, with sliders and a live preview.',
    metaTitle: 'Adjust Video Brightness, Contrast & Saturation Online | Media Manipulator',
    metaDescription:
      'Free online video colour adjuster. Fix brightness, contrast, saturation, hue, gamma and exposure, add blur or sharpening, or apply an artistic look. MP4 output, no watermark, no signup.',
    ogTitle: 'Adjust Video Brightness and Color Online',
    ogDescription: 'Brighten, add contrast, boost colour or apply a look to any clip. Free, no signup.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'adjust_video_color',
      defaultVideoOutputFormat: 'mp4',
      preset: { kind: 'video_effect', effect: 'color' },
      title: 'Adjust the colour of a video',
      description:
        'Upload a clip. The Visual Effects section opens with brightness, contrast, saturation, hue, gamma and exposure sliders, plus blur, sharpen, noise and artistic looks. Export MP4.',
    },
    intro:
      'A clip shot indoors comes out dark and orange; a flat phone video wants more contrast and colour; a clip for a thumbnail needs a stylised look. Media Manipulator applies brightness, contrast, saturation, hue, gamma and exposure corrections on our servers with FFmpeg, alongside blur, sharpening, grain and a set of artistic filters, and exports MP4. It is a colour correction pass without opening an editor.',
    whatItDoes: [
      'Brightness, contrast, saturation and hue sliders from -100 to +100.',
      'Gamma, exposure, shadows and highlights for finer tonal control.',
      'Gaussian and motion blur, unsharp-mask sharpening, film grain and noise.',
      'Artistic looks such as oil painting, sketch and vintage.',
      'Combine with trim, resize, speed or flip in the same pass.',
    ],
    flowSteps: [
      { title: 'Upload a clip', description: 'Any common format.' },
      { title: 'Move the sliders', description: 'Brightness, contrast, saturation, hue and more.' },
      { title: 'Convert', description: 'FFmpeg applies the eq and effect filters.' },
      { title: 'Download', description: 'Save the graded MP4.' },
    ],
    advancedDetails: [
      'Brightness, contrast, saturation and gamma map to FFmpeg\'s eq filter; hue uses the hue filter in degrees.',
      'Sharpening is unsharp with radius, amount and threshold; blur is gblur or a directional motion blur.',
      'For a 3D LUT, chroma key or per-clip grading on a timeline, use Darkroom.',
    ],
    whyItMatters: [
      'Most phone footage benefits from a small contrast and saturation lift.',
      'Fixing exposure before upload avoids the platform\'s re-encode making it worse.',
      'A consistent look across clips makes a cut feel finished.',
    ],
    useCases: [
      { title: 'Brighten a dark clip', description: 'Lift exposure and shadows on indoor footage.' },
      { title: 'Punch up a flat clip', description: 'Add contrast and saturation to a log-looking phone video.' },
      { title: 'Fix a colour cast', description: 'Shift hue to take out an orange or green tint.' },
      { title: 'Stylise for social', description: 'Apply vintage, sketch or oil-painting looks.' },
    ],
    whyMediaManipulator: [
      'Tonal, colour and effect controls in one section, not a single "enhance" button.',
      'Use Darkroom for timeline grading with LUTs when you need more.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: VIDEO_INPUTS, supportedOutputFormats: ['mp4', 'webm', 'mov', 'mkv', 'gif'] },
    faq: [
      { question: 'Can I preview the result?', answer: 'The sliders show their values; the full grade is applied on conversion. Trim to a few seconds to test quickly, then run the whole clip.' },
      { question: 'Can I apply a LUT?', answer: 'Not here. Darkroom, our multi-track editor, supports 3D LUTs and per-clip grading.' },
      { question: 'Will this fix overexposed footage?', answer: 'It can bring highlights down, but detail that was clipped to white cannot be recovered.' },
      { question: 'Can I sharpen a soft clip?', answer: 'Yes. Use the unsharp mask controls; for real detail recovery try AI video restoration.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'Darkroom video editor', to: '/tools/content-studio', description: 'Grade with LUTs on a timeline.' },
      { label: 'AI video restoration', to: '/tools/ai-video-restoration', description: 'Denoise and upscale with AI.' },
      ...videoRelated('/adjust-video-color'),
    ],
    primaryKeyword: 'adjust video brightness',
    secondaryKeywords: ['video color correction online', 'brighten dark video', 'increase video contrast', 'video saturation online'],
  },
  {
    slug: 'convert-video-to-hevc',
    name: 'Convert Video to HEVC (H.265)',
    h1: 'Convert Video to HEVC / H.265 Online',
    tagline: 'Re-encode any video as H.265 for roughly half the file size of H.264 at the same quality, for storage, 4K and modern devices.',
    metaTitle: 'Convert Video to HEVC (H.265) Online Free | Media Manipulator',
    metaDescription:
      'Free online H.265 / HEVC converter. Re-encode MP4, MOV, MKV or WebM to HEVC for about half the size at the same quality. Choose a quality preset. No watermark, no signup.',
    ogTitle: 'Convert Video to HEVC / H.265 Online',
    ogDescription: 'Halve a video\'s size with H.265. Free, no signup.',
    category: 'video',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'video_to_hevc',
      lockedVideoOutputFormat: 'mp4',
      defaultVideoCodec: 'h265',
      defaultVideoCompressionPreset: 'balanced',
      preset: { kind: 'video', panel: 'video_compressor' },
      title: 'Convert a video to HEVC',
      description:
        'Upload a video. The codec is set to H.265 in an MP4 container with the balanced preset; pick smallest or high quality instead. Older devices and some browsers do not play HEVC; keep an H.264 copy for those.',
    },
    intro:
      'HEVC, also called H.265, is the successor to H.264. At the same visual quality it needs around 40 to 50 percent fewer bits, which is why phones record 4K in it and why it is the format of choice for archiving footage. Media Manipulator re-encodes any video to HEVC on our servers with FFmpeg\'s x265 encoder at the quality level you pick, in an MP4 container that iPhones, Macs, Windows 10+, Android and modern TVs all play.',
    whatItDoes: [
      'Re-encodes any input video as H.265 in an MP4 container.',
      'Three quality presets mapped to CRF values; file size roughly halves versus H.264.',
      'Keeps resolution and frame rate; optionally downsizes 4K to 1080p for a far smaller file.',
      'Audio is re-encoded as AAC.',
    ],
    flowSteps: [
      { title: 'Upload a video', description: 'Any common format, including H.264 MP4.' },
      { title: 'Pick a quality', description: 'Smallest, balanced or high quality.' },
      { title: 'Convert', description: 'x265 encodes on our servers; slower than H.264.' },
      { title: 'Download', description: 'Save the .mp4 with HEVC inside.' },
    ],
    advancedDetails: [
      'Encoded with libx265 at CRF 28 (balanced), 32 (smallest) or 24 (high quality), medium preset, hvc1 tag for Apple compatibility.',
      'HEVC encoding is several times slower than H.264; long 4K files take minutes.',
      'Browsers: Safari and Edge play HEVC; Chrome and Firefox generally do not. Keep H.264 for web embeds.',
    ],
    whyItMatters: [
      'Half the storage for the same quality adds up across a library.',
      '4K and HDR delivery is standardised on HEVC for most devices.',
      'Smaller files upload and sync faster.',
    ],
    useCases: [
      { title: 'Archive footage', description: 'Halve the size of a camera roll without visible loss.' },
      { title: 'Share 4K', description: 'Make a 4K clip small enough to send.' },
      { title: 'Apple ecosystem', description: 'Match the HEVC files iPhones already record.' },
      { title: 'Free up a drive', description: 'Convert old H.264 recordings to HEVC.' },
    ],
    whyMediaManipulator: [
      'x265 with sensible CRF presets and Apple-compatible tagging.',
      'The same panel compresses to H.264, VP9 or AV1 if you need those instead.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: VIDEO_INPUTS, supportedOutputFormats: ['mp4'], processingNotes: ['HEVC encoding is CPU-heavy; expect several minutes for long or 4K sources.'] },
    faq: [
      { question: 'Will HEVC play everywhere?', answer: 'iPhone, Mac, Windows 10+, Android 5+, modern TVs and Safari/Edge play it. Chrome and Firefox and old devices usually do not; keep H.264 for those.' },
      { question: 'How much smaller will the file be?', answer: 'Typically 40 to 50 percent smaller than H.264 at the same quality; more for simple content.' },
      { question: 'Is the quality worse?', answer: 'At the balanced preset the difference is not visible for most content. Pick high quality for footage you will edit again.' },
      { question: 'Why is it slow?', answer: 'x265 does far more work per frame than x264. It is the price of the smaller file.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'Compress video', to: '/tools/compress-video', description: 'H.264, VP9 or AV1 compression.' },
      { label: 'MP4 converter', to: '/tools/mp4-converter', description: 'Standard H.264 MP4.' },
      ...videoRelated('/convert-video-to-hevc', '/compress-video'),
    ],
    primaryKeyword: 'convert video to HEVC',
    secondaryKeywords: ['h265 converter online', 'h264 to h265', 'hevc encoder free', 'convert mp4 to hevc'],
  },

  // ------------------------------------------------------------------ AUDIO
  ...audioTargetPages,
  {
    slug: 'convert-mp3-to-wav',
    name: 'Convert MP3 to WAV',
    h1: 'Convert MP3 to WAV Online Free',
    tagline: 'Turn an MP3 into an uncompressed WAV for editing, sampling or burning to CD.',
    metaTitle: 'Convert MP3 to WAV Online Free | Media Manipulator',
    metaDescription: `Free online MP3 to WAV converter. Upload an MP3 and download an uncompressed 16-bit PCM WAV at the original sample rate. No watermark, no signup. ${RETENTION_PROMISE}.`,
    ogTitle: 'Convert MP3 to WAV Online Free',
    ogDescription: 'MP3 in, uncompressed WAV out. Free, no signup.',
    category: 'audio',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'mp3_to_wav',
      lockedInputFormat: 'mp3',
      lockedOutputFormat: 'wav',
      acceptOverride: '.mp3,audio/mpeg',
      title: 'Convert MP3 to WAV',
      description: 'Upload an MP3. The output is locked to WAV; trim or normalise if you like, then press Convert.',
    },
    intro:
      'Audio editors, samplers and CD burners want uncompressed PCM, and some older tools refuse MP3 altogether. Converting to WAV decodes the MP3 once so no further quality is lost in editing. Media Manipulator does it on our servers with FFmpeg, keeps the original sample rate and channels, and ignores embedded album art rather than mistaking it for a video track.',
    whatItDoes: [
      'Decodes MP3 to 16-bit PCM WAV at the source sample rate and channel layout.',
      'Optional trim, normalise, fade and EQ in the same pass.',
      'Handles MP3s with embedded cover art and ID3 tags.',
    ],
    flowSteps: [
      { title: 'Upload an MP3', description: 'Any bitrate, with or without cover art.' },
      { title: 'Adjust if needed', description: 'Trim, normalise, EQ.' },
      { title: 'Convert', description: 'FFmpeg decodes to PCM.' },
      { title: 'Download', description: 'Save the WAV.' },
    ],
    advancedDetails: [
      'WAV output is pcm_s16le; the file is roughly 10 MB per minute of stereo 44.1 kHz audio.',
      'Decoding does not recover anything the MP3 encoder discarded; it only prevents further loss.',
    ],
    whyItMatters: [
      'Editing an MP3 and saving it as MP3 again loses quality each time; WAV stops that.',
      'Samplers, DAWs and CD burners expect PCM.',
    ],
    useCases: [
      { title: 'Edit in a DAW', description: 'Import without a decode step or generation loss.' },
      { title: 'Burn an audio CD', description: 'CD burners want 44.1 kHz WAV.' },
      { title: 'Sample a sound', description: 'Load into a sampler or game engine.' },
    ],
    whyMediaManipulator: [
      'Keeps the original sample rate and channels.',
      'Cover art in the MP3 is handled correctly.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: ['mp3'], supportedOutputFormats: ['wav'] },
    faq: [
      { question: 'Will WAV sound better than the MP3?', answer: 'No. It sounds identical; the point is that further editing will not degrade it.' },
      { question: 'Why is the WAV so much bigger?', answer: 'WAV is uncompressed: about 10 MB per minute of stereo CD-quality audio.' },
      { question: 'My MP3 has album art. Is that a problem?', answer: 'No. Embedded cover art is recognised as a picture and ignored.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'Convert audio to WAV', to: '/tools/convert-audio-to-wav', description: 'Any format to WAV.' },
      { label: 'Convert WAV to MP3', to: '/tools/convert-wav-to-mp3', description: 'The other direction.' },
      ...audioRelated('/convert-mp3-to-wav'),
    ],
    primaryKeyword: 'convert mp3 to wav',
    secondaryKeywords: ['mp3 to wav online', 'mp3 to wav converter free', 'decode mp3 to wav'],
  },
  {
    slug: 'change-audio-speed',
    name: 'Change Audio Speed',
    h1: 'Change Audio Speed Online: Speed Up or Slow Down',
    tagline: 'Speed up a lecture or podcast to 1.5x, or slow a song or recording to 0.75x for practice, without changing the pitch.',
    metaTitle: 'Change Audio Speed Online Free (No Pitch Change) | Media Manipulator',
    metaDescription:
      'Free online audio speed changer. Speed up or slow down MP3, WAV, M4A and more from 0.25x to 4x with the pitch preserved. Ideal for lectures, podcasts and practice tracks. No signup.',
    ogTitle: 'Change Audio Speed Online Free',
    ogDescription: 'Faster or slower without the chipmunk effect. Free, no signup.',
    category: 'audio',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'change_audio_speed',
      defaultOutputFormat: 'mp3',
      preset: { kind: 'audio_effect', effect: 'speed', defaults: { speed: 1.5 } },
      title: 'Change the speed of an audio file',
      description:
        'Upload an audio file and set a speed multiplier; 1.5x is preselected. Pitch is preserved, so voices stay natural. To change the key as well, use the pitch tool.',
    },
    intro:
      'A two-hour lecture at 1.5x is 80 minutes. A guitar solo at 0.75x is learnable. Changing audio speed is useful every day, and the catch is pitch: naive speed-up turns voices into chipmunks. Media Manipulator time-stretches audio on our servers with FFmpeg\'s tempo filter, which keeps the pitch exactly where it was, from a quarter speed to four times.',
    whatItDoes: [
      'Speeds up (1.1x to 4x) or slows down (0.25x to 0.9x) any audio file.',
      'Preserves pitch, so speech and music stay in key.',
      'Exports MP3 by default or WAV, FLAC, M4A, OGG, Opus.',
      'Optional trim, normalise and EQ in the same pass.',
    ],
    flowSteps: [
      { title: 'Upload audio', description: 'MP3, WAV, M4A, OGG, FLAC and more.' },
      { title: 'Set the speed', description: '1.5x is preselected; 0.25x to 4x.' },
      { title: 'Convert', description: 'FFmpeg time-stretches with pitch preserved.' },
      { title: 'Download', description: 'Save the re-timed file.' },
    ],
    advancedDetails: [
      'Uses the atempo filter, chained automatically for factors outside 0.5 to 2.0.',
      'Time-stretching introduces slight artefacts at extreme factors; 0.5x to 2x is transparent for speech.',
      'To change speed AND pitch together (the tape effect), use the pitch tool\'s time-stretch option.',
    ],
    whyItMatters: [
      'Lectures, audiobooks and podcasts are often comfortable at 1.25x to 2x.',
      'Musicians practise difficult passages at 50 to 75 percent speed.',
      'Transcribers slow recordings to catch every word.',
    ],
    useCases: [
      { title: 'Faster lecture', description: 'Listen to a recorded class at 1.5x.' },
      { title: 'Practice track', description: 'Slow a solo to 0.75x in the same key.' },
      { title: 'Transcription', description: 'Slow an interview to 0.8x.' },
      { title: 'Fit a time slot', description: 'Nudge a voiceover by 5 percent to fit.' },
    ],
    whyMediaManipulator: [
      'Pitch is preserved by default; no chipmunk or slowed-tape sound.',
      'Any output format, plus trim and normalise in the same upload.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: AUDIO_INPUTS, supportedOutputFormats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'opus'] },
    faq: [
      { question: 'Does the pitch change?', answer: 'No. The tempo filter keeps the pitch exactly as it was.' },
      { question: 'How fast can I go?', answer: '4x in one pass. Run the result again for more.' },
      { question: 'Will slowed audio sound robotic?', answer: 'Down to 0.5x it is clean; below that some phasing is audible.' },
      { question: 'Can I change speed and pitch together?', answer: 'Yes. Use the Change audio pitch tool, which has a time-stretch control.' },
      AUDIO_FAQ_FREE,
    ],
    related: audioRelated('/change-audio-speed'),
    primaryKeyword: 'change audio speed',
    secondaryKeywords: ['speed up audio online', 'slow down audio without changing pitch', 'audio tempo changer', 'speed up mp3'],
  },
  {
    slug: 'change-audio-pitch',
    name: 'Change Audio Pitch',
    h1: 'Change Audio Pitch Online: Transpose Up or Down',
    tagline: 'Shift a song or recording by semitones to change its key, lower a vocal, or tune a sample, with the tempo kept the same.',
    metaTitle: 'Change Audio Pitch Online Free: Transpose Semitones | Media Manipulator',
    metaDescription:
      'Free online pitch shifter. Transpose MP3, WAV or any audio up or down by semitones to change the key, with the speed unchanged. Optional time-stretch. No watermark, no signup.',
    ogTitle: 'Change Audio Pitch Online Free',
    ogDescription: 'Transpose any audio by semitones. Free, no signup.',
    category: 'audio',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'change_audio_pitch',
      defaultOutputFormat: 'mp3',
      preset: { kind: 'audio_effect', effect: 'pitch', defaults: { pitchSemitones: 2 } },
      title: 'Change the pitch of an audio file',
      description:
        'Upload an audio file. The Advanced section opens with the pitch slider; +2 semitones is preselected. Negative values lower the key. Time-stretch is beside it if you also want to change the length.',
    },
    intro:
      'A backing track in the wrong key for your voice, a sample that needs to match a song, a vocal that wants to sit a tone lower: pitch shifting fixes all of them. Media Manipulator transposes audio by semitones on our servers with FFmpeg, keeping the duration unchanged, and lets you combine it with a time-stretch when you want the old tape-speed effect instead.',
    whatItDoes: [
      'Transposes audio up or down by up to 12 semitones (an octave).',
      'Keeps the duration the same, so the track still fits.',
      'Optional time-stretch to change length independently.',
      'Exports MP3, WAV, FLAC, M4A, OGG or Opus.',
    ],
    flowSteps: [
      { title: 'Upload audio', description: 'Any common audio format.' },
      { title: 'Set the semitones', description: '+2 is preselected; -12 to +12.' },
      { title: 'Convert', description: 'FFmpeg resamples and re-times.' },
      { title: 'Download', description: 'Save the transposed file.' },
    ],
    advancedDetails: [
      'The shift resamples by 2^(semitones/12) and compensates the tempo so the length is unchanged.',
      'Large shifts (more than 5 semitones) on full mixes can sound artificial; vocals and single instruments fare better.',
      'Formant preservation is on, so a lowered voice does not become a different person.',
    ],
    whyItMatters: [
      'Singers transpose backing tracks to a comfortable key.',
      'Producers tune samples and vocals to a song.',
      'A semitone or two down makes a demo vocal sound more relaxed.',
    ],
    useCases: [
      { title: 'Change a backing track key', description: 'Move a karaoke track down two semitones.' },
      { title: 'Tune a sample', description: 'Match a drum or vocal hit to the song.' },
      { title: 'Lower a voiceover', description: 'Take a read down a semitone.' },
      { title: 'Octave effect', description: 'Shift +12 or -12 for an effect layer.' },
    ],
    whyMediaManipulator: [
      'Semitone control with duration preserved, and time-stretch when you want it.',
      'Any output format, plus trim and normalise in the same upload.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: AUDIO_INPUTS, supportedOutputFormats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'opus'] },
    faq: [
      { question: 'Does the speed change?', answer: 'No. Duration is preserved. Use the time-stretch control if you want it to.' },
      { question: 'How far can I shift?', answer: 'Up to 12 semitones (one octave) up or down.' },
      { question: 'Will a shifted voice sound natural?', answer: 'For one to three semitones, yes. Larger shifts become audible; formant preservation keeps it from sounding like a cartoon.' },
      { question: 'Can I shift by cents?', answer: 'Not yet; the control is in whole semitones.' },
      AUDIO_FAQ_FREE,
    ],
    related: audioRelated('/change-audio-pitch'),
    primaryKeyword: 'change audio pitch',
    secondaryKeywords: ['pitch shifter online', 'transpose audio', 'change key of song online', 'pitch shift mp3'],
  },
  {
    slug: 'normalize-audio',
    name: 'Normalize Audio',
    h1: 'Normalize Audio Loudness Online',
    tagline: 'Bring a quiet recording up to a consistent loudness, so podcasts, voice memos and mixed playlists play at the same level.',
    metaTitle: 'Normalize Audio Online Free (Loudness) | Media Manipulator',
    metaDescription:
      'Free online audio normalizer. Even out the loudness of MP3, WAV, M4A and other files with EBU R128 loudness normalisation. Ideal for podcasts and voice memos. No watermark, no signup.',
    ogTitle: 'Normalize Audio Online Free',
    ogDescription: 'Consistent loudness for any recording. Free, no signup.',
    category: 'audio',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'normalize_audio',
      defaultOutputFormat: 'mp3',
      preset: { kind: 'audio_effect', effect: 'normalize', defaults: { normalize: true } },
      title: 'Normalize an audio file',
      description:
        'Upload an audio file. Loudness normalisation is already switched on in the Basic processing section; add amplify, fades or compression if you want. Press Convert.',
    },
    intro:
      'A voice memo recorded at arm\'s length is quiet; a song ripped from a CD is loud; played back to back they make the listener reach for the volume. Loudness normalisation measures the perceived loudness of a whole file and brings it to a standard target, the same EBU R128 measurement broadcasters and streaming services use. Media Manipulator runs it on our servers with FFmpeg\'s loudnorm filter, which also keeps true peaks under the ceiling so nothing clips.',
    whatItDoes: [
      'Measures integrated loudness and normalises to a broadcast-standard target.',
      'Limits true peaks so the output never clips.',
      'Optional gain, fade in/out and dynamic-range compression in the same section.',
      'Exports MP3, WAV, FLAC, M4A, OGG or Opus.',
    ],
    flowSteps: [
      { title: 'Upload audio', description: 'Any common format.' },
      { title: 'Keep normalise on', description: 'Add fades or compression if needed.' },
      { title: 'Convert', description: 'FFmpeg loudnorm measures and corrects.' },
      { title: 'Download', description: 'Save the levelled file.' },
    ],
    advancedDetails: [
      'Uses loudnorm (EBU R128) with its default -24 LUFS integrated target and -2 dBTP true-peak ceiling.',
      'This is loudness normalisation, not peak normalisation: two files that both peak at 0 dB can still differ greatly in perceived volume.',
      'For a quick fixed gain change without analysis, use the amplify slider or the Adjust volume tool.',
    ],
    whyItMatters: [
      'Listeners abandon podcasts that need constant volume adjustment.',
      'Playlists and DJ sets need tracks at a consistent level.',
      'Platforms normalise on upload; doing it first means no surprises.',
    ],
    useCases: [
      { title: 'Podcast episode', description: 'Level a recorded conversation before publishing.' },
      { title: 'Voice memo', description: 'Bring a quiet phone recording up.' },
      { title: 'Lecture capture', description: 'Even out a speaker who moves away from the mic.' },
      { title: 'Playlist prep', description: 'Normalise tracks ripped from different sources.' },
    ],
    whyMediaManipulator: [
      'Real EBU R128 loudness measurement, not just a peak scan.',
      'Fades, gain and compression in the same section.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: AUDIO_INPUTS, supportedOutputFormats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'opus'] },
    faq: [
      { question: 'What target loudness is used?', answer: '-24 LUFS integrated with a -2 dBTP true-peak ceiling, the EBU R128 default. Podcast platforms typically target -16 to -19 LUFS; add a few dB of amplify if you want it louder.' },
      { question: 'Will it make everything the same volume within the file?', answer: 'No. It levels the file as a whole. Turn on the compressor as well to reduce variation inside it.' },
      { question: 'Can it clip?', answer: 'No. The true-peak limiter keeps peaks below the ceiling.' },
      { question: 'Can I just make it louder?', answer: 'Yes. Use the Adjust volume tool for a fixed gain change.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'Adjust volume', to: '/tools/adjust-audio-volume', description: 'Fixed gain up or down.' },
      ...audioRelated('/normalize-audio'),
    ],
    primaryKeyword: 'normalize audio',
    secondaryKeywords: ['audio normalizer online', 'normalize mp3 volume', 'loudness normalization', 'even out audio volume'],
  },
  {
    slug: 'adjust-audio-volume',
    name: 'Adjust Audio Volume',
    h1: 'Increase or Decrease Audio Volume Online',
    tagline: 'Make an audio file louder or quieter by a fixed amount, from 10 percent to double, or by decibels with the amplify slider.',
    metaTitle: 'Increase Audio Volume Online Free (Make MP3 Louder) | Media Manipulator',
    metaDescription:
      'Free online volume changer. Make an MP3, WAV or any audio file louder or quieter by a fixed multiplier or in decibels, with fades. No watermark, no signup.',
    ogTitle: 'Increase or Decrease Audio Volume Online',
    ogDescription: 'Make any audio louder or quieter. Free, no signup.',
    category: 'audio',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'adjust_audio_volume',
      defaultOutputFormat: 'mp3',
      preset: { kind: 'audio_effect', effect: 'volume', defaults: { volume: 1.5 } },
      title: 'Adjust the volume of an audio file',
      description:
        'Upload an audio file and set the volume multiplier; 1.5x is preselected. For a change in decibels, use the amplify slider in Basic processing. Loud boosts can clip; turn on normalise for a safe result.',
    },
    intro:
      'Sometimes a file is simply too quiet, or far too loud for the rest of a playlist, and a fixed gain change is all it needs. Media Manipulator scales audio volume on our servers with FFmpeg, by a multiplier or in decibels, adds fades if you want them, and can combine the change with loudness normalisation so the result does not clip.',
    whatItDoes: [
      'Multiplies the volume from 0.1x (very quiet) to 2x (double).',
      'Or sets a precise gain in decibels from -60 to +60 dB with the amplify slider.',
      'Fade in and fade out in seconds.',
      'Optional normalise and compression to avoid clipping on big boosts.',
    ],
    flowSteps: [
      { title: 'Upload audio', description: 'Any common format.' },
      { title: 'Set the volume', description: '1.5x is preselected; or use decibels.' },
      { title: 'Convert', description: 'FFmpeg applies the gain.' },
      { title: 'Download', description: 'Save the adjusted file.' },
    ],
    advancedDetails: [
      'Volume uses the volume filter; a multiplier of 2 is +6 dB, 0.5 is -6 dB.',
      'Boosting a file that already peaks near 0 dBFS will clip; enable normalise, which includes a true-peak limiter.',
      'For a consistent perceived loudness rather than a fixed gain, use Normalize audio.',
    ],
    whyItMatters: [
      'Quiet recordings are hard to hear on phone speakers.',
      'A too-loud ringtone or sound effect is unpleasant and clips.',
      'Fixed gain is the right tool when you know exactly how much to change.',
    ],
    useCases: [
      { title: 'Boost a quiet memo', description: 'Make a phone recording audible.' },
      { title: 'Tame a loud effect', description: 'Drop a sound effect by 10 dB.' },
      { title: 'Ringtone', description: 'Boost and add a fade out.' },
      { title: 'Background music', description: 'Lower a track to sit under a voice.' },
    ],
    whyMediaManipulator: [
      'Multiplier or decibels, plus fades, in one place.',
      'Normalise and compress in the same pass to prevent clipping.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: AUDIO_INPUTS, supportedOutputFormats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'opus'] },
    faq: [
      { question: 'What is the maximum boost?', answer: '2x with the multiplier, or up to +60 dB with the amplify slider. Large boosts clip unless normalise is on.' },
      { question: 'Will it distort?', answer: 'Only if the boosted signal exceeds full scale. Turn on normalise, which limits true peaks.' },
      { question: 'Multiplier or decibels?', answer: 'They do the same job. 2x equals +6 dB; 0.5x equals -6 dB.' },
      { question: 'Can I even out the volume instead?', answer: 'Yes. Use Normalize audio for a consistent perceived loudness.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'Normalize audio', to: '/tools/normalize-audio', description: 'Consistent loudness.' },
      ...audioRelated('/adjust-audio-volume', '/normalize-audio'),
    ],
    primaryKeyword: 'increase audio volume',
    secondaryKeywords: ['make mp3 louder online', 'audio volume booster', 'decrease audio volume', 'amplify audio online'],
  },
  {
    slug: 'audio-equalizer',
    name: 'Audio Equalizer',
    h1: 'Equalize Audio Online: Bass Boost, Treble, Presets',
    tagline: 'Apply a bass boost, treble lift, vocal presence or genre preset, or set low-pass and high-pass filters, and download the result.',
    metaTitle: 'Online Audio Equalizer: Bass Boost, Treble, Vocal | Media Manipulator',
    metaDescription:
      'Free online audio equalizer. Apply bass boost, treble boost, vocal, rock, jazz or classical EQ presets, or set high-pass and low-pass filters, to MP3, WAV and more. No signup.',
    ogTitle: 'Equalize Audio Online',
    ogDescription: 'Bass boost, treble, vocal presence and more. Free, no signup.',
    category: 'audio',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'audio_equalizer',
      defaultOutputFormat: 'mp3',
      preset: { kind: 'audio_effect', effect: 'equalizer', defaults: { equalizerPreset: 'bass-boost' } },
      title: 'Equalize an audio file',
      description:
        'Upload an audio file. The equalizer in Basic processing is already on with the bass boost preset; choose another preset or set high-pass and low-pass cut-offs. Press Convert.',
    },
    intro:
      'EQ shapes the tone of a recording: more low end for a thin track, less for a boomy room, a presence lift so a voice cuts through, a high-pass to remove rumble. Media Manipulator applies equalisation on our servers with FFmpeg, from one-click presets to explicit filter cut-offs, and exports in any audio format.',
    whatItDoes: [
      'Presets: bass boost, treble boost, vocal, rock, jazz, classical.',
      'High-pass and low-pass filters with adjustable cut-off frequencies.',
      'Combine with volume, normalise, compression and reverb.',
      'Exports MP3, WAV, FLAC, M4A, OGG or Opus.',
    ],
    flowSteps: [
      { title: 'Upload audio', description: 'Any common format.' },
      { title: 'Pick a preset or filters', description: 'Bass boost is preselected.' },
      { title: 'Convert', description: 'FFmpeg applies the EQ chain.' },
      { title: 'Download', description: 'Save the shaped file.' },
    ],
    advancedDetails: [
      'Presets map to FFmpeg equalizer, bass and treble filters with fixed gains and Q values.',
      'High-pass at 80 to 120 Hz removes handling noise and rumble from voice recordings; low-pass at 8 to 10 kHz tames hiss.',
      'EQ cannot add frequencies that were never recorded; a phone recording has little below 100 Hz to boost.',
    ],
    whyItMatters: [
      'A small presence lift makes speech far more intelligible on small speakers.',
      'Rumble and hiss are the two most common fixes and both are simple filters.',
      'Genre presets give a quick, consistent character to a playlist.',
    ],
    useCases: [
      { title: 'Voice clarity', description: 'Vocal preset plus a high-pass for a podcast.' },
      { title: 'Bass boost', description: 'Fill out a thin recording.' },
      { title: 'Remove rumble', description: 'High-pass at 100 Hz.' },
      { title: 'Tame hiss', description: 'Low-pass at 10 kHz on an old tape transfer.' },
    ],
    whyMediaManipulator: [
      'Presets and explicit filter cut-offs in one section.',
      'Chain with normalise, compression and reverb in the same upload.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: AUDIO_INPUTS, supportedOutputFormats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'opus'] },
    faq: [
      { question: 'Can I set my own bands?', answer: 'Presets plus high-pass and low-pass cut-offs are exposed; per-band gain is on the roadmap.' },
      { question: 'What does a high-pass filter do?', answer: 'It removes everything below the cut-off frequency: rumble, handling noise, plosive thumps.' },
      { question: 'Can EQ fix a muffled recording?', answer: 'A treble boost helps if the highs are merely quiet. If they were never captured, EQ cannot invent them; try AI voice cleanup.' },
      { question: 'Will EQ clip?', answer: 'Boosts can. Turn on normalise, which includes a true-peak limiter.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'Clean voice audio', to: '/tools/clean-voice-audio', description: 'AI voice enhancement.' },
      ...audioRelated('/audio-equalizer'),
    ],
    primaryKeyword: 'audio equalizer online',
    secondaryKeywords: ['bass boost mp3 online', 'eq audio file', 'treble boost audio', 'high pass filter audio online'],
  },
  {
    slug: 'add-reverb-to-audio',
    name: 'Add Reverb to Audio',
    h1: 'Add Reverb or Echo to Audio Online',
    tagline: 'Put a dry vocal or recording in a room, hall, plate or spring reverb, or add a delay or echo, and download the result.',
    metaTitle: 'Add Reverb or Echo to Audio Online Free | Media Manipulator',
    metaDescription:
      'Free online reverb and echo. Add room, hall, plate or spring reverb, or a delay, to MP3, WAV and any audio file, with wet level and room size controls. No signup.',
    ogTitle: 'Add Reverb or Echo to Audio Online',
    ogDescription: 'Room, hall, plate, spring and delay. Free, no signup.',
    category: 'audio',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'add_reverb',
      defaultOutputFormat: 'mp3',
      preset: { kind: 'audio_effect', effect: 'reverb', defaults: { reverbType: 'hall' } },
      title: 'Add reverb to an audio file',
      description:
        'Upload an audio file. The Time-based effects section opens with hall reverb selected; adjust room size and wet level, or pick room, plate or spring, or add a delay. Press Convert.',
    },
    intro:
      'A vocal recorded in a treated room sounds dead until it is placed somewhere. Reverb adds that space; delay adds rhythm. Media Manipulator applies room, hall, plate and spring reverbs and echo-style delays on our servers with FFmpeg, with wet level and room size controls, and exports any audio format.',
    whatItDoes: [
      'Room, hall, plate and spring reverb types with room size, damping and wet/dry mix.',
      'Echo, multi-tap and ping-pong delay with time and feedback.',
      'Chorus, flanger, phaser and tremolo modulation in the same section.',
      'Exports MP3, WAV, FLAC, M4A, OGG or Opus.',
    ],
    flowSteps: [
      { title: 'Upload audio', description: 'A dry vocal or instrument works best.' },
      { title: 'Choose a reverb', description: 'Hall is preselected; set size and mix.' },
      { title: 'Convert', description: 'FFmpeg renders the effect.' },
      { title: 'Download', description: 'Save the result.' },
    ],
    advancedDetails: [
      'Reverbs are built from FFmpeg\'s aecho with per-type delay and decay sets; wet level mixes the effect against the dry signal.',
      'Delay time is in milliseconds; feedback above 70 percent builds up quickly.',
      'Effects are rendered into the file; keep the dry original if you may want to change them.',
    ],
    whyItMatters: [
      'Dry vocals and voiceovers sound unnatural without some room.',
      'A short plate reverb is the standard polish on spoken word and song.',
      'Delay and modulation are the quickest way to make a sound design element.',
    ],
    useCases: [
      { title: 'Vocal polish', description: 'Short plate on a sung or spoken take.' },
      { title: 'Big hall', description: 'Put a choir or pad in a cathedral.' },
      { title: 'Slapback', description: 'A quick echo on a guitar or vocal.' },
      { title: 'Sound design', description: 'Ping-pong delay and flanger on an effect.' },
    ],
    whyMediaManipulator: [
      'Four reverb types, three delay types and four modulation effects in one section.',
      'Combine with EQ, normalise and pitch in the same upload.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: AUDIO_INPUTS, supportedOutputFormats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'opus'] },
    faq: [
      { question: 'Which reverb should I use for voice?', answer: 'Plate or a small room at 20 to 30 percent wet. Hall is for music and effects.' },
      { question: 'Can I remove reverb?', answer: 'Not here. The AI voice cleanup tool reduces room sound on speech.' },
      { question: 'Can I add both reverb and delay?', answer: 'Yes. Both are in the same section and can be enabled together.' },
      { question: 'Is the effect reversible?', answer: 'No. It is rendered into the file; keep your dry original.' },
      AUDIO_FAQ_FREE,
    ],
    related: audioRelated('/add-reverb-to-audio'),
    primaryKeyword: 'add reverb to audio online',
    secondaryKeywords: ['add echo to audio', 'online reverb', 'reverb mp3', 'add delay to vocal'],
  },
  {
    slug: 'trim-audio',
    name: 'Trim Audio',
    h1: 'Trim or Cut Audio Online Free',
    tagline: 'Cut an MP3, WAV or any recording to a start and end time, with a waveform to pick the points, and download just that part.',
    metaTitle: 'Trim Audio Online Free: Cut MP3, WAV | Media Manipulator',
    metaDescription:
      'Free online audio trimmer. Cut any audio file to a range using a waveform, add fades, and download MP3, WAV, M4A or more. Make a ringtone or a clip. No watermark, no signup.',
    ogTitle: 'Trim or Cut Audio Online Free',
    ogDescription: 'Pick a start and end on the waveform and download the clip. Free, no signup.',
    category: 'audio',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'trim_audio',
      defaultOutputFormat: 'mp3',
      preset: { kind: 'audio_effect', effect: 'trim' },
      title: 'Trim an audio file',
      description:
        'Upload an audio file, press Trim audio, and drag the start and end markers on the waveform. Add a fade in or out in Basic processing if you want. Press Convert.',
    },
    intro:
      'The chorus for a ringtone, the one good minute of a two-hour recording, the sound bite without the intro: trimming is the audio edit everyone needs. Media Manipulator shows a waveform, lets you drag start and end points, cuts on our servers with FFmpeg, and exports in any format with optional fades.',
    whatItDoes: [
      'Cuts any audio file to a start and end time chosen on a waveform.',
      'Fade in and fade out so the cut does not click.',
      'Exports MP3, WAV, FLAC, M4A, OGG or Opus.',
      'Combine with volume, normalise and EQ in the same pass.',
    ],
    flowSteps: [
      { title: 'Upload audio', description: 'Any common format.' },
      { title: 'Set the range', description: 'Drag markers on the waveform.' },
      { title: 'Convert', description: 'FFmpeg cuts and encodes.' },
      { title: 'Download', description: 'Save the clip.' },
    ],
    advancedDetails: [
      'The cut is sample-accurate; the output is re-encoded in the format you choose.',
      'A fade of 0.05 to 0.2 seconds removes clicks at the cut points.',
      'For a video, use the Video trimmer; for a waveform video of the result, the Audio waveform generator.',
    ],
    whyItMatters: [
      'Ringtones and notification sounds need a 20 to 30 second cut.',
      'Sharing a sound bite is easier than sharing the whole recording.',
      'Removing silence and intros before transcription saves time.',
    ],
    useCases: [
      { title: 'Ringtone', description: 'Cut the chorus and add a fade.' },
      { title: 'Sound bite', description: 'Pull one sentence from an interview.' },
      { title: 'Remove a bad start', description: 'Drop the first 10 seconds of a memo.' },
      { title: 'Sample', description: 'Isolate a hit or a phrase.' },
    ],
    whyMediaManipulator: [
      'Waveform editing with draggable markers, not typed timestamps.',
      'Fades, normalise and any output format in the same upload.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: AUDIO_INPUTS, supportedOutputFormats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'opus'] },
    faq: [
      { question: 'Can I type exact times?', answer: 'Yes. The trim dialog has start and end fields as well as the draggable markers.' },
      { question: 'Will the cut click?', answer: 'Add a short fade in and out in Basic processing to avoid it.' },
      { question: 'Can I keep the original quality?', answer: 'Choose WAV or FLAC output to avoid a lossy re-encode.' },
      { question: 'Can I cut out the middle?', answer: 'One range per pass; run the tool twice and join the parts in Darkroom.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'Video trimmer', to: '/tools/video-trimmer', description: 'The same for video.' },
      { label: 'Extract audio from video', to: '/tools/extract-audio-from-video', description: 'Get the audio first.' },
      ...audioRelated('/trim-audio'),
    ],
    primaryKeyword: 'trim audio online',
    secondaryKeywords: ['cut mp3 online', 'audio cutter free', 'ringtone maker', 'crop audio file'],
  },
  {
    slug: 'transcribe-audio',
    name: 'Transcribe Audio',
    h1: 'Transcribe Audio to Text Online',
    tagline: 'Turn an MP3, WAV, M4A or any recording into text, captions or JSON with AI speech recognition on our own GPU servers.',
    metaTitle: 'Transcribe Audio to Text Online (Free AI) | Media Manipulator',
    metaDescription:
      'Free online audio transcription. Convert MP3, WAV, M4A, OGG or FLAC recordings into plain text, VTT or SRT captions, or JSON with timestamps. Runs on our own GPU, no third-party AI.',
    ogTitle: 'Transcribe Audio to Text Online',
    ogDescription: 'Recordings, interviews and voice memos to text. Free, no signup.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'transcribe_audio',
      transcribeMode: true,
      defaultOutputFormat: 'txt',
      title: 'Transcribe an audio file',
      description:
        'Upload an audio file and pick an output: plain text for a document, VTT or SRT for captions, JSON for timestamps. Whisper runs on our GPU server; nothing goes to a third-party AI.',
    },
    intro:
      'Interviews, lectures, voice memos and meeting recordings are far more useful as text: searchable, quotable, translatable. Media Manipulator transcribes audio with a Whisper model on a GPU server we operate, so your recording never leaves our infrastructure, and returns plain text, VTT or SRT captions, or a JSON transcript with word timestamps.',
    whatItDoes: [
      'Transcribes MP3, WAV, M4A, OGG, FLAC and other audio with Whisper.',
      'Outputs plain text, VTT, SRT or JSON with timestamps.',
      'Detects the language automatically across dozens of languages.',
      'Runs on our own GPU; no third-party AI provider.',
    ],
    flowSteps: [
      { title: 'Upload audio', description: 'Any common format.' },
      { title: 'Choose an output', description: 'Text, VTT, SRT or JSON.' },
      { title: 'Transcribe', description: 'Whisper runs on our GPU server.' },
      { title: 'Download', description: 'Open the transcript viewer or save the file.' },
    ],
    advancedDetails: [
      'Uses whisper-ctranslate2 with a large multilingual model; accuracy is best on clear speech with little background noise.',
      'Run the Remove background noise tool first on noisy recordings for a better transcript.',
      'Transcription counts as one operation from your daily allowance; a failed job is not counted.',
    ],
    whyItMatters: [
      'Text is searchable and skimmable; audio is not.',
      'Captions make audio content accessible and indexable.',
      'A transcript is the starting point for notes, articles and translations.',
    ],
    useCases: [
      { title: 'Interview notes', description: 'Get a text you can quote from.' },
      { title: 'Lecture transcript', description: 'Study from the text, search for terms.' },
      { title: 'Podcast captions', description: 'SRT or VTT for the video version.' },
      { title: 'Voice memo to text', description: 'Turn thoughts into a document.' },
    ],
    whyMediaManipulator: [
      'Whisper on hardware we run; your audio is never sent to a third-party AI.',
      'Four output formats and a built-in transcript viewer.',
      `No signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: AUDIO_INPUTS, supportedOutputFormats: ['txt', 'vtt', 'srt', 'json'], processingNotes: ['Counts as one operation; failed jobs are not counted.'] },
    faq: [
      { question: 'Which languages are supported?', answer: 'Whisper handles dozens of languages and detects the language automatically.' },
      { question: 'How accurate is it?', answer: 'Very good on clear speech. Background noise, crosstalk and heavy accents lower accuracy; denoise first if you can.' },
      { question: 'Is my recording sent to OpenAI?', answer: 'No. The model runs on our own GPU server.' },
      { question: 'Can I get speaker labels?', answer: 'Not yet. The JSON output has word-level timestamps you can segment by.' },
      { question: 'Does this count against my allowance?', answer: 'Yes, as one operation. Failed jobs are not counted.' },
    ],
    related: [
      { label: 'Transcribe video', to: '/tools/transcribe-video', description: 'The same for video files.' },
      { label: 'SRT generator', to: '/tools/srt-generator', description: 'Straight to subtitles.' },
      { label: 'Remove background noise', to: '/tools/remove-background-noise', description: 'Clean the audio first.' },
      { label: 'Caption translator', to: '/tools/caption-translator', description: 'Translate the captions.' },
    ],
    primaryKeyword: 'transcribe audio to text',
    secondaryKeywords: ['audio to text converter', 'mp3 to text online', 'transcribe voice memo', 'free audio transcription'],
  },

  // ------------------------------------------------------------------ IMAGE
  {
    slug: 'add-text-to-image',
    name: 'Add Text to Image',
    h1: 'Add Text to an Image Online Free',
    tagline: 'Put a caption, title or watermark on a photo: choose the font, size, colour, outline and position, and download.',
    metaTitle: 'Add Text to Image Online Free: Caption, Watermark | Media Manipulator',
    metaDescription:
      'Free online tool to add text to a photo. Pick font, size, colour, outline and position for a caption, meme or watermark on JPG, PNG, WebP and more. No signup.',
    ogTitle: 'Add Text to an Image Online Free',
    ogDescription: 'Caption, title or watermark on any photo. Free, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'add_text_to_image',
      preset: { kind: 'image_effect', effect: 'text' },
      title: 'Add text to an image',
      description:
        'Upload an image. The Text overlay section is highlighted: type the text, set size, colour, outline, font and position (nine anchor points or exact coordinates). Press Convert.',
    },
    intro:
      'A caption on a screenshot, a title on a thumbnail, a copyright line in the corner of a photo: adding text is the most common image edit after cropping. Media Manipulator renders text onto an image on our servers with ImageMagick, with font, size, fill and outline colour, and a position chosen from nine anchors or exact pixel coordinates, and exports in the same or a different format.',
    whatItDoes: [
      'Renders one block of text at any size with fill and outline colours.',
      'Six bundled fonts (sans, serif, mono in two families).',
      'Nine anchor positions or exact x/y placement.',
      'Combine with resize, crop, filters and metadata options in the same pass.',
    ],
    flowSteps: [
      { title: 'Upload an image', description: 'JPG, PNG, WebP, HEIC and more.' },
      { title: 'Type and style the text', description: 'Size, colours, outline, font, position.' },
      { title: 'Convert', description: 'ImageMagick draws the text.' },
      { title: 'Download', description: 'Save the captioned image.' },
    ],
    advancedDetails: [
      'Text is rasterised at the output size; set the size in pixels relative to the image width.',
      'An outline of 2 to 4 px in a contrasting colour keeps text readable on busy photos.',
      'Choose PNG output to keep a transparent background for a watermark template.',
    ],
    whyItMatters: [
      'Captions make screenshots self-explanatory.',
      'A visible copyright line discourages reposting without credit.',
      'Thumbnails with a title get more clicks.',
    ],
    useCases: [
      { title: 'Caption a screenshot', description: 'Label what the viewer is looking at.' },
      { title: 'Watermark a photo', description: 'Your name in the bottom corner.' },
      { title: 'Thumbnail title', description: 'Big bold text for a video thumbnail.' },
      { title: 'Meme', description: 'Top text, bottom text.' },
    ],
    whyMediaManipulator: [
      'Fill, outline, font and nine-point placement, not just a text box.',
      'Resize, crop and convert in the same upload.',
      `Free, no watermark of ours, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: IMAGE_INPUTS, supportedOutputFormats: ['jpg', 'png', 'webp', 'avif', 'gif'] },
    faq: [
      { question: 'Can I add more than one line?', answer: 'One text block per pass; a line break in the text renders on a new line. Run the tool again for a second block.' },
      { question: 'Can I use my own font?', answer: 'Six bundled fonts are available; custom font upload is not supported.' },
      { question: 'How do I place text exactly?', answer: 'Pick an anchor and add x/y offsets in pixels.' },
      { question: 'Will it reduce quality?', answer: 'The image is re-encoded; choose PNG or a high JPG quality to keep it sharp.' },
      AUDIO_FAQ_FREE,
    ],
    related: imageRelated('/add-text-to-image'),
    primaryKeyword: 'add text to image',
    secondaryKeywords: ['add caption to photo online', 'watermark image free', 'write on a picture online', 'add text to png'],
  },
  {
    slug: 'crop-image',
    name: 'Crop Image',
    h1: 'Crop an Image Online Free',
    tagline: 'Drag a box over the part of a photo you want, straighten the framing, and download just that region in any format.',
    metaTitle: 'Crop Image Online Free | Media Manipulator',
    metaDescription:
      'Free online image cropper. Drag to select a region of a JPG, PNG, WebP or HEIC photo and download it. Combine with resize, filters and format conversion. No signup.',
    ogTitle: 'Crop an Image Online Free',
    ogDescription: 'Drag a box, download the region. Free, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'crop_image',
      preset: { kind: 'image_effect', effect: 'crop' },
      title: 'Crop an image',
      description:
        'Upload an image and press Crop image to open the visual cropper. Drag the box to the region you want and save; the crop is applied when you press Convert.',
    },
    intro:
      'Cropping fixes framing, removes clutter at the edges and turns one photo into a tighter one. Media Manipulator opens a visual cropper on the uploaded image, applies the crop on our servers with ImageMagick, and lets you resize, filter and convert the result in the same pass.',
    whatItDoes: [
      'Visual crop box with drag handles on the actual image.',
      'Exact crop coordinates shown and editable.',
      'Combine with resize to a target width and height after cropping.',
      'Output in JPG, PNG, WebP, AVIF or GIF.',
    ],
    flowSteps: [
      { title: 'Upload an image', description: 'Any common format.' },
      { title: 'Draw the crop', description: 'Drag the box and handles.' },
      { title: 'Convert', description: 'ImageMagick crops and encodes.' },
      { title: 'Download', description: 'Save the cropped image.' },
    ],
    advancedDetails: [
      'The crop is applied before resize, so a 4000 px photo cropped to 1000 px and resized to 500 px is downscaled once.',
      'Cropping removes pixels and is not reversible; keep the original.',
      'EXIF orientation is honoured, so a rotated phone photo is cropped as you see it.',
    ],
    whyItMatters: [
      'Tighter framing is the quickest improvement to most photos.',
      'Profile pictures and thumbnails need specific regions and ratios.',
      'Cropping out a bystander or a licence plate is a privacy fix.',
    ],
    useCases: [
      { title: 'Profile picture', description: 'Crop to the face.' },
      { title: 'Remove clutter', description: 'Lose the edges of a photo.' },
      { title: 'Screenshot detail', description: 'Keep only the relevant part.' },
      { title: 'Product shot', description: 'Crop tight, then resize for a listing.' },
    ],
    whyMediaManipulator: [
      'Visual cropper with exact coordinates, plus resize and convert in the same pass.',
      'Metadata kept or stripped as you choose.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: IMAGE_INPUTS, supportedOutputFormats: ['jpg', 'png', 'webp', 'avif', 'gif'] },
    faq: [
      { question: 'Can I crop to a fixed ratio?', answer: 'Drag the box to the ratio you need; the width and height are shown as you go.' },
      { question: 'Does cropping lose quality?', answer: 'The remaining pixels are untouched. Choose PNG or a high JPG quality for the re-encode.' },
      { question: 'Can I crop a video?', answer: 'Yes, with the Crop video tool.' },
      { question: 'Can I rotate first?', answer: 'Use the Rotate image tool, then crop.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'Crop video', to: '/tools/crop-video', description: 'The same for video.' },
      ...imageRelated('/crop-image'),
    ],
    primaryKeyword: 'crop image online',
    secondaryKeywords: ['image cropper free', 'crop photo online', 'crop png', 'cut out part of image'],
  },
  {
    slug: 'grayscale-image',
    name: 'Convert Image to Black & White',
    h1: 'Convert an Image to Black and White Online',
    tagline: 'Turn a colour photo into grayscale, or sepia for a vintage tone, and download it in any format.',
    metaTitle: 'Convert Image to Black and White Online Free | Media Manipulator',
    metaDescription:
      'Free online black and white photo converter. Turn any JPG, PNG, WebP or HEIC image grayscale or sepia and download it. Combine with crop, resize and format change. No signup.',
    ogTitle: 'Convert an Image to Black and White Online',
    ogDescription: 'Grayscale or sepia in one click. Free, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'grayscale_image',
      preset: { kind: 'image_effect', effect: 'filter', filter: 'grayscale' },
      title: 'Convert an image to black and white',
      description:
        'Upload an image. The filter is preset to grayscale; switch to sepia or vintage for a warmer tone. Press Convert.',
    },
    intro:
      'Black and white strips a photo to light, shape and texture, hides colour casts and mixed lighting, and gives a set of photos a consistent look. Media Manipulator converts to grayscale on our servers with ImageMagick using a luminance-weighted conversion, offers sepia and vintage tones, and exports in any image format.',
    whatItDoes: [
      'Converts a colour image to grayscale with correct luminance weighting.',
      'Sepia and vintage alternatives for a warm or aged tone.',
      'Combine with crop, resize, text and format conversion.',
      'Output in JPG, PNG, WebP, AVIF or GIF.',
    ],
    flowSteps: [
      { title: 'Upload an image', description: 'Any common format.' },
      { title: 'Keep grayscale or pick sepia', description: 'Filter is preselected.' },
      { title: 'Convert', description: 'ImageMagick applies the conversion.' },
      { title: 'Download', description: 'Save the result.' },
    ],
    advancedDetails: [
      'Grayscale uses Rec. 709 luminance weights, so greens read brighter than blues as the eye expects.',
      'Sepia applies a tone after grayscale; vintage adds a slight fade and vignette.',
      'The output keeps three channels unless you pick a format that stores grayscale natively.',
    ],
    whyItMatters: [
      'Monochrome hides poor colour and mixed lighting.',
      'A consistent black-and-white set looks curated.',
      'Grayscale images compress smaller.',
    ],
    useCases: [
      { title: 'Portrait', description: 'Classic black-and-white headshot.' },
      { title: 'Document scan', description: 'Grayscale a photographed page.' },
      { title: 'Vintage look', description: 'Sepia on a family photo.' },
      { title: 'Print', description: 'Prepare for a black-and-white printer.' },
    ],
    whyMediaManipulator: [
      'Luminance-correct grayscale plus sepia and vintage.',
      'Crop, resize and convert in the same upload.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: IMAGE_INPUTS, supportedOutputFormats: ['jpg', 'png', 'webp', 'avif', 'gif'] },
    faq: [
      { question: 'Grayscale or desaturate?', answer: 'This is a luminance-weighted grayscale, which looks more natural than simply removing saturation.' },
      { question: 'Can I get a sepia tone?', answer: 'Yes. Pick sepia or vintage in the filter select.' },
      { question: 'Can I do this to a video?', answer: 'Yes. Use Adjust video colour and set saturation to -100.' },
      { question: 'Is the original colour recoverable?', answer: 'No. Keep the original file.' },
      AUDIO_FAQ_FREE,
    ],
    related: imageRelated('/grayscale-image'),
    primaryKeyword: 'convert image to black and white',
    secondaryKeywords: ['grayscale image online', 'black and white photo converter', 'sepia photo online', 'make photo black and white'],
  },
  {
    slug: 'image-filters',
    name: 'Image Filters & Effects',
    h1: 'Apply Filters and Effects to an Image Online',
    tagline: 'Oil painting, sketch, charcoal, emboss, vintage, swirl, blur, sharpen and more, applied to any photo in one click.',
    metaTitle: 'Image Filters Online Free: Sketch, Oil Painting, Emboss | Media Manipulator',
    metaDescription:
      'Free online photo filters. Apply oil painting, pencil sketch, charcoal, emboss, vintage, sepia, swirl, blur or sharpen to JPG, PNG, WebP and more, then download. No signup.',
    ogTitle: 'Apply Filters and Effects to an Image Online',
    ogDescription: 'Sketch, oil painting, emboss, vintage and more. Free, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'image_filters',
      preset: { kind: 'image_effect', effect: 'filter', filter: 'oil-painting' },
      title: 'Apply a filter to an image',
      description:
        'Upload an image and pick a filter; oil painting is preselected. Sketch, charcoal, emboss, vintage, sepia, swirl, barrel distortion, blur and sharpen are available. Press Convert.',
    },
    intro:
      'Sometimes a photo wants to be something else: a sketch for an invitation, an oil painting for a print, an embossed logo, a swirled abstract. Media Manipulator applies ImageMagick\'s artistic and corrective filters on our servers, from pencil sketch to sharpening, and exports in any image format, optionally cropped, resized and captioned in the same pass.',
    whatItDoes: [
      'Artistic: oil painting, sketch, charcoal, emboss, vintage, sepia, swirl, barrel distortion.',
      'Corrective: blur, sharpen, grayscale.',
      'Rotations by 45, 90, 180 and 270 degrees in the same select.',
      'Combine with crop, resize, text overlay and format conversion.',
    ],
    flowSteps: [
      { title: 'Upload an image', description: 'Any common format.' },
      { title: 'Pick a filter', description: 'Oil painting is preselected.' },
      { title: 'Convert', description: 'ImageMagick renders the effect.' },
      { title: 'Download', description: 'Save the result.' },
    ],
    advancedDetails: [
      'Oil painting and charcoal are radius-based and scale with image size; resize to 1500 to 2500 px for the strongest effect.',
      'Sketch and emboss work best on images with clear edges and good contrast.',
      'Effects are rendered into the pixels; keep the original.',
    ],
    whyItMatters: [
      'A stylised image stands out in a feed of photos.',
      'Sketch and painting looks are common for cards, posters and prints.',
      'Sharpening and blur are everyday corrections.',
    ],
    useCases: [
      { title: 'Pencil portrait', description: 'Sketch filter on a photo for a card.' },
      { title: 'Painted print', description: 'Oil painting for a canvas print.' },
      { title: 'Embossed logo', description: 'Emboss a flat logo.' },
      { title: 'Sharpen a scan', description: 'Bring up edges on a soft scan.' },
    ],
    whyMediaManipulator: [
      'Twelve artistic and corrective filters in one select.',
      'Crop, resize, caption and convert in the same upload.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: IMAGE_INPUTS, supportedOutputFormats: ['jpg', 'png', 'webp', 'avif', 'gif'] },
    faq: [
      { question: 'Can I adjust the strength?', answer: 'The filters use fixed, tuned strengths. Resize the image larger or smaller to change how strong a radius-based effect looks.' },
      { question: 'Can I stack filters?', answer: 'One filter per pass; run the result through the tool again for a second.' },
      { question: 'Is there an AI style transfer?', answer: 'No. These are classic ImageMagick effects, which run instantly.' },
      { question: 'Which filter works for a logo?', answer: 'Emboss or charcoal on a high-contrast logo.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'Black and white', to: '/tools/grayscale-image', description: 'Grayscale and sepia.' },
      { label: 'Blur image', to: '/tools/blur-image', description: 'Soften or obscure.' },
      { label: 'Sharpen image', to: '/tools/sharpen-image', description: 'Bring up detail.' },
      ...imageRelated('/image-filters'),
    ],
    primaryKeyword: 'image filters online',
    secondaryKeywords: ['photo to sketch online', 'oil painting filter', 'emboss image online', 'photo effects free'],
  },
  {
    slug: 'rotate-image',
    name: 'Rotate Image',
    h1: 'Rotate an Image Online Free',
    tagline: 'Turn a photo 90°, 180° or 270°, fix a sideways scan or phone picture, and download it in any format.',
    metaTitle: 'Rotate Image Online Free (90°, 180°, 270°) | Media Manipulator',
    metaDescription:
      'Free online image rotator. Rotate a JPG, PNG, WebP or HEIC photo by 90, 180 or 270 degrees, or 45 for a tilt, and download. The rotation is baked into the pixels. No signup.',
    ogTitle: 'Rotate an Image Online Free',
    ogDescription: 'Fix a sideways photo in one click. Free, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'rotate_image',
      preset: { kind: 'image_effect', effect: 'filter', filter: 'rotate-90º' },
      title: 'Rotate an image',
      description:
        'Upload an image. The filter select is preset to rotate 90°; pick 180°, 270° or 45° instead. The rotation is applied to the pixels, so every viewer agrees. Press Convert.',
    },
    intro:
      'Phones record orientation as a tag that some viewers ignore, and scanners and old cameras get it wrong outright. Rotating the pixels themselves fixes it for good. Media Manipulator rotates images on our servers with ImageMagick by 90, 180, 270 or 45 degrees, honours the existing orientation tag first, and exports in any format.',
    whatItDoes: [
      'Rotates by 90° (clockwise), 180°, 270° (counter-clockwise) or 45°.',
      'Bakes the rotation into the pixels and clears the EXIF orientation tag.',
      'Combine with crop, resize and format conversion.',
      'Output in JPG, PNG, WebP, AVIF or GIF.',
    ],
    flowSteps: [
      { title: 'Upload an image', description: 'Any common format.' },
      { title: 'Pick the angle', description: '90° is preselected.' },
      { title: 'Convert', description: 'ImageMagick rotates and encodes.' },
      { title: 'Download', description: 'Save the upright image.' },
    ],
    advancedDetails: [
      'The existing EXIF orientation is applied first, so what you see is what gets rotated.',
      'A 45° rotation adds a background fill at the corners; crop afterwards if needed.',
      'Use the Flip & mirror tools for horizontal or vertical mirroring instead.',
    ],
    whyItMatters: [
      'Sideways photos are the most common upload complaint on forums and forms.',
      'Some apps ignore the orientation tag, so baked-in rotation is the only reliable fix.',
      'Scans and old camera files often have no tag at all.',
    ],
    useCases: [
      { title: 'Sideways phone photo', description: 'Rotate 90° so it is upright everywhere.' },
      { title: 'Upside-down scan', description: 'Rotate 180°.' },
      { title: 'Fix a form upload', description: 'Rotate before submitting a document photo.' },
      { title: 'Tilted effect', description: 'Rotate 45° for a design element.' },
    ],
    whyMediaManipulator: [
      'Rotation applied to the pixels, with the orientation tag handled correctly.',
      'Crop, resize and convert in the same upload.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: IMAGE_INPUTS, supportedOutputFormats: ['jpg', 'png', 'webp', 'avif', 'gif'] },
    faq: [
      { question: 'Why does my photo look upright on my phone but sideways elsewhere?', answer: 'Your phone wrote an orientation tag that the other app ignores. Rotating here bakes the orientation into the pixels.' },
      { question: 'Does rotating lose quality?', answer: 'Rotation by 90° multiples is lossless in geometry; the re-encode is the only cost. Use PNG or high JPG quality.' },
      { question: 'Can I rotate by an arbitrary angle?', answer: 'Only 45° plus the 90° multiples are offered.' },
      { question: 'Can I mirror instead?', answer: 'Not here; mirroring is not currently offered for images.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'Rotate video', to: '/tools/rotate-video', description: 'The same for video.' },
      ...imageRelated('/rotate-image'),
    ],
    primaryKeyword: 'rotate image online',
    secondaryKeywords: ['rotate photo 90 degrees', 'rotate jpg online', 'fix sideways photo', 'rotate png'],
  },
  {
    slug: 'sharpen-image',
    name: 'Sharpen Image',
    h1: 'Sharpen an Image Online Free',
    tagline: 'Bring up the edges in a slightly soft photo or scan with a single-click sharpen, and download in any format.',
    metaTitle: 'Sharpen Image Online Free | Media Manipulator',
    metaDescription:
      'Free online image sharpener. Crisp up a soft JPG, PNG, WebP or HEIC photo or scan and download it. For real detail recovery try AI image restoration. No signup.',
    ogTitle: 'Sharpen an Image Online Free',
    ogDescription: 'Crisp up a soft photo in one click. Free, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'sharpen_image',
      preset: { kind: 'image_effect', effect: 'filter', filter: 'sharpen' },
      title: 'Sharpen an image',
      description: 'Upload an image. The filter is preset to sharpen. Press Convert, and compare the result against the original in the viewer.',
    },
    intro:
      'A photo that is a touch soft from a slow lens, a resize, or a scanner benefits from a sharpening pass that increases contrast along edges. Media Manipulator applies an unsharp-mask sharpen on our servers with ImageMagick and exports in any format. For blur that goes beyond softness, the AI image restoration tool recovers detail that sharpening cannot.',
    whatItDoes: [
      'Applies a tuned unsharp-mask sharpen to any image.',
      'Combine with resize: sharpen after downscaling for crisp thumbnails.',
      'Output in JPG, PNG, WebP, AVIF or GIF.',
      'Compare original and result side by side.',
    ],
    flowSteps: [
      { title: 'Upload an image', description: 'Any common format.' },
      { title: 'Keep sharpen selected', description: 'Add a resize if you like.' },
      { title: 'Convert', description: 'ImageMagick applies unsharp mask.' },
      { title: 'Download', description: 'Save the crisper image.' },
    ],
    advancedDetails: [
      'Sharpening increases local contrast at edges; it does not add detail. Over-sharpening shows as halos.',
      'Resizing down and then sharpening is the classic recipe for crisp web images.',
      'For motion blur, defocus or low-resolution sources, use AI image restoration.',
    ],
    whyItMatters: [
      'Downscaled images lose edge contrast and look soft without sharpening.',
      'Scans of documents and prints are often slightly soft.',
      'A crisp image reads as higher quality.',
    ],
    useCases: [
      { title: 'Thumbnail', description: 'Resize and sharpen for the web.' },
      { title: 'Soft scan', description: 'Crisp up a scanned print.' },
      { title: 'Product photo', description: 'Add edge definition before listing.' },
      { title: 'Slightly missed focus', description: 'Recover a touch of apparent sharpness.' },
    ],
    whyMediaManipulator: [
      'Tuned unsharp mask with resize in the same pass.',
      'AI restoration available when sharpening is not enough.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: IMAGE_INPUTS, supportedOutputFormats: ['jpg', 'png', 'webp', 'avif', 'gif'] },
    faq: [
      { question: 'Will it fix a blurry photo?', answer: 'It helps with mild softness. For real blur, use AI image restoration, which reconstructs detail.' },
      { question: 'Can I control the strength?', answer: 'The strength is fixed and tuned; run twice for more, or use a smaller output size for a stronger relative effect.' },
      { question: 'Does it add noise?', answer: 'Sharpening can emphasise existing grain. Use a high JPG quality to avoid compounding it.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'AI image restoration', to: '/tools/ai-image-restoration', description: 'Recover real detail with AI.' },
      { label: 'AI image upscaler', to: '/tools/ai-image-upscaler', description: 'Enlarge without blur.' },
      { label: 'Blur image', to: '/tools/blur-image', description: 'The opposite.' },
      ...imageRelated('/sharpen-image'),
    ],
    primaryKeyword: 'sharpen image online',
    secondaryKeywords: ['sharpen photo free', 'make image sharper', 'unsharp mask online', 'crisp up blurry photo'],
  },
  {
    slug: 'blur-image',
    name: 'Blur Image',
    h1: 'Blur an Image Online Free',
    tagline: 'Soften a whole photo for a background, a placeholder or a privacy screen, and download it in any format.',
    metaTitle: 'Blur Image Online Free | Media Manipulator',
    metaDescription:
      'Free online image blur. Soften a whole JPG, PNG, WebP or HEIC photo for a background, placeholder or privacy screen. To blur only faces use the face blur tool. No signup.',
    ogTitle: 'Blur an Image Online Free',
    ogDescription: 'Soften a photo in one click. Free, no signup.',
    category: 'image',
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'blur_image',
      preset: { kind: 'image_effect', effect: 'filter', filter: 'blur' },
      title: 'Blur an image',
      description: 'Upload an image. The filter is preset to blur, which softens the whole picture. To blur faces only, use the Blur faces in photo tool. Press Convert.',
    },
    intro:
      'A blurred photo makes a calm background behind text, a low-detail placeholder while the real image loads, or a privacy screen for a screenshot. Media Manipulator applies a Gaussian blur to the whole image on our servers with ImageMagick and exports in any format. For blurring just the faces or a licence plate, the AI face blur and text redaction tools target those regions.',
    whatItDoes: [
      'Applies a Gaussian blur to the entire image.',
      'Combine with resize for a tiny blurred placeholder.',
      'Output in JPG, PNG, WebP, AVIF or GIF.',
      'Related tools blur faces or redact text selectively.',
    ],
    flowSteps: [
      { title: 'Upload an image', description: 'Any common format.' },
      { title: 'Keep blur selected', description: 'Optionally resize.' },
      { title: 'Convert', description: 'ImageMagick blurs and encodes.' },
      { title: 'Download', description: 'Save the softened image.' },
    ],
    advancedDetails: [
      'The blur radius is fixed; for a stronger effect, resize smaller first, blur, then resize up.',
      'Blurred images compress very small, which is why they make good placeholders.',
      'A blurred screenshot is not a redaction: text can sometimes be recovered. Use text redaction for sensitive content.',
    ],
    whyItMatters: [
      'Blurred backgrounds keep overlaid text readable.',
      'Low-quality image placeholders improve perceived page speed.',
      'A soft version of a photo is a common design element.',
    ],
    useCases: [
      { title: 'Background for text', description: 'Blur a photo to put a heading on.' },
      { title: 'Placeholder', description: 'Tiny blurred preview for lazy loading.' },
      { title: 'Privacy screen', description: 'Soften a screenshot before sharing, then redact properly.' },
      { title: 'Dreamy effect', description: 'Soft overlay for a design.' },
    ],
    whyMediaManipulator: [
      'Whole-image blur here; face blur and text redaction as dedicated AI tools.',
      'Resize and convert in the same upload.',
      `Free, no watermark, no signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: IMAGE_INPUTS, supportedOutputFormats: ['jpg', 'png', 'webp', 'avif', 'gif'] },
    faq: [
      { question: 'Can I blur only part of the image?', answer: 'Use Blur faces in photo for faces or Redact text in image for text and licence plates.' },
      { question: 'Is blur enough to hide text?', answer: 'Not reliably. Use the redaction tool, which paints over the region.' },
      { question: 'Can I control the blur amount?', answer: 'The radius is fixed; resize smaller before blurring for a stronger effect.' },
      AUDIO_FAQ_FREE,
    ],
    related: [
      { label: 'Blur faces in photo', to: '/tools/blur-faces-in-photo', description: 'AI face blur.' },
      { label: 'Redact text in image', to: '/tools/redact-text-in-image', description: 'Hide text and plates.' },
      { label: 'Sharpen image', to: '/tools/sharpen-image', description: 'The opposite.' },
      ...imageRelated('/blur-image'),
    ],
    primaryKeyword: 'blur image online',
    secondaryKeywords: ['blur photo free', 'blur background image', 'gaussian blur online', 'soften image'],
  },

  // ------------------------------------------------------------------ AI
  {
    slug: 'generate-vtt-captions',
    name: 'VTT Caption Generator',
    h1: 'Generate WebVTT Captions from Video or Audio',
    tagline: 'Create a .vtt caption file for HTML5 video, YouTube or a player with AI transcription on our own GPU servers.',
    metaTitle: 'VTT Caption Generator Online (Free AI) | Media Manipulator',
    metaDescription:
      'Free online WebVTT caption generator. Upload a video or audio file and download a .vtt file with timed captions for HTML5 video, YouTube, Vimeo or any player. Runs on our own GPU.',
    ogTitle: 'Generate WebVTT Captions Online',
    ogDescription: 'AI-timed .vtt captions for any video. Free, no signup.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'generate_vtt_captions',
      transcribeMode: true,
      defaultOutputFormat: 'vtt',
      title: 'Generate VTT captions',
      description:
        'Upload a video or audio file. The output is preset to WebVTT; the transcript is timed by Whisper on our GPU server and returned as a .vtt file you can attach with a track element or upload to a platform.',
    },
    intro:
      'WebVTT is the caption format of the web: the HTML5 track element, YouTube, Vimeo, HLS and DASH players all read it. Media Manipulator generates timed VTT captions from any video or audio with a Whisper model on a GPU server we operate, so your media never goes to a third-party AI, and opens the result in a caption viewer where you can check the timing before downloading.',
    whatItDoes: [
      'Transcribes speech and segments it into timed cues.',
      'Outputs a standards-compliant .vtt file.',
      'Detects the language automatically.',
      'Runs on our own GPU; no third-party AI provider.',
    ],
    flowSteps: [
      { title: 'Upload video or audio', description: 'Any common format.' },
      { title: 'Keep VTT selected', description: 'Or switch to SRT, text or JSON.' },
      { title: 'Transcribe', description: 'Whisper times each cue.' },
      { title: 'Download', description: 'Attach the .vtt to your player.' },
    ],
    advancedDetails: [
      'Cues follow Whisper\'s segmentation, typically one sentence or clause per cue of 2 to 7 seconds.',
      'Translate the result into other languages with the Caption translator.',
      'For a burned-in caption track, use Darkroom\'s caption lane.',
    ],
    whyItMatters: [
      'Captions are required for accessibility and watched by most viewers on mute.',
      'VTT is the only format HTML5 video reads natively.',
      'Timed captions are indexable by search engines.',
    ],
    useCases: [
      { title: 'HTML5 video', description: 'Attach the file with a track element.' },
      { title: 'YouTube upload', description: 'Upload the .vtt as a caption track.' },
      { title: 'Course video', description: 'Captions for an LMS player.' },
      { title: 'Translate later', description: 'VTT in, translated VTT out.' },
    ],
    whyMediaManipulator: [
      'Whisper on our own hardware; nothing sent to a third-party AI.',
      'Caption viewer to check timing before download.',
      `No signup. ${RETENTION_PROMISE}.`,
    ],
    privacyNote,
    supportedFormats: { supportedInputFormats: [...VIDEO_INPUTS, 'mp3', 'wav', 'm4a'], supportedOutputFormats: ['vtt', 'srt', 'txt', 'json'], processingNotes: ['Counts as one operation; failed jobs are not counted.'] },
    faq: [
      { question: 'VTT or SRT?', answer: 'VTT for web players and YouTube; SRT for video editors and some older platforms. Both are offered.' },
      { question: 'Can I edit the captions?', answer: 'Download the .vtt and edit it in any text editor; the format is plain text.' },
      { question: 'Can I translate them?', answer: 'Yes, with the Caption translator tool.' },
      { question: 'Is my video sent to a third party?', answer: 'No. Transcription runs on our own GPU server.' },
      { question: 'Does this count against my allowance?', answer: 'Yes, as one operation. Failed jobs are not counted.' },
    ],
    related: [
      { label: 'SRT generator', to: '/tools/srt-generator', description: 'SubRip format.' },
      { label: 'Transcribe video', to: '/tools/transcribe-video', description: 'Plain text or JSON.' },
      { label: 'Caption translator', to: '/tools/caption-translator', description: 'Translate the captions.' },
      { label: 'Darkroom video editor', to: '/tools/content-studio', description: 'Burn captions in.' },
    ],
    primaryKeyword: 'vtt caption generator',
    secondaryKeywords: ['generate webvtt captions', 'vtt file maker', 'auto captions online', 'video to vtt'],
  },
  {
    slug: 'summarize-video',
    name: 'Summarize Video',
    h1: 'Summarize a Video with AI: Chapters, Topics and On-Screen Text',
    tagline: 'Get a written summary of a lecture, meeting or tutorial, with chapters you can click, topics and on-screen text, made on our own GPU servers.',
    metaTitle: 'AI Video Summarizer with Chapters | Media Manipulator',
    metaDescription:
      'Upload a video and get a written summary with timestamped chapters, topics and the text shown on screen. AI runs on our own GPU servers, never a third-party AI. Free account required.',
    ogTitle: 'Summarize a Video with AI',
    ogDescription: 'A written summary with clickable chapters, topics and on-screen text. Free account required.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'video',
      defaultTask: 'summarize_video',
      title: 'Summarize a video',
      description:
        'Sign in, upload a video (or an audio file) and pick the language of the summary. You get a title, a short summary, chapters that jump to the moment in your video, the topics and the text that appears on screen.',
    },
    intro:
      'Nobody wants to re-watch an hour of meeting or lecture to find the five minutes that mattered. Media Manipulator watches and listens for you: it transcribes the speech with Whisper, looks at frames chosen where the picture changes with a vision model, and writes a summary from both, all on a GPU server we operate. The result is a short document: a title, a few sentences, chapters with start and end times, the topics, and the text that appeared on screen. Click a chapter to jump to that moment in your video, copy the whole thing as Markdown, or download it as Markdown or JSON. Summaries need a free account.',
    whatItDoes: [
      'Writes a title and a three-to-six-sentence summary of the whole video.',
      'Splits the video into chapters with start and end times; clicking one jumps the player to that moment.',
      'Lists the topics and the text that appears on screen, with the time it first appears.',
      'Describes the picture and the speech, and notes what it could not do (for example, no speech).',
      'Writes the summary in the language you pick, or in the language that is spoken.',
    ],
    flowSteps: [
      { title: 'Sign in', description: 'A free account is enough.' },
      { title: 'Upload', description: 'A video, or an audio file.' },
      { title: 'Summarize', description: 'Speech and frames are analysed on our GPU server.' },
      { title: 'Read', description: 'Click chapters, copy Markdown, download .md or .json.' },
    ],
    advancedDetails: [
      'Speech is transcribed with Whisper; frames are picked at scene changes, up to your plan\'s frame budget (24 on Free, 48 on Premium, 96 on Pro), and described in batches by a vision model.',
      'A language model writes the summary from the transcript and the frame notes. Pro accounts can ask for a deeper summary from a larger model when it is available.',
      'A summary counts as one AI job from your daily allowance; a failed or refused job is not counted.',
      'The transcript is machine-generated, so names and numbers can be wrong. The summary says so in its notes.',
    ],
    whyItMatters: [
      'A summary with chapters is skimmable in a minute; the video is not.',
      'Clickable timestamps take you straight to the part you need.',
      'On-screen text catches slide titles and captions the speech never says out loud.',
    ],
    useCases: [
      { title: 'Meeting recap', description: 'Decisions and topics, with times to check the details.' },
      { title: 'Lecture notes', description: 'Chapters per section and the slide text, to study from.' },
      { title: 'Tutorial outline', description: 'The steps as chapters, so you can jump to the one you need.' },
      { title: 'Interview overview', description: 'What was discussed, and where.' },
    ],
    whyMediaManipulator: [
      'Whisper and the vision and language models run on hardware we operate; your video is never sent to a third-party AI.',
      'Chapters that seek your own video, right in the result viewer.',
      `Markdown and JSON downloads. ${RETENTION_PROMISE}.`,
    ],
    privacyNote:
      `Summaries need a free account, so the job is attached to it. Your file is processed on our own servers, and the AI models run on a GPU server we operate; nothing is sent to a third-party AI provider. ${RETENTION_PROMISE}.`,
    supportedFormats: {
      supportedInputFormats: [...VIDEO_INPUTS, 'mp3', 'wav', 'm4a'],
      supportedOutputFormats: ['md', 'json'],
      processingNotes: ['Counts as one AI job; failed jobs are not counted.', 'Length up to your plan\'s video duration limit.'],
    },
    faq: [
      { question: 'Do I need an account?', answer: 'Yes, a free account. Summaries run several AI models on our GPU server, so they are limited to signed-in users.' },
      { question: 'What do I get?', answer: 'A title, a short summary, chapters with start and end times, topics, on-screen text with times, a description of the picture and the speech, and notes about anything it could not do.' },
      { question: 'Can I choose the language of the summary?', answer: 'Yes. Pick one of the site\'s 18 languages, or "same as the speech" to write it in the spoken language.' },
      { question: 'What if the video has no speech?', answer: 'The summary is written from the picture alone and says so in its notes. A file with neither picture nor sound is refused and not counted.' },
      { question: 'Is my video sent to a third party?', answer: 'No. Every model runs on a GPU server we operate.' },
      { question: 'Does this count against my allowance?', answer: 'Yes, as one AI job. Failed jobs are not counted.' },
    ],
    related: [
      { label: 'Summarize audio', to: '/tools/summarize-audio', description: 'For podcasts and recordings.' },
      { label: 'Transcribe video', to: '/tools/transcribe-video', description: 'The full transcript.' },
      { label: 'Transcribe audio', to: '/tools/transcribe-audio', description: 'For audio files.' },
      { label: 'Remove background noise', to: '/tools/remove-background-noise', description: 'Clean the audio first.' },
    ],
    primaryKeyword: 'summarize video',
    secondaryKeywords: ['video summarizer ai', 'video chapters generator', 'lecture summary from video', 'meeting video summary'],
  },
  // MM75: the audio sibling of summarize-video (same MM74 job; no frames).
  {
    slug: 'summarize-audio',
    name: 'Summarize Audio',
    h1: 'Summarize an Audio Recording with AI',
    tagline: 'Turn a podcast, interview or voice memo into a written summary with chapters and topics, made on our own GPU servers.',
    metaTitle: 'AI Audio Summarizer with Chapters | Media Manipulator',
    metaDescription:
      'Upload an MP3, WAV or M4A and get a written summary with timestamped chapters and topics. Whisper and the language model run on our own GPU servers. Free account required.',
    ogTitle: 'Summarize an Audio Recording with AI',
    ogDescription: 'A written summary with chapters and topics for any recording. Free account required.',
    category: 'ai',
    embed: {
      defaultMediaKind: 'audio',
      defaultTask: 'summarize_audio',
      title: 'Summarize an audio file',
      description:
        'Sign in, upload a recording and pick the language of the summary. You get a title, a short summary, chapters that jump to the moment in your recording, and the topics.',
    },
    intro:
      'A podcast episode, an interview or a long voice memo is easier to use as a page than as an hour of audio. Media Manipulator transcribes the recording with Whisper and has a language model write a summary from the transcript, both on a GPU server we operate. You get a title, a few sentences, chapters with start and end times and the topics. Click a chapter to jump to that point in the recording, copy the summary as Markdown, or download it as Markdown or JSON. Summaries need a free account.',
    whatItDoes: [
      'Writes a title and a short summary of the recording.',
      'Splits it into chapters with times; clicking one jumps the player there.',
      'Lists the topics and describes who speaks and in what tone.',
      'Writes the summary in the language you pick, or in the spoken language.',
    ],
    flowSteps: [
      { title: 'Sign in', description: 'A free account is enough.' },
      { title: 'Upload', description: 'MP3, WAV, M4A and other audio.' },
      { title: 'Summarize', description: 'Whisper and a language model on our GPU server.' },
      { title: 'Read', description: 'Click chapters, copy Markdown, download .md or .json.' },
    ],
    advancedDetails: [
      'Speech is transcribed with Whisper; a language model writes the summary from the transcript.',
      'An audio file with cover art is treated as audio: the picture is ignored.',
      'A summary counts as one AI job from your daily allowance; a failed or refused job is not counted.',
      'The transcript is machine-generated, so names and numbers can be wrong. The summary says so in its notes.',
    ],
    whyItMatters: [
      'You can read a summary in a minute and decide what to listen to.',
      'Chapters with times turn a long recording into something you can navigate.',
      'Topics make a back catalogue of episodes searchable.',
    ],
    useCases: [
      { title: 'Podcast show notes', description: 'Chapters and topics for the episode page.' },
      { title: 'Interview recap', description: 'What was covered, with times to quote from.' },
      { title: 'Voice memo to notes', description: 'A rambling memo as a short page.' },
      { title: 'Call summary', description: 'The points of a recorded call.' },
    ],
    whyMediaManipulator: [
      'Whisper and the language model run on hardware we operate; your recording is never sent to a third-party AI.',
      'Chapters that seek your own recording, right in the result viewer.',
      `Markdown and JSON downloads. ${RETENTION_PROMISE}.`,
    ],
    privacyNote:
      `Summaries need a free account, so the job is attached to it. Your file is processed on our own servers, and the AI models run on a GPU server we operate; nothing is sent to a third-party AI provider. ${RETENTION_PROMISE}.`,
    supportedFormats: {
      supportedInputFormats: AUDIO_INPUTS,
      supportedOutputFormats: ['md', 'json'],
      processingNotes: ['Counts as one AI job; failed jobs are not counted.'],
    },
    faq: [
      { question: 'Do I need an account?', answer: 'Yes, a free account. Summaries run AI models on our GPU server, so they are limited to signed-in users.' },
      { question: 'How is this different from transcription?', answer: 'Transcription gives you every word. A summary gives you a title, a few sentences, chapters and topics, written from that transcript.' },
      { question: 'Can I choose the language of the summary?', answer: 'Yes. Pick one of the site\'s 18 languages, or "same as the speech".' },
      { question: 'Is my recording sent to a third party?', answer: 'No. The models run on a GPU server we operate.' },
      { question: 'Does this count against my allowance?', answer: 'Yes, as one AI job. Failed jobs are not counted.' },
    ],
    related: [
      { label: 'Transcribe audio', to: '/tools/transcribe-audio', description: 'Every word, as text or captions.' },
      { label: 'Summarize video', to: '/tools/summarize-video', description: 'Adds the picture and on-screen text.' },
      { label: 'Remove background noise', to: '/tools/remove-background-noise', description: 'Clean the audio first.' },
    ],
    primaryKeyword: 'summarize audio',
    secondaryKeywords: ['audio summarizer ai', 'podcast summary generator', 'summarize mp3', 'voice memo summary'],
  },
];
