import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MetadataGps, openStreetMapUrl } from './metadata-gps';
import { MetadataThumbnail } from './metadata-thumbnail';
import { WORLD_OUTLINE_PATH, project } from './world-outline';
import { photoDocument } from './test-utils';

vi.mock('@/i18n/useLocalization', async () => {
  const u = await import('./test-utils');
  return { useLocalization: u.useLocalizationMock };
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('MetadataGps', () => {
  it('makes no network request and creates no image or external src', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const imageSpy = vi.fn();
    vi.stubGlobal('Image', imageSpy);
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const created: string[] = [];
    const orig = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(((tag: string, o?: ElementCreationOptions) => {
      created.push(tag);
      return orig(tag, o);
    }) as typeof document.createElement);

    const { container } = render(<MetadataGps entries={photoDocument().entries} />);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(imageSpy).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(created).not.toContain('img');
    expect(container.querySelectorAll('img, iframe, script, link, image, use, [src]').length).toBe(0);
    vi.unstubAllGlobals();
  });

  it('links to OpenStreetMap with the right href and never opens it automatically', () => {
    render(<MetadataGps entries={photoDocument().entries} />);
    const link = screen.getByRole('link', { name: /Open in OpenStreetMap/ });
    expect(link.getAttribute('href')).toBe(
      'https://www.openstreetmap.org/?mlat=37.774972&mlon=-122.419417#map=15/37.774972/-122.419417',
    );
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(openStreetMapUrl(0, 0)).toContain('mlat=0.000000');
  });

  it('shows decimal and DMS coordinates, altitude and the privacy copy', () => {
    render(<MetadataGps entries={photoDocument().entries} />);
    const el = screen.getByTestId('metadata-gps');
    expect(el.textContent).toContain('37.774972, -122.419417');
    expect(el.textContent).toContain('37°46′29.9″ N');
    expect(el.textContent).toContain('16.2 m');
    expect(el.textContent).toContain('Nothing on this page contacts a map service');
  });

  it('renders nothing without coordinates', () => {
    const { container } = render(<MetadataGps entries={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('draws the dot at lon/lat on the equirectangular outline, within the 6 KB budget', () => {
    expect(project(37.5, -122.5)).toEqual({ x: 57.5, y: 52.5 });
    expect(WORLD_OUTLINE_PATH.length).toBeLessThanOrEqual(6 * 1024);
    render(<MetadataGps entries={photoDocument().entries} />);
    const dot = screen.getByTestId('gps-dot');
    expect(Number(dot.getAttribute('cx'))).toBeCloseTo(57.58, 1);
    expect(Number(dot.getAttribute('cy'))).toBeCloseTo(52.23, 1);
  });
});

describe('MetadataThumbnail', () => {
  it('offers download and preview only when a URL resolves, and loads the image only on click', () => {
    const entries = photoDocument().entries;
    const url = '/api/job/j1/metadata/binary/IFD1%3AThumbnailImage';
    const onDownload = vi.fn();
    const { container } = render(<MetadataThumbnail entries={entries} resolveBinaryUrl={() => url} onDownload={onDownload} />);
    expect(container.querySelector('img')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Preview ThumbnailImage/ }));
    expect(container.querySelector('img')?.getAttribute('src')).toBe(url);
    const link = screen.getByRole('link', { name: /Download ThumbnailImage/ });
    expect(link.getAttribute('href')).toBe(url);
    fireEvent.click(link);
    expect(onDownload).toHaveBeenCalledWith('IFD1:ThumbnailImage');
  });

  it('shows only the warning and byte size when no URL resolves', () => {
    render(<MetadataThumbnail entries={photoDocument().entries} />);
    expect(screen.getByText(/Thumbnails can survive edits/)).toBeTruthy();
    expect(screen.getByText('12.4 KB embedded')).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
