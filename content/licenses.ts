/**
 * Third-party code that Media Manipulator ships to users or embeds in files
 * they export, with its licence and the notice we must preserve. Rendered by
 * the `/licenses` page (MM47, `views/licenses.tsx`); MM45 created this file.
 *
 * Add an entry whenever a dependency's code reaches the browser bundle in a
 * way that needs attribution, or is copied into an export. Versions must match
 * the exact pins in `package.json` (`lib/vector/licenseGuard.test.ts`).
 *
 * Not listed because they are not dependencies: `svg-path-commander` and
 * `flubber` (MM45 wrote path geometry and morphing in-house), `gifenc` and
 * `modern-gif` (MM47 wrote the GIF encoder in-house).
 */
export interface LicenseEntry {
  /** npm package name. */
  name: string;
  /** Exact pinned version (package.json). */
  version: string;
  /** SPDX identifier. */
  license: 'MIT' | 'MPL-2.0' | 'Apache-2.0' | 'BSD-3-Clause' | 'ISC';
  /** Copyright line exactly as in the package's licence file or source headers. */
  copyright: string;
  homepage: string;
  /** Public source repository. */
  source: string;
  /** Canonical licence text. */
  licenseUrl: string;
  /** Where the code is used (plain description for the page; English by decision). */
  usedFor: string;
  /** Copied into user exports (the exporter writes the notice into the file). */
  embeddedInExports: boolean;
  /** We never modify the package's files (MPL-2.0 file-level copyleft: mediabunny). */
  modified: false;
  /** A licence notice the licence asks us to show (MPL-2.0 Exhibit A), verbatim. */
  notice?: string;
}

const MIT_URL = 'https://opensource.org/license/mit';

export const MPL_EXHIBIT_A =
  'This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.';

export const LICENSES: readonly LicenseEntry[] = [
  {
    name: 'mediabunny',
    version: '1.61.3',
    license: 'MPL-2.0',
    copyright: 'Copyright (c) 2026-present, Vanilagy and contributors',
    homepage: 'https://mediabunny.dev/',
    source: 'https://github.com/Vanilagy/mediabunny',
    licenseUrl: 'https://mozilla.org/MPL/2.0/',
    usedFor: 'Motion: writes the MP4 and WebM files of video exports in your browser (muxing the frames your browser encodes).',
    embeddedInExports: false,
    modified: false,
    notice: MPL_EXHIBIT_A,
  },
  {
    name: 'animejs',
    version: '4.5.0',
    license: 'MIT',
    copyright: 'Copyright (c) 2025 Julian Garnier',
    homepage: 'https://animejs.com',
    source: 'https://github.com/juliangarnier/anime',
    licenseUrl: MIT_URL,
    usedFor: 'Motion: the animation runtime inlined into animated SVG exports that CSS cannot express (shape morph, gradient stop positions, blur).',
    embeddedInExports: true,
    modified: false,
  },
  {
    name: 'fflate',
    version: '0.8.3',
    license: 'MIT',
    copyright: 'Copyright (c) 2026 Arjun Barrett',
    homepage: 'https://101arrowz.github.io/fflate',
    source: 'https://github.com/101arrowz/fflate',
    licenseUrl: MIT_URL,
    usedFor: 'Zip archives: Motion PNG sequence exports and listing the contents of archive results.',
    embeddedInExports: false,
    modified: false,
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
