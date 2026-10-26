/**
 * MM54 — POST /api/translator/submit[?dryRun=1]: opens the translation pull request.
 *
 * Translator deployments only. In every other build (production included) the
 * literal role check below folds to `false`, the `import()` is dropped, and the
 * route answers 404 without bundling `jose`, `@octokit/*` or any
 * `lib/translator` server code (`npm run check:no-translator` proves it).
 * Contract and logic: `lib/translator/server/handlers.ts`.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NOT_FOUND_HEADERS = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8' };

export async function POST(request: Request): Promise<Response> {
  if (process.env.NEXT_PUBLIC_DEPLOY_ROLE === 'translator') {
    const { routeSubmit } = await import('@/lib/translator/server/routes');
    return routeSubmit(request);
  }
  return new Response('{"error":"not_found"}', { status: 404, headers: NOT_FOUND_HEADERS });
}
