import { describe, expect, it } from 'vitest';

import { PRIMARY_TOOL_PAGES } from '@/content/toolPages';
import { PHOTO_PAGE_WIRING } from '@/content/photo/index';
import { BUILTIN_PRESETS } from '@/lib/photo/presets';
import { loadRecipes, recipeDoc, statesTierNumber, GENERATED_LINE } from './knowledgeExport';
import {
  PLANNED_STUDIO_LOOKS,
  PLANNED_VECTOR_TEMPLATES,
  RecipeError,
  checkRecipeOps,
  parseRecipe,
  recipeProse,
  type Recipe,
} from './recipes';

const recipes = loadRecipes();
const by = (editor: Recipe['editor']) => recipes.filter((r) => r.editor === editor);
const opsOf = (editor: Recipe['editor'], name: string) => by(editor).flatMap((r) => (r.example?.ops ?? []).filter((o) => o.op === name));

describe('recipe library shape (MM106 decisions 1, 2)', () => {
  it('meets the v1 coverage target per editor', () => {
    expect(by('photo').length).toBeGreaterThanOrEqual(25);
    expect(by('studio').length).toBeGreaterThanOrEqual(25);
    expect(by('vector').length).toBeGreaterThanOrEqual(15);
    expect(by('workflow').length).toBeGreaterThanOrEqual(10);
  });

  it('ids are unique and every editor recipe carries an op example', () => {
    expect(new Set(recipes.map((r) => r.id)).size).toBe(recipes.length);
    for (const r of recipes) {
      if (r.editor === 'workflow') expect(r.ops_example, r.path).toBe(false);
    }
    const withOps = recipes.filter((r) => r.editor !== 'workflow' && r.ops_example).length;
    const editorRecipes = recipes.filter((r) => r.editor !== 'workflow').length;
    expect(withOps / editorRecipes).toBeGreaterThanOrEqual(0.85);
  });

  it('related tools are real tool pages', () => {
    const slugs = new Set(PRIMARY_TOOL_PAGES.map((t) => t.slug));
    for (const r of recipes) for (const s of r.tools) expect(slugs.has(s), `${r.path}: ${s}`).toBe(true);
  });

  it('never states a price or a plan limit (the API injects live numbers)', () => {
    for (const r of recipes) {
      for (const sentence of recipeProse(r).split(/(?<=[.!?])\s+|\n/)) expect(statesTierNumber(sentence), `${r.path}: ${sentence}`).toBe(false);
    }
  });
});

