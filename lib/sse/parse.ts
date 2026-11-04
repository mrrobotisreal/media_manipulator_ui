// Shared SSE record parsing for every surface that consumes server-sent events
// via fetch + ReadableStream (the browser's EventSource cannot set an
// Authorization header or POST a body, so we never use it). Extracted from the
// DR feedback stream unchanged in behaviour; used by the DR chat lab
// (lib/dr/useChatStream.ts, lib/dr/useFeedbackEvents.ts) and Medi
// (lib/assistant/stream.ts, MM107).

/**
 * Split the accumulated stream buffer into complete SSE records (frames are
 * separated by a blank line). Returns the complete records plus the unfinished
 * remainder to carry into the next read.
 */
export function extractSSERecords(buffer: string): { records: string[]; rest: string } {
  const records: string[] = [];
  let rest = buffer;
  let sep: number;
  while ((sep = rest.indexOf('\n\n')) !== -1) {
    records.push(rest.slice(0, sep));
    rest = rest.slice(sep + 2);
  }
  return { records, rest };
}

/**
 * One SSE record's data payload: collect its `data:` lines (joined by \n),
 * ignoring `event:` fields and `:` comments/keepalives. Returns null when the
 * record carries no data (comment-only / keepalive frames).
 */
export function parseSSERecordData(record: string): string | null {
  const dataLines: string[] = [];
  for (const line of record.split('\n')) {
    if (line.startsWith(':')) continue; // comment / keepalive
    if (line.startsWith('data:')) dataLines.push(line.slice(5).replace(/^ /, ''));
  }
  return dataLines.length > 0 ? dataLines.join('\n') : null;
}

/**
 * Read a fetch Response body as SSE and call `onData` with each record's data
 * payload (keepalive comments skipped), in order. Resolves when the stream ends;
 * rejects with the reader's error (an AbortError on Stop).
 */
export async function readSSEStream(body: ReadableStream<Uint8Array>, onData: (data: string) => void): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const { records, rest } = extractSSERecords(buffer);
    buffer = rest;
    for (const record of records) {
      const data = parseSSERecordData(record);
      if (data !== null) onData(data);
    }
  }
  buffer += decoder.decode();
  if (buffer.trim()) {
    const data = parseSSERecordData(buffer);
    if (data !== null) onData(data);
  }
}
