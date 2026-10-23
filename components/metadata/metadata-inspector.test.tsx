import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MetadataInspector } from './metadata-inspector';
import { VIRTUALIZE_AT } from './metadata-table';
import { photoDocument, syntheticDocument } from './test-utils';
import type { InspectorEvent } from '@/lib/metadata/types';

vi.mock('@/i18n/useLocalization', async () => {
  const u = await import('./test-utils');
  return { useLocalization: u.useLocalizationMock };
});
vi.mock('@/lib/i18n/ensureShard', async () => (await import('./test-utils')).ensureShardMock());
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const sectionIds = () =>
  [...document.querySelectorAll('[data-testid^="metadata-section-"]')].map((n) => n.getAttribute('data-category'));
const isOpen = (id: string) => screen.getByTestId(`metadata-section-${id}`).getAttribute('data-state') === 'open';

const chip = (p: string) => document.querySelector(`[data-privacy="${p}"]`) as HTMLElement;

async function ready() {
  await waitFor(() => expect(sectionIds().length).toBeGreaterThan(0));
}

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  // jsdom has no layout: give the virtual scroller a viewport and rows a height.
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, get: () => 400 });
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => 800 });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, get: () => 44 });
  HTMLElement.prototype.getBoundingClientRect = function () {
    return { x: 0, y: 0, top: 0, left: 0, bottom: 44, right: 800, width: 800, height: 44, toJSON() {} } as DOMRect;
  };
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('MetadataInspector with a realistic photo', () => {
  it('orders sections per design 3.3 and opens the defaults', async () => {
    render(<MetadataInspector document={photoDocument()} surface="home" />);
    await ready();
    expect(sectionIds()).toEqual(['file', 'image', 'camera', 'gps', 'thumbnail', 'makernote', 'composite']);
    expect(isOpen('file') && isOpen('image') && isOpen('camera') && isOpen('gps')).toBe(true);
    expect(isOpen('makernote')).toBe(false);
  });

  it('shows the summary: counts, dimensions, file name', async () => {
    render(<MetadataInspector document={photoDocument()} surface="home" />);
    await ready();
    expect(screen.getByTestId('summary-count').textContent).toBe('19 tags in 7 categories');
    expect(screen.getByTestId('summary-dimensions').textContent).toBe('4032 × 3024');
    expect(screen.getByTestId('metadata-summary-bar').textContent).toContain('IMG_0001.jpg');
    expect(screen.getByTestId('metadata-count-file').textContent).toBe('4');
  });

  it('humanizes names, formats values and shows catalog descriptions', async () => {
    render(<MetadataInspector document={photoDocument()} surface="home" />);
    await ready();
    const camera = screen.getByTestId('metadata-section-camera');
    expect(within(camera).getByText('Date/time original')).toBeTruthy();
    expect(within(camera).getByText('1/120 s')).toBeTruthy();
    expect(within(camera).getByText('f/1.8')).toBeTruthy();
    expect(camera.textContent).toContain('When the photo was captured.');
  });

  it('renders an unknown tag with its raw name and the undocumented fallback', async () => {
    render(<MetadataInspector document={photoDocument()} surface="home" />);
    await ready();
    fireEvent.click(within(screen.getByTestId('metadata-section-makernote')).getByRole('button', { name: /Maker notes/ }));
    const section = screen.getByTestId('metadata-section-makernote');
    expect(section.textContent).toContain('ZzzVendorOnly');
    expect(section.textContent).toContain('Vendor-specific; meaning undocumented');
  });

  it('filters by privacy chip, auto-opens matches and hides the rest', async () => {
    render(<MetadataInspector document={photoDocument()} surface="home" />);
    await ready();
    fireEvent.click(chip('device'));
    expect(sectionIds()).toEqual(['image', 'camera']);
    expect(screen.getByTestId('metadata-count-camera').textContent).toBe('1 / 5');
    expect(isOpen('image') && isOpen('camera')).toBe(true);
    expect(window.location.hash).toBe('#mf=device');
  });

  it('search narrows after the debounce and auto-opens', async () => {
    render(<MetadataInspector document={photoDocument()} surface="home" />);
    await ready();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'iphone' } });
    await waitFor(() => expect(sectionIds()).toEqual(['image']));
    expect(isOpen('image')).toBe(true);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzzz-no-match' } });
    await waitFor(() => expect(screen.getByText('No tags match your filters.')).toBeTruthy());
  });

  it('Raw toggles the raw view; Copy JSON copies the document', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.assign(navigator, { clipboard: { writeText } });
    render(<MetadataInspector document={photoDocument()} surface="home" />);
    await ready();
    fireEvent.click(screen.getByRole('button', { name: 'Raw' }));
    expect(screen.getByTestId('metadata-raw').textContent).toContain('"IFD0"');
    fireEvent.click(screen.getByRole('button', { name: 'Raw' }));
    expect(screen.queryByTestId('metadata-raw')).toBeNull();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy JSON' }));
    });
    expect(writeText).toHaveBeenCalledOnce();
  });

  it('reports events', async () => {
    const events: InspectorEvent[] = [];
    render(<MetadataInspector document={photoDocument()} surface="result" onEvent={(ev) => events.push(ev)} />);
    await ready();
    fireEvent.click(within(screen.getByTestId('metadata-section-makernote')).getByRole('button', { name: /Maker notes/ }));
    expect(events).toContainEqual({ type: 'section_toggled', category: 'makernote', open: true });
    fireEvent.click(chip('location'));
    expect(events).toContainEqual({ type: 'privacy_filter_used', privacy: 'location', active: true });
  });

  it('shows the thumbnail warning without a download link when no URL resolves', async () => {
    render(<MetadataInspector document={photoDocument()} surface="home" />);
    await ready();
    fireEvent.click(within(screen.getByTestId('metadata-section-thumbnail')).getByRole('button', { name: /Thumbnails and previews/ }));
    const thumb = screen.getByTestId('metadata-thumbnail');
    expect(thumb.textContent).toContain('Thumbnails can survive edits');
    expect(within(thumb).queryByRole('link')).toBeNull();
  });

  it('renders status variants and warnings', async () => {
    const doc = { ...photoDocument(), warnings: ['exiftool unavailable', 'pdf XMP not parsed'] };
    render(<MetadataInspector document={doc} surface="home" />);
    await ready();
    expect(screen.getByRole('alert').textContent).toContain('ExifTool is unavailable');
    fireEvent.click(screen.getAllByRole('button', { name: 'Dismiss warning' })[1]);
    expect(screen.queryByText('pdf XMP not parsed')).toBeNull();
    cleanup();
    render(<MetadataInspector document={doc} surface="home" status="error" />);
    expect(screen.getByRole('alert').textContent).toContain('Could not read metadata');
    cleanup();
    render(<MetadataInspector document={doc} surface="home" status="loading" />);
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
  });

  it('shows the empty state for a file with only basic info', async () => {
    const base = photoDocument();
    const doc = { ...base, entries: base.entries.filter((x) => x.group === 'System' || x.group === 'File') };
    render(<MetadataInspector document={doc} surface="home" />);
    await ready();
    expect(screen.getByText('No metadata beyond basic file information')).toBeTruthy();
  });
});

