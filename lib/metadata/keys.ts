/**
 * i18n key sanitizer for catalog descriptions.
 *
 * i18next treats `.` as the key separator and `:` as the namespace separator,
 * so a tag such as `com.apple.quicktime.make` cannot be a JSON key segment as
 * is. `sanitizeKeySegment` maps both (and whitespace runs) to `_`.
 *
 * Description keys are `about.<Group>.<Tag>`; catalog rows with no group use
 * the group segment `_` and carry the category as a `__<category>` suffix
 * because one tag name (e.g. `DateTimeOriginal`) has a different description per
 * category.
 */
export function sanitizeKeySegment(segment: string): string {
  return segment.replace(/[.:\s]+/g, '_');
}

export interface AboutKeySource {
  group?: string;
  tag: string;
  category: string;
}

/** Key (relative to the `metadata` root, no namespace) of a catalog row's description. */
export function aboutKey(row: AboutKeySource): string {
  if (row.group) return `about.${sanitizeKeySegment(row.group)}.${sanitizeKeySegment(row.tag)}`;
  return `about._.${sanitizeKeySegment(row.tag)}__${row.category}`;
}
