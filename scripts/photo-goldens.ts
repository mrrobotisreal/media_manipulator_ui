/**
 * `npm run photo:goldens`: render every golden doc over the three fixture
 * images with the TypeScript reference (`lib/photo/colorMath.ts`) and write
 * `lib/photo/fixtures/goldens/<doc>.<image>.png` plus the extra golden docs.
 * Prints a manifest. A formula change must regenerate these deliberately
 * (`lib/photo/goldens.test.ts` fails otherwise).
 */
import { createHash } from 'node:crypto';
import { PNG } from 'pngjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import {
  EXTRA_DOC_LAYERS,
  EXTRA_FULL_DOCS,
  GEOMETRY_BORDER_PX,
  NEW_SHARED_DOCS,
  buildFullDoc,
  FIXTURES_ROOT,
  GOLDEN_IMAGES,
  buildExtraDoc,
  canonicalPhotoDoc,
  goldenDocPath,
  goldenDocs,
  goldenPath,
  renderGolden,
} from '../lib/photo/goldens';

for (const [name, layers] of Object.entries(EXTRA_DOC_LAYERS)) {
  const p = goldenDocPath(name);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, `${canonicalPhotoDoc(buildExtraDoc(layers))}\n`);
}

for (const [name, body] of Object.entries(EXTRA_FULL_DOCS)) {
  const p = goldenDocPath(name);
  writeFileSync(p, `${canonicalPhotoDoc(buildFullDoc(body()))}\n`);
}
for (const [name, body] of Object.entries(NEW_SHARED_DOCS)) {
  const b = body();
  writeFileSync(join(FIXTURES_ROOT, 'docs', `${name}.json`), `${canonicalPhotoDoc(buildFullDoc(b, b.source as { width: number; height: number }))}\n`);
}

mkdirSync(dirname(goldenPath('x', 'y')), { recursive: true });
const manifest: Record<string, unknown> = {};
let n = 0;
for (const { name, doc } of goldenDocs()) {
  for (const image of GOLDEN_IMAGES) {
    const buf = renderGolden(doc, image);
    writeFileSync(goldenPath(name, image), buf);
    const size = PNG.sync.read(buf);
    manifest[`${name}.${image}`] = { width: size.width, height: size.height, borderPx: GEOMETRY_BORDER_PX[name] ?? 0 };
    console.log(`${name}.${image}.png  ${buf.length}  sha256:${createHash('sha256').update(buf).digest('hex').slice(0, 12)}`);
    n += 1;
  }
}
writeFileSync(join(FIXTURES_ROOT, 'golden-manifest.json'), `${JSON.stringify(manifest, null, 1)}\n`);
console.log(`${n} goldens`);
