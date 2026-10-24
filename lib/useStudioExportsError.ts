/**
 * Pull a human message out of a failed studio response. The API answers
 * {"error": "..."}; a gateway page or empty body falls back to the status text.
 */
export async function extractFetchError(res: Response): Promise<string> {
  const text = await res.text().catch(() => '');
  if (!text) return res.statusText || `HTTP ${res.status}`;
  try {
    const j = JSON.parse(text) as { error?: unknown; message?: unknown };
    if (typeof j.message === 'string' && j.message) return j.message;
    if (typeof j.error === 'string' && j.error) return j.error;
  } catch {
    /* not JSON */
  }
  return text.slice(0, 300);
}
