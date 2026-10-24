import { describe, expect, it } from 'vitest';
import { absoluteApiUrl } from './apiUrl';

const PATH = '/api/share/tok/file?download=1';

describe('absoluteApiUrl', () => {
  it('does not double /api when the base already ends in /api', () => {
    expect(absoluteApiUrl(PATH, 'https://api.media-manipulator.com/api')).toBe(
      'https://api.media-manipulator.com/api/share/tok/file?download=1',
    );
  });
  it('tolerates a trailing slash on the base', () => {
    expect(absoluteApiUrl('/api/share/tok/file', 'https://api.example.com/api/')).toBe('https://api.example.com/api/share/tok/file');
  });
  it('keeps /api when the base is a bare origin', () => {
    expect(absoluteApiUrl(PATH, 'https://api.example.com')).toBe('https://api.example.com/api/share/tok/file?download=1');
  });
  it('does not strip /api from a non-/api path', () => {
    expect(absoluteApiUrl('/apiary/x', 'https://h/api')).toBe('https://h/api/apiary/x');
  });
  it('passes absolute URLs through', () => {
    expect(absoluteApiUrl('https://cdn.example.com/a.png', 'https://h/api')).toBe('https://cdn.example.com/a.png');
  });
  it('defaults to the configured API base', () => {
    expect(absoluteApiUrl('/api/share/t')).not.toMatch(/\/api\/api\//);
  });
});
