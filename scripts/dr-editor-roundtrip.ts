// Checkpoint 2 — DR editor converter round-trip.
//
// Loads the seeded "Backend & AI Infrastructure" document, runs it through
// blocksToTiptap → tiptapToBlocks, and asserts the result deep-equals the
// original (including regenerated heading ids). This is pure computation — no
// server, no network — and must pass before the editor is trusted to serialize
// documents. Run with: npm run dr:roundtrip
//
// It also parses the round-tripped content with the authoritative Zod schema so
// a converter bug that produces structurally-invalid content fails loudly.

import assert from 'node:assert';
import { blocksToTiptap } from '@/lib/dr/editor/blocksToTiptap';
import { tiptapToBlocks } from '@/lib/dr/editor/tiptapToBlocks';
import { BACKEND_AI_INFRA_DOC } from '@/content/dr-docs/backend-ai-infrastructure';
import { DrDocContentSchema, type DrDocContent } from '@/schemas/drDocs';

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

// Report the first structural difference (path + values) for a readable failure.
function findFirstDiff(a: unknown, b: unknown, path = '$'): string | null {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return `${path}: array length ${a.length} (original) !== ${b.length} (round-trip)`;
    for (let i = 0; i < a.length; i++) {
      const d = findFirstDiff(a[i], b[i], `${path}[${i}]`);
      if (d) return d;
    }
    return null;
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      if (!(k in a)) return `${path}.${k}: key present only in round-trip (= ${JSON.stringify(b[k])})`;
      if (!(k in b)) return `${path}.${k}: key present only in original (= ${JSON.stringify(a[k])})`;
      const d = findFirstDiff(a[k], b[k], `${path}.${k}`);
      if (d) return d;
    }
    return null;
  }
  if (a !== b) return `${path}: ${JSON.stringify(a)} (original) !== ${JSON.stringify(b)} (round-trip)`;
  return null;
}

function main(): void {
  const original: DrDocContent = BACKEND_AI_INFRA_DOC;
  const roundTripped = tiptapToBlocks(blocksToTiptap(original));

  // The round-tripped content must itself be schema-valid.
  const parsed = DrDocContentSchema.safeParse(roundTripped);
  if (!parsed.success) {
    console.error('✗ dr-editor round-trip: result failed schema validation:');
    console.error(JSON.stringify(parsed.error.issues, null, 2));
    process.exit(1);
  }

  const diff = findFirstDiff(original, roundTripped);
  if (diff) {
    console.error('✗ dr-editor round-trip: first mismatch —');
    console.error('  ' + diff);
    process.exit(1);
  }

  // Backstop: deepStrictEqual (order-independent for object keys).
  try {
    assert.deepStrictEqual(roundTripped, original);
  } catch (err) {
    console.error('✗ dr-editor round-trip: deepStrictEqual failed —');
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  const headings = original.blocks.filter((b) => b.type === 'heading').length;
  console.log(
    `✓ dr-editor round-trip: seeded document round-trips exactly ` +
      `(${original.blocks.length} blocks, ${headings} headings, ids regenerated).`,
  );
}

main();
