import React from 'react';

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * A server-rendered question-and-answer list for the long-form public pages
 * (/how-it-works, /voices, /tutorials, /tutorials/medi). Plain headings and
 * paragraphs so the text is in the prerendered HTML for crawlers and readers.
 */
export const PageFaq: React.FC<{ title: string; items: FaqItem[]; headingClassName?: string; id?: string }> = ({
  title,
  items,
  headingClassName = 'text-2xl font-semibold mb-4 text-card-foreground',
  id,
}) => (
  <section aria-labelledby={id} data-testid="page-faq">
    <h2 id={id} className={headingClassName}>
      {title}
    </h2>
    <dl className="space-y-4">
      {items.map((item) => (
        <div key={item.q}>
          <dt className="font-semibold text-card-foreground">{item.q}</dt>
          <dd className="mt-1 text-muted-foreground">{item.a}</dd>
        </div>
      ))}
    </dl>
  </section>
);

export default PageFaq;
