import type { DrDocContent } from '@/schemas/drDocs';

// Test / dev FIXTURE — NOT seeded content. It exists so the media
// (block-anchor) comment path and the blockPlainText offset math for
// table/list/blockquote blocks are real and unit-testable. The seeded
// "Backend & AI Infrastructure" document has no media blocks. To exercise the
// media-comment UI manually, seed a document row whose `content` is this object.
export const MEDIA_FIXTURE_DOC: DrDocContent = {
  format: 'dr-blocks/v1',
  blocks: [
    { type: 'heading', level: 1, text: 'Media Fixture', id: 'media-fixture' },
    {
      type: 'paragraph',
      spans: [
        { text: 'A paragraph with ' },
        { text: 'bold', bold: true },
        { text: ' text for text-anchor tests.' },
      ],
    },
    {
      type: 'image',
      src: 'https://example.com/sample.png',
      alt: 'Sample image',
      caption: 'A sample image block — right-click to comment.',
    },
    {
      type: 'table',
      headerRow: true,
      rows: [
        [[{ text: 'Key' }], [{ text: 'Value' }]],
        [[{ text: 'Alpha' }], [{ text: 'One' }]],
        [[{ text: 'Beta' }], [{ text: 'Two' }]],
      ],
    },
    {
      type: 'list',
      ordered: false,
      items: [[{ text: 'First item' }], [{ text: 'Second item' }]],
    },
  ],
};
