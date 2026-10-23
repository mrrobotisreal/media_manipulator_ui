import type enPages from '@/i18n/locales/en-us/interface/pages.json';

/**
 * Every string /account renders, as one object read on the server
 * (`t('interface:account', { returnObjects: true })`) and passed down as a prop. Type-only
 * import: `pages.json` never reaches a client chunk (§0.5.13-14). The English file is the
 * type; the parity test keeps the other five locales identical in shape.
 */
export type AccountCopy = (typeof enPages)['account'];
