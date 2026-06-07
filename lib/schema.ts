// Helpers for building clean JSON-LD: never emit empty strings, empty FAQ
// entries, or HowTo blocks without enough real steps. Used by lib/seo.ts.

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function cleanStringArray(values: unknown[]): string[] {
  return values.filter(isNonEmptyString).map((value) => value.trim());
}

export function cleanFaqEntries<T extends { question: string; answer: string }>(
  faq: T[],
): T[] {
  return faq.filter(
    (item) => isNonEmptyString(item.question) && isNonEmptyString(item.answer),
  );
}

export function cleanSteps<T extends { title: string; description?: string }>(
  steps: T[],
): T[] {
  return steps.filter((step) => isNonEmptyString(step.title));
}
