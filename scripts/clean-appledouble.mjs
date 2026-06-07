#!/usr/bin/env node
/**
 * Recursively delete macOS metadata artifacts (.DS_Store and ._* AppleDouble
 * files) from the repo, skipping node_modules, .next, and .git.
 *
 * Run: npm run clean:macos-artifacts
 */
import { readdirSync, statSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'out']);
let removed = 0;

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || entry.name === '.AppleDouble') {
        if (entry.name === '.AppleDouble') {
          rmSync(full, { recursive: true, force: true });
          removed++;
          console.log('removed dir  ', full);
        }
        continue;
      }
      walk(full);
    } else if (entry.name === '.DS_Store' || entry.name.startsWith('._')) {
      try {
        statSync(full);
        rmSync(full, { force: true });
        removed++;
        console.log('removed file ', full);
      } catch {
        // already gone
      }
    }
  }
}

walk(process.cwd());
console.log(
  removed === 0
    ? 'No macOS artifacts found.'
    : `Removed ${removed} macOS artifact(s).`,
);
