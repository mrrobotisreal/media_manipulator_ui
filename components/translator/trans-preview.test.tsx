import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { TransPreview } from './trans-preview';

afterEach(cleanup);

const preview = () => screen.queryByTestId('trans-preview');

describe('Trans preview', () => {
  it('Trans preview: a strong template renders a <strong> element', () => {
    render(<TransPreview template="built by <strong>CreaTV</strong>" source="built by <strong>CreaTV Ltd.</strong>" dir="ltr" />);
    expect(preview()?.querySelector('strong')?.textContent).toBe('CreaTV');
    expect(preview()?.getAttribute('dir')).toBe('ltr');
  });

  it('Trans preview: a numeric tag renders span[data-tag="0"]', () => {
    render(<TransPreview template="<0>Hola</0> mundo" source="<0>Hello</0> world" dir="ltr" />);
    expect(preview()?.querySelector('span[data-tag="0"]')?.textContent).toBe('Hola');
  });

  it('Trans preview: br self-closing renders <br>, and dir rtl is applied', () => {
    render(<TransPreview template="a<br/>b" source="a<br/>b" dir="rtl" />);
    expect(preview()?.querySelector('br')).not.toBeNull();
    expect(preview()?.getAttribute('dir')).toBe('rtl');
  });

  it('Trans preview: editing the template updates the preview', () => {
    const { rerender } = render(<TransPreview template="one <em>x</em>" source="<em>y</em>" dir="ltr" />);
    expect(preview()?.textContent).toBe('one x');
    rerender(<TransPreview template="two <em>z</em>" source="<em>y</em>" dir="ltr" />);
    expect(preview()?.textContent).toBe('two z');
  });

  it('Trans preview: an invalid template shows the alert, no preview container, no crash', () => {
    const { rerender } = render(<TransPreview template="<strong>oops" source="<strong>x</strong>" dir="ltr" />);
    expect(screen.getByRole('alert').textContent).toMatch(/Template cannot be previewed: Unclosed tag/);
    expect(preview()).toBeNull();
    rerender(<TransPreview template="<strong>fixed</strong>" source="<strong>x</strong>" dir="ltr" />);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(preview()?.textContent).toBe('fixed');
  });

  it('Trans preview: <script> in the value shows an error, injects nothing', () => {
    const { container } = render(
      <TransPreview template="Hi <script>alert(1)</script>" source="Hi <strong>x</strong>" dir="ltr" />,
    );
    expect(screen.getByRole('alert').textContent).toMatch(/Tag <script> is not used by the English source/);
    expect(preview()).toBeNull();
    expect(document.querySelector('script')).toBeNull();
    expect(container.querySelector('[onerror], [onclick]')).toBeNull();
  });

  it('Trans preview: <img onerror> in the value is literal text, never an img element', () => {
    const { container } = render(
      <TransPreview template="Hi <img src=x onerror=alert(1)>" source="Hi <strong>x</strong>" dir="ltr" />,
    );
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('[onerror]')).toBeNull();
    expect(container.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('Trans preview: <img onerror> is never an img element even when img is declared by the source', () => {
    const { container } = render(
      <TransPreview template="<img src=x onerror=alert(1)>" source="<img/> pic" dir="ltr" />,
    );
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('[onerror]')).toBeNull();
  });

  it('Trans preview: link tags never produce an anchor or href', () => {
    const { container } = render(
      <TransPreview template="See <linkHow>how</linkHow>" source="See <linkHow>how it works</linkHow>" dir="ltr" />,
    );
    expect(preview()?.querySelector('span[data-tag="linkHow"]')?.textContent).toBe('how');
    expect(container.querySelector('a')).toBeNull();
    expect(container.querySelector('[href]')).toBeNull();
  });
});