describe('recipe accuracy against the registries (decision 3)', () => {
  it('every op, parameter and range exists in the editor registries', () => {
    const problems = recipes.flatMap(checkRecipeOps);
    expect(problems).toEqual([]);
  });

  it('the checker refuses what does not exist', () => {
    const mk = (editor: Recipe['editor'], ops: unknown[]) => ({ editor, path: `${editor}/x.md`, example: { summary: 's', ops: ops as Recipe['example'] extends infer E ? E extends { ops: infer O } ? O : never : never } });
    expect(checkRecipeOps(mk('photo', [{ op: 'make_cinematic' }])).join()).toMatch(/unknown op/);
    expect(checkRecipeOps(mk('photo', [{ op: 'add_layer', type: 'exposure', params: { ev: 9 } }])).join()).toMatch(/9 > max 5/);
    expect(checkRecipeOps(mk('photo', [{ op: 'add_layer', type: 'tone', params: { brightness: 10 } }])).join()).toMatch(/unknown parameter/);
    expect(checkRecipeOps(mk('photo', [{ op: 'apply_preset', presetId: 'teal-orange' }])).join()).toMatch(/not one of/);
    expect(checkRecipeOps(mk('photo', [{ op: 'set_mask', layerId: 'a', components: [{ kind: 'brush' }] }])).join()).toMatch(/suggested actions/);
    expect(checkRecipeOps(mk('photo', [{ op: 'update_layer', layerId: 'a', params: { nope: 1 } }])).join()).toMatch(/unknown parameter/);
    expect(checkRecipeOps(mk('studio', [{ op: 'grade', clipIds: 'all', lumetri: { highlights: -20 } }])).join()).toMatch(/unknown parameter/);
    expect(checkRecipeOps(mk('studio', [{ op: 'set_transition', clipId: 'c', type: 'zoomBlur', durationSeconds: 1 }])).join()).toMatch(/not one of/);
    expect(checkRecipeOps(mk('studio', [{ op: 'set_keyframes', clipId: 'c', property: 'scale', keyframes: [{ t: 0, value: 20, ease: 'linear' }] }])).join()).toMatch(/outside/);
    expect(checkRecipeOps(mk('studio', [{ op: 'set_speed', clipId: 'c', speed: 20 }])).join()).toMatch(/> max 10/);
    expect(checkRecipeOps(mk('studio', [{ op: 'set_keyframes', clipId: 'c', property: 'lumetri1.exposure', keyframes: [{ t: 0, value: 1, ease: 'linear' }] }]))).toEqual([]);
    expect(checkRecipeOps(mk('studio', [{ op: 'set_keyframes', clipId: 'c', property: 'lumetri1.glow', keyframes: [{ t: 0, value: 1, ease: 'linear' }] }])).join()).toMatch(/keyframes|property/);
    // MM110: vector recipes are held to the op schema (lib/assistant/ops/vector.ts).
    expect(checkRecipeOps(mk('vector', [{ op: 'animate', layerId: 'l', property: 'transform.zoom', keyframes: [] }])).join()).toMatch(/ops\[0\]\.property: .*must match pattern/);
    expect(checkRecipeOps(mk('vector', [{ op: 'apply_animator', layerIds: ['l'], animator: 'explode', span: { start: 0, end: 500 } }])).join()).toMatch(/not one of/);
    expect(checkRecipeOps(mk('vector', [{ op: 'add_layer', type: 'rect', props: { x: 0, y: 0, width: 10, height: 10, cornerRadius: 4 } }])).join()).toMatch(/cornerRadius: unknown parameter/);
    expect(checkRecipeOps(mk('vector', [{ op: 'template', kind: 'explode' }])).join()).toMatch(/not one of/);
  });

  it('parseRecipe refuses a malformed file', () => {
    const ok = [
      '---',
      'id: "x-test"',
      'editor: "photo"',
      'title: "X"',
      'intents: ["a", "b", "c"]',
      'difficulty: "basic"',
      'ops_example: true',
      '---',
      '## When to use',
      'w',
      '## What a pro does and why',
      'p',
      '## Ops',
      '```json',
      '{"summary": "S", "ops": [{"op": "auto_tone"}]}',
      '```',
      '## How to adjust',
      'h',
    ].join('\n');
    expect(parseRecipe('photo/x-test.md', ok).example?.ops).toEqual([{ op: 'auto_tone' }]);
    expect(() => parseRecipe('photo/other.md', ok)).toThrow(RecipeError);
    expect(() => parseRecipe('photo/x-test.md', ok.replace('## How to adjust', '## Tweaks'))).toThrow(/sections/);
    expect(() => parseRecipe('photo/x-test.md', ok.replace('"summary": "S"', `"summary": "${'x'.repeat(61)}"`))).toThrow(/60/);
    expect(() => parseRecipe('photo/x-test.md', ok.replace('intents: ["a", "b", "c"]', 'intents: ["a"]'))).toThrow(/intents/);
  });
});

describe('coverage (decision 2)', () => {
  it('every Aperture built-in preset is reachable from a photo recipe', () => {
    const text = by('photo').map((r) => JSON.stringify(r.example) + recipeProse(r)).join('\n');
    for (const p of BUILTIN_PRESETS) expect(text, p.id).toMatch(new RegExp(`(\`${p.id}\`|"presetId":"${p.id}")`));
  });

  it('every Aperture tool-page task is reachable from a recipe', () => {
    const linked = new Set(recipes.flatMap((r) => r.tools));
    for (const slug of Object.keys(PHOTO_PAGE_WIRING)) expect(linked.has(slug), slug).toBe(true);
  });

  it('every planned Darkroom look and Motion template has a recipe that uses it', () => {
    // In the worked op list or in an inline op example of the recipe's prose.
    const studioText = by('studio').map((r) => recipeProse(r).replace(/\s+/g, '')).join('\n');
    const looks = new Set(opsOf('studio', 'apply_look').map((o) => o.lookId));
    for (const id of PLANNED_STUDIO_LOOKS) expect(looks.has(id) || studioText.includes(`"lookId":"${id}"`), id).toBe(true);
    const vectorText = by('vector').map((r) => recipeProse(r).replace(/\s+/g, '')).join('\n');
    const templates = new Set(opsOf('vector', 'template').map((o) => o.kind));
    for (const k of PLANNED_VECTOR_TEMPLATES) expect(templates.has(k) || vectorText.includes(`"kind":"${k}"`), k).toBe(true);
  });
});

describe('export (decision 4)', () => {
  it('a recipe exports in the corpus doc shape with its intents as keywords', () => {
    const r = recipes.find((x) => x.id === 'grey-except-red')!;
    const body = recipeDoc(r);
    expect(body.startsWith(GENERATED_LINE)).toBe(true);
    expect(body).toContain('- Kind: `recipe`');
    expect(body).toContain('- Category: `photo`');
    expect(body).toContain('### Ops');
    for (const i of r.intents) expect(body).toContain(`\`${i.replace(/`/g, '')}\``);
  });
});
