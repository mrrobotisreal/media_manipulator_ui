import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface RelatedLink {
  label: string;
  to: string;
  description?: string;
}

interface RelatedLinksProps {
  title?: string;
  intro?: string;
  links: RelatedLink[];
  className?: string;
}

/**
 * Reusable "Related tools and tutorials" card used at the end of blog
 * posts and tutorial pages to surface cross-section internal links.
 *
 * Uses React Router <Link> so SPA navigation does not trigger a full
 * page reload.
 */
const RelatedLinks: React.FC<RelatedLinksProps> = ({
  title = 'Related tools and tutorials',
  intro,
  links,
  className,
}) => {
  if (links.length === 0) return null;
  return (
    <aside
      className={`bg-card border border-border rounded-lg p-6 my-8 ${className ?? ''}`}
      aria-label={title}
    >
      <h2 className="text-xl font-semibold text-card-foreground mb-2">
        {title}
      </h2>
      {intro && <p className="text-sm text-muted-foreground mb-4">{intro}</p>}
      <ul className="grid gap-2 md:grid-cols-2">
        {links.map((link) => (
          <li key={link.to + link.label}>
            <Link
              to={link.to}
              className="group flex items-start gap-3 rounded-md border border-transparent hover:border-border hover:bg-muted/50 p-3 transition-colors"
            >
              <ArrowRight className="w-4 h-4 mt-1 text-blue-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              <span>
                <span className="block font-medium text-card-foreground">
                  {link.label}
                </span>
                {link.description && (
                  <span className="block text-sm text-muted-foreground mt-1">
                    {link.description}
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default RelatedLinks;
