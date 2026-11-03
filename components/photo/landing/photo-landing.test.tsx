import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => null }));

import PhotoDropzone, { PHOTO_EDITOR_HREF } from './photo-dropzone';
import { PhotoRecentList, photoEditorHref, type PhotoLauncherLabels } from './photo-launcher';

afterEach(cleanup);

const labels: PhotoLauncherLabels = {
  drop: 'Drop a photo',
  choose: 'Choose a photo',
  hint: 'hint',
  opening: 'Opening',
  openEmpty: 'Open the editor without a photo',
  title: 'Open the editor',
  description: 'desc',
  recentTitle: 'Recent',
  sourceAccount: 'Saved to your account',
  sourceBrowser: 'Saved in this browser',
  loading: 'Loading',
  empty: 'No projects yet',
  error: 'Could not load',
  untitled: 'Untitled photo',
  edited: 'Edited {{date}}',
};

const file = () => new File([new Uint8Array([1])], 'a.jpg', { type: 'image/jpeg' });

describe('PhotoDropzone (MM100)', () => {
  it('stores the photo and navigates to the unlocalized editor with the page panel and look', async () => {
    const navigate = vi.fn();
    const stash = vi.fn(async () => true);
    render(<PhotoDropzone panel="hsl" preset="color-pop-red" title="t" description="d" labels={labels} navigate={navigate} stash={stash} />);
    fireEvent.change(screen.getByTestId('photo-dropzone-input'), { target: { files: [file()] } });
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/photo/new?handoff=1&panel=hsl&preset=color-pop-red'));
    expect(stash).toHaveBeenCalledWith(expect.any(File), 'hsl', 'color-pop-red');
  });

  it('falls back to the bare editor when storage is unavailable', async () => {
    const navigate = vi.fn();
    render(<PhotoDropzone panel="basic" title="t" description="d" labels={labels} navigate={navigate} stash={async () => false} />);
    fireEvent.change(screen.getByTestId('photo-dropzone-input'), { target: { files: [file()] } });
    await waitFor(() => expect(navigate).toHaveBeenCalledWith(PHOTO_EDITOR_HREF));
  });

  it('offers an editor link without a photo', () => {
    render(<PhotoDropzone panel="basic" title="t" description="d" labels={labels} />);
    expect(screen.getByTestId('photo-open-empty').getAttribute('href')).toBe('/photo/new');
  });
});

describe('PhotoRecentList (MM100)', () => {
  it('renders loading, error, empty and rows with raw /photo links', () => {
    const { rerender } = render(<PhotoRecentList state={{ status: 'loading' }} labels={labels} locale="en-US" />);
    expect(screen.getByTestId('photo-recent-loading')).toBeTruthy();
    rerender(<PhotoRecentList state={{ status: 'error' }} labels={labels} locale="en-US" />);
    expect(screen.getByTestId('photo-recent-error')).toBeTruthy();
    rerender(<PhotoRecentList state={{ status: 'ready', source: 'browser', rows: [] }} labels={labels} locale="en-US" />);
    expect(screen.getByTestId('photo-recent-empty')).toBeTruthy();
    rerender(
      <PhotoRecentList
        state={{ status: 'ready', source: 'account', rows: [{ id: 'p1', name: '', at: Date.parse('2026-11-01'), size: '6000×4000' }] }}
        labels={labels}
        locale="en-US"
      />,
    );
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe(photoEditorHref('p1'));
    expect(link.textContent).toContain('Untitled photo');
    expect(link.textContent).toContain('6000');
    expect(screen.getByText('Saved to your account')).toBeTruthy();
  });
});
