import { llmsIndexMarkdown } from '@/lib/llmsTxt';

// Built once at build time from the tool and page data (see lib/llmsTxt.ts).
export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsIndexMarkdown(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
