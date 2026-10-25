import { expect, test, type Page } from '@playwright/test';

/**
 * MM52 acceptance criterion 8 (design §2.9, §6; research §2.2 and §8 risk 4):
 * a key marker appended after Hebrew or Arabic text must not change how the
 * final letter shapes, nor the first letter of an adjacent string.
 *
 * Method: render each sample twice in the same font, once plain and once with
 * a real marker (`lib/translator/markerCodec.ts`) appended, and compare
 * pixels. Arabic samples end in dual-joining letters, whose final form differs
 * visibly from the medial form a join-causing ZWJ would select. Also checks two
 * adjacent marked strings and that the visible width is unchanged.
 *
 * Expected: identical pixels (markers start and end with ZWNJ, which is
 * non-joining; see the codec's file comment). If this FAILS, the fallbacks in
 * the MM52 ticket (decision 8) apply: try U+200F before the payload, else place
 * the payload before the last grapheme; record the outcome in the design doc.
 */
import { appendMarker, encodeIndex } from '../../lib/translator/markerCodec';

const SAMPLES: Array<[string, string, 'rtl' | 'ltr']> = [
  ['ar: ends in beh (dual-joining)', 'ضغط الصورة والملف بسرعة كبيرة جدا وحب', 'rtl'],
  ['ar: ends in meem', 'مرحبا بكم في المحرر', 'rtl'],
  ['ar: ends in lam', 'تنزيل الملف الأصلي كامل', 'rtl'],
  ['ar: ends in heh', 'ضغط الصورة', 'rtl'],
  ['he: final forms', 'דחיסת תמונה וקובץ שלם', 'rtl'],
  ['hi: conjunct at end', 'फ़ाइल संपीड़ित करें क्ष', 'ltr'],
];

async function render(page: Page, text: string, dir: 'rtl' | 'ltr') {
  await page.setContent(
    `<!doctype html><html dir="${dir}"><body style="margin:0;background:#fff">
      <p id="t" style="font:32px 'Geeza Pro','SF Arabic','Noto Naskh Arabic','Noto Sans Hebrew','Noto Sans Devanagari',sans-serif;
        display:inline-block;padding:8px;margin:0;color:#000;white-space:nowrap"></p></body></html>`,
  );
  await page.locator('#t').evaluate((el, value) => {
    el.textContent = value;
  }, text);
  const box = await page.locator('#t').boundingBox();
  const shot = await page.locator('#t').screenshot();
  return { width: box?.width ?? 0, shot };
}

for (const [label, text, dir] of SAMPLES) {
  test(`marker after text keeps shaping — ${label}`, async ({ page }) => {
    const plain = await render(page, text, dir);
    const marked = await render(page, appendMarker(text, 2 ** 37 + 12345), dir);
    expect(marked.width).toBeCloseTo(plain.width, 0);
    expect(marked.shot.equals(plain.shot)).toBe(true);
  });

  test(`adjacent marked strings keep shaping — ${label}`, async ({ page }) => {
    const plain = await render(page, `${text}${text}`, dir);
    const marked = await render(page, `${text}${encodeIndex(1)}${text}${encodeIndex(2)}`, dir);
    expect(marked.shot.equals(plain.shot)).toBe(true);
  });
}
