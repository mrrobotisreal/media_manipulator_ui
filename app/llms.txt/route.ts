import { llmsIndexMarkdown } from '@/lib/llmsTxt';
import { isTranslatorEnv } from '@/lib/translator/mode';

// Built once at build time from the tool and page data (see lib/llmsTxt.ts).
export const dynamic = 'force-static';

export function GET() {
  // MM52: translator deployments do not publish the LLM index.
  if (isTranslatorEnv()) return new Response('Not found', { status: 404 });
  return new Response(llmsIndexMarkdown(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
