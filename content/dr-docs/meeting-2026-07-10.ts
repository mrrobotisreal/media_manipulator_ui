import type { DrDocContent } from '@/schemas/drDocs';

// Static TSX-equivalent of the "2026-07-10 Meeting" notes — the single source
// of truth for the seed shipped in the media_manipulator_api migration
// 20260712002_seed_2026_07_10_meeting_doc. Author changes HERE, then
// regenerate the migration's JSON so the two stay byte-for-byte identical
// (see scripts/dr-editor-roundtrip.ts / the runbook). The block contract is
// schemas/drDocs.ts.
//
// A short living document: no Table of Contents. Heading `id`s come from the
// SAME slugifier as lib/dr/editor/tiptapToBlocks.ts ('|' is dropped, spaces
// become dashes). Sections are block level 1 (→ h2 in the renderer),
// mirroring the other canonical docs.
//
// Structural notes:
//   - dr-blocks lists are FLAT (no nesting), so the markdown's nested "Note:"/
//     "E.g." sub-bullets are flattened into sibling items in order — they
//     already self-identify with their prefixes.
//   - dr-blocks has no task/checkbox list type, so the Action Items entry is
//     an unordered list item prefixed "☐ " (it's a living doc — items get
//     edited in the portal).

export const MEETING_2026_07_10_SLUG = '2026-07-10-meeting';

export const MEETING_2026_07_10_DOC: DrDocContent = {
  format: 'dr-blocks/v1',
  blocks: [
    // ---- Topics For Discussion --------------------------------------------
    { type: 'heading', level: 1, text: 'Topics For Discussion', id: 'topics-for-discussion' },
    {
      type: 'list',
      ordered: false,
      items: [
        [
          { text: 'I need access to the Double Raven website and especially the DR/ODIN app tool itself so I can begin getting familiar with everything and start creating and testing the APIs' },
        ],
        [
          { text: "Note: for the DR/ODIN tool in particular I'm going to need my own account that I can use for testing so that I don't screw up any real accounts or data with testing data" },
        ],
        [
          { text: "Note: for the DR website itself I just need to know how exactly you'd like it to be laid out, anything to be added or removed, and especially all of the copy (text) and resources and links" },
        ],
        [
          { text: 'Note: I need to know who is/where you\'re managing your domain and DNS, because I need to (or you can do it for me if you\'d rather do it that way, that\'s fine too) make sure some CNAME records get added to your DNS. Specifically I need to create an "api" CNAME record that I can point at and connect to the Cloudflare tunnel I have set up to my server so that we can use https://api.doubleraven.net as the base API url for all API calls and ensure it\'s encrypted with TLS/SSL and only accessible via access to the Cloudflare tunnel.' },
        ],
        [
          { text: "If going this route with using OpenRouter so we can use the right models for the right jobs (which I'm highly recommending), then we need to figure out the financial structure and marketing of how exactly this is going to work when departments/detectives begin actually using it." },
        ],
        [
          { text: 'E.g. do they pay up front to top-up how many credits they have for usage? Or do we handle that for them and then bill them? etc…' },
        ],
      ],
    },

    // ---- Questions ---------------------------------------------------------
    { type: 'heading', level: 1, text: 'Questions', id: 'questions' },
    {
      type: 'list',
      ordered: false,
      items: [[{ text: 'Question 1' }]],
    },
    { type: 'divider' },

    // ---- Action Items ------------------------------------------------------
    { type: 'heading', level: 1, text: 'Action Items', id: 'action-items' },
    {
      type: 'list',
      ordered: false,
      items: [[{ text: '☐ Item 1' }]],
    },
    { type: 'divider' },

    // ---- References | Resources | Links ------------------------------------
    { type: 'heading', level: 1, text: 'References | Resources | Links', id: 'references-resources-links' },
    {
      type: 'list',
      ordered: false,
      items: [
        [{ text: 'Double Raven x Media Manipulator portal', link: 'https://www.media-manipulator.com/dr/auth' }],
      ],
    },
  ],
};
