/**
 * MM47 acceptance 7: the /licenses page renders every dependency from
 * `content/licenses.ts` with its licence name and links; mediabunny's
 * MPL-2.0 entry exists, is unmodified, and carries the Exhibit A notice.
 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { LICENSES, MPL_EXHIBIT_A } from '@/content/licenses';

import LicensesPage from './licenses';

describe('/licenses page', () => {
  const html = renderToStaticMarkup(<LicensesPage locale="en-US" />);

  it('lists every dependency from the data file with licence name, licence link and source link', () => {
    expect(LICENSES.length).toBeGreaterThanOrEqual(3);
    for (const l of LICENSES) {
      expect(html).toContain(`id="${l.name}"`);
      expect(html).toContain(`data-license="${l.license}"`);
      expect(html).toContain(`href="${l.licenseUrl}"`);
      expect(html).toContain(`href="${l.source}"`);
      expect(html).toContain(l.version);
      expect(html).toContain(l.copyright);
    }
  });

  it("mediabunny's MPL-2.0 entry exists, unmodified, with its source link and the MPL notice", () => {
    const mb = LICENSES.find((l) => l.name === 'mediabunny');
    expect(mb).toMatchObject({ license: 'MPL-2.0', modified: false, source: 'https://github.com/Vanilagy/mediabunny', licenseUrl: 'https://mozilla.org/MPL/2.0/', notice: MPL_EXHIBIT_A });
    expect(html).toContain('Used unmodified');
    expect(html).toContain('https://mozilla.org/MPL/2.0/');
  });

  it('renders localized chrome', () => {
    expect(html).toContain('Open-source licences');
    expect(renderToStaticMarkup(<LicensesPage locale="de-DE" />)).toContain('id="mediabunny"');
  });
});
