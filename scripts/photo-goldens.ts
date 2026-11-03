/**
 * `npm run photo:goldens`: render every golden doc over the three fixture
 * images with the TypeScript reference (`lib/photo/colorMath.ts`) and write
 * `lib/photo/fixtures/goldens/<doc>.<image>.png` plus the extra golden docs.
 * Prints a manifest. A formula change must regenerate these deliberately
 * (`lib/photo/goldens.test.ts` fails otherwise).
 */
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import {
  EXTRA_DOC_LAYERS,
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

mkdirSync(dirname(goldenPath('x', 'y')), { recursive: true });
let n = 0;
for (const { name, doc } of goldenDocs()) {
  for (const image of GOLDEN_IMAGES) {
    const buf = renderGolden(doc, image);
    writeFileSync(goldenPath(name, image), buf);
    console.log(`${name}.${image}.png  ${buf.length}  sha256:${createHash('sha256').update(buf).digest('hex').slice(0, 12)}`);
    n += 1;
  }
}
console.log(`${n} goldens`);
