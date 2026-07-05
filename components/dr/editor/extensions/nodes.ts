// Custom Tiptap node extensions for the DR document editor: a `callout` block
// (info/warning, inline content) and the three media nodes (drImage / drVideo /
// drFile) that map 1:1 onto the dr-blocks/v1 media blocks. Node views are React
// components (see ../node-views). No dangerouslySetInnerHTML anywhere — media is
// rendered via <img>/<video>/anchor in the node views, and storage is JSON
// (never HTML), so renderHTML here only affects clipboard/DOM copy.

import { Extension, Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { NODE } from '@/lib/dr/editor/tiptapDoc';
import CalloutNodeView from '../node-views/CalloutNodeView';
import MediaNodeView from '../node-views/MediaNodeView';

// Options shared by the media nodes: the draft id (for presign/complete) and a
// callback the node views use to keep the editor's in-flight-upload counter in
// sync (so autosave/publish defer while an upload is running).
export interface DrMediaNodeOptions {
  docId: string;
  onPendingChange: (delta: number) => void;
}

const defaultMediaOptions: DrMediaNodeOptions = {
  docId: '',
  onPendingChange: () => {},
};

// The Callout block — a textblock with inline content, like a styled paragraph.
export const CalloutNode = Node.create({
  name: NODE.callout,
  group: 'block',
  content: 'inline*',
  defining: true,
  addAttributes() {
    return {
      variant: {
        default: 'info',
        parseHTML: (element) => element.getAttribute('data-variant') ?? 'info',
        renderHTML: (attributes) => ({ 'data-variant': String(attributes.variant ?? 'info') }),
      },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-dr-callout]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-dr-callout': '' }), 0];
  },
  addNodeView() {
    return ReactNodeViewRenderer(CalloutNodeView);
  },
});

export const DrImageNode = Node.create<DrMediaNodeOptions>({
  name: NODE.drImage,
  group: 'block',
  atom: true,
  selectable: true,
  draggable: false,
  addOptions() {
    return { ...defaultMediaOptions };
  },
  addAttributes() {
    return {
      src: { default: '' },
      alt: { default: '' },
      caption: { default: null },
      // Transient (never serialized to HTML): the display URL while editing and
      // the pending-upload hand-off key. tiptapToBlocks ignores both.
      previewUrl: { default: null, rendered: false },
      pendingKey: { default: null, rendered: false },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-dr-image]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-dr-image': '' })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(MediaNodeView);
  },
});

export const DrVideoNode = Node.create<DrMediaNodeOptions>({
  name: NODE.drVideo,
  group: 'block',
  atom: true,
  selectable: true,
  draggable: false,
  addOptions() {
    return { ...defaultMediaOptions };
  },
  addAttributes() {
    return {
      src: { default: '' },
      caption: { default: null },
      previewUrl: { default: null, rendered: false },
      pendingKey: { default: null, rendered: false },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-dr-video]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-dr-video': '' })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(MediaNodeView);
  },
});

export const DrFileNode = Node.create<DrMediaNodeOptions>({
  name: NODE.drFile,
  group: 'block',
  atom: true,
  selectable: true,
  draggable: false,
  addOptions() {
    return { ...defaultMediaOptions };
  },
  addAttributes() {
    return {
      src: { default: '' },
      name: { default: '' },
      sizeBytes: { default: null },
      contentType: { default: null },
      previewUrl: { default: null, rendered: false },
      pendingKey: { default: null, rendered: false },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-dr-file]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-dr-file': '' })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(MediaNodeView);
  },
});

/** The media node kind derived from a node's type name. */
export function mediaKindOf(typeName: string): 'image' | 'video' | 'file' {
  if (typeName === NODE.drVideo) return 'video';
  if (typeName === NODE.drFile) return 'file';
  return 'image';
}

// Keep lists single-level: swallow Tab / Shift-Tab while the selection is inside
// a list item (which would otherwise sink/lift into a nested list). High
// priority so it wins over ListItem's own Tab shortcut; it deliberately does
// nothing outside lists so Table cell navigation (also Tab) is unaffected.
export const NoListNesting = Extension.create({
  name: 'drNoListNesting',
  priority: 1000,
  addKeyboardShortcuts() {
    const block = () => this.editor.isActive('listItem');
    return {
      Tab: () => block(),
      'Shift-Tab': () => block(),
    };
  },
});
