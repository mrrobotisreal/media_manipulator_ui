import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { Stat } from './stat';

afterEach(cleanup);

describe('Stat', () => {
  it('truncates by default', () => {
    render(<Stat orientation="inline" label="Plan" value="Premium" />);
    expect(screen.getByText('Premium').className).toContain('truncate');
  });

  it('inline + wrap never clips: the row wraps and the value stays end-aligned', () => {
    const { container } = render(
      <Stat orientation="inline" label="Result retention" value="You choose: 24 hours to 2 years" wrap />,
    );
    const value = screen.getByText('You choose: 24 hours to 2 years');
    expect(value.className).not.toContain('truncate');
    expect(value.className).toContain('break-words');
    expect(value.className).toContain('text-end');
    expect((container.firstChild as HTMLElement).className).toContain('flex-wrap');
  });

  it('stacked + wrap wraps without end alignment', () => {
    render(<Stat label="MIME" value="application/vnd.long-type" wrap />);
    const value = screen.getByText('application/vnd.long-type');
    expect(value.className).not.toContain('truncate');
    expect(value.className).not.toContain('text-end');
  });
});
