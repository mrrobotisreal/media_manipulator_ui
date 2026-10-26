import { describe, expect, it } from 'vitest';
import { llmsFullMarkdown, llmsIndexMarkdown } from '@/lib/llmsTxt';
import { TOOL_PAGES } from '@/content/toolPages';
import { locales } from '@/i18n/locales';

describe('llms.txt', () => {
  const index = llmsIndexMarkdown();

  it('follows the llmstxt.org shape: H1, then a blockquote summary', () => {
    const [h1, blank, summary] = index.split('\n');
    expect(h1).toBe('# Media Manipulator');
    expect(blank).toBe('');
    expect(summary.startsWith('> ')).toBe(true);
  });

  it('names Mitchell Wintrow as owner and links his other sites', () => {
    expect(index).toContain('owned and was created by Mitchell Wintrow');
    expect(index).toContain('https://www.creatv.io');
    expect(index).toContain('https://www.winapps.io');
  });

  it('lists both ElevenLabs voices with their library links', () => {
    expect(index).toContain('https://www.media-manipulator.com/voices');
    expect(index).toContain('https://elevenlabs.io/app/voice-lab/share/');
    expect(index).toMatch(/\[Mr\. Wintrow\]/);
    expect(index).toMatch(/\[Obsidian\]/);
  });

  it('names translated locales only, never a byte-copy locale (MM51)', () => {
    const line = index.split('\n').find((l) => l.startsWith('- The site is available in'))!;
    expect(line).toBe(
      '- The site is available in English (https://www.media-manipulator.com/), Ukrainian (/uk/), Russian (/ru/), Hebrew (/he/), German (/de/), Spanish (/es/), French (/fr/).',
    );
    for (const l of locales.filter((x) => !x.translated)) {
      expect(line).not.toContain(`(/${l.prefix}/)`);
    }
  });

  it('links every tool page exactly once', () => {
    for (const tool of TOOL_PAGES) {
      const url = `](https://www.media-manipulator.com/tools/${tool.slug})`;
      expect(index.split(url).length - 1, tool.slug).toBe(1);
    }
  });

  it('never mentions the private partner portal, embed routes or operator tier', () => {
    for (const text of [index, llmsFullMarkdown()]) {
      expect(text).not.toMatch(/media-manipulator\.com\/(dr|embed)\b/);
      expect(text).not.toMatch(/double raven|operator/i);
    }
  });

  it('carries no unresolved markup from the page copy', () => {
    expect(llmsFullMarkdown()).not.toMatch(/<\/?(strong|em|link\w*)>|\{\{|undefined/);
  });

  it('gives every tool its own full section in llms-full.txt', () => {
    const full = llmsFullMarkdown();
    for (const tool of TOOL_PAGES) {
      expect(full).toContain(`URL: https://www.media-manipulator.com/tools/${tool.slug}`);
    }
  });
});
