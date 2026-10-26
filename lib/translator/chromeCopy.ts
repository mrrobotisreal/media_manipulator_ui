/**
 * Translator workbench chrome copy (MM53 decision 11, "proposed": English only).
 *
 * Translators are briefed in English, so the panel's own labels are constants here
 * rather than a translator namespace shard in 17 locales. This keeps every chrome
 * string inside the translator-only chunk (production bundles never see it) and
 * avoids a shard the translators would then be asked to translate. Revisit with
 * Mitch if localised chrome is wanted (MM56).
 */
export const CHROME = {
  panelLabel: 'Translator workbench',
  openPanel: 'Open translator workbench',
  collapsePanel: 'Collapse translator workbench',
  resizeHandle: 'Resize translator workbench',
  tabs: { page: 'This page', all: 'All keys', changes: 'Changes' },
  searchLabel: 'Search keys, English or translation',
  searchPlaceholder: 'Search key, English or translation  ( / )',
  loading: 'Loading the locale’s strings…',
  loadFailed: 'Could not load this locale’s strings. Reload the page to try again.',
  noKeysOnPage: 'No translatable strings found on this page yet.',
  noMatches: 'No keys match the search.',
  otherLocalePage: (pageLocale: string, href: string) =>
    `This page is shown in ${pageLocale}. Open ${href} to edit it in place.`,
  english: 'English',
  translation: 'Translation',
  modified: 'Modified',
  newKey: 'New key',
  revert: 'Revert',
  revertKey: (key: string) => `Revert ${key}`,
  editField: (key: string) => `Translation for ${key}`,
  attributeBadge: (attr: string) => `in ${attr}`,
  approximate: 'Preview approximate',
  approximateHint:
    'This string is rendered on the server with values the page does not expose, so the live preview may differ until the PR deploys.',
  upstreamChanged: 'Changed upstream',
  upstreamChangedHint: 'The deployed text for this key changed since this draft was started. Re-check it before submitting.',
  pluralGroup: 'Plural forms',
  pluralRequired: (cats: string) => `Required for this language: ${cats}`,
  pluralSurplus: 'Not used by this language',
  pluralEnglish: 'English forms',
  transTemplate: 'Raw template (keep the tags)',
  transPreview: 'Preview',
  transError: (detail: string) => `Template cannot be previewed: ${detail}`,
  warnings: (n: number) => (n === 1 ? '1 warning' : `${n} warnings`),
  storageBanner: 'Drafts are not being saved in this browser (storage is unavailable, e.g. a private window). Keep this tab open until you submit.',
  changesEmpty: 'No pending changes.',
  changesCount: (n: number) => (n === 1 ? '1 pending change' : `${n} pending changes`),
  refreshBase: 'Refresh base',
  baseLabel: (sha: string) => `Base: main @ ${sha.slice(0, 7)}`,
  baseMissing: 'Base not fetched yet.',
  baseFailed: 'Could not fetch the base revision.',
  submit: 'Submit for review',
  submitPending: 'Submitting opens a pull request; it arrives with the next release of the workbench.',
  signIn: 'Sign in to translate',
  verify: {
    title: 'Verify your email to start translating',
    body: 'Your translator account is set up, but its email address is not verified yet. Send the verification email, click the link in it, then come back and press “I’ve verified”.',
    send: 'Send verification email',
    sent: 'Sent. Check your inbox (and spam), click the link, then press “I’ve verified”.',
    sendFailed: 'Could not send the email. Firebase may be rate-limiting — wait a few minutes and try again.',
    check: 'I’ve verified',
    stillUnverified: 'Firebase still reports this address as unverified. Make sure you clicked the link, then try again.',
  },
} as const;
