import { describe, expect, it } from 'vitest';

import { extractSSERecords, parseSSERecordData, readSSEStream } from './parse';

function streamOf(chunks: string[]): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(c) {
      for (const ch of chunks) c.enqueue(enc.encode(ch));
      c.close();
    },
  });
}

describe('shared SSE parser (MM107 move from lib/dr/sse.ts)', () => {
  it('splits complete records and keeps the remainder', () => {
    expect(extractSSERecords('data: a\n\ndata: b\n\ndata: c')).toEqual({ records: ['data: a', 'data: b'], rest: 'data: c' });
  });

  it('joins data lines and skips comments / keepalives', () => {
    expect(parseSSERecordData(': ping')).toBeNull();
    expect(parseSSERecordData('event: x\ndata: {"a":1}\ndata: 2')).toBe('{"a":1}\n2');
  });

  it('reads a chunked body in order, across split records, skipping pings', async () => {
    const got: string[] = [];
    await readSSEStream(streamOf(['data: {"type":"me', 'ta"}\n\n: ping\n\nda', 'ta: {"type":"done"}\n\n']), (d) => got.push(d));
    expect(got).toEqual(['{"type":"meta"}', '{"type":"done"}']);
  });

  it('flushes a final record without the trailing blank line', async () => {
    const got: string[] = [];
    await readSSEStream(streamOf(['data: last']), (d) => got.push(d));
    expect(got).toEqual(['last']);
  });
});
