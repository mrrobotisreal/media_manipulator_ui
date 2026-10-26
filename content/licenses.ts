/**
 * Third-party code that Media Manipulator ships to users or embeds in files
 * they export, with its licence and the notice we must preserve. DATA ONLY:
 * the `/licenses` page that renders it arrives with MM47 (mediabunny
 * attribution); MM45 created this file (ticket MM45 decision 13).
 *
 * Add an entry whenever a dependency's code reaches the browser bundle in a
 * way that needs attribution, or is copied into an export. Versions must match
 * the exact pins in `package.json` (`lib/vector/licenseGuard.test.ts`).
 */
export interface LicenseEntry {
  /** npm package name. */
  name: string;
  /** Exact pinned version (package.json). */
  version: string;
  /** SPDX identifier. */
  license: 'MIT' | 'MPL-2.0' | 'Apache-2.0' | 'BSD-3-Clause' | 'ISC';
  /** Copyright line exactly as in the package's licence file. */
  copyright: string;
  homepage: string;
  /** Where the code is used (plain description for the page). */
  usedFor: string;
  /** Copied into user exports (the exporter writes the notice into the file). */
  embeddedInExports: boolean;
}

export const LICENSES: readonly LicenseEntry[] = [
  {
    name: 'animejs',
    version: '4.5.0',
    license: 'MIT',
    copyright: 'Copyright (c) 2025 Julian Garnier',
    homepage: 'https://animejs.com',
    usedFor: 'Motion: the animation runtime inlined into animated SVG exports that CSS cannot express (shape morph, gradient stop positions, blur).',
    embeddedInExports: true,
  },
  // MM54: server-side only, and only on translator deployments (`app/api/translator/*`
  // behind the role guard; `npm run check:no-translator` proves production builds hold
  // none of it). Listed so the pins and notices are tracked in one place.
  {
    name: 'jose',
    version: '6.2.12',
    license: 'MIT',
    copyright: 'Copyright (c) 2018 Filip Skokan',
    homepage: 'https://github.com/panva/jose',
    usedFor: 'Translator workbench (translator deployments only, server side): verifying Firebase sign-in tokens.',
    embeddedInExports: false,
  },
  {
    name: '@octokit/auth-app',
    version: '8.3.1',
    license: 'MIT',
    copyright: 'Copyright (c) 2019 Octokit contributors',
    homepage: 'https://github.com/octokit/auth-app.js',
    usedFor: 'Translator workbench (translator deployments only, server side): GitHub App installation tokens.',
    embeddedInExports: false,
  },
  {
    name: '@octokit/rest',
    version: '22.0.1',
    license: 'MIT',
    copyright: 'Copyright (c) 2012 Cloud9 IDE, Inc. (Mike de Boer)\nCopyright (c) 2017-2018 Octokit contributors',
    homepage: 'https://github.com/octokit/rest.js',
    usedFor: 'Translator workbench (translator deployments only, server side): opening translation pull requests.',
    embeddedInExports: false,
  },
];