describe('MetadataInspector with 1,200 entries', () => {
  it('counts correctly and virtualizes only the large section', async () => {
    render(<MetadataInspector document={syntheticDocument(1200)} surface="home" />);
    await ready();
    expect(screen.getByTestId('summary-count').textContent).toBe('1200 tags in 4 categories');
    expect(sectionIds()).toEqual(['file', 'camera', 'gps', 'makernote']);
    expect(screen.getByTestId('metadata-count-makernote').textContent).toBe('1196');
    fireEvent.click(within(screen.getByTestId('metadata-section-makernote')).getByRole('button', { name: /Maker notes/ }));
    const table = within(screen.getByTestId('metadata-section-makernote')).getByRole('table');
    expect(table.getAttribute('data-virtualized')).toBe('true');
    expect(table.getAttribute('aria-rowcount')).toBe('1197');
    const mounted = table.querySelectorAll('[role="row"][data-entry-id]').length;
    expect(mounted).toBeGreaterThan(0);
    expect(mounted).toBeLessThan(60);
    // Small sections stay plain tables.
    expect(within(screen.getByTestId('metadata-section-camera')).getByRole('table').getAttribute('data-virtualized')).toBeNull();
    expect(VIRTUALIZE_AT).toBe(200);
  });

  it('search narrows 1,200 entries and Expand all opens everything', async () => {
    render(<MetadataInspector document={syntheticDocument(1200)} surface="home" />);
    await ready();
    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }));
    expect(['file', 'camera', 'gps', 'makernote'].every(isOpen)).toBe(true);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'MakerTag777' } });
    await waitFor(() => expect(screen.getByTestId('metadata-count-makernote').textContent).toBe('1 / 1196'));
    expect(sectionIds()).toEqual(['makernote']);
  });
});

describe('URL hash round trip', () => {
  it('opens sections from the initial hash, writes toggles back, follows hashchange', async () => {
    window.history.replaceState(null, '', '/#meta=gps');
    render(<MetadataInspector document={photoDocument()} surface="home" />);
    await ready();
    expect(isOpen('gps')).toBe(true);
    expect(isOpen('camera')).toBe(false);

    fireEvent.click(within(screen.getByTestId('metadata-section-camera')).getByRole('button', { name: /Camera and exposure/ }));
    expect(isOpen('camera')).toBe(true);
    expect(window.location.hash).toBe('#meta=gps,camera');

    act(() => {
      window.history.replaceState(null, '', '/#meta=image');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(isOpen('image')).toBe(true);
    expect(isOpen('gps')).toBe(false);
  });

  it('restores privacy filters from the hash', async () => {
    window.history.replaceState(null, '', '/#mf=location');
    render(<MetadataInspector document={photoDocument()} surface="home" />);
    await ready();
    expect(sectionIds()).toEqual(['gps']);
  });
});
